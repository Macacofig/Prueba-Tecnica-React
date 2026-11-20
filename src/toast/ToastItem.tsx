import { useEffect } from 'react'
import { TOAST_ANIMATION_DURATION } from './toastReducer'
import type { Toast } from './types'

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: number) => void
}

const TOAST_SYMBOL: Record<Toast['type'], string> = {
  success: '✔',
  error: '✖',
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    if (toast.exiting) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id)
    }, Math.max(0, toast.duration - TOAST_ANIMATION_DURATION))

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast.id, toast.duration, toast.exiting, onDismiss])

  return (
    <div
      className={`toast ${toast.exiting ? 'toast--exiting' : ''}`}
      role="status"
      aria-live="polite"
      data-type={toast.type}
    >
      <span className="toast__icon" aria-hidden="true">
        {TOAST_SYMBOL[toast.type]}
      </span>
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        aria-label="Cerrar notificación"
        onClick={() => onDismiss(toast.id)}
      >
        ×
      </button>
    </div>
  )
}
