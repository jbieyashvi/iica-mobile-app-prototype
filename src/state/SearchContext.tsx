import {
  createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'

// Persistent search preferences: recent queries + the remembered Near-Me city.
// Exact coordinates are never stored — only the resolved/fallback city name.
interface Persisted {
  recent: string[]
  city: string
}

const KEY = 'iica_search_v1'
const MAX_RECENT = 8

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { recent: [], city: '', ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { recent: [], city: '' }
}

interface Ctx {
  recent: string[]
  city: string
  addRecent: (q: string) => void
  removeRecent: (q: string) => void
  clearRecent: () => void
  setCity: (c: string) => void
}

const SearchContext = createContext<Ctx | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* ignore */ }
  }, [data])

  const addRecent = useCallback((q: string) => {
    const query = q.trim()
    if (!query) return
    setData((d) => ({
      ...d,
      recent: [query, ...d.recent.filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, MAX_RECENT),
    }))
  }, [])
  const removeRecent = useCallback((q: string) => {
    setData((d) => ({ ...d, recent: d.recent.filter((r) => r !== q) }))
  }, [])
  const clearRecent = useCallback(() => setData((d) => ({ ...d, recent: [] })), [])
  const setCity = useCallback((c: string) => setData((d) => ({ ...d, city: c })), [])

  const value = useMemo<Ctx>(
    () => ({ recent: data.recent, city: data.city, addRecent, removeRecent, clearRecent, setCity }),
    [data.recent, data.city, addRecent, removeRecent, clearRecent, setCity],
  )
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearchPrefs() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearchPrefs must be used within SearchProvider')
  return ctx
}
