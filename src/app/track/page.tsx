'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Package, CheckCircle2, Truck, Clock, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const

const statusMeta: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      toast.error('Please enter your track number')
      return
    }

    setLoading(true)
    setSearched(true)
    setOrder(null)
    setItems([])

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .maybeSingle()

      if (error) throw error

      if (!data) {
        toast.error('No order found. Check your track number and try again.')
        setLoading(false)
        return
      }

      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', data.id)

      setOrder(data)
      setItems(orderItems || [])
    } catch (err: any) {
      toast.error(err.message || 'Could not track order')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order
    ? statusSteps.indexOf(order.status as typeof statusSteps[number])
    : -1

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <p className="text-[#b8976a] uppercase tracking-[0.3em] text-xs font-semibold mb-3">Order Tracking</p>
        <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-3">
          Track Your Order
        </h1>
        <p className="text-gray-500">
          Enter your track number to check your order status.
        </p>
      </div>

      <form onSubmit={handleTrack} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#f5d5d8] mb-8">
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Track Number *</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]"
            placeholder="e.g. WF-XXXX-XXXX"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d4a0a0] text-white py-3.5 rounded-full font-medium hover:bg-[#b87d7d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Search size={18} />
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>

      {searched && !loading && !order && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#f5d5d8]">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No order found with this track number.</p>
        </div>
      )}

      {order && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#f5d5d8]">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Track Number</p>
                <h2 className="text-xl font-bold text-[#8a3a3a]">{order.order_number}</h2>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusMeta[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                {statusMeta[order.status]?.label || order.status}
              </span>
            </div>

            {order.status !== 'cancelled' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  {statusSteps.map((step, index) => {
                    const done = currentStepIndex >= index
                    return (
                      <div key={step} className="flex-1 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          done ? 'bg-[#d4a0a0] text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`h-1 flex-1 mx-1 ${currentStepIndex > index ? 'bg-[#d4a0a0]' : 'bg-gray-100'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 capitalize">
                  {statusSteps.map((step) => (
                    <span key={step} className="w-12 sm:w-16 text-center">{step}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-gray-500">City</p>
                <p className="font-medium">{order.city}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-medium uppercase">{order.payment_method}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Shipping Address</p>
                <p className="font-medium">{order.shipping_address}</p>
              </div>
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-bold text-[#8a3a3a]">{formatPrice(Number(order.total))}</p>
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#f5d5d8]">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product_image || '/images/placeholder.jpg'}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.size} / {item.color} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">{formatPrice(Number(item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
