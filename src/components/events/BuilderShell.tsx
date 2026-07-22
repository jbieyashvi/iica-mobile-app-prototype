import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Stepper from '../form/Stepper'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'

const STEPS = ['Details', 'Schedule', 'Venue', 'Tickets', 'Media', 'Preview']
const PATHS = [
  '/events/create/details', '/events/create/schedule', '/events/create/venue',
  '/events/create/tickets', '/events/create/media', '/events/create/preview',
]

interface Props {
  step: number // 0-based
  children: ReactNode
  onContinue: () => void
  continueLabel?: string
  canContinue?: boolean
}

export default function BuilderShell({ step, children, onContinue, continueLabel = 'Continue', canContinue = true }: Props) {
  const navigate = useNavigate()
  const back = () => (step === 0 ? navigate('/creator/events') : navigate(PATHS[step - 1]))

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg/90 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={back} aria-label="Back" className="tap flex h-11 items-center gap-1 rounded-control pl-1 pr-2 text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /><span className="text-[13px] font-semibold">Back</span></button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-ink">Create Event</h1>
        <span className="h-11 w-11" />
      </header>

      <div className="shrink-0 px-[22px] pb-1 pt-3"><Stepper steps={STEPS} current={step} /></div>

      <div className="fade-in no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6 pt-2">{children}</div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => navigate('/creator/events')} className="min-w-[104px]">Save Draft</SecondaryButton>
          <PrimaryButton full disabled={!canContinue} onClick={onContinue}>{continueLabel}</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
