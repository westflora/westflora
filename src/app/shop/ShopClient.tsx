'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

type SortOption = 'best-selling' | 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc'

interface ShopClientProps {
  products: Product[]
  category?: string
  filter?: string
}

export default function ShopClient({ products, category, filter }: ShopClientProps) {
  const [sort, setSort] = useState<SortOption>('date-desc')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'out-of-stock'>('all')
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const sizes = ['S', 'M', 'L']

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const clearFilters = () => {
    setSelectedSizes([])
    setAvailability('all')
    setPriceFrom('')
    setPriceTo('')
    setSort('date-desc')
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (selectedSizes.length > 0) {
      list = list.filter((p) => selectedSizes.some((s) => (p.sizes || []).includes(s)))
    }

    if (availability === 'in-stock') {
      list = list.filter((p) => (p.stock ?? 0) > 0)
    } else if (availability === 'out-of-stock') {
      list = list.filter((p) => (p.stock ?? 0) <= 0)
    }

    const from = priceFrom ? Number(priceFrom) : null
    const to = priceTo ? Number(priceTo) : null
    if (from !== null && !Number.isNaN(from)) {
      list = list.filter((p) => Number(p.price) >= from)
    }
    if (to !== null && !Number.isNaN(to)) {
      list = list.filter((p) => Number(p.price) <= to)
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'best-selling':
          return (b.review_count || 0) - (a.review_count || 0)
        case 'price-asc':
          return Number(a.price) - Number(b.price)
        case 'price-desc':
          return Number(b.price) - Number(a.price)
        case 'date-asc':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        case 'date-desc':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      }
    })

    return list
  }, [products, selectedSizes, availability, priceFrom, priceTo, sort])

  const title =
    filter === 'new'
      ? 'New Arrivals'
      : filter === 'sale'
        ? 'Sale'
        : category
          ? CATEGORIES.find((c) => c.slug === category)?.name || 'Shop'
          : 'Shop All'

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider text-[#8a3a3a]">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`min-w-11 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                selectedSizes.includes(size)
                  ? 'border-[#d4a0a0] bg-[#d4a0a0] text-white'
                  : 'border-gray-200 bg-white hover:border-[#d4a0a0]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider text-[#8a3a3a]">Availability</h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'in-stock', label: 'In stock' },
            { value: 'out-of-stock', label: 'Out of stock' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="availability"
                checked={availability === opt.value}
                onChange={() => setAvailability(opt.value as typeof availability)}
                className="accent-[#d4a0a0]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider text-[#8a3a3a]">Price</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From (Rs)</label>
            <input
              type="number"
              min={0}
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To (Rs)</label>
            <input
              type="number"
              min={0}
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a0a0]"
              placeholder="Any"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full border border-[#d4a0a0] text-[#8a3a3a] py-2.5 rounded-full text-sm font-medium hover:bg-[#faf5f0] transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8 animate-reveal-up">
        <p className="text-[#b8976a] uppercase tracking-[0.3em] text-xs font-semibold mb-2">Collection</p>
        <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2">{title}</h1>
        <p className="text-gray-500">Showing {filtered.length} products</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Link
          href={`/shop${filter ? `?filter=${filter}` : ''}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !category ? 'bg-[#d4a0a0] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-[#f5d5d8]'
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.slug
          return (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}${filter ? `&filter=${filter}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive ? 'bg-[#d4a0a0] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-[#f5d5d8]'
              }`}
            >
              {cat.name}
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden inline-flex items-center justify-center gap-2 bg-white border px-4 py-2.5 rounded-full text-sm font-medium"
        >
          <Filter size={16} /> Filters
        </button>

        <div className="flex items-center gap-2 sm:ml-auto">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <label className="text-sm text-gray-500">Sort by</label>
          <div className="relative inline-flex items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="sort-select appearance-none border border-gray-300 rounded-full pl-4 pr-9 py-2 text-sm bg-white text-[#2d2d2d] focus:outline-none focus:border-[#d4a0a0] cursor-pointer"
            >
              <option value="best-selling">Best Selling</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="date-asc">Date, old to new</option>
              <option value="date-desc">Date, new to old</option>
            </select>
            <ChevronDown
              size={14}
              strokeWidth={2}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block bg-white rounded-2xl border border-[#f5d5d8] p-5 h-fit sticky top-28 animate-scale-in">
          <h2 className="font-bold mb-5 font-[family-name:var(--font-playfair)] text-lg">Filter by</h2>
          {FilterPanel}
        </aside>

        <div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
              {filtered.map((product, i) => (
                <div key={product.id} className="product-card-hover animate-reveal-up" style={{ animationDelay: `${(i % 6) * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#f5d5d8]">
              <p className="text-gray-500 text-lg mb-2">No products match your filters</p>
              {(priceFrom || priceTo) && (
                <p className="text-sm text-gray-400 mb-4">
                  Price range: {priceFrom ? formatPrice(Number(priceFrom)) : 'Any'} – {priceTo ? formatPrice(Number(priceTo)) : 'Any'}
                </p>
              )}
              <button type="button" onClick={clearFilters} className="text-[#d4a0a0] underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Filter by</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {FilterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="w-full mt-4 bg-[#d4a0a0] text-white py-3 rounded-full font-medium"
            >
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
