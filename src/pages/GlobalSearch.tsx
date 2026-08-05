import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search as SearchIcon, X, ChevronLeft, Clock, Sparkles, Navigation, Info, Loader2, MapPin, SlidersHorizontal,
} from 'lucide-react'
import { useSearchPrefs } from '../state/SearchContext'
import { useSearchSources } from '../search/useSearchSources'
import { parseQuery, ContentType } from '../search/parse'
import { search, GROUP_ORDER, GROUP_LABEL, totalCount, Grouped } from '../search/engine'
import { requestNearMe, CITY_COORDS } from '../lib/geo'
import { CATALOGUE_LOCATIONS } from '../config/catalogue'
import SearchHitRow from './search/SearchHitRow'
import {
  loadSearchState, saveSearchState, applyOverrides, Overrides, EMPTY_OVERRIDES, facetChips,
} from './search/searchState'

const PREVIEW = 4
const SUGGESTED = ['Artists Near Me', 'Upcoming Events', 'Free Workshops', 'Music Classes', 'Products Under ₹500', 'Latest Archive Videos']
const MANUAL_CITIES = Array.from(new Set([...CATALOGUE_LOCATIONS, ...Object.keys(CITY_COORDS)]))

export default function GlobalSearch() {
  const navigate = useNavigate()
  const prefs = useSearchPrefs()
  const sources = useSearchSources()
  const scrollRef = useRef<HTMLDivElement>(null)

  const restored = useMemo(() => loadSearchState(), [])
  const [input, setInput] = useState(restored.input)
  const [committed, setCommitted] = useState(restored.committed)
  const [overrides, setOverrides] = useState<Overrides>(restored.overrides)
  const [loading, setLoading] = useState(false)
  const [locOpen, setLocOpen] = useState(false)
  const [locStatus, setLocStatus] = useState<'idle' | 'requesting'>('idle')
  const [locNote, setLocNote] = useState('')
  const [toast, setToast] = useState('')

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const parsed = useMemo(() => parseQuery(committed), [committed])
  const eff = useMemo(() => applyOverrides(parsed, overrides), [parsed, overrides])

  const needsLocation = eff.nearMe && !prefs.city
  const grouped: Grouped = useMemo(
    () => (committed && !needsLocation ? search(eff, sources, prefs.city) : { creators: [], events: [], classes: [], products: [], archive: [], resources: [] }),
    [committed, needsLocation, eff, sources, prefs.city],
  )
  const count = totalCount(grouped)
  const chips = facetChips(eff)

  // persist + restore search state (query, overrides, scroll) for back-nav
  useEffect(() => { saveSearchState({ input, committed, overrides, scroll: scrollRef.current?.scrollTop ?? 0 }) }, [input, committed, overrides])
  useEffect(() => {
    if (restored.scroll && scrollRef.current) scrollRef.current.scrollTop = restored.scroll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // brief loading state on each committed query
  useEffect(() => {
    if (!committed) return
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 220)
    return () => clearTimeout(t)
  }, [committed, eff, prefs.city])

  const runSearch = (q: string) => {
    const query = q.trim()
    setInput(query)
    setCommitted(query)
    setOverrides(EMPTY_OVERRIDES)
    if (query) prefs.addRecent(query)
    scrollRef.current?.scrollTo({ top: 0 })
  }

  const clearInput = () => { setInput(''); setCommitted(''); setOverrides(EMPTY_OVERRIDES) }

  // ---- Near-Me location resolution ----
  const useMyLocation = async () => {
    setLocStatus('requesting'); setLocNote('')
    const res = await requestNearMe()
    setLocStatus('idle')
    if (res.ok) { prefs.setCity(res.city); setLocOpen(false); flash(`Location set to ${res.city}`) }
    else { setLocNote(res.reason === 'denied' ? 'Location access was blocked. Choose your city below.' : 'Couldn’t read your location. Choose your city below.') }
  }
  const chooseCity = (c: string) => { prefs.setCity(c); setLocOpen(false); flash(`Location set to ${c}`) }

  const setType = (t: ContentType | 'all') => setOverrides((o) => ({ ...o, type: o.type === t ? null : t }))
  const clearAllFilters = () => setOverrides(EMPTY_OVERRIDES)

  const visibleGroups = GROUP_ORDER.filter((g) => grouped[g].length > 0)
  const typeChips: (ContentType | 'all')[] = ['all', 'creators', 'events', 'classes', 'products', 'archive', 'resources']
  const effType = overrides.type

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header + search input */}
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-14 items-center gap-1">
          <button onClick={() => navigate(-1)} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <div className="flex h-10 flex-1 items-center gap-2 rounded-control border border-border bg-surface px-3">
            <SearchIcon className="h-4 w-4 text-muted" />
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(input) }}
              placeholder="Search creators, events, classes, products…"
              className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none"
              aria-label="Search"
            />
            {input && <button onClick={clearInput} aria-label="Clear search"><X className="h-4 w-4 text-muted" /></button>}
          </div>
          <button onClick={() => runSearch(input)} className="tap flex h-10 items-center rounded-control px-3 text-[13px] font-semibold text-brand hover:bg-black/[0.04]">Search</button>
        </div>
      </header>

      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        {/* ---- Idle: recent + suggested ---- */}
        {!committed ? (
          <div className="px-[18px] pt-4">
            {prefs.recent.length > 0 && (
              <section className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-[12px] font-bold uppercase tracking-wide text-muted">Recent</h2>
                  <button onClick={prefs.clearRecent} className="text-[12px] font-semibold text-brand">Clear all</button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {prefs.recent.map((r) => (
                    <div key={r} className="flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2">
                      <Clock className="h-4 w-4 shrink-0 text-muted" />
                      <button onClick={() => runSearch(r)} className="tap flex-1 truncate text-left text-[13.5px] text-ink">{r}</button>
                      <button onClick={() => prefs.removeRecent(r)} aria-label={`Remove ${r}`} className="tap text-muted hover:text-error"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section>
              <h2 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">Suggested</h2>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => runSearch(s)} className="tap inline-flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-2 text-[12.5px] font-semibold text-ink hover:border-ink/25">
                    <Sparkles className="h-3.5 w-3.5 text-brand" /> {s}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="px-[18px] pt-3">
            {/* Near-Me location bar */}
            {eff.nearMe && (
              <div className="mb-3 flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2">
                <Navigation className="h-4 w-4 shrink-0 text-brand" />
                <p className="flex-1 text-[12.5px] text-ink">
                  {prefs.city ? <>Near <span className="font-semibold">{prefs.city}</span> · <span className="text-muted">prototype distances</span></> : 'Set a location to sort by distance'}
                </p>
                <button onClick={() => setLocOpen(true)} className="text-[12px] font-semibold text-brand">{prefs.city ? 'Change' : 'Set location'}</button>
              </div>
            )}

            {/* Type filter row */}
            <div className="no-scrollbar -mx-[18px] mb-2 flex gap-2 overflow-x-auto px-[18px]">
              {typeChips.map((t) => {
                const active = t === 'all' ? effType === null || effType === 'all' : effType === t
                return (
                  <button key={t} onClick={() => setType(t)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${active ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>
                    {t === 'all' ? 'All' : GROUP_LABEL[t]}
                  </button>
                )
              })}
              <span className="mx-0.5 w-px shrink-0 bg-border" />
              {(['free', 'paid'] as const).map((p) => (
                <button key={p} onClick={() => setOverrides((o) => ({ ...o, price: o.price === p ? null : p }))} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold capitalize ${overrides.price === p ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{p}</button>
              ))}
            </div>

            {/* Active facet chips */}
            {chips.length > 0 && (
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {chips.map((c) => (
                  <span key={c.key} className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-[11.5px] font-semibold text-brand-dark">
                    {c.label}
                    <button aria-label={`Remove ${c.label}`} onClick={() => setOverrides((o) => c.apply(o))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <button onClick={clearAllFilters} className="ml-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand"><SlidersHorizontal className="h-3 w-3" /> Clear Filters</button>
              </div>
            )}

            {/* Location required prompt */}
            {needsLocation ? (
              <LocationPrompt note={locNote} status={locStatus} onUse={useMyLocation} onChoose={chooseCity} />
            ) : loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted"><Loader2 className="h-5 w-5 animate-spin" /> <span className="text-[13px]">Searching…</span></div>
            ) : count === 0 ? (
              <div className="mt-4 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
                <p className="font-serif text-[20px] text-ink">No results</p>
                <p className="mt-1 max-w-[260px] text-[13px] text-muted">Nothing matched “{committed}”. Try fewer words, a different genre, category or city.</p>
                <button onClick={clearAllFilters} className="tap mt-4 min-h-[42px] rounded-control bg-brand px-5 text-[13.5px] font-semibold text-white hover:bg-brand-dark">Clear Filters</button>
              </div>
            ) : (
              <>
                <p className="mb-3 text-[12.5px] font-semibold text-muted">{count} result{count === 1 ? '' : 's'}</p>
                <div className="flex flex-col gap-6">
                  {visibleGroups.map((g) => {
                    const items = grouped[g]
                    return (
                      <section key={g}>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-serif text-[17px] text-ink">{GROUP_LABEL[g]} <span className="text-[13px] font-normal text-muted">· {items.length}</span></h3>
                          {items.length > PREVIEW && (
                            <button onClick={() => navigate(`/search/all/${g}`)} className="text-[12.5px] font-semibold text-brand">View All</button>
                          )}
                        </div>
                        <div className="flex flex-col gap-2.5">
                          {items.slice(0, PREVIEW).map((h) => <SearchHitRow key={h.group + h.id} hit={h} flash={flash} />)}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual location sheet */}
      {locOpen && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setLocOpen(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative flex max-h-[80%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(18px + var(--safe-bottom))' }}>
            <div className="mb-2 flex items-center justify-between"><h3 className="font-serif text-[19px] text-ink">Search location</h3><button aria-label="Close" onClick={() => setLocOpen(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted"><X className="h-5 w-5" /></button></div>
            <p className="mb-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-muted"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> Used only to sort nearby results. Requested once, on-device; only the chosen city is remembered.</p>
            <button onClick={useMyLocation} disabled={locStatus === 'requesting'} className="tap mb-3 flex min-h-[44px] items-center justify-center gap-2 rounded-control bg-ink text-[13.5px] font-semibold text-white disabled:opacity-70">
              {locStatus === 'requesting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Getting location…</> : <><Navigation className="h-4 w-4" /> Use my location</>}
            </button>
            {locNote && <p className="mb-2 text-[12px] text-muted">{locNote}</p>}
            <p className="mb-1.5 text-[11.5px] font-semibold text-ink">Choose a city</p>
            <div className="no-scrollbar flex flex-wrap gap-2 overflow-y-auto">
              {MANUAL_CITIES.map((c) => (
                <button key={c} onClick={() => chooseCity(c)} className={`tap min-h-[34px] rounded-control border px-3 text-[12.5px] font-semibold ${prefs.city === c ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function LocationPrompt({ note, status, onUse, onChoose }: { note: string; status: string; onUse: () => void; onChoose: (c: string) => void }) {
  return (
    <div className="mt-4 rounded-card border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-brand"><Navigation className="h-5 w-5" /><h3 className="font-serif text-[17px] text-ink">Search near you</h3></div>
      <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> We use your location only to sort nearby results. It’s requested once, used on-device, and only the resolved city is remembered.
      </p>
      <button onClick={onUse} disabled={status === 'requesting'} className="tap mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-control bg-ink text-[13.5px] font-semibold text-white disabled:opacity-70">
        {status === 'requesting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Getting location…</> : <><MapPin className="h-4 w-4" /> Use my location</>}
      </button>
      {note && <p className="mt-2 text-[12px] text-muted">{note}</p>}
      <p className="mb-1.5 mt-3 text-[11.5px] font-semibold text-ink">Or choose your city</p>
      <div className="flex flex-wrap gap-2">
        {MANUAL_CITIES.map((c) => (
          <button key={c} onClick={() => onChoose(c)} className="tap min-h-[34px] rounded-control border border-border bg-surface px-3 text-[12.5px] font-semibold text-muted hover:border-ink/25">{c}</button>
        ))}
      </div>
    </div>
  )
}
