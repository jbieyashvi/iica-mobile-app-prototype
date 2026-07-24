import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronRight, Clock, BadgeCheck, UserPlus, Ticket as TicketIcon, CalendarCog, Package, Library, Store, ShoppingBag, Wallet } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import PrimaryButton from '../components/PrimaryButton'
import PrototypeTools from '../components/PrototypeTools'
import { useAuth } from '../state/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { state, logout } = useAuth()

  const isGuest = state.role === 'guest'
  const isPending = state.role === 'pending'
  const isActive = state.role === 'active'

  const name = state.name || (isGuest ? 'Guest' : 'Reshma Patra')
  const email = state.email || (isGuest ? 'Browsing as guest' : '')

  return (
    <div className="pt-5">
      <PageContainer>
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
          You
        </p>
        <h1 className="mt-1 font-serif text-[30px] leading-tight text-ink">
          Profile
        </h1>

        {/* Identity card */}
        <div className="mt-5 flex items-center gap-3.5 rounded-card border border-border bg-surface p-4">
          <Avatar
            name={name}
            src={
              isGuest
                ? undefined
                : 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80&auto=format&fit=crop'
            }
            size={54}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-[19px] leading-tight text-ink">
              {name}
            </p>
            {email && <p className="truncate text-[13px] text-muted">{email}</p>}
            <div className="mt-1.5">
              {isActive && <StatusBadge tone="success">Active Creator</StatusBadge>}
              {isPending && <StatusBadge tone="warning">Payment Pending</StatusBadge>}
              {isGuest && <StatusBadge tone="neutral">Guest</StatusBadge>}
            </div>
          </div>
        </div>

        {isActive && state.iicaId && (
          <p className="mt-3 flex items-center justify-between rounded-control border border-border bg-surface px-4 py-3 text-[13px]">
            <span className="text-muted">Member ID</span>
            <span className="font-mono font-semibold text-ink">{state.iicaId}</span>
          </p>
        )}

        {/* Role-specific prompt */}
        {isGuest && (
          <div className="mt-4 rounded-card border border-border bg-brand-soft p-4">
            <div className="flex items-center gap-2 text-brand-dark">
              <UserPlus className="h-5 w-5" strokeWidth={1.75} />
              <h3 className="font-serif text-[18px]">Become a creator</h3>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6d3357]">
              Unlock portfolios, content, events and AI collaboration.
            </p>
            <div className="mt-3">
              <PrimaryButton full onClick={() => navigate('/membership')}>
                Apply for Membership
              </PrimaryButton>
            </div>
          </div>
        )}

        {isPending && (
          <button
            onClick={() => navigate('/membership/payment-pending')}
            className="tap mt-4 flex w-full items-center gap-3 rounded-card border border-warning/30 bg-[#F7F0E4] p-4 text-left"
          >
            <Clock className="h-5 w-5 shrink-0 text-warning" />
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-ink">
                Complete your payment
              </span>
              <span className="block text-[12.5px] text-[#7a5412]">
                Membership activates after payment
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-warning" />
          </button>
        )}

        {isActive && (
          <button
            onClick={() => navigate('/portfolio/setup')}
            className="tap mt-4 flex w-full items-center gap-3 rounded-card border border-border bg-surface p-4 text-left"
          >
            <BadgeCheck className="h-5 w-5 shrink-0 text-brand" />
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-ink">
                Edit Portfolio
              </span>
              <span className="block text-[12.5px] text-muted">
                Build and publish your creator portfolio
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted" />
          </button>
        )}

        {/* Tickets & events links */}
        <div className="mt-4 flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          <ProfileLink icon={<TicketIcon className="h-5 w-5 shrink-0 text-brand" />} label="My Tickets" onClick={() => navigate('/my-tickets')} />
          <ProfileLink icon={<Package className="h-5 w-5 shrink-0 text-brand" />} label="My Orders" onClick={() => navigate('/orders')} />
          <ProfileLink icon={<Library className="h-5 w-5 shrink-0 text-brand" />} label="My Library" onClick={() => navigate('/library')} />
          {isActive && <>
            <ProfileLink icon={<CalendarCog className="h-5 w-5 shrink-0 text-brand" />} label="Manage Events" onClick={() => navigate('/creator/events')} />
            <ProfileLink icon={<Store className="h-5 w-5 shrink-0 text-brand" />} label="My Products" onClick={() => navigate('/creator/products')} />
            <ProfileLink icon={<ShoppingBag className="h-5 w-5 shrink-0 text-brand" />} label="Seller Orders" onClick={() => navigate('/creator/orders')} />
            <ProfileLink icon={<Wallet className="h-5 w-5 shrink-0 text-brand" />} label="Earnings & Payouts" onClick={() => navigate('/creator/earnings')} />
          </>}
        </div>

        {/* Prototype Tools */}
        <PrototypeTools />

        {/* Logout */}
        <button
          onClick={() => {
            logout()
            navigate('/welcome')
          }}
          className="tap mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-error hover:border-error/30"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log Out
        </button>

        <p className="mt-4 text-center text-[12px] text-muted">
          The full profile & portfolio experience will be built next.
        </p>
      </PageContainer>
    </div>
  )
}

function ProfileLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex items-center gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015]">
      {icon}
      <span className="flex-1 text-[14px] font-semibold text-ink">{label}</span>
      <ChevronRight className="h-5 w-5 text-muted" />
    </button>
  )
}
