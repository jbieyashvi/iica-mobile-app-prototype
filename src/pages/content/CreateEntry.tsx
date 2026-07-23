import { useNavigate } from 'react-router-dom'
import { Play, Image as ImageIcon, Music2, FileText, Megaphone, ChevronRight, Layers } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import CreateProgress from '../../components/content/CreateProgress'
import { useContentStore } from '../../state/ContentContext'
import { ContentType, FORMAT_INFO, DEFAULT_SETTINGS } from '../../content/types'

const OPTIONS: { type: ContentType; icon: typeof Play }[] = [
  { type: 'Video', icon: Play },
  { type: 'Image', icon: ImageIcon },
  { type: 'Audio', icon: Music2 },
  { type: 'PDF', icon: FileText },
  { type: 'Artist Update', icon: Megaphone },
]

export default function CreateEntry() {
  const navigate = useNavigate()
  const { resetDraft } = useContentStore()

  const choose = (type: ContentType) => {
    resetDraft({ type, ...DEFAULT_SETTINGS, tags: [], credits: [], images: [], collectionId: null })
    navigate(type === 'Artist Update' ? '/content/create/details' : '/content/create/upload')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Create Content" />
      <CreateProgress step="Type" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-2">
        <h1 className="font-serif text-[24px] leading-tight text-ink">What would you like to share?</h1>
        <p className="mt-1 text-[13px] text-muted">Choose a format to begin. You can add details and settings next.</p>

        <div className="mt-5 flex flex-col gap-2.5">
          {OPTIONS.map(({ type, icon: Icon }) => {
            const info = FORMAT_INFO[type]
            return (
              <button key={type} onClick={() => choose(type)} className="tap flex items-center gap-3.5 rounded-card border border-border bg-surface p-3.5 text-left hover:border-ink/20">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft text-brand-dark"><Icon className="h-5 w-5" strokeWidth={1.75} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink">{type}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{info.blurb}</span>
                  <span className="mt-1 block text-[11px] text-muted">{info.formats} · {info.maxLabel}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </button>
            )
          })}
        </div>

        <button onClick={() => navigate('/content/create/bulk')} className="tap mt-4 flex w-full items-center gap-2.5 rounded-card border border-dashed border-border bg-surface p-3.5 text-left hover:border-ink/20">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-black/[0.04] text-muted"><Layers className="h-[18px] w-[18px]" /></span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-ink">Bulk Upload</span>
            <span className="text-[12px] text-muted">Upload multiple files at once (up to 10)</span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted" />
        </button>
      </div>
    </div>
  )
}
