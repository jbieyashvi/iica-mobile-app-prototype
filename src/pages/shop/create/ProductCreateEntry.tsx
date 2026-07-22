import { useNavigate } from 'react-router-dom'
import { ChevronLeft, GraduationCap, Package, Download, CalendarDays, ChevronRight } from 'lucide-react'
import { useShop } from '../../../state/ShopContext'
import { ProductType } from '../../../shop/types'

const OPTIONS: { type: ProductType | 'Event'; label: string; desc: string; icon: typeof Package }[] = [
  { type: 'Masterclass', label: 'Masterclass', desc: 'Teach a course with lessons', icon: GraduationCap },
  { type: 'Physical', label: 'Physical Product', desc: 'Ship handmade goods & merch', icon: Package },
  { type: 'Digital', label: 'Digital Product', desc: 'Sell files, presets & assets', icon: Download },
  { type: 'Event', label: 'Event', desc: 'Ticketed performances & workshops', icon: CalendarDays },
]

export default function ProductCreateEntry() {
  const navigate = useNavigate()
  const { resetDraft, saveDraft } = useShop()

  const pick = (type: ProductType | 'Event') => {
    if (type === 'Event') { navigate('/events/create'); return }
    resetDraft()
    saveDraft({ type })
    navigate('/creator/products/create/details')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center px-2" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={() => navigate('/creator/products')} aria-label="Back" className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
      </header>
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-6">
        <h1 className="mt-2 font-serif text-[28px] leading-tight text-ink">What would you like to sell?</h1>
        <p className="mt-1.5 text-[13.5px] text-muted">Choose a product type to get started.</p>
        <div className="mt-6 flex flex-col gap-2.5">
          {OPTIONS.map(({ type, label, desc, icon: Icon }) => (
            <button key={type} onClick={() => pick(type)} className="tap flex items-center gap-3 rounded-card border border-border bg-surface p-4 text-left hover:border-ink/20">
              <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-soft text-brand-dark"><Icon className="h-5 w-5" strokeWidth={1.75} /></span>
              <div className="flex-1"><p className="font-serif text-[17px] text-ink">{label}</p><p className="text-[12.5px] text-muted">{desc}</p></div>
              <ChevronRight className="h-5 w-5 text-muted" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted">Events use the existing Event Builder and ticketing flow.</p>
      </div>
    </div>
  )
}
