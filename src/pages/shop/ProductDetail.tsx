import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Star, Bookmark, BookmarkCheck, Share2, ChevronRight, Check, PlayCircle, FileText, Package,
  GraduationCap, Globe, Clock, Award, ShieldCheck, Info,
} from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import ProductCard from '../../components/shop/ProductCard'
import ShareSheet from '../../components/explore/ShareSheet'
import { useSaveGate } from '../../components/SaveGate'
import { useShop } from '../../state/ShopContext'
import { inr, unitPrice } from '../../shop/pricing'
import { Variant } from '../../shop/types'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, products, addToCart, markViewed } = useShop()
  const { save, isSaved } = useSaveGate()
  const [gi, setGi] = useState(0)
  const [variant, setVariant] = useState<Variant | undefined>()
  const [qty, setQty] = useState(1)
  const [share, setShare] = useState(false)
  const [toast, setToast] = useState('')

  const p = getProduct(id)
  useEffect(() => { if (id) markViewed(id) }, [id, markViewed])

  if (!p) return <BackHeader title="Product" />
  const key = 'product:' + p.id
  const saved = isSaved(key)
  const soldOut = p.type === 'Physical' && (variant ? variant.stock : (p.stock ?? 0)) <= 0
  const price = unitPrice(p, variant?.id)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const related = products.filter((x) => x.id !== p.id && (x.category === p.category || x.sellerId === p.sellerId) && x.status === 'published').slice(0, 6)
  const moreFrom = products.filter((x) => x.id !== p.id && x.sellerId === p.sellerId && x.status === 'published')

  const add = (buyNow: boolean) => {
    addToCart(p.id, p.type === 'Physical' ? qty : 1, variant?.id)
    if (buyNow) navigate('/cart')
    else flash('Added to cart')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="no-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative">
          <BackHeader transparent right={
            <div className="flex gap-1.5">
              <button onClick={() => setShare(true)} aria-label="Share" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm"><Share2 className="h-5 w-5" /></button>
              <button onClick={() => save(key)} aria-label="Save" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm">{saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}</button>
            </div>
          } />
          {/* gallery cover */}
          <div className="absolute inset-x-0 top-0 -z-10 aspect-square w-full overflow-hidden bg-brand-soft">
            <img src={p.images[gi] ?? p.cover} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
          </div>
        </div>

        {/* spacer to reveal the square cover, then content */}
        <div className="mt-[84%]" />
        {p.images.length > 1 && (
          <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto px-[18px] pb-1">
            {p.images.map((img, i) => (
              <button key={i} onClick={() => setGi(i)} className={`tap h-12 w-12 shrink-0 overflow-hidden rounded-[8px] border-2 ${gi === i ? 'border-brand' : 'border-white/70'}`}><img src={img} alt="" className="h-full w-full object-cover" /></button>
            ))}
          </div>
        )}

        <div className="px-[18px] pb-40">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge tone="brand">{p.type}</StatusBadge>
            <span className="text-[12px] text-muted">{p.category}</span>
          </div>
          <h1 className="mt-2 font-serif text-[24px] leading-tight text-ink">{p.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-[12.5px] text-muted">
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-brand text-brand" /> {p.rating || '—'}</span>
            <span>· {p.reviews} reviews</span>
          </div>

          {/* creator */}
          <button onClick={() => navigate(`/artist/${p.sellerId}`)} className="tap mt-3 flex w-full items-center gap-3 rounded-card border border-border bg-surface p-3 text-left">
            <Avatar name={p.sellerName} src={p.sellerAvatar} size={38} />
            <div className="min-w-0 flex-1"><p className="text-[11px] uppercase tracking-wide text-muted">Sold by</p><p className="truncate text-[14px] font-semibold text-ink">{p.sellerName}</p></div>
            <ChevronRight className="h-5 w-5 text-muted" />
          </button>

          <Section title="Description"><p className="text-[14px] leading-relaxed text-ink">{p.description}</p></Section>

          {/* type-specific */}
          {p.type === 'Masterclass' && (
            <>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Fact icon={<GraduationCap className="h-4 w-4" />} label="Level" value={p.level ?? '—'} />
                <Fact icon={<Globe className="h-4 w-4" />} label="Language" value={p.language} />
                <Fact icon={<Clock className="h-4 w-4" />} label="Duration" value={p.duration ?? '—'} />
                <Fact icon={<PlayCircle className="h-4 w-4" />} label="Lessons" value={String(p.syllabus?.reduce((s, x) => s + x.lessons.length, 0) ?? 0)} />
                <Fact icon={<Award className="h-4 w-4" />} label="Certificate" value={p.certificate ? 'Yes' : 'No'} />
                <Fact icon={<ShieldCheck className="h-4 w-4" />} label="Access" value={p.accessDuration ?? '—'} />
              </div>
              {p.outcomes && <Section title="What you'll learn"><ul className="flex flex-col gap-1.5">{p.outcomes.map((o) => <li key={o} className="flex gap-2 text-[13.5px] text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {o}</li>)}</ul></Section>}
              {p.syllabus && (
                <Section title="Syllabus">
                  <div className="flex flex-col gap-3">
                    {p.syllabus.map((sec) => (
                      <div key={sec.id} className="overflow-hidden rounded-card border border-border bg-surface">
                        <div className="border-b border-border px-3.5 py-2.5"><p className="text-[13.5px] font-semibold text-ink">{sec.title}</p></div>
                        {sec.lessons.map((l) => (
                          <div key={l.id} className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px]">
                            <PlayCircle className="h-4 w-4 shrink-0 text-muted" />
                            <span className="flex-1 text-ink">{l.title}</span>
                            {l.freePreview && <StatusBadge tone="success">Preview</StatusBadge>}
                            <span className="text-[11.5px] text-muted">{l.duration}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}

          {p.type === 'Digital' && (
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Fact icon={<FileText className="h-4 w-4" />} label="Type" value={p.digitalType === 'Other' ? (p.customType ?? 'Other') : (p.digitalType ?? '—')} />
              <Fact icon={<FileText className="h-4 w-4" />} label="Format" value={p.fileFormat ?? '—'} />
              <Fact icon={<Info className="h-4 w-4" />} label="Size" value={p.fileSize ?? '—'} />
              <Fact icon={<ShieldCheck className="h-4 w-4" />} label="Licence" value={p.licence ?? '—'} />
              <Fact icon={<Info className="h-4 w-4" />} label="Version" value={p.version ?? '—'} />
              <Fact icon={<Info className="h-4 w-4" />} label="Downloads" value={p.downloadLimit ?? '—'} />
            </div>
          )}
          {p.type === 'Digital' && <p className="mt-3 flex items-center gap-2 rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border"><Info className="h-4 w-4 text-brand" /> Instant download after purchase.</p>}

          {p.type === 'Physical' && (
            <>
              {p.variants && p.variants.length > 0 && (
                <Section title="Options">
                  <div className="flex flex-wrap gap-2">
                    {p.variants.map((v) => (
                      <button key={v.id} onClick={() => setVariant(v)} disabled={v.stock <= 0} className={`tap rounded-control border px-3 py-2 text-[12.5px] font-semibold disabled:opacity-40 ${variant?.id === v.id ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>{v.name}{v.stock <= 0 ? ' · Sold out' : ''}</button>
                    ))}
                  </div>
                </Section>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Fact icon={<Package className="h-4 w-4" />} label="Stock" value={soldOut ? 'Out of stock' : `${variant ? variant.stock : p.stock} available`} />
                <Fact icon={<Globe className="h-4 w-4" />} label="Ships to" value={p.shippingRegions ?? '—'} />
                <Fact icon={<Clock className="h-4 w-4" />} label="Delivery" value={p.deliveryEstimate ?? '—'} />
                <Fact icon={<Info className="h-4 w-4" />} label="Shipping" value={p.shippingType === 'Free' ? 'Free' : inr(p.shippingCost ?? 0)} />
              </div>
              {!soldOut && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-ink">Quantity</span>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="tap flex h-10 w-10 items-center justify-center rounded-control border border-border text-[18px]">−</button>
                  <span className="w-6 text-center text-[15px] font-bold text-ink">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(variant ? variant.stock : (p.stock ?? 1), q + 1))} className="tap flex h-10 w-10 items-center justify-center rounded-control border border-border text-[18px]">+</button>
                </div>
              )}
            </>
          )}

          {/* refund info */}
          <Section title={p.type === 'Physical' ? 'Returns' : 'Refunds'}>
            <div className="flex items-start gap-2.5 rounded-card border border-border bg-surface p-3.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <p className="text-[12.5px] leading-relaxed text-muted">{p.type === 'Physical' ? (p.returnEligible ? `Returnable within ${p.returnWindow}. ${p.care ?? ''}` : 'This item is not returnable.') : 'Digital purchases are non-refundable once downloaded, except for access issues.'}</p>
            </div>
          </Section>

          {moreFrom.length > 0 && (
            <section className="pt-7"><h2 className="mb-3 font-serif text-[18px] text-ink">More from {p.sellerName.split(' ')[0]}</h2><div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px]">{moreFrom.map((x) => <ProductCard key={x.id} product={x} />)}</div></section>
          )}
          {related.length > 0 && (
            <section className="pt-7"><h2 className="mb-3 font-serif text-[18px] text-ink">Related products</h2><div className="no-scrollbar -mx-[18px] flex gap-3 overflow-x-auto px-[18px]">{related.map((x) => <ProductCard key={x.id} product={x} />)}</div></section>
          )}
        </div>
      </div>

      {/* sticky action */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[11px] uppercase tracking-wide text-muted">Price</p><p className="text-[18px] font-bold text-ink">{p.free ? 'Free' : inr(price)}</p></div>
          {soldOut ? (
            <SecondaryButton className="flex-1" disabled>Sold Out</SecondaryButton>
          ) : p.type === 'Physical' ? (
            <div className="flex flex-1 gap-2">
              <SecondaryButton onClick={() => add(false)} className="flex-1">Add to Cart</SecondaryButton>
              <PrimaryButton onClick={() => add(true)} className="flex-1">Buy Now</PrimaryButton>
            </div>
          ) : (
            <PrimaryButton className="flex-1" onClick={() => add(true)}>{p.type === 'Masterclass' ? 'Buy Masterclass' : 'Buy Digital Product'}</PrimaryButton>
          )}
        </div>
      </div>

      {share && <ShareSheet title={p.title} url={`https://iica.app/product/${p.id}`} onClose={() => setShare(false)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="pt-6"><h2 className="mb-2.5 font-serif text-[18px] text-ink">{title}</h2>{children}</section>
}
function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-2.5 rounded-card border border-border bg-surface px-3 py-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-brand-soft text-brand-dark">{icon}</span><div className="min-w-0"><p className="text-[11px] text-muted">{label}</p><p className="truncate text-[13px] font-semibold text-ink">{value}</p></div></div>
}
