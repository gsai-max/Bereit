import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { Card } from '../common/Card'
import type { FullAssessmentResult, SkillCategory } from '../../types/diagnostic'

export interface AiTutorCardProps {
  results: FullAssessmentResult
  initialPrompt?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  error?: string
}

const SKILL_NAMES: Record<SkillCategory, string> = {
  vocabulary: 'Wortschatz (Vocabulary)',
  grammar: 'Grammatik (Grammar)',
  reading: 'Leseverstehen (Reading)',
}

export function AiTutorCard({ results, initialPrompt }: AiTutorCardProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConfigWarningVisible, setIsConfigWarningVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Identify weakest skill for contextual prompt suggestion
  const skillEntries = Object.entries(results.skillSummaries) as [SkillCategory, typeof results.skillSummaries[SkillCategory]][]
  skillEntries.sort((a, b) => a[1].correctCount - b[1].correctCount)
  const weakestSkill = skillEntries[0] ? SKILL_NAMES[weakestSkillEntries(skillEntries[0][0])] : 'Grammatik'

  function weakestSkillEntries(skill: SkillCategory): SkillCategory {
    return skill
  }

  // Quick suggestion chips
  const quickPrompts = [
    `Erkläre mir typische Fehler im Bereich ${weakestSkill}.`,
    'Wann benutzt man im Deutschen Akkusativ und wann Dativ?',
    'Welche Tipps gibt es für die Goethe Start Deutsch 1 Prüfung?',
    'Warum steht das konjugierte Verb im Hauptsatz immer auf Position 2?',
  ]

  // If initialPrompt provided, trigger it
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      sendMessage(initialPrompt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage(textToSend?: string) {
    const questionText = textToSend || input
    if (!questionText.trim() || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: questionText.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      if (data.error === 'GROQ_API_KEY_NOT_CONFIGURED') {
        setIsConfigWarningVisible(true)
      } else {
        setIsConfigWarningVisible(false)
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Keine Antwort vom KI-Tutor erhalten.',
          error: data.error,
        },
      ])
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Verbindungsfehler'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Entschuldigung, die Verbindung zum KI-Tutor ist fehlgeschlagen (${errMsg}).`,
          error: 'NETWORK_ERROR',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleResetChat() {
    setMessages([])
    setIsConfigWarningVisible(false)
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/80 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-ink">
                Interaktiver KI-Tutor
              </h3>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                Groq LLaMA 3.1
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Vertiefen Sie grammatikalische Nuancen und erhalten Sie Prüfungstipps für Goethe / ÖSD A1.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              title="Chat zurücksetzen"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Chat zurücksetzen"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 min-h-[44px] px-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-expanded={isOpen}
            aria-controls="ai-tutor-content"
            aria-label={isOpen ? 'Tutor minimieren' : 'Tutor öffnen'}
          >
            <span>{isOpen ? 'Tutor minimieren' : 'Tutor öffnen'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="ai-tutor-content" className="space-y-4 pt-1">
          {/* Diagnostic Context Pill */}
          <div className="p-3 rounded-lg bg-white border border-blue-100 flex items-start gap-2.5 text-xs text-gray-700">
            <BookOpen className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-ink">Diagnostischer Lernkontext:</span>{' '}
              Schwächster Teilbereich: <strong className="text-blue-900">{weakestSkill}</strong>. {results.totalBlindSpots > 0 ? (
                <span>Erkannte Blind Spots: <strong className="text-amber-800">{results.totalBlindSpots} Frage(n)</strong> mit hoher Sicherheit falsch beantwortet.</span>
              ) : (
                <span>Keine Blind Spots erkannt — gute Grundlagen vorhanden.</span>
              )}
            </div>
          </div>

          {/* Configuration Banner if Key is missing */}
          {isConfigWarningVisible && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Hinweis: GROQ_API_KEY in Vercel konfigurieren</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Um Live-Antworten des LLaMA 3.1 Modells zu aktivieren, tragen Sie Ihren kostenlosen Schlüssel im Vercel Dashboard unter <strong>Settings &rarr; Environment Variables</strong> als <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">GROQ_API_KEY</code> ein.
              </p>
            </div>
          )}

          {/* Quick Prompts */}
          {messages.length === 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-text-muted block">
                Häufige Fragen zu Ihren A1-Ergebnissen:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="text-left text-xs bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 py-1.5 px-3 rounded-lg transition-colors shadow-2xs disabled:opacity-50 min-h-[38px] flex items-center"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation history */}
          {messages.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'items-end'
                      : 'items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[92%] whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-brand-blue text-white rounded-br-none shadow-2xs'
                        : msg.error === 'GROQ_API_KEY_NOT_CONFIGURED'
                        ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-bl-none'
                        : 'bg-white text-ink border border-gray-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-xs text-text-muted w-fit animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                  <span>Bereit Bot formuliert A1-Erklärung...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frage an den KI-Tutor stellen (z.B. Erkläre Akkusativ-Präpositionen)..."
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue bg-white min-h-[44px]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 min-h-[44px] min-w-[44px] shadow-2xs"
              aria-label="Frage absenden"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Fragen</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </Card>
  )
}
