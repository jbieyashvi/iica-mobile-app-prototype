import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import { useSaveGate } from '../../components/SaveGate'
import { FeaturedProfileCard, CatalogueListItem } from '../../components/explore/catalogueCards'
import CatalogueFilterSheet from '../../components/explore/CatalogueFilterSheet'
import ExploreTabs from '../../components/explore/ExploreTabs'
import { PublicArtist } from '../../data/publicArtists'
import {
  CatalogueFilters, CatalogueState, NO_FILTERS, CATALOGUE_POOL,
  initialOf, activeFilterCount as countFilters, filterProfiles, deriveLetters,
  applyLetter, topFeatured, fromCatalogueParams,
} from '../../data/catalogueFilter'
import { FEATURED_BLURB } from '../../config/catalogue'

const KEY = 'iica_catalogue_v1'

export default function ArtistCatalogue() {
  const navigate = useNavigate()
  const { save, isSaved, sheet } = useSaveGate()
  const [params] = useSearchParams()
  const searchRef = useRef<HTMLInputElement>(null)

  // ---- initial state: URL intent wins, else restore session ----
  // Computed once, synchronously, so returning from a profile restores state
  // before the persist effect can overwrite it.
  const seed = useMemo<CatalogueState>(() => {
    const fromUrl = fromCatalogueParams(params)
    if (fromUrl) return fromUrl
    try {
      const raw = sessionStorage.getItem(KEY)
      if (raw) {
        const s = JSON.parse(raw) as CatalogueState
        return { q: s.q ?? '', filters: { ...NO_FILTERS, ...s.filters }, letter: s.letter ?? 'All' }
      }
    } catch { /* ignore */ }
    return { q: '', filters: NO_FILTERS, letter: 'All' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [q, setQ] = useState(seed.q)
  const [filters, setFilters] = useState<CatalogueFilters>(seed.filters)
  const [letter, setLetter] = useState(seed.letter)
  const [showFilters, setShowFilters] = useState(false)
  const [debouncedQ, setDebouncedQ] = useState(seed.q)

  // light debounce on search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 140)
    return () => clearTimeout(t)
  }, [q])

  // persist filter state (so returning from a profile restores it)
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ q, filters, letter })) } catch { /* ignore */ }
  }, [q, filters, letter])

  const pool = CATALOGUE_POOL

  const activeFilterCount = countFilters(filters)
  const anyActive = activeFilterCount > 0 || debouncedQ.trim().length > 0

  // ---- shared filter pipeline + dynamic alphabet ----
  const filtered = useMemo(() => filterProfiles(pool, debouncedQ, filters), [pool, debouncedQ, filters])
  const availableLetters = useMemo(() => deriveLetters(filtered), [filtered])

  // reset a stale selected letter that no longer exists
  useEffect(() => {
    if (letter !== 'All' && !availableLetters.includes(letter)) setLetter('All')
  }, [availableLetters, letter])

  const displayed = useMemo(() => applyLetter(filtered, letter), [filtered, letter])

  const grouped = useMemo(() => {
    const map = new Map<string, PublicArtist[]>()
    displayed.forEach((a) => {
      const k = initialOf(a.name)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(a)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [displayed])

  // ---- featured (activity score, hidden while filtering/searching) ----
  const featured = useMemo(() => topFeatured(pool, 5), [pool])

  const openProfile = (a: PublicArtist) =>
    navigate(`/artist/${a.slug}`, { state: { from: '/explore/artists' } })

  const clearAll = () => {
    setQ('')
    setFilters(NO_FILTERS)
    setLetter('All')
    setShowFilters(false)
  }

  const removeFilter = (k: keyof CatalogueFilters) =>
    setFilters((f) => ({ ...f, [k]: '' }))

  const count = displayed.length

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Compact header */}
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-[18px] backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <h1 className="font-serif text-[22px] text-ink">Artist Catalogue</h1>
          <div className="flex -mr-2">
            <button onClick={() => searchRef.current?.focus()} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Search className="h-5 w-5" /></button>
            <button onClick={() => setShowFilters(true)} aria-label="Filter" className="tap relative flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]">
              <SlidersHorizontal className="h-5 w-5" />
              {activeFilterCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
        <div className="mb-2.5 flex h-11 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, category, genre or location" className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-muted focus:outline-none" />
          {q && <button onClick={() => setQ('')} aria-label="Clear search"><X className="h-4 w-4 text-muted" /></button>}
        </div>
        {/* Explore discovery tabs — keep the row consistent with other Explore tabs */}
        <ExploreTabs active="artists" />
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 8px)' }}>
        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1.5 px-[18px] pt-3">
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

        {/* Featured (hidden while searching/filtering) */}
        {!anyActive && (
          <section className="pt-4">
            <div className="mb-2.5 flex items-center justify-between px-[18px]">
              <h2 className="font-serif text-[19px] text-ink">Featured Profiles</h2>
              <button onClick={() => { setQ(''); setFilters(NO_FILTERS); setLetter('All'); searchRef.current?.blur() }} className="text-[13px] font-semibold text-brand">See All</button>
            </div>
            <p className="-mt-1 mb-2.5 px-[18px] text-[12px] text-muted">{FEATURED_BLURB}</p>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
              {featured.map((a) => <FeaturedProfileCard key={a.slug} profile={a} onView={() => openProfile(a)} />)}
            </div>
          </section>
        )}

        {/* All Profiles */}
        <section className="mt-6">
          <h2 className="mb-2.5 px-[18px] font-serif text-[19px] text-ink">All Profiles</h2>

          {/* A–Z selector */}
          <div className="no-scrollbar flex gap-1 overflow-x-auto px-[18px] pb-1">
            {['All', ...availableLetters].map((l) => {
              const on = letter === l
              return (
                <button
                  key={l}
                  onClick={() => setLetter(l)}
                  className={`tap shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-semibold transition-colors ${on ? 'text-brand underline decoration-2 underline-offset-4' : 'text-muted hover:text-ink'}`}
                >
                  {l}
                </button>
              )
            })}
          </div>

          {/* Result count */}
          {count > 0 && (
            <p className="mt-2 px-[18px] text-[12.5px] font-semibold text-muted">
              {count} profile{count === 1 ? '' : 's'}
            </p>
          )}

          {/* Results */}
          {count === 0 ? (
            <div className="mx-[18px] mt-4 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
              <p className="font-serif text-[20px] text-ink">No profiles found</p>
              <p className="mt-1 max-w-[260px] text-[13px] text-muted">Try changing the category, location, genre or search term.</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <button onClick={clearAll} className="tap min-h-[44px] rounded-control bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark">Clear Filters</button>
                <button onClick={clearAll} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Browse All Profiles</button>
              </div>
            </div>
          ) : letter === 'All' ? (
            <div className="mt-3 flex flex-col gap-4 px-[18px]">
              {grouped.map(([l, items]) => (
                <div key={l}>
                  <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-brand">{l}</p>
                  <div className="flex flex-col gap-3">
                    {items.map((a) => <CatalogueListItem key={a.slug} profile={a} saved={isSaved('artist:' + a.slug)} onSave={() => save('artist:' + a.slug)} onView={() => openProfile(a)} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 px-[18px]">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-brand">{letter} · {count} profile{count === 1 ? '' : 's'}</p>
              <div className="flex flex-col gap-3">
                {displayed.map((a) => <CatalogueListItem key={a.slug} profile={a} saved={isSaved('artist:' + a.slug)} onSave={() => save('artist:' + a.slug)} onView={() => openProfile(a)} />)}
              </div>
            </div>
          )}
        </section>

        <div className="h-4" />
      </div>

      <BottomNavigation />
      {sheet}
      {showFilters && (
        <CatalogueFilterSheet
          value={filters}
          onApply={(v) => { setFilters(v); setShowFilters(false) }}
          onClear={() => { setFilters(NO_FILTERS); setShowFilters(false) }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}
