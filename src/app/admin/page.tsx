'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()

    async function fetchStats() {
      try {
        const [ordersRes, productsRes, pendingRes] = await Promise.all([
          supabase.from('orders').select('total'),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        ])

        const orders = ordersRes.data || []
        setStats({
          orders: orders.length,
          revenue: orders.reduce((s: number, o: any) => s + Number(o.total), 0),
          products: productsRes.count || 0,
          pending: pendingRes.count || 0,
        })

        const { data: recent } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10)
        setRecentOrders(recent || [])
      } catch {}
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#d4a0a0] hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Order #</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No orders yet</td></tr>
              ) : recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{order.order_number}</td>
                  <td className="px-5 py-3">{order.customer_name}</td>
                  <td className="px-5 py-3">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
