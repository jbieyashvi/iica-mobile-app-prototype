// ---- Portfolio data model (prototype, persisted to localStorage) ----

export type Visibility = 'Public' | 'Members Only'

export interface ProfileBasics {
  photo: string
  cover: string
  fullName: string
  stageName: string
  headline: string
  city: string
  country: string
  dob: string
  gender: string
  languages: string
  pronouns: string
  visibility: Visibility
}

export interface JourneyChapter {
  id: string
  heading: string
  description: string
  date: string
  image: string
}

export interface About {
  shortBio: string
  chapters: JourneyChapter[]
}

export interface DomainSkills {
  primaryDomain: string
  customDomain: string
  secondaryDomains: string
  subdomains: string
  skills: string[]
  experience: string
  performanceLanguages: string
  styles: string
}

export interface Milestone {
  id: string
  title: string
  date: string // "YYYY" or "YYYY-MM"
  category: string
  description: string
  media: string
  link: string
  featured: boolean
}

export interface Award {
  id: string
  name: string
  org: string
  year: string
  category: string
  project: string
  recognitionType: string
  description: string
  image: string
  link: string
  featured: boolean
}

export interface MediaItem {
  id: string
  type: string
  title: string
  url: string
  thumbnail: string
  releaseDate: string
  description: string
  credits: string
  featured: boolean
}

export interface Collaboration {
  id: string
  artistName: string
  externalName: string
  artistId: string
  project: string
  date: string
  role: string
  projectType: string
  description: string
  link: string
  image: string
  awarded: boolean
  awardName: string
  awardYear: string
  awardCategory: string
  awardOrg: string
}

export interface Performance {
  id: string
  name: string
  venue: string
  city: string
  country: string
  date: string
  role: string
  description: string
  mediaLink: string
}

export interface EducationEntry {
  id: string
  institution: string
  course: string
  field: string
  startYear: string
  endYear: string
  description: string
}

export interface ExperienceEntry {
  id: string
  org: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface GalleryImage {
  id: string
  url: string
  caption: string
  cover: boolean
}

export interface GalleryVideo {
  id: string
  url: string
  caption: string
}

export interface CustomLink {
  id: string
  label: string
  url: string
}

export interface SocialLinks {
  instagram: string
  facebook: string
  youtube: string
  spotify: string
  x: string
  linkedin: string
  website: string
  custom: CustomLink[]
  hidden: string[] // keys hidden from public
}

export interface CollabPrefs {
  availability: string
  openTo: string[]
  statement: string
  locations: string
  remote: boolean
  contactMethod: string
  showCTA: boolean
}

export interface Portfolio {
  basics: ProfileBasics
  about: About
  domain: DomainSkills
  timeline: Milestone[]
  awards: Award[]
  media: MediaItem[]
  collaborations: Collaboration[]
  pastPerformances: Performance[]
  education: EducationEntry[]
  experience: ExperienceEntry[]
  gallery: { images: GalleryImage[]; videos: GalleryVideo[] }
  social: SocialLinks
  collabPrefs: CollabPrefs
  featuredTestimonials: string[]
  hiddenTestimonials: string[]
  reportedTestimonials: string[]
  published: boolean
  slug: string
}

// Generic entry used by the schema-driven repeatable editor
export type Entry = { id: string } & Record<string, string | boolean>
