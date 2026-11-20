import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'paper' | 'muted'
}

export function Card({
  children,
  className,
  variant = 'paper',
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-xl shadow-sm',
    paper: 'card-paper',
    muted: 'bg-gray-50/70 border border-gray-200 rounded-xl',
  }

  return (
    <div className={twMerge(clsx(variantClasses[variant], 'p-5 sm:p-6', className))} {...props}>
      {children}
    </div>
  )
}

