import { usePortfolio } from '../state/PortfolioContext'
import { useAuth } from '../state/AuthContext'
import { Portfolio } from '../portfolio/types'
import { mockTestimonials } from '../portfolio/mockPortfolio'
import {
  ArtistReview,
  getMockArtist,
  PublicArtist,
  RatingSummary,
} from './publicArtists'

function ratingFrom(reviews: ArtistReview[]): RatingSummary {
  const dist: [number, number, number, number, number] = [0, 0, 0, 0, 0]
  reviews.forEach((r) => {
    const i = 5 - Math.min(5, Math.max(1, Math.round(r.rating)))
    dist[i] += 1
  })
  const total = reviews.length
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0
  return { avg: Math.round(avg * 10) / 10, total, distribution: dist }
}

// Convert the local Portfolio Builder data into a PublicArtist for the owner's page.
function fromPortfolio(p: Portfolio, name: string): PublicArtist {
  const reviews: ArtistReview[] = mockTestimonials
    .filter((t) => p.featuredTestimonials.includes(t.id) && !p.hiddenTestimonials.includes(t.id))
    .map((t) => ({
      id: t.id,
      author: t.author,
      relationship: t.role,
      date: t.date,
      rating: t.rating,
      text: t.text,
      verified: true,
      avatar: t.avatar,
    }))

  return {
    slug: p.slug,
    name: p.basics.fullName || name,
    headline: p.basics.headline,
    location: [p.basics.city, p.basics.country].filter(Boolean).join(', '),
    photo: p.basics.photo,
    cover: p.basics.cover,
    verified: true,
    primaryDomain: p.domain.primaryDomain === 'Other' ? p.domain.customDomain : p.domain.primaryDomain,
    tags: p.domain.skills,
    availability: (p.collabPrefs.availability as PublicArtist['availability']) || 'Available',
    availabilityLabel:
      p.collabPrefs.availability === 'Not Available'
        ? 'Not accepting collaborations right now'
        : p.collabPrefs.availability === 'Selectively Available'
          ? 'Available for selected collaborations'
          : 'Open to collaborations',
    visibility: p.basics.visibility,
    followers: 0,
    saves: 0,
    socials: {
      instagram: p.social.hidden.includes('instagram') ? '' : p.social.instagram,
      facebook: p.social.hidden.includes('facebook') ? '' : p.social.facebook,
      youtube: p.social.hidden.includes('youtube') ? '' : p.social.youtube,
      spotify: p.social.hidden.includes('spotify') ? '' : p.social.spotify,
      website: p.social.hidden.includes('website') ? '' : p.social.website,
      x: p.social.hidden.includes('x') ? '' : p.social.x,
      linkedin: p.social.hidden.includes('linkedin') ? '' : p.social.linkedin,
      custom: p.social.custom.filter((c) => c.url && !p.social.hidden.includes(c.id)).map((c) => ({ label: c.label, url: c.url })),
    },
    whatsNew: [],
    bio: p.about.shortBio,
    experienceYears: parseInt(p.domain.experience, 10) || 0,
    languages: p.domain.performanceLanguages,
    skills: p.domain.skills,
    journey: p.about.chapters.map((c) => ({ id: c.id, heading: c.heading, description: c.description, date: c.date, image: c.image })),
    timeline: [...p.timeline]
      .sort((a, b) => (parseInt(a.date, 10) || 0) - (parseInt(b.date, 10) || 0))
      .map((m) => ({ id: m.id, year: String(m.date).slice(0, 4), title: m.title, category: m.category, description: m.description, image: m.media, link: m.link })),
    awards: p.awards.map((a) => ({ id: a.id, year: String(a.year).slice(0, 4), name: a.name, org: a.org, recognitionType: a.recognitionType, project: a.project, link: a.link })),
    media: p.media.map((m) => ({ id: m.id, type: m.type, title: m.title, url: m.url, thumbnail: m.thumbnail, releaseDate: m.releaseDate, description: m.description, credits: m.credits, featured: m.featured })),
    collaborations: p.collaborations.map((c) => ({
      id: c.id,
      artistName: c.artistName === 'External artist' ? c.externalName : c.artistName,
      artistId: c.artistId || undefined,
      isMember: c.artistName !== 'External artist',
      project: c.project,
      date: c.date,
      role: c.role,
      projectType: c.projectType,
      link: c.link,
      image: c.image,
      awarded: c.awarded,
      awardName: c.awardName,
      awardCategory: c.awardCategory,
      awardYear: c.awardYear,
    })),
    upcomingEvents: [],
    pastEvents: p.pastPerformances.map((e) => ({ id: e.id, name: e.name, date: e.date, venue: [e.venue, e.city].filter(Boolean).join(', '), media: e.mediaLink })),
    gallery: [
      ...p.gallery.images.map((g) => ({ id: g.id, url: g.url, caption: g.caption, type: 'image' as const })),
      ...p.gallery.videos.map((v) => ({ id: v.id, url: v.url, caption: v.caption, type: 'video' as const })),
    ],
    reviews,
    ratingSummary: ratingFrom(reviews),
  }
}

export interface ResolvedArtist {
  artist: PublicArtist | null
  isOwn: boolean
}

export function usePublicArtist(slug?: string): ResolvedArtist {
  const { portfolio } = usePortfolio()
  const { state } = useAuth()

  const isOwn = state.role === 'active' && !!slug && portfolio.slug === slug
  if (isOwn) {
    return { artist: fromPortfolio(portfolio, state.name), isOwn: true }
  }
  return { artist: getMockArtist(slug) ?? null, isOwn: false }
}
