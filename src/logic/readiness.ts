import type {
  SkillCategory,
  SkillScoreSummary,
  ReadinessEvaluation,
} from '../types/diagnostic'

export const PROVISIONAL_DISCLAIMER =
  'Hinweis: Diese Einstufung ist ein diagnostischer Richtwert für Ihre Prüfungsvorbereitung und keine offizielle Prüfungsbewertung des Goethe-Instituts oder des ÖSD.'

/**
 * Provisional Readiness Rule Evaluator
 *
 * Rules are strictly evaluated in sequential priority order to eliminate edge-case ambiguity:
 *
 * 1. Rule 1 (Safeguard Check) -> 'practise_before_booking'
 *    - Condition A: Any skill has <= 2 correct answers (out of 4)
 *    - Condition B: Total Potential Blind Spots across all questions >= 3
 *    - Trigger: Condition A OR Condition B
 *
 * 2. Rule 2 (Mastery Check) -> 'ready_to_consider_booking'
 *    - Condition C: Every skill has >= 3 correct AND marked 'sure' (secureCount >= 3)
 *    - Condition D: Total Potential Blind Spots across all questions <= 1
 *    - Trigger: Condition C AND Condition D
 *
 * 3. Rule 3 (Fallthrough Default) -> 'almost_there'
 *    - Trigger: All other balanced profiles
 */
export function evaluateReadiness(
  skillSummaries: Record<SkillCategory, SkillScoreSummary>,
  totalBlindSpots: number
): ReadinessEvaluation {
  const skills: SkillCategory[] = ['vocabulary', 'grammar', 'reading']

  // -------------------------------------------------------------
  // RULE 1: Safeguard Check (Practise before booking)
  // -------------------------------------------------------------
  const skillDeficits = skills.filter((s) => skillSummaries[s].correctCount <= 2)
  const hasWeakSkill = skillDeficits.length > 0
  const hasTooManyBlindSpots = totalBlindSpots >= 3

  if (hasWeakSkill || hasTooManyBlindSpots) {
    let explanation = ''
    if (hasWeakSkill && hasTooManyBlindSpots) {
      explanation =
        'In mindestens einem Teilbereich wurden 2 oder weniger Fragen richtig beantwortet, und es liegen 3 oder mehr blinde Flecken vor. Ein gezieltes Vertiefen vor der Prüfungsanmeldung wird dringend empfohlen.'
    } else if (hasWeakSkill) {
      const weakSkillNames = skillDeficits
        .map((s) => (s === 'vocabulary' ? 'Wortschatz' : s === 'grammar' ? 'Grammatik' : 'Leseverstehen'))
        .join(', ')
      explanation = `Im Bereich ${weakSkillNames} wurden 2 oder weniger von 4 Fragen richtig beantwortet. Nach dem Safeguard-Prinzip sollte dieser Bereich vor einer Prüfungsbuchung stabilisiert werden.`
    } else {
      explanation =
        `Es wurden ${totalBlindSpots} blinde Flecken festgestellt (falsche Antworten bei hoher Sicherheit). Diese systematischen Fehlannahmen sollten vor der Prüfung geklärt werden.`
    }

    return {
      category: 'practise_before_booking',
      headline: 'Vor der Buchung noch üben',
      explanation,
      provisionalNotice: PROVISIONAL_DISCLAIMER,
    }
  }

  // -------------------------------------------------------------
  // RULE 2: Mastery Check (Ready to consider booking)
  // -------------------------------------------------------------
  const allSkillsSecure = skills.every((s) => skillSummaries[s].secureCount >= 3)
  const blindSpotsAcceptable = totalBlindSpots <= 1

  if (allSkillsSecure && blindSpotsAcceptable) {
    return {
      category: 'ready_to_consider_booking',
      headline: 'Prüfungsbuchung in Betracht ziehen',
      explanation:
        'Hervorragendes Ergebnis: In allen drei Teilbereichen (Wortschatz, Grammatik, Lesen) wurden mindestens 3 von 4 Fragen sicher und richtig beantwortet bei maximal einem blinden Fleck. Ihre Grundlagen sind stabil.',
      provisionalNotice: PROVISIONAL_DISCLAIMER,
    }
  }

  // -------------------------------------------------------------
  // RULE 3: Fallthrough Default (Almost there)
  // -------------------------------------------------------------
  return {
    category: 'almost_there',
    headline: 'Fast am Ziel',
    explanation:
      'Gute Ausgangsbasis: Es liegen keine gravierenden Schwächen vor, jedoch beruhen einige Antworten auf unsicherem Wissen (geraten) oder es gibt einzelne Wissenslücken, die vor der Prüfung noch gefestigt werden sollten.',
    provisionalNotice: PROVISIONAL_DISCLAIMER,
  }
}

