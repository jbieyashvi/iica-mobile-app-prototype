import { publicArtists, effectiveCity, profileGenres, PublicArtist } from '../data/publicArtists'
import { generateIicaId } from '../state/AuthContext'
import type { MatchCreator, CollabFormat } from './types'

// Creators explicitly opted OUT of collaboration discovery (prototype flag).
// Used to prove collaboration-disabled creators are excluded from matches.
const COLLAB_DISABLED = new Set<string>(['meera-iyer', 'ishaan-roy'])

function countryOf(a: PublicArtist): string {
  const parts = (a.adminCorrectedLocation || a.location || '').split(',')
  return (parts[parts.length - 1] || 'India').trim() || 'India'
}
function formatOf(a: PublicArtist): CollabFormat {
  // Prototype heuristic from availability + domain; real data would store this.
  if (a.availability === 'Not Available') return 'Flexible'
  return a.primaryDomain === 'Music' || a.primaryDomain === 'Photography' ? 'Hybrid' : 'In Person'
}

function toMatchCreator(a: PublicArtist): MatchCreator {
  return {
    slug: a.slug,
    name: a.name,
    photo: a.photo,
    headline: a.headline,
    iicaId: generateIicaId(a.name), // deterministic, stable per name
    category: a.category || 'Artist',
    primaryDomain: a.primaryDomain,
    genres: profileGenres(a),
    skills: a.skills && a.skills.length ? a.skills : a.tags,
    city: effectiveCity(a),
    country: countryOf(a),
    availability: a.availability,
    format: formatOf(a),
    collabEnabled: !COLLAB_DISABLED.has(a.slug),
    visibility: a.visibility,
  }
}

// Only surface creators who are eligible collaboration targets:
//  - Public visibility (hidden / Members-Only profiles excluded)
//  - Collaboration discovery enabled
// (In the prototype every catalogue creator is an active, IICA-ID'd member;
//  a real backend would additionally filter suspended/expired/unpaid here.)
export function eligibleCreators(): MatchCreator[] {
  return publicArtists
    .filter((a) => a.visibility === 'Public' && !COLLAB_DISABLED.has(a.slug))
    .map(toMatchCreator)
}

export function getMatchCreator(slug?: string): MatchCreator | undefined {
  if (!slug) return undefined
  const a = publicArtists.find((x) => x.slug === slug)
  return a ? toMatchCreator(a) : undefined
}
