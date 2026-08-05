import { useNavigate } from 'react-router-dom'
import { ChevronRight, Play, FileText, ExternalLink, MapPin } from 'lucide-react'
import { useShop } from '../../state/ShopContext'
import { inr } from '../../shop/pricing'
import type { Hit } from '../../search/engine'

// A single search result with contextual actions per group. All actions are
// public browse/view actions; downstream screens enforce guest/membership
// rules (checkout, ticketing, joining a class).
export default function SearchHitRow({ hit, flash }: { hit: Hit; flash: (m: string) => void }) {
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const from = { state: { from: '/search' } }

  const openCreator = () => navigate(`/artist/${hit.slug}`, from)
  const secondary: { label: string; onClick: () => void; icon?: typeof Play } | null = (() => {
    switch (hit.group) {
      case 'events':
        return hit.paid
          ? { label: 'Get Tickets', onClick: () => navigate(`/events/${hit.eventId}/tickets`, from) }
          : { label: 'Book Free', onClick: () => navigate(`/events/${hit.eventId}/register`, from) }
      case 'classes':
        return { label: hit.free ? 'Join' : `Buy ${inr(hit.price ?? 0)}`, onClick: () => navigate(`/product/${hit.productId}`, from) }
      case 'products':
        return { label: 'Add to Cart', onClick: () => { addToCart(hit.productId!); flash('Added to cart') } }
      case 'archive':
        return { label: 'Open YouTube', icon: ExternalLink, onClick: () => hit.videoUrl && window.open(hit.videoUrl, '_blank', 'noopener,noreferrer') }
      case 'resources':
        return { label: 'Read Free', icon: FileText, onClick: () => navigate(`/artist/${hit.slug}/resource/${hit.resourceId}`, from) }
      default:
        return null
    }
  })()

  const primary = () => {
    switch (hit.group) {
      case 'creators': return openCreator()
      case 'events': return navigate(`/events/${hit.eventId}`, from)
      case 'classes':
      case 'products': return navigate(`/product/${hit.productId}`, from)
      case 'archive': return navigate(`/archive/video/${hit.id}`, from)
      case 'resources': return navigate(`/artist/${hit.slug}/resource/${hit.resourceId}`, from)
    }
  }

  const round = hit.group === 'creators'

  return (
    <div className="flex gap-3 rounded-card border border-border bg-surface p-3">
      <button onClick={primary} className="tap flex min-w-0 flex-1 gap-3 text-left">
        <div className={`relative h-[58px] w-[58px] shrink-0 overflow-hidden ${round ? 'rounded-full' : 'rounded-[10px]'} bg-brand-soft`}>
          {hit.image ? <img src={hit.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : null}
          {hit.group === 'archive' && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink"><Play className="ml-0.5 h-3.5 w-3.5 fill-ink" /></span>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{hit.title}</p>
          <p className="truncate text-[12px] text-muted">{hit.subtitle}</p>
          <div className="mt-0.5 flex items-center gap-2 text-[11.5px]">
            {hit.meta && <span className="font-semibold text-brand-dark">{hit.meta}</span>}
            {typeof hit.distanceKm === 'number' && isFinite(hit.distanceKm) && (
              <span className="flex items-center gap-0.5 text-brand"><MapPin className="h-3 w-3" />{hit.distanceKm === 0 ? `In ${hit.city}` : `~${Math.round(hit.distanceKm)} km`}</span>
            )}
          </div>
        </div>
      </button>

      <div className="flex shrink-0 flex-col items-end justify-center gap-1.5">
        {secondary && (
          <button onClick={secondary.onClick} className="tap flex min-h-[30px] items-center gap-1 rounded-control bg-ink px-2.5 text-[11.5px] font-semibold text-white hover:bg-ink/90">
            {secondary.icon && <secondary.icon className="h-3.5 w-3.5" />} {secondary.label}
          </button>
        )}
        <button onClick={primary} aria-label="Open" className="tap flex h-6 w-6 items-center justify-center rounded-full text-muted">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
