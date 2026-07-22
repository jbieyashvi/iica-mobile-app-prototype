import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, Check, ExternalLink, Share2, QrCode as QrIcon } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { usePortfolio } from '../../state/PortfolioContext'

export default function PortfolioPublished() {
  const navigate = useNavigate()
  const { portfolio } = usePortfolio()
  const [copied, setCopied] = useState(false)

  const url = `iica.app/artist/${portfolio.slug}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <AuthShell showBack={false}>
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
          <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-serif text-[30px] leading-tight text-ink">
          Your portfolio is live
        </h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
          Your creator portfolio is now published and discoverable on IICA.
        </p>
      </div>

      {/* URL block */}
      <div className="mt-7 rounded-card border border-border bg-surface p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Public URL
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="truncate font-mono text-[15px] font-semibold text-ink">{url}</span>
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

      <div className="mt-4 flex flex-col gap-2.5">
        <PrimaryButton full onClick={() => navigate(`/artist/${portfolio.slug}`)}>
          <ExternalLink className="h-4 w-4" /> View Published Portfolio
        </PrimaryButton>
        <SecondaryButton full onClick={() => navigate('/portfolio/share')}>
          <Share2 className="h-4 w-4" /> Share Portfolio
        </SecondaryButton>
        <SecondaryButton full onClick={() => navigate('/portfolio/share')}>
          <QrIcon className="h-4 w-4" /> Generate QR Code
        </SecondaryButton>
        <button
          onClick={() => navigate('/')}
          className="tap mt-1 min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
        >
          Back to Home
        </button>
      </div>
    </AuthShell>
  )
}
