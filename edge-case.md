# Edge Cases, Boundary Conditions & Failure Modes — Bereit?

This document catalogs the comprehensive edge cases, boundary conditions, user interaction traps, and failure modes across all layers of the **Bereit?** A1 German Exam Readiness Check application.

It is derived directly from the system architecture and specifications in [context.md](file:///c:/Nextleap%20Projects%20Git/Assg/context.md), [problem_statement.md](file:///c:/Nextleap%20Projects%20Git/Assg/problem_statement.md), [architecture.md](file:///c:/Nextleap%20Projects%20Git/Assg/architecture.md), and [implementation_plan.md](file:///c:/Nextleap%20Projects%20Git/Assg/implementation_plan.md).

---

## 1. Edge Case Classification Matrix

| Edge Case Category | Scope | Severity | Primary Mitigation Layer |
|---|---|:---:|---|
| **1. User Interaction & Navigation** | Button spam, incomplete selections, backtracking, page refreshes | **HIGH** | `useAssessmentSession` Hook & Presentation UI |
| **2. Diagnostic & Readiness Logic** | Borderline scores, safeguard triggers, blind-spot limits, guesser anomalies | **CRITICAL** | `src/logic/readiness.ts` & `src/logic/scoring.ts` |
| **3. Recommendation Prioritization** | Zero deficits, multi-topic weight ties, duplicate topics, sparse gaps | **MEDIUM** | `src/logic/recommendations.ts` |
| **4. UI, Accessibility & Display** | Stimulus overflow, German umlauts, 200% zoom, color-blindness | **MEDIUM** | Tailwind Design System & CSS Layout |
| **5. Session Integrity & Privacy** | Shared devices, memory leaks, offline resilience, tamper resistance | **HIGH** | Client-side runtime architecture |

---

## 2. User Interaction & Assessment Navigation Edge Cases

### 2.1 Incomplete Selection State Traps
* **EC-101: Attempting to advance after choosing an answer without selecting confidence.**
  - *Risk:* A learner chooses option C and immediately clicks "Continue", bypassing the confidence prompt.
  - *Mitigation:* The "Continue" button remains strictly disabled (`disabled={!isQuestionComplete}`) until both `selectedOptionId` AND `confidence` have explicit values in state.
* **EC-102: Attempting to select confidence before choosing an answer.**
  - *Risk:* User attempts to click "Sure" before indicating which answer they are sure about.
  - *Mitigation:* The confidence selector container is visually hidden or disabled with a subtle prompt (`"Select an answer above first"`) until an answer option is clicked.
* **EC-103: Rapid double-clicking / button spamming on "Continue".**
  - *Risk:* User double-clicks "Continue", inadvertently skipping question $Q_{i+1}$ and landing on $Q_{i+2}$.
  - *Mitigation:* The click handler enforces an atomic index increment with debouncing and verifies that the active question has been validated before incrementing.

### 2.2 Backtrack Navigation & Answer Alteration
* **EC-104: Navigating Back ($Q_5 \rightarrow Q_2$) and changing an answer.**
  - *Risk:* Changing an answer on an earlier question wipes out the previously recorded confidence or clears answers for $Q_3, Q_4, Q_5$.
  - *Mitigation:* The state store uses a persistent keyed dictionary (`Record<string, UserResponse>`). Navigating backwards restores the exact `selectedOptionId` and `confidence` previously selected. Modifying $Q_2$ only mutates the entry for $Q_2$; all other responses remain intact.
* **EC-105: Modifying answer but forgetting to update confidence.**
  - *Risk:* Learner previously chose option A with "Sure". On return, they switch to option B (a guess), but the old "Sure" confidence is retained.
  - *Mitigation:* When a user changes their answer selection on a question, the confidence selection is deliberately cleared (`confidence = null`), prompting them to re-evaluate their certainty for the new option.

### 2.3 Accidental Interruption & Refresh Handling
* **EC-106: Accidental browser reload or navigation away mid-assessment.**
  - *Risk:* Learner is on question 10 of 12 and accidentally swipes back or hits `F5`, losing all progress.
  - *Mitigation:* Register a `beforeunload` window event listener when `currentScreen === 'assessment'`. The browser prompts: *"You have an assessment in progress. Are you sure you want to leave?"*
* **EC-107: Mid-test reset via header "Restart" button.**
  - *Risk:* User accidentally taps "Restart", losing all entered data without confirmation.
  - *Mitigation:* Triggers an accessible confirmation modal (`ConfirmModal.tsx`): *"Restart assessment? Your current responses will be cleared."* with `[ Cancel ]` and `[ Yes, Restart ]` actions.

### 2.4 Inactivity & Device Sleep
* **EC-108: Mobile device sleeps or browser backgrounds tab for 30 minutes.**
  - *Risk:* Timer-based logic times out or React state unloads.
  - *Mitigation:* Bereit? operates without a countdown timer. State is held in resilient component memory, allowing learners to resume exactly where they left off upon waking their device.

---

## 3. Diagnostic Engine & Scoring Boundary Edge Cases

```
                               READINESS DECISION BOUNDARY MATRIX
┌─────────────────────────────────┬─────────────────────────────────┬──────────────────────────────────┐
│ Case Scenario                   │ Computed Metrics                │ Evaluated Category & Rationale   │
├─────────────────────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ 1. Weakest-Skill Failure        │ Vocab 4/4, Reading 4/4,         │ PRACTISE BEFORE BOOKING          │
│    (Compensatory Illusion)      │ Grammar 2/4 (Acc: 10/12, 83.3%) │ Grammar deficit triggers Rule 1A │
├─────────────────────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ 2. High Accuracy Blind Spots    │ Total Correct: 9/12             │ PRACTISE BEFORE BOOKING          │
│    (Overconfidence Danger)      │ Blind Spots: 3 (Wrong + Sure)   │ >= 3 blind spots triggers Rule 1B│
├─────────────────────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ 3. The Lucky Guesser            │ Total Correct: 12/12            │ ALMOST THERE                     │
│    (High Score, Low Certainty)  │ 6 Guessed, 0 Blind Spots        │ Fails Rule 2 (all skills >= 3/4  │
│                                 │                                 │ secure); fragile recall.         │
├─────────────────────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ 4. Single Blind Spot Mastery    │ Vocab 4/4 Sure, Grammar 4/4 Sure│ READY TO CONSIDER BOOKING        │
│    (Allowable Boundary)         │ Reading 3/4 Sure, 1 Blind Spot  │ Meets Rule 2 (all skills >= 3/4  │
│                                 │ Total Blind Spots = 1           │ secure AND blind spots <= 1)     │
├─────────────────────────────────┼─────────────────────────────────┼──────────────────────────────────┤
│ 5. Borderline Balanced Profile  │ All skills 3/4 Correct          │ ALMOST THERE                     │
│    (1 Guessed per Skill)        │ Secure: 2/4 per skill           │ Fails Rule 2 (needs >= 3 secure) │
│                                 │ Blind Spots: 0                  │ Safe from Rule 1; needs practice │
└─────────────────────────────────┴─────────────────────────────────┴──────────────────────────────────┘
```

### 3.1 The "Weakest-Skill Safeguard" Boundary Conditions
* **EC-201: Asymmetrical High Accuracy (10/12 correct, but one skill is $\le 2/4$).**
  - *Scenario:* Learner scores 4/4 in Vocabulary and 4/4 in Reading, but only 2/4 in Grammar. Overall percentage is $83.3\%$.
  - *Trap:* Naive platforms declare the user "Exam Ready" based on $>80\%$. However, failing grammar in Goethe A1 will cause section failure.
  - *Mitigation:* Rule 1 immediately flags any skill with $\le 2$ correct. Category: **"Practise before booking"**.

### 3.2 The Blind Spot Threshold Conditions
* **EC-202: High overall accuracy with exactly 3 Potential Blind Spots.**
  - *Scenario:* Learner gets 9/12 correct, but all 3 wrong answers were marked "Sure".
  - *Trap:* The learner is harboring persistent misconceptions they do not realize exist.
  - *Mitigation:* Rule 1 condition B triggers on `totalBlindSpots >= 3`. Category: **"Practise before booking"**.
* **EC-203: Exactly 1 Potential Blind Spot with high secure mastery.**
  - *Scenario:* Learner achieves 11/12 correct with all 11 marked "Sure", and 1 wrong answer marked "Sure" (1 Blind Spot).
  - *Verification:* Meets Condition C (all skills $\ge 3$ secure) AND Condition D ($\le 1$ blind spot). Category: **"Ready to consider booking"**.
* **EC-204: Exactly 2 Potential Blind Spots with high accuracy.**
  - *Scenario:* Learner gets 10/12 correct with all 10 marked "Sure", and 2 wrong answers marked "Sure".
  - *Verification:* Fails Condition D (blind spots $\le 1$), but does not hit Rule 1B ($\ge 3$). Category: **"Almost there"**.

### 3.3 The Guessing Anomalies
* **EC-205: Perfect score achieved entirely through guessing (12/12 Correct + Guessed).**
  - *Scenario:* Learner gets every question right but selected "I guessed" for all 12.
  - *Trap:* Marking them "Ready to consider booking" would be irresponsible, as guessing will not hold under exam conditions.
  - *Mitigation:* Secure count in every skill is $0/4$ (fails Condition C $\ge 3$). Category: **"Almost there"**. Rationale explicitly notes that while answers were correct, self-reported confidence indicates fragile knowledge.
* **EC-206: Total failure with zero confidence (0/12 Correct + Guessed).**
  - *Scenario:* Learner gets 0/12 correct and marks "I guessed" for all 12.
  - *Verification:* Every skill has $0/4$ correct (triggers Rule 1A). Category: **"Practise before booking"**. 12 Known Gaps generated with weight 2.

---

## 4. Practice Recommendation Prioritization Edge Cases

### 4.1 The Perfect Performance (Zero Deficit) Edge Case
* **EC-301: Learner scores 12/12 Correct and marks "Sure" on all 12 questions.**
  - *Issue:* Every question evaluates to `secure_knowledge` with weight 0. Aggregated topic weight list is empty or all zero.
  - *Trap:* Application renders blank recommendation cards, broken UI layout, or fabricates fake areas for improvement.
  - *Mitigation:* Zero-weight fallback condition in `generateRecommendations`:
    ```typescript
    if (rankedTopics.length === 0 || maxWeight === 0) {
      return [{
        topicTag: 'maintenance',
        topicDisplayName: 'Wissenssicherung (Maintenance)',
        priorityWeight: 0,
        actionTitle: 'Wortschatz und Grammatik festigen',
        actionText: 'Hervorragend! Alle Bereiche zeigen sicheres Wissen. Wiederholen Sie den A1-Wortschatz regelmäßig, um Ihre Sicherheit bis zur Prüfung zu erhalten.',
        triggerReason: 'All 12 questions answered correctly with high confidence.'
      }];
    }
    ```

### 4.2 Multi-Topic Weight Collisions & Tie-Breaking
* **EC-302: Multiple topics share identical aggregated priority weights.**
  - *Scenario:* 
    - Topic A (`accusative_articles`) has 1 Blind Spot (weight 3).
    - Topic B (`verb_second_order`) has 1 Blind Spot (weight 3).
    - Topic C (`family_vocabulary`) has 1 Blind Spot (weight 3).
    - Topic D (`public_notices`) has 1 Blind Spot (weight 3).
  - *Trap:* Non-deterministic sorting causes recommendations to reshuffle randomly on re-render.
  - *Mitigation:* Enforce a secondary deterministic tie-break key: **Order of appearance in the official 12-question bank**. If Topic A appeared on $Q_1$ and Topic D on $Q_{10}$, Topic A is strictly prioritized.

### 4.3 Sparse Deficit Edge Case
* **EC-303: Learner makes a mistake on only 1 single topic.**
  - *Scenario:* 11 questions are Correct+Sure; 1 question is Wrong+Guessed (weight 2).
  - *Trap:* The UI layout expects 3 recommendations and displays `undefined` or broken cards.
  - *Mitigation:* Slicing supports $1 \le N \le 3$. The UI dynamically renders the exact number of active deficit recommendations (1 card) without forcing empty placeholders.

### 4.4 Cumulative Weight from Multiple Questions on Same Topic
* **EC-304: Two questions share the same topic tag with different diagnostic states.**
  - *Scenario:* Question 1 on `accusative_articles` is Wrong+Sure (wt 3); Question 2 on `accusative_articles` is Wrong+Guessed (wt 2).
  - *Verification:* The recommendation aggregator must sum the weights ($3 + 2 = 5$) and output **one unified recommendation** for `accusative_articles` at the top of the list, rather than two separate duplicate cards.

---

## 5. UI, Accessibility & Display Edge Cases

### 5.1 German Language & Typographic Rendering
* **EC-401: German Special Characters (Umlauts & Eszett: `ä, ö, ü, Ä, Ö, Ü, ß`).**
  - *Risk:* Encoding mismatches cause garbled glyphs (e.g., `MÃ¤dchen` instead of `Mädchen`).
  - *Mitigation:* `index.html` enforces `<meta charset="UTF-8">`. All strings in `questionBank.ts` are stored in native UTF-8.
* **EC-402: Long Compound Words in German (**e.g., *Familienangehörige, Fahrkartenautomat*).**
  - *Risk:* Long words overflow small mobile screens or option button boundaries.
  - *Mitigation:* CSS utility `hyphens-auto` and `break-words` applied to option labels and question prompts.

### 5.2 Context Stimulus Formatting & Screen Overflow
* **EC-403: Reading stimulus context (Timetable / Notice) on 320px mobile viewport.**
  - *Risk:* Timetable table extends beyond screen width, pushing action buttons offscreen.
  - *Mitigation:* Reading stimulus cards feature horizontal scroll wrappers (`overflow-x-auto`) with subtle scroll indicators, ensuring that options and buttons below remain fully visible and clickable.
* **EC-404: 200% Browser Zoom & Text Scaling.**
  - *Risk:* Fixed container heights cause text to clip or overlap.
  - *Mitigation:* Flexible layout containers using relative units (`rem`, `min-h`, `flex-col`) with zero fixed-pixel height constraints.

### 5.3 Color-Blindness & Visual Accessibility
* **EC-405: Deuteranopia / Protanopia (Red-Green Color Blindness).**
  - *Risk:* Learner cannot distinguish between Green (Secure) and Red (Blind Spot).
  - *Mitigation:* **Multi-modal encoding:**
    - Secure Knowledge: Green background + **Checkmark SVG Icon** + text *"Sicheres Wissen"*.
    - Potential Blind Spot: Red background + **Alert Triangle SVG Icon** + text *"Möglicher blinder Fleck"*.
    - Uncertain Knowledge: Amber background + **Help Circle SVG Icon** + text *"Unsicheres Wissen"*.
    - Known Gap: Slate background + **Minus Circle SVG Icon** + text *"Bekannte Lücke"*.

---

## 6. Security, Privacy & Session Integrity Edge Cases

### 6.1 Shared & Public Device Integrity
* **EC-501: User takes assessment on a public library or Goethe-Institut terminal.**
  - *Risk:* Subsequent user sits down and sees previous learner's answers, errors, and readiness status.
  - *Mitigation:* Bereit? stores assessment data exclusively in **ephemeral React memory**. No `localStorage` or `indexedDB` caching of attempt data is retained. Once the tab is closed or "Restart" is clicked, all session traces are permanently wiped.

### 6.2 Offline Network Resilience
* **EC-502: Learner loses internet connection while answering Question 7.**
  - *Risk:* App crashes, throws fetch errors, or halts progression.
  - *Mitigation:* Bereit? is a 100% self-contained client-side application. The question bank and computation logic are bundled in the initial JavaScript chunk. The entire assessment runs to completion without sending a single network packet.

### 6.3 State Injection & Tamper Resistance
* **EC-503: User attempts to manipulate question index or answers via DevTools console.**
  - *Risk:* Corrupting state arrays leading to `TypeError: Cannot read properties of undefined`.
  - *Mitigation:* The question bank array is frozen with `Object.freeze()`. The session hook bounds-checks `currentQuestionIndex` ($0 \le i < \text{totalQuestions}$) before rendering.

---

## 7. Edge Case Automated Verification Matrix

The following test suite in `tests/edge_cases.test.ts` formally verifies these behaviors:

| Test ID | Edge Case Tested | Target Function / Component | Expected Outcome | Status |
|---|---|---|---|:---:|
| **TC-EC-01** | Weakest-skill failure with 10/12 total correct | `evaluateReadiness` | Returns `practise_before_booking` | ✅ Pass |
| **TC-EC-02** | 3 Potential Blind Spots with 9/12 correct | `evaluateReadiness` | Returns `practise_before_booking` | ✅ Pass |
| **TC-EC-03** | 12/12 correct with all 12 "Guessed" | `evaluateReadiness` | Returns `almost_there` | ✅ Pass |
| **TC-EC-04** | 11/12 correct with exactly 1 Blind Spot | `evaluateReadiness` | Returns `ready_to_consider_booking` | ✅ Pass |
| **TC-EC-05** | 10/12 correct with exactly 2 Blind Spots | `evaluateReadiness` | Returns `almost_there` | ✅ Pass |
| **TC-EC-06** | 12/12 correct and all "Sure" (Weight 0) | `generateRecommendations` | Returns maintenance advice | ✅ Pass |
| **TC-EC-07** | Weight tie between multiple topics | `generateRecommendations` | Ranks by question appearance | ✅ Pass |
| **TC-EC-08** | Incomplete selection (Option set, Conf null) | `canProceedToNext` | Evaluates to `false` | ✅ Pass |
| **TC-EC-09** | Option change clears previous confidence | `useAssessmentSession` | Resets `confidence` to `null` | ✅ Pass |
| **TC-EC-10** | Backtrack navigation retains responses | `useAssessmentSession` | Previous selections restored | ✅ Pass |

---

*Derived from [context.md](file:///c:/Nextleap%20Projects%20Git/Assg/context.md), [problem_statement.md](file:///c:/Nextleap%20Projects%20Git/Assg/problem_statement.md), [architecture.md](file:///c:/Nextleap%20Projects%20Git/Assg/architecture.md), and [implementation_plan.md](file:///c:/Nextleap%20Projects%20Git/Assg/implementation_plan.md)*

