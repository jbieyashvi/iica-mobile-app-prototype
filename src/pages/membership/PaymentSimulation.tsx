import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, X, ShieldCheck, Loader2 } from 'lucide-react'
import { useAuth } from '../../state/AuthContext'

type Phase = 'entry' | 'pay' | 'processing'

export default function PaymentSimulation() {
  const navigate = useNavigate()
  const { state, completePayment } = useAuth()

  const realId = state.iicaId ?? 'RP.673.IICA'
  const [idInput, setIdInput] = useState('')
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<Phase>('entry')

  const verifyId = () => {
    if (idInput.trim().toUpperCase() === realId.toUpperCase()) {
      setError('')
      setPhase('pay')
    } else {
      setError("We couldn't find this membership application.")
    }
  }

  const pay = () => {
    setPhase('processing')
    setTimeout(() => {
      completePayment()
      navigate('/membership/success')
    }, 1600)
  }

  return (
    <div className="flex h-full flex-col bg-[#2b2b2e]">
      {/* Fake browser chrome */}
      <div style={{ paddingTop: 'var(--safe-top)' }} className="bg-[#3a3a3d] px-3 pb-2 pt-2">
        <div className="flex items-center gap-2">
          <button
            aria-label="Close browser"
            onClick={() => navigate(-1)}
            className="tap flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-center gap-1.5 rounded-full bg-[#232326] px-3 py-1.5 text-white/80">
            <Lock className="h-3 w-3 text-[#7fd18c]" />
            <span className="truncate text-[12px]">
              secure-pay.iica-billing.com
            </span>
          </div>
        </div>
      </div>

      {/* External page */}
      <div className="no-scrollbar flex-1 overflow-y-auto bg-[#f4f4f2]">
        <div className="mx-auto max-w-app px-5 py-6">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-[#eae6de] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-[#8a7f6b]">
            Prototype simulation — not a real payment page
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-brand font-serif text-[15px] leading-none text-white">
              II
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">IICA Membership Payment</p>
              <p className="text-[11px] text-muted">Billed by IICA Arts Foundation</p>
            </div>
          </div>

          {phase === 'entry' && (
            <div className="mt-6 rounded-[10px] border border-[#e3ded4] bg-white p-4">
              <label
                htmlFor="pay-id"
                className="mb-1.5 block text-[13px] font-semibold text-ink"
              >
                Enter your Unique IICA ID
              </label>
              <input
                id="pay-id"
                value={idInput}
                onChange={(e) => {
                  setIdInput(e.target.value)
                  setError('')
                }}
                placeholder="e.g. RP.673.IICA"
                autoCapitalize="characters"
                className={`min-h-[46px] w-full rounded-[8px] border bg-white px-3 font-mono text-[15px] text-ink outline-none focus:ring-2 focus:ring-brand/30 ${
                  error ? 'border-error' : 'border-[#d8d2c6] focus:border-brand'
                }`}
              />
              {error && (
                <p className="mt-1.5 text-[12px] font-medium text-error">{error}</p>
              )}
              <p className="mt-2 text-[12px] text-muted">
                This is the ID emailed to you after applying.
              </p>
              <button
                onClick={verifyId}
                disabled={!idInput.trim()}
                className="tap mt-4 min-h-[48px] w-full rounded-[8px] bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {(phase === 'pay' || phase === 'processing') && (
            <>
              <div className="mt-6 rounded-[10px] border border-[#e3ded4] bg-white p-4">
                <SummaryRow label="Membership application" value={realId} mono />
                <SummaryRow label="Email" value={state.email || 'you@example.com'} />
                <SummaryRow label="Plan" value="Creator Membership · Annual" />
                <div className="mt-3 flex items-center justify-between border-t border-[#eee9df] pt-3">
                  <span className="text-[14px] font-semibold text-ink">
                    Amount due
                  </span>
                  <span className="text-[20px] font-bold text-ink">₹—.00</span>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Amount is a placeholder for this prototype.
                </p>
              </div>

              <div className="mt-4 rounded-[10px] border border-[#e3ded4] bg-white p-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Payment method
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  No card, bank or UPI details are collected in this prototype.
                  Use the demo action below to simulate a successful payment.
                </p>
                <button
                  onClick={pay}
                  disabled={phase === 'processing'}
                  className="tap mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-ink text-[15px] font-semibold text-white hover:bg-ink/90 disabled:opacity-70"
                >
                  {phase === 'processing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    'Complete Demo Payment'
                  )}
                </button>
              </div>
            </>
          )}

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
            <Lock className="h-3 w-3" /> Secured simulation · IICA prototype
          </p>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className={`text-[13px] font-semibold text-ink ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}
