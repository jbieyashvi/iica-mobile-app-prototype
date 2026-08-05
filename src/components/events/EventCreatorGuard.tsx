import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { useGate } from '../../state/GateContext'

// Creating events, products and classes is for active creator members only.
// Everyone else (guest, registered, pending, suspended) → home + upgrade sheet.
export default function EventCreatorGuard({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const access = membershipAccess(state)
  const { requireMember } = useGate()
  const navigate = useNavigate()

  useEffect(() => {
    if (!access.canCreateListings) {
      navigate('/home', { replace: true })
      requireMember('Creating events', () => {})
    }
  }, [access.canCreateListings, navigate, requireMember])

  if (!access.canCreateListings) return null
  return <>{children}</>
}
