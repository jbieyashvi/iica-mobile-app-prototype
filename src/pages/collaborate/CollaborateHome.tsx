import { useNavigate } from 'react-router-dom'
import {
  Users, CalendarCheck, Inbox, ChevronRight, Clock, Copy, Compass, X, SlidersHorizontal,
} from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import ProfileAvatarButton from '../../components/ProfileAvatarButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import TuneSheet from '../../components/collab/TuneSheet'
import { useAuth } from '../../state/AuthContext'
import { useCollab } from '../../state/CollabContext'
import { TuneFilters } from '../../collab/types'
import { useState } from 'react'

export default function CollaborateHome() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const collab = useCollab()
  const [toast, setToast] = useState('')
  const [showHow, setShowHow] = useState(false)
  const [showTune, setShowTune] = useState(false)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }

  // ---- Non-active states ----
  if (state.role !== 'active') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <Header />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-[calc(62px+var(--safe-bottom)+16px)]">
          <div className="mt-4 overflow-hidden rounded-card border border-border">
            <div className="relative h-40 bg-brand-soft">
              <img src="https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">AI Collaboration</p>
                <h2 className="mt-1 font-serif text-[24px] leading-tight">Find creators who complement you</h2>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">
            IICA suggests creators whose work may complement yours, using your
            category, skills, location and creative activity.
          </p>

          {state.role === 'guest' ? (
            <div className="mt-6 flex flex-col gap-2.5">
              <PrimaryButton full onClick={() => navigate('/membership')}>Become a Member</PrimaryButton>
              <SecondaryButton full onClick={() => navigate('/login')}>Sign In</SecondaryButton>
              <button onClick={() => navigate('/explore/artists')} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Explore Artists</button>
            </div>
          ) : state.role === 'pending' ? (
            <div className="mt-6 rounded-card border border-warning/30 bg-[#F7F0E4] p-4">
              <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-warning" /><p className="font-serif text-[18px] text-ink">Application complete</p></div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#7a5412]">Your membership is awaiting purchase. Complete it to unlock AI matching.</p>
              <div className="mt-2 flex items-center justify-between rounded-control border border-border bg-surface px-3 py-2">
                <span className="font-mono text-[13px] font-semibold text-ink">{state.iicaId ?? 'JY.673.IICA'}</span>
                <button onClick={() => { navigator.clipboard?.writeText(state.iicaId ?? ''); flash('IICA ID copied') }} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                <PrimaryButton full onClick={() => navigate('/membership/status')}>Complete Membership</PrimaryButton>
                <SecondaryButton full onClick={() => navigate('/explore/artists')}>Explore Artists</SecondaryButton>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-card border border-border bg-surface p-4">
              <p className="font-serif text-[18px] text-ink">Available to IICA creators</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">Collaboration matching is available once you're an active member.</p>
              <div className="mt-3 flex flex-col gap-2.5">
                <PrimaryButton full onClick={() => navigate('/membership')}>Apply for Membership</PrimaryButton>
                <SecondaryButton full onClick={() => navigate('/explore/artists')}>Explore Artists</SecondaryButton>
              </div>
            </div>
          )}
        </div>
        <BottomNavigation />
        {toast && <Toast msg={toast} />}
      </div>
    )
  }

  // ---- Active creator ----
  const receivedCount = collab.requests.filter((r) => r.direction === 'received').length
  const sentCount = collab.requests.filter((r) => r.direction === 'sent').length
  const upcoming = collab.meetings.filter((m) => m.status === 'Upcoming' || m.status === 'Reschedule Requested')
  const canMatch = collab.canMatch()
  const shortlist = collab.session.interested.length + collab.session.saved.length
  const hasSession = collab.session.queue.length > 0
  const newCount = hasSession ? Math.max(0, collab.session.queue.length - collab.session.index) : 0

  return (
    <div className="flex h-full flex-col bg-bg">
      <Header />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-[calc(62px+var(--safe-bottom)+16px)] pt-4">
        <p className="text-[13.5px] leading-relaxed text-muted">Meet people whose work complements yours.</p>

        {/* Primary matching card */}
        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          {!hasSession ? (
            <>
              <h2 className="font-serif text-[20px] leading-tight text-ink">Find your next collaborator</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">We’ll use your IICA profile to recommend relevant people.</p>
              <div className="mt-3.5">
                <PrimaryButton full onClick={() => navigate('/collaborate/discover')}>Find Matches</PrimaryButton>
              </div>
              <TuneRow onClick={() => setShowTune(true)} />
              <button onClick={() => setShowHow(true)} className="tap mt-1 flex min-h-[40px] w-full items-center justify-center text-[12.5px] font-semibold text-brand hover:text-brand-dark">How matching works</button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-[20px] leading-tight text-ink">Your recommendations are ready</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Continue exploring people selected for you.</p>
              <div className="mt-3.5">
                <PrimaryButton full onClick={() => navigate('/collaborate/recommendations')}>View Recommendations</PrimaryButton>
              </div>
              <TuneRow onClick={() => setShowTune(true)} />
              {canMatch ? (
                <button onClick={() => navigate('/collaborate/discover')} className="tap mt-1 flex min-h-[40px] w-full items-center justify-center text-[12.5px] font-semibold text-brand hover:text-brand-dark">Refresh Matches</button>
              ) : (
                <p className="mt-2 text-center text-[12px] text-muted">New matches will be available tomorrow.</p>
              )}
            </>
          )}
        </div>

        {/* Simplified destinations */}
        <div className="mt-4 flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          <Row icon={<Users className="h-5 w-5" />} label="Recommendations" count={newCount} onClick={() => navigate(hasSession ? '/collaborate/recommendations' : '/collaborate/discover')} />
          <Row icon={<Inbox className="h-5 w-5" />} label="Requests" sub={`${receivedCount} received · ${sentCount} sent`} onClick={() => navigate('/collaborate/requests')} />
          <Row icon={<CalendarCheck className="h-5 w-5" />} label="Meetings" count={upcoming.length} onClick={() => navigate('/collaborate/meetings')} />
          <Row icon={<Compass className="h-5 w-5" />} label="Saved Profiles" count={shortlist} onClick={() => navigate('/collaborate/recommendations')} />
        </div>
      </div>
      <BottomNavigation />
      {toast && <Toast msg={toast} />}
      {showHow && <HowSheet onClose={() => setShowHow(false)} />}
      {showTune && (
        <TuneSheet
          initial={collab.tune}
          onClose={() => setShowTune(false)}
          onReset={() => { collab.resetTune(); setShowTune(false); flash('Filters reset') }}
          onShow={(t: TuneFilters) => {
            collab.applyTune(t)
            setShowTune(false)
            navigate(hasSession ? '/collaborate/recommendations' : '/collaborate/discover')
          }}
        />
      )}
    </div>
  )
}

