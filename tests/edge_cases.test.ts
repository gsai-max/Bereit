import { describe, it, expect } from 'vitest'
import { evaluateReadiness } from '../src/logic/readiness'
import { generateRecommendations, MAINTENANCE_RECOMMENDATION } from '../src/logic/recommendations'
import { questionBank } from '../src/data/questionBank'
import { classifyResponse } from '../src/logic/scoring'
import type { SkillCategory, SkillScoreSummary, EvaluatedQuestionResponse, UserResponse } from '../src/types/diagnostic'

function makeSummary(correct: number, secure: number, blindSpots = 0): SkillScoreSummary {
  return {
    skill: 'vocabulary',
    totalQuestions: 4,
    correctCount: correct,
    accuracyPercentage: (correct / 4) * 100,
    secureCount: secure,
    uncertainCount: correct - secure,
    knownGapCount: 4 - correct - blindSpots,
    blindSpotCount: blindSpots,
  }
}

describe('Formal Edge Case Automated Verification Matrix (from edge-case.md Section 7)', () => {
  // TC-EC-01: Weakest-skill failure with 10/12 total correct -> practise_before_booking
  it('TC-EC-01: Weakest-skill failure with 10/12 total correct returns practise_before_booking', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4),
      grammar: makeSummary(2, 2), // Deficit triggers Rule 1A
      reading: makeSummary(4, 4),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('practise_before_booking')
  })

  // TC-EC-02: 3 Potential Blind Spots with 9/12 correct -> practise_before_booking
  it('TC-EC-02: 3 Potential Blind Spots with 9/12 correct returns practise_before_booking', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(3, 3, 1),
      grammar: makeSummary(3, 3, 1),
      reading: makeSummary(3, 3, 1),
    }

    const evaluation = evaluateReadiness(summaries, 3)
    expect(evaluation.category).toBe('practise_before_booking')
  })

  // TC-EC-03: 12/12 correct with all 12 "Guessed" -> almost_there
  it('TC-EC-03: 12/12 correct with all 12 "Guessed" returns almost_there', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 0),
      grammar: makeSummary(4, 0),
      reading: makeSummary(4, 0),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('almost_there')
  })

  // TC-EC-04: 11/12 correct with exactly 1 Blind Spot -> ready_to_consider_booking
  it('TC-EC-04: 11/12 correct with exactly 1 Blind Spot returns ready_to_consider_booking', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4, 0),
      grammar: makeSummary(4, 4, 0),
      reading: makeSummary(3, 3, 1), // 1 blind spot
    }

    const evaluation = evaluateReadiness(summaries, 1)
    expect(evaluation.category).toBe('ready_to_consider_booking')
  })

  // TC-EC-05: 10/12 correct with exactly 2 Blind Spots -> almost_there
  it('TC-EC-05: 10/12 correct with exactly 2 Blind Spots returns almost_there', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4, 0),
      grammar: makeSummary(3, 3, 1),
      reading: makeSummary(3, 3, 1),
    }

    const evaluation = evaluateReadiness(summaries, 2)
    expect(evaluation.category).toBe('almost_there')
  })

  // TC-EC-06: 12/12 correct and all "Sure" (Weight 0) -> positive maintenance advice
  it('TC-EC-06: 12/12 correct and all "Sure" (Weight 0) returns maintenance advice', () => {
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
    expect(recs[0].actionTitle).toBe(MAINTENANCE_RECOMMENDATION.actionTitle)
  })

  // TC-EC-07: Weight tie between multiple topics -> ranks by question appearance
  it('TC-EC-07: Weight tie between multiple topics ranks by question bank appearance', () => {
    // Everyday places is Q1, food_and_shopping is Q2, accusative_articles is Q5
    // Give each weight 3 (Blind spot)
    const evaluated: EvaluatedQuestionResponse[] = questionBank.map((q) => {
      let response: UserResponse = {
        questionId: q.id,
        selectedOptionId: q.correctOptionId,
        confidence: 'sure',
      }

      if (q.id === 'q_gram_01' || q.id === 'q_vocab_01' || q.id === 'q_vocab_02') {
        response = { questionId: q.id, selectedOptionId: 'wrong', confidence: 'sure' }
      }

      return classifyResponse(q, response)
    })

    const recs = generateRecommendations(evaluated, questionBank)
    expect(recs).toHaveLength(3)
    // Order in questionBank: Q1 (everyday_places), Q2 (food_and_shopping), Q5 (accusative_articles)
    expect(recs[0].topicTag).toBe('everyday_places')
    expect(recs[1].topicTag).toBe('food_and_shopping')
    expect(recs[2].topicTag).toBe('accusative_articles')
  })
})

