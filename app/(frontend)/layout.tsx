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
    icon: [
      { url: '/favicon.png?v=3', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.png?v=3',
    apple: '/favicon.png?v=3',
  },
  openGraph: {
    title: 'Елена Бахарева | Налоговый учет со 100% гарантией',
    description: 'Профессиональный налоговый учет и консультации онлайн по всей России',
    url: 'https://elenafinplan.ru',
    siteName: 'Елена Бахарева — Налоговый учет',
    locale: 'ru_RU',
    type: 'website',
  },
  verification: {
    yandex: 'e283693c8eccecb9',
    google: 'o7A7nm_7nqnjueVQOaeXLr_VHIcZ8yD9b6JRzpigYjQ',
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