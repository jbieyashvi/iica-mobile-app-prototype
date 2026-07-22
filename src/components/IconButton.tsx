import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  dot?: boolean
  label: string
}

export default function IconButton({
  children,
  dot,
  label,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      aria-label={label}
      {...rest}
      className={`tap relative inline-flex h-11 w-11 items-center justify-center rounded-control text-ink transition-colors hover:bg-black/[0.04] ${className}`}
    >
      {children}
      {dot && (
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand ring-2 ring-surface" />
      )}
    </button>
  )
}
