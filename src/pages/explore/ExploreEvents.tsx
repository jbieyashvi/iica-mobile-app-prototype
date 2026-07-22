import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, ArrowRight } from 'lucide-react'
import ExploreShell from '../../components/explore/ExploreShell'
import EventCard from '../../components/events/EventCard'
import { SkeletonCard } from '../../components/explore/cards'
import ExploreFilterSheet, { FilterGroup, FilterValues, countActive } from '../../components/explore/ExploreFilterSheet'
import { useEvents } from '../../state/EventsContext'
import { EVENT_CATEGORIES } from '../../events/types'
import { useLoad } from './useLoad'

const groups: FilterGroup[] = [
  { key: 'category', label: 'Category', type: 'single', options: [...EVENT_CATEGORIES] },
  { key: 'format', label: 'Format', type: 'single', options: ['Online', 'In person'] },
  { key: 'price', label: 'Price', type: 'single', options: ['Free', 'Paid'] },
  { key: 'city', label: 'Location', type: 'single', options: ['Mumbai', 'Bengaluru', 'Jaipur', 'Ujjain', 'Pune', 'Indore'] },
]

export default function ExploreEvents() {
  const navigate = useNavigate()
  const { events } = useEvents()
  const loading = useLoad(500)
  const [filters, setFilters] = useState<FilterValues>({})
  const [showFilters, setShowFilters] = useState(false)
  const live = events.filter((e) => e.status === 'published')
  const active = countActive(filters)
  const filtering = active > 0

  const results = useMemo(() => {
    let r = [...live]
    if (filters.category) r = r.filter((e) => e.category === filters.category)
    if (filters.format) r = r.filter((e) => filters.format === 'Online' ? e.format === 'Online' : e.format !== 'Online')
    if (filters.price) r = r.filter((e) => filters.price === 'Free' ? !e.paid : e.paid)
    if (filters.city) r = r.filter((e) => (e.city ?? '').toLowerCase().includes(String(filters.city).toLowerCase()))
    return r
  }, [live, filters])

  const section = (fn: (e: typeof live[number]) => boolean) => live.filter(fn)

  return (
    <ExploreShell active="events" filterButton={
      <button onClick={() => setShowFilters(true)} aria-label="Filters" className="tap relative flex h-9 w-9 items-center justify-center rounded-control text-ink">
        <SlidersHorizontal className="h-5 w-5" />
        {active > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{active}</span>}
      </button>
    }>
      <div className="flex items-center justify-between px-[18px] pt-4">
        <p className="text-[13px] font-semibold text-muted">{filtering ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Discover events'}</p>
        <button onClick={() => navigate('/events')} className="tap flex items-center gap-0.5 text-[13px] font-semibold text-brand">View all <ArrowRight className="h-3.5 w-3.5" /></button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 px-[18px] py-4">{[0, 1, 2].map((i) => <SkeletonCard key={i} list />)}</div>
      ) : filtering ? (
        <div className="px-[18px] py-4">
          {results.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">No events match your filters.</div>
          ) : (
            <div className="flex flex-col gap-3">{results.map((e) => <EventCard key={e.id} event={e} wide />)}</div>
          )}
        </div>
      ) : (
        <div className="py-2">
          <Row title="Upcoming events" items={live.slice(0, 4)} navigate={navigate} />
          <Row title="This weekend" items={section(() => true).slice(0, 3)} navigate={navigate} />
          <Row title="Free events" items={section((e) => !e.paid)} navigate={navigate} />
          <Row title="Workshops" items={section((e) => e.category === 'Workshop' || e.category === 'Painting Session')} navigate={navigate} />
        </div>
      )}

      {showFilters && (
        <ExploreFilterSheet title="Filter events" groups={groups} value={filters}
          onApply={(v) => { setFilters(v); setShowFilters(false) }}
          onClear={() => { setFilters({}); setShowFilters(false) }}
          onClose={() => setShowFilters(false)} />
      )}
    </ExploreShell>
  )
}

function Row({ title, items, navigate }: { title: string; items: import('../../events/types').EventItem[]; navigate: (p: string) => void }) {
  if (items.length === 0) return null
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between px-[18px]">
        <h2 className="font-serif text-[18px] text-ink">{title}</h2>
        <button onClick={() => navigate('/events')} className="text-[12.5px] font-semibold text-brand">See all</button>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{items.map((e) => <EventCard key={e.id} event={e} />)}</div>
    </section>
  )
}
