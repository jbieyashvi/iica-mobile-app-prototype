import { useParams } from 'react-router-dom'
import BackHeader from '../../components/BackHeader'
import Avatar from '../../components/Avatar'
import { usePublicArtist } from '../../data/usePublicArtist'

export default function ArtistJourney() {
  const { slug } = useParams()
  const { artist } = usePublicArtist(slug)

  if (!artist) return <BackHeader title="Journey" />

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Full Journey" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-12">
        {/* summary */}
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={artist.name} src={artist.photo} size={46} />
          <div className="min-w-0">
            <p className="truncate font-serif text-[18px] leading-tight text-ink">{artist.name}</p>
            <p className="truncate text-[12.5px] text-muted">{artist.headline}</p>
          </div>
        </div>

        <h1 className="mt-6 font-serif text-[30px] leading-tight text-ink">The Journey</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{artist.bio}</p>

        <div className="mt-8 flex flex-col gap-9">
          {artist.journey.map((c, i) => (
            <article key={c.id} className="relative">
              {c.date && (
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
                  {c.date}
                </span>
              )}
              <h2 className="mt-1 font-serif text-[23px] leading-tight text-ink">{c.heading}</h2>
              {c.image && (
                <div className="mt-3 aspect-[16/10] w-full overflow-hidden rounded-card border border-border bg-brand-soft">
                  <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
              )}
              <p className="mt-3 text-[15px] leading-[1.7] text-ink/90">{c.description}</p>
              {i < artist.journey.length - 1 && <div className="mt-9 h-px w-full bg-border" />}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
