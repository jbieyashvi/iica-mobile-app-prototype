import { useEffect, useRef, useState } from 'react'

const DISCIPLINES = ['Music', 'Dance', 'Theatre', 'Visual Arts', 'Film', 'Photography', 'Literature', 'Cultural Education']
const MESSAGES = [
  'Reading your creative profile',
  'Comparing collaboration intent',
  'Finding complementary skills',
  'Considering location and availability',
  'Preparing your recommendations',
]

export default function MatchWheel({ onDone, durationMs = 2600 }: { onDone: () => void; durationMs?: number }) {
  const [msg, setMsg] = useState(0)
  const [progress, setProgress] = useState(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const done = useRef(false)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      setProgress(p)
      setMsg(Math.min(MESSAGES.length - 1, Math.floor(p * MESSAGES.length)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else if (!done.current) { done.current = true; setTimeout(onDone, 300) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, onDone])

  const R = 92
  const cx = 110
  const cy = 110

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* rotating ring of disciplines */}
        <div className={reduced ? '' : 'collab-wheel'} style={{ width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 220 220" aria-hidden>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E8E4E6" strokeWidth="1" />
            {DISCIPLINES.map((d, i) => {
              const a = (i / DISCIPLINES.length) * 2 * Math.PI - Math.PI / 2
              const x = cx + R * Math.cos(a)
              const y = cy + R * Math.sin(a)
              return (
                <g key={d}>
                  <circle cx={x} cy={y} r="3" fill="#9D2567" opacity={0.35 + 0.65 * ((i + progress * 8) % DISCIPLINES.length === i ? 1 : 0.3)} />
                  <text x={x} y={y} dy={y > cy ? 16 : -8} textAnchor="middle" className="fill-muted" style={{ fontSize: 9, fontWeight: 600 }}>{d}</text>
                </g>
              )
            })}
          </svg>
        </div>
        {/* progress arc */}
        <svg width="220" height="220" viewBox="0 0 220 220" className="absolute inset-0" aria-hidden>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#9D2567" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - progress)}
            transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
        </svg>
        {/* center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="font-serif text-[17px] leading-tight text-ink">Finding your creative matches</p>
          <p className="mt-1 text-[11px] font-semibold text-brand">{Math.round(progress * 100)}%</p>
        </div>
      </div>

      <p className="mt-6 h-5 text-[13px] font-medium text-muted transition-opacity">{MESSAGES[msg]}</p>

      {/* non-animated progress alternative (always present, primary cue for reduced motion) */}
      <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}
