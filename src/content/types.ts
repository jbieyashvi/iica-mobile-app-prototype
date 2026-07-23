// ---- Content Creation & Sharing module types ----

export type ContentType = 'Video' | 'Image' | 'Audio' | 'PDF' | 'Artist Update'
export type Visibility = 'Public' | 'Members Only' | 'Unlisted' | 'Draft'
export type ContentStatus = 'published' | 'draft' | 'scheduled' | 'archived'
export type DownloadMode = 'view' | 'download'
export type UpdateType =
  | 'Announcement' | 'New Release' | 'Upcoming Performance' | 'Award' | 'Collaboration' | 'General Update'

export interface Credit { name: string; role: string }

export const CONTENT_CATEGORIES = [
  'Music', 'Dance', 'Theatre', 'Visual Arts', 'Photography', 'Film & Media',
  'Literature', 'Cultural Education', 'Behind the Scenes', 'Tutorial', 'Artist Update', 'Other',
]

export const UPDATE_TYPES: UpdateType[] = [
  'Announcement', 'New Release', 'Upcoming Performance', 'Award', 'Collaboration', 'General Update',
]

export const CONTENT_TYPES: ContentType[] = ['Video', 'Image', 'Audio', 'PDF', 'Artist Update']

// Format + PRD size limits, shown on the type-select and upload screens.
export const FORMAT_INFO: Record<ContentType, { formats: string; maxLabel: string; maxMB: number; accept: string; blurb: string }> = {
  Video: { formats: 'MP4, MOV', maxLabel: '500 MB', maxMB: 500, accept: 'video/mp4,video/quicktime', blurb: 'Performances, lessons, behind-the-scenes and creative films' },
  Image: { formats: 'JPG, PNG, WEBP', maxLabel: '20 MB', maxMB: 20, accept: 'image/jpeg,image/png,image/webp', blurb: 'Artwork, photography and visual projects' },
  Audio: { formats: 'MP3, WAV, AAC', maxLabel: '100 MB', maxMB: 100, accept: 'audio/mpeg,audio/wav,audio/aac', blurb: 'Music, poetry, podcasts and practice recordings' },
  PDF: { formats: 'PDF', maxLabel: '50 MB', maxMB: 50, accept: 'application/pdf', blurb: 'Guides, portfolios, sheet music and written work' },
  'Artist Update': { formats: 'Text with optional image', maxLabel: 'Optional image', maxMB: 20, accept: 'image/jpeg,image/png,image/webp', blurb: 'Share an announcement or creative update' },
}

// Typed mock uploads (no real large media stored) — preview image + metadata.
export interface DemoFile { fileName: string; fileSize: string; duration?: string; pages?: number; preview: string }

export const DEMO_FILES: Record<ContentType, DemoFile | null> = {
  Video: { fileName: 'performance-film.mp4', fileSize: '84 MB', duration: '2:14', preview: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80&auto=format&fit=crop' },
  Image: { fileName: 'cultural-visual-series.jpg', fileSize: '4.8 MB', preview: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop' },
  Audio: { fileName: 'rhythms-in-motion.mp3', fileSize: '9.2 MB', duration: '3:42', preview: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop' },
  PDF: { fileName: 'visual-storytelling-guide.pdf', fileSize: '6.4 MB', pages: 18, preview: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop' },
  'Artist Update': null,
}

// Superset of Explore's ContentItem (same base fields) so existing cards/feeds work.
export interface ContentRecord {
  id: string
  type: ContentType
  status: ContentStatus
  // common
  title: string
  description: string        // short description — used by cards/explore
  fullDescription: string
  thumbnail: string
  category: string
  customCategory?: string
  tags: string[]
  language: string
  collectionId: string | null
  credits: Credit[]
  releaseDate: string
  date: string               // published/updated date (ContentItem compat)
  // creator (ContentItem compat)
  creator: string
  creatorSlug: string
  creatorAvatar: string
  createdByMe: boolean
  // media meta
  fileName?: string
  fileSize?: string
  duration?: string
  pages?: number
  images: string[]           // gallery / additional images
  // type-specific
  altText?: string
  caption?: string
  gallery?: boolean
  captionsAvailable?: boolean
  contentWarning?: string
  orientation?: string
  cover?: string             // audio artwork / pdf cover
  trackTitle?: string
  performer?: string
  genre?: string
  lyrics?: string
  docType?: string
  toc?: string
  previewPages?: number
  updateType?: UpdateType
  headline?: string
  updateText?: string
  ctaLabel?: string
  ctaUrl?: string
  // settings
  visibility: Visibility
  allowLikes: boolean
  allowComments: boolean
  allowSharing: boolean
  showViews: boolean
  download: DownloadMode
  downloadType?: string
  usageNote?: string
  downloadLimit?: string
  addToPortfolio: boolean
  featureWhatsNew: boolean
  notifyFollowers: boolean
  mature: boolean
  scheduleAt?: string
  timezone?: string
  // engagement
  likes: number
  comments: number
  views: number
  saves: number
  shares: number
  downloads: number
}

export type ContentDraft = Partial<ContentRecord>

export interface CollectionRec {
  id: string
  name: string
  description: string
  cover: string
  visibility: 'Public' | 'Members Only' | 'Unlisted'
  createdByMe: boolean
}

export interface ContentComment {
  id: string
  contentId: string
  author: string
  avatar?: string
  text: string
  date: string
  likes: number
  parentId: string | null
  mine: boolean
  reported: boolean
  liked?: boolean
}

// Default settings for a fresh draft (prototype-friendly).
export const DEFAULT_SETTINGS = {
  visibility: 'Public' as Visibility,
  allowLikes: true,
  allowComments: true,
  allowSharing: true,
  showViews: true,
  download: 'view' as DownloadMode,
  addToPortfolio: true,
  featureWhatsNew: true,
  notifyFollowers: true,
  mature: false,
}
