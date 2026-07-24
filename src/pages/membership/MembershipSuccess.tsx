import { useNavigate } from 'react-router-dom'
import { PartyPopper, RotateCcw } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import IdBlock from '../../components/IdBlock'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { detectPlatform, platformDisplayName } from '../../config/membership'

export default function MembershipSuccess() {
  const navigate = useNavigate()
  const { state, restorePurchase } = useAuth()

  const id = state.iicaId ?? 'JY.673.IICA'
  const platform = state.purchasePlatform ?? 'Demo'

  return (
    <AuthShell
      showBack={false}
      footer={
        <>
          <PrimaryButton full onClick={() => navigate('/creator/onboarding')}>
            Complete My Creator Profile
          </PrimaryButton>
          <div className="mt-2.5">
            <SecondaryButton full onClick={() => navigate('/home')}>
              Go to Home
            </SecondaryButton>
          </div>
        </>
      }
    >
      <div className="flex flex-col items-center pt-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
          <PartyPopper className="h-9 w-9" strokeWidth={1.6} />
        </div>
        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
          Membership Active
        </p>
        <h1 className="mt-2 font-serif text-[28px] leading-tight text-ink">
          Welcome to IICA Creator Membership
        </h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
          Your creator tools are now unlocked. Complete your profile to publish
          your portfolio.
        </p>
      </div>

      <div className="mt-7">
        <IdBlock id={id} label="Your Member ID" />
      </div>

      <div className="mt-4 rounded-card border border-border bg-surface">
        <Row label="Category" value={state.category ?? '—'} />
        <Row label="Membership status">
          <StatusBadge tone="success">Active</StatusBadge>
        </Row>
        <Row label="Purchase platform" value={platform} />
        <Row label="Renewal" value="Auto-renews annually (prototype)" />
      </div>

      <button
        onClick={() => restorePurchase(platformDisplayName(detectPlatform()))}
        className="tap mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-border bg-surface text-[13.5px] font-semibold text-ink hover:border-ink/25"
      >
        <RotateCcw className="h-4 w-4" /> Restore Purchase
      </button>
    </AuthShell>
  )
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      {children ?? <span className="text-[13px] font-semibold text-ink">{value}</span>}
    </div>
  )
}
