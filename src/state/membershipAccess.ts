// ---- Shared membership access derivation (single source of truth) ----
//
// The membership record lives in one place: the AuthState persisted to
// localStorage (`iica_auth_v1`). Every screen that gates on account type,
// IICA ID or membership status derives its booleans from this helper so the
// same account shows a consistent state across Profile, Membership purchase,
// Portfolio, Collaborations, Products and Events.
//
// Generating an IICA ID alone never unlocks creator features — only a
// successful in-app purchase (paymentDone + active/restored) does.

import type { AuthState, MembershipStatus } from './AuthContext'
import { membershipPurchaseEnabled, MEMBERSHIP_UNAVAILABLE_MSG } from '../config/platform'

export type MemberStage =
  | 'guest' // not signed in
  | 'registered' // signed in, no membership application / IICA ID
  | 'pending' // has IICA ID, membership not yet paid
  | 'active' // paid, active creator member
  | 'suspended' // paid before, now suspended or expired

// Statuses that mean "was an active member, access now revoked". The IICA ID,
// payment history and portfolio data are preserved in these states.
const SUSPENDED_STATUSES = new Set<MembershipStatus>(['suspended', 'expired'])

export interface MembershipAccess {
  stage: MemberStage
  statusLabel: string
  hasIicaId: boolean
  everPaid: boolean
  isGuest: boolean
  isRegistered: boolean
  isPending: boolean
  isActiveMember: boolean
  isSuspended: boolean
  /** May start creating a brand-new portfolio (active members only). */
  canCreatePortfolio: boolean
  /** May edit / publish an existing portfolio (active members only). */
  canEditPortfolio: boolean
  /** May view their own existing portfolio (active + suspended keep data). */
  canViewOwnPortfolio: boolean
  /** May create products, classes and events (active members only). */
  canCreateListings: boolean
  /** Umbrella flag for member-only creator + collaboration features. */
  canUseCreatorFeatures: boolean
}

const STAGE_LABEL: Record<MemberStage, string> = {
  guest: 'Guest',
  registered: 'Registered',
  pending: 'Purchase Pending',
  active: 'Active Creator Member',
  suspended: 'Membership Expired',
}

export function membershipAccess(state: AuthState): MembershipAccess {
  const hasIicaId = !!state.iicaId
  const everPaid = !!state.paymentDone

  const isGuest = !state.authed
  const isSuspended =
    !isGuest && everPaid && SUSPENDED_STATUSES.has(state.membershipStatus)
  const isActiveMember = !isGuest && !isSuspended && state.role === 'active'
  const isPending =
    !isGuest && !isActiveMember && !isSuspended && state.role === 'pending'
  // Signed-in but no application yet (role stays 'guest' until the form is in).
  const isRegistered =
    !isGuest && !isActiveMember && !isSuspended && !isPending

  const stage: MemberStage = isGuest
    ? 'guest'
    : isSuspended
      ? 'suspended'
      : isActiveMember
        ? 'active'
        : isPending
          ? 'pending'
          : 'registered'

  return {
    stage,
    statusLabel: STAGE_LABEL[stage],
    hasIicaId,
    everPaid,
    isGuest,
    isRegistered,
    isPending,
    isActiveMember,
    isSuspended,
    canCreatePortfolio: isActiveMember,
    canEditPortfolio: isActiveMember,
    canViewOwnPortfolio: isActiveMember || isSuspended,
    canCreateListings: isActiveMember,
    canUseCreatorFeatures: isActiveMember,
  }
}

// ---- Member networking / collaboration messaging access ----
// Applies ONLY to creator-to-creator (member networking / collaboration)
// messaging — never customer support, order contact or admin logs (none exist).
export interface MessagingAccess {
  canMessage: boolean
  title: string
  message: string
  cta: { label: string; target: string } | null
  readOnly: boolean // suspended/expired: keep existing history readable, no new
}

export function messagingAccess(state: AuthState): MessagingAccess {
  const a = membershipAccess(state)
  const mpOn = membershipPurchaseEnabled()

  if (a.isActiveMember)
    return { canMessage: true, title: '', message: '', cta: null, readOnly: false }

  if (a.isGuest)
    return {
      canMessage: false, readOnly: false,
      title: 'Sign in to connect',
      message: 'Create an account or sign in to message and collaborate with IICA creators.',
      cta: { label: 'Sign In', target: '/login' },
    }

  if (a.isSuspended)
    return {
      canMessage: false, readOnly: true,
      title: 'Membership inactive',
      message: 'You can’t start new conversations while your membership is inactive. Your existing messages are preserved.',
      cta: null,
    }

  if (a.isPending)
    return mpOn
      ? {
          canMessage: false, readOnly: false,
          title: 'Complete your membership',
          message: 'Messaging is available to active IICA Creator Members.',
          cta: { label: 'Complete Membership Purchase', target: '/membership/purchase' },
        }
      : {
          canMessage: false, readOnly: false,
          title: 'Membership paused',
          message: MEMBERSHIP_UNAVAILABLE_MSG,
          cta: null,
        }

  // Registered user (no IICA ID)
  return {
    canMessage: false, readOnly: false,
    title: 'For creator members',
    message: 'Messaging is available to active IICA Creator Members.',
    cta: mpOn ? { label: 'Apply for IICA Membership', target: '/membership' } : null,
  }
}

// Where a gated/upgrade prompt should route the user given their current stage.
export function membershipCtaTarget(state: AuthState): string {
  const a = membershipAccess(state)
  if (a.isActiveMember) return '/membership/status'
  if (a.hasIicaId) return '/membership/status' // pending or suspended
  if (a.isRegistered) return '/membership'
  return '/membership'
}
