import type { ShowToastOptions, Toast } from './types'

export const DEFAULT_TOAST_DURATION = 3000
export const TOAST_ANIMATION_DURATION = 1200

export type ToastAction =
  | { type: 'ADD'; payload: ShowToastOptions; id: number }
  | { type: 'START_EXIT'; id: number }
  | { type: 'REMOVE'; id: number }

export function createToast(options: ShowToastOptions, id: number): Toast {
  return {
    id,
    type: options.type,
    message: options.message,
    duration: options.duration ?? DEFAULT_TOAST_DURATION,
    exiting: false,
  }
}

export function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      return [...state, createToast(action.payload, action.id)]
    case 'START_EXIT':
      return state.map((toast) =>
        toast.id === action.id ? { ...toast, exiting: true } : toast,
      )
    case 'REMOVE':
      return state.filter((toast) => toast.id !== action.id)
  }
}
