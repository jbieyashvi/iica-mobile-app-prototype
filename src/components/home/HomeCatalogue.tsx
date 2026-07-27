import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react'
import { FeaturedProfileCard } from '../explore/catalogueCards'
import CatalogueFilterSheet from '../explore/CatalogueFilterSheet'
import { useSaveGate } from '../SaveGate'
import { PublicArtist } from '../../data/publicArtists'
import {
  CatalogueFilters, NO_FILTERS, CATALOGUE_POOL,
  activeFilterCount as countFilters, filterProfiles, deriveLetters, applyLetter,
  topFeatured, toCatalogueQuery,
} from '../../data/catalogueFilter'

const KEY = 'iica_home_catalogue_v1'
const CATALOGUE_ROUTE = '/explore/artists'

interface Saved { filters: CatalogueFilters; letter: string }

// Compact catalogue entry point on Home. Shares data, filtering, dynamic
// alphabet and featured scoring with the full Catalogue (Explore → Artists).
export default function HomeCatalogue() {
  const navigate = useNavigate()
  const { sheet } = useSaveGate()

  const seed = useMemo<Saved>(() => {
    try {
      const raw = sessionStorage.getItem(KEY)
      if (raw) {
        const s = JSON.parse(raw) as Saved
        return { filters: { ...NO_FILTERS, ...s.filters }, letter: s.letter ?? 'All' }
      }
    } catch { /* ignore */ }
    return { filters: NO_FILTERS, letter: 'All' }
  }, [])

  const [filters, setFilters] = useState<CatalogueFilters>(seed.filters)
  const [letter, setLetter] = useState(seed.letter)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ filters, letter })) } catch { /* ignore */ }
  }, [filters, letter])

  const pool = CATALOGUE_POOL
  const activeCount = countFilters(filters)
  const anyActive = activeCount > 0

  const filtered = useMemo(() => filterProfiles(pool, '', filters), [pool, filters])
  const availableLetters = useMemo(() => deriveLetters(filtered), [filtered])

  useEffect(() => {
    if (letter !== 'All' && !availableLetters.includes(letter)) setLetter('All')
  }, [availableLetters, letter])

  const displayed = useMemo(() => applyLetter(filtered, letter), [filtered, letter])
  const preview = useMemo(() => displayed.slice(0, 6), [displayed])
  const featured = useMemo(() => topFeatured(pool, 6), [pool])

  const openProfile = (a: PublicArtist) => navigate(`/artist/${a.slug}`, { state: { from: '/home' } })
  const viewAll = () => navigate(CATALOGUE_ROUTE + toCatalogueQuery({ q: '', filters, letter }))
  const removeFilter = (k: keyof CatalogueFilters) =>
    setFilters((f) => ({ ...f, [k]: '' }))
  const clearAll = () => { setFilters(NO_FILTERS); setLetter('All') }

  const count = displayed.length

  return (
    <section>
      {/* Heading */}
      <div className="mb-1 flex items-start justify-between px-[18px]">
        <div className="min-w-0 pr-3">
          <h2 className="font-serif text-[19px] leading-tight text-ink">Explore the Catalogue</h2>
          <p className="mt-0.5 text-[12px] leading-relaxed text-muted">Discover artists, coaches, athletes, venues and cultural profiles.</p>
        </div>
        <button onClick={viewAll} className="tap mt-0.5 flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-brand">View all <ArrowRight className="h-3.5 w-3.5" /></button>
      </div>

      {/* Featured row (hidden while filtering) */}
      {!anyActive && (
        <>
          <p className="mb-2 mt-2 px-[18px] text-[11.5px] font-semibold uppercase tracking-wide text-muted">Featured Profiles</p>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
            {featured.map((a) => <FeaturedProfileCard key={a.slug} profile={a} onView={() => openProfile(a)} />)}
          </div>
        </>
      )}

      {/* Compact controls: filter button + chips */}
      <div className="mt-3 flex items-center gap-2 px-[18px]">
        <button onClick={() => setShowFilters(true)} className="tap relative flex h-9 shrink-0 items-center gap-1.5 rounded-control border border-border bg-surface px-3 text-[12.5px] font-semibold text-ink hover:border-ink/20">
          <SlidersHorizontal className="h-4 w-4" /> Filter Catalogue
          {activeCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{activeCount}</span>}
        </button>
        {anyActive && (
          <button onClick={clearAll} className="tap shrink-0 text-[12px] font-semibold text-muted hover:text-ink">Clear</button>
        )}
      </div>

      {activeCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 px-[18px]">
          {(['category', 'location', 'genre'] as const).map((k) =>
            filters[k] ? (
              <span key={k} className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-[11.5px] font-semibold text-brand-dark">
                {filters[k]}
                <button aria-label={`Remove ${k}`} onClick={() => removeFilter(k)}><X className="h-3 w-3" /></button>
              </span>
            ) : null,
          )}
        </div>
      )}

      {/* Compact A–Z row */}
      <div className="no-scrollbar mt-2.5 flex gap-1 overflow-x-auto px-[18px] pb-1">
        {['All', ...availableLetters].map((l) => {
          const on = letter === l
          return (
            <button key={l} onClick={() => setLetter(l)} className={`tap shrink-0 rounded-md px-2 py-1 text-[12.5px] font-semibold transition-colors ${on ? 'text-brand underline decoration-2 underline-offset-4' : 'text-muted hover:text-ink'}`}>{l}</button>
          )
        })}
      </div>

      {/* Count + view all results */}
      <div className="mt-1.5 flex items-center justify-between px-[18px]">
        <p className="text-[12px] font-semibold text-muted">{count === 0 ? 'No profiles' : `${count} profile${count === 1 ? '' : 's'}`}</p>
        {count > 0 && <button onClick={viewAll} className="tap text-[12.5px] font-semibold text-brand">View All Results</button>}
      </div>

      {/* Result preview (horizontal) */}
      {count === 0 ? (
        <div className="mx-[18px] mt-2 rounded-card border border-dashed border-border bg-surface px-4 py-6 text-center text-[12.5px] text-muted">
          No profiles match. <button onClick={clearAll} className="font-semibold text-brand">Clear filters</button>
        </div>
      ) : (
        <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto px-[18px] pb-1">
          {preview.map((a) => <FeaturedProfileCard key={a.slug} profile={a} onView={() => openProfile(a)} />)}
        </div>
      )}

      {sheet}
      {showFilters && (
        <CatalogueFilterSheet
          value={filters}
          onApply={(v) => { setFilters(v); setShowFilters(false) }}
          onClear={() => { setFilters(NO_FILTERS); setLetter('All'); setShowFilters(false) }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </section>
  )
}
