import { useMemo } from 'react'
import { usePortfolio } from '../state/PortfolioContext'
import { useAuth } from '../state/AuthContext'
import { buildArchive, ownerArchiveVideos, ArchiveVideo } from './archive'

// Combined Archive list: static demo creators + the signed-in creator's own
// Watch videos (live from their Portfolio). Single derived source, no copies.
export function useArchive(): ArchiveVideo[] {
  const { portfolio } = usePortfolio()
  const { state } = useAuth()
  return useMemo(() => {
    const owner = state.role === 'active' ? ownerArchiveVideos(portfolio, state.name) : []
    return buildArchive(owner)
  }, [portfolio, state.role, state.name])
}
