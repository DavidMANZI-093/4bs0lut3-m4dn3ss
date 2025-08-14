'use client'

import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default', 
    padding = 'md', 
    className = '', 
    children, 
    header,
    footer,
    ...props 
  }, ref) => {
    const baseStyles = `
      bg-white rounded-lg 
      border border-[var(--border)]
      transition-all duration-200
    `

    const variantStyles = {
      default: `
        shadow-sm
      `,
      elevated: `
        shadow-md hover:shadow-lg
      `,
      outlined: `
        border-2 border-[var(--primary)]
        shadow-none
      `
    }

    const paddingStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    }

    const combinedClassName = `
      ${baseStyles} 
      ${variantStyles[variant]} 
      ${className}
    `.trim().replace(/\s+/g, ' ')

    return (
      <div
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {header && (
          <div className={`${paddingStyles[padding]} border-b border-[var(--border)] mb-0`}>
            {header}
          </div>
        )}
        
        <div className={header || footer ? paddingStyles[padding] : paddingStyles[padding]}>
          {children}
        </div>
        
        {footer && (
          <div className={`${paddingStyles[padding]} border-t border-[var(--border)] mt-0`}>
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }