import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#faf5f0] border-t mt-auto">
      {/* Contact CTA */}
      <div className="relative overflow-hidden bg-[#1a1a2e] py-20 lg:py-24">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#d4a0a0]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b8976a]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/5 rounded-full" />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#d4a0a0] uppercase tracking-[0.3em] text-xs font-semibold mb-4">Get in Touch</p>
          <h3 className="text-white text-3xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-5 leading-tight">
            Let&apos;s Find Your<br />
            <span className="text-[#d4a0a0]">Perfect Style</span>
          </h3>
          <p className="text-gray-400 text-sm lg:text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Whether you need styling advice or have questions about our collection, our team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-[#d4a0a0] text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-[#b87d7d] transition-all duration-300 shadow-lg shadow-[#d4a0a0]/20 hover:shadow-xl hover:shadow-[#d4a0a0]/30 hover:-translate-y-0.5"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <Image
              src="/images/logo.png"
              alt="West Flora"
              width={120}
              height={120}
              className="h-24 w-24 object-contain rounded-full bg-white shadow-md p-1"
            />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Elevate Your Closet Story.<br />Premium modest fashion for the modern woman.
          </p>
          <div className="flex gap-3 mt-5">
            {['Facebook', 'Instagram', 'TikTok'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-full bg-[#f5d5d8] flex items-center justify-center text-[#d4a0a0] hover:bg-[#d4a0a0] hover:text-white transition-all duration-300 text-xs font-bold">
                {social[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-[#b8976a] mb-5 uppercase tracking-wider text-xs">Quick Links</h3>
          <div className="flex flex-col gap-3">
            {[
              { href: '/shop', label: 'Shop All' },
              { href: '/shop?filter=new', label: 'New Arrivals' },
              { href: '/shop?filter=sale', label: 'Sale' },
              { href: '/contact', label: 'Contact Us' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-[#d4a0a0] text-sm transition-colors hover:translate-x-1 inline-block transform duration-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-bold text-[#b8976a] mb-5 uppercase tracking-wider text-xs">Customer Care</h3>
          <div className="flex flex-col gap-3">
            {['Cash on Delivery', 'Easy Exchange Policy', '4-7 Days Delivery'].map((item) => (
              <span key={item} className="text-gray-600 text-sm">{item}</span>
            ))}
            <Link href="/track" className="text-gray-600 hover:text-[#d4a0a0] text-sm transition-colors">
              Track Your Order
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-[#b8976a] mb-5 uppercase tracking-wider text-xs">Contact Us</h3>
          <div className="flex flex-col gap-4">
            <a href="tel:03001234567" className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#d4a0a0] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#f5d5d8] flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-[#d4a0a0]" />
              </div>
              0300-1234567
            </a>
            <a href="mailto:info@westflora.pk" className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#d4a0a0] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#f5d5d8] flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-[#d4a0a0]" />
              </div>
              info@westflora.pk
            </a>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-fit"
            >
              <MessageCircle size={16} /> WhatsApp Us
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
