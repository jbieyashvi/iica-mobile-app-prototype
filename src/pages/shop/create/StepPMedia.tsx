import { useNavigate } from 'react-router-dom'
import ProductBuilderShell from '../../../components/shop/ProductBuilderShell'
import ImageUpload from '../../../components/form/ImageUpload'
import TextField from '../../../components/form/TextField'
import { useShop } from '../../../state/ShopContext'

export default function StepPMedia() {
  const navigate = useNavigate()
  const { draft, saveDraft } = useShop()
  const images = draft.images ?? []
  const setImage = (i: number, url: string) => {
    const next = [...images]
    if (url) next[i] = url; else next.splice(i, 1)
    saveDraft({ images: next, cover: draft.cover || next[0] })
  }

  return (
    <ProductBuilderShell step={4} canContinue={!!(draft.cover || images[0])} onContinue={() => navigate('/creator/products/create/preview')}>
      <h2 className="mb-1 font-serif text-[22px] text-ink">Media</h2>
      <p className="mb-5 text-[12.5px] text-muted">Add up to 10 images and a promo video. First image is the cover.</p>
      <div className="flex flex-col gap-5">
        <div>
          <ImageUpload label="Cover image" value={draft.cover ?? images[0] ?? ''} onChange={(v) => saveDraft({ cover: v, images: v && !images.length ? [v] : images })} aspect="aspect-[4/3]" />
          <p className="mt-1 text-[11.5px] text-muted">Recommended 1200×900, under 5MB.</p>
        </div>
        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">More images <span className="font-normal text-muted">Optional</span></p>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => <ImageUpload key={i} label={`Image ${i + 2}`} value={images[i + (draft.cover ? 0 : 1)] ?? ''} onChange={(v) => setImage(i + 1, v)} aspect="aspect-square" optional />)}
          </div>
        </div>
        <TextField label="Promo video link" optional value={draft.video ?? ''} onChange={(v) => saveDraft({ video: v })} placeholder="YouTube / Vimeo URL" />
      </div>
    </ProductBuilderShell>
  )
}
