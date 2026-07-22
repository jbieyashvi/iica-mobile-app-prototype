import { Portfolio } from '../portfolio/types'
import { EventItem } from '../events/types'
import { Product } from '../shop/types'
import { demoUser, demoSocial, demoCollaborationPreferences, demoWork, futureISO } from './demoData'

// ---------- Portfolio (complete, publish-ready) ----------
export function demoPortfolio(): Portfolio {
  return {
    basics: {
      photo: demoUser.photo, cover: demoUser.cover, fullName: demoUser.fullName, stageName: demoUser.stageName,
      headline: demoUser.headline, city: demoUser.city, country: demoUser.country, dob: demoUser.dob,
      gender: '', languages: demoUser.languages, pronouns: 'she/her', visibility: 'Public',
    },
    about: {
      shortBio: demoUser.bio,
      chapters: [
        { id: 'c1', heading: 'Beginning My Design Journey', description: 'Started exploring visual design and storytelling, learning the fundamentals of colour, form and narrative.', date: '2021', image: demoWork[0] },
        { id: 'c2', heading: 'Building Digital Experiences', description: 'Moved into product and experience design, shipping thoughtful digital experiences for cultural clients.', date: '2023', image: demoWork[2] },
        { id: 'c3', heading: 'Exploring Culture and AI', description: 'Now blending cultural storytelling with emerging tools to craft immersive, meaningful work.', date: '2026', image: demoWork[1] },
      ],
    },
    domain: {
      primaryDomain: 'Visual Arts', customDomain: '', secondaryDomains: 'UI/UX Design, Creative Direction',
      subdomains: 'Digital Art, UI/UX Design', skills: ['Visual Design', 'Creative Direction', 'Storytelling', 'Illustration'],
      experience: '5', performanceLanguages: 'English, Hindi', styles: 'Contemporary, Cultural',
    },
    timeline: [
      { id: 'm1', title: 'Started Professional Design Practice', date: '2021', category: 'Career', description: 'Began working professionally as a visual designer.', media: demoWork[0], link: '', featured: false },
      { id: 'm2', title: 'Completed First Cultural Design Project', date: '2022', category: 'Release', description: 'Delivered a visual identity for a cultural festival.', media: demoWork[3], link: '', featured: false },
      { id: 'm3', title: 'Led a Multi-disciplinary Product Experience', date: '2024', category: 'Career', description: 'Led design across a cross-disciplinary product launch.', media: demoWork[2], link: '', featured: false },
      { id: 'm4', title: 'Joined IICA Creator Community', date: '2026', category: 'Award', description: 'Became an active IICA creator.', media: demoWork[1], link: '', featured: true },
    ],
    awards: [
      { id: 'a1', name: 'Emerging Experience Designer', org: 'India Design Forum', year: '2024', category: 'Experience Design', project: 'Cultural product experience', recognitionType: 'Winner', description: 'Recognised for outstanding emerging work.', image: demoWork[0], link: '', featured: true },
      { id: 'a2', name: 'Creative Digital Storytelling Recognition', org: 'Digital Arts Council', year: '2025', category: 'Storytelling', project: 'Interactive narrative', recognitionType: 'Special Mention', description: 'Honoured for digital storytelling.', image: demoWork[2], link: '', featured: false },
    ],
    media: [
      { id: 'md1', type: 'YouTube Video', title: 'Designing Cultural Experiences — A Talk', url: 'https://youtube.com/watch?v=demo1', thumbnail: demoWork[3], releaseDate: '2025-11-02', description: 'A short talk on cultural experience design.', credits: 'By Yashvi', featured: true },
      { id: 'md2', type: 'Spotify Track', title: 'Studio Sessions (Playlist)', url: 'https://open.spotify.com/playlist/demo', thumbnail: demoWork[1], releaseDate: '2025-06-18', description: 'Music I design to.', credits: '', featured: false },
    ],
    collaborations: [
      { id: 'cl1', artistName: 'Ananya Rao', externalName: '', artistId: 'ananya-rao', project: 'Digital Identity for Contemporary Bharatanatyam', date: 'March 2026', role: 'Experience Designer', projectType: 'Installation', description: 'A digital identity system for a contemporary dance production.', link: '', image: demoWork[0], awarded: false, awardName: '', awardYear: '', awardCategory: '', awardOrg: '' },
    ],
    pastPerformances: [],
    education: [
      { id: 'ed1', institution: 'Srishti Institute of Art, Design and Technology', course: 'B.Des Visual Communication', field: 'Visual Communication', startYear: '2016', endYear: '2020', description: 'Focused on visual design and cultural studies.' },
    ],
    experience: [
      { id: 'ex1', org: 'Independent Studio', role: 'Visual & Experience Designer', startDate: '2023', endDate: '', current: true, description: 'Designing cultural and digital experiences for clients.' },
      { id: 'ex2', org: 'Cultural Tech Startup', role: 'Product Designer', startDate: '2021', endDate: '2023', current: false, description: 'Designed product experiences for a cultural platform.' },
    ],
    gallery: {
      images: [
        { id: 'g1', url: demoWork[0], caption: 'Festival identity', cover: true },
        { id: 'g2', url: demoWork[2], caption: 'Studio work', cover: false },
        { id: 'g3', url: demoWork[3], caption: 'On set', cover: false },
      ],
      videos: [],
    },
    social: {
      instagram: demoSocial.instagram, facebook: demoSocial.facebook, youtube: demoSocial.youtube, spotify: demoSocial.spotify,
      x: '', linkedin: 'https://linkedin.com/in/yashvi', website: demoSocial.website, custom: [], hidden: [],
    },
    collabPrefs: {
      availability: demoCollaborationPreferences.availability, openTo: ['Live performances', 'Workshops', 'Brand collaborations', 'Cultural events'],
      statement: demoCollaborationPreferences.statement, locations: demoCollaborationPreferences.cities, remote: true,
      contactMethod: 'IICA messages', showCTA: true,
    },
    featuredTestimonials: ['t1', 't2'], hiddenTestimonials: [], reportedTestimonials: [],
    published: false, slug: demoUser.slug,
  }
}

