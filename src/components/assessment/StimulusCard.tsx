import { FileText } from 'lucide-react'

export interface StimulusCardProps {
  stimulus: string
}

export function StimulusCard({ stimulus }: StimulusCardProps) {
  return (
    <div className="rounded-xl border border-blue-200/70 bg-blue-50/30 p-4 sm:p-5 space-y-2 shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
        <FileText className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>Kontext / Lesetext:</span>
      </div>
      <div className="overflow-x-auto max-w-full">
        <pre className="font-sans text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap font-normal select-text">
          {stimulus}
        </pre>
      </div>
    </div>
  )
}

