import { Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import IconButton from './IconButton'
import Avatar from './Avatar'

export default function AppHeader() {
  const navigate = useNavigate()

  return (
    <header
      className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="flex h-14 items-center justify-between px-[14px]">
        <button
          onClick={() => navigate('/home')}
          className="tap flex items-center gap-2 pl-1"
          aria-label="IICA home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand font-serif text-[16px] leading-none text-white">
            II
          </span>
          <span className="font-serif text-[19px] tracking-tight text-ink">
            IICA
          </span>
        </button>

        <div className="flex items-center gap-0.5">
          <IconButton label="Search" onClick={() => navigate('/search')}>
            <Search className="h-[21px] w-[21px]" strokeWidth={1.75} />
          </IconButton>
          <IconButton
            label="Notifications"
            dot
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-[21px] w-[21px]" strokeWidth={1.75} />
          </IconButton>
          <button
            onClick={() => navigate('/profile')}
            className="tap ml-1"
            aria-label="Profile"
          >
            <Avatar
              name="Reshma Nair"
              src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80&auto=format&fit=crop"
              size={34}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
