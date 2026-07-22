import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, CheckCircle2, Clock } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import Checkbox from '../../components/form/Checkbox'
import OtpInput from '../../components/form/OtpInput'
import PrimaryButton from '../../components/PrimaryButton'
import { usePublicArtist } from '../../data/usePublicArtist'
import { useAuth } from '../../state/AuthContext'
import { isEmail } from '../../lib/validation'

const RELATIONS = ['Attended an event', 'Worked together', 'Student', 'Purchased their work', 'Fan / Follower', 'Other']
const OTP = '123456'

export default function ArtistWriteReview() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { artist } = usePublicArtist(slug)
  const { state } = useAuth()

  const isGuest = !state.authed

  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [relation, setRelation] = useState('')
  const [name, setName] = useState(state.name || '')
  const [email, setEmail] = useState(state.email || '')
  const [honest, setHonest] = useState(false)
  const [touched, setTouched] = useState(false)

  const [otpSheet, setOtpSheet] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpErr] = useState('')
  const [done, setDone] = useState(false)

  if (!artist) return <BackHeader title="Write a Review" />

  const errors = {
    rating: rating === 0 ? 'Please select a rating' : '',
    text: text.trim().length < 20 ? 'Review must be at least 20 characters' : '',
    name: !name.trim() ? 'Please add a display name' : '',
    email: isGuest && !isEmail(email) ? 'Valid email required' : '',
    honest: !honest ? 'Please confirm your review is honest' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const submit = () => {
    setTouched(true)
    if (!valid) return
    if (isGuest) setOtpSheet(true)
    else setDone(true)
  }

  const verify = () => {
    if (otp === OTP) {
      setOtpSheet(false)
      setDone(true)
    } else {
      setOtpErr('Incorrect code. Try 123456.')
    }
  }

  if (done) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Review Submitted" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F0E4] text-warning">
            <Clock className="h-8 w-8" strokeWidth={1.6} />
          </div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Pending moderation</h1>
          <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
            Thank you. Your review will appear after it has been reviewed.
          </p>
          <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate(`/artist/${artist.slug}`)}>
              Return to Artist Profile
            </PrimaryButton>
            <button
              onClick={() => navigate(`/artist/${artist.slug}/reviews`)}
              className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
            >
              View My Review Status
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Write a Review" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <p className="mt-2 text-[13px] text-muted">Reviewing <span className="font-semibold text-ink">{artist.name}</span></p>

        {/* rating */}
        <div className="mt-5">
          <p className="mb-2 text-[13px] font-semibold text-ink">Your rating</p>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                aria-label={`${i + 1} star`}
                onClick={() => setRating(i + 1)}
                className="tap flex h-11 w-11 items-center justify-center"
              >
                <Star className={`h-8 w-8 ${i < rating ? 'fill-brand text-brand' : 'text-border'}`} />
              </button>
            ))}
          </div>
          {touched && errors.rating && <p className="mt-1 text-[12px] font-medium text-error">{errors.rating}</p>}
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <TextField label="Review title" optional value={title} onChange={setTitle} placeholder="Sum up your experience" />
          <TextArea
            label="Your review"
            value={text}
            onChange={setText}
            maxLength={1000}
            rows={5}
            placeholder="Share your honest experience (min 20 characters)"
            error={touched ? errors.text : ''}
          />
          <SelectField label="How do you know this artist?" value={relation} onChange={setRelation} options={RELATIONS} optional />
          <TextField label="Display name" value={name} onChange={setName} error={touched ? errors.name : ''} />
          {isGuest && (
            <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={touched ? errors.email : ''} hint="Used to verify your review. Not shown publicly." />
          )}
          <Checkbox checked={honest} onChange={setHonest} error={touched && !!errors.honest}>
            I confirm this review reflects my honest experience.
          </Checkbox>
          {touched && errors.honest && <p className="-mt-2 text-[12px] font-medium text-error">{errors.honest}</p>}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={submit}>Submit Review</PrimaryButton>
      </div>

      {/* Guest OTP verification */}
      {otpSheet && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setOtpSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif text-[22px] leading-tight text-ink">Verify your email</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Enter the 6-digit code we sent to {email || 'your email'} to publish your review. Your review is saved.
            </p>
            <div className="mt-5">
              <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpErr('') }} />
              {otpErr && <p className="mt-2 text-[12px] font-medium text-error">{otpErr}</p>}
            </div>
            <div className="mt-3 rounded-control border border-dashed border-brand/40 bg-brand-soft px-3 py-2 text-[12px] text-brand-dark">
              Prototype code: <span className="font-bold tracking-wide">123456</span>
            </div>
            <div className="mt-5">
              <PrimaryButton full disabled={otp.length < 6} onClick={verify}>Verify & Submit</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
