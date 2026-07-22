export default function ScoreBar({ label, score, weight, reason }: { label: string; score: number; weight: number; reason: string }) {
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between">
        <p className="text-[13.5px] font-semibold text-ink">{label}</p>
        <p className="text-[12px] text-muted"><span className="font-bold text-ink">{score}</span> · weight {weight}%</p>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-brand" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{reason}</p>
    </div>
  )
}
