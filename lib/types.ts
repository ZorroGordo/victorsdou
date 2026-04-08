export interface ProductCategory {
  id: string
  name: string
  parentId: string | null
  isActive: boolean
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  categoryId: string
  basePricePen: number
  taxClass: string
  unitOfSale: string
  weightGrams: number | null
  imageUrl: string | null
  isActive: boolean
  isB2cVisible: boolean
  minOrderQty: number
  metadata: Record<string, unknown> | null
  ecommerceEnabled: boolean
  ecommercePrice: number | null
  ecommerceImages: string[]
  ecommerceMainImageIndex: number
  // Computed/joined fields
  category?: string
  category_name?: string
  weight?: string | null
}

export function getDisplayPrice(product: Product): number {
  const base = product.ecommercePrice ?? product.basePricePen
  return Math.round(base * 1.18 * 100) / 100
}

export function formatPrice(amount: number): string {
  return `S/ ${amount.toFixed(2)}`
}
