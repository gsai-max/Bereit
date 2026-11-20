import { useState, useCallback, useEffect } from 'react'
import type {
  AppScreen,
  ConfidenceLevel,
  FullAssessmentResult,
  IncompleteUserResponse,
  Question,
  UserResponse,
} from '../types/diagnostic'
import { questionBank as defaultQuestionBank } from '../data/questionBank'
import { evaluateAssessment } from '../logic/engine'

export interface UseAssessmentSessionOptions {
  questions?: readonly Question[]
}

export interface UseAssessmentSessionReturn {
  // State
  currentScreen: AppScreen
  currentQuestionIndex: number
  currentQuestion: Question
  responses: Record<string, IncompleteUserResponse>
  currentResponse: IncompleteUserResponse | undefined
  isCompleted: boolean
  isResetModalOpen: boolean
  canContinue: boolean
  results: FullAssessmentResult | null
  totalQuestions: number
  isFirstQuestion: boolean
  isLastQuestion: boolean

  // Actions
  startAssessment: () => void
  selectOption: (questionId: string, optionId: string) => void
  selectConfidence: (questionId: string, confidence: ConfidenceLevel) => void
  nextQuestion: () => void
  previousQuestion: () => void
  openResetModal: () => void
  cancelReset: () => void
  confirmReset: () => void
  restart: () => void
}

/**
 * State machine and step navigation orchestrator hook for Bereit?
 *
 * Guarantees invariants:
 * - Two-step selection: Can only advance when both selectedOptionId and confidence are present.
 * - Tamper resistance: Bound-checked question navigation (0 <= index < 12).
 * - Option change resets confidence: Switching an option requires re-selecting confidence (EC-105).
 * - Backtrack preservation: Navigating backwards retains all previous responses intact (EC-104).
 * - Accidental refresh protection: Prompts before unload when assessment is active (EC-106).
 * - Atomic reset: Clears all answers, returns to landing view cleanly.
 */
export function useAssessmentSession(
  options: UseAssessmentSessionOptions = {}
): UseAssessmentSessionReturn {
  const questions = options.questions || defaultQuestionBank
  const totalQuestions = questions.length

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [responses, setResponses] = useState<Record<string, IncompleteUserResponse>>({})
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false)
  const [results, setResults] = useState<FullAssessmentResult | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : undefined

  // Guard: can continue only if both an answer option AND confidence are selected
  const canContinue = Boolean(
    currentResponse?.selectedOptionId && currentResponse?.confidence
  )

  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  // Warn on accidental tab close or page reload when assessment is active (EC-106)
  useEffect(() => {
    if (currentScreen !== 'assessment') return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if at least one response has been started
      if (Object.keys(responses).length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentScreen, responses])

  const startAssessment = useCallback(() => {
    setResponses({})
    setCurrentQuestionIndex(0)
    setIsCompleted(false)
    setResults(null)
    setCurrentScreen('assessment')
  }, [])

  const selectOption = useCallback((questionId: string, optionId: string) => {
    setResponses((prev) => {
      const existing = prev[questionId]
      // If user changed their option, clear previous confidence (EC-105 & TC-EC-09)
      const optionChanged = existing?.selectedOptionId && existing.selectedOptionId !== optionId
      const confidence = optionChanged ? undefined : existing?.confidence

      return {
        ...prev,
        [questionId]: {
          questionId,
          selectedOptionId: optionId,
          confidence,
        },
      }
    })
  }, [])

  const selectConfidence = useCallback((questionId: string, confidence: ConfidenceLevel) => {
    setResponses((prev) => {
      const existing = prev[questionId]
      // Guard: Cannot select confidence before choosing an option (EC-102)
      if (!existing?.selectedOptionId) return prev

      return {
        ...prev,
        [questionId]: {
          ...existing,
          confidence,
        },
      }
    })
  }, [])

  const nextQuestion = useCallback(() => {
    if (!currentQuestion) return

    const activeResp = responses[currentQuestion.id]
    // Invariant check: cannot proceed without both option and confidence (EC-101)
    if (!activeResp?.selectedOptionId || !activeResp?.confidence) {
      return
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))
    } else {
      // Final submission check: all questions must be fully answered
      const allAnswered = questions.every((q) => {
        const resp = responses[q.id]
        return resp?.selectedOptionId && resp?.confidence
      })

      if (!allAnswered) return

      // Compute diagnostic outcome
      const fullResponses = responses as Record<string, UserResponse>
      const evaluatedResult = evaluateAssessment(fullResponses, questions)

      setResults(evaluatedResult)
      setIsCompleted(true)
      setCurrentScreen('results')
    }
  }, [currentQuestion, currentQuestionIndex, responses, totalQuestions, questions])

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const openResetModal = useCallback(() => {
    setIsResetModalOpen(true)
  }, [])

  const cancelReset = useCallback(() => {
    setIsResetModalOpen(false)
  }, [])

  const confirmReset = useCallback(() => {
    setIsResetModalOpen(false)
    setResponses({})
    setCurrentQuestionIndex(0)
    setIsCompleted(false)
    setResults(null)
    setCurrentScreen('landing')
  }, [])

  const restart = useCallback(() => {
    if (currentScreen === 'assessment') {
      openResetModal()
    } else {
      confirmReset()
    }
  }, [currentScreen, openResetModal, confirmReset])

  return {
    currentScreen,
    currentQuestionIndex,
    currentQuestion,
    responses,
    currentResponse,
    isCompleted,
    isResetModalOpen,
    canContinue,
    results,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    startAssessment,
    selectOption,
    selectConfidence,
    nextQuestion,
    previousQuestion,
    openResetModal,
    cancelReset,
    confirmReset,
    restart,
  }
}

