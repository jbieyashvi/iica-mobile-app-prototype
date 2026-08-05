import { useEffect, useRef } from 'react'

// Preserve a horizontal carousel's scroll position across navigation (e.g.
// returning from a details screen). Stored per-key in sessionStorage so it
// survives remounts within the session but not a full app restart.
export function useRailScroll<T extends HTMLElement = HTMLDivElement>(key: string) {
  const ref = useRef<T>(null)
  const storageKey = `iica_rail_scroll:${key}`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Restore after paint so content width is known.
    const saved = Number(sessionStorage.getItem(storageKey) || '0')
    if (saved > 0) requestAnimationFrame(() => { el.scrollLeft = saved })

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        try { sessionStorage.setItem(storageKey, String(el.scrollLeft)) } catch { /* ignore */ }
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [storageKey])

  return ref
}
