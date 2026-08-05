// ---- Admin-curated Recommended Listings — published data contract ----
// The Admin Panel owns curation (heading, description, visibility, schedule,
// selected listing ids, order). The Mobile App ONLY renders this published
// configuration. This exact shape is preserved for future API/backend sync.

export type ListingType =
  | 'physical_product'
  | 'digital_product'
  | 'masterclass'
  | 'event'
  | 'donation'

export interface SelectedListing {
  listingId: string // for donations: "<artistSlug>::<optionId>"
  listingType: ListingType
  displayOrder: number
}

export interface RecommendedConfig {
  id: string
  heading: string
  description?: string
  isVisible: boolean
  startAt?: string // ISO; section shows only at/after this time
  endAt?: string // ISO; section hides after this time
  selectedListings: SelectedListing[]
  state: 'draft' | 'published'
  publishedAt?: string
}

// Resolved, render-ready card (derived live from the shared source records —
// never a copy of them).
export interface RecommendedCard {
  key: string
  type: ListingType
  listingId: string
  title: string
  subtitle: string // seller / instructor / host / creator
  meta: string // price / date / location
  typeLabel: string
  image?: string
  free: boolean
  price: number | null
  paid?: boolean
  // navigation targets (only the relevant one is set per type)
  productId?: string
  eventId?: string
  artistSlug?: string
  optionId?: string
}
