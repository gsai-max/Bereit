import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Badge } from '../common/Badge'

export function DiagnosticLegend() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-2xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/60 transition-colors min-h-[44px]"
        aria-expanded={isOpen}
        aria-controls="diagnostic-legend-content"
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-ink">
          <HelpCircle className="w-4 h-4 text-brand-blue" aria-hidden="true" />
          <span>Wie liest man die 4 Diagnose-Zustände?</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-text-muted" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          id="diagnostic-legend-content"
          className="p-4 pt-0 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed animate-in fade-in"
        >
          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1">
            <Badge state="secure_knowledge" size="sm" />
            <p className="text-gray-700">
              <strong>Richtig + Sicher:</strong> Der Lernstoff sitzt stabil. Kein akuter Wiederholungsbedarf vor der Prüfung.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 space-y-1">
            <Badge state="uncertain_knowledge" size="sm" />
            <p className="text-gray-700">
              <strong>Richtig + Geraten:</strong> Glückstreffer oder instabiles Bauchgefühl. Unter Prüfungsstress fehleranfällig; sollte gefestigt werden.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <Badge state="known_gap" size="sm" />
            <p className="text-gray-700">
              <strong>Falsch + Geraten:</strong> Erkannte Wissenslücke. Sie wussten, dass Sie unsicher sind. Leicht durch gezielte Lerneinheiten zu schließen.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-red-50/50 border border-red-100 space-y-1">
            <Badge state="potential_blind_spot" size="sm" />
            <p className="text-gray-700">
              <strong>Falsch + Sicher:</strong> Gefährliche Fehlannahme (Überzeugung, dass das Falsche richtig sei). Höchste Lernpriorität!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

