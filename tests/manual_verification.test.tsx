import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'
import { questionBank } from '../src/data/questionBank'

describe('Comprehensive Frontend & UI Manual Verification Suite', () => {
  // ---------------------------------------------------------------------------
  // SCENARIO 1: Landing Page Verification
  // ---------------------------------------------------------------------------
  it('Scenario 1: Landing Page renders brand identity, disclosures, and starting CTA', () => {
    render(<App />)

    // Headline and value proposition
    expect(screen.getByText(/Bist du wirklich bereit für die A1-Prüfung\?/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Üben allein reicht nicht\. Bevor du 120 €\+ für die offizielle Deutschprüfung zahlst/i)
    ).toBeInTheDocument()

    // Value pillars / key metrics
    expect(screen.getByText(/12 gezielte Fragen/i)).toBeInTheDocument()
    expect(screen.getByText(/5–8 Minuten/i)).toBeInTheDocument()
    expect(screen.getByText(/Keine Registrierung & 100% vertraulich/i)).toBeInTheDocument()

    // Scope disclosure
    expect(screen.getByText(/Prüfungsumfang & Transparenz/i)).toBeInTheDocument()
    expect(screen.getByText(/Was geprüft wird:/i)).toBeInTheDocument()
    expect(screen.getByText(/Was nicht geprüft wird:/i)).toBeInTheDocument()
    expect(screen.getByText(/Hörverstehen/i)).toBeInTheDocument()
    expect(screen.getByText(/Mündliche Sprachprüfung/i)).toBeInTheDocument()

    // Start Button
    const startBtn = screen.getByRole('button', { name: /Diagnosetest jetzt starten/i })
    expect(startBtn).toBeInTheDocument()
    expect(startBtn).not.toBeDisabled()
  })

  // ---------------------------------------------------------------------------
  // SCENARIO 2: Two-Step Selection & Stepper Invariants
  // ---------------------------------------------------------------------------
  it('Scenario 2: Assessment runner enforces two-step selection, option-change reset, and backtracking preservation', () => {
    render(<App />)

    // Start assessment
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Initial state on Question 1
    expect(screen.getByText(/Frage 1 von 12/i)).toBeInTheDocument()
    expect(screen.getByText(/Wortschatz/i)).toBeInTheDocument()

    const continueBtn = screen.getByRole('button', { name: /Weiter/i })
    expect(continueBtn).toBeDisabled()

    // Back button is not in DOM on question 1 (invariant check)
    expect(screen.queryByRole('button', { name: /Zurück/i })).not.toBeInTheDocument()

    // Confidence prompt is hidden initially
    expect(screen.queryByText(/Wie sicher bist du dir bei dieser Antwort\?/i)).not.toBeInTheDocument()

    // Step 2.1: Select Option A
    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    // Confidence selector is now visible
    expect(screen.getByText(/Wie sicher bist du dir bei dieser Antwort\?/i)).toBeInTheDocument()
    expect(continueBtn).toBeDisabled() // Still disabled until confidence is picked

    // Step 2.2: Select Confidence "Ich habe geraten"
    const guessedBtn = screen.getByRole('button', { name: /Ich habe geraten/i })
    fireEvent.click(guessedBtn)
    expect(continueBtn).not.toBeDisabled() // Enabled!

    // Step 2.3: Invariant Test - Changing option MUST clear confidence (EC-105)
    fireEvent.click(radios[1])
    expect(continueBtn).toBeDisabled() // Must be disabled again!

    // Re-select confidence "Sicher"
    const sureBtn = screen.getByRole('button', { name: /Sicher \(Sure\)/i })
    fireEvent.click(sureBtn)
    expect(continueBtn).not.toBeDisabled() // Re-enabled

    // Step 2.4: Advance to Question 2
    fireEvent.click(continueBtn)
    expect(screen.getByText(/Frage 2 von 12/i)).toBeInTheDocument()

    // Back button is now present on question 2
    const backBtn = screen.getByRole('button', { name: /Zurück/i })
    expect(backBtn).toBeInTheDocument()

    // Step 2.5: Backtrack to Question 1 and verify state preservation (EC-104)
    fireEvent.click(backBtn)
    expect(screen.getByText(/Frage 1 von 12/i)).toBeInTheDocument()

    // Option B and Sure should still be active, Continue button should be enabled immediately
    expect(screen.getByRole('button', { name: /Weiter/i })).not.toBeDisabled()
  })

  // ---------------------------------------------------------------------------
  // SCENARIO 3: Reading Stimulus Rendering on Applied Questions
  // ---------------------------------------------------------------------------
  it('Scenario 3: Reading questions render authentic CEFR text stimuli', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Advance quickly to Q9 (first reading question)
    for (let i = 0; i < 8; i++) {
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[0])
      fireEvent.click(screen.getByRole('button', { name: /Sicher \(Sure\)/i }))
      fireEvent.click(screen.getByRole('button', { name: /Weiter/i }))
    }

    // Now on Question 9 (Reading 1)
    expect(screen.getByText(/Frage 9 von 12/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Leseverstehen/i).length).toBeGreaterThanOrEqual(1)
    // Check party email stimulus
    expect(screen.getByText(/Lieber Marco/i)).toBeInTheDocument()

    // Advance to Q10 (Reading 2)
    fireEvent.click(screen.getAllByRole('radio')[0])
    fireEvent.click(screen.getByRole('button', { name: /Sicher \(Sure\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /Weiter/i }))

    expect(screen.getByText(/Frage 10 von 12/i)).toBeInTheDocument()
    // Check library notice stimulus
    expect(screen.getByText(/STADTBIBLIOTHEK NORD/i)).toBeInTheDocument()

    // Advance to Q11 (Reading 3)
    fireEvent.click(screen.getAllByRole('radio')[0])
    fireEvent.click(screen.getByRole('button', { name: /Sicher \(Sure\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /Weiter/i }))

    expect(screen.getByText(/Frage 11 von 12/i)).toBeInTheDocument()
    // Check timetable stimulus
    expect(screen.getByText(/Fahrplan München Hbf -> Nürnberg Hbf/i)).toBeInTheDocument()

    // Advance to Q12 (Reading 4)
    fireEvent.click(screen.getAllByRole('radio')[0])
    fireEvent.click(screen.getByRole('button', { name: /Sicher \(Sure\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /Weiter/i }))

    expect(screen.getByText(/Frage 12 von 12/i)).toBeInTheDocument()
    // Check apartment classified ad stimulus
    expect(screen.getByText(/WOHNUNGSANZEIGE:/i)).toBeInTheDocument()

    // Button on Q12 must say "Ergebnisse auswerten" instead of "Weiter"
    expect(screen.getByRole('button', { name: /Ergebnisse auswerten/i })).toBeInTheDocument()
  })

  // ---------------------------------------------------------------------------
  // SCENARIO 4: Abort / Reset Confirmation Modal Flow
  // ---------------------------------------------------------------------------
  it('Scenario 4: Abort confirmation modal halts accidental exit and handles confirm/cancel correctly', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Answer Q1
    fireEvent.click(screen.getAllByRole('radio')[0])
    fireEvent.click(screen.getByRole('button', { name: /Sicher \(Sure\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /Weiter/i }))

    // Now on Q2
    expect(screen.getByText(/Frage 2 von 12/i)).toBeInTheDocument()

    // Click "Neu starten" in the Header
    const restartHeaderBtn = screen.getByRole('button', { name: /Neu starten/i })
    fireEvent.click(restartHeaderBtn)

    // Modal should be open
    expect(screen.getByText(/Diagnosetest wirklich abbrechen\?/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Wenn Sie neu starten, werden alle bisher ausgewählten Antworten und Einstufungen unwiderruflich gelöscht./i)
    ).toBeInTheDocument()

    // Click Cancel ("Weiter üben")
    const cancelBtn = screen.getByRole('button', { name: /Weiter üben/i })
    fireEvent.click(cancelBtn)

    // Modal should be gone and user still on Q2
    expect(screen.queryByText(/Diagnosetest wirklich abbrechen\?/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Frage 2 von 12/i)).toBeInTheDocument()

    // Click "Neu starten" again, this time confirm ("Ja, neu starten")
    fireEvent.click(restartHeaderBtn)
    const confirmBtn = screen.getByRole('button', { name: /Ja, neu starten/i })
    fireEvent.click(confirmBtn)

    // User is returned to Landing Page
    expect(screen.getByText(/Bist du wirklich bereit für die A1-Prüfung\?/i)).toBeInTheDocument()
  })

  // ---------------------------------------------------------------------------
  // SCENARIO 5: Results Dashboard - "Practise Before Booking" (Weak Skill Safeguard)
  // ---------------------------------------------------------------------------
  it('Scenario 5: Results Dashboard correctly displays "Vor der Buchung noch üben" for a candidate with weak grammar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Answer all 12 questions:
    // Vocab (Q1-Q4): all correct + sure (4/4)
    // Grammar (Q5-Q8): Q5 correct, Q6, Q7, Q8 incorrect + guessed (1/4 -> Weak skill safeguard!)
    // Reading (Q9-Q12): all correct + sure (4/4)
    for (let i = 0; i < 12; i++) {
      const q = questionBank[i]
      const isWeakGrammarMistake = q.skill === 'grammar' && i > 4

      const radios = screen.getAllByRole('radio')
      const targetOptIndex = isWeakGrammarMistake
        ? q.options.findIndex((o) => o.id !== q.correctOptionId)
        : q.options.findIndex((o) => o.id === q.correctOptionId)

      fireEvent.click(radios[targetOptIndex])

      const confBtn = isWeakGrammarMistake
        ? screen.getByRole('button', { name: /Ich habe geraten/i })
        : screen.getByRole('button', { name: /Sicher \(Sure\)/i })
      fireEvent.click(confBtn)

      const actionBtn = screen.getByRole('button', { name: i === 11 ? /Ergebnisse auswerten/i : /Weiter/i })
      fireEvent.click(actionBtn)
    }

    // Results Dashboard
    expect(screen.getByText(/Vor der Buchung noch üben/i)).toBeInTheDocument()
    expect(screen.getByText(/Im Bereich Grammatik wurden 2 oder weniger von 4 Fragen richtig beantwortet/i)).toBeInTheDocument()
    expect(screen.getByText(/Hinweis: Diese Einstufung ist ein diagnostischer Richtwert/i)).toBeInTheDocument()

    // Skill breakdown check
    expect(screen.getByText(/1 \/ 4/i)).toBeInTheDocument() // Grammar

    // Practice priority list should highlight Grammar
    expect(screen.getByText(/Prioritäre Übungsmaßnahmen/i)).toBeInTheDocument()

    // Mistake Review Drawer starts open, with "Einklappen" button
    expect(screen.getByText(/Fehler- und Antwortanalyse/i)).toBeInTheDocument()
    const collapseBtn = screen.getByRole('button', { name: /Einklappen/i })
    expect(collapseBtn).toBeInTheDocument()

    // Test collapsing and re-expanding drawer
    fireEvent.click(collapseBtn)
    const expandBtn = screen.getByRole('button', { name: /Ausklappen/i })
    expect(expandBtn).toBeInTheDocument()
    fireEvent.click(expandBtn)
    expect(screen.getByRole('button', { name: /Einklappen/i })).toBeInTheDocument()

    // Restart from Results screen
    const restartBtn = screen.getByRole('button', { name: /Diagnosetest erneut durchführen/i })
    fireEvent.click(restartBtn)

    // Returned to landing page
    expect(screen.getByText(/Bist du wirklich bereit für die A1-Prüfung\?/i)).toBeInTheDocument()
  })

  // ---------------------------------------------------------------------------
  // SCENARIO 6: Results Dashboard - "Ready to Consider Booking" (Mastery)
  // ---------------------------------------------------------------------------
  it('Scenario 6: Results Dashboard correctly displays "Prüfungsbuchung in Betracht ziehen" for perfect candidate', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // Answer all 12 questions 100% correct + sure
    for (let i = 0; i < 12; i++) {
      const q = questionBank[i]
      const correctOptIndex = q.options.findIndex((o) => o.id === q.correctOptionId)
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[correctOptIndex])

      const sureBtn = screen.getByRole('button', { name: /Sicher \(Sure\)/i })
      fireEvent.click(sureBtn)

      const actionBtn = screen.getByRole('button', { name: i === 11 ? /Ergebnisse auswerten/i : /Weiter/i })
      fireEvent.click(actionBtn)
    }

    // Results Dashboard
    expect(screen.getByText(/Prüfungsbuchung in Betracht ziehen/i)).toBeInTheDocument()
    expect(screen.getByText(/Hervorragendes Ergebnis: In allen drei Teilbereichen/i)).toBeInTheDocument()

    // Zero-weight maintenance recommendation
    expect(screen.getByText(/Wortschatz und Grammatik festigen/i)).toBeInTheDocument()
    expect(screen.getByText(/Alle Bereiche zeigen sicheres Wissen/i)).toBeInTheDocument()

    // Zero-mistake drawer state
    expect(screen.getByText(/Hervorragend! Keine falschen Antworten/i)).toBeInTheDocument()
  })

  // ---------------------------------------------------------------------------
  // SCENARIO 7: Results Dashboard - "Almost There" (Fragile / Guessed)
  // ---------------------------------------------------------------------------
  it('Scenario 7: Results Dashboard correctly displays "Fast am Ziel" when scores are balanced but confidence is fragile', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Diagnosetest jetzt starten/i }))

    // All correct (3 or 4 in each skill), but in Vocab: 2 correct sure, 2 correct guessed.
    // In Grammar: 3 correct sure, 1 correct guessed.
    // In Reading: 3 correct sure, 1 correct guessed.
    // Result: Vocab secureCount = 2 (< 3) -> Rule 2 does not trigger.
    // Deficit: No skill <= 2 correct (Vocab 4/4, Grammar 4/4, Reading 4/4). Blind spots = 0.
    // Triggers Rule 3: Almost there!
    for (let i = 0; i < 12; i++) {
      const q = questionBank[i]
      const correctOptIndex = q.options.findIndex((o) => o.id === q.correctOptionId)
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[correctOptIndex])

      // Guessed on Q1, Q2, Q6, Q10
      const isGuessed = i === 0 || i === 1 || i === 5 || i === 9
      const confBtn = isGuessed
        ? screen.getByRole('button', { name: /Ich habe geraten/i })
        : screen.getByRole('button', { name: /Sicher \(Sure\)/i })
      fireEvent.click(confBtn)

      const actionBtn = screen.getByRole('button', { name: i === 11 ? /Ergebnisse auswerten/i : /Weiter/i })
      fireEvent.click(actionBtn)
    }

    // Results Dashboard
    expect(screen.getByText(/Fast am Ziel/i)).toBeInTheDocument()
    expect(screen.getByText(/Gute Ausgangsbasis: Es liegen keine gravierenden Schwächen vor/i)).toBeInTheDocument()
  })
})
