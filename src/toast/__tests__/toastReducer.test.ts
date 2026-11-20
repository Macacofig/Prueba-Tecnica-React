import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TOAST_DURATION,
  TOAST_ANIMATION_DURATION,
  createToast,
  toastReducer,
} from '../toastReducer'

describe('toastReducer', () => {
  it('crea un toast con duración por defecto de 3 segundos', () => {
    const toast = createToast({ type: 'success', message: 'Ok' }, 1)

    expect(toast).toEqual({
      id: 1,
      type: 'success',
      message: 'Ok',
      duration: DEFAULT_TOAST_DURATION,
      exiting: false,
    })
  })

  it('permite configurar una duración personalizada', () => {
    const toast = createToast(
      { type: 'error', message: 'Fallo', duration: 5000 },
      2,
    )

    expect(toast.duration).toBe(5000)
  })

  it('agrega múltiples notificaciones al estado', () => {
    let state = toastReducer([], {
      type: 'ADD',
      payload: { type: 'success', message: 'Uno' },
      id: 1,
    })
    state = toastReducer(state, {
      type: 'ADD',
      payload: { type: 'error', message: 'Dos' },
      id: 2,
    })

    expect(state).toHaveLength(2)
    expect(state.map((toast) => toast.message)).toEqual(['Uno', 'Dos'])
  })

  it('marca una notificación como saliente antes de eliminarla', () => {
    const state = [createToast({ type: 'success', message: 'Uno' }, 1)]

    const exitingState = toastReducer(state, { type: 'START_EXIT', id: 1 })

    expect(exitingState[0]?.exiting).toBe(true)
    expect(TOAST_ANIMATION_DURATION).toBeGreaterThanOrEqual(1000)
    expect(TOAST_ANIMATION_DURATION).toBeLessThanOrEqual(1500)
  })

  it('elimina una notificación por id sin afectar las demás', () => {
    const state = [
      createToast({ type: 'success', message: 'Uno' }, 1),
      createToast({ type: 'error', message: 'Dos' }, 2),
    ]

    const nextState = toastReducer(state, { type: 'REMOVE', id: 1 })

    expect(nextState).toHaveLength(1)
    expect(nextState[0]?.id).toBe(2)
  })
})
