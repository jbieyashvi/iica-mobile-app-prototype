// ---- Events module types (customer + creator) ----

export type EventCategory =
  | 'Concert'
  | 'LIVE Gig'
  | 'Workshop'
  | 'Music Jam'
  | 'In-door Baithak'
  | 'Fan Meet n Greet'
  | 'Painting Session'
  | 'Others'

export const EVENT_CATEGORIES: EventCategory[] = [
  'Concert', 'LIVE Gig', 'Workshop', 'Music Jam',
  'In-door Baithak', 'Fan Meet n Greet', 'Painting Session', 'Others',
]

export type EventFormat = 'In person' | 'Online' | 'Hybrid'
export type EventStatus = 'published' | 'draft' | 'past' | 'cancelled'

export interface TicketType {
  id: string
  name: string
  price: number
  currency: string
  quantity: number
  sold: number
  salesStart: string
  salesEnd: string
  maxPerBuyer: number
  description: string
  benefits: string
  refundable: boolean
}

export interface ScheduleItem {
  id: string
  start: string
  end: string
  title: string
  host: string
  description: string
}

export interface Performer {
  id: string
  name: string
  role: string
}

export interface OnlineInfo {
  platform: string
  link: string
  instructions: string
}

export interface EventItem {
  id: string
  title: string
  category: EventCategory
  customCategory?: string
  summary: string
  description: string
  format: EventFormat
  language?: string
  audience?: string
  tags: string[]
  performers: Performer[]
  expect: string
  // schedule
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  timezone: string
  multiDay: boolean
  recurring: boolean
  regClose: string
  doorTime: string
  schedule: ScheduleItem[]
  // venue
  venueName?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal?: string
  venueInstructions?: string
  accessibility?: string
  parking?: string
  online?: OnlineInfo
  // tickets
  paid: boolean
  tickets: TicketType[]
  capacity: number
  waitlist: boolean
  approvalRequired: boolean
  maxPerPerson: number
  refundPolicy: string
  // media
  cover: string
  images: string[]
  promoVideo?: string
  accent?: string
  featuredRequest?: boolean
  // meta
  organiserId: string
  organiserName: string
  organiserAvatar?: string
  status: EventStatus
  createdByMe?: boolean
  featured?: boolean
}

export type BookingStatus =
  | 'Confirmed'
  | 'Pending Approval'
  | 'Waitlisted'
  | 'Cancelled'
  | 'Refunded'
  | 'Event Cancelled'

export interface Ticket {
  id: string
  eventId: string
  ticketType: string
  attendeeName: string
  seat?: string
}

export interface Booking {
  id: string
  orderId: string
  eventId: string
  eventTitle: string
  eventDate: string
  cover: string
  format: EventFormat
  status: BookingStatus
  qty: number
  ticketTypeName: string
  amount: number // 0 = free
  paid: boolean
  buyerName: string
  buyerEmail: string
  createdAt: string
  tickets: Ticket[]
  refundStatus?: 'Under Review' | 'Approved' | 'Rejected' | 'Refunded'
}

export interface Attendee {
  id: string
  eventId: string
  name: string
  email: string
  ticketType: string
  qty: number
  regDate: string
  paymentStatus: 'Paid' | 'Free'
  checkedIn: boolean
  approval: 'Confirmed' | 'Pending Approval' | 'Waitlisted' | 'Cancelled'
}

export const PLATFORM_FEE_RATE = 0.05 // 5% prototype platform fee
export const PROMO_CODE = 'IICA10'
export const PROMO_RATE = 0.1
