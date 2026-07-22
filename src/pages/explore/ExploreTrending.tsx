import { useNavigate } from 'react-router-dom'
import BackHeader from '../../components/BackHeader'
import { trendingFeed } from '../../data/exploreData'

export default function ExploreTrending() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Trending Now" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[18px] py-4">
        <div className="grid grid-cols-2 gap-2.5">
          {trendingFeed.map((t, i) => (
            <button key={t.id} onClick={() => navigate(t.to)} className={`tap relative overflow-hidden rounded-card border border-border text-left ${i % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
              <img src={t.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80">{t.label}</span>
                <p className="font-serif text-[16px] leading-tight">{t.title}</p>
                <p className="text-[11px] text-white/75">{t.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
