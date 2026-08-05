import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

// Minimal, prototype-only "Transactions" record for creator support/donations.
// The Mobile App has no shared Transactions data layer yet, so this is the
// smallest compatible record: a flat list persisted to localStorage. No Admin
// module, reporting or reconciliation is built here.
export type PaymentMethodType = 'UPI' | 'Card' | 'Net Banking'

// Prototype-safe donation record. Only masked, non-sensitive payment info is
// ever stored — never a full card number, CVV, UPI handle or bank credentials.
export interface SupportTransaction {
  id: string // reference / transaction id, e.g. "SUP-3F9K2A"
  type: 'support'
  creatorSlug: string
  creatorName: string
  donorUserId?: string
  optionId: string
  optionTitle: string
  amount: number
  currency: string
  supporterName: string
  supporterEmail: string
  paymentMethodType: PaymentMethodType
  maskedPaymentMethod: string // e.g. "Card · •••• 4242" — never the full value
  status: 'success'
  createdAt: string
}

const KEY = 'iica_support_v1'

function load(): SupportTransaction[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as SupportTransaction[]
  } catch {
    /* ignore */
  }
  return []
}

function makeRef(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SUP-${rand}`
}

interface Ctx {
  transactions: SupportTransaction[]
  /** Record a confirmed support payment; returns the stored record (with ref id). */
  addSupport: (r: Omit<SupportTransaction, 'id' | 'type' | 'status' | 'createdAt'>) => SupportTransaction
}

const SupportContext = createContext<Ctx | null>(null)

export function SupportProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<SupportTransaction[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(transactions))
    } catch {
      /* ignore */
    }
  }, [transactions])

  const addSupport = useCallback<Ctx['addSupport']>((r) => {
    const record: SupportTransaction = {
      ...r,
      id: makeRef(),
      type: 'support',
      status: 'success',
      createdAt: new Date().toISOString(),
    }
    setTransactions((list) => [record, ...list])
    return record
  }, [])

  const value = useMemo(() => ({ transactions, addSupport }), [transactions, addSupport])

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>
}

export function useSupport() {
  const ctx = useContext(SupportContext)
  if (!ctx) throw new Error('useSupport must be used within SupportProvider')
  return ctx
}
