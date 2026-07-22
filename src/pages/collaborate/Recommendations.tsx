import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, X, Undo2, Bookmark, Heart, Info, Send, PenLine, Sparkles } from 'lucide-react'
import SwipeCard from '../../components/collab/SwipeCard'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useCollab } from '../../state/CollabContext'
import { getCandidate } from '../../collab/mockCollab'

export default function Recommendations() {
  const navigate = useNavigate()
  const collab = useCollab()
  const { session } = collab
  const [sheetId, setSheetId] = useState<string | null>(null)

  const current = collab.currentCandidate()
  const total = session.queue.length
  const position = session.index + 1
  const finished = !current

  // No session yet
  if (total === 0) {
    return (
      <Empty
        title="No recommendations yet"
        body="Run AI matching to discover collaborators."
        cta="Find Collaborators"
        onCta={() => navigate('/collaborate/discover')}
        onBack={() => navigate('/collaborate')}
      />
    )
  }

  const decide = (action: 'interested' | 'skipped') => {
    const id = session.queue[session.index]
    collab.swipe(action)
    if (action === 'interested') setSheetId(id)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center justify-between px-2" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={() => navigate('/collaborate')} aria-label="Back" className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
        {!finished && <span className="text-[13px] font-semibold text-muted">{position} of {total}</span>}
        <button onClick={collab.undo} disabled={session.history.length === 0} aria-label="Undo" className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04] disabled:opacity-30"><Undo2 className="h-5 w-5" /></button>
      </header>

      {finished ? (
        <SummaryView collab={collab} navigate={navigate} />
      ) : (
        <>
          {/* progress */}
          <div className="px-[18px]">
            <div className="h-1 w-full overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(session.index / total) * 100}%` }} /></div>
          </div>

          {/* card area */}
          <div className="relative flex-1 px-[18px] py-4">
            {/* next card peeking */}
            {session.queue[session.index + 1] && (
              <div className="absolute inset-x-[18px] inset-y-4 -z-0 scale-[0.96] opacity-60">
                <div className="h-full overflow-hidden rounded-card border border-border bg-surface">
                  <div className="h-[52%] w-full overflow-hidden bg-brand-soft"><img src={getCandidate(session.queue[session.index + 1])!.photo} alt="" className="h-full w-full object-cover" /></div>
                </div>
              </div>
            )}
            {current && (
              <div className="relative z-10 h-full">
                <SwipeCard candidate={current} onDecision={decide} onDetails={() => navigate(`/collaborate/match/${current.id}`)} />
              </div>
            )}

            {/* instructions overlay */}
            {!session.instructionsDismissed && (
              <div className="pointer-events-none absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 rounded-card bg-ink/80 px-4 py-3 text-center text-white backdrop-blur-sm">
                <p className="text-[13px] font-semibold">Swipe right to collaborate</p>
                <p className="text-[13px]">Swipe left to skip · Tap to learn more</p>
              </div>
            )}
          </div>

          {/* buttons */}
          <div className="shrink-0 px-[18px] pb-[calc(14px+var(--safe-bottom))] pt-2">
            <div className="flex items-center justify-center gap-3">
              <IconBtn label="Skip" onClick={() => decide('skipped')} className="text-error"><X className="h-6 w-6" /></IconBtn>
              <IconBtn label="Save for later" onClick={() => current && collab.saveForLater(current.id)} className="text-ink" small><Bookmark className="h-5 w-5" /></IconBtn>
              <IconBtn label="Details" onClick={() => current && navigate(`/collaborate/match/${current.id}`)} className="text-ink" small><Info className="h-5 w-5" /></IconBtn>
              <IconBtn label="Interested" onClick={() => decide('interested')} className="text-success"><Heart className="h-6 w-6" /></IconBtn>
            </div>
          </div>
        </>
      )}

      {/* swipe-right bottom sheet */}
      {sheetId && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setSheetId(null)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand"><Sparkles className="h-5 w-5" /></div>
              <div><p className="font-serif text-[18px] leading-tight text-ink">Added to your shortlist</p><p className="text-[12.5px] text-muted">{getCandidate(sheetId)?.name}</p></div>
            </div>
            <div className="flex flex-col gap-2.5">
              <PrimaryButton full onClick={() => navigate(`/collaborate/request/${sheetId}`)}><Send className="h-4 w-4" /> Send Request Now</PrimaryButton>
              <SecondaryButton full onClick={() => navigate(`/collaborate/request/${sheetId}`)}><PenLine className="h-4 w-4" /> Personalise Request</SecondaryButton>
              <div className="grid grid-cols-2 gap-2.5">
                <SecondaryButton onClick={() => { collab.saveForLater(sheetId); setSheetId(null) }}>Add to Shortlist</SecondaryButton>
                <SecondaryButton onClick={() => setSheetId(null)}>Continue</SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function IconBtn({ children, label, onClick, className = '', small }: { children: React.ReactNode; label: string; onClick: () => void; className?: string; small?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} className={`tap flex items-center justify-center rounded-full border border-border bg-surface shadow-subtle ${small ? 'h-12 w-12' : 'h-14 w-14'} ${className}`}>{children}</button>
  )
}

function SummaryView({ collab, navigate }: { collab: ReturnType<typeof useCollab>; navigate: (p: string) => void }) {
  const { session } = collab
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand"><Heart className="h-8 w-8" strokeWidth={1.6} /></div>
      <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">That's everyone for now</h1>
      <div className="mt-4 flex gap-2.5">
        <Stat n={session.interested.length} label="Interested" />
        <Stat n={session.saved.length} label="Saved" />
        <Stat n={session.skipped.length} label="Skipped" />
      </div>
      <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
        <PrimaryButton full onClick={() => navigate('/collaborate/requests')}>Review Shortlist</PrimaryButton>
        <SecondaryButton full onClick={() => navigate('/collaborate')}>Back to Collaborate</SecondaryButton>
        <button onClick={() => navigate('/collaborate')} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Find More Later</button>
      </div>
    </div>
  )
}
function Stat({ n, label }: { n: number; label: string }) {
  return <div className="rounded-card border border-border bg-surface px-4 py-2.5 text-center"><p className="font-serif text-[22px] leading-none text-ink">{n}</p><p className="mt-1 text-[11px] uppercase tracking-wide text-muted">{label}</p></div>
}
function Empty({ title, body, cta, onCta, onBack }: { title: string; body: string; cta: string; onCta: () => void; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center px-2" style={{ paddingTop: 'var(--safe-top)' }}><button onClick={onBack} aria-label="Back" className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button></header>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand"><Sparkles className="h-8 w-8" strokeWidth={1.6} /></div>
        <h1 className="mt-5 font-serif text-[24px] text-ink">{title}</h1>
        <p className="mt-2 max-w-[300px] text-[14px] text-muted">{body}</p>
        <div className="mt-6 w-full max-w-[300px]"><PrimaryButton full onClick={onCta}>{cta}</PrimaryButton></div>
      </div>
    </div>
  )
}
