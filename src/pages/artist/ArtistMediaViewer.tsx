import { useParams, useNavigate } from 'react-router-dom'
import { X, ExternalLink, Calendar } from 'lucide-react'
import MediaEmbed from '../../components/portfolio/MediaEmbed'
import PrimaryButton from '../../components/PrimaryButton'
import { usePublicArtist } from '../../data/usePublicArtist'

export default function ArtistMediaViewer() {
  const { slug, id } = useParams()
  const navigate = useNavigate()
  const { artist } = usePublicArtist(slug)
  const media = artist?.media.find((m) => m.id === id)

  const close = () => navigate(`/artist/${slug}`)

  if (!artist || !media) {
    return (
      <div className="flex h-full items-center justify-center bg-ink text-white">
        <button onClick={close} className="tap rounded-control bg-white/10 px-4 py-2 text-[14px]">Close</button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex shrink-0 items-center justify-between px-3" style={{ paddingTop: 'calc(var(--safe-top) + 6px)', height: 'calc(var(--safe-top) + 52px)' }}>
        <span className="text-[12px] font-medium text-white/70">{media.type}</span>
        <button aria-label="Close" onClick={close} className="tap flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8">
        <MediaEmbed
          item={{
            id: media.id, type: media.type, title: media.title, url: media.url,
            thumbnail: media.thumbnail, releaseDate: media.releaseDate ?? '',
            description: media.description ?? '', credits: media.credits ?? '', featured: !!media.featured,
          }}
        />

        <h1 className="mt-4 font-serif text-[22px] leading-tight text-white">{media.title}</h1>
        {media.releaseDate && (
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-white/60">
            <Calendar className="h-3.5 w-3.5" /> {media.releaseDate}
          </p>
        )}
        {media.credits && <p className="mt-2 text-[13px] text-white/70">{media.credits}</p>}
        {media.description && <p className="mt-3 text-[14px] leading-relaxed text-white/85">{media.description}</p>}

        <div className="mt-6">
          <a href={media.url} target="_blank" rel="noopener noreferrer" className="block">
            <PrimaryButton full>
              <ExternalLink className="h-4 w-4" /> Open on {media.type.includes('Spotify') ? 'Spotify' : media.type.includes('YouTube') ? 'YouTube' : 'source'}
            </PrimaryButton>
          </a>
          <p className="mt-3 text-center text-[11.5px] text-white/40">Prototype preview — media does not autoplay.</p>
        </div>
      </div>
    </div>
  )
}
