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
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white grid grid-cols-6 m-8 gap-6">
      <div className="card aspect-1/1 flex col-span-2 px-4 sm:px-6 lg:px-8 py-10 bg-[#1d1d1d] rounded-clamp">
      <div className='card_content flex just-betwee grow flex-col relative'>
        <h2 className='text-xl font-bold text-white'>099 Supply</h2>
        <div className='card_description mt-auto'>
          <p>Discover digital tools for creatives. A growing collection of Photoshop mockups and Framer components built for modern design workflows.</p>
        </div>
        <div className='card_media absolute'>
        </div>
      </div>
      </div>

      <div className="card h-full col-span-4 px-4 sm:px-6 lg:px-8 py-10 bg-[#2c2c2c] rounded-clamp">
      <div className='card_content flex  grow flex-col relative'>
        <h2 className='text-xl font-bold text-white mb-4'>Titre de la carte</h2>
        <div className='card_description mt-auto'>
          <p>Discover digital tools for creatives. A growing collection of Photoshop mockups and Framer components built for modern design workflows.</p>
        </div>
        <div className='card_media absolute'>
        </div>
      </div>
      </div>
      </section>

      {/* Featured Categories */}
      <section className="grid grid-cols-6 gap-6 m-8">
        <div className="inline-flex justify-center items-center col-span-2 py-5 px-6 bg-gray-800 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border border-transparent rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer hover:bg-gray-700">
        <button>Show all</button>
        </div>
        <div className="inline-flex justify-center items-center col-span-2 py-5 px-6 bg-gray-800 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border border-transparent rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer hover:bg-gray-700">
        <button>Show all</button>
        </div>
        <div className="inline-flex justify-center items-center col-span-2 py-5 px-6 bg-gray-800 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border border-transparent rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer hover:bg-gray-700">
        <button>Show all</button>
        </div>
        </section>

        {/* Product cards */}
      <section className="">
      </section>


      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
       
      </footer>
    </div>
  )
}
