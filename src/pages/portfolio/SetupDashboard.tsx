import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, Check, Circle, Clock } from 'lucide-react'
import { usePortfolio } from '../../state/PortfolioContext'
import {
  SECTIONS,
  completion,
  requiredComplete,
  sectionStatus,
  SectionStatus,
} from '../../portfolio/sections'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

const statusMeta: Record<
  SectionStatus,
  { label: string; cls: string; icon: typeof Check }
> = {
  complete: { label: 'Complete', cls: 'text-success', icon: Check },
  'in-progress': { label: 'In Progress', cls: 'text-warning', icon: Clock },
  'not-started': { label: 'Not Started', cls: 'text-muted', icon: Circle },
}

export default function SetupDashboard() {
  const navigate = useNavigate()
  const { portfolio } = usePortfolio()

  const pct = completion(portfolio)
  const canPublish = requiredComplete(portfolio)
  const firstIncomplete = SECTIONS.find((s) => !s.complete(portfolio))
  const remaining = SECTIONS.filter((s) => s.required && !s.complete(portfolio)).length

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header */}
      <header
        className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg/90 px-2 backdrop-blur-md"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <button
          onClick={() => navigate('/profile')}
          aria-label="Back to profile"
          className="tap flex h-11 items-center gap-1 rounded-control pl-1 pr-2 text-ink hover:bg-black/[0.04]"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-[13px] font-semibold">Profile</span>
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-ink">
          Build Your Portfolio
        </h1>
        <button
          onClick={() => navigate('/portfolio/preview')}
          aria-label="Preview"
          className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"
        >
          <Eye className="h-[20px] w-[20px]" strokeWidth={1.75} />
        </button>
      </header>

      <div className="fade-in no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-5">
        {/* Completion */}
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[13px] font-semibold text-ink">Portfolio completion</p>
              <p className="mt-0.5 text-[12.5px] text-muted">
                {canPublish
                  ? 'All required sections are complete — ready to publish.'
                  : `${remaining} required section${remaining === 1 ? '' : 's'} left to complete.`}
              </p>
            </div>
            <span className="font-serif text-[30px] leading-none text-brand">{pct}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {firstIncomplete && (
            <div className="mt-4">
              <PrimaryButton
                full
                onClick={() => navigate(`/portfolio/edit/${firstIncomplete.slug}`)}
              >
                Continue Setup
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* Checklist */}
        <p className="mb-2 mt-6 px-1 text-[12px] font-bold uppercase tracking-wide text-muted">
          Sections
        </p>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {SECTIONS.map((s) => {
            const st = sectionStatus(s, portfolio)
            const meta = statusMeta[st]
            const Icon = s.icon
            const StatusIcon = meta.icon
            return (
              <button
                key={s.slug}
                onClick={() => navigate(`/portfolio/edit/${s.slug}`)}
                className="tap flex items-center gap-3 px-3.5 py-3 text-left hover:bg-black/[0.015]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] font-semibold text-ink">
                      {s.title}
                    </p>
                    {s.required ? (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-brand">
                        Required
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[12px] text-muted">{s.description}</p>
                  <span className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${meta.cls}`}>
                    <StatusIcon className="h-3 w-3" strokeWidth={st === 'not-started' ? 1.5 : 3} />
                    {meta.label}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </button>
            )
          })}
        </div>

        <p className="mt-4 px-1 text-[11.5px] leading-relaxed text-muted">
          Required sections must be complete before publishing. All other sections
          are optional and can be added anytime.
        </p>
      </div>

      {/* Sticky footer */}
      <div
        className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md"
        style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
      >
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => navigate('/portfolio/preview')} className="min-w-[120px]">
            Preview
          </SecondaryButton>
          <PrimaryButton
            full
            disabled={!canPublish}
            onClick={() => navigate('/portfolio/preview?publish=1')}
          >
            {canPublish ? 'Publish Portfolio' : 'Complete required to publish'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
