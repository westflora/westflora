import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.original_price && product.original_price > product.price

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <Image
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="bg-[#b8976a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#d4a0a0] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
              -{getDiscountPercentage(product.price, product.original_price!)}% OFF
            </span>
          )}
        </div>

        {/* Quick action */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-[#d4a0a0] hover:text-white transition-colors">
            <ShoppingBag size={18} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 px-1">
        <h3 className="font-semibold text-gray-800 group-hover:text-[#d4a0a0] transition-colors text-sm lg:text-base">
          {product.name}
        </h3>

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.round(product.rating) ? 'fill-[#b8976a] text-[#b8976a]' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#d4a0a0] text-base lg:text-lg">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through text-xs lg:text-sm">{formatPrice(product.original_price!)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
