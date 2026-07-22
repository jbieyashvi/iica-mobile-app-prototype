import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Play, Download, Bookmark } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import ProductCard from '../../components/shop/ProductCard'
import { useShop } from '../../state/ShopContext'
import { useSavedArtists } from '../../state/useSavedArtists'

type Tab = 'Masterclasses' | 'Digital Downloads' | 'Saved Content'

export default function Library() {
  const navigate = useNavigate()
  const { orders, products, progress } = useShop()
  const { saved } = useSavedArtists()
  const [tab, setTab] = useState<Tab>('Masterclasses')
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const purchasedIds = [...new Set(orders.filter((o) => o.status !== 'Cancelled' && o.status !== 'Refunded').flatMap((o) => o.items.map((i) => i.productId)))]
  const purchased = purchasedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products
  const masterclasses = purchased.filter((p) => p.type === 'Masterclass')
  const digital = purchased.filter((p) => p.type === 'Digital')
  const savedProducts = saved.filter((k) => k.startsWith('product:')).map((k) => products.find((p) => p.id === k.replace('product:', ''))).filter(Boolean) as typeof products

  const mcProgress = (p: typeof products[number]) => {
    const lessons = p.syllabus?.flatMap((s) => s.lessons) ?? []
    if (!lessons.length) return 0
    return Math.round((lessons.filter((l) => progress[l.id]).length / lessons.length) * 100)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/profile')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">My Library</h1>
          <span className="h-10 w-10" />
        </div>
        <div className="no-scrollbar -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-2">
          {(['Masterclasses', 'Digital Downloads', 'Saved Content'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${tab === t ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {tab === 'Masterclasses' && (masterclasses.length === 0 ? <Empty text="No masterclasses yet." onGo={() => navigate('/shop/category/Masterclass')} /> : (
          <div className="flex flex-col gap-3">
            {masterclasses.map((p) => {
              const pct = mcProgress(p)
              return (
                <button key={p.id} onClick={() => navigate(`/library/${p.id}`)} className="tap overflow-hidden rounded-card border border-border bg-surface text-left">
                  <div className="flex gap-3 p-3">
                    <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[9px] bg-brand-soft"><img src={p.cover} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink"><Play className="ml-0.5 h-4 w-4 fill-ink" /></span></span></div>
                    <div className="min-w-0 flex-1"><p className="truncate font-serif text-[15px] text-ink">{p.title}</p><p className="truncate text-[12px] text-muted">{p.instructor}</p>
                      <div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} /></div><span className="text-[11px] font-semibold text-brand">{pct}%</span></div>
                    </div>
                  </div>
                  <div className="border-t border-border px-3 py-2 text-[12px] font-semibold text-brand">{pct === 0 ? 'Start Learning' : 'Continue Learning'}</div>
                </button>
              )
            })}
          </div>
        ))}

        {tab === 'Digital Downloads' && (digital.length === 0 ? <Empty text="No digital downloads yet." onGo={() => navigate('/shop/category/Digital')} /> : (
          <div className="flex flex-col gap-3">
            {digital.map((p) => (
              <div key={p.id} className="rounded-card border border-border bg-surface p-3">
                <div className="flex items-center gap-3">
                  <img src={p.cover} alt="" className="h-12 w-12 rounded-[9px] object-cover" />
                  <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{p.title}</p><p className="truncate text-[11.5px] text-muted">{p.sellerName} · {p.fileFormat}</p><p className="text-[11px] text-muted">Licence: {p.licence}</p></div>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
                  <span className="text-[11.5px] text-muted">{p.downloadLimit}</span>
                  <button onClick={() => flash('Downloading ' + p.title + ' (prototype)')} className="tap flex items-center gap-1.5 rounded-control bg-brand px-3 py-1.5 text-[12px] font-semibold text-white"><Download className="h-3.5 w-3.5" /> Download</button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {tab === 'Saved Content' && (savedProducts.length === 0 ? <Empty text="No saved products." onGo={() => navigate('/shop')} icon /> : (
          <div className="grid grid-cols-2 gap-3">{savedProducts.map((p) => <ProductCard key={p.id} product={p} wide />)}</div>
        ))}
      </div>
      <BottomNavigation />
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
function Empty({ text, onGo, icon }: { text: string; onGo: () => void; icon?: boolean }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-brand">{icon ? <Bookmark className="h-6 w-6" /> : <Play className="h-6 w-6" />}</div>
      <p className="mt-4 font-serif text-[20px] text-ink">{text}</p>
      <button onClick={onGo} className="tap mt-4 rounded-control bg-brand px-4 py-2.5 text-[13px] font-semibold text-white">Browse Shop</button>
    </div>
  )
}
