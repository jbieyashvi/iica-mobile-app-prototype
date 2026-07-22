import { Candidate, CollabRequest, Meeting, WEIGHTS } from './types'

const PHOTO: Record<string, string> = {
  'ananya-rao': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop',
  'arjun-mehta': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop',
  'kavya-sharma': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop',
  'meera-kulkarni': 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80&auto=format&fit=crop',
  'rohan-sen': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
  'zoya-khan': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&auto=format&fit=crop',
  'dev-malhotra': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop',
  'nandini-iyer': 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80&auto=format&fit=crop',
}

const WORK = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80&auto=format&fit=crop',
]

const dim = (score: number, weight: number, reason: string) => ({ score, weight, reason })

export const candidates: Candidate[] = [
  {
    id: 'ananya-rao', name: 'Ananya Rao', photo: PHOTO['ananya-rao'], verified: true,
    primaryDomain: 'Dance', headline: 'Bharatanatyam dancer', location: 'Bengaluru, India',
    skills: ['Bharatanatyam', 'Choreography', 'Stage Direction'], availability: 'Selectively Available',
    matchPercent: 92, rationale: 'Her classical choreography complements your fusion compositions for a stage collaboration.',
    sharedInterests: ['Live Performance', 'Cultural Event', 'Fusion'],
    statement: 'Looking to build immersive stage work that reinterprets classical dance with live music.',
    selectedWork: [WORK[1], WORK[0]],
    breakdown: {
      creative: dim(96, WEIGHTS.creative, 'Dance + music pairing is highly complementary for live work.'),
      intent: dim(90, WEIGHTS.intent, 'Both seeking live performance and cultural-event collaborations.'),
      location: dim(85, WEIGHTS.location, 'Different cities but both open to travel for performances.'),
      social: dim(88, WEIGHTS.social, 'Active, engaged audience across platforms.'),
    },
  },
  {
    id: 'dev-malhotra', name: 'Dev Malhotra', photo: PHOTO['dev-malhotra'], verified: true,
    primaryDomain: 'Music', headline: 'Music producer & mixing engineer', location: 'Chandigarh, India',
    skills: ['Production', 'Mixing', 'Sound Design'], availability: 'Available',
    matchPercent: 89, rationale: 'A producer whose mixing skills fill a gap in your solo production workflow.',
    sharedInterests: ['Music Collaboration', 'Remote Project'],
    statement: 'Open to producing and mixing for independent artists, remote-first.',
    selectedWork: [WORK[0]],
    breakdown: {
      creative: dim(94, WEIGHTS.creative, 'Complementary production skills to your composition.'),
      intent: dim(92, WEIGHTS.intent, 'Both open to remote music collaborations.'),
      location: dim(70, WEIGHTS.location, 'Remote-friendly; travel less relevant.'),
      social: dim(80, WEIGHTS.social, 'Steady release cadence and following.'),
    },
  },
  {
    id: 'nandini-iyer', name: 'Nandini Iyer', photo: PHOTO['nandini-iyer'], verified: true,
    primaryDomain: 'Cultural Education', headline: 'Cultural educator & vocalist', location: 'Chennai, India',
    skills: ['Teaching', 'Carnatic', 'Curriculum'], availability: 'Selectively Available',
    matchPercent: 86, rationale: 'Ideal partner for a workshop series pairing composition with cultural context.',
    sharedInterests: ['Workshop', 'Teaching', 'Cultural Event'],
    statement: 'Designing workshops that connect young learners with classical traditions.',
    selectedWork: [WORK[2]],
    breakdown: {
      creative: dim(84, WEIGHTS.creative, 'Education + composition works well for workshops.'),
      intent: dim(90, WEIGHTS.intent, 'Shared workshop and teaching intent.'),
      location: dim(82, WEIGHTS.location, 'Both attend cultural events across South India.'),
      social: dim(85, WEIGHTS.social, 'Respected educator with strong community reach.'),
    },
  },
  {
    id: 'arjun-mehta', name: 'Arjun Mehta', photo: PHOTO['arjun-mehta'], verified: false,
    primaryDomain: 'Music', headline: 'Percussionist & producer', location: 'Mumbai, India',
    skills: ['Percussion', 'Live', 'Production'], availability: 'Selectively Available',
    matchPercent: 84, rationale: 'Live percussion that would elevate your fusion set on stage.',
    sharedInterests: ['Live Performance', 'Music Collaboration'],
    statement: 'Available for live gigs and studio percussion sessions.',
    selectedWork: [WORK[0], WORK[1]],
    breakdown: {
      creative: dim(90, WEIGHTS.creative, 'Percussion complements melodic composition.'),
      intent: dim(82, WEIGHTS.intent, 'Both keen on live collaborations.'),
      location: dim(78, WEIGHTS.location, 'Frequent performer in your touring cities.'),
      social: dim(72, WEIGHTS.social, 'Growing but engaged audience.'),
    },
  },
  {
    id: 'rohan-sen', name: 'Rohan Sen', photo: PHOTO['rohan-sen'], verified: true,
    primaryDomain: 'Film & Media', headline: 'Independent filmmaker', location: 'Kolkata, India',
    skills: ['Direction', 'Editing', 'Cinematography'], availability: 'Selectively Available',
    matchPercent: 81, rationale: 'Could film a music-video collaboration around your new release.',
    sharedInterests: ['Content Collaboration', 'Commissioned Work'],
    statement: 'Interested in music videos and artist documentaries.',
    selectedWork: [WORK[2]],
    breakdown: {
      creative: dim(86, WEIGHTS.creative, 'Film + music is a natural content pairing.'),
      intent: dim(80, WEIGHTS.intent, 'Both open to content collaboration.'),
      location: dim(72, WEIGHTS.location, 'Remote pre-production possible; shoot travel needed.'),
      social: dim(78, WEIGHTS.social, 'Solid festival presence.'),
    },
  },
  {
    id: 'kavya-sharma', name: 'Kavya Sharma', photo: PHOTO['kavya-sharma'], verified: true,
    primaryDomain: 'Visual Arts', headline: 'Folk artist & illustrator', location: 'Jaipur, India',
    skills: ['Folk Art', 'Illustration', 'Design'], availability: 'Available',
    matchPercent: 78, rationale: 'Cover art and visuals grounded in folk traditions for your releases.',
    sharedInterests: ['Content Collaboration', 'Commissioned Work'],
    statement: 'Creating folk-inspired visuals and album art for musicians.',
    selectedWork: [WORK[2]],
    breakdown: {
      creative: dim(82, WEIGHTS.creative, 'Visual identity supports your musical brand.'),
      intent: dim(76, WEIGHTS.intent, 'Open to commissioned visual work.'),
      location: dim(70, WEIGHTS.location, 'Remote delivery works well.'),
      social: dim(74, WEIGHTS.social, 'Distinctive, recognisable style.'),
    },
  },
  {
    id: 'zoya-khan', name: 'Zoya Khan', photo: PHOTO['zoya-khan'], verified: false,
    primaryDomain: 'Theatre', headline: 'Theatre performer & director', location: 'Delhi, India',
    skills: ['Acting', 'Direction', 'Devised Theatre'], availability: 'Available',
    matchPercent: 74, rationale: 'A theatre-music crossover for a devised performance piece.',
    sharedInterests: ['Live Performance', 'Cultural Event'],
    statement: 'Devising theatre that integrates live music and movement.',
    selectedWork: [WORK[1]],
    breakdown: {
      creative: dim(80, WEIGHTS.creative, 'Theatre + music suits devised performance.'),
      intent: dim(72, WEIGHTS.intent, 'Both open to live cultural events.'),
      location: dim(66, WEIGHTS.location, 'Travel needed for co-creation.'),
      social: dim(70, WEIGHTS.social, 'Engaged niche following.'),
    },
  },
  {
    id: 'meera-kulkarni', name: 'Meera Kulkarni', photo: PHOTO['meera-kulkarni'], verified: true,
    primaryDomain: 'Visual Arts', headline: 'Visual artist & muralist', location: 'Pune, India',
    skills: ['Murals', 'Mixed Media', 'Public Art'], availability: 'Available',
    matchPercent: 71, rationale: 'Immersive stage or venue visuals for a live show.',
    sharedInterests: ['Live Performance', 'Cultural Event'],
    statement: 'Creating large-scale visuals for performances and public spaces.',
    selectedWork: [WORK[2]],
    breakdown: {
      creative: dim(78, WEIGHTS.creative, 'Stage visuals enhance live music.'),
      intent: dim(70, WEIGHTS.intent, 'Both open to cultural-event work.'),
      location: dim(68, WEIGHTS.location, 'On-site installation requires travel.'),
      social: dim(70, WEIGHTS.social, 'Well-regarded public-art portfolio.'),
    },
  },
]

