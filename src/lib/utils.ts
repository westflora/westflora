export function formatPrice(price: number): string {
  return `Rs.${price.toLocaleString('en-PK')}`
}

export function getDiscountPercentage(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function generateOrderNumber(): string {
  const prefix = 'WF'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
