export const FREE_SHIPPING_THRESHOLD = 5000
export const SHIPPING_FEE = 200

export const WHATSAPP_NUMBER = '03261583258'
export const WHATSAPP_LINK = 'https://wa.me/923261583258'
export const CONTACT_PHONE = '03261583258'

export const INSTAGRAM_URL = 'https://www.instagram.com/westflora.store'
export const TIKTOK_URL = 'https://www.tiktok.com/@westflora.pak'
export const PINTEREST_URL = 'https://pin.it/2pYhesdaZ'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/west-flora-by-sidra/'

export const SOCIAL_LINKS = [
  { name: 'Instagram', href: INSTAGRAM_URL, key: 'instagram' },
  { name: 'TikTok', href: TIKTOK_URL, key: 'tiktok' },
  { name: 'Pinterest', href: PINTEREST_URL, key: 'pinterest' },
  { name: 'LinkedIn', href: LINKEDIN_URL, key: 'linkedin' },
] as const

export const CATEGORIES = [
  { name: 'Tops & Shirts', slug: 'tops-shirts', image: '/images/categories/tops-shirts.webp' },
  { name: 'Skirts', slug: 'skirts', image: '/images/categories/skirts.webp' },
  { name: 'Modest Maxis', slug: 'modest-maxis', image: '/images/categories/modest-maxis.webp' },
  { name: 'Co-ord Sets', slug: 'co-ord-sets', image: '/images/categories/coord-sets.webp' },
  { name: 'Stylish Combos', slug: 'stylish-combos', image: '/images/categories/stylish-combos.webp' },
] as const

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)
