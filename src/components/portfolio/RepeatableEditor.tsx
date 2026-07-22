import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { Entry } from '../../portfolio/types'
import TextField from '../form/TextField'
import TextArea from '../form/TextArea'
import SelectField from '../form/SelectField'
import Toggle from '../form/Toggle'
import ImageUpload from '../form/ImageUpload'
import ConfirmSheet from './ConfirmSheet'
import PrimaryButton from '../PrimaryButton'
import SecondaryButton from '../SecondaryButton'
import { isUrl } from '../../lib/validation'

export interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'toggle' | 'image' | 'url'
  options?: string[]
  maxLength?: number
  optional?: boolean
  placeholder?: string
  half?: boolean
  showIf?: (draft: Entry) => boolean
}

interface Props {
  items: Entry[]
  onChange: (items: Entry[]) => void
  fields: FieldDef[]
  makeSummary: (e: Entry) => { title: string; sub?: string; badge?: string; image?: string }
  addLabel: string
  emptyText: string
  sort?: (a: Entry, b: Entry) => number
}

const newId = () => 'e' + Math.random().toString(36).slice(2, 9)

export default function RepeatableEditor({
  items,
  onChange,
  fields,
  makeSummary,
  addLabel,
  emptyText,
  sort,
}: Props) {
  const [editing, setEditing] = useState<Entry | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const blank = (): Entry => {
    const e: Entry = { id: newId() }
    fields.forEach((f) => (e[f.key] = f.type === 'toggle' ? false : ''))
    return e
  }

  const visibleFields = (draft: Entry) => fields.filter((f) => !f.showIf || f.showIf(draft))

  const validate = (draft: Entry) => {
    const errs: Record<string, string> = {}
    visibleFields(draft).forEach((f) => {
      const val = draft[f.key]
      if (!f.optional && f.type !== 'toggle' && !String(val).trim())
        errs[f.key] = 'Required'
      if (f.type === 'url' && typeof val === 'string' && val && !isUrl(val))
        errs[f.key] = 'Enter a valid URL'
    })
    return errs
  }

  const save = () => {
    if (!editing) return
    const errs = validate(editing)
    setErrors(errs)
    if (Object.keys(errs).length) return
    const exists = items.some((i) => i.id === editing.id)
    let next = exists
      ? items.map((i) => (i.id === editing.id ? editing : i))
      : [...items, editing]
    if (sort) next = [...next].sort(sort)
    onChange(next)
    setEditing(null)
    setErrors({})
  }

  const confirmDelete = () => {
    if (deleteId) onChange(items.filter((i) => i.id !== deleteId))
    setDeleteId(null)
    if (editing?.id === deleteId) setEditing(null)
  }

  const sorted = sort ? [...items].sort(sort) : items

  return (
    <div>
      {/* List */}
      {sorted.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface px-4 py-8 text-center">
          <p className="text-[13px] leading-relaxed text-muted">{emptyText}</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
          {sorted.map((e) => {
            const s = makeSummary(e)
            return (
              <div key={e.id} className="flex items-center gap-3 px-3.5 py-3">
                {s.image ? (
                  <img
                    src={s.image}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-[9px] border border-border object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14px] font-semibold text-ink">
                      {s.title}
                    </p>
                    {s.badge && (
                      <span className="shrink-0 rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-dark">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  {s.sub && (
                    <p className="mt-0.5 truncate text-[12px] text-muted">{s.sub}</p>
                  )}
                </div>
                <button
                  aria-label="Edit"
                  onClick={() => {
                    setErrors({})
                    setEditing({ ...e })
                  }}
                  className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04] hover:text-ink"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  aria-label="Delete"
                  onClick={() => setDeleteId(e.id)}
                  className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04] hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add */}
      <button
        onClick={() => {
          setErrors({})
          setEditing(blank())
        }}
        className="tap mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand/40 bg-brand-soft text-[14px] font-semibold text-brand-dark hover:border-brand"
      >
        <Plus className="h-[18px] w-[18px]" />
        {addLabel}
      </button>

      {/* Add/Edit form sheet */}
      {editing && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={() => setEditing(null)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            className="fade-in relative flex max-h-[88%] w-full flex-col rounded-t-[20px] border-t border-border bg-surface"
          >
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <h3 className="font-serif text-[20px] text-ink">
                {items.some((i) => i.id === editing.id) ? 'Edit' : addLabel}
              </h3>
              <button
                aria-label="Close"
                onClick={() => setEditing(null)}
                className="tap flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-black/[0.04]"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4">
              <div className="flex flex-col gap-4">
                {visibleFields(editing).map((f) => {
                  const set = (v: string | boolean) =>
                    setEditing({ ...editing, [f.key]: v })
                  const val = editing[f.key]
                  if (f.type === 'textarea')
                    return (
                      <TextArea
                        key={f.key}
                        label={f.label}
                        value={String(val ?? '')}
                        onChange={(v) => set(v)}
                        maxLength={f.maxLength ?? 500}
                        placeholder={f.placeholder}
                        error={errors[f.key]}
                      />
                    )
                  if (f.type === 'select')
                    return (
                      <SelectField
                        key={f.key}
                        label={f.label}
                        value={String(val ?? '')}
                        onChange={(v) => set(v)}
                        options={f.options ?? []}
                        optional={f.optional}
                        error={errors[f.key]}
                      />
                    )
                  if (f.type === 'toggle')
                    return (
                      <Toggle
                        key={f.key}
                        label={f.label}
                        checked={Boolean(val)}
                        onChange={(v) => set(v)}
                      />
                    )
                  if (f.type === 'image')
                    return (
                      <ImageUpload
                        key={f.key}
                        label={f.label}
                        value={String(val ?? '')}
                        onChange={(v) => set(v)}
                        optional={f.optional}
                      />
                    )
                  return (
                    <TextField
                      key={f.key}
                      label={f.label}
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={String(val ?? '')}
                      onChange={(v) => set(v)}
                      placeholder={f.placeholder}
                      optional={f.optional}
                      error={errors[f.key]}
                    />
                  )
                })}
              </div>
            </div>

            <div
              className="flex gap-2.5 border-t border-border px-5 pt-3"
              style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
            >
              {items.some((i) => i.id === editing.id) && (
                <SecondaryButton
                  onClick={() => setDeleteId(editing.id)}
                  className="min-w-[52px] !text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </SecondaryButton>
              )}
              <PrimaryButton full onClick={save}>
                Save
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmSheet
        open={!!deleteId}
        title="Delete this entry?"
        body="This can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
