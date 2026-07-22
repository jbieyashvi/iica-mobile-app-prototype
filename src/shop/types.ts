// ---- IICA Shop / e-commerce types ----

export type ProductType = 'Masterclass' | 'Physical' | 'Digital'
export type ProductStatus = 'published' | 'draft' | 'archived' | 'out-of-stock' | 'pending'
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
export type Licence = 'Personal Use' | 'Commercial Use' | 'Custom Licence'

export interface Lesson {
  id: string
  title: string
  duration: string
  freePreview: boolean
  resources: string[]
}
export interface Section {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}
export interface Variant {
  id: string
  name: string // e.g. "Size: M" / "Colour: Indigo"
  price: number
  stock: number
}

export interface Product {
  id: string
  type: ProductType
  title: string
  summary: string
  description: string
  category: string
  subcategory: string
  tags: string[]
  language: string
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  price: number
  currency: string
  compareAt?: number
  discount?: number
  free: boolean
  rating: number
  reviews: number
  images: string[]
  cover: string
  video?: string
  status: ProductStatus
  createdAt: string
  // masterclass
  instructor?: string
  level?: SkillLevel
  duration?: string
  outcomes?: string[]
  requirements?: string
  audience?: string
  certificate?: boolean
  accessDuration?: string
  syllabus?: Section[]
  // digital
  digitalType?: string
  customType?: string
  fileFormat?: string
  fileSize?: string
  version?: string
  licence?: Licence
  downloadLimit?: string
  usage?: string
  sampleUrl?: string
  // physical
  sku?: string
  materials?: string
  dimensions?: string
  weight?: string
  origin?: string
  stock?: number
  lowStock?: number
  variants?: Variant[]
  shippingRegions?: string
  processing?: string
  deliveryEstimate?: string
  shippingType?: 'Free' | 'Flat Rate'
  shippingCost?: number
  returnEligible?: boolean
  returnWindow?: string
  care?: string
  // meta
  sales?: number
  createdByMe?: boolean
}

export interface CartItem {
  productId: string
  qty: number
  variantId?: string
  savedForLater?: boolean
}

export type OrderStatus =
  | 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered'
  | 'Available' | 'Cancelled' | 'Refunded'

export interface OrderItem {
  productId: string
  title: string
  cover: string
  type: ProductType
  sellerId: string
  sellerName: string
  qty: number
  price: number
  variantName?: string
}
export interface Address {
  name: string
  phone: string
  line: string
  city: string
  state: string
  country: string
  postal: string
  instructions: string
}
export interface Order {
  id: string
  orderId: string
  buyerName: string
  buyerEmail: string
  items: OrderItem[]
  amount: number
  status: OrderStatus
  createdAt: string
  address?: Address
  courier?: string
  tracking?: string
  hasDigital: boolean
  hasPhysical: boolean
}

export type RefundStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Refunded'
export interface RefundReq {
  id: string
  orderId: string
  productId: string
  requestType: string
  reason: string
  description: string
  resolution: string
  status: RefundStatus
}

export type PayoutStatus = 'Scheduled' | 'Processing' | 'Paid' | 'Failed'
export interface Payout {
  id: string
  amount: number
  date: string
  status: PayoutStatus
  orders: number
}

export interface LessonProgress { [lessonId: string]: boolean }

export const COMMISSION_RATE = 0.15 // IICA commission (mock config)
export const PLATFORM_FEE_RATE = 0.03
export const PROMO_CODE = 'IICA10'
export const PROMO_RATE = 0.1

export const PRODUCT_CATEGORIES = ['Music', 'Dance', 'Visual Arts', 'Photography', 'Craft', 'Literature', 'Education', 'Other']
export const DIGITAL_TYPES = ['PDF', 'Audio', 'Preset', 'Template', 'E-book', 'Design Asset', 'Other']
