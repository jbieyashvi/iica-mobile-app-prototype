import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Search } from 'lucide-react'
import BottomNavigation from '../BottomNavigation'
import ProfileAvatarButton from '../ProfileAvatarButton'
import ExploreTabs from './ExploreTabs'

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
          <div className="flex items-center -mr-1">
            <button onClick={() => navigate('/search')} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Search className="h-5 w-5" /></button>
            <button onClick={() => navigate('/explore/saved')} aria-label="Saved items" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Bookmark className="h-5 w-5" /></button>
            <ProfileAvatarButton />
          </div>
        </div>

        {/* discovery nav + optional filter */}
        <div className="mt-1 flex items-center gap-2">
          <ExploreTabs active={active} />
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
