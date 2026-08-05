// ---- AI-powered Collaboration (Phase 1) shared types ----
// Prototype data structures. Kept backend/LLM-compatible: the same shapes a
// future secure API would return. No provider/API details leak to the UI.

export type CollabFormat = 'Online' | 'In Person' | 'Hybrid' | 'Flexible'
export type CollabRequestStatus = 'Sent' | 'Accepted' | 'Declined' | 'Completed' | 'Cancelled'
export type MatchLabel = 'Strong Match' | 'Good Match' | 'Possible Match'

export const NOT_SPECIFIED = 'Not specified'
export const ANY_LOCATION = 'Any location'
export const FLEXIBLE = 'Flexible'

export interface CollaborationRequirement {
  id: string
  createdByUserId: string
  originalText: string
  role: string
  skill: string
  genre: string
  location: string // a city, ANY_LOCATION, or 'Near Me'
  country: string
  nearMe: boolean
  format: CollabFormat
  preferredDate: string // human phrase (e.g. "This Weekend") or ISO date
  availability: string
  budget: string // NOT_SPECIFIED or a human amount
  purpose: string
  additionalDetails: string
  keywords: string[]
  createdAt: string
}

export interface CollaborationMatch {
  requirementId: string
  creatorId: string // creator slug (resolve full profile from shared records)
  score: number // 0–100
  label: MatchLabel
  reasons: string[]
  breakdown: Record<string, number>
}

export interface CollaborationRequest {
  id: string
  requirementId: string
  senderUserId: string
  senderName: string
  receiverUserId: string // creator slug
  receiverName: string
  title: string
  description: string
  skill: string
  genre: string
  proposedDate: string
  format: CollabFormat
  locationOrPlatform: string
  budget: string
  additionalNote: string
  status: CollabRequestStatus
  declineReason?: string
  direction: 'sent' | 'received'
  createdAt: string
  updatedAt: string
}

// A minimal, matcher-facing view of a creator, resolved from shared user /
// membership / portfolio records (never duplicated here).
export interface MatchCreator {
  slug: string
  name: string
  photo: string
  headline: string
  iicaId: string
  category: string // membership category
  primaryDomain: string
  genres: string[]
  skills: string[]
  city: string
  country: string
  availability: string
  format: CollabFormat // creator's typical collaboration format
  collabEnabled: boolean
  visibility: 'Public' | 'Members Only'
}
