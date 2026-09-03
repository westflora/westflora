import type { Metadata } from 'next'
import { Playfair_Display, Poppins } from 'next/font/google'
import './globals.css'
import StoreChrome from '@/components/StoreChrome'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'West Flora - Elevate Your Closet Story',
  description: 'Premium modest fashion brand. Shop abayas, hijabs, dresses, and more. Cash on delivery available across Pakistan.',
  keywords: ['modest fashion', 'abayas', 'hijabs', 'Pakistani clothing', 'West Flora'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="font-[family-name:var(--font-poppins)] min-h-screen flex flex-col bg-[#faf5f0] text-gray-800 antialiased">
        <Toaster position="top-center" />
        <StoreChrome>{children}</StoreChrome>
      </body>
    </html>
  )
}
