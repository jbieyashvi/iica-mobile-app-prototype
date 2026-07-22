import { Check } from 'lucide-react'

interface Props {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  error?: string
}

export default function ChipSelect({
  label,
  options,
  selected,
  onToggle,
  error,
}: Props) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o)}
              className={`tap inline-flex min-h-[40px] items-center gap-1.5 rounded-control border px-3 text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                active
                  ? 'border-brand bg-brand-soft text-brand-dark'
                  : 'border-border bg-surface text-muted hover:border-ink/25'
              }`}
            >
              {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              {o}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1.5 text-[12px] font-medium text-error">{error}</p>}
    </div>
  )
}
