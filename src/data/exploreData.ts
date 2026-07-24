// ---- Explore discovery mock data (typed, reusable) ----

export interface ExploreCategory {
  slug: string
  name: string
  image: string
  creators: number
  intro: string
}

export const exploreCategories: ExploreCategory[] = [
  { slug: 'music', name: 'Music', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80&auto=format&fit=crop', creators: 428, intro: 'Composers, vocalists and instrumentalists shaping India’s sound — from classical ragas to independent production.' },
  { slug: 'dance', name: 'Dance', image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80&auto=format&fit=crop', creators: 214, intro: 'Classical, folk and contemporary dancers keeping movement traditions alive and evolving.' },
  { slug: 'theatre', name: 'Theatre', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&q=80&auto=format&fit=crop', creators: 96, intro: 'Actors, directors and playwrights telling stories on stage.' },
  { slug: 'visual-arts', name: 'Visual Arts', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80&auto=format&fit=crop', creators: 312, intro: 'Painters, muralists and mixed-media artists exploring colour, form and heritage.' },
  { slug: 'photography', name: 'Photography', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&q=80&auto=format&fit=crop', creators: 187, intro: 'Documentary and fine-art photographers framing the everyday and the extraordinary.' },
  { slug: 'film-media', name: 'Film & Media', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80&auto=format&fit=crop', creators: 143, intro: 'Filmmakers, editors and media artists working across screens.' },
  { slug: 'literature', name: 'Literature', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80&auto=format&fit=crop', creators: 78, intro: 'Poets, writers and spoken-word artists working with language.' },
  { slug: 'fashion', name: 'Fashion', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80&auto=format&fit=crop', creators: 64, intro: 'Designers and textile artists reimagining Indian craft.' },
  { slug: 'cultural-education', name: 'Cultural Education', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&q=80&auto=format&fit=crop', creators: 52, intro: 'Educators and gurus passing on traditions to the next generation.' },
]

export const getCategory = (slug?: string) => exploreCategories.find((c) => c.slug === slug)

// Mixed editorial "Trending Now" feed
export interface TrendingItem {
  id: string
  kind: 'release' | 'video' | 'timeline' | 'award' | 'workshop' | 'artwork'
  label: string
  title: string
  meta: string
  image: string
  to: string
}

export const trendingFeed: TrendingItem[] = [
  { id: 't1', kind: 'release', label: 'New Release', title: 'Tere Naal', meta: 'Abhishek Singh Chouhan', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format&fit=crop', to: '/artist/abhishek-singh-chouhan' },
  { id: 't2', kind: 'video', label: 'Performance', title: 'Varnam in Kalyani', meta: 'Ananya Rao', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop', to: '/artist/ananya-rao' },
  { id: 't3', kind: 'award', label: 'Award', title: '50 Hour Music Challenge', meta: 'Abhishek Singh Chouhan', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80&auto=format&fit=crop', to: '/artist/abhishek-singh-chouhan' },
  { id: 't4', kind: 'workshop', label: 'Workshop', title: 'Intro to Classical Composition', meta: 'Free · Online', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&auto=format&fit=crop', to: '/events/intro-classical-composition' },
  { id: 't5', kind: 'artwork', label: 'Featured Artwork', title: 'Miniature folk series', meta: 'Kavya Sharma', image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80&auto=format&fit=crop', to: '/artist/kavya-sharma' },
  { id: 't6', kind: 'timeline', label: 'Milestone', title: 'Launched Mid Town Music', meta: 'Abhishek Singh Chouhan', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop', to: '/artist/abhishek-singh-chouhan' },
]

export interface Collection {
  id: string
  title: string
  subtitle: string
  image: string
  count: number
}

export const collections: Collection[] = [
  { id: 'col1', title: 'Women Shaping Indian Arts', subtitle: 'Curated', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop', count: 18 },
  { id: 'col2', title: 'Independent Musicians to Watch', subtitle: 'Editors’ pick', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&auto=format&fit=crop', count: 24 },
  { id: 'col3', title: 'Traditional Arts, New Voices', subtitle: 'Collection', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80&auto=format&fit=crop', count: 15 },
  { id: 'col4', title: 'Creative Workshops This Month', subtitle: 'Events', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&auto=format&fit=crop', count: 9 },
]

export type ShopKind = 'Masterclass' | 'Digital' | 'Physical'
export interface ShopItem {
  id: string
  kind: ShopKind
  title: string
  creator: string
  price: number
  image: string
}

export const shopPreview: ShopItem[] = [
  { id: 'art-of-songwriting', kind: 'Masterclass', title: 'The Art of Indian Songwriting', creator: 'Abhishek Singh Chouhan', price: 1499, image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80&auto=format&fit=crop' },
  { id: 'classical-practice-tracks', kind: 'Digital', title: 'Indian Classical Practice Tracks', creator: 'Abhishek Singh Chouhan', price: 499, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format&fit=crop' },
  { id: 'folk-art-journal', kind: 'Physical', title: 'Handcrafted Folk Art Journal', creator: 'Meera Kulkarni', price: 899, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80&auto=format&fit=crop' },
  { id: 'brush-texture-pack', kind: 'Digital', title: 'Folk Art Brush & Texture Pack', creator: 'Kavya Sharma', price: 649, image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80&auto=format&fit=crop' },
]

export const getProduct = (id?: string) => shopPreview.find((p) => p.id === id)

export const suggestedSearches = ['Classical music', 'Bharatanatyam', 'Workshops in Bengaluru', 'Folk artists', 'Free online events']
export const trendingSearches = ['Abhishek Singh Chouhan', 'Music jams', 'Painting sessions', 'Independent musicians', 'Ujjain']

export const INTEREST_OPTIONS = ['Music', 'Dance', 'Theatre', 'Visual Arts', 'Photography', 'Film', 'Literature', 'Workshops', 'Cultural Education']
export const COLLAB_INTERESTS = ['Live performances', 'Music collaborations', 'Workshops', 'Brand collaborations']
