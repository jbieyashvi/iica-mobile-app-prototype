import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Loader2, FolderKanban, Search, PauseCircle } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import ProfileAvatarButton from '../../components/ProfileAvatarButton'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { useAiCollab } from '../../state/AiCollabContext'
import { membershipAccess } from '../../state/membershipAccess'
import { parseCollaborationRequirement } from '../../aicollab/service'

const MAX = 500
const EXAMPLES = [
  'I need a classical singer in Mumbai.',
  'Looking for a guitarist for an online collaboration.',
  'Need a dance instructor for a weekend workshop.',
  'Looking for a photographer in Delhi.',
  'Need a yoga coach for a corporate event in Pune.',
]

export default function CollaborateEntry() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { setRequirement, current } = useAiCollab()
  const acc = membershipAccess(state)
  // Suspended / expired members keep read-only access to existing
  // collaborations but cannot start a new AI search or send new requests.
  const readOnly = acc.isSuspended
  const [text, setText] = useState(current?.originalText ?? '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const find = async () => {
    if (readOnly) return
    const t = text.trim()
    if (!t) { setErr('Describe who you are looking for to continue.'); return }
    setErr(''); setBusy(true)
    const parsed = await parseCollaborationRequirement(t)
    setRequirement(parsed, state.iicaId || state.email || 'guest')
    setBusy(false)
    navigate('/collaborate/confirm')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between px-[18px]">
          <h1 className="font-serif text-[22px] text-ink">Collaborate</h1>
          <div className="flex items-center -mr-1">
            <button onClick={() => navigate('/search')} aria-label="Search" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Search className="h-5 w-5" /></button>
            <ProfileAvatarButton />
          </div>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-5" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        <div className="flex items-center gap-1.5 text-brand"><Sparkles className="h-4 w-4" /><span className="text-[11px] font-semibold uppercase tracking-[0.12em]">AI-powered matching</span></div>
        <h2 className="mt-2 font-serif text-[27px] leading-tight text-ink">Find the Right Collaborator</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Describe who you are looking for, and IICA will suggest relevant creator matches.</p>

        {readOnly && (
          <div className="mt-4 flex items-start gap-2.5 rounded-card border border-warning/30 bg-warning/10 p-3.5">
            <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p className="text-[13px] leading-relaxed text-ink">Your membership is currently paused. You can still view your existing collaborations, but starting a new match or sending new requests is unavailable until it’s reactivated.</p>
          </div>
        )}

        {/* NL input */}
        <div className={`mt-4 ${readOnly ? 'pointer-events-none opacity-45' : ''}`} aria-hidden={readOnly}>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="collab-need" className="text-[13px] font-semibold text-ink">Describe in your own words</label>
            <span className="text-[12px] text-muted">{text.length}/{MAX}</span>
          </div>
          <textarea
            id="collab-need" value={text} rows={4} maxLength={MAX}
            onChange={(e) => { setText(e.target.value); if (err) setErr('') }}
            placeholder="e.g. I need a classical singer in Mumbai for a weekend event."
            className={`w-full resize-none rounded-control border bg-surface px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none focus:ring-2 focus:ring-brand/30 ${err ? 'border-error' : 'border-border focus:border-brand'}`}
          />
          <div className="mt-1 flex items-center justify-between">
            {err ? <p className="text-[12px] font-medium text-error">{err}</p> : <span />}
            {text && <button onClick={() => setText('')} className="tap text-[12px] font-semibold text-muted hover:text-ink">Clear</button>}
          </div>
        </div>

        <PrimaryButton full disabled={busy || readOnly} onClick={find} className="mt-2">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Understanding your request…</> : <><Sparkles className="h-4 w-4" /> Find Matches</>}
        </PrimaryButton>

        {/* Examples */}
        {!readOnly && (
          <>
            <p className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-wide text-muted">Try an example</p>
            <div className="flex flex-col gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex} onClick={() => setText(ex)} className="tap flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2.5 text-left text-[13px] text-ink hover:border-ink/25">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" /><span className="flex-1">{ex}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* My Collaborations */}
        <button onClick={() => navigate('/collaborate/mine')} className="tap mt-6 flex w-full items-center gap-3 rounded-card border border-border bg-surface p-4 text-left hover:border-ink/20">
          <FolderKanban className="h-5 w-5 shrink-0 text-brand" />
          <span className="flex-1"><span className="block text-[14px] font-semibold text-ink">My Collaborations</span><span className="text-[12.5px] text-muted">Requests you’ve sent, received and active work</span></span>
          <ArrowRight className="h-4 w-4 text-muted" />
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}
