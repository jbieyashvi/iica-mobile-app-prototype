import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Clock,
  Lock,
  ExternalLink,
  Copy,
  Mail,
  LifeBuoy,
  Home,
} from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import StatusBadge from '../../components/StatusBadge'
import { useAuth } from '../../state/AuthContext'

export default function PaymentPending() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const [toast, setToast] = useState('')

  const id = state.iicaId ?? 'RP.673.IICA'
  const date = state.submittedAt
    ? new Date(state.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1800)
  }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id)
    } catch {
      /* ignore */
    }
    flash('Unique ID copied')
  }

  return (
    <AuthShell onBack={() => navigate('/')}>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-serif text-[26px] leading-tight text-ink">
          Membership status
        </h1>
        <StatusBadge tone="warning">Payment Pending</StatusBadge>
      </div>
      <p className="text-[13px] text-muted">
        Complete your payment to activate creator access.
      </p>

      {/* Summary */}
      <div className="mt-5 rounded-card border border-border bg-surface">
        <Row label="Unique IICA ID" value={id} mono />
        <Row label="Application date" value={date} />
        <Row
          label="Email status"
          value="Instructions sent"
          valueTone="success"
        />
      </div>

      {/* Tracker */}
      <div className="mt-6">
        <p className="mb-3 text-[13px] font-semibold text-ink">Progress</p>
        <div className="flex flex-col gap-0">
          <TrackStep
            state="done"
            title="Application submitted"
            sub="We've received your details"
          />
          <TrackStep
            state="current"
            title="Payment"
            sub="Pending — complete via the external link"
          />
          <TrackStep
            state="locked"
            title="Portfolio access"
            sub="Unlocks after payment"
            last
          />
        </div>
      </div>

      <p className="mt-5 rounded-control bg-surface px-3.5 py-3 text-[12.5px] leading-relaxed text-muted ring-1 ring-border">
        No membership fee is collected inside the app. Payment happens only on
        the secure external page linked in your email.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2.5">
        <button
          onClick={() => navigate('/membership/payment-simulation')}
          className="tap flex min-h-[48px] items-center justify-center gap-2 rounded-control bg-brand px-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          Open External Payment Link
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <ActionBtn icon={<Copy className="h-4 w-4" />} label="Copy ID" onClick={copyId} />
          <ActionBtn
            icon={<Mail className="h-4 w-4" />}
            label="Resend Email"
            onClick={() => flash('Payment email resent')}
          />
          <ActionBtn
            icon={<LifeBuoy className="h-4 w-4" />}
            label="Contact Support"
            onClick={() => flash('Support: help@iica.art')}
          />
          <ActionBtn
            icon={<Home className="h-4 w-4" />}
            label="Return Home"
            onClick={() => navigate('/')}
          />
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white shadow-subtle">
            {toast}
          </span>
        </div>
      )}
    </AuthShell>
  )
}

function Row({
  label,
  value,
  mono,
  valueTone,
}: {
  label: string
  value: string
  mono?: boolean
  valueTone?: 'success'
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span
        className={`text-[13px] font-semibold ${
          valueTone === 'success' ? 'text-success' : 'text-ink'
        } ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function TrackStep({
  state,
  title,
  sub,
  last,
}: {
  state: 'done' | 'current' | 'locked'
  title: string
  sub: string
  last?: boolean
}) {
  const icon =
    state === 'done' ? (
      <Check className="h-4 w-4" strokeWidth={3} />
    ) : state === 'current' ? (
      <Clock className="h-4 w-4" />
    ) : (
      <Lock className="h-3.5 w-3.5" />
    )
  const ring =
    state === 'done'
      ? 'bg-success text-white'
      : state === 'current'
        ? 'bg-brand text-white'
        : 'bg-surface text-muted border border-border'

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${ring}`}
        >
          {icon}
        </span>
        {!last && (
          <span
            className={`my-0.5 w-px flex-1 ${
              state === 'done' ? 'bg-success/40' : 'bg-border'
            }`}
          />
        )}
      </div>
      <div className={`pb-5 ${last ? 'pb-0' : ''}`}>
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-ink">{title}</p>
          {state === 'done' && <StatusBadge tone="success">Complete</StatusBadge>}
          {state === 'current' && <StatusBadge tone="warning">Pending</StatusBadge>}
          {state === 'locked' && <StatusBadge tone="neutral">Locked</StatusBadge>}
        </div>
        <p className="mt-0.5 text-[12.5px] text-muted">{sub}</p>
      </div>
    </div>
  )
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="tap flex min-h-[44px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[13px] font-semibold text-ink hover:border-ink/25"
    >
      {icon}
      {label}
    </button>
  )
}
