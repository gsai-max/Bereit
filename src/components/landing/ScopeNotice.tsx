import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { Card } from '../common/Card'

export function ScopeNotice() {
  return (
    <Card className="max-w-2xl mx-auto bg-white space-y-5">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-blue flex-shrink-0" aria-hidden="true" />
          <span>Prüfungsumfang & Transparenz</span>
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Um deine Zeit optimal zu nutzen, konzentriert sich Bereit? auf die schriftlichen Kernbereiche.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Tested Areas */}
        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-state-secure">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Was geprüft wird:</span>
          </div>
          <ul className="space-y-1.5 text-gray-700">
            <li className="flex items-start gap-1.5">
              <span className="font-semibold text-emerald-800">• Wortschatz:</span> Orte, Einkaufen, Familie, Kleidung
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-semibold text-emerald-800">• Grammatik:</span> Akkusativ, Vokalwechsel, V2-Wortstellung, Verneinung
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-semibold text-emerald-800">• Leseverstehen:</span> E-Mails, Hinweisschilder, Fahrpläne, Kleinanzeigen
            </li>
          </ul>
        </div>

        {/* Excluded Areas */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <XCircle className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Was nicht geprüft wird:</span>
          </div>
          <ul className="space-y-1.5 text-slate-600">
            <li>• Hörverstehen (keine Audioaufgaben)</li>
            <li>• Mündliche Sprachprüfung (Sprechen)</li>
            <li>• Freies Schreiben von Texten</li>
          </ul>
          <p className="text-[11px] text-text-muted italic pt-1">
            Diese Fertigkeiten müssen gesondert für die Prüfung geübt werden.
          </p>
        </div>
      </div>

      {/* Provisional Disclaimer */}
      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
        <strong>Transparenzhinweis:</strong> Dieser Test dient als Vorbereitungshilfe und ehrlicher Diagnose-Check. Er ist keine offizielle Prüfung des Goethe-Instituts oder des ÖSD und garantiert kein Prüfungsergebnis.
      </div>
    </Card>
  )
}

