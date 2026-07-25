import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ArtistUpdate } from '../../data/publicArtists'
import {
  WHATS_NEW_EYEBROW, headingForCategory, dateStatus, isCurrent, humanDate,
} from '../../config/announcements'

const SCROLL_KEY = 'iica_whatsnew_scroll_v1'
const GAP = 12

// Reusable across every profile category. Renders nothing when there are no
// current published announcements (public section hidden).
export default function WhatsNew({ updates, category }: { updates: ArtistUpdate[]; category?: string }) {
  const items = useMemo(() => {
    const current = updates.filter((u) => {
      const s = dateStatus(u.date, u.type)
      return s === 'Upcoming' || s === 'Today' || isCurrent(u.date)
    })
    // Featured first, then nearest upcoming date, then most recent.
    return [...current].sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
      const ta = Date.parse(a.date) || 0
      const tb = Date.parse(b.date) || 0
      return ta - tb
    })
  }, [updates])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const n = items.length
  const multi = n >= 2
  const showViewAll = n >= 6

  // Restore carousel position after returning from an opened item.
  useEffect(() => {
    if (!multi) return
    const el = scrollRef.current
    if (!el) return
    const saved = Number(sessionStorage.getItem(SCROLL_KEY) || 0)
    if (saved > 0) { el.scrollLeft = saved; onScroll() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multi])

  // Reset active only if it fell out of range after an update.
  useEffect(() => { if (active > n - 1) setActive(n > 0 ? 0 : 0) }, [n, active])

  const cardStep = () => {
    const el = scrollRef.current
    const first = el?.firstElementChild as HTMLElement | null
    return first ? first.offsetWidth + GAP : el?.clientWidth ?? 1
  }
  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setActive(Math.max(0, Math.round(el.scrollLeft / cardStep())))
  }
  const scrollToCard = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(n - 1, i))
    el.scrollTo({ left: clamped * cardStep(), behavior: 'smooth' })
    setActive(clamped)
  }
  // Convert vertical wheel to horizontal so trackpad/mouse works on desktop.
  const onWheel = (e: React.WheelEvent) => {
    const el = scrollRef.current
    if (!el || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
    el.scrollLeft += e.deltaY
  }
  const rememberScroll = () => {
    try { sessionStorage.setItem(SCROLL_KEY, String(scrollRef.current?.scrollLeft ?? 0)) } catch { /* ignore */ }
  }

  if (n === 0) return null

  return (
    <div className="mt-7">
      <div className="mb-2.5 flex items-end justify-between px-[18px]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{WHATS_NEW_EYEBROW}</p>
          <h2 className="mt-0.5 font-serif text-[20px] leading-tight text-ink">{headingForCategory(category)}</h2>
        </div>
        {showViewAll && (
          <button onClick={() => setShowAll(true)} className="tap shrink-0 text-[13px] font-semibold text-brand hover:text-brand-dark">View All</button>
        )}
      </div>

      {/* Single announcement — one full-width card, no carousel/pagination. */}
      {!multi ? (
        <div className="px-[18px]">
          <Card u={items[0]} onNavigate={rememberScroll} full />
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            onScroll={onScroll}
            onWheel={onWheel}
            tabIndex={0}
            role="list"
            aria-label="Upcoming announcements, horizontally scrollable"
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-[18px] pb-1"
            style={{ gap: GAP, scrollPaddingLeft: 18 }}
          >
            {items.map((u) => (
              <div key={u.id} role="listitem" className="shrink-0 snap-start" style={{ flexBasis: '86%' }}>
                <Card u={u} onNavigate={rememberScroll} />
              </div>
            ))}
          </div>

          {/* Pagination: dots for 2–5, "i of n" beyond. Subtle prev/next for desktop. */}
          <div className="mt-2 flex items-center justify-center gap-3 px-[18px]">
            <button onClick={() => scrollToCard(active - 1)} disabled={active === 0} aria-label="Previous announcement" className="tap flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/[0.04] disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            {n <= 5 ? (
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Announcement pagination">
                {items.map((_, i) => (
                  <button key={i} onClick={() => scrollToCard(i)} aria-label={`Go to announcement ${i + 1}`} aria-selected={i === active} className={`tap h-1.5 rounded-full transition-all ${i === active ? 'w-4 bg-brand' : 'w-1.5 bg-border'}`} />
                ))}
              </div>
            ) : (
              <span className="text-[12px] font-semibold text-muted" aria-live="polite">{active + 1} of {n}</span>
            )}
            <button onClick={() => scrollToCard(active + 1)} disabled={active === n - 1} aria-label="Next announcement" className="tap flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/[0.04] disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </>
      )}

      {showAll && <ViewAllSheet items={items} onClose={() => setShowAll(false)} onNavigate={rememberScroll} category={category} />}
    </div>
  )
}

