'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, total } = useCartStore()

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="max-w-4xl mx-auto px-4 py-20 text-center">Loading...</div>

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className="bg-[#d4a0a0] text-white px-8 py-3 rounded-full hover:bg-[#b87d7d] transition-colors font-medium">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const subtotal = total()
  const shippingFee = subtotal >= 3000 ? 0 : 200
  const grandTotal = subtotal + shippingFee

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-white rounded-xl p-4 flex gap-4">
              <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.product.images[0] || '/images/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                <p className="font-semibold text-[#d4a0a0] mt-1">{formatPrice(item.product.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)} className="p-1 border rounded">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)} className="p-1 border rounded">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span></div>
            {shippingFee > 0 && <p className="text-xs text-[#b8976a]">Add {formatPrice(3000 - subtotal)} more for free delivery</p>}
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total</span><span className="text-[#d4a0a0]">{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block mt-6 bg-[#d4a0a0] text-white text-center py-3 rounded-full font-medium hover:bg-[#b87d7d] transition-colors">
            Proceed to Checkout
          </Link>
          <p className="text-center text-xs text-gray-500 mt-3">Cash on Delivery</p>
        </div>
      </div>
    </div>
  )
}
