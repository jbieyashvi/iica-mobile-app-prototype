import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import RecommendCard from './RecommendCard'
import { useRecommended } from '../../recommend/useRecommended'

const BATCH = 8

// Admin-curated Home section. Renders only the published, visible, in-schedule
// configuration with ≥1 valid listing — otherwise nothing (no blank spacing).
// No fixed maximum: cards render progressively as the user scrolls toward the
// end of the horizontal rail, preserving Admin order. View All is an additional
// entry, not the only way to reach later items.
export default function RecommendedHome() {
  const navigate = useNavigate()
  const { visible, config, cards } = useRecommended()
  const [count, setCount] = useState(BATCH)
  const [toast, setToast] = useState('')
  const railRef = useRef<HTMLDivElement>(null)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  // Reset the progressive window if the published list changes.
  useEffect(() => { setCount(BATCH) }, [config?.id, cards.length])

  if (!visible || !config) return null

  const shown = cards.slice(0, count)
  const hasMore = cards.length > count
  const showViewAll = cards.length > BATCH

  const onScroll = () => {
    const el = railRef.current
    if (!el) return
    // Grow the window as the user nears the right edge (progressive loading).
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 260) {
      setCount((c) => Math.min(cards.length, c + BATCH))
    }
  }

  return (
    <div className="mb-8">
      <PageContainer>
        <SectionHeader title={config.heading} action={showViewAll ? 'View All' : undefined} onAction={showViewAll ? () => navigate('/recommended') : undefined} />
        {config.description && <p className="-mt-1 mb-3 text-[12.5px] leading-relaxed text-muted">{config.description}</p>}
      </PageContainer>
      <div ref={railRef} onScroll={onScroll} className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
        {shown.map((c) => <RecommendCard key={c.key} card={c} flash={flash} />)}
        {hasMore && (
          <button
            onClick={() => setCount((c) => Math.min(cards.length, c + BATCH))}
            aria-label="Show more recommendations"
            className="tap flex w-[120px] shrink-0 flex-col items-center justify-center gap-1 rounded-card border border-dashed border-border bg-surface text-[12.5px] font-semibold text-brand"
          >
            More
          </button>
        )}
        {!hasMore && showViewAll && (
          <button
            onClick={() => navigate('/recommended')}
            aria-label="View all recommendations"
            className="tap flex w-[120px] shrink-0 flex-col items-center justify-center gap-1 rounded-card border border-dashed border-border bg-surface text-[12.5px] font-semibold text-brand"
          >
            View All
          </button>
        )}
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
