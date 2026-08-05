import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, PackageOpen } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import RecommendCard from '../components/recommend/RecommendCard'
import { useRecommended } from '../recommend/useRecommended'
import type { ListingType } from '../recommend/types'

const PAGE = 8
type TypeFilter = 'all' | ListingType
type PriceFilter = 'all' | 'free' | 'paid'

const TYPE_TABS: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'physical_product', label: 'Products' },
  { key: 'digital_product', label: 'Digital' },
  { key: 'masterclass', label: 'Classes' },
  { key: 'event', label: 'Events' },
  { key: 'secondhand_instrument', label: 'Instruments' },
  { key: 'donation', label: 'Support' },
]

export default function Recommended() {
  const navigate = useNavigate()
  const { visible, config, cards } = useRecommended()

  const [q, setQ] = useState('')
  const [type, setType] = useState<TypeFilter>('all')
  const [price, setPrice] = useState<PriceFilter>('all')
  const [limit, setLimit] = useState(PAGE)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  // Preserve Admin order; only filter/search (never reorder).
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return cards.filter((c) =>
      (type === 'all' || c.type === type) &&
      (price === 'all' || (price === 'free' ? c.free : !c.free)) &&
      (!query || (c.title + ' ' + c.subtitle + ' ' + c.typeLabel).toLowerCase().includes(query)),
    )
  }, [cards, q, type, price])

  const shown = filtered.slice(0, limit)
  const chip = (active: boolean) =>
    `tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${active ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`

  // Empty / unavailable configuration (e.g. schedule expired or all invalid).
  if (!visible || !config) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Recommended" fallback="/home" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand"><PackageOpen className="h-7 w-7" strokeWidth={1.6} /></span>
          <p className="mt-4 font-serif text-[20px] text-ink">Nothing to show right now</p>
          <p className="mt-1 max-w-[260px] text-[13px] text-muted">These recommendations aren’t available at the moment. Check back soon.</p>
          <button onClick={() => navigate('/home')} className="tap mt-5 min-h-[44px] rounded-control bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={config.heading} fallback="/home" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        {config.description && <p className="mb-3 text-[13px] leading-relaxed text-muted">{config.description}</p>}

        {/* Search */}
        <div className="flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }} placeholder="Search these recommendations" className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-muted focus:outline-none" aria-label="Search recommendations" />
          {q && <button onClick={() => setQ('')} aria-label="Clear search"><X className="h-4 w-4 text-muted" /></button>}
        </div>

        {/* Type filter */}
        <div className="no-scrollbar -mx-[18px] mt-2.5 flex gap-2 overflow-x-auto px-[18px] pb-1">
          {TYPE_TABS.map((t) => (
            <button key={t.key} onClick={() => { setType(t.key); setLimit(PAGE) }} className={chip(type === t.key)}>{t.label}</button>
          ))}
        </div>
        {/* Free / Paid filter */}
        <div className="mt-2 flex gap-2">
          {(['all', 'free', 'paid'] as PriceFilter[]).map((p) => (
            <button key={p} onClick={() => { setPrice(p); setLimit(PAGE) }} className={`${chip(price === p)} capitalize`}>{p === 'all' ? 'Free & Paid' : p}</button>
          ))}
        </div>

        <p className="mt-3 text-[12.5px] font-semibold text-muted">{filtered.length} listing{filtered.length === 1 ? '' : 's'}</p>

        {filtered.length === 0 ? (
          <div className="mt-4 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center text-[13px] text-muted">No listings match your filters.</div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {shown.map((c) => <RecommendCard key={c.key} card={c} flash={flash} variant="list" />)}
          </div>
        )}

        {shown.length < filtered.length && (
          <button onClick={() => setLimit((n) => n + PAGE)} className="tap mt-4 flex min-h-[44px] w-full items-center justify-center rounded-control border border-border bg-surface text-[13.5px] font-semibold text-ink hover:border-ink/25">
            Load More ({filtered.length - shown.length} more)
          </button>
        )}
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
