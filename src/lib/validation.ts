export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const isUrl = (v: string) => {
  if (!v.trim()) return true // optional fields validate only when present
  try {
    const u = new URL(v.trim().startsWith('http') ? v.trim() : `https://${v.trim()}`)
    return !!u.hostname && u.hostname.includes('.')
  } catch {
    return false
  }
}

// Facebook profile/page URL. Accepts facebook.com and fb.com (and their
// subdomains like m./web.), with or without protocol. Empty passes so the
// optional-when-absent rule matches the other social fields.
export const isFacebookUrl = (v: string) => {
  if (!v.trim()) return true
  if (!isUrl(v)) return false
  try {
    const u = new URL(v.trim().startsWith('http') ? v.trim() : `https://${v.trim()}`)
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const ok = host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.com' || host.endsWith('.fb.com')
    return ok && u.pathname.replace(/\/+$/, '').length > 0 // must point to a profile/page, not the bare domain
  } catch {
    return false
  }
}

export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@')
  if (!domain) return email
  const shown = name.slice(0, Math.min(2, name.length))
  return `${shown}${'•'.repeat(Math.max(3, name.length - 2))}@${domain}`
}
