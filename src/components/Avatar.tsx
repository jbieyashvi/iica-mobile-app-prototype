interface Props {
  src?: string
  name: string
  size?: number
  className?: string
}

export default function Avatar({ src, name, size = 36, className = '' }: Props) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-brand-soft text-[13px] font-semibold text-brand-dark ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  )
}
