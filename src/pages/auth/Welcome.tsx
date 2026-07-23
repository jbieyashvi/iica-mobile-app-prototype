import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'

const collage = [
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80&auto=format&fit=crop',
]

// Single-viewport entry screen: logo · collage · copy · actions. No scrolling.
// One vertical stack with explicit gaps (no auto spacer) so the actions stay
// visually connected to the copy; any slack is left below Continue as Guest.
export default function Welcome() {
  const navigate = useNavigate()
  const { continueAsGuest } = useAuth()

  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-bg px-5"
      style={{
        paddingTop: 'calc(18px + var(--safe-top))',
        paddingBottom: 'calc(14px + var(--safe-bottom))',
      }}
    >
      {/* Logo */}
      <div className="flex h-11 shrink-0 items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand font-serif text-[15px] leading-none text-white">
          II
        </span>
        <span className="font-serif text-[19px] tracking-tight text-ink">IICA</span>
      </div>

      {/* Collage — two columns, bounded height (h-full = .welcome-collage box),
          cover-fit. Asymmetry via inner padding so nothing overflows the box. */}
      <div className="welcome-collage mt-3 flex shrink-0 gap-2.5">
        <div className="flex h-full flex-1 flex-col gap-2.5">
          <Img src={collage[0]} className="flex-[3]" />
          <Img src={collage[2]} className="flex-[2]" />
        </div>
        <div className="flex h-full flex-1 flex-col gap-2.5 pt-6">
          <Img src={collage[1]} className="flex-[2]" />
          <Img src={collage[3]} className="flex-[3]" />
        </div>
      </div>

      {/* Copy */}
      <div className="mt-4 shrink-0">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-brand">
          International Indian Culture &amp; Arts
        </p>
        <h1 className="welcome-headline mt-2 font-serif text-[29px] leading-[1.08] text-ink">
          Where creative journeys become visible.
        </h1>
        <p className="mt-2 text-[14px] leading-snug text-muted">
          Build your portfolio, share your work and find the right people to collaborate with.
        </p>
      </div>

      {/* Actions — explicit gap keeps them attached to the copy above */}
      <div className="welcome-actions shrink-0">
        <PrimaryButton full onClick={() => navigate('/signup')}>
          Create an Account
        </PrimaryButton>
        <div className="mt-2.5">
          <SecondaryButton full onClick={() => navigate('/login')}>
            Sign In
          </SecondaryButton>
        </div>
        <button
          onClick={() => {
            continueAsGuest()
            navigate('/home')
          }}
          className="tap mt-3.5 min-h-[44px] w-full text-[14px] font-semibold text-muted hover:text-ink"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}

function Img({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div className={`min-h-0 overflow-hidden rounded-[11px] border border-border bg-brand-soft ${className}`}>
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
    </div>
  )
}
