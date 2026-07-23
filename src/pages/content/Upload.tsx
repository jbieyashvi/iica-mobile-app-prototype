import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, X, RefreshCw, CheckCircle2, AlertTriangle, FileUp, Sparkles } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import CreateProgress from '../../components/content/CreateProgress'
import PrimaryButton from '../../components/PrimaryButton'
import { useContentStore } from '../../state/ContentContext'
import { FORMAT_INFO, DEMO_FILES, ContentType } from '../../content/types'

type Phase = 'idle' | 'uploading' | 'error' | 'done'

export default function Upload() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useContentStore()
  const type = (draft.type ?? 'Image') as ContentType
  const info = FORMAT_INFO[type]
  const inputRef = useRef<HTMLInputElement>(null)

  const [phase, setPhase] = useState<Phase>(draft.fileName ? 'done' : 'idle')
  const [pct, setPct] = useState(0)
  const [error, setError] = useState('')
  const [name, setName] = useState(draft.fileName ?? '')
  const [size, setSize] = useState(draft.fileSize ?? '')
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  // Artist Update skips mandatory upload.
  useEffect(() => {
    if (type === 'Artist Update') navigate('/content/create/details', { replace: true })
  }, [type, navigate])

  const startUpload = (fileName: string, fileSize: string, preview: string, extra: { duration?: string; pages?: number } = {}) => {
    setName(fileName); setSize(fileSize); setError(''); setPhase('uploading'); setPct(0)
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          if (timer.current) clearInterval(timer.current)
          setPhase('done')
          saveDraft({ fileName, fileSize, thumbnail: preview, cover: preview, images: type === 'Image' ? [preview] : (draft.images ?? []), ...extra })
          return 100
        }
        return p + 10
      })
    }, 90)
  }

  const onPick = (f: File | null) => {
    if (!f) return
    const okType = info.accept.split(',').some((a) => f.type === a || (a.endsWith('/*') && f.type.startsWith(a.slice(0, -1))))
    if (!okType) { setName(f.name); setPhase('error'); setError(`Unsupported format. Allowed: ${info.formats}.`); return }
    if (f.size > info.maxMB * 1024 * 1024) { setName(f.name); setPhase('error'); setError(`File too large. Maximum ${info.maxLabel}.`); return }
    const mb = (f.size / (1024 * 1024)).toFixed(1) + ' MB'
    // Real bytes aren't stored (prototype) — a format preview stands in for the thumbnail.
    startUpload(f.name, mb, DEMO_FILES[type]?.preview ?? '')
  }

  const useDemo = () => {
    const d = DEMO_FILES[type]
    if (!d) return
    startUpload(d.fileName, d.fileSize, d.preview, { duration: d.duration, pages: d.pages })
  }

  const cancel = () => { if (timer.current) clearInterval(timer.current); setPhase('idle'); setPct(0); setName(''); setSize('') }
  const replace = () => { setPhase('idle'); setPct(0); setError(''); setName(''); setSize(''); saveDraft({ fileName: undefined, fileSize: undefined }) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={`Upload ${type}`} />
      <CreateProgress step="Upload" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-2">
        <input ref={inputRef} type="file" accept={info.accept} className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />

        {phase === 'idle' && (
          <>
            <button onClick={() => inputRef.current?.click()} className="tap flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed border-border bg-surface px-6 py-10 text-center hover:border-brand/40">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><UploadCloud className="h-6 w-6" /></span>
              <span className="mt-1 text-[15px] font-semibold text-ink">Drag & drop or browse</span>
              <span className="text-[12.5px] text-muted">{info.formats} · up to {info.maxLabel}</span>
            </button>
            <div className="mt-3 flex flex-col gap-2.5">
              <button onClick={() => inputRef.current?.click()} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink hover:border-ink/25"><FileUp className="h-4 w-4" /> Browse Files</button>
              <button onClick={useDemo} className="tap flex min-h-[46px] items-center justify-center gap-2 rounded-control bg-brand-soft text-[14px] font-semibold text-brand-dark hover:bg-brand-soft/70"><Sparkles className="h-4 w-4" /> Use Demo File</button>
            </div>
          </>
        )}

        {phase === 'uploading' && (
          <div className="rounded-card border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="truncate text-[14px] font-semibold text-ink">{name}</p>
              <button onClick={cancel} aria-label="Cancel" className="tap flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/[0.04]"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 text-[12px] text-muted">Uploading… {pct}%</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="rounded-card border border-error/30 bg-[#F7E9EA] p-4">
            <div className="flex items-center gap-2 text-error"><AlertTriangle className="h-5 w-5" /><p className="text-[14px] font-semibold">Upload failed</p></div>
            <p className="mt-1 text-[13px] text-[#8a3a3f]">{error}</p>
            {name && <p className="mt-1 truncate text-[12px] text-muted">{name}</p>}
            <div className="mt-3 flex gap-2.5">
              <button onClick={replace} className="tap flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-control border border-border bg-surface text-[13px] font-semibold text-ink"><RefreshCw className="h-4 w-4" /> Choose another</button>
              <button onClick={useDemo} className="tap flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-control bg-brand text-[13px] font-semibold text-white"><Sparkles className="h-4 w-4" /> Use Demo File</button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="rounded-card border border-border bg-surface p-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-brand-soft">
              <img src={draft.thumbnail || DEMO_FILES[type]?.preview} alt="" className="h-full w-full object-cover" />
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[11px] font-semibold text-white"><CheckCircle2 className="h-3 w-3" /> Uploaded</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-ink">{name}</p>
                <p className="text-[12px] text-muted">{size}{draft.duration ? ` · ${draft.duration}` : ''}{draft.pages ? ` · ${draft.pages} pages` : ''}</p>
              </div>
              <button onClick={replace} className="tap flex items-center gap-1 text-[12.5px] font-semibold text-brand"><RefreshCw className="h-3.5 w-3.5" /> Replace</button>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full disabled={phase !== 'done'} onClick={() => navigate('/content/create/details')}>Continue</PrimaryButton>
      </div>
    </div>
  )
}
