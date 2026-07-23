import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FlaskConical, UserRound, Clock, BadgeCheck, UserCheck, FolderCheck, CalendarDays,
  GraduationCap, Download, Package, RotateCcw, ChevronRight, X, Sparkles,
} from 'lucide-react'
import { useAuth } from '../state/AuthContext'
import { usePortfolio } from '../state/PortfolioContext'
import { useEvents } from '../state/EventsContext'
import { useShop } from '../state/ShopContext'
import { useCollab } from '../state/CollabContext'
import {
  demoPaidEventDraft, demoFreeWorkshopDraft, demoMasterclassDraft, demoDigitalDraft, demoPhysicalDraft,
} from '../demo/demoBuilders'

const TOAST_KEY = 'iica_demo_toast'

export default function PrototypeTools() {
  const navigate = useNavigate()
  const { continueAsGuest, previewRegistered, previewPending, previewActive } = useAuth()
  const portfolio = usePortfolio()
  const events = useEvents()
  const shop = useShop()
  const collab = useCollab()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [toast, setToast] = useState('')

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  useEffect(() => {
    const t = localStorage.getItem(TOAST_KEY)
    if (t) { localStorage.removeItem(TOAST_KEY); flash(t) }
  }, [])

  const loadEvent = (paid: boolean) => {
    events.resetDraft(); events.saveDraft(paid ? demoPaidEventDraft() : demoFreeWorkshopDraft())
    navigate('/events/create/details')
  }
  const loadProduct = (which: 'master' | 'digital' | 'physical') => {
    shop.resetDraft()
    shop.saveDraft(which === 'master' ? demoMasterclassDraft() : which === 'digital' ? demoDigitalDraft() : demoPhysicalDraft())
    navigate('/creator/products/create/details')
  }

  const loadCollabDemo = () => {
    previewActive()
    collab.applyDemoPrefs()
    collab.resetCooldown()
    navigate('/collaborate')
    flash('Collaboration demo is ready')
  }

  const resetDemo = () => {
    Object.keys(localStorage).filter((k) => k.startsWith('iica_')).forEach((k) => localStorage.removeItem(k))
    localStorage.setItem(TOAST_KEY, 'Demo data restored')
    window.location.reload()
  }

  return (
    <div className="mt-6">
      <button onClick={() => setOpen((v) => !v)} className="tap flex w-full items-center gap-2.5 rounded-card border border-dashed border-border bg-surface px-4 py-3 text-left">
        <FlaskConical className="h-5 w-5 shrink-0 text-muted" />
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold text-ink">Prototype Tools</p>
          <p className="text-[11.5px] text-muted">Not part of the production app</p>
        </div>
        <ChevronRight className={`h-5 w-5 text-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-3 rounded-card border border-border bg-surface p-3">
          <Group title="Continue as">
            <Chip icon={<UserRound className="h-4 w-4" />} label="Guest" onClick={() => { continueAsGuest(); navigate('/home'); flash('Now browsing as Guest') }} />
            <Chip icon={<UserCheck className="h-4 w-4" />} label="Registered User" onClick={() => { previewRegistered(); navigate('/home'); flash('Registered user') }} />
            <Chip icon={<Clock className="h-4 w-4" />} label="Payment-Pending" onClick={() => { previewPending(); navigate('/membership/payment-pending') }} />
            <Chip icon={<BadgeCheck className="h-4 w-4" />} label="Active Creator" onClick={() => { previewActive(); navigate('/home'); flash('Active creator') }} />
          </Group>

          <Group title="Load demo">
            <Chip icon={<FolderCheck className="h-4 w-4" />} label="Completed Portfolio" onClick={() => { portfolio.reset(); navigate('/portfolio/setup') }} />
            <Chip icon={<CalendarDays className="h-4 w-4" />} label="Paid Event Demo" onClick={() => loadEvent(true)} />
            <Chip icon={<CalendarDays className="h-4 w-4" />} label="Free Workshop Demo" onClick={() => loadEvent(false)} />
            <Chip icon={<GraduationCap className="h-4 w-4" />} label="Masterclass Demo" onClick={() => loadProduct('master')} />
            <Chip icon={<Download className="h-4 w-4" />} label="Digital Product Demo" onClick={() => loadProduct('digital')} />
            <Chip icon={<Package className="h-4 w-4" />} label="Physical Product Demo" onClick={() => loadProduct('physical')} />
            <Chip icon={<Sparkles className="h-4 w-4" />} label="Load Ready Collaboration Demo" onClick={loadCollabDemo} />
          </Group>

          <button onClick={() => setConfirm(true)} className="tap flex min-h-[44px] items-center justify-center gap-2 rounded-control border border-error/30 bg-bg text-[13px] font-semibold text-error hover:bg-[#F7E9EA]">
            <RotateCcw className="h-4 w-4" /> Reset Demo Data
          </button>
        </div>
      )}

      {confirm && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setConfirm(false)} className="absolute inset-0 bg-ink/40" />
          <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-[22px] text-ink">Reset demo data?</h3><button aria-label="Close" onClick={() => setConfirm(false)} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted"><X className="h-5 w-5" /></button></div>
            <p className="text-[13px] leading-relaxed text-muted">This restores all original prefilled demo values and clears any in-progress states. Your current edits will be discarded.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button onClick={resetDemo} className="tap min-h-[48px] rounded-control bg-error text-[15px] font-semibold text-white">Reset Demo Data</button>
              <button onClick={() => setConfirm(false)} className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
function Chip({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex min-h-[44px] items-center gap-2.5 rounded-control border border-border bg-bg px-3 text-left text-[13px] font-semibold text-ink hover:border-ink/25">
      <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-brand-soft text-brand-dark">{icon}</span>
      {label}
    </button>
  )
}
