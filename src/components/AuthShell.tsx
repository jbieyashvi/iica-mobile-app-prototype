import { ChevronLeft } from 'lucide-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: ReactNode
  showBack?: boolean
  onBack?: () => void
  /** sticky footer content (CTAs) rendered above the safe area */
  footer?: ReactNode
  wordmark?: boolean
}

export default function AuthShell({
  children,
  showBack = true,
  onBack,
  footer,
  wordmark,
}: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-bg">
      <header
        className="flex h-14 shrink-0 items-center justify-between px-2"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        {showBack ? (
          <button
            onClick={onBack ?? (() => navigate(-1))}
            aria-label="Back"
            className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}
        {wordmark && (
          <span className="font-serif text-[18px] tracking-tight text-ink">
            IICA
          </span>
        )}
        <span className="h-11 w-11" />
      </header>

      <div className="fade-in no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        {children}
      </div>

      {footer && (
        <div
          className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md"
          style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
