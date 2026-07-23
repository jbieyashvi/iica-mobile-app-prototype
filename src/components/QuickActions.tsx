import { FolderOpen, PenLine, CalendarPlus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGate } from '../state/GateContext'
import { useCreateGate } from '../state/CreateGate'

const actions = [
  { label: 'My Portfolio', feature: 'Portfolio', icon: FolderOpen, to: '/portfolio/setup' },
  { label: 'Create Content', feature: 'Creating content', icon: PenLine, to: '/content/create' },
  { label: 'Create Event', feature: 'Creating events', icon: CalendarPlus, to: '/events/create' },
  { label: 'Find Collaborators', feature: 'Finding collaborators', icon: Sparkles, to: '/collaborate' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  const { requireMember } = useGate()
  const { startCreate } = useCreateGate()

  return (
    <div className="grid grid-cols-4 gap-2 px-[18px]">
      {actions.map(({ label, feature, icon: Icon, to }) => (
        <button
          key={label}
          onClick={() => (label === 'Create Content' ? startCreate() : requireMember(feature, () => navigate(to)))}
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
