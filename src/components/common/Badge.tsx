import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CheckCircle2, HelpCircle, MinusCircle, AlertTriangle } from 'lucide-react'
import type { DiagnosticState } from '../../types/diagnostic'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  state?: DiagnosticState
  size?: 'sm' | 'md'
  showIcon?: boolean
  label?: string
  children?: React.ReactNode
}

export function Badge({
  state,
  size = 'md',
  showIcon = true,
  label,
  children,
  className,
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
  }

  if (state) {
    const config = {
      secure_knowledge: {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        icon: CheckCircle2,
        iconColor: 'text-state-secure',
        defaultLabel: 'Sicheres Wissen',
      },
      uncertain_knowledge: {
        bg: 'bg-amber-50 text-amber-950 border-amber-300',
        icon: HelpCircle,
        iconColor: 'text-state-uncertain',
        defaultLabel: 'Unsicheres Wissen',
      },
      known_gap: {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        icon: MinusCircle,
        iconColor: 'text-state-gap',
        defaultLabel: 'Bekannte Lücke',
      },
      potential_blind_spot: {
        bg: 'bg-red-50 text-red-900 border-red-300',
        icon: AlertTriangle,
        iconColor: 'text-state-blindspot',
        defaultLabel: 'Blinder Fleck',
      },
    }[state]

    const Icon = config.icon

    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center font-semibold rounded-full border select-none',
            sizeClasses[size],
            config.bg,
            className
          )
        )}
        {...props}
      >
        {showIcon && (
          <Icon
            className={clsx('w-3.5 h-3.5 flex-shrink-0', config.iconColor)}
            aria-hidden="true"
          />
        )}
        <span>{children || label || config.defaultLabel}</span>
      </span>
    )
  }

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium rounded-full border bg-gray-50 text-gray-700 border-gray-200 select-none',
          sizeClasses[size],
          className
        )
      )}
      {...props}
    >
      {children || label}
    </span>
  )
}

