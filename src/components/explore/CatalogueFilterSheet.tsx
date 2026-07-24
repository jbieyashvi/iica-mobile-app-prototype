import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'
import { MEMBERSHIP_CATEGORIES, CATALOGUE_LOCATIONS, CATALOGUE_GENRES } from '../../config/catalogue'

export interface CatalogueFilters {
  category: string
  location: string
  genre: string
  verified: boolean
}

interface Props {
  value: CatalogueFilters
  onApply: (v: CatalogueFilters) => void
  onClear: () => void
  onClose: () => void
}

export default function CatalogueFilterSheet({ value, onApply, onClear, onClose }: Props) {
  const [v, setV] = useState<CatalogueFilters>(value)
  const [locQ, setLocQ] = useState('')
  const [genreQ, setGenreQ] = useState('')

  const chip = (active: boolean) =>
    `tap min-h-[36px] rounded-control border px-3 text-[12.5px] font-semibold ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-muted'}`

  const locations = CATALOGUE_LOCATIONS.filter((l) => l.toLowerCase().includes(locQ.trim().toLowerCase()))
  const genres = CATALOGUE_GENRES.filter((g) => g.toLowerCase().includes(genreQ.trim().toLowerCase()))

  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="fade-in relative flex max-h-[90%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h3 className="font-serif text-[20px] text-ink">Filters</h3>
          <button aria-label="Close" onClick={onClose} className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"><X className="h-5 w-5" /></button>
        </div>

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-4">
          {/* Category */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Category</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setV({ ...v, category: '' })} className={chip(!v.category)}>All Categories</button>
              {MEMBERSHIP_CATEGORIES.map((c) => (
                <button key={c} onClick={() => setV({ ...v, category: v.category === c ? '' : c })} className={chip(v.category === c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Location</p>
            <div className="mb-2 flex h-9 items-center gap-2 rounded-control border border-border bg-bg px-2.5">
              <Search className="h-3.5 w-3.5 text-muted" />
              <input value={locQ} onChange={(e) => setLocQ(e.target.value)} placeholder="Search location" className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setV({ ...v, location: '' })} className={chip(!v.location)}>All Locations</button>
              {locations.map((l) => (
                <button key={l} onClick={() => setV({ ...v, location: v.location === l ? '' : l })} className={chip(v.location === l)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Genre</p>
            <div className="mb-2 flex h-9 items-center gap-2 rounded-control border border-border bg-bg px-2.5">
              <Search className="h-3.5 w-3.5 text-muted" />
              <input value={genreQ} onChange={(e) => setGenreQ(e.target.value)} placeholder="Search genre" className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setV({ ...v, genre: '' })} className={chip(!v.genre)}>All Genres</button>
              {genres.map((g) => (
                <button key={g} onClick={() => setV({ ...v, genre: v.genre === g ? '' : g })} className={chip(v.genre === g)}>{g}</button>
              ))}
            </div>
          </div>

          {/* Verified */}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Verified</p>
            <button onClick={() => setV({ ...v, verified: !v.verified })} className={`${chip(v.verified)} inline-flex items-center gap-1.5`}>
              {v.verified && <Check className="h-3.5 w-3.5" />} Verified only
            </button>
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-border px-5 pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
          <SecondaryButton onClick={onClear} className="min-w-[110px]">Clear All</SecondaryButton>
          <PrimaryButton full onClick={() => onApply(v)}>Apply Filters</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
