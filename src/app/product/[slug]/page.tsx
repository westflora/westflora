import Link from 'next/link'
import ProductDetailClient from './ProductDetailClient'
import type { Product } from '@/lib/types'

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
    return data || null
  } catch {
    return null
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return (
      <div className="text-center py-20 px-4">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>
        <p className="text-gray-500 mb-6">This product is no longer available.</p>
        <Link href="/shop" className="text-[#d4a0a0] font-medium hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
