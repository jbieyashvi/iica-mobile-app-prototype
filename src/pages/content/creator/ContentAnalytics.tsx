import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Users, Heart, MessageCircle, Bookmark, Share2, Download, Activity } from 'lucide-react'
import BackHeader from '../../../components/BackHeader'
import { useContentStore } from '../../../state/ContentContext'
import { demoAnalytics } from '../../../content/mockContent'

const RANGES = ['7 days', '30 days', 'All time']

export default function ContentAnalytics() {
  const navigate = useNavigate()
  const { myContent } = useContentStore()
  const [range, setRange] = useState('30 days')
  const mine = myContent()

  const totals = useMemo(() => ({
    views: mine.reduce((s, r) => s + r.views, 0) || demoAnalytics.views,
    likes: mine.reduce((s, r) => s + r.likes, 0) || demoAnalytics.likes,
    comments: mine.reduce((s, r) => s + r.comments, 0) || demoAnalytics.comments,
    saves: mine.reduce((s, r) => s + r.saves, 0) || demoAnalytics.saves,
    shares: mine.reduce((s, r) => s + r.shares, 0) || demoAnalytics.shares,
    downloads: mine.reduce((s, r) => s + r.downloads, 0) || demoAnalytics.downloads,
  }), [mine])
  const top = useMemo(() => [...mine].sort((a, b) => b.views - a.views).slice(0, 3), [mine])

  const stats = [
    { label: 'Views', value: totals.views, icon: Eye },
    { label: 'Unique', value: demoAnalytics.uniqueViewers, icon: Users },
    { label: 'Likes', value: totals.likes, icon: Heart },
    { label: 'Comments', value: totals.comments, icon: MessageCircle },
    { label: 'Saves', value: totals.saves, icon: Bookmark },
    { label: 'Shares', value: totals.shares, icon: Share2 },
    { label: 'Downloads', value: totals.downloads, icon: Download },
    { label: 'Avg. progress', value: `${demoAnalytics.avgProgress}%`, icon: Activity },
  ]
  const max = Math.max(...demoAnalytics.overTime)

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Content Analytics" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] pb-6 pt-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {RANGES.map((r) => <button key={r} onClick={() => setRange(r)} className={`tap shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold ${range === r ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-muted'}`}>{r}</button>)}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-card border border-border bg-surface px-1.5 py-2.5 text-center">
              <Icon className="mx-auto h-4 w-4 text-brand" />
              <p className="mt-1 font-serif text-[15px] leading-none text-ink">{typeof value === 'number' ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value) : value}</p>
              <p className="mt-0.5 text-[9.5px] text-muted">{label}</p>
            </div>
          ))}
        </div>

        <Card title="Performance over time">
          <div className="flex h-24 items-end gap-1.5">
            {demoAnalytics.overTime.map((n, i) => <div key={i} className="flex-1 rounded-t bg-brand/80" style={{ height: `${(n / max) * 100}%` }} />)}
          </div>
        </Card>

        <Card title="Top-performing content">
          <div className="flex flex-col gap-2.5">
            {top.map((r) => (
              <button key={r.id} onClick={() => navigate(`/creator/content/${r.id}`)} className="tap flex items-center gap-2.5 text-left">
                <img src={r.thumbnail} alt="" className="h-10 w-14 shrink-0 rounded-[7px] object-cover" />
                <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-ink">{r.title}</span><span className="text-[11.5px] text-muted">{r.views.toLocaleString('en-IN')} views</span></span>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card title="Traffic sources"><Bars data={demoAnalytics.sources} /></Card>
          <Card title="Audience location"><Bars data={demoAnalytics.locations} /></Card>
          <Card title="By content type"><Bars data={demoAnalytics.byType} /></Card>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-4 rounded-card border border-border bg-surface p-4"><h3 className="mb-3 text-[13px] font-semibold text-ink">{title}</h3>{children}</div>
}
function Bars({ data }: { data: { label: string; pct: number }[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-[12px]"><span className="text-ink">{d.label}</span><span className="text-muted">{d.pct}%</span></div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-brand" style={{ width: `${d.pct}%` }} /></div>
        </div>
      ))}
    </div>
  )
}
