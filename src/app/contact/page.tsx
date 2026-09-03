'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('Please fill in name, phone, and message')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        status: 'new',
      })

      if (error) throw error

      toast.success('Message sent successfully!')
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch (err: any) {
      toast.error(err.message || 'Could not send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center font-[family-name:var(--font-playfair)] mb-10">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-4">Get in Touch</h2>
            <p className="text-gray-600">We&apos;d love to hear from you. Reach out to us through any of the following channels.</p>
          </div>

          <div className="space-y-4">
            <a href="tel:03001234567" className="flex items-center gap-3 text-gray-700 hover:text-[#d4a0a0]">
              <Phone size={20} className="text-[#b8976a]" /> 0300-1234567
            </a>
            <a href="mailto:info@westflora.pk" className="flex items-center gap-3 text-gray-700 hover:text-[#d4a0a0]">
              <Mail size={20} className="text-[#b8976a]" /> info@westflora.pk
            </a>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={20} className="text-[#b8976a]" /> Pakistan
            </div>
          </div>

          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={20} /> Chat on WhatsApp
          </a>

          <div className="bg-white rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Business Hours</p>
            <p className="font-medium">Monday - Saturday: 11AM - 8PM</p>
            <p className="font-medium">Sunday: Closed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]"
                placeholder="03XX-XXXXXXX"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]"
                placeholder="Your message"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4a0a0] text-white py-3 rounded-full font-medium hover:bg-[#b87d7d] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
