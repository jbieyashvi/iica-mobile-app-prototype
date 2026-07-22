import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, ImagePlus } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import SelectField from '../../components/form/SelectField'
import TextArea from '../../components/form/TextArea'
import PrimaryButton from '../../components/PrimaryButton'
import StatusBadge from '../../components/StatusBadge'
import { useShop } from '../../state/ShopContext'
import { inr } from '../../shop/pricing'

const TYPES = ['Refund', 'Return', 'Damaged Item', 'Wrong Item', 'Digital Access Issue', 'Masterclass Issue']
const REASONS = ['Item not as described', 'Damaged on arrival', 'Wrong item received', 'No longer needed', 'Access not working', 'Other']
const RESOLUTIONS = ['Full refund', 'Replacement', 'Store credit', 'Fix access']

export default function RefundRequest() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, requestRefund } = useShop()
  const o = orders.find((x) => x.id === orderId)
  const [productId, setProductId] = useState(o?.items[0]?.productId ?? '')
  const [type, setType] = useState('')
  const [reason, setReason] = useState('')
  const [desc, setDesc] = useState('')
  const [resolution, setResolution] = useState('')
  const [imgAdded, setImgAdded] = useState(false)
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)

  if (!o) return <BackHeader title="Refund" />
  const item = o.items.find((i) => i.productId === productId)
  const errors = { type: !type ? 'Required' : '', reason: !reason ? 'Required' : '', desc: desc.trim().length < 10 ? 'Add a few details' : '' }
  const valid = Object.values(errors).every((e) => !e)

  const submit = () => {
    setTouched(true)
    if (!valid) return
    requestRefund({ orderId: o.id, productId, requestType: type, reason, description: desc, resolution })
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Request Submitted" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F0E4] text-warning"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></div>
          <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Request submitted</h1>
          <div className="mt-3"><StatusBadge tone="warning">Under Review</StatusBadge></div>
          <p className="mt-3 max-w-[300px] text-[14px] leading-relaxed text-muted">The seller will review your {type.toLowerCase()} request. You'll be notified of the outcome.</p>
          <div className="mt-7 w-full max-w-[300px]"><PrimaryButton full onClick={() => navigate(`/orders/${o.id}`)}>Back to Order</PrimaryButton></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Request Refund / Return" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6 pt-3">
        <div className="flex flex-col gap-4">
          <SelectField label="Select product" value={productId} onChange={setProductId} options={o.items.map((i) => i.title)} />
          <SelectField label="Request type" value={type} onChange={setType} options={TYPES} error={touched ? errors.type : ''} />
          <SelectField label="Reason" value={reason} onChange={setReason} options={REASONS} error={touched ? errors.reason : ''} />
          <TextArea label="Description" value={desc} onChange={setDesc} maxLength={500} rows={4} placeholder="Tell us what happened" error={touched ? errors.desc : ''} />
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink">Photos <span className="font-normal text-muted">Optional</span></p>
            <button onClick={() => setImgAdded(true)} className={`tap flex h-24 w-full items-center justify-center gap-2 rounded-card border border-dashed ${imgAdded ? 'border-success bg-[#EAF3EE] text-success' : 'border-border bg-surface text-muted'}`}>{imgAdded ? <><CheckCircle2 className="h-5 w-5" /> Photo attached</> : <><ImagePlus className="h-5 w-5" /> Add photo (prototype)</>}</button>
          </div>
          <SelectField label="Preferred resolution" value={resolution} onChange={setResolution} options={RESOLUTIONS} optional />

          <div className="rounded-card border border-border bg-surface p-4 text-[13px]">
            <div className="flex justify-between"><span className="text-muted">Eligible</span><span className="font-semibold text-success">Yes</span></div>
            <div className="mt-1 flex justify-between"><span className="text-muted">Estimated refund</span><span className="font-bold text-ink">{item ? inr(item.price * item.qty) : '—'}</span></div>
            <p className="mt-1 text-[11.5px] text-muted">Refunds go to your original payment method after approval.</p>
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-bg/95 px-[22px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={submit}>Submit Request</PrimaryButton>
      </div>
    </div>
  )
}
