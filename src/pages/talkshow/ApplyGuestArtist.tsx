import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Copy, Upload, FileText, Trash2, AlertTriangle, Info, UserPlus,
} from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import TextArea from '../../components/form/TextArea'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'
import { membershipAccess } from '../../state/membershipAccess'
import { useTalkShow, RESUME_MAX_BYTES, ApplicantType } from '../../state/TalkShowContext'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

interface Picked { name: string; size: number; type: string; dataUrl: string }

export default function ApplyGuestArtist() {
  const navigate = useNavigate()
  const location = useLocation()
  const episodeId = (location.state as { episodeId?: string } | null)?.episodeId
  const { state } = useAuth()
  const { submitResume } = useTalkShow()

  const applicantType: ApplicantType = useMemo(() => {
    const a = membershipAccess(state)
    if (a.isGuest) return 'Guest'
    if (a.isActiveMember) return 'Creator Member'
    return 'Registered User'
  }, [state])

  const [file, setFile] = useState<Picked | null>(null)
  const [note, setNote] = useState('')
  const [fileError, setFileError] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ id: string; fileName: string; submittedAt: string; blobPersisted: boolean } | null>(null)
  const [toast, setToast] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  const onPick = (f?: File) => {
    setFileError('')
    if (!f) return
    const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name)
    if (!isPdf) {
      setFileError('Only PDF files are accepted. Please choose a .pdf résumé.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (f.size > RESUME_MAX_BYTES) {
      setFileError(`That file is too large (${formatSize(f.size)}). Maximum is 10 MB.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFile({ name: f.name, size: f.size, type: f.type || 'application/pdf', dataUrl: typeof reader.result === 'string' ? reader.result : '' })
    reader.onerror = () => setFileError('Could not read that file. Try another PDF.')
    reader.readAsDataURL(f)
  }

  const removeFile = () => { setFile(null); if (inputRef.current) inputRef.current.value = '' }

  const onSubmit = () => {
    setTouched(true)
    if (!file) { setFileError((e) => e || 'Attach your résumé (PDF) to continue.'); return }
    if (fileError) return
    setSubmitting(true)
    setTimeout(() => {
      const rec = submitResume({
        applicantType,
        userId: state.authed ? (state.iicaId || state.email || undefined) : undefined,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        dataUrl: file.dataUrl,
        note,
        episodeId,
      })
      setSubmitting(false)
      setDone({ id: rec.id, fileName: rec.fileName, submittedAt: rec.submittedAt, blobPersisted: rec.blobPersisted })
    }, 900)
  }

  const copyRef = async () => { if (!done) return; try { await navigator.clipboard.writeText(done.id) } catch { /* ignore */ } flash('Reference copied') }
  const dateLabel = (iso: string) => { const d = new Date(iso); return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }

  // ---- Confirmation ----
  if (done) {
    return (
      <div className="flex h-full flex-col bg-bg">
        <BackHeader title="Submitted" fallback="/talk-show" />
        <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-6" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></span>
            <h1 className="mt-5 font-serif text-[24px] leading-tight text-ink">Your résumé has been submitted to IICA for guest artist consideration</h1>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">Thanks for applying. IICA reviews guest artist résumés for upcoming Talk Show episodes.</p>
          </div>
          <div className="mt-6 rounded-card border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-[13px] text-muted">Application reference</span>
              <span className="flex items-center gap-2"><span className="font-mono text-[13px] font-semibold text-ink">{done.id}</span><button onClick={copyRef} className="tap flex items-center gap-1 text-[12px] font-semibold text-brand"><Copy className="h-3.5 w-3.5" /> Copy</button></span>
            </div>
            <div className="flex items-center justify-between border-b border-border px-4 py-3"><span className="text-[13px] text-muted">Résumé</span><span className="max-w-[60%] truncate text-[13px] font-semibold text-ink">{done.fileName}</span></div>
            <div className="flex items-center justify-between px-4 py-3"><span className="text-[13px] text-muted">Submitted</span><span className="text-[13px] font-semibold text-ink">{dateLabel(done.submittedAt)}</span></div>
          </div>
          <p className="mt-4 rounded-control bg-surface px-3.5 py-3 text-[12px] leading-relaxed text-muted ring-1 ring-border">
            Prototype only — your file is handled on this device{done.blobPersisted ? ' and kept for this demo' : ' (large files are referenced by name only)'}. Nothing is uploaded to a server.
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            <PrimaryButton full onClick={() => navigate('/home')}>Return to Home</PrimaryButton>
            <SecondaryButton full onClick={() => navigate('/talk-show')}>View Talk Show</SecondaryButton>
          </div>
        </div>
        {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
      </div>
    )
  }

  // ---- Form ----
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Apply as Guest Artist" fallback="/talk-show" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pt-3" style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
        <div className="mb-4 flex items-start gap-2 rounded-control border border-border bg-surface px-3.5 py-3">
          <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-[12.5px] leading-relaxed text-muted">Share your résumé to be considered as a guest on the IICA Talk Show. Anyone can apply — no membership, IICA ID or payment needed.</p>
        </div>

        {/* PDF upload */}
        <label htmlFor="resume-file" className="mb-1.5 block text-[13px] font-semibold text-ink">Résumé (PDF)</label>
        <input ref={inputRef} id="resume-file" type="file" accept="application/pdf,.pdf" onChange={(e) => onPick(e.target.files?.[0])} className="sr-only" />

        {!file ? (
          <button type="button" onClick={() => inputRef.current?.click()} className="tap flex min-h-[104px] w-full flex-col items-center justify-center gap-1.5 rounded-card border border-dashed border-border bg-surface text-muted hover:border-ink/25">
            <Upload className="h-6 w-6" strokeWidth={1.6} />
            <span className="text-[13px] font-semibold text-ink">Choose PDF résumé</span>
            <span className="text-[11.5px]">PDF only · up to 10 MB</span>
          </button>
        ) : (
          <div className="rounded-card border border-border bg-surface p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-brand-soft text-brand-dark"><FileText className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{file.name}</p>
                <p className="text-[11.5px] text-muted">PDF · {formatSize(file.size)}</p>
              </div>
              <button type="button" onClick={() => inputRef.current?.click()} className="tap rounded-control border border-border px-2.5 py-1 text-[12px] font-semibold text-ink hover:border-ink/25">Replace</button>
              <button type="button" aria-label="Remove file" onClick={removeFile} className="tap flex h-9 w-9 items-center justify-center rounded-control border border-border text-muted hover:text-error"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        )}
        {(fileError || (touched && !file)) && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-error"><AlertTriangle className="h-3.5 w-3.5" /> {fileError || 'Attach your résumé (PDF) to continue.'}</p>
        )}
        <p className="mt-1.5 text-[11.5px] text-muted">Stored locally in this prototype — not uploaded to a server.</p>

        <div className="mt-5">
          <TextArea label="Short note" value={note} onChange={setNote} maxLength={300} rows={3} placeholder="Optional — anything you'd like IICA to know" />
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted"><Info className="h-3.5 w-3.5 text-brand" /> Applying as <span className="font-semibold text-ink">{applicantType}</span>.</p>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 px-[18px] pt-3 backdrop-blur-md" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <PrimaryButton full onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Résumé'}
        </PrimaryButton>
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
