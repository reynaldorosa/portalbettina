// Teste para o componente Header
import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import Header from '../Header'

// Mock de dependências que podem ser necessárias
vi.mock('../../../hooks/useSound', () => ({
  default: () => ({
    playSound: vi.fn(),
    stopSound: vi.fn(),
    isPlaying: false,
  }),
}))

describe('Componente Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renderiza título corretamente', () => {
    render(<Header title="Título de Teste" />)
    expect(screen.getByText(/Título de Teste/i)).toBeInTheDocument()
  })

  test('chama função onLogoClick ao clicar no logo', () => {
    const mockOnClick = vi.fn()
    render(<Header title="Teste" onLogoClick={mockOnClick} />)

    const logoButton = screen.getByRole('button', { name: /portal betina/i })
    logoButton.click()

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
