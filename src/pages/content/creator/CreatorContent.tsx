import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Plus, Play, Image as ImageIcon, Music2, FileText, Megaphone, Eye, Heart, MessageCircle,
  MoreHorizontal, X, PencilLine, Share2, BarChart3, FolderInput, Archive, Trash2, Layers,
} from 'lucide-react'
import BottomNavigation from '../../../components/BottomNavigation'
import StatusBadge from '../../../components/StatusBadge'
import { useContentStore } from '../../../state/ContentContext'
import { useCreateGate } from '../../../state/CreateGate'
import { ContentRecord, ContentType, ContentStatus } from '../../../content/types'
import { fmtDate } from '../../../events/format'

const typeIcon: Record<ContentType, typeof Play> = { Video: Play, Image: ImageIcon, Audio: Music2, PDF: FileText, 'Artist Update': Megaphone }
const TABS: { key: string; status?: ContentStatus }[] = [
  { key: 'All' }, { key: 'Published', status: 'published' }, { key: 'Drafts', status: 'draft' },
  { key: 'Scheduled', status: 'scheduled' }, { key: 'Archived', status: 'archived' },
]

export default function CreatorContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { myContent } = useContentStore()
  const { startCreate } = useCreateGate()
  const [tab, setTab] = useState('All')
  const [menu, setMenu] = useState<ContentRecord | null>(null)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  useEffect(() => {
    const t = (location.state as { toast?: string } | null)?.toast
    if (t) { flash(t); navigate(location.pathname, { replace: true, state: {} }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const mine = myContent()
  const counts = useMemo(() => ({
    published: mine.filter((r) => r.status === 'published').length,
    draft: mine.filter((r) => r.status === 'draft').length,
    scheduled: mine.filter((r) => r.status === 'scheduled').length,
    views: mine.reduce((s, r) => s + r.views, 0),
  }), [mine])
  const list = useMemo(() => {
    const status = TABS.find((t) => t.key === tab)?.status
    return status ? mine.filter((r) => r.status === status) : mine
  }, [mine, tab])

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-bg/92 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex h-12 items-center justify-between px-[18px]">
          <h1 className="font-serif text-[22px] text-ink">My Content</h1>
          <button onClick={startCreate} className="tap flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[12.5px] font-semibold text-white"><Plus className="h-4 w-4" /> Create</button>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto pb-[calc(62px+var(--safe-bottom)+16px)]">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-2 px-[18px] pt-4">
          <Stat label="Published" value={counts.published} />
          <Stat label="Drafts" value={counts.draft} />
          <Stat label="Scheduled" value={counts.scheduled} />
          <Stat label="Total views" value={counts.views >= 1000 ? `${(counts.views / 1000).toFixed(1)}k` : counts.views} />
        </div>

        <div className="mt-3 flex items-center gap-2 px-[18px]">
          <button onClick={() => navigate('/creator/content/analytics')} className="tap flex flex-1 items-center justify-center gap-1.5 rounded-control border border-border bg-surface py-2.5 text-[12.5px] font-semibold text-ink hover:border-ink/20"><BarChart3 className="h-4 w-4 text-brand" /> Analytics</button>
          <button onClick={() => navigate('/creator/collections')} className="tap flex flex-1 items-center justify-center gap-1.5 rounded-control border border-border bg-surface py-2.5 text-[12.5px] font-semibold text-ink hover:border-ink/20"><Layers className="h-4 w-4 text-brand" /> Collections</button>
        </div>

        {/* Tabs */}
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-[18px]">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`tap shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${tab === t.key ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{t.key}</button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 px-[18px]">
          {list.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center">
              <p className="text-[14px] font-semibold text-ink">Nothing here yet</p>
              <p className="mt-1 text-[13px] text-muted">Create content to see it in this tab.</p>
              <button onClick={startCreate} className="tap mx-auto mt-4 flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white"><Plus className="h-4 w-4" /> Create Content</button>
            </div>
          ) : list.map((r) => {
            const Icon = typeIcon[r.type]
            return (
              <div key={r.id} className="flex gap-3 rounded-card border border-border bg-surface p-3">
                <button onClick={() => navigate(`/creator/content/${r.id}`)} className="tap relative h-[62px] w-[84px] shrink-0 overflow-hidden rounded-[9px] bg-brand-soft">
                  <img src={r.thumbnail} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-ink/60 px-1 py-0.5 text-[9px] font-semibold text-white"><Icon className="h-2.5 w-2.5" /></span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <button onClick={() => navigate(`/creator/content/${r.id}`)} className="tap min-w-0 text-left"><p className="truncate text-[13.5px] font-semibold text-ink">{r.title}</p></button>
                    <button onClick={() => setMenu(r)} aria-label="Actions" className="tap -mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-black/[0.04]"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <StatusBadge tone={r.status === 'published' ? 'success' : r.status === 'scheduled' ? 'warning' : r.status === 'archived' ? 'neutral' : 'neutral'}>{r.status}</StatusBadge>
                    <span className="text-[11px] text-muted">{r.visibility} · {fmtDate(r.date)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11.5px] text-muted">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {r.views.toLocaleString('en-IN')}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {r.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {r.comments}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNavigation />
      {menu && <RowMenu r={menu} onClose={() => setMenu(null)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[60] flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-card border border-border bg-surface px-2 py-2.5 text-center"><p className="font-serif text-[19px] leading-none text-ink">{value}</p><p className="mt-1 text-[10.5px] text-muted">{label}</p></div>
}

function RowMenu({ r, onClose, onToast }: { r: ContentRecord; onClose: () => void; onToast: (m: string) => void }) {
  const navigate = useNavigate()
  const { archiveRecord, deleteRecord } = useContentStore()
  const go = (to: string) => { onClose(); navigate(to) }
  const items = [
    { label: 'View', icon: Eye, run: () => go(`/content/${r.id}`) },
    { label: 'Edit', icon: PencilLine, run: () => go(`/creator/content/${r.id}/edit`) },
    { label: 'Share', icon: Share2, run: () => go(`/content/${r.id}/share`) },
    { label: 'View Analytics', icon: BarChart3, run: () => go('/creator/content/analytics') },
    { label: 'Add to Collection', icon: FolderInput, run: () => go(`/creator/content/${r.id}`) },
  ]
  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-3" style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}>
        <div className="mb-1 flex items-center justify-between px-2 pt-1"><p className="truncate text-[13px] font-semibold text-ink">{r.title}</p><button aria-label="Close" onClick={onClose} className="tap flex h-8 w-8 items-center justify-center rounded-control text-muted"><X className="h-4 w-4" /></button></div>
        <div className="flex flex-col">
          {items.map(({ label, icon: Icon, run }) => (
            <button key={label} onClick={run} className="tap flex min-h-[46px] items-center gap-3 rounded-control px-3 text-left text-[14px] font-semibold text-ink hover:bg-black/[0.03]"><Icon className="h-[18px] w-[18px] text-muted" /> {label}</button>
          ))}
          {r.status === 'draft' ? (
            <button onClick={() => { deleteRecord(r.id); onClose(); onToast('Draft deleted') }} className="tap flex min-h-[46px] items-center gap-3 rounded-control px-3 text-left text-[14px] font-semibold text-error hover:bg-[#F7E9EA]"><Trash2 className="h-[18px] w-[18px]" /> Delete Draft</button>
          ) : (
            <button onClick={() => { archiveRecord(r.id); onClose(); onToast('Content archived') }} className="tap flex min-h-[46px] items-center gap-3 rounded-control px-3 text-left text-[14px] font-semibold text-ink hover:bg-black/[0.03]"><Archive className="h-[18px] w-[18px] text-muted" /> Archive</button>
          )}
        </div>
      </div>
    </div>
  )
}
