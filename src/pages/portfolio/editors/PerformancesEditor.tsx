import { Plus, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import StatusBadge from '../../../components/StatusBadge'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Entry, Performance } from '../../../portfolio/types'
import { useEditorNav } from './common'

const fields: FieldDef[] = [
  { key: 'name', label: 'Event / performance name', type: 'text' },
  { key: 'venue', label: 'Venue', type: 'text', optional: true },
  { key: 'city', label: 'City', type: 'text', optional: true },
  { key: 'country', label: 'Country', type: 'text', optional: true },
  { key: 'date', label: 'Date', type: 'date', optional: true },
  { key: 'role', label: 'Role', type: 'text', optional: true },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 400, optional: true },
  { key: 'mediaLink', label: 'Photos / media link', type: 'url', optional: true, placeholder: 'https://…' },
]

// Upcoming events "created through the platform"
const upcoming = [
  { id: 'up1', title: 'Ragas of Dusk — Fusion Set', date: '12 Aug 2026', category: 'Recital', paid: true, published: true },
  { id: 'up2', title: 'Open Studio: Movement Lab', date: '30 Aug 2026', category: 'Workshop', paid: false, published: false },
]

export default function PerformancesEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('performances')
  const navigate = useNavigate()

  const setItems = (items: Entry[]) => {
    setSection('pastPerformances', items as unknown as Performance[])
    bump()
  }

  return (
    <EditorShell title="Performances & Events" revision={rev} onSaveContinue={goNext}>
      <h2 className="font-serif text-[20px] text-ink">Past performances</h2>
      <p className="mt-0.5 mb-4 text-[12.5px] text-muted">
        Shows and performances you've been part of.
      </p>
      <RepeatableEditor
        items={portfolio.pastPerformances as unknown as Entry[]}
        onChange={setItems}
        fields={fields}
        addLabel="Add Performance"
        emptyText="No past performances yet. Add a show you've performed in."
        makeSummary={(e) => ({
          title: String(e.name || 'Untitled'),
          sub: [e.venue, e.city].filter(Boolean).join(', '),
        })}
      />

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-serif text-[20px] text-ink">Upcoming events</h2>
        <p className="mt-0.5 mb-4 text-[12.5px] text-muted">
          Events you've created on the platform.
        </p>

        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {upcoming.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 px-3.5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">
                <CalendarDays className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{ev.title}</p>
                <p className="truncate text-[12px] text-muted">
                  {ev.date} · {ev.category}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge tone={ev.paid ? 'brand' : 'success'}>
                  {ev.paid ? 'Paid' : 'Free'}
                </StatusBadge>
                <StatusBadge tone={ev.published ? 'success' : 'warning'}>
                  {ev.published ? 'Published' : 'Draft'}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/events/create')}
          className="tap mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark hover:border-brand"
        >
          <Plus className="h-[18px] w-[18px]" />
          Create New Event
        </button>
      </div>
    </EditorShell>
  )
}
