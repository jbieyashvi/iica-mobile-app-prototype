// Remember an in-app destination to return to after sign-in / account creation
// (e.g. a guest who tapped Donate is sent back to the same donation checkout).
// sessionStorage-scoped; consumed once.
const KEY = 'iica_auth_return_to'

export function setAuthReturn(path: string) {
  try { sessionStorage.setItem(KEY, path) } catch { /* ignore */ }
}

export function takeAuthReturn(): string | null {
  try {
    const v = sessionStorage.getItem(KEY)
    if (v) sessionStorage.removeItem(KEY)
    return v || null
  } catch { return null }
}
