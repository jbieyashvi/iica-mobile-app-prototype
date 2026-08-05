import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  CollaborationRequirement, CollaborationRequest, CollabRequestStatus, CollabFormat,
} from '../aicollab/types'
import { demoUser } from '../demo/demoData'

const REQ_KEY = 'iica_aicollab_requests_v1'
const CUR_KEY = 'iica_aicollab_current' // session-scoped active requirement

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
  setRequirement: (r: Omit<CollaborationRequirement, 'id' | 'createdByUserId' | 'createdAt'>, userId: string) => CollaborationRequirement
  updateRequirement: (patch: Partial<CollaborationRequirement>) => void
  clearRequirement: () => void
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

  useEffect(() => { try { localStorage.setItem(REQ_KEY, JSON.stringify(requests)) } catch { /* */ } }, [requests])
  useEffect(() => {
    try { current ? sessionStorage.setItem(CUR_KEY, JSON.stringify(current)) : sessionStorage.removeItem(CUR_KEY) } catch { /* */ }
  }, [current])

  const setRequirement = useCallback<Ctx['setRequirement']>((r, userId) => {
    const full: CollaborationRequirement = { ...r, id: rid('REQ-'), createdByUserId: userId, createdAt: nowISO() }
    setCurrent(full)
    return full
  }, [])
  const updateRequirement = useCallback<Ctx['updateRequirement']>((patch) => setCurrent((c) => (c ? { ...c, ...patch } : c)), [])
  const clearRequirement = useCallback(() => setCurrent(null), [])

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
    current, requests, setRequirement, updateRequirement, clearRequirement,
    getRequest, createRequest, accept, decline, cancel, complete,
  }), [current, requests, setRequirement, updateRequirement, clearRequirement, getRequest, createRequest, accept, decline, cancel, complete])

  return <AiCollabContext.Provider value={value}>{children}</AiCollabContext.Provider>
}

export function useAiCollab() {
  const ctx = useContext(AiCollabContext)
  if (!ctx) throw new Error('useAiCollab must be used within AiCollabProvider')
  return ctx
}
