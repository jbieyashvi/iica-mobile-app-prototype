import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Mail } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import IdBlock from '../../components/IdBlock'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'

export default function MembershipSubmitted() {
  const navigate = useNavigate()
  const { state } = useAuth()

  const id = state.iicaId ?? 'JY.673.IICA'
  const email = state.email || 'your email'

  return (
    <AuthShell
      onBack={() => navigate('/membership/status')}
      footer={
        <>
          <PrimaryButton full onClick={() => navigate('/membership/purchase')}>
            Continue to Membership
          </PrimaryButton>
          <div className="mt-2.5">
            <SecondaryButton full onClick={() => navigate('/home')}>
              Go to Home
            </SecondaryButton>
          </div>
        </>
      }
    >
      <div className="flex flex-col items-center pt-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
          <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-serif text-[27px] leading-tight text-ink">
          Your IICA ID is ready
        </h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
          We’ve emailed your IICA ID to you. Complete the membership purchase in
          the app to unlock your creator portfolio and tools.
        </p>
      </div>

      <div className="mt-6">
        <IdBlock id={id} />
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-card border border-border bg-surface">
        <Row label="Registered email" value={email} />
        <Row label="Category" value={state.category ?? '—'} />
        <Row label="Application status" value="Submitted" tone="success" />
      </div>

      {/* Email simulation — no external payment link */}
      <div className="mt-4 rounded-control border border-border bg-surface px-3.5 py-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <Mail className="h-4 w-4 text-brand" />
          Email sent to {email}
        </div>
        <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] leading-relaxed text-muted">
          <li>• Application received</li>
          <li>
            • Your unique IICA ID:{' '}
            <span className="font-mono font-semibold text-ink">{id}</span>
          </li>
          <li>
            • Return to the IICA app to complete membership through the App
            Store / Play Store purchase
          </li>
        </ul>
      </div>
    </AuthShell>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'success'
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      {tone === 'success' ? (
        <StatusBadge tone="success">{value}</StatusBadge>
      ) : (
        <span className="text-[13px] font-semibold text-ink">{value}</span>
      )}
    </div>
  )
}
