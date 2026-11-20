import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import type { SkillCategory, SkillScoreSummary } from '../../types/diagnostic'

export interface SkillBreakdownGridProps {
  skillSummaries: Record<SkillCategory, SkillScoreSummary>
}

export function SkillBreakdownGrid({ skillSummaries }: SkillBreakdownGridProps) {
  const skills: { key: SkillCategory; title: string; desc: string }[] = [
    {
      key: 'vocabulary',
      title: 'Wortschatz',
      desc: 'Orte, Lebensmittel, Familie & Kleidung',
    },
    {
      key: 'grammar',
      title: 'Grammatik',
      desc: 'Akkusativ, Vokalwechsel, Satzbau & Negation',
    },
    {
      key: 'reading',
      title: 'Leseverstehen',
      desc: 'E-Mails, Fahrpläne, Schilder & Kleinanzeigen',
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-ink">Teilbereich-Analyse</h3>
        <p className="text-xs text-text-muted">
          Differenzierung nach Korrektheit und Selbsteinschätzung (jeweils aus 4 Fragen).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map(({ key, title, desc }) => {
          const summary = skillSummaries[key]
          const isWeak = summary.correctCount <= 2

          return (
            <Card
              key={key}
              className={`space-y-4 bg-white ${isWeak ? 'border-amber-300' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-ink text-base">{title}</h4>
                  <p className="text-[11px] text-text-muted">{desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-ink">
                    {summary.correctCount} / {summary.totalQuestions}
                  </span>
                  <p className="text-[10px] text-text-muted">{summary.accuracyPercentage}%</p>
                </div>
              </div>

              {/* Skill accuracy bar */}
              <div
                className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={summary.correctCount}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuetext={`${summary.correctCount} von 4 richtig (${summary.accuracyPercentage}%)`}
                aria-label={`Genauigkeit in ${title}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isWeak ? 'bg-amber-500' : 'bg-state-secure'
                  }`}
                  style={{ width: `${summary.accuracyPercentage}%` }}
                />
              </div>

              {/* 4 diagnostic state counts */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded-md bg-emerald-50/60 border border-emerald-100">
                  <Badge state="secure_knowledge" size="sm" showIcon={true}>
                    Sicher
                  </Badge>
                  <span className="font-bold text-emerald-950">{summary.secureCount}</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-md bg-amber-50/60 border border-amber-100">
                  <Badge state="uncertain_knowledge" size="sm" showIcon={true}>
                    Geraten
                  </Badge>
                  <span className="font-bold text-amber-950">{summary.uncertainCount}</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-200">
                  <Badge state="known_gap" size="sm" showIcon={true}>
                    Lücke
                  </Badge>
                  <span className="font-bold text-slate-900">{summary.knownGapCount}</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-md bg-red-50/60 border border-red-100">
                  <Badge state="potential_blind_spot" size="sm" showIcon={true}>
                    Blinder Fleck
                  </Badge>
                  <span className="font-bold text-red-950">{summary.blindSpotCount}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

