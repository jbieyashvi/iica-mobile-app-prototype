import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  CollaborationRequirement, CollaborationRequest, CollabRequestStatus, CollabFormat,
} from '../aicollab/types'
import { demoUser } from '../demo/demoData'

const REQ_KEY = 'iica_aicollab_requests_v1'
const CUR_KEY = 'iica_aicollab_current' // session-scoped active requirement
const SW_KEY = 'iica_aicollab_swipe' // session-scoped swipe progress
const SAVED_KEY = 'iica_aicollab_saved_v1' // persisted saved creator matches

export interface SwipeSession {
  requirementId: string
  skipped: string[]
  interested: string[]
  index: number
}

// A saved creator match. Identity is (userId, creatorId) — never a copy of the
// creator profile (resolve that from shared records via getMatchCreator). The
// optional reason/requirementId keep light search context for the Saved list.
export interface SavedMatch {
  userId: string
  creatorId: string
  requirementId?: string
  reason?: string
  savedAt: string
}

const rid = (p: string) => p + Math.random().toString(36).slice(2, 8).toUpperCase()
const nowISO = () => new Date().toISOString()

// The signed-in demo creator (self) for seeded sent/received scenarios.
const ME = { id: demoUser.memberId, name: demoUser.fullName, slug: demoUser.slug }

function mkReq(o: Partial<CollaborationRequest> & { title: string; receiverName: string; receiverUserId: string; status: CollabRequestStatus; direction: 'sent' | 'received' }): CollaborationRequest {
  return {
    id: o.id ?? rid('CR-'), requirementId: o.requirementId ?? '',
    senderUserId: o.senderUserId ?? ME.id, senderName: o.senderName ?? ME.name,
    receiverUserId: o.receiverUserId, receiverName: o.receiverName,
    title: o.title, description: o.description ?? '', skill: o.skill ?? '', genre: o.genre ?? '',
    proposedDate: o.proposedDate ?? 'Flexible', format: o.format ?? 'In Person',
    locationOrPlatform: o.locationOrPlatform ?? '', budget: o.budget ?? 'Not specified',
    additionalNote: o.additionalNote ?? '', status: o.status, declineReason: o.declineReason,
    direction: o.direction, createdAt: o.createdAt ?? nowISO(), updatedAt: o.updatedAt ?? nowISO(),
  }
}

function seedRequests(): CollaborationRequest[] {
  return [
    mkReq({ id: 'CR-SENT01', direction: 'sent', status: 'Sent', title: 'Weekend classical set', receiverName: 'Ananya Rao', receiverUserId: 'ananya-rao', description: 'Looking for a classical vocalist for a weekend event in Mumbai.', skill: 'Vocals', genre: 'Indian Classical', proposedDate: 'This Weekend', format: 'In Person', locationOrPlatform: 'Mumbai', budget: 'Not specified' }),
    mkReq({ id: 'CR-RECV01', direction: 'received', status: 'Sent', senderUserId: 'kabir-menon', senderName: 'Kabir Menon', title: 'Sitar + visuals collaboration', receiverName: ME.name, receiverUserId: ME.slug, description: 'Keen to collaborate on an audio-visual piece blending sitar and motion design.', skill: 'Creative Direction', genre: 'Fusion', proposedDate: 'Next Month', format: 'Hybrid', locationOrPlatform: 'Mumbai / Online', budget: '₹20,000' }),
    mkReq({ id: 'CR-ACT01', direction: 'sent', status: 'Accepted', receiverName: 'Meera Kulkarni', receiverUserId: 'meera-kulkarni', title: 'Mural + motion piece', description: 'Collaborate on a public mural documented as a short film.', skill: 'Illustration', genre: 'Visual Arts', proposedDate: 'Next Month', format: 'In Person', locationOrPlatform: 'Pune', budget: '₹15,000', createdAt: '2026-07-20T09:00:00.000Z' }),
    mkReq({ id: 'CR-DEC01', direction: 'sent', status: 'Declined', receiverName: 'Devraj Singh', receiverUserId: 'devraj-singh', title: 'Tabla for live set', description: 'Tabla accompaniment for a fusion live set.', skill: 'Percussion', genre: 'Classical Music', proposedDate: 'This Weekend', format: 'In Person', locationOrPlatform: 'Jaipur', declineReason: 'Travelling that week', createdAt: '2026-07-15T09:00:00.000Z' }),
    mkReq({ id: 'CR-COMP01', direction: 'sent', status: 'Completed', receiverName: 'Kavya Sharma', receiverUserId: 'kavya-sharma', title: 'Folk illustration series', description: 'A set of folk illustrations for a cultural showcase.', skill: 'Illustration', genre: 'Folk Art', proposedDate: 'June 2026', format: 'Online', locationOrPlatform: 'Online', budget: '₹12,000', createdAt: '2026-06-01T09:00:00.000Z' }),
  ]
}

