import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface Props {
  id: string
  label?: string
}

export default function IdBlock({ id, label = 'Your IICA ID' }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[22px] font-bold tracking-tight text-ink">
          {id}
        </span>
        <button
          onClick={copy}
          aria-label="Copy ID"
          className={`tap flex h-10 items-center gap-1.5 rounded-control border px-3 text-[13px] font-semibold transition-colors ${
            copied
              ? 'border-success/40 bg-[#EAF3EE] text-success'
              : 'border-border bg-bg text-ink hover:border-ink/25'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}
