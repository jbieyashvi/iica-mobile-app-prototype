import { ChevronLeft } from 'lucide-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title?: string
  right?: ReactNode
  transparent?: boolean
}

export default function BackHeader({ title, right, transparent }: Props) {
  const navigate = useNavigate()

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
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className={`tap flex h-11 w-11 items-center justify-center rounded-control ${
            transparent
              ? 'bg-black/30 text-white backdrop-blur-sm'
              : 'text-ink hover:bg-black/[0.04]'
          }`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
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
