// ---- Search engine: match shared mock data against a parsed intent ----
// Groups results, applies structured filters, and (for Near Me) sorts by a
// believable simulated distance. Operates on the SAME records the rest of the
// app uses — no duplicate data.

import type { PublicArtist } from '../data/publicArtists'
import { effectiveCity, effectiveLocation, profileCategory, profileGenres, primaryGenre } from '../data/publicArtists'
import type { EventItem } from '../events/types'
import type { Product } from '../shop/types'
import type { ArchiveVideo } from '../data/archive'
import { cityDistanceKm } from '../lib/geo'
import { inr } from '../shop/pricing'
import type { ContentType, DateIntent, SearchIntent } from './parse'

export interface ResourceRecord {
  id: string
  title: string
  description: string
  cover: string
  category: string
  language: string
  year: string
  author: string
  creatorSlug: string
  creatorName: string
  creatorCity: string
}

export interface Sources {
  creators: PublicArtist[]
  events: EventItem[]
  products: Product[]
  archive: ArchiveVideo[]
  resources: ResourceRecord[]
}

export interface Hit {
  group: ContentType
  id: string
  title: string
  subtitle: string
  meta: string
  image?: string
  city?: string
  distanceKm?: number
  free?: boolean
  price?: number | null
  slug?: string
  eventId?: string
  productId?: string
  productType?: string
  videoUrl?: string
  resourceId?: string
  paid?: boolean
}

export type Grouped = Record<ContentType, Hit[]>

export const GROUP_ORDER: ContentType[] = ['creators', 'events', 'classes', 'products', 'archive', 'resources']
export const GROUP_LABEL: Record<ContentType, string> = {
  creators: 'Creators', events: 'Events', classes: 'Classes',
  products: 'Products', archive: 'Archive', resources: 'Free Resources',
}

// Build the flat free-resource list from creator profiles (single source).
export function buildResources(creators: PublicArtist[]): ResourceRecord[] {
  const out: ResourceRecord[] = []
  for (const a of creators) {
    for (const r of a.freeResources ?? []) {
      out.push({
        id: r.id, title: r.title, description: r.description, cover: r.cover,
        category: r.category, language: r.language, year: r.year, author: r.author || a.name,
        creatorSlug: a.slug, creatorName: a.name, creatorCity: effectiveCity(a),
      })
    }
  }
  return out
}

// ---- date helpers (prototype, uses the app's real current date) ----
function minTicketPrice(ev: EventItem): number | null {
  if (!ev.paid) return 0
  const prices = (ev.tickets ?? []).map((t) => t.price).filter((n) => n > 0)
  return prices.length ? Math.min(...prices) : null
}

function hashDays(id: string, span: number): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff
  return h % span
}

// Effective event date for search date-intent filtering (Today / This week /
// This weekend / Upcoming). Prototype seed data holds fixed 2026 dates that may
// be far from the app's real current date, so — per the spec — we deterministically
// project every event into a believable rolling 0–13 day window from today.
// This never mutates the stored event; the event's own screens still show its
// real date.
export function eventDate(ev: EventItem, now: Date): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + hashDays(ev.id, 7)) // 0–6 days out (this week)
  return d
}

function matchesDate(d: Date, intent: DateIntent, now: Date): boolean {
  if (!intent) return true
  const day = 24 * 60 * 60 * 1000
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.floor((d.getTime() - startOfToday.getTime()) / day)
  if (intent === 'today') return diffDays === 0
  if (intent === 'upcoming') return d >= startOfToday
  if (intent === 'thisWeek') return diffDays >= 0 && diffDays <= 7
  if (intent === 'thisWeekend') {
    // next Sat/Sun (or this one if today is the weekend)
    const dow = d.getDay() // 0 Sun .. 6 Sat
    return diffDays >= 0 && diffDays <= 7 && (dow === 0 || dow === 6)
  }
  return true
}

// ---- text matching ----
function tokens(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean)
}
// Every free-text token must appear somewhere in the haystack (AND).
function textMatch(text: string, haystack: string): boolean {
  if (!text.trim()) return true
  const hay = haystack.toLowerCase()
  return tokens(text).every((tk) => hay.includes(tk))
}
function eq(a: string, b: string) { return a.toLowerCase() === b.toLowerCase() }
function has(haystack: string, needle: string) { return haystack.toLowerCase().includes(needle.toLowerCase()) }
// Loose genre match: any word of the genre appearing in the haystack (so
// "Classical Music" matches an item tagged "Classical" or "Music").
function genreMatch(haystack: string, genre: string): boolean {
  const hay = haystack.toLowerCase()
  return genre.toLowerCase().split(/\s+/).some((w) => w.length > 2 && hay.includes(w))
}

const wanted = (intent: SearchIntent, g: ContentType) => intent.types.length === 0 || intent.types.includes(g)

