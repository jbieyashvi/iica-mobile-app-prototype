interface Props {
  title: string
  action?: string
  onAction?: () => void
}

export default function SectionHeader({ title, action, onAction }: Props) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[17px] font-bold tracking-tight text-ink">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="tap text-[13px] font-semibold text-brand hover:text-brand-dark"
        >
          {action}
        </button>
      )}
    </div>
  )
}
