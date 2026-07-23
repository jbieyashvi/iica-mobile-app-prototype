import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRound, Clock, BadgeCheck } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import TextField from '../../components/form/TextField'
import Checkbox from '../../components/form/Checkbox'
import SocialButtons from '../../components/form/SocialButtons'
import Divider from '../../components/form/Divider'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { isEmail } from '../../lib/validation'
import { demoUser, DEMO_PASSWORD } from '../../demo/demoData'

export default function Login() {
  const navigate = useNavigate()
  const { login, continueAsGuest, previewPending, previewActive } = useAuth()

  const [email, setEmail] = useState(demoUser.email)
  const [pw, setPw] = useState(DEMO_PASSWORD)
  const [remember, setRemember] = useState(true)
  const [touched, setTouched] = useState(false)

  const errors = {
    email: !isEmail(email) ? 'Enter a valid email address' : '',
    pw: pw.length < 6 ? 'Password must be at least 6 characters' : '',
  }
  const valid = !errors.email && !errors.pw

  const submit = () => {
    setTouched(true)
    if (!valid) return
    login(email.trim())
    navigate('/home')
  }

  return (
    <AuthShell
      footer={
        <>
          <PrimaryButton full disabled={!valid} onClick={submit}>
            Sign In
          </PrimaryButton>
          <p className="mt-3 text-center text-[13px] text-muted">
            New to IICA?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold text-brand hover:text-brand-dark"
            >
              Create Account
            </button>
          </p>
        </>
      }
    >
      <h1 className="mt-1 font-serif text-[28px] leading-tight text-ink">
        Welcome back
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">Sign in to continue.</p>

      <div className="mt-6 flex flex-col gap-4">
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          error={touched ? errors.email : ''}
        />
        <TextField
          label="Password"
          type="password"
          value={pw}
          onChange={setPw}
          placeholder="Your password"
          autoComplete="current-password"
          error={touched ? errors.pw : ''}
        />

        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember}>
            Remember me
          </Checkbox>
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-[13px] font-semibold text-brand hover:text-brand-dark"
          >
            Forgot password?
          </button>
        </div>

        <Divider label="or" />
        <SocialButtons
          onGoogle={() => {
            login('creator@example.com')
            navigate('/home')
          }}
          onApple={() => {
            login('creator@example.com')
            navigate('/home')
          }}
        />
      </div>

      {/* Prototype shortcuts */}
      <div className="mt-8 rounded-card border border-dashed border-border bg-surface p-3">
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-muted">
          Prototype shortcuts
        </p>
        <div className="flex flex-col gap-2">
          <ShortcutRow
            icon={<UserRound className="h-4 w-4" />}
            label="Continue as Guest"
            onClick={() => {
              continueAsGuest()
              navigate('/home')
            }}
          />
          <ShortcutRow
            icon={<Clock className="h-4 w-4" />}
            label="Preview Payment Pending Member"
            onClick={() => {
              previewPending()
              navigate('/membership/payment-pending')
            }}
          />
          <ShortcutRow
            icon={<BadgeCheck className="h-4 w-4" />}
            label="Preview Active Creator"
            onClick={() => {
              previewActive()
              navigate('/home')
            }}
          />
        </div>
      </div>
    </AuthShell>
  )
}

function ShortcutRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="tap flex min-h-[44px] items-center gap-2.5 rounded-control border border-border bg-bg px-3 text-left text-[13px] font-semibold text-ink hover:border-ink/25"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark">
        {icon}
      </span>
      {label}
    </button>
  )
}
