// ---- Public / published artist portfolio data (typed, reusable) ----

import { MembershipCategory, ProfileActivity } from '../config/catalogue'

export type Availability = 'Available' | 'Selectively Available' | 'Not Available'
export type ArtistVisibility = 'Public' | 'Members Only'

export interface ArtistSocials {
  instagram?: string
  facebook?: string
  youtube?: string
  spotify?: string
  website?: string
  x?: string
  linkedin?: string
  custom?: { label: string; url: string }[]
}

export interface ArtistUpdate {
  id: string
  type: string
  title: string
  date: string
  description: string
  image: string
  cta?: string
  href?: string // CTA target: internal route (/…) or external URL (http…)
  time?: string
  location?: string
  endDate?: string
  featured?: boolean
}

export interface ArtistChapter {
  id: string
  heading: string
  description: string
  date: string
  image?: string
}

export interface ArtistMilestone {
  id: string
  year: string
  title: string
  category: string
  description: string
  image?: string
  link?: string
}

export interface ArtistAward {
  id: string
  year: string
  name: string
  org: string
  recognitionType: string
  project?: string
  category?: string
  description?: string
  image?: string
  link?: string
  featured?: boolean
}

export interface ArtistMedia {
  id: string
  type: string // 'YouTube Video' | 'Spotify Track' | 'Spotify Album' | 'Audio' | 'Other External Media'
  title: string
  url: string
  thumbnail: string
  releaseDate?: string
  description?: string
  credits?: string
  featured?: boolean
}

export interface ArtistCollab {
  id: string
  artistName: string
  artistId?: string
  artistAvatar?: string
  isMember: boolean
  project: string
  date: string
  role: string
  projectType: string
  link?: string
  image?: string
  awarded: boolean
  awardName?: string
  awardCategory?: string
  awardYear?: string
}

export interface ArtistEvent {
  id: string
  title: string
  date: string
  time?: string
  venue: string
  city: string
  category: string
  paid: boolean
  price?: number
  soldOut?: boolean
  image: string
}

export interface ArtistPastEvent {
  id: string
  name: string
  date: string
  venue: string
  media?: string
}

export interface ArtistGalleryItem {
  id: string
  url: string
  caption?: string
  date?: string
  type: 'image' | 'video'
}

export interface ArtistReview {
  id: string
  author: string
  relationship: string
  date: string
  rating: number
  title?: string
  text: string
  verified?: boolean
  avatar?: string
}

export interface ArtistFreeResource {
  id: string
  title: string
  description: string
  cover: string
  pdfName: string
  pdfData: string // data: URL when the creator uploaded one; '' → prototype placeholder
  author: string
  category: string
  year: string
  language: string
}

export interface ArtistSupportOption {
  id: string
  title: string
  amount: number
  currency: string
  note: string
}

export interface ArtistSupport {
  heading: string
  description: string
  options: ArtistSupportOption[]
}

export interface RatingSummary {
  avg: number
  total: number
  distribution: [number, number, number, number, number] // [5★,4★,3★,2★,1★]
}

export interface PublicArtist {
  slug: string
  name: string
  headline: string
  location: string
  photo: string
  cover: string
  verified: boolean
  primaryDomain: string
  tags: string[]
  availability: Availability
  availabilityLabel: string
  followers?: number
  saves?: number
  // ---- Catalogue fields ----
  category?: MembershipCategory // membership category; defaults to 'Artist'
  genresOrSpecialisations?: string[] // flexible: genre / discipline / venue type / industry
  adminCorrectedLocation?: string // if set, overrides self-reported location in catalogue
  activity?: ProfileActivity // in-app activity → featured scoring (never follower counts)
  visibility: ArtistVisibility
  socials: ArtistSocials
  whatsNew: ArtistUpdate[]
  bio: string
  experienceYears: number
  languages: string
  skills: string[]
  journey: ArtistChapter[]
  timeline: ArtistMilestone[]
  awards: ArtistAward[]
  media: ArtistMedia[]
  collaborations: ArtistCollab[]
  upcomingEvents: ArtistEvent[]
  pastEvents: ArtistPastEvent[]
  gallery: ArtistGalleryItem[]
  freeResources?: ArtistFreeResource[]
  support?: ArtistSupport
  reviews: ArtistReview[]
  ratingSummary: RatingSummary
}

