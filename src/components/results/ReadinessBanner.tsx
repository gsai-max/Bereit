import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'
import type { ReadinessEvaluation } from '../../types/diagnostic'

export interface ReadinessBannerProps {
  readiness: ReadinessEvaluation
  totalCorrect: number
  totalQuestions: number
  totalBlindSpots: number
}

export function ReadinessBanner({
  readiness,
  totalCorrect,
  totalQuestions,
  totalBlindSpots,
}: ReadinessBannerProps) {
  const config = {
    ready_to_consider_booking: {
      bg: 'bg-emerald-50 border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-state-secure',
    },
    practise_before_booking: {
      bg: 'bg-red-50/80 border-red-300',
      badgeBg: 'bg-red-100 text-red-900 border-red-300',
      icon: AlertTriangle,
      iconColor: 'text-state-blindspot',
    },
    almost_there: {
      bg: 'bg-amber-50/80 border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Sparkles,
      iconColor: 'text-state-uncertain',
    },
  }[readiness.category]

  const Icon = config.icon

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 space-y-4 shadow-sm ${config.bg}`}
      role="region"
      aria-label="Gesamteinschätzung der Prüfungsbereitschaft"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white shadow-xs">
            <Icon className={`w-7 h-7 ${config.iconColor}`} aria-hidden="true" />
          </div>
          <div>
            <span
              className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1 ${config.badgeBg}`}
            >
              Vorläufige Diagnose
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              {readiness.headline}
            </h2>
          </div>
        </div>

        {/* Accuracy & Blind Spot chips */}
        <div className="flex sm:flex-col items-end gap-1.5 text-xs text-text-muted">
          <span className="font-bold text-ink text-sm sm:text-base">
            {totalCorrect} von {totalQuestions} richtig
          </span>
          <span className="text-xs">
            {totalBlindSpots} {totalBlindSpots === 1 ? 'blinder Fleck' : 'blinde Flecken'}
          </span>
        </div>
      </div>

      <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
        {readiness.explanation}
      </p>

      <div className="pt-2 border-t border-gray-200/60 text-xs text-text-muted italic">
        {readiness.provisionalNotice}
      </div>
    </div>
  )
}

