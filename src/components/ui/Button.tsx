'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { designTokens, sizeVariants } from '@/lib/design-tokens'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    children, 
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 
      font-medium rounded-lg transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `

    const variantStyles = {
      primary: `
        bg-[var(--primary)] text-white 
        hover:bg-[var(--primary-hover)] 
        focus:ring-[var(--primary)]
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-[var(--secondary)] text-white 
        hover:bg-[var(--ultra-violet-600)] 
        focus:ring-[var(--secondary)]
        shadow-sm hover:shadow-md
      `,
      outline: `
        bg-transparent text-[var(--primary)] 
        border-2 border-[var(--primary)] 
        hover:bg-[var(--primary)] hover:text-white 
        focus:ring-[var(--primary)]
      `,
      ghost: `
        bg-transparent text-[var(--primary)] 
        hover:bg-[var(--surface)] 
        focus:ring-[var(--primary)]
      `,
      destructive: `
        bg-[var(--error)] text-white 
        hover:bg-red-700 
        focus:ring-[var(--error)]
        shadow-sm hover:shadow-md
      `
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-base h-10',
      lg: 'px-6 py-3 text-lg h-12'
    }

    const combinedClassName = `
      ${baseStyles} 
      ${variantStyles[variant]} 
      ${sizeStyles[size]} 
      ${className}
    `.trim().replace(/\s+/g, ' ')

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="flex items-center">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }