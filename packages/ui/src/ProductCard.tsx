import React from 'react'
import { Product } from '@saas/types'
import Badge from './Badge'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onViewProduct?: (productId: string) => void
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewProduct,
  className = '' 
}) => {
  const handleCardClick = () => {
    onViewProduct?.(product.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(product.id)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return (
    <div 
      className={`group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${className}`}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Featured Badge */}
        <div className="flex items-center justify-between mb-2">
          {product.category && (
            <Badge variant="secondary" size="sm">
              {product.category.name}
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="warning" size="sm">
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Short Description */}
        {product.shortDesc && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDesc}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          
          {/* Discount Percentage */}
          {product.comparePrice && product.comparePrice > product.price && (
            <Badge variant="error" size="sm">
              -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 2 && (
              <Badge variant="default" size="sm">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

export default ProductCard
