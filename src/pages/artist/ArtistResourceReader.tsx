import { useParams } from 'react-router-dom'
import { FileText, Download } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import StatusBadge from '../../components/StatusBadge'
import { usePublicArtist } from '../../data/usePublicArtist'

// Simple in-app PDF reader/preview for a creator's free resource.
// Real uploads (data: URLs) render in an <iframe>; demo/large items show a
// prototype placeholder. No payment, cart or download-gating — always free.
export default function ArtistResourceReader() {
  const { slug, id } = useParams()
  const { artist } = usePublicArtist(slug)
  const resource = artist?.freeResources?.find((r) => r.id === id)

  if (!artist || !resource) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Resource" fallback={slug ? `/artist/${slug}` : '/home'} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="font-serif text-[20px] text-ink">Resource not found</p>
          <p className="mt-1 text-[13px] text-muted">This free resource isn’t available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader
        title="Free Reader"
        fallback={`/artist/${artist.slug}`}
        right={
          resource.pdfData ? (
            <a
              href={resource.pdfData}
              download={resource.pdfName || 'resource.pdf'}
              aria-label="Download PDF"
              className="tap flex h-10 w-10 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"
            >
              <Download className="h-5 w-5" />
            </a>
          ) : undefined
        }
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8 pt-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-brand-soft text-brand-dark">
            {resource.cover ? <img src={resource.cover} alt="" className="h-full w-full object-cover" /> : <FileText className="h-6 w-6" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1"><StatusBadge tone="success">Free</StatusBadge></div>
            <h1 className="font-serif text-[20px] leading-tight text-ink">{resource.title}</h1>
            {resource.author && <p className="mt-0.5 text-[12.5px] text-muted">by {resource.author}</p>}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11.5px]">
          {resource.category && <span className="rounded-[7px] border border-border bg-surface px-2 py-1 font-medium text-ink">{resource.category}</span>}
          {resource.year && <span className="rounded-[7px] border border-border bg-surface px-2 py-1 font-medium text-ink">{resource.year}</span>}
          {resource.language && <span className="rounded-[7px] border border-border bg-surface px-2 py-1 font-medium text-ink">{resource.language}</span>}
        </div>

        {resource.description && (
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{resource.description}</p>
        )}

        {/* Reader */}
        <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface">
          {resource.pdfData ? (
            <iframe
              title={resource.title}
              src={resource.pdfData}
              className="h-[62vh] w-full bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                <FileText className="h-8 w-8" strokeWidth={1.6} />
              </span>
              <p className="mt-4 font-serif text-[18px] text-ink">{resource.pdfName || 'Preview'}</p>
              <p className="mt-1.5 max-w-[260px] text-[12.5px] leading-relaxed text-muted">
                Prototype preview. In the production app the full PDF opens here in
                the in-app reader. This sample resource has no bundled file.
              </p>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-[11.5px] text-muted">
          This resource is free. No payment or account purchase is required.
        </p>
      </div>
    </div>
  )
}
