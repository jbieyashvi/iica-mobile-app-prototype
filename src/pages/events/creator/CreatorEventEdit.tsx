import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEvents } from '../../../state/EventsContext'

// Loads an existing event into the builder draft, then redirects to step 1.
export default function CreatorEventEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, loadDraftFrom } = useEvents()
  const ev = getEvent(id)

  useEffect(() => {
    if (ev) {
      loadDraftFrom(ev)
      navigate('/events/create/details', { replace: true })
    }
  }, [ev, loadDraftFrom, navigate])

  if (!ev) return <Navigate to="/creator/events" replace />
  return null
}
