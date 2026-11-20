import type {
  Question,
  UserResponse,
  FullAssessmentResult,
  EvaluatedQuestionResponse,
} from '../types/diagnostic'
import { classifyResponse } from './scoring'
import { calculateSkillMetrics } from './metrics'
import { evaluateReadiness } from './readiness'
import { generateRecommendations } from './recommendations'
import { questionBank as defaultQuestionBank } from '../data/questionBank'

/**
 * Executes the complete diagnostic and scoring pipeline on learner responses.
 *
 * Pipeline steps:
 * 1. Classify every question response (Correctness x Confidence) -> EvaluatedQuestionResponse[]
 * 2. Calculate per-skill score summaries for Vocabulary, Grammar, and Reading
 * 3. Count total correct answers and potential blind spots
 * 4. Evaluate provisional readiness category based on ordered safeguard rules
 * 5. Generate prioritized practice recommendations (weighted 3/2/1/0 with tie-breaking)
 *
 * Guaranteed deterministic, pure, and free of side-effects.
 */
export function evaluateAssessment(
  responses: Record<string, UserResponse>,
  questions: readonly Question[] = defaultQuestionBank
): FullAssessmentResult {
  const evaluatedResponses: EvaluatedQuestionResponse[] = []
  let totalCorrect = 0
  let totalBlindSpots = 0

  for (const question of questions) {
    const userResp = responses[question.id] || {
      questionId: question.id,
      selectedOptionId: '',
      confidence: 'guessed',
    }

    const evaluated = classifyResponse(question, userResp)
    evaluatedResponses.push(evaluated)

    if (evaluated.isCorrect) {
      totalCorrect += 1
    }
    if (evaluated.diagnosticState === 'potential_blind_spot') {
      totalBlindSpots += 1
    }
  }

  const skillSummaries = calculateSkillMetrics(evaluatedResponses)
  const readiness = evaluateReadiness(skillSummaries, totalBlindSpots)
  const topRecommendations = generateRecommendations(evaluatedResponses, questions)

  return {
    readiness,
    skillSummaries,
    totalCorrect,
    totalBlindSpots,
    evaluatedResponses,
    topRecommendations,
  }
}

