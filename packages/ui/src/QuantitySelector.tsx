import React from 'react'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  disabled?: boolean
  className?: string
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
  className = ''
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className={`flex items-center border border-gray-300 rounded-md ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className="w-16 text-center border-0 focus:ring-0 focus:outline-none disabled:bg-gray-50"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
