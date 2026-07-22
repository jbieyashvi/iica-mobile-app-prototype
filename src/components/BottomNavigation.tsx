import { Home, Compass, ShoppingBag, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/collaborate', label: 'Collaborate', icon: Users },
]

export default function BottomNavigation() {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur-md"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="flex h-[62px] items-stretch">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="tap group relative flex flex-1 flex-col items-center justify-center gap-1"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute top-0 h-[2px] w-7 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-brand opacity-100' : 'opacity-0'
                  }`}
                />
                <Icon
                  className={`h-[22px] w-[22px] transition-colors ${
                    isActive ? 'text-brand' : 'text-muted'
                  }`}
                  strokeWidth={isActive ? 2 : 1.6}
                />
                <span
                  className={`text-[10px] font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-brand' : 'text-muted'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
