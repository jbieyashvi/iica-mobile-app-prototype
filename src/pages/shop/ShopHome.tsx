import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, ArrowRight, GraduationCap, Download, Package, Store } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import ProductCard from '../../components/shop/ProductCard'
import EventCard from '../../components/events/EventCard'
import { useShop } from '../../state/ShopContext'
import { useEvents } from '../../state/EventsContext'

const TYPES = [
  { type: 'Masterclass', label: 'Masterclasses', icon: GraduationCap },
  { type: 'Digital', label: 'Digital downloads', icon: Download },
  { type: 'Physical', label: 'Art, books & merch', icon: Package },
] as const

export function ShopHeader({ cartCount, onSearch }: { cartCount: number; onSearch: () => void }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-[18px] backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="flex h-12 items-center justify-between">
        <h1 className="font-serif text-[22px] text-ink">Shop</h1>
        <div className="flex -mr-2">
          <button onClick={onSearch} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Search className="h-5 w-5" /></button>
          <button onClick={() => navigate('/cart')} aria-label="Cart" className="tap relative flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

export default function ShopHome() {
  const navigate = useNavigate()
  const { products, cartCount, recent } = useShop()
  const { events } = useEvents()

  const live = products.filter((p) => p.status === 'published' || p.status === 'out-of-stock')
  const featured = live[0]
  const byType = (t: string) => live.filter((p) => p.type === t)
  const upcoming = events.filter((e) => e.status === 'published').slice(0, 4)
  const recentProducts = recent.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products

  return (
    <div className="flex h-full flex-col bg-bg">
      <ShopHeader cartCount={cartCount} onSearch={() => navigate('/shop/search')} />
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pt-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 8px)' }}>
        <button onClick={() => navigate('/shop/search')} className="tap mx-[18px] mb-5 flex h-11 w-[calc(100%-36px)] items-center gap-2 rounded-control border border-border bg-surface px-3 text-left">
          <Search className="h-4 w-4 text-muted" /><span className="text-[13.5px] text-muted">Search masterclasses, products, creators</span>
        </button>

        {/* Featured */}
        {featured && (
          <section className="mb-7 px-[18px]">
            <button onClick={() => navigate(`/product/${featured.id}`)} className="tap relative block aspect-[16/10] w-full overflow-hidden rounded-card border border-border text-left">
              <img src={featured.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">Featured · {featured.type}</span>
                <h2 className="mt-1 font-serif text-[22px] leading-tight">{featured.title}</h2>
                <p className="mt-0.5 text-[12.5px] text-white/85">{featured.sellerName}</p>
              </div>
            </button>
          </section>
        )}

        {/* Browse by type */}
        <section className="mb-7 px-[18px]">
          <h2 className="mb-3 font-serif text-[19px] text-ink">Browse by type</h2>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map(({ type, label, icon: Icon }) => (
              <button key={type} onClick={() => navigate(`/shop/category/${type}`)} className="tap flex flex-col items-center gap-2 rounded-card border border-border bg-surface px-1 py-3 text-center hover:border-ink/20">
                <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark"><Icon className="h-[18px] w-[18px]" strokeWidth={1.75} /></span>
                <span className="text-[10.5px] font-semibold leading-tight text-ink">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {TYPES.map(({ type, label }) => {
          const items = byType(type)
          if (items.length === 0) return null
          return (
            <section key={type} className="mb-7">
              <div className="mb-3 flex items-center justify-between px-[18px]">
                <h2 className="font-serif text-[19px] text-ink">{label}</h2>
                <button onClick={() => navigate(`/shop/category/${type}`)} className="tap flex items-center gap-0.5 text-[13px] font-semibold text-brand">See all <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          )
        })}

        {/* Upcoming events (from Events module) */}
        {upcoming.length > 0 && (
          <section className="mb-7">
            <div className="mb-3 flex items-center justify-between px-[18px]">
              <h2 className="font-serif text-[19px] text-ink">Upcoming events</h2>
              <button onClick={() => navigate('/events')} className="tap flex items-center gap-0.5 text-[13px] font-semibold text-brand">View all <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>
          </section>
        )}

        {/* Recommended */}
        <section className="mb-7">
          <h2 className="mb-3 px-[18px] font-serif text-[19px] text-ink">Recommended for you</h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{[...live].reverse().map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>

        {/* Recently viewed */}
        {recentProducts.length > 0 && (
          <section className="mb-7">
            <h2 className="mb-3 px-[18px] font-serif text-[19px] text-ink">Recently viewed</h2>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{recentProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}

        <div className="px-[18px] pb-4">
          <button onClick={() => navigate('/creator/products')} className="tap flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark">
            <Store className="h-4 w-4" /> Sell on IICA
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
