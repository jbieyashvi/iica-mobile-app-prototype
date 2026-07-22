import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { useGate } from '../../state/GateContext'

// Active members only. Guests → home + membership sheet. Pending → status screen.
export default function PortfolioGuard({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const { requireMember } = useGate()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.role === 'guest') {
      navigate('/', { replace: true })
      requireMember('Portfolio', () => {})
    } else if (state.role === 'pending') {
      navigate('/membership/payment-pending', { replace: true })
    }
  }, [state.role, navigate, requireMember])

  if (state.role !== 'active') return null
  return <>{children}</>
}
