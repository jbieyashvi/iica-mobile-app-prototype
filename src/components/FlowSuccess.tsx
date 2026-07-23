import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'

interface Action { label: string; icon?: ReactNode; onClick: () => void }

interface Props {
  icon: ReactNode
  title: string
  description?: string
  /** Optional custom content between the header and the actions (summary card, etc.). */
  children?: ReactNode
  primary?: Action
  secondary?: Action[]
  /** Override the Go to Home destination/behaviour. Defaults to navigating to /home. */
  onHome?: () => void
  homeLabel?: string
}

// Consistent success/confirmation layout. Navigation behaviour is uniform (always
// offers Go to Home); visuals vary via icon/title/description/children.
export default function FlowSuccess({ icon, title, description, children, primary, secondary = [], onHome, homeLabel = 'Go to Home' }: Props) {
  const navigate = useNavigate()
  const goHome = onHome ?? (() => navigate('/home'))

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6" style={{ paddingTop: 'calc(40px + var(--safe-top))' }}>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">{icon}</div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">{title}</h1>
          {description && <p className="mt-2 max-w-[320px] text-[14px] leading-relaxed text-muted">{description}</p>}
        </div>

        {children}

        <div className="mt-6 flex flex-col gap-2.5">
          {primary && <PrimaryButton full onClick={primary.onClick}>{primary.icon}{primary.label}</PrimaryButton>}
          {secondary.map((a) => (
            <SecondaryButton key={a.label} full onClick={a.onClick}>{a.icon}{a.label}</SecondaryButton>
          ))}
          <button onClick={goHome} className="tap mt-1 min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">{homeLabel}</button>
        </div>
      </div>
    </div>
  )
}
