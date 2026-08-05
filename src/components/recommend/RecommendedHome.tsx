import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import RecommendCard from './RecommendCard'
import { useRecommended } from '../../recommend/useRecommended'

const HOME_MAX = 8

// Admin-curated Home section. Renders only the published, visible, in-schedule
// configuration with ≥1 valid listing — otherwise nothing (no blank spacing).
// Heading/description/order all come from the published config.
export default function RecommendedHome() {
  const navigate = useNavigate()
  const { visible, config, cards } = useRecommended()
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  // Returning null (with no wrapper margin) guarantees no blank spacing on Home.
  if (!visible || !config) return null
  const shown = cards.slice(0, HOME_MAX)
  const hasMore = cards.length > shown.length

  return (
    <div className="mb-8">
      <PageContainer>
        <SectionHeader title={config.heading} action={hasMore ? 'View All' : undefined} onAction={hasMore ? () => navigate('/recommended') : undefined} />
        {config.description && <p className="-mt-1 mb-3 text-[12.5px] leading-relaxed text-muted">{config.description}</p>}
      </PageContainer>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
        {shown.map((c) => <RecommendCard key={c.key} card={c} flash={flash} />)}
        {hasMore && (
          <button onClick={() => navigate('/recommended')} className="tap flex w-[120px] shrink-0 flex-col items-center justify-center gap-1 rounded-card border border-dashed border-border bg-surface text-[12.5px] font-semibold text-brand">
            View All
          </button>
        )}
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
