'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, generateOrderNumber } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', address: '', notes: ''
  })

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="max-w-4xl mx-auto px-4 py-20 text-center">Loading...</div>

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-2">Your order number is:</p>
        <p className="text-xl font-bold text-[#d4a0a0] mb-6">{orderPlaced}</p>
        <p className="text-gray-500 mb-6">We will contact you on your phone number to confirm the order. Payment will be collected on delivery.</p>
        <Link href="/shop" className="bg-[#d4a0a0] text-white px-8 py-3 rounded-full hover:bg-[#b87d7d] transition-colors font-medium">
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
        <Link href="/shop" className="text-[#d4a0a0] underline">Go shopping</Link>
      </div>
    )
  }

  const subtotal = total()
  const shippingFee = subtotal >= 3000 ? 0 : 200
  const grandTotal = subtotal + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.city || !form.address) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)

    const orderNumber = generateOrderNumber()

    try {
      const supabase = createClient()
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: form.address,
          city: form.city,
          status: 'pending',
          payment_method: 'cod',
          subtotal,
          shipping_fee: shippingFee,
          discount: 0,
          total: grandTotal,
          notes: form.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0] || '',
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      }))

      await supabase.from('order_items').insert(orderItems)

      clearCart()
      setOrderPlaced(orderNumber)
    } catch (err) {
      console.error(err)
      clearCart()
      setOrderPlaced(orderNumber)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold mb-4">Delivery Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]" placeholder="03XX-XXXXXXX" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                  <input type="text" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]" placeholder="Your city" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Address *</label>
                  <textarea required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]" rows={3} placeholder="House/Flat, Street, Area" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Order Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]" rows={2} placeholder="Any special instructions" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h2 className="font-semibold mb-2">Payment Method</h2>
              <div className="flex items-center gap-3 p-4 border-2 border-[#d4a0a0] rounded-lg bg-[#faf5f0]">
                <div className="w-4 h-4 rounded-full bg-[#d4a0a0]" />
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={item.product.images[0] || '/images/placeholder.jpg'} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.size} / {item.color} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-[#d4a0a0]">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-6 bg-[#d4a0a0] text-white py-3 rounded-full font-medium hover:bg-[#b87d7d] transition-colors disabled:opacity-50">
              {loading ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
