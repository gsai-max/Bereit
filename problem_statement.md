# Bereit? --- Problem Statement & MVP Build Brief

**Product tagline:** Know before you book.\
**Product:** A1 German exam readiness check\
**Exam context:** Goethe-Zertifikat A1 and ÖSD Zertifikat A1\
**Build environment:** Antigravity (vibe coding)\
**Document purpose:** Source of truth for the first MVP build

------------------------------------------------------------------------

## 1. The problem

People preparing for a beginner-level German exam often practise
vocabulary, grammar and reading through apps, worksheets and sample
questions. However, practice activity alone does not tell them whether
they are ready to book an A1 exam.

A learner may know some topics confidently, answer other questions by
guessing, or hold a misconception they do not realise is incorrect. A
single percentage score can hide these differences. It can also leave
the learner unsure about what to practise next.

**The problem is not simply a lack of German practice. It is the lack of
a quick, understandable way for an A1 learner to assess their current
preparation, recognise uncertain knowledge and identify the most useful
next areas to practise before booking an exam.**

Bereit? addresses this with a short diagnostic assessment and clear next
steps. It is a preparation aid, not an official exam, certification or
pass predictor.

## 2. Target user

**Primary user:** A beginner German learner preparing for Goethe A1 or
ÖSD A1 who is considering when to book the exam.

Typical needs: - Understand whether their current preparation is broadly
on track. - Identify which of vocabulary, grammar and reading needs more
attention. - Distinguish what they know confidently from what they may
have guessed. - Leave the assessment with a small number of specific
practice priorities.

The MVP should work for a learner using a laptop or mobile browser. It
should not assume prior knowledge of exam scoring rules.

## 3. Product promise

After completing a short assessment, a learner should be able to answer
three questions:

1.  **Where am I right now?** See an overall, provisional readiness
    indication.
2.  **What do I know, and what am I unsure about?** See a breakdown
    across vocabulary, grammar and reading, informed by both answers and
    self-reported confidence.
3.  **What should I do next?** Receive up to three prioritised practice
    recommendations linked to the questions they struggled with.

The product should be honest and useful, not reassuring at the expense
of accuracy.

## 4. MVP goals and non-goals

### Goals

-   Deliver a complete, low-friction A1 diagnostic in approximately 5--8
    minutes.
-   Assess three foundational areas: vocabulary, grammar and reading.
-   Capture confidence after every answer.
-   Explain the difference between a confident correct answer, a guessed
    correct answer, an uncertain mistake and a confident mistake.
-   Present an understandable skill breakdown and prioritised practice
    actions.
-   Make limitations and provisional scoring explicit.

### Non-goals for this MVP

-   Reproducing the full Goethe or ÖSD exam.
-   Testing listening, speaking or writing.
-   Claiming to predict an official exam result or guarantee a pass.
-   Providing a CEFR placement certification.
-   User accounts, saved history, payments or booking integrations.
-   Generative AI, chatbots or adaptive question generation.
-   A large lesson library or full language-learning course.

Do not add features outside the defined scope unless they are essential
to make the core assessment usable.

## 5. Assessment design

### Assessment structure

The assessment contains **12 original multiple-choice questions**:

  ------------------------------------------------------------------------
  Skill                                    Questions Coverage
  --------------------- ---------------------------- ---------------------
  Vocabulary                                       4 Everyday places and
                                                     services, food and
                                                     shopping, family
                                                     relationships,
                                                     weather and clothing

  Grammar                                          4 Articles and
                                                     accusative, verb
                                                     conjugation,
                                                     verb-second word
                                                     order, negation with
                                                     kein/nicht

  Reading                                          4 Personal messages,
                                                     public notices,
                                                     timetables,
                                                     advertisements

  **Total**                                   **12** **4 questions per
                                                     skill**
  ------------------------------------------------------------------------

Question mix: - 6 foundational questions. - 6 application questions. -
Four answer options per question. - Each question has one intended
correct answer. - Reading questions include a short text, notice,
timetable or advertisement as context.

Use the approved 12-question bank supplied with the project as the
source of truth. Do not rewrite, replace, simplify or silently alter
question wording, answer options, correct answers, explanations or skill
tags without explicit approval. Keep the German text and its punctuation
intact.

