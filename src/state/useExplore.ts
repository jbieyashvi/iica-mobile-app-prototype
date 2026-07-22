import { useCallback, useEffect, useState } from 'react'

function makeStore<T>(key: string, fallback: T) {
  let current: T = (() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
    } catch {
      /* ignore */
    }
    return fallback
  })()
  let listeners: Array<(v: T) => void> = []
  const set = (next: T) => {
    current = next
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
    listeners.forEach((l) => l(next))
  }
  return {
    use(): [T, (v: T) => void] {
      const [v, setV] = useState<T>(current)
      useEffect(() => {
        const l = (nv: T) => setV(nv)
        listeners.push(l)
        return () => { listeners = listeners.filter((x) => x !== l) }
      }, [])
      return [v, set]
    },
    get: () => current,
    set,
  }
}

const likesStore = makeStore<string[]>('iica_content_likes', [])
const recentStore = makeStore<string[]>('iica_recent_searches', [])

export interface Interests {
  topics: string[]
  cities: string
  onlineOnly: boolean
  freeOnly: boolean
  collab: string[]
}
const interestsStore = makeStore<Interests>('iica_interests', {
  topics: [], cities: '', onlineOnly: false, freeOnly: false, collab: [],
})

export function useLikes() {
  const [likes, set] = likesStore.use()
  const isLiked = useCallback((id: string) => likes.includes(id), [likes])
  const toggle = useCallback((id: string) => {
    const cur = likesStore.get()
    likesStore.set(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }, [])
  void set
  return { likes, isLiked, toggle }
}

export function useRecentSearches() {
  const [recent, set] = recentStore.use()
  const add = useCallback((q: string) => {
    const t = q.trim()
    if (!t) return
    const cur = recentStore.get().filter((x) => x.toLowerCase() !== t.toLowerCase())
    recentStore.set([t, ...cur].slice(0, 8))
  }, [])
  const clear = useCallback(() => recentStore.set([]), [])
  void set
  return { recent, add, clear }
}

export function useInterests() {
  const [interests, set] = interestsStore.use()
  const save = useCallback((next: Interests) => set(next), [set])
  return { interests, save }
}
