// ---- IICA Archive (derived from creator Portfolio → Watch YouTube videos) ----
// Archive does NOT host files and keeps no second copy of a video. Each item
// references the creator's Portfolio Watch media. Static demo creators are
// resolved from publicArtists; the signed-in creator's own Watch videos are
// merged live from their Portfolio (see useArchive()).

import { getMockArtist, profileCategory, PublicArtist } from './publicArtists'
import { Portfolio } from '../portfolio/types'
import { parseYouTubeId, youTubeThumb } from '../lib/youtube'

export interface ArchiveVideo {
  id: string
  videoId: string
  url: string
  title: string
  description: string
  category: string
  thumbnail: string
  date: string
  duration: string
  tags: string[]
  credits: string
  featured: boolean
  views: number // in-app IICA views (never YouTube counts)
  saves: number
  creatorSlug: string
  creatorName: string
  creatorAvatar: string
  creatorCategory: string
  verified: boolean
}

// Named Archive sections (shown only when they contain videos).
export const ARCHIVE_SECTIONS: { key: string; title: string; categories: string[] }[] = [
  { key: 'performances', title: 'Performances', categories: ['Performance'] },
  { key: 'interviews', title: 'Interviews & Conversations', categories: ['Interview', 'Conversation'] },
  { key: 'music', title: 'Music Videos', categories: ['Music Video'] },
  { key: 'bts', title: 'Behind the Scenes', categories: ['Behind the Scenes'] },
  { key: 'tutorials', title: 'Tutorials & Learning', categories: ['Tutorial'] },
  { key: 'events', title: 'Event Recordings', categories: ['Event Recording'] },
]

interface DemoEntry {
  id: string
  creatorSlug: string
  url: string
  title: string
  description: string
  category: string
  thumbnail: string
  date: string
  duration: string
  tags: string[]
  credits: string
  featured: boolean
  views: number
  saves: number
}

const T = {
  dance: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80&auto=format&fit=crop',
  music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop',
  studio: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80&auto=format&fit=crop',
  folk: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80&auto=format&fit=crop',
  film: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80&auto=format&fit=crop',
  mural: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop',
  stage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80&auto=format&fit=crop',
  tabla: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop',
}

