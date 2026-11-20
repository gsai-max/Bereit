import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAssessmentSession } from '../src/hooks/useAssessmentSession'
import { questionBank } from '../src/data/questionBank'

describe('Session State Machine & Navigation Orchestrator (REQ-03 & Phase 5)', () => {
  it('initializes in landing state with clean defaults', () => {
    const { result } = renderHook(() => useAssessmentSession())

    expect(result.current.currentScreen).toBe('landing')
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.responses).toEqual({})
    expect(result.current.isCompleted).toBe(false)
    expect(result.current.canContinue).toBe(false)
    expect(result.current.results).toBeNull()
  })

  it('transitions to assessment on startAssessment', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
    })

    expect(result.current.currentScreen).toBe('assessment')
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.currentQuestion.id).toBe(questionBank[0].id)
    expect(result.current.canContinue).toBe(false)
  })

  it('enforces two-step selection validation: option set but confidence missing prevents advance (EC-101)', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
    })

    const q1 = questionBank[0]

    // Step 1: select option only
    act(() => {
      result.current.selectOption(q1.id, q1.options[0].id)
    })

    expect(result.current.canContinue).toBe(false)

    // Attempting nextQuestion without confidence does not advance
    act(() => {
      result.current.nextQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(0)

    // Step 2: select confidence
    act(() => {
      result.current.selectConfidence(q1.id, 'sure')
    })

    expect(result.current.canContinue).toBe(true)

    // Now nextQuestion advances
    act(() => {
      result.current.nextQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(1)
  })

  it('prevents selecting confidence before selecting an option (EC-102)', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
    })

    const q1 = questionBank[0]

    act(() => {
      result.current.selectConfidence(q1.id, 'sure')
    })

    expect(result.current.responses[q1.id]).toBeUndefined()
    expect(result.current.canContinue).toBe(false)
  })

  it('clears confidence when changing answer option on a question (EC-105 & TC-EC-09)', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
    })

    const q1 = questionBank[0]

    // Select option A and "sure"
    act(() => {
      result.current.selectOption(q1.id, q1.options[0].id)
      result.current.selectConfidence(q1.id, 'sure')
    })

    expect(result.current.canContinue).toBe(true)
    expect(result.current.responses[q1.id]?.confidence).toBe('sure')

    // Change to option B
    act(() => {
      result.current.selectOption(q1.id, q1.options[1].id)
    })

    // Confidence should now be cleared
    expect(result.current.responses[q1.id]?.confidence).toBeUndefined()
    expect(result.current.canContinue).toBe(false)

    // Re-selecting confidence enables continue again
    act(() => {
      result.current.selectConfidence(q1.id, 'guessed')
    })

    expect(result.current.canContinue).toBe(true)
    expect(result.current.responses[q1.id]?.confidence).toBe('guessed')
  })

  it('preserves previous answers on backtrack navigation (EC-104 & TC-EC-10)', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
    })

    const q1 = questionBank[0]
    const q2 = questionBank[1]

    // Answer Q1
    act(() => {
      result.current.selectOption(q1.id, q1.options[1].id)
      result.current.selectConfidence(q1.id, 'sure')
    })
    act(() => {
      result.current.nextQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(1)

    // Answer Q2
    act(() => {
      result.current.selectOption(q2.id, q2.options[2].id)
      result.current.selectConfidence(q2.id, 'guessed')
    })

    // Backtrack to Q1
    act(() => {
      result.current.previousQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.currentResponse?.selectedOptionId).toBe(q1.options[1].id)
    expect(result.current.currentResponse?.confidence).toBe('sure')
    expect(result.current.canContinue).toBe(true)

    // Forward to Q2 again
    act(() => {
      result.current.nextQuestion()
    })

    expect(result.current.currentQuestionIndex).toBe(1)
    expect(result.current.currentResponse?.selectedOptionId).toBe(q2.options[2].id)
    expect(result.current.currentResponse?.confidence).toBe('guessed')
    expect(result.current.canContinue).toBe(true)
  })

  it('completes assessment and computes results when final question is submitted', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
    })

    // Answer all 12 questions
    questionBank.forEach((q, idx) => {
      expect(result.current.currentQuestionIndex).toBe(idx)

      act(() => {
        result.current.selectOption(q.id, q.correctOptionId)
        result.current.selectConfidence(q.id, 'sure')
      })

      act(() => {
        result.current.nextQuestion()
      })
    })

    // After answering Q12 and advancing, should transition to 'results'
    expect(result.current.currentScreen).toBe('results')
    expect(result.current.isCompleted).toBe(true)
    expect(result.current.results).not.toBeNull()
    expect(result.current.results?.totalCorrect).toBe(12)
    expect(result.current.results?.readiness.category).toBe('ready_to_consider_booking')
  })

  it('manages reset modal state and resets cleanly on confirmation', () => {
    const { result } = renderHook(() => useAssessmentSession())

    act(() => {
      result.current.startAssessment()
      result.current.selectOption(questionBank[0].id, questionBank[0].options[0].id)
      result.current.openResetModal()
    })

    expect(result.current.isResetModalOpen).toBe(true)

    act(() => {
      result.current.cancelReset()
    })

    expect(result.current.isResetModalOpen).toBe(false)
    expect(result.current.currentScreen).toBe('assessment')

    act(() => {
      result.current.openResetModal()
      result.current.confirmReset()
    })

    expect(result.current.isResetModalOpen).toBe(false)
    expect(result.current.currentScreen).toBe('landing')
    expect(result.current.responses).toEqual({})
    expect(result.current.currentQuestionIndex).toBe(0)
  })
})

