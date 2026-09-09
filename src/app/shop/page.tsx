import ShopClient from './ShopClient'
import type { Product } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'

async function getProducts(category?: string, filter?: string): Promise<Product[]> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    let query = supabase.from('products').select('*')
    if (category && category !== 'all') {
      const match = CATEGORIES.find((c) => c.slug === category)
      if (match) query = query.eq('category', match.name)
    }
    if (filter === 'new') query = query.eq('is_new', true)
    if (filter === 'sale') query = query.eq('is_sale', true)
    const { data } = await query.order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>
}) {
  const params = await searchParams
  const products = await getProducts(params.category, params.filter)

  return <ShopClient products={products} category={params.category} filter={params.filter} />
}
