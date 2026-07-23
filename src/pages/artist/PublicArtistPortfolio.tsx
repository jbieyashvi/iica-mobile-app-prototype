import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Share2, Bookmark, BookmarkCheck, BadgeCheck, MapPin, Handshake,
  Pencil, Star, ChevronRight, ArrowRight, Play, CalendarDays, Ticket, Lock, X,
} from 'lucide-react'
import { usePublicArtist } from '../../data/usePublicArtist'
import { useAuth } from '../../state/AuthContext'
import { useGate } from '../../state/GateContext'
import { useSavedArtists } from '../../state/useSavedArtists'
import ArtistSocials from '../../components/artist/ArtistSocials'
import SectionNav, { NavItem } from '../../components/artist/SectionNav'
import PublicTimeline from '../../components/artist/PublicTimeline'
import GalleryViewer from '../../components/artist/GalleryViewer'
import MediaEmbed from '../../components/portfolio/MediaEmbed'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'journey', label: 'Journey' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'media', label: 'Media' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'events', label: 'Events' },
  { id: 'reviews', label: 'Reviews' },
]

export default function PublicArtistPortfolio() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { artist, isOwn } = usePublicArtist(slug)
  const { state } = useAuth()
  const { requireMember } = useGate()
  const { isSaved, toggle } = useSavedArtists()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState('overview')
  const [viewer, setViewer] = useState<number | null>(null)
  const [eventsTab, setEventsTab] = useState<'upcoming' | 'past'>('upcoming')
  const [showAllCollabs, setShowAllCollabs] = useState(false)
  const [accountSheet, setAccountSheet] = useState(false)
  const [toast, setToast] = useState('')

  const scrollMt = { scrollMarginTop: 'calc(var(--safe-top) + 96px)' } as const

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // scrollspy
  useEffect(() => {
    const root = scrollRef.current
    if (!root || !artist) return
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { root, rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.6] },
    )
    NAV.forEach((n) => {
      const el = sectionRefs.current[n.id]
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [artist])

  const goTo = (id: string) => {
    const el = sectionRefs.current[id]
    const scroller = scrollRef.current
    if (!el || !scroller) return
    // Manual scroll — scrollIntoView is unreliable under the transformed device frame.
    const screen = scroller.closest('.device-screen') as HTMLElement | null
    const safeTop = screen ? parseFloat(getComputedStyle(screen).getPropertyValue('--safe-top')) || 0 : 0
    const offset = safeTop + 88 // sticky top bar (44) + section nav (44)
    scroller.scrollTo({ top: Math.max(0, el.offsetTop - offset), behavior: 'smooth' })
    setActive(id)
  }

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1800)
  }

  const notAvailable = artist?.availability === 'Not Available'

  const onCollaborate = () => {
    if (!artist) return
    if (isOwn) return navigate('/portfolio/setup')
    if (notAvailable) return
    // active members proceed; others get the membership sheet
    requireMember('Collaboration', () => navigate(`/artist/${artist.slug}/collaborate`))
  }

  const onSave = () => {
    if (!artist) return
    if (!state.authed) return setAccountSheet(true)
    toggle(artist.slug)
    flash(isSaved(artist.slug) ? 'Removed from saved' : 'Saved to your list')
  }

  const saved = artist ? isSaved(artist.slug) : false

  const gatedMembersOnly = useMemo(
    () => artist?.visibility === 'Members Only' && !state.authed,
    [artist, state.authed],
  )

  if (!artist) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-bg px-8 text-center">
        <p className="font-serif text-[22px] text-ink">Artist not found</p>
        <p className="mt-1 text-[13px] text-muted">This portfolio doesn't exist yet.</p>
        <div className="mt-5">
          <PrimaryButton onClick={() => navigate('/home')}>Back to Home</PrimaryButton>
        </div>
      </div>
    )
  }

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <div ref={scrollRef} className="no-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-40 flex items-center justify-between border-b border-transparent bg-bg/0 px-2 backdrop-blur-0 transition-colors"
          style={{ paddingTop: 'var(--safe-top)', height: 'calc(var(--safe-top) + 44px)' }}
        >
          <button
            onClick={() => navigate('/home')}
            aria-label="Back"
            className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => navigate(`/artist/${artist.slug}/share`)}
              aria-label="Share"
              className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={onSave}
              aria-label={saved ? 'Unsave' : 'Save'}
              className="tap flex h-10 w-10 items-center justify-center rounded-full bg-ink/35 text-white backdrop-blur-sm"
            >
              {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ---------- HEADER (overview) ---------- */}
        <section id="overview" ref={setRef('overview')} style={scrollMt} className="-mt-[calc(var(--safe-top)+44px)]">
          <div className="relative h-44 bg-brand-soft">
            {artist.cover && <img src={artist.cover} alt="" className="h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-black/20" />
          </div>
          <div className="px-[18px]">
            <div className="-mt-11 h-[88px] w-[88px] overflow-hidden rounded-full border-4 border-bg bg-brand-soft">
              {artist.photo && <img src={artist.photo} alt={artist.name} className="h-full w-full object-cover" />}
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <h1 className="font-serif text-[26px] leading-tight text-ink">{artist.name}</h1>
              {artist.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-brand" />}
            </div>
            <p className="mt-0.5 text-[14px] text-muted">{artist.headline}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {artist.location}</span>
              <span className="font-medium text-brand">{artist.primaryDomain}</span>
              {typeof artist.followers === 'number' && artist.followers > 0 && (
                <span><b className="text-ink">{(artist.followers / 1000).toFixed(1)}k</b> followers</span>
              )}
            </div>

            {/* tags */}
            {artist.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {artist.tags.slice(0, 6).map((t) => (
                  <span key={t} className="rounded-[7px] border border-border bg-surface px-2.5 py-1 text-[11.5px] font-medium text-ink">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* availability */}
            <div className="mt-3">
              <StatusBadge tone={notAvailable ? 'neutral' : 'success'}>
                {artist.availabilityLabel}
              </StatusBadge>
            </div>

            {/* actions */}
            <div className="mt-4 flex gap-2">
              {isOwn ? (
                <PrimaryButton full onClick={() => navigate('/portfolio/setup')}>
                  <Pencil className="h-4 w-4" /> Edit Portfolio
                </PrimaryButton>
              ) : notAvailable ? (
                <SecondaryButton full disabled>
                  Not accepting collaborations
                </SecondaryButton>
              ) : (
                <PrimaryButton full onClick={onCollaborate}>
                  <Handshake className="h-4 w-4" /> Request Collaboration
                </PrimaryButton>
              )}
              <SecondaryButton onClick={onSave} className="min-w-[52px] px-0">
                {saved ? <BookmarkCheck className="h-5 w-5 text-brand" /> : <Bookmark className="h-5 w-5" />}
              </SecondaryButton>
            </div>

            {/* socials */}
            <div className="mt-4">
              <ArtistSocials socials={artist.socials} />
            </div>
          </div>

          {/* What's New */}
          {!gatedMembersOnly && artist.whatsNew.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between px-[18px]">
                <h2 className="font-serif text-[19px] text-ink">What's New</h2>
              </div>
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
                {artist.whatsNew.map((u) => (
                  <div key={u.id} className="w-[230px] shrink-0 overflow-hidden rounded-card border border-border bg-surface">
                    <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft">
                      <img src={u.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{u.type}</span>
                      <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{u.title}</h3>
                      <p className="mt-1 text-[12px] text-muted">{u.date}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">{u.description}</p>
                      {u.cta && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-brand">
                          {u.cta} <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {gatedMembersOnly ? (
          <MembersOnlyGate onSignIn={() => navigate('/login')} onCreate={() => navigate('/signup')} />
        ) : (
          <>
            {/* Sticky section nav */}
            <div className="mt-6">
              <SectionNav items={NAV} active={active} onSelect={goTo} />
            </div>

            {/* ---------- JOURNEY / ABOUT ---------- */}
            <section id="journey" ref={setRef('journey')} style={scrollMt} className="px-[18px] pt-6">
              <h2 className="mb-2.5 font-serif text-[19px] text-ink">About</h2>
              <p className="text-[14px] leading-relaxed text-ink">{artist.bio}</p>
              <div className="mt-4 flex flex-col divide-y divide-border rounded-card border border-border bg-surface">
                <Meta label="Experience" value={artist.experienceYears ? `${artist.experienceYears} years` : '—'} />
                {artist.languages && <Meta label="Languages" value={artist.languages} />}
                {artist.skills.length > 0 && <Meta label="Skills" value={artist.skills.slice(0, 6).join(', ')} />}
              </div>
              {artist.journey.length > 0 && (
                <button
                  onClick={() => navigate(`/artist/${artist.slug}/journey`)}
                  className="tap mt-3 flex items-center gap-1 text-[13px] font-semibold text-brand"
                >
                  Read Full Journey <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </section>

            {/* ---------- TIMELINE ---------- */}
            {artist.timeline.length > 0 && (
              <section id="timeline" ref={setRef('timeline')} style={scrollMt} className="pt-8">
                <h2 className="mb-3 px-[18px] font-serif text-[19px] text-ink">Highlights by Timeline</h2>
                <PublicTimeline items={artist.timeline} />
              </section>
            )}

            {/* ---------- AWARDS ---------- */}
            {artist.awards.length > 0 && (
              <section className="px-[18px] pt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-serif text-[19px] text-ink">Awards & Recognition</h2>
                </div>
                <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
                  {artist.awards.slice(0, 3).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 px-3.5 py-3">
                      <span className="w-9 shrink-0 font-serif text-[15px] text-brand">{a.year}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink">{a.name}</p>
                        <p className="truncate text-[12px] text-muted">{[a.org, a.project].filter(Boolean).join(' · ')}</p>
                      </div>
                      <StatusBadge tone="brand">{a.recognitionType}</StatusBadge>
                    </div>
                  ))}
                </div>
                {artist.awards.length > 3 && (
                  <button
                    onClick={() => navigate(`/artist/${artist.slug}/journey`)}
                    className="tap mt-2.5 text-[13px] font-semibold text-brand"
                  >
                    View all {artist.awards.length} awards
                  </button>
                )}
              </section>
            )}

            {/* ---------- WATCH & LISTEN ---------- */}
            {artist.media.length > 0 && (
              <section id="media" ref={setRef('media')} style={scrollMt} className="pt-8">
                <h2 className="mb-3 px-[18px] font-serif text-[19px] text-ink">Watch & Listen</h2>
                <div className="px-[18px]">
                  <button onClick={() => navigate(`/artist/${artist.slug}/media/${(artist.media.find((m) => m.featured) ?? artist.media[0]).id}`)} className="block w-full text-left">
                    <MediaEmbed item={mediaToEmbed(artist.media.find((m) => m.featured) ?? artist.media[0])} />
                  </button>
                </div>
                {artist.media.length > 1 && (
                  <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-[18px] pb-1">
                    {artist.media.filter((m) => !m.featured).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => navigate(`/artist/${artist.slug}/media/${m.id}`)}
                        className="tap w-[180px] shrink-0 overflow-hidden rounded-card border border-border bg-surface text-left"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-brand-soft">
                          <img src={m.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink">
                              <Play className="ml-0.5 h-4 w-4 fill-ink" />
                            </span>
                          </span>
                        </div>
                        <div className="p-2.5">
                          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-brand">{m.type}</span>
                          <p className="mt-0.5 line-clamp-1 text-[13px] font-semibold text-ink">{m.title}</p>
                          {m.releaseDate && <p className="text-[11px] text-muted">{m.releaseDate}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ---------- GALLERY ---------- */}
            {artist.gallery.length > 0 && (
              <section className="pt-8">
                <div className="mb-3 flex items-center justify-between px-[18px]">
                  <h2 className="font-serif text-[19px] text-ink">Gallery</h2>
                </div>
                <div className="grid grid-cols-3 gap-1.5 px-[18px]">
                  {artist.gallery.slice(0, 6).map((g, idx) => (
                    <button
                      key={g.id}
                      onClick={() => setViewer(idx)}
                      className="tap relative aspect-square overflow-hidden rounded-[9px] border border-border bg-brand-soft"
                    >
                      <img src={g.url} alt={g.caption} loading="lazy" className="h-full w-full object-cover" />
                      {g.type === 'video' && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-ink">
                            <Play className="ml-0.5 h-3.5 w-3.5 fill-ink" />
                          </span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {artist.gallery.length > 6 && (
                  <button onClick={() => setViewer(0)} className="tap mt-2.5 px-[18px] text-[13px] font-semibold text-brand">
                    View all media
                  </button>
                )}
              </section>
            )}

            {/* ---------- COLLABORATIONS ---------- */}
            {artist.collaborations.length > 0 && (
              <section id="collaborations" ref={setRef('collaborations')} style={scrollMt} className="px-[18px] pt-8">
                <h2 className="mb-3 font-serif text-[19px] text-ink">Collaborations</h2>
                <div className="flex flex-col gap-2.5">
                  {(showAllCollabs ? artist.collaborations : artist.collaborations.slice(0, 3)).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => c.isMember && c.artistId && navigate(`/artist/${c.artistId}`)}
                      className={`rounded-card border border-border bg-surface p-3 text-left ${c.isMember && c.artistId ? 'tap' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-3">
                        {c.isMember ? (
                          <Avatar name={c.artistName} src={c.artistAvatar} size={40} />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-bg text-[13px] font-semibold text-muted">
                            {c.artistName.slice(0, 1)}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-ink">{c.project}</p>
                          <p className="truncate text-[12px] text-muted">
                            {c.artistName}{c.isMember ? '' : ' · External'}{c.role ? ` · ${c.role}` : ''}
                          </p>
                        </div>
                        {c.isMember && c.artistId && <ChevronRight className="h-4 w-4 shrink-0 text-muted" />}
                      </div>
                      {c.awarded && (
                        <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 text-[11.5px] font-semibold text-brand">
                          <Star className="h-3 w-3 fill-brand" />
                          {[c.awardName, c.awardCategory, c.awardYear].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {artist.collaborations.length > 3 && (
                  <button
                    onClick={() => setShowAllCollabs((v) => !v)}
                    className="tap mt-2.5 text-[13px] font-semibold text-brand"
                  >
                    {showAllCollabs ? 'Show less' : `View all ${artist.collaborations.length} collaborations`}
                  </button>
                )}
              </section>
            )}

            {/* ---------- EVENTS ---------- */}
            <section id="events" ref={setRef('events')} style={scrollMt} className="px-[18px] pt-8">
              <h2 className="mb-3 font-serif text-[19px] text-ink">Events</h2>
              <div className="mb-3 flex gap-1 rounded-control bg-surface p-1">
                {(['upcoming', 'past'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setEventsTab(t)}
                    className={`tap flex-1 rounded-[7px] py-1.5 text-[13px] font-semibold capitalize transition-colors ${
                      eventsTab === t ? 'bg-brand text-white' : 'text-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {eventsTab === 'upcoming' ? (
                artist.upcomingEvents.length === 0 ? (
                  <div className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center text-[13px] text-muted">
                    No upcoming events yet
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {artist.upcomingEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => navigate(`/artist/${artist.slug}/event/${e.id}`)}
                        className="tap overflow-hidden rounded-card border border-border bg-surface text-left"
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-brand-soft">
                          <img src={e.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                          <div className="absolute left-2 top-2 flex gap-1.5">
                            <StatusBadge tone="brand">{e.category}</StatusBadge>
                            {e.soldOut && <StatusBadge tone="error">Sold Out</StatusBadge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-semibold text-ink">{e.title}</p>
                            <p className="truncate text-[12px] text-muted">{e.date}{e.time ? ` · ${e.time}` : ''}</p>
                            <p className="truncate text-[12px] text-muted">{e.venue}, {e.city}</p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            {e.paid ? (
                              <span className="text-[14px] font-bold text-ink">₹{e.price}</span>
                            ) : (
                              <StatusBadge tone="success">Free</StatusBadge>
                            )}
                            <span className="flex items-center gap-1 text-[11.5px] font-semibold text-brand">
                              {e.paid ? <><Ticket className="h-3.5 w-3.5" /> View Tickets</> : <><CalendarDays className="h-3.5 w-3.5" /> Register</>}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              ) : artist.pastEvents.length === 0 ? (
                <div className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center text-[13px] text-muted">
                  No past events listed
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
                  {artist.pastEvents.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 px-3.5 py-3">
                      {e.media ? (
                        <img src={e.media} alt="" className="h-10 w-10 shrink-0 rounded-[8px] object-cover" />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-brand-soft text-brand-dark">
                          <CalendarDays className="h-4 w-4" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink">{e.name}</p>
                        <p className="truncate text-[12px] text-muted">{e.date} · {e.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ---------- REVIEWS ---------- */}
            <section id="reviews" ref={setRef('reviews')} style={scrollMt} className="px-[18px] pb-10 pt-8">
              <h2 className="mb-3 font-serif text-[19px] text-ink">Reviews</h2>
              <div className="rounded-card border border-border bg-surface p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-serif text-[34px] leading-none text-ink">{artist.ratingSummary.avg.toFixed(1)}</p>
                    <div className="mt-1 flex justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(artist.ratingSummary.avg) ? 'fill-brand text-brand' : 'text-border'}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-[11.5px] text-muted">{artist.ratingSummary.total} reviews</p>
                  </div>
                  <div className="flex-1">
                    {artist.ratingSummary.distribution.map((count, i) => {
                      const star = 5 - i
                      const pct = artist.ratingSummary.total ? (count / artist.ratingSummary.total) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 text-[11px] text-muted">{star}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                            <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2.5">
                {artist.reviews.slice(0, 2).map((r) => (
                  <div key={r.id} className="rounded-card border border-border bg-surface p-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.author} src={r.avatar} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[13.5px] font-semibold text-ink">{r.author}</p>
                          {r.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" />}
                        </div>
                        <p className="truncate text-[11.5px] text-muted">{r.relationship}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-brand text-brand" />
                        ))}
                      </div>
                    </div>
                    {r.title && <p className="mt-2 text-[13.5px] font-semibold text-ink">{r.title}</p>}
                    <p className="mt-1 text-[13px] leading-relaxed text-ink">“{r.text}”</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2.5">
                <SecondaryButton full onClick={() => navigate(`/artist/${artist.slug}/reviews`)}>
                  View All Reviews
                </SecondaryButton>
                <PrimaryButton full onClick={() => navigate(`/artist/${artist.slug}/write-review`)}>
                  Write a Review
                </PrimaryButton>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Gallery viewer */}
      {viewer !== null && (
        <GalleryViewer items={artist.gallery} startIndex={viewer} onClose={() => setViewer(null)} />
      )}

      {/* Account-required sheet (guest save) */}
      {accountSheet && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setAccountSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <button aria-label="Close" onClick={() => setAccountSheet(false)} className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Bookmark className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif text-[23px] leading-tight text-ink">Save this artist</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
              Create a free account to save artists and keep track of creators you love.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <PrimaryButton full onClick={() => navigate('/signup')}>Create an Account</PrimaryButton>
              <button onClick={() => setAccountSheet(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span>
        </div>
      )}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="max-w-[62%] truncate text-[13px] font-semibold text-ink">{value}</span>
    </div>
  )
}

function MembersOnlyGate({ onSignIn, onCreate }: { onSignIn: () => void; onCreate: () => void }) {
  return (
    <div className="mx-[18px] mt-8 flex flex-col items-center rounded-card border border-border bg-surface px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Lock className="h-7 w-7" strokeWidth={1.6} />
      </div>
      <h2 className="mt-4 font-serif text-[22px] leading-tight text-ink">A members-only portfolio</h2>
      <p className="mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-muted">
        This creator shares their full portfolio with IICA members. Sign in or create an account to view it.
      </p>
      <div className="mt-6 w-full">
        <PrimaryButton full onClick={onCreate}>Create an Account</PrimaryButton>
        <button onClick={onSignIn} className="tap mt-2.5 min-h-[44px] w-full text-[14px] font-semibold text-muted hover:text-ink">
          Sign In
        </button>
      </div>
    </div>
  )
}

// bridge ArtistMedia -> MediaEmbed's MediaItem shape
function mediaToEmbed(m: import('../../data/publicArtists').ArtistMedia) {
  return {
    id: m.id,
    type: m.type,
    title: m.title,
    url: m.url,
    thumbnail: m.thumbnail,
    releaseDate: m.releaseDate ?? '',
    description: m.description ?? '',
    credits: m.credits ?? '',
    featured: !!m.featured,
  }
}