// Prototype YouTube ids (privacy-embed). Real ids kept short + plausible; the
// detail view always offers a "Watch on YouTube" fallback.
const ARCHIVE_DEMO: DemoEntry[] = [
  { id: 'av-ananya-perf', creatorSlug: 'ananya-rao', url: 'https://youtu.be/ScMzIvxBSi4', title: 'Contemporary Bharatanatyam Performance', description: 'A reimagined varnam blending classical Bharatanatyam with contemporary staging.', category: 'Performance', thumbnail: T.dance, date: '2026-07-28', duration: '8:42', tags: ['Bharatanatyam', 'Contemporary', 'Live'], credits: 'Choreography: Ananya Rao', featured: true, views: 2140, saves: 186 },
  { id: 'av-abhishek-music', creatorSlug: 'abhishek-singh-chouhan', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', title: 'Original Music Showcase — Tere Naal', description: 'A live studio rendition of an original acoustic composition.', category: 'Music Video', thumbnail: T.music, date: '2026-08-02', duration: '4:11', tags: ['Acoustic', 'Original', 'Fusion'], credits: 'Written & produced by Abhishek Singh Chouhan', featured: true, views: 3120, saves: 240 },
  { id: 'av-kavya-process', creatorSlug: 'kavya-sharma', url: 'https://youtu.be/aqz-KE-bpKQ', title: 'Folk Art Process Film', description: 'From sketch to finished miniature — a quiet look at the folk illustration process.', category: 'Behind the Scenes', thumbnail: T.folk, date: '2026-07-15', duration: '6:05', tags: ['Folk Art', 'Process', 'Miniature'], credits: 'Kavya Sharma', featured: false, views: 980, saves: 74 },
  { id: 'av-rohan-conv', creatorSlug: 'rohan-sen', url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', title: 'Conversation on Independent Filmmaking', description: 'A candid conversation about making films outside the studio system in India.', category: 'Conversation', thumbnail: T.film, date: '2026-07-09', duration: '22:17', tags: ['Filmmaking', 'Independent', 'Interview'], credits: 'Rohan Sen', featured: false, views: 1420, saves: 132 },
  { id: 'av-meerak-bts', creatorSlug: 'meera-kulkarni', url: 'https://youtu.be/kJQP7kiw5Fk', title: 'Behind the Scenes of a Visual Series', description: 'Time-lapse and reflections from a large-scale public mural project.', category: 'Behind the Scenes', thumbnail: T.mural, date: '2026-07-25', duration: '5:48', tags: ['Mural', 'Public Art', 'Process'], credits: 'Meera Kulkarni', featured: false, views: 760, saves: 61 },
  // extras so more sections populate
  { id: 'av-devraj-perf', creatorSlug: 'devraj-singh', url: 'https://youtu.be/9bZkp7q19f0', title: 'Tabla Solo — Teentaal', description: 'A full tabla solo in teentaal recorded live.', category: 'Performance', thumbnail: T.tabla, date: '2026-06-30', duration: '11:20', tags: ['Tabla', 'Hindustani', 'Live'], credits: 'Devraj Singh', featured: false, views: 1330, saves: 118 },
  { id: 'av-nandini-tut', creatorSlug: 'nandini-iyer', url: 'https://youtu.be/e-ORhEE9VVg', title: 'Introduction to Carnatic Ragas', description: 'A beginner-friendly walkthrough of three foundational ragas.', category: 'Tutorial', thumbnail: T.stage, date: '2026-06-18', duration: '14:52', tags: ['Carnatic', 'Tutorial', 'Learning'], credits: 'Nandini Iyer', featured: false, views: 2050, saves: 210 },
  { id: 'av-arjun-event', creatorSlug: 'arjun-desai', url: 'https://youtu.be/RgKAFK5djSk', title: 'Ghazal Nights — Live Recording', description: 'A full set from an evening of ghazals in Delhi.', category: 'Event Recording', thumbnail: T.studio, date: '2026-07-05', duration: '38:10', tags: ['Ghazal', 'Live', 'Vocals'], credits: 'Arjun Desai', featured: false, views: 1610, saves: 140 },
  { id: 'av-kabir-interview', creatorSlug: 'kabir-menon', url: 'https://youtu.be/L_jWHffIx5E', title: 'On Composing for the Sitar', description: 'A short interview on writing contemporary compositions for the sitar.', category: 'Interview', thumbnail: T.music, date: '2026-06-22', duration: '12:40', tags: ['Sitar', 'Composition', 'Interview'], credits: 'Kabir Menon', featured: false, views: 890, saves: 66 },
]

function resolveCreator(slug: string): Pick<ArchiveVideo, 'creatorName' | 'creatorAvatar' | 'creatorCategory' | 'verified'> {
  const a: PublicArtist | undefined = getMockArtist(slug)
  return {
    creatorName: a?.name ?? 'IICA Creator',
    creatorAvatar: a?.photo ?? '',
    creatorCategory: a ? profileCategory(a) : 'Artist',
    verified: a?.verified ?? false,
  }
}

function fromDemo(e: DemoEntry): ArchiveVideo {
  return {
    ...resolveCreator(e.creatorSlug),
    id: e.id,
    videoId: parseYouTubeId(e.url),
    url: e.url,
    title: e.title,
    description: e.description,
    category: e.category,
    thumbnail: e.thumbnail,
    date: e.date,
    duration: e.duration,
    tags: e.tags,
    credits: e.credits,
    featured: e.featured,
    views: e.views,
    saves: e.saves,
    creatorSlug: e.creatorSlug,
  }
}

// The signed-in creator's own Watch videos (live from their Portfolio).
export function ownerArchiveVideos(portfolio: Portfolio, ownerName: string): ArchiveVideo[] {
  return portfolio.media
    .filter((m) => m.type.includes('YouTube') && m.showInArchive !== false)
    .map((m) => {
      const videoId = parseYouTubeId(m.url)
      const category = m.category === 'Other' ? (m.customCategory || 'Showcase') : (m.category || 'Showcase')
      return {
        id: 'own-' + m.id,
        videoId,
        url: m.url,
        title: m.title || 'Untitled',
        description: m.description || '',
        category,
        thumbnail: m.thumbnail || (videoId ? youTubeThumb(videoId) : ''),
        date: m.releaseDate || '',
        duration: m.duration || '',
        tags: (m.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        credits: m.credits || '',
        featured: !!m.featured,
        views: 0,
        saves: 0,
        creatorSlug: portfolio.slug,
        creatorName: portfolio.basics.fullName || ownerName,
        creatorAvatar: portfolio.basics.photo,
        creatorCategory: 'Artist',
        verified: true,
      } as ArchiveVideo
    })
}

// Featured score — in-app signals only (views, saves, recency, featured flag).
// Never uses YouTube subscribers/followers or external popularity.
export function archiveFeaturedScore(v: ArchiveVideo): number {
  const days = v.date ? (Date.parse('2026-08-15') - Date.parse(v.date)) / 86_400_000 : 400
  const recency = Math.max(0, 120 - days) // fresher = higher
  return v.views + v.saves * 4 + (v.featured ? 800 : 0) + recency
}

// Build the full Archive list (owner videos override demo by videoId — a
// creator never appears twice for the same video).
export function buildArchive(owner?: ArchiveVideo[]): ArchiveVideo[] {
  const demo = ARCHIVE_DEMO.map(fromDemo)
  if (!owner || owner.length === 0) return demo
  const ownerIds = new Set(owner.map((o) => o.videoId).filter(Boolean))
  const deduped = demo.filter((d) => !d.videoId || !ownerIds.has(d.videoId))
  return [...owner, ...deduped]
}

export function getArchiveVideo(all: ArchiveVideo[], id?: string): ArchiveVideo | undefined {
  return all.find((v) => v.id === id)
}
