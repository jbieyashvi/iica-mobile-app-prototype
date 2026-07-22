// ---- Public / published artist portfolio data (typed, reusable) ----

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
  href?: string
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
  link?: string
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
  visibility: 'Public',
  socials: {
    instagram: 'https://instagram.com/abhishek.chouhan',
    facebook: 'https://facebook.com/abhishek.chouhan',
    youtube: 'https://youtube.com/@abhishekchouhan',
    spotify: 'https://open.spotify.com/artist/abhishekchouhan',
  },
  whatsNew: [
    {
      id: 'n1',
      type: 'Live Concert',
      title: 'Live in Mumbai',
      date: '18 Aug 2026',
      description: 'An intimate evening of original compositions at antiSOCIAL.',
      image: IMG.ev1,
      cta: 'View event',
    },
    {
      id: 'n2',
      type: 'New Release',
      title: 'Tere Naal — New Release',
      date: '02 Aug 2026',
      description: 'A soft acoustic single, out now on all platforms.',
      image: IMG.m3,
      cta: 'Listen',
    },
    {
      id: 'n3',
      type: 'Recognition',
      title: 'Selected for the 50 Hour Music Challenge',
      date: '20 Jul 2026',
      description: 'One of a few artists chosen nationally for the challenge.',
      image: IMG.m2,
    },
    {
      id: 'n4',
      type: 'Workshop',
      title: 'Home Studio Production Basics',
      date: '28 Aug 2026',
      description: 'A hands-on workshop for aspiring producers.',
      image: IMG.m5,
      cta: 'Register',
    },
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
    { id: 'a1', year: '2025', name: '50 Hour Music Challenge — Selection', org: 'National Music Collective', recognitionType: 'Finalist', project: 'Original composition', link: 'https://example.com' },
    { id: 'a2', year: '2022', name: 'IMA Special Mention', org: 'Independent Music Awards', recognitionType: 'Special Mention', project: 'Tere Naal' },
    { id: 'a3', year: '2018', name: 'Young Composer of the Year', org: 'Malwa Arts Forum', recognitionType: 'Winner', project: 'Debut EP' },
    { id: 'a4', year: '2016', name: 'State Youth Talent', org: 'MP Cultural Board', recognitionType: 'Winner' },
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
  },
): PublicArtist {
  const availability = base.availability ?? 'Available'
  return {
    ...abhishek,
    slug: base.slug,
    name: base.name,
    headline: base.headline,
    location: base.location,
    photo: base.photo,
    primaryDomain: base.primaryDomain,
    tags: base.tags,
    verified: base.verified,
    followers: 3200,
    saves: 210,
    availability,
    availabilityLabel:
      availability === 'Not Available' ? 'Not accepting collaborations right now'
        : availability === 'Selectively Available' ? 'Available for selected collaborations'
          : 'Open to collaborations',
    experienceYears: base.experienceYears ?? 8,
    bio: `${base.name} is a ${base.headline.toLowerCase()} based in ${base.location.split(',')[0]}, working across the IICA community.`,
  }
}

const others: PublicArtist[] = [
  makeArtist({ slug: 'ananya-rao', name: 'Ananya Rao', headline: 'Bharatanatyam dancer', location: 'Bengaluru, India', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Dance', tags: ['Bharatanatyam', 'Choreography', 'Contemporary'], verified: true, availability: 'Selectively Available', experienceYears: 12 }),
  makeArtist({ slug: 'kabir-menon', name: 'Kabir Menon', headline: 'Sitarist & composer', location: 'Mumbai, India', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Music', tags: ['Sitar', 'Composition', 'Fusion'], verified: true, experienceYears: 15 }),
  makeArtist({ slug: 'meera-iyer', name: 'Meera Iyer', headline: 'Contemporary painter', location: 'Bengaluru, India', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Visual Arts', tags: ['Oil', 'Pigment', 'Abstract'], verified: false, availability: 'Not Available', experienceYears: 6 }),
  makeArtist({ slug: 'devraj-singh', name: 'Devraj Singh', headline: 'Tabla virtuoso', location: 'Jaipur, India', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Music', tags: ['Tabla', 'Percussion', 'Hindustani'], verified: true, experienceYears: 20 }),
  makeArtist({ slug: 'nisha-pillai', name: 'Nisha Pillai', headline: 'Documentary photographer', location: 'Kochi, India', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Photography', tags: ['Documentary', 'Portrait', 'Craft'], verified: false, experienceYears: 5 }),
  makeArtist({ slug: 'arjun-desai', name: 'Arjun Desai', headline: 'Vocalist & ghazal artist', location: 'Ahmedabad, India', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Music', tags: ['Vocals', 'Ghazal', 'Playback'], verified: true, experienceYears: 10 }),
  makeArtist({ slug: 'meera-kulkarni', name: 'Meera Kulkarni', headline: 'Visual artist & muralist', location: 'Pune, India', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Visual Arts', tags: ['Murals', 'Mixed Media', 'Public Art'], verified: true, availability: 'Available', experienceYears: 9 }),
  makeArtist({ slug: 'arjun-mehta', name: 'Arjun Mehta', headline: 'Percussionist & producer', location: 'Mumbai, India', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Music', tags: ['Percussion', 'Production', 'Live'], verified: false, availability: 'Selectively Available', experienceYears: 7 }),
  makeArtist({ slug: 'kavya-sharma', name: 'Kavya Sharma', headline: 'Folk artist & illustrator', location: 'Jaipur, India', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Visual Arts', tags: ['Folk Art', 'Illustration', 'Miniature'], verified: true, availability: 'Available', experienceYears: 4 }),
  makeArtist({ slug: 'rohan-sen', name: 'Rohan Sen', headline: 'Independent filmmaker', location: 'Kolkata, India', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Film & Media', tags: ['Direction', 'Editing', 'Documentary'], verified: true, availability: 'Selectively Available', experienceYears: 11 }),
  makeArtist({ slug: 'zoya-khan', name: 'Zoya Khan', headline: 'Theatre performer & director', location: 'Delhi, India', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Theatre', tags: ['Acting', 'Direction', 'Devised Theatre'], verified: false, availability: 'Available', experienceYears: 8 }),
  makeArtist({ slug: 'dev-malhotra', name: 'Dev Malhotra', headline: 'Music producer & mixing engineer', location: 'Chandigarh, India', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Music', tags: ['Production', 'Mixing', 'Electronic'], verified: true, availability: 'Available', experienceYears: 9 }),
  makeArtist({ slug: 'nandini-iyer', name: 'Nandini Iyer', headline: 'Cultural educator & vocalist', location: 'Chennai, India', photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80&auto=format&fit=crop', primaryDomain: 'Cultural Education', tags: ['Teaching', 'Carnatic', 'Workshops'], verified: true, availability: 'Selectively Available', experienceYears: 16 }),
]

export const publicArtists: PublicArtist[] = [abhishek, ...others]

export function getMockArtist(slug?: string): PublicArtist | undefined {
  return publicArtists.find((a) => a.slug === slug)
}

export const SAMPLE_SLUG = 'abhishek-singh-chouhan'
