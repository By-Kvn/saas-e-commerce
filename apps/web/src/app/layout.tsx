import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SaaS Monorepo',
  description: 'Modern SaaS application built with Next.js and Fastify',
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
