'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      setError('Incorrect password')
      setLoading(false)
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf5f0] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="West Flora" width={80} height={80} className="mx-auto mb-4 h-20 w-20 object-contain rounded-full" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
          <p className="text-gray-500 text-sm">Enter the admin password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4a0a0]"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a0a0] text-white py-3 rounded-lg font-medium hover:bg-[#b87d7d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Enter Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
