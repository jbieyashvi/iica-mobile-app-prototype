import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import PrimaryButton from '../../components/PrimaryButton'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../state/AuthContext'
import { isEmail } from '../../lib/validation'

const KEY = 'iica_account_extra_v1'
interface Extra { phone: string; city: string; country: string }
function loadExtra(): Extra {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return { phone: '', city: '', country: 'India' }
}

// Edit Profile handles personal / account information (separate from Edit Portfolio).
export default function EditProfile() {
  const navigate = useNavigate()
  const { state, updateAccount } = useAuth()
  const [name, setName] = useState(state.name || '')
  const [email, setEmail] = useState(state.email || '')
  const ex = loadExtra()
  const [phone, setPhone] = useState(ex.phone)
  const [city, setCity] = useState(ex.city)
  const [country, setCountry] = useState(ex.country)
  const [touched, setTouched] = useState(false)
  const [toast, setToast] = useState('')

  const err = { name: !name.trim() ? 'Required' : '', email: !isEmail(email) ? 'Valid email required' : '' }
  const valid = !err.name && !err.email

  const save = () => {
    setTouched(true)
    if (!valid) return
    updateAccount({ name: name.trim(), email: email.trim() })
    localStorage.setItem(KEY, JSON.stringify({ phone, city, country }))
    setToast('Profile updated')
    setTimeout(() => navigate('/profile'), 700)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Edit Profile" fallback="/profile" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6 pt-4">
        <div className="flex flex-col items-center">
          <Avatar name={name || 'You'} src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80&auto=format&fit=crop" size={72} />
          <button onClick={() => setToast('Photo picker (prototype)')} className="tap mt-2 text-[13px] font-semibold text-brand">Change photo</button>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          <TextField label="Full name" value={name} onChange={setName} error={touched ? err.name : ''} />
          <TextField label="Email address" type="email" value={email} onChange={setEmail} error={touched ? err.email : ''} />
          <TextField label="Phone" optional value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="City" optional value={city} onChange={setCity} placeholder="Bengaluru" />
            <TextField label="Country" value={country} onChange={setCountry} />
          </div>
          {state.iicaId && (
            <div className="flex items-center justify-between rounded-control border border-border bg-surface px-4 py-3 text-[13px]">
              <span className="text-muted">Member ID</span>
              <span className="font-mono font-semibold text-ink">{state.iicaId}</span>
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={save}>Save Changes</PrimaryButton>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
