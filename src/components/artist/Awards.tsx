import { useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, ChevronRight, X, ExternalLink } from 'lucide-react'
import { ArtistAward } from '../../data/publicArtists'
import StatusBadge from '../StatusBadge'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function hasDetails(a: ArtistAward): boolean {
  return !!(a.description || a.image || a.link || a.category)
}

// Reusable public Awards section: top 3 by default, inline View All / Show less.
// Hides itself when there are no awards.
export default function Awards({ awards }: { awards: ArtistAward[] }) {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState<ArtistAward | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Featured first, then most recent year, then newest-first.
  const sorted = useMemo(
    () => [...awards].sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
      return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0)
    }),
    [awards],
  )

  if (sorted.length === 0) return null

  const total = sorted.length
  const hasMore = total > 3
  const visible = expanded ? sorted : sorted.slice(0, 3)

  const collapse = () => {
    setExpanded(false)
    // Keep the toggle in view — never jump to the top of the profile.
    requestAnimationFrame(() => toggleRef.current?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' }))
  }

  return (
    <section className="px-[18px] pt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-[19px] text-ink">Awards &amp; Recognition</h2>
      </div>

      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
        {visible.map((a, i) => (
          <Row key={a.id} a={a} isNew={expanded && i >= 3} onOpen={hasDetails(a) ? () => setDetail(a) : undefined} />
        ))}
      </div>

      {hasMore && (
        <button
          ref={toggleRef}
          onClick={() => (expanded ? collapse() : setExpanded(true))}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse awards' : `View all ${total} awards`}
          className="tap mt-2.5 flex min-h-[44px] items-center gap-1 rounded-control text-[13px] font-semibold text-brand hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          {expanded ? <>Show less <ChevronUp className="h-4 w-4" /></> : <>View all {total} awards <ChevronDown className="h-4 w-4" /></>}
        </button>
      )}

      {detail && <AwardSheet a={detail} onClose={() => setDetail(null)} />}
    </section>
  )
}

function Row({ a, isNew, onOpen }: { a: ArtistAward; isNew: boolean; onOpen?: () => void }) {
  const reduced = prefersReducedMotion()
  const sub = [a.org, a.category, a.project].filter(Boolean).join(' · ')
  const inner = (
    <>
      <span className="w-9 shrink-0 font-serif text-[15px] text-brand">{a.year}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-ink">{a.name}</p>
        <p className="truncate text-[12px] text-muted">{sub}</p>
      </div>
      <StatusBadge tone="brand">{a.recognitionType}</StatusBadge>
      {onOpen && <ChevronRight className="h-4 w-4 shrink-0 text-muted" />}
    </>
  )
  const cls = `flex items-center gap-3 px-3.5 py-3 ${isNew && !reduced ? 'fade-in' : ''}`
  if (onOpen) {
    return (
      <button onClick={onOpen} aria-label={`${a.name} details`} className={`tap ${cls} w-full text-left hover:bg-black/[0.015]`}>
        {inner}
      </button>
    )
  }
  return <div className={cls}>{inner}</div>
}

function AwardSheet({ a, onClose }: { a: ArtistAward; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true" aria-label={`${a.name} award details`}>
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative max-h-[85%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <button aria-label="Close" onClick={onClose} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        <div className="flex items-center gap-2">
          <span className="font-serif text-[15px] text-brand">{a.year}</span>
          <StatusBadge tone="brand">{a.recognitionType}</StatusBadge>
        </div>
        <h2 className="mt-1.5 font-serif text-[22px] leading-tight text-ink">{a.name}</h2>
        <p className="mt-0.5 text-[13px] text-muted">{a.org}</p>

        {a.image && (
          <div className="mt-3 overflow-hidden rounded-card border border-border">
            <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mt-3 flex flex-col divide-y divide-border rounded-card border border-border bg-bg">
          {a.category && <Meta label="Category" value={a.category} />}
          {a.project && <Meta label="Project" value={a.project} />}
        </div>

        {a.description && <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{a.description}</p>}

        {a.link && (
          <a href={a.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-brand">
            <ExternalLink className="h-4 w-4" /> View verification
          </a>
        )}
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5">
      <span className="text-[12.5px] text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-ink">{value}</span>
    </div>
  )
}
