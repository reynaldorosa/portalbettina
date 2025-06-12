/**
 * @file setup.js
 * @description Configuração global para testes do Portal Betina
 */

import { vi, beforeEach, afterEach } from 'vitest'

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock do sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock da API de Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  duration: 0,
  paused: true,
  volume: 1,
}))

// Mock do Web Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: 'sine',
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: { value: 1 },
  }),
  destination: {},
  currentTime: 0,
  close: vi.fn(),
  resume: vi.fn(),
  suspend: vi.fn(),
}))

// Mock do performance.memory para CircuitBreaker
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 1024 * 1024, // 1MB
    totalJSHeapSize: 10 * 1024 * 1024, // 10MB
    jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
  },
  writable: true,
})

// Mock do navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
})

// Mock do window.speechSynthesis para TTS
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
    speaking: false,
    pending: false,
    paused: false,
  },
  writable: true,
})

// Mock do SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
  text,
  voice: null,
  volume: 1,
  rate: 1,
  pitch: 1,
  lang: 'pt-BR',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))

// Mock do console para testes
const originalConsole = global.console

beforeEach(() => {
  global.console = {
    ...originalConsole,
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }
})

afterEach(() => {
  global.console = originalConsole
  vi.clearAllMocks()
})

// Mock das variáveis de ambiente necessárias
process.env.NODE_ENV = 'test'
process.env.VITE_API_URL = 'http://localhost:3000'

// Mock do fetch global
global.fetch = vi.fn()

// Configurações globais do vitest
vi.mock('../../utils/metrics/performanceMonitor.js', () => ({
  performanceMonitor: {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    startTimer: vi.fn(),
    endTimer: vi.fn(),
    recordMetric: vi.fn(),
  },
}))

// Mock do logger para CircuitBreaker
vi.mock('../../utils/logger', () => ({
  default: {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

// Timeout global para testes
vi.setConfig({
  testTimeout: 10000,
})
