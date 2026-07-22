import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, X } from 'lucide-react'
import { useAuth } from '../state/AuthContext'
import { useSavedArtists } from '../state/useSavedArtists'
import PrimaryButton from './PrimaryButton'

const PENDING = 'iica_pending_save'

// Save handler with a guest account-gate. Preserves the attempted item across sign-in.
export function useSaveGate() {
  const { state } = useAuth()
  const { toggle, isSaved } = useSavedArtists()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const toggledRef = useRef(false)

  // After sign-in, apply any pending save once.
  useEffect(() => {
    if (state.authed && !toggledRef.current) {
      const pending = localStorage.getItem(PENDING)
      if (pending) {
        toggledRef.current = true
        localStorage.removeItem(PENDING)
        if (!isSaved(pending)) toggle(pending)
      }
    }
  }, [state.authed, isSaved, toggle])

  const save = (key: string) => {
    if (!state.authed) {
      localStorage.setItem(PENDING, key)
      setOpen(true)
      return
    }
    toggle(key)
  }

  const sheet = open ? (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <button aria-label="Close" onClick={() => setOpen(false)} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Bookmark className="h-6 w-6" strokeWidth={1.75} /></div>
        <h2 className="font-serif text-[23px] leading-tight text-ink">Save to your collection</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Create a free account to save artists, events and content. We'll keep this item for you.</p>
        <div className="mt-5 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => { setOpen(false); navigate('/signup') }}>Create an Account</PrimaryButton>
          <button onClick={() => { setOpen(false); navigate('/login') }} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Sign In</button>
        </div>
      </div>
    </div>
  ) : null

  return { save, isSaved, sheet }
}
