import { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="fade-in flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-brand">
        {icon}
      </div>
      <h2 className="mb-2 font-serif text-[24px] leading-tight text-ink">
        {title}
      </h2>
      <p className="mb-6 max-w-[280px] text-[14px] leading-relaxed text-muted">
        {description}
      </p>
      {action}
    </div>
  )
}
