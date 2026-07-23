import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../../components/BackHeader'
import CreateProgress from '../../components/content/CreateProgress'
import SelectField from '../../components/form/SelectField'
import TextField from '../../components/form/TextField'
import Toggle from '../../components/form/Toggle'
import PrimaryButton from '../../components/PrimaryButton'
import { useContentStore } from '../../state/ContentContext'
import { ContentDraft, Visibility, DownloadMode, ContentType, DEFAULT_SETTINGS } from '../../content/types'

const VIS: { key: Visibility; blurb: string }[] = [
  { key: 'Public', blurb: 'Anyone can discover and view' },
  { key: 'Members Only', blurb: 'Only IICA members can view' },
  { key: 'Unlisted', blurb: 'Only people with the link' },
  { key: 'Draft', blurb: 'Not visible to anyone yet' },
]

export default function Settings() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useContentStore()
  const isUpdate = draft.type === 'Artist Update'

  const [v, setV] = useState<ContentDraft>({ ...DEFAULT_SETTINGS, ...draft })
  const set = <K extends keyof ContentDraft>(k: K, val: ContentDraft[K]) => setV((s) => ({ ...s, [k]: val }))
  const [schedule, setSchedule] = useState(!!draft.scheduleAt)

  const onContinue = () => {
    saveDraft({ ...v, scheduleAt: schedule ? (v.scheduleAt || new Date().toISOString().slice(0, 10)) : undefined })
    navigate('/content/create/preview')
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Content Settings" />
      <CreateProgress step="Settings" isUpdate={isUpdate} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-2">
        <Section title="Visibility">
          <div className="flex flex-col gap-2">
            {VIS.map((o) => (
              <button key={o.key} onClick={() => set('visibility', o.key)} className={`tap flex items-center justify-between rounded-control border px-4 py-3 text-left ${v.visibility === o.key ? 'border-brand bg-brand-soft' : 'border-border bg-surface'}`}>
                <span><span className="block text-[14px] font-semibold text-ink">{o.key}</span><span className="text-[12px] text-muted">{o.blurb}</span></span>
                {v.visibility === o.key && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Engagement">
          <Toggle label="Allow likes" checked={v.allowLikes ?? true} onChange={(x) => set('allowLikes', x)} />
          <Toggle label="Allow comments" checked={v.allowComments ?? true} onChange={(x) => set('allowComments', x)} />
          <Toggle label="Allow sharing" checked={v.allowSharing ?? true} onChange={(x) => set('allowSharing', x)} />
          <Toggle label="Show view count" checked={v.showViews ?? true} onChange={(x) => set('showViews', x)} />
        </Section>

        {!isUpdate && (
          <Section title="Downloads">
            <div className="flex gap-2">
              {(['view', 'download'] as DownloadMode[]).map((d) => (
                <button key={d} onClick={() => set('download', d)} className={`tap min-h-[44px] flex-1 rounded-control border text-[13px] font-semibold ${v.download === d ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>{d === 'view' ? 'Stream / View Only' : 'Allow Download'}</button>
              ))}
            </div>
            {v.download === 'download' && (
              <>
                <SelectField label="Download file type" value={v.downloadType ?? fileTypeFor(draft.type)} onChange={(x) => set('downloadType', x)} options={['PDF', 'MP4', 'MP3', 'ZIP', 'JPG', 'PNG']} />
                <TextField label="Usage note" optional value={v.usageNote ?? ''} onChange={(x) => set('usageNote', x)} placeholder="e.g. Personal use only" />
                <TextField label="Download limit" optional value={v.downloadLimit ?? ''} onChange={(x) => set('downloadLimit', x)} placeholder="e.g. Unlimited" />
              </>
            )}
          </Section>
        )}

        <Section title="Publishing">
          <div className="flex gap-2">
            <button onClick={() => setSchedule(false)} className={`tap min-h-[44px] flex-1 rounded-control border text-[13px] font-semibold ${!schedule ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>Publish Now</button>
            <button onClick={() => setSchedule(true)} className={`tap min-h-[44px] flex-1 rounded-control border text-[13px] font-semibold ${schedule ? 'border-brand bg-brand-soft text-brand-dark' : 'border-border bg-surface text-ink'}`}>Schedule for Later</button>
          </div>
          {schedule && (
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Date" type="date" value={v.scheduleAt ?? ''} onChange={(x) => set('scheduleAt', x)} />
              <TextField label="Time" value={v.timezone ? v.timezone : '18:00'} onChange={(x) => set('timezone', x)} placeholder="18:00" />
            </div>
          )}
        </Section>

        <Section title="More options">
          <Toggle label="Add to public portfolio" checked={v.addToPortfolio ?? true} onChange={(x) => set('addToPortfolio', x)} />
          <Toggle label="Feature in What’s New" checked={v.featureWhatsNew ?? true} onChange={(x) => set('featureWhatsNew', x)} />
          <Toggle label="Notify followers" checked={v.notifyFollowers ?? true} onChange={(x) => set('notifyFollowers', x)} />
          <Toggle label="Mark as mature / sensitive" checked={v.mature ?? false} onChange={(x) => set('mature', x)} />
        </Section>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={onContinue}>Continue to Preview</PrimaryButton>
      </div>
    </div>
  )
}

function fileTypeFor(t?: ContentType) {
  return t === 'Video' ? 'MP4' : t === 'Audio' ? 'MP3' : t === 'PDF' ? 'PDF' : 'JPG'
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6 first:mt-3"><h2 className="mb-3 font-serif text-[18px] text-ink">{title}</h2><div className="flex flex-col gap-3.5">{children}</div></section>
}
