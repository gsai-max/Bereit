import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AiTutorCard } from '../src/components/results/AiTutorCard'
import type { FullAssessmentResult } from '../src/types/diagnostic'

const mockResults: FullAssessmentResult = {
  readiness: {
    category: 'almost_there',
    headline: 'Fast am Ziel',
    explanation: 'Solide Grundlagen, jedoch leichte Unsicherheiten.',
    provisionalNotice: 'Prüfungsgebühr nur investieren, wenn Unsicherheiten beseitigt sind.',
  },
  skillSummaries: {
    vocabulary: {
      skill: 'vocabulary',
      totalQuestions: 4,
      correctCount: 4,
      accuracyPercentage: 100,
      secureCount: 4,
      uncertainCount: 0,
      knownGapCount: 0,
      blindSpotCount: 0,
    },
    grammar: {
      skill: 'grammar',
      totalQuestions: 4,
      correctCount: 2,
      accuracyPercentage: 50,
      secureCount: 2,
      uncertainCount: 0,
      knownGapCount: 1,
      blindSpotCount: 1,
    },
    reading: {
      skill: 'reading',
      totalQuestions: 4,
      correctCount: 3,
      accuracyPercentage: 75,
      secureCount: 3,
      uncertainCount: 0,
      knownGapCount: 1,
      blindSpotCount: 0,
    },
  },
  totalCorrect: 9,
  totalBlindSpots: 1,
  evaluatedResponses: [],
  topRecommendations: [],
}

describe('AiTutorCard (Groq LLaMA 3.1 Integration)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('renders the AI Tutor card with LLaMA 3.1 badge and diagnostic context', () => {
    render(<AiTutorCard results={mockResults} />)

    expect(screen.getByText(/Interaktiver KI-Tutor/i)).toBeInTheDocument()
    expect(screen.getByText(/Groq LLaMA 3.1/i)).toBeInTheDocument()
    expect(screen.getByText(/Diagnostischer Lernkontext:/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Grammatik/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Häufige Fragen zu Ihren A1-Ergebnissen:/i)).toBeInTheDocument()
  })

  it('submits a user question to /api/tutor and renders the response', async () => {
    const mockReply = 'Im Deutschen steht das finite Verb im Hauptsatz immer an zweiter Position.'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: mockReply }),
    })

    render(<AiTutorCard results={mockResults} />)

    const input = screen.getByPlaceholderText(/Frage an den KI-Tutor stellen/i)
    fireEvent.change(input, { target: { value: 'Warum steht das Verb auf Position 2?' } })

    const sendBtn = screen.getByRole('button', { name: /Frage absenden/i })
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/tutor', expect.objectContaining({
      method: 'POST',
    }))
  })

  it('displays setup guidance banner when GROQ_API_KEY is unconfigured', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        error: 'GROQ_API_KEY_NOT_CONFIGURED',
        reply: 'Der KI-Tutor ist derzeit im Standby-Modus.',
      }),
    })

    render(<AiTutorCard results={mockResults} />)

    const quickBtn = screen.getByText(/Wann benutzt man im Deutschen Akkusativ und wann Dativ\?/i)
    fireEvent.click(quickBtn)

    await waitFor(() => {
      expect(screen.getByText(/Hinweis: GROQ_API_KEY in Vercel konfigurieren/i)).toBeInTheDocument()
      expect(screen.getByText(/Der KI-Tutor ist derzeit im Standby-Modus/i)).toBeInTheDocument()
    })
  })
})
