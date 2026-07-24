import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check, Loader2, ShieldCheck, Apple, Play, Sparkles, XCircle, RotateCcw, AlertTriangle,
} from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import {
  MEMBERSHIP_PLAN, detectPlatform, purchaseCtaLabel, platformDisplayName,
} from '../../config/membership'

type Phase = 'plan' | 'processing' | 'failed' | 'cancelled'

export default function MembershipPurchase() {
  const navigate = useNavigate()
  const { state, purchaseSuccess, purchaseFailed, purchaseCancelled, restorePurchase } = useAuth()

  const platform = useMemo(() => detectPlatform(), [])
  const storeName = platformDisplayName(platform)
  const [phase, setPhase] = useState<Phase>('plan')

  // Must have submitted the form (and an IICA ID) before purchasing.
  useEffect(() => {
    if (!state.iicaId) navigate('/membership/application', { replace: true })
  }, [state.iicaId, navigate])

  const runSuccess = () => {
    setPhase('processing')
    setTimeout(() => {
      purchaseSuccess(storeName)
      navigate('/membership/success')
    }, 1500)
  }
  const runFailed = () => { purchaseFailed(); setPhase('failed') }
  const runCancelled = () => { purchaseCancelled(); setPhase('cancelled') }
  const runRestore = () => {
    restorePurchase(storeName)
    navigate('/membership/success')
  }

  const StoreIcon = platform === 'android' ? Play : platform === 'ios' ? Apple : Sparkles

  if (phase === 'failed' || phase === 'cancelled') {
    const failed = phase === 'failed'
    return (
      <AuthShell showBack={false}>
        <div className="flex flex-col items-center pt-10 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${failed ? 'bg-[#F7E9EA] text-error' : 'bg-[#F7F0E4] text-warning'}`}>
            {failed ? <XCircle className="h-9 w-9" strokeWidth={1.75} /> : <AlertTriangle className="h-9 w-9" strokeWidth={1.75} />}
          </div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">
            {failed ? 'Payment failed' : 'Purchase cancelled'}
          </h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
            {failed
              ? 'Something went wrong with the in-app purchase. Your application and IICA ID are safe.'
              : 'Your membership is still pending. You can complete the purchase any time.'}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => setPhase('plan')}>
            {failed ? 'Try Again' : 'Try Again Later'}
          </PrimaryButton>
          <SecondaryButton full onClick={() => navigate('/home')}>
            Go to Home
          </SecondaryButton>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      onBack={() => navigate('/membership/status')}
      footer={
        <div className="flex flex-col gap-2.5">
          <button
            onClick={runSuccess}
            disabled={phase === 'processing'}
            className="tap flex min-h-[50px] items-center justify-center gap-2 rounded-control bg-ink px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ink/90 disabled:opacity-70"
          >
            {phase === 'processing' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
            ) : (
              <><StoreIcon className="h-[18px] w-[18px]" /> {purchaseCtaLabel(platform)}</>
            )}
          </button>
          <p className="text-center text-[11.5px] text-muted">
            Prototype only. No real charge will be made.
          </p>
        </div>
      }
    >
      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
        Step 2 of 2
      </p>
      <h1 className="mt-2 font-serif text-[27px] leading-tight text-ink">
        Choose Your Membership
      </h1>

      {/* Plan card */}
      <div className="mt-6 rounded-card border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-[19px] leading-tight text-ink">{MEMBERSHIP_PLAN.name}</p>
            <p className="mt-0.5 text-[12.5px] text-muted">{MEMBERSHIP_PLAN.regionNote}</p>
          </div>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-dark">
            Annual
          </span>
        </div>

        <div className="mt-3.5 flex flex-col gap-2 border-t border-border pt-3.5">
          {MEMBERSHIP_PLAN.features.map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-[13.5px] text-ink">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Prototype demo pricing */}
      <div className="mt-4 rounded-card border border-dashed border-border bg-surface p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
          Prototype demo pricing
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {MEMBERSHIP_PLAN.demoPrices.map((p) => (
            <div key={p.region} className="flex items-center justify-between text-[13px]">
              <span className="text-muted">{p.region}</span>
              <span className="font-semibold text-ink">{p.price}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Indicative only — not final approved production prices. The real price
          is set by your App Store / Play Store region.
        </p>
      </div>

      {/* Payment method */}
      <div className="mt-4 flex items-start gap-2.5 rounded-control border border-border bg-surface px-3.5 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        <p className="text-[12.5px] leading-relaxed text-muted">
          Membership is billed through {storeName === 'Demo' ? 'the platform store' : storeName} as an
          in-app purchase. No card, bank or UPI details are collected in this
          prototype.
        </p>
      </div>

      {/* Prototype simulation controls */}
      <div className="mt-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
          Prototype simulation
        </p>
        <div className="flex flex-col gap-2">
          <SimRow icon={<Check className="h-4 w-4" />} label="Simulate Successful Purchase" onClick={runSuccess} />
          <SimRow icon={<XCircle className="h-4 w-4" />} label="Simulate Failed Purchase" onClick={runFailed} />
          <SimRow icon={<AlertTriangle className="h-4 w-4" />} label="Simulate Cancelled Purchase" onClick={runCancelled} />
          <SimRow icon={<RotateCcw className="h-4 w-4" />} label="Restore Purchase" onClick={runRestore} />
        </div>
      </div>
    </AuthShell>
  )
}

function SimRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="tap flex min-h-[46px] items-center gap-2.5 rounded-control border border-border bg-surface px-3.5 text-left text-[13.5px] font-semibold text-ink hover:border-ink/25"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark">
        {icon}
      </span>
      {label}
    </button>
  )
}
