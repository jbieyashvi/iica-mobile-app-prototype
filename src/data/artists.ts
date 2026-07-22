export interface Artist {
  id: string
  name: string
  discipline: string
  city: string
  verified: boolean
  photo: string
  cover?: string
  bio?: string
}

export const artists: Artist[] = [
  {
    id: 'ananya-rao',
    name: 'Ananya Rao',
    discipline: 'Bharatanatyam Dancer',
    city: 'Chennai',
    verified: true,
    photo:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop',
    bio: 'Classical dancer exploring the intersection of tradition and contemporary movement.',
  },
  {
    id: 'kabir-menon',
    name: 'Kabir Menon',
    discipline: 'Sitar & Composition',
    city: 'Mumbai',
    verified: true,
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
    bio: 'Sitarist blending Hindustani ragas with cinematic soundscapes.',
  },
  {
    id: 'meera-iyer',
    name: 'Meera Iyer',
    discipline: 'Contemporary Painter',
    city: 'Bengaluru',
    verified: false,
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop',
    bio: 'Working in oil and pigment on themes of memory and migration.',
  },
  {
    id: 'devraj-singh',
    name: 'Devraj Singh',
    discipline: 'Tabla Virtuoso',
    city: 'Jaipur',
    verified: true,
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
    bio: 'Percussionist from the Jaipur gharana, touring across three continents.',
  },
  {
    id: 'nisha-pillai',
    name: 'Nisha Pillai',
    discipline: 'Photographer',
    city: 'Kochi',
    verified: false,
    photo:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop',
    bio: 'Documentary photographer chronicling coastal craft communities.',
  },
  {
    id: 'arjun-desai',
    name: 'Arjun Desai',
    discipline: 'Vocalist',
    city: 'Ahmedabad',
    verified: true,
    photo:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop',
    bio: 'Playback and fusion vocalist with a devotion to ghazal.',
  },
]

export const getArtist = (id?: string) =>
  artists.find((a) => a.id === id) ?? artists[0]
