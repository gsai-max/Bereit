/**
 * Domain types and contracts for Bereit? (A1 German Exam Readiness Check)
 * Strict, immutable interfaces derived from architecture.md and implementation_plan.md
 */

export type SkillCategory = 'vocabulary' | 'grammar' | 'reading';

export type CognitiveLevel = 'foundational' | 'application';

export interface QuestionOption {
  id: string;              // e.g. "q_vocab_01_opt_b"
  text: string;            // Option text in German (e.g. "In der Apotheke")
}

export interface Question {
  id: string;              // e.g. "q_vocab_01"
  skill: SkillCategory;    // 'vocabulary' | 'grammar' | 'reading'
  cognitiveLevel: CognitiveLevel;
  topicTag: string;        // e.g. "everyday_places", "accusative_articles"
  topicDisplayName: string;// e.g. "Orte im Alltag & Dienstleistungen"
  contextStimulus?: string;// Context block for reading stimuli (emails, notices, timetables)
  prompt: string;          // Question prompt in German
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]; // Exactly 4 options
  correctOptionId: string; // ID of the single correct option
  explanation: string;     // Concise, clear grammatical/lexical explanation in German
  remediationTitle: string;// Actionable practice heading
  remediationAction: string;// Concrete remediation instruction
}

export type ConfidenceLevel = 'sure' | 'guessed';

export interface UserResponse {
  questionId: string;
  selectedOptionId: string;
  confidence: ConfidenceLevel;
}

export interface IncompleteUserResponse {
  questionId: string;
  selectedOptionId?: string;
  confidence?: ConfidenceLevel;
}

export type AppScreen = 'landing' | 'assessment' | 'results';

export interface AssessmentSessionState {
  currentScreen: AppScreen;
  currentQuestionIndex: number; // 0 to 11
  responses: Record<string, IncompleteUserResponse>; // Keyed by questionId
  isCompleted: boolean;
  isResetModalOpen: boolean;
  results: FullAssessmentResult | null;
}

export type DiagnosticState =
  | 'secure_knowledge'    // Correct + Sure (Weight: 0)
  | 'uncertain_knowledge' // Correct + Guessed (Weight: 1)
  | 'known_gap'           // Incorrect + Guessed (Weight: 2)
  | 'potential_blind_spot';// Incorrect + Sure (Weight: 3)

export interface EvaluatedQuestionResponse {
  question: Question;
  response: UserResponse;
  isCorrect: boolean;
  diagnosticState: DiagnosticState;
  priorityWeight: number; // 3, 2, 1, or 0
}

export interface SkillScoreSummary {
  skill: SkillCategory;
  totalQuestions: 4;
  correctCount: number;
  accuracyPercentage: number;
  secureCount: number;
  uncertainCount: number;
  knownGapCount: number;
  blindSpotCount: number;
}

export type ReadinessCategory =
  | 'practise_before_booking'
  | 'ready_to_consider_booking'
  | 'almost_there';

export interface ReadinessEvaluation {
  category: ReadinessCategory;
  headline: string;
  explanation: string;
  provisionalNotice: string;
}

export interface PracticeRecommendation {
  topicTag: string;
  topicDisplayName: string;
  priorityWeight: number;
  actionTitle: string;
  actionText: string;
  triggerReason: string;
}

export interface FullAssessmentResult {
  readiness: ReadinessEvaluation;
  skillSummaries: Record<SkillCategory, SkillScoreSummary>;
  totalCorrect: number;           // Out of 12
  totalBlindSpots: number;
  evaluatedResponses: EvaluatedQuestionResponse[];
  topRecommendations: PracticeRecommendation[]; // Up to 3
}

