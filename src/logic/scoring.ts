import type {
  Question,
  UserResponse,
  EvaluatedQuestionResponse,
  DiagnosticState,
} from '../types/diagnostic'

/**
 * Priority weights assigned to each diagnostic state:
 * - Potential Blind Spot (Wrong + Sure): 3 (Critical misconception)
 * - Known Gap (Wrong + Guessed): 2 (Acknowledged deficit)
 * - Uncertain Knowledge (Correct + Guessed): 1 (Fragile recall)
 * - Secure Knowledge (Correct + Sure): 0 (Mastered)
 */
export const DIAGNOSTIC_WEIGHTS: Record<DiagnosticState, number> = {
  potential_blind_spot: 3,
  known_gap: 2,
  uncertain_knowledge: 1,
  secure_knowledge: 0,
}

/**
 * 2x2 Diagnostic Matrix Classifier
 * Maps (isCorrect x confidence) into one of the 4 diagnostic states:
 *
 *                Correct              Incorrect
 *   Sure       | Secure Knowledge   | Potential Blind Spot
 *   Guessed    | Uncertain Knowledge| Known Gap
 */
export function classifyResponse(
  question: Question,
  response: UserResponse
): EvaluatedQuestionResponse {
  const isCorrect = response.selectedOptionId === question.correctOptionId

  let diagnosticState: DiagnosticState

  if (isCorrect) {
    diagnosticState = response.confidence === 'sure' ? 'secure_knowledge' : 'uncertain_knowledge'
  } else {
    diagnosticState = response.confidence === 'sure' ? 'potential_blind_spot' : 'known_gap'
  }

  const priorityWeight = DIAGNOSTIC_WEIGHTS[diagnosticState]

  return {
    question,
    response,
    isCorrect,
    diagnosticState,
    priorityWeight,
  }
}

