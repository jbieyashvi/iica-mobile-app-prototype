import { FolderOpen, CalendarPlus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGate } from '../state/GateContext'

const actions = [
  { label: 'My Portfolio', feature: 'Portfolio', icon: FolderOpen, to: '/portfolio/setup' },
  { label: 'Create Event', feature: 'Creating events', icon: CalendarPlus, to: '/events/create' },
  { label: 'Find Collaborators', feature: 'Finding collaborators', icon: Sparkles, to: '/collaborate' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  const { requireMember } = useGate()

  // Home is the logical origin for these quick actions — Back from the first
  // step of any flow returns here, not through Profile / My Events.
  const openAction = (label: string, feature: string, to: string) => {
    if (label === 'Create Event') {
      return requireMember(feature, () => navigate('/events/create/details', { state: { from: '/home', source: 'home-quick-action' } }))
    }
    requireMember(feature, () => navigate(to))
  }

  return (
    <div className="grid grid-cols-3 gap-2 px-[18px]">
      {actions.map(({ label, feature, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => openAction(label, feature, to)}
          className="tap flex flex-col items-center gap-2 rounded-card border border-border bg-surface px-1 py-3 text-center transition-colors hover:border-ink/20"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          <span className="text-[10.5px] font-semibold leading-tight text-ink">
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
