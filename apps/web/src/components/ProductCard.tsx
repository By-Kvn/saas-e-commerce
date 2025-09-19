'use client'

import { useState } from 'react'
import { ProgressiveBlur } from './ProgressiveBlur'
import { motion } from 'framer-motion'

interface ProductCardProps {
  image: string
  alt: string
  title: string
  subtitle: string
  className?: string
}

export function ProductCard({ image, alt, title, subtitle, className = '' }: ProductCardProps) {
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-[4px] cursor-pointer rounded-clamp ${className}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      role="button"
      tabIndex={0}
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
          visible: { opacity: 1 },
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
        <div className='flex flex-col items-start gap-0 px-5 py-4'>
          <p className='text-base font-medium text-white'>{title}</p>
          <span className='text-base text-zinc-300'>{subtitle}</span>
        </div>
      </motion.div>
    </div>
  )
}