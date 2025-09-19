import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, type = 'text', ...props }, ref) => {
    const baseClasses = `
      w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
      placeholder-gray-600 text-gray-900 bg-white
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      transition-colors duration-200
    `.trim().replace(/\s+/g, ' ')

    const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
    
    const inputClasses = `${baseClasses} ${errorClasses} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
