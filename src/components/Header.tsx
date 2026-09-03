'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop?filter=new', label: 'New Arrivals' },
    { href: '/shop?filter=sale', label: 'Sale' },
    { href: '/contact', label: 'Contact' },
  ]

  const openCartDrawer = () => {
    window.dispatchEvent(new Event('open-cart-drawer'))
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#d4a0a0] via-[#e8b4b8] to-[#d4a0a0] text-white text-center text-sm py-2.5 px-4 font-medium tracking-wide">
        Free Delivery on Orders Above Rs.3,000 &nbsp;|&nbsp; Cash on Delivery Available
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-24">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-[#faf5f0] rounded-xl transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white shadow-md scale-110" />
              <Image
                src="/images/logo.png"
                alt="West Flora"
                width={120}
                height={120}
                className="h-20 w-20 object-contain relative z-10 rounded-full group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-gray-700 hover:text-[#d4a0a0] transition-colors font-medium text-sm uppercase tracking-wider group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#d4a0a0] group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative p-3 hover:bg-[#faf5f0] rounded-xl transition-colors group"
              aria-label="Open cart"
            >
              <ShoppingBag size={24} className="text-gray-700 group-hover:text-[#d4a0a0] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#d4a0a0] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-glow">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t animate-fade-in">
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-6 py-4 text-gray-700 hover:bg-[#faf5f0] hover:text-[#d4a0a0] font-medium transition-colors border-b border-gray-50"
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
