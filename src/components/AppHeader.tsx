import { useState } from 'react'
import { Bell, Search, Library, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import IconButton from './IconButton'
import Avatar from './Avatar'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import { useAuth } from '../state/AuthContext'

export default function AppHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { state } = useAuth()
  const [guestSheet, setGuestSheet] = useState(false)

  // Only Home swaps the profile avatar for a quick My Library action — the
  // permanent bottom Profile tab already provides account access everywhere.
  const isHome = pathname === '/home'

  const openLibrary = () => {
    if (!state.authed) { setGuestSheet(true); return }
    navigate('/library')
  }

  return (
    <>
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
          {isHome ? (
            <IconButton label="Open My Library" onClick={openLibrary}>
              <Library className="h-[21px] w-[21px]" strokeWidth={1.75} />
            </IconButton>
          ) : (
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
          )}
        </div>
      </div>
    </header>

    {guestSheet && (
      <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
        <button aria-label="Close" onClick={() => setGuestSheet(false)} className="absolute inset-0 bg-ink/40" />
        <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
          <button aria-label="Close" onClick={() => setGuestSheet(false)} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Library className="h-6 w-6" strokeWidth={1.75} /></div>
          <h2 className="font-serif text-[23px] leading-tight text-ink">Your Library</h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Sign in to access your courses, downloads and saved content.</p>
          <div className="mt-5 flex flex-col gap-2.5">
            <PrimaryButton full onClick={() => { setGuestSheet(false); navigate('/login') }}>Sign In</PrimaryButton>
            <SecondaryButton full onClick={() => { setGuestSheet(false); navigate('/signup') }}>Create Account</SecondaryButton>
            <button onClick={() => setGuestSheet(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Maybe Later</button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
