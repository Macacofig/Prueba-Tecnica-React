export type ToastType = 'success' | 'error'

export interface ShowToastOptions {
  type: ToastType
  message: string
  /** Milisegundos antes de ocultarse automáticamente. Por defecto 3000. */
  duration?: number
}

export interface Toast extends Required<ShowToastOptions> {
  id: number
  /** Indica que la animación de salida está en curso. */
  exiting: boolean
}

export interface ToastContextValue {
  show: (options: ShowToastOptions) => void
  dismiss: (id: number) => void
}
