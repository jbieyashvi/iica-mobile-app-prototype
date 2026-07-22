import { X, Copy, MessageCircle, Instagram, Facebook, Twitter, Linkedin, MoreHorizontal } from 'lucide-react'

const channels = [
  { label: 'WhatsApp', icon: MessageCircle, cls: 'text-[#25D366]' },
  { label: 'Instagram', icon: Instagram, cls: 'text-[#E4405F]' },
  { label: 'Facebook', icon: Facebook, cls: 'text-[#1877F2]' },
  { label: 'X', icon: Twitter, cls: 'text-ink' },
  { label: 'LinkedIn', icon: Linkedin, cls: 'text-[#0A66C2]' },
  { label: 'More', icon: MoreHorizontal, cls: 'text-muted' },
]

export default function ShareSheet({ title, url, onClose, onToast }: { title: string; url: string; onClose: () => void; onToast: (m: string) => void }) {
  const share = async (channel: string) => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); onClose(); return } catch { /* cancelled */ }
    }
    onToast(`Sharing to ${channel} (prototype)`)
    onClose()
  }
  const copy = async () => { try { await navigator.clipboard.writeText(url) } catch { /* */ } onToast('Link copied'); onClose() }

  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-[19px] text-ink">Share</h3>
          <button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-3 line-clamp-1 text-[13px] text-muted">{title}</p>
        <div className="grid grid-cols-4 gap-2.5">
          {channels.map(({ label, icon: Icon, cls }) => (
            <button key={label} onClick={() => share(label)} className="tap flex flex-col items-center gap-1.5 rounded-card border border-border bg-surface py-3 hover:border-ink/20">
              <Icon className={`h-6 w-6 ${cls}`} strokeWidth={1.75} />
              <span className="text-[11px] font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={copy} className="tap mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-control border border-border bg-bg text-[13px] font-semibold text-ink hover:border-ink/25"><Copy className="h-4 w-4" /> Copy link</button>
      </div>
    </div>
  )
}
