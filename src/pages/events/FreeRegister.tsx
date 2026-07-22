import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useEvents } from '../../state/EventsContext'
import { useAuth } from '../../state/AuthContext'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import Checkbox from '../../components/form/Checkbox'
import OtpInput from '../../components/form/OtpInput'
import PrimaryButton from '../../components/PrimaryButton'
import StatusBadge from '../../components/StatusBadge'
import { isEmail } from '../../lib/validation'
import { fmtDate } from '../../events/format'

export default function FreeRegister() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent, registerFree } = useEvents()
  const { state } = useAuth()
  const ev = getEvent(id)

  const [name, setName] = useState(state.name || '')
  const [email, setEmail] = useState(state.email || '')
  const [phone, setPhone] = useState('')
  const [count, setCount] = useState(1)
  const [names, setNames] = useState<string[]>([''])
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(false)
  const [touched, setTouched] = useState(false)
  const [otpSheet, setOtpSheet] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpErr] = useState('')

  if (!ev) return <BackHeader title="Register" />

  const isGuest = !state.authed
  const maxPer = ev.maxPerPerson || 4

  const setCountSafe = (n: number) => {
    const c = Math.max(1, Math.min(maxPer, n))
    setCount(c)
    setNames((prev) => Array.from({ length: c - 1 }).map((_, i) => prev[i] ?? ''))
  }

  const errors = {
    name: !name.trim() ? 'Required' : '',
    email: !isEmail(email) ? 'Valid email required' : '',
    agree: !agree ? 'Please accept the event policies' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const finish = () => {
    const booking = registerFree(ev.id, {
      name: name.trim(), email: email.trim(), phone, attendees: count,
      attendeeNames: [name.trim(), ...names.map((n) => n.trim())], note,
    })
    navigate(`/events/${ev.id}/confirmation`, { state: { bookingId: booking.id } })
  }

  const submit = () => {
    setTouched(true)
    if (!valid) return
    if (isGuest) setOtpSheet(true)
    else finish()
  }

  const verify = () => {
    if (otp === '123456') { setOtpSheet(false); finish() }
    else setOtpErr('Incorrect code. Try 123456.')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Register" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <div className="mt-2 rounded-card border border-border bg-surface p-3">
          <p className="font-serif text-[16px] leading-tight text-ink">{ev.title}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">{fmtDate(ev.startDate)} · {ev.format === 'Online' ? 'Online' : ev.city}</p>
          <div className="mt-2"><StatusBadge tone="success">Free event</StatusBadge>{ev.approvalRequired && <span className="ml-2"><StatusBadge tone="warning">Approval required</StatusBadge></span>}</div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <TextField label="Full name" value={name} onChange={setName} error={touched ? errors.name : ''} />
          <TextField label="Email" type="email" value={email} onChange={setEmail} error={touched ? errors.email : ''} />
          <TextField label="Phone" optional value={phone} onChange={setPhone} placeholder="Optional" />

          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink">Number of attendees</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setCountSafe(count - 1)} className="tap flex h-11 w-11 items-center justify-center rounded-control border border-border bg-surface text-[20px] text-ink disabled:opacity-40" disabled={count <= 1}>−</button>
              <span className="w-8 text-center text-[16px] font-bold text-ink">{count}</span>
              <button onClick={() => setCountSafe(count + 1)} className="tap flex h-11 w-11 items-center justify-center rounded-control border border-border bg-surface text-[20px] text-ink disabled:opacity-40" disabled={count >= maxPer}>+</button>
              <span className="text-[12px] text-muted">Max {maxPer} per person</span>
            </div>
          </div>

          {count > 1 && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[13px] font-semibold text-ink">Additional attendee names</p>
              {names.map((n, i) => (
                <TextField key={i} label={`Attendee ${i + 2}`} value={n} onChange={(v) => setNames((p) => p.map((x, j) => j === i ? v : x))} />
              ))}
            </div>
          )}

          <TextArea label="Note to organiser" value={note} onChange={setNote} maxLength={300} rows={3} placeholder="Optional" />
          <Checkbox checked={agree} onChange={setAgree} error={touched && !!errors.agree}>I agree to the event policies.</Checkbox>
          {touched && errors.agree && <p className="-mt-2 text-[12px] font-medium text-error">{errors.agree}</p>}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={submit}>{ev.approvalRequired ? 'Request to Register' : 'Complete Registration'}</PrimaryButton>
      </div>

      {otpSheet && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setOtpSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><CheckCircle2 className="h-6 w-6" strokeWidth={1.75} /></div>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Verify your email</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Enter the code sent to {email || 'your email'} to complete registration. Your details are saved.</p>
            <div className="mt-5"><OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpErr('') }} /></div>
            {otpErr && <p className="mt-2 text-[12px] font-medium text-error">{otpErr}</p>}
            <div className="mt-3 rounded-control border border-dashed border-brand/40 bg-brand-soft px-3 py-2 text-[12px] text-brand-dark">Prototype code: <span className="font-bold tracking-wide">123456</span></div>
            <div className="mt-5"><PrimaryButton full disabled={otp.length < 6} onClick={verify}>Verify & Register</PrimaryButton></div>
          </div>
        </div>
      )}
    </div>
  )
}
