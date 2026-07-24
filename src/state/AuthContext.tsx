import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { demoUser } from '../demo/demoData'

export type Role = 'guest' | 'pending' | 'active'

// Finer membership lifecycle used by the status screen. `role` stays the
// coarse gate (guest = free account, pending = form done / not purchased,
// active = creator). membershipStatus disambiguates the pending/active states.
export type MembershipStatus =
  | 'not_submitted'
  | 'submitted'
  | 'purchase_pending'
  | 'active'
  | 'failed'
  | 'cancelled'
  | 'expired'
  | 'restored'

export type PurchasePlatform = 'Apple' | 'Google' | 'Demo'

// One-page creator membership form. No stage name, socials, skills,
// experience, collaboration statement or portfolio fields — those are
// collected after payment during creator onboarding.
export interface Application {
  fullName: string
  email: string
  countryCode: string
  phone: string
  dob: string
  gender: string
  city: string
  state: string
  country: string
  category: string
  accurate: boolean
}

export interface AuthState {
  onboarded: boolean
  authed: boolean
  emailVerified: boolean
  name: string
  email: string
  role: Role
  membershipStatus: MembershipStatus
  category: string | null
  iicaId: string | null
  submittedAt: string | null
  purchasePlatform: PurchasePlatform | null
  purchaseRef: string | null
  paymentDone: boolean
  application: Partial<Application> | null
}

const STORAGE_KEY = 'iica_auth_v1'

const initialState: AuthState = {
  onboarded: false,
  authed: false,
  emailVerified: false,
  name: '',
  email: '',
  role: 'guest',
  membershipStatus: 'not_submitted',
  category: null,
  iicaId: null,
  submittedAt: null,
  purchasePlatform: null,
  purchaseRef: null,
  paymentDone: false,
  application: null,
}

function load(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return initialState
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'II'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Deterministic 3-digit number derived from the name only, so the ID stays
// stable across refreshes and re-submissions (never regenerated randomly).
function threeDigits(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff
  return String(100 + (h % 900))
}

// Known demo mapping so the documented example is exact:
// "JB Yashvi" → JY.673.IICA. All other names hash deterministically.
const KNOWN_IDS: Record<string, string> = {
  'JB YASHVI': 'JY.673.IICA',
}

export function generateIicaId(name: string): string {
  const key = name.trim().toUpperCase()
  if (KNOWN_IDS[key]) return KNOWN_IDS[key]
  return `${initials(name)}.${threeDigits(name)}.IICA`
}

// Stable, deterministic purchase reference derived from the ID.
function purchaseRefFor(iicaId: string | null): string {
  const base = (iicaId ?? 'IICA').replace(/[^A-Z0-9]/gi, '')
  return `IAP-${base}`
}

interface AuthContextValue {
  state: AuthState
  continueAsGuest: () => void
  signup: (name: string, email: string) => void
  verifyEmail: () => void
  changeEmail: (email: string) => void
  login: (email: string) => void
  resetPassword: (email: string) => void
  saveApplicationDraft: (data: Partial<Application>) => void
  submitApplication: (data: Application) => string
  enterPurchase: () => void
  purchaseSuccess: (platform: PurchasePlatform) => void
  purchaseFailed: () => void
  purchaseCancelled: () => void
  restorePurchase: (platform: PurchasePlatform) => void
  previewRegistered: () => void
  previewPending: () => void
  previewActive: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const patch = useCallback(
    (p: Partial<AuthState>) => setState((s) => ({ ...s, ...p })),
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      continueAsGuest: () =>
        patch({ onboarded: true, role: 'guest', authed: false }),
      signup: (name, email) =>
        patch({
          onboarded: true,
          name,
          email,
          authed: false,
          emailVerified: false,
          role: 'guest',
          application: { fullName: name, email },
        }),
      verifyEmail: () => patch({ emailVerified: true, authed: true }),
      changeEmail: (email) => patch({ email, emailVerified: false }),
      login: (email) =>
        patch({ onboarded: true, authed: true, emailVerified: true, email }),
      resetPassword: () => {
        /* prototype: no-op */
      },
      saveApplicationDraft: (data) =>
        setState((s) => ({
          ...s,
          application: { ...(s.application ?? {}), ...data },
        })),
      submitApplication: (data) => {
        // Reuse an existing ID for the same person; otherwise derive a stable
        // one. Never regenerated randomly, so it survives refreshes.
        const id =
          state.iicaId && (state.name === (data.fullName || state.name))
            ? state.iicaId
            : generateIicaId(data.fullName || state.name)
        patch({
          role: 'pending',
          membershipStatus: 'submitted',
          authed: true,
          iicaId: id,
          category: data.category || null,
          submittedAt: new Date().toISOString(),
          paymentDone: false,
          purchasePlatform: null,
          purchaseRef: null,
          name: data.fullName || state.name,
          email: data.email || state.email,
          application: data,
        })
        return id
      },
      enterPurchase: () =>
        patch({
          role: 'pending',
          membershipStatus: 'purchase_pending',
        }),
      purchaseSuccess: (platform) =>
        patch({
          role: 'active',
          membershipStatus: 'active',
          paymentDone: true,
          purchasePlatform: platform,
          purchaseRef: purchaseRefFor(state.iicaId),
        }),
      purchaseFailed: () =>
        // Preserve application + IICA ID; membership stays pending.
        patch({ role: 'pending', membershipStatus: 'failed' }),
      purchaseCancelled: () =>
        // Cancelled leaves membership in a payment-pending state.
        patch({ role: 'pending', membershipStatus: 'cancelled' }),
      restorePurchase: (platform) =>
        // Restore an existing membership without minting a second ID.
        patch({
          role: 'active',
          membershipStatus: 'restored',
          paymentDone: true,
          purchasePlatform: platform,
          purchaseRef: purchaseRefFor(state.iicaId),
        }),
      previewRegistered: () => {
        patch({
          onboarded: true, authed: true, emailVerified: true, role: 'guest',
          membershipStatus: 'not_submitted',
          name: state.name || demoUser.fullName, email: state.email || demoUser.email,
        })
      },
      previewPending: () => {
        const name = state.name || demoUser.fullName
        patch({
          onboarded: true,
          authed: true,
          emailVerified: true,
          role: 'pending',
          membershipStatus: 'submitted',
          category: state.category ?? demoUser.category,
          name,
          email: state.email || demoUser.email,
          iicaId: state.iicaId ?? demoUser.memberId,
          submittedAt: state.submittedAt ?? new Date().toISOString(),
          paymentDone: false,
          purchasePlatform: null,
          purchaseRef: null,
        })
      },
      previewActive: () => {
        const name = state.name || demoUser.fullName
        const id = state.iicaId ?? demoUser.memberId
        patch({
          onboarded: true,
          authed: true,
          emailVerified: true,
          role: 'active',
          membershipStatus: 'active',
          category: state.category ?? demoUser.category,
          paymentDone: true,
          purchasePlatform: 'Demo',
          purchaseRef: `IAP-${id.replace(/[^A-Z0-9]/gi, '')}`,
          name,
          email: state.email || demoUser.email,
          iicaId: id,
        })
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY)
        setState({ ...initialState })
      },
    }),
    [state, patch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
