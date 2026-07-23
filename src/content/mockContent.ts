import { ContentRecord, CollectionRec, ContentComment, ContentDraft, DEFAULT_SETTINGS, ContentType } from './types'
import { contentItems } from '../data/exploreData'
import { demoUser } from '../demo/demoData'

const ME = { creator: demoUser.fullName, creatorSlug: demoUser.slug, creatorAvatar: demoUser.photo }

// Fill a partial draft into a complete, valid ContentRecord (used by publish).
export function buildRecord(d: ContentDraft, id: string, overrides: Partial<ContentRecord> = {}): ContentRecord {
  const type = (d.type ?? 'Image') as ContentType
  const today = new Date().toISOString().slice(0, 10)
  return {
    id,
    type,
    status: 'published',
    title: d.title ?? 'Untitled',
    description: d.description ?? '',
    fullDescription: d.fullDescription ?? d.description ?? '',
    thumbnail: d.thumbnail ?? d.cover ?? d.images?.[0] ?? 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop',
    category: d.category ?? 'Other',
    customCategory: d.customCategory,
    tags: d.tags ?? [],
    language: d.language ?? 'English',
    collectionId: d.collectionId ?? null,
    credits: d.credits ?? [],
    releaseDate: d.releaseDate ?? today,
    date: today,
    creator: ME.creator, creatorSlug: ME.creatorSlug, creatorAvatar: ME.creatorAvatar, createdByMe: true,
    fileName: d.fileName, fileSize: d.fileSize, duration: d.duration, pages: d.pages,
    images: d.images ?? [],
    altText: d.altText, caption: d.caption, gallery: d.gallery, captionsAvailable: d.captionsAvailable,
    contentWarning: d.contentWarning, orientation: d.orientation, cover: d.cover,
    trackTitle: d.trackTitle, performer: d.performer, genre: d.genre, lyrics: d.lyrics,
    docType: d.docType, toc: d.toc, previewPages: d.previewPages,
    updateType: d.updateType, headline: d.headline, updateText: d.updateText, ctaLabel: d.ctaLabel, ctaUrl: d.ctaUrl,
    visibility: d.visibility ?? DEFAULT_SETTINGS.visibility,
    allowLikes: d.allowLikes ?? DEFAULT_SETTINGS.allowLikes,
    allowComments: d.allowComments ?? DEFAULT_SETTINGS.allowComments,
    allowSharing: d.allowSharing ?? DEFAULT_SETTINGS.allowSharing,
    showViews: d.showViews ?? DEFAULT_SETTINGS.showViews,
    download: d.download ?? DEFAULT_SETTINGS.download,
    downloadType: d.downloadType, usageNote: d.usageNote, downloadLimit: d.downloadLimit,
    addToPortfolio: d.addToPortfolio ?? DEFAULT_SETTINGS.addToPortfolio,
    featureWhatsNew: d.featureWhatsNew ?? DEFAULT_SETTINGS.featureWhatsNew,
    notifyFollowers: d.notifyFollowers ?? DEFAULT_SETTINGS.notifyFollowers,
    mature: d.mature ?? DEFAULT_SETTINGS.mature,
    scheduleAt: d.scheduleAt, timezone: d.timezone,
    likes: d.likes ?? 0, comments: d.comments ?? 0, views: d.views ?? 0, saves: d.saves ?? 0, shares: d.shares ?? 0, downloads: d.downloads ?? 0,
    ...overrides,
  }
}

// Map an existing Explore ContentItem into a published community record.
function fromItem(c: (typeof contentItems)[number], views: number): ContentRecord {
  return buildRecord(
    {
      type: c.type, title: c.title, description: c.description, fullDescription: c.description,
      thumbnail: c.thumbnail, category: c.category, tags: c.tags, language: 'English',
      likes: c.likes, comments: c.comments, views,
    },
    c.id,
    { creator: c.creator, creatorSlug: c.creatorSlug, creatorAvatar: c.creatorAvatar, createdByMe: false, date: c.date, releaseDate: c.date },
  )
}

const IMG = {
  motion: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80&auto=format&fit=crop',
  visual: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop',
  audio: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop',
  guide: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop',
  studio: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop',
}

