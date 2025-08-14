'use client'

import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'neutral', 
    size = 'md', 
    className = '', 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center 
      font-medium rounded-full 
      whitespace-nowrap
    `

    const variantStyles = {
      success: `
        bg-[var(--success)] text-white
      `,
      warning: `
        bg-[var(--warning)] text-white
      `,
      error: `
        bg-[var(--error)] text-white
      `,
      info: `
        bg-[var(--secondary)] text-white
      `,
      neutral: `
        bg-[var(--surface)] text-[var(--text-primary)]
        border border-[var(--border)]
      `
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    }

    const combinedClassName = `
      ${baseStyles} 
      ${variantStyles[variant]} 
      ${sizeStyles[size]} 
      ${className}
    `.trim().replace(/\s+/g, ' ')

    return (
      <span
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }