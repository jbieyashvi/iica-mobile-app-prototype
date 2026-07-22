import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search, SlidersHorizontal, X, ArrowRight, MapPin, Globe } from 'lucide-react'
import { useEvents } from '../../state/EventsContext'
import { EVENT_CATEGORIES, EventCategory } from '../../events/types'
import { inr, startingPrice, isSoldOut } from '../../events/format'
import EventCard from '../../components/events/EventCard'
import BottomNavigation from '../../components/BottomNavigation'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

type Sort = 'Recommended' | 'Soonest' | 'Most Popular' | 'Price Low to High'
interface Filters {
  category: EventCategory | 'All'
  date: 'Any' | 'Today' | 'Tomorrow' | 'This Weekend'
  location: string
  mode: 'Any' | 'Online' | 'In person'
  price: 'Any' | 'Free' | 'Paid'
  maxPrice: number
  availableOnly: boolean
  sort: Sort
}
const defaultFilters: Filters = {
  category: 'All', date: 'Any', location: '', mode: 'Any', price: 'Any',
  maxPrice: 2000, availableOnly: false, sort: 'Recommended',
}

export default function EventsDiscovery() {
  const navigate = useNavigate()
  const { events } = useEvents()
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cat, setCat] = useState<EventCategory | 'All'>('All')
  const [sheet, setSheet] = useState(false)
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const live = useMemo(() => events.filter((e) => e.status === 'published'), [events])

  const activeCount = useMemo(() => {
    let n = 0
    if (filters.category !== 'All') n++
    if (filters.date !== 'Any') n++
    if (filters.location.trim()) n++
    if (filters.mode !== 'Any') n++
    if (filters.price !== 'Any') n++
    if (filters.availableOnly) n++
    if (filters.sort !== 'Recommended') n++
    return n
  }, [filters])

  const filtering = activeCount > 0 || cat !== 'All' || query.trim().length > 0

  const results = useMemo(() => {
    let r = [...live]
    const q = query.trim().toLowerCase()
    if (q) r = r.filter((e) => (e.title + e.organiserName + e.category + (e.city ?? '')).toLowerCase().includes(q))
    const effCat = cat !== 'All' ? cat : filters.category
    if (effCat !== 'All') r = r.filter((e) => e.category === effCat)
    if (filters.location.trim()) r = r.filter((e) => (e.city ?? '').toLowerCase().includes(filters.location.trim().toLowerCase()))
    if (filters.mode !== 'Any') r = r.filter((e) => filters.mode === 'Online' ? e.format === 'Online' : e.format !== 'Online')
    if (filters.price === 'Free') r = r.filter((e) => !e.paid)
    if (filters.price === 'Paid') r = r.filter((e) => e.paid)
    if (filters.price !== 'Free') r = r.filter((e) => !e.paid || startingPrice(e) <= filters.maxPrice)
    if (filters.availableOnly) r = r.filter((e) => !isSoldOut(e))
    if (filters.sort === 'Soonest') r.sort((a, b) => a.startDate.localeCompare(b.startDate))
    if (filters.sort === 'Price Low to High') r.sort((a, b) => startingPrice(a) - startingPrice(b))
    if (filters.sort === 'Most Popular') r.sort((a, b) => (b.tickets.reduce((s, t) => s + t.sold, 0)) - (a.tickets.reduce((s, t) => s + t.sold, 0)))
    return r
  }, [live, query, cat, filters])

  const featured = live.find((e) => e.featured) ?? live[0]
  const bySection = (fn: (e: typeof live[number]) => boolean) => live.filter(fn)

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header */}
      <header
        className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate(-1)} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-serif text-[19px] text-ink">Events</h1>
          <div className="flex">
            <button onClick={() => setShowSearch((s) => !s)} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => setSheet(true)} aria-label="Filters" className="tap relative flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]">
              <SlidersHorizontal className="h-5 w-5" />
              {activeCount > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{activeCount}</span>}
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="pb-2">
            <div className="flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
              <Search className="h-4 w-4 text-muted" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, artists, cities…" className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" />
              {query && <button onClick={() => setQuery('')} aria-label="Clear"><X className="h-4 w-4 text-muted" /></button>}
            </div>
          </div>
        )}
        {/* Category chips */}
        <div className="no-scrollbar -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-2">
          {(['All', ...EVENT_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c as EventCategory | 'All')}
              className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${cat === c ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted hover:border-ink/25'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 8px)' }}>
        {filtering ? (
          <div className="px-[18px] py-5">
            <p className="mb-3 text-[13px] font-semibold text-muted">{results.length} event{results.length === 1 ? '' : 's'}</p>
            {results.length === 0 ? (
              <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">
                No events match your filters.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((e) => <EventCard key={e.id} event={e} wide />)}
              </div>
            )}
          </div>
        ) : (
          <div className="py-5">
            {/* Featured */}
            {featured && (
              <section className="mb-7 px-[18px]">
                <button onClick={() => navigate(`/events/${featured.id}`)} className="tap relative block aspect-[4/3] w-full overflow-hidden rounded-card border border-border text-left">
                  <img src={featured.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">Featured · {featured.category}</span>
                    <h2 className="mt-1 font-serif text-[24px] leading-tight">{featured.title}</h2>
                    <p className="mt-1 flex items-center gap-2 text-[12.5px] text-white/85">
                      {featured.format === 'Online' ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                      {featured.format === 'Online' ? 'Online' : featured.city} · {featured.paid ? `${inr(startingPrice(featured))}+` : 'Free'}
                    </p>
                  </div>
                </button>
              </section>
            )}

            <Row title="This weekend" items={bySection(() => true).slice(0, 4)} onSeeAll={() => setFilters({ ...defaultFilters, date: 'This Weekend' })} />
            <Row title="Free events" items={bySection((e) => !e.paid)} onSeeAll={() => setFilters({ ...defaultFilters, price: 'Free' })} />
            <Row title="Workshops & creative sessions" items={bySection((e) => e.category === 'Workshop' || e.category === 'Painting Session')} onSeeAll={() => setFilters({ ...defaultFilters, category: 'Workshop' })} />
            <Row title="Online events" items={bySection((e) => e.format === 'Online')} onSeeAll={() => setFilters({ ...defaultFilters, mode: 'Online' })} />

            {/* Browse by category */}
            <section className="px-[18px] pt-2">
              <h2 className="mb-3 font-serif text-[19px] text-ink">Browse by category</h2>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCat(c)} className="tap rounded-card border border-border bg-surface px-3 py-3 text-left text-[13px] font-semibold text-ink hover:border-ink/25">
                    {c}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* Filter sheet */}
      {sheet && (
        <FilterSheet
          value={filters}
          onClose={() => setSheet(false)}
          onApply={(f) => { setFilters(f); if (f.category !== 'All') setCat(f.category); setSheet(false) }}
          onClear={() => { setFilters(defaultFilters); setCat('All'); setSheet(false) }}
        />
      )}
    </div>
  )
}

function Row({ title, items, onSeeAll }: { title: string; items: import('../../events/types').EventItem[]; onSeeAll: () => void }) {
  if (items.length === 0) return null
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-center justify-between px-[18px]">
        <h2 className="font-serif text-[19px] text-ink">{title}</h2>
        <button onClick={onSeeAll} className="tap flex items-center gap-0.5 text-[13px] font-semibold text-brand">See all <ArrowRight className="h-3.5 w-3.5" /></button>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
        {items.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </section>
  )
}

function FilterSheet({ value, onClose, onApply, onClear }: { value: Filters; onClose: () => void; onApply: (f: Filters) => void; onClear: () => void }) {
  const [f, setF] = useState<Filters>(value)
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({ ...s, [k]: v }))
  const chip = (active: boolean) => `tap rounded-control border px-3 py-2 text-[12.5px] font-semibold ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`

  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative flex max-h-[90%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h3 className="font-serif text-[20px] text-ink">Filters</h3>
          <button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>
        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-4">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Date</p>
            <div className="flex flex-wrap gap-2">
              {(['Any', 'Today', 'Tomorrow', 'This Weekend'] as const).map((d) => (
                <button key={d} onClick={() => set('date', d)} className={chip(f.date === d)}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Format</p>
            <div className="flex gap-2">
              {(['Any', 'Online', 'In person'] as const).map((m) => (
                <button key={m} onClick={() => set('mode', m)} className={chip(f.mode === m)}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Price</p>
            <div className="flex gap-2">
              {(['Any', 'Free', 'Paid'] as const).map((p) => (
                <button key={p} onClick={() => set('price', p)} className={chip(f.price === p)}>{p}</button>
              ))}
            </div>
          </div>
          {f.price !== 'Free' && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-ink">Max price</p>
                <span className="text-[13px] font-semibold text-brand">{inr(f.maxPrice)}</span>
              </div>
              <input type="range" min={0} max={2000} step={100} value={f.maxPrice} onChange={(e) => set('maxPrice', Number(e.target.value))} className="w-full accent-brand" />
            </div>
          )}
          <SelectField label="Category" value={f.category === 'All' ? '' : f.category} onChange={(v) => set('category', (v || 'All') as EventCategory | 'All')} options={EVENT_CATEGORIES} placeholder="Any category" optional />
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Availability</p>
            <button onClick={() => set('availableOnly', !f.availableOnly)} className={chip(f.availableOnly)}>Available only</button>
          </div>
          <SelectField label="Sort by" value={f.sort} onChange={(v) => set('sort', v as Sort)} options={['Recommended', 'Soonest', 'Most Popular', 'Price Low to High']} />
        </div>
        <div className="flex gap-2.5 border-t border-border px-5 pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <SecondaryButton onClick={onClear} className="min-w-[110px]">Clear All</SecondaryButton>
          <PrimaryButton full onClick={() => onApply(f)}>Apply Filters</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
