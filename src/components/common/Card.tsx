'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
}

export default function Card({ 
  children, 
  title, 
  className = '', 
  padding = 'md',
  shadow = true 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const shadowClass = shadow ? 'card-shadow' : ''

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${shadowClass} ${paddingClasses[padding]} ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}