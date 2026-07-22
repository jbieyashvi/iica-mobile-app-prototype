import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bookmark } from 'lucide-react'
import BottomNavigation from '../BottomNavigation'

const TABS = [
  { id: 'foryou', label: 'For You', to: '/explore' },
  { id: 'artists', label: 'Artists', to: '/explore/artists' },
  { id: 'events', label: 'Events', to: '/explore/events' },
  { id: 'content', label: 'Content', to: '/explore/content' },
  { id: 'shop', label: 'Shop', to: '/explore/shop' },
]

interface Props {
  active: string
  children: ReactNode
  filterButton?: ReactNode
}

export default function ExploreShell({ active, children, filterButton }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-[18px] backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <h1 className="font-serif text-[22px] text-ink">Explore</h1>
          <div className="flex -mr-2">
            <button onClick={() => navigate('/explore/search')} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Search className="h-5 w-5" /></button>
            <button onClick={() => navigate('/explore/saved')} aria-label="Saved items" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Bookmark className="h-5 w-5" /></button>
          </div>
        </div>

        {/* search field */}
        <button onClick={() => navigate('/explore/search')} className="tap mb-2 flex h-11 w-full items-center gap-2 rounded-control border border-border bg-surface px-3 text-left">
          <Search className="h-4 w-4 text-muted" />
          <span className="text-[13.5px] text-muted">Search artists, events, content and products</span>
        </button>

        {/* discovery nav + optional filter */}
        <div className="flex items-center gap-2">
          <div className="no-scrollbar -mx-[18px] flex flex-1 gap-4 overflow-x-auto px-[18px]">
            {TABS.map((t) => {
              const on = active === t.id
              return (
                <button key={t.id} onClick={() => navigate(t.to)} className="tap relative shrink-0 pb-2.5 pt-0.5">
                  <span className={`text-[14px] font-semibold transition-colors ${on ? 'text-ink' : 'text-muted'}`}>{t.label}</span>
                  {on && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-brand" />}
                </button>
              )
            })}
          </div>
          {filterButton}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 8px)' }}>
        {children}
      </div>

      <BottomNavigation />
    </div>
  )
}
