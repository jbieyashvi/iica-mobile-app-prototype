export default function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px w-full bg-border" />
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[12px] font-medium text-muted">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
