import HeroBanner from '@/components/HeroBanner'
import ProductCard from '@/components/ProductCard'
import { Truck, ShieldCheck, RefreshCw, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

const categories = [
  { name: 'Abayas', slug: 'abayas', image: '/images/categories/abayas.webp' },
  { name: 'Hijabs', slug: 'hijabs', image: '/images/categories/hijabs.webp' },
  { name: 'Modest Dresses', slug: 'modest-dresses', image: '/images/categories/modest-dresses.webp' },
  { name: 'Kurtis', slug: 'kurtis', image: '/images/categories/kurtis.webp' },
  { name: 'Co-ord Sets', slug: 'co-ord-sets', image: '/images/categories/co-ord-sets.webp' },
  { name: 'Accessories', slug: 'accessories', image: '/images/categories/accessories.webp' },
]

async function getProducts(): Promise<Product[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('featured', true).limit(8)
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <HeroBanner />

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-[#b8976a] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Categories</p>
          <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-playfair)]">
            Shop by Category
          </h2>
          <p className="text-gray-500 mt-3">Find your perfect modest style</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#f5d5d8]/40 border-2 border-[#f5d5d8] flex items-center justify-center group-hover:border-[#d4a0a0] group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 overflow-hidden p-2">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} width={80} height={80} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <span className="text-[#d4a0a0] font-bold text-lg lg:text-xl font-[family-name:var(--font-playfair)]">
                    {cat.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="font-medium text-xs lg:text-sm text-gray-700 group-hover:text-[#d4a0a0] transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-10">
        <Link href="/shop?filter=sale" className="block group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#d4a0a0] via-[#e8b4b8] to-[#b8976a] p-10 lg:p-16 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white/80 uppercase tracking-widest text-xs font-medium mb-2">Limited Time Offer</p>
                <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                  Up to 50% Off
                </h2>
                <p className="text-white/80">Grab your favorites before they&apos;re gone!</p>
              </div>
              <div className="bg-white text-[#d4a0a0] px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm group-hover:bg-[#faf5f0] transition-colors flex items-center gap-2 shadow-xl">
                Shop Sale <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-[#b8976a] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Our Collection</p>
          <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-playfair)]">
            Featured Collection
          </h2>
          <p className="text-gray-500 mt-3">Handpicked styles just for you</p>
        </div>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 border-2 border-[#d4a0a0] text-[#d4a0a0] px-10 py-4 rounded-full hover:bg-[#d4a0a0] hover:text-white transition-all duration-300 font-semibold uppercase tracking-wider text-sm hover:shadow-lg"
              >
                View All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#f5d5d8]">
            <p className="text-gray-500 mb-4">No products yet. New styles are coming soon.</p>
            <Link href="/shop" className="text-[#d4a0a0] font-medium hover:underline">
              Browse shop
            </Link>
          </div>
        )}
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">Why West Flora?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs.3,000', color: 'bg-blue-50' },
              { icon: ShieldCheck, title: 'Cash on Delivery', desc: 'Pay when you receive', color: 'bg-green-50' },
              { icon: RefreshCw, title: 'Easy Exchange', desc: 'Hassle-free returns', color: 'bg-purple-50' },
              { icon: Star, title: 'Premium Quality', desc: 'Guaranteed satisfaction', color: 'bg-amber-50' },
            ].map((badge) => (
              <div key={badge.title} className={`${badge.color} rounded-2xl p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}>
                <div className="inline-flex p-4 rounded-2xl bg-white shadow-sm mb-4 group-hover:shadow-md transition-shadow">
                  <badge.icon size={28} className="text-[#b8976a]" />
                </div>
                <h3 className="font-bold mb-1">{badge.title}</h3>
                <p className="text-gray-500 text-sm">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
