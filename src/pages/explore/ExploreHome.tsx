import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Info, ChevronRight } from 'lucide-react'
import ExploreShell from '../../components/explore/ExploreShell'
import { ArtistListCard, CategoryCard, CollectionCard, ContentCard, ShopCard, SkeletonCard } from '../../components/explore/cards'
import ShareSheet from '../../components/explore/ShareSheet'
import TuneSheet from './TuneSheet'
import EventCard from '../../components/events/EventCard'
import { useSaveGate } from '../../components/SaveGate'
import { useLikes, useInterests } from '../../state/useExplore'
import { useEvents } from '../../state/EventsContext'
import { publicArtists } from '../../data/publicArtists'
import { exploreCategories, collections, contentItems, trendingFeed, shopPreview, ContentItem } from '../../data/exploreData'
import { useLoad } from './useLoad'

const TRENDING_SLUGS = ['abhishek-singh-chouhan', 'ananya-rao', 'meera-kulkarni', 'arjun-mehta', 'kavya-sharma']

export default function ExploreHome() {
  const navigate = useNavigate()
  const { save, isSaved, sheet } = useSaveGate()
  const { isLiked, toggle: toggleLike } = useLikes()
  const { interests } = useInterests()
  const { events } = useEvents()
  const loading = useLoad(600)
  const [tune, setTune] = useState(false)
  const [share, setShare] = useState<ContentItem | null>(null)
  const [toast, setToast] = useState('')

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }

  const trendingArtists = useMemo(() => {
    const base = TRENDING_SLUGS.map((s) => publicArtists.find((a) => a.slug === s)).filter(Boolean) as typeof publicArtists
    // personalise: matching-domain artists first
    if (interests.topics.length === 0) return base
    return [...base].sort((a, b) => (interests.topics.includes(b.primaryDomain) ? 1 : 0) - (interests.topics.includes(a.primaryDomain) ? 1 : 0))
  }, [interests.topics])

  const orderedCategories = useMemo(() => {
    if (interests.topics.length === 0) return exploreCategories
    return [...exploreCategories].sort((a, b) => (interests.topics.includes(b.name) ? 1 : 0) - (interests.topics.includes(a.name) ? 1 : 0))
  }, [interests.topics])

  const upcoming = events.filter((e) => e.status === 'published').slice(0, 5)

  return (
    <ExploreShell active="foryou">
      {/* Tune */}
      <div className="px-[18px] pt-4">
        <button onClick={() => setTune(true)} className="tap flex w-full items-center gap-3 rounded-card border border-border bg-brand-soft p-3.5 text-left">
          <Sparkles className="h-5 w-5 shrink-0 text-brand" />
          <div className="flex-1"><p className="text-[14px] font-semibold text-ink">Tune Your Explore</p><p className="text-[12px] text-[#6d3357]">Personalise what you see</p></div>
          <ChevronRight className="h-5 w-5 text-brand" />
        </button>
      </div>

      {/* A. Browse Creative Worlds */}
      <Section title="Browse Creative Worlds" onAll={() => navigate('/explore/artists')}>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {orderedCategories.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </Section>

      {/* B. Trending Artists */}
      <Section title="Trending Artists" onAll={() => navigate('/explore/artists')}>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {loading ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />) : trendingArtists.map((a) => (
            <ArtistListCard key={a.slug} artist={a} saved={isSaved('artist:' + a.slug)} onSave={save} />
          ))}
        </div>
      </Section>

      {/* C. Upcoming Events */}
      <Section title="Upcoming Events" onAll={() => navigate('/explore/events')} allLabel="View all">
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {loading ? [0, 1, 2].map((i) => <div key={i} className="w-[230px] shrink-0"><SkeletonCard /></div>) : upcoming.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </Section>

      {/* D. Trending Now (mixed editorial) */}
      <Section title="Trending Now" onAll={() => navigate('/explore/trending')}>
        <div className="grid grid-cols-2 gap-2.5 px-[18px]">
          {trendingFeed.slice(0, 4).map((t, i) => (
            <button key={t.id} onClick={() => navigate(t.to)} className={`tap relative overflow-hidden rounded-card border border-border text-left ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
              <img src={t.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80">{t.label}</span>
                <p className="font-serif text-[15px] leading-tight">{t.title}</p>
                <p className="text-[11px] text-white/75">{t.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* E. Recommended For You */}
      <Section title="Recommended For You" right={
        <button onClick={() => setTune(true)} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Info className="h-3.5 w-3.5" /> Why this?</button>
      }>
        <p className="-mt-1 mb-2.5 px-[18px] text-[12px] text-muted">Based on your interest in {interests.topics.length ? interests.topics.slice(0, 3).join(', ') : 'Music, Visual Arts & Workshops'}.</p>
        <div className="flex flex-col gap-2.5 px-[18px]">
          {contentItems.slice(0, 2).map((c) => (
            <ContentCard key={c.id} item={c} saved={isSaved('content:' + c.id)} liked={isLiked(c.id)} onSave={save} onLike={toggleLike} onShare={setShare} />
          ))}
        </div>
      </Section>

      {/* F. Featured Collections */}
      <Section title="Featured Collections">
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {collections.map((c) => <CollectionCard key={c.id} collection={c} />)}
        </div>
      </Section>

      {/* G. Shop Preview */}
      <Section title="From the Shop" onAll={() => navigate('/explore/shop')} allLabel="View Shop">
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {shopPreview.map((p) => <ShopCard key={p.id} item={p} />)}
        </div>
      </Section>

      <div className="h-4" />

      {sheet}
      {tune && <TuneSheet onClose={() => setTune(false)} />}
      {share && <ShareSheet title={share.title} url={`https://iica.app/content/${share.id}`} onClose={() => setShare(null)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </ExploreShell>
  )
}

function Section({ title, children, onAll, allLabel = 'See all', right }: { title: string; children: React.ReactNode; onAll?: () => void; allLabel?: string; right?: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between px-[18px]">
        <h2 className="font-serif text-[19px] text-ink">{title}</h2>
        {right ?? (onAll && <button onClick={onAll} className="tap flex items-center gap-0.5 text-[13px] font-semibold text-brand">{allLabel} <ArrowRight className="h-3.5 w-3.5" /></button>)}
      </div>
      {children}
    </section>
  )
}
