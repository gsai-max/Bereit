import { RotateCcw } from 'lucide-react'
import { Button } from '../common/Button'

export interface RestartCTAProps {
  onRestart: () => void
}

export function RestartCTA({ onRestart }: RestartCTAProps) {
  return (
    <div className="text-center pt-2 pb-6 space-y-3">
      <Button
        variant="primary"
        size="lg"
        onClick={onRestart}
        className="gap-2 px-8 font-semibold shadow-md"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span>Diagnosetest erneut durchführen</span>
      </Button>
      <p className="text-xs text-text-muted">
        Beginnt einen frischen Durchgang und setzt alle vorherigen Antworten zurück.
      </p>
    </div>
  )
}

