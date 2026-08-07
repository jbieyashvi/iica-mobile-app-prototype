import {
  ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react'

// Reusable horizontal carousel for the Home Recommended Listings row.
//
// Behaviour:
//  - Manual scroll always works: native overflow-x handles touch swipe,
//    trackpad and horizontal wheel. Vertical drags fall through to the page
//    (browser directional locking; we never set a touch-action that blocks it).
//  - Mouse drag-to-scroll is added only for pointerType === 'mouse' so touch
//    stays 100% native. A drag past a small threshold suppresses the click that
//    would otherwise open a card (no accidental navigation while dragging).
//  - Infinite loop (when `infinite` and there is enough content) renders three
//    identical copies and silently recenters on the middle copy as the user
//    crosses a segment boundary — seamless in both directions, no visible jump,
//    no empty end. Keys are prefixed per copy so React never sees a duplicate.
//  - Optional subtle autoplay: disabled for reduced-motion, paused during
//    interaction and while the tab is hidden.
//  - Scroll position is preserved across navigation via sessionStorage.
export interface InfiniteCarouselProps<T> {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  infinite?: boolean
  autoplay?: boolean
  storageKey?: string
  ariaLabel?: string
  className?: string
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

export default function InfiniteCarousel<T>({
  items, getKey, renderItem, infinite = true, autoplay = true,
  storageKey, ariaLabel, className = '',
}: InfiniteCarouselProps<T>) {
  const railRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // Loop is only safe when there is enough content to fill more than the
  // viewport; measured after layout. Starts false → plain rail on first paint.
  const [looping, setLooping] = useState(false)
  const segRef = useRef(0) // width of one copy of the item list (px)
  const recenteringRef = useRef(false)

  // Interaction / drag state (refs → no re-render churn during a gesture).
  const draggingRef = useRef(false) // mouse drag in progress
  const movedRef = useRef(false) // drag passed the click-suppression threshold
  const interactUntilRef = useRef(0) // autoplay stays paused until this timestamp
  const dragStartXRef = useRef(0)
  const dragStartScrollRef = useRef(0)
  const persistAtRef = useRef(0) // throttle sessionStorage writes

  const canLoop = infinite && items.length > 1
  const ssKey = storageKey ? `iica_rail_scroll:${storageKey}` : ''

  const markInteracted = useCallback(() => {
    interactUntilRef.current = performance.now() + 2500
  }, [])

  // Measure content and decide whether looping is viable. Re-run when the set
  // of items changes.
  useLayoutEffect(() => {
    const el = railRef.current
    if (!el) return
    if (!canLoop) { setLooping(false); segRef.current = 0; return }
    // Three copies are rendered; one segment = total / 3.
    const seg = el.scrollWidth / 3
    // Need a segment at least as wide as the viewport, else recentering can
    // flicker — fall back to a plain (non-looping) rail.
    if (seg >= el.clientWidth && seg > 0) {
      segRef.current = seg
      setLooping(true)
    } else {
      segRef.current = 0
      setLooping(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoop, items.length])

  // Position the scroller: restore a saved offset, or start on the middle copy
  // when looping. Runs after `looping` settles so measurements are valid.
  useLayoutEffect(() => {
    const el = railRef.current
    if (!el) return
    const saved = ssKey ? Number(sessionStorage.getItem(ssKey) || '0') : 0
    recenteringRef.current = true
    if (saved > 0 && saved < el.scrollWidth) {
      el.scrollLeft = saved
    } else if (looping) {
      el.scrollLeft = segRef.current // start of the middle copy
    }
    requestAnimationFrame(() => { recenteringRef.current = false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [looping])

  // Native scroll handler — the single source of recentering (whether the
  // scroll came from the user or from autoplay nudging scrollLeft). Serialised
  // by the event loop, so there is no self-triggered recenter loop.
  const onScroll = useCallback(() => {
    const el = railRef.current
    if (!el) return
    if (ssKey) {
      const now = performance.now()
      if (now >= persistAtRef.current) {
        persistAtRef.current = now + 250 // throttle writes
        try { sessionStorage.setItem(ssKey, String(el.scrollLeft)) } catch { /* ignore */ }
      }
    }
    if (!looping || recenteringRef.current) return
    const seg = segRef.current
    if (seg <= 0) return
    // Keep the viewport inside the middle band [0.5·seg, 1.5·seg). Crossing a
    // boundary jumps by exactly one segment onto identical content → seamless.
    if (el.scrollLeft < seg * 0.5) {
      recenteringRef.current = true
      el.scrollLeft += seg
      requestAnimationFrame(() => { recenteringRef.current = false })
    } else if (el.scrollLeft >= seg * 1.5) {
      recenteringRef.current = true
      el.scrollLeft -= seg
      requestAnimationFrame(() => { recenteringRef.current = false })
    }
  }, [looping, ssKey])

  // Subtle autoplay. Off for reduced-motion / non-looping. Paused during
  // interaction and while the tab is hidden. It only nudges scrollLeft; the
  // resulting native scroll event drives recentering via onScroll (no direct
  // call here, to avoid racing the guard).
  useEffect(() => {
    if (!looping || !autoplay || reducedMotion) return
    let raf = 0
    let last = performance.now()
    const SPEED = 14 // px per second — deliberately gentle
    const tick = (t: number) => {
      const el = railRef.current
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      if (el && !document.hidden && performance.now() >= interactUntilRef.current && !draggingRef.current) {
        el.scrollLeft += SPEED * dt
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [looping, autoplay, reducedMotion])

  // Mouse drag-to-scroll (desktop, no touch). Touch/trackpad use native scroll.
  const onPointerDown = (e: React.PointerEvent) => {
    markInteracted()
    if (e.pointerType !== 'mouse') return
    const el = railRef.current
    if (!el) return
    draggingRef.current = true
    movedRef.current = false
    dragStartXRef.current = e.clientX
    dragStartScrollRef.current = el.scrollLeft
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const el = railRef.current
    if (!el) return
    const dx = e.clientX - dragStartXRef.current
    if (Math.abs(dx) > 6) movedRef.current = true
    el.scrollLeft = dragStartScrollRef.current - dx
  }
  const endDrag = () => { draggingRef.current = false }
  // Suppress the click that ends a drag so a card doesn't navigate accidentally.
  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      movedRef.current = false
    }
  }

  // Render three copies when looping, one otherwise. Per-copy key prefix keeps
  // React keys unique across copies.
  const copies = looping ? [0, 1, 2] : [0]

  return (
    <div
      ref={railRef}
      role="list"
      aria-label={ariaLabel}
      onScroll={onScroll}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onWheel={markInteracted}
      onTouchStart={markInteracted}
      onClickCapture={onClickCapture}
      className={`no-scrollbar flex gap-3 overflow-x-auto overflow-y-hidden px-[18px] pb-1 ${className}`}
    >
      {copies.map((copy) =>
        items.map((item) => (
          <div key={`${copy}:${getKey(item)}`} role="listitem" className="shrink-0">
            {renderItem(item)}
          </div>
        )),
      )}
    </div>
  )
}
