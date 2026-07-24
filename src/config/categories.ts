// ---- Creator membership categories (single source of truth) ----
// Exact spelling and capitalisation required by the client. Do not add
// "Other", do not allow custom values, do not substitute creative-domain
// options. Consumed by the membership application form only.

export const MEMBERSHIP_CATEGORIES = [
  'Artist',
  'Model',
  'Legacy Brand of Impact',
  'Fitness Champion',
  'Yoga Coach',
  'Athlete',
  'Sports Coach/Trainer/Enthusiast',
  'VIP Host',
  'VIP Venue',
  'VIP Connoisseur',
  'VIP Manager',
] as const

export type MembershipCategory = (typeof MEMBERSHIP_CATEGORIES)[number]

// Prefilled prototype demo value. Kept editable in the form.
export const DEMO_CATEGORY: MembershipCategory = 'Artist'
