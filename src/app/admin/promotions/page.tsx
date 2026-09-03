'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PromoForm {
  title: string; code: string; discount_type: string; discount_value: string;
  min_order: string; start_date: string; end_date: string; is_active: boolean;
}

const emptyForm: PromoForm = {
  title: '', code: '', discount_type: 'percentage', discount_value: '',
  min_order: '', start_date: '', end_date: '', is_active: true,
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PromoForm>(emptyForm)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const fetchPromos = async () => {
    const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
    setPromos(data || [])
  }

  useEffect(() => { fetchPromos() }, [])

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true) }

  const openEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      title: p.title, code: p.code || '', discount_type: p.discount_type,
      discount_value: String(p.discount_value), min_order: p.min_order ? String(p.min_order) : '',
      start_date: p.start_date?.split('T')[0] || '', end_date: p.end_date?.split('T')[0] || '',
      is_active: p.is_active,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.discount_value) { toast.error('Title and discount value required'); return }
    setLoading(true)

    const payload = {
      title: form.title, code: form.code || null, discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order: form.min_order ? parseFloat(form.min_order) : null,
      start_date: form.start_date || new Date().toISOString(),
      end_date: form.end_date || new Date(Date.now() + 30 * 86400000).toISOString(),
      is_active: form.is_active,
    }

    if (editingId) {
      const { error } = await supabase.from('promotions').update(payload).eq('id', editingId)
      if (error) toast.error(error.message); else toast.success('Promotion updated')
    } else {
      const { error } = await supabase.from('promotions').insert(payload)
      if (error) toast.error(error.message); else toast.success('Promotion added')
    }

    setLoading(false); setShowModal(false); fetchPromos()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return
    await supabase.from('promotions').delete().eq('id', id)
    toast.success('Promotion deleted'); fetchPromos()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <button onClick={openAdd} className="bg-[#d4a0a0] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#b87d7d] text-sm">
          <Plus size={18} /> Add Promotion
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Title</th>
              <th className="text-left px-5 py-3 font-medium">Code</th>
              <th className="text-left px-5 py-3 font-medium">Discount</th>
              <th className="text-left px-5 py-3 font-medium">Validity</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {promos.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No promotions yet</td></tr>
            ) : promos.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{p.title}</td>
                <td className="px-5 py-3"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{p.code || '-'}</code></td>
                <td className="px-5 py-3">{p.discount_type === 'percentage' ? `${p.discount_value}%` : formatPrice(p.discount_value)}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-[#d4a0a0]"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Promotion' : 'Add Promotion'}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" placeholder="Summer Sale" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Promo Code</label>
                <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" placeholder="SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({...form, discount_type: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Value *</label>
                  <input type="number" value={form.discount_value} onChange={(e) => setForm({...form, discount_value: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Min Order Amount</label>
                <input type="number" value={form.min_order} onChange={(e) => setForm({...form, min_order: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" placeholder="Optional" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} className="accent-[#d4a0a0]" />
                Active
              </label>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-[#d4a0a0] text-white rounded-lg text-sm hover:bg-[#b87d7d] disabled:opacity-50">
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
