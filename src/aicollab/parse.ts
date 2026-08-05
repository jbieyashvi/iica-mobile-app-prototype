import type { CollaborationRequirement, CollabFormat } from './types'
import { NOT_SPECIFIED, ANY_LOCATION, FLEXIBLE } from './types'

// Known cities (aligns with the catalogue). Extend freely.
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Bangalore', 'Chennai', 'Pune', 'Jaipur', 'Kolkata', 'Hyderabad', 'Goa', 'Ujjain', 'Indore', 'Kochi', 'Ahmedabad']

// role phrase → { role label, genre, category, skill }
const ROLE_RULES: { re: RegExp; role: string; genre?: string; skill?: string; category?: string }[] = [
  { re: /classical singer|classical vocalist/i, role: 'Classical Singer', genre: 'Indian Classical', skill: 'Vocals', category: 'Artist' },
  { re: /singer|vocalist/i, role: 'Singer', genre: 'Contemporary Music', skill: 'Vocals', category: 'Artist' },
  { re: /guitar/i, role: 'Guitarist', genre: 'Contemporary Music', skill: 'Guitar', category: 'Artist' },
  { re: /tabla|percussion|dholak/i, role: 'Percussionist', genre: 'Classical Music', skill: 'Percussion', category: 'Artist' },
  { re: /sitar/i, role: 'Sitarist', genre: 'Classical Music', skill: 'Sitar', category: 'Artist' },
  { re: /dance instructor|dance teacher|choreographer/i, role: 'Dance Instructor', genre: 'Dance', skill: 'Choreography', category: 'Artist' },
  { re: /dancer|bharatanatyam|kathak/i, role: 'Dancer', genre: 'Dance', skill: 'Performance', category: 'Artist' },
  { re: /photographer|photography/i, role: 'Photographer', genre: 'Photography', skill: 'Photography', category: 'Artist' },
  { re: /filmmaker|film maker|videographer|cinematograph/i, role: 'Filmmaker', genre: 'Film', skill: 'Direction', category: 'Artist' },
  { re: /painter|muralist|illustrat|visual artist/i, role: 'Visual Artist', genre: 'Visual Arts', skill: 'Illustration', category: 'Artist' },
  { re: /yoga/i, role: 'Yoga Coach', genre: 'Yoga', skill: 'Yoga', category: 'Yoga Coach' },
  { re: /musician|music collaborat|composer|producer/i, role: 'Musician', genre: 'Contemporary Music', skill: 'Composition', category: 'Artist' },
  { re: /model/i, role: 'Model', genre: 'Fashion', skill: 'Modelling', category: 'Model' },
  { re: /athlete|cricket|badminton/i, role: 'Athlete', skill: 'Sports', category: 'Athlete' },
]

const GENRE_HINTS: { re: RegExp; genre: string }[] = [
  { re: /classical/i, genre: 'Indian Classical' },
  { re: /folk/i, genre: 'Folk' },
  { re: /fusion/i, genre: 'Fusion' },
  { re: /contemporary/i, genre: 'Contemporary' },
  { re: /devotional|bhajan|aarti/i, genre: 'Devotional' },
  { re: /jazz/i, genre: 'Jazz' },
  { re: /hip.?hop|rap/i, genre: 'Hip-Hop' },
]

const DATE_PHRASES: { re: RegExp; label: string }[] = [
  { re: /this weekend|weekend/i, label: 'This Weekend' },
  { re: /next month/i, label: 'Next Month' },
  { re: /next week/i, label: 'Next Week' },
  { re: /tomorrow/i, label: 'Tomorrow' },
  { re: /today/i, label: 'Today' },
  { re: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i, label: '' }, // month name → captured below
]

function titleCase(s: string) { return s.replace(/\b\w/g, (c) => c.toUpperCase()) }

// Rule-based extraction. Never fabricates critical info: unstated fields use
// NOT_SPECIFIED / ANY_LOCATION / FLEXIBLE. Same shape a future NLP API returns.
export function parseRequirement(text: string): Omit<CollaborationRequirement, 'id' | 'createdByUserId' | 'createdAt'> {
  const t = text.trim()
  const lc = t.toLowerCase()

  // Role / genre / skill / category
  const roleRule = ROLE_RULES.find((r) => r.re.test(t))
  const role = roleRule?.role || NOT_SPECIFIED
  let genre = roleRule?.genre || ''
  const genreHint = GENRE_HINTS.find((g) => g.re.test(t))
  if (genreHint) genre = genreHint.genre
  if (!genre) genre = NOT_SPECIFIED
  const skill = roleRule?.skill || NOT_SPECIFIED

  // Location + Near Me
  const nearMe = /near me|nearby|around me|close by/i.test(t)
  let location = nearMe ? 'Near Me' : ANY_LOCATION
  if (!nearMe) {
    const found = CITIES.find((c) => new RegExp(`\\b${c}\\b`, 'i').test(t))
    if (found) location = found === 'Bangalore' ? 'Bengaluru' : found
  }
  const country = location === ANY_LOCATION || location === 'Near Me' ? 'India' : 'India'

  // Format
  let format: CollabFormat = FLEXIBLE
  if (/\bonline\b|virtual|remote|zoom|google meet/i.test(t)) format = 'Online'
  else if (/hybrid/i.test(t)) format = 'Hybrid'
  else if (/in.?person|on.?site|venue|event|studio|shoot|stage|concert/i.test(t)) format = 'In Person'

  // Date
  let preferredDate = NOT_SPECIFIED
  for (const d of DATE_PHRASES) {
    const m = t.match(d.re)
    if (m) { preferredDate = d.label || titleCase(m[0]); break }
  }

  // Budget (₹ amount or "budget ...")
  let budget = NOT_SPECIFIED
  const money = t.match(/₹\s?[\d,]+|(?:rs\.?|inr)\s?[\d,]+|\b\d{3,6}\s?(?:budget|rupees)/i)
  if (money) budget = money[0].replace(/\s+/g, ' ').trim()

  // Purpose
  let purpose = NOT_SPECIFIED
  if (/corporate event/i.test(t)) purpose = 'Corporate Event'
  else if (/workshop/i.test(t)) purpose = 'Workshop'
  else if (/wedding/i.test(t)) purpose = 'Wedding'
  else if (/recording|single|album|ep\b/i.test(t)) purpose = 'Recording'
  else if (/collaborat/i.test(t)) purpose = 'Collaboration'
  else if (/event|concert|show|performance/i.test(t)) purpose = 'Event'

  // Availability phrase (light)
  const availability = /this weekend|weekend|urgent|immediately|asap/i.test(t) ? 'Soon' : FLEXIBLE

  // Additional keywords (nouns not already captured)
  const stop = new Set(['i', 'need', 'a', 'an', 'the', 'for', 'in', 'looking', 'to', 'with', 'and', 'of', 'my', 'me', 'is', 'am', 'on', 'at', 'who'])
  const keywords = Array.from(new Set(
    lc.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !stop.has(w)),
  )).slice(0, 12)

  return {
    originalText: t,
    role, skill, genre, location, country, nearMe, format,
    preferredDate, availability, budget, purpose,
    additionalDetails: '',
    keywords,
  }
}
