import {
  User,
  BookOpen,
  Palette,
  Milestone,
  Award,
  PlayCircle,
  Users,
  CalendarDays,
  GraduationCap,
  Images,
  Quote,
  Link2,
  Handshake,
  LucideIcon,
} from 'lucide-react'
import { Portfolio } from './types'

export type SectionStatus = 'not-started' | 'in-progress' | 'complete'

export interface SectionDef {
  slug: string
  title: string
  description: string
  icon: LucideIcon
  required: boolean
  complete: (p: Portfolio) => boolean
  started: (p: Portfolio) => boolean
}

const nonEmpty = (v: string) => !!v && v.trim().length > 0

export const SECTIONS: SectionDef[] = [
  {
    slug: 'basics',
    title: 'Profile Basics',
    description: 'Name, headline, photo and location',
    icon: User,
    required: true,
    complete: (p) =>
      nonEmpty(p.basics.fullName) &&
      nonEmpty(p.basics.headline) &&
      nonEmpty(p.basics.city) &&
      nonEmpty(p.basics.country),
    started: (p) => nonEmpty(p.basics.headline) || nonEmpty(p.basics.city),
  },
  {
    slug: 'about',
    title: 'About & Life Journey',
    description: 'Short bio and journey chapters',
    icon: BookOpen,
    required: true,
    complete: (p) => nonEmpty(p.about.shortBio),
    started: (p) => nonEmpty(p.about.shortBio) || p.about.chapters.length > 0,
  },
  {
    slug: 'domain',
    title: 'Domain & Skills',
    description: 'Creative domain, skills and experience',
    icon: Palette,
    required: true,
    complete: (p) => nonEmpty(p.domain.primaryDomain) && p.domain.skills.length > 0,
    started: (p) => nonEmpty(p.domain.primaryDomain) || p.domain.skills.length > 0,
  },
  {
    slug: 'timeline',
    title: 'Highlights by Timeline',
    description: 'Milestones across your journey',
    icon: Milestone,
    required: true,
    complete: (p) => p.timeline.length >= 1,
    started: (p) => p.timeline.length >= 1,
  },
  {
    slug: 'awards',
    title: 'Awards & Recognition',
    description: 'Wins, nominations and certifications',
    icon: Award,
    required: false,
    complete: (p) => p.awards.length >= 1,
    started: (p) => p.awards.length >= 1,
  },
  {
    slug: 'media',
    title: 'Watch & Listen',
    description: 'Videos, tracks and external media',
    icon: PlayCircle,
    required: false,
    complete: (p) => p.media.length >= 1,
    started: (p) => p.media.length >= 1,
  },
  {
    slug: 'collaborations',
    title: 'Collaborations',
    description: 'Projects with other artists',
    icon: Users,
    required: false,
    complete: (p) => p.collaborations.length >= 1,
    started: (p) => p.collaborations.length >= 1,
  },
  {
    slug: 'performances',
    title: 'Performances & Events',
    description: 'Past shows and upcoming events',
    icon: CalendarDays,
    required: false,
    complete: (p) => p.pastPerformances.length >= 1,
    started: (p) => p.pastPerformances.length >= 1,
  },
  {
    slug: 'education',
    title: 'Education & Experience',
    description: 'Training and professional roles',
    icon: GraduationCap,
    required: false,
    complete: (p) => p.education.length >= 1 || p.experience.length >= 1,
    started: (p) => p.education.length >= 1 || p.experience.length >= 1,
  },
  {
    slug: 'gallery',
    title: 'Media Gallery',
    description: 'Images and short videos',
    icon: Images,
    required: false,
    complete: (p) => p.gallery.images.length >= 1,
    started: (p) => p.gallery.images.length >= 1 || p.gallery.videos.length >= 1,
  },
  {
    slug: 'testimonials',
    title: 'Testimonials',
    description: 'Reviews from the community',
    icon: Quote,
    required: false,
    complete: (p) => p.featuredTestimonials.length >= 1,
    started: (p) => p.featuredTestimonials.length >= 1,
  },
  {
    slug: 'social',
    title: 'Social Links',
    description: 'Instagram, YouTube, Spotify and more',
    icon: Link2,
    required: true,
    complete: (p) =>
      nonEmpty(p.social.instagram) &&
      nonEmpty(p.social.facebook) &&
      nonEmpty(p.social.youtube) &&
      nonEmpty(p.social.spotify),
    started: (p) =>
      nonEmpty(p.social.instagram) ||
      nonEmpty(p.social.youtube) ||
      nonEmpty(p.social.spotify),
  },
  {
    slug: 'collabPrefs',
    title: 'Collaboration Preferences',
    description: 'Availability and interests for matching',
    icon: Handshake,
    required: true,
    complete: (p) => nonEmpty(p.collabPrefs.availability) && p.collabPrefs.openTo.length > 0,
    started: (p) => nonEmpty(p.collabPrefs.availability) || p.collabPrefs.openTo.length > 0,
  },
]

export function sectionStatus(def: SectionDef, p: Portfolio): SectionStatus {
  if (def.complete(p)) return 'complete'
  if (def.started(p)) return 'in-progress'
  return 'not-started'
}

export function completion(p: Portfolio): number {
  const done = SECTIONS.filter((s) => s.complete(p)).length
  return Math.round((done / SECTIONS.length) * 100)
}

export function requiredSections() {
  return SECTIONS.filter((s) => s.required)
}

export function requiredComplete(p: Portfolio): boolean {
  return requiredSections().every((s) => s.complete(p))
}

export function getSection(slug?: string) {
  return SECTIONS.find((s) => s.slug === slug)
}
