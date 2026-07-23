import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, Heart, MessageCircle, Bookmark, Share2, Download, PencilLine, BarChart3, Archive, Trash2 } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import { useContentStore } from '../../../state/ContentContext'
import { fmtDate } from '../../../events/format'

export default function CreatorContentManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecord, collections, setCollection, archiveRecord, deleteRecord } = useContentStore()
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1500) }
  const item = getRecord(id)
  const col = useMemo(() => collections.find((c) => c.id === item?.collectionId), [collections, item])
  if (!item) return <BackHeader title="Content" />

  const stats = [
    { label: 'Views', value: item.views, icon: Eye },
    { label: 'Likes', value: item.likes, icon: Heart },
    { label: 'Comments', value: item.comments, icon: MessageCircle },
    { label: 'Saves', value: item.saves, icon: Bookmark },
    { label: 'Shares', value: item.shares, icon: Share2 },
    { label: 'Downloads', value: item.downloads, icon: Download },
  ]

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Manage Content" right={
        <button onClick={() => navigate(`/creator/content/${item.id}/edit`)} aria-label="Edit" className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><PencilLine className="h-5 w-5" /></button>
      } />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft"><img src={item.thumbnail} alt="" className="h-full w-full object-cover" /></div>
          <div className="p-4">
            <h1 className="font-serif text-[19px] leading-tight text-ink">{item.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <StatusBadge tone={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'neutral'}>{item.status}</StatusBadge>
              <span className="text-[12px] text-muted">{item.type} · {item.visibility} · {fmtDate(item.date)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-card border border-border bg-surface px-2 py-3 text-center">
              <Icon className="mx-auto h-4 w-4 text-brand" />
              <p className="mt-1 font-serif text-[17px] leading-none text-ink">{value.toLocaleString('en-IN')}</p>
              <p className="mt-0.5 text-[10.5px] text-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[13px] font-semibold text-ink">Collection</p>
          <div className="flex flex-col gap-2">
            <ColRow label="No Collection" active={!item.collectionId} onClick={() => { setCollection(item.id, null); flash('Removed from collection') }} />
            {collections.map((c) => <ColRow key={c.id} label={c.name} active={item.collectionId === c.id} onClick={() => { setCollection(item.id, c.id); flash(`Added to ${c.name}`) }} />)}
          </div>
          {col && <p className="mt-2 text-[12px] text-muted">Currently in {col.name}</p>}
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/content/${item.id}`)}><Eye className="h-4 w-4" /> View Public Page</PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => navigate(`/creator/content/${item.id}/edit`)}><PencilLine className="h-4 w-4" /> Edit</SecondaryButton>
            <SecondaryButton onClick={() => navigate('/creator/content/analytics')}><BarChart3 className="h-4 w-4" /> Analytics</SecondaryButton>
          </div>
          {item.status === 'draft' ? (
            <button onClick={() => { deleteRecord(item.id); navigate('/creator/content', { state: { toast: 'Draft deleted' } }) }} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control border border-error/30 bg-bg text-[14px] font-semibold text-error hover:bg-[#F7E9EA]"><Trash2 className="h-4 w-4" /> Delete Draft</button>
          ) : (
            <button onClick={() => { archiveRecord(item.id); navigate('/creator/content', { state: { toast: 'Content archived' } }) }} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink hover:border-ink/25"><Archive className="h-4 w-4" /> Archive</button>
          )}
        </div>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function ColRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`tap flex min-h-[44px] items-center justify-between rounded-control border px-4 text-[13.5px] font-semibold ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>
      {label}{active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
    </button>
  )
}
