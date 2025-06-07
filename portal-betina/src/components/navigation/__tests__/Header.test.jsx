// Teste para o componente Header
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Header from '../../components/navigation/Header';

describe('Componente Header', () => {
  test('renderiza título corretamente', () => {
    render(<Header title="Título de Teste" />);
    expect(screen.getByText(/Título de Teste/i)).toBeInTheDocument();
  });

  test('chama função onLogoClick ao clicar no logo', () => {
    const mockOnClick = vi.fn();
    render(<Header title="Teste" onLogoClick={mockOnClick} />);
    
    const logoButton = screen.getByRole('button', { name: /portal betina/i });
    logoButton.click();
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
