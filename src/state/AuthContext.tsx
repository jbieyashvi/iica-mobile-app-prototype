import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Role = 'guest' | 'pending' | 'active'

export interface Application {
  // Step 1 — basic
  fullName: string
  stageName: string
  email: string
  countryCode: string
  phone: string
  dob: string
  gender: string
  city: string
  country: string
  // Step 2 — creative profile
  domain: string
  customDomain: string
  subdomains: string
  skills: string
  experience: string
  languages: string
  intro: string
  // Step 3 — online presence
  instagram: string
  facebook: string
  youtube: string
  spotify: string
  website: string
  portfolioUrl: string
  // Step 4 — intent
  intents: string[]
  collabStatement: string
  accurate: boolean
}

export interface AuthState {
  onboarded: boolean
  authed: boolean
  emailVerified: boolean
  name: string
  email: string
  role: Role
  iicaId: string | null
  submittedAt: string | null
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
  iicaId: null,
  submittedAt: null,
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

// deterministic-ish 3 digit number derived from name so it stays stable
function threeDigits(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff
  return String(100 + (h % 900))
}

export function generateIicaId(name: string): string {
  return `${initials(name)}.${threeDigits(name + Date.now())}.IICA`
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
  completePayment: () => void
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
        const id = generateIicaId(data.fullName || state.name)
        patch({
          role: 'pending',
          authed: true,
          iicaId: id,
          submittedAt: new Date().toISOString(),
          paymentDone: false,
          name: data.fullName || state.name,
          email: data.email || state.email,
          application: data,
        })
        return id
      },
      completePayment: () => patch({ role: 'active', paymentDone: true }),
      previewPending: () => {
        const name = state.name || 'Reshma Patra'
        patch({
          onboarded: true,
          authed: true,
          emailVerified: true,
          role: 'pending',
          name,
          email: state.email || 'reshma.patra@example.com',
          iicaId: state.iicaId ?? generateIicaId(name),
          submittedAt: state.submittedAt ?? new Date().toISOString(),
          paymentDone: false,
        })
      },
      previewActive: () => {
        const name = state.name || 'Reshma Patra'
        patch({
          onboarded: true,
          authed: true,
          emailVerified: true,
          role: 'active',
          paymentDone: true,
          name,
          email: state.email || 'reshma.patra@example.com',
          iicaId: state.iicaId ?? generateIicaId(name),
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
