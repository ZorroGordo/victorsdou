'use client'

import { useState } from 'react'

interface ProductImageGalleryProps {
  sku: string
  imageCount: number
  mainIndex: number
}

export default function ProductImageGallery({
  sku,
  imageCount,
  mainIndex,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(mainIndex)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
        <img
          src={`/api/store/product-image/${sku}?i=${selectedIndex}`}
          alt="Product image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {imageCount > 1 && (
        <div className="flex gap-3">
          {Array.from({ length: imageCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all border-2 ${
                selectedIndex === index
                  ? 'border-green shadow-md'
                  : 'border-charcoal/10 hover:border-charcoal/30'
              }`}
            >
              <img
                src={`/api/store/product-image/${sku}?i=${index}`}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
