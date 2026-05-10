import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import SplashScreen from '@/components/SplashScreen'

export const metadata: Metadata = {
  title: `LILOOK — Bijoux d'Exception`,
  description: 'Découvrez notre collection de bijoux artisanaux marocains. Pièces féminines inspirées de la chaleur marocaine.',
  keywords: ['bijoux', 'maroc', 'artisanal', 'bagues', 'colliers', 'bracelets', 'or', 'argent', 'lilook'],
  authors: [{ name: 'LILOOK' }],
  openGraph: {
    title: `LILOOK — Bijoux d'Exception`,
    description: 'Découvrez notre collection de bijoux artisanaux marocains.',
    type: 'website',
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f7f2ec',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-[#f7f2ec] antialiased">
        <SplashScreen />
        <Navbar />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