function Card({ u, onNavigate, full }: { u: ArtistUpdate; onNavigate: () => void; full?: boolean }) {
  const navigate = useNavigate()
  const status = dateStatus(u.date, u.type)
  const external = !!u.href && /^https?:\/\//i.test(u.href)

  const cta = () => {
    if (!u.href) return
    onNavigate()
    if (external) window.open(u.href, '_blank', 'noopener,noreferrer')
    else navigate(u.href)
  }

  const ctaInner = (
    <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand">
      {u.cta}{external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
    </span>
  )

  return (
    <div className={`flex min-h-[196px] flex-col overflow-hidden rounded-[11px] border border-border bg-surface ${full ? 'w-full' : ''}`}>
      {u.image && (
        <div className="aspect-[16/9] w-full shrink-0 overflow-hidden bg-brand-soft">
          <img src={u.image} alt={u.title} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{u.type}</span>
          <span className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{status}</span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-[16px] leading-snug text-ink">{u.title}</h3>
        <p className="mt-1 text-[12px] font-medium text-ink/70">{humanDate(u.date)}{u.time ? ` · ${u.time}` : ''}</p>
        {u.description && <p className="mt-1 line-clamp-3 text-[12.5px] leading-relaxed text-muted">{u.description}</p>}
        {u.location && <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-muted"><MapPin className="h-3 w-3" /> {u.location}</p>}
        {u.cta && (
          <div className="mt-auto pt-2.5">
            {u.href ? (
              <button onClick={cta} aria-label={`${u.cta} — ${u.title}`} className="tap inline-flex min-h-[36px] items-center">{ctaInner}</button>
            ) : (
              <span className="inline-flex min-h-[36px] items-center">{ctaInner}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Focused "View All" list: Upcoming, then Recently Released/Completed.
function ViewAllSheet({ items, onClose, onNavigate, category }: { items: ArtistUpdate[]; onClose: () => void; onNavigate: () => void; category?: string }) {
  const upcoming = items.filter((u) => { const s = dateStatus(u.date, u.type); return s === 'Upcoming' || s === 'Today' })
  const past = items.filter((u) => { const s = dateStatus(u.date, u.type); return s === 'Recently Released' || s === 'Completed' })
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-bg" role="dialog" aria-modal="true">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-2" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={onClose} aria-label="Back" className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
        <h1 className="font-serif text-[17px] text-ink">{headingForCategory(category)}</h1>
        <button onClick={onClose} aria-label="Close" className="tap ml-auto flex h-11 w-11 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
      </header>
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}>
        {upcoming.length > 0 && <Group title="Upcoming" items={upcoming} onNavigate={onNavigate} />}
        {past.length > 0 && <Group title="Recently Released / Completed" items={past} onNavigate={onNavigate} />}
      </div>
    </div>
  )
}

function Group({ title, items, onNavigate }: { title: string; items: ArtistUpdate[]; onNavigate: () => void }) {
  return (
    <section className="mb-5">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">{title}</p>
      <div className="flex flex-col gap-3">
        {items.map((u) => <Card key={u.id} u={u} onNavigate={onNavigate} full />)}
      </div>
    </section>
  )
}
