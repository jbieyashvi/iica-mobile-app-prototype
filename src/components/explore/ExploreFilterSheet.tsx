import { useState } from 'react'
import { X } from 'lucide-react'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'

export interface FilterGroup {
  key: string
  label: string
  type: 'single' | 'multi' | 'toggle'
  options?: string[]
}
export type FilterValues = Record<string, string | string[] | boolean>

interface Props {
  title?: string
  groups: FilterGroup[]
  value: FilterValues
  onApply: (v: FilterValues) => void
  onClose: () => void
  onClear: () => void
}

export default function ExploreFilterSheet({ title = 'Filters', groups, value, onApply, onClose, onClear }: Props) {
  const [v, setV] = useState<FilterValues>(value)

  const chip = (active: boolean) => `tap min-h-[38px] rounded-control border px-3 text-[12.5px] font-semibold ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`

  const toggleMulti = (key: string, opt: string) => {
    const cur = (v[key] as string[]) ?? []
    setV({ ...v, [key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] })
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative flex max-h-[90%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h3 className="font-serif text-[20px] text-ink">{title}</h3>
          <button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>
        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-4">
          {groups.map((g) => (
            <div key={g.key}>
              <p className="mb-2 text-[13px] font-semibold text-ink">{g.label}</p>
              {g.type === 'toggle' ? (
                <button onClick={() => setV({ ...v, [g.key]: !v[g.key] })} className={chip(!!v[g.key])}>{g.label}</button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {g.options?.map((o) => {
                    const active = g.type === 'multi' ? ((v[g.key] as string[]) ?? []).includes(o) : v[g.key] === o
                    return (
                      <button key={o} onClick={() => g.type === 'multi' ? toggleMulti(g.key, o) : setV({ ...v, [g.key]: v[g.key] === o ? '' : o })} className={chip(active)}>{o}</button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 border-t border-border px-5 pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <SecondaryButton onClick={onClear} className="min-w-[110px]">Clear All</SecondaryButton>
          <PrimaryButton full onClick={() => onApply(v)}>Apply Filters</PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export function countActive(v: FilterValues): number {
  return Object.values(v).reduce<number>((n, val) => {
    if (Array.isArray(val)) return n + (val.length > 0 ? 1 : 0)
    if (typeof val === 'boolean') return n + (val ? 1 : 0)
    return n + (val ? 1 : 0)
  }, 0)
}
