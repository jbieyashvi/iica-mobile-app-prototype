import { Check } from 'lucide-react'
import { ReactNode } from 'react'

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  children: ReactNode
  error?: boolean
  id?: string
}

export default function Checkbox({ checked, onChange, children, error, id }: Props) {
  const fieldId = id ?? 'cb-' + Math.random().toString(36).slice(2, 7)
  return (
    <label
      htmlFor={fieldId}
      className="flex cursor-pointer items-start gap-3 py-1"
    >
      <button
        type="button"
        id={fieldId}
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`tap mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${
          checked
            ? 'border-brand bg-brand text-white'
            : error
              ? 'border-error bg-surface'
              : 'border-border bg-surface'
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      <span className="text-[13px] leading-relaxed text-muted">{children}</span>
    </label>
  )
}
