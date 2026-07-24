import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import MatchWheel from '../../components/collab/MatchWheel'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useCollab } from '../../state/CollabContext'

export default function Discover() {
  const navigate = useNavigate()
  const collab = useCollab()
  const [phase, setPhase] = useState<'matching' | 'done'>('matching')

  // Start matching immediately — no preference validation, no dead-end. If the
  // profile is thin, load demo defaults so broad recommendations still return.
  useEffect(() => {
    if (!collab.prefsComplete()) collab.applyDemoPrefs()
    collab.startMatching()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const found = collab.session.queue.length

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center justify-between px-2" style={{ paddingTop: 'var(--safe-top)' }}>
        <button onClick={() => navigate('/collaborate')} aria-label={phase === 'matching' ? 'Cancel matching' : 'Back'} className="tap flex h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-black/[0.04]"><ChevronLeft className="h-6 w-6" /></button>
        {phase === 'matching' && (
          <button onClick={() => navigate('/collaborate')} className="tap min-h-[44px] px-3 text-[13px] font-semibold text-muted hover:text-ink">Cancel</button>
        )}
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        {phase === 'matching' && <MatchWheel onDone={() => setPhase('done')} />}

        {phase === 'done' && (
          <>
            <div className="fade-in flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success"><CheckCircle2 className="h-9 w-9" strokeWidth={1.75} /></div>
            <h1 className="mt-5 font-serif text-[26px] leading-tight text-ink">{found} potential collaborators found</h1>
            <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">Swipe through your matches and shortlist the ones you'd like to work with.</p>
            <div className="mt-6 flex w-full max-w-[300px] flex-col gap-2.5">
              <PrimaryButton full onClick={() => navigate('/collaborate/recommendations')}>Continue to Recommendations</PrimaryButton>
              <SecondaryButton full onClick={() => navigate('/collaborate')}>Back to Collaborate</SecondaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
