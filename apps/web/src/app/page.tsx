'use client'

import { useState, useEffect } from 'react'
import { Button } from '@saas/ui'
import { ApiResponse } from '@saas/types'

export default function HomePage() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TeeShirt Store</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-900 hover:text-gray-600">
                Accueil
              </a>
              <a href="/products" className="text-gray-900 hover:text-gray-600">
                Produits
              </a>
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        
      </section>

      {/* Featured Categories */}
      <section className="py-16">
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                TeeShirt Store
              </h3>
              <p className="text-gray-600">
                Votre boutique de t-shirts de qualité premium avec des designs uniques.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Produits
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">T-Shirts Homme</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">T-Shirts Femme</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">Nouveautés</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">Contact</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">FAQ</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">Livraison</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Suivez-nous
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Facebook
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 TeeShirt Store. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
