import { describe, it, expect } from 'vitest'
import { generateRecommendations, MAINTENANCE_RECOMMENDATION } from '../src/logic/recommendations'
import { questionBank } from '../src/data/questionBank'
import { classifyResponse } from '../src/logic/scoring'
import type { EvaluatedQuestionResponse, UserResponse } from '../src/types/diagnostic'

describe('Weighted Practice Recommendation Engine (REQ-07)', () => {
  it('calculates weights and prioritizes higher-weight topics', () => {
    // Create responses:
    // q_gram_01 (accusative): blind spot -> weight 3
    // q_gram_02 (verb conjugation): known gap -> weight 2
    // q_vocab_01 (everyday places): uncertain -> weight 1
    // all others: secure -> weight 0
    const evaluated: EvaluatedQuestionResponse[] = questionBank.map((q) => {
      let response: UserResponse = {
        questionId: q.id,
        selectedOptionId: q.correctOptionId,
        confidence: 'sure',
      }

      if (q.id === 'q_gram_01') {
        response = { questionId: q.id, selectedOptionId: 'wrong_id', confidence: 'sure' } // blind spot wt 3
      } else if (q.id === 'q_gram_02') {
        response = { questionId: q.id, selectedOptionId: 'wrong_id', confidence: 'guessed' } // gap wt 2
      } else if (q.id === 'q_vocab_01') {
        response = { questionId: q.id, selectedOptionId: q.correctOptionId, confidence: 'guessed' } // uncertain wt 1
      }

      return classifyResponse(q, response)
    })

    const recs = generateRecommendations(evaluated, questionBank)

    expect(recs).toHaveLength(3)
    expect(recs[0].topicTag).toBe('accusative_articles')
    expect(recs[0].priorityWeight).toBe(3)
    expect(recs[1].topicTag).toBe('verb_conjugation')
    expect(recs[1].priorityWeight).toBe(2)
    expect(recs[2].topicTag).toBe('everyday_places')
    expect(recs[2].priorityWeight).toBe(1)
  })

  it('breaks ties deterministically using question bank appearance index', () => {
    // Both everyday_places (Q1) and food_and_shopping (Q2) have weight 2
    const evaluated: EvaluatedQuestionResponse[] = questionBank.map((q) => {
      let response: UserResponse = {
        questionId: q.id,
        selectedOptionId: q.correctOptionId,
        confidence: 'sure',
      }

      if (q.id === 'q_vocab_01' || q.id === 'q_vocab_02') {
        response = { questionId: q.id, selectedOptionId: 'wrong_id', confidence: 'guessed' } // wt 2
      }

      return classifyResponse(q, response)
    })

    const recs = generateRecommendations(evaluated, questionBank)

    expect(recs).toHaveLength(2)
    expect(recs[0].topicTag).toBe('everyday_places')
    expect(recs[1].topicTag).toBe('food_and_shopping')
    expect(recs[0].priorityWeight).toBe(2)
    expect(recs[1].priorityWeight).toBe(2)
  })

  it('aggregates cumulative weights when multiple questions share a topic', () => {
    // Suppose two questions share topic 'everyday_places': one with blind spot (3), one with known gap (2)
    const q1 = { ...questionBank[0], topicTag: 'test_shared_topic', topicDisplayName: 'Shared Topic' }
    const q2 = { ...questionBank[1], topicTag: 'test_shared_topic', topicDisplayName: 'Shared Topic' }

    const resp1 = classifyResponse(q1, { questionId: q1.id, selectedOptionId: 'wrong', confidence: 'sure' }) // 3
    const resp2 = classifyResponse(q2, { questionId: q2.id, selectedOptionId: 'wrong', confidence: 'guessed' }) // 2

    const recs = generateRecommendations([resp1, resp2])

    expect(recs).toHaveLength(1)
    expect(recs[0].topicTag).toBe('test_shared_topic')
    expect(recs[0].priorityWeight).toBe(5) // 3 + 2
  })

  it('returns positive maintenance advice when all weights are 0 (perfect score)', () => {
    const evaluated: EvaluatedQuestionResponse[] = questionBank.map((q) =>
      classifyResponse(q, {
        questionId: q.id,
        selectedOptionId: q.correctOptionId,
        confidence: 'sure',
      })
    )

    const recs = generateRecommendations(evaluated, questionBank)

    expect(recs).toHaveLength(1)
    expect(recs[0].topicTag).toBe('maintenance')
    expect(recs[0].priorityWeight).toBe(0)
    expect(recs[0].actionTitle).toBe(MAINTENANCE_RECOMMENDATION.actionTitle)
  })

  it('slices at most top 3 recommendations when more topics have deficits', () => {
    // Introduce errors in 5 different questions
    const evaluated: EvaluatedQuestionResponse[] = questionBank.map((q, idx) => {
      const hasDeficit = idx < 5
      return classifyResponse(q, {
        questionId: q.id,
        selectedOptionId: hasDeficit ? 'wrong' : q.correctOptionId,
        confidence: 'sure',
      })
    })

    const recs = generateRecommendations(evaluated, questionBank)
    expect(recs).toHaveLength(3)
  })
})

