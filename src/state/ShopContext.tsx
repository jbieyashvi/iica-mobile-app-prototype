import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Address, CartItem, LessonProgress, Order, OrderItem, OrderStatus, Payout, Product, RefundReq, RefundStatus } from '../shop/types'
import { seedOrders, seedPayouts, seedProducts, seedRefunds } from '../shop/mockShop'
import { unitPrice } from '../shop/pricing'

const PKEY = 'iica_shop_products_v1'
const CKEY = 'iica_shop_cart_v1'
const OKEY = 'iica_shop_orders_v1'
const RKEY = 'iica_shop_refunds_v1'
const LKEY = 'iica_shop_progress_v1'
const DKEY = 'iica_shop_draft_v1'
const RVKEY = 'iica_shop_recent_v1'

function load<T>(k: string, fb: T): T {
  try { const r = localStorage.getItem(k); if (r) return JSON.parse(r) as T } catch { /* */ }
  return fb
}
const rid = (p: string) => p + Math.random().toString(36).slice(2, 9)

interface Ctx {
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  refunds: RefundReq[]
  progress: LessonProgress
  draft: Partial<Product>
  recent: string[]
  getProduct: (id?: string) => Product | undefined
  cartCount: number
  addToCart: (productId: string, qty?: number, variantId?: string) => void
  removeFromCart: (productId: string, variantId?: string) => void
  setQty: (productId: string, qty: number, variantId?: string) => void
  toggleSaveForLater: (productId: string, variantId?: string) => void
  clearPurchased: (ids: string[]) => void
  markViewed: (id: string) => void
  placeOrder: (buyer: { name: string; email: string }, amount: number, address?: Address) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus, patch?: Partial<Order>) => void
  requestRefund: (r: Omit<RefundReq, 'id' | 'status'>) => void
  setRefundStatus: (id: string, status: RefundStatus) => void
  toggleLesson: (lessonId: string) => void
  saveDraft: (p: Partial<Product>) => void
  resetDraft: () => void
  loadDraft: (p: Product) => void
  publishDraft: (seller: { id: string; name: string; avatar?: string }, status: 'published' | 'pending') => Product
  archiveProduct: (id: string) => void
  deleteDraft: (id: string) => void
  duplicateProduct: (id: string) => void
  payouts: Payout[]
}

