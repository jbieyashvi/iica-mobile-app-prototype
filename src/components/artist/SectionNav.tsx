import { useEffect, useRef } from 'react'

export interface NavItem {
  id: string
  label: string
}

interface Props {
  items: NavItem[]
  active: string
  onSelect: (id: string) => void
}

export default function SectionNav({ items, active, onSelect }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // keep the active chip centred — manual horizontal scroll only (scrollIntoView
  // would also move the vertical page under the transformed device frame).
  useEffect(() => {
    const chip = activeRef.current
    const row = scroller.current
    if (!chip || !row) return
    const target = chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2
    row.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [active])

  return (
    <div
      className="sticky z-30 border-b border-border bg-bg/92 backdrop-blur-md"
      style={{ top: 'calc(var(--safe-top) + 44px)' }}
    >
      <div ref={scroller} className="no-scrollbar flex gap-1 overflow-x-auto px-2 py-2">
        {items.map((it) => {
          const on = active === it.id
          return (
            <button
              key={it.id}
              ref={on ? activeRef : undefined}
              onClick={() => onSelect(it.id)}
              className={`tap relative shrink-0 rounded-control px-3 py-2 text-[13px] font-semibold transition-colors ${
                on ? 'text-brand' : 'text-muted hover:text-ink'
              }`}
            >
              {it.label}
              {on && (
                <span className="absolute inset-x-3 -bottom-2 h-[2px] rounded-full bg-brand" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
