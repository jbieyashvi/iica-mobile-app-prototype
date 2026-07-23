import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Copy, MessageCircle, Instagram, Facebook, Twitter, Linkedin, MoreHorizontal, Share2 } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import { useContentStore } from '../../state/ContentContext'

const channels = [
  { label: 'WhatsApp', icon: MessageCircle, cls: 'text-[#25D366]' },
  { label: 'Instagram', icon: Instagram, cls: 'text-[#E4405F]' },
  { label: 'Facebook', icon: Facebook, cls: 'text-[#1877F2]' },
  { label: 'X', icon: Twitter, cls: 'text-ink' },
  { label: 'LinkedIn', icon: Linkedin, cls: 'text-[#0A66C2]' },
  { label: 'More', icon: MoreHorizontal, cls: 'text-muted' },
]

export default function ContentShare() {
  const { id } = useParams()
  const { getRecord, registerShare } = useContentStore()
  const item = getRecord(id)
  const [toast, setToast] = useState('')
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1500) }
  if (!item) return <BackHeader title="Share" />
  const url = `https://iica.app/content/${item.id}`

  const share = async (channel: string) => {
    registerShare(item.id)
    if (navigator.share) { try { await navigator.share({ title: item.title, url }); return } catch { /* cancelled */ } }
    flash(`Sharing to ${channel} (prototype)`)
  }
  const copy = async () => { try { await navigator.clipboard.writeText(url) } catch { /* */ } registerShare(item.id); flash('Link copied') }

  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Share" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4">
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
          <img src={item.thumbnail} alt="" className="h-14 w-14 shrink-0 rounded-[10px] object-cover" />
          <div className="min-w-0"><p className="truncate text-[14px] font-semibold text-ink">{item.title}</p><p className="truncate text-[12px] text-muted">{item.creator} · {item.type}</p></div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-brand"><Share2 className="h-4 w-4" /><p className="text-[13px] font-semibold">Share to</p></div>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {channels.map(({ label, icon: Icon, cls }) => (
            <button key={label} onClick={() => share(label)} className="tap flex flex-col items-center gap-1.5 rounded-card border border-border bg-surface py-3 hover:border-ink/20">
              <Icon className={`h-6 w-6 ${cls}`} strokeWidth={1.75} /><span className="text-[11px] font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={copy} className="tap mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink hover:border-ink/25"><Copy className="h-4 w-4" /> Copy link</button>
      </div>
      {toast && <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center"><span className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-subtle">{toast}</span></div>}
    </div>
  )
}
