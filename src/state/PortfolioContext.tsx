import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Portfolio } from '../portfolio/types'
import { demoPortfolio } from '../demo/demoBuilders'
import { useAuth } from './AuthContext'

const KEY = 'iica_portfolio_v1'

interface Ctx {
  portfolio: Portfolio
  /** merge a partial patch into the portfolio */
  patch: (p: Partial<Portfolio>) => void
  /** replace a single top-level section */
  setSection: <K extends keyof Portfolio>(k: K, v: Portfolio[K]) => void
  reset: () => void
}

const PortfolioContext = createContext<Ctx | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { state } = useAuth()

  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) return JSON.parse(raw) as Portfolio
    } catch {
      /* ignore */
    }
    return demoPortfolio()
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(portfolio))
    } catch {
      /* ignore */
    }
  }, [portfolio])

  const patch = useCallback(
    (p: Partial<Portfolio>) => setPortfolio((s) => ({ ...s, ...p })),
    [],
  )
  const setSection = useCallback(
    <K extends keyof Portfolio>(k: K, v: Portfolio[K]) =>
      setPortfolio((s) => ({ ...s, [k]: v })),
    [],
  )
  const reset = useCallback(() => setPortfolio(demoPortfolio()), [])
  void state

  const value = useMemo(
    () => ({ portfolio, patch, setSection, reset }),
    [portfolio, patch, setSection, reset],
  )

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
