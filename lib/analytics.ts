// Google Analytics 4 Ecommerce tracking via GTM dataLayer
// Reference: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

import type { Product } from './types'
import { getDisplayPrice } from './types'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function productToGA4Item(product: Product, quantity: number = 1) {
  const price = getDisplayPrice(product)
  return {
    item_id: product.sku,
    item_name: titleCase(product.name),
    item_category: product.category || product.category_name || 'Sin categoría',
    price: price,
    currency: 'PEN',
    quantity: quantity,
    item_brand: 'Victorsdou',
  }
}

function pushEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  // Clear previous ecommerce data to prevent cross-contamination
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event,
    ...data,
  })
}

// Fired when a user views the product listing page
export function trackViewItemList(products: Product[], listName: string = 'Tienda') {
  pushEvent('view_item_list', {
    ecommerce: {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: products.map((p, index) => ({
        ...productToGA4Item(p),
        index: index,
      })),
    },
  })
}

// Fired when a user clicks on a product from the listing
export function trackSelectItem(product: Product, listName: string = 'Tienda') {
  pushEvent('select_item', {
    ecommerce: {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: [productToGA4Item(product)],
    },
  })
}

// Fired when a user views a product detail page
export function trackViewItem(product: Product) {
  pushEvent('view_item', {
    ecommerce: {
      currency: 'PEN',
      value: getDisplayPrice(product),
      items: [productToGA4Item(product)],
    },
  })
}

// Fired when a user adds a product to the cart
export function trackAddToCart(product: Product, quantity: number = 1) {
  const price = getDisplayPrice(product)
  pushEvent('add_to_cart', {
    ecommerce: {
      currency: 'PEN',
      value: price * quantity,
      items: [productToGA4Item(product, quantity)],
    },
  })
}

// Fired when a user removes a product from the cart
export function trackRemoveFromCart(product: Product, quantity: number = 1) {
  const price = getDisplayPrice(product)
  pushEvent('remove_from_cart', {
    ecommerce: {
      currency: 'PEN',
      value: price * quantity,
      items: [productToGA4Item(product, quantity)],
    },
  })
}

// Fired when a user views the cart
export function trackViewCart(products: { product: Product; quantity: number }[]) {
  const items = products.map(({ product, quantity }) => productToGA4Item(product, quantity))
  const value = products.reduce((sum, { product, quantity }) => sum + getDisplayPrice(product) * quantity, 0)

  pushEvent('view_cart', {
    ecommerce: {
      currency: 'PEN',
      value: Math.round(value * 100) / 100,
      items,
    },
  })
}

// Fired when a user begins checkout
export function trackBeginCheckout(products: { product: Product; quantity: number }[]) {
  const items = products.map(({ product, quantity }) => productToGA4Item(product, quantity))
  const value = products.reduce((sum, { product, quantity }) => sum + getDisplayPrice(product) * quantity, 0)

  pushEvent('begin_checkout', {
    ecommerce: {
      currency: 'PEN',
      value: Math.round(value * 100) / 100,
      items,
    },
  })
}

// Fired when a purchase is completed
export function trackPurchase(
  transactionId: string,
  products: { product: Product; quantity: number }[],
  shipping: number = 0,
  tax: number = 0
) {
  const items = products.map(({ product, quantity }) => productToGA4Item(product, quantity))
  const value = products.reduce((sum, { product, quantity }) => sum + getDisplayPrice(product) * quantity, 0)

  pushEvent('purchase', {
    ecommerce: {
      transaction_id: transactionId,
      currency: 'PEN',
      value: Math.round((value + shipping) * 100) / 100,
      shipping: shipping,
      tax: tax,
      items,
    },
  })
}
