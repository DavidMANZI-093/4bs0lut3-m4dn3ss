'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    icon, 
    helperText, 
    className = '', 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const baseStyles = `
      w-full px-3 py-2 
      bg-white border rounded-lg 
      text-[var(--text-primary)] 
      placeholder-[var(--text-muted)]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:bg-[var(--surface)]
    `

    const stateStyles = error 
      ? `
          border-[var(--error)] 
          focus:border-[var(--error)] 
          focus:ring-red-200
        `
      : `
          border-[var(--border)] 
          focus:border-[var(--primary)] 
          focus:ring-blue-200
          hover:border-[var(--primary-hover)]
        `

    const combinedClassName = `
      ${baseStyles} 
      ${stateStyles} 
      ${icon ? 'pl-10' : ''} 
      ${className}
    `.trim().replace(/\s+/g, ' ')

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-[var(--text-muted)] w-4 h-4">
                {icon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={combinedClassName}
            {...props}
          />
          
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <AlertCircle className="w-4 h-4 text-[var(--error)]" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-[var(--error)]">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }