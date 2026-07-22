import { useEffect, useState } from 'react'

// Brief loading simulation for skeleton states.
export function useLoad(ms = 600) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}
