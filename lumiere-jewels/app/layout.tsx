import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lumière — Bijoux d\'Exception',
  description: 'Découvrez notre collection de bijoux artisanaux marocains.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}