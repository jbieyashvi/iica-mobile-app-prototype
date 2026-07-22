import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import ExploreShell from '../../components/explore/ExploreShell'
import { ArtistListCard, SkeletonCard } from '../../components/explore/cards'
import ExploreFilterSheet, { FilterGroup, FilterValues, countActive } from '../../components/explore/ExploreFilterSheet'
import { useSaveGate } from '../../components/SaveGate'
import { publicArtists } from '../../data/publicArtists'
import { useLoad } from './useLoad'

const DOMAINS = ['Music', 'Dance', 'Theatre', 'Visual Arts', 'Photography', 'Film & Media', 'Literature', 'Fashion']
const CITIES = ['Mumbai', 'Bengaluru', 'Pune', 'Jaipur', 'Ujjain', 'Chennai', 'Kochi', 'Ahmedabad']
const AVAIL = ['Available', 'Selectively Available', 'Not Available']
const groups: FilterGroup[] = [
  { key: 'domain', label: 'Domain', type: 'single', options: DOMAINS },
  { key: 'city', label: 'Location', type: 'single', options: CITIES },
  { key: 'availability', label: 'Availability', type: 'single', options: AVAIL },
  { key: 'experience', label: 'Experience', type: 'single', options: ['0–5 years', '5–10 years', '10+ years'] },
  { key: 'verified', label: 'Verified only', type: 'toggle' },
]
type Sort = 'Recommended' | 'Trending' | 'Recently Joined' | 'Most Experienced'

export default function ExploreArtists() {
  const { save, isSaved, sheet } = useSaveGate()
  const loading = useLoad(500)
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState<FilterValues>({})
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState<Sort>('Recommended')

  const active = countActive(filters)

  const results = useMemo(() => {
    let r = publicArtists.filter((a) => a.slug !== 'reshma-patra')
    const query = q.trim().toLowerCase()
    if (query) r = r.filter((a) => (a.name + a.headline + a.primaryDomain + a.location + a.tags.join(' ')).toLowerCase().includes(query))
    if (filters.domain) r = r.filter((a) => a.primaryDomain === filters.domain)
    if (filters.city) r = r.filter((a) => a.location.toLowerCase().includes(String(filters.city).toLowerCase()))
    if (filters.availability) r = r.filter((a) => a.availability === filters.availability)
    if (filters.experience) {
      const e = String(filters.experience)
      r = r.filter((a) => {
        const y = a.experienceYears ?? 0
        return e.startsWith('0') ? y <= 5 : e.startsWith('5') ? y > 5 && y <= 10 : y > 10
      })
    }
    if (filters.verified) r = r.filter((a) => a.verified)
    if (sort === 'Most Experienced') r = [...r].sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0))
    if (sort === 'Recently Joined') r = [...r].reverse()
    if (sort === 'Trending') r = [...r].sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0))
    return r
  }, [q, filters, sort])

  return (
    <ExploreShell active="artists" filterButton={
      <button onClick={() => setShowFilters(true)} aria-label="Filters" className="tap relative flex h-9 w-9 items-center justify-center rounded-control text-ink">
        <SlidersHorizontal className="h-5 w-5" />
        {active > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{active}</span>}
      </button>
    }>
      <div className="px-[18px] pt-4">
        <div className="flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search artists" className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><X className="h-4 w-4 text-muted" /></button>}
        </div>

        {/* active chips + sort */}
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto">
          {(['Recommended', 'Trending', 'Recently Joined', 'Most Experienced'] as Sort[]).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${sort === s ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{s}</button>
          ))}
        </div>
        {active > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(filters).filter(([, v]) => v && (!Array.isArray(v) || v.length)).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-[11.5px] font-semibold text-brand-dark">
                {typeof v === 'boolean' ? 'Verified' : String(v)}
                <button aria-label="Remove filter" onClick={() => setFilters((f) => ({ ...f, [k]: Array.isArray(v) ? [] : typeof v === 'boolean' ? false : '' }))}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-[18px] py-4">
        <p className="mb-3 text-[13px] font-semibold text-muted">{results.length} artist{results.length === 1 ? '' : 's'}</p>
        {loading ? (
          <div className="flex flex-col gap-3">{[0, 1, 2, 3].map((i) => <SkeletonCard key={i} list />)}</div>
        ) : results.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">No artists match your filters.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((a) => <ArtistListCard key={a.slug} artist={a} saved={isSaved('artist:' + a.slug)} onSave={save} list />)}
          </div>
        )}
      </div>

      {sheet}
      {showFilters && (
        <ExploreFilterSheet title="Filter artists" groups={groups} value={filters}
          onApply={(v) => { setFilters(v); setShowFilters(false) }}
          onClear={() => { setFilters({}); setShowFilters(false) }}
          onClose={() => setShowFilters(false)} />
      )}
    </ExploreShell>
  )
}
