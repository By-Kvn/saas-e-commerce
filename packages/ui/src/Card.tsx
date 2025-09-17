import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  padding?: 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
