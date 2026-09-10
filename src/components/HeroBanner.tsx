import Link from 'next/link'
import Image from 'next/image'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export default function HeroBanner() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="West Flora modest fashion"
        fill
        priority
        className="object-cover object-center scale-105 animate-hero-zoom"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#2a1818]/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a1818]/75 via-[#2a1818]/25 to-[#2a1818]/35" />

      {/* Soft floating accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-24 left-[12%] h-40 w-40 rounded-full bg-[#d4a0a0]/20 blur-3xl animate-orb" />
        <div className="absolute bottom-28 right-[15%] h-52 w-52 rounded-full bg-[#b8976a]/20 blur-3xl animate-orb-slow" />
        <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full border border-white/15 animate-float-soft" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center text-center">
        <div className="max-w-3xl text-white py-24">
          <p className="uppercase tracking-[0.4em] text-[11px] lg:text-xs text-[#f5d5d8] mb-6 animate-reveal-up">
            West Flora
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6 animate-reveal-up stagger-1">
            Elevate Your
            <span className="block mt-1 text-[#f5d5d8]">Closet Story</span>
          </h1>
          <p className="text-white/85 text-base lg:text-lg leading-relaxed mb-10 max-w-xl mx-auto animate-reveal-up stagger-2">
            The outfit you save on Pinterest but can&apos;t find easily in Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-reveal-up stagger-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-white text-[#5c2a2a] px-9 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.14em] hover:bg-[#f5d5d8] transition-all duration-300 hover:-translate-y-0.5 shadow-xl"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?filter=new"
              className="inline-flex items-center justify-center border border-white/60 text-white px-9 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.14em] hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              New Arrivals
            </Link>
          </div>
          <p className="mt-9 text-sm text-[#f5d5d8]/95 animate-reveal-up stagger-4">
            Free delivery above Rs.{FREE_SHIPPING_THRESHOLD.toLocaleString('en-PK')} · Cash on Delivery
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 text-white/70">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/70 to-transparent animate-scroll-line" />
      </div>
    </section>
  )
}
