import { useEffect, useState } from 'react'
import BackHeader from '../../components/BackHeader'
import Toggle from '../../components/form/Toggle'

const KEY = 'iica_notification_settings_v1'
const GROUPS: { title: string; items: { key: string; label: string; desc?: string }[] }[] = [
  { title: 'Activity', items: [
    { key: 'collab', label: 'Collaboration requests', desc: 'When someone wants to collaborate' },
    { key: 'meetings', label: 'Meeting updates', desc: 'Confirmations and reschedules' },
    { key: 'comments', label: 'Comments & likes', desc: 'Engagement on your content' },
  ] },
  { title: 'Commerce', items: [
    { key: 'orders', label: 'Order updates', desc: 'Purchases, delivery and access' },
    { key: 'payouts', label: 'Payout alerts', desc: 'When you get paid' },
  ] },
  { title: 'Discovery', items: [
    { key: 'events', label: 'Events & workshops' },
    { key: 'newsletter', label: 'IICA newsletter' },
  ] },
  { title: 'Channels', items: [
    { key: 'push', label: 'Push notifications' },
    { key: 'email', label: 'Email' },
  ] },
]
const DEFAULTS: Record<string, boolean> = { collab: true, meetings: true, comments: true, orders: true, payouts: true, events: true, newsletter: false, push: true, email: true }
function load(): Record<string, boolean> {
  try { const r = localStorage.getItem(KEY); if (r) return { ...DEFAULTS, ...JSON.parse(r) } } catch { /* */ }
  return DEFAULTS
}

export default function NotificationSettings() {
  const [v, setV] = useState<Record<string, boolean>>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* */ } }, [v])

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Notification Settings" fallback="/profile" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-4">
        {GROUPS.map((g) => (
          <section key={g.title} className="mt-5 first:mt-0">
            <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-muted">{g.title}</h2>
            <div className="flex flex-col gap-3.5 rounded-card border border-border bg-surface p-4">
              {g.items.map((it) => (
                <Toggle key={it.key} label={it.label} description={it.desc} checked={v[it.key] ?? true} onChange={(x) => setV((s) => ({ ...s, [it.key]: x }))} />
              ))}
            </div>
          </section>
        ))}
        <p className="mt-4 text-center text-[11.5px] text-muted">Preferences are saved automatically.</p>
      </div>
    </div>
  )
}
