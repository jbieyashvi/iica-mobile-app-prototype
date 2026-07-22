import { ReactNode, useEffect } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Wraps the whole app in a minimal mobile device frame on desktop/tablet,
 * and disappears (full-bleed app) on real mobile widths (< 600px).
 *
 * Desktop: the phone is a fixed 402×856 device (390×844 screen, ~19.5:9) that
 * is uniformly scaled — never re-proportioned — to fit the viewport height via
 * a CSS variable `--device-scale`. A sizer element reserves the scaled
 * footprint so the phone stays centred.
 *
 * The `.device-screen` element is the positioned, overflow-hidden container
 * that every sticky header, fixed bottom nav and absolute bottom-sheet in the
 * app anchors to — so those stay contained inside the phone.
 */
export default function DevicePreview({ children }: Props) {
  useEffect(() => {
    const apply = () => {
      // Uniform scale based on viewport height, capped at 1 (never enlarge).
      const scale = Math.min(1, (window.innerHeight - 32) / 856)
      document.documentElement.style.setProperty('--device-scale', String(scale))
    }
    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
    }
  }, [])

  return (
    <div className="device-outer">
      {/* Optional understated label outside the frame (desktop only) */}
      <span className="device-caption">IICA · Mobile Prototype</span>

      <div className="device-sizer">
        <div className="device-frame">
          <div className="device-screen">
            {/* Dynamic-island-style detail (decorative, desktop only) */}
            <span className="device-island" aria-hidden="true" />

            {children}

            {/* Home indicator (decorative, desktop only) */}
            <span className="device-home" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
