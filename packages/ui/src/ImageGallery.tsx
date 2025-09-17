import React from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  alt, 
  className = '' 
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <svg
          className="w-16 h-16 text-gray-400"
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
    )
  }

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
        <img
          src={images[selectedIndex]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                index === selectedIndex
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
