import { useState } from 'react'
import { CreditCard, Smartphone, Plus, Trash2, X, Check } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

const KEY = 'iica_payment_methods_v1'
interface Method { id: string; type: 'Card' | 'UPI'; label: string; primary: boolean }
const SEED: Method[] = [
  { id: 'pm1', type: 'Card', label: 'Visa · **** 6411', primary: true },
  { id: 'pm2', type: 'UPI', label: 'yashvi@demo', primary: false },
]
function load(): Method[] { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) } catch { /* */ } return SEED }
const rid = () => 'pm' + Math.random().toString(36).slice(2, 7)

export default function PaymentMethods() {
  const [methods, setMethods] = useState<Method[]>(load)
  const [addOpen, setAddOpen] = useState(false)
  const persist = (m: Method[]) => { setMethods(m); try { localStorage.setItem(KEY, JSON.stringify(m)) } catch { /* */ } }

  const remove = (id: string) => persist(methods.filter((m) => m.id !== id))
  const makePrimary = (id: string) => persist(methods.map((m) => ({ ...m, primary: m.id === id })))

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Payment Methods" fallback="/profile" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-4">
        <p className="text-[13px] text-muted">Saved methods used for purchases. Prototype only — no real card data is stored.</p>
        <div className="mt-4 flex flex-col gap-2.5">
          {methods.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft text-brand-dark">{m.type === 'Card' ? <CreditCard className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{m.label}</p>
                {m.primary ? <p className="text-[11.5px] font-semibold text-success">Primary</p> : <button onClick={() => makePrimary(m.id)} className="tap text-[11.5px] font-semibold text-brand">Set as primary</button>}
              </div>
              <button onClick={() => remove(m.id)} aria-label="Remove" className="tap flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-error"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {methods.length === 0 && <p className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center text-[13px] text-muted">No saved payment methods.</p>}
        </div>
        <button onClick={() => setAddOpen(true)} className="tap mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-border text-[14px] font-semibold text-brand hover:border-brand/50"><Plus className="h-4 w-4" /> Add payment method</button>
      </div>

      {addOpen && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setAddOpen(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[20px] text-ink">Add a method</h3><button aria-label="Close" onClick={() => setAddOpen(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted"><X className="h-5 w-5" /></button></div>
            <p className="mb-3 text-[12.5px] text-muted">Prototype — a demo method is added without collecting real details.</p>
            <div className="flex flex-col gap-2.5">
              <PrimaryButton full onClick={() => { persist([...methods, { id: rid(), type: 'Card', label: 'Mastercard · **** 2048', primary: methods.length === 0 }]); setAddOpen(false) }}><CreditCard className="h-4 w-4" /> Add demo card</PrimaryButton>
              <SecondaryButton full onClick={() => { persist([...methods, { id: rid(), type: 'UPI', label: 'demo@upi', primary: methods.length === 0 }]); setAddOpen(false) }}><Check className="h-4 w-4" /> Add demo UPI</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
