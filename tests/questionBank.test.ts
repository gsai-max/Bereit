import { describe, it, expect } from 'vitest'
import { questionBank } from '../src/data/questionBank'
import type { SkillCategory } from '../src/types/diagnostic'

describe('Curated Question Bank Integrity Suite (REQ-01)', () => {
  it('contains exactly 12 questions', () => {
    expect(questionBank).toHaveLength(12)
  })

  it('contains exactly 4 questions per skill domain', () => {
    const vocab = questionBank.filter((q) => q.skill === 'vocabulary')
    const grammar = questionBank.filter((q) => q.skill === 'grammar')
    const reading = questionBank.filter((q) => q.skill === 'reading')

    expect(vocab).toHaveLength(4)
    expect(grammar).toHaveLength(4)
    expect(reading).toHaveLength(4)
  })

  it('contains exactly 6 foundational and 6 application questions', () => {
    const foundational = questionBank.filter((q) => q.cognitiveLevel === 'foundational')
    const application = questionBank.filter((q) => q.cognitiveLevel === 'application')

    expect(foundational).toHaveLength(6)
    expect(application).toHaveLength(6)

    // And verify 2 of each per skill
    const skills: SkillCategory[] = ['vocabulary', 'grammar', 'reading']
    skills.forEach((skill) => {
      const skillQuestions = questionBank.filter((q) => q.skill === skill)
      expect(skillQuestions.filter((q) => q.cognitiveLevel === 'foundational')).toHaveLength(2)
      expect(skillQuestions.filter((q) => q.cognitiveLevel === 'application')).toHaveLength(2)
    })
  })

  it('guarantees unique IDs across all questions and options', () => {
    const questionIds = new Set<string>()
    const optionIds = new Set<string>()

    questionBank.forEach((q) => {
      expect(questionIds.has(q.id)).toBe(false)
      questionIds.add(q.id)

      expect(q.options).toHaveLength(4)
      q.options.forEach((opt) => {
        expect(optionIds.has(opt.id)).toBe(false)
        optionIds.add(opt.id)
      })
    })

    expect(questionIds.size).toBe(12)
    expect(optionIds.size).toBe(48)
  })

  it('guarantees that every question has a valid correctOptionId matching an option', () => {
    questionBank.forEach((q) => {
      const match = q.options.find((opt) => opt.id === q.correctOptionId)
      expect(match).toBeDefined()
      expect(match?.text.trim().length).toBeGreaterThan(0)
    })
  })

  it('verifies all reading questions contain a non-empty context stimulus', () => {
    const readingQuestions = questionBank.filter((q) => q.skill === 'reading')
    readingQuestions.forEach((q) => {
      expect(q.contextStimulus).toBeDefined()
      expect(q.contextStimulus?.trim().length).toBeGreaterThan(20)
    })
  })

  it('verifies all questions have complete educational remediation metadata', () => {
    questionBank.forEach((q) => {
      expect(q.prompt.trim().length).toBeGreaterThan(0)
      expect(q.explanation.trim().length).toBeGreaterThan(15)
      expect(q.remediationTitle.trim().length).toBeGreaterThan(5)
      expect(q.remediationAction.trim().length).toBeGreaterThan(15)
      expect(q.topicTag.trim().length).toBeGreaterThan(0)
      expect(q.topicDisplayName.trim().length).toBeGreaterThan(0)
    })
  })

  it('is deeply frozen for tamper-resistance', () => {
    expect(Object.isFrozen(questionBank)).toBe(true)
    questionBank.forEach((q) => {
      expect(Object.isFrozen(q)).toBe(true)
      expect(Object.isFrozen(q.options)).toBe(true)
    })
  })
})
