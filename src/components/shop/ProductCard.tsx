import { useNavigate } from 'react-router-dom'
import { Star, Bookmark, BookmarkCheck, GraduationCap, Download, Package } from 'lucide-react'
import { Product } from '../../shop/types'
import { inr } from '../../shop/pricing'
import StatusBadge from '../StatusBadge'
import { useSaveGate } from '../SaveGate'

const typeIcon = { Masterclass: GraduationCap, Digital: Download, Physical: Package }

export default function ProductCard({ product, wide }: { product: Product; wide?: boolean }) {
  const navigate = useNavigate()
  const { save, isSaved } = useSaveGate()
  const key = 'product:' + product.id
  const saved = isSaved(key)
  const soldOut = product.type === 'Physical' && (product.stock ?? 0) <= 0
  const Icon = typeIcon[product.type]

  return (
    <div className={`group relative overflow-hidden rounded-card border border-border bg-surface ${wide ? 'w-full' : 'w-[168px] shrink-0'}`}>
      <button onClick={() => navigate(`/product/${product.id}`)} className="tap block w-full text-left">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-soft">
          <img src={product.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          {soldOut && <div className="absolute bottom-2 left-2"><StatusBadge tone="error">Sold Out</StatusBadge></div>}
        </div>
        <div className="p-2.5">
          <span className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-brand"><Icon className="h-3 w-3" /> {product.type}</span>
          <h3 className="mt-0.5 line-clamp-1 font-serif text-[15px] leading-snug text-ink">{product.title}</h3>
          <p className="line-clamp-1 text-[11.5px] text-muted">{product.sellerName}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11.5px] text-muted"><Star className="h-3 w-3 fill-brand text-brand" /> {product.rating || '—'} {product.reviews ? `(${product.reviews})` : ''}</span>
            {product.free ? <StatusBadge tone="success">Free</StatusBadge> : <span className="text-[13px] font-bold text-ink">{inr(product.price)}</span>}
          </div>
        </div>
      </button>
      <button aria-label={saved ? 'Unsave' : 'Save'} onClick={() => save(key)} className="tap absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/45 text-white backdrop-blur-sm">
        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>
    </div>
  )
}