function loadRequests(): CollaborationRequest[] {
  try { const r = localStorage.getItem(REQ_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return seedRequests()
}
function loadCurrent(): CollaborationRequirement | null {
  try { const r = sessionStorage.getItem(CUR_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return null
}
function loadSwipe(): SwipeSession | null {
  try { const r = sessionStorage.getItem(SW_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return null
}
function loadSaved(): SavedMatch[] {
  try { const r = localStorage.getItem(SAVED_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return []
}

export interface CreateRequestInput {
  requirementId: string
  receiverUserId: string
  receiverName: string
  title: string
  description: string
  skill: string
  genre: string
  proposedDate: string
  format: CollabFormat
  locationOrPlatform: string
  budget: string
  additionalNote: string
}

interface Ctx {
  current: CollaborationRequirement | null
  requests: CollaborationRequest[]
  swipe: SwipeSession | null
  saved: SavedMatch[]
  setRequirement: (r: Omit<CollaborationRequirement, 'id' | 'createdByUserId' | 'createdAt'>, userId: string) => CollaborationRequirement
  updateRequirement: (patch: Partial<CollaborationRequirement>) => void
  clearRequirement: () => void
  ensureSwipe: (requirementId: string) => void
  swipeSkip: (creatorId: string) => void
  swipeInterest: (creatorId: string) => void
  setSwipeIndex: (index: number) => void
  saveMatch: (rec: Omit<SavedMatch, 'savedAt'>) => void
  unsaveMatch: (userId: string, creatorId: string) => void
  isSaved: (userId: string, creatorId: string) => boolean
  savedForUser: (userId: string) => SavedMatch[]
  getRequest: (id?: string) => CollaborationRequest | undefined
  createRequest: (input: CreateRequestInput, sender: { id: string; name: string }) => CollaborationRequest
  accept: (id: string) => void
  decline: (id: string, reason?: string) => void
  cancel: (id: string) => void
  complete: (id: string) => void
}

const AiCollabContext = createContext<Ctx | null>(null)

export function AiCollabProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<CollaborationRequirement | null>(loadCurrent)
  const [requests, setRequests] = useState<CollaborationRequest[]>(loadRequests)
  const [swipe, setSwipe] = useState<SwipeSession | null>(loadSwipe)
  const [saved, setSaved] = useState<SavedMatch[]>(loadSaved)

  useEffect(() => { try { localStorage.setItem(REQ_KEY, JSON.stringify(requests)) } catch { /* */ } }, [requests])
  useEffect(() => {
    try { current ? sessionStorage.setItem(CUR_KEY, JSON.stringify(current)) : sessionStorage.removeItem(CUR_KEY) } catch { /* */ }
  }, [current])
  useEffect(() => {
    try { swipe ? sessionStorage.setItem(SW_KEY, JSON.stringify(swipe)) : sessionStorage.removeItem(SW_KEY) } catch { /* */ }
  }, [swipe])
  useEffect(() => { try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)) } catch { /* */ } }, [saved])

  const setRequirement = useCallback<Ctx['setRequirement']>((r, userId) => {
    const full: CollaborationRequirement = { ...r, id: rid('REQ-'), createdByUserId: userId, createdAt: nowISO() }
    setCurrent(full)
    setSwipe({ requirementId: full.id, skipped: [], interested: [], index: 0 }) // fresh stack per search
    return full
  }, [])
  const updateRequirement = useCallback<Ctx['updateRequirement']>((patch) => setCurrent((c) => (c ? { ...c, ...patch } : c)), [])
  const clearRequirement = useCallback(() => { setCurrent(null); setSwipe(null) }, [])

  const ensureSwipe = useCallback<Ctx['ensureSwipe']>((requirementId) => {
    setSwipe((s) => (s && s.requirementId === requirementId ? s : { requirementId, skipped: [], interested: [], index: 0 }))
  }, [])
  const swipeSkip = useCallback<Ctx['swipeSkip']>((creatorId) => {
    setSwipe((s) => (s ? { ...s, skipped: s.skipped.includes(creatorId) ? s.skipped : [...s.skipped, creatorId], index: s.index + 1 } : s))
  }, [])
  const swipeInterest = useCallback<Ctx['swipeInterest']>((creatorId) => {
    setSwipe((s) => (s ? { ...s, interested: s.interested.includes(creatorId) ? s.interested : [...s.interested, creatorId], index: s.index + 1 } : s))
  }, [])
  const setSwipeIndex = useCallback<Ctx['setSwipeIndex']>((index) => setSwipe((s) => (s ? { ...s, index } : s)), [])

  // ---- Saved matches (bookmark-for-later; separate from swipe/request) ----
  const saveMatch = useCallback<Ctx['saveMatch']>((rec) => {
    setSaved((list) => (list.some((s) => s.userId === rec.userId && s.creatorId === rec.creatorId)
      ? list // dedupe on (userId, creatorId)
      : [{ ...rec, savedAt: nowISO() }, ...list]))
  }, [])
  const unsaveMatch = useCallback<Ctx['unsaveMatch']>((userId, creatorId) => {
    setSaved((list) => list.filter((s) => !(s.userId === userId && s.creatorId === creatorId)))
  }, [])
  const isSaved = useCallback<Ctx['isSaved']>((userId, creatorId) => saved.some((s) => s.userId === userId && s.creatorId === creatorId), [saved])
  const savedForUser = useCallback<Ctx['savedForUser']>((userId) => saved.filter((s) => s.userId === userId), [saved])

  const getRequest = useCallback((id?: string) => requests.find((r) => r.id === id), [requests])

  const createRequest = useCallback<Ctx['createRequest']>((input, sender) => {
    const req: CollaborationRequest = {
      ...input, id: rid('CR-'), senderUserId: sender.id, senderName: sender.name,
      status: 'Sent', direction: 'sent', createdAt: nowISO(), updatedAt: nowISO(),
    }
    setRequests((list) => [req, ...list])
    return req
  }, [])

  const patch = (id: string, p: Partial<CollaborationRequest>) =>
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, ...p, updatedAt: nowISO() } : r)))
  const accept = useCallback((id: string) => patch(id, { status: 'Accepted' }), [])
  const decline = useCallback((id: string, reason?: string) => patch(id, { status: 'Declined', declineReason: reason }), [])
  const cancel = useCallback((id: string) => patch(id, { status: 'Cancelled' }), [])
  const complete = useCallback((id: string) => patch(id, { status: 'Completed' }), [])

  const value = useMemo<Ctx>(() => ({
    current, requests, swipe, saved, setRequirement, updateRequirement, clearRequirement,
    ensureSwipe, swipeSkip, swipeInterest, setSwipeIndex,
    saveMatch, unsaveMatch, isSaved, savedForUser,
    getRequest, createRequest, accept, decline, cancel, complete,
  }), [current, requests, swipe, saved, setRequirement, updateRequirement, clearRequirement, ensureSwipe, swipeSkip, swipeInterest, setSwipeIndex, saveMatch, unsaveMatch, isSaved, savedForUser, getRequest, createRequest, accept, decline, cancel, complete])

  return <AiCollabContext.Provider value={value}>{children}</AiCollabContext.Provider>
}

// Collaboration counts for the current user. Never hardcoded — derived from the
// live request list + saved records. Sent: requests I sent still awaiting a
// reply (status Sent). Received: requests sent to me, still unanswered. Active:
// accepted, not completed/cancelled. Saved: unique saved creator matches.
export function collabCounts(requests: CollaborationRequest[], savedCount: number) {
  return {
    sent: requests.filter((r) => r.direction === 'sent' && r.status === 'Sent').length,
    received: requests.filter((r) => r.direction === 'received' && r.status === 'Sent').length,
    active: requests.filter((r) => r.status === 'Accepted').length,
    saved: savedCount,
  }
}

export function useAiCollab() {
  const ctx = useContext(AiCollabContext)
  if (!ctx) throw new Error('useAiCollab must be used within AiCollabProvider')
  return ctx
}
