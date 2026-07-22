import { useState } from 'react'
import { MoveHorizontal, Star, X, ExternalLink } from 'lucide-react'
import { ArtistMilestone } from '../../data/publicArtists'

export default function PublicTimeline({ items }: { items: ArtistMilestone[] }) {
  const [open, setOpen] = useState<ArtistMilestone | null>(null)
  if (items.length === 0) return null

  const sorted = [...items].sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0))
  const latest = sorted.length ? parseInt(sorted[sorted.length - 1].year) : 0

  return (
    <>
      <div className="mb-3 flex items-center gap-1.5 px-[18px] text-[12px] font-medium text-muted">
        <MoveHorizontal className="h-3.5 w-3.5" /> Swipe to explore
      </div>
      <div className="no-scrollbar overflow-x-auto px-[18px] pb-2">
        <div className="relative flex min-w-max items-stretch gap-4 pt-1 pr-8">
          <div className="absolute left-0 right-0 top-[92px] h-[2px] bg-border" />
          {sorted.map((m) => {
            const highlight = parseInt(m.year) === latest
            return (
              <button
                key={m.id}
                onClick={() => setOpen(m)}
                className="tap relative w-[158px] shrink-0 text-left"
              >
                <div
                  className={`h-[80px] overflow-hidden rounded-[10px] border ${
                    highlight ? 'border-brand' : 'border-border'
                  } bg-brand-soft`}
                >
                  {m.image ? (
                    <img src={m.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-brand-dark/60">
                      {m.category}
                    </div>
                  )}
                </div>
                <div className="relative flex justify-center py-2">
                  <span
                    className={`z-10 h-3 w-3 rounded-full border-2 border-bg ${
                      highlight ? 'bg-brand' : 'bg-muted'
                    }`}
                  />
                </div>
                <p className={`text-center font-serif text-[16px] leading-none ${highlight ? 'text-brand' : 'text-ink'}`}>
                  {m.year}
                </p>
                <p className="mt-1 line-clamp-2 text-center text-[11.5px] leading-snug text-ink">
                  {m.title}
                </p>
                {highlight && (
                  <span className="mt-1 flex items-center justify-center gap-0.5 text-[10px] font-semibold text-brand">
                    <Star className="h-2.5 w-2.5 fill-brand" /> Latest
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {open && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setOpen(null)} className="absolute inset-0 bg-ink/40" />
          <div
            className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface"
            style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
          >
            {open.image && (
              <div className="h-40 w-full overflow-hidden rounded-t-[20px] bg-brand-soft">
                <img src={open.image} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <button
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/50 text-white backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                {open.year} · {open.category}
              </span>
              <h3 className="mt-1 font-serif text-[24px] leading-tight text-ink">{open.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{open.description}</p>
              {open.link && (
                <a
                  href={open.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand"
                >
                  Open link <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
