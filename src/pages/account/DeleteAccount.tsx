import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Check } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'

const KEY = 'iica_account_deletion_v1'

// 30-day soft-delete flow: schedules deletion, keeps data recoverable, logs out.
export default function DeleteAccount() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [ack, setAck] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const schedule = () => {
    const runAt = Date.now() + 30 * 24 * 60 * 60 * 1000
    try { localStorage.setItem(KEY, JSON.stringify({ scheduledAt: Date.now(), deleteAt: runAt })) } catch { /* */ }
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Delete Account" fallback="/profile" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6 pt-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E9EA] text-error"><AlertTriangle className="h-6 w-6" strokeWidth={1.9} /></div>
        <h1 className="mt-4 font-serif text-[24px] leading-tight text-ink">Delete your account</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">Your account is deactivated immediately and permanently deleted after <span className="font-semibold text-ink">30 days</span>. You can restore it any time within 30 days by signing back in.</p>

        <div className="mt-5 rounded-card border border-border bg-surface p-4">
          <p className="text-[13px] font-semibold text-ink">During the 30-day window</p>
          <ul className="mt-2 space-y-1.5 text-[12.5px] text-muted">
            <li>• Your profile and portfolio are hidden from others.</li>
            <li>• Purchases, orders and library access are paused.</li>
            <li>• Sign in again to cancel deletion and restore everything.</li>
          </ul>
        </div>

        <p className="mt-4 text-[12.5px] text-muted">After 30 days, content, orders history and creator data are permanently removed and cannot be recovered.</p>

        <button onClick={() => setAck((a) => !a)} className="tap mt-4 flex w-full items-start gap-2.5 rounded-card border border-border bg-surface p-3.5 text-left">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${ack ? 'border-error bg-error text-white' : 'border-border'}`}>{ack && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
          <span className="text-[13px] text-ink">I understand my account will be scheduled for permanent deletion.</span>
        </button>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <div className="flex flex-col gap-2.5">
          <button disabled={!ack} onClick={() => setConfirm(true)} className="tap flex min-h-[48px] items-center justify-center rounded-control bg-error text-[15px] font-semibold text-white disabled:opacity-40">Delete My Account</button>
          <SecondaryButton full onClick={() => navigate('/profile')}>Keep My Account</SecondaryButton>
        </div>
      </div>

      {confirm && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setConfirm(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h3 className="font-serif text-[22px] text-ink">Delete account?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">This starts the 30-day deletion. You’ll be signed out. Sign back in within 30 days to cancel.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button onClick={schedule} className="tap min-h-[48px] rounded-control bg-error text-[15px] font-semibold text-white">Delete &amp; Sign Out</button>
              <button onClick={() => setConfirm(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
