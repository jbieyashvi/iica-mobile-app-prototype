// ---- Centralised prototype demo data (single source of truth) ----
// All values are fictional demo data. No real personal or payment info.

export const DEMO_OTP = '123456'
export const DEMO_PASSWORD = 'IICA123'

// dynamic future dates (never in the past) — Asia/Kolkata
const dayMs = 24 * 60 * 60 * 1000
export function futureISO(daysAhead: number): string {
  return new Date(Date.now() + daysAhead * dayMs).toISOString().slice(0, 10)
}
export function futureDateTimeLocal(daysAhead: number, time = '18:00'): string {
  return `${futureISO(daysAhead)}T${time}`
}

const PHOTO = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop'
const COVER = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=900&q=80&auto=format&fit=crop'
const WORK = [
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80&auto=format&fit=crop',
]

export const demoUser = {
  fullName: 'JB Yashvi',
  stageName: 'Yashvi',
  initials: 'JY',
  email: 'yashvi.demo@iica.app',
  phone: '+91 98765 43210',
  dob: '1998-08-15',
  gender: 'Woman',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  primaryDomain: 'Visual Arts',
  secondaryDomains: 'UI/UX Design, Creative Direction',
  experience: '5',
  languages: 'English, Hindi',
  memberId: 'JY.673.IICA',
  photo: PHOTO,
  cover: COVER,
  headline: 'Visual artist and experience designer creating thoughtful digital and cultural experiences.',
  bio: 'Yashvi is a multidisciplinary creator working across visual design, digital experiences and cultural storytelling.',
  slug: 'jb-yashvi',
}

export const demoMembershipApplication = {
  fullName: demoUser.fullName,
  stageName: demoUser.stageName,
  email: demoUser.email,
  countryCode: '+91',
  phone: '98765 43210',
  dob: demoUser.dob,
  gender: demoUser.gender,
  city: demoUser.city,
  country: demoUser.country,
  domain: 'Visual Arts',
  customDomain: '',
  subdomains: 'Digital Art, UI/UX Design',
  skills: 'Visual Design, Creative Direction, Storytelling',
  experience: '5',
  languages: 'English, Hindi',
  intro: 'Multidisciplinary creator designing thoughtful digital and cultural experiences.',
  instagram: 'https://instagram.com/yashvi.creates',
  facebook: 'https://facebook.com/yashvi.creates',
  youtube: 'https://youtube.com/@yashvicreates',
  spotify: 'https://open.spotify.com/artist/demo-yashvi',
  website: 'https://yashvi.design',
  portfolioUrl: 'https://yashvi.design/work',
  intents: ['Build my portfolio', 'Find collaborators', 'Promote events', 'Share content'],
  collabStatement: 'I’m interested in collaborating with musicians, performers and cultural organisations to create meaningful visual experiences.',
  accurate: true,
}

export const demoSocial = {
  instagram: demoMembershipApplication.instagram,
  facebook: demoMembershipApplication.facebook,
  youtube: demoMembershipApplication.youtube,
  spotify: demoMembershipApplication.spotify,
  website: demoMembershipApplication.website,
}

export const demoCollaborationPreferences = {
  availability: 'Available' as const,
  lookingFor: ['Cultural Event', 'Content Collaboration', 'Brand Collaboration', 'Remote Project'],
  domains: ['Music', 'Dance', 'Visual Arts'],
  skills: 'Creative Direction, Visual Design, Storytelling',
  genres: 'Contemporary, Fusion',
  experience: 'Established (5–10 yrs)',
  languages: 'English, Hindi',
  cities: 'Bengaluru, Mumbai, Delhi',
  countries: 'India',
  maxTravel: 'Anywhere in India',
  remoteOk: true,
  inPersonPref: false,
  statement: 'Looking to collaborate with performers and cultural organisations on immersive visual storytelling.',
  goal: 'Create a cross-disciplinary cultural showcase',
  timeline: '2–4 months',
  compensation: 'Open to Discussion' as const,
  contactMethod: 'IICA messages',
}

export const demoCollaborationRequest = {
  purpose: 'Cultural storytelling collaboration',
  project: 'Rhythms in Motion',
  projectType: 'Content Collaboration',
  description: 'A digital storytelling project combining performance, music and visual interaction.',
  role: 'Performing Artist',
  mode: 'Either' as const,
  location: 'Bengaluru',
  timeline: 'September–November 2026',
  compensation: 'Open to Discussion' as const,
  message: 'I loved your recent work and would be thrilled to collaborate on this piece.',
}

export const demoReview = {
  rating: 5,
  title: 'A thoughtful and inspiring collaborator',
  text: 'Working with this artist was a wonderful experience. Communication was clear, ideas were thoughtful and the final creative outcome exceeded expectations.',
  relation: 'Worked together',
  name: demoUser.fullName,
  email: demoUser.email,
}

export const demoCheckout = {
  name: demoUser.fullName,
  phone: demoUser.phone,
  line: '24 Demo Arts Street',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  postal: '560001',
  instructions: 'Leave with the front desk.',
}

export const demoEventAttendee = {
  name: demoUser.fullName,
  email: demoUser.email,
  phone: demoUser.phone,
  attendees: 1,
  country: 'India',
}

export const demoWork = WORK