// ---------- Event demos ----------
const eventCover = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80&auto=format&fit=crop'
const workshopCover = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop'

export function demoPaidEventDraft(): Partial<EventItem> {
  const start = futureISO(35)
  return {
    title: 'Rhythms of India — An Evening of Music and Movement', category: 'Concert',
    summary: 'An intimate evening bringing contemporary music and Indian movement traditions together.',
    description: 'Join us for an intimate evening where contemporary music meets India’s rich movement traditions. This curated performance brings together musicians and dancers for an immersive experience that celebrates cultural storytelling. Expect original compositions, live improvisation and thoughtfully designed staging that blurs the line between concert and performance art. Whether you are a lifelong lover of the arts or simply curious, this evening offers a warm, intimate setting to experience the depth and beauty of Indian creative traditions reimagined for today.',
    format: 'In person', language: 'English and Hindi', audience: 'All ages', tags: ['Concert', 'Dance', 'Cultural'],
    performers: [{ id: 'p1', name: 'Yashvi', role: 'Curator & Visuals' }, { id: 'p2', name: 'Ananya Rao', role: 'Dancer' }],
    expect: 'A 2.5 hour curated evening with live music, movement and an interactive close.',
    startDate: start, startTime: '18:30', endDate: start, endTime: '21:00', timezone: 'IST (GMT+5:30)',
    multiDay: false, recurring: false, regClose: `${futureISO(34)}T18:30`, doorTime: '18:00',
    schedule: [
      { id: 's1', start: '18:00', end: '18:30', title: 'Doors & welcome', host: 'IICA', description: 'Seating and welcome drinks.' },
      { id: 's2', start: '18:30', end: '20:00', title: 'Main performance', host: 'Ensemble', description: 'Music and movement.' },
      { id: 's3', start: '20:00', end: '21:00', title: 'Interactive close', host: 'Yashvi', description: 'Q&A and mingling.' },
    ],
    venueName: 'Ranga Shankara', address: '36/2 8th Cross, JP Nagar', city: 'Bengaluru', state: 'Karnataka', country: 'India', postal: '560078',
    venueInstructions: 'Entry from the main gate. Carry a valid ID.', accessibility: 'Wheelchair accessible.', parking: 'Limited street parking.',
    paid: true, tickets: [
      { id: 't-eb', name: 'Early Bird', price: 499, currency: 'INR', quantity: 40, sold: 0, salesStart: futureISO(1), salesEnd: futureISO(30), maxPerBuyer: 4, description: 'Limited early pricing.', benefits: 'Priority entry', refundable: true },
      { id: 't-ga', name: 'General Admission', price: 799, currency: 'INR', quantity: 90, sold: 0, salesStart: futureISO(1), salesEnd: futureISO(34), maxPerBuyer: 6, description: 'Open seating.', benefits: 'Event entry', refundable: true },
      { id: 't-vip', name: 'VIP', price: 1499, currency: 'INR', quantity: 20, sold: 0, salesStart: futureISO(1), salesEnd: futureISO(34), maxPerBuyer: 2, description: 'Front rows + meet.', benefits: 'Reserved seat, meet & greet', refundable: true },
    ],
    capacity: 150, waitlist: true, approvalRequired: false, maxPerPerson: 6,
    refundPolicy: 'Refundable up to 48 hours before the event. A 10% processing fee applies.',
    cover: eventCover, images: [eventCover], accent: '#9D2567', featuredRequest: true,
  }
}

