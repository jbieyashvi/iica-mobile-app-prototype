import { useState } from 'react'
import { ImagePlus, Loader2, Trash2, X, Check } from 'lucide-react'
import { PRESET_IMAGES } from '../../portfolio/mockPortfolio'

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
  aspect?: string // tailwind aspect class e.g. 'aspect-square'
  optional?: boolean
  rounded?: 'full' | 'card'
}

// Mock upload: opens a picker of preset creator images and simulates upload progress.
export default function ImageUpload({
  label,
  value,
  onChange,
  aspect = 'aspect-[16/10]',
  optional,
  rounded = 'card',
}: Props) {
  const [picking, setPicking] = useState(false)
  const [uploading, setUploading] = useState(false)

  const pick = (url: string) => {
    setPicking(false)
    setUploading(true)
    setTimeout(() => {
      onChange(url)
      setUploading(false)
    }, 700)
  }

  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-card'

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[13px] font-semibold text-ink">{label}</span>
        {optional && <span className="text-[12px] text-muted">Optional</span>}
      </div>

      <div
        className={`relative ${aspect} w-full overflow-hidden border border-border bg-brand-soft ${radius}`}
      >
        {value && !uploading && (
          <img src={value} alt="" className="h-full w-full object-cover" />
        )}
        {uploading && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-[12px] font-medium text-muted">Uploading…</span>
          </div>
        )}
        {!value && !uploading && (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="tap flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted"
          >
            <ImagePlus className="h-6 w-6" strokeWidth={1.6} />
            <span className="text-[12px] font-medium">Tap to upload</span>
          </button>
        )}

        {value && !uploading && (
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="tap rounded-control bg-ink/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
            >
              Replace
            </button>
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange('')}
              className="tap flex h-7 w-7 items-center justify-center rounded-control bg-ink/70 text-white backdrop-blur-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {picking && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={() => setPicking(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5"
            style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-[19px] text-ink">Choose an image</h3>
              <button
                aria-label="Close"
                onClick={() => setPicking(false)}
                className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-3 text-[12px] text-muted">
              Prototype uploader — pick a sample image.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_IMAGES.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => pick(url)}
                  className="tap relative aspect-square overflow-hidden rounded-[9px] border border-border"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {value === url && (
                    <span className="absolute inset-0 flex items-center justify-center bg-brand/40">
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
