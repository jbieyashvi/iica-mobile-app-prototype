import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import Stepper from '../../components/form/Stepper'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import SelectField from '../../components/form/SelectField'
import ChipSelect from '../../components/form/ChipSelect'
import Checkbox from '../../components/form/Checkbox'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { Application, useAuth } from '../../state/AuthContext'
import { isEmail, isUrl } from '../../lib/validation'

const STEPS = ['Basic', 'Creative', 'Presence', 'Intent']

const DOMAINS = [
  'Music',
  'Dance',
  'Theatre',
  'Visual Arts',
  'Photography',
  'Film & Media',
  'Literature',
  'Fashion',
  'Cultural Education',
  'Other',
]

const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say']

const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+971', '+65']

const INTENTS = [
  'Build my portfolio',
  'Find collaborators',
  'Sell my creative work',
  'Promote events',
  'Share content',
  'Learn from creators',
]

const empty: Application = {
  fullName: '',
  stageName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  dob: '',
  gender: '',
  city: '',
  country: '',
  domain: '',
  customDomain: '',
  subdomains: '',
  skills: '',
  experience: '',
  languages: '',
  intro: '',
  instagram: '',
  facebook: '',
  youtube: '',
  spotify: '',
  website: '',
  portfolioUrl: '',
  intents: [],
  collabStatement: '',
  accurate: false,
}

