import { Attendee, Booking, EventItem, TicketType } from './types'

const IMG = {
  concert: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80&auto=format&fit=crop',
  workshop: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop',
  jam: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80&auto=format&fit=crop',
  paint: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop',
  extra1: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop',
  extra2: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80&auto=format&fit=crop',
}

const AVATAR = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop'

const tt = (o: Partial<TicketType> & { id: string; name: string; price: number; quantity: number }): TicketType => ({
  currency: 'INR', sold: 0, salesStart: '2026-07-01', salesEnd: '2026-08-17',
  maxPerBuyer: 6, description: '', benefits: '', refundable: true, ...o,
})

export const seedEvents: EventItem[] = [
  {
    id: 'echoes-of-ujjain',
    title: 'Echoes of Ujjain',
    category: 'Concert',
    summary: 'A live concert of original fusion compositions under the Mumbai sky.',
    description:
      'Abhishek Singh Chouhan brings his signature blend of Hindustani classical and contemporary production to the stage for one unforgettable night. Expect original compositions, live improvisation and a full band.',
    format: 'In person',
    language: 'Hindi, English',
    audience: 'All ages',
    tags: ['Fusion', 'Live Band', 'Original Music'],
    performers: [
      { id: 'p1', name: 'Abhishek Singh Chouhan', role: 'Composer & Vocals' },
      { id: 'p2', name: 'Kabir Menon', role: 'Sitar' },
    ],
    expect: 'A 2-hour live set with an opening act, original songs and an interactive encore.',
    startDate: '2026-08-18', startTime: '20:00', endDate: '2026-08-18', endTime: '22:30',
    timezone: 'IST (GMT+5:30)', multiDay: false, recurring: false,
    regClose: '2026-08-18T18:00', doorTime: '19:15',
    schedule: [
      { id: 's1', start: '19:15', end: '20:00', title: 'Doors open & opening act', host: 'The Loft Collective', description: 'Warm-up set and seating.' },
      { id: 's2', start: '20:00', end: '21:30', title: 'Main performance', host: 'Abhishek Singh Chouhan', description: 'Original compositions.' },
      { id: 's3', start: '21:30', end: '22:30', title: 'Encore & meet', host: 'Abhishek Singh Chouhan', description: 'Interactive encore.' },
    ],
    venueName: 'antiSOCIAL, Khar', address: 'Rohan Plaza, Khar West', city: 'Mumbai',
    state: 'Maharashtra', country: 'India', postal: '400052',
    venueInstructions: 'Entry from Gate 2. Carry a valid ID.',
    accessibility: 'Wheelchair accessible. Accessible restrooms available.',
    parking: 'Paid parking available at Rohan Plaza.',
    paid: true,
    tickets: [
      tt({ id: 't-eb', name: 'Early Bird', price: 399, quantity: 60, sold: 54, description: 'Limited early-bird pricing.', benefits: 'Priority entry', maxPerBuyer: 4 }),
      tt({ id: 't-ga', name: 'General Admission', price: 599, quantity: 200, sold: 120, description: 'Standing / open seating.', benefits: 'Event entry' }),
      tt({ id: 't-vip', name: 'VIP', price: 1499, quantity: 30, sold: 12, description: 'Front rows + meet & greet.', benefits: 'Reserved seat, meet & greet, merch', maxPerBuyer: 2 }),
    ],
    capacity: 290, waitlist: true, approvalRequired: false, maxPerPerson: 6,
    refundPolicy: 'Refundable up to 48 hours before the event. A 10% processing fee applies.',
    cover: IMG.concert, images: [IMG.concert, IMG.extra1], accent: '#9D2567', featured: true,
    organiserId: 'abhishek-singh-chouhan', organiserName: 'Abhishek Singh Chouhan', organiserAvatar: AVATAR,
    status: 'published',
  },
  {
    id: 'intro-classical-composition',
    title: 'Introduction to Indian Classical Composition',
    category: 'Workshop',
    summary: 'A free online workshop on the fundamentals of composing in the classical tradition.',
    description:
      'A beginner-friendly session covering raga basics, structure and simple composition exercises. Bring an instrument or just your ears. Hosted live online.',
    format: 'Online',
    language: 'Hindi, English',
    audience: 'Beginners',
    tags: ['Composition', 'Theory', 'Beginner'],
    performers: [{ id: 'p1', name: 'Abhishek Singh Chouhan', role: 'Instructor' }],
    expect: 'A 90-minute interactive session with a live Q&A.',
    startDate: '2026-08-24', startTime: '11:00', endDate: '2026-08-24', endTime: '12:30',
    timezone: 'IST (GMT+5:30)', multiDay: false, recurring: false,
    regClose: '2026-08-24T10:00', doorTime: '',
    schedule: [
      { id: 's1', start: '11:00', end: '11:45', title: 'Fundamentals', host: 'Abhishek Singh Chouhan', description: 'Raga & structure.' },
      { id: 's2', start: '11:45', end: '12:30', title: 'Composition exercise + Q&A', host: 'Abhishek Singh Chouhan', description: 'Hands-on.' },
    ],
    online: { platform: 'Zoom', link: 'https://zoom.us/j/prototype-echoes', instructions: 'Join 5 minutes early. Link revealed after registration.' },
    paid: false,
    tickets: [],
    capacity: 100, waitlist: true, approvalRequired: false, maxPerPerson: 2,
    refundPolicy: 'Free event — cancel anytime.',
    cover: IMG.workshop, images: [IMG.workshop], accent: '#227A52',
    organiserId: 'abhishek-singh-chouhan', organiserName: 'Abhishek Singh Chouhan', organiserAvatar: AVATAR,
    status: 'published',
  },
  {
    id: 'sunday-indie-jam',
    title: 'Sunday Indie Music Jam',
    category: 'Music Jam',
    summary: 'An open, limited-capacity jam for indie musicians and listeners.',
    description:
      'Bring your instrument and join a relaxed Sunday afternoon jam. Limited spots to keep it intimate. Listeners welcome too.',
    format: 'In person',
    language: 'English',
    audience: 'Musicians & listeners',
    tags: ['Indie', 'Open Mic', 'Community'],
    performers: [{ id: 'p1', name: 'Bengaluru Indie Collective', role: 'Hosts' }],
    expect: 'A rotating open jam with a house kit and PA.',
    startDate: '2026-08-30', startTime: '16:00', endDate: '2026-08-30', endTime: '19:00',
    timezone: 'IST (GMT+5:30)', multiDay: false, recurring: false,
    regClose: '2026-08-30T14:00', doorTime: '15:45',
    schedule: [],
    venueName: 'The Courtyard', address: 'Indiranagar 100ft Rd', city: 'Bengaluru',
    state: 'Karnataka', country: 'India', postal: '560038',
    venueInstructions: 'Limited seating. First come, first served.',
    accessibility: 'Ground floor, step-free entry.',
    parking: 'Street parking only.',
    paid: false,
    tickets: [],
    capacity: 30, waitlist: true, approvalRequired: true, maxPerPerson: 2,
    refundPolicy: 'Free event.',
    cover: IMG.jam, images: [IMG.jam], accent: '#B77818',
    organiserId: 'bengaluru-indie', organiserName: 'Bengaluru Indie Collective',
    status: 'published',
  },
  {
    id: 'colours-of-folk-art',
    title: 'Colours of Indian Folk Art',
    category: 'Painting Session',
    summary: 'A hands-on folk-art painting session in the heart of Jaipur.',
    description:
      'Learn the motifs and techniques of Indian folk art in a guided painting session. All materials provided. Take your canvas home.',
    format: 'In person',
    language: 'Hindi, English',
    audience: 'All levels',
    tags: ['Folk Art', 'Hands-on', 'Materials Included'],
    performers: [{ id: 'p1', name: 'Meera Iyer', role: 'Artist & Guide' }],
    expect: 'A 3-hour guided session; all materials included.',
    startDate: '2026-09-06', startTime: '10:30', endDate: '2026-09-06', endTime: '13:30',
    timezone: 'IST (GMT+5:30)', multiDay: false, recurring: false,
    regClose: '2026-09-05T20:00', doorTime: '10:15',
    schedule: [],
    venueName: 'Jaipur Art House', address: 'Civil Lines', city: 'Jaipur',
    state: 'Rajasthan', country: 'India', postal: '302006',
    venueInstructions: 'Wear clothes you don’t mind getting paint on.',
    accessibility: 'Accessible entrance available.',
    parking: 'Free on-site parking.',
    paid: true,
    tickets: [
      tt({ id: 't-ga', name: 'General Admission', price: 899, quantity: 25, sold: 8, description: 'Includes all materials.', benefits: 'Canvas, paints, guidance' }),
      tt({ id: 't-duo', name: 'Duo Pass', price: 1599, quantity: 10, sold: 3, description: 'For two people.', benefits: 'Two kits, shared table', maxPerBuyer: 3 }),
    ],
    capacity: 45, waitlist: false, approvalRequired: false, maxPerPerson: 4,
    refundPolicy: 'Refundable up to 24 hours before the session.',
    cover: IMG.paint, images: [IMG.paint, IMG.extra2], accent: '#592049',
    organiserId: 'meera-iyer', organiserName: 'Meera Iyer',
    status: 'published',
  },
]

