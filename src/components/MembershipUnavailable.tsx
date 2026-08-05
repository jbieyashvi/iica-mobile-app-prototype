import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import AuthShell from './AuthShell'
import PrimaryButton from './PrimaryButton'
import { MEMBERSHIP_UNAVAILABLE_MSG } from '../config/platform'

// Neutral full-screen state shown when the platform-level membership purchase
// toggle is OFF. No review/pending wording; existing memberships are untouched.
export default function MembershipUnavailable() {
  const navigate = useNavigate()
  return (
    <AuthShell showBack={false}>
      <div className="flex flex-col items-center pt-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Lock className="h-8 w-8" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-serif text-[24px] leading-tight text-ink">Membership paused</h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">{MEMBERSHIP_UNAVAILABLE_MSG}</p>
        <p className="mt-2 max-w-[300px] text-[12.5px] leading-relaxed text-muted">
          You can keep exploring, shopping and booking events as usual. Existing memberships are unaffected.
        </p>
      </div>
      <div className="mt-8">
        <PrimaryButton full onClick={() => navigate('/home')}>Go to Home</PrimaryButton>
      </div>
    </AuthShell>
  )
}
