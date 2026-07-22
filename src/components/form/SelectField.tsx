import { ChevronDown } from 'lucide-react'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  error?: string
  optional?: boolean
  id?: string
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  error,
  optional,
  id,
}: Props) {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink"
      >
        {label}
        {optional && (
          <span className="text-[12px] font-normal text-muted">Optional</span>
        )}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`min-h-[46px] w-full appearance-none rounded-control border bg-surface px-3 pr-10 text-[15px] outline-none transition-colors focus:ring-2 focus:ring-brand/30 ${
            value ? 'text-ink' : 'text-muted/70'
          } ${error ? 'border-error' : 'border-border focus:border-brand'}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      </div>
      {error && <p className="mt-1 text-[12px] font-medium text-error">{error}</p>}
    </div>
  )
}
