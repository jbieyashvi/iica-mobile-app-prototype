import { useState } from 'react'
import { Plus, Trash2, HeartHandshake } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import SelectField from '../../../components/form/SelectField'
import Toggle from '../../../components/form/Toggle'
import { usePortfolio } from '../../../state/PortfolioContext'
import { DonationOption, SupportConfig } from '../../../portfolio/types'
import { useEditorNav } from './common'

const CURRENCIES = ['INR', 'USD', 'GBP', 'EUR', 'AED']
const DESC_MAX = 1000
const DEFAULT_HEADING = 'We Need Your Support'

const newId = () => 'sp' + Math.random().toString(36).slice(2, 9)
const newOption = (): DonationOption => ({ id: newId(), title: '', amount: '', currency: 'INR', note: '', active: true })

export default function SupportEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('support')
  const s = portfolio.support
  const [touched, setTouched] = useState(false)

  const update = (patch: Partial<SupportConfig>) => {
    setSection('support', { ...s, ...patch })
    bump()
  }
  const setOption = (id: string, patch: Partial<DonationOption>) =>
    update({ options: s.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) })

  // Amount that duplicates another ACTIVE option of the same currency is invalid.
  const isDuplicate = (o: DonationOption) =>
    o.active && Number(o.amount) > 0 &&
    s.options.some((x) => x.id !== o.id && x.active && x.currency === o.currency && Number(x.amount) === Number(o.amount))

  const optionError = (o: DonationOption): string => {
    if (!o.amount.trim() || Number(o.amount) <= 0) return 'Amount must be greater than zero'
    if (isDuplicate(o)) return 'Duplicate active amount for this currency'
    return ''
  }

  return (
    <EditorShell title="We Need Your Support" revision={rev} onSaveContinue={goNext}>
      <p className="mb-4 text-[13px] leading-relaxed text-muted">
        Let supporters contribute a fixed amount you choose. Donors pick one of
        your options — they cannot enter a custom amount.
      </p>

      <div className="rounded-card border border-border bg-surface p-4">
        <Toggle
          label="Show support section"
          description="Display “We Need Your Support” on your public portfolio"
          checked={s.show}
          onChange={(v) => update({ show: v })}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <TextField
          label="Support heading"
          value={s.heading}
          onChange={(v) => update({ heading: v })}
          placeholder={DEFAULT_HEADING}
        />
        <TextArea
          label="Support description"
          value={s.description}
          onChange={(v) => update({ description: v.slice(0, DESC_MAX) })}
          maxLength={DESC_MAX}
          rows={4}
          placeholder="Tell supporters what their contribution helps you do."
        />
      </div>

      {/* Fixed donation options */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink">Fixed donation options</p>
        <span className="text-[11.5px] text-muted">{s.options.filter((o) => o.active).length} active</span>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {s.options.map((o) => {
          const err = touched ? optionError(o) : ''
          return (
            <div key={o.id} className="rounded-card border border-border bg-surface p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <HeartHandshake className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <TextField label="Option title" value={o.title} onChange={(v) => setOption(o.id, { title: v })} placeholder="e.g. Buy me a chai" optional />
                </div>
                <button
                  aria-label="Remove option"
                  onClick={() => update({ options: s.options.filter((x) => x.id !== o.id) })}
                  className="tap mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-muted hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-[1fr_100px] gap-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink">Amount</label>
                  <input
                    inputMode="numeric"
                    value={o.amount}
                    onChange={(e) => setOption(o.id, { amount: e.target.value.replace(/[^0-9.]/g, '') })}
                    placeholder="500"
                    aria-invalid={!!err}
                    className={`min-h-[46px] w-full rounded-control border bg-surface px-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-brand/30 ${err ? 'border-error' : 'border-border focus:border-brand'}`}
                  />
                </div>
                <SelectField label="Currency" value={o.currency} onChange={(v) => setOption(o.id, { currency: v })} options={CURRENCIES} />
              </div>
              {err && <p className="mt-1 text-[12px] font-medium text-error">{err}</p>}

              <div className="mt-3">
                <TextField label="Short note" value={o.note} onChange={(v) => setOption(o.id, { note: v })} placeholder="Optional — what this supports" optional />
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <Toggle label="Active" checked={o.active} onChange={(v) => setOption(o.id, { active: v })} />
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => { setTouched(true); update({ options: [...s.options, newOption()] }) }}
        className="tap mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark hover:border-brand"
      >
        <Plus className="h-[18px] w-[18px]" /> Add Donation Option
      </button>

      <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
        You set every amount. Supporters choose a fixed option and cannot enter
        their own amount. Prototype only — no real payment is processed.
      </p>
    </EditorShell>
  )
}
