import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    children,
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  }

  const variantClasses = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-hover active:bg-blue-800 shadow-sm',
    secondary: 'bg-gray-100 text-ink hover:bg-gray-200 active:bg-gray-300 border border-gray-200',
    outline: 'border border-gray-300 bg-white text-ink hover:bg-gray-50 active:bg-gray-100 shadow-sm',
    ghost: 'text-text-muted hover:text-ink hover:bg-gray-100/80 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  }

  return (
    <button
      ref={ref}
      className={twMerge(clsx(baseClasses, sizeClasses[size], variantClasses[variant], className))}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})
