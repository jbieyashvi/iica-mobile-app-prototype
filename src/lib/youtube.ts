// ---- YouTube link helpers (prototype) ----
// IICA does not host or upload video files. Creators paste YouTube links in
// their Portfolio Watch section; Archive embeds them in privacy-enhanced mode.

// Video classification for Portfolio Watch → Archive (NOT membership/product
// categories). "Other" allows a free-text label used only for classification.
export const VIDEO_CATEGORIES = [
  'Performance',
  'Music Video',
  'Interview',
  'Conversation',
  'Behind the Scenes',
  'Tutorial',
  'Showcase',
  'Event Recording',
  'Other',
] as const

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number]

// Parse a YouTube video id from the common URL formats. Returns '' if none.
export function parseYouTubeId(url: string): string {
  if (!url) return ''
  const u = url.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = u.match(re)
    if (m) return m[1]
  }
  // bare 11-char id
  if (/^[A-Za-z0-9_-]{11}$/.test(u)) return u
  return ''
}

export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeId(url) !== ''
}

// Privacy-enhanced embed (youtube-nocookie), no autoplay, related off.
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

// hqdefault is broadly available for valid ids.
export function youTubeThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
