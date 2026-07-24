import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, RotateCcw } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth, MembershipStatus as Status } from '../../state/AuthContext'
import { detectPlatform, platformDisplayName } from '../../config/membership'

type Tone = 'success' | 'warning' | 'neutral' | 'error'

const META: Record<Status, { label: string; tone: Tone; blurb: string }> = {
  not_submitted: { label: 'Form Not Submitted', tone: 'neutral', blurb: 'Complete the creator membership form to get your IICA identity.' },
  submitted: { label: 'Form Submitted', tone: 'warning', blurb: 'Your application is in. Complete the in-app purchase to activate creator access.' },
  purchase_pending: { label: 'Purchase Pending', tone: 'warning', blurb: 'Finish your in-app purchase to unlock creator tools.' },
  active: { label: 'Active', tone: 'success', blurb: 'Your creator membership is active. All creator tools are unlocked.' },
  failed: { label: 'Purchase Failed', tone: 'error', blurb: 'The last purchase didn’t go through. Your application and IICA ID are safe.' },
  cancelled: { label: 'Purchase Cancelled', tone: 'warning', blurb: 'You cancelled the purchase. Membership is still pending.' },
  expired: { label: 'Expired', tone: 'error', blurb: 'Your membership has expired (prototype state). Renew via an in-app purchase.' },
  restored: { label: 'Restored', tone: 'success', blurb: 'Your creator membership was restored. All creator tools are unlocked.' },
}

export default function MembershipStatus() {
  const navigate = useNavigate()
  const { state, restorePurchase } = useAuth()
  const [toast, setToast] = useState('')

  const status = state.membershipStatus
  const meta = META[status]
  const id = state.iicaId ?? '—'
  const isActive = status === 'active' || status === 'restored'
  const canPurchase = status === 'submitted' || status === 'purchase_pending' || status === 'cancelled' || status === 'failed' || status === 'expired'

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  const copyId = async () => {
    try { await navigator.clipboard.writeText(id) } catch { /* ignore */ }
    flash('IICA ID copied')
  }
  const restore = () => {
    restorePurchase(platformDisplayName(detectPlatform()))
    navigate('/membership/success')
  }

  const date = state.submittedAt
    ? new Date(state.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <AuthShell onBack={() => navigate('/home')}>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-serif text-[26px] leading-tight text-ink">Membership status</h1>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{meta.blurb}</p>

      {/* Summary */}
      <div className="mt-5 rounded-card border border-border bg-surface">
        <Row label="Unique IICA ID" value={id} mono />
        <Row label="Category" value={state.category ?? '—'} />
        {state.submittedAt && <Row label="Application date" value={date} />}
        {isActive && state.purchasePlatform && (
          <Row label="Purchase platform" value={state.purchasePlatform} />
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2.5">
        {status === 'not_submitted' && (
          <PrimaryButton full onClick={() => navigate('/membership/application')}>
            Start Membership Form
          </PrimaryButton>
        )}

        {canPurchase && (
          <>
            <PrimaryButton full onClick={() => navigate('/membership/purchase')}>
              Complete In-App Purchase
            </PrimaryButton>
            {state.iicaId && (
              <button onClick={copyId} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink hover:border-ink/25">
                <Copy className="h-4 w-4" /> Copy ID
              </button>
            )}
            <button onClick={restore} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink hover:border-ink/25">
              <RotateCcw className="h-4 w-4" /> Restore Purchase
            </button>
          </>
        )}

        {isActive && (
          <>
            <PrimaryButton full onClick={() => navigate('/creator/onboarding')}>
              Complete My Creator Profile
            </PrimaryButton>
            <button onClick={restore} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink hover:border-ink/25">
              <RotateCcw className="h-4 w-4" /> Restore Purchase
            </button>
          </>
        )}

        <SecondaryButton full onClick={() => navigate('/home')}>
          Go to Home
        </SecondaryButton>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </AuthShell>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className={`text-[13px] font-semibold text-ink ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