const IMG = {
  cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80&auto=format&fit=crop',
  photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop',
  m1: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format&fit=crop',
  m2: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80&auto=format&fit=crop',
  m3: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop',
  m4: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80&auto=format&fit=crop',
  m5: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  m6: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80&auto=format&fit=crop',
  ev1: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80&auto=format&fit=crop',
  ev2: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80&auto=format&fit=crop',
  ev3: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80&auto=format&fit=crop',
}

const abhishek: PublicArtist = {
  slug: 'abhishek-singh-chouhan',
  name: 'Abhishek Singh Chouhan',
  headline: 'Music composer, lyricist & producer',
  location: 'Ujjain, India',
  photo: IMG.photo,
  cover: IMG.cover,
  verified: true,
  primaryDomain: 'Music',
  tags: ['Composer', 'Lyricist', 'Singer', 'Songwriter', 'Producer', 'Synthesizer'],
  availability: 'Selectively Available',
  availabilityLabel: 'Available for selected collaborations',
  followers: 12400,
  saves: 860,
  category: 'Artist',
  genresOrSpecialisations: ['Contemporary Music', 'Folk Music'],
  activity: { productsListed: 4, profileViews: 2100, contentPublished: 9, eventsCreated: 3, collaborationAttempts: 6, profileCompleteness: 0.95, lastActiveLabel: 'Active this week' },
  visibility: 'Public',
  socials: {
    instagram: 'https://instagram.com/abhishek.chouhan',
    facebook: 'https://facebook.com/abhishek.chouhan',
    youtube: 'https://youtube.com/@abhishekchouhan',
    spotify: 'https://open.spotify.com/artist/abhishekchouhan',
  },
  whatsNew: [
    { id: 'n1', type: 'New Release', title: 'Mahakaal Ki Sawaari', date: '2026-08-15', description: 'Releasing this August, 2026', image: IMG.m3, cta: 'Subscribe on YouTube', href: 'https://youtu.be/ScMzIvxBSi4', featured: true },
    { id: 'n2', type: 'New Release', title: 'Thodi Si Sacchai, Thoda Sa Zeher', date: '2026-08-22', description: 'Releasing this August, 2026', image: IMG.m2, cta: 'Subscribe on YouTube', href: 'https://youtu.be/jNQXAC9IVRw' },
    { id: 'n3', type: 'New Release', title: 'Indra Dev Aarti', date: '2026-08-29', description: 'Releasing this August, 2026', image: IMG.m5, cta: 'Subscribe on YouTube', href: 'https://youtu.be/kJQP7kiw5Fk' },
  ],
  bio: 'Abhishek Singh Chouhan is a music composer and producer from Ujjain, blending Hindustani sensibilities with contemporary production. He founded Mid Town Music and writes, sings and produces original work across languages.',
  experienceYears: 14,
  languages: 'Hindi, English, Malvi',
  skills: ['Composition', 'Lyrics', 'Vocals', 'Music Production', 'Synthesizer', 'Mixing'],
  journey: [
    {
      id: 'j1',
      heading: 'Where it began',
      description:
        'Growing up in Ujjain, music was everywhere — temple bells, folk melodies and the radio. I started learning classical vocals at seven.',
      date: '2003',
      image: IMG.m3,
    },
    {
      id: 'j2',
      heading: 'Finding my sound',
      description:
        'In college I discovered production software and began building my own arrangements, mixing classical training with modern textures.',
      date: '2014',
      image: IMG.m4,
    },
    {
      id: 'j3',
      heading: 'Building Mid Town Music',
      description:
        'I launched Mid Town Music to release independent work and collaborate with artists across the country.',
      date: '2020',
      image: IMG.m1,
    },
  ],
  timeline: [
    { id: 't1', year: '2009', title: 'Sangeet Visharad', category: 'Education', description: 'Completed a formal diploma in classical music.', image: IMG.m3 },
    { id: 't2', year: '2011', title: 'First State-Level Performance', category: 'First Performance', description: 'Represented Ujjain at the state cultural festival.', image: IMG.m4 },
    { id: 't3', year: '2020', title: 'Launched Mid Town Music', category: 'Release', description: 'Founded an independent music label and studio.', image: IMG.m1 },
    { id: 't4', year: '2022', title: 'IMA Special Mention', category: 'Award', description: 'Recognised at the Independent Music Awards.', image: IMG.m2 },
    { id: 't5', year: '2025', title: 'Selected for 50 Hour Music Challenge', category: 'Award', description: 'Chosen nationally for the endurance composition challenge.', image: IMG.m5, link: 'https://example.com' },
  ],
  awards: [
    { id: 'a1', year: '2025', name: '50 Hour Music Challenge', org: 'National Music Collective', recognitionType: 'Finalist', project: 'Original Folk Fusion', description: 'Selected as a national finalist in the 50 Hour Music Challenge for an original folk-fusion composition written and produced within the challenge window.', featured: true, link: 'https://example.com' },
    { id: 'a2', year: '2022', name: 'IMA Special Mention', org: 'Indian Independent Music Awards', recognitionType: 'Special Mention', category: 'Devotional', project: 'Namami Gange', description: 'Special Mention in the Devotional category for the release “Namami Gange”.' },
    { id: 'a3', year: '2018', name: 'Young Composer of the Year', org: 'Malwa Arts Forum', recognitionType: 'Winner', project: 'Debut EP', description: 'Awarded Young Composer of the Year for the debut EP.' },
    { id: 'a4', year: '2011', name: 'State Level Youth Festival', org: 'Vikram University, Ujjain', recognitionType: 'Winner', category: 'Music Performance' },
  ],
  media: [
    { id: 'md1', type: 'YouTube Video', title: 'Tere Naal — Official Video', url: 'https://youtube.com/watch?v=abc', thumbnail: IMG.m3, releaseDate: '2026-08-02', description: 'Official video for the new single.', credits: 'Written & produced by Abhishek Singh Chouhan', featured: true },
    { id: 'md2', type: 'YouTube Video', title: 'Live at Mid Town Sessions', url: 'https://youtube.com/watch?v=def', thumbnail: IMG.m1, releaseDate: '2025-12-11' },
    { id: 'md3', type: 'Spotify Track', title: 'Megha (Single)', url: 'https://open.spotify.com/track/x', thumbnail: IMG.m6, releaseDate: '2025-06-18' },
    { id: 'md4', type: 'Spotify Album', title: 'Malwa Nights (EP)', url: 'https://open.spotify.com/album/y', thumbnail: IMG.m2, releaseDate: '2024-03-01' },
  ],
  collaborations: [
    { id: 'c1', artistName: 'Kabir Menon', artistId: 'kabir-menon', artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop', isMember: true, project: 'Antaraal (Fusion EP)', date: '2024', role: 'Composer & Producer', projectType: 'Recording', awarded: true, awardName: 'IMA Special Mention', awardCategory: 'Fusion', awardYear: '2024' },
    { id: 'c2', artistName: 'Meera Iyer', artistId: 'meera-iyer', artistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop', isMember: true, project: 'Colour & Sound (Installation)', date: '2023', role: 'Sound Design', projectType: 'Installation', awarded: false },
    { id: 'c3', artistName: 'Rhythm House Collective', isMember: false, project: 'Street Sessions Vol. 2', date: '2022', role: 'Producer', projectType: 'Recording', awarded: false, image: IMG.m5 },
    { id: 'c4', artistName: 'Arjun Desai', artistId: 'arjun-desai', isMember: true, project: 'Ghazal Reimagined', date: '2021', role: 'Arranger', projectType: 'Performance', awarded: false },
  ],
  upcomingEvents: [
    { id: 'e1', title: 'Live in Mumbai', date: '18 Aug 2026', time: '8:00 PM', venue: 'antiSOCIAL, Khar', city: 'Mumbai', category: 'LIVE Gig', paid: true, price: 599, soldOut: false, image: IMG.ev1 },
    { id: 'e2', title: 'Home Studio Production Basics', date: '28 Aug 2026', time: '11:00 AM', venue: 'Mid Town Studio', city: 'Ujjain', category: 'Workshop', paid: false, image: IMG.ev2 },
    { id: 'e3', title: 'In-door Baithak', date: '05 Sep 2026', time: '7:30 PM', venue: 'The Loft', city: 'Indore', category: 'In-door Baithak', paid: true, price: 299, soldOut: true, image: IMG.ev3 },
  ],
  pastEvents: [
    { id: 'p1', name: 'Malwa Nights EP Launch', date: '12 Mar 2024', venue: 'Rang Bhavan, Ujjain', media: IMG.m2 },
    { id: 'p2', name: 'Sunburn Arena — Support Set', date: '19 Nov 2023', venue: 'DY Patil, Mumbai', media: IMG.m1 },
    { id: 'p3', name: 'College Fest Headliner', date: '02 Feb 2023', venue: 'IIT Indore' },
  ],
  gallery: [
    { id: 'g1', url: IMG.m1, caption: 'Mid Town Sessions', date: '2025', type: 'image' },
    { id: 'g2', url: IMG.m4, caption: 'On stage, Mumbai', date: '2024', type: 'video' },
    { id: 'g3', url: IMG.m2, caption: 'EP launch night', date: '2024', type: 'image' },
    { id: 'g4', url: IMG.m5, caption: 'In the studio', date: '2025', type: 'image' },
    { id: 'g5', url: IMG.m3, caption: 'Acoustic set', date: '2023', type: 'image' },
    { id: 'g6', url: IMG.m6, caption: 'Rehearsal', date: '2025', type: 'image' },
  ],
  reviews: [
    { id: 'r1', author: 'Kabir Menon', relationship: 'Worked together', date: '2025-01-12', rating: 5, title: 'A rare collaborator', text: 'Abhishek brings discipline and imagination to every session. Our EP would not exist without his ear.', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop' },
    { id: 'r2', author: 'Sneha Rao', relationship: 'Attended an event', date: '2024-11-30', rating: 5, title: 'Unforgettable live set', text: 'Saw him live in Ujjain — the energy and musicianship were incredible. Highly recommend catching a show.', verified: true },
    { id: 'r3', author: 'Vikram Joshi', relationship: 'Student', date: '2024-09-08', rating: 4, text: 'Learnt production basics in his workshop. Patient, clear and genuinely generous with knowledge.', verified: false },
  ],
  ratingSummary: { avg: 4.8, total: 42, distribution: [34, 6, 2, 0, 0] },
  freeResources: [
    { id: 'afr1', title: 'Hindustani Riyaz Starter Pack', description: 'A free practice guide for daily vocal riyaz, with warm-ups and simple exercises.', cover: IMG.m3, pdfName: 'riyaz-starter.pdf', pdfData: '', author: 'Abhishek Singh Chouhan', category: 'Music', year: '2026', language: 'Hindi, English' },
    { id: 'afr2', title: 'Home Studio Setup on a Budget', description: 'An e-book on building your first home recording setup affordably.', cover: IMG.m4, pdfName: 'home-studio.pdf', pdfData: '', author: 'Abhishek Singh Chouhan', category: 'Education', year: '2026', language: 'English' },
  ],
  support: {
    heading: 'We Need Your Support',
    description: 'Independent music takes time and resources. Your support helps me release free music, run open riyaz sessions and keep learning material free for everyone.',
    options: [
      { id: 'asp1', title: 'Buy me a chai', amount: 100, currency: 'INR', note: 'A small thank-you' },
      { id: 'asp2', title: 'Fund a session', amount: 500, currency: 'INR', note: 'Supports one open riyaz session' },
      { id: 'asp3', title: 'Studio patron', amount: 1000, currency: 'INR', note: 'Helps fund a new release' },
    ],
  },
}

// Lighter profiles for the existing directory artists so their cards open real pages.
function makeArtist(
  base: {
    slug: string
    name: string
    headline: string
    location: string
    photo: string
    primaryDomain: string
    tags: string[]
    verified: boolean
    availability?: PublicArtist['availability']
    experienceYears?: number
    // catalogue fields
    category?: MembershipCategory
    genresOrSpecialisations?: string[]
    adminCorrectedLocation?: string
    activity?: ProfileActivity
    whatsNew?: ArtistUpdate[]
  },
): PublicArtist {
  const availability = base.availability ?? 'Available'
  return {
    ...abhishek,
    whatsNew: base.whatsNew ?? [], // never inherit abhishek's announcements
    freeResources: [], // Free Resources are per-creator; don't inherit the sample
    support: undefined, // Support section is opt-in per creator; hidden by default
    slug: base.slug,
    name: base.name,
    headline: base.headline,
    location: base.location,
    photo: base.photo,
    primaryDomain: base.primaryDomain,
    tags: base.tags,
    // Skills must reflect THIS creator's craft — never inherit abhishek's music
    // skills via the spread above (that made a fashion model "sing").
    skills: base.tags,
    verified: base.verified,
    followers: 3200,
    saves: 210,
    category: base.category ?? 'Artist',
    genresOrSpecialisations: base.genresOrSpecialisations ?? base.tags,
    adminCorrectedLocation: base.adminCorrectedLocation,
    activity: base.activity ?? {
      productsListed: 1, profileViews: 480, contentPublished: 2, eventsCreated: 1,
      collaborationAttempts: 2, profileCompleteness: 0.7, lastActiveLabel: 'Active recently',
    },
    availability,
    availabilityLabel:
      availability === 'Not Available' ? 'Not accepting collaborations right now'
        : availability === 'Selectively Available' ? 'Available for selected collaborations'
          : 'Open to collaborations',
    experienceYears: base.experienceYears ?? 8,
    bio: `${base.name} is a ${base.headline.toLowerCase()} based in ${base.location.split(',')[0]}, working across the IICA community.`,
  }
}

const PIC = {
  woman1: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop',
  woman2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop',
  woman3: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80&auto=format&fit=crop',
  woman4: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop',
  woman5: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&auto=format&fit=crop',
  man1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
  man2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
  man3: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop',
  man4: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop',
  man5: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=400&q=80&auto=format&fit=crop',
  venue1: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80&auto=format&fit=crop',
  venue2: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80&auto=format&fit=crop',
  brand1: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80&auto=format&fit=crop',
  brand2: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&q=80&auto=format&fit=crop',
  fit1: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&auto=format&fit=crop',
  fit2: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&q=80&auto=format&fit=crop',
  yoga1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80&auto=format&fit=crop',
  sport1: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80&auto=format&fit=crop',
}

// modest / recent activity presets to keep featured scoring transparent
const A_LOW: ProfileActivity = { productsListed: 0, profileViews: 260, contentPublished: 1, eventsCreated: 0, collaborationAttempts: 1, profileCompleteness: 0.6, lastActiveLabel: 'Active this month' }
const A_MID: ProfileActivity = { productsListed: 2, profileViews: 820, contentPublished: 3, eventsCreated: 1, collaborationAttempts: 3, profileCompleteness: 0.8, lastActiveLabel: 'Active recently' }
const A_HIGH: ProfileActivity = { productsListed: 5, profileViews: 1900, contentPublished: 7, eventsCreated: 4, collaborationAttempts: 6, profileCompleteness: 0.95, lastActiveLabel: 'Active this week' }

const others: PublicArtist[] = [
  // ---- Artists ----
  makeArtist({ slug: 'ananya-rao', name: 'Ananya Rao', headline: 'Bharatanatyam dancer', location: 'Chennai, India', photo: PIC.woman1, primaryDomain: 'Dance', tags: ['Bharatanatyam', 'Choreography', 'Contemporary'], verified: true, availability: 'Selectively Available', experienceYears: 12, category: 'Artist', genresOrSpecialisations: ['Bharatanatyam', 'Contemporary Dance'], activity: A_HIGH, whatsNew: [
    { id: 'ar-n1', type: 'Upcoming Show', title: 'Varnam — A Bharatanatyam Evening', date: '2026-09-10', time: '7:00 PM', location: 'Chennai', description: 'A solo margam of classical compositions.', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop', cta: 'Book Tickets', href: '/explore/events', featured: true },
  ] }),
  makeArtist({ slug: 'kabir-menon', name: 'Kabir Menon', headline: 'Sitarist & composer', location: 'Mumbai, India', photo: PIC.man1, primaryDomain: 'Music', tags: ['Sitar', 'Composition', 'Fusion'], verified: true, experienceYears: 15, category: 'Artist', genresOrSpecialisations: ['Classical Music', 'Contemporary Music'], activity: A_MID }),
  makeArtist({ slug: 'meera-iyer', name: 'Meera Iyer', headline: 'Contemporary painter', location: 'Bengaluru, India', photo: PIC.woman2, primaryDomain: 'Visual Arts', tags: ['Oil', 'Pigment', 'Abstract'], verified: false, availability: 'Not Available', experienceYears: 6, category: 'Artist', genresOrSpecialisations: ['Visual Arts'], activity: A_LOW }),
  makeArtist({ slug: 'devraj-singh', name: 'Devraj Singh', headline: 'Tabla virtuoso', location: 'Jaipur, India', photo: PIC.man2, primaryDomain: 'Music', tags: ['Tabla', 'Percussion', 'Hindustani'], verified: true, experienceYears: 20, category: 'Artist', genresOrSpecialisations: ['Classical Music'], activity: A_MID }),
  makeArtist({ slug: 'nisha-pillai', name: 'Nisha Pillai', headline: 'Documentary photographer', location: 'Kochi, India', photo: PIC.woman3, primaryDomain: 'Photography', tags: ['Documentary', 'Portrait', 'Craft'], verified: false, experienceYears: 5, category: 'Artist', genresOrSpecialisations: ['Photography'], activity: A_LOW }),
  makeArtist({ slug: 'arjun-desai', name: 'Arjun Desai', headline: 'Vocalist & ghazal artist', location: 'Delhi, India', photo: PIC.man4, primaryDomain: 'Music', tags: ['Vocals', 'Ghazal', 'Playback'], verified: true, experienceYears: 10, category: 'Artist', genresOrSpecialisations: ['Devotional', 'Contemporary Music'], activity: A_MID }),
  makeArtist({ slug: 'meera-kulkarni', name: 'Meera Kulkarni', headline: 'Visual artist & muralist', location: 'Pune, India', photo: PIC.woman2, primaryDomain: 'Visual Arts', tags: ['Murals', 'Mixed Media', 'Public Art'], verified: true, availability: 'Available', experienceYears: 9, category: 'Artist', genresOrSpecialisations: ['Visual Arts', 'Folk Art'], activity: A_MID }),
  makeArtist({ slug: 'arjun-mehta', name: 'Arjun Mehta', headline: 'Percussionist & producer', location: 'Mumbai, India', photo: PIC.man3, primaryDomain: 'Music', tags: ['Percussion', 'Production', 'Live'], verified: false, availability: 'Selectively Available', experienceYears: 7, category: 'Artist', genresOrSpecialisations: ['Contemporary Music'], activity: A_LOW }),
  makeArtist({ slug: 'kavya-sharma', name: 'Kavya Sharma', headline: 'Folk artist & illustrator', location: 'Jaipur, India', photo: PIC.woman4, primaryDomain: 'Visual Arts', tags: ['Folk Art', 'Illustration', 'Miniature'], verified: true, availability: 'Available', experienceYears: 4, category: 'Artist', genresOrSpecialisations: ['Folk Art', 'Visual Arts'], activity: A_MID }),
  makeArtist({ slug: 'rohan-sen', name: 'Rohan Sen', headline: 'Independent filmmaker', location: 'Kolkata, India', photo: PIC.man2, primaryDomain: 'Film & Media', tags: ['Direction', 'Editing', 'Documentary'], verified: true, availability: 'Selectively Available', experienceYears: 11, category: 'Artist', genresOrSpecialisations: ['Film'], activity: A_MID }),
  makeArtist({ slug: 'zoya-khan', name: 'Zoya Khan', headline: 'Theatre performer & director', location: 'Delhi, India', photo: PIC.woman5, primaryDomain: 'Theatre', tags: ['Acting', 'Direction', 'Devised Theatre'], verified: false, availability: 'Available', experienceYears: 8, category: 'Artist', genresOrSpecialisations: ['Theatre'], activity: A_LOW }),
  makeArtist({ slug: 'nandini-iyer', name: 'Nandini Iyer', headline: 'Cultural educator & vocalist', location: 'Chennai, India', photo: PIC.woman3, primaryDomain: 'Cultural Education', tags: ['Teaching', 'Carnatic', 'Workshops'], verified: true, availability: 'Selectively Available', experienceYears: 16, category: 'Artist', genresOrSpecialisations: ['Classical Music', 'Cultural Experiences'], activity: A_MID }),
  makeArtist({ slug: 'brij-kishore', name: 'Brij Kishore', headline: 'Folk musician & dholak player', location: 'Ujjain, India', photo: PIC.man5, primaryDomain: 'Music', tags: ['Folk', 'Dholak', 'Percussion'], verified: false, availability: 'Available', experienceYears: 13, category: 'Artist', genresOrSpecialisations: ['Folk Music'], activity: A_LOW }),

  // ---- Model ----
  makeArtist({ slug: 'naina-kapoor', name: 'Naina Kapoor', headline: 'Runway & editorial model', location: 'Mumbai, India', photo: PIC.woman1, primaryDomain: 'Fashion', tags: ['Runway', 'Editorial', 'Campaigns'], verified: true, availability: 'Available', experienceYears: 6, category: 'Model', genresOrSpecialisations: ['Cultural Experiences'], activity: A_MID }),
  makeArtist({ slug: 'ishaan-roy', name: 'Ishaan Roy', headline: 'Fashion & print model', location: 'Delhi, India', photo: PIC.man4, primaryDomain: 'Fashion', tags: ['Print', 'Ramp'], verified: false, availability: 'Available', experienceYears: 3, category: 'Model', genresOrSpecialisations: ['Cultural Experiences'], activity: A_LOW }),

  // ---- Legacy Brand of Impact ----
  makeArtist({ slug: 'aarav-fitness-collective', name: 'Aarav Fitness Collective', headline: 'Community fitness brand & studio', location: 'Mumbai, India', photo: PIC.brand1, primaryDomain: 'Fitness', tags: ['Studio', 'Community', 'Wellness'], verified: true, availability: 'Available', experienceYears: 8, category: 'Legacy Brand of Impact', genresOrSpecialisations: ['Fitness'], activity: A_HIGH }),
  makeArtist({ slug: 'kalagram-handlooms', name: 'Kalagram Handlooms', headline: 'Heritage handloom & craft house', location: 'Jaipur, India', photo: PIC.brand2, primaryDomain: 'Folk Art', tags: ['Handloom', 'Craft', 'Heritage'], verified: true, availability: 'Selectively Available', experienceYears: 25, category: 'Legacy Brand of Impact', genresOrSpecialisations: ['Folk Art'], activity: A_MID }),

  // ---- Fitness Champion ----
  makeArtist({ slug: 'rehan-sheikh', name: 'Rehan Sheikh', headline: 'National-level fitness champion', location: 'Pune, India', photo: PIC.fit1, primaryDomain: 'Fitness', tags: ['Strength', 'Bodybuilding'], verified: true, availability: 'Available', experienceYears: 9, category: 'Fitness Champion', genresOrSpecialisations: ['Fitness'], activity: A_MID }),
  makeArtist({ slug: 'priya-nair', name: 'Priya Nair', headline: 'CrossFit athlete & coach', location: 'Bengaluru, India', photo: PIC.fit2, primaryDomain: 'Fitness', tags: ['CrossFit', 'Endurance'], verified: false, availability: 'Available', experienceYears: 5, category: 'Fitness Champion', genresOrSpecialisations: ['Fitness'], activity: A_MID }),
  makeArtist({ slug: 'bhavna-shah', name: 'Bhavna Shah', headline: 'Marathon runner & fitness mentor', location: 'Kolkata, India', photo: PIC.woman4, primaryDomain: 'Fitness', tags: ['Running', 'Endurance'], verified: false, availability: 'Selectively Available', experienceYears: 7, category: 'Fitness Champion', genresOrSpecialisations: ['Fitness'], activity: A_LOW }),

  // ---- Yoga Coach ----
  makeArtist({ slug: 'neha-kapoor', name: 'Neha Kapoor', headline: 'Hatha & wellness yoga coach', location: 'Bengaluru, India', photo: PIC.yoga1, primaryDomain: 'Yoga', tags: ['Hatha', 'Wellness', 'Meditation'], verified: true, availability: 'Available', experienceYears: 10, category: 'Yoga Coach', genresOrSpecialisations: ['Yoga'], activity: A_HIGH, whatsNew: [
    { id: 'nk-n1', type: 'Workshop', title: 'Morning Hatha Yoga Workshop', date: '2026-09-12', time: '6:30 AM', location: 'Bengaluru', description: 'A guided sunrise session for all levels.', image: PIC.yoga1, cta: 'Register', href: '/explore/events', featured: true },
  ] }),
  makeArtist({ slug: 'anil-menon', name: 'Anil Menon', headline: 'Ashtanga yoga instructor', location: 'Pune, India', photo: PIC.man5, primaryDomain: 'Yoga', tags: ['Ashtanga', 'Breathwork'], verified: false, availability: 'Selectively Available', experienceYears: 12, category: 'Yoga Coach', genresOrSpecialisations: ['Yoga'], activity: A_MID }),

  // ---- Athlete ----
  makeArtist({ slug: 'vikram-rathore', name: 'Vikram Rathore', headline: 'State cricket all-rounder', location: 'Delhi, India', photo: PIC.man3, primaryDomain: 'Sports', tags: ['Cricket', 'All-rounder'], verified: true, availability: 'Available', experienceYears: 8, category: 'Athlete', genresOrSpecialisations: ['Sports'], activity: A_MID }),
  makeArtist({ slug: 'sara-dsouza', name: "Sara D'Souza", headline: 'National badminton player', location: 'Hyderabad, India', photo: PIC.woman5, primaryDomain: 'Sports', tags: ['Badminton', 'Singles'], verified: true, availability: 'Selectively Available', experienceYears: 6, category: 'Athlete', genresOrSpecialisations: ['Sports'], activity: A_MID, whatsNew: [
    { id: 'sd-n1', type: 'Competition', title: 'National Championship 2026', date: '2026-10-05', location: 'Hyderabad', description: 'Competing in the national singles draw.', image: PIC.sport1, cta: 'View Details', href: '', featured: true },
  ] }),

  // ---- Sports Coach/Trainer/Enthusiast ----
  makeArtist({ slug: 'gopal-iyer', name: 'Gopal Iyer', headline: 'Athletics coach & sprint trainer', location: 'Chennai, India', photo: PIC.man2, primaryDomain: 'Sports', tags: ['Athletics', 'Sprint', 'Coaching'], verified: false, availability: 'Available', experienceYears: 18, category: 'Sports Coach/Trainer/Enthusiast', genresOrSpecialisations: ['Sports'], activity: A_LOW }),

  // ---- VIP Host ----
  makeArtist({ slug: 'tara-malhotra', name: 'Tara Malhotra', headline: 'Cultural events host & anchor', location: 'Mumbai, India', photo: PIC.woman1, primaryDomain: 'Cultural Experiences', tags: ['Hosting', 'Anchoring'], verified: true, availability: 'Available', experienceYears: 9, category: 'VIP Host', genresOrSpecialisations: ['Cultural Experiences'], activity: A_MID }),

  // ---- VIP Venue ----
  makeArtist({ slug: 'royal-courtyard', name: 'Royal Courtyard', headline: 'Heritage venue for cultural events', location: 'Jaipur, India', photo: PIC.venue1, primaryDomain: 'Cultural Experiences', tags: ['Heritage Venue', 'Events'], verified: true, availability: 'Available', experienceYears: 15, category: 'VIP Venue', genresOrSpecialisations: ['Cultural Experiences'], adminCorrectedLocation: 'Jaipur, India', activity: A_HIGH, whatsNew: [
    { id: 'rc-n1', type: 'Event', title: 'An Evening of Classical Music', date: '2026-09-18', time: '7:30 PM', location: 'Jaipur', description: 'A curated evening of Hindustani classical performances.', image: PIC.venue1, cta: 'Book Tickets', href: '/explore/events', featured: true },
  ] }),
  makeArtist({ slug: 'the-banyan-estate', name: 'The Banyan Estate', headline: 'Boutique hospitality & retreat venue', location: 'Goa, India', photo: PIC.venue2, primaryDomain: 'Hospitality', tags: ['Retreat', 'Hospitality'], verified: false, availability: 'Selectively Available', experienceYears: 7, category: 'VIP Venue', genresOrSpecialisations: ['Hospitality'], activity: A_MID }),

  // ---- VIP Connoisseur ----
  makeArtist({ slug: 'farhan-qureshi', name: 'Farhan Qureshi', headline: 'Art & culture connoisseur', location: 'Hyderabad, India', photo: PIC.man1, primaryDomain: 'Cultural Experiences', tags: ['Curation', 'Patron'], verified: false, availability: 'Selectively Available', experienceYears: 20, category: 'VIP Connoisseur', genresOrSpecialisations: ['Cultural Experiences'], activity: A_LOW }),

  // ---- VIP Manager ----
  makeArtist({ slug: 'sneha-reddy', name: 'Sneha Reddy', headline: 'Artist & venue relationship manager', location: 'Hyderabad, India', photo: PIC.woman3, primaryDomain: 'Hospitality', tags: ['Management', 'Bookings'], verified: true, availability: 'Available', experienceYears: 11, category: 'VIP Manager', genresOrSpecialisations: ['Hospitality'], activity: A_MID }),
]

export const publicArtists: PublicArtist[] = [abhishek, ...others]

export function getMockArtist(slug?: string): PublicArtist | undefined {
  return publicArtists.find((a) => a.slug === slug)
}

// ---- Catalogue helpers ----
// effectiveLocation = adminCorrectedLocation ?? selfReportedLocation
export function effectiveLocation(a: PublicArtist): string {
  return a.adminCorrectedLocation ?? a.location
}
// City portion of the effective location (before the first comma).
export function effectiveCity(a: PublicArtist): string {
  return effectiveLocation(a).split(',')[0].trim()
}
export function profileCategory(a: PublicArtist): string {
  return a.category ?? 'Artist'
}
export function profileGenres(a: PublicArtist): string[] {
  return a.genresOrSpecialisations ?? a.tags
}
export function primaryGenre(a: PublicArtist): string {
  return profileGenres(a)[0] ?? a.primaryDomain
}

export const SAMPLE_SLUG = 'abhishek-singh-chouhan'
