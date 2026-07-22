import { useState } from 'react'
import {
  Copy, Check, Download, Instagram, Facebook, Youtube, Twitter, Linkedin, MoreHorizontal,
  MessageCircle,
} from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import QrCode from '../../components/portfolio/QrCode'
import { usePortfolio } from '../../state/PortfolioContext'

const channels = [
  { label: 'WhatsApp', icon: MessageCircle, cls: 'text-[#25D366]' },
  { label: 'Instagram', icon: Instagram, cls: 'text-[#E4405F]' },
  { label: 'Facebook', icon: Facebook, cls: 'text-[#1877F2]' },
  { label: 'X', icon: Twitter, cls: 'text-ink' },
  { label: 'LinkedIn', icon: Linkedin, cls: 'text-[#0A66C2]' },
  { label: 'YouTube', icon: Youtube, cls: 'text-[#FF0000]' },
]

export default function PortfolioShare() {
  const { portfolio } = usePortfolio()
  const [toast, setToast] = useState('')
  const [copied, setCopied] = useState(false)

  const url = `https://iica.app/artist/${portfolio.slug}`

  const flash = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1800)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const share = async (channel: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${portfolio.basics.fullName} · IICA`,
          text: 'Check out my creator portfolio on IICA',
          url,
        })
        return
      } catch {
        /* cancelled or unsupported — fall through */
      }
    }
    flash(`Sharing to ${channel} (prototype)`)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Share Portfolio" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-8">
        {/* QR */}
        <div className="mt-4 flex flex-col items-center rounded-card border border-border bg-surface p-6">
          <div className="rounded-[12px] border border-border p-3">
            <QrCode value={url} />
          </div>
          <p className="mt-3 text-center font-serif text-[18px] text-ink">
            {portfolio.basics.fullName}
          </p>
          <p className="text-[12.5px] text-muted">Scan to view portfolio</p>
          <button
            onClick={() => flash('QR code downloaded (prototype)')}
            className="tap mt-4 flex min-h-[44px] items-center gap-2 rounded-control border border-border bg-bg px-4 text-[13px] font-semibold text-ink hover:border-ink/25"
          >
            <Download className="h-4 w-4" /> Download QR
          </button>
        </div>

        {/* URL */}
        <div className="mt-4 rounded-card border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Public link</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate font-mono text-[13.5px] font-semibold text-ink">
              iica.app/artist/{portfolio.slug}
            </span>
            <button
              onClick={copy}
              className={`tap flex h-10 shrink-0 items-center gap-1.5 rounded-control border px-3 text-[13px] font-semibold ${
                copied ? 'border-success/40 bg-[#EAF3EE] text-success' : 'border-border bg-bg text-ink hover:border-ink/25'
              }`}
            >
              {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
            </button>
          </div>
        </div>

        {/* Channels */}
        <p className="mb-3 mt-6 text-[13px] font-semibold text-ink">Share to</p>
        <div className="grid grid-cols-4 gap-2.5">
          {channels.map(({ label, icon: Icon, cls }) => (
            <button
              key={label}
              onClick={() => share(label)}
              className="tap flex flex-col items-center gap-1.5 rounded-card border border-border bg-surface py-3 hover:border-ink/20"
            >
              <Icon className={`h-6 w-6 ${cls}`} strokeWidth={1.75} />
              <span className="text-[11px] font-semibold text-ink">{label}</span>
            </button>
          ))}
          <button
            onClick={() => share('More')}
            className="tap flex flex-col items-center gap-1.5 rounded-card border border-border bg-surface py-3 hover:border-ink/20"
          >
            <MoreHorizontal className="h-6 w-6 text-muted" strokeWidth={1.75} />
            <span className="text-[11px] font-semibold text-ink">More</span>
          </button>
        </div>

        <p className="mt-6 rounded-control bg-surface px-3.5 py-3 text-[11.5px] leading-relaxed text-muted ring-1 ring-border">
          Deep links open your portfolio directly in the IICA app when installed,
          and fall back to the web profile otherwise.
        </p>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">
            {toast}
          </span>
        </div>
      )}
    </div>
  )
}
