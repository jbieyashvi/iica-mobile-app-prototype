import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  /** disable horizontal padding when children manage their own (e.g. carousels) */
  bleed?: boolean
}

export default function PageContainer({
  children,
  className = '',
  bleed = false,
}: Props) {
  return (
    <div
      className={`fade-in mx-auto w-full ${bleed ? '' : 'px-[18px]'} ${className}`}
    >
      {children}
    </div>
  )
}
