import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  Candidate, CollabPrefs, CollabRequest, Meeting, MeetingSlot, RequestStatus, SwipeSession, COOLDOWN_MS,
} from '../collab/types'
import { candidates as allCandidates, seedMeetings, seedRequests, getCandidate } from '../collab/mockCollab'
import { demoCollaborationPreferences } from '../demo/demoData'

const PKEY = 'iica_collab_prefs_v1'
const PVER = 'iica_collab_prefs_ver' // migration marker
const CURRENT_VER = 2
const SKEY = 'iica_collab_session_v1'
const RKEY = 'iica_collab_requests_v1'
const MKEY = 'iica_collab_meetings_v1'
const CKEY = 'iica_collab_cooldown_v1'
const BKEY = 'iica_collab_blocked_v1'

function load<T>(k: string, fb: T): T {
  try { const r = localStorage.getItem(k); if (r) return JSON.parse(r) as T } catch { /* */ }
  return fb
}
const rid = (p: string) => p + Math.random().toString(36).slice(2, 9)
const now = () => Date.now()

const defaultPrefs: CollabPrefs = {
  ...demoCollaborationPreferences,
  configured: true,
  savedAt: undefined,
}

// Fill any empty/missing optional field from the demo defaults so a saved
// profile is always "complete enough" to match. Never blanks a user value.
function backfill(p: Partial<CollabPrefs>): CollabPrefs {
  const d = defaultPrefs
  const arr = (a: unknown, fb: string[]) => (Array.isArray(a) && a.length ? a as string[] : fb)
  const str = (s: unknown, fb: string) => (typeof s === 'string' && s.trim() ? s : fb)
  return {
    availability: (p.availability as CollabPrefs['availability']) ?? d.availability,
    lookingFor: arr(p.lookingFor, d.lookingFor),
    domains: arr(p.domains, d.domains),
    skills: str(p.skills, d.skills),
    genres: str(p.genres, d.genres),
    experience: str(p.experience, d.experience),
    languages: str(p.languages, d.languages),
    cities: str(p.cities, d.cities),
    countries: str(p.countries, d.countries),
    maxTravel: str(p.maxTravel, d.maxTravel),
    remoteOk: typeof p.remoteOk === 'boolean' ? p.remoteOk : d.remoteOk, // coerce boolean-as-string
    inPersonPref: typeof p.inPersonPref === 'boolean' ? p.inPersonPref : d.inPersonPref,
    statement: str(p.statement, d.statement),
    goal: str(p.goal, d.goal),
    timeline: str(p.timeline, d.timeline),
    compensation: (p.compensation as CollabPrefs['compensation']) ?? d.compensation,
    contactMethod: str(p.contactMethod, d.contactMethod),
    configured: true,
    savedAt: typeof p.savedAt === 'number' ? p.savedAt : now(),
  }
}

// One-time migration of stale/old-schema prefs into the current structure.
function loadPrefs(): CollabPrefs {
  const raw = localStorage.getItem(PKEY)
  if (!raw) return defaultPrefs // fresh install → prefilled demo defaults
  const ver = Number(localStorage.getItem(PVER) ?? 0)
  try {
    const stored = JSON.parse(raw) as Partial<CollabPrefs>
    if (ver >= CURRENT_VER && stored.configured && stored.savedAt) return stored as CollabPrefs
    return backfill(stored) // old key / missing fields / incomplete → repair
  } catch {
    return defaultPrefs
  }
}

interface Ctx {
  prefs: CollabPrefs
  session: SwipeSession
  requests: CollabRequest[]
  meetings: Meeting[]
  blocked: string[]
  lastRun: number | null
  savePrefs: (p: CollabPrefs) => void
  applyDemoPrefs: () => void
  prefsComplete: () => boolean
  canMatch: () => boolean
  nextMatchAt: () => number | null
  startMatching: () => void
  resetCooldown: () => void
  currentCandidate: () => Candidate | null
  visibleQueue: () => Candidate[]
  swipe: (action: 'interested' | 'skipped') => void
  undo: () => void
  saveForLater: (id: string) => void
  endSession: () => void
  sendRequest: (r: Omit<CollabRequest, 'id' | 'createdAt' | 'direction' | 'status' | 'viewed'>) => CollabRequest
  getRequest: (id?: string) => CollabRequest | undefined
  markViewed: (id: string) => void
  acceptRequest: (id: string, slotId: string) => Meeting
  proposeAlternate: (id: string, slots: MeetingSlot[], msg: string) => void
  declineRequest: (id: string, reason: string) => void
  withdrawRequest: (id: string) => void
  getMeeting: (id?: string) => Meeting | undefined
  rescheduleMeeting: (id: string, slots: MeetingSlot[], reason: string) => void
  cancelMeeting: (id: string) => void
  block: (artistId: string) => void
}