// Creator's own content (drives the "My Content" dashboard, portfolio, collections).
const myContent: ContentRecord[] = [
  buildRecord(
    {
      type: 'Video', title: 'Rhythms in Motion — A Visual Exploration',
      description: 'A collaborative exploration of movement, rhythm and visual storytelling.',
      fullDescription: 'This project brings performance and visual design together to explore how movement can become a form of digital storytelling.',
      thumbnail: IMG.motion, category: 'Visual Arts', tags: ['Cultural Storytelling', 'Creative Direction', 'Movement', 'Collaboration'],
      collectionId: 'col-visual', duration: '2:14', fileName: 'performance-film.mp4', fileSize: '84 MB',
      credits: [{ name: 'Ananya Rao', role: 'Performer' }, { name: 'JB Yashvi', role: 'Creative Direction' }],
      captionsAvailable: true, orientation: 'Landscape',
      likes: 342, comments: 28, views: 5120, saves: 96, shares: 41,
    },
    'my-1', { date: '2026-07-10', releaseDate: '2026-07-10' },
  ),
  buildRecord(
    {
      type: 'Image', title: 'Cultural Visual Series — Frames',
      description: 'A short photographic series on movement and colour.',
      fullDescription: 'A set of frames capturing the intersection of performance and visual design.',
      thumbnail: IMG.visual, category: 'Photography', tags: ['Photography', 'Series'], gallery: true,
      images: [IMG.visual, IMG.studio, IMG.motion], altText: 'Performers framed against coloured light',
      collectionId: 'col-visual', likes: 210, comments: 12, views: 2380, saves: 54, shares: 18,
    },
    'my-2', { date: '2026-06-22', releaseDate: '2026-06-22' },
  ),
  buildRecord(
    {
      type: 'Audio', title: 'Rhythms in Motion — Score (Draft)',
      description: 'Working audio score for the Rhythms in Motion film.',
      fullDescription: 'An in-progress score exploring layered percussion and ambient texture.',
      thumbnail: IMG.audio, cover: IMG.audio, category: 'Music', tags: ['Score', 'WIP'],
      trackTitle: 'Rhythms in Motion', performer: 'JB Yashvi', genre: 'Contemporary', duration: '3:42',
      collectionId: 'col-process', status: 'draft', visibility: 'Draft',
    },
    'my-3', { status: 'draft', visibility: 'Draft', date: '2026-07-18', releaseDate: '2026-07-18' },
  ),
  buildRecord(
    {
      type: 'PDF', title: 'Beginner’s Guide to Visual Storytelling',
      description: 'A short guide for creators starting out with visual storytelling.',
      fullDescription: 'An 18-page primer covering research, concept and composition.',
      thumbnail: IMG.guide, cover: IMG.guide, category: 'Cultural Education', tags: ['Guide', 'Beginner'],
      docType: 'Guide', pages: 18, previewPages: 3, fileName: 'visual-storytelling-guide.pdf', fileSize: '6.4 MB',
      collectionId: 'col-guides', status: 'scheduled', visibility: 'Public', download: 'download', downloadType: 'PDF',
      scheduleAt: '2026-08-05', timezone: 'IST (GMT+5:30)',
    },
    'my-4', { status: 'scheduled', date: '2026-07-20', releaseDate: '2026-08-05' },
  ),
]

export const seedContent: ContentRecord[] = [
  ...myContent,
  ...contentItems.map((c, i) => fromItem(c, 1800 + i * 640)),
]

export const seedCollections: CollectionRec[] = [
  { id: 'col-visual', name: 'Visual Storytelling', description: 'Films and frames exploring movement and colour.', cover: IMG.motion, visibility: 'Public', createdByMe: true },
  { id: 'col-collab', name: 'Cultural Collaborations', description: 'Work made with other IICA creators.', cover: IMG.studio, visibility: 'Public', createdByMe: true },
  { id: 'col-process', name: 'Behind the Process', description: 'Drafts, sketches and works in progress.', cover: IMG.audio, visibility: 'Members Only', createdByMe: true },
  { id: 'col-guides', name: 'Beginner Creative Guides', description: 'Approachable guides for new creators.', cover: IMG.guide, visibility: 'Public', createdByMe: true },
]

const AV = {
  a: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop',
  b: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop',
  c: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop',
}

export const seedComments: ContentComment[] = [
  { id: 'cm1', contentId: 'my-1', author: 'Ananya Rao', avatar: AV.a, text: 'Loved collaborating on this — the framing really elevated the movement.', date: '2026-07-11', likes: 14, parentId: null, mine: false, reported: false },
  { id: 'cm2', contentId: 'my-1', author: 'Kabir Menon', avatar: AV.b, text: 'The rhythm editing in the second half is beautiful.', date: '2026-07-12', likes: 6, parentId: null, mine: false, reported: false },
  { id: 'cm3', contentId: 'my-1', author: 'Kavya Sharma', avatar: AV.c, text: 'Would love to know which lens you shot this on.', date: '2026-07-13', likes: 3, parentId: null, mine: false, reported: false },
  { id: 'cm4', contentId: 'c2', author: 'Meera Kulkarni', avatar: AV.a, text: 'Stunning varnam. The abhinaya is so expressive.', date: '2026-07-29', likes: 9, parentId: null, mine: false, reported: false },
  { id: 'cm5', contentId: 'c1', author: 'Kavya Sharma', avatar: AV.c, text: 'On repeat since release 🎧', date: '2026-08-03', likes: 22, parentId: null, mine: false, reported: false },
]

// Prefilled demo details (used by "Load Demo" in the create flow).
export const demoContentDetails: ContentDraft = {
  title: 'Rhythms in Motion — A Visual Exploration',
  description: 'A collaborative exploration of movement, rhythm and visual storytelling.',
  fullDescription: 'This project brings performance and visual design together to explore how movement can become a form of digital storytelling.',
  category: 'Visual Arts',
  tags: ['Cultural Storytelling', 'Creative Direction', 'Movement', 'Collaboration'],
  language: 'English',
  credits: [{ name: 'Ananya Rao', role: 'Performer' }, { name: 'JB Yashvi', role: 'Creative Direction' }],
  releaseDate: '2026-07-10',
}

// Compact analytics numbers for the creator analytics screen.
export const demoAnalytics = {
  views: 9482, uniqueViewers: 6120, likes: 812, comments: 74, saves: 214, shares: 96, downloads: 148, avgProgress: 68,
  overTime: [30, 52, 41, 78, 96, 64, 88],
  sources: [
    { label: 'Explore feed', pct: 42 },
    { label: 'Creator portfolio', pct: 26 },
    { label: 'Shared links', pct: 18 },
    { label: 'What’s New', pct: 14 },
  ],
  locations: [
    { label: 'Bengaluru', pct: 34 },
    { label: 'Mumbai', pct: 22 },
    { label: 'Delhi', pct: 18 },
    { label: 'Other', pct: 26 },
  ],
  byType: [
    { label: 'Video', pct: 46 },
    { label: 'Image', pct: 28 },
    { label: 'Audio', pct: 16 },
    { label: 'PDF', pct: 10 },
  ],
}
