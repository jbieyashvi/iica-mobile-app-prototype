// Step indicator for the content-create flow. Artist Update skips "Upload".
const FULL = ['Type', 'Upload', 'Details', 'Settings', 'Preview']
const UPDATE = ['Type', 'Details', 'Settings', 'Preview']

export default function CreateProgress({ step, isUpdate }: { step: string; isUpdate?: boolean }) {
  const steps = isUpdate ? UPDATE : FULL
  const idx = steps.indexOf(step)
  return (
    <div className="flex items-center gap-1.5 px-[18px] pb-2 pt-1">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 flex-col gap-1">
          <span className={`h-1 rounded-full transition-colors ${i <= idx ? 'bg-brand' : 'bg-border'}`} />
          <span className={`text-[9.5px] font-semibold uppercase tracking-wide ${i === idx ? 'text-brand' : 'text-muted'}`}>{s}</span>
        </div>
      ))}
    </div>
  )
}
