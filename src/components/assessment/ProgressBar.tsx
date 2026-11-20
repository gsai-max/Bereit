import type { SkillCategory, CognitiveLevel } from '../../types/diagnostic'

export interface ProgressBarProps {
  currentIndex: number
  totalQuestions: number
  skill: SkillCategory
  cognitiveLevel: CognitiveLevel
}

export function ProgressBar({
  currentIndex,
  totalQuestions,
  skill,
  cognitiveLevel,
}: ProgressBarProps) {
  const currentStep = currentIndex + 1
  const progressPercent = Math.round((currentStep / totalQuestions) * 100)

  const skillLabels: Record<SkillCategory, string> = {
    vocabulary: 'Wortschatz',
    grammar: 'Grammatik',
    reading: 'Leseverstehen',
  }

  const levelLabels: Record<CognitiveLevel, string> = {
    foundational: 'Grundwissen',
    application: 'Anwendung',
  }

  return (
    <div className="space-y-2.5 pb-2">
      {/* Top Labels */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-ink">
            Frage {currentStep} von {totalQuestions}
          </span>
          <span className="text-gray-300">•</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
            {skillLabels[skill]}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-gray-50 text-gray-500 font-medium border border-gray-200">
            {levelLabels[cognitiveLevel]}
          </span>
        </div>
        <span className="font-semibold text-brand-blue">{progressPercent}%</span>
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-valuetext={`Frage ${currentStep} von ${totalQuestions}: ${skillLabels[skill]}`}
        aria-label={`Fortschritt: Frage ${currentStep} von ${totalQuestions}`}
      >
        <div
          className="h-full bg-brand-blue transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

