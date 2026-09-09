'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

const bannerItems = [
  `Free Delivery on Orders Above Rs.${FREE_SHIPPING_THRESHOLD.toLocaleString('en-PK')}`,
  'Cash on Delivery Available Across Pakistan',
  'Easy Exchange Policy',
  'Premium Modest Fashion',
]

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?filter=new', label: 'New Arrivals' },
  { href: '/shop?filter=sale', label: 'Sale' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openCartDrawer = () => {
    window.dispatchEvent(new Event('open-cart-drawer'))
  }

  const marqueeContent = [...bannerItems, ...bannerItems].map((item, i) => (
    <span key={`${item}-${i}`} className="inline-flex items-center gap-8 px-8">
      <span>{item}</span>
      <span className="opacity-50">•</span>
    </span>
  ))

  return (
    <>
      <div className="bg-[#5c2a2a] text-white text-xs sm:text-sm py-2.5 overflow-hidden relative z-[60]">
        <div className="animate-marquee flex whitespace-nowrap">
          {marqueeContent}
          {marqueeContent}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#fffaf7]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(138,58,58,0.08)]'
            : 'bg-[#fffaf7]/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-[72px] lg:h-20">
          <button
            className="lg:hidden p-2 rounded-full hover:bg-[#f5d5d8]/40 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-[#3d2c2c] hover:text-[#8a3a3a] transition-colors font-medium text-xs uppercase tracking-[0.18em] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#8a3a3a] group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <Link href="/" className="flex-shrink-0 group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <Image
              src="/images/logo.png"
              alt="West Flora"
              width={88}
              height={88}
              className="h-14 w-14 lg:h-16 lg:w-16 object-contain rounded-full bg-white shadow-sm ring-1 ring-[#f5d5d8] group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center justify-end gap-1 flex-1">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-[#3d2c2c] hover:text-[#8a3a3a] transition-colors font-medium text-xs uppercase tracking-[0.18em] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#8a3a3a] group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative ml-2 p-2.5 rounded-full hover:bg-[#f5d5d8]/40 transition-colors group"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} className="text-[#3d2c2c] group-hover:text-[#8a3a3a] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#8a3a3a] text-white text-[10px] font-bold rounded-full h-4.5 min-w-4.5 px-1 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={openCartDrawer}
            className="lg:hidden relative p-2 rounded-full hover:bg-[#f5d5d8]/40 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} className="text-[#3d2c2c]" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#8a3a3a] text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-[#fffaf7] border-t border-[#f5d5d8] animate-fade-in">
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-6 py-4 text-[#3d2c2c] hover:bg-[#f5d5d8]/30 hover:text-[#8a3a3a] font-medium tracking-wide transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
