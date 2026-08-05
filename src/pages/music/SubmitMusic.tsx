import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, Youtube, Info } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import TextField from '../../components/form/TextField'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { useNewMusic } from '../../state/NewMusicContext'
import { parseYouTubeId } from '../../lib/youtube'

// Phase 1 correction: ONE visible required field — the YouTube link. Title,
// artist and genre are derived automatically (fallbacks used if unavailable).
// Signed-in submitter details are attached automatically; guests submit as
// "Guest". No creator-membership requirement.
export default function SubmitMusic() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { submit, isDuplicate } = useNewMusic()

  const signedIn = state.authed
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)
  const [ref, setRef] = useState('')
  const [toast, setToast] = useState('')

  const videoId = useMemo(() => parseYouTubeId(url), [url])
  const error = useMemo(() => {
    if (!url.trim()) return 'Required'
    if (!videoId) return 'Enter a valid YouTube link (youtube.com or youtu.be)'
    if (isDuplicate(videoId)) return 'This video has already been submitted.'
    return ''
  }, [url, videoId, isDuplicate])

  const onSubmit = () => {
    setTouched(true)
    if (error) return
    const rec = submit({
      url,
      // Metadata is derived by the data layer; nothing is asked of the user.
      submittedByName: signedIn ? (state.name || 'IICA Member') : 'Guest',
      submittedByUserId: signedIn ? (state.iicaId || state.email || undefined) : undefined,
    })
    setRef(rec.id)
  }

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const copyRef = async () => { try { await navigator.clipboard.writeText(ref) } catch { /* ignore */ } flash('Reference copied') }
  const reset = () => { setUrl(''); setTouched(false); setRef('') }

  // ---- Confirmation ----
  if (ref) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Submitted" fallback="/music" />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-6" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></span>
            <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">Your music link has been submitted to IICA</h1>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">Thanks for sharing. Submitting a link doesn’t guarantee a place on the Home page — IICA selects featured music.</p>
          </div>
          <div className="mt-6 rounded-card border border-border bg-surface">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-muted">Submission reference</span>
              <span className="flex items-center gap-2"><span className="font-mono text-[13px] font-semibold text-ink">{ref}</span><button onClick={copyRef} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button></span>
            </div>
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

  // ---- Form (single field) ----
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Submit New Music" fallback="/music" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        <div className="mb-4 flex items-start gap-2 rounded-control border border-border bg-surface px-3.5 py-3">
          <Youtube className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-[12.5px] leading-relaxed text-muted">Paste a YouTube link — that’s all we need. IICA fills in the details and selects featured music. Anyone can submit; no membership required.</p>
        </div>

        <TextField
          label="YouTube link"
          value={url}
          onChange={setUrl}
          placeholder="https://youtube.com/watch?v=… or youtu.be/…"
          error={touched ? error : ''}
        />

        {/* Live derived preview (thumbnail) once a valid id is detected. */}
        {videoId && !error && (
          <div className="mt-3 flex items-center gap-3 rounded-card border border-border bg-surface p-2.5">
            <img src={`https://img.youtube.com/vi/${videoId}/default.jpg`} alt="" className="h-12 w-[68px] shrink-0 rounded-[8px] object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
            <p className="text-[12.5px] text-muted">Link detected. IICA will add the title and details.</p>
          </div>
        )}

        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted"><Info className="h-3.5 w-3.5 text-brand" /> Submitting as <span className="font-semibold text-ink">{signedIn ? (state.name || 'your account') : 'Guest'}</span>.</p>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={onSubmit}>Submit to IICA</PrimaryButton>
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
