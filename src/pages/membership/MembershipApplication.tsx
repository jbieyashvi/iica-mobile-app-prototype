import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import TextField from '../../components/form/TextField'
import SelectField from '../../components/form/SelectField'
import Checkbox from '../../components/form/Checkbox'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { Application, useAuth } from '../../state/AuthContext'
import { isEmail } from '../../lib/validation'
import { MEMBERSHIP_CATEGORIES } from '../../config/categories'
import { demoMembershipApplication } from '../../demo/demoData'

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']
const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+971', '+65']

const empty: Application = {
  fullName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  dob: '',
  gender: '',
  city: '',
  state: '',
  country: '',
  category: '',
  accurate: false,
}

export default function MembershipApplication() {
  const navigate = useNavigate()
  const { state, saveApplicationDraft, submitApplication } = useAuth()

  const [touched, setTouched] = useState(false)
  const [form, setForm] = useState<Application>(() => ({
    ...empty,
    ...demoMembershipApplication,
    ...state.application,
    fullName: state.application?.fullName || state.name || demoMembershipApplication.fullName,
    email: state.application?.email || state.email || demoMembershipApplication.email,
  }))

  const set = <K extends keyof Application>(k: K, v: Application[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Application, string>> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!isEmail(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.dob) e.dob = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    if (!form.category) e.category = 'Select a category'
    if (!form.accurate) e.accurate = 'Please confirm before continuing'
    return e
  }, [form])

  const valid = Object.keys(errors).length === 0

  const back = () => {
    saveApplicationDraft(form)
    navigate('/membership')
  }

  const saveAndExit = () => {
    saveApplicationDraft(form)
    navigate('/home')
  }

  const submit = () => {
    setTouched(true)
    if (!valid) return
    submitApplication(form)
    navigate('/membership/submitted')
  }

  return (
    <AuthShell
      onBack={back}
      footer={
        <div className="flex flex-col gap-2.5">
          <PrimaryButton full onClick={submit}>
            Submit &amp; Continue
          </PrimaryButton>
          <SecondaryButton full onClick={saveAndExit}>
            Save and Exit
          </SecondaryButton>
        </div>
      }
    >
      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
        Step 1 of 2
      </p>
      <h1 className="mt-2 font-serif text-[27px] leading-tight text-ink">
        Creator Membership
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Tell us a little about yourself to create your IICA identity.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <TextField
          label="Full Name"
          value={form.fullName}
          onChange={(v) => set('fullName', v)}
          error={touched ? errors.fullName : ''}
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
            <p className="mt-1 text-[12px] font-medium text-error">{errors.phone}</p>
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
            label="State / Region"
            value={form.state}
            onChange={(v) => set('state', v)}
            error={touched ? errors.state : ''}
          />
        </div>
        <TextField
          label="Country"
          value={form.country}
          onChange={(v) => set('country', v)}
          error={touched ? errors.country : ''}
        />

        <SelectField
          label="Category"
          value={form.category}
          onChange={(v) => set('category', v)}
          options={[...MEMBERSHIP_CATEGORIES]}
          placeholder="Select your category"
          error={touched ? errors.category : ''}
        />

        <div>
          <Checkbox
            checked={form.accurate}
            onChange={(v) => set('accurate', v)}
            error={touched && !!errors.accurate}
          >
            I agree to the IICA terms and confirm the information provided is
            accurate.
          </Checkbox>
          {touched && errors.accurate && (
            <p className="mt-1 text-[12px] font-medium text-error">
              {errors.accurate}
            </p>
          )}
        </div>
      </div>
    </AuthShell>
  )
}
