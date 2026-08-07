import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../PageContainer'
import SectionHeader from '../SectionHeader'
import RecommendCard from './RecommendCard'
import InfiniteCarousel from './InfiniteCarousel'
import { useRecommended } from '../../recommend/useRecommended'
import type { RecommendedCard as Card } from '../../recommend/types'

// Admin-curated Home section. Renders only the published, visible, in-schedule
// configuration with ≥1 valid listing — otherwise nothing (no blank spacing).
// The heading/description come from the Admin config (never hardcoded); the row
// is a smooth, optionally-infinite horizontal carousel. View All opens the full
// filterable list.
export default function RecommendedHome() {
  const navigate = useNavigate()
  const { visible, config, cards } = useRecommended()
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

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
      </PageContainer>

      <InfiniteCarousel<Card>
        items={cards}
        getKey={(c) => c.key}
        infinite={config.infiniteLoop}
        storageKey="recommended"
        ariaLabel={config.heading}
        renderItem={(c) => <RecommendCard card={c} flash={flash} />}
      />

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
