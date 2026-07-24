// ---- Artist Catalogue configuration (single source of truth) ----
// Category options are reused from the membership config — never re-hardcoded.
export { MEMBERSHIP_CATEGORIES } from './categories'
export type { MembershipCategory } from './categories'

// Location filter options (prototype). Admin may later correct inaccurate
// self-reported locations; catalogue filtering uses the profile's effective
// (admin-corrected ?? self-reported) location — see effectiveLocation().
export const CATALOGUE_LOCATIONS = [
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Ujjain',
  'Hyderabad',
  'Goa',
] as const

// Genre / specialisation options (prototype). Labelled "Genre" in the UI per
// client terminology, but backed by a flexible `genresOrSpecialisations`
// field so non-artist categories (venues, coaches, athletes, brands) can use
// venue type / discipline / specialisation / industry instead.
export const CATALOGUE_GENRES = [
  'Classical Music',
  'Contemporary Music',
  'Folk Music',
  'Devotional',
  'Bharatanatyam',
  'Kathak',
  'Contemporary Dance',
  'Theatre',
  'Visual Arts',
  'Folk Art',
  'Photography',
  'Film',
  'Fitness',
  'Yoga',
  'Sports',
  'Cultural Experiences',
  'Hospitality',
] as const

// ---- Featured-profile scoring (in-app activity only) ----
//
// DEVELOPER NOTE: This is a transparent PROTOTYPE heuristic. Featured ranking
// is driven purely by in-app activity — NOT by Instagram / YouTube / Spotify
// or any social follower count, which do not represent artistic quality.
// There is intentionally no admin "make featured" override and no manual
// ranking manipulation. Final production weights and inputs require business
// approval before launch.
export interface ProfileActivity {
  productsListed: number
  profileViews: number
  contentPublished: number
  eventsCreated: number
  collaborationAttempts: number
  profileCompleteness: number // 0..1
  lastActiveLabel: string // e.g. "Active this week"
}

export const FEATURED_WEIGHTS = {
  product: 6,
  view: 0.02,
  content: 4,
  event: 8,
  collaboration: 5,
  completeness: 25,
}

export function featuredScore(a?: ProfileActivity): number {
  if (!a) return 0
  return (
    a.productsListed * FEATURED_WEIGHTS.product +
    a.profileViews * FEATURED_WEIGHTS.view +
    a.contentPublished * FEATURED_WEIGHTS.content +
    a.eventsCreated * FEATURED_WEIGHTS.event +
    a.collaborationAttempts * FEATURED_WEIGHTS.collaboration +
    a.profileCompleteness * FEATURED_WEIGHTS.completeness
  )
}

export const FEATURED_BLURB = 'Featured based on recent activity across IICA.'
