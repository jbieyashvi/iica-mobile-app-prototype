import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import TextArea from '../../components/form/TextArea'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuth } from '../../state/AuthContext'
import { Address } from '../../shop/types'
import { demoCheckout } from '../../demo/demoData'

const ADDR_KEY = 'iica_checkout_address'

export function loadAddress(): Address | undefined {
  try { const r = localStorage.getItem(ADDR_KEY); if (r) return JSON.parse(r) } catch { /* */ }
  return undefined
}

export default function CheckoutAddress() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const saved = loadAddress()
  const [a, setA] = useState<Address>(saved ?? {
    name: state.name || demoCheckout.name, phone: demoCheckout.phone, line: demoCheckout.line,
    city: demoCheckout.city, state: demoCheckout.state, country: demoCheckout.country,
    postal: demoCheckout.postal, instructions: demoCheckout.instructions,
  })
  const [touched, setTouched] = useState(false)
  const set = <K extends keyof Address>(k: K, v: Address[K]) => setA((s) => ({ ...s, [k]: v }))

  const errors = {
    name: !a.name.trim() ? 'Required' : '',
    phone: !a.phone.trim() ? 'Required' : '',
    line: !a.line.trim() ? 'Required' : '',
    city: !a.city.trim() ? 'Required' : '',
    postal: !a.postal.trim() ? 'Required' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  const cont = () => {
    setTouched(true)
    if (!valid) return
    localStorage.setItem(ADDR_KEY, JSON.stringify(a))
    navigate('/checkout/payment')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Delivery details" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6 pt-3">
        <div className="flex flex-col gap-4">
          <TextField label="Full name" value={a.name} onChange={(v) => set('name', v)} error={touched ? errors.name : ''} />
          <TextField label="Phone" value={a.phone} onChange={(v) => set('phone', v)} error={touched ? errors.phone : ''} />
          <TextField label="Address" value={a.line} onChange={(v) => set('line', v)} error={touched ? errors.line : ''} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="City" value={a.city} onChange={(v) => set('city', v)} error={touched ? errors.city : ''} />
            <TextField label="State" value={a.state} onChange={(v) => set('state', v)} optional />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Country" value={a.country} onChange={(v) => set('country', v)} />
            <TextField label="Postal code" value={a.postal} onChange={(v) => set('postal', v)} error={touched ? errors.postal : ''} />
          </div>
          <TextArea label="Delivery instructions" value={a.instructions} onChange={(v) => set('instructions', v)} maxLength={200} rows={2} placeholder="Optional" />
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={cont}>Continue to Payment</PrimaryButton>
      </div>
    </div>
  )
}
