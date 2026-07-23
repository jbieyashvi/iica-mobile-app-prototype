import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, X, Clock, Copy } from 'lucide-react'
import { useAuth } from './AuthContext'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

interface CreateGateValue {
  // Route to the create flow if allowed, otherwise show the role-appropriate sheet.
  startCreate: () => void
}

const CreateGateContext = createContext<CreateGateValue | null>(null)

export function CreateGateProvider({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const startCreate = useCallback(() => {
    if (state.role === 'active') navigate('/content/create')
    else setOpen(true)
  }, [state.role, navigate])

  const close = () => setOpen(false)
  const go = (to: string) => { setOpen(false); navigate(to) }

  const guestSheet = state.role === 'guest' && !state.authed
  const registered = state.role === 'guest' && state.authed
  const pending = state.role === 'pending'

  return (
    <CreateGateContext.Provider value={{ startCreate }}>
      {children}

      {open && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={close} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <button aria-label="Close" onClick={close} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>

            {guestSheet && (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><PenLine className="h-6 w-6" strokeWidth={1.75} /></div>
                <h2 className="font-serif text-[23px] leading-tight text-ink">Create and share your work through IICA</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Sign in or become a member to publish content to the IICA community.</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <PrimaryButton full onClick={() => go('/login')}>Sign In</PrimaryButton>
                  <SecondaryButton full onClick={() => go('/membership')}>Become a Member</SecondaryButton>
                  <button onClick={close} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Maybe Later</button>
                </div>
              </>
            )}

            {registered && (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><PenLine className="h-6 w-6" strokeWidth={1.75} /></div>
                <h2 className="font-serif text-[23px] leading-tight text-ink">Publishing is for IICA creators</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">You can browse, like, comment, save and share content. Publishing creator content is available to active IICA members.</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <PrimaryButton full onClick={() => go('/membership')}>Apply for Membership</PrimaryButton>
                  <SecondaryButton full onClick={() => go('/explore/content')}>Explore Content</SecondaryButton>
                </div>
              </>
            )}

            {pending && (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F0E4] text-warning"><Clock className="h-6 w-6" strokeWidth={1.75} /></div>
                <h2 className="font-serif text-[23px] leading-tight text-ink">Payment pending</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Your membership is awaiting payment. Complete it to unlock content publishing.</p>
                <div className="mt-3 flex items-center justify-between rounded-control border border-border bg-bg px-3 py-2">
                  <span className="font-mono text-[13px] font-semibold text-ink">{state.iicaId ?? 'JY.673.IICA'}</span>
                  <button onClick={() => { navigator.clipboard?.writeText(state.iicaId ?? ''); setCopied(true); setTimeout(() => setCopied(false), 1400) }} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy IICA ID'}</button>
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  <PrimaryButton full onClick={() => go('/membership/payment-pending')}>Complete Payment</PrimaryButton>
                  <button onClick={close} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Maybe Later</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </CreateGateContext.Provider>
  )
}

export function useCreateGate() {
  const ctx = useContext(CreateGateContext)
  if (!ctx) throw new Error('useCreateGate must be used within CreateGateProvider')
  return ctx
}
