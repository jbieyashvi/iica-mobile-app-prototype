import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'

interface Props {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  suggestions?: string[]
  placeholder?: string
  error?: string
}

export default function TagInput({
  label,
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add and press Enter',
  error,
}: Props) {
  const [draft, setDraft] = useState('')

  const add = (v: string) => {
    const t = v.trim()
    if (t && !value.includes(t)) onChange([...value, t])
    setDraft('')
  }
  const remove = (t: string) => onChange(value.filter((x) => x !== t))

  const open = suggestions.filter((s) => !value.includes(s))

  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-ink">{label}</p>

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-[7px] border border-border bg-surface px-2.5 py-1 text-[12.5px] font-medium text-ink"
            >
              {t}
              <button
                type="button"
                aria-label={`Remove ${t}`}
                onClick={() => remove(t)}
                className="tap text-muted hover:text-error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(draft)
            }
          }}
          placeholder={placeholder}
          className={`min-h-[44px] flex-1 rounded-control border bg-surface px-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-brand/30 ${
            error ? 'border-error' : 'border-border focus:border-brand'
          }`}
        />
        <button
          type="button"
          aria-label="Add"
          onClick={() => add(draft)}
          className="tap flex h-[44px] w-[44px] items-center justify-center rounded-control border border-border bg-surface text-ink hover:border-ink/25"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {open.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {open.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="tap inline-flex items-center gap-1 rounded-[7px] border border-dashed border-border px-2.5 py-1 text-[12px] font-medium text-muted hover:border-brand hover:text-brand-dark"
            >
              <Check className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1.5 text-[12px] font-medium text-error">{error}</p>}
    </div>
  )
}
