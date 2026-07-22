import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  X, Pencil, MapPin, BadgeCheck, Star, Instagram, Facebook, Youtube, Music2,
  Twitter, Linkedin, Globe, CalendarDays, Handshake, Check, Lock, ChevronRight,
} from 'lucide-react'
import { usePortfolio } from '../../state/PortfolioContext'
import { requiredSections, requiredComplete } from '../../portfolio/sections'
import { mockTestimonials } from '../../portfolio/mockPortfolio'
import { TimelineStrip } from './editors/TimelineEditor'
import MediaEmbed from '../../components/portfolio/MediaEmbed'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'

type Mode = 'public' | 'member'

export default function PortfolioPreview() {
  const navigate = useNavigate()
  const { portfolio, patch } = usePortfolio()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<Mode>('public')
  const [showPublish, setShowPublish] = useState(params.get('publish') === '1')

  const p = portfolio
  const canPublish = requiredComplete(p)
  const gatedForPublic = p.basics.visibility === 'Members Only' && mode === 'public'

  const editLink = (slug: string) => (
    <button
      onClick={() => navigate(`/portfolio/edit/${slug}`)}
      className="tap flex items-center gap-1 text-[12px] font-semibold text-brand hover:text-brand-dark"
    >
      <Pencil className="h-3 w-3" /> Edit
    </button>
  )

  const featuredTestimonials = mockTestimonials.filter(
    (t) => p.featuredTestimonials.includes(t.id) && !p.hiddenTestimonials.includes(t.id),
  )

  const socialRows = [
    { k: 'instagram', icon: Instagram, v: p.social.instagram },
    { k: 'facebook', icon: Facebook, v: p.social.facebook },
    { k: 'youtube', icon: Youtube, v: p.social.youtube },
    { k: 'spotify', icon: Music2, v: p.social.spotify },
    { k: 'x', icon: Twitter, v: p.social.x },
    { k: 'linkedin', icon: Linkedin, v: p.social.linkedin },
    { k: 'website', icon: Globe, v: p.social.website },
  ].filter((r) => r.v && !p.social.hidden.includes(r.k))

  const upcoming = [
    { id: 'up1', title: 'Ragas of Dusk — Fusion Set', date: '12 Aug 2026', paid: true },
    { id: 'up2', title: 'Open Studio: Movement Lab', date: '30 Aug 2026', paid: false },
  ]

  return (
    <div className="flex h-full flex-col bg-[#EDEBE7]">
      {/* Control bar */}
      <div
        className="shrink-0 border-b border-border bg-bg px-3 pb-2"
        style={{ paddingTop: 'calc(8px + var(--safe-top))' }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/portfolio/setup')}
            className="tap flex h-10 items-center gap-1.5 rounded-control px-2 text-[13px] font-semibold text-ink hover:bg-black/[0.04]"
          >
            <X className="h-5 w-5" /> Exit Preview
          </button>
          <span className="text-[12px] font-semibold text-muted">Preview</span>
          <div className="w-[92px]" />
        </div>
        <div className="mt-1 flex gap-1 rounded-control bg-surface p-1">
          {(['public', 'member'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`tap flex-1 rounded-[7px] py-1.5 text-[12.5px] font-semibold transition-colors ${
                mode === m ? 'bg-brand text-white' : 'text-muted'
              }`}
            >
              As {m === 'public' ? 'Public' : 'IICA Member'}
            </button>
          ))}
        </div>
      </div>

      {/* Rendered portfolio */}
      <div className="no-scrollbar flex-1 overflow-y-auto bg-bg pb-4">
        {/* Header */}
        <div className="relative">
          <div className="h-32 bg-brand-soft">
            {p.basics.cover && <img src={p.basics.cover} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="px-[18px]">
            <div className="-mt-10 h-20 w-20 overflow-hidden rounded-full border-4 border-bg bg-brand-soft">
              {p.basics.photo && <img src={p.basics.photo} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <h1 className="font-serif text-[26px] leading-tight text-ink">
                {p.basics.fullName}
              </h1>
              <BadgeCheck className="h-5 w-5 text-brand" />
            </div>
            <p className="text-[13.5px] text-muted">{p.basics.headline}</p>
            <p className="mt-1 flex items-center gap-1 text-[12.5px] text-muted">
              <MapPin className="h-3.5 w-3.5" />
              {[p.basics.city, p.basics.country].filter(Boolean).join(', ')}
            </p>

            {/* Social row */}
            {socialRows.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {socialRows.map((r) => {
                  const Icon = r.icon
                  return (
                    <span key={r.k} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink">
                      <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
                    </span>
                  )
                })}
              </div>
            )}

            {p.collabPrefs.showCTA && (
              <div className="mt-4">
                <PrimaryButton full>
                  <Handshake className="h-4 w-4" /> Request Collaboration
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>

        {gatedForPublic ? (
          <div className="mx-[18px] mt-6 flex flex-col items-center rounded-card border border-border bg-surface px-6 py-10 text-center">
            <Lock className="h-7 w-7 text-brand" />
            <p className="mt-3 font-serif text-[19px] text-ink">Members-only portfolio</p>
            <p className="mt-1 text-[13px] text-muted">
              This creator shares their full portfolio with IICA members. Switch
              to “As IICA Member” to preview it.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-7 px-[18px]">
            {/* About */}
            {p.about.shortBio && (
              <Section title="About" edit={editLink('about')}>
                <p className="text-[14px] leading-relaxed text-ink">{p.about.shortBio}</p>
                {p.about.chapters.length > 0 && (
                  <button
                    onClick={() => navigate('/portfolio/edit/about')}
                    className="tap mt-2 flex items-center gap-1 text-[13px] font-semibold text-brand"
                  >
                    Read Full Journey <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </Section>
            )}

            {/* Timeline */}
            {p.timeline.length > 0 && (
              <Section title="Highlights" edit={editLink('timeline')}>
                <TimelineStrip items={p.timeline} />
              </Section>
            )}

            {/* Awards */}
            {p.awards.length > 0 && (
              <Section title="Awards & Recognition" edit={editLink('awards')}>
                <div className="flex flex-col gap-2.5">
                  {p.awards.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
                      {a.image && <img src={a.image} alt="" className="h-11 w-11 rounded-[8px] object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink">{a.name}</p>
                        <p className="truncate text-[12px] text-muted">{[a.org, a.year].filter(Boolean).join(' · ')}</p>
                      </div>
                      <StatusBadge tone="brand">{a.recognitionType}</StatusBadge>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Watch & Listen */}
            {p.media.length > 0 && (
              <Section title="Watch & Listen" edit={editLink('media')}>
                <div className="flex flex-col gap-3">
                  {p.media.map((m) => (
                    <MediaEmbed key={m.id} item={m} />
                  ))}
                </div>
              </Section>
            )}

            {/* Collaborations */}
            {p.collaborations.length > 0 && (
              <Section title="Collaborations" edit={editLink('collaborations')}>
                <div className="flex flex-col gap-2.5">
                  {p.collaborations.map((c) => (
                    <div key={c.id} className="rounded-card border border-border bg-surface p-3">
                      <p className="text-[14px] font-semibold text-ink">{c.project}</p>
                      <p className="text-[12px] text-muted">
                        with {c.artistName === 'External artist' ? c.externalName : c.artistName}
                        {c.role ? ` · ${c.role}` : ''}
                      </p>
                      {c.awarded && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
                          <Star className="h-3 w-3 fill-brand" /> {c.awardName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Events */}
            <Section title="Events" edit={editLink('performances')}>
              <div className="flex flex-col gap-2.5">
                {upcoming.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">
                      <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-ink">{e.title}</p>
                      <p className="text-[12px] text-muted">{e.date}</p>
                    </div>
                    <StatusBadge tone={e.paid ? 'brand' : 'success'}>{e.paid ? 'Paid' : 'Free'}</StatusBadge>
                  </div>
                ))}
                {p.pastPerformances.map((e) => (
                  <div key={e.id} className="rounded-card border border-border bg-surface p-3">
                    <p className="text-[14px] font-semibold text-ink">{e.name}</p>
                    <p className="text-[12px] text-muted">{[e.venue, e.city].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Gallery */}
            {p.gallery.images.length > 0 && (
              <Section title="Gallery" edit={editLink('gallery')}>
                <div className="grid grid-cols-3 gap-2">
                  {p.gallery.images.map((g) => (
                    <div key={g.id} className="aspect-square overflow-hidden rounded-[9px] border border-border">
                      <img src={g.url} alt={g.caption} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Testimonials */}
            {featuredTestimonials.length > 0 && (
              <Section title="Testimonials" edit={editLink('testimonials')}>
                <div className="flex flex-col gap-2.5">
                  {featuredTestimonials.map((t) => (
                    <div key={t.id} className="rounded-card border border-border bg-surface p-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={t.author} src={t.avatar} size={36} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold text-ink">{t.author}</p>
                          <p className="truncate text-[11.5px] text-muted">{t.role}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-brand text-brand" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink">“{t.text}”</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>

      {/* Footer publish */}
      <div
        className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md"
        style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
      >
        <PrimaryButton full disabled={!canPublish} onClick={() => setShowPublish(true)}>
          {canPublish ? 'Publish Portfolio' : 'Complete required sections to publish'}
        </PrimaryButton>
      </div>

      {/* Publish review sheet */}
      {showPublish && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setShowPublish(false)} className="absolute inset-0 bg-ink/40" />
          <div
            className="fade-in relative max-h-[88%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5"
            style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
          >
            <h2 className="font-serif text-[24px] leading-tight text-ink">Publish your portfolio</h2>
            <p className="mt-1 text-[13px] text-muted">Review before going live.</p>

            <p className="mb-2 mt-4 text-[12px] font-bold uppercase tracking-wide text-muted">Required sections</p>
            <div className="flex flex-col divide-y divide-border rounded-card border border-border">
              {requiredSections().map((s) => {
                const done = s.complete(p)
                return (
                  <div key={s.slug} className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-success text-white' : 'bg-border text-muted'}`}>
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="flex-1 text-[13.5px] font-medium text-ink">{s.title}</span>
                    {!done && (
                      <button onClick={() => { setShowPublish(false); navigate(`/portfolio/edit/${s.slug}`) }} className="text-[12px] font-semibold text-brand">
                        Complete
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-card border border-border px-3.5 py-3">
              <span className="text-[13px] text-muted">Visibility</span>
              <span className="text-[13px] font-semibold text-ink">{p.basics.visibility}</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-card border border-border px-3.5 py-3">
              <span className="text-[13px] text-muted">Public URL</span>
              <span className="font-mono text-[12.5px] font-semibold text-ink">iica.app/artist/{p.slug}</span>
            </div>

            <div className="mt-5">
              <PrimaryButton
                full
                disabled={!canPublish}
                onClick={() => {
                  patch({ published: true })
                  setShowPublish(false)
                  navigate('/portfolio/published')
                }}
              >
                Publish Portfolio
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, edit, children }: { title: string; edit?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="font-serif text-[19px] text-ink">{title}</h2>
        {edit}
      </div>
      {children}
    </section>
  )
}
