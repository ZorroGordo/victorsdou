import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySku, getStoreProducts } from '@/lib/products'
import { getDisplayPrice, formatPrice } from '@/lib/types'
import type { Product } from '@/lib/types'
import ProductImageGallery from '@/components/store/ProductImageGallery'
import { TrackViewItem } from '@/components/analytics/EcommerceTracking'
import { AddToCartSection } from '@/components/store/AddToCartSection'

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

interface PageProps {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sku } = await params
  const product = await getProductBySku(sku)

  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  const displayPrice = getDisplayPrice(product)
  const formattedPrice = formatPrice(displayPrice)

  return {
    title: `${titleCase(product.name)} | Victorsdou`,
    description: product.description || `Compra ${titleCase(product.name)} en Victorsdou. Precio: ${formattedPrice}`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { sku } = await params
  const product = await getProductBySku(sku)

  if (!product) {
    notFound()
  }

  // Get related products (same category, exclude current product)
  const { products: allProducts } = await getStoreProducts()
  const relatedProducts = allProducts
    .filter(p => p.sku !== product.sku && (p.category === product.category || p.categoryId === product.categoryId))
    .slice(0, 4)

  const displayPrice = getDisplayPrice(product)
  const formattedPrice = formatPrice(displayPrice)

  // Count images for the gallery (check how many images the product has)
  const imageCount = 1 // Default to 1, can be enhanced if product has multiple images

  return (
    <div className="min-h-screen bg-cream">
      {/* GA4 Ecommerce: track view_item */}
      <TrackViewItem product={product} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 mt-16">
        <nav className="flex items-center gap-2 text-sm text-charcoal/70">
          <Link href="/tienda" className="hover:text-charcoal">
            Tienda
          </Link>
          <span>/</span>
          <Link
            href={`/tienda?cat=${(product.category || product.category_name || '').toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-charcoal"
          >
            {titleCase(product.category || product.category_name || 'Sin categoría')}
          </Link>
          <span>/</span>
          <span className="text-charcoal">{titleCase(product.name)}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <ProductImageGallery sku={product.sku} imageCount={imageCount} mainIndex={0} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal uppercase tracking-wide mb-4">
              {titleCase(product.name)}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-2xl md:text-3xl font-bold text-green">
                {formattedPrice}
              </p>
              <p className="text-sm text-charcoal/60">IGV incluido</p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-charcoal/80 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Weight */}
            {product.weight && (
              <div className="mb-6">
                <p className="text-sm text-charcoal/60 uppercase tracking-wide">
                  Peso/Tamaño
                </p>
                <p className="text-lg text-charcoal font-medium">{product.weight}</p>
              </div>
            )}

            {/* Quantity + Add to Cart (client component) */}
            <AddToCartSection product={product} />

            {/* Additional Info */}
            <div className="border-t border-charcoal/10 pt-6">
              <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-2">
                SKU
              </p>
              <p className="text-charcoal font-mono text-sm">{product.sku}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-charcoal/10">
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal uppercase tracking-wide mb-8">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <RelatedProductCard key={relatedProduct.sku} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  )
}

function RelatedProductCard({ product }: { product: Product }) {
  const displayPrice = getDisplayPrice(product)
  const formattedPrice = formatPrice(displayPrice)

  return (
    <Link href={`/tienda/${product.sku}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-lg">
          <img
            src={`/api/store/product-image/${product.sku}`}
            alt={titleCase(product.name)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-sm text-charcoal mb-1">
            {titleCase(product.name)}
          </h3>

          {product.weight && (
            <p className="text-xs text-charcoal/60 mb-3">{product.weight}</p>
          )}

          <div className="mt-auto">
            <p className="text-lg font-bold text-green">{formattedPrice}</p>
            <p className="text-xs text-charcoal/50">IGV incluido</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
