import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Bookmark, Share2, X, ChevronRight } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'
import ShareSheet from '../../components/explore/ShareSheet'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'
import { useSavedArtists } from '../../state/useSavedArtists'
import { publicArtists } from '../../data/publicArtists'
import { getContent, getProduct } from '../../data/exploreData'
import { useEvents } from '../../state/EventsContext'
import { fmtDate, inr } from '../../events/format'

type Tab = 'Artists' | 'Events' | 'Content' | 'Products'

export default function ExploreSaved() {
  const navigate = useNavigate()
  const { saved, toggle } = useSavedArtists()
  const { getEvent } = useEvents()
  const [tab, setTab] = useState<Tab>('Artists')
  const [share, setShare] = useState<{ title: string; url: string } | null>(null)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const artistKeys = saved.filter((k) => k.startsWith('artist:') || publicArtists.some((a) => a.slug === k))
  const eventKeys = saved.filter((k) => k.startsWith('event:'))
  const contentKeys = saved.filter((k) => k.startsWith('content:'))
  const productKeys = saved.filter((k) => k.startsWith('product:'))

  const counts: Record<Tab, number> = { Artists: artistKeys.length, Events: eventKeys.length, Content: contentKeys.length, Products: productKeys.length }

  const artistFor = (k: string) => publicArtists.find((a) => a.slug === k.replace('artist:', ''))
  const remove = (k: string) => { toggle(k); flash('Removed from saved') }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 px-2 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between">
          <button onClick={() => navigate('/explore')} aria-label="Back" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
          <h1 className="font-serif text-[19px] text-ink">Saved</h1>
          <span className="h-10 w-10" />
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto px-[6px] pb-1">
          {(['Artists', 'Events', 'Content', 'Products'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="tap relative shrink-0 pb-2">
              <span className={`text-[14px] font-semibold ${tab === t ? 'text-ink' : 'text-muted'}`}>{t} <span className="font-normal text-muted">{counts[t]}</span></span>
              {tab === t && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-brand" />}
            </button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4" style={{ paddingBottom: 'calc(62px + var(--safe-bottom) + 16px)' }}>
        {tab === 'Artists' && (artistKeys.length ? (
          <div className="flex flex-col gap-3">
            {artistKeys.map((k) => { const a = artistFor(k); if (!a) return null; return (
              <SavedRow key={k} image={a.photo} title={a.name} sub={`${a.primaryDomain} · ${a.location.split(',')[0]}`} onOpen={() => navigate(`/artist/${a.slug}`)} onRemove={() => remove(k)} onShare={() => setShare({ title: a.name, url: `https://iica.app/artist/${a.slug}` })} round />
            ) })}
          </div>
        ) : <Empty icon={<Bookmark className="h-6 w-6" />} text="No saved artists yet" hint="Tap the bookmark on any artist to save them here." />)}

        {tab === 'Events' && (eventKeys.length ? (
          <div className="flex flex-col gap-3">
            {eventKeys.map((k) => { const e = getEvent(k.replace('event:', '')); if (!e) return null; return (
              <SavedRow key={k} image={e.cover} title={e.title} sub={`${fmtDate(e.startDate)} · ${e.format === 'Online' ? 'Online' : e.city}`} badge={e.paid ? undefined : 'Free'} onOpen={() => navigate(`/events/${e.id}`)} onRemove={() => remove(k)} onShare={() => setShare({ title: e.title, url: `https://iica.app/events/${e.id}` })} />
            ) })}
          </div>
        ) : <Empty icon={<Bookmark className="h-6 w-6" />} text="No saved events yet" hint="Save events to find them quickly later." />)}

        {tab === 'Content' && (contentKeys.length ? (
          <div className="flex flex-col gap-3">
            {contentKeys.map((k) => { const c = getContent(k.replace('content:', '')); if (!c) return null; return (
              <SavedRow key={k} image={c.thumbnail} title={c.title} sub={`${c.type} · ${c.creator}`} onOpen={() => navigate(`/content/${c.id}`)} onRemove={() => remove(k)} onShare={() => setShare({ title: c.title, url: `https://iica.app/content/${c.id}` })} />
            ) })}
          </div>
        ) : <Empty icon={<Bookmark className="h-6 w-6" />} text="No saved content yet" hint="Save posts, videos and releases to revisit." />)}

        {tab === 'Products' && (productKeys.length ? (
          <div className="flex flex-col gap-3">
            {productKeys.map((k) => { const p = getProduct(k.replace('product:', '')); if (!p) return null; return (
              <SavedRow key={k} image={p.image} title={p.title} sub={`${p.kind} · ${inr(p.price)}`} onOpen={() => navigate(`/product/${p.id}`)} onRemove={() => remove(k)} onShare={() => setShare({ title: p.title, url: `https://iica.app/product/${p.id}` })} />
            ) })}
          </div>
        ) : <Empty icon={<Bookmark className="h-6 w-6" />} text="No saved products yet" hint="Save masterclasses and products for later." />)}
      </div>

      <BottomNavigation />
      {share && <ShareSheet title={share.title} url={share.url} onClose={() => setShare(null)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function SavedRow({ image, title, sub, badge, onOpen, onRemove, onShare, round }: { image: string; title: string; sub: string; badge?: string; onOpen: () => void; onRemove: () => void; onShare: () => void; round?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
      <button onClick={onOpen} className="tap flex min-w-0 flex-1 items-center gap-3 text-left">
        {round ? <Avatar name={title} src={image} size={52} /> : <img src={image} alt="" className="h-[52px] w-[52px] shrink-0 rounded-[9px] object-cover" />}
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[15px] leading-tight text-ink">{title}</p>
          <p className="truncate text-[12px] text-muted">{sub}</p>
          {badge && <div className="mt-1"><StatusBadge tone="success">{badge}</StatusBadge></div>}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
      </button>
      <button onClick={onShare} aria-label="Share" className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><Share2 className="h-4 w-4" /></button>
      <button onClick={onRemove} aria-label="Remove" className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:text-error"><X className="h-4 w-4" /></button>
    </div>
  )
}

function Empty({ icon, text, hint }: { icon: React.ReactNode; text: string; hint: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-brand">{icon}</div>
      <p className="mt-4 font-serif text-[20px] text-ink">{text}</p>
      <p className="mt-1 max-w-[260px] text-[13px] text-muted">{hint}</p>
    </div>
  )
}
