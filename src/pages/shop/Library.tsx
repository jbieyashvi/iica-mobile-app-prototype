import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Download, Bookmark, PlaySquare, LogIn, UserPlus, Search } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import ProfileAvatarButton from '../../components/ProfileAvatarButton'
import ProductCard from '../../components/shop/ProductCard'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useShop } from '../../state/ShopContext'
import { useSavedArtists } from '../../state/useSavedArtists'
import { useAuth } from '../../state/AuthContext'
import { useArchive } from '../../data/useArchive'
import { getArchiveVideo } from '../../data/archive'

type Tab = 'Masterclasses' | 'Digital Downloads' | 'Saved Videos' | 'Saved Products'

export default function Library() {
  const navigate = useNavigate()
  const { orders, products, progress } = useShop()
  const { saved } = useSavedArtists()
  const { state } = useAuth()
  const archive = useArchive()
  const [tab, setTab] = useState<Tab>('Masterclasses')
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const savedVideos = saved.filter((k) => k.startsWith('video:')).map((k) => getArchiveVideo(archive, k.replace('video:', ''))).filter(Boolean) as ReturnType<typeof getArchiveVideo>[]

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

  // Guest entry — useful "Access Your Purchases" screen (never a forced signup).
  if (!state.authed) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-[18px] backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
          <div className="flex h-12 items-center justify-between">
            <h1 className="font-serif text-[19px] text-ink">My Library</h1>
            <div className="flex items-center -mr-1"><ProfileAvatarButton /></div>
          </div>
        </header>
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-6" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
          <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand"><PlaySquare className="h-7 w-7" strokeWidth={1.6} /></div>
          <h2 className="mt-4 text-center font-serif text-[24px] leading-tight text-ink">Access Your Purchases</h2>
          <p className="mx-auto mt-1.5 max-w-[280px] text-center text-[13.5px] leading-relaxed text-muted">Find a purchase you made as a guest, or sign in to see your full library.</p>
          <div className="mt-6 flex flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/orders')}><Search className="h-4 w-4" /> Find Guest Purchase</PrimaryButton>
            <SecondaryButton full onClick={() => navigate('/login')}><LogIn className="h-4 w-4" /> Sign In</SecondaryButton>
            <button onClick={() => navigate('/signup')} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control text-[14px] font-semibold text-brand hover:text-brand-dark"><UserPlus className="h-4 w-4" /> Create Free Account</button>
          </div>
          <p className="mt-4 text-center text-[12px] text-muted">Guest lookup uses your Order ID, email and OTP <span className="font-semibold text-ink">123456</span>.</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-[18px] backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <h1 className="font-serif text-[19px] text-ink">My Library</h1>
          <div className="flex items-center -mr-1"><ProfileAvatarButton /></div>
        </div>
        <div className="no-scrollbar -mx-[18px] flex gap-1.5 overflow-x-auto px-[18px] pb-2">
          {(['Masterclasses', 'Digital Downloads', 'Saved Videos', 'Saved Products'] as Tab[]).map((t) => (
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

        {tab === 'Saved Videos' && (savedVideos.length === 0 ? <Empty text="No saved videos yet." onGo={() => navigate('/explore/archive')} icon /> : (
          <div className="flex flex-col gap-3">
            {savedVideos.map((v) => v && (
              <button key={v.id} onClick={() => navigate(`/archive/video/${v.id}`)} className="tap flex gap-3 rounded-card border border-border bg-surface p-3 text-left hover:border-ink/20">
                <div className="relative h-[54px] w-[92px] shrink-0 overflow-hidden rounded-[8px] bg-brand-soft"><img src={v.thumbnail} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink"><Play className="ml-0.5 h-3.5 w-3.5 fill-ink" /></span></span></div>
                <div className="min-w-0 flex-1"><p className="truncate font-serif text-[14px] text-ink">{v.title}</p><p className="truncate text-[12px] text-muted">{v.category} · {v.creatorName}</p></div>
              </button>
            ))}
          </div>
        ))}

        {tab === 'Saved Products' && (savedProducts.length === 0 ? <Empty text="No saved products." onGo={() => navigate('/shop')} icon /> : (
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
