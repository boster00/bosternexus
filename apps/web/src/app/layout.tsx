import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BosterNexus - Life Science Research Products',
  description: 'High-quality antibodies, proteins, and ELISA kits for life science research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

