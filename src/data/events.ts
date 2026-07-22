export interface EventItem {
  id: string
  title: string
  category: string
  city: string
  venue: string
  date: string
  day: string
  month: string
  price: number | null // null = free
  image: string
  host: string
  description?: string
}

export const events: EventItem[] = [
  {
    id: 'ragas-of-dusk',
    title: 'Ragas of Dusk',
    category: 'Hindustani Recital',
    city: 'Mumbai',
    venue: 'NCPA, Nariman Point',
    date: '28 Jul 2026',
    day: '28',
    month: 'JUL',
    price: 799,
    image:
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80&auto=format&fit=crop',
    host: 'Kabir Menon',
    description:
      'An intimate evening of twilight ragas on sitar, accompanied by tabla and tanpura.',
  },
  {
    id: 'canvas-open-studio',
    title: 'Canvas: Open Studio',
    category: 'Art Walk',
    city: 'Bengaluru',
    venue: 'Indiranagar Art District',
    date: '02 Aug 2026',
    day: '02',
    month: 'AUG',
    price: null,
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80&auto=format&fit=crop',
    host: 'Meera Iyer',
    description:
      'Wander through open studios and meet painters mid-process. Free entry, all welcome.',
  },
  {
    id: 'rhythm-lab',
    title: 'Rhythm Lab: Tabla Intensive',
    category: 'Workshop',
    city: 'Jaipur',
    venue: 'Jawahar Kala Kendra',
    date: '09 Aug 2026',
    day: '09',
    month: 'AUG',
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=600&q=80&auto=format&fit=crop',
    host: 'Devraj Singh',
    description:
      'A hands-on masterclass on Jaipur gharana compositions for intermediate players.',
  },
  {
    id: 'coastal-frames',
    title: 'Coastal Frames',
    category: 'Photo Exhibition',
    city: 'Kochi',
    venue: 'Fort Kochi Pavilion',
    date: '15 Aug 2026',
    day: '15',
    month: 'AUG',
    price: null,
    image:
      'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=600&q=80&auto=format&fit=crop',
    host: 'Nisha Pillai',
    description:
      'A free exhibition documenting the fishing and craft communities of the Malabar coast.',
  },
]

export const getEvent = (id?: string) =>
  events.find((e) => e.id === id) ?? events[0]
