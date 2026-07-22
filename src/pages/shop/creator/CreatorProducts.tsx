import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, ChevronRight, Package, IndianRupee, ShoppingBag, Boxes } from 'lucide-react'
import BottomNavigation from '../../../components/BottomNavigation'
import StatusBadge from '../../../components/StatusBadge'
import PrimaryButton from '../../../components/PrimaryButton'
import { useShop } from '../../../state/ShopContext'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Product } from '../../../shop/types'
import { inr, creatorEarnings } from '../../../shop/pricing'

type Tab = 'All' | 'Drafts' | 'Published' | 'Out of Stock' | 'Archived'

export default function CreatorProducts() {
  const navigate = useNavigate()
  const { products, orders, resetDraft } = useShop()
  const { portfolio } = usePortfolio()
  const [tab, setTab] = useState<Tab>('All')

  const mine = useMemo(() => products.filter((p) => p.createdByMe || p.sellerId === portfolio.slug || p.sellerId === 'abhishek-singh-chouhan'), [products, portfolio.slug])
  const myOrders = orders.filter((o) => o.items.some((i) => mine.some((p) => p.id === i.productId)))
  const revenue = myOrders.reduce((s, o) => s + o.items.filter((i) => mine.some((p) => p.id === i.productId)).reduce((a, i) => a + creatorEarnings(i.price * i.qty), 0), 0)

  const filtered = mine.filter((p) => {
    if (tab === 'All') return true
    if (tab === 'Drafts') return p.status === 'draft'
    if (tab === 'Published') return p.status === 'published' || p.status === 'pending'
    if (tab === 'Out of Stock') return p.type === 'Physical' && (p.stock ?? 0) <= 0
    if (tab === 'Archived') return p.status === 'archived'
    return true
  })

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/profile')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">My Products</h1>
          <button onClick={() => { resetDraft(); navigate('/creator/products/create') }} aria-label="Create" className="tap flex h-10 w-10 items-center justify-center rounded-control text-brand hover:bg-black/[0.04]"><Plus className="h-6 w-6" /></button>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        <div className="grid grid-cols-2 gap-2.5">
          <Stat icon={<Package className="h-4 w-4" />} label="Products" value={String(mine.length)} />
          <Stat icon={<Boxes className="h-4 w-4" />} label="Active" value={String(mine.filter((p) => p.status === 'published').length)} />
          <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={String(myOrders.length)} />
          <Stat icon={<IndianRupee className="h-4 w-4" />} label="Revenue" value={inr(revenue)} />
        </div>

        <div className="no-scrollbar -mx-[18px] mt-4 flex gap-1.5 overflow-x-auto px-[18px]">
          {(['All', 'Drafts', 'Published', 'Out of Stock', 'Archived'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${tab === t ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{t}</button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center">
              <p className="text-[13px] text-muted">No {tab.toLowerCase()} products.</p>
              <div className="mt-4 flex justify-center"><PrimaryButton onClick={() => { resetDraft(); navigate('/creator/products/create') }}><Plus className="h-4 w-4" /> Create Product</PrimaryButton></div>
            </div>
          ) : filtered.map((p) => <Row key={p.id} p={p} onClick={() => navigate(`/creator/products/${p.id}`)} />)}
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}

function Row({ p, onClick }: { p: Product; onClick: () => void }) {
  const soldOut = p.type === 'Physical' && (p.stock ?? 0) <= 0
  return (
    <button onClick={onClick} className="tap flex items-center gap-3 rounded-card border border-border bg-surface p-3 text-left">
      <img src={p.cover} alt="" className="h-[58px] w-[58px] shrink-0 rounded-[9px] object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-[14.5px] text-ink">{p.title}</p>
        <p className="truncate text-[12px] text-muted">{p.type} · {p.free ? 'Free' : inr(p.price)}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <StatusBadge tone={p.status === 'archived' ? 'neutral' : p.status === 'draft' ? 'warning' : soldOut ? 'error' : 'success'}>{soldOut ? 'Out of Stock' : p.status === 'published' ? 'Live' : p.status}</StatusBadge>
          <span className="text-[11px] text-muted">{p.sales ?? 0} sales</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </button>
  )
}
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-card border border-border bg-surface p-3"><span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark">{icon}</span><p className="mt-2 font-serif text-[20px] leading-none text-ink">{value}</p><p className="mt-1 text-[11px] uppercase tracking-wide text-muted">{label}</p></div>
}
