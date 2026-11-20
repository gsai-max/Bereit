import { useState, useRef } from 'react'
import { ReadinessBanner } from './ReadinessBanner'
import { SkillBreakdownGrid } from './SkillBreakdownGrid'
import { DiagnosticLegend } from './DiagnosticLegend'
import { PracticePriorityList } from './PracticePriorityList'
import { MistakeReviewDrawer } from './MistakeReviewDrawer'
import { AiTutorCard } from './AiTutorCard'
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
  const [tutorPrompt, setTutorPrompt] = useState<string | undefined>(undefined)
  const tutorRef = useRef<HTMLDivElement>(null)

  function handleAskAiTutor(prompt: string) {
    setTutorPrompt(prompt)
    setTimeout(() => {
      tutorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

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

      {/* 5. Detailed Mistake Review with option to ask AI Tutor */}
      <MistakeReviewDrawer
        evaluatedResponses={results.evaluatedResponses}
        onAskAiTutor={handleAskAiTutor}
      />

      {/* 6. Optional Interactive AI German Tutor (Groq LLaMA 3.1) */}
      <div ref={tutorRef}>
        <AiTutorCard results={results} initialPrompt={tutorPrompt} />
      </div>

      {/* 7. Assessment Disclaimers */}
      <AssessmentDisclaimers />

      {/* 8. Retake Action */}
      <RestartCTA onRestart={onRestart} />
    </div>
  )
}