const CollabContext = createContext<Ctx | null>(null)

export function CollabProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<CollabPrefs>(loadPrefs)
  const [session, setSession] = useState<SwipeSession>(() => load(SKEY, {
    active: false, queue: [], index: 0, interested: [], saved: [], skipped: [], history: [], instructionsDismissed: false,
  }))
  const [requests, setRequests] = useState<CollabRequest[]>(() => load(RKEY, seedRequests))
  const [meetings, setMeetings] = useState<Meeting[]>(() => load(MKEY, seedMeetings))
  const [lastRun, setLastRun] = useState<number | null>(() => load<number | null>(CKEY, null))
  const [blocked, setBlocked] = useState<string[]>(() => load(BKEY, []))

  useEffect(() => { try { localStorage.setItem(PKEY, JSON.stringify(prefs)); localStorage.setItem(PVER, String(CURRENT_VER)) } catch { /* */ } }, [prefs])
  useEffect(() => { try { localStorage.setItem(SKEY, JSON.stringify(session)) } catch { /* */ } }, [session])
  useEffect(() => { try { localStorage.setItem(RKEY, JSON.stringify(requests)) } catch { /* */ } }, [requests])
  useEffect(() => { try { localStorage.setItem(MKEY, JSON.stringify(meetings)) } catch { /* */ } }, [meetings])
  useEffect(() => { try { localStorage.setItem(CKEY, JSON.stringify(lastRun)) } catch { /* */ } }, [lastRun])
  useEffect(() => { try { localStorage.setItem(BKEY, JSON.stringify(blocked)) } catch { /* */ } }, [blocked])

  // Single source of truth: a profile is ready to match once it's been saved.
  const prefsComplete = useCallback(() => prefs.configured, [prefs])
  const canMatch = useCallback(() => lastRun === null || now() - lastRun >= COOLDOWN_MS, [lastRun])
  const nextMatchAt = useCallback(() => lastRun === null ? null : lastRun + COOLDOWN_MS, [lastRun])

  // Save backfills empty optional fields from demo defaults + stamps savedAt.
  const savePrefs = useCallback((p: CollabPrefs) => setPrefs(backfill({ ...p, savedAt: now() })), [])
  const applyDemoPrefs = useCallback(() => setPrefs({ ...defaultPrefs, savedAt: now() }), [])
  const resetCooldown = useCallback(() => setLastRun(null), [])

  const startMatching = useCallback(() => {
    const queue = allCandidates.filter((c) => !blocked.includes(c.id)).map((c) => c.id)
    setSession({ active: true, queue, index: 0, interested: [], saved: [], skipped: [], history: [], instructionsDismissed: false })
    setLastRun(now())
  }, [blocked])

  const currentCandidate = useCallback((): Candidate | null => {
    const id = session.queue[session.index]
    return id ? getCandidate(id) ?? null : null
  }, [session])

  const visibleQueue = useCallback(() => session.queue.map((id) => getCandidate(id)).filter(Boolean) as Candidate[], [session.queue])

  const swipe = useCallback((action: 'interested' | 'skipped') => {
    setSession((s) => {
      const id = s.queue[s.index]
      if (!id) return s
      return {
        ...s,
        index: s.index + 1,
        interested: action === 'interested' ? [...s.interested, id] : s.interested,
        skipped: action === 'skipped' ? [...s.skipped, id] : s.skipped,
        history: [...s.history, { id, action }],
        instructionsDismissed: true,
      }
    })
  }, [])

  const undo = useCallback(() => {
    setSession((s) => {
      if (s.history.length === 0) return s
      const last = s.history[s.history.length - 1]
      return {
        ...s,
        index: Math.max(0, s.index - 1),
        interested: s.interested.filter((x) => x !== last.id),
        skipped: s.skipped.filter((x) => x !== last.id),
        history: s.history.slice(0, -1),
      }
    })
  }, [])

  const saveForLater = useCallback((id: string) => setSession((s) => s.saved.includes(id) ? s : { ...s, saved: [...s.saved, id] }), [])
  const endSession = useCallback(() => setSession((s) => ({ ...s, active: false })), [])

  const sendRequest = useCallback((r: Omit<CollabRequest, 'id' | 'createdAt' | 'direction' | 'status' | 'viewed'>): CollabRequest => {
    const req: CollabRequest = { ...r, id: rid('rq-'), createdAt: new Date().toISOString().slice(0, 10), direction: 'sent', status: 'Pending', viewed: false }
    setRequests((list) => [req, ...list])
    return req
  }, [])

  const getRequest = useCallback((id?: string) => requests.find((r) => r.id === id), [requests])
  const markViewed = useCallback((id: string) => setRequests((l) => l.map((r) => r.id === id ? { ...r, viewed: true } : r)), [])

  const patchReq = (id: string, patch: Partial<CollabRequest>) => setRequests((l) => l.map((r) => r.id === id ? { ...r, ...patch } : r))

  const acceptRequest = useCallback((id: string, slotId: string): Meeting => {
    const req = requests.find((r) => r.id === id)!
    const chosen = req.slots.find((s) => s.id === slotId) ?? req.slots[0]
    const meeting: Meeting = {
      id: rid('mt-'), requestId: id, artistId: req.artistId, artistName: req.artistName, artistPhoto: req.artistPhoto,
      project: req.project, purpose: req.purpose, date: chosen.date, time: chosen.time, timezone: 'IST (GMT+5:30)',
      mode: req.mode, location: req.location, online: req.mode === 'Remote', status: 'Upcoming',
    }
    setMeetings((m) => [meeting, ...m])
    patchReq(id, { status: 'Meeting Confirmed' as RequestStatus, chosenSlotId: slotId })
    return meeting
  }, [requests])

  const proposeAlternate = useCallback((id: string, slots: MeetingSlot[], msg: string) =>
    patchReq(id, { status: 'Alternate Time Proposed', alternateSlots: slots, message: msg || undefined as unknown as string }), [])

  const declineRequest = useCallback((id: string, reason: string) => patchReq(id, { status: 'Declined', declineReason: reason }), [])
  const withdrawRequest = useCallback((id: string) => patchReq(id, { status: 'Cancelled' }), [])

  const getMeeting = useCallback((id?: string) => meetings.find((m) => m.id === id), [meetings])
  const rescheduleMeeting = useCallback((id: string, slots: MeetingSlot[], reason: string) =>
    setMeetings((l) => l.map((m) => m.id === id ? { ...m, status: 'Reschedule Requested', rescheduleSlots: slots, rescheduleReason: reason } : m)), [])
  const cancelMeeting = useCallback((id: string) => setMeetings((l) => l.map((m) => m.id === id ? { ...m, status: 'Cancelled' } : m)), [])

  const block = useCallback((artistId: string) => {
    setBlocked((b) => b.includes(artistId) ? b : [...b, artistId])
    setSession((s) => ({ ...s, queue: s.queue.filter((x) => x !== artistId) }))
  }, [])

  const value = useMemo<Ctx>(() => ({
    prefs, session, requests, meetings, blocked, lastRun,
    savePrefs, applyDemoPrefs, prefsComplete, canMatch, nextMatchAt, startMatching, resetCooldown,
    currentCandidate, visibleQueue, swipe, undo, saveForLater, endSession,
    sendRequest, getRequest, markViewed, acceptRequest, proposeAlternate, declineRequest, withdrawRequest,
    getMeeting, rescheduleMeeting, cancelMeeting, block,
  }), [prefs, session, requests, meetings, blocked, lastRun, applyDemoPrefs, prefsComplete, canMatch, nextMatchAt, startMatching, resetCooldown, currentCandidate, visibleQueue, swipe, undo, saveForLater, endSession, sendRequest, getRequest, markViewed, acceptRequest, proposeAlternate, declineRequest, withdrawRequest, getMeeting, rescheduleMeeting, cancelMeeting, block])

  return <CollabContext.Provider value={value}>{children}</CollabContext.Provider>
}

export function useCollab() {
  const ctx = useContext(CollabContext)
  if (!ctx) throw new Error('useCollab must be used within CollabProvider')
  return ctx
}
