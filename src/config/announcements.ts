// ---- What's New announcements (single source of truth) ----
// Reusable across every profile category. Not a membership/product category.

export const ANNOUNCEMENT_TYPES = [
  'Upcoming Show', 'New Release', 'Event', 'Workshop', 'Competition',
  'Appearance', 'Collaboration', 'New Project', 'Announcement', 'Other',
] as const

export const CTA_LABELS = [
  'View Details', 'Book Tickets', 'Register', 'Subscribe on YouTube',
  'Listen on Spotify', 'Watch in Archive', 'View Event', 'Shop Now',
  'Learn More', 'Visit Link',
] as const

export const RELATED_TYPES = ['None', 'Event', 'Archive Video', 'Product'] as const

export const WHATS_NEW_EYEBROW = 'WHAT’S NEW'
export const WHATS_NEW_DEFAULT_HEADING = 'What’s Coming Up'

// Adaptive primary heading by membership category (§2). One place only.
export const WHATS_NEW_HEADINGS: Record<string, string> = {
  Artist: 'Upcoming Shows & Releases',
  Model: 'Upcoming Work & Appearances',
  'Legacy Brand of Impact': 'Latest Announcements',
  'Fitness Champion': 'Upcoming Sessions & Competitions',
  'Yoga Coach': 'Upcoming Sessions & Workshops',
  Athlete: 'Upcoming Competitions & Appearances',
  'Sports Coach/Trainer/Enthusiast': 'Upcoming Training & Events',
  'VIP Host': 'Upcoming Appearances & Events',
  'VIP Venue': 'Upcoming at the Venue',
  'VIP Connoisseur': 'Latest Recommendations & Appearances',
  'VIP Manager': 'Upcoming Projects & Announcements',
}

export function headingForCategory(category?: string): string {
  if (category && WHATS_NEW_HEADINGS[category]) return WHATS_NEW_HEADINGS[category]
  return WHATS_NEW_DEFAULT_HEADING
}

export type DateStatus = 'Upcoming' | 'Today' | 'Recently Released' | 'Completed'

// Simple derived status. "type" chooses past-tense wording.
export function dateStatus(date: string, type?: string): DateStatus {
  const t = Date.parse(date)
  if (Number.isNaN(t)) return 'Upcoming'
  const today = new Date('2026-08-15') // prototype "today"
  const d = new Date(t)
  const dayMs = 86_400_000
  const diff = Math.floor((d.getTime() - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / dayMs)
  if (diff > 0) return 'Upcoming'
  if (diff === 0) return 'Today'
  const releaseLike = type === 'New Release' || type === 'New Project'
  return releaseLike ? 'Recently Released' : 'Completed'
}

// Keep passed items for a limited recent window; older ones drop out of
// What's New (prototype: 45 days).
export function isCurrent(date: string, windowDays = 45): boolean {
  const t = Date.parse(date)
  if (Number.isNaN(t)) return true
  const today = Date.parse('2026-08-15')
  return t >= today - windowDays * 86_400_000
}

export function humanDate(date: string): string {
  const t = Date.parse(date)
  if (Number.isNaN(t)) return date
  return new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
