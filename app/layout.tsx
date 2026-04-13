import type { Metadata, Viewport } from 'next'
import { DM_Sans, Caveat, Playfair_Display } from 'next/font/google'
import { GTMScript, GTMNoScript } from '@/components/analytics/GTMScript'
import './globals.css'

// DM Sans - clean geometric sans-serif matching Figma
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

// Caveat - handwritten signature font for @victorsdou logo (matching Figma)
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script',
  weight: ['400', '500', '600', '700'],
})

// Playfair Display - serif font for headings
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://victorsdou.pe'),
  title: {
    default: 'Victorsdou | Panadería Nórdica de Masa Madre en Lima',
    template: '%s | Victorsdou',
  },
  description: 'Una panadería nórdica de masa madre. Ofrecemos diferentes variedades de pan, masa de pizza, pasteles y galletas, tanto para empresas B2C como B2B en Lima, Perú.',
  keywords: ['pan de masa madre', 'panadería nórdica', 'sourdough Lima', 'pan artesanal', 'Victorsdou'],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://victorsdou.pe',
    siteName: 'Victorsdou',
    title: 'Victorsdou | Panadería Nórdica de Masa Madre',
    description: 'Una panadería nórdica de masa madre en Lima. Pan, pizza, pasteles y galletas artesanales.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Victorsdou' }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#F5F0E8',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'Victorsdou',
  description: 'Panadería nórdica de masa madre en Lima, Perú.',
  url: 'https://victorsdou.pe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${dmSans.variable} ${caveat.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-cream text-charcoal antialiased">
        <GTMNoScript />
        <GTMScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green text-white px-4 py-2 z-50 rounded"
        >
          Ir al contenido principal
        </a>
        {children}
      </body>
    </html>
  )
}
