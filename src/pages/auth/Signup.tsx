import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import TextField from '../../components/form/TextField'
import Checkbox from '../../components/form/Checkbox'
import SocialButtons from '../../components/form/SocialButtons'
import Divider from '../../components/form/Divider'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { isEmail } from '../../lib/validation'
import { demoUser, DEMO_PASSWORD } from '../../demo/demoData'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [name, setName] = useState(demoUser.fullName)
  const [email, setEmail] = useState(demoUser.email)
  const [pw, setPw] = useState(DEMO_PASSWORD)
  const [confirm, setConfirm] = useState(DEMO_PASSWORD)
  const [agree, setAgree] = useState(true)
  const [touched, setTouched] = useState(false)

  const errors = {
    name: !name.trim() ? 'Please enter your full name' : '',
    email: !isEmail(email) ? 'Enter a valid email address' : '',
    pw: pw.length < 6 ? 'Password must be at least 6 characters' : '',
    confirm: confirm !== pw ? 'Passwords do not match' : '',
    agree: !agree ? 'Please accept the terms to continue' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const submit = () => {
    setTouched(true)
    if (!valid) return
    signup(name.trim(), email.trim())
    navigate('/verify-email')
  }

  return (
    <AuthShell
      footer={
        <>
          <PrimaryButton full disabled={!valid} onClick={submit}>
            Create Account
          </PrimaryButton>
          <p className="mt-3 text-center text-[13px] text-muted">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-brand hover:text-brand-dark"
            >
              Sign In
            </button>
          </p>
        </>
      }
    >
      <h1 className="mt-1 font-serif text-[28px] leading-tight text-ink">
        Create your account
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">
        Join the IICA community of creators.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <TextField
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Reshma Patra"
          autoComplete="name"
          error={touched ? errors.name : ''}
        />
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={touched ? errors.pw : ''}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter password"
          autoComplete="new-password"
          error={touched ? errors.confirm : ''}
        />

        <Checkbox
          checked={agree}
          onChange={setAgree}
          error={touched && !!errors.agree}
        >
          I agree to the{' '}
          <span className="font-semibold text-ink">Terms of Service</span> and{' '}
          <span className="font-semibold text-ink">Privacy Policy</span>.
        </Checkbox>
        {touched && errors.agree && (
          <p className="-mt-2 text-[12px] font-medium text-error">
            {errors.agree}
          </p>
        )}

        <div className="mt-1">
          <Divider label="or" />
        </div>
        <SocialButtons
          onGoogle={() => {
            signup(name.trim() || 'Reshma Patra', email.trim() || 'reshma@example.com')
            navigate('/verify-email')
          }}
          onApple={() => {
            signup(name.trim() || 'Reshma Patra', email.trim() || 'reshma@example.com')
            navigate('/verify-email')
          }}
        />
      </div>
    </AuthShell>
  )
}
