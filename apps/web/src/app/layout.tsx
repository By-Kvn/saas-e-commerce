import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '../contexts/AuthContext'
import './globals.css'
import '../styles/fonts.css'

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
      <body className='bg-black'>
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
