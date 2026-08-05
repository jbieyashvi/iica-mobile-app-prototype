import {
  FolderOpen, CalendarPlus, PlaySquare, Clapperboard, Compass,
  CalendarDays, ShoppingBag, BadgeCheck, Clock, AlertTriangle, LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { usePortfolio } from '../state/PortfolioContext'
import { membershipAccess } from '../state/membershipAccess'
import { membershipPurchaseEnabled } from '../config/platform'
import { setPortfolioOrigin } from '../portfolio/origin'

interface QA {
  label: string
  icon: LucideIcon
  onClick: () => void
  highlight?: boolean
}

// Home quick actions — always exactly four, membership-aware. Creator-management
// actions (Portfolio / Add Video / Create Event) show only to Active Creator
// Members; everyone else gets public actions. "Find Collaborators" is NOT here —
// the Collaborate bottom-nav tab already covers it (no duplicate shortcut).
export default function QuickActions() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { portfolio } = usePortfolio()
  const access = membershipAccess(state)
  const mpEnabled = membershipPurchaseEnabled()

  const go = (to: string) => () => navigate(to, { state: { from: '/home' } })

  // Public actions (no membership required).
  const explore: QA = { label: 'Explore', icon: Compass, onClick: go('/explore') }
  const eventsAction: QA = { label: 'Events', icon: CalendarDays, onClick: go('/events') }
  const shop: QA = { label: 'Shop', icon: ShoppingBag, onClick: go('/shop') }
  const archive: QA = { label: 'Archive', icon: Clapperboard, onClick: go('/explore/archive') }
  const publicSet: QA[] = [explore, eventsAction, shop, archive]

  let actions: QA[]

  if (access.isActiveMember) {
    // Portfolio label stays "Portfolio"; destination depends on whether one exists.
    const portfolioAction: QA = {
      label: 'Portfolio', icon: FolderOpen,
      onClick: () => {
        setPortfolioOrigin('/home')
        if (portfolio.published) navigate('/portfolio', { state: { from: '/home' } })
        else navigate('/portfolio/setup', { state: { from: '/home', source: 'home-portfolio' } })
      },
    }
    actions = [
      portfolioAction,
      {
        label: 'Add Video', icon: PlaySquare,
        onClick: () => {
          setPortfolioOrigin('/home')
          navigate('/portfolio/edit/media', { state: { from: '/home', source: 'home-add-video', direct: true } })
        },
      },
      { label: 'Create Event', icon: CalendarPlus, onClick: () => navigate('/events/create/details', { state: { from: '/home', source: 'home-quick-action' } }) },
      archive,
    ]
  } else if (access.isPending) {
    // IICA ID generated but unpaid → complete the purchase (when enabled).
    actions = mpEnabled
      ? [{ label: 'Complete Membership', icon: Clock, highlight: true, onClick: () => navigate('/membership/purchase') }, explore, eventsAction, archive]
      : publicSet
  } else if (access.isSuspended) {
    // Suspended / expired → read-only; offer renewal (when enabled), else public.
    actions = mpEnabled
      ? [{ label: 'Renew Membership', icon: AlertTriangle, highlight: true, onClick: () => navigate('/membership/status') }, explore, eventsAction, archive]
      : publicSet
  } else if (access.isGuest) {
    actions = publicSet
  } else {
    // Registered, no IICA ID yet → apply (when enabled), else public.
    actions = mpEnabled
      ? [{ label: 'Apply for Membership', icon: BadgeCheck, highlight: true, onClick: () => navigate('/membership') }, explore, eventsAction, archive]
      : publicSet
  }

  return (
    <div className="px-[18px]">
      <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">Quick Actions</p>
      <div className="grid grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon, onClick, highlight }) => (
          <button
            key={label}
            onClick={onClick}
            className={`tap flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-card border px-1 py-2.5 text-center transition-colors ${
              highlight ? 'border-brand/40 bg-brand-soft hover:border-brand' : 'border-border bg-surface hover:border-ink/20'
            }`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] ${highlight ? 'bg-brand text-white' : 'bg-brand-soft text-brand-dark'}`}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <span className="line-clamp-2 text-[10.5px] font-semibold leading-tight text-ink">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
