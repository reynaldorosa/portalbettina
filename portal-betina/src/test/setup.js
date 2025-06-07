// Configuração para testes
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Estender as assertivas com matchers do testing-library
expect.extend(matchers);

// Limpar após cada teste
afterEach(() => {
  cleanup();
});
