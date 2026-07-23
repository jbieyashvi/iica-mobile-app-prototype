import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import ExploreShell from '../../components/explore/ExploreShell'
import { ContentCard } from '../../components/explore/cards'
import ShareSheet from '../../components/explore/ShareSheet'
import ExploreFilterSheet, { FilterGroup, FilterValues, countActive } from '../../components/explore/ExploreFilterSheet'
import { useSaveGate } from '../../components/SaveGate'
import { useLikes } from '../../state/useExplore'
import { ContentItem } from '../../data/exploreData'
import { useContentStore } from '../../state/ContentContext'
import { useLoad } from './useLoad'

const groups: FilterGroup[] = [
  { key: 'type', label: 'Media type', type: 'single', options: ['Video', 'Image', 'Audio', 'PDF', 'Artist Update'] },
  { key: 'category', label: 'Category', type: 'single', options: ['Music', 'Dance', 'Visual Arts', 'Photography'] },
  { key: 'sort', label: 'Sort', type: 'single', options: ['Most Recent', 'Most Popular'] },
]

export default function ExploreContent() {
  const { save, isSaved, sheet } = useSaveGate()
  const { isLiked, toggle } = useLikes()
  const { publicContent } = useContentStore()
  const loading = useLoad(500)
  const [filters, setFilters] = useState<FilterValues>({})
  const [showFilters, setShowFilters] = useState(false)
  const [share, setShare] = useState<ContentItem | null>(null)
  const [toast, setToast] = useState('')
  const active = countActive(filters)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }

  const results = useMemo(() => {
    let r = publicContent() as unknown as ContentItem[]
    if (filters.type) r = r.filter((c) => c.type === filters.type)
    if (filters.category) r = r.filter((c) => c.category === filters.category)
    if (filters.sort === 'Most Popular') r = [...r].sort((a, b) => b.likes - a.likes)
    if (filters.sort === 'Most Recent') r = [...r].sort((a, b) => b.date.localeCompare(a.date))
    return r
  }, [filters, publicContent])

  return (
    <ExploreShell active="content" filterButton={
      <button onClick={() => setShowFilters(true)} aria-label="Filters" className="tap relative flex h-9 w-9 items-center justify-center rounded-control text-ink">
        <SlidersHorizontal className="h-5 w-5" />
        {active > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{active}</span>}
      </button>
    }>
      <div className="px-[18px] py-4">
        <p className="mb-3 text-[13px] font-semibold text-muted">{results.length} post{results.length === 1 ? '' : 's'}</p>
        {loading ? (
          <div className="flex flex-col gap-3">{[0, 1].map((i) => <div key={i} className="h-64 animate-pulse rounded-card border border-border bg-surface" />)}</div>
        ) : results.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">No content matches your filters.</div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {results.map((c) => <ContentCard key={c.id} item={c} saved={isSaved('content:' + c.id)} liked={isLiked(c.id)} onSave={save} onLike={toggle} onShare={setShare} />)}
          </div>
        )}
      </div>

      {sheet}
      {showFilters && (
        <ExploreFilterSheet title="Filter content" groups={groups} value={filters}
          onApply={(v) => { setFilters(v); setShowFilters(false) }}
          onClear={() => { setFilters({}); setShowFilters(false) }}
          onClose={() => setShowFilters(false)} />
      )}
      {share && <ShareSheet title={share.title} url={`https://iica.app/content/${share.id}`} onClose={() => setShare(null)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </ExploreShell>
  )
}
