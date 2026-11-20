import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import type { EvaluatedQuestionResponse } from '../../types/diagnostic'

export interface MistakeReviewDrawerProps {
  evaluatedResponses: EvaluatedQuestionResponse[]
}

export function MistakeReviewDrawer({ evaluatedResponses }: MistakeReviewDrawerProps) {
  const [isOpen, setIsOpen] = useState(true)

  const incorrectResponses = evaluatedResponses.filter((item) => !item.isCorrect)

  return (
    <Card className="bg-white border-gray-200 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink flex items-center gap-2">
            <span>Fehler- und Antwortanalyse</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
              {incorrectResponses.length} {incorrectResponses.length === 1 ? 'Fehler' : 'Fehler'}
            </span>
          </h3>
          <p className="text-xs text-text-muted">
            Überprüfen Sie alle falsch beantworteten Fragen mit grammatikalischen Erläuterungen.
          </p>
        </div>

        {incorrectResponses.length > 0 && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1 min-h-[44px] px-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-expanded={isOpen}
            aria-controls="mistake-review-content"
          >
            <span>{isOpen ? 'Einklappen' : 'Ausklappen'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {incorrectResponses.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-state-secure" />
          <span>Hervorragend! Keine falschen Antworten — alle 12 Fragen wurden richtig beantwortet.</span>
        </div>
      ) : isOpen ? (
        <div id="mistake-review-content" className="space-y-4 pt-1">
          {incorrectResponses.map((item, idx) => {
            const userChosenOption = item.question.options.find(
              (o) => o.id === item.response.selectedOptionId
            )
            const correctOption = item.question.options.find(
              (o) => o.id === item.question.correctOptionId
            )

            return (
              <div
                key={item.question.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-3 text-xs sm:text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-ink">
                    Frage {idx + 1}: {item.question.prompt}
                  </span>
                  <Badge state={item.diagnosticState} size="sm" />
                </div>

                {item.question.contextStimulus && (
                  <div className="p-2.5 rounded bg-white border border-gray-200 text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {item.question.contextStimulus}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Learner choice */}
                  <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-200 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-red-900 block">Ihre Wahl ({item.response.confidence === 'sure' ? 'Sicher' : 'Geraten'}):</span>
                      <span className="text-red-800">{userChosenOption?.text || 'Keine Auswahl'}</span>
                    </div>
                  </div>

                  {/* Correct option */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-state-secure flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-900 block">Richtige Antwort:</span>
                      <span className="text-emerald-800">{correctOption?.text}</span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-950 leading-relaxed">
                  <strong>Erklärung:</strong> {item.question.explanation}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </Card>
  )
}

