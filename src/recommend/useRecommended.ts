import { useMemo } from 'react'
import { useShop } from '../state/ShopContext'
import { useEvents } from '../state/EventsContext'
import { getMockArtist } from '../data/publicArtists'
import { inr, formatMoney } from '../shop/pricing'
import type { Product } from '../shop/types'
import type { EventItem } from '../events/types'
import { loadRecommendedConfig } from './config'
import type { RecommendedCard, RecommendedConfig, SelectedListing } from './types'

function physicalInStock(p: Product): boolean {
  if (p.variants && p.variants.length) return p.variants.some((v) => v.stock > 0)
  return (p.stock ?? 0) > 0
}
function productAvailable(p: Product): boolean {
  if (p.status && p.status !== 'published') return false // draft/archived/out-of-stock/pending
  if (p.type === 'Physical' && !physicalInStock(p)) return false
  return true
}
function minTicketPrice(ev: EventItem): number | null {
  if (!ev.paid) return 0
  const prices = (ev.tickets ?? []).map((t) => t.price).filter((n) => n > 0)
  return prices.length ? Math.min(...prices) : null
}
function eventDateLabel(iso: string): string {
  const d = new Date(iso + (iso?.length === 10 ? 'T00:00:00' : ''))
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
// An event is expired once its end date (or start date, when no end) is before
// today. Expired/cancelled/draft/past events are excluded from the carousel.
function eventExpired(ev: EventItem, now: Date): boolean {
  const iso = ev.endDate || ev.startDate
  if (!iso) return false
  const end = new Date(iso + (iso.length === 10 ? 'T23:59:59' : ''))
  return !isNaN(end.getTime()) && end.getTime() < now.getTime()
}

function resolveCard(sel: SelectedListing, products: Product[], events: EventItem[], now: Date): RecommendedCard | null {
  const { listingId, listingType } = sel

  if (
    listingType === 'physical_product' || listingType === 'digital_product' ||
    listingType === 'masterclass' || listingType === 'secondhand_instrument'
  ) {
    const p = products.find((x) => x.id === listingId)
    if (!p || !productAvailable(p)) return null
    if (listingType === 'masterclass' && p.type !== 'Masterclass') return null
    const isClass = p.type === 'Masterclass'
    const typeLabel = listingType === 'secondhand_instrument' ? 'Second-hand' : (isClass ? 'Class' : p.type)
    return {
      key: `${sel.displayOrder}:${listingType}:${p.id}`, type: listingType, listingId: p.id,
      title: p.title,
      subtitle: isClass ? (p.instructor || p.sellerName) : p.sellerName,
      meta: p.free ? 'Free' : inr(p.price),
      typeLabel,
      image: p.cover, free: p.free, price: p.free ? 0 : p.price,
      productId: p.id,
    }
  }

  if (listingType === 'event') {
    const ev = events.find((x) => x.id === listingId)
    if (!ev || (ev.status && ev.status !== 'published')) return null
    if (eventExpired(ev, now)) return null
    const price = minTicketPrice(ev)
    return {
      key: `${sel.displayOrder}:event:${ev.id}`, type: 'event', listingId: ev.id,
      title: ev.title,
      subtitle: ev.organiserName || 'IICA',
      meta: [eventDateLabel(ev.startDate), ev.format === 'Online' ? 'Online' : (ev.city ?? '')].filter(Boolean).join(' · '),
      typeLabel: 'Event',
      image: ev.cover, free: !ev.paid, price, paid: ev.paid,
      eventId: ev.id,
    }
  }

  // donation → "<artistSlug>::<optionId>"
  const [slug, optionId] = listingId.split('::')
  const artist = getMockArtist(slug)
  if (!artist || artist.visibility !== 'Public' || !artist.support) return null
  const opt = artist.support.options.find((o) => o.id === optionId && o.amount > 0)
  if (!opt) return null
  return {
    key: `${sel.displayOrder}:donation:${slug}:${optionId}`, type: 'donation', listingId,
    title: opt.title || 'Support',
    subtitle: artist.name,
    meta: formatMoney(opt.amount, opt.currency),
    typeLabel: 'Support',
    image: artist.photo, free: false, price: opt.amount,
    artistSlug: slug, optionId,
  }
}

export interface Resolved {
  config: RecommendedConfig | null
  /** Section may render (published + visible + in-schedule + ≥1 valid card). */
  visible: boolean
  /** Reason the section is hidden (for tests/empty states). */
  hiddenReason: '' | 'no-config' | 'draft' | 'hidden' | 'not-started' | 'expired' | 'no-listings'
  cards: RecommendedCard[]
}

export function useRecommended(now: Date = new Date()): Resolved {
  const { products } = useShop()
  const { events } = useEvents()

  return useMemo<Resolved>(() => {
    const config = loadRecommendedConfig()
    if (!config) return { config: null, visible: false, hiddenReason: 'no-config', cards: [] }
    if (config.state !== 'published') return { config, visible: false, hiddenReason: 'draft', cards: [] }
    if (!config.isVisible) return { config, visible: false, hiddenReason: 'hidden', cards: [] }

    const nowT = now.getTime()
    if (config.startAt && !isNaN(Date.parse(config.startAt)) && nowT < Date.parse(config.startAt))
      return { config, visible: false, hiddenReason: 'not-started', cards: [] }
    if (config.endAt && !isNaN(Date.parse(config.endAt)) && nowT > Date.parse(config.endAt))
      return { config, visible: false, hiddenReason: 'expired', cards: [] }

    const seen = new Set<string>()
    const cards = [...config.selectedListings]
      .sort((a, b) => a.displayOrder - b.displayOrder) // preserve Admin order
      .map((s) => resolveCard(s, products, events, now))
      .filter((c): c is RecommendedCard => c !== null)
      // Drop duplicate listing identities so the same item can't appear twice
      // in one carousel cycle (and never collides on a React key).
      .filter((c) => {
        const id = `${c.type}:${c.listingId}`
        if (seen.has(id)) return false
        seen.add(id)
        return true
      })

    if (cards.length === 0) return { config, visible: false, hiddenReason: 'no-listings', cards: [] }
    return { config, visible: true, hiddenReason: '', cards }
  }, [products, events, now])
}
