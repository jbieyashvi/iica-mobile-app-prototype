import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  full?: boolean
}

export default function SecondaryButton({
  children,
  full,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`tap inline-flex min-h-[44px] items-center justify-center gap-2 rounded-control border border-border bg-surface px-5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/30 disabled:opacity-50 ${
        full ? 'w-full' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}
