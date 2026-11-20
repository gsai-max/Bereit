import { useAssessmentSession } from './hooks/useAssessmentSession'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { LandingPage } from './components/landing/LandingPage'
import { AssessmentRunner } from './components/assessment/AssessmentRunner'
import { ResultsDashboard } from './components/results/ResultsDashboard'
import { ConfirmModal } from './components/common/ConfirmModal'

export default function App() {
  const {
    currentScreen,
    currentQuestionIndex,
    currentQuestion,
    currentResponse,
    canContinue,
    results,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    isResetModalOpen,
    startAssessment,
    selectOption,
    selectConfidence,
    nextQuestion,
    previousQuestion,
    confirmReset,
    cancelReset,
    restart,
  } = useAssessmentSession()

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-brand-blue/15 selection:text-brand-blue">
      {/* Global Header */}
      <Header currentScreen={currentScreen} onRestartClick={restart} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {currentScreen === 'landing' && (
          <LandingPage onStart={startAssessment} />
        )}

        {currentScreen === 'assessment' && currentQuestion && (
          <AssessmentRunner
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            currentResponse={currentResponse}
            canContinue={canContinue}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            onSelectOption={selectOption}
            onSelectConfidence={selectConfidence}
            onNext={nextQuestion}
            onPrevious={previousQuestion}
          />
        )}

        {currentScreen === 'results' && results && (
          <ResultsDashboard
            results={results}
            totalQuestions={totalQuestions}
            onRestart={confirmReset}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Reset Confirmation Dialog */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Diagnosetest wirklich abbrechen?"
        message="Wenn Sie neu starten, werden alle bisher ausgewählten Antworten und Einstufungen unwiderruflich gelöscht."
        confirmText="Ja, neu starten"
        cancelText="Weiter üben"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </div>
  )
}
