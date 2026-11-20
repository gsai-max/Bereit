import { ArrowLeft, ArrowRight, CheckCheck } from 'lucide-react'
import { Button } from '../common/Button'

export interface NavigationBarProps {
  canContinue: boolean
  isFirstQuestion: boolean
  isLastQuestion: boolean
  onPrevious: () => void
  onNext: () => void
}

export function NavigationBar({
  canContinue,
  isFirstQuestion,
  isLastQuestion,
  onPrevious,
  onNext,
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div>
        {!isFirstQuestion && (
          <Button
            variant="outline"
            size="md"
            onClick={onPrevious}
            className="gap-2 text-xs sm:text-sm min-h-[44px]"
            aria-label="Zurück zur vorherigen Frage"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Zurück</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!canContinue && (
          <span
            className="text-xs text-text-muted hidden sm:inline-block font-medium"
            id="continue-hint"
          >
            Bitte Antwort und Sicherheit wählen
          </span>
        )}

        <Button
          variant="primary"
          size="md"
          disabled={!canContinue}
          aria-disabled={!canContinue}
          aria-describedby={!canContinue ? 'continue-hint' : undefined}
          aria-label={isLastQuestion ? 'Ergebnisse auswerten' : 'Weiter zur nächsten Frage'}
          onClick={onNext}
          className="gap-2 text-xs sm:text-sm font-semibold px-5 min-h-[44px]"
        >
          <span>{isLastQuestion ? 'Ergebnisse auswerten' : 'Weiter'}</span>
          {isLastQuestion ? (
            <CheckCheck className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  )
}

