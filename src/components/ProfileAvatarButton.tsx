import { useLocation, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { useAuth } from '../state/AuthContext'

// Demo profile image used only for signed-in members that don't have their own
// uploaded photo yet. Guests / accounts without an image fall back to initials.
const MEMBER_AVATAR_SRC =
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80&auto=format&fit=crop'

// Rightmost header action on all primary tabs. Opens Profile and remembers the
// originating route so Back returns to it. Single source — never hard-coded per
// screen, and never duplicated alongside another Profile action.
export default function ProfileAvatarButton() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { state } = useAuth()

  const isGuest = !state.authed
  const name = state.name || (isGuest ? 'Guest' : 'IICA Member')
  // Only signed-in accounts get the demo image; guests always show initials.
  const src = isGuest ? undefined : MEMBER_AVATAR_SRC

  return (
    <button
      onClick={() => navigate('/profile', { state: { from: pathname } })}
      aria-label="Open Profile"
      className="tap ml-1 flex h-11 w-11 items-center justify-center rounded-full"
    >
      <Avatar name={name} src={src} size={34} />
    </button>
  )
}
