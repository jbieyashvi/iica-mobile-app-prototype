import { Portfolio } from './types'

// Preset "uploadable" creator images used by the mock upload pickers.
export const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483393458019-411bc6bd104e?w=600&q=80&auto=format&fit=crop',
]

const PROFILE_PHOTO =
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80&auto=format&fit=crop'
const COVER =
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=900&q=80&auto=format&fit=crop'

export function seedPortfolio(name: string, email: string): Portfolio {
  const first = (name || 'Reshma Patra').split(' ')[0]
  void email
  return {
    basics: {
      photo: PROFILE_PHOTO,
      cover: COVER,
      fullName: name || 'Reshma Patra',
      stageName: first,
      headline: 'Bharatanatyam dancer & independent music artist',
      city: 'Bhubaneswar',
      country: 'India',
      dob: '1994-05-12',
      gender: '',
      languages: 'Odia, Hindi, English',
      pronouns: '',
      visibility: 'Public',
    },
    about: {
      shortBio:
        'Classically trained Bharatanatyam dancer exploring the meeting point of tradition and contemporary sound. Founder of an independent music channel.',
      chapters: [
        {
          id: 'c1',
          heading: 'My First Performance',
          description:
            'At nine, I performed my arangetram in Bhubaneswar — the moment I knew the stage was home.',
          date: '2003',
          image: PRESET_IMAGES[0],
        },
        {
          id: 'c2',
          heading: 'Pursuing Excellence',
          description:
            'Years of rigorous training under my guru shaped both my technique and my patience.',
          date: '2011',
          image: PRESET_IMAGES[2],
        },
        {
          id: 'c3',
          heading: 'Professional Journey',
          description:
            'From state stages to an independent channel, I began composing and producing my own work.',
          date: '2020',
          image: PRESET_IMAGES[5],
        },
      ],
    },
    domain: {
      primaryDomain: 'Dance',
      customDomain: '',
      secondaryDomains: 'Music',
      subdomains: 'Bharatanatyam, Fusion',
      skills: ['Bharatanatyam', 'Choreography', 'Composition', 'Stage Production'],
      experience: '14',
      performanceLanguages: 'Odia, Hindi',
      styles: 'Classical, Contemporary Fusion',
    },
    timeline: [
      {
        id: 'm1',
        title: 'Sangeet Visharad',
        date: '2009',
        category: 'Education',
        description: 'Completed Sangeet Visharad, a formal diploma in classical arts.',
        media: '',
        link: '',
        featured: false,
      },
      {
        id: 'm2',
        title: 'First State-Level Performance',
        date: '2011',
        category: 'First Performance',
        description: 'Represented my district at the state cultural festival.',
        media: PRESET_IMAGES[0],
        link: '',
        featured: false,
      },
      {
        id: 'm3',
        title: 'Launched Independent Music Channel',
        date: '2020',
        category: 'Release',
        description: 'Started producing and releasing original fusion compositions.',
        media: PRESET_IMAGES[5],
        link: '',
        featured: false,
      },
      {
        id: 'm4',
        title: 'Selected for 50 Hour Music Challenge',
        date: '2025',
        category: 'Award',
        description: 'One of a handful of artists selected nationally for the challenge.',
        media: PRESET_IMAGES[4],
        link: '',
        featured: true,
      },
    ],
    awards: [
      {
        id: 'a1',
        name: 'Young Cultural Talent',
        org: 'Odisha Sangeet Natak Akademi',
        year: '2016',
        category: 'Classical Dance',
        project: 'Solo recital',
        recognitionType: 'Winner',
        description: 'Recognised for excellence in Bharatanatyam among young artists.',
        image: PRESET_IMAGES[1],
        link: '',
        featured: true,
      },
    ],
    media: [
      {
        id: 'md1',
        type: 'YouTube Video',
        title: 'Antaraal — Live Fusion Set',
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: PRESET_IMAGES[5],
        releaseDate: '2023-11-02',
        description: 'A live fusion performance blending classical rhythm with electronic textures.',
        credits: 'Composed & performed by Reshma Patra',
        featured: true,
      },
      {
        id: 'md2',
        type: 'Spotify Track',
        title: 'Megha (Single)',
        url: 'https://open.spotify.com/track/abc123',
        thumbnail: PRESET_IMAGES[7],
        releaseDate: '2024-06-18',
        description: 'A monsoon-inspired single.',
        credits: 'Vocals & production: Reshma Patra',
        featured: false,
      },
    ],
    collaborations: [],
    pastPerformances: [],
    education: [],
    experience: [],
    gallery: {
      images: [
        { id: 'g1', url: PRESET_IMAGES[0], caption: 'Arangetram, 2003', cover: true },
        { id: 'g2', url: PRESET_IMAGES[2], caption: 'State festival', cover: false },
        { id: 'g3', url: PRESET_IMAGES[4], caption: 'Studio session', cover: false },
      ],
      videos: [],
    },
    social: {
      instagram: 'https://instagram.com/reshma.patra',
      facebook: 'https://facebook.com/reshma.patra',
      youtube: 'https://youtube.com/@reshmapatra',
      spotify: 'https://open.spotify.com/artist/reshmapatra',
      x: '',
      linkedin: '',
      website: '',
      custom: [],
      hidden: [],
    },
    collabPrefs: {
      availability: 'Selectively Available',
      openTo: ['Live performances', 'Music collaborations', 'Workshops', 'Cultural events'],
      statement:
        'Looking to collaborate with composers and visual artists on immersive stage work that reinterprets classical forms.',
      locations: 'Bhubaneswar, Kolkata, Delhi',
      remote: true,
      contactMethod: 'IICA messages',
      showCTA: true,
    },
    featuredTestimonials: ['t1', 't2'],
    hiddenTestimonials: [],
    reportedTestimonials: [],
    published: false,
    slug: (name || 'Reshma Patra')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }
}

export interface Testimonial {
  id: string
  author: string
  role: string
  avatar: string
  rating: number
  text: string
  date: string
  status: 'approved' | 'pending'
}

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Kabir Menon',
    role: 'Sitarist · Mumbai',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop',
    rating: 5,
    text: 'Reshma brings rare discipline and imagination to every collaboration. A joy to share a stage with.',
    date: '2024-12-10',
    status: 'approved',
  },
  {
    id: 't2',
    author: 'Meera Iyer',
    role: 'Painter · Bengaluru',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop',
    rating: 5,
    text: 'Her sense of rhythm translated beautifully into our visual-art installation. Deeply professional.',
    date: '2024-10-02',
    status: 'approved',
  },
  {
    id: 't3',
    author: 'Devraj Singh',
    role: 'Tabla · Jaipur',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop',
    rating: 4,
    text: 'Wonderful artist with a clear vision. Looking forward to more work together.',
    date: '2025-01-14',
    status: 'approved',
  },
]

// IICA artists selectable in the Collaboration editor
export const iicaArtists = [
  { id: 'kabir-menon', name: 'Kabir Menon', discipline: 'Sitar', city: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop' },
  { id: 'meera-iyer', name: 'Meera Iyer', discipline: 'Painter', city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop' },
  { id: 'devraj-singh', name: 'Devraj Singh', discipline: 'Tabla', city: 'Jaipur',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop' },
  { id: 'arjun-desai', name: 'Arjun Desai', discipline: 'Vocalist', city: 'Ahmedabad',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop' },
]
