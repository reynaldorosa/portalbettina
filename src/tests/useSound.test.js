// Teste para o hook useSound
import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useSound from '../hooks/useSound'

// Mock do Audio
class MockAudio {
  constructor(src) {
    this.src = src
    this.volume = 1
    this.currentTime = 0
    this.duration = 0
    this.paused = true
    this.ended = false
    this.play = vi.fn().mockResolvedValue()
    this.pause = vi.fn()
    this.load = vi.fn()
    this.addEventListener = vi.fn()
    this.removeEventListener = vi.fn()
  }
}

// Substituir implementação global do Audio
global.Audio = MockAudio

describe('Hook useSound', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('deve carregar e reproduzir um som', () => {
    const { result } = renderHook(() => useSound())

    act(() => {
      result.current.play('click')
    })

    expect(global.Audio.mock.instances[0].play).toHaveBeenCalledTimes(1)
  })

  test('deve definir volume corretamente', () => {
    const { result } = renderHook(() => useSound())
    const volume = 0.5

    act(() => {
      result.current.setVolume(volume)
      result.current.play('click')
    })

    expect(global.Audio.mock.instances[0].volume).toBe(volume)
  })

  test('não deve reproduzir som quando mudo', () => {
    const { result } = renderHook(() => useSound())

    act(() => {
      result.current.setMuted(true)
      result.current.play('click')
    })

    expect(global.Audio.mock.instances[0].play).not.toHaveBeenCalled()
  })
})
