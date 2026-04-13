import { Metadata } from 'next'
import Link from 'next/link'
import { getStoreProducts, getCategories } from '@/lib/products'
import { getDisplayPrice, formatPrice } from '@/lib/types'
import type { Product } from '@/lib/types'
import { TrackViewItemList, TrackSelectItemOnClick } from '@/components/analytics/EcommerceTracking'

export const metadata: Metadata = {
  title: 'Tienda | Victorsdou',
  description: 'Compra pan artesanal de masa madre, croissants, brioche y más. Envío a domicilio en Lima.',
}

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function TiendaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const selectedCategory = typeof params.cat === 'string' ? params.cat : null

  const [result, categories] = await Promise.all([
    getStoreProducts(),
    getCategories(),
  ])

  const products = result.products
  const fetchError = result.error

  // Filter products by category if selected
  let filteredProducts = products
  if (selectedCategory) {
    filteredProducts = products.filter(
      p => (p.category || p.category_name || '').toLowerCase().replace(/\s+/g, '-') === selectedCategory
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* GA4 Ecommerce: track view_item_list */}
      <TrackViewItemList products={filteredProducts} listName={selectedCategory ? titleCase(selectedCategory.replace(/-/g, ' ')) : 'Tienda'} />

      {/* Hero Section */}
      <section className="w-full bg-green text-white py-20 md:py-28 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-wide mb-4">
            Nuestra Tienda
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/90 max-w-2xl">
            Pan artesanal de masa madre, elaborado con ingredientes naturales
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="w-full bg-white border-b border-charcoal/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* "Todos" button */}
            <Link
              href="/tienda"
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium tracking-wide transition-colors ${
                !selectedCategory
                  ? 'bg-green text-white'
                  : 'bg-white text-charcoal border border-charcoal/20 hover:border-charcoal/40'
              }`}
            >
              Todos
            </Link>

            {/* Category buttons */}
            {categories.map(cat => {
              const catSlug = cat.toLowerCase().replace(/\s+/g, '-')
              const isActive = selectedCategory === catSlug
              return (
                <Link
                  key={cat}
                  href={`/tienda?cat=${catSlug}`}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'bg-green text-white'
                      : 'bg-white text-charcoal border border-charcoal/20 hover:border-charcoal/40'
                  }`}
                >
                  {titleCase(cat)}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl mb-4">🥐</p>
              <p className="text-charcoal text-lg mb-6">
                No hay productos disponibles en esta categoría
              </p>
              <Link href="/tienda" className="text-green font-medium hover:underline">
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const displayPrice = getDisplayPrice(product)
  const formattedPrice = formatPrice(displayPrice)

  return (
    <TrackSelectItemOnClick product={product}>
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
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-lg text-charcoal mb-1">
            {titleCase(product.name)}
          </h3>

          {product.weight && (
            <p className="text-sm text-charcoal/60 mb-3">{product.weight}</p>
          )}

          <div className="mb-4 mt-auto">
            <p className="text-xl md:text-2xl font-bold text-green">
              {formattedPrice}
            </p>
            <p className="text-xs text-charcoal/50">IGV incluido</p>
          </div>

          <button className="w-full bg-green text-white py-2 rounded-lg text-sm font-medium uppercase tracking-wide hover:bg-green/90 transition-colors">
            Ver Producto
          </button>
        </div>
      </div>
    </Link>
    </TrackSelectItemOnClick>
  )
}
