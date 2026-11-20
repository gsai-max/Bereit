import { describe, it, expect } from 'vitest'
import { evaluateAssessment } from '../src/logic/engine'
import { questionBank } from '../src/data/questionBank'
import type { UserResponse } from '../src/types/diagnostic'

describe('End-to-End Diagnostic Engine (evaluateAssessment)', () => {
  it('evaluates a complete assessment session seamlessly', () => {
    // 12 responses: 11 correct (sure), 1 incorrect on grammar (sure -> blind spot)
    const responses: Record<string, UserResponse> = {}

    questionBank.forEach((q) => {
      if (q.id === 'q_gram_01') {
        responses[q.id] = { questionId: q.id, selectedOptionId: 'wrong_opt', confidence: 'sure' }
      } else {
        responses[q.id] = { questionId: q.id, selectedOptionId: q.correctOptionId, confidence: 'sure' }
      }
    })

    const result = evaluateAssessment(responses, questionBank)

    expect(result.totalCorrect).toBe(11)
    expect(result.totalBlindSpots).toBe(1)
    // Grammar: 3/4 correct, 3 secure -> all skills >= 3 secure AND blind spots <= 1 -> ready_to_consider_booking
    expect(result.readiness.category).toBe('ready_to_consider_booking')
    expect(result.evaluatedResponses).toHaveLength(12)
    expect(result.topRecommendations).toHaveLength(1)
    expect(result.topRecommendations[0].topicTag).toBe('accusative_articles')
    expect(result.topRecommendations[0].priorityWeight).toBe(3)
  })
})

