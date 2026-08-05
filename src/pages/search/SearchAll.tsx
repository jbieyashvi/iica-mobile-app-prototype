import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useSearchPrefs } from '../../state/SearchContext'
import { useSearchSources } from '../../search/useSearchSources'
import { parseQuery, ContentType } from '../../search/parse'
import { search, GROUP_LABEL, GROUP_ORDER } from '../../search/engine'
import SearchHitRow from './SearchHitRow'
import { applyOverrides, loadSearchState } from './searchState'

// Full result list for one group, preserving the active search query/filters.
export default function SearchAll() {
  const navigate = useNavigate()
  const { group } = useParams()
  const prefs = useSearchPrefs()
  const sources = useSearchSources()
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const g = (GROUP_ORDER.includes(group as ContentType) ? group : 'creators') as ContentType
  const snap = useMemo(() => loadSearchState(), [])
  const eff = useMemo(() => applyOverrides(parseQuery(snap.committed), snap.overrides), [snap])
  const items = useMemo(() => search(eff, sources, prefs.city)[g], [eff, sources, prefs.city, g])

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center gap-1">
          <button onClick={() => navigate('/search')} aria-label="Back to search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-[18px] text-ink">{GROUP_LABEL[g]}</h1>
            {snap.committed && <p className="truncate text-[11.5px] text-muted">for “{snap.committed}”</p>}
          </div>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        <p className="mb-3 text-[12.5px] font-semibold text-muted">{items.length} result{items.length === 1 ? '' : 's'}</p>
        {items.length === 0 ? (
          <div className="mt-4 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center text-[13px] text-muted">No results in this group.</div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((h) => <SearchHitRow key={h.group + h.id} hit={h} flash={flash} />)}
          </div>
        )}
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
