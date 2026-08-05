import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Clock, UserPlus, UserCog, BadgeCheck,
  Ticket as TicketIcon, Package, Library, PlaySquare, CalendarCog, Store, ShoppingBag,
  CreditCard, Wallet, Bell, ShieldCheck, LifeBuoy, Scale, Trash2, LogOut, AlertTriangle,
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { useAuth } from '../state/AuthContext'
import { membershipAccess } from '../state/membershipAccess'
import { setPortfolioOrigin } from '../portfolio/origin'

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const backTo = (location.state as { from?: string } | null)?.from ?? '/home'
  const { state, logout } = useAuth()
  const [confirmOut, setConfirmOut] = useState(false)

  const access = membershipAccess(state)
  const isGuest = access.isGuest
  const isRegistered = access.isRegistered
  const isPending = access.isPending
  const isActive = access.isActiveMember
  const isSuspended = access.isSuspended

  const name = state.name || (isGuest ? 'Guest' : 'Reshma Patra')
  const email = state.email || (isGuest ? 'Browsing as guest' : '')

  const editPortfolio = () => { setPortfolioOrigin('/profile'); navigate('/portfolio/setup', { state: { from: '/profile', source: 'profile' } }) }
  const manageVideos = () => { setPortfolioOrigin('/profile'); navigate('/portfolio/edit/media', { state: { from: '/profile', source: 'profile', direct: true } }) }
  const doLogout = () => { logout(); navigate('/login', { replace: true }) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center gap-1">
          <button onClick={() => navigate(backTo)} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">Profile</h1>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto pt-4" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <PageContainer>
          {/* Identity */}
          <div className="flex items-center gap-3.5 rounded-card border border-border bg-surface p-4">
            <Avatar name={name} src={isGuest ? undefined : 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80&auto=format&fit=crop'} size={54} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[19px] leading-tight text-ink">{name}</p>
              {email && <p className="truncate text-[13px] text-muted">{email}</p>}
              <div className="mt-1.5">
                {isActive && <StatusBadge tone="success">Active Creator</StatusBadge>}
                {isSuspended && <StatusBadge tone="error">Membership Expired</StatusBadge>}
                {isPending && <StatusBadge tone="warning">Purchase Pending</StatusBadge>}
                {isRegistered && <StatusBadge tone="neutral">Registered</StatusBadge>}
                {isGuest && <StatusBadge tone="neutral">Guest</StatusBadge>}
              </div>
            </div>
            {!isGuest && (
              <button onClick={() => navigate('/account/edit')} aria-label="Edit profile" className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-ink hover:border-ink/25"><UserCog className="h-[18px] w-[18px]" /></button>
            )}
          </div>

          {access.hasIicaId && state.iicaId && (
            <p className="mt-3 flex items-center justify-between rounded-control border border-border bg-surface px-4 py-3 text-[13px]">
              <span className="text-muted">{isPending ? 'IICA ID' : 'Member ID'}</span>
              <span className="font-mono font-semibold text-ink">{state.iicaId}</span>
            </p>
          )}

          {/* Role prompts */}
          {/* Guest — no account yet: create one or sign in. */}
          {isGuest && (
            <div className="mt-4 rounded-card border border-border bg-brand-soft p-4">
              <div className="flex items-center gap-2 text-brand-dark"><UserPlus className="h-5 w-5" strokeWidth={1.75} /><h3 className="font-serif text-[18px]">Join IICA</h3></div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#6d3357]">Create an account to save your activity, then apply for creator membership.</p>
              <div className="mt-3 flex flex-col gap-2.5">
                <PrimaryButton full onClick={() => navigate('/signup')}>Create Account</PrimaryButton>
                <SecondaryButton full onClick={() => navigate('/login')}>Sign In</SecondaryButton>
              </div>
            </div>
          )}
          {/* Registered — signed in, no membership application yet. */}
          {isRegistered && (
            <div className="mt-4 rounded-card border border-border bg-brand-soft p-4">
              <div className="flex items-center gap-2 text-brand-dark"><UserPlus className="h-5 w-5" strokeWidth={1.75} /><h3 className="font-serif text-[18px]">Become a creator</h3></div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#6d3357]">Unlock portfolios, Archive videos, events and AI collaboration.</p>
              <div className="mt-3"><PrimaryButton full onClick={() => navigate('/membership')}>Apply for IICA Membership</PrimaryButton></div>
            </div>
          )}
          {/* Pending — IICA ID generated, membership not yet purchased. */}
          {isPending && (
            <button onClick={() => navigate('/membership/purchase')} className="tap mt-4 flex w-full items-center gap-3 rounded-card border border-warning/30 bg-[#F7F0E4] p-4 text-left">
              <Clock className="h-5 w-5 shrink-0 text-warning" />
              <span className="flex-1"><span className="block text-[14px] font-semibold text-ink">Complete Membership Purchase</span><span className="block text-[12.5px] text-[#7a5412]">Enter your IICA ID to activate creator access</span></span>
              <ChevronRight className="h-5 w-5 text-warning" />
            </button>
          )}
          {/* Suspended / expired — data preserved, creator actions blocked. */}
          {isSuspended && (
            <button onClick={() => navigate('/membership/status')} className="tap mt-4 flex w-full items-center gap-3 rounded-card border border-error/30 bg-[#F7E9EA] p-4 text-left">
              <AlertTriangle className="h-5 w-5 shrink-0 text-error" />
              <span className="flex-1"><span className="block text-[14px] font-semibold text-ink">Renew your membership</span><span className="block text-[12.5px] text-[#8a3b3b]">Your portfolio is saved. Renew to edit and list again.</span></span>
              <ChevronRight className="h-5 w-5 text-error" />
            </button>
          )}

          {/* Creator Profile — active members only can edit their portfolio. */}
          {isActive && (
            <Section title="Creator Profile">
              <Row icon={<BadgeCheck className="h-5 w-5" />} label="Edit Portfolio" hint="Your creator portfolio" onClick={editPortfolio} />
            </Section>
          )}

          {/* Activity */}
          <Section title="Activity">
            <Row icon={<TicketIcon className="h-5 w-5" />} label="My Tickets" onClick={() => navigate('/my-tickets')} />
            <Row icon={<Package className="h-5 w-5" />} label="My Orders" onClick={() => navigate('/orders')} />
            <Row icon={<Library className="h-5 w-5" />} label="My Library" onClick={() => navigate('/library')} />
          </Section>

          {/* Creator Tools */}
          {isActive && (
            <Section title="Creator Tools">
              <Row icon={<PlaySquare className="h-5 w-5" />} label="Manage Watch Videos" onClick={manageVideos} />
              <Row icon={<CalendarCog className="h-5 w-5" />} label="Manage Events" onClick={() => navigate('/creator/events')} />
              <Row icon={<Store className="h-5 w-5" />} label="My Products" onClick={() => navigate('/creator/products')} />
              <Row icon={<ShoppingBag className="h-5 w-5" />} label="Seller Orders" onClick={() => navigate('/creator/orders')} />
            </Section>
          )}

          {/* Account & Payments */}
          <Section title="Account & Payments">
            <Row icon={<CreditCard className="h-5 w-5" />} label="Payment Methods" onClick={() => navigate('/account/payment-methods')} />
            {isActive && <Row icon={<Wallet className="h-5 w-5" />} label="Payout Settings" onClick={() => navigate('/account/payouts')} />}
          </Section>

          {/* Preferences & Information */}
          <Section title="Preferences & Information">
            <Row icon={<Bell className="h-5 w-5" />} label="Notification Settings" onClick={() => navigate('/account/notifications')} />
            <Row icon={<ShieldCheck className="h-5 w-5" />} label="Privacy" onClick={() => navigate('/info/privacy')} />
            <Row icon={<LifeBuoy className="h-5 w-5" />} label="Help & Support" onClick={() => navigate('/info/help')} />
            <Row icon={<Scale className="h-5 w-5" />} label="Legal" onClick={() => navigate('/info/legal')} />
          </Section>

          {/* Account Actions */}
          <div className="mt-7">
            <h2 className="mb-2.5 px-1 text-[12px] font-semibold uppercase tracking-wide text-muted">Account Actions</h2>
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
              {!isGuest && (
                <button onClick={() => navigate('/account/delete')} className="tap flex items-center gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015]">
                  <Trash2 className="h-5 w-5 shrink-0 text-error/80" />
                  <span className="flex-1 text-[14px] font-semibold text-error/90">Delete Account</span>
                  <ChevronRight className="h-5 w-5 text-muted" />
                </button>
              )}
              <button onClick={() => setConfirmOut(true)} className="tap flex items-center gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015]">
                <LogOut className="h-5 w-5 shrink-0 text-ink" />
                <span className="flex-1 text-[14px] font-semibold text-ink">Logout</span>
                <ChevronRight className="h-5 w-5 text-muted" />
              </button>
            </div>
          </div>
        </PageContainer>
      </div>

      {confirmOut && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setConfirmOut(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h3 className="font-serif text-[22px] text-ink">Log out?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">You’ll be returned to the login screen. Your saved data stays on this device.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button onClick={doLogout} className="tap min-h-[48px] rounded-control bg-error text-[15px] font-semibold text-white">Log Out</button>
              <button onClick={() => setConfirmOut(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h2 className="mb-2.5 px-1 text-[12px] font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">{children}</div>
    </div>
  )
}

function Row({ icon, label, hint, onClick }: { icon: React.ReactNode; label: string; hint?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.015]">
      <span className="shrink-0 text-brand">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-ink">{label}</span>
        {hint && <span className="block text-[11.5px] text-muted">{hint}</span>}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </button>
  )
}
