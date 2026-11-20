import { Info } from 'lucide-react'

export function AssessmentDisclaimers() {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white/70 p-4 space-y-2 text-xs text-gray-700 leading-relaxed"
      role="note"
      aria-label="Haftungsausschluss und methodische Grenzen"
    >
      <div className="flex items-center gap-1.5 font-bold text-gray-800">
        <Info className="w-4 h-4 text-brand-blue" aria-hidden="true" />
        <span>Haftungsausschluss & methodische Grenzen</span>
      </div>
      <p>
        Dies ist eine kurze diagnostische Übungshilfe und keine offizielle Prüfung des Goethe-Instituts oder des ÖSD. 
        Bereit? bewertet ausschließlich die Teilbereiche Wortschatz, Grammatik und Leseverstehen.
        Mündlicher Ausdruck (Sprechen), Hörverstehen und freies Schreiben werden nicht getestet.
      </p>
      <p>
        Die ermittelte Prüfungsbereitschaft basiert auf Richtwerten und stellt keine Garantie für das Bestehen einer offiziellen Prüfung dar.
      </p>
    </div>
  )
}

