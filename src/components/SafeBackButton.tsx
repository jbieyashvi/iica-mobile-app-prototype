import { ChevronLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface Props {
  /** Route to use when there is no in-app history (direct load / refresh). */
  fallback?: string
  /** Custom handler (e.g. unsaved-changes guard). Overrides default back behaviour. */
  onBack?: () => void
  label?: string
  transparent?: boolean
  className?: string
}

// Reusable safe back control: uses real router history when it exists, otherwise
// a module fallback — so a directly-opened or refreshed screen is never a dead
// end and Back never lands on the current route or leaves the app.
export default function SafeBackButton({ fallback = '/home', onBack, label = 'Back', transparent, className = '' }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    if (onBack) return onBack()
    // location.key === 'default' means this was the first entry (no history stack).
    if (location.key === 'default') navigate(fallback)
    else navigate(-1)
  }

  return (
    <button
      onClick={goBack}
      aria-label={label}
      className={`tap flex h-11 w-11 items-center justify-center rounded-control ${
        transparent ? 'bg-black/30 text-white backdrop-blur-sm' : 'text-ink hover:bg-black/[0.04]'
      } ${className}`}
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  )
}
