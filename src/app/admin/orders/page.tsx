'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])

  const supabase = createClient()

  const fetchOrders = async () => {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setOrders(data || [])
  }

  useEffect(() => { fetchOrders() }, [filter])

  const viewOrder = async (order: any) => {
    setSelectedOrder(order)
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id)
    setOrderItems(data || [])
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId)
    if (error) toast.error(error.message)
    else { toast.success(`Status updated to ${newStatus}`); fetchOrders(); if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus }) }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-[#d4a0a0] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Order #</th>
              <th className="text-left px-5 py-3 font-medium">Customer</th>
              <th className="text-left px-5 py-3 font-medium">Phone</th>
              <th className="text-left px-5 py-3 font-medium">City</th>
              <th className="text-left px-5 py-3 font-medium">Total</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No orders found</td></tr>
            ) : orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{order.order_number}</td>
                <td className="px-5 py-3">{order.customer_name}</td>
                <td className="px-5 py-3">{order.customer_phone}</td>
                <td className="px-5 py-3">{order.city}</td>
                <td className="px-5 py-3">{formatPrice(order.total)}</td>
                <td className="px-5 py-3">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs focus:outline-none focus:border-[#d4a0a0]">
                    {statuses.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => viewOrder(order)} className="p-1.5 text-gray-500 hover:text-[#d4a0a0]"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-1">Order {selectedOrder.order_number}</h2>
            <p className="text-sm text-gray-500 mb-6">{new Date(selectedOrder.created_at).toLocaleString()}</p>

            <div className="space-y-2 text-sm mb-6">
              <p><span className="font-medium">Customer:</span> {selectedOrder.customer_name}</p>
              <p><span className="font-medium">Phone:</span> {selectedOrder.customer_phone}</p>
              <p><span className="font-medium">Email:</span> {selectedOrder.customer_email || '-'}</p>
              <p><span className="font-medium">City:</span> {selectedOrder.city}</p>
              <p><span className="font-medium">Address:</span> {selectedOrder.shipping_address}</p>
              {selectedOrder.notes && <p><span className="font-medium">Notes:</span> {selectedOrder.notes}</p>}
            </div>

            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-2 mb-6">
              {orderItems.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-gray-500">{item.size} / {item.color} × {item.quantity}</p>
                  </div>
                  <p>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(selectedOrder.shipping_fee)}</span></div>
              {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(selectedOrder.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-[#d4a0a0]">{formatPrice(selectedOrder.total)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
