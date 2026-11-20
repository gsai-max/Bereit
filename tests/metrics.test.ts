import { describe, it, expect } from 'vitest'
import { calculateSkillMetrics } from '../src/logic/metrics'
import { questionBank } from '../src/data/questionBank'
import { classifyResponse } from '../src/logic/scoring'
import type { EvaluatedQuestionResponse, UserResponse } from '../src/types/diagnostic'

describe('Per-Skill Metrics Aggregator (REQ-05)', () => {
  it('accurately aggregates counts and percentages for each skill out of 4', () => {
    // Generate responses:
    // Vocab: 4/4 correct (4 sure) -> 100%
    // Grammar: 2/4 correct (2 sure, 1 known gap, 1 blind spot) -> 50%
    // Reading: 3/4 correct (2 sure, 1 guessed, 1 known gap) -> 75%
    const evaluated: EvaluatedQuestionResponse[] = []

    questionBank.forEach((q) => {
      let response: UserResponse

      if (q.skill === 'vocabulary') {
        response = { questionId: q.id, selectedOptionId: q.correctOptionId, confidence: 'sure' }
      } else if (q.skill === 'grammar') {
        const isGrammarCorrect = q.id === 'q_gram_01' || q.id === 'q_gram_02'
        const isBlindSpot = q.id === 'q_gram_03'
        response = {
          questionId: q.id,
          selectedOptionId: isGrammarCorrect ? q.correctOptionId : 'wrong_id',
          confidence: isBlindSpot ? 'sure' : isGrammarCorrect ? 'sure' : 'guessed',
        }
      } else {
        // Reading
        const isReadingCorrect = q.id !== 'q_read_04'
        const isReadingGuessed = q.id === 'q_read_03'
        response = {
          questionId: q.id,
          selectedOptionId: isReadingCorrect ? q.correctOptionId : 'wrong_id',
          confidence: isReadingGuessed ? 'guessed' : isReadingCorrect ? 'sure' : 'guessed',
        }
      }

      evaluated.push(classifyResponse(q, response))
    })

    const metrics = calculateSkillMetrics(evaluated)

    // Vocabulary: 4/4 correct, 4 secure, 0 uncertain, 0 gaps, 0 blind spots
    expect(metrics.vocabulary.totalQuestions).toBe(4)
    expect(metrics.vocabulary.correctCount).toBe(4)
    expect(metrics.vocabulary.accuracyPercentage).toBe(100)
    expect(metrics.vocabulary.secureCount).toBe(4)
    expect(metrics.vocabulary.uncertainCount).toBe(0)
    expect(metrics.vocabulary.knownGapCount).toBe(0)
    expect(metrics.vocabulary.blindSpotCount).toBe(0)

    // Grammar: 2/4 correct, 2 secure, 0 uncertain, 1 known gap, 1 blind spot
    expect(metrics.grammar.totalQuestions).toBe(4)
    expect(metrics.grammar.correctCount).toBe(2)
    expect(metrics.grammar.accuracyPercentage).toBe(50)
    expect(metrics.grammar.secureCount).toBe(2)
    expect(metrics.grammar.uncertainCount).toBe(0)
    expect(metrics.grammar.knownGapCount).toBe(1)
    expect(metrics.grammar.blindSpotCount).toBe(1)

    // Reading: 3/4 correct, 2 secure, 1 uncertain, 1 known gap, 0 blind spots
    expect(metrics.reading.totalQuestions).toBe(4)
    expect(metrics.reading.correctCount).toBe(3)
    expect(metrics.reading.accuracyPercentage).toBe(75)
    expect(metrics.reading.secureCount).toBe(2)
    expect(metrics.reading.uncertainCount).toBe(1)
    expect(metrics.reading.knownGapCount).toBe(1)
    expect(metrics.reading.blindSpotCount).toBe(0)
  })
})

