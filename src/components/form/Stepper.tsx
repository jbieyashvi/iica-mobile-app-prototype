interface Props {
  steps: string[]
  current: number // 0-based
}

export default function Stepper({ steps, current }: Props) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= current ? 'bg-brand' : 'bg-border'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
        Step {current + 1} of {steps.length} · {steps[current]}
      </p>
    </div>
  )
}
