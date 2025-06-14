/**
 * @file useAdvancedActivity.test.js
 * @description Testes para algoritmos avançados da Fase 1 - Portal BETTINA
 * 🧪 TESTE COMPLETO: Análise Comportamental + Função Executiva + Suporte Personalizado
 */

import { renderHook, act } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { useAdvancedActivity } from '../useAdvancedActivity'

// Mock dos contextos e utilitários
vi.mock('../../contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-1',
      profile: {
        autismLevel: 2,
        sensoryProfile: 'hypersensitive',
        preferredLearningStyle: 'visual',
        cognitiveProfile: {
          workingMemory: 0.6,
          processingSpeed: 0.4,
          attention: 0.5,
        },
      },
    },
  }),
}))

vi.mock('../useProgress', () => ({
  default: () => ({
    trackProgress: vi.fn(),
    getProgress: vi.fn(() => ({ completion: 0.75 })),
  }),
}))

// Mock dos sistemas avançados
vi.mock('../../utils/advancedSupportCalculations.js', () => ({
  default: class MockAdvancedSupportCalculator {
    constructor() {
      this.isInitialized = false
    }

    async initialize() {
      this.isInitialized = true
      return true
    }

    calculateVisualSupportLevel(preferences) {
      return {
        supportLevel: 0.7,
        recommendations: ['extended_visual_presentation_time', 'visual_focus_aids'],
        adaptations: ['slow_transitions', 'simplified_backgrounds'],
        riskFactors: ['visual_overload_risk'],
      }
    }

    calculateAuditorySupportLevel(preferences) {
      return {
        supportLevel: 0.8,
        recommendations: ['noise_reduction', 'clear_audio_cues'],
        adaptations: ['volume_control', 'audio_simplification'],
      }
    }

    calculateCognitiveSupportLevel(preferences) {
      return {
        supportLevel: 0.6,
        recommendations: ['cognitive_scaffolding', 'memory_aids'],
        adaptations: ['step_by_step_guidance', 'frequent_breaks'],
      }
    }

    calculateSensorySupportLevel(preferences) {
      return {
        supportLevel: 0.75,
        recommendations: ['sensory_breaks', 'environment_control'],
        adaptations: ['lighting_adjustment', 'texture_alternatives'],
      }
    }

    calculateAutismSupportLevel(preferences) {
      return {
        level: 2,
        description: 'Necessita suporte substancial',
        areas: ['comunicação', 'flexibilidade', 'organização'],
        interventions: ['rotinas_estruturadas', 'suporte_comunicativo', 'estrategias_cognitivas'],
      }
    }
  },
}))

// Mock do neuropedagogicalAnalyzer
vi.mock('../../utils/neuropedagogicalInsights.js', () => ({
  default: {
    isInitialized: false,
    async initialize() {
      this.isInitialized = true
      return true
    },
    extractBehavioralIndicators: vi.fn((data) => ({
      persistence: { score: 0.7, level: 'moderate' },
      frustration: { score: 0.3, level: 'low' },
      regulation: { score: 0.6, level: 'emerging_independence' },
      sensoryOverload: false,
      cognitiveLoad: 0.5,
      timestamp: new Date().toISOString(),
    })),
    assessWorkingMemory: vi.fn((data) => ({
      score: 0.6,
      level: 'adequate',
      strengths: ['sequential_processing'],
      challenges: [],
    })),
    assessCognitiveFlexibility: vi.fn((data) => ({
      score: 0.5,
      level: 'moderate',
      interventions: ['transition_warnings'],
    })),
    assessInhibitoryControl: vi.fn((data) => ({
      score: 0.7,
      level: 'adequate',
      supports: [],
    })),
    detectSensoryOverload: vi.fn(() => false),
    calculateCognitiveLoad: vi.fn(() => 0.4),
  },
}))

