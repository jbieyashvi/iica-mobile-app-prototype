import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { Lock, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import PrimaryButton from '../components/PrimaryButton'

interface GateContextValue {
  /** Run action if active member, otherwise show the upgrade sheet. */
  requireMember: (feature: string, action: () => void) => void
}

const GateContext = createContext<GateContextValue | null>(null)

export function GateProvider({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const navigate = useNavigate()
  const [feature, setFeature] = useState<string | null>(null)

  const requireMember = useCallback(
    (f: string, action: () => void) => {
      if (state.role === 'active') action()
      else setFeature(f)
    },
    [state.role],
  )

  const close = () => setFeature(null)

  return (
    <GateContext.Provider value={{ requireMember }}>
      {children}

      {feature && (
        <div className="absolute inset-0 z-40 flex items-end" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
          />
          <div
            className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5"
            style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
          >
            <button
              aria-label="Close"
              onClick={close}
              className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Lock className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif text-[24px] leading-tight text-ink">
              {feature} is for members
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Creator tools like portfolios, content, events and collaboration
              are available to IICA members. Become a member to unlock them.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <PrimaryButton
                full
                onClick={() => {
                  close()
                  navigate('/membership')
                }}
              >
                Become a Member
              </PrimaryButton>
              <button
                onClick={close}
                className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </GateContext.Provider>
  )
}

export function useGate() {
  const ctx = useContext(GateContext)
  if (!ctx) throw new Error('useGate must be used within GateProvider')
  return ctx
}
