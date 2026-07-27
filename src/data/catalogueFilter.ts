// ---- Shared Artist Catalogue filtering utilities ----
// Single source of truth for filtering, dynamic A–Z derivation and featured
// ranking. Consumed by BOTH the full Catalogue (Explore → Artists) and the
// compact Home catalogue section — there is no second implementation.

import { PublicArtist, effectiveCity, profileCategory, profileGenres, publicArtists } from './publicArtists'
import { featuredScore } from '../config/catalogue'

export interface CatalogueFilters {
  category: string
  location: string
  genre: string
}

export interface CatalogueState {
  q: string
  filters: CatalogueFilters
  letter: string
}

export const NO_FILTERS: CatalogueFilters = { category: '', location: '', genre: '' }

export const CATALOGUE_POOL: PublicArtist[] = publicArtists

// First display letter: strip leading punctuation/space, uppercase; digits /
// symbols collapse to '#'. Case-insensitive.
export function initialOf(name: string): string {
  const s = name.trim().replace(/^[^A-Za-z0-9]+/, '')
  const c = (s.charAt(0) || '').toUpperCase()
  if (c >= 'A' && c <= 'Z') return c
  if (c >= '0' && c <= '9') return '#'
  return c || '#'
}

export function activeFilterCount(f: CatalogueFilters): number {
  return (f.category ? 1 : 0) + (f.location ? 1 : 0) + (f.genre ? 1 : 0)
}

// Pipeline: search → category → location → genre. Never mutates.
export function filterProfiles(pool: PublicArtist[], q: string, f: CatalogueFilters): PublicArtist[] {
  let r = pool
  const query = q.trim().toLowerCase()
  if (query) {
    r = r.filter((a) =>
      (a.name + ' ' + profileCategory(a) + ' ' + profileGenres(a).join(' ') + ' ' + effectiveCity(a) + ' ' + a.headline + ' ' + a.primaryDomain)
        .toLowerCase().includes(query),
    )
  }
  if (f.category) r = r.filter((a) => profileCategory(a) === f.category)
  if (f.location) r = r.filter((a) => effectiveCity(a).toLowerCase() === f.location.toLowerCase())
  if (f.genre) r = r.filter((a) => profileGenres(a).some((g) => g.toLowerCase() === f.genre.toLowerCase()))
  return r
}

// Distinct available letters (sorted) from the filtered set.
export function deriveLetters(filtered: PublicArtist[]): string[] {
  const set = new Set<string>()
  filtered.forEach((a) => set.add(initialOf(a.name)))
  return Array.from(set).sort()
}

// Apply the selected letter and sort alphabetically by display name.
export function applyLetter(filtered: PublicArtist[], letter: string): PublicArtist[] {
  const r = letter === 'All' ? filtered : filtered.filter((a) => initialOf(a.name) === letter)
  return [...r].sort((a, b) => a.name.localeCompare(b.name))
}

// Featured = highest in-app activity score (never follower counts).
export function topFeatured(pool: PublicArtist[], n = 5): PublicArtist[] {
  return [...pool].sort((a, b) => featuredScore(b.activity) - featuredScore(a.activity)).slice(0, n)
}

// ---- URL state carry (Home → full Catalogue) ----
export function toCatalogueQuery(s: Partial<CatalogueState>): string {
  const p = new URLSearchParams()
  if (s.q) p.set('q', s.q)
  if (s.filters?.category) p.set('category', s.filters.category)
  if (s.filters?.location) p.set('location', s.filters.location)
  if (s.filters?.genre) p.set('genre', s.filters.genre)
  if (s.letter && s.letter !== 'All') p.set('letter', s.letter)
  const str = p.toString()
  return str ? `?${str}` : ''
}

export function fromCatalogueParams(params: URLSearchParams): CatalogueState | null {
  const q = params.get('q')
  const category = params.get('category')
  const location = params.get('location')
  const genre = params.get('genre')
  const letter = params.get('letter')
  if (!q && !category && !location && !genre && !letter) return null
  return {
    q: q ?? '',
    filters: { category: category ?? '', location: location ?? '', genre: genre ?? '' },
    letter: letter ?? 'All',
  }
}
