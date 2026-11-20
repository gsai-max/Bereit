import { RotateCcw } from 'lucide-react'
import { Button } from '../common/Button'
import type { AppScreen } from '../../types/diagnostic'

export interface HeaderProps {
  currentScreen: AppScreen
  onRestartClick: () => void
}

export function Header({ currentScreen, onRestartClick }: HeaderProps) {
  const showRestart = currentScreen === 'assessment' || currentScreen === 'results'

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-black tracking-tight text-ink">Bereit?</span>
          <span className="hidden sm:inline text-sm text-text-muted italic">
            Know before you book.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-100 hidden xs:inline-block">
            Goethe & ÖSD A1 Pre-Check
          </span>

          {showRestart && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestartClick}
              className="text-xs gap-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 min-h-[44px] px-2.5"
              aria-label="Diagnosetest neu starten"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Neu starten</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

