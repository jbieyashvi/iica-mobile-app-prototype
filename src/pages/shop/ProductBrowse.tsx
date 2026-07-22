import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ChevronLeft, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../../components/shop/ProductCard'
import ExploreFilterSheet, { FilterGroup, FilterValues, countActive } from '../../components/explore/ExploreFilterSheet'
import { PRODUCT_CATEGORIES } from '../../shop/types'
import { useShop } from '../../state/ShopContext'

type Sort = 'Recommended' | 'Most Popular' | 'Newest' | 'Highest Rated' | 'Price Low to High' | 'Price High to Low'
const SORTS: Sort[] = ['Recommended', 'Most Popular', 'Newest', 'Highest Rated', 'Price Low to High', 'Price High to Low']

const groups: FilterGroup[] = [
  { key: 'type', label: 'Product type', type: 'single', options: ['Masterclass', 'Physical', 'Digital'] },
  { key: 'category', label: 'Category', type: 'single', options: PRODUCT_CATEGORIES },
  { key: 'price', label: 'Price', type: 'single', options: ['Free', 'Paid'] },
  { key: 'rating', label: 'Rating', type: 'single', options: ['4.0+', '4.5+'] },
  { key: 'available', label: 'In stock only', type: 'toggle' },
]

export default function ProductBrowse({ mode, fixedType }: { mode: 'search' | 'category'; fixedType?: string }) {
  const navigate = useNavigate()
  const { products } = useShop()
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState<FilterValues>(fixedType ? { type: fixedType } : {})
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState<Sort>('Recommended')

  const live = products.filter((p) => p.status === 'published' || p.status === 'out-of-stock')
  const activeCount = countActive(filters) - (fixedType ? 1 : 0)

  const results = useMemo(() => {
    let r = [...live]
    const query = q.trim().toLowerCase()
    if (query) r = r.filter((p) => (p.title + p.sellerName + p.category + p.tags.join(' ')).toLowerCase().includes(query))
    if (filters.type) r = r.filter((p) => p.type === filters.type)
    if (filters.category) r = r.filter((p) => p.category === filters.category)
    if (filters.price === 'Free') r = r.filter((p) => p.free)
    if (filters.price === 'Paid') r = r.filter((p) => !p.free)
    if (filters.rating) r = r.filter((p) => p.rating >= parseFloat(String(filters.rating)))
    if (filters.available) r = r.filter((p) => p.type !== 'Physical' || (p.stock ?? 0) > 0)
    if (sort === 'Most Popular') r.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0))
    if (sort === 'Newest') r.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sort === 'Highest Rated') r.sort((a, b) => b.rating - a.rating)
    if (sort === 'Price Low to High') r.sort((a, b) => a.price - b.price)
    if (sort === 'Price High to Low') r.sort((a, b) => b.price - a.price)
    return r
  }, [live, q, filters, sort])

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-border bg-bg/92 px-3 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)', height: 'calc(var(--safe-top) + 56px)' }}>
        {mode === 'search' ? (
          <>
            <div className="flex h-10 flex-1 items-center gap-2 rounded-control border border-border bg-surface px-3">
              <Search className="h-4 w-4 text-muted" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, creators, tags…" className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" />
              {q && <button onClick={() => setQ('')} aria-label="Clear"><X className="h-4 w-4 text-muted" /></button>}
            </div>
            <button onClick={() => navigate('/shop')} className="tap min-h-[44px] px-1 text-[14px] font-semibold text-brand">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/shop')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
            <h1 className="flex-1 font-serif text-[18px] text-ink">{fixedType === 'Physical' ? 'Art, books & merch' : `${fixedType}s`}</h1>
            <button onClick={() => setShowFilters(true)} aria-label="Filters" className="tap relative flex h-10 w-10 items-center justify-center rounded-control text-ink"><SlidersHorizontal className="h-5 w-5" />{activeCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{activeCount}</span>}</button>
          </>
        )}
      </header>

      <div className="shrink-0 px-[18px] pt-3">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
          {mode === 'search' && (
            <button onClick={() => setShowFilters(true)} className="tap flex shrink-0 items-center gap-1 rounded-control border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
          )}
          {SORTS.map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${sort === s ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4">
        <p className="mb-3 text-[13px] font-semibold text-muted">{results.length} result{results.length === 1 ? '' : 's'}</p>
        {results.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-muted"><Search className="h-6 w-6" /></div>
            <p className="mt-4 font-serif text-[20px] text-ink">No products found</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">Try a different search or clear your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">{results.map((p) => <ProductCard key={p.id} product={p} wide />)}</div>
        )}
      </div>

      {showFilters && (
        <ExploreFilterSheet title="Filter products" groups={groups} value={filters}
          onApply={(v) => { setFilters(fixedType ? { ...v, type: fixedType } : v); setShowFilters(false) }}
          onClear={() => { setFilters(fixedType ? { type: fixedType } : {}); setShowFilters(false) }}
          onClose={() => setShowFilters(false)} />
      )}
    </div>
  )
}
