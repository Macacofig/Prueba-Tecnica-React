import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { ToastContext } from './ToastContext'
import { TOAST_ANIMATION_DURATION, toastReducer } from './toastReducer'
import { ToastViewport } from './ToastViewport'
import type { ShowToastOptions, ToastContextValue } from './types'
import './toast.css'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(toastReducer, [])
  const nextId = useRef(0)
  const exitTimers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    if (exitTimers.current.has(id)) {
      return
    }

    dispatch({ type: 'START_EXIT', id })

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'REMOVE', id })
      exitTimers.current.delete(id)
    }, TOAST_ANIMATION_DURATION)

    exitTimers.current.set(id, timeoutId)
  }, [])

  const show = useCallback((options: ShowToastOptions) => {
    nextId.current += 1
    dispatch({ type: 'ADD', payload: options, id: nextId.current })
  }, [])

  useEffect(() => {
    const timers = exitTimers.current

    return () => {
      timers.forEach((timeoutId) => window.clearTimeout(timeoutId))
      timers.clear()
    }
  }, [])

  const contextValue = useMemo<ToastContextValue>(
    () => ({ show, dismiss }),
    [show, dismiss],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
