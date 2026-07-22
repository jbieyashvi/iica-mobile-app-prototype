import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { ArtistGalleryItem } from '../../data/publicArtists'

interface Props {
  items: ArtistGalleryItem[]
  startIndex: number
  onClose: () => void
}

export default function GalleryViewer({ items, startIndex, onClose }: Props) {
  const [i, setI] = useState(startIndex)
  const item = items[i]
  const prev = () => setI((n) => (n - 1 + items.length) % items.length)
  const next = () => setI((n) => (n + 1) % items.length)

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-ink" role="dialog" aria-modal="true">
      <div
        className="flex shrink-0 items-center justify-between px-3"
        style={{ paddingTop: 'calc(var(--safe-top) + 6px)', height: 'calc(var(--safe-top) + 52px)' }}
      >
        <span className="text-[12px] font-medium text-white/70">
          {i + 1} / {items.length}
        </span>
        <button
          aria-label="Close"
          onClick={onClose}
          className="tap flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2">
        <img src={item.url} alt={item.caption} className="max-h-full max-w-full rounded-[10px] object-contain" />
        {item.type === 'video' && (
          <span className="pointer-events-none absolute flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink">
            <Play className="ml-0.5 h-6 w-6 fill-ink" />
          </span>
        )}

        {items.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={prev}
              className="tap absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="tap absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div
        className="shrink-0 px-5 pt-3 text-center"
        style={{ paddingBottom: 'calc(18px + var(--safe-bottom))' }}
      >
        {item.caption && <p className="text-[14px] font-medium text-white">{item.caption}</p>}
        {item.date && <p className="text-[12px] text-white/60">{item.date}</p>}
      </div>
    </div>
  )
}
