import { useEffect, useRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Ja, neu starten',
  cancelText = 'Abbrechen',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null)
  const cancelBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus()

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        } else if (e.key === 'Tab') {
          // Focus trap between Cancel and Confirm buttons
          if (e.shiftKey) {
            if (document.activeElement === cancelBtnRef.current) {
              e.preventDefault()
              confirmBtnRef.current?.focus()
            }
          } else {
            if (document.activeElement === confirmBtnRef.current) {
              e.preventDefault()
              cancelBtnRef.current?.focus()
            }
          }
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-600 flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-ink">
              {title}
            </h3>
            <p id="modal-description" className="text-sm text-text-muted mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            ref={cancelBtnRef}
            variant="outline"
            size="md"
            onClick={onCancel}
            className="min-h-[44px]"
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmBtnRef}
            variant="danger"
            size="md"
            onClick={onConfirm}
            className="min-h-[44px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

