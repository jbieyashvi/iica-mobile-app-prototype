import type { RecommendedConfig } from './types'

// ---- Seeded PUBLISHED configuration (prototype) ----
// In production this comes from the Admin Panel via an API. Here it is seeded so
// the Mobile App has a compatible published config to render. A localStorage
// override (same shape) can stand in for a fetched config during the prototype.
//
// NOTE: The Admin Panel and Mobile App are separate applications. localStorage
// does NOT automatically synchronise between them — this seed is a stand-in for
// a future published-config API response.

export const RECOMMENDED_STORAGE_KEY = 'iica_recommended_v1'

// Deliberately includes >8 selected listings plus intentionally invalid ones
// (an out-of-stock physical product and a missing id) to prove live-availability
// filtering. Order below is the Admin display order.
export const DEFAULT_RECOMMENDED: RecommendedConfig = {
  id: 'reco-2026-w32',
  heading: 'Janmashtami Special',
  description: 'Handpicked classes, products, events and ways to support creators this festival week.',
  isVisible: true,
  // No schedule window by default → always in-window. Schedule cases are
  // exercised in tests via a localStorage override.
  selectedListings: [
    { listingId: 'art-of-songwriting', listingType: 'masterclass', displayOrder: 1 },
    { listingId: 'ragas-of-dusk', listingType: 'event', displayOrder: 2 },
    { listingId: 'abhishek-singh-chouhan::asp2', listingType: 'donation', displayOrder: 3 },
    { listingId: 'folk-art-journal', listingType: 'physical_product', displayOrder: 4 },
    { listingId: 'classical-practice-tracks', listingType: 'digital_product', displayOrder: 5 },
    { listingId: 'canvas-open-studio', listingType: 'event', displayOrder: 6 },
    { listingId: 'brush-texture-pack', listingType: 'digital_product', displayOrder: 7 },
    { listingId: 'echoes-of-ujjain', listingType: 'event', displayOrder: 8 },
    { listingId: 'sunday-indie-jam', listingType: 'event', displayOrder: 9 },
    { listingId: 'abhishek-singh-chouhan::asp3', listingType: 'donation', displayOrder: 10 },
    // Invalid on purpose — excluded by live validation:
    { listingId: 'tabla-practice-kit', listingType: 'physical_product', displayOrder: 11 }, // out of stock
    { listingId: 'does-not-exist', listingType: 'digital_product', displayOrder: 12 }, // missing source
  ],
  state: 'published',
  publishedAt: '2026-08-01T08:00:00.000Z',
}

// Read the published config: a localStorage override (future API cache) wins,
// otherwise the seeded default. Returns null on unreadable/malformed data.
export function loadRecommendedConfig(): RecommendedConfig | null {
  try {
    const raw = localStorage.getItem(RECOMMENDED_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as RecommendedConfig
  } catch {
    return null // data-loading failure → caller hides the section
  }
  return DEFAULT_RECOMMENDED
}
