export interface FeaturedSlide {
  id: string
  category: string
  title: string
  subtitle: string
  cta: string
  image: string
  to: string
  /** object-position for the wide landscape crop (per-slide focal point). */
  focus?: string
}

export const featured: FeaturedSlide[] = [
  {
    id: 'spotlight-ananya',
    category: 'Artist Spotlight',
    title: 'Ananya Rao',
    subtitle: 'Reimagining Bharatanatyam for the contemporary stage.',
    cta: 'Read the story',
    image:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80&auto=format&fit=crop',
    to: '/artist/ananya-rao',
    focus: 'center 30%',
  },
  {
    id: 'festival-monsoon',
    category: 'Festival',
    title: 'Monsoon Ragas Festival',
    subtitle: 'Three evenings of classical music across Mumbai. 28–30 July.',
    cta: 'View lineup',
    image:
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80&auto=format&fit=crop',
    to: '/event/ragas-of-dusk',
    focus: 'center 45%',
  },
  {
    id: 'call-collab',
    category: 'Open Call',
    title: 'Collaborators Wanted',
    subtitle: 'A visual artist seeks a composer for an immersive installation.',
    cta: 'Explore collaboration',
    image:
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80&auto=format&fit=crop',
    to: '/collaborate',
    focus: 'center 40%',
  },
]
