import { useRef, useState } from 'react'
import { MapPin, Info, Bookmark } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import type { MatchCreator, CollaborationMatch, MatchLabel } from '../../aicollab/types'

interface Props {
  creator: MatchCreator
  match: CollaborationMatch
  saved: boolean
  onSkip: () => void
  onInterest: () => void
  onView: () => void
  onToggleSave: () => void
  reducedMotion?: boolean
}

const THRESHOLD = 90
const labelTone = (l: MatchLabel) => (l === 'Strong Match' ? 'success' : l === 'Good Match' ? 'brand' : 'neutral')

// Pointer-drag creator card for AI collaboration matches. Left = skip,
// right = interested. Gestures never scroll the page (touch-none). When
// reduced-motion is on, the card doesn't drag — the Skip / Interested buttons
// (rendered by the parent) do the same job.
export default function AiSwipeCard({ creator: c, match, saved, onSkip, onInterest, onView, onToggleSave, reducedMotion }: Props) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef<number | null>(null)
  const moved = useRef(false)

  const down = (x: number) => { if (reducedMotion) return; start.current = x; setDragging(true); moved.current = false }
  const move = (x: number) => {
    if (start.current === null) return
    const d = x - start.current
    if (Math.abs(d) > 4) moved.current = true
    setDx(d)
  }
  const up = () => {
    if (start.current === null) return
    if (dx > THRESHOLD) { setDx(460); setTimeout(onInterest, 150) }
    else if (dx < -THRESHOLD) { setDx(-460); setTimeout(onSkip, 150) }
    else setDx(0)
    start.current = null; setDragging(false)
  }

  const rot = reducedMotion ? 0 : dx / 26
  const interestOpacity = Math.max(0, Math.min(1, dx / THRESHOLD))
  const skipOpacity = Math.max(0, Math.min(1, -dx / THRESHOLD))

  return (
    <div
      className="absolute inset-0 touch-none select-none"
      style={{ transform: `translateX(${dx}px) rotate(${rot}deg)`, transition: dragging ? 'none' : 'transform 0.25s ease' }}
      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); down(e.clientX) }}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-subtle">
        <div className="relative h-[50%] w-full shrink-0 overflow-hidden bg-brand-soft">
          <img src={c.photo} alt={`${c.name} — ${c.category}`} draggable={false} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute right-3 top-3"><StatusBadge tone={labelTone(match.label)}>{match.label}</StatusBadge></span>
          <span className="absolute left-3 top-3 rounded-md border-2 border-success px-2 py-0.5 text-[13px] font-bold uppercase text-success" style={{ opacity: interestOpacity, background: 'rgba(255,255,255,.9)' }}>Interested</span>
          <span className="absolute right-3 bottom-3 rounded-md border-2 border-error px-2 py-0.5 text-[13px] font-bold uppercase text-error" style={{ opacity: skipOpacity, background: 'rgba(255,255,255,.9)' }}>Skip</span>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-3.5">
          <h2 className="font-serif text-[21px] leading-tight text-ink">{c.name}</h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[12px] text-muted">
            <span className="font-semibold text-brand-dark">{c.category}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5" /> {c.city}, {c.country}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {[c.primaryDomain, ...c.genres, ...c.skills].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 3).map((s) => (
              <span key={s} className="rounded-[7px] border border-border bg-bg px-2 py-0.5 text-[11px] font-medium text-ink">{s}</span>
            ))}
          </div>
          <p className="mt-1.5 line-clamp-1 text-[12.5px] text-muted">{c.headline}</p>
          <p className="mt-1.5 line-clamp-2 rounded-control bg-brand-soft px-2.5 py-1.5 text-[12px] leading-relaxed text-brand-dark">{match.reasons.join(' · ')}</p>
          <div className="mt-auto flex items-center gap-2 pt-2.5">
            <button
              onClick={(e) => { e.stopPropagation(); if (!moved.current) onToggleSave() }}
              aria-label={saved ? 'Remove from saved' : 'Save creator'}
              aria-pressed={saved}
              className={`tap flex h-[38px] w-[42px] shrink-0 items-center justify-center rounded-control border transition-colors ${saved ? 'border-brand bg-brand-soft text-brand' : 'border-border text-muted hover:border-ink/25 hover:text-ink'}`}
            >
              <Bookmark className="h-[18px] w-[18px]" fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); if (!moved.current) onView() }}
              className="tap flex flex-1 items-center justify-center gap-1.5 rounded-control border border-border py-2 text-[13px] font-semibold text-ink hover:border-ink/25"
            >
              <Info className="h-4 w-4" /> View Profile
            </button>
          </div>
        </div>
      </div>
      <span className="sr-only">Swipe right to show interest, left to skip. {c.name}, {match.label}.</span>
    </div>
  )
}
