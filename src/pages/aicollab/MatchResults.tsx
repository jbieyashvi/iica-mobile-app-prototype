import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Pencil, MapPin, Sparkles, ChevronRight, Lock } from 'lucide-react'
import CollabHeader from '../../components/aicollab/CollabHeader'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { membershipPurchaseEnabled, MEMBERSHIP_UNAVAILABLE_MSG } from '../../config/platform'
import { useAiCollab } from '../../state/AiCollabContext'
import { matchCreators } from '../../aicollab/match'
import { getMatchCreator } from '../../aicollab/creators'
import type { MatchLabel } from '../../aicollab/types'

type Sort = 'Best Match' | 'Nearest'
const labelTone = (l: MatchLabel) => (l === 'Strong Match' ? 'success' : l === 'Good Match' ? 'brand' : 'neutral')

export default function MatchResults() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { current } = useAiCollab()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [sort, setSort] = useState<Sort>('Best Match')
  const [gate, setGate] = useState(false)

  const matches = useMemo(() => (current ? matchCreators(current) : []), [current])
  const sorted = useMemo(() => {
    if (!current) return matches
    if (sort === 'Nearest') {
      const loc = current.location.toLowerCase()
      return [...matches].sort((a, b) => {
        const ca = getMatchCreator(a.creatorId)?.city.toLowerCase() === loc ? 0 : 1
        const cb = getMatchCreator(b.creatorId)?.city.toLowerCase() === loc ? 0 : 1
        return ca - cb || b.score - a.score
      })
    }
    return matches
  }, [matches, sort, current])

  // preserve scroll across profile navigation
  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    const saved = Number(sessionStorage.getItem('iica_matches_scroll') || '0')
    if (saved) requestAnimationFrame(() => { el.scrollTop = saved })
    const onS = () => { try { sessionStorage.setItem('iica_matches_scroll', String(el.scrollTop)) } catch { /* */ } }
    el.addEventListener('scroll', onS, { passive: true })
    return () => el.removeEventListener('scroll', onS)
  }, [])

  if (!current) return <Navigate to="/collaborate" replace />

  const canSend = access.isActiveMember
  const select = (slug: string) => {
    if (canSend) { navigate(`/collaborate/new/${slug}`); return }
    setGate(true)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <CollabHeader title="Creator Matches" />
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        {/* requirement summary */}
        <div className="flex items-start gap-2 rounded-card border border-border bg-surface p-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-ink">{current.role}{current.location && current.location !== 'Any location' ? ` · ${current.location}` : ''}</p>
            <p className="truncate text-[12px] text-muted">{[current.genre, current.format, current.preferredDate].filter((x) => x && x !== 'Not specified').join(' · ')}</p>
          </div>
          <button onClick={() => navigate('/collaborate/confirm')} aria-label="Edit requirement" className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Pencil className="h-3.5 w-3.5" /> Edit</button>
        </div>

        {/* count + sort */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[12.5px] font-semibold text-muted">{sorted.length} match{sorted.length === 1 ? '' : 'es'}</p>
          <div className="flex gap-1">
            {(['Best Match', 'Nearest'] as Sort[]).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`tap rounded-control px-2.5 py-1 text-[12px] font-semibold ${sort === s ? 'text-brand underline decoration-2 underline-offset-4' : 'text-muted'}`}>{s}</button>
            ))}
          </div>
        </div>

        {!canSend && (
          <div className="mt-3 flex items-start gap-2 rounded-control border border-warning/30 bg-[#F7F0E4] px-3 py-2.5 text-[12.5px] text-[#7a5412]">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <span>Collaboration requests are available to active IICA Creator Members. You can browse matches and view profiles.</span>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="font-serif text-[19px] text-ink">No strong matches yet</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">Try editing your requirement — broaden the location, genre or format.</p>
            <button onClick={() => navigate('/collaborate/confirm')} className="tap mt-4 min-h-[42px] rounded-control bg-brand px-5 text-[13.5px] font-semibold text-white">Edit Requirement</button>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {sorted.map((m) => {
              const c = getMatchCreator(m.creatorId); if (!c) return null
              return (
                <div key={m.creatorId} className="rounded-card border border-border bg-surface p-3.5">
                  <div className="flex items-start gap-3">
                    <Avatar name={c.name} src={c.photo} size={46} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[16px] leading-tight text-ink">{c.name}</p>
                      <p className="truncate text-[11.5px] text-muted">{c.category} · {c.primaryDomain}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-muted"><MapPin className="h-3 w-3" /> {c.city}, {c.country}</p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-muted">{c.iicaId}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-serif text-[20px] leading-none text-brand">{m.score}%</p>
                      <div className="mt-1"><StatusBadge tone={labelTone(m.label)}>{m.label}</StatusBadge></div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/85">{m.reasons.join(' · ')}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <button onClick={() => navigate(`/artist/${c.slug}`, { state: { from: '/collaborate/matches', collabSelect: true } })} className="tap flex min-h-[42px] items-center justify-center rounded-control border border-border bg-bg text-[13px] font-semibold text-ink hover:border-ink/25">View Profile</button>
                    <button onClick={() => select(c.slug)} className="tap flex min-h-[42px] items-center justify-center gap-1 rounded-control bg-brand text-[13px] font-semibold text-white hover:bg-brand-dark">Select <ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {gate && (
        <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setGate(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Lock className="h-6 w-6" strokeWidth={1.75} /></div>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Creator membership required</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Collaboration requests are available to active IICA Creator Members.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {!membershipPurchaseEnabled() ? (
                <p className="rounded-control bg-surface px-3.5 py-3 text-[12.5px] text-muted ring-1 ring-border">{MEMBERSHIP_UNAVAILABLE_MSG}</p>
              ) : access.hasIicaId ? (
                <PrimaryButton full onClick={() => navigate('/membership/status')}>Complete Membership Purchase</PrimaryButton>
              ) : (
                <PrimaryButton full onClick={() => navigate('/membership')}>Apply for Membership</PrimaryButton>
              )}
              <button onClick={() => setGate(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Maybe Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
