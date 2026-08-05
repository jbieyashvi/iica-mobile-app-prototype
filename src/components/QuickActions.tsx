import {
  FolderOpen, CalendarPlus, Sparkles, PlaySquare, Clapperboard,
  BadgeCheck, Clock, AlertTriangle, LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { usePortfolio } from '../state/PortfolioContext'
import { membershipAccess } from '../state/membershipAccess'
import { setPortfolioOrigin } from '../portfolio/origin'

interface QA {
  label: string
  icon: LucideIcon
  onClick: () => void
  highlight?: boolean
}

// Home quick actions, conditional on membership state. No duplicate creator
// actions leak to guests / non-members: they get a single membership CTA plus
// the always-available Find Collaborators and Archive entries.
export default function QuickActions() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { portfolio } = usePortfolio()
  const access = membershipAccess(state)

  const findCollaborators: QA = {
    label: 'Find Collaborators', icon: Sparkles,
    onClick: () => navigate('/collaborate', { state: { from: '/home' } }),
  }
  const archive: QA = {
    label: 'Archive', icon: Clapperboard,
    onClick: () => navigate('/explore/archive', { state: { from: '/home' } }),
  }

  let actions: QA[] = []

  if (access.isActiveMember) {
    actions = [
      {
        label: portfolio.published ? 'My Portfolio' : 'Create Portfolio', icon: FolderOpen,
        onClick: () => {
          setPortfolioOrigin('/home')
          navigate('/portfolio/setup', { state: { from: '/home', source: 'home-my-portfolio' } })
        },
      },
      {
        label: 'Add Video', icon: PlaySquare,
        onClick: () => {
          setPortfolioOrigin('/home')
          navigate('/portfolio/edit/media', { state: { from: '/home', source: 'home-add-video', direct: true } })
        },
      },
      {
        label: 'Create Event', icon: CalendarPlus,
        onClick: () => navigate('/events/create/details', { state: { from: '/home', source: 'home-quick-action' } }),
      },
      findCollaborators,
      archive,
    ]
  } else if (access.isPending) {
    actions = [
      { label: 'Complete Membership', icon: Clock, highlight: true, onClick: () => navigate('/membership/purchase') },
      findCollaborators,
      archive,
    ]
  } else if (access.isSuspended) {
    // Suspended/expired: no new-content creation; offer renewal instead.
    actions = [
      { label: 'Renew Membership', icon: AlertTriangle, highlight: true, onClick: () => navigate('/membership/status') },
      findCollaborators,
      archive,
    ]
  } else {
    // Guest or registered (no membership) — a single Apply CTA, no creator tools.
    actions = [
      { label: 'Apply for Membership', icon: BadgeCheck, highlight: true, onClick: () => navigate('/membership') },
      findCollaborators,
      archive,
    ]
  }

  return (
    <div
      className="grid gap-2 px-[18px]"
      style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}
    >
      {actions.map(({ label, icon: Icon, onClick, highlight }) => (
        <button
          key={label}
          onClick={onClick}
          className={`tap flex flex-col items-center gap-2 rounded-card border px-1 py-3 text-center transition-colors ${
            highlight ? 'border-brand/40 bg-brand-soft hover:border-brand' : 'border-border bg-surface hover:border-ink/20'
          }`}
        >
          <span className={`flex h-9 w-9 items-center justify-center rounded-[9px] ${highlight ? 'bg-brand text-white' : 'bg-brand-soft text-brand-dark'}`}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          <span className="text-[10.5px] font-semibold leading-tight text-ink">{label}</span>
        </button>
      ))}
    </div>
  )
}
