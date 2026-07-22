import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import TextField from '../../components/form/TextField'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { isEmail, maskEmail } from '../../lib/validation'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)

  const error = !isEmail(email) ? 'Enter a valid email address' : ''

  if (sent) {
    return (
      <AuthShell showBack={false}>
        <div className="flex flex-col items-center pt-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
            <MailCheck className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">
            Check your inbox
          </h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
            If an account exists for{' '}
            <span className="font-semibold text-ink">{maskEmail(email)}</span>,
            we've sent a link to reset your password.
          </p>
          <div className="mt-7 w-full">
            <PrimaryButton full onClick={() => navigate('/login')}>
              Back to Sign In
            </PrimaryButton>
          </div>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      footer={
        <PrimaryButton
          full
          disabled={!!error}
          onClick={() => {
            setTouched(true)
            if (error) return
            resetPassword(email.trim())
            setSent(true)
          }}
        >
          Send Reset Link
        </PrimaryButton>
      }
    >
      <h1 className="mt-1 font-serif text-[28px] leading-tight text-ink">
        Reset password
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
        Enter the email linked to your account and we'll send a reset link.
      </p>
      <div className="mt-6">
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          error={touched ? error : ''}
        />
      </div>
      <div className="mt-4">
        <SecondaryButton full onClick={() => navigate('/login')}>
          Back to Sign In
        </SecondaryButton>
      </div>
    </AuthShell>
  )
}
