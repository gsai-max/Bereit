import { ReadinessBanner } from './ReadinessBanner'
import { SkillBreakdownGrid } from './SkillBreakdownGrid'
import { DiagnosticLegend } from './DiagnosticLegend'
import { PracticePriorityList } from './PracticePriorityList'
import { MistakeReviewDrawer } from './MistakeReviewDrawer'
import { AssessmentDisclaimers } from './AssessmentDisclaimers'
import { RestartCTA } from './RestartCTA'
import type { FullAssessmentResult } from '../../types/diagnostic'

export interface ResultsDashboardProps {
  results: FullAssessmentResult
  totalQuestions: number
  onRestart: () => void
}

export function ResultsDashboard({
  results,
  totalQuestions,
  onRestart,
}: ResultsDashboardProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-7 py-2 sm:py-6 animate-in fade-in duration-300">
      {/* 1. Overall Readiness Banner */}
      <ReadinessBanner
        readiness={results.readiness}
        totalCorrect={results.totalCorrect}
        totalQuestions={totalQuestions}
        totalBlindSpots={results.totalBlindSpots}
      />

      {/* 2. Skill Breakdown Grid */}
      <SkillBreakdownGrid skillSummaries={results.skillSummaries} />

      {/* 3. Diagnostic State Legend */}
      <DiagnosticLegend />

      {/* 4. Top 3 Prioritized Practice Recommendations */}
      <PracticePriorityList recommendations={results.topRecommendations} />

      {/* 5. Detailed Mistake Review */}
      <MistakeReviewDrawer evaluatedResponses={results.evaluatedResponses} />

      {/* 6. Assessment Disclaimers */}
      <AssessmentDisclaimers />

      {/* 7. Retake Action */}
      <RestartCTA onRestart={onRestart} />
    </div>
  )
}

