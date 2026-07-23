import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, Share2, FolderPlus, Plus, LayoutGrid, CalendarClock } from 'lucide-react'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import StatusBadge from '../../components/StatusBadge'
import ShareSheet from '../../components/explore/ShareSheet'
import { useContentStore } from '../../state/ContentContext'
import { fmtDate } from '../../events/format'

export default function Success() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: { id?: string } | null }
  const { getRecord, updateRecord } = useContentStore()
  const rec = getRecord(state?.id)
  const [share, setShare] = useState(false)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  if (!rec) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-bg px-8 text-center">
        <p className="text-[14px] text-muted">Content not found.</p>
        <div className="mt-4"><PrimaryButton onClick={() => navigate('/creator/content')}>Manage Content</PrimaryButton></div>
      </div>
    )
  }

  const scheduled = rec.status === 'scheduled'

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6" style={{ paddingTop: 'calc(40px + var(--safe-top))' }}>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
            {scheduled ? <CalendarClock className="h-8 w-8" strokeWidth={1.75} /> : <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />}
          </div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">{scheduled ? 'Your content is scheduled' : 'Your content is live'}</h1>
          <p className="mt-1.5 text-[14px] text-muted">{scheduled ? 'It will publish automatically at the scheduled time.' : 'It’s now discoverable across IICA.'}</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
          <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft"><img src={rec.thumbnail} alt="" className="h-full w-full object-cover" /></div>
          <div className="p-4">
            <h2 className="font-serif text-[18px] leading-tight text-ink">{rec.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-[12.5px] text-muted">
              <StatusBadge tone={rec.visibility === 'Public' ? 'success' : 'warning'}>{rec.visibility}</StatusBadge>
              <span>· {scheduled ? `Scheduled ${fmtDate(rec.releaseDate)}` : `Published ${fmtDate(rec.date)}`}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <PrimaryButton full onClick={() => navigate(`/content/${rec.id}`)}><Eye className="h-4 w-4" /> View Content</PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => setShare(true)}><Share2 className="h-4 w-4" /> Share</SecondaryButton>
            <SecondaryButton onClick={() => { updateRecord(rec.id, { addToPortfolio: true }); flash('Added to portfolio') }}><FolderPlus className="h-4 w-4" /> Add to Portfolio</SecondaryButton>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton onClick={() => navigate('/content/create')}><Plus className="h-4 w-4" /> Create Another</SecondaryButton>
            <SecondaryButton onClick={() => navigate('/creator/content')}><LayoutGrid className="h-4 w-4" /> Manage Content</SecondaryButton>
          </div>
          <button onClick={() => navigate('/home')} className="tap mt-1 min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Go to Home</button>
        </div>
      </div>

      {share && <ShareSheet title={rec.title} url={`https://iica.app/content/${rec.id}`} onClose={() => setShare(false)} onToast={flash} />}
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
