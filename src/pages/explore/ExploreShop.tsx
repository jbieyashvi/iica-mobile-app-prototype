import { useNavigate } from 'react-router-dom'
import { ArrowRight, Store } from 'lucide-react'
import ExploreShell from '../../components/explore/ExploreShell'
import { ShopCard } from '../../components/explore/cards'
import { ArtistListCard } from '../../components/explore/cards'
import { useSaveGate } from '../../components/SaveGate'
import { shopPreview, ShopKind } from '../../data/exploreData'
import { publicArtists } from '../../data/publicArtists'

const kinds: { kind: ShopKind; label: string }[] = [
  { kind: 'Masterclass', label: 'Masterclasses' },
  { kind: 'Digital', label: 'Digital Products' },
  { kind: 'Physical', label: 'Physical Products' },
]

export default function ExploreShop() {
  const navigate = useNavigate()
  const { save, isSaved, sheet } = useSaveGate()
  const featured = publicArtists.filter((a) => ['abhishek-singh-chouhan', 'kabir-menon', 'kavya-sharma'].includes(a.slug))

  return (
    <ExploreShell active="shop">
      <div className="px-[18px] pt-4">
        <div className="flex items-start gap-3 rounded-card border border-border bg-brand-soft p-4">
          <Store className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-ink">Shop preview</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#6d3357]">Masterclasses, digital resources and merchandise from creators. Full shop coming next.</p>
          </div>
        </div>
      </div>

      {kinds.map(({ kind, label }) => {
        const items = shopPreview.filter((p) => p.kind === kind)
        if (items.length === 0) return null
        return (
          <section key={kind} className="mt-7">
            <div className="mb-3 flex items-center justify-between px-[18px]">
              <h2 className="font-serif text-[19px] text-ink">{label}</h2>
              <button onClick={() => navigate('/explore/shop/coming')} className="tap flex items-center gap-0.5 text-[13px] font-semibold text-brand">View Shop <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{items.map((p) => <ShopCard key={p.id} item={p} />)}</div>
          </section>
        )
      })}

      <section className="mt-7">
        <h2 className="mb-3 px-[18px] font-serif text-[19px] text-ink">Featured Creators</h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {featured.map((a) => <ArtistListCard key={a.slug} artist={a} saved={isSaved('artist:' + a.slug)} onSave={save} />)}
        </div>
      </section>

      <div className="px-[18px] py-8">
        <button onClick={() => navigate('/explore/shop/coming')} className="tap flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark">
          Explore Shop
        </button>
      </div>

      {sheet}
    </ExploreShell>
  )
}
