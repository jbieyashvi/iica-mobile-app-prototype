import { InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  optional?: boolean
}

export default function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  type = 'text',
  id,
  ...rest
}: Props) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const inputType = isPassword ? (show ? 'text' : 'password') : type

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
        <input
          id={fieldId}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`min-h-[46px] w-full rounded-control border bg-surface px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:ring-2 focus:ring-brand/30 ${
            error ? 'border-error' : 'border-border focus:border-brand'
          } ${isPassword ? 'pr-11' : ''}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((s) => !s)}
            className="tap absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-[12px] font-medium text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
