import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import { ArtistListCard, ContentCard, ShopCard } from '../../components/explore/cards'
import EventCard from '../../components/events/EventCard'
import ShareSheet from '../../components/explore/ShareSheet'
import { useSaveGate } from '../../components/SaveGate'
import { useSavedArtists } from '../../state/useSavedArtists'
import { useLikes } from '../../state/useExplore'
import { useEvents } from '../../state/EventsContext'
import { getCategory, contentItems, shopPreview, ContentItem } from '../../data/exploreData'
import { publicArtists } from '../../data/publicArtists'

type Tab = 'Artists' | 'Events' | 'Content' | 'Products'
const domainForCategory = (name: string) => name === 'Cultural Education' ? 'Music' : name

export default function ExploreCategory() {
  const { slug } = useParams()
  const cat = getCategory(slug)
  const { save, isSaved, sheet } = useSaveGate()
  const { isSaved: isFollowed, toggle: toggleFollow } = useSavedArtists()
  const { isLiked, toggle: toggleLike } = useLikes()
  const { events } = useEvents()
  const [tab, setTab] = useState<Tab>('Artists')
  const [share, setShare] = useState<ContentItem | null>(null)
  const [toast, setToast] = useState('')

  if (!cat) return <BackHeader title="Category" />
  const followKey = 'category:' + cat.slug
  const followed = isFollowed(followKey)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const domain = domainForCategory(cat.name)
  const artists = publicArtists.filter((a) => a.slug !== 'reshma-patra' && a.primaryDomain === domain)
  const evs = events.filter((e) => e.status === 'published')
  const content = contentItems.filter((c) => c.category === cat.name)

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="relative">
          <BackHeader transparent />
          <div className="absolute inset-x-0 top-0 -z-10 h-44 overflow-hidden">
            <img src={cat.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/30" />
          </div>
        </div>

        <div className="px-[18px] pb-8">
          <div className="mt-28">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">{cat.creators} creators</p>
            <h1 className="mt-1 font-serif text-[30px] leading-tight text-ink">{cat.name}</h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{cat.intro}</p>
            <button onClick={() => { toggleFollow(followKey); flash(followed ? 'Unfollowed' : 'Following ' + cat.name) }} className={`tap mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-control px-5 text-[14px] font-semibold ${followed ? 'border border-border bg-surface text-ink' : 'bg-brand text-white'}`}>
              {followed ? <><Check className="h-4 w-4" /> Following</> : <><Plus className="h-4 w-4" /> Follow Category</>}
            </button>
          </div>

          {/* tabs */}
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto border-b border-border">
            {(['Artists', 'Events', 'Content', 'Products'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className="tap relative shrink-0 pb-2.5">
                <span className={`text-[14px] font-semibold ${tab === t ? 'text-ink' : 'text-muted'}`}>{t}</span>
                {tab === t && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-brand" />}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === 'Artists' && (artists.length ? (
              <div className="flex flex-col gap-3">{artists.map((a) => <ArtistListCard key={a.slug} artist={a} saved={isSaved('artist:' + a.slug)} onSave={save} list />)}</div>
            ) : <Empty text={`No ${cat.name.toLowerCase()} artists yet.`} />)}

            {tab === 'Events' && (evs.length ? (
              <div className="flex flex-col gap-3">{evs.map((e) => <EventCard key={e.id} event={e} wide />)}</div>
            ) : <Empty text="No events yet." />)}

            {tab === 'Content' && (content.length ? (
              <div className="flex flex-col gap-3.5">{content.map((c) => <ContentCard key={c.id} item={c} saved={isSaved('content:' + c.id)} liked={isLiked(c.id)} onSave={save} onLike={toggleLike} onShare={setShare} />)}</div>
            ) : <Empty text="No content in this category yet." />)}

            {tab === 'Products' && (
              <div className="no-scrollbar flex flex-wrap gap-3">{shopPreview.map((p) => <ShopCard key={p.id} item={p} />)}</div>
            )}
          </div>
        </div>
      </div>

      {sheet}
      {share && <ShareSheet title={share.title} url={`https://iica.app/content/${share.id}`} onClose={() => setShare(null)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">{text}</div>
}
