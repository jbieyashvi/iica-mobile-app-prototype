import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { useGate } from '../../state/GateContext'

// Portfolio editing is for active creator members only.
//  - Guest / registered (no membership) → home + membership sheet.
//  - Pending (IICA ID, unpaid) → membership status screen.
//  - Suspended / expired → status screen (data preserved, editing blocked).
export default function PortfolioGuard({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { requireMember } = useGate()
  const navigate = useNavigate()

  useEffect(() => {
    if (access.canEditPortfolio) return
    if (access.isGuest || access.isRegistered) {
      navigate('/home', { replace: true })
      requireMember('Portfolio', () => {})
    } else {
      // Pending or suspended: keep the IICA ID/data, route to status.
      navigate('/membership/status', { replace: true })
    }
  }, [access, navigate, requireMember])

  if (!access.canEditPortfolio) return null
  return <>{children}</>
}
