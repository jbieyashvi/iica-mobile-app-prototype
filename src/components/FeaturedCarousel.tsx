import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { featured } from '../data/featured'

export default function FeaturedCarousel() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="px-[18px]">
      <div className="relative overflow-hidden rounded-card border border-border">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {featured.map((slide) => (
            <button
              key={slide.id}
              onClick={() => navigate(slide.to)}
              className="relative aspect-[4/5] w-full shrink-0 text-left"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  {slide.category}
                </span>
                <h3 className="mt-1.5 font-serif text-[28px] leading-[1.05]">
                  {slide.title}
                </h3>
                <p className="mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-white/85">
                  {slide.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold">
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {featured.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-brand' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
