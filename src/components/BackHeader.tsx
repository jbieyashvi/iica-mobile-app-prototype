import { ReactNode } from 'react'
import SafeBackButton from './SafeBackButton'

interface Props {
  title?: string
  right?: ReactNode
  transparent?: boolean
  /** Where to go when there is no in-app history to go back to (direct load / refresh). */
  fallback?: string
  /** Custom back handler (e.g. unsaved-changes guard). Overrides default behaviour. */
  onBack?: () => void
}

export default function BackHeader({ title, right, transparent, fallback = '/home', onBack }: Props) {
  return (
    <header
      className={`sticky top-0 z-20 ${
        transparent
          ? 'bg-transparent'
          : 'border-b border-border bg-bg/85 backdrop-blur-md'
      }`}
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="flex h-14 items-center justify-between px-2">
        <SafeBackButton fallback={fallback} onBack={onBack} transparent={transparent} />
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-ink">
            {title}
          </h1>
        )}
        <div className="flex h-11 min-w-[44px] items-center justify-end pr-1">
          {right}
        </div>
      </div>
    </header>
  )
}
