import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '../contexts/AuthContext'
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
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
