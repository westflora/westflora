'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ShoppingBag, Truck, ShieldCheck, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import type { Product } from '@/lib/types'
import toast from 'react-hot-toast'

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const hasDiscount = product.original_price && product.original_price > product.price

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#faf5f0', color: '#333' },
      iconTheme: { primary: '#d4a0a0', secondary: '#fff' },
    })
    window.dispatchEvent(new Event('open-cart-drawer'))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <Image
              src={product.images[activeImage] || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-[#d4a0a0] text-white px-3 py-1 rounded-full text-sm font-medium">
                Save {getDiscountPercentage(product.price, product.original_price!)}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === i ? 'border-[#d4a0a0]' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-[#b8976a] uppercase tracking-wider text-sm mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">{product.name}</h1>
          </div>

          {/* Rating */}
          {product.review_count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-[#b8976a] text-[#b8976a]' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.review_count} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#d4a0a0]">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.original_price!)}</span>
            )}
          </div>

          {/* Size */}
          {product.sizes.length > 0 && (
            <div>
              <label className="font-medium text-sm mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-[#d4a0a0] bg-[#d4a0a0] text-white'
                        : 'border-gray-300 hover:border-[#d4a0a0]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <label className="font-medium text-sm mb-2 block">Color: {selectedColor}</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-[#d4a0a0] bg-[#f5d5d8] text-[#d4a0a0]'
                        : 'border-gray-300 hover:border-[#d4a0a0]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="font-medium text-sm mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border rounded-lg hover:bg-gray-50">
                <Minus size={16} />
              </button>
              <span className="font-medium w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 border rounded-lg hover:bg-gray-50">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#d4a0a0] text-white py-4 rounded-full font-medium uppercase tracking-wider hover:bg-[#b87d7d] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Add to Cart
          </button>

          {/* Trust Info */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck size={18} className="text-[#b8976a]" /> Free delivery on orders above Rs.3,000
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck size={18} className="text-[#b8976a]" /> Cash on Delivery available
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-600 text-sm whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
