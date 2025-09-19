'use client'

import { useState } from 'react'
import { ProgressiveBlur } from './ProgressiveBlur'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'

interface ProductCardProps {
  image: string
  alt: string
  title: string
  subtitle: string
  price: number
  className?: string
}

export function ProductCard({ image, alt, title, subtitle, price, className = '' }: ProductCardProps) {
  const [isHover, setIsHover] = useState(false)
  const { addToCart } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      title,
      subtitle,
      price,
      image
    })
    addToast({
      type: 'success',
      message: `"${title}" ajouté au panier !`,
      duration: 3000
    })
  }

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-[4px] bg-[#2c2c2c] cursor-pointer rounded-clamp ${className}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={image}
        alt={alt}
        className='absolute inset-0 w-full h-full object-cover'
      />
      <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[40%] w-full'
        blurIntensity={1.5}
        direction="bottom"
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 0 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.div
        className='absolute bottom-0 left-0'
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className='flex items-start justify-between gap-3 px-5 py-4'>
          <div className='flex flex-col items-start gap-0'>
            <p className='text-base font-medium text-white'>{title}</p>
            <span className='text-base text-zinc-300'>{subtitle}</span>
            <span className='text-lg font-bold text-white mt-2'>{price.toFixed(2)} €</span>
          </div>
          <button
            className='bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200 flex-shrink-0'
            onClick={handleAddToCart}
            aria-label="Ajouter au panier"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9m-9-6h10"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
