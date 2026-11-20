import type {
  EvaluatedQuestionResponse,
  SkillCategory,
  SkillScoreSummary,
} from '../types/diagnostic'

const SKILL_CATEGORIES: SkillCategory[] = ['vocabulary', 'grammar', 'reading']

/**
 * Calculates per-skill diagnostic and accuracy metrics.
 * Evaluated independently for Vocabulary, Grammar, and Reading (each out of 4 questions).
 */
export function calculateSkillMetrics(
  evaluatedResponses: EvaluatedQuestionResponse[]
): Record<SkillCategory, SkillScoreSummary> {
  const initialSummaries: Record<SkillCategory, SkillScoreSummary> = {
    vocabulary: createEmptySkillSummary('vocabulary'),
    grammar: createEmptySkillSummary('grammar'),
    reading: createEmptySkillSummary('reading'),
  }

  for (const item of evaluatedResponses) {
    const skill = item.question.skill
    const summary = initialSummaries[skill]
    if (!summary) continue

    if (item.isCorrect) {
      summary.correctCount += 1
    }

    switch (item.diagnosticState) {
      case 'secure_knowledge':
        summary.secureCount += 1
        break
      case 'uncertain_knowledge':
        summary.uncertainCount += 1
        break
      case 'known_gap':
        summary.knownGapCount += 1
        break
      case 'potential_blind_spot':
        summary.blindSpotCount += 1
        break
    }
  }

  // Calculate percentages
  for (const skill of SKILL_CATEGORIES) {
    const summary = initialSummaries[skill]
    summary.accuracyPercentage = Math.round((summary.correctCount / summary.totalQuestions) * 100)
  }

  return initialSummaries
}

function createEmptySkillSummary(skill: SkillCategory): SkillScoreSummary {
  return {
    skill,
    totalQuestions: 4,
    correctCount: 0,
    accuracyPercentage: 0,
    secureCount: 0,
    uncertainCount: 0,
    knownGapCount: 0,
    blindSpotCount: 0,
  }
}

