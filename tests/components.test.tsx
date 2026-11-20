import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'

describe('End-to-End Presentation Layer (Phase 6)', () => {
  it('renders landing page with headline, scope disclosures and CTA', () => {
    render(<App />)

    expect(screen.getByText(/Bist du wirklich bereit für die A1-Prüfung\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Prüfungsumfang & Transparenz/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i })).toBeInTheDocument()
  })

  it('navigates from landing to assessment on clicking start CTA', () => {
    render(<App />)

    const startButton = screen.getByRole('button', { name: /Diagnosetest jetzt starten/i })
    fireEvent.click(startButton)

    // Should display Frage 1 von 12
    expect(screen.getByText(/Frage 1 von 12/i)).toBeInTheDocument()
    expect(screen.getByText(/Wo kauft man in Deutschland Medikamente\?/i)).toBeInTheDocument()

    // Continue button should be disabled initially
    const continueBtn = screen.getByRole('button', { name: /Weiter/i })
    expect(continueBtn).toBeDisabled()
  })

  it('reveals confidence selector when an option is selected, and enables continue after confidence chosen', () => {
    render(<App />)

    // Start
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Initially confidence prompt is not visible
    expect(screen.queryByText(/Wie sicher bist du dir bei dieser Antwort\?/i)).not.toBeInTheDocument()

    // Select Option "In der Apotheke"
    const apothekeOption = screen.getByText(/In der Apotheke/i)
    fireEvent.click(apothekeOption)

    // Now confidence selector is revealed
    expect(screen.getByText(/Wie sicher bist du dir bei dieser Antwort\?/i)).toBeInTheDocument()
    const continueBtn = screen.getByRole('button', { name: /Weiter/i })
    expect(continueBtn).toBeDisabled()

    // Select Confidence "Sicher (Sure)"
    const sureBtn = screen.getByRole('button', { name: /Sicher \(Sure\)/i })
    fireEvent.click(sureBtn)

    // Continue is now enabled
    expect(continueBtn).not.toBeDisabled()

    // Advance to Q2
    fireEvent.click(continueBtn)
    expect(screen.getByText(/Frage 2 von 12/i)).toBeInTheDocument()
  })

  it('supports backtracking and preserves selected responses', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Q1: select option B and sure
    fireEvent.click(screen.getByText(/In der Apotheke/i))
    fireEvent.click(screen.getByRole('button', { name: /Sicher \(Sure\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /Weiter/i }))

    expect(screen.getByText(/Frage 2 von 12/i)).toBeInTheDocument()

    // Back to Q1
    const backBtn = screen.getByRole('button', { name: /Zurück/i })
    fireEvent.click(backBtn)

    expect(screen.getByText(/Frage 1 von 12/i)).toBeInTheDocument()
    const continueBtn = screen.getByRole('button', { name: /Weiter/i })
    expect(continueBtn).not.toBeDisabled()
  })

  it('runs complete flow and lands on Results Dashboard', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Answer all 12 questions
    for (let i = 0; i < 12; i++) {
      // Pick first radio option
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[1] || radios[0])

      // Pick "Sicher"
      const sureBtn = screen.getByRole('button', { name: /Sicher \(Sure\)/i })
      fireEvent.click(sureBtn)

      // Click Continue / Evaluate
      const nextBtn = screen.getByRole('button', { name: i === 11 ? /Ergebnisse auswerten/i : /Weiter/i })
      fireEvent.click(nextBtn)
    }

    // Should now be on Results screen
    expect(screen.getByText(/Teilbereich-Analyse/i)).toBeInTheDocument()
    expect(screen.getByText(/Prioritäre Übungsmaßnahmen/i)).toBeInTheDocument()
    expect(screen.getByText(/Fehler- und Antwortanalyse/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Diagnosetest erneut durchführen/i })).toBeInTheDocument()
  })
})

