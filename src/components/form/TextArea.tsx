interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  maxLength: number
  placeholder?: string
  error?: string
  rows?: number
  id?: string
}

export default function TextArea({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  error,
  rows = 4,
  id,
}: Props) {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={fieldId} className="text-[13px] font-semibold text-ink">
          {label}
        </label>
        <span className="text-[12px] text-muted">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        id={fieldId}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`w-full resize-none rounded-control border bg-surface px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/70 focus:ring-2 focus:ring-brand/30 ${
          error ? 'border-error' : 'border-border focus:border-brand'
        }`}
      />
      {error && <p className="mt-1 text-[12px] font-medium text-error">{error}</p>}
    </div>
  )
}
