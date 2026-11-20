# Bereit? (A1 German Exam Readiness Check)

> **Know before you book.** A rapid, honest diagnostic web application for learners preparing for the Goethe-Zertifikat A1 (*Start Deutsch 1*) and ÖSD Zertifikat A1 examinations.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-729B1B?logo=vitest)](https://vitest.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-059669)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 1. Project Overview & Value Proposition

Official German A1 certifications (*Goethe-Zertifikat A1 / Start Deutsch 1* and *ÖSD Zertifikat A1*) cost €120–€180+ per sitting. Thousands of test-takers book exam dates prematurely under the false impression that basic exposure equals exam preparedness.

**Bereit?** provides a calm, honest, 5–8 minute diagnostic check to answer one core question:
*Are you truly prepared to book your exam, or do you have fragile knowledge and blind spots that will cause you to fail?*

### Key Design Pillars
- **Honest 2×2 Diagnostic Matrix**: Distinguishes true mastery from accidental guesses by combining response correctness with self-reported confidence.
- **Non-Compensatory Safeguards**: Prevents high scores in one domain (e.g. Vocabulary) from concealing catastrophic failure in another (e.g. Grammar). A single failing skill triggers *"Practise before booking"*.
- **Calm, Paper-and-Ink Aesthetic**: Engineered with warm paper tones (`#FAF9F5`), charcoal ink (`#1F2937`), and subtle typography to minimize test anxiety. Zero countdown timers.
- **100% Privacy-First & Client-Side**: Zero databases, zero user registration, zero cookies or tracking beacons. All computations run in local browser memory.
- **Universal Accessibility (WCAG 2.1 AA)**: Multi-modal diagnostic indicators (colors paired with distinct icons and text), keyboard operability, and screen reader semantic labeling.

---

## 2. Diagnostic & Scoring Engine Architecture

The scoring system operates as a deterministic pipeline of four pure TypeScript functions in `src/logic/`:

```
┌────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐     ┌────────────────────────┐
│  12 User Responses │ ──> │ 1. Classify Responses │ ──> │ 2. Aggregate Metrics │ ──> │ 3. Evaluate Readiness │
│ (Option+Confidence)│     │ Correctness×Confidence│     │  Per-Skill Counts /4  │     │ Sequential Safeguards  │
└────────────────────┘     └───────────────────────┘     └───────────────────────┘     └────────────────────────┘
                                      │                                                             │
                                      ▼                                                             ▼
                           ┌───────────────────────┐                                   ┌────────────────────────┐
                           │ 4. Prioritize Actions │ ────────────────────────────────> │ Consolidated Dashboard │
                           │ Weighted Topics 3/2/1 │                                   │  FullAssessmentResult  │
                           └───────────────────────┘                                   └────────────────────────┘
```

### The 2×2 Diagnostic Matrix
Every question response is classified into one of four diagnostic states:

| Response State | Confidence | Correctness | Diagnostic Classification | Remediation Weight |
|---|---|---|---|:---:|
| **Correct** | *Sicher (Sure)* | Correct | **Sicheres Wissen** (Secure Knowledge) | 0 |
| **Correct** | *Geraten (Guessed)* | Correct | **Unsicheres Wissen** (Uncertain Knowledge) | 1 |
| **Incorrect** | *Geraten (Guessed)* | Incorrect | **Bekannte Lücke** (Known Gap) | 2 |
| **Incorrect** | *Sicher (Sure)* | Incorrect | **Möglicher blinder Fleck** (Potential Blind Spot) | 3 |

### Readiness Rules & Safeguard Hierarchy
Readiness is assigned strictly sequentially:

1. **Rule 1 (Safeguard Check) $\rightarrow$ `practise_before_booking`**:
   - Triggered if **any skill** has $\le 2$ correct out of 4 (**Condition A**).
   - Triggered if total blind spots $\ge 3$ across the assessment (**Condition B**).
   - *Rationale:* Goethe A1 requires minimum passing marks across sections; catastrophic weakness in grammar or multiple confident misconceptions will cause exam failure.
2. **Rule 2 (Mastery Check) $\rightarrow$ `ready_to_consider_booking`**:
   - Triggered if **all 3 skills** have $\ge 3$ secure answers out of 4 (**Condition C**), **AND** total blind spots $\le 1$ (**Condition D**).
   - *Rationale:* High accuracy supported by genuine confidence demonstrates robust exam readiness.
3. **Rule 3 (Default Fallthrough) $\rightarrow$ `almost_there`**:
   - Assigned when neither Rule 1 nor Rule 2 triggers.
   - *Rationale:* Indicates adequate foundational knowledge with fragile recall or guessed items requiring consolidation.

### Prioritized Remediation Engine
- Errors are aggregated by topic tag (`accusative_articles`, `v2_word_order`, etc.).
- Ranked descending by cumulative weight ($3 \times \text{blind spots} + 2 \times \text{gaps} + 1 \times \text{uncertainties}$).
- Deterministic tie-breaking preserves the initial question bank encounter order.
- Slices the top 3 actionable recommendations; includes zero-weight maintenance advice for perfect scores.

---

## 3. Curated Question Bank Structure

The assessment consists of exactly 12 authentic CEFR A1 questions:
- **Vocabulary (4 questions)**: Everyday locations (*Apotheke*), Food shopping (*Bäckerei/Gemüse*), Family relations (*Geschwister*), Weather & clothing (*Winterjacke*).
- **Grammar (4 questions)**: Accusative masculine articles (*den/einen*), Irregular vowel-shift verbs (*fahren/fährt*), Verb-second word order (*Am Sonntag fahre ich...*), Negation (*kein* vs. *nicht*).
- **Reading (4 questions)**: Real-world stimuli:
  - Personal party invitation email.
  - Public library opening hours notice.
  - Regional train timetable schedule.
  - Apartment classified advertisement.

---

## 4. Project Structure

```
c:\Nextleap Projects Git\Assg\
├── public/
│   ├── favicon.svg              # Brand SVG favicon
│   ├── icons.svg                # Vector asset repository
│   └── _redirects               # Netlify SPA routing rules
├── src/
│   ├── components/
│   │   ├── assessment/          # Assessment runner, options, progress, confidence
│   │   │   ├── AssessmentRunner.tsx
│   │   │   ├── ConfidenceSelector.tsx
│   │   │   ├── NavigationBar.tsx
│   │   │   ├── OptionGroup.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── StimulusCard.tsx
│   │   ├── common/              # Accessible primitives: Card, Button, Badge, Modal
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ConfirmModal.tsx
│   │   ├── landing/             # Value proposition & scope disclosures
│   │   │   ├── LandingHero.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   └── ScopeNotice.tsx
│   │   ├── layout/              # Persistent Header & Footer
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   └── results/             # Diagnostic report, breakdown, mistake review
│   │       ├── AssessmentDisclaimers.tsx
│   │       ├── DiagnosticLegend.tsx
│   │       ├── MistakeReviewDrawer.tsx
│   │       ├── PracticePriorityList.tsx
│   │       ├── ReadinessBanner.tsx
│   │       ├── RestartCTA.tsx
│   │       ├── ResultsDashboard.tsx
│   │       └── SkillBreakdownGrid.tsx
│   ├── data/
│   │   └── questionBank.ts      # 12 immutable diagnostic questions
│   ├── hooks/
│   │   └── useAssessmentSession.ts # Step orchestrator & state machine
│   ├── logic/
│   │   ├── engine.ts            # Scoring pipeline orchestrator
│   │   ├── metrics.ts           # Per-skill aggregations
│   │   ├── readiness.ts         # Provisional readiness rule evaluator
│   │   ├── recommendations.ts   # Weighted topic recommendation sorter
│   │   └── scoring.ts           # 2x2 matrix classifier
│   ├── types/
│   │   └── diagnostic.ts        # TypeScript domain interfaces
│   ├── App.tsx                  # Root application orchestrator
│   ├── index.css                # Design system tokens & typography
│   └── main.tsx                 # Entrypoint
├── tests/
│   ├── a11y.test.tsx            # WCAG 2.1 AA & keyboard navigation suite
│   ├── components.test.tsx      # Presentation layer integration tests
│   ├── edge_cases.test.ts       # Boundary conditions & anomaly tests
│   ├── engine.test.ts           # Pipeline integration tests
│   ├── metrics.test.ts          # Aggregation logic tests
│   ├── questionBank.test.ts     # Content schema & integrity tests
│   ├── readiness.test.ts        # Rule hierarchy boundary tests
│   ├── recommendations.test.ts  # Weighted recommendation & tie-break tests
│   ├── scoring.test.ts          # 2x2 matrix unit tests
│   └── session.test.ts          # Session navigation & state integrity tests
├── netlify.toml                 # Netlify deployment configuration
├── vercel.json                  # Vercel deployment configuration
├── vite.config.ts               # Vite bundler configuration
└── vitest.config.ts             # Vitest test runner configuration
```

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/bereit-a1-readiness.git
cd bereit-a1-readiness
npm install
```

### Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Verification & Quality Gates

The project maintains 100% test pass rate and strict type safety:

```bash
# 1. Execute automated unit & accessibility test suite (60 tests)
npm run test:run

# 2. Execute strict TypeScript typecheck
npm run typecheck

# 3. Execute linting validation
npm run lint

# 4. Generate production static build
npm run build
```

---

## 7. Production Deployment Instructions

**Bereit?** compiles into an ultra-compact, zero-dependency static distribution in `dist/`. It requires no backend server, database, or API keys.

### Deploying to Vercel
1. Install Vercel CLI (or connect via GitHub):
   ```bash
   npm i -g vercel
   ```
2. Deploy from the project root:
   ```bash
   vercel --prod
   ```
   *Note: `vercel.json` is preconfigured with static rewrites and security headers.*

### Deploying to Netlify
1. Connect the repository in the Netlify web dashboard or use Netlify CLI:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod --dir=dist
   ```
   *Note: `netlify.toml` and `public/_redirects` are preconfigured.*

### Deploying to Cloudflare Pages / GitHub Pages
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: `>= 18`

---

## 8. Privacy, Security & Disclaimers

- **Zero Data Collection**: No user answers, scores, or identifiers are logged or sent to any server. All state is held in ephemeral client memory and wiped when the tab is closed or reset.
- **Independent Diagnostic**: *Bereit?* is an independent educational diagnostic tool and is neither affiliated with nor endorsed by the Goethe-Institut e.V. or the ÖSD (Österreichisches Sprachdiplom Deutsch).
- **Scope Limitation**: Evaluates reading, grammar, and vocabulary only. Productive speaking, listening, and free-form writing require independent practice.

---

## 9. License

This project is licensed under the [MIT License](LICENSE).
