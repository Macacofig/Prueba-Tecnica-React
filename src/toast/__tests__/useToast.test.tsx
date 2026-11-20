import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  it('lanza un error si se usa fuera del ToastProvider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast debe utilizarse dentro de un <ToastProvider>.',
    )
  })
})
