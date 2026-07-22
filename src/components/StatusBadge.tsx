import { ReactNode } from 'react'

type Tone = 'brand' | 'success' | 'warning' | 'error' | 'neutral'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand-dark',
  success: 'bg-[#EAF3EE] text-success',
  warning: 'bg-[#F7F0E4] text-warning',
  error: 'bg-[#F7E9EA] text-error',
  neutral: 'bg-black/[0.05] text-muted',
}

interface Props {
  children: ReactNode
  tone?: Tone
  className?: string
}

export default function StatusBadge({
  children,
  tone = 'neutral',
  className = '',
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
