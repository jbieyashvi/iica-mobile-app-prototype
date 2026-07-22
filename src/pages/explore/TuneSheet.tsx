import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { useInterests, Interests } from '../../state/useExplore'
import { INTEREST_OPTIONS, COLLAB_INTERESTS } from '../../data/exploreData'
import TextField from '../../components/form/TextField'
import Toggle from '../../components/form/Toggle'
import ChipSelect from '../../components/form/ChipSelect'
import PrimaryButton from '../../components/PrimaryButton'

export default function TuneSheet({ onClose }: { onClose: () => void }) {
  const { interests, save } = useInterests()
  const [v, setV] = useState<Interests>(interests)

  const toggleTopic = (t: string) => setV((s) => ({ ...s, topics: s.topics.includes(t) ? s.topics.filter((x) => x !== t) : [...s.topics, t] }))
  const toggleCollab = (t: string) => setV((s) => ({ ...s, collab: s.collab.includes(t) ? s.collab.filter((x) => x !== t) : [...s.collab, t] }))

  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative flex max-h-[90%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface">
        <div className="flex items-center justify-between px-5 pb-1 pt-4">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-brand" /><h3 className="font-serif text-[20px] text-ink">Tune Your Explore</h3></div>
          <button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>
        <p className="px-5 pb-3 text-[12.5px] text-muted">Pick what you love — we'll reorder your For You feed.</p>
        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-4">
          <ChipSelect label="Your interests" options={INTEREST_OPTIONS} selected={v.topics} onToggle={toggleTopic} />
          <TextField label="Preferred cities" optional value={v.cities} onChange={(x) => setV((s) => ({ ...s, cities: x }))} placeholder="e.g. Mumbai, Bengaluru" />
          <div className="flex flex-col gap-3 rounded-card border border-border bg-bg p-4">
            <Toggle label="Prioritise online events" checked={v.onlineOnly} onChange={(x) => setV((s) => ({ ...s, onlineOnly: x }))} />
            <Toggle label="Prioritise free events" checked={v.freeOnly} onChange={(x) => setV((s) => ({ ...s, freeOnly: x }))} />
          </div>
          <ChipSelect label="Collaboration interests" options={COLLAB_INTERESTS} selected={v.collab} onToggle={toggleCollab} />
        </div>
        <div className="border-t border-border px-5 pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <PrimaryButton full onClick={() => { save(v); onClose() }}>Save Preferences</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