These are original diagnostic questions inspired by everyday A1 task
styles. They are not copied official exam questions and should not be
presented as a replica of an official paper.

### Confidence capture

After a learner selects an answer, ask:

**"How sure are you about this answer?"**

Provide two clear choices: - **Sure** - **I guessed**

The learner must select one confidence option before continuing. Do not
infer confidence from answer time, behaviour or correctness.

Confidence is self-reported. Treat it as a useful diagnostic signal, not
as objective proof of mastery.

### Per-question diagnostic states

Each response is classified using correctness and self-reported
confidence:

  -----------------------------------------------------------------------
  Answer            Confidence        Diagnostic state  Meaning
  ----------------- ----------------- ----------------- -----------------
  Correct           Sure              Secure knowledge  The learner
                                                        answered
                                                        correctly and
                                                        felt confident.

  Correct           I guessed         Uncertain         The answer was
                                      knowledge         correct, but the
                                                        learner was not
                                                        confident.

  Wrong             I guessed         Known gap         The learner
                                                        recognised
                                                        uncertainty and
                                                        answered
                                                        incorrectly.

  Wrong             Sure              Potential blind   The learner was
                                      spot              confident but
                                                        answered
                                                        incorrectly; a
                                                        misconception may
                                                        be present.
  -----------------------------------------------------------------------

Use these labels consistently in the results and answer review. Avoid
language that shames the learner.

## 6. Core user journey

1.  **Landing page**
    -   Introduce Bereit? and its purpose.
    -   State that it is a short A1 readiness check for learners
        preparing for Goethe or ÖSD.
    -   Show the assessment length: 12 questions, approximately 5--8
        minutes.
    -   Clearly state the tested areas: vocabulary, grammar and reading.
    -   State that listening, speaking and writing are not tested.
    -   Explain that the result is an indication, not an official score
        or pass guarantee.
    -   Provide a clear "Start assessment" action.
2.  **Assessment**
    -   Show one question at a time.
    -   Show progress (for example, Question 4 of 12).
    -   Display the question context where applicable.
    -   Let the learner select one answer.
    -   Ask for confidence after the answer is selected.
    -   Require both an answer and confidence selection before enabling
        Continue.
    -   Allow the learner to move back to a previous question and change
        their answer or confidence.
    -   Preserve answers when navigating backwards and forwards.
    -   Do not reveal correctness or the answer explanation during the
        assessment.
    -   Avoid a countdown timer.
3.  **Results**
    -   Show an overall provisional readiness category.
    -   Show a separate result for vocabulary, grammar and reading.
    -   Explain the four diagnostic states.
    -   Show the learner's prioritised practice recommendations (up to
        three).
    -   Include a way to review incorrect answers, showing the learner's
        answer, correct answer and explanation.
    -   State the assessment limitations and provisional nature of the
        thresholds.
    -   Offer a clear restart action.
4.  **Restart**
    -   Restarting begins a fresh attempt and clears the previous
        attempt's answers and confidence selections.
    -   Ask for confirmation before clearing an in-progress attempt if
        practical.

## 7. Scoring and readiness logic

All scoring must be deterministic and explainable. Do not use an LLM or
opaque model to calculate results.

### Per-skill measures

Each skill has four questions. Calculate:

-   **Accuracy:** number of correct answers / 4.
-   **Secure knowledge:** number of correct-and-sure answers / 4.
-   **Uncertain knowledge:** number of correct-but-guessed answers / 4.
-   **Known gaps:** count of wrong-and-guessed answers.
-   **Potential blind spots:** count of wrong-and-sure answers.

Display both counts and percentages where useful. For small
denominators, make the denominator visible (for example, "3 of 4"),
rather than showing a percentage alone.

### Overall readiness categories

Use the following **provisional product thresholds**:

**Ready to consider booking** - Every skill has at least 3 of 4 answers
that are correct and marked "Sure"; and - There is no more than 1
potential blind spot across all 12 questions.

**Practise before booking** - Any skill has 2 or fewer correct answers;
or - There are 3 or more potential blind spots across all 12 questions.

**Almost there** - Any result that does not meet either of the two
conditions above.

Apply the rules in the order shown: first check "Practise before
booking"; then check "Ready to consider booking"; otherwise show "Almost
there". This prevents overlapping conditions from producing inconsistent
results.

