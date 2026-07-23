import { useState } from 'react'
import {
  Play, Pause, Volume2, Maximize2, Captions, ChevronLeft, ChevronRight,
  ZoomIn, FileText, Megaphone, Download, Gauge,
} from 'lucide-react'
import { ContentRecord } from '../../content/types'

const SPEEDS = ['1x', '1.25x', '1.5x', '2x']

// Simulated media viewers/players — no real streaming. Driven by typed metadata.
export default function MediaViewer({ item, canDownload, onDownload }: { item: ContentRecord; canDownload?: boolean; onDownload?: () => void }) {
  if (item.type === 'Video') return <VideoSim item={item} />
  if (item.type === 'Audio') return <AudioSim item={item} />
  if (item.type === 'Image') return <ImageSim item={item} />
  if (item.type === 'PDF') return <PdfSim item={item} canDownload={canDownload} onDownload={onDownload} />
  return <UpdateSim item={item} />
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-border bg-ink">{children}</div>
}

function VideoSim({ item }: { item: ContentRecord }) {
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(28)
  const [speed, setSpeed] = useState(0)
  const [captions, setCaptions] = useState(false)
  return (
    <div>
      <Frame>
        <img src={item.thumbnail} alt="" className="h-full w-full object-cover opacity-90" />
        <button onClick={() => setPlaying((p) => !p)} className="tap absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink shadow-subtle">
            {playing ? <Pause className="h-7 w-7 fill-ink" /> : <Play className="ml-1 h-7 w-7 fill-ink" />}
          </span>
        </button>
        {captions && <span className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded bg-ink/75 px-2 py-1 text-[12px] text-white">[ captions on ]</span>}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-3 pb-2 pt-6 text-white">
          <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} className="h-1 w-full accent-brand" aria-label="Seek" />
          <div className="mt-1 flex items-center gap-3 text-[11px]">
            <button onClick={() => setPlaying((p) => !p)} className="tap">{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
            <span>{item.duration ?? '2:14'}</span>
            <Volume2 className="h-4 w-4" />
            <button onClick={() => setSpeed((s) => (s + 1) % SPEEDS.length)} className="tap flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {SPEEDS[speed]}</button>
            {item.captionsAvailable && <button onClick={() => setCaptions((c) => !c)} className={`tap ${captions ? 'text-brand' : ''}`}><Captions className="h-4 w-4" /></button>}
            <Maximize2 className="ml-auto h-4 w-4" />
          </div>
        </div>
      </Frame>
    </div>
  )
}

function AudioSim({ item }: { item: ContentRecord }) {
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(34)
  const [speed, setSpeed] = useState(0)
  return (
    <div className="flex items-center gap-4 rounded-card border border-border bg-surface p-4">
      <img src={item.cover ?? item.thumbnail} alt="" className="h-20 w-20 shrink-0 rounded-[10px] object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-ink">{item.trackTitle ?? item.title}</p>
        <p className="truncate text-[12px] text-muted">{item.performer ?? item.creator}{item.genre ? ` · ${item.genre}` : ''}</p>
        <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} className="mt-2 h-1 w-full accent-brand" aria-label="Seek" />
        <div className="mt-1.5 flex items-center gap-3 text-[12px] text-muted">
          <button onClick={() => setPlaying((p) => !p)} className="tap flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
            {playing ? <Pause className="h-4 w-4 fill-white" /> : <Play className="ml-0.5 h-4 w-4 fill-white" />}
          </button>
          <span>{item.duration ?? '3:42'}</span>
          <button onClick={() => setSpeed((s) => (s + 1) % SPEEDS.length)} className="tap ml-auto flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {SPEEDS[speed]}</button>
        </div>
      </div>
    </div>
  )
}

function ImageSim({ item }: { item: ContentRecord }) {
  const imgs = item.images.length ? item.images : [item.thumbnail]
  const [i, setI] = useState(0)
  const gallery = imgs.length > 1
  return (
    <div>
      <Frame>
        <img src={imgs[i]} alt={item.altText ?? ''} className="h-full w-full object-contain bg-ink" />
        <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/50 text-white"><ZoomIn className="h-4 w-4" /></span>
        {gallery && <>
          <button onClick={() => setI((x) => (x - 1 + imgs.length) % imgs.length)} aria-label="Previous" className="tap absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => setI((x) => (x + 1) % imgs.length)} aria-label="Next" className="tap absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white"><ChevronRight className="h-5 w-5" /></button>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-2 py-0.5 text-[11px] text-white">{i + 1} / {imgs.length}</span>
        </>}
      </Frame>
      {gallery && (
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {imgs.map((src, k) => (
            <button key={k} onClick={() => setI(k)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-[8px] border-2 ${k === i ? 'border-brand' : 'border-transparent'}`}>
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {item.caption && <p className="mt-2 text-[12.5px] text-muted">{item.caption}</p>}
    </div>
  )
}

function PdfSim({ item, canDownload, onDownload }: { item: ContentRecord; canDownload?: boolean; onDownload?: () => void }) {
  const total = item.pages ?? 18
  const [page, setPage] = useState(1)
  return (
    <div className="rounded-card border border-border bg-surface p-3">
      <div className="relative mx-auto aspect-[3/4] w-2/3 overflow-hidden rounded-[8px] border border-border bg-white">
        <img src={item.cover ?? item.thumbnail} alt="" className="h-full w-full object-cover opacity-90" />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-ink/60 py-1 text-[11px] text-white"><FileText className="h-3 w-3" /> Page {page} of {total}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border"><ChevronLeft className="h-5 w-5" /></button>
        <span className="text-[12px] text-muted">{page} / {total}</span>
        <button onClick={() => setPage((p) => Math.min(total, p + 1))} className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border"><ChevronRight className="h-5 w-5" /></button>
        <button className="tap ml-2 flex h-9 w-9 items-center justify-center rounded-control border border-border"><Maximize2 className="h-4 w-4" /></button>
      </div>
      {canDownload && (
        <button onClick={onDownload} className="tap mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-control border border-border bg-bg text-[13px] font-semibold text-ink hover:border-ink/25"><Download className="h-4 w-4" /> Download PDF</button>
      )}
    </div>
  )
}

function UpdateSim({ item }: { item: ContentRecord }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-dark"><Megaphone className="h-3 w-3" /> {item.updateType ?? 'Update'}</span>
      {item.headline && <h3 className="mt-2 font-serif text-[20px] leading-tight text-ink">{item.headline}</h3>}
      <p className="mt-1.5 whitespace-pre-wrap text-[14px] leading-relaxed text-ink/90">{item.updateText ?? item.fullDescription}</p>
      {item.images[0] && <img src={item.images[0]} alt="" className="mt-3 w-full rounded-[10px] object-cover" />}
      {item.ctaLabel && (
        <a href={item.ctaUrl || '#'} onClick={(e) => { if (!item.ctaUrl) e.preventDefault() }} className="tap mt-3 inline-flex min-h-[40px] items-center rounded-control bg-brand px-4 text-[13px] font-semibold text-white">{item.ctaLabel}</a>
      )}
    </div>
  )
}
