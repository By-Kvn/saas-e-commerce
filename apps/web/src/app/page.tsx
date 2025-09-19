'use client'

import { useState, useEffect } from 'react'
import { Button } from '@saas/ui'
import { ApiResponse } from '@saas/types'
import { ProductCard } from '../components/ProductCard'
import { Navigation } from '../components/Navigation'

export default function HomePage() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<number>(0) // Premier bouton sélectionné par défaut

  // Données des produits
  const products = [
    {
      image: '/images/products/tee-v1-full-erza.png',
      alt: 'T-shirt collection',
      title: 'TeeShirt Store',
      subtitle: 'Collection Premium',
      price: 29.99
    },
    {
      image: '/images/products/era-tee-full-v5.png',
      alt: 'Fashion collection',
      title: 'Mode Urbaine',
      subtitle: 'Nouvelle Collection',
      price: 34.99
    },
    {
      image: '/images/products/CTTPbis.png',
      alt: 'Street wear',
      title: 'Street Wear',
      subtitle: 'Style Urbain',
      price: 32.99
    },
    {
      image: '/images/products/erza-v1-tee-black.png',
      alt: 'Street wear',
      title: 'Street Wear',
      subtitle: 'Style Urbain',
      price: 31.99
    },
    {
      image: '/images/products/WHITE-TEE-ERZA-Colors.png',
      alt: 'Premium collection',
      title: 'Premium',
      subtitle: 'Édition Limitée',
      price: 39.99
    },
    {
      image: '/images/products/v5-clrs-erza-tee.png',
      alt: 'Street wear',
      title: 'Street Wear',
      subtitle: 'Style Urbain',
      price: 36.99
    },
    // {
    //   image: '/images/products/tee-v1-full-erza.png',
    //   alt: 'Vintage style',
    //   title: 'Vintage',
    //   subtitle: 'Rétro Chic'
    // },
    // {
    //   image: '/images/products/tee-v1-full-erza.png',
    //   alt: 'Summer collection',
    //   title: 'Summer',
    //   subtitle: 'Collection Été'
    // }
  ]

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
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="text-white grid grid-cols-6 m-8 gap-6">
      <div className="card aspect-1/1 flex col-span-2 px-4 sm:px-6 lg:px-8 py-10 bg-[#1d1d1d] rounded-clamp">
      <div className='card_content flex just-betwee grow flex-col relative'>
        <h2 className='text-xl text-white'>ERZA v1.0.1</h2>
        <div className='card_description font-light mt-auto'>
          <p>ERZA is a newcomer brand from France, specializing in urban fashion and streetwear.</p>
        </div>
        <div className='card_media absolute'>
        </div>
      </div>
      </div>

      <div className="card h-full col-span-4 px-4 sm:px-6 lg:px-8 py-10 bg-[#2c2c2c] rounded-clamp">
      <div className='card_content flex  grow flex-col relative'>
        <h2 className='text-xl font-bold text-white mb-4'>New Erza's Tee</h2>
        {/* <div className='card_description mt-auto font-sohne font-extralight'>
          <p>Discover digital tools for creatives. A growing collection of Photoshop mockups and Framer components built for modern design workflows.</p>
        </div> */}
        <div className='card_media absolute'>
        </div>
      </div>
      </div>
      </section>

      {/* Featured Categories */}
      <section className="grid grid-cols-6 gap-6 m-8">
        <div
          className={`inline-flex justify-center items-center col-span-2 py-5 px-6 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer ${
            selectedCategory === 0
              ? 'bg-[#1d1d1d] border-[#1d1d1d]'
              : 'bg-transparent border-[#1d1d1d] hover:border-gray-400 hover:bg-[#1d1d1d]/10'
          }`}
          onClick={() => setSelectedCategory(0)}
        >
          <button>Show all</button>
        </div>
        <div
          className={`inline-flex justify-center items-center col-span-2 py-5 px-6 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer ${
            selectedCategory === 1
              ? 'bg-[#1d1d1d] border-[#1d1d1d]'
              : 'bg-transparent border-[#1d1d1d] hover:border-gray-400 hover:bg-[#1d1d1d]/10'
          }`}
          onClick={() => setSelectedCategory(1)}
        >
          <button>Casual</button>
        </div>
        <div
          className={`inline-flex justify-center items-center col-span-2 py-5 px-6 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer ${
            selectedCategory === 2
              ? 'bg-[#1d1d1d] border-[#1d1d1d]'
              : 'bg-transparent border-[#1d1d1d] hover:border-gray-400 hover:bg-[#1d1d1d]/10'
          }`}
          onClick={() => setSelectedCategory(2)}
        >
          <button>Premium</button>
        </div>
        </section>

        {/* Product cards */}
      <section className="grid grid-cols-6 gap-6 m-8">
        {products.map((product, index) => (
          <div key={index} className="col-span-2">
            <ProductCard
              image={product.image}
              alt={product.alt}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
            />
          </div>
        ))}
      </section>


      {/* CTA Section */}
      <section className="text-white grid grid-cols-6 gap-6 m-8 items-center">
        <div className="col-span-2 bg-[#1d1d1d] p-4 rounded-lg flex items-center justify-center h-full">
          <span className="text-white font-medium">Website made by ERZA's CEO</span>
        </div>
        <div className="col-span-2 bg-[#1d1d1d] p-6 rounded-lg">
          {/* <h3 className="text-xl font-bold mb-4">Newsletter</h3> */}
          <p className="text-sm mb-4">Restez informé des dernières nouveautés ERZA</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:border-white/40"
            />
            <button className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-white/90 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
        <div className="col-span-2 bg-[#1d1d1d] p-4 rounded-lg flex items-center justify-center h-full">
          <span className="text-white font-medium">Website made by ERZA's CEO</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">

      </footer>
    </div>
  )
}