The weakest-skill safeguard is a deliberate product decision for this
diagnostic. It is **not** a claim about official Goethe or ÖSD pass
rules. These thresholds have not yet been validated against real learner
outcomes. Make this clear near the overall result.

Do not label a learner "passed", "failed", "exam-ready" as a certainty,
or "guaranteed to pass".

### Practice recommendation prioritisation

Each question is associated with a topic tag and a relevant practice
action. Prioritise topic recommendations using these weights:

  Diagnostic state                            Priority weight
  ----------------------------------------- -----------------
  Potential blind spot (wrong + sure)                       3
  Known gap (wrong + guessed)                               2
  Uncertain knowledge (correct + guessed)                   1
  Secure knowledge (correct + sure)                         0

Aggregate weights by topic tag. Rank topics from highest to lowest total
weight and show up to three recommendations. Use the corresponding
approved action title and action text from the question bank.

If multiple topics have the same weight, use a stable, deterministic
tie-break (for example, the order in which the topics first appear in
the assessment). Do not generate arbitrary recommendations. If all
weights are zero, show a positive maintenance message and suggest
revising A1 material periodically instead of inventing weak areas.

Explain that recommendations are prioritised from this short assessment
and are not a complete study plan.

## 8. Results page requirements

The results page is the most important part of the product. It should
help the learner understand the result, not just display a score.

It must include:

### A. Overall readiness

-   One of the three approved categories.
-   A short, plain-language explanation of why the category was
    assigned.
-   A visible note that the thresholds are provisional and not official
    Goethe/ÖSD scoring.

### B. Skill breakdown

For each of Vocabulary, Grammar and Reading, show: - Correct answers out
of four. - Secure knowledge count. - Uncertain knowledge count. - Known
gaps count. - Potential blind spots count.

Use clear labels and a compact visual representation. Do not rely on
colour alone; pair colours with text or symbols.

### C. Diagnostic explanation

Explain the four states in learner-friendly language: - Secure: correct
and sure. - Uncertain: correct, but guessed. - Known gap: incorrect and
unsure. - Potential blind spot: incorrect despite feeling sure.

### D. Practice priorities

-   Show up to three prioritised actions.
-   Link each action to the relevant topic and explain briefly why it
    appeared.
-   Keep the recommendations specific and actionable.

### E. Answer review

For every incorrect answer, show: - Question or topic identifier. -
Learner's selected answer. - Correct answer. - Short explanation of the
correct answer. - If available, a concise explanation of why the
selected option was incorrect.

Do not expose internal scoring weights as if they were a scientific
measure of ability.

### F. Limitations

Include a clear statement similar to:

"This is a short practice diagnostic, not an official Goethe or ÖSD
exam. It assesses vocabulary, grammar and reading only. It does not
assess listening, speaking or writing. Your result is an indication of
areas to work on, not a guarantee of passing. The readiness thresholds
are provisional and need validation with real learners."

## 9. UX and visual direction

The experience should feel calm, clear and encouraging. It should not
look like a school examination portal or a generic AI dashboard.

### Design principles

-   Make the next action obvious on every screen.
-   Use plain language and short explanations.
-   Keep one question as the focus at a time.
-   Make progress visible without creating pressure.
-   Use readable German text and comfortable spacing.
-   Make the results easy to scan.
-   Be mobile responsive and keyboard accessible.
-   Use colour consistently for diagnostic states, but never use colour
    as the only indicator.
-   Use helpful empty, error and restart states.
-   Avoid unnecessary animations, gamification, leaderboards, badges and
    distracting illustrations.

### Existing visual reference

The earlier Bereit? prototype uses: - Paper-like light background. -
Dark ink typography. - Blue as the primary action/accent colour. - White
cards with subtle borders. - Bricolage Grotesque for headings and body
typography, with a system sans-serif fallback.

Retain this direction where practical, but prioritise usability,
accessibility and consistency over copying implementation details.

## 10. Functional and technical requirements

-   Build a working public web app, not a static mock-up.
-   The core assessment must work end-to-end in a browser.
-   Use a maintainable component structure and keep question content
    separate from UI logic where practical.
-   Keep scoring and readiness rules in clear, testable functions.
-   Ensure the results are calculated from the current attempt's
    responses only.