describe('useAdvancedActivity - Fase 1 Algoritmos', () => {
  let mockActivityId, mockConfig

  beforeEach(() => {
    mockActivityId = 'test-activity-123'
    mockConfig = {
      enableAdvancedAnalysis: true,
      enableBehavioralAnalysis: true,
      enableExecutiveFunctionAssessment: true,
      enableSupportCalculation: true,
    }
    vi.clearAllMocks()
  })

  describe('🧠 Inicialização dos Sistemas Avançados', () => {
    test('deve inicializar todos os sistemas da Fase 1', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      expect(result.current.isAdvancedSystemsReady).toBe(true)
      expect(result.current.supportCalculator).toBeDefined()
      expect(result.current.behavioralAnalyzer).toBeDefined()
    })

    test('deve configurar estados iniciais corretos', () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      expect(result.current.behavioralIndicators).toBeNull()
      expect(result.current.executiveFunctionProfile).toBeNull()
      expect(result.current.supportLevels).toBeNull()
      expect(result.current.autismSupportLevel).toBeNull()
    })
  })

  describe('🎯 Sistema de Análise Comportamental', () => {
    test('deve realizar análise comportamental avançada', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockInteractionData = {
        responses: [
          { type: 'click', timestamp: Date.now(), accuracy: 0.8, responseTime: 1200 },
          { type: 'drag', timestamp: Date.now() + 1000, accuracy: 0.6, responseTime: 2500 },
        ],
        errors: [{ type: 'timeout', timestamp: Date.now() + 2000 }],
        sessionDuration: 180000, // 3 minutos
        task: 'pattern_recognition',
      }

      await act(async () => {
        await result.current.performAdvancedBehavioralAnalysis(mockInteractionData)
      })

      expect(result.current.behavioralIndicators).toBeDefined()
      expect(result.current.behavioralIndicators.persistence).toBeDefined()
      expect(result.current.behavioralIndicators.frustration).toBeDefined()
      expect(result.current.behavioralIndicators.regulation).toBeDefined()
      expect(result.current.behavioralIndicators.sensoryOverload).toBeDefined()
    })

    test('deve detectar indicadores de sobrecarga sensorial', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockHighSensoryData = {
        responses: [
          { type: 'click', timestamp: Date.now(), accuracy: 0.3, responseTime: 4000 },
          { type: 'click', timestamp: Date.now() + 1000, accuracy: 0.2, responseTime: 5000 },
        ],
        errors: [
          { type: 'timeout', timestamp: Date.now() + 2000 },
          { type: 'incorrect', timestamp: Date.now() + 3000 },
        ],
        sessionDuration: 300000, // 5 minutos
        rapidClicks: 15,
        task: 'sensory_integration',
      }

      await act(async () => {
        await result.current.performAdvancedBehavioralAnalysis(mockHighSensoryData)
      })

      expect(result.current.behavioralIndicators.sensoryOverload.level).toBeGreaterThan(0.7)
      expect(result.current.behavioralIndicators.sensoryOverload.indicators).toContain(
        'high_error_rate'
      )
    })

    test('deve avaliar persistência específica para autismo', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockPersistenceData = {
        responses: [
          { type: 'attempt', timestamp: Date.now(), success: false, responseTime: 2000 },
          { type: 'attempt', timestamp: Date.now() + 2000, success: false, responseTime: 2500 },
          { type: 'attempt', timestamp: Date.now() + 4000, success: true, responseTime: 3000 },
        ],
        attempts: 3,
        completionTime: 180000,
        task: 'puzzle_solving',
      }

      await act(async () => {
        await result.current.performAdvancedBehavioralAnalysis(mockPersistenceData)
      })

      expect(result.current.behavioralIndicators.persistence).toBeDefined()
      expect(result.current.behavioralIndicators.persistence.level).toBeGreaterThan(0.5)
      expect(result.current.behavioralIndicators.persistence.strategies).toContain(
        'repeated_attempts'
      )
    })
  })

  describe('🧩 Sistema de Avaliação de Função Executiva', () => {
    test('deve avaliar memória de trabalho', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockWorkingMemoryData = {
        sequenceLength: 4,
        correctSequences: 6,
        totalSequences: 10,
        averageResponseTime: 1800,
        sequenceComplexity: 'medium',
        task: 'sequence_memory',
      }

      await act(async () => {
        await result.current.assessExecutiveFunction(mockWorkingMemoryData)
      })

      expect(result.current.executiveFunctionProfile).toBeDefined()
      expect(result.current.executiveFunctionProfile.workingMemory).toBeDefined()
      expect(result.current.executiveFunctionProfile.workingMemory.capacity).toBeGreaterThan(0)
    })

    test('deve avaliar flexibilidade cognitiva', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockFlexibilityData = {
        ruleChanges: 3,
        adaptationTime: [2000, 1500, 1000],
        errors: 2,
        perseverativeErrors: 1,
        task: 'card_sorting',
      }

      await act(async () => {
        await result.current.assessExecutiveFunction(mockFlexibilityData)
      })

      expect(result.current.executiveFunctionProfile.cognitiveFlexibility).toBeDefined()
      expect(
        result.current.executiveFunctionProfile.cognitiveFlexibility.adaptationScore
      ).toBeDefined()
    })

    test('deve avaliar controle inibitório', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockInhibitionData = {
        correctInhibitions: 15,
        totalInhibitions: 20,
        falseAlarms: 3,
        averageInhibitionTime: 800,
        task: 'go_no_go',
      }

      await act(async () => {
        await result.current.assessExecutiveFunction(mockInhibitionData)
      })

      expect(result.current.executiveFunctionProfile.inhibitoryControl).toBeDefined()
      expect(result.current.executiveFunctionProfile.inhibitoryControl.accuracy).toBeGreaterThan(
        0.5
      )
    })
  })

  describe('🎯 Sistema de Suporte Personalizado', () => {
    test('deve calcular níveis de suporte visual', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockVisualPreferences = {
        visualProcessingSpeed: 0.4,
        visualAttention: 0.3,
        visualMemory: 0.5,
        sensorySensitivity: 0.8,
        needsHighContrast: true,
        prefersSimpleLayouts: true,
      }

      await act(async () => {
        await result.current.calculateSupportLevels(mockVisualPreferences)
      })

      expect(result.current.supportLevels).toBeDefined()
      expect(result.current.supportLevels.visual).toBeDefined()
      expect(result.current.supportLevels.visual.supportLevel).toBeGreaterThan(0)
      expect(result.current.supportLevels.visual.recommendations).toContain(
        'extended_visual_presentation_time'
      )
    })

    test('deve calcular nível de suporte para autismo (DSM-5)', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockAutismData = {
        communicationLevel: 0.4,
        socialInteractionLevel: 0.3,
        behaviorPatternsLevel: 0.6,
        sensoryProcessingLevel: 0.2,
        adaptabilityLevel: 0.3,
      }

      await act(async () => {
        await result.current.calculateSupportLevels(mockAutismData)
      })

      expect(result.current.autismSupportLevel).toBeDefined()
      expect(result.current.autismSupportLevel.level).toBeGreaterThanOrEqual(1)
      expect(result.current.autismSupportLevel.level).toBeLessThanOrEqual(3)
      expect(result.current.autismSupportLevel.description).toBeDefined()
    })

    test('deve gerar recomendações terapêuticas personalizadas', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockTherapeuticData = {
        currentDifficulties: ['attention', 'motor_planning', 'sensory_integration'],
        strengths: ['visual_processing', 'pattern_recognition'],
        sessionPerformance: {
          accuracy: 0.65,
          engagement: 0.8,
          frustrationLevel: 0.4,
        },
      }

      await act(async () => {
        const recommendations =
          await result.current.generateTherapeuticRecommendations(mockTherapeuticData)
        expect(recommendations).toBeDefined()
        expect(Array.isArray(recommendations)).toBe(true)
        expect(recommendations.length).toBeGreaterThan(0)
      })
    })
  })

  describe('🚨 Sistema de Detecção de Intervenções Imediatas', () => {
    test('deve detectar necessidade de intervenção imediata', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockCrisisData = {
        stressLevel: 0.9,
        errorRate: 0.8,
        responseTime: 5000,
        frustrationIndicators: ['rapid_clicking', 'task_abandonment'],
        sensoryOverload: true,
      }

      await act(async () => {
        const interventions = await result.current.detectImmediateInterventions(mockCrisisData)
        expect(interventions).toBeDefined()
        expect(interventions.urgent).toBe(true)
        expect(interventions.recommendations).toContain('immediate_break')
      })
    })

    test('deve sugerir estratégias de regulação emocional', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockEmotionalData = {
        emotionalState: 'overwhelmed',
        arousalLevel: 0.8,
        selfRegulationCapacity: 0.3,
        preferredCalmingStrategies: ['deep_breathing', 'sensory_break'],
      }

      await act(async () => {
        const strategies = await result.current.suggestRegulationStrategies(mockEmotionalData)
        expect(strategies).toBeDefined()
        expect(Array.isArray(strategies)).toBe(true)
        expect(strategies.some((s) => s.type === 'calming')).toBe(true)
      })
    })
  })

  describe('📊 Integração e Relatórios', () => {
    test('deve gerar relatório completo da sessão', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      // Simular dados de uma sessão completa
      const mockSessionData = {
        behavioral: { persistence: 0.7, frustration: 0.3 },
        executive: { workingMemory: 0.6, flexibility: 0.5 },
        support: { visual: 0.8, auditory: 0.6 },
        interventions: [{ type: 'break', timestamp: Date.now() }],
      }

      await act(async () => {
        const report = await result.current.generateSessionReport(mockSessionData)
        expect(report).toBeDefined()
        expect(report.behavioral).toBeDefined()
        expect(report.executive).toBeDefined()
        expect(report.support).toBeDefined()
        expect(report.recommendations).toBeDefined()
      })
    })

    test('deve rastrear progresso longitudinal', async () => {
      const { result } = renderHook(() => useAdvancedActivity(mockActivityId, mockConfig))

      const mockHistoricalData = [
        { date: '2025-06-01', performance: 0.6 },
        { date: '2025-06-05', performance: 0.65 },
        { date: '2025-06-10', performance: 0.7 },
      ]

      await act(async () => {
        const progress = await result.current.trackLongitudinalProgress(mockHistoricalData)
        expect(progress).toBeDefined()
        expect(progress.trend).toBe('improving')
        expect(progress.improvementRate).toBeGreaterThan(0)
      })
    })
  })
})
