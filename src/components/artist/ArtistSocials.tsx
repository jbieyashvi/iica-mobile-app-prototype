import { Instagram, Facebook, Youtube, Music2, Globe, Twitter, Linkedin, Link2 } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { ArtistSocials as Socials } from '../../data/publicArtists'

export default function ArtistSocials({ socials }: { socials: Socials }) {
  const rows: { icon: LucideIcon; url?: string; label: string }[] = [
    { icon: Instagram, url: socials.instagram, label: 'Instagram' },
    { icon: Facebook, url: socials.facebook, label: 'Facebook' },
    { icon: Youtube, url: socials.youtube, label: 'YouTube' },
    { icon: Music2, url: socials.spotify, label: 'Spotify' },
    { icon: Globe, url: socials.website, label: 'Website' },
    { icon: Twitter, url: socials.x, label: 'X' },
    { icon: Linkedin, url: socials.linkedin, label: 'LinkedIn' },
  ]
  const visible = rows.filter((r) => r.url)
  const custom = socials.custom?.filter((c) => c.url) ?? []
  if (visible.length === 0 && custom.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((r) => {
        const Icon = r.icon
        return (
          <a
            key={r.label}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={r.label}
            className="tap flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-ink hover:border-ink/30"
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
          </a>
        )
      })}
      {custom.map((c) => (
        <a
          key={c.url}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={c.label}
          className="tap flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-[12px] font-semibold text-ink hover:border-ink/30"
        >
          <Link2 className="h-4 w-4" /> {c.label}
        </a>
      ))}
    </div>
  )
}
