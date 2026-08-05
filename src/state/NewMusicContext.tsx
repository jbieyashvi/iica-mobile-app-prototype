import {
  createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { parseYouTubeId, youTubeThumb, youTubeWatchUrl } from '../lib/youtube'

// ---- Shared "New Music Today" record (prototype, localStorage) ----
// One structure serves BOTH the user-facing Home/New Music screens AND a future
// Admin Panel. The Admin selection fields (featured, featuredAt, order) live on
// the same record but are never surfaced on the user-facing screens.
export interface NewMusicRecord {
  id: string // Music ID
  videoId: string // YouTube video ID
  url: string // YouTube URL
  title: string
  artist: string // artist / creator name
  genre: string
  thumbnail: string // thumbnail URL
  note?: string
  submittedByUserId?: string // when the submitter is signed in
  submittedByName: string // display name
  submittedAt: string
  featured: boolean // Featured on Home (Admin-controlled)
  featuredAt?: string
  order: number // display order among featured
}

export const MUSIC_GENRES = [
  'Classical', 'Contemporary', 'Folk', 'Devotional', 'Fusion', 'Indie',
  'Film', 'Ghazal', 'Hip-Hop', 'Pop', 'Instrumental', 'Other',
]

const KEY = 'iica_newmusic_v1'

// Admin-curated seed (featured on Home). Uses real, broadly-available video ids
// so thumbnails resolve; a fallback covers any that don't.
const seed = (): NewMusicRecord[] => {
  const mk = (
    i: number, videoId: string, title: string, artist: string, genre: string, order: number,
  ): NewMusicRecord => ({
    id: `nm-seed-${i}`,
    videoId,
    url: youTubeWatchUrl(videoId),
    title,
    artist,
    genre,
    thumbnail: youTubeThumb(videoId),
    submittedByName: 'IICA',
    submittedByUserId: 'iica-admin',
    submittedAt: '2026-08-01T09:00:00.000Z',
    featured: true,
    featuredAt: '2026-08-01T09:00:00.000Z',
    order,
  })
  return [
    mk(1, 'ScMzIvxBSi4', 'Mahakaal Ki Sawaari', 'Abhishek Singh Chouhan', 'Devotional', 1),
    mk(2, 'kJQP7kiw5Fk', 'Indra Dev Aarti', 'Abhishek Singh Chouhan', 'Devotional', 2),
    mk(3, 'RgKAFK5djSk', 'Rhythms in Motion', 'Ananya Rao', 'Fusion', 3),
    mk(4, 'e-ORhEE9VVg', 'Malwa Nights (Live)', 'Mid Town Music', 'Contemporary', 4),
    mk(5, 'fJ9rUzIMcZQ', 'Twilight Raga', 'Kabir Menon', 'Classical', 5),
    mk(6, '3JZ_D3ELwOQ', 'Street Sessions Vol. 2', 'Rhythm House Collective', 'Indie', 6),
  ]
}

function load(): NewMusicRecord[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as NewMusicRecord[]
  } catch { /* ignore */ }
  return seed()
}

export interface SubmitInput {
  url: string
  title: string
  artist: string
  genre: string
  note?: string
  submittedByName: string
  submittedByUserId?: string
}

interface Ctx {
  records: NewMusicRecord[]
  /** Home-featured records, sorted by display order. */
  featured: NewMusicRecord[]
  /** A video id already exists among active records. */
  isDuplicate: (videoId: string) => boolean
  /** User/guest submission (non-featured until Admin selects it). Returns the stored record. */
  submit: (input: SubmitInput) => NewMusicRecord
  // ---- Admin-ready operations (data layer only; no Admin UI built here) ----
  addDirect: (input: SubmitInput & { featured?: boolean }) => NewMusicRecord
  setFeatured: (id: string, featured: boolean) => void
  setOrder: (id: string, order: number) => void
  remove: (id: string) => void
}

const NewMusicContext = createContext<Ctx | null>(null)

export function NewMusicProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<NewMusicRecord[]>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(records)) } catch { /* ignore */ }
  }, [records])

  const isDuplicate = useCallback(
    (videoId: string) => !!videoId && records.some((r) => r.videoId === videoId),
    [records],
  )

  const build = useCallback((input: SubmitInput, featured: boolean): NewMusicRecord => {
    const videoId = parseYouTubeId(input.url)
    const nextOrder = featured
      ? Math.max(0, ...records.filter((r) => r.featured).map((r) => r.order)) + 1
      : 0
    return {
      id: 'nm-' + Math.random().toString(36).slice(2, 9),
      videoId,
      url: input.url.trim(),
      title: input.title.trim(),
      artist: input.artist.trim(),
      genre: input.genre,
      thumbnail: videoId ? youTubeThumb(videoId) : '',
      note: input.note?.trim() || undefined,
      submittedByUserId: input.submittedByUserId,
      submittedByName: input.submittedByName.trim() || 'Guest',
      submittedAt: new Date().toISOString(),
      featured,
      featuredAt: featured ? new Date().toISOString() : undefined,
      order: nextOrder,
    }
  }, [records])

  const submit = useCallback<Ctx['submit']>((input) => {
    const rec = build(input, false)
    setRecords((list) => [rec, ...list])
    return rec
  }, [build])

  const addDirect = useCallback<Ctx['addDirect']>((input) => {
    const rec = build(input, input.featured ?? true)
    setRecords((list) => [rec, ...list])
    return rec
  }, [build])

  const setFeatured = useCallback<Ctx['setFeatured']>((id, featured) => {
    setRecords((list) => list.map((r) => (r.id === id
      ? { ...r, featured, featuredAt: featured ? new Date().toISOString() : r.featuredAt }
      : r)))
  }, [])
  const setOrder = useCallback<Ctx['setOrder']>((id, order) => {
    setRecords((list) => list.map((r) => (r.id === id ? { ...r, order } : r)))
  }, [])
  const remove = useCallback<Ctx['remove']>((id) => {
    setRecords((list) => list.filter((r) => r.id !== id))
  }, [])

  const featured = useMemo(
    () => records.filter((r) => r.featured).sort((a, b) => a.order - b.order),
    [records],
  )

  const value = useMemo<Ctx>(
    () => ({ records, featured, isDuplicate, submit, addDirect, setFeatured, setOrder, remove }),
    [records, featured, isDuplicate, submit, addDirect, setFeatured, setOrder, remove],
  )
  return <NewMusicContext.Provider value={value}>{children}</NewMusicContext.Provider>
}

export function useNewMusic() {
  const ctx = useContext(NewMusicContext)
  if (!ctx) throw new Error('useNewMusic must be used within NewMusicProvider')
  return ctx
}
