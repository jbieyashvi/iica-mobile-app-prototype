import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import AppHeader from './AppHeader'
import BottomNavigation from './BottomNavigation'

export default function Layout() {
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  // reset scroll on tab change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <main
        ref={scrollRef}
        className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 8px)' }}
      >
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
