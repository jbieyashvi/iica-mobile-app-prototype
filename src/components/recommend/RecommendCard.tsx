import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, GraduationCap, CalendarDays, HeartHandshake, Package, ImageOff } from 'lucide-react'
import { useShop } from '../../state/ShopContext'
import { inr } from '../../shop/pricing'
import type { RecommendedCard as Card, ListingType } from '../../recommend/types'

const TYPE_ICON: Record<ListingType, typeof Package> = {
  physical_product: Package,
  digital_product: ShoppingBag,
  masterclass: GraduationCap,
  event: CalendarDays,
  donation: HeartHandshake,
}

// A single Admin-curated listing card. Resolves navigation + the existing
// action flow per listing type. Downstream screens enforce guest/membership
// rules (cart, checkout, ticketing, joining a class, support payment).
export default function RecommendCard({ card, flash, variant = 'carousel' }: {
  card: Card; flash: (m: string) => void; variant?: 'carousel' | 'list'
}) {
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const [imgFailed, setImgFailed] = useState(false)
  const from = { state: { from: '/recommended' } }
  const Icon = TYPE_ICON[card.type]

  const open = () => {
    switch (card.type) {
      case 'physical_product':
      case 'digital_product':
      case 'masterclass': return navigate(`/product/${card.productId}`, from)
      case 'event': return navigate(`/events/${card.eventId}`, from)
      case 'donation': return navigate(`/artist/${card.artistSlug}`, from)
    }
  }

  const secondary: { label: string; onClick: () => void } | null = (() => {
    switch (card.type) {
      case 'physical_product':
      case 'digital_product':
        return { label: 'Add to Cart', onClick: () => { addToCart(card.productId!); flash('Added to cart') } }
      case 'masterclass':
        return { label: card.free ? 'Join' : `Buy ${inr(card.price ?? 0)}`, onClick: () => navigate(`/product/${card.productId}`, from) }
      case 'event':
        return card.paid
          ? { label: 'Get Tickets', onClick: () => navigate(`/events/${card.eventId}/tickets`, from) }
          : { label: 'Book Free', onClick: () => navigate(`/events/${card.eventId}/register`, from) }
      case 'donation':
        return { label: 'Support Now', onClick: () => navigate(`/artist/${card.artistSlug}/support/${card.optionId}`, from) }
    }
  })()

  const alt = `${card.title} — ${card.typeLabel}`
  const round = card.type === 'donation'

  const Thumb = (
    <div className={`relative w-full overflow-hidden bg-brand-soft ${variant === 'carousel' ? 'aspect-[16/10]' : 'aspect-square'} ${round ? 'rounded-full' : ''}`}>
      {card.image && !imgFailed ? (
        <img src={card.image} alt={alt} loading="lazy" onError={() => setImgFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-brand-dark">{card.image ? <ImageOff className="h-6 w-6" /> : <Icon className="h-6 w-6" />}</div>
      )}
      <span className="absolute left-2 top-2 rounded-md bg-ink/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">{card.typeLabel}</span>
    </div>
  )

  if (variant === 'carousel') {
    return (
      <div className="w-[190px] shrink-0 overflow-hidden rounded-card border border-border bg-surface">
        <button onClick={open} aria-label={`Open ${card.title}`} className="tap block w-full text-left">
          <div className="p-2 pb-0">{Thumb}</div>
          <div className="p-3">
            <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink">{card.title}</h3>
            <p className="mt-0.5 truncate text-[11.5px] text-muted">{card.subtitle}</p>
            <p className="mt-0.5 text-[12px] font-semibold text-brand-dark">{card.meta}</p>
          </div>
        </button>
        {secondary && (
          <div className="px-3 pb-3">
            <button onClick={secondary.onClick} className="tap flex min-h-[34px] w-full items-center justify-center rounded-control bg-ink text-[12px] font-semibold text-white hover:bg-ink/90">{secondary.label}</button>
          </div>
        )}
      </div>
    )
  }

  // list (View All)
  return (
    <div className="flex gap-3 rounded-card border border-border bg-surface p-3">
      <button onClick={open} aria-label={`Open ${card.title}`} className="tap flex min-w-0 flex-1 gap-3 text-left">
        <div className="w-[72px] shrink-0">{Thumb}</div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{card.title}</h3>
          <p className="truncate text-[12px] text-muted">{card.subtitle}</p>
          <p className="mt-0.5 text-[12px] font-semibold text-brand-dark">{card.meta}</p>
        </div>
      </button>
      {secondary && (
        <div className="flex shrink-0 items-center">
          <button onClick={secondary.onClick} className="tap flex min-h-[32px] items-center rounded-control bg-ink px-3 text-[12px] font-semibold text-white hover:bg-ink/90">{secondary.label}</button>
        </div>
      )}
    </div>
  )
}
