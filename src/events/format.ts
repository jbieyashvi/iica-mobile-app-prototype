import { EventItem, TicketType } from './types'

export const fmtDate = (iso: string) => {
  if (!iso) return 'Date TBA'
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtDay = (iso: string) => {
  const d = new Date((iso || '') + 'T00:00:00')
  return isNaN(d.getTime()) ? { day: '--', month: '' } : {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
  }
}

export const fmtTime = (t: string) => {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 || 12
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export const startingPrice = (ev: EventItem): number => {
  if (!ev.paid || ev.tickets.length === 0) return 0
  return Math.min(...ev.tickets.map((t) => t.price))
}

export const remaining = (t: TicketType) => Math.max(0, t.quantity - t.sold)

export const eventCapacityLeft = (ev: EventItem) => {
  if (ev.paid) {
    const total = ev.tickets.reduce((s, t) => s + t.quantity, 0)
    const sold = ev.tickets.reduce((s, t) => s + t.sold, 0)
    return Math.max(0, total - sold)
  }
  return ev.capacity // registrations not tracked per-seat in prototype
}

export const isSoldOut = (ev: EventItem) =>
  ev.paid && ev.tickets.length > 0 && ev.tickets.every((t) => remaining(t) === 0)
