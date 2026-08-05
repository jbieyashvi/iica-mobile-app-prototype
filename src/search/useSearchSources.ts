import { useMemo } from 'react'
import { useEvents } from '../state/EventsContext'
import { useShop } from '../state/ShopContext'
import { useArchive } from '../data/useArchive'
import { CATALOGUE_POOL } from '../data/catalogueFilter'
import { buildResources, Sources } from './engine'

// Live search index built from the SAME shared records the rest of the app
// uses — creators (eligible public pool), events, products, archive videos and
// creator free resources. No duplicate data.
export function useSearchSources(): Sources {
  const events = useEvents().events
  const { products } = useShop()
  const archive = useArchive()
  const creators = CATALOGUE_POOL
  const resources = useMemo(() => buildResources(creators), [creators])
  return useMemo(
    () => ({ creators, events, products, archive, resources }),
    [creators, events, products, archive, resources],
  )
}
