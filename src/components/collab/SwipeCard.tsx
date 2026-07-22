import { useRef, useState } from 'react'
import { BadgeCheck, MapPin, Info, Check, X } from 'lucide-react'
import { Candidate } from '../../collab/types'

interface Props {
  candidate: Candidate
  onDecision: (action: 'interested' | 'skipped') => void
  onDetails: () => void
}

const THRESHOLD = 90

// Lightweight pointer-drag swipe card (no external dependency).
export default function SwipeCard({ candidate, onDecision, onDetails }: Props) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef<number | null>(null)
  const moved = useRef(false)

  const down = (x: number) => { start.current = x; setDragging(true); moved.current = false }
  const move = (x: number) => {
    if (start.current === null) return
    const d = x - start.current
    if (Math.abs(d) > 4) moved.current = true
    setDx(d)
  }
  const up = () => {
    if (start.current === null) return
    if (dx > THRESHOLD) { setDx(500); setTimeout(() => onDecision('interested'), 160) }
    else if (dx < -THRESHOLD) { setDx(-500); setTimeout(() => onDecision('skipped'), 160) }
    else setDx(0)
    start.current = null
    setDragging(false)
  }

  const rot = dx / 22
  const interestOpacity = Math.max(0, Math.min(1, dx / THRESHOLD))
  const skipOpacity = Math.max(0, Math.min(1, -dx / THRESHOLD))

  const c = candidate
  return (
    <div
      className="absolute inset-0 touch-none select-none"
      style={{ transform: `translateX(${dx}px) rotate(${rot}deg)`, transition: dragging ? 'none' : 'transform 0.25s ease' }}
      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); down(e.clientX) }}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div className="relative h-full overflow-hidden rounded-card border border-border bg-surface">
        <div className="relative h-[52%] w-full overflow-hidden bg-brand-soft">
          <img src={c.photo} alt="" draggable={false} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[13px] font-bold text-brand shadow-subtle">{c.matchPercent}% match</span>
          {/* decision overlays */}
          <span className="absolute left-3 top-3 rounded-md border-2 border-success px-2 py-0.5 text-[13px] font-bold uppercase text-success" style={{ opacity: interestOpacity, background: 'rgba(255,255,255,.9)' }}>Interested</span>
          <span className="absolute left-3 top-3 rounded-md border-2 border-error px-2 py-0.5 text-[13px] font-bold uppercase text-error" style={{ opacity: skipOpacity, background: 'rgba(255,255,255,.9)' }}>Skip</span>
        </div>

        <div className="flex h-[48%] flex-col p-4">
          <div className="flex items-center gap-1.5">
            <h2 className="font-serif text-[22px] leading-tight text-ink">{c.name}</h2>
            {c.verified && <BadgeCheck className="h-5 w-5 text-brand" />}
          </div>
          <p className="text-[13px] text-muted">{c.headline}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted"><MapPin className="h-3.5 w-3.5" /> {c.location.split(',')[0]} · {c.primaryDomain}</p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {c.skills.slice(0, 3).map((s) => <span key={s} className="rounded-[7px] border border-border bg-bg px-2 py-0.5 text-[11px] font-medium text-ink">{s}</span>)}
          </div>

          <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{c.rationale}</p>

          <button
            onClick={(e) => { e.stopPropagation(); if (!moved.current) onDetails() }}
            className="tap mt-auto flex items-center justify-center gap-1.5 rounded-control border border-border py-2 text-[13px] font-semibold text-ink"
          >
            <Info className="h-4 w-4" /> View Details
          </button>
        </div>
      </div>

      {/* corner cues for accessibility */}
      <span className="sr-only">Swipe right for interested, left to skip. {c.name}, {c.matchPercent}% match.</span>
      <div className="pointer-events-none absolute -bottom-0 left-0 right-0 flex justify-between px-6 opacity-0"><Check /><X /></div>
    </div>
  )
}
