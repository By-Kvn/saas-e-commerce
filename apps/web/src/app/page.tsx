'use client'

import { useState, useEffect } from 'react'
import { Button } from '@saas/ui'
import { ApiResponse } from '@saas/types'
import { ProductCard } from '../components/ProductCard'

export default function HomePage() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<number>(0) // Premier bouton sélectionné par défaut

  // Données des produits
  const products = [
    {
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      alt: 'T-shirt collection',
      title: 'TeeShirt Store',
      subtitle: 'Collection Premium'
    },
    {
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
      alt: 'Fashion collection',
      title: 'Mode Urbaine',
      subtitle: 'Nouvelle Collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
      alt: 'Street wear',
      title: 'Street Wear',
      subtitle: 'Style Urbain'
    },
    {
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
      alt: 'Street wear',
      title: 'Street Wear',
      subtitle: 'Style Urbain'
    },
    {
      image: 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=600',
      alt: 'Premium collection',
      title: 'Premium',
      subtitle: 'Édition Limitée'
    },
    {
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
      alt: 'Street wear',
      title: 'Street Wear',
      subtitle: 'Style Urbain'
    },
    {
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
      alt: 'Vintage style',
      title: 'Vintage',
      subtitle: 'Rétro Chic'
    },
    {
      image: 'https://images.unsplash.com/photo-1544957992-20514f595d6f?w=600',
      alt: 'Summer collection',
      title: 'Summer',
      subtitle: 'Collection Été'
    }
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
      {/* Header */}
      <header className="bg-black">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">ERZA/Nxst</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-white">
                Accueil
              </a>
              <a href="/products" className="text-white">
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
      <section className="text-white grid grid-cols-6 m-8 gap-6">
      <div className="card aspect-1/1 flex col-span-2 px-4 sm:px-6 lg:px-8 py-10 bg-[#1d1d1d] rounded-clamp">
      <div className='card_content flex just-betwee grow flex-col relative'>
        <h2 className='text-xl text-white'>099 Supply</h2>
        <div className='card_description font-light mt-auto'>
          <p>Discover digital tools for creatives. A growing collection of Photoshop mockups and Framer components built for modern design workflows.</p>
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
              : 'bg-transparent border-gray-400 hover:border-[#1d1d1d] hover:bg-[#1d1d1d]/10'
          }`}
          onClick={() => setSelectedCategory(0)}
        >
          <button>Show all</button>
        </div>
        <div 
          className={`inline-flex justify-center items-center col-span-2 py-5 px-6 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer ${
            selectedCategory === 1 
              ? 'bg-[#1d1d1d] border-[#1d1d1d]' 
              : 'bg-transparent border-gray-400 hover:border-[#1d1d1d] hover:bg-[#1d1d1d]/10'
          }`}
          onClick={() => setSelectedCategory(1)}
        >
          <button>Casual</button>
        </div>
        <div 
          className={`inline-flex justify-center items-center col-span-2 py-5 px-6 text-white text-center no-underline select-none transition-all duration-150 ease-in-out border rounded-[clamp(0.625rem,0.546875rem+0.390625vw,0.9375rem)] cursor-pointer ${
            selectedCategory === 2 
              ? 'bg-[#1d1d1d] border-[#1d1d1d]' 
              : 'bg-transparent border-gray-400 hover:border-[#1d1d1d] hover:bg-[#1d1d1d]/10'
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
            />
          </div>
        ))}
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
