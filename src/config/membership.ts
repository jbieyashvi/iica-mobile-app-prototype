// ---- Creator membership plan + in-app purchase config (prototype) ----
//
// APP STORE PREPARATION NOTE (developer-facing — not production UI):
// - Production requires Apple In-App Purchase (StoreKit) and Google Play
//   Billing. Membership unlocks creator functionality, so the stores require
//   it be sold as an in-app purchase rather than an external payment link.
// - Apple Developer and Google Play developer accounts are required.
// - Real product IDs, server-side receipt validation and a real
//   restore-purchase implementation are still pending.
// - This prototype ONLY simulates these behaviours. It is NOT
//   production-compliant and performs no real charge.

export type PlatformKind = 'ios' | 'android' | 'web'

export interface DemoPrice {
  region: string
  price: string
}

export const MEMBERSHIP_PLAN = {
  name: 'Annual Creator Membership',
  // Final geographic pricing is pending — App Store / Play Store region
  // decides the real price at purchase time.
  regionNote: 'Price determined by your App Store region',
  // Clearly-labelled prototype demo values. NOT final approved prices.
  demoPrices: [
    { region: 'India', price: '₹3,499/year' },
    { region: 'United States', price: '$99/year' },
    { region: 'United Kingdom', price: '£99/year' },
  ] as DemoPrice[],
  features: [
    'Creator Portfolio',
    'Publish Content',
    'Sell Products and Masterclasses',
    'Create Events',
    'AI Collaboration Matching',
    'Creator Analytics',
  ],
}

// Best-effort platform sniff so the demo can show the right store button.
// Prototype-only heuristic; production would use the native runtime.
export function detectPlatform(): PlatformKind {
  if (typeof navigator === 'undefined') return 'web'
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'web'
}

export function purchaseCtaLabel(platform: PlatformKind): string {
  if (platform === 'ios') return 'Continue with Apple In-App Purchase'
  if (platform === 'android') return 'Continue with Google Play Purchase'
  return 'Simulate In-App Purchase'
}

export function platformDisplayName(platform: PlatformKind): 'Apple' | 'Google' | 'Demo' {
  if (platform === 'ios') return 'Apple'
  if (platform === 'android') return 'Google'
  return 'Demo'
}
