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

export default function Welcome() {
  const navigate = useNavigate()
  const { continueAsGuest } = useAuth()

  return (
    <div className="flex h-full flex-col bg-bg">
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-[22px]"
        style={{ paddingTop: 'calc(28px + var(--safe-top))' }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-brand font-serif text-[17px] leading-none text-white">
            II
          </span>
          <span className="font-serif text-[20px] tracking-tight text-ink">
            IICA
          </span>
        </div>

        {/* Collage */}
        <div className="mt-7 grid grid-cols-2 gap-2.5">
          {collage.map((src, i) => (
            <div
              key={src}
              className={`overflow-hidden rounded-card border border-border bg-brand-soft ${
                i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]'
              } ${i === 1 ? 'mt-6' : ''} ${i === 2 ? '-mt-6' : ''}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">
          International Indian Culture & Arts
        </p>
        <h1 className="mt-2 font-serif text-[34px] leading-[1.08] text-ink">
          Where creative journeys become visible.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Build your portfolio, share your work and find the right people to
          collaborate with.
        </p>
      </div>

      <div
        className="shrink-0 px-[22px] pt-4"
        style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
      >
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
            navigate('/')
          }}
          className="tap mt-3 w-full min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
