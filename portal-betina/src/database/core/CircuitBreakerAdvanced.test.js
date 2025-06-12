/**
 * @file CircuitBreakerAdvanced.test.js
 * @description Testes para CircuitBreakerAdvanced e integração com classes utilitárias
 * Portal Betina - Sistema avançado de Circuit Breaker com suporte para autismo
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CircuitBreakerAdvanced from './CircuitBreakerAdvanced.js'

// Mock das classes utilitárias
vi.mock('../../utils/metrics/errorPatternAnalyzer.js', () => ({
  ErrorPatternAnalyzer: vi.fn().mockImplementation(() => ({
    recordFailure: vi.fn(),
    recordSuccess: vi.fn(),
    predict: vi.fn().mockReturnValue({ riskLevel: 'low', riskMultiplier: 1.0, confidence: 0.8 }),
    getStatistics: vi.fn().mockReturnValue({ totalErrors: 0, patternsDetected: 0 }),
    getLastPattern: vi.fn().mockReturnValue(null),
  })),
}))

vi.mock('../../utils/metrics/performanceAnalyzer.js', () => ({
  PerformanceAnalyzer: vi.fn().mockImplementation(() => ({
    startMonitoring: vi.fn().mockReturnValue({
      recordSuccess: vi.fn(),
      recordError: vi.fn(),
    }),
    stopMonitoring: vi.fn(),
    predict: vi.fn().mockReturnValue({ expectedResponseTime: 1000, confidence: 0.7 }),
    getStatistics: vi.fn().mockReturnValue({ totalOperations: 0, averageResponseTime: 0 }),
  })),
}))

vi.mock('../../utils/therapy/therapeuticAnalyzer.js', () => ({
  TherapeuticAnalyzer: vi.fn().mockImplementation(() => ({
    analyze: vi.fn().mockReturnValue({
      riskLevel: 'low',
      timeoutMultiplier: 1.0,
      requiredAdaptations: [],
      therapeuticRecommendations: [],
    }),
    checkExecution: vi.fn().mockResolvedValue({
      safe: true,
      block: false,
      requiredAdaptations: [],
      interventions: [],
    }),
    adaptFallback: vi.fn().mockImplementation((fn) => fn),
    recordSuccess: vi.fn(),
    recordFailure: vi.fn(),
    getStatus: vi.fn().mockReturnValue({ interventions: 0, activeProfiles: 0 }),
    initializeInterventionStrategies: vi.fn(),
  })),
}))

vi.mock('../../utils/shared/circuitBreakerUtils.js', () => ({
  AccessibilityManager: vi.fn().mockImplementation(() => ({
    applyAdaptations: vi.fn().mockReturnValue({}),
    getUserPreferences: vi.fn().mockReturnValue({}),
    getDefaultPreferences: vi.fn().mockReturnValue({}),
    validateAccessibility: vi.fn().mockReturnValue({ compliant: true, violations: [] }),
    getStatistics: vi.fn().mockReturnValue({ totalAdaptations: 0 }),
  })),
  HealthChecker: vi.fn().mockImplementation(() => ({
    getScore: vi.fn().mockReturnValue(1.0),
  })),
  QualityAssessor: vi.fn().mockImplementation(() => ({
    assess: vi.fn().mockReturnValue({ score: 1.0 }),
    recordSuccess: vi.fn(),
    recordFailure: vi.fn(),
    isQualityDegraded: vi.fn().mockReturnValue(false),
    currentQuality: 1.0,
  })),
}))

describe('CircuitBreakerAdvanced', () => {
  let circuitBreaker
  let mockAsyncFunction
  let mockFallbackFunction

  beforeEach(() => {
    // Mock do logger
    vi.mock('../../utils/metrics/performanceMonitor.js', () => ({
      performanceMonitor: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
      },
    }))

    circuitBreaker = new CircuitBreakerAdvanced({
      failureThreshold: 3,
      timeout: 1000,
      retryTimeout: 5000,
      enablePatternAnalysis: true,
      therapeuticMode: true,
      autismFriendly: true,
      sensoryAdaptation: true,
    })

    mockAsyncFunction = vi.fn()
    mockFallbackFunction = vi.fn()
  })

  afterEach(() => {
    circuitBreaker.cleanup()
    vi.clearAllMocks()
  })

  describe('Inicialização', () => {
    it('deve inicializar com configuração padrão', () => {
      expect(circuitBreaker.state).toBe('CLOSED')
      expect(circuitBreaker.failureCount).toBe(0)
      expect(circuitBreaker.config.therapeuticMode).toBe(true)
      expect(circuitBreaker.config.autismFriendly).toBe(true)
    })

    it('deve inicializar todas as classes utilitárias', () => {
      expect(circuitBreaker.patternAnalyzer).toBeDefined()
      expect(circuitBreaker.performanceAnalyzer).toBeDefined()
      expect(circuitBreaker.therapeuticAnalyzer).toBeDefined()
      expect(circuitBreaker.accessibilityManager).toBeDefined()
      expect(circuitBreaker.healthChecker).toBeDefined()
      expect(circuitBreaker.qualityAssessor).toBeDefined()
    })

    it('deve ter funcionalidades avançadas habilitadas', () => {
      const features = circuitBreaker.getEnabledFeatures()
      expect(features).toContain('pattern_analysis')
      expect(features).toContain('therapeutic_mode')
      expect(features).toContain('autism_friendly')
      expect(features).toContain('sensory_adaptation')
    })
  })

  describe('Execução Básica', () => {
    it('deve executar função com sucesso', async () => {
      mockAsyncFunction.mockResolvedValue('success')

      const result = await circuitBreaker.execute(mockAsyncFunction)

      expect(result).toBe('success')
      expect(circuitBreaker.statistics.successfulCalls).toBe(1)
      expect(circuitBreaker.statistics.totalCalls).toBe(1)
    })

    it('deve registrar falha e manter circuito fechado', async () => {
      mockAsyncFunction.mockRejectedValue(new Error('test error'))

      await expect(circuitBreaker.execute(mockAsyncFunction)).rejects.toThrow('test error')

      expect(circuitBreaker.failureCount).toBe(1)
      expect(circuitBreaker.state).toBe('CLOSED')
    })

    it('deve abrir circuito após atingir threshold', async () => {
      mockAsyncFunction.mockRejectedValue(new Error('test error'))

      // Falhar 3 vezes para atingir o threshold
      for (let i = 0; i < 3; i++) {
        await expect(circuitBreaker.execute(mockAsyncFunction)).rejects.toThrow('test error')
      }

      expect(circuitBreaker.state).toBe('OPEN')
      expect(circuitBreaker.failureCount).toBe(3)
    })
  })

  describe('Execução Avançada', () => {
    it('deve executar com contexto terapêutico', async () => {
      mockAsyncFunction.mockResolvedValue('therapeutic_success')

      const result = await circuitBreaker.executeAdvanced(mockAsyncFunction, mockFallbackFunction, {
        context: 'therapy_session',
        therapeuticContext: {
          userId: 'user123',
          sessionId: 'session456',
          stressLevel: 0.3,
          sensoryState: 'calm',
        },
      })

      expect(result).toBe('therapeutic_success')
      expect(circuitBreaker.therapeuticAnalyzer.analyze).toHaveBeenCalled()
      expect(circuitBreaker.therapeuticAnalyzer.recordSuccess).toHaveBeenCalled()
    })

    it('deve aplicar adaptações de acessibilidade', async () => {
      mockAsyncFunction.mockResolvedValue('accessible_success')

      const result = await circuitBreaker.executeAdvanced(mockAsyncFunction, mockFallbackFunction, {
        context: 'autism_support',
        userId: 'user123',
        therapeuticContext: {
          visualSensitivity: 'high',
          auditorySensitivity: 'moderate',
        },
      })

      expect(result).toBe('accessible_success')
      expect(circuitBreaker.accessibilityManager.applyAdaptations).toHaveBeenCalled()
    })

    it('deve calcular timeout adaptativo com contexto terapêutico', async () => {
      const executionContext = {
        context: 'therapy',
        therapeuticAnalysis: {
          timeoutMultiplier: 2.0,
        },
        therapeuticContext: {
          sensoryOverload: true,
        },
        performancePrediction: {
          expectedResponseTime: 1500,
          confidence: 0.8,
        },
      }

      const timeout = await circuitBreaker.calculateAdaptiveTimeout(executionContext)

      expect(timeout).toBeGreaterThan(circuitBreaker.config.timeout)
      expect(timeout).toBeLessThanOrEqual(circuitBreaker.config.maxTimeout)
    })
  })

  describe('Análise de Padrões', () => {
    it('deve usar análise de padrões para predição', async () => {
      const executionContext = {
        context: 'api_call',
        priority: 'normal',
        therapeuticContext: null,
        userId: 'user123',
      }

      await circuitBreaker.analyzeExecutionContext(
        executionContext.context,
        executionContext.priority,
        executionContext.therapeuticContext,
        executionContext.userId
      )

      expect(circuitBreaker.patternAnalyzer.predict).toHaveBeenCalledWith(executionContext.context)
    })

    it('deve registrar padrões de erro', async () => {
      mockAsyncFunction.mockRejectedValue(new Error('network timeout'))

      await expect(circuitBreaker.executeAdvanced(mockAsyncFunction)).rejects.toThrow()

      expect(circuitBreaker.patternAnalyzer.recordFailure).toHaveBeenCalled()
    })
  })

  describe('Fallbacks Inteligentes', () => {
    it('deve executar fallback com adaptações terapêuticas', async () => {
      mockAsyncFunction.mockRejectedValue(new Error('primary failure'))
      mockFallbackFunction.mockResolvedValue('fallback_success')

      const result = await circuitBreaker.executeAdvanced(mockAsyncFunction, mockFallbackFunction, {
        context: 'therapy',
        therapeuticContext: {
          userId: 'user123',
          stressLevel: 0.7,
        },
      })

      expect(result).toBe('fallback_success')
      expect(circuitBreaker.therapeuticAnalyzer.adaptFallback).toHaveBeenCalled()
    })

    it('deve aplicar timeout reduzido para fallback', async () => {
      mockAsyncFunction.mockRejectedValue(new Error('primary failure'))
      mockFallbackFunction.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('slow_fallback'), 6000))
      )

      await expect(
        circuitBreaker.executeAdvanced(mockAsyncFunction, mockFallbackFunction)
      ).rejects.toThrow('timeout')
    })
  })

  describe('Estado Avançado', () => {
    it('deve retornar estado avançado completo', () => {
      const state = circuitBreaker.getAdvancedState()

      expect(state).toHaveProperty('state')
      expect(state).toHaveProperty('adaptiveMetrics')
      expect(state).toHaveProperty('health')
      expect(state).toHaveProperty('features')
      expect(state).toHaveProperty('adaptations')

      expect(state.features).toHaveProperty('patternAnalysis')
      expect(state.features).toHaveProperty('therapeuticMode')
      expect(state.features).toHaveProperty('accessibilityMode')
      expect(state.features).toHaveProperty('performanceAnalysis')
    })

    it('deve incluir métricas de saúde', () => {
      const state = circuitBreaker.getAdvancedState()

      expect(state.health).toHaveProperty('healthScore')
      expect(state.health).toHaveProperty('qualityScore')
      expect(state.health).toHaveProperty('qualityDegraded')
    })
  })

  describe('Verificações de Segurança Terapêutica', () => {
    it('deve bloquear execução em caso de alto estresse', async () => {
      // Mock para retornar verificação de segurança negativa
      circuitBreaker.therapeuticAnalyzer.checkExecution.mockResolvedValue({
        safe: false,
        block: true,
        requiredAdaptations: ['stress_reduction_protocol'],
        interventions: ['emergency_stress_intervention'],
      })

      mockFallbackFunction.mockResolvedValue('therapeutic_fallback')

      const result = await circuitBreaker.executeAdvanced(mockAsyncFunction, mockFallbackFunction, {
        therapeuticContext: {
          stressLevel: 0.95,
          sensoryOverloadLevel: 0.8,
        },
      })

      expect(result).toBe('therapeutic_fallback')
    })

    it('deve aplicar intervenções terapêuticas necessárias', async () => {
      const interventions = ['implement_calming_measures', 'reduce_sensory_input']

      await circuitBreaker.executeTherapeuticInterventions(interventions, {
        therapeuticContext: { userId: 'user123' },
      })

      // Verificar se as intervenções foram chamadas (logs)
      expect(circuitBreaker.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('calming measures')
      )
      expect(circuitBreaker.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('sensory input')
      )
    })
  })

  describe('Acessibilidade e Autismo', () => {
    it('deve validar compliance de acessibilidade', async () => {
      circuitBreaker.accessibilityManager.validateAccessibility.mockReturnValue({
        compliant: false,
        violations: ['high_contrast_required'],
        recommendations: ['apply_high_contrast_mode'],
      })

      const stateCheck = await circuitBreaker.advancedStateCheck({
        context: 'ui_interaction',
        accessibilityNeeds: { visual: { highContrast: true } },
      })

      expect(stateCheck.adaptations).toContain('accessibility_adaptations_required')
    })

    it('deve aplicar multiplicadores de timeout para autismo', async () => {
      const executionContext = {
        therapeuticContext: {
          sensoryOverload: true,
          communicationDifficulty: true,
          behavioralDysregulation: true,
        },
        therapeuticAnalysis: {
          timeoutMultiplier: 1.0,
        },
      }

      const timeout = await circuitBreaker.calculateAdaptiveTimeout(executionContext)

      // Deve aplicar múltiplos multiplicadores para diferentes condições
      expect(timeout).toBeGreaterThan(circuitBreaker.config.timeout * 2)
    })
  })

  describe('Limpeza e Gerenciamento de Recursos', () => {
    it('deve limpar recursos ao fazer cleanup', () => {
      circuitBreaker.cleanup()

      expect(circuitBreaker.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('cleanup completed')
      )
    })

    it('deve manter histórico dentro dos limites', async () => {
      // Gerar muitas operações para testar limpeza de histórico
      for (let i = 0; i < 150; i++) {
        mockAsyncFunction.mockResolvedValue(`result_${i}`)
        await circuitBreaker.execute(mockAsyncFunction)
      }

      expect(circuitBreaker.responseTimesHistory.length).toBeLessThanOrEqual(100)
      expect(circuitBreaker.performanceHistory.length).toBeLessThanOrEqual(200)
    })
  })
})

describe('Integração com Classes Utilitárias', () => {
  let circuitBreaker

  beforeEach(() => {
    circuitBreaker = new CircuitBreakerAdvanced({
      enablePatternAnalysis: true,
      therapeuticMode: true,
      autismFriendly: true,
    })
  })

  afterEach(() => {
    circuitBreaker.cleanup()
  })

  it('deve integrar ErrorPatternAnalyzer corretamente', () => {
    expect(circuitBreaker.patternAnalyzer).toBeDefined()
    expect(typeof circuitBreaker.patternAnalyzer.recordFailure).toBe('function')
    expect(typeof circuitBreaker.patternAnalyzer.predict).toBe('function')
  })

  it('deve integrar PerformanceAnalyzer corretamente', () => {
    expect(circuitBreaker.performanceAnalyzer).toBeDefined()
    expect(typeof circuitBreaker.performanceAnalyzer.startMonitoring).toBe('function')
    expect(typeof circuitBreaker.performanceAnalyzer.predict).toBe('function')
  })

  it('deve integrar TherapeuticAnalyzer corretamente', () => {
    expect(circuitBreaker.therapeuticAnalyzer).toBeDefined()
    expect(typeof circuitBreaker.therapeuticAnalyzer.analyze).toBe('function')
    expect(typeof circuitBreaker.therapeuticAnalyzer.checkExecution).toBe('function')
  })

  it('deve integrar AccessibilityManager corretamente', () => {
    expect(circuitBreaker.accessibilityManager).toBeDefined()
    expect(typeof circuitBreaker.accessibilityManager.applyAdaptations).toBe('function')
    expect(typeof circuitBreaker.accessibilityManager.validateAccessibility).toBe('function')
  })

  it('deve integrar HealthChecker e QualityAssessor corretamente', () => {
    expect(circuitBreaker.healthChecker).toBeDefined()
    expect(circuitBreaker.qualityAssessor).toBeDefined()
    expect(typeof circuitBreaker.healthChecker.getScore).toBe('function')
    expect(typeof circuitBreaker.qualityAssessor.assess).toBe('function')
  })
})
