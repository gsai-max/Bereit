import { describe, it, expect } from 'vitest'
import { evaluateReadiness } from '../src/logic/readiness'
import type { SkillCategory, SkillScoreSummary } from '../src/types/diagnostic'

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

describe('Provisional Readiness Rule Evaluator (REQ-06 & Edge Cases)', () => {
  it('Case A (Weakest-Skill Safeguard): Any skill <= 2 correct triggers practise_before_booking', () => {
    // Vocab 4/4, Reading 4/4, Grammar 2/4 -> Total 10/12 (83.3%)
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4),
      grammar: makeSummary(2, 2),
      reading: makeSummary(4, 4),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('practise_before_booking')
    expect(evaluation.headline).toBe('Vor der Buchung noch üben')
    expect(evaluation.explanation).toContain('Grammatik')
  })

  it('Case B (Blind-Spot Safeguard): Total blind spots >= 3 triggers practise_before_booking even with 9/12 correct', () => {
    // All skills 3/4 correct, but 3 blind spots total
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(3, 3, 1),
      grammar: makeSummary(3, 3, 1),
      reading: makeSummary(3, 3, 1),
    }

    const evaluation = evaluateReadiness(summaries, 3)
    expect(evaluation.category).toBe('practise_before_booking')
    expect(evaluation.explanation).toContain('3 blinde Flecken')
  })

  it('Case C (Mastery Check): All skills >= 3 secure AND blind spots <= 1 triggers ready_to_consider_booking', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4, 0),
      grammar: makeSummary(4, 3, 0),
      reading: makeSummary(3, 3, 0),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('ready_to_consider_booking')
    expect(evaluation.headline).toBe('Prüfungsbuchung in Betracht ziehen')
  })

  it('Case D (Boundary Mastery with exactly 1 Blind Spot): Triggers ready_to_consider_booking', () => {
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4, 0),
      grammar: makeSummary(4, 4, 0),
      reading: makeSummary(3, 3, 1), // 1 wrong answer marked 'sure'
    }

    const evaluation = evaluateReadiness(summaries, 1)
    expect(evaluation.category).toBe('ready_to_consider_booking')
  })

  it('Case E (Lucky Guesser): 12/12 correct but all guessed triggers almost_there (fails secure >= 3)', () => {
    // 4/4 correct in all, but 0 secure
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 0),
      grammar: makeSummary(4, 0),
      reading: makeSummary(4, 0),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('almost_there')
    expect(evaluation.headline).toBe('Fast am Ziel')
  })

  it('Case F (2 Blind Spots with high accuracy): Triggers almost_there', () => {
    // 10/12 correct with 2 blind spots (fails mastery rule Condition D <= 1, but doesn't hit Rule 1B >= 3)
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4, 0),
      grammar: makeSummary(3, 3, 1),
      reading: makeSummary(3, 3, 1),
    }

    const evaluation = evaluateReadiness(summaries, 2)
    expect(evaluation.category).toBe('almost_there')
  })

  it('Case H (Borderline / Guessed Accuracy): 10/12 correct, but only 1/4 sure in Grammar triggers almost_there', () => {
    // Vocab: 4/4 correct, 4/4 sure
    // Reading: 3/4 correct, 3/4 sure
    // Grammar: 3/4 correct, but only 1/4 sure (2 guessed correct, 1 gap)
    // Passes Rule 1 (all skills >= 3 correct, 0 blind spots), but fails Rule 2 (grammar secure = 1 < 3)
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4, 0),
      grammar: makeSummary(3, 1, 0),
      reading: makeSummary(3, 3, 0),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('almost_there')
    expect(evaluation.headline).toBe('Fast am Ziel')
  })

  it('Case G (Safeguard takes strict precedence over mastery condition)', () => {
    // Grammar has 2/4 correct (fails Rule 1A) even if Vocab and Reading are 4/4 secure
    const summaries: Record<SkillCategory, SkillScoreSummary> = {
      vocabulary: makeSummary(4, 4),
      grammar: makeSummary(2, 2),
      reading: makeSummary(4, 4),
    }

    const evaluation = evaluateReadiness(summaries, 0)
    expect(evaluation.category).toBe('practise_before_booking')
  })
})

