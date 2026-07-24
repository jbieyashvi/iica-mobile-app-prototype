import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link2, FolderOpen, Sparkles, ChevronRight, BadgeCheck } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'

// Post-payment creator onboarding entry. These three areas are collected only
// AFTER membership purchase — never during registration. The detailed forms
// live in the existing Portfolio Builder / Collaboration screens; this screen
// is the entry + navigation into them.
const sections = [
  {
    icon: Link2,
    title: 'Social & Portfolio Links',
    body: 'Add your Instagram, website and work samples.',
    to: '/portfolio/setup',
  },
  {
    icon: FolderOpen,
    title: 'Portfolio Setup',
    body: 'Build and publish your creator portfolio.',
    to: '/portfolio/setup',
  },
  {
    icon: Sparkles,
    title: 'Collaboration Intent',
    body: 'Tell us who you want to collaborate with.',
    to: '/collaborate/preferences',
  },
]

export default function CreatorOnboarding() {
  const navigate = useNavigate()
  const { state } = useAuth()

  // Only reachable after a successful purchase.
  useEffect(() => {
    if (state.role !== 'active') navigate('/membership/status', { replace: true })
  }, [state.role, navigate])

  return (
    <AuthShell
      onBack={() => navigate('/home')}
      footer={
        <SecondaryButton full onClick={() => navigate('/home')}>
          Go to Home
        </SecondaryButton>
      }
    >
      <div className="flex items-center gap-2 text-brand">
        <BadgeCheck className="h-5 w-5" />
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em]">
          Creator Membership Active
        </p>
      </div>
      <h1 className="mt-2 font-serif text-[28px] leading-tight text-ink">
        Set up your creator profile
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Finish these steps to publish your portfolio and start collaborating.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {sections.map(({ icon: Icon, title, body, to }, i) => (
          <button
            key={title}
            onClick={() => navigate(to)}
            className="tap flex items-center gap-3.5 rounded-card border border-border bg-surface p-4 text-left hover:border-ink/20"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft text-brand-dark">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-ink">
                {i + 1}. {title}
              </p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{body}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
          </button>
        ))}
      </div>
    </AuthShell>
  )
}
