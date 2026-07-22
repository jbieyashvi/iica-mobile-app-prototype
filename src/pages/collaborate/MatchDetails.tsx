import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, MapPin, ExternalLink, Bookmark, Info, Flag, Ban } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import ScoreBar from '../../components/collab/ScoreBar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import ConfirmSheet from '../../components/portfolio/ConfirmSheet'
import { useCollab } from '../../state/CollabContext'
import { getCandidate } from '../../collab/mockCollab'

export default function MatchDetails() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const collab = useCollab()
  const c = getCandidate(artistId)
  const [toast, setToast] = useState('')
  const [confirm, setConfirm] = useState<'report' | 'block' | null>(null)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  if (!c) return <BackHeader title="Match" />
  const b = c.breakdown

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Match Details" right={
        <button onClick={() => setConfirm('report')} aria-label="Report" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><Flag className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-32">
        {/* summary */}
        <div className="mt-2 flex items-center gap-3">
          <img src={c.photo} alt="" className="h-16 w-16 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5"><h1 className="truncate font-serif text-[22px] leading-tight text-ink">{c.name}</h1>{c.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-brand" />}</div>
            <p className="truncate text-[13px] text-muted">{c.headline}</p>
            <p className="flex items-center gap-1 text-[12px] text-muted"><MapPin className="h-3 w-3" /> {c.location} · {c.primaryDomain}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-card border border-border bg-brand-soft p-4">
          <div><p className="text-[12px] font-semibold uppercase tracking-wide text-brand-dark">Overall match</p><p className="font-serif text-[30px] leading-none text-brand">{c.matchPercent}%</p></div>
          <StatusBadge tone={c.availability === 'Available' ? 'success' : c.availability === 'Not Available' ? 'neutral' : 'warning'}>{c.availability}</StatusBadge>
        </div>

        <Section title="Why you match"><p className="text-[14px] leading-relaxed text-ink">{c.rationale}</p></Section>

        <Section title="Complementary skills">
          <div className="flex flex-wrap gap-1.5">{c.skills.map((s) => <span key={s} className="rounded-[7px] border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-ink">{s}</span>)}</div>
        </Section>

        <Section title="Shared interests">
          <div className="flex flex-wrap gap-1.5">{c.sharedInterests.map((s) => <StatusBadge key={s} tone="brand">{s}</StatusBadge>)}</div>
        </Section>

        <Section title="Collaboration statement"><p className="text-[14px] leading-relaxed text-muted">"{c.statement}"</p></Section>

        {c.selectedWork.length > 0 && (
          <Section title="Selected work">
            <div className="no-scrollbar -mx-[18px] flex gap-2.5 overflow-x-auto px-[18px]">
              {c.selectedWork.map((w, i) => <img key={i} src={w} alt="" className="h-28 w-40 shrink-0 rounded-card border border-border object-cover" />)}
            </div>
          </Section>
        )}

        {/* Score breakdown */}
        <Section title="Score breakdown">
          <div className="rounded-card border border-border bg-surface px-4 py-1">
            <ScoreBar label="Creative Compatibility" score={b.creative.score} weight={b.creative.weight} reason={b.creative.reason} />
            <div className="h-px bg-border" />
            <ScoreBar label="Collaboration Intent" score={b.intent.score} weight={b.intent.weight} reason={b.intent.reason} />
            <div className="h-px bg-border" />
            <ScoreBar label="Location Match" score={b.location.score} weight={b.location.weight} reason={b.location.reason} />
            <div className="h-px bg-border" />
            <ScoreBar label="Social Presence" score={b.social.score} weight={b.social.weight} reason={b.social.reason} />
          </div>
          <p className="mt-2.5 flex items-start gap-2 text-[12px] leading-relaxed text-muted"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Match scores are recommendations, not a measure of artistic ability.</p>
        </Section>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => navigate(`/artist/${c.id}`)} className="tap flex items-center gap-1.5 text-[13px] font-semibold text-brand"><ExternalLink className="h-4 w-4" /> View Full Portfolio</button>
          <button onClick={() => setConfirm('block')} className="tap flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-error"><Ban className="h-4 w-4" /> Block</button>
        </div>
      </div>

      {/* sticky actions */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-[18px] py-3 backdrop-blur-md" style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => { collab.saveForLater(c.id); flash('Saved for later') }} className="min-w-[52px] px-0"><Bookmark className="h-5 w-5" /></SecondaryButton>
          <PrimaryButton full onClick={() => navigate(`/collaborate/request/${c.id}`)}>Request Collaboration</PrimaryButton>
        </div>
      </div>

      <ConfirmSheet open={confirm === 'report'} title="Report this artist?" body="Our team will review this profile. This won't notify the artist." confirmLabel="Report" onConfirm={() => { setConfirm(null); flash('Reported for review') }} onCancel={() => setConfirm(null)} />
      <ConfirmSheet open={confirm === 'block'} title={`Block ${c.name}?`} body="They won't appear in your recommendations again." confirmLabel="Block" danger onConfirm={() => { collab.block(c.id); setConfirm(null); navigate('/collaborate/recommendations') }} onCancel={() => setConfirm(null)} />
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6"><h2 className="mb-2.5 font-serif text-[18px] text-ink">{title}</h2>{children}</section>
}
