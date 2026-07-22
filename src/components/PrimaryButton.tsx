import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  full?: boolean
}

export default function PrimaryButton({
  children,
  full,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`tap inline-flex min-h-[44px] items-center justify-center gap-2 rounded-control bg-brand px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50 ${
        full ? 'w-full' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}
