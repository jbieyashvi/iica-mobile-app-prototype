import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, ArrowLeftRight, ArrowUpDown } from 'lucide-react'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import RecommendCard from './RecommendCard'
import InfiniteCarousel from './InfiniteCarousel'
import { useRecommended } from '../../recommend/useRecommended'
import type { RecommendedCard as Card, ScrollDirection } from '../../recommend/types'

const VERTICAL_BATCH = 6

// Prototype-only: lets a reviewer flip the Home layout between the Admin
// scrollDirection values without editing config. Persisted so a refresh keeps
// the choice. Not part of the production app.
const DIR_OVERRIDE_KEY = 'iica_reco_dir_override'
function loadDirOverride(): ScrollDirection | null {
  const v = (() => { try { return localStorage.getItem(DIR_OVERRIDE_KEY) } catch { return null } })()
  return v === 'horizontal' || v === 'vertical' ? v : null
}

// Admin-curated Home section. Renders only the published, visible, in-schedule
// configuration with ≥1 valid listing — otherwise nothing (no blank spacing).
// The heading/description come from the Admin config (never hardcoded).
//
// scrollDirection (Admin-compatible, defaults to 'horizontal'):
//   - 'horizontal' → smooth, optionally-infinite swipeable carousel.
//   - 'vertical'   → natural vertical list that progressively loads 6 at a time
//     as the user nears the end (no nested scrollbar; the page scrolls).
export default function RecommendedHome() {
  const navigate = useNavigate()
  const { visible, config, cards } = useRecommended()
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  // Progressive window for the vertical layout.
  const [count, setCount] = useState(VERTICAL_BATCH)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Prototype-only layout override (falls back to the Admin config value).
  const [dirOverride, setDirOverride] = useState<ScrollDirection | null>(loadDirOverride)
  const setDir = (d: ScrollDirection) => {
    setDirOverride(d)
    try { localStorage.setItem(DIR_OVERRIDE_KEY, d) } catch { /* ignore */ }
  }
  const direction: ScrollDirection = dirOverride ?? config?.scrollDirection ?? 'horizontal'
  const isVertical = direction === 'vertical'

  // Reset the window when the published list changes.
  useEffect(() => { setCount(VERTICAL_BATCH) }, [config?.id, cards.length])

  // Grow the vertical window as its end approaches the viewport. root:null so it
  // works regardless of which ancestor scrolls; stops once all cards are shown.
  // The observer is "armed" only after a short settle so the mount-time layout
  // collapse (images above still reserving height) can't trigger a phantom
  // intersection that loads everything at once.
  useEffect(() => {
    if (!isVertical) return
    const el = sentinelRef.current
    if (!el) return
    if (count >= cards.length) return
    let armed = false
    const t = setTimeout(() => { armed = true }, 200)
    const io = new IntersectionObserver((entries) => {
      if (armed && entries.some((e) => e.isIntersecting)) {
        setCount((c) => Math.min(cards.length, c + VERTICAL_BATCH))
      }
    }, { root: null, rootMargin: '0px 0px 240px 0px' })
    io.observe(el)
    return () => { clearTimeout(t); io.disconnect() }
  }, [isVertical, count, cards.length])

  if (!visible || !config) return null

  const showViewAll = cards.length > 4

  return (
    <div className="relative mb-8">
      <PageContainer>
        <SectionHeader
          title={config.heading}
          action={showViewAll ? 'View All' : undefined}
          onAction={showViewAll ? () => navigate('/recommended') : undefined}
        />
        {config.description && <p className="-mt-1 mb-3 text-[12.5px] leading-relaxed text-muted">{config.description}</p>}

        {/* Prototype-only layout toggle — not part of the production app. */}
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
            <FlaskConical className="h-3.5 w-3.5" /> Proto
          </span>
          <div className="inline-flex overflow-hidden rounded-control border border-border">
            <button
              onClick={() => setDir('horizontal')}
              aria-pressed={!isVertical}
              className={`tap flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold ${!isVertical ? 'bg-ink text-white' : 'bg-surface text-muted'}`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Horizontal
            </button>
            <button
              onClick={() => setDir('vertical')}
              aria-pressed={isVertical}
              className={`tap flex items-center gap-1 border-l border-border px-2.5 py-1 text-[12px] font-semibold ${isVertical ? 'bg-ink text-white' : 'bg-surface text-muted'}`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" /> Vertical
            </button>
          </div>
        </div>
      </PageContainer>

      {isVertical ? (
        <PageContainer>
          <div className="flex flex-col gap-3">
            {cards.slice(0, count).map((c) => (
              <RecommendCard key={c.key} card={c} flash={flash} variant="list" />
            ))}
          </div>
          {/* Sentinel: when it nears the viewport, load the next group. */}
          {count < cards.length && <div ref={sentinelRef} aria-hidden className="h-1 w-full" />}
        </PageContainer>
      ) : (
        <InfiniteCarousel<Card>
          items={cards}
          getKey={(c) => c.key}
          infinite={config.infiniteLoop}
          storageKey="recommended"
          ariaLabel={config.heading}
          renderItem={(c) => <RecommendCard card={c} flash={flash} />}
        />
      )}

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
