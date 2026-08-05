import { ReactNode } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

// Shared collaboration header: safe Back + title + Global Search (always visible).
export default function CollabHeader({ title, fallback = '/collaborate', right }: { title: string; fallback?: string; right?: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const back = () => (location.key === 'default' ? navigate(fallback) : navigate(-1))
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="flex h-12 items-center gap-1">
        <button onClick={back} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
        <h1 className="flex-1 truncate font-serif text-[19px] text-ink">{title}</h1>
        {right}
        <button onClick={() => navigate('/search')} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Search className="h-5 w-5" /></button>
      </div>
    </header>
  )
}
