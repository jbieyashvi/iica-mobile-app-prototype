import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Check, X, UserCheck } from 'lucide-react'
import { useEvents } from '../../../state/EventsContext'
import BackHeader from '../../../components/BackHeader'
import StatusBadge from '../../../components/StatusBadge'

type Filter = 'All' | 'Confirmed' | 'Pending Approval' | 'Waitlisted' | 'Checked In' | 'Cancelled'

export default function CreatorAttendees() {
  const { id } = useParams()
  const { getEvent, attendeesFor, setAttendee } = useEvents()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('All')
  const [toast, setToast] = useState('')

  const ev = getEvent(id)
  const all = attendeesFor(id ?? '')

  const list = useMemo(() => {
    let r = all
    const query = q.trim().toLowerCase()
    if (query) r = r.filter((a) => (a.name + a.email).toLowerCase().includes(query))
    if (filter === 'Checked In') r = r.filter((a) => a.checkedIn)
    else if (filter !== 'All') r = r.filter((a) => a.approval === filter)
    return r
  }, [all, q, filter])

  if (!ev) return <BackHeader title="Attendees" />
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600) }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Attendees" />
      <div className="shrink-0 px-[18px] pb-2 pt-2">
        <div className="flex h-10 items-center gap-2 rounded-control border border-border bg-surface px-3">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search attendees…" className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none" />
        </div>
        <div className="no-scrollbar -mx-[18px] mt-2 flex gap-1.5 overflow-x-auto px-[18px]">
          {(['All', 'Confirmed', 'Pending Approval', 'Waitlisted', 'Checked In', 'Cancelled'] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`tap shrink-0 rounded-control border px-3 py-1.5 text-[12px] font-semibold ${filter === f ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6">
        <p className="mb-3 text-[13px] font-semibold text-muted">{list.length} attendee{list.length === 1 ? '' : 's'}</p>
        {list.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center text-[13px] text-muted">No attendees match.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((a) => (
              <div key={a.id} className="rounded-card border border-border bg-surface p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{a.name}</p>
                    <p className="truncate text-[12px] text-muted">{a.email}</p>
                    <p className="mt-1 text-[11.5px] text-muted">{a.ticketType} · {a.qty} · {a.regDate}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge tone={a.approval === 'Confirmed' ? 'success' : a.approval === 'Cancelled' ? 'error' : 'warning'}>{a.approval}</StatusBadge>
                    {a.checkedIn && <StatusBadge tone="brand">Checked In</StatusBadge>}
                    <span className="text-[11px] text-muted">{a.paymentStatus}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.approval === 'Pending Approval' || a.approval === 'Waitlisted' ? (
                    <>
                      <button onClick={() => { setAttendee(a.id, { approval: 'Confirmed' }); flash('Attendee approved') }} className="tap flex min-h-[36px] items-center gap-1 rounded-control border border-success/40 bg-[#EAF3EE] px-3 text-[12px] font-semibold text-success"><Check className="h-3.5 w-3.5" /> Approve</button>
                      <button onClick={() => { setAttendee(a.id, { approval: 'Cancelled' }); flash('Attendee rejected') }} className="tap flex min-h-[36px] items-center gap-1 rounded-control border border-error/40 bg-[#F7E9EA] px-3 text-[12px] font-semibold text-error"><X className="h-3.5 w-3.5" /> Reject</button>
                    </>
                  ) : a.approval === 'Confirmed' && !a.checkedIn ? (
                    <button onClick={() => { setAttendee(a.id, { checkedIn: true }); flash('Checked in') }} className="tap flex min-h-[36px] items-center gap-1 rounded-control border border-border bg-bg px-3 text-[12px] font-semibold text-ink"><UserCheck className="h-3.5 w-3.5" /> Mark Checked In</button>
                  ) : null}
                  <button onClick={() => flash('Ticket resent (prototype)')} className="tap min-h-[36px] rounded-control border border-border bg-bg px-3 text-[12px] font-semibold text-ink">Resend Ticket</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
