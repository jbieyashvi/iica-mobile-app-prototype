import { ShoppingBag } from 'lucide-react'
import TabPlaceholder from './TabPlaceholder'

export default function Shop() {
  return (
    <TabPlaceholder
      eyebrow="Marketplace"
      heading="Shop"
      icon={<ShoppingBag className="h-7 w-7" strokeWidth={1.6} />}
      title="The marketplace opens soon"
      description="Products, masterclasses and event tickets from creators will live here. This section will be built next."
    />
  )
}
