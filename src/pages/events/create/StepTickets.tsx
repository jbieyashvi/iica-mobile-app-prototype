import { useNavigate } from 'react-router-dom'
import BuilderShell from '../../../components/events/BuilderShell'
import TextField from '../../../components/form/TextField'
import TextArea from '../../../components/form/TextArea'
import Toggle from '../../../components/form/Toggle'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { useEvents } from '../../../state/EventsContext'
import { Entry } from '../../../portfolio/types'
import { TicketType, PLATFORM_FEE_RATE } from '../../../events/types'
import { inr } from '../../../events/format'

const PRESETS = ['General Admission', 'Early Bird', 'VIP', 'Student', 'Custom Ticket']

const ticketFields: FieldDef[] = [
  { key: 'name', label: 'Ticket name', type: 'text', placeholder: 'e.g. General Admission' },
  { key: 'price', label: 'Price (₹)', type: 'number', half: true },
  { key: 'quantity', label: 'Quantity', type: 'number', half: true },
  { key: 'salesStart', label: 'Sales start', type: 'date', optional: true },
  { key: 'salesEnd', label: 'Sales end', type: 'date', optional: true },
  { key: 'maxPerBuyer', label: 'Max per buyer', type: 'number', optional: true },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 200, optional: true },
  { key: 'benefits', label: 'Benefits / inclusions', type: 'text', optional: true },
  { key: 'refundable', label: 'Refundable', type: 'toggle' },
]

export default function StepTickets() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useEvents()
  const paid = draft.paid ?? false

  const tickets = (draft.tickets ?? []) as TicketType[]
  const totalCap = paid ? tickets.reduce((s, t) => s + (Number(t.quantity) || 0), 0) : (draft.capacity ?? 0)
  const sampleRevenue = tickets.reduce((s, t) => s + (Number(t.price) || 0) * (Number(t.quantity) || 0), 0)
  const earnings = Math.round(sampleRevenue * (1 - PLATFORM_FEE_RATE))

  const canContinue = paid ? tickets.length > 0 : (draft.capacity ?? 0) > 0

  const setFree = () => saveDraft({ paid: false, tickets: [] })
  const setPaid = () => saveDraft({ paid: true })

  return (
    <BuilderShell step={3} canContinue={canContinue} onContinue={() => navigate('/events/create/media')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">Tickets</h2>
      <p className="mb-4 text-[12.5px] text-muted">Choose how attendees register.</p>

      <div className="mb-5 grid grid-cols-2 gap-2.5">
        <button onClick={setFree} className={`tap rounded-card border p-4 text-left ${!paid ? 'border-brand bg-brand-soft' : 'border-border bg-surface'}`}>
          <p className="font-serif text-[17px] text-ink">Free Event</p>
          <p className="mt-0.5 text-[12px] text-muted">Registration only</p>
        </button>
        <button onClick={setPaid} className={`tap rounded-card border p-4 text-left ${paid ? 'border-brand bg-brand-soft' : 'border-border bg-surface'}`}>
          <p className="font-serif text-[17px] text-ink">Paid Event</p>
          <p className="mt-0.5 text-[12px] text-muted">Sell tickets in-app</p>
        </button>
      </div>

      {!paid ? (
        <div className="flex flex-col gap-4">
          <TextField label="Registration capacity" type="number" value={String(draft.capacity ?? '')} onChange={(v) => saveDraft({ capacity: Number(v) || 0 })} placeholder="e.g. 100" />
          <TextField label="Maximum tickets per person" type="number" value={String(draft.maxPerPerson ?? 4)} onChange={(v) => saveDraft({ maxPerPerson: Number(v) || 1 })} />
          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
            <Toggle label="Enable waitlist" checked={!!draft.waitlist} onChange={(v) => saveDraft({ waitlist: v })} />
            <Toggle label="Require approval" description="Registrations start as Pending Approval" checked={!!draft.approvalRequired} onChange={(v) => saveDraft({ approvalRequired: v })} />
          </div>
          <p className="rounded-control bg-surface px-3.5 py-3 text-[12px] text-muted ring-1 ring-border">Free events show a “Register for Free” button. Ticket price is automatically ₹0.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[12px] text-muted">Add ticket types ({PRESETS.slice(0, 4).join(', ')}…). Default currency INR.</p>
          <RepeatableEditor
            items={(draft.tickets ?? []) as unknown as Entry[]}
            onChange={(items) => saveDraft({ tickets: items as unknown as TicketType[] })}
            fields={ticketFields}
            addLabel="Add Ticket Type"
            emptyText="No ticket types yet. Add at least one."
            makeSummary={(e) => ({ title: String(e.name || 'Ticket'), sub: `${inr(Number(e.price) || 0)} · ${e.quantity || 0} available` })}
          />

          <div className="flex flex-col gap-1.5 rounded-card border border-border bg-surface p-4 text-[13px]">
            <div className="flex justify-between"><span className="text-muted">Total capacity</span><span className="font-semibold text-ink">{totalCap}</span></div>
            <div className="flex justify-between"><span className="text-muted">Platform fee</span><span className="font-semibold text-ink">{Math.round(PLATFORM_FEE_RATE * 100)}%</span></div>
            <div className="flex justify-between border-t border-border pt-1.5"><span className="text-muted">Est. earnings (sold out)</span><span className="font-bold text-ink">{inr(earnings)}</span></div>
            <p className="text-[11px] text-muted">Taxes calculated at checkout where applicable.</p>
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
            <Toggle label="Enable waitlist" checked={!!draft.waitlist} onChange={(v) => saveDraft({ waitlist: v })} />
          </div>
          <TextArea label="Refund policy" value={draft.refundPolicy ?? ''} onChange={(v) => saveDraft({ refundPolicy: v })} maxLength={300} rows={2} placeholder="e.g. Refundable up to 48 hours before the event." />
        </div>
      )}
    </BuilderShell>
  )
}
