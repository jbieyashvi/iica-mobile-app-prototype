import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, ChevronRight } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import SelectField from '../../components/form/SelectField'
import PrimaryButton from '../../components/PrimaryButton'

const KEY = 'iica_payout_settings_v1'
interface Payout { method: string; account: string; ifsc: string; upi: string; holder: string }
function load(): Payout {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return { method: 'Bank Account', account: '', ifsc: '', upi: '', holder: '' }
}

// Creator bank / UPI payout information (was "Earnings & Payouts").
export default function PayoutSettings() {
  const navigate = useNavigate()
  const [p, setP] = useState<Payout>(load)
  const [toast, setToast] = useState('')
  const set = <K extends keyof Payout>(k: K, v: Payout[K]) => setP((s) => ({ ...s, [k]: v }))
  const isUpi = p.method === 'UPI'

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* */ } setToast('Payout details saved'); setTimeout(() => setToast(''), 1600) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Payout Settings" fallback="/profile" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6 pt-4">
        <button onClick={() => navigate('/creator/earnings')} className="tap flex w-full items-center gap-3 rounded-card border border-border bg-surface p-3.5 text-left hover:border-ink/20">
          <Wallet className="h-5 w-5 shrink-0 text-brand" />
          <span className="flex-1"><span className="block text-[14px] font-semibold text-ink">Earnings & payout history</span><span className="text-[12px] text-muted">View balance, statements and past payouts</span></span>
          <ChevronRight className="h-5 w-5 text-muted" />
        </button>

        <h2 className="mb-3 mt-6 text-[13px] font-semibold uppercase tracking-wide text-muted">Where you get paid</h2>
        <div className="flex flex-col gap-4">
          <SelectField label="Payout method" value={p.method} onChange={(v) => set('method', v)} options={['Bank Account', 'UPI']} />
          <TextField label="Account holder name" value={p.holder} onChange={(v) => set('holder', v)} placeholder="As per bank records" />
          {isUpi ? (
            <TextField label="UPI ID" value={p.upi} onChange={(v) => set('upi', v)} placeholder="name@bank" />
          ) : (
            <>
              <TextField label="Account number" value={p.account} onChange={(v) => set('account', v)} placeholder="XXXXXXXXXXXX" />
              <TextField label="IFSC code" value={p.ifsc} onChange={(v) => set('ifsc', v)} placeholder="ABCD0123456" />
            </>
          )}
        </div>
        <p className="mt-3 text-[11.5px] text-muted">Prototype — details are stored locally and never leave the device.</p>
      </div>
      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={save}>Save Payout Details</PrimaryButton>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
