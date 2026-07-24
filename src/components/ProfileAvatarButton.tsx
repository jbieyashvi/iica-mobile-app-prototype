import { useLocation, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'

// Demo profile image reused across every main tab so Profile placement stays
// consistent. Single source — never hard-coded per screen.
const AVATAR_SRC = 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80&auto=format&fit=crop'

// Rightmost header action on all primary tabs. Opens Profile and remembers the
// originating route so Back returns to it.
export default function ProfileAvatarButton() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <button
      onClick={() => navigate('/profile', { state: { from: pathname } })}
      aria-label="Open Profile"
      className="tap ml-1 flex h-11 w-11 items-center justify-center rounded-full"
    >
      <Avatar name="Reshma Nair" src={AVATAR_SRC} size={34} />
    </button>
  )
}