-   Prevent a learner from submitting an incomplete assessment.
-   Preserve answers and confidence when navigating between questions.
-   Ensure the app works on current desktop and mobile browsers.
-   Handle refresh or accidental navigation gracefully where practical;
    do not silently corrupt an attempt.
-   Do not require sign-up or personal information.
-   Do not collect or transmit personal data for this MVP.
-   Do not add analytics or third-party tracking unless explicitly
    approved.
-   Do not expose API keys or secrets in client-side code.
-   Provide a concise README with local run instructions, deployment
    instructions and known limitations.
-   Include basic tests for diagnostic classification, readiness
    thresholds, recommendation ranking and incomplete submissions.

## 11. Acceptance criteria

The MVP is ready for review when all of the following are true:

### Assessment

-   [ ] Landing page clearly explains what the assessment does and does
    not measure.
-   [ ] Exactly 12 approved questions are present: 4 vocabulary, 4
    grammar and 4 reading.
-   [ ] Question text, options, answer keys, explanations and tags match
    the approved question bank.
-   [ ] Each question has four answer options.
-   [ ] Each question captures both an answer and confidence.
-   [ ] Continue is disabled until both are selected.
-   [ ] Back navigation preserves and allows editing previous responses.
-   [ ] Progress is accurate.
-   [ ] Correct answers are not revealed before the results page.

### Diagnosis and scoring

-   [ ] All four answer-confidence combinations map to the correct
    diagnostic state.
-   [ ] Per-skill measures are calculated correctly out of four.
-   [ ] Overall readiness follows the exact provisional rules in this
    document.
-   [ ] Practice recommendations follow the specified weights and
    deterministic tie-break.
-   [ ] No recommendations are fabricated when all topics have zero
    priority weight.

### Results

-   [ ] All three readiness labels are implemented exactly.
-   [ ] Vocabulary, grammar and reading appear separately.
-   [ ] Results explain the four diagnostic states.
-   [ ] Up to three relevant practice recommendations are shown.
-   [ ] Incorrect answers include the learner's answer, correct answer
    and explanation.
-   [ ] Provisional-threshold and skill-coverage disclaimers are
    visible.
-   [ ] Restart clears the attempt and begins a new one.

### Quality

-   [ ] Layout works on mobile and desktop.
-   [ ] Keyboard focus and visible focus states work.
-   [ ] Colour is not the only way information is communicated.
-   [ ] No console errors or broken interactions in the main journey.
-   [ ] Core scoring logic has tests.
-   [ ] README explains how to run and deploy the app.

## 12. Validation questions for V2

The MVP should help us learn, not pretend that the scoring model is
already proven. Before changing thresholds or expanding the product,
test with at least five real A1 learners.

Ask: 1. Before taking this assessment, how do you currently decide
whether you are ready to book Goethe A1 or ÖSD A1? 2. Did any question
feel confusing, unfamiliar or unlike the practice material you have
used? Which one, and why? 3. When you selected "Sure" or "I guessed",
did those choices accurately reflect how you felt while answering? 4.
Did the results identify a weakness you recognise? Was there anything
important the results missed? 5. After seeing the recommendations, do
you know what you would practise next? What would you actually do?

Observe where learners hesitate, misunderstand the confidence prompt,
misread the result or disagree with a recommendation. Do not validate
the product only by asking whether they liked it.

## 13. Product principles and guardrails

1.  **Honesty over reassurance:** Never overstate readiness or imply a
    pass guarantee.
2.  **Diagnosis over scoring:** A percentage alone is not the product.
3.  **Action over information:** Every result should help the learner
    decide what to do next.
4.  **Explainability:** A learner should be able to understand why a
    result or recommendation appeared.
5.  **Human understanding over AI gimmicks:** Do not add AI merely to
    make the product appear advanced.
6.  **Scope discipline:** Deliver the 12-question diagnostic journey
    well before adding more features.

------------------------------------------------------------------------

## Final instruction to the builder

Build the smallest polished, working version of Bereit? that fulfils
this brief. Treat the approved question bank and scoring rules as fixed
product requirements. Do not invent new questions, alter the readiness
thresholds, add unsupported exam claims, or expand the scope without
asking. Prioritise a reliable end-to-end learner journey, correct
diagnostic logic, clear results and a responsive interface over visual
effects or unnecessary technical complexity.
