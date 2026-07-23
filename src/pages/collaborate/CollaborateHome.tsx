import { useLocation, useNavigate } from 'react-router-dom'
import {
  Sparkles, Users, Send, CalendarCheck, Inbox, ChevronRight, Clock, Settings2, Copy, RefreshCw, Compass,
} from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import { useAuth } from '../../state/AuthContext'
import { useCollab } from '../../state/CollabContext'
import { useEffect, useState } from 'react'

export default function CollaborateHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useAuth()
  const collab = useCollab()
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }

  // Confirm after returning from a Preferences save.
  useEffect(() => {
    if ((location.state as { savedPrefs?: boolean } | null)?.savedPrefs) {
      flash('Collaboration preferences saved')
      navigate(location.pathname, { replace: true, state: {} })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

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
            IICA's matching considers creative compatibility, collaboration intent, location and social presence to
            recommend artists worth working with.
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
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#7a5412]">Your membership is awaiting payment. Complete it to unlock AI matching.</p>
              <div className="mt-2 flex items-center justify-between rounded-control border border-border bg-surface px-3 py-2">
                <span className="font-mono text-[13px] font-semibold text-ink">{state.iicaId ?? 'RP.266.IICA'}</span>
                <button onClick={() => { navigator.clipboard?.writeText(state.iicaId ?? ''); flash('IICA ID copied') }} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                <PrimaryButton full onClick={() => navigate('/membership/payment-pending')}>Complete Payment</PrimaryButton>
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

  // ---- Active creator dashboard ----
  const received = collab.requests.filter((r) => r.direction === 'received' && r.status === 'Pending')
  const sent = collab.requests.filter((r) => r.direction === 'sent')
  const upcoming = collab.meetings.filter((m) => m.status === 'Upcoming' || m.status === 'Reschedule Requested')
  const canMatch = collab.canMatch()
  const configured = collab.prefs.configured
  const shortlist = collab.session.interested.length + collab.session.saved.length

  return (
    <div className="flex h-full flex-col bg-bg">
      <Header right={
        <button onClick={() => navigate('/collaborate/preferences')} aria-label="Edit preferences" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Settings2 className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-[calc(62px+var(--safe-bottom)+16px)] pt-4">
        <p className="text-[13.5px] leading-relaxed text-muted">Find creators whose skills and intent complement yours.</p>

        {/* Hero */}
        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-brand"><Sparkles className="h-5 w-5" /><p className="text-[13px] font-semibold">AI Recommendations</p></div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            {!configured ? 'Set your collaboration preferences to generate relevant matches.'
              : canMatch ? 'Your profile is ready. Generate a fresh set of recommended collaborators.'
                : 'You have recommendations from your recent session. Next refresh available soon.'}
          </p>
          <div className="mt-3">
            {!configured ? (
              <PrimaryButton full onClick={() => navigate('/collaborate/preferences')}>Set Collaboration Preferences</PrimaryButton>
            ) : canMatch ? (
              <PrimaryButton full onClick={() => navigate('/collaborate/discover')}><Sparkles className="h-4 w-4" /> Find Collaborators</PrimaryButton>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-control border border-border bg-bg px-3 py-2 text-[12.5px] text-muted"><Clock className="h-4 w-4 text-brand" /> Next recommendations in ~24h</div>
                <SecondaryButton full onClick={() => collab.session.queue.length ? navigate('/collaborate/recommendations') : navigate('/collaborate/preferences')}>View Current Recommendations</SecondaryButton>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-[12px] text-muted">Availability</span>
            <StatusBadge tone={collab.prefs.availability === 'Available' ? 'success' : collab.prefs.availability === 'Not Available' ? 'neutral' : 'warning'}>{collab.prefs.availability}</StatusBadge>
          </div>
        </div>

        {/* quick links */}
        <div className="mt-4 flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          <Row icon={<Users className="h-5 w-5" />} label="New recommendations" count={collab.session.active ? collab.session.queue.length - collab.session.index : 0} onClick={() => navigate(collab.session.queue.length ? '/collaborate/recommendations' : '/collaborate/discover')} />
          <Row icon={<Inbox className="h-5 w-5" />} label="Incoming requests" count={received.length} onClick={() => navigate('/collaborate/requests')} />
          <Row icon={<Send className="h-5 w-5" />} label="Sent requests" count={sent.length} onClick={() => navigate('/collaborate/requests')} />
          <Row icon={<CalendarCheck className="h-5 w-5" />} label="Upcoming meetings" count={upcoming.length} onClick={() => navigate('/collaborate/meetings')} />
          <Row icon={<Compass className="h-5 w-5" />} label="Shortlist & saved" count={shortlist} onClick={() => navigate('/collaborate/recommendations')} />
        </div>

        {/* prototype shortcuts */}
        <div className="mt-6 rounded-card border border-dashed border-border bg-surface p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">Prototype shortcuts</p>
          <button onClick={() => { collab.resetCooldown(); flash('Cooldown reset') }} className="tap flex min-h-[44px] w-full items-center gap-2 rounded-control border border-border bg-bg px-3 text-[13px] font-semibold text-ink hover:border-ink/25">
            <RefreshCw className="h-4 w-4 text-brand" /> Reset Recommendation Cooldown
          </button>
        </div>
      </div>
      <BottomNavigation />
      {toast && <Toast msg={toast} />}
    </div>
  )
}

function Header({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="flex h-12 items-center justify-between px-[18px]">
        <h1 className="font-serif text-[22px] text-ink">Collaborate</h1>
        {right}
      </div>
    </header>
  )
}
function Row({ icon, label, count, onClick }: { icon: React.ReactNode; label: string; count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex items-center gap-3 px-4 py-3.5 text-left hover:bg-black/[0.015]">
      <span className="text-brand">{icon}</span>
      <span className="flex-1 text-[14px] font-semibold text-ink">{label}</span>
      {count > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-soft px-2 text-[12px] font-bold text-brand-dark">{count}</span>}
      <ChevronRight className="h-5 w-5 text-muted" />
    </button>
  )
}
function Toast({ msg }: { msg: string }) {
  return <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{msg}</span></div>
}
