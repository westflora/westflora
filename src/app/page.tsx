import HeroBanner from '@/components/HeroBanner'
import ProductCard from '@/components/ProductCard'
import Reveal from '@/components/Reveal'
import { Truck, ShieldCheck, RefreshCw, Star, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { CATEGORIES, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

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

      {/* Categories */}
      <section className="relative overflow-hidden py-24 lg:py-28">
        <div className="absolute inset-0 bg-[#fffaf7]" />
        <div className="absolute inset-0 section-mesh opacity-70" />
        <div className="absolute -top-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-[#f5d5d8]/45 blur-3xl animate-orb-slow" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-[#e8d5b5]/35 blur-3xl animate-orb" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <Reveal className="text-center mb-14">
            <p className="text-[#b8976a] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">Collections</p>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] text-[#2d2d2d]">
              Shop by Category
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-[#d4a0a0]" />
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 90} variant="scale">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-[1.5rem] aspect-[3/4] shadow-[0_12px_40px_rgba(90,40,40,0.08)]"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a1818]/85 via-[#2a1818]/25 to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                    <span className="inline-block mb-2 h-px w-8 bg-[#f5d5d8] transition-all duration-500 group-hover:w-12" />
                    <h3 className="font-[family-name:var(--font-playfair)] text-white text-base lg:text-lg font-semibold leading-tight">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/70 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      Explore
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sale banner */}
      <section className="relative px-4 lg:px-8 pb-6">
        <Reveal variant="scale">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/shop?filter=sale"
              className="group block relative overflow-hidden rounded-[2rem] min-h-[300px] lg:min-h-[380px]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(115deg,#3d1a1a_0%,#8a3a3a_42%,#b8976a_100%)]" />
              <div className="absolute inset-0 opacity-25 section-dots" />
              <div className="absolute inset-0 shimmer-sweep" />
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-150 animate-orb" />
              <div className="absolute left-[40%] top-1/2 -translate-y-1/2 h-64 w-64 rounded-full border border-white/10 animate-spin-slow hidden lg:block" />
              <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden md:block">
                <div className="relative h-40 w-40 lg:h-52 lg:w-52 rounded-full border border-white/20 flex items-center justify-center animate-float-soft">
                  <div className="absolute inset-3 rounded-full border border-dashed border-white/25 animate-spin-slow" />
                  <div className="text-center text-white relative z-10">
                    <p className="font-[family-name:var(--font-playfair)] text-4xl lg:text-5xl font-bold">50%</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70 mt-1">Off</p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex h-full min-h-[300px] lg:min-h-[380px] flex-col justify-center px-8 lg:px-16 text-white">
                <p className="uppercase tracking-[0.35em] text-xs text-white/70 mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#f5d5d8]" /> Limited Offer
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl lg:text-6xl font-bold mb-4">
                  Up to 50% Off
                </h2>
                <p className="text-white/75 max-w-md mb-8 leading-relaxed">
                  Discover sale styles and enjoy free delivery on orders above Rs.
                  {FREE_SHIPPING_THRESHOLD.toLocaleString('en-PK')}.
                </p>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#5c2a2a] transition-all duration-300 group-hover:gap-3 group-hover:shadow-xl">
                  Shop Sale <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Featured */}
      <section className="relative overflow-hidden py-24 lg:py-28">
        <div className="absolute inset-0 bg-[#f7f0ea]" />
        <div className="absolute inset-0 section-wave opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-[#f5d5d8]/30 blur-3xl animate-orb-slow" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <Reveal className="text-center mb-14">
            <p className="text-[#b8976a] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">Featured</p>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] text-[#2d2d2d]">
              Handpicked for You
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-[#d4a0a0]" />
          </Reveal>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
                {products.map((product, i) => (
                  <Reveal key={product.id} delay={i * 80} className="product-card-hover">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
              <Reveal delay={200} className="text-center mt-14">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 border border-[#8a3a3a] text-[#8a3a3a] px-10 py-3.5 rounded-full hover:bg-[#8a3a3a] hover:text-white transition-all duration-300 font-semibold uppercase tracking-[0.14em] text-xs"
                >
                  View All Products
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Reveal>
            </>
          ) : (
            <Reveal>
              <div className="text-center py-20 rounded-[2rem] bg-white/70 border border-[#f0e4e0]">
                <p className="text-gray-500 mb-4">New styles are coming soon.</p>
                <Link href="/shop" className="text-[#8a3a3a] font-medium hover:underline">
                  Browse shop
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="relative overflow-hidden py-24 lg:py-28">
        <div className="absolute inset-0 bg-[#fffaf7]" />
        <div className="absolute inset-0 section-mesh opacity-80" />
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#f5d5d8]/50 blur-3xl animate-orb" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#e8d5b5]/40 blur-3xl animate-orb-slow" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <Reveal className="text-center mb-14">
            <p className="text-[#b8976a] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
              The West Flora Promise
            </p>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] text-[#2d2d2d]">
              Why West Flora
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-[#d4a0a0]" />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: 'Free Delivery', desc: `Orders above Rs.${FREE_SHIPPING_THRESHOLD.toLocaleString('en-PK')}`, num: '01' },
              { icon: ShieldCheck, title: 'Cash on Delivery', desc: 'Pay when you receive', num: '02' },
              { icon: RefreshCw, title: 'Easy Exchange', desc: 'Hassle-free returns', num: '03' },
              { icon: Star, title: 'Premium Quality', desc: 'Guaranteed satisfaction', num: '04' },
            ].map((badge, i) => (
              <Reveal key={badge.title} delay={i * 110} variant="up">
                <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-[#f0e4e0] bg-white/90 backdrop-blur-sm p-7 lg:p-8 shadow-[0_10px_40px_rgba(138,58,58,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(138,58,58,0.1)] hover:border-[#e8b4b8]/70">
                  <span className="absolute top-5 right-6 font-[family-name:var(--font-playfair)] text-4xl text-[#f5d5d8] group-hover:text-[#d4a0a0]/50 transition-colors">
                    {badge.num}
                  </span>
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-[#faf5f0] to-[#f5d5d8]/60 p-4 ring-1 ring-[#f0e4e0] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <badge.icon size={26} className="text-[#8a3a3a]" />
                  </div>
                  <h3 className="font-semibold text-[#2d2d2d] text-lg mb-2">{badge.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{badge.desc}</p>
                  <div className="mt-6 h-px w-0 bg-gradient-to-r from-[#d4a0a0] to-transparent transition-all duration-500 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
