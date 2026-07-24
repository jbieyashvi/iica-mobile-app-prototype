import { useNavigate } from 'react-router-dom'
import {
  FolderOpen,
  Store,
  PenLine,
  Sparkles,
  Fingerprint,
} from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'

const benefits = [
  {
    icon: FolderOpen,
    title: 'A professional creator portfolio',
    body: 'Showcase your journey, awards, media and collaborations in one place.',
  },
  {
    icon: Store,
    title: 'Sell events, masterclasses & products',
    body: 'Turn your craft into offerings your audience can book and buy.',
  },
  {
    icon: PenLine,
    title: 'Publish original content',
    body: 'Share music, art and writing with the IICA community.',
  },
  {
    icon: Sparkles,
    title: 'AI collaboration recommendations',
    body: 'Get matched with the right artists for your next project.',
  },
  {
    icon: Fingerprint,
    title: 'A unique IICA creator identity',
    body: 'Receive a verified member ID that travels with your work.',
  },
]

export default function MembershipIntro() {
  const navigate = useNavigate()
  const { continueAsGuest } = useAuth()

  return (
    <AuthShell
      footer={
        <>
          <PrimaryButton full onClick={() => navigate('/membership/application')}>
            Become an IICA Creator
          </PrimaryButton>
          <button
            onClick={() => {
              continueAsGuest()
              navigate('/home')
            }}
            className="tap mt-2.5 w-full min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
          >
            Explore as Guest
          </button>
        </>
      }
    >
      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
        Creator Membership
      </p>
      <h1 className="mt-2 font-serif text-[30px] leading-[1.1] text-ink">
        Everything you need to grow as a creator
      </h1>

      <div className="mt-7 flex flex-col divide-y divide-border">
        {benefits.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3.5 py-4 first:pt-0">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-control bg-surface px-3.5 py-3 text-[12.5px] leading-relaxed text-muted ring-1 ring-border">
        Fill a short form to get your IICA identity, then complete membership
        with an in-app purchase through the App Store or Play Store.
      </p>
    </AuthShell>
  )
}
