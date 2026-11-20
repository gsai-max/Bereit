import React, { useRef } from 'react'
import { Check, HelpCircle } from 'lucide-react'
import { clsx } from 'clsx'
import type { ConfidenceLevel } from '../../types/diagnostic'

export interface ConfidenceSelectorProps {
  confidence?: ConfidenceLevel
  onSelectConfidence: (level: ConfidenceLevel) => void
  disabled?: boolean
}

export function ConfidenceSelector({
  confidence,
  onSelectConfidence,
  disabled = false,
}: ConfidenceSelectorProps) {
  const sureBtnRef = useRef<HTMLButtonElement>(null)
  const guessedBtnRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent, currentLevel: ConfidenceLevel) => {
    if (disabled) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (currentLevel === 'sure') {
        guessedBtnRef.current?.focus()
        onSelectConfidence('guessed')
      } else {
        sureBtnRef.current?.focus()
        onSelectConfidence('sure')
      }
    }
  }

  return (
    <div
      className={clsx(
        'rounded-xl border p-4 sm:p-5 transition-all duration-200 space-y-3',
        disabled
          ? 'opacity-40 pointer-events-none bg-gray-50 border-gray-200'
          : 'bg-white border-blue-100 shadow-xs'
      )}
      aria-live="polite"
    >
      <div>
        <p id="confidence-legend" className="text-sm font-bold text-ink">
          Wie sicher bist du dir bei dieser Antwort?
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          Ehrliche Angabe: Hilft dabei, echtes Wissen von zufälligen Glückstreffern zu unterscheiden.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        role="group"
        aria-labelledby="confidence-legend"
      >
        {/* Sure Button */}
        <button
          ref={sureBtnRef}
          type="button"
          aria-pressed={confidence === 'sure'}
          disabled={disabled}
          onClick={() => onSelectConfidence('sure')}
          onKeyDown={(e) => handleKeyDown(e, 'sure')}
          className={clsx(
            'flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all min-h-[44px]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
            confidence === 'sure'
              ? 'bg-emerald-50 border-state-secure text-emerald-950 shadow-xs ring-1 ring-state-secure/30'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          )}
        >
          <Check className="w-4 h-4 text-state-secure flex-shrink-0" aria-hidden="true" />
          <span>Sicher (Sure)</span>
        </button>

        {/* Guessed Button */}
        <button
          ref={guessedBtnRef}
          type="button"
          aria-pressed={confidence === 'guessed'}
          disabled={disabled}
          onClick={() => onSelectConfidence('guessed')}
          onKeyDown={(e) => handleKeyDown(e, 'guessed')}
          className={clsx(
            'flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all min-h-[44px]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
            confidence === 'guessed'
              ? 'bg-amber-50 border-state-uncertain text-amber-950 shadow-xs ring-1 ring-state-uncertain/30'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
          )}
        >
          <HelpCircle className="w-4 h-4 text-state-uncertain flex-shrink-0" aria-hidden="true" />
          <span>Ich habe geraten (I guessed)</span>
        </button>
      </div>
    </div>
  )
}

