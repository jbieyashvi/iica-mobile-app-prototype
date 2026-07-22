import { ReactNode, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Check, Loader2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'

interface Props {
  title: string
  children: ReactNode
  /** increments on every edit so the shell can show autosave feedback + track dirty */
  revision: number
  onSaveContinue: () => void
  saveLabel?: string
  showPreview?: boolean
}

export default function EditorShell({
  title,
  children,
  revision,
  onSaveContinue,
  saveLabel = 'Save & Continue',
  showPreview = true,
}: Props) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const savedRev = useRef(0)
  const [dirty, setDirty] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)

  useEffect(() => {
    if (revision === 0) return
    setDirty(revision > savedRev.current)
    setStatus('saving')
    const t = setTimeout(() => setStatus('saved'), 600)
    return () => clearTimeout(t)
  }, [revision])

  const markSaved = () => {
    savedRev.current = revision
    setDirty(false)
    setStatus('saved')
  }

  const back = () => {
    if (dirty) setConfirmExit(true)
    else navigate('/portfolio/setup')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header */}
      <header
        className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg/90 px-2 backdrop-blur-md"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <button
          onClick={back}
          aria-label="Back"
          className="tap flex h-11 items-center gap-1 rounded-control pl-1 pr-2 text-ink hover:bg-black/[0.04]"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-[13px] font-semibold">Setup</span>
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 truncate text-[15px] font-bold text-ink">
          {title}
        </h1>
        {showPreview ? (
          <button
            onClick={() => navigate('/portfolio/preview')}
            aria-label="Preview"
            className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"
          >
            <Eye className="h-[20px] w-[20px]" strokeWidth={1.75} />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}
      </header>

      {/* Autosave status */}
      <div className="flex h-7 shrink-0 items-center px-[22px]">
        {status === 'saving' && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted">
            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
          </span>
        )}
        {status === 'saved' && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-success">
            <Check className="h-3 w-3" /> Saved just now
          </span>
        )}
        {status === 'idle' && (
          <span className="text-[11.5px] text-muted">Changes save automatically</span>
        )}
      </div>

      {/* Body */}
      <div className="fade-in no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        {children}
      </div>

      {/* Sticky footer */}
      <div
        className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md"
        style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
      >
        <div className="flex gap-2.5">
          <SecondaryButton onClick={markSaved} className="min-w-[110px]">
            Save Draft
          </SecondaryButton>
          <PrimaryButton
            full
            onClick={() => {
              markSaved()
              onSaveContinue()
            }}
          >
            {saveLabel}
          </PrimaryButton>
        </div>
      </div>

      {/* Exit confirm */}
      {confirmExit && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={() => setConfirmExit(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5"
            style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
          >
            <h3 className="font-serif text-[22px] text-ink">Leave this section?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Your changes are saved automatically, so nothing will be lost.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <PrimaryButton
                full
                onClick={() => {
                  markSaved()
                  navigate('/portfolio/setup')
                }}
              >
                Save & Exit
              </PrimaryButton>
              <button
                onClick={() => setConfirmExit(false)}
                className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
