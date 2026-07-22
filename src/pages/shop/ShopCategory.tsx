import { useParams } from 'react-router-dom'
import ProductBrowse from './ProductBrowse'

export default function ShopCategory() {
  const { category } = useParams()
  const type = category === 'Physical' || category === 'Digital' || category === 'Masterclass' ? category : 'Physical'
  return <ProductBrowse mode="category" fixedType={type} />
}