export default function MembershipApplication() {
  const navigate = useNavigate()
  const { state, saveApplicationDraft, submitApplication } = useAuth()

  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState(false)
  const [form, setForm] = useState<Application>(() => ({
    ...empty,
    ...state.application,
    fullName: state.application?.fullName || state.name || '',
    email: state.application?.email || state.email || '',
  }))

  const set = <K extends keyof Application>(k: K, v: Application[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Application, string>> = {}
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = 'Required'
      if (!isEmail(form.email)) e.email = 'Enter a valid email'
      if (!form.phone.trim()) e.phone = 'Required'
      if (!form.dob) e.dob = 'Required'
      if (!form.city.trim()) e.city = 'Required'
      if (!form.country.trim()) e.country = 'Required'
    }
    if (step === 1) {
      if (!form.domain) e.domain = 'Select a primary domain'
      if (form.domain === 'Other' && !form.customDomain.trim())
        e.customDomain = 'Describe your domain'
      if (!form.experience.trim()) e.experience = 'Required'
      if (!form.intro.trim()) e.intro = 'A short introduction is required'
    }
    if (step === 2) {
      const urls: Array<[keyof Application, string]> = [
        ['instagram', form.instagram],
        ['facebook', form.facebook],
        ['youtube', form.youtube],
        ['spotify', form.spotify],
        ['website', form.website],
        ['portfolioUrl', form.portfolioUrl],
      ]
      urls.forEach(([k, v]) => {
        if (v && !isUrl(v)) e[k] = 'Enter a valid URL'
      })
    }
    if (step === 3) {
      if (form.intents.length === 0) e.intents = 'Select at least one'
      if (!form.accurate) e.accurate = 'Please confirm before submitting'
    }
    return e
  }, [step, form])

  const stepValid = Object.keys(errors).length === 0

  const next = () => {
    setTouched(true)
    if (!stepValid) return
    saveApplicationDraft(form)
    setTouched(false)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const back = () => {
    saveApplicationDraft(form)
    if (step === 0) navigate('/membership')
    else {
      setTouched(false)
      setStep((s) => s - 1)
    }
  }

  const submit = () => {
    setTouched(true)
    if (!stepValid) return
    submitApplication(form)
    navigate('/membership/submitted')
  }

  const last = step === STEPS.length - 1

  const toggleIntent = (v: string) =>
    set(
      'intents',
      form.intents.includes(v)
        ? form.intents.filter((x) => x !== v)
        : [...form.intents, v],
    )

  return (
    <AuthShell
      onBack={back}
      footer={
        <div className="flex gap-2.5">
          <SecondaryButton onClick={back} className="min-w-[96px]">
            Back
          </SecondaryButton>
          {last ? (
            <PrimaryButton full onClick={submit}>
              Submit Membership Application
            </PrimaryButton>
          ) : (
            <PrimaryButton full onClick={next}>
              Continue
            </PrimaryButton>
          )}
        </div>
      }
    >
      <div className="mb-6 mt-1">
        <Stepper steps={STEPS} current={step} />
      </div>

      {step === 0 && (
        <Section title="Basic information">
          <TextField
            label="Full Name"
            value={form.fullName}
            onChange={(v) => set('fullName', v)}
            error={touched ? errors.fullName : ''}
          />
          <TextField
            label="Stage / Professional Name"
            optional
            value={form.stageName}
            onChange={(v) => set('stageName', v)}
          />
          <TextField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(v) => set('email', v)}
            error={touched ? errors.email : ''}
          />
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Country code"
                value={form.countryCode}
                onChange={(e) => set('countryCode', e.target.value)}
                className="min-h-[46px] w-[86px] rounded-control border border-border bg-surface px-2 text-[15px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex-1">
                <input
                  aria-label="Phone number"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="98765 43210"
                  aria-invalid={touched && !!errors.phone}
                  className={`min-h-[46px] w-full rounded-control border bg-surface px-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-brand/30 ${
                    touched && errors.phone
                      ? 'border-error'
                      : 'border-border focus:border-brand'
                  }`}
                />
              </div>
            </div>
            {touched && errors.phone && (
              <p className="mt-1 text-[12px] font-medium text-error">
                {errors.phone}
              </p>
            )}
          </div>
          <TextField
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={(v) => set('dob', v)}
            error={touched ? errors.dob : ''}
          />
          <SelectField
            label="Gender"
            optional
            value={form.gender}
            onChange={(v) => set('gender', v)}
            options={GENDERS}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="City"
              value={form.city}
              onChange={(v) => set('city', v)}
              error={touched ? errors.city : ''}
            />
            <TextField
              label="Country"
              value={form.country}
              onChange={(v) => set('country', v)}
              error={touched ? errors.country : ''}
            />
          </div>
        </Section>
      )}

      {step === 1 && (
        <Section title="Creative profile">
          <SelectField
            label="Primary Creative Domain"
            value={form.domain}
            onChange={(v) => set('domain', v)}
            options={DOMAINS}
            error={touched ? errors.domain : ''}
          />
          {form.domain === 'Other' && (
            <TextField
              label="Your Domain"
              value={form.customDomain}
              onChange={(v) => set('customDomain', v)}
              placeholder="e.g. Puppetry"
              error={touched ? errors.customDomain : ''}
            />
          )}
          <TextField
            label="Sub-domains"
            optional
            value={form.subdomains}
            onChange={(v) => set('subdomains', v)}
            placeholder="Comma separated, e.g. Hindustani, Fusion"
          />
          <TextField
            label="Skills"
            optional
            value={form.skills}
            onChange={(v) => set('skills', v)}
            placeholder="e.g. Sitar, Composition, Production"
          />
          <TextField
            label="Years of Experience"
            type="number"
            value={form.experience}
            onChange={(v) => set('experience', v)}
            placeholder="e.g. 8"
            error={touched ? errors.experience : ''}
          />
          <TextField
            label="Languages"
            optional
            value={form.languages}
            onChange={(v) => set('languages', v)}
            placeholder="e.g. Hindi, English, Tamil"
          />
          <TextArea
            label="Short Professional Introduction"
            value={form.intro}
            onChange={(v) => set('intro', v)}
            maxLength={300}
            placeholder="Tell us about your practice in a few sentences."
            error={touched ? errors.intro : ''}
          />
        </Section>
      )}

      {step === 2 && (
        <Section title="Online presence" subtitle="All optional — add what you have.">
          <TextField
            label="Instagram URL"
            optional
            value={form.instagram}
            onChange={(v) => set('instagram', v)}
            placeholder="instagram.com/…"
            error={touched ? errors.instagram : ''}
          />
          <TextField
            label="Facebook URL"
            optional
            value={form.facebook}
            onChange={(v) => set('facebook', v)}
            placeholder="facebook.com/…"
            error={touched ? errors.facebook : ''}
          />
          <TextField
            label="YouTube URL"
            optional
            value={form.youtube}
            onChange={(v) => set('youtube', v)}
            placeholder="youtube.com/…"
            error={touched ? errors.youtube : ''}
          />
          <TextField
            label="Spotify URL"
            optional
            value={form.spotify}
            onChange={(v) => set('spotify', v)}
            placeholder="open.spotify.com/…"
            error={touched ? errors.spotify : ''}
          />
          <TextField
            label="Website URL"
            optional
            value={form.website}
            onChange={(v) => set('website', v)}
            placeholder="yoursite.com"
            error={touched ? errors.website : ''}
          />
          <TextField
            label="Portfolio / Work Sample URL"
            optional
            value={form.portfolioUrl}
            onChange={(v) => set('portfolioUrl', v)}
            placeholder="Link to your best work"
            error={touched ? errors.portfolioUrl : ''}
          />
        </Section>
      )}

      {step === 3 && (
        <Section title="Membership intent">
          <ChipSelect
            label="What do you want to use IICA for?"
            options={INTENTS}
            selected={form.intents}
            onToggle={toggleIntent}
            error={touched ? errors.intents : ''}
          />
          <TextArea
            label="Collaboration Statement"
            value={form.collabStatement}
            onChange={(v) => set('collabStatement', v)}
            maxLength={500}
            rows={5}
            placeholder="What kind of collaborations are you looking for?"
          />
          <Checkbox
            checked={form.accurate}
            onChange={(v) => set('accurate', v)}
            error={touched && !!errors.accurate}
          >
            I confirm the information submitted is accurate and complete.
          </Checkbox>
          {touched && errors.accurate && (
            <p className="-mt-2 text-[12px] font-medium text-error">
              {errors.accurate}
            </p>
          )}
        </Section>
      )}
    </AuthShell>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h1 className="font-serif text-[24px] leading-tight text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </div>
  )
}
