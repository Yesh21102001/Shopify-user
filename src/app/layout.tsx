import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jost',
})

export const metadata: Metadata = {
  title: { default: 'Minimog Store', template: '%s | Minimog Store' },
  description: 'Discover the latest fashion and lifestyle products.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable}>
      <body style={{ fontFamily: 'var(--font-jost, Jost), sans-serif' }}>
        <Providers>
          <AnnouncementBar />
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
