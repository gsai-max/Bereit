import type {
  EvaluatedQuestionResponse,
  PracticeRecommendation,
  Question,
} from '../types/diagnostic'

export const MAINTENANCE_RECOMMENDATION: PracticeRecommendation = {
  topicTag: 'maintenance',
  topicDisplayName: 'Wissenssicherung (Maintenance)',
  priorityWeight: 0,
  actionTitle: 'Wortschatz und Grammatik festigen',
  actionText:
    'Hervorragend! Alle Bereiche zeigen sicheres Wissen. Wiederholen Sie den A1-Wortschatz regelmäßig, um Ihre Sicherheit bis zur Prüfung zu erhalten.',
  triggerReason: 'Alle 12 Fragen wurden richtig und mit hoher Sicherheit beantwortet.',
}

/**
 * Weighted Practice Recommendation Engine
 *
 * Algorithm:
 * 1. Group evaluated questions by topicTag.
 * 2. Calculate cumulative weight per topic:
 *    - Potential Blind Spot: 3
 *    - Known Gap: 2
 *    - Uncertain Knowledge: 1
 *    - Secure Knowledge: 0
 * 3. Filter out topics with cumulative weight === 0.
 * 4. Sort topics descending by total weight.
 * 5. Deterministic Tie-Break: Rank by first appearance index in the question bank.
 * 6. Slice top 3 recommendations.
 * 7. If all topics have weight 0, return the positive maintenance recommendation.
 */
export function generateRecommendations(
  evaluatedResponses: EvaluatedQuestionResponse[],
  orderedQuestions?: readonly Question[]
): PracticeRecommendation[] {
  // Map of topicTag -> { totalWeight, firstIndex, responses: EvaluatedQuestionResponse[] }
  const topicMap = new Map<
    string,
    {
      topicTag: string
      topicDisplayName: string
      totalWeight: number
      firstIndex: number
      items: EvaluatedQuestionResponse[]
    }
  >()

  // Determine appearance order from orderedQuestions or evaluatedResponses
  const questionOrder = orderedQuestions || evaluatedResponses.map((r) => r.question)
  const firstAppearanceIndex = new Map<string, number>()
  questionOrder.forEach((q, idx) => {
    if (!firstAppearanceIndex.has(q.topicTag)) {
      firstAppearanceIndex.set(q.topicTag, idx)
    }
  })

  // Aggregate weights
  for (const evaluated of evaluatedResponses) {
    const { topicTag, topicDisplayName } = evaluated.question
    const existing = topicMap.get(topicTag)
    const orderIndex = firstAppearanceIndex.get(topicTag) ?? 999

    if (!existing) {
      topicMap.set(topicTag, {
        topicTag,
        topicDisplayName,
        totalWeight: evaluated.priorityWeight,
        firstIndex: orderIndex,
        items: [evaluated],
      })
    } else {
      existing.totalWeight += evaluated.priorityWeight
      existing.items.push(evaluated)
    }
  }

  // Filter out topics with 0 weight (only secure knowledge)
  const deficitTopics = Array.from(topicMap.values()).filter((t) => t.totalWeight > 0)

  // Zero-deficit edge case (EC-301)
  if (deficitTopics.length === 0) {
    return [MAINTENANCE_RECOMMENDATION]
  }

  // Deterministic sort: Weight DESC, then firstIndex ASC (order of appearance)
  deficitTopics.sort((a, b) => {
    if (b.totalWeight !== a.totalWeight) {
      return b.totalWeight - a.totalWeight
    }
    return a.firstIndex - b.firstIndex
  })

  // Slice top 3
  const topTopics = deficitTopics.slice(0, 3)

  return topTopics.map((topic) => {
    // Pick the most critical response in this topic for remediation text
    const highestPriorityItem = topic.items.reduce((prev, curr) =>
      curr.priorityWeight > prev.priorityWeight ? curr : prev
    )

    let triggerReason = ''
    if (topic.items.some((i) => i.diagnosticState === 'potential_blind_spot')) {
      triggerReason = 'Möglicher blinder Fleck: Falsche Antwort bei hoher Sicherheit.'
    } else if (topic.items.some((i) => i.diagnosticState === 'known_gap')) {
      triggerReason = 'Bekannte Lücke: Falsche Antwort bei erkannter Unsicherheit.'
    } else {
      triggerReason = 'Unsicheres Wissen: Richtige Antwort, aber geraten.'
    }

    return {
      topicTag: topic.topicTag,
      topicDisplayName: topic.topicDisplayName,
      priorityWeight: topic.totalWeight,
      actionTitle: highestPriorityItem.question.remediationTitle,
      actionText: highestPriorityItem.question.remediationAction,
      triggerReason,
    }
  })
}