// Clearly-labelled secondary action — text + sliders icon, not an icon alone.
function TuneRow({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap mt-2 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-control text-[13px] font-semibold text-ink hover:bg-black/[0.03]">
      <SlidersHorizontal className="h-4 w-4 text-brand" /> Tune Matches
    </button>
  )
}

function HowSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <button aria-label="Close" onClick={onClose} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        <h2 className="font-serif text-[22px] leading-tight text-ink">How matching works</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">We consider your category, creative work, location, skills and activity to suggest relevant IICA profiles.</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">Recommendations are suggestions, not a measure of artistic ability.</p>
        <div className="mt-5"><PrimaryButton full onClick={onClose}>Got It</PrimaryButton></div>
      </div>
    </div>
  )
}

function Header({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="flex h-12 items-center justify-between px-[18px]">
        <h1 className="font-serif text-[22px] text-ink">Collaborate</h1>
        <div className="flex items-center -mr-1">
          {right}
          <ProfileAvatarButton />
        </div>
      </div>
    </header>
  )
}
function Row({ icon, label, count = 0, sub, onClick }: { icon: React.ReactNode; label: string; count?: number; sub?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex items-center gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015]">
      <span className="text-brand">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-ink">{label}</span>
        {sub && <span className="mt-0.5 block text-[12px] text-muted">{sub}</span>}
      </span>
      {!sub && count > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-soft px-2 text-[12px] font-bold text-brand-dark">{count}</span>}
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </button>
  )
}
function Toast({ msg }: { msg: string }) {
  return <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{msg}</span></div>
}
