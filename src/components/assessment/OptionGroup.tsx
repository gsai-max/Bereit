import React, { useRef } from 'react'
import { clsx } from 'clsx'
import type { QuestionOption } from '../../types/diagnostic'

export interface OptionGroupProps {
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  selectedOptionId?: string
  onSelectOption: (optionId: string) => void
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export function OptionGroup({
  options,
  selectedOptionId,
  onSelectOption,
  ariaLabelledBy,
  ariaDescribedBy,
}: OptionGroupProps) {
  const optionLetters = ['A', 'B', 'C', 'D']
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = (index + 1) % options.length
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = (index - 1 + options.length) % options.length
    }

    if (nextIndex >= 0) {
      buttonRefs.current[nextIndex]?.focus()
      onSelectOption(options[nextIndex].id)
    }
  }

  return (
    <div
      className="space-y-2.5"
      role="radiogroup"
      aria-label="Antwortoptionen"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {options.map((option, idx) => {
        const isSelected = selectedOptionId === option.id
        const letter = optionLetters[idx]

        return (
          <button
            key={option.id}
            ref={(el) => {
              buttonRefs.current[idx] = el
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (!selectedOptionId && idx === 0) ? 0 : -1}
            onClick={() => onSelectOption(option.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={clsx(
              'w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150',
              'flex items-center gap-3.5 group select-none min-h-[52px]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
              isSelected
                ? 'border-brand-blue bg-blue-50/50 shadow-xs ring-1 ring-brand-blue/30'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            )}
          >
            {/* Radio indicator circle with letter */}
            <div
              className={clsx(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0',
                isSelected
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
              )}
            >
              {letter}
            </div>

            {/* Option text */}
            <span
              className={clsx(
                'text-sm sm:text-base leading-snug flex-1 hyphens-german',
                isSelected ? 'font-semibold text-ink' : 'font-normal text-gray-800'
              )}
            >
              {option.text}
            </span>
          </button>
        )
      })}
    </div>
  )
}

