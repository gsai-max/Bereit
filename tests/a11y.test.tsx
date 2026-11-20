import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'
import { Badge } from '../src/components/common/Badge'
import { OptionGroup } from '../src/components/assessment/OptionGroup'
import { ConfidenceSelector } from '../src/components/assessment/ConfidenceSelector'
import { ConfirmModal } from '../src/components/common/ConfirmModal'
import { SkillBreakdownGrid } from '../src/components/results/SkillBreakdownGrid'
import type { DiagnosticState, SkillCategory, SkillScoreSummary } from '../src/types/diagnostic'

describe('Phase 7: Accessibility (a11y), Polish & Responsive Verification', () => {
  describe('7.1 Accessibility Standards (WCAG 2.1 AA) - Multi-Modal Indicators', () => {
    const states: { state: DiagnosticState; label: string }[] = [
      { state: 'secure_knowledge', label: 'Sicheres Wissen' },
      { state: 'uncertain_knowledge', label: 'Unsicheres Wissen' },
      { state: 'known_gap', label: 'Bekannte Lücke' },
      { state: 'potential_blind_spot', label: 'Blinder Fleck' },
    ]

    it.each(states)(
      'renders both icon and text label for diagnostic state $state without relying solely on color',
      ({ state, label }) => {
        const { container } = render(<Badge state={state} />)
        expect(screen.getByText(label)).toBeInTheDocument()
        const svgIcon = container.querySelector('svg')
        expect(svgIcon).toBeInTheDocument()
        expect(svgIcon).toHaveAttribute('aria-hidden', 'true')
      }
    )

    it('renders distinct icons alongside text in SkillBreakdownGrid for all 4 states', () => {
      const mockSummaries: Record<SkillCategory, SkillScoreSummary> = {
        vocabulary: {
          skill: 'vocabulary',
          totalQuestions: 4,
          correctCount: 3,
          accuracyPercentage: 75,
          secureCount: 2,
          uncertainCount: 1,
          knownGapCount: 1,
          blindSpotCount: 0,
        },
        grammar: {
          skill: 'grammar',
          totalQuestions: 4,
          correctCount: 4,
          accuracyPercentage: 100,
          secureCount: 4,
          uncertainCount: 0,
          knownGapCount: 0,
          blindSpotCount: 0,
        },
        reading: {
          skill: 'reading',
          totalQuestions: 4,
          correctCount: 2,
          accuracyPercentage: 50,
          secureCount: 1,
          uncertainCount: 1,
          knownGapCount: 1,
          blindSpotCount: 1,
        },
      }

      const { container } = render(<SkillBreakdownGrid skillSummaries={mockSummaries} />)

      // Each skill card has 4 state badges, each must have an svg icon
      const icons = container.querySelectorAll('.grid svg')
      expect(icons.length).toBeGreaterThanOrEqual(12) // 3 skills * 4 state icons
    })
  })

  describe('7.1 Keyboard Navigation & Focus Management', () => {
    const sampleOptions = [
      { id: 'opt_1', text: 'Option A' },
      { id: 'opt_2', text: 'Option B' },
      { id: 'opt_3', text: 'Option C' },
      { id: 'opt_4', text: 'Option D' },
    ] as any

    it('supports ArrowDown, ArrowUp and wrap-around keyboard navigation in OptionGroup', () => {
      const handleSelect = vi.fn()
      render(
        <OptionGroup
          options={sampleOptions}
          selectedOptionId="opt_1"
          onSelectOption={handleSelect}
        />
      )

      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(4)

      // Arrow Down from Option 1 -> selects Option 2
      fireEvent.keyDown(radios[0], { key: 'ArrowDown' })
      expect(handleSelect).toHaveBeenCalledWith('opt_2')

      // Arrow Down from Option 4 -> wraps around to Option 1
      fireEvent.keyDown(radios[3], { key: 'ArrowDown' })
      expect(handleSelect).toHaveBeenCalledWith('opt_1')

      // Arrow Up from Option 1 -> wraps around to Option 4
      fireEvent.keyDown(radios[0], { key: 'ArrowUp' })
      expect(handleSelect).toHaveBeenCalledWith('opt_4')
    })

    it('supports Arrow navigation to switch confidence in ConfidenceSelector', () => {
      const handleSelectConfidence = vi.fn()
      render(
        <ConfidenceSelector
          confidence="sure"
          onSelectConfidence={handleSelectConfidence}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)

      // From sure, ArrowRight switches to guessed
      fireEvent.keyDown(buttons[0], { key: 'ArrowRight' })
      expect(handleSelectConfidence).toHaveBeenCalledWith('guessed')

      // From guessed, ArrowLeft switches to sure
      fireEvent.keyDown(buttons[1], { key: 'ArrowLeft' })
      expect(handleSelectConfidence).toHaveBeenCalledWith('sure')
    })

    it('traps focus inside ConfirmModal and handles Escape key', () => {
      const handleConfirm = vi.fn()
      const handleCancel = vi.fn()

      render(
        <ConfirmModal
          isOpen={true}
          title="Modal Title"
          message="Modal message"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )

      const cancelBtn = screen.getByRole('button', { name: /Abbrechen/i })
      const confirmBtn = screen.getByRole('button', { name: /Ja, neu starten/i })

      // Focus should initially be on confirm button
      expect(document.activeElement).toBe(confirmBtn)

      // Tab on Confirm button wraps focus to Cancel button
      fireEvent.keyDown(window, { key: 'Tab' })
      expect(document.activeElement).toBe(cancelBtn)

      // Shift+Tab on Cancel button wraps focus back to Confirm button
      fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(confirmBtn)

      // Escape triggers onCancel
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(handleCancel).toHaveBeenCalled()
    })
  })

  describe('7.1 & 7.2 ARIA Attributes & Semantics', () => {
    it('sets appropriate ARIA roles, labels and live regions in assessment flow', () => {
      render(<App />)

      // Start assessment
      fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

      // OptionGroup has radiogroup role with accessible labeling
      const radiogroup = screen.getByRole('radiogroup')
      expect(radiogroup).toBeInTheDocument()
      expect(radiogroup).toHaveAttribute('aria-labelledby', 'question-prompt')

      // Progress bar has correct progressbar role and accessibility values
      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('aria-valuenow', '1')
      expect(progressbar).toHaveAttribute('aria-valuemin', '1')
      expect(progressbar).toHaveAttribute('aria-valuemax', '12')
      expect(progressbar).toHaveAttribute('aria-valuetext')

      // Radios have aria-checked
      const radios = screen.getAllByRole('radio')
      expect(radios[0]).toHaveAttribute('aria-checked', 'false')

      // Select an option
      fireEvent.click(radios[0])
      expect(radios[0]).toHaveAttribute('aria-checked', 'true')

      // Confidence selector group appears with aria-live container
      const confidenceGroup = screen.getByRole('group', { name: /Wie sicher bist du dir bei dieser Antwort\?/i })
      expect(confidenceGroup).toBeInTheDocument()
    })

    it('manages aria-expanded and aria-controls in collapsibles', () => {
      render(<App />)

      // Complete flow to reach results
      fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))
      for (let i = 0; i < 12; i++) {
        const radios = screen.getAllByRole('radio')
        fireEvent.click(radios[0])
        const sureBtn = screen.getByRole('button', { name: /Sicher \(Sure\)/i })
        fireEvent.click(sureBtn)
        const nextBtn = screen.getByRole('button', { name: i === 11 ? /Ergebnisse auswerten/i : /Weiter/i })
        fireEvent.click(nextBtn)
      }

      // Diagnostic Legend collapsible
      const legendToggle = screen.getByRole('button', { name: /Wie liest man die 4 Diagnose-Zustände\?/i })
      expect(legendToggle).toHaveAttribute('aria-expanded', 'false')
      expect(legendToggle).toHaveAttribute('aria-controls', 'diagnostic-legend-content')

      fireEvent.click(legendToggle)
      expect(legendToggle).toHaveAttribute('aria-expanded', 'true')
      expect(document.getElementById('diagnostic-legend-content')).toBeInTheDocument()
    })
  })

  describe('7.3 Accidental Interruption (beforeunload) & Navigation Integrity', () => {
    it('registers beforeunload handler when assessment is in progress and responses exist', () => {
      render(<App />)

      // Start assessment
      fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

      // Select option
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[0])

      // Fire beforeunload
      const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(event.defaultPrevented).toBe(true)
    })

    it('does not prompt beforeunload on landing screen', () => {
      render(<App />)

      const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    it('clears confidence when learner modifies their chosen option (EC-105)', () => {
      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

      const radios = screen.getAllByRole('radio')
      // Select option 1
      fireEvent.click(radios[0])
      // Select sure
      const sureBtn = screen.getByRole('button', { name: /Sicher \(Sure\)/i })
      fireEvent.click(sureBtn)

      const continueBtn = screen.getByRole('button', { name: /Weiter/i })
      expect(continueBtn).not.toBeDisabled()

      // Change option to option 2
      fireEvent.click(radios[1])

      // Confidence should now be reset, continue disabled
      expect(continueBtn).toBeDisabled()
    })
  })
})
