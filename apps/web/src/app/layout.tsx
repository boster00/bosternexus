import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Boster Bio - Life Science Research Products & Services',
  description: 'High-quality antibodies, proteins, ELISA kits, and custom services for life science research. Trusted by researchers worldwide.',
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

