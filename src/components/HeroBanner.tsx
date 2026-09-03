import Link from 'next/link'
import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#faf5f0] via-[#f5d5d8] to-[#faf5f0] py-20 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#f5d5d8]/40 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#e8b4b8]/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-[#b8976a]/50" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#d4a0a0]/40" />

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        {/* Logo watermark */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <Image
            src="/images/logo.png"
            alt="West Flora"
            width={160}
            height={160}
            className="h-32 w-32 lg:h-40 lg:w-40 object-contain drop-shadow-lg rounded-full bg-white/80 p-2"
          />
        </div>

        <p className="text-[#8a6f4e] uppercase tracking-[0.4em] text-xs lg:text-sm mb-3 font-semibold animate-fade-in-up">
          Premium Modest Fashion
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 font-[family-name:var(--font-playfair)] animate-fade-in-up text-[#2d2d2d]">
          Elevate Your{' '}
          <span className="text-[#8a3a3a]">Closet Story</span>
        </h1>

        <p className="text-[#5a4a4a] max-w-2xl mx-auto mb-10 text-base lg:text-lg leading-relaxed animate-fade-in-up">
          Discover our curated collection of premium modest fashion.<br className="hidden md:block" />
          Elegant designs that blend tradition with contemporary style.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <Link
            href="/shop"
            className="group relative bg-[#8a3a3a] text-white px-10 py-4 rounded-full hover:bg-[#6e2e2e] transition-all duration-300 font-semibold uppercase tracking-wider text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span className="relative z-10">Shop Now</span>
            <div className="absolute inset-0 rounded-full animate-shimmer" />
          </Link>
          <Link
            href="/shop?filter=new"
            className="border-2 border-[#6b5534] text-[#6b5534] px-10 py-4 rounded-full hover:bg-[#6b5534] hover:text-white transition-all duration-300 font-semibold uppercase tracking-wider text-sm hover:-translate-y-0.5 bg-white/30"
          >
            New Arrivals
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 lg:gap-16 mt-14 animate-fade-in-up">
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '200+', label: 'Products' },
            { value: '4.8★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-[#8a3a3a]">{stat.value}</p>
              <p className="text-xs lg:text-sm text-[#5a4a4a] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
