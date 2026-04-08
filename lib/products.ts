import { createServerClient } from './supabase'
import type { Product } from './types'

function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000
    return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`
  }
  return `${grams}g`
}

export async function getStoreProducts(): Promise<{ products: Product[]; error?: string }> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, sku, name, description, categoryId, basePricePen, taxClass, unitOfSale,
        weightGrams, imageUrl, isActive, isB2cVisible, minOrderQty, metadata,
        ecommerceEnabled, ecommercePrice, ecommerceMainImageIndex,
        product_categories!inner(name)
      `)
      .eq('isActive', true)
      .eq('isB2cVisible', true)
      .eq('ecommerceEnabled', true)
      .order('name')

    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], error: `Supabase error: ${error.message} (${error.code})` }
    }

    const products = (data || []).map((p: any) => ({
      ...p,
      basePricePen: parseFloat(p.basePricePen),
      ecommercePrice: p.ecommercePrice ? parseFloat(p.ecommercePrice) : null,
      minOrderQty: parseFloat(p.minOrderQty),
      ecommerceImages: [], // excluded from listing for performance
      category: p.product_categories?.name || 'Sin categoría',
      category_name: p.product_categories?.name || 'Sin categoría',
      weight: p.weightGrams ? formatWeight(p.weightGrams) : null,
    }))
    return { products }
  } catch (e: any) {
    return { products: [], error: `Exception: ${e.message}` }
  }
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, sku, name, description, categoryId, basePricePen, taxClass, unitOfSale,
      weightGrams, imageUrl, isActive, isB2cVisible, minOrderQty, metadata,
      ecommerceEnabled, ecommercePrice, ecommerceImages, ecommerceMainImageIndex,
      product_categories!inner(name)
    `)
    .eq('sku', sku)
    .eq('isActive', true)
    .eq('isB2cVisible', true)
    .eq('ecommerceEnabled', true)
    .single()

  if (error || !data) return null

  return {
    ...data,
    basePricePen: parseFloat(data.basePricePen),
    ecommercePrice: data.ecommercePrice ? parseFloat(data.ecommercePrice) : null,
    minOrderQty: parseFloat(data.minOrderQty),
    category: (data as any).product_categories?.name || 'Sin categoría',
    category_name: (data as any).product_categories?.name || 'Sin categoría',
    weight: data.weightGrams ? formatWeight(data.weightGrams) : null,
  } as Product
}

export async function getCategories(): Promise<string[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('product_categories')
    .select('name')
    .eq('isActive', true)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data || []).map((c: any) => c.name as string)
}