// A couple of seed bookings for the demo "My Tickets" experience.
export const seedBookings: Booking[] = [
  {
    id: 'bk-seed-1', orderId: 'IICA-90231', eventId: 'echoes-of-ujjain',
    eventTitle: 'Echoes of Ujjain', eventDate: '2026-08-18', cover: IMG.concert, format: 'In person',
    status: 'Confirmed', qty: 2, ticketTypeName: 'General Admission', amount: 1198, paid: true,
    buyerName: 'Reshma Patra', buyerEmail: 'reshma@example.com', createdAt: '2026-07-20',
    tickets: [
      { id: 'tk-1', eventId: 'echoes-of-ujjain', ticketType: 'General Admission', attendeeName: 'Reshma Patra' },
      { id: 'tk-2', eventId: 'echoes-of-ujjain', ticketType: 'General Admission', attendeeName: 'Guest' },
    ],
  },
]

export const seedAttendees: Attendee[] = [
  { id: 'at1', eventId: 'echoes-of-ujjain', name: 'Reshma Patra', email: 'reshma@example.com', ticketType: 'General Admission', qty: 2, regDate: '2026-07-20', paymentStatus: 'Paid', checkedIn: false, approval: 'Confirmed' },
  { id: 'at2', eventId: 'echoes-of-ujjain', name: 'Vikram Joshi', email: 'vikram@example.com', ticketType: 'VIP', qty: 1, regDate: '2026-07-19', paymentStatus: 'Paid', checkedIn: true, approval: 'Confirmed' },
  { id: 'at3', eventId: 'echoes-of-ujjain', name: 'Sneha Rao', email: 'sneha@example.com', ticketType: 'Early Bird', qty: 2, regDate: '2026-07-15', paymentStatus: 'Paid', checkedIn: false, approval: 'Confirmed' },
  { id: 'at4', eventId: 'sunday-indie-jam', name: 'Arjun Desai', email: 'arjun@example.com', ticketType: 'Free', qty: 1, regDate: '2026-08-01', paymentStatus: 'Free', checkedIn: false, approval: 'Pending Approval' },
  { id: 'at5', eventId: 'sunday-indie-jam', name: 'Nisha Pillai', email: 'nisha@example.com', ticketType: 'Free', qty: 2, regDate: '2026-08-02', paymentStatus: 'Free', checkedIn: false, approval: 'Waitlisted' },
]

export const emptyDraftTicket = (): TicketType => tt({ id: 'nt', name: '', price: 0, quantity: 50 })
