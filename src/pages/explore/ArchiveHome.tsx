import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import ExploreShell from '../../components/explore/ExploreShell'
import ArchiveVideoCard from '../../components/archive/ArchiveVideoCard'
import { useSaveGate } from '../../components/SaveGate'
import { useArchive } from '../../data/useArchive'
import { ArchiveVideo, ARCHIVE_SECTIONS, archiveFeaturedScore } from '../../data/archive'
import { VIDEO_CATEGORIES } from '../../lib/youtube'

const KEY = 'iica_archive_v1'
type Sort = 'Latest' | 'Oldest' | 'Most Viewed'

interface Saved { q: string; category: string; sort: Sort }

export default function ArchiveHome() {
  const navigate = useNavigate()
  const { save, isSaved, sheet } = useSaveGate()
  const videos = useArchive()

  const seed = useMemo<Saved>(() => {
    try {
      const raw = sessionStorage.getItem(KEY)
      if (raw) return JSON.parse(raw) as Saved
    } catch { /* ignore */ }
    return { q: '', category: '', sort: 'Latest' }
  }, [])

  const [q, setQ] = useState(seed.q)
  const [category, setCategory] = useState(seed.category)
  const [sort, setSort] = useState<Sort>(seed.sort)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ q, category, sort })) } catch { /* ignore */ }
  }, [q, category, sort])

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const anyActive = q.trim().length > 0 || category.length > 0

  const filtered = useMemo(() => {
    let r = videos
    const query = q.trim().toLowerCase()
    if (query) r = r.filter((v) => (v.title + ' ' + v.creatorName + ' ' + v.category + ' ' + v.tags.join(' ')).toLowerCase().includes(query))
    if (category) r = r.filter((v) => v.category === category)
    const byDate = (a: ArchiveVideo, b: ArchiveVideo) => b.date.localeCompare(a.date)
    if (sort === 'Latest') r = [...r].sort(byDate)
    if (sort === 'Oldest') r = [...r].sort((a, b) => a.date.localeCompare(b.date))
    if (sort === 'Most Viewed') r = [...r].sort((a, b) => b.views - a.views)
    return r
  }, [videos, q, category, sort])

  const featured = useMemo(
    () => [...videos].sort((a, b) => archiveFeaturedScore(b) - archiveFeaturedScore(a)).slice(0, 5),
    [videos],
  )
  const latest = useMemo(() => [...videos].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8), [videos])

  const openVideo = (v: ArchiveVideo) => navigate(`/archive/video/${v.id}`, { state: { from: '/explore/archive' } })
  const openCreator = (v: ArchiveVideo) => navigate(`/artist/${v.creatorSlug}`, { state: { from: '/explore/archive' } })
  const onSave = (v: ArchiveVideo) => save('video:' + v.id)
  const onShare = (v: ArchiveVideo) => { navigator.clipboard?.writeText(`https://iica.app/archive/video/${v.id}`); flash('Link copied') }

  const card = (v: ArchiveVideo, variant: 'rail' | 'list') => (
    <ArchiveVideoCard key={v.id} video={v} variant={variant}
      saved={isSaved('video:' + v.id)} onOpen={() => openVideo(v)} onCreator={() => openCreator(v)}
      onSave={() => onSave(v)} onShare={() => onShare(v)} />
  )

  return (
    <ExploreShell active="archive">
      <div className="px-[18px] pt-4">
        <h1 className="font-serif text-[24px] leading-tight text-ink">Archive</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">Watch performances, conversations and creative work from IICA creators.</p>

        {/* search */}
        <div className="mt-3 flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos, creators, tags" className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-muted focus:outline-none" />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><X className="h-4 w-4 text-muted" /></button>}
        </div>

        {/* category + sort */}
        <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCategory('')} className={chip(!category)}>All</button>
          {VIDEO_CATEGORIES.filter((c) => c !== 'Other').map((c) => (
            <button key={c} onClick={() => setCategory(category === c ? '' : c)} className={chip(category === c)}>{c}</button>
          ))}
        </div>
        <div className="no-scrollbar mt-1.5 flex gap-2 overflow-x-auto pb-1">
          {(['Latest', 'Oldest', 'Most Viewed'] as Sort[]).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`tap shrink-0 rounded-control px-2.5 py-1 text-[11.5px] font-semibold ${sort === s ? 'text-brand underline decoration-2 underline-offset-4' : 'text-muted'}`}>{s}</button>
          ))}
        </div>
      </div>

      {anyActive ? (
        /* Filtered flat list */
        <div className="px-[18px] py-4">
          <p className="mb-3 text-[12.5px] font-semibold text-muted">{filtered.length === 0 ? 'No videos found' : `${filtered.length} video${filtered.length === 1 ? '' : 's'}`}</p>
          {filtered.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-10 text-center text-[13px] text-muted">
              No Archive videos match. <button onClick={() => { setQ(''); setCategory('') }} className="font-semibold text-brand">Clear</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">{filtered.map((v) => card(v, 'list'))}</div>
          )}
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <Section title="Featured">
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{featured.map((v) => card(v, 'rail'))}</div>
            </Section>
          )}
          {/* Latest */}
          {latest.length > 0 && (
            <Section title="Latest Additions">
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{latest.map((v) => card(v, 'rail'))}</div>
            </Section>
          )}
          {/* Category sections (only when non-empty) */}
          {ARCHIVE_SECTIONS.map((sec) => {
            const items = videos.filter((v) => sec.categories.includes(v.category))
            if (items.length === 0) return null
            return (
              <Section key={sec.key} title={sec.title}>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">{items.map((v) => card(v, 'rail'))}</div>
              </Section>
            )
          })}
        </>
      )}

      <div className="h-4" />
      {sheet}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </ExploreShell>
  )
}

function chip(active: boolean) {
  return `tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${active ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2.5 px-[18px] font-serif text-[18px] text-ink">{title}</h2>
      {children}
    </section>
  )
}
