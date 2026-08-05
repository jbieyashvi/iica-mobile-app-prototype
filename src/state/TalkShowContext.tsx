import {
  createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { youTubeThumb, youTubeWatchUrl } from '../lib/youtube'

// ---- Talk Show episodes + Guest-Artist résumé submissions (prototype) ----
// One shared data layer for BOTH the user-facing screens and a future Admin
// Panel. No user-facing moderation states.

export interface TalkShowEpisode {
  id: string
  title: string
  description: string
  host: string
  guest: string // featured guest ('' when none)
  url: string // YouTube URL
  videoId: string // YouTube video id
  thumbnail: string
  releaseDate: string // YYYY-MM-DD
  featured: boolean // featured-this-week (exactly one)
  order: number // display order
}

export type ApplicantType = 'Guest' | 'Registered User' | 'Creator Member'

export interface ResumeSubmission {
  id: string // Submission / reference id
  userId?: string // when signed in
  applicantType: ApplicantType
  fileName: string
  fileType: string
  fileSize: number // bytes
  fileRef: string // prototype local reference: data: URL when small enough, else ''
  blobPersisted: boolean // false when the blob was too large to persist (metadata only)
  note?: string
  submittedAt: string
  episodeId?: string // source episode, when applied from an episode
  downloadRef: string // Admin-compatible download reference (same as fileRef in prototype)
}

const EP_KEY = 'iica_talkshow_v1'
const SUB_KEY = 'iica_talkshow_apps_v1'
// Blobs above this are NOT persisted to localStorage (unreliable); metadata is
// kept and the file is available for the current session only.
const PERSIST_BLOB_MAX = 2 * 1024 * 1024
export const RESUME_MAX_BYTES = 10 * 1024 * 1024

const seedEpisodes = (): TalkShowEpisode[] => {
  const mk = (
    i: number, videoId: string, title: string, description: string, host: string, guest: string,
    releaseDate: string, featured: boolean, order: number,
  ): TalkShowEpisode => ({
    id: `ts-${i}`, title, description, host, guest,
    url: youTubeWatchUrl(videoId), videoId, thumbnail: youTubeThumb(videoId),
    releaseDate, featured, order,
  })
  return [
    mk(12, 'ScMzIvxBSi4', 'IICA Conversations — Ep. 12', 'A candid conversation on blending Hindustani roots with contemporary production.', 'Ananya Rao', 'Abhishek Singh Chouhan', '2026-08-03', true, 1),
    mk(11, 'kJQP7kiw5Fk', 'IICA Conversations — Ep. 11', 'On movement, memory and reinventing Bharatanatyam for the stage today.', 'Ananya Rao', 'Meera Iyer', '2026-07-27', false, 2),
    mk(10, 'RgKAFK5djSk', 'IICA Conversations — Ep. 10', 'The craft of independent filmmaking and telling regional stories.', 'Kabir Menon', 'Arjun Desai', '2026-07-20', false, 3),
    mk(9, 'e-ORhEE9VVg', 'IICA Conversations — Ep. 9', 'Folk art, pigment and keeping a tradition alive with new audiences.', 'Ananya Rao', 'Bhavna Shah', '2026-07-13', false, 4),
    mk(8, 'fJ9rUzIMcZQ', 'IICA Conversations — Ep. 8', 'Percussion, rhythm and the discipline behind a great live set.', 'Kabir Menon', 'Devraj Singh', '2026-07-06', false, 5),
  ]
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch { /* ignore */ }
  return fallback
}

export interface ResumeInput {
  applicantType: ApplicantType
  userId?: string
  fileName: string
  fileType: string
  fileSize: number
  dataUrl: string // full data URL of the chosen PDF (may be large)
  note?: string
  episodeId?: string
}

interface Ctx {
  episodes: TalkShowEpisode[]
  featuredEpisode: TalkShowEpisode | null
  previousEpisodes: TalkShowEpisode[]
  submissions: ResumeSubmission[]
  submitResume: (input: ResumeInput) => ResumeSubmission
  // ---- Admin-ready operations (data layer only) ----
  addEpisode: (ep: Omit<TalkShowEpisode, 'id'>) => TalkShowEpisode
  setFeaturedEpisode: (id: string) => void
  removeSubmission: (id: string) => void
}

const TalkShowContext = createContext<Ctx | null>(null)

export function TalkShowProvider({ children }: { children: ReactNode }) {
  const [episodes, setEpisodes] = useState<TalkShowEpisode[]>(() => load(EP_KEY, seedEpisodes()))
  const [submissions, setSubmissions] = useState<ResumeSubmission[]>(() => load(SUB_KEY, []))

  useEffect(() => { try { localStorage.setItem(EP_KEY, JSON.stringify(episodes)) } catch { /* ignore */ } }, [episodes])
  useEffect(() => { try { localStorage.setItem(SUB_KEY, JSON.stringify(submissions)) } catch { /* ignore */ } }, [submissions])

  const submitResume = useCallback<Ctx['submitResume']>((input) => {
    const persist = !!input.dataUrl && input.fileSize <= PERSIST_BLOB_MAX
    const fileRef = persist ? input.dataUrl : ''
    const rec: ResumeSubmission = {
      id: 'GA-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      userId: input.userId,
      applicantType: input.applicantType,
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
      fileRef,
      blobPersisted: persist,
      note: input.note?.trim() || undefined,
      submittedAt: new Date().toISOString(),
      episodeId: input.episodeId,
      downloadRef: fileRef,
    }
    setSubmissions((list) => {
      const next = [rec, ...list]
      try { localStorage.setItem(SUB_KEY, JSON.stringify(next)) } catch { /* quota: metadata still in memory */ }
      return next
    })
    return rec
  }, [])

  const addEpisode = useCallback<Ctx['addEpisode']>((ep) => {
    const rec: TalkShowEpisode = { ...ep, id: 'ts-' + Math.random().toString(36).slice(2, 9) }
    setEpisodes((list) => [rec, ...list])
    return rec
  }, [])
  const setFeaturedEpisode = useCallback<Ctx['setFeaturedEpisode']>((id) => {
    // Exactly one featured episode at a time.
    setEpisodes((list) => list.map((e) => ({ ...e, featured: e.id === id })))
  }, [])
  const removeSubmission = useCallback<Ctx['removeSubmission']>((id) => {
    setSubmissions((list) => list.filter((s) => s.id !== id))
  }, [])

  const featuredEpisode = useMemo(
    () => episodes.filter((e) => e.featured).sort((a, b) => a.order - b.order)[0] ?? null,
    [episodes],
  )
  const previousEpisodes = useMemo(
    () => episodes.filter((e) => e.id !== featuredEpisode?.id).sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
    [episodes, featuredEpisode],
  )

  const value = useMemo<Ctx>(
    () => ({ episodes, featuredEpisode, previousEpisodes, submissions, submitResume, addEpisode, setFeaturedEpisode, removeSubmission }),
    [episodes, featuredEpisode, previousEpisodes, submissions, submitResume, addEpisode, setFeaturedEpisode, removeSubmission],
  )
  return <TalkShowContext.Provider value={value}>{children}</TalkShowContext.Provider>
}

export function useTalkShow() {
  const ctx = useContext(TalkShowContext)
  if (!ctx) throw new Error('useTalkShow must be used within TalkShowProvider')
  return ctx
}
