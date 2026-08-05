import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HeartHandshake, Loader2, CheckCircle2, Copy, Lock, ShieldCheck } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { usePublicArtist } from '../../data/usePublicArtist'
import { useAuth } from '../../state/AuthContext'
import { useSupport } from '../../state/SupportContext'
import { formatMoney } from '../../shop/pricing'

type Phase = 'summary' | 'processing' | 'success'

export default function ArtistSupport() {
  const { slug, optionId } = useParams()
  const navigate = useNavigate()
  const { artist } = usePublicArtist(slug)
  const { state } = useAuth()
  const { addSupport } = useSupport()

  const [phase, setPhase] = useState<Phase>('summary')
  const [ref, setRef] = useState('')
  const [toast, setToast] = useState('')

  const option = artist?.support?.options.find((o) => o.id === optionId)

  if (!artist || !option) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={slug ? `/artist/${slug}` : '/home'} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="font-serif text-[20px] text-ink">Support option unavailable</p>
          <p className="mt-1 text-[13px] text-muted">This support option no longer exists.</p>
          <div className="mt-5"><PrimaryButton onClick={() => navigate(`/artist/${artist?.slug ?? ''}`)}>Back to Profile</PrimaryButton></div>
        </div>
      </div>
    )
  }

  const amountLabel = formatMoney(option.amount, option.currency)

  // ---- Guest gate: may view, must register/login before paying ----
  if (!state.authed) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={`/artist/${artist.slug}`} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand"><Lock className="h-8 w-8" strokeWidth={1.6} /></span>
          <h1 className="mt-5 font-serif text-[24px] leading-tight text-ink">Sign in to support {artist.name.split(' ')[0]}</h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
            You’re supporting <span className="font-semibold text-ink">{option.title || 'this creator'}</span> ({amountLabel}).
            Create a free account or sign in to complete your support.
          </p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/signup')}>Create an Account</PrimaryButton>
            <SecondaryButton full onClick={() => navigate('/login')}>Sign In</SecondaryButton>
          </div>
        </div>
      </div>
    )
  }

  const supporterName = state.name || 'IICA Supporter'
  const supporterEmail = state.email || 'supporter@iica.app'

  const confirm = () => {
    setPhase('processing')
    setTimeout(() => {
      const record = addSupport({
        creatorSlug: artist.slug,
        creatorName: artist.name,
        optionId: option.id,
        optionTitle: option.title || 'Support',
        amount: option.amount,
        currency: option.currency,
        supporterName,
        supporterEmail,
      })
      setRef(record.id)
      setPhase('success')
    }, 1400)
  }

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const copyRef = async () => {
    try { await navigator.clipboard.writeText(ref) } catch { /* ignore */ }
    flash('Reference copied')
  }

  // ---- Success ----
  if (phase === 'success') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Support" fallback={`/artist/${artist.slug}`} />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8 pt-4">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></span>
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-success">Support successful</p>
            <h1 className="mt-2 font-serif text-[26px] leading-tight text-ink">Thank you for supporting {artist.name.split(' ')[0]}</h1>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
              Your {amountLabel} contribution to “{option.title || 'Support'}” is confirmed.
            </p>
          </div>

          <div className="mt-6 rounded-card border border-border bg-surface">
            <Row label="Support reference" value={ref} mono action={<button onClick={copyRef} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button>} />
            <Row label="Creator" value={artist.name} />
            <Row label="Option" value={option.title || 'Support'} />
            <Row label="Amount" value={`${amountLabel} · fixed`} />
            <Row label="Supporter" value={supporterName} />
          </div>

          <p className="mt-4 rounded-control bg-surface px-3.5 py-3 text-[12px] leading-relaxed text-muted ring-1 ring-border">
            Prototype only — no real payment was processed and no money was transferred.
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate(`/artist/${artist.slug}`)}>Return to Creator Profile</PrimaryButton>
            <SecondaryButton full onClick={() => navigate('/home')}>Go to Home</SecondaryButton>
          </div>
        </div>
      </div>
    )
  }

  // ---- Summary / confirm ----
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Support" fallback={`/artist/${artist.slug}`} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        {/* Creator */}
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3.5">
          <Avatar name={artist.name} src={artist.photo} size={48} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-ink">{artist.name}</p>
            <p className="truncate text-[12.5px] text-muted">{artist.headline}</p>
          </div>
          <HeartHandshake className="h-5 w-5 shrink-0 text-brand" />
        </div>

        {/* Option */}
        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[18px] text-ink">{option.title || 'Support'}</p>
            <StatusBadge tone="brand">Fixed</StatusBadge>
          </div>
          {option.note && <p className="mt-1 text-[13px] leading-relaxed text-muted">{option.note}</p>}
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-muted">Support amount</span>
              <span className="font-serif text-[24px] text-ink">{amountLabel}</span>
            </div>
            <p className="mt-1 text-[11.5px] text-brand">This amount is fixed by the creator and cannot be changed.</p>
          </div>
        </div>

        {/* Payment summary */}
        <p className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-wide text-muted">Payment summary</p>
        <div className="rounded-card border border-border bg-surface">
          <Row label="Contribution" value={amountLabel} />
          <Row label="Processing fee" value={formatMoney(0, option.currency)} />
          <Row label="Total" value={amountLabel} strong />
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-control border border-border bg-surface px-3.5 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <p className="text-[12.5px] leading-relaxed text-muted">
            Prototype support flow. No card, bank or UPI details are collected and no real charge is made.
          </p>
        </div>
      </div>

      {/* Sticky confirm */}
      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <button
          onClick={confirm}
          disabled={phase === 'processing'}
          className="tap flex min-h-[50px] w-full items-center justify-center gap-2 rounded-control bg-brand px-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
        >
          {phase === 'processing' ? (<><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>) : (<><HeartHandshake className="h-[18px] w-[18px]" /> Confirm Support · {amountLabel}</>)}
        </button>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono, strong, action }: { label: string; value: string; mono?: boolean; strong?: boolean; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className={`text-[13px] text-ink ${mono ? 'font-mono' : ''} ${strong ? 'font-bold' : 'font-semibold'}`}>{value}</span>
        {action}
      </span>
    </div>
  )
}
