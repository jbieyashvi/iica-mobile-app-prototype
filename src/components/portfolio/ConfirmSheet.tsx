interface Props {
  open: boolean
  title: string
  body?: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmSheet({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  danger,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Cancel" onClick={onCancel} className="absolute inset-0 bg-ink/40" />
      <div
        className="fade-in relative w-full rounded-t-[20px] border-t border-border bg-surface p-5"
        style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
      >
        <h3 className="font-serif text-[22px] leading-tight text-ink">{title}</h3>
        {body && <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p>}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            className={`tap min-h-[48px] rounded-control text-[15px] font-semibold text-white transition-colors ${
              danger ? 'bg-error hover:bg-error/90' : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="tap min-h-[44px] text-[14px] font-semibold text-muted hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
