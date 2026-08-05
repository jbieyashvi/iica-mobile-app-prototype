// ---- Location / Near-Me foundation (prototype) ----
//
// Frontend-only helper for the "Near Me" location filter. There is no backend
// geocoding: we keep approximate coordinates for the prototype's known cities,
// resolve a device location to its nearest known city, and compute believable
// straight-line (haversine) distances. Distances are clearly labelled as
// prototype data in the UI. This is groundwork for the later Global Search.

export interface LatLng {
  lat: number
  lng: number
}

// Approximate city centroids for every catalogue + mock-data city.
export const CITY_COORDS: Record<string, LatLng> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Ujjain: { lat: 23.1765, lng: 75.7885 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Goa: { lat: 15.2993, lng: 74.124 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Indore: { lat: 22.7196, lng: 75.8577 },
}

const toRad = (d: number) => (d * Math.PI) / 180

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)))
}

// Nearest known city to a raw device position (used after geolocation grant).
export function nearestCity(pos: LatLng): string {
  let best = ''
  let bestKm = Infinity
  for (const [city, coord] of Object.entries(CITY_COORDS)) {
    const km = haversineKm(pos, coord)
    if (km < bestKm) { bestKm = km; best = city }
  }
  return best
}

// Deterministic mock distance for cities we have no coordinates for, so the
// prototype never shows a blank distance. Stable per city-pair.
function mockKm(a: string, b: string): number {
  const seed = (a + '→' + b)
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff
  return 40 + (h % 1200) // 40–1240 km
}

// Distance between two cities. Real haversine when both are known; otherwise a
// believable, stable mock value. Returns 0 when it's the same city.
export function cityDistanceKm(from: string, to: string): number {
  if (!from || !to) return Infinity
  if (from.toLowerCase() === to.toLowerCase()) return 0
  const a = CITY_COORDS[from]
  const b = CITY_COORDS[to]
  if (a && b) return haversineKm(a, b)
  return mockKm(from, to)
}

// Human label. Same city → "In <city>", otherwise "~<km> km away".
export function distanceLabel(from: string, to: string): string {
  const km = cityDistanceKm(from, to)
  if (!isFinite(km)) return ''
  if (km === 0) return `In ${to}`
  return `~${Math.round(km)} km away`
}

export type GeoResult =
  | { ok: true; city: string; pos: LatLng }
  | { ok: false; reason: 'denied' | 'unavailable' | 'unsupported' }

// Request the device location ONCE, on explicit user action. Never called on
// app load. Resolves to the nearest known city (prototype origin) or a typed
// failure so the caller can offer manual city selection.
export function requestNearMe(): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ ok: false, reason: 'unsupported' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude }
        resolve({ ok: true, city: nearestCity(pos), pos })
      },
      (err) => {
        resolve({ ok: false, reason: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable' })
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  })
}
