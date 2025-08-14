'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variantClasses = {
    default: 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]',
    primary: 'bg-[var(--primary)] text-white',
    secondary: 'bg-[var(--secondary)] text-white',
    success: 'bg-[var(--success)] text-white',
    warning: 'bg-[var(--warning)] text-white',
    danger: 'bg-[var(--error)] text-white',
    outline: 'bg-transparent text-[var(--text-primary)] border border-[var(--border)]'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {Icon && <Icon size={iconSizes[size]} />}
      {children}
    </span>
  )
}