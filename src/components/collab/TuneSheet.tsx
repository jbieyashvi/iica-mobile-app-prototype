import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'
import { TuneFilters, DEFAULT_TUNE, TUNE_LOOKING_FOR, LocationType, CollabMode } from '../../collab/types'
import { MEMBERSHIP_CATEGORIES, CATALOGUE_LOCATIONS } from '../../config/catalogue'

interface Props {
  initial: TuneFilters
  onShow: (t: TuneFilters) => void
  onReset: () => void
  onClose: () => void
}

const MODES: (CollabMode | 'Any')[] = ['Any', 'In Person', 'Remote', 'Either']

export default function TuneSheet({ initial, onShow, onReset, onClose }: Props) {
  const [v, setV] = useState<TuneFilters>(initial)
  const [cityQ, setCityQ] = useState('')

  const chip = (active: boolean) =>
    `tap min-h-[36px] rounded-control border px-3 text-[12.5px] font-semibold ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`

  const toggleLooking = (o: string) =>
    setV((s) => ({ ...s, lookingFor: s.lookingFor.includes(o) ? s.lookingFor.filter((x) => x !== o) : [...s.lookingFor, o] }))

  const setLoc = (locationType: LocationType) => setV((s) => ({ ...s, locationType, city: locationType === 'city' ? s.city : '' }))
  const cities = CATALOGUE_LOCATIONS.filter((c) => c.toLowerCase().includes(cityQ.trim().toLowerCase()))

  return (
    <div className="absolute inset-0 z-[55] flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative flex max-h-[90%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface">
        <div className="flex items-start justify-between px-5 pb-1 pt-4">
          <div>
            <h3 className="font-serif text-[21px] leading-tight text-ink">Tune Your Matches</h3>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">Tell us what you’re looking for. You can change this anytime.</p>
          </div>
          <button aria-label="Close" onClick={onClose} className="tap -mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {/* A. Looking for */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Looking for</p>
            <div className="flex flex-wrap gap-2">
              {TUNE_LOOKING_FOR.map((o) => <button key={o} onClick={() => toggleLooking(o)} className={chip(v.lookingFor.includes(o))}>{o}</button>)}
            </div>
          </div>

          {/* B. Profile category */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Profile category</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setV((s) => ({ ...s, category: '' }))} className={chip(!v.category)}>Any Category</button>
              {MEMBERSHIP_CATEGORIES.map((c) => <button key={c} onClick={() => setV((s) => ({ ...s, category: s.category === c ? '' : c }))} className={chip(v.category === c)}>{c}</button>)}
            </div>
          </div>

          {/* C. Location */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Location</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setLoc('anywhere')} className={chip(v.locationType === 'anywhere')}>Anywhere</button>
              <button onClick={() => setLoc('near')} className={chip(v.locationType === 'near')}>Near Me</button>
              <button onClick={() => setLoc('city')} className={chip(v.locationType === 'city')}>Select City</button>
            </div>
            {v.locationType === 'city' && (
              <div className="mt-2.5">
                <div className="mb-2 flex h-9 items-center gap-2 rounded-control border border-border bg-bg px-2.5">
                  <Search className="h-3.5 w-3.5 text-muted" />
                  <input value={cityQ} onChange={(e) => setCityQ(e.target.value)} placeholder="Search city" className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities.map((c) => <button key={c} onClick={() => setV((s) => ({ ...s, city: s.city === c ? '' : c }))} className={chip(v.city === c)}>{c}</button>)}
                </div>
              </div>
            )}
          </div>

          {/* D. Collaboration mode */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Collaboration mode</p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => <button key={m} onClick={() => setV((s) => ({ ...s, mode: m }))} className={`${chip(v.mode === m)} inline-flex items-center gap-1`}>{v.mode === m && m !== 'Any' && <Check className="h-3.5 w-3.5" />}{m}</button>)}
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-border px-5 pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <SecondaryButton onClick={() => { setV(DEFAULT_TUNE); setCityQ(''); onReset() }} className="min-w-[92px]">Reset</SecondaryButton>
          <PrimaryButton full onClick={() => onShow(v)}>Show Matches</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
