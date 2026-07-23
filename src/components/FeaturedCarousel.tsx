import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { featured } from '../data/featured'

export default function FeaturedCarousel() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="px-[18px]">
      <div className="relative overflow-hidden rounded-[12px] border border-border">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {featured.map((slide) => (
            <button
              key={slide.id}
              onClick={() => navigate(slide.to)}
              className="relative aspect-[2/1] w-full shrink-0 text-left"
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{ objectPosition: slide.focus ?? 'center' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Dark overlay only behind the lower-left text block. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  {slide.category}
                </span>
                <h3 className="mt-1 font-serif text-[25px] leading-[1.04]">
                  {slide.title}
                </h3>
                <p className="mt-1 line-clamp-2 max-w-[260px] text-[12.5px] leading-snug text-white/85">
                  {slide.subtitle}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold">
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-1.5">
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
