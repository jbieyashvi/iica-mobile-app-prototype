import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, Youtube, Info } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import SelectField from '../../components/form/SelectField'
import TextArea from '../../components/form/TextArea'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { useNewMusic, MUSIC_GENRES } from '../../state/NewMusicContext'
import { parseYouTubeId } from '../../lib/youtube'

interface Form { url: string; title: string; artist: string; genre: string; note: string; displayName: string }

export default function SubmitMusic() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { submit, isDuplicate } = useNewMusic()

  const signedIn = state.authed
  const [form, setForm] = useState<Form>({
    url: '', title: '', artist: '', genre: '', note: '',
    displayName: state.name || '',
  })
  const [touched, setTouched] = useState(false)
  const [ref, setRef] = useState('') // reference id after success
  const [toast, setToast] = useState('')

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  const videoId = useMemo(() => parseYouTubeId(form.url), [form.url])
  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (!form.url.trim()) e.url = 'Required'
    else if (!videoId) e.url = 'Enter a valid YouTube link (youtube.com or youtu.be)'
    else if (isDuplicate(videoId)) e.url = 'This video has already been submitted.'
    if (!form.title.trim()) e.title = 'Required'
    if (!form.artist.trim()) e.artist = 'Required'
    if (!form.genre) e.genre = 'Select a genre'
    if (!signedIn && !form.displayName.trim()) e.displayName = 'Enter a display name'
    return e
  }, [form, videoId, isDuplicate, signedIn])

  const valid = Object.keys(errors).length === 0

  const onSubmit = () => {
    setTouched(true)
    if (!valid) return
    const rec = submit({
      url: form.url,
      title: form.title,
      artist: form.artist,
      genre: form.genre,
      note: form.note,
      submittedByName: signedIn ? (state.name || 'IICA Member') : form.displayName,
      submittedByUserId: signedIn ? (state.iicaId || state.email || undefined) : undefined,
    })
    setRef(rec.id)
  }

  const reset = () => {
    setForm({ url: '', title: '', artist: '', genre: '', note: '', displayName: state.name || '' })
    setTouched(false)
    setRef('')
  }
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const copyRef = async () => { try { await navigator.clipboard.writeText(ref) } catch { /* ignore */ } flash('Reference copied') }

  // ---- Confirmation ----
  if (ref) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Submitted" fallback="/music" />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-6" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></span>
            <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Your link has been submitted to IICA</h1>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">Thanks for sharing. Submitting a link doesn’t guarantee a place on the Home page — IICA selects featured music.</p>
          </div>
          <div className="mt-6 rounded-card border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-[13px] text-muted">Submission reference</span>
              <span className="flex items-center gap-2"><span className="font-mono text-[13px] font-semibold text-ink">{ref}</span><button onClick={copyRef} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button></span>
            </div>
            <div className="flex items-center justify-between px-4 py-3"><span className="text-[13px] text-muted">Title</span><span className="max-w-[60%] truncate text-[13px] font-semibold text-ink">{form.title}</span></div>
          </div>
          <p className="mt-4 rounded-control bg-surface px-3.5 py-3 text-[12px] leading-relaxed text-muted ring-1 ring-border">Prototype only — no external submission is sent and no personal data leaves this device.</p>
          <div className="mt-5 flex flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/home')}>Return to Home</PrimaryButton>
            <SecondaryButton full onClick={reset}>Submit Another</SecondaryButton>
          </div>
        </div>
        {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
      </div>
    )
  }

  // ---- Form ----
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Submit New Music" fallback="/music" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        <div className="mb-4 flex items-start gap-2 rounded-control border border-border bg-surface px-3.5 py-3">
          <Youtube className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-[12.5px] leading-relaxed text-muted">Share a YouTube link to music you love. Anyone can submit — no membership needed. IICA reviews and selects featured tracks.</p>
        </div>

        <div className="flex flex-col gap-4">
          <TextField label="YouTube URL" value={form.url} onChange={(v) => set('url', v)} placeholder="https://youtube.com/watch?v=… or youtu.be/…" error={touched ? errors.url : ''} />
          <TextField label="Music / video title" value={form.title} onChange={(v) => set('title', v)} placeholder="e.g. Twilight Raga" error={touched ? errors.title : ''} />
          <TextField label="Artist / creator name" value={form.artist} onChange={(v) => set('artist', v)} placeholder="e.g. Kabir Menon" error={touched ? errors.artist : ''} />
          <SelectField label="Genre" value={form.genre} onChange={(v) => set('genre', v)} options={MUSIC_GENRES} placeholder="Select a genre" error={touched ? errors.genre : ''} />
          {!signedIn && (
            <TextField label="Your display name" value={form.displayName} onChange={(v) => set('displayName', v)} placeholder="Shown as the submitter" error={touched ? errors.displayName : ''} />
          )}
          {signedIn && (
            <p className="flex items-center gap-1.5 text-[12px] text-muted"><Info className="h-3.5 w-3.5 text-brand" /> Submitting as <span className="font-semibold text-ink">{state.name || 'your account'}</span>.</p>
          )}
          <TextArea label="Short note" value={form.note} onChange={(v) => set('note', v)} maxLength={200} rows={3} placeholder="Optional — why you're sharing this" />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={onSubmit}>Submit to IICA</PrimaryButton>
      </div>
    </div>
  )
}
