import { CartItem, COMMISSION_RATE, PLATFORM_FEE_RATE, Product } from './types'

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

export function unitPrice(p: Product, variantId?: string): number {
  if (p.free) return 0
  const v = p.variants?.find((x) => x.id === variantId)
  return v ? v.price : p.price
}

export function lineTotal(p: Product, item: CartItem): number {
  return unitPrice(p, item.variantId) * item.qty
}

export function shippingFor(products: Product[]): number {
  // per distinct physical seller with flat-rate shipping
  const sellers = new Map<string, number>()
  products.forEach((p) => {
    if (p.type === 'Physical' && p.shippingType === 'Flat Rate') {
      sellers.set(p.sellerId, Math.max(sellers.get(p.sellerId) ?? 0, p.shippingCost ?? 0))
    }
  })
  return [...sellers.values()].reduce((s, x) => s + x, 0)
}

export const platformFee = (subtotal: number) => Math.round(subtotal * PLATFORM_FEE_RATE)
export const commission = (amount: number) => Math.round(amount * COMMISSION_RATE)
export const creatorEarnings = (amount: number) => Math.round(amount * (1 - COMMISSION_RATE))
