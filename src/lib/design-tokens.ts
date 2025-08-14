/**
 * Design System Tokens
 * Centralized design tokens for consistent styling across the application
 * Uses CSS custom properties defined in globals.css
 */

export const designTokens = {
  colors: {
    // Use CSS custom properties for colors (already defined in globals.css)
    primary: 'var(--primary)',
    primaryHover: 'var(--primary-hover)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
    background: 'var(--background)',
    surface: 'var(--surface)',
    border: 'var(--border)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    textMuted: 'var(--text-muted)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
    
    // Direct color references for specific use cases
    spaceCadet: {
      DEFAULT: 'var(--space-cadet)',
      100: 'var(--space-cadet-100)',
      200: 'var(--space-cadet-200)',
      300: 'var(--space-cadet-300)',
      400: 'var(--space-cadet-400)',
      500: 'var(--space-cadet-500)',
      600: 'var(--space-cadet-600)',
      700: 'var(--space-cadet-700)',
      800: 'var(--space-cadet-800)',
      900: 'var(--space-cadet-900)'
    },
    ultraViolet: {
      DEFAULT: 'var(--ultra-violet)',
      100: 'var(--ultra-violet-100)',
      200: 'var(--ultra-violet-200)',
      300: 'var(--ultra-violet-300)',
      400: 'var(--ultra-violet-400)',
      500: 'var(--ultra-violet-500)',
      600: 'var(--ultra-violet-600)',
      700: 'var(--ultra-violet-700)',
      800: 'var(--ultra-violet-800)',
      900: 'var(--ultra-violet-900)'
    },
    roseQuartz: {
      DEFAULT: 'var(--rose-quartz)',
      100: 'var(--rose-quartz-100)',
      200: 'var(--rose-quartz-200)',
      300: 'var(--rose-quartz-300)',
      400: 'var(--rose-quartz-400)',
      500: 'var(--rose-quartz-500)',
      600: 'var(--rose-quartz-600)',
      700: 'var(--rose-quartz-700)',
      800: 'var(--rose-quartz-800)',
      900: 'var(--rose-quartz-900)'
    },
    paleDogwood: {
      DEFAULT: 'var(--pale-dogwood)',
      100: 'var(--pale-dogwood-100)',
      200: 'var(--pale-dogwood-200)',
      300: 'var(--pale-dogwood-300)',
      400: 'var(--pale-dogwood-400)',
      500: 'var(--pale-dogwood-500)',
      600: 'var(--pale-dogwood-600)',
      700: 'var(--pale-dogwood-700)',
      800: 'var(--pale-dogwood-800)',
      900: 'var(--pale-dogwood-900)'
    },
    isabelline: {
      DEFAULT: 'var(--isabelline)',
      100: 'var(--isabelline-100)',
      200: 'var(--isabelline-200)',
      300: 'var(--isabelline-300)',
      400: 'var(--isabelline-400)',
      500: 'var(--isabelline-500)',
      600: 'var(--isabelline-600)',
      700: 'var(--isabelline-700)',
      800: 'var(--isabelline-800)',
      900: 'var(--isabelline-900)'
    }
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem'     // 96px
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem'       // 48px
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',     // 2px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
} as const

// Component size variants
export const sizeVariants = {
  button: {
    sm: {
      padding: '0.5rem 0.75rem',
      fontSize: designTokens.typography.fontSizes.sm,
      height: '2rem'
    },
    md: {
      padding: '0.75rem 1rem',
      fontSize: designTokens.typography.fontSizes.base,
      height: '2.5rem'
    },
    lg: {
      padding: '1rem 1.5rem',
      fontSize: designTokens.typography.fontSizes.lg,
      height: '3rem'
    }
  },
  input: {
    sm: {
      padding: '0.5rem 0.75rem',
      fontSize: designTokens.typography.fontSizes.sm,
      height: '2rem'
    },
    md: {
      padding: '0.75rem 1rem',
      fontSize: designTokens.typography.fontSizes.base,
      height: '2.5rem'
    },
    lg: {
      padding: '1rem 1.25rem',
      fontSize: designTokens.typography.fontSizes.lg,
      height: '3rem'
    }
  },
  badge: {
    sm: {
      padding: '0.25rem 0.5rem',
      fontSize: designTokens.typography.fontSizes.xs
    },
    md: {
      padding: '0.375rem 0.75rem',
      fontSize: designTokens.typography.fontSizes.sm
    },
    lg: {
      padding: '0.5rem 1rem',
      fontSize: designTokens.typography.fontSizes.base
    }
  }
} as const

// Icon sizes
export const iconSizes = {
  xs: '0.75rem',    // 12px
  sm: '1rem',       // 16px
  md: '1.25rem',    // 20px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem'     // 48px
} as const