export function demoFreeWorkshopDraft(): Partial<EventItem> {
  const start = futureISO(21)
  return {
    title: 'Visual Storytelling Workshop — Free Session', category: 'Workshop',
    summary: 'A free, hands-on introduction to translating cultural stories into visuals.',
    description: 'A beginner-friendly, hands-on workshop exploring how to turn cultural narratives into clear, memorable visuals. Bring a notebook and your curiosity. We’ll cover simple frameworks for visual storytelling and work through a short exercise together, online and free for all.',
    format: 'Online', language: 'English', audience: 'Beginners', tags: ['Workshop', 'Design', 'Free'],
    performers: [{ id: 'p1', name: 'Yashvi', role: 'Instructor' }],
    expect: 'A 90-minute interactive session with a live Q&A.',
    startDate: start, startTime: '11:00', endDate: start, endTime: '12:30', timezone: 'IST (GMT+5:30)',
    multiDay: false, recurring: false, regClose: `${futureISO(20)}T11:00`, doorTime: '',
    schedule: [{ id: 's1', start: '11:00', end: '12:30', title: 'Workshop + Q&A', host: 'Yashvi', description: 'Hands-on session.' }],
    online: { platform: 'Zoom', link: 'https://zoom.us/j/demo-workshop', instructions: 'Join 5 minutes early. Link revealed after registration.' },
    paid: false, tickets: [], capacity: 100, waitlist: true, approvalRequired: false, maxPerPerson: 2,
    refundPolicy: 'Free event — cancel anytime.', cover: workshopCover, images: [workshopCover], accent: '#227A52',
  }
}

// ---------- Product demos ----------
const masterCover = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80&auto=format&fit=crop'
const digitalCover = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&q=80&auto=format&fit=crop'
const journalCover = 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700&q=80&auto=format&fit=crop'

export function demoMasterclassDraft(): Partial<Product> {
  return {
    type: 'Masterclass', title: 'Visual Storytelling for Cultural Creators',
    summary: 'Learn how to translate cultural narratives into clear and memorable visual experiences.',
    description: 'A practical masterclass on turning cultural stories into strong visual work — covering research, concepting, composition and delivery, with real examples and exercises.',
    category: 'Visual Arts', subcategory: 'Design', tags: ['Storytelling', 'Design', 'Culture'], language: 'English',
    instructor: 'Yashvi', level: 'All Levels', duration: '3h 30m', certificate: true, accessDuration: 'Lifetime',
    outcomes: ['Translate a cultural story into visuals', 'Build a strong visual concept', 'Compose memorable frames', 'Deliver a cohesive project'],
    requirements: 'Any design tool. No prior experience needed.', audience: 'Designers and cultural creators',
    syllabus: [
      { id: 's1', title: 'Foundations', description: 'Story & research', lessons: [
        { id: 'l1', title: 'Welcome & overview', duration: '8m', freePreview: true, resources: ['Guide.pdf'] },
        { id: 'l2', title: 'Finding the story', duration: '20m', freePreview: false, resources: [] },
      ] },
      { id: 's2', title: 'Concept & composition', description: 'Making it visual', lessons: [
        { id: 'l3', title: 'From idea to concept', duration: '24m', freePreview: false, resources: [] },
        { id: 'l4', title: 'Composition basics', duration: '22m', freePreview: false, resources: [] },
      ] },
      { id: 's3', title: 'Delivery', description: 'Finishing well', lessons: [
        { id: 'l5', title: 'Cohesion & polish', duration: '26m', freePreview: false, resources: ['Checklist.pdf'] },
        { id: 'l6', title: 'Final project walkthrough', duration: '30m', freePreview: false, resources: [] },
      ] },
    ],
    price: 1499, free: false, cover: masterCover, images: [masterCover],
  }
}

export function demoDigitalDraft(): Partial<Product> {
  return {
    type: 'Digital', title: 'Cultural Storytelling Canvas Pack',
    summary: 'A ready-to-use pack of canvases and templates for cultural storytelling.',
    description: 'A collection of print-ready canvases and layered templates to help you plan and present cultural storytelling projects.',
    category: 'Visual Arts', subcategory: 'Assets', tags: ['Templates', 'Canvas', 'Storytelling'], language: 'English',
    digitalType: 'Design Asset', fileFormat: 'PDF and PNG', fileSize: '48 MB', version: '1.0', licence: 'Commercial Use',
    downloadLimit: 'Unlimited', usage: 'For personal and commercial projects.', sampleUrl: 'https://yashvi.design/sample',
    price: 799, free: false, cover: digitalCover, images: [digitalCover],
  }
}

export function demoPhysicalDraft(): Partial<Product> {
  return {
    type: 'Physical', title: 'Indian Arts Creative Journal',
    summary: 'A hand-finished journal for sketching and cultural note-taking.',
    description: 'A durable, hand-finished journal with cotton paper — perfect for sketching, journaling and planning creative work.',
    category: 'Craft', subcategory: 'Stationery', tags: ['Journal', 'Handmade'], language: '—',
    sku: 'IICA-JRN-001', materials: 'Cotton paper, board', dimensions: '21 × 14 × 2 cm', weight: '340 g', origin: 'India',
    stock: 50, lowStock: 5, variants: [],
    shippingRegions: 'India', processing: '2–3 business days', deliveryEstimate: '5–7 days', shippingType: 'Flat Rate', shippingCost: 80,
    returnEligible: true, returnWindow: '7 days', care: 'Keep away from moisture.',
    price: 899, free: false, cover: journalCover, images: [journalCover],
  }
}
