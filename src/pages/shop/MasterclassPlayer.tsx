import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Play, Check, ChevronLeft, ChevronRight, FileDown, ListVideo } from 'lucide-react'
import { useShop } from '../../state/ShopContext'
import PrimaryButton from '../../components/PrimaryButton'

export default function MasterclassPlayer() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const { getProduct, progress, toggleLesson } = useShop()
  const p = getProduct(itemId)
  const lessons = p?.syllabus?.flatMap((s) => s.lessons) ?? []
  const [idx, setIdx] = useState(() => {
    const firstIncomplete = lessons.findIndex((l) => !progress[l.id])
    return firstIncomplete >= 0 ? firstIncomplete : 0
  })
  const [showList, setShowList] = useState(false)

  if (!p || lessons.length === 0) return (
    <div className="flex h-full items-center justify-center bg-ink text-white"><button onClick={() => navigate('/library')} className="tap rounded-control bg-white/10 px-4 py-2 text-[14px]">Close</button></div>
  )
  const lesson = lessons[idx]
  const done = !!progress[lesson.id]

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex shrink-0 items-center justify-between px-3" style={{ paddingTop: 'calc(var(--safe-top) + 6px)', height: 'calc(var(--safe-top) + 52px)' }}>
        <button onClick={() => navigate('/library')} aria-label="Close" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"><X className="h-5 w-5" /></button>
        <span className="truncate px-2 text-[12.5px] font-medium text-white/80">{p.title}</span>
        <button onClick={() => setShowList(true)} aria-label="Lessons" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"><ListVideo className="h-5 w-5" /></button>
      </div>

      {/* video placeholder */}
      <div className="relative aspect-video w-full bg-black">
        <img src={p.cover} alt="" className="h-full w-full object-cover opacity-60" />
        <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink"><Play className="ml-1 h-7 w-7 fill-ink" /></span></span>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">{lesson.duration}</span>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Lesson {idx + 1} of {lessons.length}</p>
        <h1 className="mt-1 font-serif text-[22px] leading-tight">{lesson.title}</h1>
        {lesson.resources.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[13px] font-semibold text-white/80">Resources</p>
            <div className="flex flex-col gap-2">{lesson.resources.map((r) => <button key={r} className="tap flex items-center gap-2 rounded-control border border-white/15 bg-white/5 px-3 py-2.5 text-left text-[13px] text-white"><FileDown className="h-4 w-4 text-white/70" /> {r}</button>)}</div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-white/10 px-[18px] pt-3" style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}>
        <button onClick={() => toggleLesson(lesson.id)} className={`tap mb-2.5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control text-[14px] font-semibold ${done ? 'bg-success text-white' : 'border border-white/20 text-white'}`}>{done ? <><Check className="h-4 w-4" /> Completed</> : 'Mark Complete'}</button>
        <div className="flex gap-2.5">
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="tap flex h-11 flex-1 items-center justify-center gap-1 rounded-control border border-white/20 text-[14px] font-semibold text-white disabled:opacity-30"><ChevronLeft className="h-5 w-5" /> Previous</button>
          <button onClick={() => setIdx((i) => Math.min(lessons.length - 1, i + 1))} disabled={idx === lessons.length - 1} className="tap flex h-11 flex-1 items-center justify-center gap-1 rounded-control bg-brand text-[14px] font-semibold text-white disabled:opacity-40">Next <ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>

      {showList && (
        <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setShowList(false)} className="absolute inset-0 bg-black/50" />
          <div className="fade-in relative max-h-[80%] w-full overflow-y-auto rounded-t-[20px] border-t border-border bg-surface p-5" style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}>
            <h3 className="mb-3 font-serif text-[20px] text-ink">Lessons</h3>
            {p.syllabus?.map((sec) => (
              <div key={sec.id} className="mb-3">
                <p className="mb-1 text-[12px] font-bold uppercase tracking-wide text-muted">{sec.title}</p>
                {sec.lessons.map((l) => {
                  const li = lessons.findIndex((x) => x.id === l.id)
                  return (
                    <button key={l.id} onClick={() => { setIdx(li); setShowList(false) }} className={`tap flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left ${li === idx ? 'bg-brand-soft' : ''}`}>
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${progress[l.id] ? 'bg-success text-white' : 'border border-border text-muted'}`}>{progress[l.id] ? <Check className="h-3 w-3" strokeWidth={3} /> : <Play className="h-3 w-3" />}</span>
                      <span className="flex-1 text-[13.5px] text-ink">{l.title}</span>
                      <span className="text-[11px] text-muted">{l.duration}</span>
                    </button>
                  )
                })}
              </div>
            ))}
            <div className="mt-2"><PrimaryButton full onClick={() => setShowList(false)}>Close</PrimaryButton></div>
          </div>
        </div>
      )}
    </div>
  )
}
