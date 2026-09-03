'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, total } = useCartStore()

  useEffect(() => {
    const openDrawer = () => setIsOpen(true)
    const closeDrawer = () => setIsOpen(false)

    window.addEventListener('open-cart-drawer', openDrawer)
    window.addEventListener('close-cart-drawer', closeDrawer)

    return () => {
      window.removeEventListener('open-cart-drawer', openDrawer)
      window.removeEventListener('close-cart-drawer', closeDrawer)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const subtotal = total()
  const shippingFee = subtotal >= 3000 ? 0 : 200
  const grandTotal = subtotal + shippingFee

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close cart drawer"
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-[#f1e3e3] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#b8976a]">Your Cart</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#2d2d2d]">
              Shopping Bag
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 transition-colors hover:bg-[#faf5f0]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-full bg-[#faf5f0] p-5">
              <ShoppingBag size={34} className="text-[#d4a0a0]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#2d2d2d]">Your cart is empty</h3>
            <p className="mb-6 text-sm text-gray-500">
              Add your favorite pieces and they&apos;ll appear here.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#d4a0a0] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#b87d7d]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="rounded-2xl border border-[#f3e4e4] bg-[#fffdfc] p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#f5d5d8]/20">
                      <Image
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="truncate font-medium text-[#2d2d2d]">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {item.size} | {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.size, item.color)
                          }
                          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="font-semibold text-[#8a3a3a]">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>

                        <div className="flex items-center gap-2 rounded-full border border-[#edd7d7] px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="rounded-full p-1 transition-colors hover:bg-[#faf5f0]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="rounded-full p-1 transition-colors hover:bg-[#faf5f0]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f1e3e3] bg-[#fffaf7] px-5 py-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t border-[#ead5d5] pt-3 text-base font-semibold text-[#2d2d2d]">
                  <span>Total</span>
                  <span className="text-[#8a3a3a]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-[#d4a0a0] px-5 py-3 text-center text-sm font-medium text-[#8a3a3a] transition-colors hover:bg-[#f8ebeb]"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-[#8a3a3a] px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#6e2e2e]"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
