import { ArrowRight, Clock, ShieldCheck, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '../common/Button'

export interface LandingHeroProps {
  onStart: () => void
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="text-center space-y-6 max-w-2xl mx-auto pt-4 sm:pt-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold border border-blue-100 shadow-xs">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Ehrliche Selbsteinschätzung für Goethe & ÖSD A1</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight leading-tight sm:leading-none">
        Bist du wirklich bereit für die A1-Prüfung?
      </h1>

      <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto">
        Üben allein reicht nicht. Bevor du 120 €+ für die offizielle Deutschprüfung zahlst,
        finde heraus: Was sitzt wirklich sicher, wo hast du nur geraten und wo verstecken sich teure blinde Flecken?
      </p>

      {/* Value Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-700 font-medium pt-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-brand-blue" aria-hidden="true" />
          <span>12 gezielte Fragen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-brand-blue" aria-hidden="true" />
          <span>5–8 Minuten</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-blue" aria-hidden="true" />
          <span>Keine Registrierung & 100% vertraulich</span>
        </div>
      </div>

      {/* Main CTA */}
      <div className="pt-4">
        <Button
          size="lg"
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold shadow-md gap-2"
        >
          <span>Diagnosetest jetzt starten</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}

