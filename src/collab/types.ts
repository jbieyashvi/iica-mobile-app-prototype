// ---- AI Collaboration module types ----

export type Availability = 'Available' | 'Selectively Available' | 'Not Available'
export type Compensation = 'Paid' | 'Unpaid' | 'Revenue Share' | 'Open to Discussion'
export type CollabMode = 'In Person' | 'Remote' | 'Either'

export const LOOKING_FOR = [
  'Live Performance', 'Music Collaboration', 'Workshop', 'Teaching', 'Brand Collaboration',
  'Commissioned Work', 'Remote Project', 'Cultural Event', 'Content Collaboration', 'Other',
]

// Scoring weights (PRD) — must total 100
export const WEIGHTS = { creative: 30, intent: 25, location: 25, social: 20 }

export interface CollabPrefs {
  availability: Availability
  lookingFor: string[]
  domains: string[]
  skills: string
  genres: string
  experience: string
  languages: string
  cities: string
  countries: string
  maxTravel: string
  remoteOk: boolean
  inPersonPref: boolean
  statement: string
  goal: string
  timeline: string
  compensation: Compensation
  contactMethod: string
  configured: boolean // single readiness flag: true = saved at least once
  savedAt?: number // epoch ms of last save
}

export interface ScoreDim {
  score: number // 0-100 for this dimension
  weight: number
  reason: string
}

export interface Candidate {
  id: string // matches a publicArtists slug
  name: string
  photo: string
  verified: boolean
  primaryDomain: string
  headline: string
  location: string
  skills: string[]
  availability: Availability
  matchPercent: number
  rationale: string
  sharedInterests: string[]
  statement: string
  selectedWork: string[]
  breakdown: {
    creative: ScoreDim
    intent: ScoreDim
    location: ScoreDim
    social: ScoreDim
  }
}

export type RequestStatus =
  | 'Pending'
  | 'Accepted'
  | 'Alternate Time Proposed'
  | 'Declined'
  | 'Meeting Confirmed'
  | 'Expired'
  | 'Cancelled'

export interface MeetingSlot {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
}

export interface CollabRequest {
  id: string
  artistId: string
  artistName: string
  artistPhoto: string
  matchPercent: number
  direction: 'sent' | 'received'
  purpose: string
  project: string
  projectType: string
  description: string
  why: string
  role: string
  mode: CollabMode
  location: string
  timeline: string
  compensation: Compensation
  slots: MeetingSlot[]
  alternateSlots: MeetingSlot[]
  link: string
  message: string
  status: RequestStatus
  createdAt: string
  viewed: boolean
  declineReason?: string
  chosenSlotId?: string
}

export type MeetingStatus = 'Upcoming' | 'Past' | 'Cancelled' | 'Reschedule Requested'

export interface Meeting {
  id: string
  requestId: string
  artistId: string
  artistName: string
  artistPhoto: string
  project: string
  purpose: string
  date: string
  time: string
  timezone: string
  mode: CollabMode
  location: string
  online: boolean
  status: MeetingStatus
  rescheduleSlots?: MeetingSlot[]
  rescheduleReason?: string
}

export interface SwipeSession {
  active: boolean
  queue: string[] // candidate ids remaining
  index: number
  interested: string[]
  saved: string[]
  skipped: string[]
  history: { id: string; action: 'interested' | 'skipped' }[]
  instructionsDismissed: boolean
}

export const COOLDOWN_MS = 24 * 60 * 60 * 1000
