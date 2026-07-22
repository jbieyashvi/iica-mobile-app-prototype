import { useCallback, useEffect, useState } from 'react'

const KEY = 'iica_saved_artists'

function load(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {
    /* ignore */
  }
  return []
}

// Simple cross-component store for saved/bookmarked artist slugs.
let listeners: Array<(v: string[]) => void> = []
let current = load()

function broadcast(next: string[]) {
  current = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(next))
}

export function useSavedArtists() {
  const [saved, setSaved] = useState<string[]>(current)

  useEffect(() => {
    const l = (v: string[]) => setSaved(v)
    listeners.push(l)
    return () => {
      listeners = listeners.filter((x) => x !== l)
    }
  }, [])

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved])
  const toggle = useCallback((slug: string) => {
    broadcast(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug])
  }, [])

  return { saved, isSaved, toggle }
}