export function search(intent: SearchIntent, src: Sources, origin: string, now = new Date()): Grouped {
  const priceCap = intent.maxPrice
  const grouped: Grouped = { creators: [], events: [], classes: [], products: [], archive: [], resources: [] }

  // ---- Creators ----
  if (wanted(intent, 'creators') && !intent.free && !intent.paid && priceCap === null && !intent.date) {
    for (const a of src.creators) {
      const genres = profileGenres(a)
      const hay = [a.name, profileCategory(a), genres.join(' '), effectiveLocation(a), a.headline, (a.tags ?? []).join(' ')].join(' ')
      if (!textMatch(intent.text, hay)) continue
      if (intent.category && !eq(profileCategory(a), intent.category)) continue
      if (intent.genre && !genres.some((g) => eq(g, intent.genre)) && !genreMatch(hay, intent.genre)) continue
      if (intent.city && !eq(effectiveCity(a), intent.city)) continue
      if (intent.country && !has(effectiveLocation(a), intent.country)) continue
      grouped.creators.push({
        group: 'creators', id: a.slug, slug: a.slug, title: a.name,
        subtitle: `${profileCategory(a)} · ${primaryGenre(a)}`, meta: effectiveCity(a),
        image: a.photo, city: effectiveCity(a),
      })
    }
  }

  // ---- Events ----
  if (wanted(intent, 'events') && priceCap !== undefined) {
    for (const ev of src.events) {
      if (ev.status && ev.status !== 'published') continue
      const price = minTicketPrice(ev)
      const hay = [ev.title, ev.category, (ev.tags ?? []).join(' '), ev.city ?? '', ev.country ?? '', ev.venueName ?? '', ev.organiserName ?? '', ev.format].join(' ')
      if (!textMatch(intent.text, hay)) continue
      if (intent.eventCategory && !eq(ev.category, intent.eventCategory)) continue
      if (intent.genre && !genreMatch(hay, intent.genre)) continue
      if (intent.city && !eq(ev.city ?? '', intent.city)) continue
      if (intent.country && !eq(ev.country ?? '', intent.country)) continue
      if (intent.free && ev.paid) continue
      if (intent.paid && !ev.paid) continue
      if (priceCap !== null && price !== null && price > priceCap) continue
      const d = eventDate(ev, now)
      if (!matchesDate(d, intent.date, now)) continue
      grouped.events.push({
        group: 'events', id: ev.id, eventId: ev.id, title: ev.title,
        subtitle: `${ev.category} · ${ev.city ?? ev.format}`,
        meta: ev.paid ? (price !== null ? inr(price) : 'Paid') : 'Free',
        image: ev.cover, city: ev.city, paid: ev.paid, price,
      })
    }
  }

  // ---- Classes (Masterclass products) + Products (Digital/Physical) ----
  if (priceCap !== undefined) {
    for (const p of src.products) {
      if (p.status && p.status !== 'published') continue
      const isClass = p.type === 'Masterclass'
      const g: ContentType = isClass ? 'classes' : 'products'
      if (!wanted(intent, g)) continue
      const hay = [p.title, p.category, p.subcategory, (p.tags ?? []).join(' '), p.sellerName, p.language ?? '', p.summary].join(' ')
      if (!textMatch(intent.text, hay)) continue
      if (intent.genre && !genreMatch(hay, intent.genre)) continue
      if (intent.free && !p.free) continue
      if (intent.paid && p.free) continue
      if (priceCap !== null && !p.free && p.price > priceCap) continue
      // A concrete city/country query shouldn't surface non-located products.
      if (intent.city || intent.country) continue
      grouped[g].push({
        group: g, id: p.id, productId: p.id, productType: p.type, title: p.title,
        subtitle: `${p.type} · ${p.category}`,
        meta: p.free ? 'Free' : inr(p.price), image: p.cover, free: p.free, price: p.price,
      })
    }
  }

  // ---- Archive videos ----
  if (wanted(intent, 'archive') && !intent.free && !intent.paid && priceCap === null && !intent.date) {
    for (const v of src.archive) {
      const hay = [v.title, v.creatorName, v.category, (v.tags ?? []).join(' '), v.description].join(' ')
      if (!textMatch(intent.text, hay)) continue
      if (intent.genre && !genreMatch(hay, intent.genre)) continue
      if (intent.category && !eq(v.creatorCategory, intent.category)) continue
      if (intent.city || intent.country) continue
      grouped.archive.push({
        group: 'archive', id: v.id, videoUrl: v.url, slug: v.creatorSlug, title: v.title,
        subtitle: `${v.creatorName} · ${v.category}`, meta: v.duration, image: v.thumbnail,
      })
    }
  }

  // ---- Free resources ----
  if (wanted(intent, 'resources') && !intent.paid && priceCap !== undefined) {
    for (const r of src.resources) {
      const hay = [r.title, r.author, r.category, r.language, r.description, r.creatorName].join(' ')
      if (!textMatch(intent.text, hay)) continue
      if (intent.genre && !genreMatch(hay, intent.genre)) continue
      if (intent.category && !intent.types.includes('resources')) {
        // "e-books by artists" — allow, category is loose for resources.
      }
      if (intent.city || intent.country) continue
      grouped.resources.push({
        group: 'resources', id: r.id, resourceId: r.id, slug: r.creatorSlug, title: r.title,
        subtitle: `${r.author} · ${r.category || 'PDF'}`, meta: 'Free', image: r.cover, free: true,
      })
    }
  }

  // ---- Near Me: annotate + sort by distance where a city exists ----
  if (intent.nearMe && origin) {
    for (const g of GROUP_ORDER) {
      grouped[g].forEach((h) => { if (h.city) h.distanceKm = cityDistanceKm(origin, h.city) })
      grouped[g].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    }
  }

  return grouped
}

export function totalCount(g: Grouped): number {
  return GROUP_ORDER.reduce((n, k) => n + g[k].length, 0)
}
