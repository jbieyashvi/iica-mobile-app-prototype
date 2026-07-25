import { useNavigate } from 'react-router-dom'

// Shared Explore discovery tabs — used by ExploreShell (For You / Events /
// Archive) and the standalone Artist Catalogue so the row never disappears.
export const EXPLORE_TABS = [
  { id: 'foryou', label: 'For You', to: '/explore' },
  { id: 'artists', label: 'Artists', to: '/explore/artists' },
  { id: 'events', label: 'Events', to: '/explore/events' },
  { id: 'archive', label: 'Archive', to: '/explore/archive' },
]

export default function ExploreTabs({ active }: { active: string }) {
  const navigate = useNavigate()
  return (
    <div className="no-scrollbar -mx-[18px] flex flex-1 gap-4 overflow-x-auto px-[18px]">
      {EXPLORE_TABS.map((t) => {
        const on = active === t.id
        return (
          <button key={t.id} onClick={() => navigate(t.to)} className="tap relative shrink-0 pb-2.5 pt-0.5">
            <span className={`text-[14px] font-semibold transition-colors ${on ? 'text-ink' : 'text-muted'}`}>{t.label}</span>
            {on && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-brand" />}
          </button>
        )
      })}
    </div>
  )
}
