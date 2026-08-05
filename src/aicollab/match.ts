import type { CollaborationRequirement, CollaborationMatch, MatchCreator, MatchLabel } from './types'
import { NOT_SPECIFIED, ANY_LOCATION } from './types'
import { eligibleCreators } from './creators'

// Weights (sum 100) — kept as a readable config, not exposed to users.
const W = { skillGenre: 35, roleCategory: 20, locationFormat: 20, availability: 15, preference: 10 }

// Generic words that would otherwise make every craft "overlap" (e.g. every
// music genre shares "music"). Ignored when comparing by word tokens.
const STOP = new Set(['music', 'art', 'arts', 'the', 'and', 'of', 'a', 'an', 'experiences', 'artist'])
const tokens = (s: string) => s.toLowerCase().split(/[^a-z]+/).filter((t) => t.length > 2 && !STOP.has(t))
// Light stemming: two tokens relate if they share a long-enough prefix, so
// word-forms of the same craft connect (photographer~photography,
// guitarist~guitar, singer~sing, classical~classic) without over-matching
// unrelated words (classical vs contemporary → prefix 1, no match).
const prefixLen = (a: string, b: string) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i }
const tokRel = (a: string, b: string) => {
  if (a === b) return true
  const p = prefixLen(a, b)
  return p >= 5 && (p >= a.length - 3 || p >= b.length - 3)
}
// Two labels relate if one contains the other OR they share a meaningful word
// token ("Indian Classical" ~ "Classical Music" via "classical").
const rel = (x: string, s: string) => {
  const a = x.toLowerCase(), b = s.toLowerCase()
  if (a.includes(b) || b.includes(a)) return true
  const ts = tokens(s)
  return tokens(x).some((tx) => ts.some((t) => tokRel(tx, t)))
}
const has = (arr: string[], s: string) => arr.some((x) => rel(x, s))
const specified = (v: string) => v && v !== NOT_SPECIFIED && v !== ANY_LOCATION

function labelFor(score: number): MatchLabel {
  if (score >= 75) return 'Strong Match'
  if (score >= 55) return 'Good Match'
  return 'Possible Match'
}

function scoreCreator(req: CollaborationRequirement, c: MatchCreator) {
  const reasons: string[] = []
  const b: Record<string, number> = {}

  // Skill / Genre relevance (35)
  let sg = 0
  const genreHit = specified(req.genre) && (has(c.genres, req.genre) || has([c.primaryDomain], req.genre))
  const skillHit = specified(req.skill) && has(c.skills, req.skill)
  if (genreHit) sg += 0.6
  if (skillHit) sg += 0.4
  if (!genreHit && !skillHit && specified(req.role) && has([c.primaryDomain, ...c.genres, ...c.skills], req.role)) sg += 0.5
  b.skillGenre = Math.round(sg * W.skillGenre)
  if (genreHit || skillHit) reasons.push(`${c.primaryDomain} creator matching your ${specified(req.genre) ? req.genre : req.skill}`)

  // Role / membership category relevance (20)
  let rc = 0
  if (specified(req.role) && has([c.primaryDomain, ...c.skills, ...c.genres, c.category], req.role)) rc = 1
  else if (has([c.category], req.role)) rc = 1
  b.roleCategory = Math.round(rc * W.roleCategory)

  // Location + format compatibility (20)
  let lf = 0
  if (req.location === ANY_LOCATION || !specified(req.location)) lf += 0.5
  else if (req.location === 'Near Me') lf += 0.4
  else if (c.city.toLowerCase() === req.location.toLowerCase()) { lf += 1; reasons.push(`Based in ${c.city}`) }
  if (req.format === 'Flexible' || req.format === c.format || c.format === 'Hybrid' || (req.format === 'Online')) lf = Math.min(1, lf + 0.4)
  b.locationFormat = Math.round(Math.min(1, lf) * W.locationFormat)
  if (req.format === 'Online' && (c.format === 'Online' || c.format === 'Hybrid')) reasons.push('Open to online collaboration')

  // Availability (15)
  let av = 0
  if (c.availability === 'Available') av = 1
  else if (c.availability === 'Selectively Available') av = 0.7
  else av = 0.2
  b.availability = Math.round(av * W.availability)
  if (c.availability === 'Available') reasons.push('Currently available')

  // Collaboration preference / portfolio relevance (10)
  const pref = c.collabEnabled ? (c.genres.length > 1 ? 1 : 0.7) : 0
  b.preference = Math.round(pref * W.preference)

  const score = Math.min(100, b.skillGenre + b.roleCategory + b.locationFormat + b.availability + b.preference)
  if (reasons.length === 0) reasons.push(`${c.category} · ${c.primaryDomain}`)
  return { score, reasons: reasons.slice(0, 3), breakdown: b }
}

// Local prototype matcher. Returns believable, sorted matches. A creator must
// show REAL relevance (skill/genre, role/category, or a location match) to
// appear — availability/preference alone never qualifies. Weak results are
// dropped rather than padding the screen.
export function matchCreators(req: CollaborationRequirement, floor = 50): CollaborationMatch[] {
  // A creator must share the requested craft (skill/genre) or role/category to
  // appear. Location boosts the score but never qualifies a creator on its own
  // (so a Mumbai model doesn't surface for "classical singer in Mumbai").
  // If the requirement names no craft/role at all, fall back to score only.
  const hasCraft = specified(req.skill) || specified(req.genre) || specified(req.role)
  return eligibleCreators()
    .map((c) => {
      const { score, reasons, breakdown } = scoreCreator(req, c)
      const relevant = !hasCraft || breakdown.skillGenre > 0 || breakdown.roleCategory > 0
      return { m: { requirementId: req.id, creatorId: c.slug, score, label: labelFor(score), reasons, breakdown }, relevant }
    })
    .filter((x) => x.relevant && x.m.score >= floor)
    .map((x) => x.m)
    .sort((a, b) => b.score - a.score)
}

export function explainMatch(m: CollaborationMatch): string {
  return m.reasons.join(' · ')
}
