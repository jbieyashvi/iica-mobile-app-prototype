import { useRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  length?: number
}

export default function OtpInput({ value, onChange, length = 6 }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const chars = value.split('')

  const setChar = (i: number, c: string) => {
    const next = value.split('')
    next[i] = c
    onChange(next.join('').slice(0, length))
  }

  const handleChange = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return
    if (digits.length > 1) {
      // paste
      const merged = (value.slice(0, i) + digits).slice(0, length)
      onChange(merged)
      const focusAt = Math.min(merged.length, length - 1)
      refs.current[focusAt]?.focus()
      return
    }
    setChar(i, digits)
    if (i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (chars[i]) {
        setChar(i, '')
      } else if (i > 0) {
        refs.current[i - 1]?.focus()
        setChar(i - 1, '')
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1}`}
          maxLength={1}
          value={chars[i] ?? ''}
          autoFocus={i === 0}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className="h-14 w-full min-w-0 rounded-control border border-border bg-surface text-center text-[22px] font-semibold text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      ))}
    </div>
  )
}
