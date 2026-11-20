import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider, useToast } from '..'
import { TOAST_ANIMATION_DURATION } from '../toastReducer'

function ToastHarness() {
  const toast = useToast()

  const showCustom = () => {
    const rawDuration = (document.querySelector('#duration') as HTMLInputElement)
      .value

    toast.show({
      type: 'success',
      message: 'Notificación personalizada',
      duration: Math.round(Number(rawDuration) * 1000),
    })
  }

  return (
    <div>
      <label>
        Duración (s)
        <input id="duration" type="number" step="0.1" defaultValue="3" />
      </label>
      <button
        type="button"
        onClick={() =>
          toast.show({ type: 'success', message: 'Guardado correctamente' })
        }
      >
        success
      </button>
      <button
        type="button"
        onClick={() => toast.show({ type: 'error', message: 'Ocurrió un error' })}
      >
        error
      </button>
      <button type="button" onClick={showCustom}>
        custom
      </button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <ToastProvider>
      <ToastHarness />
    </ToastProvider>,
  )
}

function setDuration(value: string) {
  fireEvent.change(screen.getByLabelText('Duración (s)'), {
    target: { value },
  })
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('muestra una notificación de éxito', () => {
    renderWithProvider()

    fireEvent.click(screen.getByRole('button', { name: 'success' }))

    expect(screen.getByText('Guardado correctamente')).toBeInTheDocument()
    expect(screen.getByText('✔')).toBeInTheDocument()
  })

  it('muestra una notificación de error', () => {
    renderWithProvider()

    fireEvent.click(screen.getByRole('button', { name: 'error' }))

    expect(screen.getByText('Ocurrió un error')).toBeInTheDocument()
    expect(screen.getByText('✖')).toBeInTheDocument()
  })

  it('muestra múltiples notificaciones simultáneamente', () => {
    renderWithProvider()

    fireEvent.click(screen.getByRole('button', { name: 'success' }))
    fireEvent.click(screen.getByRole('button', { name: 'error' }))

    expect(screen.getByText('Guardado correctamente')).toBeInTheDocument()
    expect(screen.getByText('Ocurrió un error')).toBeInTheDocument()
    expect(screen.getAllByRole('status')).toHaveLength(2)
  })

  it('aplica la animación de salida durante el último segundo y desaparece a los 3 segundos', () => {
    renderWithProvider()

    fireEvent.click(screen.getByRole('button', { name: 'success' }))
    const toast = screen.getByText('Guardado correctamente').closest('.toast')
    expect(toast).not.toHaveClass('toast--exiting')

    act(() => {
      vi.advanceTimersByTime(3000 - TOAST_ANIMATION_DURATION)
    })
    expect(toast).toHaveClass('toast--exiting')
    expect(screen.getByText('Guardado correctamente')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(TOAST_ANIMATION_DURATION)
    })
    expect(screen.queryByText('Guardado correctamente')).not.toBeInTheDocument()
  })

  it('el botón custom usa el valor numérico ingresado como duración', () => {
    renderWithProvider()
    setDuration('5')

    fireEvent.click(screen.getByRole('button', { name: 'custom' }))
    const toast = screen.getByText('Notificación personalizada').closest('.toast')

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(toast).toBeInTheDocument()
    expect(toast).not.toHaveClass('toast--exiting')

    act(() => {
      vi.advanceTimersByTime(5000 - 3000 - TOAST_ANIMATION_DURATION)
    })
    expect(toast).toHaveClass('toast--exiting')

    act(() => {
      vi.advanceTimersByTime(TOAST_ANIMATION_DURATION)
    })
    expect(
      screen.queryByText('Notificación personalizada'),
    ).not.toBeInTheDocument()
  })

  it('convierte duraciones fraccionarias en segundos a milisegundos', () => {
    renderWithProvider()
    setDuration('2.5')

    fireEvent.click(screen.getByRole('button', { name: 'custom' }))
    const toast = screen.getByText('Notificación personalizada').closest('.toast')

    act(() => {
      vi.advanceTimersByTime(2500 - TOAST_ANIMATION_DURATION)
    })
    expect(toast).toHaveClass('toast--exiting')

    act(() => {
      vi.advanceTimersByTime(TOAST_ANIMATION_DURATION)
    })
    expect(
      screen.queryByText('Notificación personalizada'),
    ).not.toBeInTheDocument()
  })

  it('permite cerrar una notificación manualmente con animación de salida', () => {
    renderWithProvider()

    fireEvent.click(screen.getByRole('button', { name: 'success' }))
    const toast = screen.getByText('Guardado correctamente').closest('.toast')

    fireEvent.click(
      screen.getByRole('button', { name: 'Cerrar notificación' }),
    )

    expect(toast).toHaveClass('toast--exiting')

    act(() => {
      vi.advanceTimersByTime(TOAST_ANIMATION_DURATION)
    })
    expect(screen.queryByText('Guardado correctamente')).not.toBeInTheDocument()
  })
})
