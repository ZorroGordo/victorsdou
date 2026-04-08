import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params
  const imageIndex = parseInt(request.nextUrl.searchParams.get('i') || '0', 10)

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('ecommerceImages, ecommerceMainImageIndex')
    .eq('sku', sku)
    .single()

  if (error || !data || !data.ecommerceImages?.length) {
    return new NextResponse('Not found', { status: 404 })
  }

  const idx = imageIndex >= 0 && imageIndex < data.ecommerceImages.length
    ? imageIndex
    : data.ecommerceMainImageIndex || 0

  const dataUri = data.ecommerceImages[idx]
  if (!dataUri || typeof dataUri !== 'string') {
    return new NextResponse('No image', { status: 404 })
  }

  // Parse data URI: "data:image/jpeg;base64,/9j/4AAQ..."
  const match = dataUri.match(/^data:image\/([\w+]+);base64,(.+)$/)
  if (!match) {
    return new NextResponse('Invalid image format', { status: 500 })
  }

  const mimeType = match[1] === 'jpeg' ? 'image/jpeg' : `image/${match[1]}`
  const buffer = Buffer.from(match[2], 'base64')

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      'Content-Length': buffer.byteLength.toString(),
    },
  })
}
