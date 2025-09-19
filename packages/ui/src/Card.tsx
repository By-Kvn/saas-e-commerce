import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm'
  const classes = `${baseClasses} ${className}`.trim()

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default Card
