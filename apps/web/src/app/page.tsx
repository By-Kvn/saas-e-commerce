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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/hello`)
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
            <nav className="flex space-x-4 items-center">
              <a href="/" className="text-gray-900 hover:text-gray-600">
                Accueil
              </a>
              <a href="/products" className="text-gray-900 hover:text-gray-600">
                Produits
              </a>
              <a href="/login" className="text-gray-600 hover:text-gray-900">
                Se connecter
              </a>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => window.location.href = '/register'}
              >
                S'inscrire
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Collection T-Shirts 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Découvrez nos designs uniques et notre qualité premium
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 hover:bg-gray-100">
                Voir la collection
              </button>
              <button 
                className="border-white text-white hover:bg-white hover:text-purple-600"
              >
                Nouveautés
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nos Catégories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'T-Shirts Homme',
                description: 'Designs modernes et confortables',
                image: '/api/placeholder/400/300',
              },
              {
                title: 'T-Shirts Femme',
                description: 'Coupes flatteuses et styles variés',
                image: '/api/placeholder/400/300',
              },
              {
                title: 'Éditions Limitées',
                description: 'Designs exclusifs en quantité limitée',
                image: '/api/placeholder/400/300',
              },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <button  className="w-full">
                    Explorer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez notre communauté
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Recevez nos nouveautés et offres exclusives
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="votre.email@exemple.com"
              className="flex-1 px-4 py-2 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
              onClick={() => window.location.href = '/register'}
            >
              S'inscrire
            </Button>
          </div>
        </div>
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
