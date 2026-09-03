import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import type { Product } from '@/lib/types'

const categories = ['All', 'Abayas', 'Hijabs', 'Modest Dresses', 'Kurtis', 'Co-ord Sets', 'Accessories']

async function getProducts(category?: string, filter?: string): Promise<Product[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    let query = supabase.from('products').select('*')
    if (category && category !== 'all') query = query.ilike('category', category.replace(/-/g, ' '))
    if (filter === 'new') query = query.eq('is_new', true)
    if (filter === 'sale') query = query.eq('is_sale', true)
    const { data } = await query.order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; filter?: string }> }) {
  const params = await searchParams
  const products = await getProducts(params.category, params.filter)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-2">
          {params.filter === 'new' ? 'New Arrivals' : params.filter === 'sale' ? 'Sale' : 'Shop All'}
        </h1>
        <p className="text-gray-500">Showing {products.length} products</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => {
          const slug = cat === 'All' ? '' : cat.toLowerCase().replace(/ /g, '-')
          const isActive = (!params.category && cat === 'All') || params.category === slug
          return (
            <Link
              key={cat}
              href={slug ? `/shop?category=${slug}${params.filter ? `&filter=${params.filter}` : ''}` : `/shop${params.filter ? `?filter=${params.filter}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#d4a0a0] text-white'
                  : 'bg-white text-gray-600 hover:bg-[#f5d5d8]'
              }`}
            >
              {cat}
            </Link>
          )
        })}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found</p>
          <Link href="/shop" className="text-[#d4a0a0] underline mt-2 inline-block">View all products</Link>
        </div>
      )}
    </div>
  )
}
