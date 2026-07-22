import { useState } from 'react'
import {
  Instagram, Facebook, Youtube, Music2, Twitter, Linkedin, Globe, Link2,
  Plus, Trash2, Eye, EyeOff,
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import EditorShell from '../../../components/portfolio/EditorShell'
import TextField from '../../../components/form/TextField'
import { usePortfolio } from '../../../state/PortfolioContext'
import { SocialLinks } from '../../../portfolio/types'
import { isUrl } from '../../../lib/validation'
import { useEditorNav } from './common'

interface Row { key: keyof SocialLinks; label: string; icon: LucideIcon; required?: boolean; placeholder: string }

const PRIORITY: Row[] = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, required: true, placeholder: 'instagram.com/…' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, required: true, placeholder: 'facebook.com/…' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, required: true, placeholder: 'youtube.com/@…' },
  { key: 'spotify', label: 'Spotify', icon: Music2, required: true, placeholder: 'open.spotify.com/…' },
]
const SECONDARY: Row[] = [
  { key: 'x', label: 'X', icon: Twitter, placeholder: 'x.com/…' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/…' },
  { key: 'website', label: 'Personal website', icon: Globe, placeholder: 'yoursite.com' },
]

const newId = () => 'l' + Math.random().toString(36).slice(2, 9)

export default function SocialEditor() {
  const { portfolio, setSection } = usePortfolio()
  const { rev, bump, goNext } = useEditorNav('social')
  const s = portfolio.social
  const [touched, setTouched] = useState(false)

  const update = (patch: Partial<SocialLinks>) => {
    setSection('social', { ...s, ...patch })
    bump()
  }

  const toggleHidden = (key: string) =>
    update({ hidden: s.hidden.includes(key) ? s.hidden.filter((k) => k !== key) : [...s.hidden, key] })

  const err = (key: keyof SocialLinks) => {
    const v = s[key]
    return typeof v === 'string' && v && !isUrl(v) ? 'Enter a valid URL' : ''
  }

  const filled = [...PRIORITY, ...SECONDARY].filter(
    (r) => typeof s[r.key] === 'string' && (s[r.key] as string) && !s.hidden.includes(r.key),
  )

  return (
    <EditorShell title="Social Links" revision={rev} onSaveContinue={goNext}>
      {/* Live preview */}
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">Preview</p>
      <div className="mb-6 flex flex-wrap gap-2 rounded-card border border-border bg-surface p-3">
        {filled.length === 0 && s.custom.filter((c) => c.url && !s.hidden.includes(c.id)).length === 0 ? (
          <span className="text-[12.5px] text-muted">Links you add will appear here.</span>
        ) : (
          <>
            {filled.map((r) => {
              const Icon = r.icon
              return (
                <span key={r.key} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-ink">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
              )
            })}
            {s.custom
              .filter((c) => c.url && !s.hidden.includes(c.id))
              .map((c) => (
                <span key={c.id} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-ink">
                  <Link2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
              ))}
          </>
        )}
      </div>

      <p className="mb-2 text-[13px] font-semibold text-ink">
        Priority links <span className="font-normal text-brand">· required</span>
      </p>
      <div className="flex flex-col gap-3">
        {PRIORITY.map((r) => (
          <LinkField
            key={r.key}
            row={r}
            value={s[r.key] as string}
            error={touched ? err(r.key) : ''}
            hidden={s.hidden.includes(r.key)}
            onChange={(v) => {
              setTouched(true)
              update({ [r.key]: v } as Partial<SocialLinks>)
            }}
            onToggleHidden={() => toggleHidden(r.key)}
          />
        ))}
      </div>

      <p className="mb-2 mt-6 text-[13px] font-semibold text-ink">More links</p>
      <div className="flex flex-col gap-3">
        {SECONDARY.map((r) => (
          <LinkField
            key={r.key}
            row={r}
            value={s[r.key] as string}
            error={touched ? err(r.key) : ''}
            hidden={s.hidden.includes(r.key)}
            onChange={(v) => update({ [r.key]: v } as Partial<SocialLinks>)}
            onToggleHidden={() => toggleHidden(r.key)}
          />
        ))}
      </div>

      {/* Custom links */}
      <div className="mt-6 border-t border-border pt-5">
        <p className="mb-2 text-[13px] font-semibold text-ink">Custom links</p>
        <div className="flex flex-col gap-3">
          {s.custom.map((c) => (
            <div key={c.id} className="rounded-card border border-border bg-surface p-3">
              <div className="flex gap-2">
                <input
                  aria-label="Link label"
                  value={c.label}
                  onChange={(e) =>
                    update({ custom: s.custom.map((x) => (x.id === c.id ? { ...x, label: e.target.value } : x)) })
                  }
                  placeholder="Label"
                  className="min-h-[42px] w-[38%] rounded-control border border-border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand"
                />
                <input
                  aria-label="Link URL"
                  value={c.url}
                  onChange={(e) =>
                    update({ custom: s.custom.map((x) => (x.id === c.id ? { ...x, url: e.target.value } : x)) })
                  }
                  placeholder="https://…"
                  className="min-h-[42px] flex-1 rounded-control border border-border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand"
                />
                <button
                  aria-label="Remove link"
                  onClick={() => update({ custom: s.custom.filter((x) => x.id !== c.id) })}
                  className="tap flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-control border border-border bg-bg text-muted hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {c.url && !isUrl(c.url) && (
                <p className="mt-1 text-[12px] font-medium text-error">Enter a valid URL</p>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => update({ custom: [...s.custom, { id: newId(), label: '', url: '' }] })}
          className="tap mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark hover:border-brand"
        >
          <Plus className="h-[18px] w-[18px]" /> Add Custom Link
        </button>
      </div>
    </EditorShell>
  )
}

function LinkField({
  row, value, error, hidden, onChange, onToggleHidden,
}: {
  row: Row
  value: string
  error: string
  hidden: boolean
  onChange: (v: string) => void
  onToggleHidden: () => void
}) {
  const Icon = row.icon
  return (
    <div className="flex items-end gap-2">
      <span className="mb-[3px] flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-control border border-border bg-surface text-ink">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="flex-1">
        <TextField label={row.label} value={value} onChange={onChange} placeholder={row.placeholder} error={error} optional={!row.required} />
      </div>
      <button
        aria-label={hidden ? `Show ${row.label}` : `Hide ${row.label}`}
        onClick={onToggleHidden}
        className="tap mb-[3px] flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-control border border-border bg-surface text-muted hover:text-ink"
      >
        {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
