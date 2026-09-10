import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail } from 'lucide-react'
import SocialLinks from '@/components/SocialLinks'
import {
  CATEGORIES,
  CONTACT_PHONE,
  FREE_SHIPPING_THRESHOLD,
} from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#fffaf7] to-[#f7f0ea] border-t border-[#f0e4e0] mt-auto">
      <div className="relative overflow-hidden bg-[#2a1818] py-20 lg:py-24">
        <div className="absolute inset-0 section-dots opacity-20" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#d4a0a0]/15 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b8976a]/15 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-float" />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#f5d5d8] uppercase tracking-[0.35em] text-xs font-semibold mb-4">Get in Touch</p>
          <h3 className="text-white text-3xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-5 leading-tight">
            Let&apos;s Find Your<br />
            <span className="text-[#f5d5d8]">Perfect Style</span>
          </h3>
          <p className="text-gray-400 text-sm lg:text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Whether you need styling advice or have questions about our collection, our team is here to help you every step of the way.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-[#d4a0a0] text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-[#b87d7d] transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
          <SocialLinks variant="dark" className="mt-8 justify-center" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Image
            src="/images/logo.png"
            alt="West Flora"
            width={120}
            height={120}
            className="h-24 w-24 object-contain rounded-full bg-white shadow-md p-1 mb-4"
          />
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Elevate Your Closet Story.<br />Premium modest fashion for the modern woman.
          </p>
          <SocialLinks iconClassName="h-4 w-4" className="gap-2.5" />
        </div>

        <div>
          <h3 className="font-bold text-[#b8976a] mb-5 uppercase tracking-wider text-xs">Shop</h3>
          <div className="flex flex-col gap-3">
            <Link href="/shop" className="text-gray-600 hover:text-[#d4a0a0] text-sm transition-colors">Shop All</Link>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="text-gray-600 hover:text-[#d4a0a0] text-sm transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#b8976a] mb-5 uppercase tracking-wider text-xs">Customer Care</h3>
          <div className="flex flex-col gap-3">
            <span className="text-gray-600 text-sm">Cash on Delivery</span>
            <span className="text-gray-600 text-sm">Free delivery above Rs.{FREE_SHIPPING_THRESHOLD.toLocaleString('en-PK')}</span>
            <span className="text-gray-600 text-sm">Easy Exchange Policy</span>
            <Link href="/track" className="text-gray-600 hover:text-[#d4a0a0] text-sm transition-colors">
              Track Your Order
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#b8976a] mb-5 uppercase tracking-wider text-xs">Contact Us</h3>
          <div className="flex flex-col gap-4">
            <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#d4a0a0] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#f5d5d8] flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-[#d4a0a0]" />
              </div>
              {CONTACT_PHONE}
            </a>
            <a href="mailto:info@westflora.pk" className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#d4a0a0] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#f5d5d8] flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-[#d4a0a0]" />
              </div>
              info@westflora.pk
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e8b4b8]/30 py-5 text-center text-gray-400 text-sm">
        © 2026 <span className="text-[#d4a0a0] font-medium">West Flora</span>. All Rights Reserved.
      </div>
    </footer>
  )
}
