import {
  createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import {
  Attendee, Booking, BookingStatus, EventItem, Ticket, TicketType,
} from '../events/types'
import { seedAttendees, seedBookings, seedEvents } from '../events/mockEvents'

const EKEY = 'iica_events_v1'
const BKEY = 'iica_bookings_v1'
const AKEY = 'iica_attendees_v1'
const DKEY = 'iica_event_draft_v1'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    /* ignore */
  }
  return fallback
}

const rid = (p: string) => p + Math.random().toString(36).slice(2, 9)

export interface RegisterInput {
  name: string
  email: string
  phone?: string
  attendees: number
  attendeeNames: string[]
  note?: string
}

export interface PurchaseSelection {
  ticketTypeId: string
  ticketTypeName: string
  qty: number
  unitPrice: number
}

interface Ctx {
  events: EventItem[]
  bookings: Booking[]
  attendees: Attendee[]
  draft: Partial<EventItem>
  getEvent: (id?: string) => EventItem | undefined
  bookingFor: (eventId: string) => Booking | undefined
  /** Logical entry point of the Event Builder flow (where step-0 Back / Save Draft return to). */
  flowOrigin: string
  setFlowOrigin: (from?: string) => void
  saveDraft: (patch: Partial<EventItem>) => void
  resetDraft: () => void
  loadDraftFrom: (ev: EventItem) => void
  publishDraft: (organiser: { id: string; name: string; avatar?: string }) => EventItem
  registerFree: (eventId: string, input: RegisterInput) => Booking
  purchase: (eventId: string, selections: PurchaseSelection[], buyer: { name: string; email: string }, amount: number) => Booking
  cancelBooking: (bookingId: string) => void
  requestRefund: (bookingId: string) => void
  attendeesFor: (eventId: string) => Attendee[]
  setAttendee: (id: string, patch: Partial<Attendee>) => void
  cancelEvent: (eventId: string) => void
}

