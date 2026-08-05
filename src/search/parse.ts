// ---- Rule-based natural-language search parser (prototype) ----
//
// This is a deterministic keyword/pattern parser — NOT AI. It extracts a
// structured intent from a free-text query so the engine can filter the shared
// mock data. Unknown words are kept as free-text tokens for title/keyword
// matching.

import { MEMBERSHIP_CATEGORIES } from '../config/categories'
import { CATALOGUE_GENRES, CATALOGUE_LOCATIONS } from '../config/catalogue'
import { CITY_COORDS } from '../lib/geo'

export type ContentType = 'creators' | 'events' | 'classes' | 'products' | 'archive' | 'resources'
export type DateIntent = 'today' | 'thisWeek' | 'thisWeekend' | 'upcoming' | ''

export interface SearchIntent {
  raw: string
  text: string // leftover free-text (recognised tokens removed)
  types: ContentType[] // empty = all groups
  category: string // membership category (creators)
  genre: string
  eventCategory: string
  city: string
  country: string
  nearMe: boolean
  free: boolean
  paid: boolean
  maxPrice: number | null
  date: DateIntent
}

const CITIES = Array.from(new Set([...CATALOGUE_LOCATIONS, ...Object.keys(CITY_COORDS)]))

// Content-type keyword → group. Order matters (longer/more specific first).
const TYPE_WORDS: [RegExp, ContentType][] = [
  [/\b(masterclass(es)?|classes|class|courses?|lessons?)\b/, 'classes'],
  [/\b(e-?books?|pdfs?|free resources?|resources?|workbooks?|guides?)\b/, 'resources'],
  [/\b(videos?|archive|clips?|watch)\b/, 'archive'],
  [/\b(events?|concerts?|gigs?|jams?|baithaks?|shows?|meet(\s?&?\s?greet)?)\b/, 'events'],
  [/\b(workshops?)\b/, 'events'],
  [/\b(products?|kits?|journals?|packs?|merch(andise)?)\b/, 'products'],
  [/\b(artists?|creators?|models?|coaches?|coach|athletes?|musicians?|dancers?|performers?|people)\b/, 'creators'],
]

// Free-text keyword → membership category.
const CATEGORY_WORDS: [RegExp, string][] = [
  [/\byoga coach(es)?\b/, 'Yoga Coach'], // "yoga" alone stays a genre
  [/\bmodels?\b/, 'Model'],
  [/\bathletes?\b/, 'Athlete'],
  [/\bfitness( champion)?\b/, 'Fitness Champion'],
  [/\b(sports? coach|trainers?)\b/, 'Sports Coach/Trainer/Enthusiast'],
  [/\b(legacy brand|brands?)\b/, 'Legacy Brand of Impact'],
  [/\bvip host\b/, 'VIP Host'],
  [/\bvip venue\b/, 'VIP Venue'],
  [/\bvip connoisseur\b/, 'VIP Connoisseur'],
  [/\bvip manager\b/, 'VIP Manager'],
  [/\bartists?\b/, 'Artist'],
]

// Event-category keywords.
const EVENT_CAT_WORDS: [RegExp, string][] = [
  [/\bconcerts?\b/, 'Concert'],
  [/\bgigs?\b/, 'LIVE Gig'],
  [/\bworkshops?\b/, 'Workshop'],
  [/\bjams?\b/, 'Music Jam'],
  [/\bbaithaks?\b/, 'In-door Baithak'],
  [/\bpainting( session)?\b/, 'Painting Session'],
]

// Broad genre keywords in addition to the exact catalogue genres.
const GENRE_WORDS: [RegExp, string][] = [
  [/\bclassical( music)?\b/, 'Classical Music'],
  [/\bfolk( music| art)?\b/, 'Folk Music'],
  [/\bcontemporary\b/, 'Contemporary Music'],
  [/\bdevotional\b/, 'Devotional'],
  [/\bbharatanatyam\b/, 'Bharatanatyam'],
  [/\bkathak\b/, 'Kathak'],
  [/\btheatre\b/, 'Theatre'],
  [/\bphotography\b/, 'Photography'],
  [/\bfilm\b/, 'Film'],
  [/\bmusic\b/, 'Music'],
  [/\bdance\b/, 'Dance'],
  [/\byoga\b/, 'Yoga'],
  [/\bfitness\b/, 'Fitness'],
]

const STOPWORDS = new Set([
  'in', 'at', 'the', 'a', 'an', 'of', 'for', 'to', 'me', 'my', 'near', 'by',
  'with', 'and', 'or', 'this', 'find', 'show', 'search', 'all', 'some', 'any',
  'under', 'below', 'less', 'than', 'over', 'above', 'upcoming', 'free', 'paid',
])