export const getCandidate = (id?: string) => candidates.find((c) => c.id === id)

const slot = (id: string, date: string, time: string) => ({ id, date, time })

export const seedRequests: CollabRequest[] = [
  {
    id: 'rq-r1', artistId: 'arjun-mehta', artistName: 'Arjun Mehta', artistPhoto: PHOTO['arjun-mehta'], matchPercent: 84,
    direction: 'received', purpose: 'Live percussion for fusion set', project: 'Echoes Live', projectType: 'Live Performance',
    description: 'Add live tabla and cajon to your Mumbai set.', why: 'Your fusion sound is exactly what I want to perform with live.',
    role: 'Live percussionist', mode: 'In Person', location: 'Mumbai', timeline: '4–6 weeks', compensation: 'Revenue Share',
    slots: [slot('s1', '2026-08-05', '17:00'), slot('s2', '2026-08-06', '11:00'), slot('s3', '2026-08-08', '19:00')],
    alternateSlots: [], link: '', message: 'Would love to jam before the show.', status: 'Pending',
    createdAt: '2026-07-21', viewed: false,
  },
  {
    id: 'rq-r2', artistId: 'nandini-iyer', artistName: 'Nandini Iyer', artistPhoto: PHOTO['nandini-iyer'], matchPercent: 86,
    direction: 'received', purpose: 'Co-host a composition workshop', project: 'Roots & Rhythm', projectType: 'Workshop',
    description: 'A two-session workshop pairing composition with cultural context.', why: 'Your independent journey would inspire our students.',
    role: 'Guest instructor', mode: 'Either', location: 'Chennai / Online', timeline: 'Next month', compensation: 'Paid',
    slots: [slot('s1', '2026-08-12', '10:00'), slot('s2', '2026-08-14', '16:00'), slot('s3', '2026-08-15', '11:00')],
    alternateSlots: [], link: '', message: '', status: 'Pending', createdAt: '2026-07-20', viewed: true,
  },
  {
    id: 'rq-s1', artistId: 'dev-malhotra', artistName: 'Dev Malhotra', artistPhoto: PHOTO['dev-malhotra'], matchPercent: 89,
    direction: 'sent', purpose: 'Mix my next single', project: 'Megha (Remix)', projectType: 'Music Collaboration',
    description: 'Mixing and light production on a new single.', why: 'Your mixing style fits the texture I want.',
    role: 'Mixing engineer', mode: 'Remote', location: 'Remote', timeline: '2–3 weeks', compensation: 'Paid',
    slots: [slot('s1', '2026-08-04', '15:00'), slot('s2', '2026-08-07', '18:00'), slot('s3', '2026-08-09', '12:00')],
    alternateSlots: [], link: 'https://example.com/demo', message: 'Sharing the stems once we align.', status: 'Pending',
    createdAt: '2026-07-19', viewed: true,
  },
]

export const seedMeetings: Meeting[] = [
  {
    id: 'mt-1', requestId: 'rq-old', artistId: 'kabir-menon', artistName: 'Kabir Menon',
    artistPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
    project: 'Antaraal Vol. 2', purpose: 'Plan the next fusion EP', date: '2026-07-30', time: '16:00',
    timezone: 'IST (GMT+5:30)', mode: 'Remote', location: 'Online', online: true, status: 'Upcoming',
  },
]
