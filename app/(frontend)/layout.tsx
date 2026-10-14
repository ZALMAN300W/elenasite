import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ScrollToTop from '@/components/ScrollToTop'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Елена Бахарева | Налоговый учет со 100% гарантией',
  description: 'Профессиональный налоговый учет, декларации 3-НДФЛ, налоговые вычеты и консультации для физических лиц и бизнеса.',
  keywords: ['налоговый учет', 'Елена Бахарева', 'налоговый консультант', '3-НДФЛ', 'налоговый вычет'],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Елена Бахарева | Налоговый учет со 100% гарантией',
    description: 'Профессиональный налоговый учет и консультации онлайн по всей России',
    url: 'https://elenafinplan.ru',
    siteName: 'Елена Бахарева — Налоговый учет',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}