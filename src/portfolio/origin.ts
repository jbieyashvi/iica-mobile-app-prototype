// ---- Portfolio / Add-Video flow origin ----
// The Portfolio flow (Setup → Section editors → Preview) and the direct
// Add-Video entry are reached from different places (Home quick actions,
// Profile). Section navigations don't carry router state, so the entry origin
// is stored here (survives internal steps and refresh within the tab) and read
// by the top-level Back controls. Never defaults to Profile.

const KEY = 'iica_portfolio_origin_v1'

export function setPortfolioOrigin(from: string): void {
  try { sessionStorage.setItem(KEY, from) } catch { /* ignore */ }
}

// Valid origins: /home, /profile, or an existing /portfolio route. Anything
// else (missing/invalid) falls back to /home — never Profile.
export function getPortfolioOrigin(): string {
  let v: string | null = null
  try { v = sessionStorage.getItem(KEY) } catch { /* ignore */ }
  if (v === '/home' || v === '/profile' || (v && v.startsWith('/portfolio'))) return v
  return '/home'
}
