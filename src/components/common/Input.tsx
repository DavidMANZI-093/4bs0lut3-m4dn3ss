'use client'

import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white'
  const stateClasses = error 
    ? 'border-[var(--error)] focus:ring-red-200 focus:border-[var(--error)]' 
    : 'border-[var(--border)] focus:ring-blue-200 focus:border-[var(--primary)] hover:border-[var(--primary-hover)]'
  
  const iconClasses = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--text-primary)]"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <Icon size={18} className="text-[var(--text-muted)]" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`${baseClasses} ${stateClasses} ${iconClasses} ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-[var(--error)]">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-[var(--text-muted)]">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input