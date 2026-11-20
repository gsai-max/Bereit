import { describe, it, expect } from 'vitest'
import { classifyResponse, DIAGNOSTIC_WEIGHTS } from '../src/logic/scoring'
import type { Question, UserResponse } from '../src/types/diagnostic'

const mockQuestion: Question = {
  id: 'q_test_01',
  skill: 'grammar',
  cognitiveLevel: 'foundational',
  topicTag: 'accusative_articles',
  topicDisplayName: 'Akkusativ-Artikel',
  prompt: 'Welcher Artikel ist richtig?',
  options: [
    { id: 'opt_a', text: 'der' },
    { id: 'opt_b', text: 'den' },
    { id: 'opt_c', text: 'dem' },
    { id: 'opt_d', text: 'des' },
  ],
  correctOptionId: 'opt_b',
  explanation: 'Im Akkusativ maskulin heißt es den.',
  remediationTitle: 'Akkusativ üben',
  remediationAction: 'Üben Sie den Akkusativ.',
}

describe('2x2 Diagnostic Matrix Scoring (REQ-04)', () => {
  it('maps Correct + Sure -> secure_knowledge (weight 0)', () => {
    const response: UserResponse = {
      questionId: 'q_test_01',
      selectedOptionId: 'opt_b',
      confidence: 'sure',
    }

    const result = classifyResponse(mockQuestion, response)
    expect(result.isCorrect).toBe(true)
    expect(result.diagnosticState).toBe('secure_knowledge')
    expect(result.priorityWeight).toBe(0)
    expect(result.priorityWeight).toBe(DIAGNOSTIC_WEIGHTS.secure_knowledge)
  })

  it('maps Correct + Guessed -> uncertain_knowledge (weight 1)', () => {
    const response: UserResponse = {
      questionId: 'q_test_01',
      selectedOptionId: 'opt_b',
      confidence: 'guessed',
    }

    const result = classifyResponse(mockQuestion, response)
    expect(result.isCorrect).toBe(true)
    expect(result.diagnosticState).toBe('uncertain_knowledge')
    expect(result.priorityWeight).toBe(1)
    expect(result.priorityWeight).toBe(DIAGNOSTIC_WEIGHTS.uncertain_knowledge)
  })

  it('maps Wrong + Guessed -> known_gap (weight 2)', () => {
    const response: UserResponse = {
      questionId: 'q_test_01',
      selectedOptionId: 'opt_a',
      confidence: 'guessed',
    }

    const result = classifyResponse(mockQuestion, response)
    expect(result.isCorrect).toBe(false)
    expect(result.diagnosticState).toBe('known_gap')
    expect(result.priorityWeight).toBe(2)
    expect(result.priorityWeight).toBe(DIAGNOSTIC_WEIGHTS.known_gap)
  })

  it('maps Wrong + Sure -> potential_blind_spot (weight 3)', () => {
    const response: UserResponse = {
      questionId: 'q_test_01',
      selectedOptionId: 'opt_c',
      confidence: 'sure',
    }

    const result = classifyResponse(mockQuestion, response)
    expect(result.isCorrect).toBe(false)
    expect(result.diagnosticState).toBe('potential_blind_spot')
    expect(result.priorityWeight).toBe(3)
    expect(result.priorityWeight).toBe(DIAGNOSTIC_WEIGHTS.potential_blind_spot)
  })
})

