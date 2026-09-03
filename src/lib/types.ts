export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number | null
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
  featured: boolean
  is_new: boolean
  is_sale: boolean
  stock: number
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  city: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'cod'
  subtotal: number
  shipping_fee: number
  discount: number
  total: number
  items: OrderItem[]
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  size: string
  color: string
  price: number
}

export interface Promotion {
  id: string
  title: string
  code: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order: number | null
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string | null
}
