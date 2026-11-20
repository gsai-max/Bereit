import { Card } from '../common/Card'
import { ProgressBar } from './ProgressBar'
import { StimulusCard } from './StimulusCard'
import { OptionGroup } from './OptionGroup'
import { ConfidenceSelector } from './ConfidenceSelector'
import { NavigationBar } from './NavigationBar'
import type {
  ConfidenceLevel,
  IncompleteUserResponse,
  Question,
} from '../../types/diagnostic'

export interface AssessmentRunnerProps {
  currentQuestion: Question
  currentQuestionIndex: number
  totalQuestions: number
  currentResponse: IncompleteUserResponse | undefined
  canContinue: boolean
  isFirstQuestion: boolean
  isLastQuestion: boolean
  onSelectOption: (questionId: string, optionId: string) => void
  onSelectConfidence: (questionId: string, confidence: ConfidenceLevel) => void
  onNext: () => void
  onPrevious: () => void
}

export function AssessmentRunner({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  currentResponse,
  canContinue,
  isFirstQuestion,
  isLastQuestion,
  onSelectOption,
  onSelectConfidence,
  onNext,
  onPrevious,
}: AssessmentRunnerProps) {
  const selectedOptionId = currentResponse?.selectedOptionId
  const confidence = currentResponse?.confidence
  const hasSelectedOption = Boolean(selectedOptionId)

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 sm:py-4 animate-in fade-in duration-200">
      {/* Progress & Category */}
      <ProgressBar
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        skill={currentQuestion.skill}
        cognitiveLevel={currentQuestion.cognitiveLevel}
      />

      <Card className="bg-white space-y-6 shadow-sm">
        {/* Reading context if available */}
        {currentQuestion.contextStimulus && (
          <StimulusCard stimulus={currentQuestion.contextStimulus} />
        )}

        {/* Question Prompt */}
        <div className="space-y-1">
          <h2
            id="question-prompt"
            className="text-lg sm:text-xl font-bold text-ink leading-snug"
          >
            {currentQuestion.prompt}
          </h2>
          <p id="question-topic" className="text-xs text-text-muted">
            Thema: {currentQuestion.topicDisplayName}
          </p>
        </div>

        {/* 4 Options */}
        <OptionGroup
          options={currentQuestion.options}
          selectedOptionId={selectedOptionId}
          ariaLabelledBy="question-prompt"
          ariaDescribedBy="question-topic"
          onSelectOption={(optId) => onSelectOption(currentQuestion.id, optId)}
        />

        {/* Confidence Selector (revealed when an option is selected) */}
        {hasSelectedOption && (
          <ConfidenceSelector
            confidence={confidence}
            onSelectConfidence={(conf) =>
              onSelectConfidence(currentQuestion.id, conf)
            }
          />
        )}

        {/* Navigation Controls */}
        <NavigationBar
          canContinue={canContinue}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </Card>
    </div>
  )
}

