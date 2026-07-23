import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { useGate } from '../../state/GateContext'

// Event creation is for active creators. Others → home + membership sheet.
export default function EventCreatorGuard({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const { requireMember } = useGate()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.role !== 'active') {
      navigate('/home', { replace: true })
      requireMember('Creating events', () => {})
    }
  }, [state.role, navigate, requireMember])

  if (state.role !== 'active') return null
  return <>{children}</>
}