function stripFirst(text: string, re: RegExp): { text: string; hit: boolean } {
  if (re.test(text)) return { text: text.replace(re, ' '), hit: true }
  return { text, hit: false }
}

export function parseQuery(raw: string): SearchIntent {
  const original = raw
  let t = ' ' + raw.toLowerCase().replace(/[,]/g, ' ') + ' '

  const intent: SearchIntent = {
    raw: original, text: '', types: [], category: '', genre: '', eventCategory: '',
    city: '', country: '', nearMe: false, free: false, paid: false, maxPrice: null, date: '',
  }

  // Near me
  if (/\b(near me|nearby|around me|close to me)\b/.test(t)) {
    intent.nearMe = true
    t = t.replace(/\b(near me|nearby|around me|close to me)\b/g, ' ')
  }

  // Free / paid
  if (/\bfree\b/.test(t)) intent.free = true
  if (/\bpaid\b/.test(t)) intent.paid = true

  // Max price: "under 500", "below ₹1000", "less than 500", "under rs 500"
  const priceMatch = t.match(/(?:under|below|less than|upto|up to|max)\s*(?:₹|rs\.?|inr)?\s*(\d{2,6})/)
  if (priceMatch) intent.maxPrice = parseInt(priceMatch[1], 10)

  // Date intents (strip the phrase so leftover free-text stays clean)
  if (/\bthis weekend\b/.test(t)) { intent.date = 'thisWeekend'; t = t.replace(/\bthis weekend\b/g, ' ') }
  else if (/\bthis week\b/.test(t)) { intent.date = 'thisWeek'; t = t.replace(/\bthis week\b/g, ' ') }
  else if (/\b(today|tonight)\b/.test(t)) { intent.date = 'today'; t = t.replace(/\b(today|tonight)\b/g, ' ') }
  else if (/\b(upcoming|soon|next)\b/.test(t)) { intent.date = 'upcoming'; t = t.replace(/\b(upcoming|soon|next)\b/g, ' ') }

  // City (match whole-word city names)
  for (const c of CITIES) {
    const re = new RegExp(`\\b${c.toLowerCase()}\\b`)
    if (re.test(t)) { intent.city = c; t = t.replace(re, ' '); break }
  }
  // Country (prototype pool is India-centric)
  if (/\bindia\b/.test(t)) { intent.country = 'India'; t = t.replace(/\bindia\b/g, ' ') }

  // Membership category FIRST (consume the words so a category term like
  // "yoga coach" isn't also read as the genre "yoga").
  for (const c of MEMBERSHIP_CATEGORIES) {
    const re = new RegExp(`\\b${c.toLowerCase().replace(/[/]/g, ' ')}\\b`)
    if (re.test(t)) { intent.category = c; t = t.replace(re, ' '); break }
  }
  if (!intent.category) {
    for (const [re, cat] of CATEGORY_WORDS) {
      const r = stripFirst(t, re)
      if (r.hit) { intent.category = cat; t = r.text; break }
    }
  }

  // Exact catalogue genres (multi-word), then broad genre words.
  for (const g of CATALOGUE_GENRES) {
    const re = new RegExp(`\\b${g.toLowerCase()}\\b`)
    if (re.test(t)) { intent.genre = g; t = t.replace(re, ' '); break }
  }
  if (!intent.genre) {
    for (const [re, g] of GENRE_WORDS) {
      const r = stripFirst(t, re)
      if (r.hit) { intent.genre = g; t = r.text; break }
    }
  }

  // Event category
  for (const [re, ec] of EVENT_CAT_WORDS) {
    if (re.test(t)) { intent.eventCategory = ec; break }
  }

  // Content types (collect all matches, don't strip — a word may map a type
  // AND a category, e.g. "models").
  const types = new Set<ContentType>()
  for (const [re, ty] of TYPE_WORDS) if (re.test(t)) types.add(ty)
  // Event category / date free-paid imply events.
  if (intent.eventCategory) types.add('events')
  // A membership category implies creators unless another concrete type is set.
  if (intent.category && types.size === 0) types.add('creators')
  intent.types = Array.from(types)

  // Leftover free-text: remove recognised type/category/genre words + stopwords.
  let leftover = t
  for (const [re] of [...TYPE_WORDS, ...CATEGORY_WORDS, ...EVENT_CAT_WORDS, ...GENRE_WORDS]) {
    leftover = leftover.replace(new RegExp(re.source, 'g'), ' ')
  }
  leftover = leftover
    .replace(/(?:under|below|less than|upto|up to|max)\s*(?:₹|rs\.?|inr)?\s*\d{2,6}/g, ' ')
    .replace(/[₹]/g, ' ')
  intent.text = leftover
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && !/^\d+$/.test(w))
    .join(' ')
    .trim()

  return intent
}
