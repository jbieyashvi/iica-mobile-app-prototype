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

export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@')
  if (!domain) return email
  const shown = name.slice(0, Math.min(2, name.length))
  return `${shown}${'•'.repeat(Math.max(3, name.length - 2))}@${domain}`
}
