import { useState } from 'react'
import { Star, Copy, Flag, Check, EyeOff, Eye } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import Avatar from '../../../components/Avatar'
import { usePortfolio } from '../../../state/PortfolioContext'
import { mockTestimonials } from '../../../portfolio/mockPortfolio'
import { useEditorNav } from './common'

const PENDING = 2

export default function TestimonialsEditor() {
  const { portfolio, setSection, patch } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('testimonials')
  const [toast, setToast] = useState('')

  const approved = mockTestimonials.filter((t) => t.status === 'approved')
  const avg =
    approved.reduce((s, t) => s + t.rating, 0) / (approved.length || 1)

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1800)
  }

  const toggleFeatured = (id: string) => {
    const cur = portfolio.featuredTestimonials
    if (cur.includes(id)) {
      setSection('featuredTestimonials', cur.filter((x) => x !== id))
    } else {
      if (cur.length >= 3) return flash('You can feature up to 3 reviews')
      setSection('featuredTestimonials', [...cur, id])
    }
    bump()
  }

  const toggleHidden = (id: string) => {
    const cur = portfolio.hiddenTestimonials
    patch({
      hiddenTestimonials: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
      featuredTestimonials: portfolio.featuredTestimonials.filter((x) => x !== id),
    })
    bump()
  }

  const report = (id: string) => {
    if (portfolio.reportedTestimonials.includes(id)) return
    setSection('reportedTestimonials', [...portfolio.reportedTestimonials, id])
    flash('Review reported for moderation')
    bump()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://iica.app/artist/${portfolio.slug}/review`)
    } catch {
      /* ignore */
    }
    flash('Review link copied')
  }

  return (
    <EditorShell title="Testimonials" revision={rev} onSaveContinue={goNext} saveLabel="Done">
      {/* Summary */}
      <div className="flex gap-2.5">
        <Stat label="Average rating" value={avg.toFixed(1)} icon={<Star className="h-3.5 w-3.5 fill-brand text-brand" />} />
        <Stat label="Approved" value={String(approved.length)} />
        <Stat label="Pending" value={String(PENDING)} />
      </div>

      <div className="mt-4 rounded-card border border-border bg-surface p-4">
        <p className="text-[13px] font-semibold text-ink">Request a review</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
          Share this link — guests and members can submit reviews from your
          published portfolio.
        </p>
        <button
          onClick={copyLink}
          className="tap mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-control border border-border bg-bg text-[13px] font-semibold text-ink hover:border-ink/25"
        >
          <Copy className="h-4 w-4" /> Copy review link
        </button>
      </div>

      <p className="mb-2 mt-6 text-[13px] font-semibold text-ink">
        Approved reviews
        <span className="ml-1.5 font-normal text-muted">
          · feature up to 3 ({portfolio.featuredTestimonials.length}/3)
        </span>
      </p>

      <div className="flex flex-col gap-3">
        {approved.map((t) => {
          const featured = portfolio.featuredTestimonials.includes(t.id)
          const hidden = portfolio.hiddenTestimonials.includes(t.id)
          const reported = portfolio.reportedTestimonials.includes(t.id)
          return (
            <div key={t.id} className={`rounded-card border p-3.5 ${featured ? 'border-brand bg-brand-soft/40' : 'border-border bg-surface'}`}>
              <div className="flex items-center gap-2.5">
                <Avatar name={t.author} src={t.avatar} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{t.author}</p>
                  <p className="truncate text-[12px] text-muted">{t.role}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-brand text-brand" />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">“{t.text}”</p>
              {reported && (
                <p className="mt-2 text-[11.5px] font-medium text-warning">Reported — under review</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(t.id)}
                  disabled={hidden}
                  className={`tap flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-control border text-[12px] font-semibold disabled:opacity-40 ${
                    featured ? 'border-brand bg-brand text-white' : 'border-border bg-bg text-ink'
                  }`}
                >
                  {featured ? <Check className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                  {featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => toggleHidden(t.id)}
                  aria-label={hidden ? 'Unhide' : 'Hide'}
                  className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border bg-bg text-muted hover:text-ink"
                >
                  {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => report(t.id)}
                  aria-label="Report"
                  className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border bg-bg text-muted hover:text-error"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-5 rounded-control bg-surface px-3.5 py-3 text-[11.5px] leading-relaxed text-muted ring-1 ring-border">
        You can feature, hide or report reviews, but you can't write reviews
        about yourself or delete reviews others have submitted.
      </p>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">
            {toast}
          </span>
        </div>
      )}
    </EditorShell>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex-1 rounded-card border border-border bg-surface px-3 py-2.5 text-center">
      <p className="flex items-center justify-center gap-1 font-serif text-[20px] leading-none text-ink">
        {icon}
        {value}
      </p>
      <p className="mt-1 text-[10.5px] font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  )
}
