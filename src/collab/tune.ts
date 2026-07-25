// ---- Tune Matches filtering (prototype, user-facing) ----
// Refines the recommendation queue from simple, friendly inputs. Never exposes
// scores/weights/distance. Never returns near-zero: relaxes conditions and
// flags when broader alternatives were used.

import { Candidate, TuneFilters } from './types'
import { getMockArtist, profileCategory } from '../data/publicArtists'

const NEAR_ME_CITY = 'Bengaluru' // prototype "home" city

export function tuneActive(t: TuneFilters): boolean {
  return t.lookingFor.length > 0 || !!t.category || t.locationType !== 'anywhere' || t.mode !== 'Any'
}

// Up to three short summaries (city/near, category, mode, first looking-for).
export function tuneSummary(t: TuneFilters): string[] {
  const parts: string[] = []
  if (t.locationType === 'city' && t.city) parts.push(t.city)
  else if (t.locationType === 'near') parts.push('Near Me')
  if (t.category) parts.push(t.category)
  if (t.mode !== 'Any') parts.push(t.mode)
  if (t.lookingFor[0]) parts.push(t.lookingFor[0])
  return parts
}

function catOf(id: string): string {
  const a = getMockArtist(id)
  return a ? profileCategory(a) : 'Artist'
}

// Filter/prioritise candidates. Category + location are the hard-ish signals;
// mode and looking-for stay soft (they colour the rationale, not exclusion).
export function filterCandidates(all: Candidate[], t: TuneFilters): { ids: string[]; relaxed: boolean } {
  const cityWanted = t.locationType === 'city' ? t.city : t.locationType === 'near' ? NEAR_ME_CITY : ''
  const matchCat = (c: Candidate) => !t.category || catOf(c.id) === t.category
  const matchCity = (c: Candidate) => !cityWanted || c.location.toLowerCase().startsWith(cityWanted.toLowerCase())

  const strict = all.filter((c) => matchCat(c) && matchCity(c))
  if (strict.length >= 1) {
    const relaxed = cityWanted !== '' && strict.length < 3
      ? false // still an exact set, just small
      : false
    return { ids: strict.map((c) => c.id), relaxed }
  }
  // Relax location first, keep category.
  const byCat = all.filter(matchCat)
  if (byCat.length >= 1) return { ids: byCat.map((c) => c.id), relaxed: true }
  // Last resort: everyone (broad alternatives).
  return { ids: all.map((c) => c.id), relaxed: true }
}

// One plain-language line appended to a candidate's rationale for active tuning.
export function tuneRationale(t: TuneFilters): string {
  const bits: string[] = []
  if (t.lookingFor[0]) bits.push(t.lookingFor[0].toLowerCase())
  if (t.mode !== 'Any') bits.push(t.mode.toLowerCase())
  if (bits.length === 0) return ''
  return `Matched to your interest in ${bits.join(' · ')}.`
}
