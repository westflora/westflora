'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Upload, AlertTriangle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import toast from 'react-hot-toast'

import { CATEGORY_NAMES } from '@/lib/constants'

interface ProductForm {
  name: string; slug: string; description: string; price: string; original_price: string;
  category: string; sizes: string; colors: string; images: string[]; stock: string;
  featured: boolean; is_new: boolean; is_sale: boolean;
}

const emptyForm: ProductForm = {
  name: '', slug: '', description: '', price: '', original_price: '',
  category: 'Tops & Shirts', sizes: 'S,M,L', colors: '', images: [], stock: '0',
  featured: false, is_new: false, is_sale: false,
}

const categories = [...CATEGORY_NAMES]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setNewFiles([])
    setShowModal(true)
  }

  const openEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      name: p.name, slug: p.slug, description: p.description || '',
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
      category: p.category, sizes: (p.sizes || []).join(','), colors: (p.colors || []).join(','),
      images: p.images || [], stock: String(p.stock || 0),
      featured: p.featured, is_new: p.is_new, is_sale: p.is_sale,
    })
    setNewFiles([])
    setShowModal(true)
  }

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return
    const selected = Array.from(files).filter((file) => file.type.startsWith('image/'))
    if (selected.length === 0) {
      toast.error('Please choose image files')
      return
    }
    setNewFiles((prev) => [...prev, ...selected])
  }

  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return []
    const data = new FormData()
    files.forEach((file) => data.append('files', file))
    const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Failed to upload images')
    return json.urls as string[]
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price required'); return }
    setLoading(true)

    try {
      const uploaded = await uploadImages(newFiles)
      const images = [...form.images, ...uploaded]

      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: form.description,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        category: form.category,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
        colors: form.colors ? form.colors.split(',').map(s => s.trim()) : [],
        images,
        stock: parseInt(form.stock) || 0,
        featured: form.featured,
        is_new: form.is_new,
        is_sale: form.is_sale,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId)
        if (error) throw error
        toast.success('Product updated')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        toast.success('Product added')
      }

      setShowModal(false)
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || 'Could not save product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Product deleted'); fetchProducts() }
  }

  const handleDeleteAll = async () => {
    if (products.length === 0) {
      toast.error('No products to delete')
      return
    }

    const confirmed = confirm(
      `Delete ALL ${products.length} products?\n\nThis cannot be undone.`
    )
    if (!confirmed) return

    const doubleCheck = confirm(
      'Final confirmation: permanently delete every product from the store?'
    )
    if (!doubleCheck) return

    setLoading(true)
    try {
      // Detach order history so product rows can be removed
      await supabase
        .from('order_items')
        .update({ product_id: null })
        .not('product_id', 'is', null)

      const { error } = await supabase
        .from('products')
        .delete()
        .not('id', 'is', null)

      if (error) throw error

      toast.success('All products deleted')
      setProducts([])
    } catch (err: any) {
      toast.error(err.message || 'Could not delete all products')
      fetchProducts()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={loading || products.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AlertTriangle size={18} />
            Delete All Products
          </button>
          <button onClick={openAdd} className="bg-[#d4a0a0] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#b87d7d] text-sm">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Product</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Price</th>
              <th className="text-left px-5 py-3 font-medium">Stock</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No products yet. Add your first product!</td></tr>
            ) : products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden relative flex-shrink-0">
                      {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{p.category}</td>
                <td className="px-5 py-3">{formatPrice(p.price)}</td>
                <td className="px-5 py-3">{p.stock}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    {p.is_new && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">New</span>}
                    {p.is_sale && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">Sale</span>}
                    {p.featured && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">Featured</span>}
                  </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add Product'}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Price *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Original Price</label>
                <input type="number" value={form.original_price} onChange={(e) => setForm({...form, original_price: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sizes (comma-separated)</label>
                <input value={form.sizes} onChange={(e) => setForm({...form, sizes: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" placeholder="S,M,L,XL" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Colors (comma-separated)</label>
                <input value={form.colors} onChange={(e) => setForm({...form, colors: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]" placeholder="Black,Navy" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Product Images</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(e.target.files)
                    e.target.value = ''
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#e8b4b8] rounded-xl px-4 py-8 text-sm text-[#8a3a3a] hover:bg-[#faf5f0] transition-colors flex flex-col items-center gap-2"
                >
                  <Upload size={22} />
                  Click to upload images
                  <span className="text-xs text-gray-500">JPG, PNG, or WEBP. You can add more than one.</span>
                </button>

                {(form.images.length > 0 || newFiles.length > 0) && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {form.images.map((src, index) => (
                      <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                        <Image src={src} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })}
                          className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-red-500 hover:bg-white"
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {newFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewFiles(newFiles.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-red-500 hover:bg-white"
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="accent-[#d4a0a0]" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({...form, is_new: e.target.checked})} className="accent-[#d4a0a0]" />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_sale} onChange={(e) => setForm({...form, is_sale: e.target.checked})} className="accent-[#d4a0a0]" />
                  On Sale
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-[#d4a0a0] text-white rounded-lg text-sm hover:bg-[#b87d7d] disabled:opacity-50">
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
