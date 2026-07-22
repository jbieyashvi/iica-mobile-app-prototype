import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import OtpInput from '../../components/form/OtpInput'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { maskEmail } from '../../lib/validation'

const CODE = '123456'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const { state, verifyEmail } = useAuth()

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(30)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const submit = () => {
    if (code === CODE) {
      verifyEmail()
      setVerified(true)
      setTimeout(() => navigate('/membership'), 1100)
    } else {
      setError('That code is incorrect. Try 123456.')
    }
  }

  if (verified) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-bg px-8 text-center">
        <div className="fade-in flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
          <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-serif text-[26px] text-ink">Email verified</h1>
        <p className="mt-1.5 text-[14px] text-muted">Taking you to membership…</p>
      </div>
    )
  }

  return (
    <AuthShell
      footer={
        <PrimaryButton full disabled={code.length < 6} onClick={submit}>
          Verify Email
        </PrimaryButton>
      }
    >
      <h1 className="mt-1 font-serif text-[28px] leading-tight text-ink">
        Verify your email
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
        We sent a 6-digit code to{' '}
        <span className="font-semibold text-ink">
          {maskEmail(state.email || 'you@example.com')}
        </span>
        .
      </p>

      <div className="mt-7">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v)
            setError('')
          }}
        />
        {error && (
          <p className="mt-2 text-[12px] font-medium text-error">{error}</p>
        )}
      </div>

      <div className="mt-4 rounded-control border border-dashed border-brand/40 bg-brand-soft px-3 py-2 text-[12px] text-brand-dark">
        Prototype code: <span className="font-bold tracking-wide">123456</span>
      </div>

      <div className="mt-6 flex items-center justify-between text-[13px]">
        {seconds > 0 ? (
          <span className="text-muted">Resend code in 0:{String(seconds).padStart(2, '0')}</span>
        ) : (
          <button
            onClick={() => {
              setSeconds(30)
              setError('')
            }}
            className="font-semibold text-brand hover:text-brand-dark"
          >
            Resend code
          </button>
        )}
        <button
          onClick={() => navigate('/signup')}
          className="font-semibold text-muted hover:text-ink"
        >
          Change email
        </button>
      </div>
    </AuthShell>
  )
}
