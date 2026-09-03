'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Tag, MessageSquare, LogOut, Menu } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/promotions', label: 'Promotions', icon: Tag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a1a2e] text-white transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-[#e8b4b8]">West Flora</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#d4a0a0] text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <h1 className="font-semibold text-[#1a1a2e]">West Flora Admin</h1>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
