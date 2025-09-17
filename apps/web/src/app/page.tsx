'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@saas/ui'
import { ApiResponse } from '@saas/types'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { user, logout, isAuthenticated } = useAuth()

  const fetchHello = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/hello`)
      const data: ApiResponse = await response.json()
      setMessage(data.message)
    } catch (error) {
      console.error('Error fetching hello:', error)
      setMessage('Error connecting to API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SafaS Monorepo</h1>
            </div>
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Pricing
              </a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">
                    Bonjour, {user?.name || user?.email}
                  </span>
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={logout} 
                    variant="outline" 
                    size="sm"
                  >
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Modern{' '}
            <span className="text-indigo-600 bg-blue-500">SaaS Boilerplate</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Built with Next.js 15, Fastify, Prisma, and Stripe. The perfect starting point for your next SaaS project.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Next.js 15</h3>
            <p className="text-gray-500 text-sm">Latest React features with App Router</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fastify API</h3>
            <p className="text-gray-500 text-sm">High-performance backend with TypeScript</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">🗄️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prisma ORM</h3>
            <p className="text-gray-500 text-sm">Type-safe database access</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Stripe Ready</h3>
            <p className="text-gray-500 text-sm">Payment processing built-in</p>
          </div>
        </div>

        {/* API Demo Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Live API Demo
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">API Response:</h3>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-gray-500">Loading...</span>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800 font-medium break-words">{message}</p>
                </div>
              )}
            </div>

            <Button 
              onClick={fetchHello} 
              disabled={loading}
              size="lg"
              className="mx-auto"
            >
              {loading ? 'Loading...' : '🔄 Refresh API Call'}
            </Button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Complete Tech Stack
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[
              'TypeScript', 'Turborepo', 'Docker', 'PostgreSQL', 'Redis', 'JWT Auth'
            ].map((tech) => (
              <div key={tech} className="bg-white rounded-lg shadow p-4">
                <span className="text-sm font-medium text-gray-700">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 SaaS Monorepo. Built for Master 2 project.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
