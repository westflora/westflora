'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const statuses = ['all', 'new', 'read', 'replied', 'archived']

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<any>(null)

  const supabase = createClient()

  const fetchMessages = async () => {
    let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setMessages(data || [])
  }

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success(`Marked as ${status}`)
      fetchMessages()
      if (selected?.id === id) setSelected({ ...selected, status })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success('Message deleted')
      setSelected(null)
      fetchMessages()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-[#d4a0a0] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Phone</th>
              <th className="text-left px-5 py-3 font-medium">Message</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No messages yet
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{msg.name}</td>
                  <td className="px-5 py-3">{msg.phone}</td>
                  <td className="px-5 py-3 max-w-xs truncate text-gray-600">{msg.message}</td>
                  <td className="px-5 py-3">
                    <select
                      value={msg.status}
                      onChange={(e) => updateStatus(msg.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs focus:outline-none focus:border-[#d4a0a0]"
                    >
                      {statuses.filter((s) => s !== 'all').map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(msg)} className="p-1.5 text-gray-500 hover:text-[#d4a0a0]">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-1">Message from {selected.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{new Date(selected.created_at).toLocaleString()}</p>

            <div className="space-y-2 text-sm mb-6">
              <p><span className="font-medium">Phone:</span> {selected.phone}</p>
              <p><span className="font-medium">Email:</span> {selected.email || '-'}</p>
              <p><span className="font-medium">Status:</span> {selected.status}</p>
            </div>

            <div className="bg-[#faf5f0] rounded-xl p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{selected.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
