import { Target, CheckCircle2 } from 'lucide-react'
import { Card } from '../common/Card'
import type { PracticeRecommendation } from '../../types/diagnostic'

export interface PracticePriorityListProps {
  recommendations: PracticeRecommendation[]
}

export function PracticePriorityList({ recommendations }: PracticePriorityListProps) {
  const isMaintenance =
    recommendations.length === 1 && recommendations[0].topicTag === 'maintenance'

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-ink flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-blue" aria-hidden="true" />
          <span>Prioritäre Übungsmaßnahmen</span>
        </h3>
        <p className="text-xs text-text-muted">
          Gewichtet nach Fehlerart: Blinde Flecken (Gewicht 3) vor Wissenslücken (2) und Unsicherheiten (1).
        </p>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          if (isMaintenance) {
            return (
              <Card
                key="maintenance"
                className="bg-emerald-50/60 border-emerald-200 p-5 space-y-2 shadow-xs"
              >
                <div className="flex items-center gap-2 font-bold text-state-secure text-base">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>{rec.actionTitle}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{rec.actionText}</p>
                <p className="text-xs text-text-muted italic pt-1">{rec.triggerReason}</p>
              </Card>
            )
          }

          return (
            <Card
              key={`${rec.topicTag}-${index}`}
              className="bg-white border-gray-200 p-5 space-y-3 shadow-xs hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                    aria-label={`Priorität ${index + 1}`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-bold text-ink text-sm sm:text-base">
                    {rec.actionTitle}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-semibold border border-blue-200 flex-shrink-0">
                  {rec.topicDisplayName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal pl-8">
                {rec.actionText}
              </p>

              <div className="pl-8 text-xs text-gray-600 italic flex items-center gap-1.5">
                <span>Analyse-Grund:</span>
                <span>{rec.triggerReason}</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

