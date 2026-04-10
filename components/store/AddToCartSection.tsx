'use client'

import { useState } from 'react'
import type { Product } from '@/lib/types'
import { getDisplayPrice } from '@/lib/types'
import { trackAddToCart } from '@/lib/analytics'

/** IGV factor (18%) – always applied at display-time in carrito/checkout HTML */
const IGV = 1.18

const CART_KEY = 'victorsdou-cart'

export function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    trackAddToCart(product, quantity)

    const price = getDisplayPrice(product) // IGV-included price
    const cartItem = {
      product: {
        id: product.id,
        slug: product.sku,
        name: product.name,
        price,
        basePricePen: product.ecommercePrice ?? product.basePricePen,
        image: `/api/store/product-image/${product.sku}`,
        description: product.description ?? '',
        category: product.category ?? product.category_name ?? '',
        unit: product.unitOfSale ?? 'und',
        isSubscribable: false,
        stock: 999,
      },
      quantity,
      isSubscription: false,
    }

    try {
      const raw = localStorage.getItem(CART_KEY)
      const existing = raw ? JSON.parse(raw) : { state: { items: [] }, version: 1 }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: any[] = (existing.state ?? existing).items ?? []
      const idx = items.findIndex((i) => i.product?.id === cartItem.product.id)
      if (idx >= 0) {
        items[idx] = { ...items[idx], quantity: (items[idx].quantity ?? 0) + quantity }
      } else {
        items.push(cartItem)
      }
      localStorage.setItem(CART_KEY, JSON.stringify({ state: { items }, version: 1 }))
      window.dispatchEvent(new StorageEvent('storage', { key: CART_KEY }))
    } catch {
      // localStorage unavailable
    }

    window.location.href = '/carrito'
  }

  return (
    <>
      {/* Quantity Selector */}
      <div className="mb-8">
        <p className="text-sm text-charcoal/60 uppercase tracking-wide mb-3">Cantidad</p>
        <div className="flex items-center gap-4 bg-white border border-charcoal/10 rounded-lg w-fit px-4 py-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-charcoal/50 hover:text-charcoal font-bold text-lg leading-none"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="w-12 text-center font-medium text-charcoal">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-charcoal/50 hover:text-charcoal font-bold text-lg leading-none"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-green text-white py-4 rounded-lg text-lg font-medium uppercase tracking-wide hover:bg-green/90 transition-colors mb-6"
      >
        Agregar al Carrito
      </button>
    </>
  )
}
