'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: LucideIcon
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
  hover?: boolean
}

export default function Card({ 
  children, 
  title, 
  subtitle,
  icon: Icon,
  className = '', 
  padding = 'md',
  shadow = true,
  hover = false
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const shadowClass = shadow ? 'shadow-sm' : ''
  const hoverClass = hover ? 'hover:shadow-md transition-shadow duration-200' : ''

  return (
    <div className={`bg-[#f2e9e4] rounded-lg border border-[#c9ada7] ${shadowClass} ${hoverClass} ${paddingClasses[padding]} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon size={24} className="text-[#4a4e69]" />}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-[#22223b]">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-[#9a8c98] mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}