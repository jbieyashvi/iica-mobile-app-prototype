import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp, Loader2, ChevronRight, BadgeCheck, MapPin, Globe } from 'lucide-react'
import { useRecentSearches } from '../../state/useExplore'
import { publicArtists } from '../../data/publicArtists'
import { exploreCategories, contentItems, shopPreview, suggestedSearches, trendingSearches } from '../../data/exploreData'
import { useEvents } from '../../state/EventsContext'
import { inr, startingPrice } from '../../events/format'
import Avatar from '../../components/Avatar'
import StatusBadge from '../../components/StatusBadge'

export default function ExploreSearch() {
  const navigate = useNavigate()
  const { recent, add, clear } = useRecentSearches()
  const { events } = useEvents()
  const [q, setQ] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!q.trim()) { setTyping(false); return }
    setTyping(true)
    const t = setTimeout(() => setTyping(false), 350)
    return () => clearTimeout(t)
  }, [q])

  const query = q.trim().toLowerCase()
  const has = (s: string) => s.toLowerCase().includes(query)

  const artists = useMemo(() => query ? publicArtists.filter((a) => a.slug !== 'reshma-patra' && has(a.name + a.headline + a.primaryDomain + a.location + a.tags.join(' '))) : [], [query])
  const evs = useMemo(() => query ? events.filter((e) => e.status === 'published' && has(e.title + e.category + (e.city ?? '') + e.organiserName)) : [], [query, events])
  const content = useMemo(() => query ? contentItems.filter((c) => has(c.title + c.creator + c.category + c.tags.join(' '))) : [], [query])
  const cats = useMemo(() => query ? exploreCategories.filter((c) => has(c.name)) : [], [query])
  const prods = useMemo(() => query ? shopPreview.filter((p) => has(p.title + p.creator + p.kind)) : [], [query])
  const totalResults = artists.length + evs.length + content.length + cats.length + prods.length

  const runSearch = (term: string) => { setQ(term); add(term) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-border bg-bg/92 px-3 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)', height: 'calc(var(--safe-top) + 56px)' }}>
        <div className="flex h-10 flex-1 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) add(q) }} placeholder="Search artists, events, content…" className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><X className="h-4 w-4 text-muted" /></button>}
        </div>
        <button onClick={() => navigate('/explore')} className="tap min-h-[44px] px-1 text-[14px] font-semibold text-brand">Cancel</button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8">
        {!query ? (
          <div className="pt-4">
            {recent.length > 0 && (
              <section className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-ink">Recent</p>
                  <button onClick={clear} className="text-[12px] font-semibold text-brand">Clear</button>
                </div>
                <div className="flex flex-col">
                  {recent.map((r) => (
                    <button key={r} onClick={() => runSearch(r)} className="tap flex items-center gap-3 py-2.5 text-left">
                      <Clock className="h-4 w-4 text-muted" /><span className="flex-1 text-[14px] text-ink">{r}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            <Suggest title="Suggested searches" items={suggestedSearches} icon={<Search className="h-4 w-4 text-muted" />} onPick={runSearch} />
            <Suggest title="Trending searches" items={trendingSearches} icon={<TrendingUp className="h-4 w-4 text-brand" />} onPick={runSearch} />
          </div>
        ) : typing ? (
          <div className="flex items-center gap-2 pt-8 text-[13px] text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Searching…</div>
        ) : totalResults === 0 ? (
          <div className="flex flex-col items-center px-6 pt-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-muted"><Search className="h-6 w-6" /></div>
            <p className="mt-4 font-serif text-[20px] text-ink">No results for “{q}”</p>
            <p className="mt-1 max-w-[260px] text-[13px] text-muted">Try a different term or explore suggested searches.</p>
          </div>
        ) : (
          <div className="pt-4">
            {artists.length > 0 && (
              <Group title="Artists" count={artists.length}>
                {artists.slice(0, 3).map((a) => (
                  <button key={a.slug} onClick={() => { add(q); navigate(`/artist/${a.slug}`) }} className="tap flex items-center gap-3 py-2.5 text-left">
                    <Avatar name={a.name} src={a.photo} size={40} />
                    <div className="min-w-0 flex-1"><div className="flex items-center gap-1"><span className="truncate text-[14px] font-semibold text-ink">{a.name}</span>{a.verified && <BadgeCheck className="h-3.5 w-3.5 text-brand" />}</div><p className="truncate text-[12px] text-muted">{a.primaryDomain} · {a.location.split(',')[0]}</p></div>
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </button>
                ))}
              </Group>
            )}
            {evs.length > 0 && (
              <Group title="Events" count={evs.length}>
                {evs.slice(0, 3).map((e) => (
                  <button key={e.id} onClick={() => { add(q); navigate(`/events/${e.id}`) }} className="tap flex items-center gap-3 py-2.5 text-left">
                    <img src={e.cover} alt="" className="h-11 w-11 rounded-[9px] object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{e.title}</p><p className="flex items-center gap-1 truncate text-[12px] text-muted">{e.format === 'Online' ? <Globe className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}{e.format === 'Online' ? 'Online' : e.city}</p></div>
                    {e.paid ? <span className="text-[12px] font-bold text-ink">{inr(startingPrice(e))}+</span> : <StatusBadge tone="success">Free</StatusBadge>}
                  </button>
                ))}
              </Group>
            )}
            {content.length > 0 && (
              <Group title="Content" count={content.length}>
                {content.slice(0, 3).map((c) => (
                  <button key={c.id} onClick={() => { add(q); navigate(`/content/${c.id}`) }} className="tap flex items-center gap-3 py-2.5 text-left">
                    <img src={c.thumbnail} alt="" className="h-11 w-11 rounded-[9px] object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{c.title}</p><p className="truncate text-[12px] text-muted">{c.type} · {c.creator}</p></div>
                  </button>
                ))}
              </Group>
            )}
            {cats.length > 0 && (
              <Group title="Categories" count={cats.length}>
                {cats.slice(0, 3).map((c) => (
                  <button key={c.slug} onClick={() => navigate(`/explore/category/${c.slug}`)} className="tap flex items-center gap-3 py-2.5 text-left">
                    <img src={c.image} alt="" className="h-11 w-11 rounded-[9px] object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{c.name}</p><p className="text-[12px] text-muted">{c.creators} creators</p></div>
                  </button>
                ))}
              </Group>
            )}
            {prods.length > 0 && (
              <Group title="Products" count={prods.length}>
                {prods.slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="tap flex items-center gap-3 py-2.5 text-left">
                    <img src={p.image} alt="" className="h-11 w-11 rounded-[9px] object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{p.title}</p><p className="text-[12px] text-muted">{p.kind} · {inr(p.price)}</p></div>
                  </button>
                ))}
              </Group>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Suggest({ title, items, icon, onPick }: { title: string; items: string[]; icon: React.ReactNode; onPick: (s: string) => void }) {
  return (
    <section className="mb-6">
      <p className="mb-2 text-[13px] font-semibold text-ink">{title}</p>
      <div className="flex flex-col">
        {items.map((s) => (
          <button key={s} onClick={() => onPick(s)} className="tap flex items-center gap-3 py-2.5 text-left">{icon}<span className="flex-1 text-[14px] text-ink">{s}</span></button>
        ))}
      </div>
    </section>
  )
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mb-4 border-b border-border pb-3 last:border-0">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[13px] font-bold text-ink">{title} <span className="font-normal text-muted">({count})</span></p>
        {count > 3 && <button className="text-[12px] font-semibold text-brand">See all</button>}
      </div>
      {children}
    </section>
  )
}
