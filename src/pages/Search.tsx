import { Search as SearchIcon } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import EmptyState from '../components/EmptyState'

export default function Search() {
  return (
    <div className="flex h-full flex-col">
      <BackHeader
        right={
          <div className="flex flex-1 items-center">
            <div className="flex h-10 w-[280px] items-center gap-2 rounded-control border border-border bg-surface px-3">
              <SearchIcon className="h-4 w-4 text-muted" />
              <input
                autoFocus
                placeholder="Search artists, events, cities…"
                className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>
        }
      />
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" strokeWidth={1.6} />}
          title="Search is coming soon"
          description="Find artists, events, workshops and products across IICA. This experience will be built next."
        />
      </div>
    </div>
  )
}
