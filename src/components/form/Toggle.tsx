interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  id?: string
}

export default function Toggle({ checked, onChange, label, description, id }: Props) {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={fieldId} className="flex-1">
        <span className="block text-[13px] font-semibold text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[12px] leading-snug text-muted">
            {description}
          </span>
        )}
      </label>
      <button
        id={fieldId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${
          checked ? 'bg-brand' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-subtle transition-all ${
            checked ? 'left-[23px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  )
}
