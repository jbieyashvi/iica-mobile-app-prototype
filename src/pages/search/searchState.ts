import { ContentType, SearchIntent } from '../../search/parse'

// User filter overrides layered on top of the parsed query intent.
export interface Overrides {
  type: ContentType | 'all' | null // type chip row (null = use parsed)
  price: 'free' | 'paid' | null // Free/Paid toggle
  clears: string[] // facet keys the user removed
}

export const EMPTY_OVERRIDES: Overrides = { type: null, price: null, clears: [] }

export function applyOverrides(parsed: SearchIntent, o: Overrides): SearchIntent {
  const e: SearchIntent = { ...parsed }
  if (o.type === 'all') e.types = []
  else if (o.type) e.types = [o.type]
  if (o.price === 'free') { e.free = true; e.paid = false }
  else if (o.price === 'paid') { e.paid = true; e.free = false }
  for (const k of o.clears) {
    if (k === 'category') e.category = ''
    else if (k === 'genre') e.genre = ''
    else if (k === 'eventCategory') e.eventCategory = ''
    else if (k === 'city') e.city = ''
    else if (k === 'country') e.country = ''
    else if (k === 'date') e.date = ''
    else if (k === 'price') e.maxPrice = null
    else if (k === 'free') e.free = false
    else if (k === 'paid') e.paid = false
    else if (k === 'near') e.nearMe = false
  }
  return e
}

export interface FacetChip {
  key: string
  label: string
  apply: (o: Overrides) => Overrides
}

const addClear = (o: Overrides, k: string): Overrides => ({ ...o, clears: [...o.clears, k] })

const DATE_LABEL: Record<string, string> = { today: 'Today', thisWeek: 'This week', thisWeekend: 'This weekend', upcoming: 'Upcoming' }

// Removable facet chips derived from the effective intent (type chips render
// separately, so they're excluded here).
export function facetChips(eff: SearchIntent): FacetChip[] {
  const out: FacetChip[] = []
  if (eff.category) out.push({ key: 'category', label: eff.category, apply: (o) => addClear(o, 'category') })
  if (eff.genre) out.push({ key: 'genre', label: eff.genre, apply: (o) => addClear(o, 'genre') })
  if (eff.eventCategory) out.push({ key: 'eventCategory', label: eff.eventCategory, apply: (o) => addClear(o, 'eventCategory') })
  if (eff.city) out.push({ key: 'city', label: eff.city, apply: (o) => addClear(o, 'city') })
  if (eff.country) out.push({ key: 'country', label: eff.country, apply: (o) => addClear(o, 'country') })
  if (eff.date) out.push({ key: 'date', label: DATE_LABEL[eff.date] ?? eff.date, apply: (o) => addClear(o, 'date') })
  if (eff.free) out.push({ key: 'free', label: 'Free', apply: (o) => ({ ...addClear(o, 'free'), price: o.price === 'free' ? null : o.price }) })
  if (eff.paid) out.push({ key: 'paid', label: 'Paid', apply: (o) => ({ ...addClear(o, 'paid'), price: o.price === 'paid' ? null : o.price }) })
  if (eff.maxPrice !== null) out.push({ key: 'price', label: `Under ₹${eff.maxPrice}`, apply: (o) => addClear(o, 'price') })
  if (eff.nearMe) out.push({ key: 'near', label: 'Near Me', apply: (o) => addClear(o, 'near') })
  return out
}

// ---- session-scoped state restore (query + overrides + scroll) ----
export interface SearchSnapshot {
  input: string
  committed: string
  overrides: Overrides
  scroll: number
}

const SKEY = 'iica_search_state_v1'

export function loadSearchState(): SearchSnapshot {
  try {
    const raw = sessionStorage.getItem(SKEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<SearchSnapshot>
      return {
        input: s.input ?? '',
        committed: s.committed ?? '',
        overrides: { ...EMPTY_OVERRIDES, ...(s.overrides ?? {}) },
        scroll: s.scroll ?? 0,
      }
    }
  } catch { /* ignore */ }
  return { input: '', committed: '', overrides: EMPTY_OVERRIDES, scroll: 0 }
}

export function saveSearchState(s: SearchSnapshot) {
  try { sessionStorage.setItem(SKEY, JSON.stringify(s)) } catch { /* ignore */ }
}
