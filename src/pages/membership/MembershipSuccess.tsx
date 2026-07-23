import { useNavigate } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import IdBlock from '../../components/IdBlock'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'

export default function MembershipSuccess() {
  const navigate = useNavigate()
  const { state } = useAuth()

  return (
    <AuthShell
      showBack={false}
      footer={
        <>
          <PrimaryButton full onClick={() => navigate('/portfolio/setup')}>
            Build My Portfolio
          </PrimaryButton>
          <div className="mt-2.5">
            <SecondaryButton full onClick={() => navigate('/home')}>
              Go to Home
            </SecondaryButton>
          </div>
        </>
      }
    >
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
          <PartyPopper className="h-9 w-9" strokeWidth={1.6} />
        </div>
        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
          Membership Active
        </p>
        <h1 className="mt-2 font-serif text-[32px] leading-tight text-ink">
          Welcome to IICA
        </h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
          Your payment is confirmed. Creator tools — portfolio, content, events,
          products and AI collaboration — are now unlocked.
        </p>
      </div>

      <div className="mt-7">
        <IdBlock id={state.iicaId ?? 'RP.673.IICA'} label="Your Member ID" />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-control border border-border bg-surface px-4 py-3">
        <span className="text-[13px] text-muted">Membership status</span>
        <StatusBadge tone="success">Active</StatusBadge>
      </div>
    </AuthShell>
  )
}
