import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { useCreateGate } from '../../state/CreateGate'

// Content creation is for active creators. Others → home + the role-appropriate
// create sheet (never a silent redirect).
export default function ContentCreatorGuard({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  const { startCreate } = useCreateGate()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.role !== 'active') {
      navigate('/home', { replace: true })
      startCreate()
    }
  }, [state.role, navigate, startCreate])

  if (state.role !== 'active') return null
  return <>{children}</>
}