const ShopContext = createContext<Ctx | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load(PKEY, seedProducts))
  const [cart, setCart] = useState<CartItem[]>(() => load(CKEY, []))
  const [orders, setOrders] = useState<Order[]>(() => load(OKEY, seedOrders))
  const [refunds, setRefunds] = useState<RefundReq[]>(() => load(RKEY, seedRefunds))
  const [progress, setProgress] = useState<LessonProgress>(() => load(LKEY, {}))
  const [draft, setDraft] = useState<Partial<Product>>(() => load(DKEY, {}))
  const [recent, setRecent] = useState<string[]>(() => load(RVKEY, []))

  useEffect(() => { try { localStorage.setItem(PKEY, JSON.stringify(products)) } catch { /* */ } }, [products])
  useEffect(() => { try { localStorage.setItem(CKEY, JSON.stringify(cart)) } catch { /* */ } }, [cart])
  useEffect(() => { try { localStorage.setItem(OKEY, JSON.stringify(orders)) } catch { /* */ } }, [orders])
  useEffect(() => { try { localStorage.setItem(RKEY, JSON.stringify(refunds)) } catch { /* */ } }, [refunds])
  useEffect(() => { try { localStorage.setItem(LKEY, JSON.stringify(progress)) } catch { /* */ } }, [progress])
  useEffect(() => { try { localStorage.setItem(DKEY, JSON.stringify(draft)) } catch { /* */ } }, [draft])
  useEffect(() => { try { localStorage.setItem(RVKEY, JSON.stringify(recent)) } catch { /* */ } }, [recent])

  const getProduct = useCallback((id?: string) => products.find((p) => p.id === id), [products])

  const sameLine = (i: CartItem, productId: string, variantId?: string) => i.productId === productId && (i.variantId ?? '') === (variantId ?? '')

  const addToCart = useCallback((productId: string, qty = 1, variantId?: string) => {
    const p = products.find((x) => x.id === productId)
    const single = p && p.type !== 'Physical'
    setCart((c) => {
      const found = c.find((i) => sameLine(i, productId, variantId))
      if (found) return c.map((i) => sameLine(i, productId, variantId) ? { ...i, qty: single ? 1 : i.qty + qty, savedForLater: false } : i)
      return [...c, { productId, qty: single ? 1 : qty, variantId, savedForLater: false }]
    })
  }, [products])

  const removeFromCart = useCallback((productId: string, variantId?: string) =>
    setCart((c) => c.filter((i) => !sameLine(i, productId, variantId))), [])
  const setQty = useCallback((productId: string, qty: number, variantId?: string) =>
    setCart((c) => c.map((i) => sameLine(i, productId, variantId) ? { ...i, qty: Math.max(1, qty) } : i)), [])
  const toggleSaveForLater = useCallback((productId: string, variantId?: string) =>
    setCart((c) => c.map((i) => sameLine(i, productId, variantId) ? { ...i, savedForLater: !i.savedForLater } : i)), [])
  const clearPurchased = useCallback((ids: string[]) =>
    setCart((c) => c.filter((i) => !ids.includes(i.productId) || i.savedForLater)), [])

  const markViewed = useCallback((id: string) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8)), [])

  const cartCount = useMemo(() => cart.filter((i) => !i.savedForLater).reduce((s, i) => s + i.qty, 0), [cart])

  const placeOrder = useCallback((buyer: { name: string; email: string }, amount: number, address?: Address): Order => {
    const active = cart.filter((i) => !i.savedForLater)
    const items: OrderItem[] = active.map((i) => {
      const p = products.find((x) => x.id === i.productId)!
      const v = p.variants?.find((x) => x.id === i.variantId)
      return { productId: p.id, title: p.title, cover: p.cover, type: p.type, sellerId: p.sellerId, sellerName: p.sellerName, qty: i.qty, price: unitPrice(p, i.variantId), variantName: v?.name }
    })
    const hasPhysical = items.some((i) => i.type === 'Physical')
    const hasDigital = items.some((i) => i.type !== 'Physical')
    const order: Order = {
      id: rid('ord-'), orderId: 'IICA-SHOP-' + Math.floor(1000 + (Date.now() % 8999)),
      buyerName: buyer.name, buyerEmail: buyer.email, items, amount,
      status: hasPhysical ? 'Confirmed' : 'Available', createdAt: new Date().toISOString().slice(0, 10),
      address, hasDigital, hasPhysical,
    }
    setOrders((o) => [order, ...o])
    setProducts((list) => list.map((p) => {
      const it = items.find((x) => x.productId === p.id)
      return it ? { ...p, sales: (p.sales ?? 0) + it.qty, stock: p.stock != null ? Math.max(0, p.stock - it.qty) : p.stock } : p
    }))
    return order
  }, [cart, products])

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, patch?: Partial<Order>) =>
    setOrders((o) => o.map((x) => x.id === orderId ? { ...x, status, ...patch } : x)), [])

  const requestRefund = useCallback((r: Omit<RefundReq, 'id' | 'status'>) =>
    setRefunds((list) => [{ ...r, id: rid('rf-'), status: 'Submitted' }, ...list]), [])
  const setRefundStatus = useCallback((id: string, status: RefundStatus) => {
    setRefunds((list) => list.map((r) => r.id === id ? { ...r, status } : r))
    if (status === 'Refunded') setRefunds((list) => { const rf = list.find((x) => x.id === id); if (rf) setOrders((o) => o.map((ord) => ord.id === rf.orderId ? { ...ord, status: 'Refunded' } : ord)); return list })
  }, [])

  const toggleLesson = useCallback((lessonId: string) => setProgress((p) => ({ ...p, [lessonId]: !p[lessonId] })), [])

  const saveDraft = useCallback((p: Partial<Product>) => setDraft((d) => ({ ...d, ...p })), [])
  const resetDraft = useCallback(() => setDraft({}), [])
  const loadDraft = useCallback((p: Product) => setDraft({ ...p }), [])

  const publishDraft = useCallback((seller: { id: string; name: string; avatar?: string }, status: 'published' | 'pending'): Product => {
    const id = draft.id ?? rid('prod-')
    const p: Product = {
      id, type: draft.type ?? 'Digital', title: draft.title ?? 'Untitled', summary: draft.summary ?? '', description: draft.description ?? '',
      category: draft.category ?? 'Other', subcategory: draft.subcategory ?? '', tags: draft.tags ?? [], language: draft.language ?? '',
      sellerId: seller.id, sellerName: seller.name, sellerAvatar: seller.avatar,
      price: draft.free ? 0 : (draft.price ?? 0), currency: 'INR', compareAt: draft.compareAt, discount: draft.discount, free: draft.free ?? false,
      rating: 0, reviews: 0, images: draft.images ?? [], cover: draft.cover ?? (draft.images?.[0] ?? ''), video: draft.video,
      status, createdAt: new Date().toISOString().slice(0, 10), createdByMe: true, sales: 0,
      instructor: draft.instructor, level: draft.level, duration: draft.duration, outcomes: draft.outcomes, requirements: draft.requirements,
      audience: draft.audience, certificate: draft.certificate, accessDuration: draft.accessDuration, syllabus: draft.syllabus,
      digitalType: draft.digitalType, customType: draft.customType, fileFormat: draft.fileFormat, fileSize: draft.fileSize, version: draft.version,
      licence: draft.licence, downloadLimit: draft.downloadLimit, usage: draft.usage, sampleUrl: draft.sampleUrl,
      sku: draft.sku, materials: draft.materials, dimensions: draft.dimensions, weight: draft.weight, origin: draft.origin,
      stock: draft.stock, lowStock: draft.lowStock, variants: draft.variants, shippingRegions: draft.shippingRegions, processing: draft.processing,
      deliveryEstimate: draft.deliveryEstimate, shippingType: draft.shippingType, shippingCost: draft.shippingCost,
      returnEligible: draft.returnEligible, returnWindow: draft.returnWindow, care: draft.care,
    }
    setProducts((list) => list.some((x) => x.id === id) ? list.map((x) => x.id === id ? p : x) : [p, ...list])
    setDraft({})
    return p
  }, [draft])

  const archiveProduct = useCallback((id: string) => setProducts((l) => l.map((p) => p.id === id ? { ...p, status: 'archived' } : p)), [])
  const deleteDraft = useCallback((id: string) => setProducts((l) => l.filter((p) => !(p.id === id && p.status === 'draft'))), [])
  const duplicateProduct = useCallback((id: string) => setProducts((l) => {
    const p = l.find((x) => x.id === id); if (!p) return l
    return [{ ...p, id: rid('prod-'), title: p.title + ' (Copy)', status: 'draft', sales: 0, reviews: 0, rating: 0, createdByMe: true }, ...l]
  }), [])

  const value = useMemo<Ctx>(() => ({
    products, cart, orders, refunds, progress, draft, recent, getProduct, cartCount,
    addToCart, removeFromCart, setQty, toggleSaveForLater, clearPurchased, markViewed,
    placeOrder, updateOrderStatus, requestRefund, setRefundStatus, toggleLesson,
    saveDraft, resetDraft, loadDraft, publishDraft, archiveProduct, deleteDraft, duplicateProduct, payouts: seedPayouts,
  }), [products, cart, orders, refunds, progress, draft, recent, getProduct, cartCount, addToCart, removeFromCart, setQty, toggleSaveForLater, clearPurchased, markViewed, placeOrder, updateOrderStatus, requestRefund, setRefundStatus, toggleLesson, saveDraft, resetDraft, loadDraft, publishDraft, archiveProduct, deleteDraft, duplicateProduct])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
