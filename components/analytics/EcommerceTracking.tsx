'use client'

import { useEffect } from 'react'
import type { Product } from '@/lib/types'
import { trackViewItemList, trackViewItem, trackAddToCart, trackSelectItem } from '@/lib/analytics'

// Track view_item_list when the tienda page loads
export function TrackViewItemList({ products, listName = 'Tienda' }: { products: Product[]; listName?: string }) {
  useEffect(() => {
    if (products.length > 0) {
      trackViewItemList(products, listName)
    }
  }, [products, listName])
  return null
}

// Track view_item when a product detail page loads
export function TrackViewItem({ product }: { product: Product }) {
  useEffect(() => {
    trackViewItem(product)
  }, [product])
  return null
}

// Track select_item when clicking a product card (wrapper)
export function TrackSelectItemOnClick({ product, listName = 'Tienda', children }: { product: Product; listName?: string; children: React.ReactNode }) {
  return (
    <div onClick={() => trackSelectItem(product, listName)}>
      {children}
    </div>
  )
}

// Add to Cart button with tracking + localStorage persistence
export function AddToCartButton({
  product,
  quantity = 1,
  className,
  children,
}: {
  product: Product
  quantity?: number
  className?: string
  children: React.ReactNode
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    trackAddToCart(product, quantity)

    // Write to victorsdou-cart (shared Zustand localStorage key)
    const CART_KEY = 'victorsdou-cart'
    const price = product.ecommercePrice ?? product.basePricePen
    const cartItem = {
      product: {
        id: product.id,
        slug: product.sku,
        name: product.name,
        price,
        image: product.imageUrl ?? '',
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
      // localStorage unavailable — proceed to carrito anyway
    }

    window.location.href = '/carrito'
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