const EventsContext = createContext<Ctx | null>(null)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(() => load(EKEY, seedEvents))
  const [bookings, setBookings] = useState<Booking[]>(() => load(BKEY, seedBookings))
  const [attendees, setAttendees] = useState<Attendee[]>(() => load(AKEY, seedAttendees))
  const [draft, setDraft] = useState<Partial<EventItem>>(() => load(DKEY, {}))
  const [flowOrigin, setFlowOriginState] = useState('/home')

  // Only accept a known origin; ignore missing/invalid so the value survives
  // step-to-step navigation (which carries no route state). Fallback stays /home.
  const setFlowOrigin = useCallback((from?: string) => {
    const ALLOWED = ['/home', '/creator/events', '/portfolio/setup', '/profile']
    if (from && ALLOWED.includes(from)) setFlowOriginState(from)
  }, [])

  useEffect(() => { try { localStorage.setItem(EKEY, JSON.stringify(events)) } catch { /* */ } }, [events])
  useEffect(() => { try { localStorage.setItem(BKEY, JSON.stringify(bookings)) } catch { /* */ } }, [bookings])
  useEffect(() => { try { localStorage.setItem(AKEY, JSON.stringify(attendees)) } catch { /* */ } }, [attendees])
  useEffect(() => { try { localStorage.setItem(DKEY, JSON.stringify(draft)) } catch { /* */ } }, [draft])

  const getEvent = useCallback((id?: string) => events.find((e) => e.id === id), [events])
  const bookingFor = useCallback((eventId: string) => bookings.find((b) => b.eventId === eventId && b.status !== 'Cancelled'), [bookings])
  const attendeesFor = useCallback((eventId: string) => attendees.filter((a) => a.eventId === eventId), [attendees])

  const saveDraft = useCallback((patch: Partial<EventItem>) => setDraft((d) => ({ ...d, ...patch })), [])
  const resetDraft = useCallback(() => setDraft({}), [])
  const loadDraftFrom = useCallback((ev: EventItem) => setDraft({ ...ev }), [])

  const publishDraft = useCallback(
    (organiser: { id: string; name: string; avatar?: string }): EventItem => {
      const id = draft.id ?? rid('ev-')
      const ev: EventItem = {
        id,
        title: draft.title ?? 'Untitled Event',
        category: draft.category ?? 'Others',
        customCategory: draft.customCategory,
        summary: draft.summary ?? '',
        description: draft.description ?? '',
        format: draft.format ?? 'In person',
        language: draft.language,
        audience: draft.audience,
        tags: draft.tags ?? [],
        performers: draft.performers ?? [],
        expect: draft.expect ?? '',
        startDate: draft.startDate ?? '', startTime: draft.startTime ?? '',
        endDate: draft.endDate ?? '', endTime: draft.endTime ?? '',
        timezone: draft.timezone ?? 'IST (GMT+5:30)',
        multiDay: draft.multiDay ?? false, recurring: draft.recurring ?? false,
        regClose: draft.regClose ?? '', doorTime: draft.doorTime ?? '',
        schedule: draft.schedule ?? [],
        venueName: draft.venueName, address: draft.address, city: draft.city,
        state: draft.state, country: draft.country, postal: draft.postal,
        venueInstructions: draft.venueInstructions, accessibility: draft.accessibility, parking: draft.parking,
        online: draft.online,
        paid: draft.paid ?? false,
        tickets: draft.tickets ?? [],
        capacity: draft.capacity ?? 0,
        waitlist: draft.waitlist ?? false,
        approvalRequired: draft.approvalRequired ?? false,
        maxPerPerson: draft.maxPerPerson ?? 4,
        refundPolicy: draft.refundPolicy ?? '',
        cover: draft.cover ?? '',
        images: draft.images ?? [],
        promoVideo: draft.promoVideo, accent: draft.accent, featuredRequest: draft.featuredRequest,
        organiserId: organiser.id, organiserName: organiser.name, organiserAvatar: organiser.avatar,
        status: 'published', createdByMe: true,
      }
      setEvents((list) => {
        const exists = list.some((e) => e.id === id)
        return exists ? list.map((e) => (e.id === id ? ev : e)) : [ev, ...list]
      })
      setDraft({})
      return ev
    },
    [draft],
  )

  const makeTickets = (eventId: string, typeName: string, qty: number, buyer: string): Ticket[] =>
    Array.from({ length: qty }).map((_, i) => ({
      id: rid('tk-'), eventId, ticketType: typeName, attendeeName: i === 0 ? buyer : `${buyer} · Guest ${i}`,
    }))

  const registerFree = useCallback((eventId: string, input: RegisterInput): Booking => {
    const ev = events.find((e) => e.id === eventId)
    const status: BookingStatus = ev?.approvalRequired ? 'Pending Approval' : 'Confirmed'
    const booking: Booking = {
      id: rid('bk-'), orderId: 'IICA-' + Math.floor(10000 + (Date.now() % 89999)),
      eventId, eventTitle: ev?.title ?? '', eventDate: ev?.startDate ?? '', cover: ev?.cover ?? '',
      format: ev?.format ?? 'In person', status, qty: input.attendees, ticketTypeName: 'Free Registration',
      amount: 0, paid: false, buyerName: input.name, buyerEmail: input.email, createdAt: new Date().toISOString().slice(0, 10),
      tickets: makeTickets(eventId, 'Free', input.attendees, input.name),
    }
    setBookings((b) => [booking, ...b])
    setAttendees((a) => [
      { id: rid('at-'), eventId, name: input.name, email: input.email, ticketType: 'Free', qty: input.attendees, regDate: booking.createdAt, paymentStatus: 'Free', checkedIn: false, approval: status === 'Pending Approval' ? 'Pending Approval' : 'Confirmed' },
      ...a,
    ])
    return booking
  }, [events])

  const purchase = useCallback((eventId: string, selections: PurchaseSelection[], buyer: { name: string; email: string }, amount: number): Booking => {
    const ev = events.find((e) => e.id === eventId)
    const qty = selections.reduce((s, x) => s + x.qty, 0)
    const typeName = selections.map((s) => `${s.qty}× ${s.ticketTypeName}`).join(', ')
    const tickets = selections.flatMap((s) => makeTickets(eventId, s.ticketTypeName, s.qty, buyer.name))
    const booking: Booking = {
      id: rid('bk-'), orderId: 'IICA-' + Math.floor(10000 + (Date.now() % 89999)),
      eventId, eventTitle: ev?.title ?? '', eventDate: ev?.startDate ?? '', cover: ev?.cover ?? '',
      format: ev?.format ?? 'In person', status: 'Confirmed', qty, ticketTypeName: typeName,
      amount, paid: true, buyerName: buyer.name, buyerEmail: buyer.email, createdAt: new Date().toISOString().slice(0, 10),
      tickets,
    }
    setBookings((b) => [booking, ...b])
    setAttendees((a) => [
      ...selections.map((s) => ({ id: rid('at-'), eventId, name: buyer.name, email: buyer.email, ticketType: s.ticketTypeName, qty: s.qty, regDate: booking.createdAt, paymentStatus: 'Paid' as const, checkedIn: false, approval: 'Confirmed' as const })),
      ...a,
    ])
    // increment sold
    setEvents((list) => list.map((e) => e.id === eventId ? {
      ...e, tickets: e.tickets.map((t: TicketType) => {
        const sel = selections.find((s) => s.ticketTypeName === t.name)
        return sel ? { ...t, sold: t.sold + sel.qty } : t
      }),
    } : e))
    return booking
  }, [events])

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings((b) => b.map((x) => x.id === bookingId ? { ...x, status: 'Cancelled', refundStatus: x.paid ? 'Under Review' : undefined } : x))
  }, [])

  const requestRefund = useCallback((bookingId: string) => {
    setBookings((b) => b.map((x) => x.id === bookingId ? { ...x, refundStatus: 'Under Review' } : x))
  }, [])

  const setAttendee = useCallback((id: string, patch: Partial<Attendee>) => {
    setAttendees((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x))
  }, [])

  const cancelEvent = useCallback((eventId: string) => {
    setEvents((list) => list.map((e) => e.id === eventId ? { ...e, status: 'cancelled' } : e))
    setBookings((b) => b.map((x) => x.eventId === eventId ? { ...x, status: 'Event Cancelled', refundStatus: x.paid ? 'Under Review' : undefined } : x))
  }, [])

  const value = useMemo<Ctx>(() => ({
    events, bookings, attendees, draft, flowOrigin, setFlowOrigin,
    getEvent, bookingFor, saveDraft, resetDraft, loadDraftFrom, publishDraft,
    registerFree, purchase, cancelBooking, requestRefund, attendeesFor, setAttendee, cancelEvent,
  }), [events, bookings, attendees, draft, flowOrigin, setFlowOrigin, getEvent, bookingFor, saveDraft, resetDraft, loadDraftFrom, publishDraft, registerFree, purchase, cancelBooking, requestRefund, attendeesFor, setAttendee, cancelEvent])

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}
