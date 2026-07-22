import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SECTIONS } from '../../../portfolio/sections'

export function nextSlug(slug: string): string | null {
  const i = SECTIONS.findIndex((s) => s.slug === slug)
  if (i < 0 || i >= SECTIONS.length - 1) return null
  return SECTIONS[i + 1].slug
}

/** revision counter for autosave feedback + a helper to advance to the next section */
export function useEditorNav(slug: string) {
  const navigate = useNavigate()
  const [rev, setRev] = useState(0)
  const bump = useCallback(() => setRev((r) => r + 1), [])
  const goNext = useCallback(() => {
    const n = nextSlug(slug)
    navigate(n ? `/portfolio/edit/${n}` : '/portfolio/setup')
  }, [slug, navigate])
  return { rev, bump, goNext }
}
