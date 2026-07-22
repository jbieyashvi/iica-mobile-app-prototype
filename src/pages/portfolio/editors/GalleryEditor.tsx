import { useState } from 'react'
import {
  Plus, Star, Trash2, ChevronLeft, ChevronRight, X, Loader2, AlertTriangle, Video,
} from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import ConfirmSheet from '../../../components/portfolio/ConfirmSheet'
import TextField from '../../../components/form/TextField'
import PrimaryButton from '../../../components/PrimaryButton'
import { usePortfolio } from '../../../state/PortfolioContext'
import { GalleryImage, GalleryVideo } from '../../../portfolio/types'
import { PRESET_IMAGES } from '../../../portfolio/mockPortfolio'
import { useEditorNav } from './common'

const MAX_IMAGES = 20
const MAX_VIDEOS = 5
const newId = () => 'g' + Math.random().toString(36).slice(2, 9)

export default function GalleryEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('gallery')
  const { images, videos } = portfolio.gallery

  const [picking, setPicking] = useState<null | 'image' | 'video'>(null)
  const [uploading, setUploading] = useState(false)
  const [captionFor, setCaptionFor] = useState<string | null>(null)
  const [captionDraft, setCaptionDraft] = useState('')
  const [deleteImg, setDeleteImg] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const save = (imgs: GalleryImage[], vids: GalleryVideo[]) => {
    setSection('gallery', { images: imgs, videos: vids })
    bump()
  }

  const flash = (m: string) => {
    setNotice(m)
    setTimeout(() => setNotice(''), 2200)
  }

  const addImage = (url: string) => {
    if (images.length >= MAX_IMAGES) {
      setPicking(null)
      flash(`Limit reached — up to ${MAX_IMAGES} images.`)
      return
    }
    setPicking(null)
    setUploading(true)
    setTimeout(() => {
      const isFirst = images.length === 0
      save([...images, { id: newId(), url, caption: '', cover: isFirst }], videos)
      setUploading(false)
    }, 700)
  }

  const addVideo = (url: string) => {
    if (videos.length >= MAX_VIDEOS) {
      setPicking(null)
      flash(`Limit reached — up to ${MAX_VIDEOS} videos.`)
      return
    }
    setPicking(null)
    setUploading(true)
    setTimeout(() => {
      save(images, [...videos, { id: newId(), url, caption: 'Video clip' }])
      setUploading(false)
    }, 700)
  }

  const setCover = (id: string) =>
    save(images.map((i) => ({ ...i, cover: i.id === id })), videos)

  const move = (id: string, dir: -1 | 1) => {
    const idx = images.findIndex((i) => i.id === id)
    const to = idx + dir
    if (to < 0 || to >= images.length) return
    const next = [...images]
    ;[next[idx], next[to]] = [next[to], next[idx]]
    save(next, videos)
  }

  const removeImage = () => {
    if (!deleteImg) return
    let next = images.filter((i) => i.id !== deleteImg)
    if (!next.some((i) => i.cover) && next.length) next = next.map((i, k) => ({ ...i, cover: k === 0 }))
    save(next, videos)
    setDeleteImg(null)
  }

  const saveCaption = () => {
    save(
      images.map((i) => (i.id === captionFor ? { ...i, caption: captionDraft } : i)),
      videos,
    )
    setCaptionFor(null)
  }

  return (
    <EditorShell title="Media Gallery" revision={rev} onSaveContinue={goNext}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-[20px] text-ink">Images</h2>
        <span className="text-[12px] text-muted">{images.length}/{MAX_IMAGES}</span>
      </div>

      {uploading && (
        <div className="mb-3 flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2 text-[12.5px] text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-brand" /> Uploading media…
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center text-[13px] text-muted">
          No images yet. Add up to 20 images.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-[9px] border border-border bg-brand-soft"
            >
              <img src={img.url} alt={img.caption} className="h-full w-full object-cover" />
              {img.cover && (
                <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                  <Star className="h-2.5 w-2.5 fill-white" /> Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/55 px-1 py-1 backdrop-blur-sm">
                <button aria-label="Move left" onClick={() => move(img.id, -1)} disabled={i === 0} className="tap flex h-6 w-6 items-center justify-center text-white disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button aria-label="Set cover" onClick={() => setCover(img.id)} className="tap flex h-6 w-6 items-center justify-center text-white">
                  <Star className={`h-3.5 w-3.5 ${img.cover ? 'fill-white' : ''}`} />
                </button>
                <button aria-label="Delete" onClick={() => setDeleteImg(img.id)} className="tap flex h-6 w-6 items-center justify-center text-white">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button aria-label="Move right" onClick={() => move(img.id, 1)} disabled={i === images.length - 1} className="tap flex h-6 w-6 items-center justify-center text-white disabled:opacity-30">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  setCaptionFor(img.id)
                  setCaptionDraft(img.caption)
                }}
                className="absolute right-1 top-1 rounded bg-ink/55 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm"
              >
                Caption
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setPicking('image')}
        className="tap mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark hover:border-brand"
      >
        <Plus className="h-[18px] w-[18px]" /> Add Images
      </button>

      {/* Videos */}
      <div className="mt-8 border-t border-border pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-[20px] text-ink">Videos</h2>
          <span className="text-[12px] text-muted">{videos.length}/{MAX_VIDEOS}</span>
        </div>
        <p className="mb-3 flex items-center gap-1.5 text-[12px] text-muted">
          <Video className="h-3.5 w-3.5" /> Up to 2 minutes per video.
        </p>
        {videos.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {videos.map((v) => (
              <div key={v.id} className="relative aspect-video overflow-hidden rounded-[9px] border border-border bg-brand-soft">
                <img src={v.url} alt="" className="h-full w-full object-cover opacity-90" />
                <span className="absolute bottom-1 right-1 rounded bg-ink/70 px-1 py-0.5 text-[9px] font-semibold text-white">2:00</span>
                <button
                  aria-label="Delete video"
                  onClick={() => save(images, videos.filter((x) => x.id !== v.id))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded bg-ink/60 text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setPicking('video')}
          className="tap mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark hover:border-brand"
        >
          <Plus className="h-[18px] w-[18px]" /> Add Video
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Supported: JPG, PNG, MP4. Oversized or unsupported files are rejected in
        the prototype uploader.
      </p>

      {/* Picker sheet */}
      {picking && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setPicking(null)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-[19px] text-ink">
                Add {picking === 'image' ? 'image' : 'video'}
              </h3>
              <button aria-label="Close" onClick={() => setPicking(null)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-3 text-[12px] text-muted">Prototype uploader — pick a sample.</p>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_IMAGES.map((url) => (
                <button
                  key={url}
                  onClick={() => (picking === 'image' ? addImage(url) : addVideo(url))}
                  className="tap aspect-square overflow-hidden rounded-[9px] border border-border"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Caption editor */}
      {captionFor && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setCaptionFor(null)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h3 className="mb-3 font-serif text-[19px] text-ink">Edit caption</h3>
            <TextField label="Caption" value={captionDraft} onChange={setCaptionDraft} placeholder="Describe this image" />
            <div className="mt-4">
              <PrimaryButton full onClick={saveCaption}>Save Caption</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmSheet
        open={!!deleteImg}
        title="Delete this image?"
        body="This can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={removeImage}
        onCancel={() => setDeleteImg(null)}
      />

      {notice && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center px-6">
          <span className="rounded-full bg-ink px-4 py-2 text-center text-[12.5px] font-medium text-white shadow-subtle">
            {notice}
          </span>
        </div>
      )}
    </EditorShell>
  )
}
