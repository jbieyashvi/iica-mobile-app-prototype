// ---- Shared platform-level configuration (prototype) ----
// Single source of truth for platform toggles the Admin controls. The Mobile
// App reads this; it never edits it. localStorage stands in for a future
// published-config API (does NOT auto-sync across separate apps).

export interface PlatformConfig {
  // When false: hide/disable all NEW membership application + purchase actions.
  // Existing IICA IDs and active memberships are untouched; normal product/
  // event/guest purchases are unaffected.
  membershipPurchaseEnabled: boolean
}

export const PLATFORM_STORAGE_KEY = 'iica_platform_v1'

export const DEFAULT_PLATFORM: PlatformConfig = {
  membershipPurchaseEnabled: true,
}

export const MEMBERSHIP_UNAVAILABLE_MSG =
  'New membership purchases are currently unavailable.'

export function loadPlatform(): PlatformConfig {
  try {
    const raw = localStorage.getItem(PLATFORM_STORAGE_KEY)
    if (raw) return { ...DEFAULT_PLATFORM, ...(JSON.parse(raw) as Partial<PlatformConfig>) }
  } catch {
    /* ignore */
  }
  return DEFAULT_PLATFORM
}

// Convenience: are new membership application/purchase entry points allowed?
export function membershipPurchaseEnabled(): boolean {
  return loadPlatform().membershipPurchaseEnabled
}
