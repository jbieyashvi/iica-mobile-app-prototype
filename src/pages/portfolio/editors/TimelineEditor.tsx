import { Star, MoveHorizontal } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import RepeatableEditor, { FieldDef } from '../../../components/portfolio/RepeatableEditor'
import { usePortfolio } from '../../../state/PortfolioContext'
import { Entry, Milestone } from '../../../portfolio/types'
import { useEditorNav } from './common'

export const MILESTONE_CATEGORIES = [
  'Education', 'First Performance', 'Career', 'Award',
  'Collaboration', 'Release', 'Event', 'Other',
]

const fields: FieldDef[] = [
  { key: 'title', label: 'Milestone title', type: 'text', placeholder: 'e.g. First State-Level Performance' },
  { key: 'date', label: 'Year (or YYYY-MM)', type: 'text', placeholder: 'e.g. 2011 or 2011-06' },
  { key: 'category', label: 'Category', type: 'select', options: MILESTONE_CATEGORIES },
  { key: 'description', label: 'Short description', type: 'textarea', maxLength: 300 },
  { key: 'media', label: 'Media', type: 'image', optional: true },
  { key: 'link', label: 'External link', type: 'url', optional: true, placeholder: 'https://…' },
  { key: 'featured', label: 'Feature this milestone', type: 'toggle' },
]

export const yearOf = (d: string) => parseInt(String(d).slice(0, 4), 10) || 0
const byDate = (a: Entry, b: Entry) => yearOf(String(a.date)) - yearOf(String(b.date))

export function TimelineStrip({ items }: { items: Milestone[] }) {
  const sorted = [...items].sort((a, b) => yearOf(a.date) - yearOf(b.date))
  const latestYear = sorted.length ? yearOf(sorted[sorted.length - 1].date) : 0

  if (sorted.length === 0) return null

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-muted">
        <MoveHorizontal className="h-3.5 w-3.5" />
        Swipe to explore your journey
      </div>
      <div className="no-scrollbar -mx-[22px] overflow-x-auto px-[22px] pb-2">
        <div className="relative flex min-w-max items-stretch gap-4 pt-1">
          {/* baseline */}
          <div className="absolute left-0 right-0 top-[86px] h-[2px] bg-border" />
          {sorted.map((m) => {
            const isLatest = yearOf(m.date) === latestYear
            const highlight = isLatest || m.featured
            return (
              <div key={m.id} className="relative w-[150px] shrink-0">
                <div
                  className={`h-[74px] overflow-hidden rounded-[10px] border ${
                    highlight ? 'border-brand' : 'border-border'
                  } bg-brand-soft`}
                >
                  {m.media ? (
                    <img src={m.media} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-brand-dark/60">
                      {m.category}
                    </div>
                  )}
                </div>
                {/* marker */}
                <div className="relative flex justify-center py-1.5">
                  <span
                    className={`z-10 h-3 w-3 rounded-full border-2 border-bg ${
                      highlight ? 'bg-brand' : 'bg-muted'
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className={`font-serif text-[15px] leading-none ${highlight ? 'text-brand' : 'text-ink'}`}>
                    {String(m.date).slice(0, 4)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-ink">
                    {m.title}
                  </p>
                  {m.featured && (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-brand">
                      <Star className="h-2.5 w-2.5 fill-brand" /> Featured
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function TimelineEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('timeline')

  const setItems = (items: Entry[]) => {
    setSection('timeline', items as unknown as Milestone[])
    bump()
  }

  return (
    <EditorShell title="Highlights by Timeline" revision={rev} onSaveContinue={goNext}>
      <p className="text-[12.5px] leading-relaxed text-muted">
        Your timeline is a signature part of your IICA profile. Milestones are
        ordered automatically by date — earliest to latest.
      </p>

      <div className="mt-5">
        <TimelineStrip items={portfolio.timeline} />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <RepeatableEditor
          items={portfolio.timeline as unknown as Entry[]}
          onChange={setItems}
          fields={fields}
          sort={byDate}
          addLabel="Add Milestone"
          emptyText="No milestones yet. Add your first career highlight."
          makeSummary={(e) => ({
            title: String(e.title || 'Untitled'),
            sub: [String(e.date).slice(0, 4), e.category].filter(Boolean).join(' · '),
            badge: e.featured ? 'Featured' : undefined,
            image: String(e.media || ''),
          })}
        />
      </div>
    </EditorShell>
  )
}
