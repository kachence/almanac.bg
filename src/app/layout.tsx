import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { AuthHandler } from '@/components/auth-handler'
import { ToastProvider } from '@/components/ui/toast'
import './globals.css'
import '@/lib/fontawesome'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Almanac.bg — Имен ден, празници и календар за България',
  description: 'Виж кой празнува днес, официални неработни дни, православни празници и работен календар. Картички и напомняния за важни дати.',
  keywords: 'имен ден, именник, празници, календар, официални празници, неработни дни, картички, поздрави, български празници',
  authors: [{ name: 'almanac.bg' }],
  creator: 'almanac.bg',
  publisher: 'almanac.bg',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://almanac.bg',
    siteName: 'almanac.bg',
    title: 'almanac.bg — Имен ден, празници и календар за България',
    description: 'Виж кой празнува днес, официални неработни дни, православни празници и работен календар. Картички и напомняния за важни дати.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Almanac.bg - Имен ден, празници и календар',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@almanac_bg',
    creator: '@almanac_bg',
    title: 'Almanac.bg — Имен ден, празници и календар за България',
    description: 'Виж кой празнува днес, официални неработни дни и работен календар за България.',
    images: '/og-image.png',
  },
  alternates: {
    canonical: 'https://almanac.bg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10B3B6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`min-h-screen bg-bg text-fg antialiased ${inter.variable}`} suppressHydrationWarning>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <AuthProvider>
              <AuthHandler />
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
