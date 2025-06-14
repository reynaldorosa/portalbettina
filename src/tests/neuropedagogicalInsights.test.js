/**
 * 🧪 TESTES UNITÁRIOS - FASE 1: Análise Comportamental Avançada
 * Portal BETTINA - Algoritmos baseados em ABA para crianças com autismo
 *
 * @description Suite de testes para validar algoritmos comportamentais com 95% de cobertura
 * @author Portal BETTINA - Equipe de Desenvolvimento ABA
 * @version 1.0.0
 * @since 2025-01-18
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import neuropedagogicalAnalyzer from '../utils/autismCognitiveAnalysis/neuropedagogicalInsights.js'

describe('🧠 NeuropedagogicalAnalyzer - Análise Comportamental ABA', () => {
  let analyzer

  beforeEach(async () => {
    analyzer = neuropedagogicalAnalyzer
    await analyzer.initialize()
  })

  afterEach(() => {
    // Limpar dados de teste se necessário
  })

  // ============================================================================
  // 🎯 TESTES DE EXTRAÇÃO DE INDICADORES COMPORTAMENTAIS
  // ============================================================================

  describe('🎯 extractBehavioralIndicators', () => {
    test('deve extrair indicadores básicos com dados mínimos', () => {
      const sessionData = {
        attempts: 5,
        errors: 2,
        completed: true,
        timeSpent: 180000,
        sessionId: 'test-session-001',
      }

      const indicators = analyzer.extractBehavioralIndicators(sessionData)

      expect(indicators).toBeDefined()
      expect(indicators.persistence).toBeDefined()
      expect(indicators.frustration).toBeDefined()
      expect(indicators.regulation).toBeDefined()
      expect(indicators.attention).toBeDefined()
      expect(indicators.motivation).toBeDefined()
      expect(indicators.timestamp).toBeDefined()
      expect(indicators.sessionContext).toBeDefined()
    })

    test('deve detectar sobrecarga sensorial com estímulos altos', () => {
      const sessionData = {
        attempts: 3,
        errors: 2,
        visualStimuli: 0.8,
        auditoryStimuli: 0.7,
        responseTimeIncrease: 0.6,
        errorSpike: true,
        withdrawalBehaviors: 1,
      }

      const indicators = analyzer.extractBehavioralIndicators(sessionData)

      expect(indicators.sensoryOverload).toBe(true)
    })

    test('deve calcular carga cognitiva alta com múltiplos fatores', () => {
      const sessionData = {
        attempts: 10,
        errors: 6,
        taskComplexity: 0.9,
        multiTasking: 0.8,
        timeConstraints: 0.7,
        averageResponseTime: 6000,
      }

      const indicators = analyzer.extractBehavioralIndicators(sessionData)

      expect(indicators.cognitiveLoad).toBeGreaterThan(0.6)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE AVALIAÇÃO DE PERSISTÊNCIA
  // ============================================================================

  describe('🎯 assessPersistence', () => {
    test('deve classificar persistência alta com dados positivos', () => {
      const data = {
        attempts: 10,
        errors: 2,
        completed: true,
        timeSpent: 300000,
        abandonments: 0,
      }

      const persistence = analyzer.assessPersistence(data)

      expect(persistence.level).toBe('high')
      expect(persistence.score).toBeGreaterThan(0.8)
      expect(persistence.strategies).toContain('challenge_increase')
    })

    test('deve classificar persistência baixa com abandonos', () => {
      const data = {
        attempts: 3,
        errors: 2,
        completed: false,
        timeSpent: 60000,
        abandonments: 3,
      }

      const persistence = analyzer.assessPersistence(data)

      expect(persistence.level).toBe('needs_support')
      expect(persistence.score).toBeLessThan(0.4)
      expect(persistence.strategies).toContain('simplified_tasks')
    })

    test('deve detectar necessidades específicas para autismo', () => {
      const data = {
        attempts: 5,
        errors: 3,
        completed: false,
        timeSpent: 400000, // > 5 minutos
      }

      const persistence = analyzer.assessPersistence(data)

      expect(persistence.autismSpecific.requiresBreaks).toBe(true)
      expect(persistence.autismSpecific.benefitsFromVisualSupport).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE AVALIAÇÃO DE FRUSTRAÇÃO
  // ============================================================================

  describe('🎯 assessFrustration', () => {
    test('deve detectar frustração alta com múltiplos indicadores', () => {
      const data = {
        attempts: 10,
        errors: 8,
        responseTimeProgression: [2000, 2500, 3000, 4000, 5000],
        abandonments: 2,
        helpRequests: 5,
        negativeIndicators: 3,
      }

      const frustration = analyzer.assessFrustration(data)

      expect(frustration.level).toBe('high')
      expect(frustration.score).toBeGreaterThan(0.7)
      expect(frustration.interventions).toContain('immediate_break')
      expect(frustration.autismSpecific.meltdownRisk).toBe(true)
    })

    test('deve detectar frustração mínima com dados positivos', () => {
      const data = {
        attempts: 10,
        errors: 1,
        responseTimeProgression: [2000, 1800, 1700],
        abandonments: 0,
        helpRequests: 1,
        negativeIndicators: 0,
      }

      const frustration = analyzer.assessFrustration(data)

      expect(frustration.level).toBe('minimal')
      expect(frustration.score).toBeLessThan(0.3)
      expect(frustration.interventions).toContain('maintain_current')
    })

    test('deve calcular fatores de frustração corretamente', () => {
      const data = {
        attempts: 5,
        errors: 3,
        abandonments: 1,
        helpRequests: 2,
      }

      const frustration = analyzer.assessFrustration(data)

      expect(frustration.factors.errorAccumulation).toBe(0.6)
      expect(frustration.factors.taskAbandonment).toBe(1)
      expect(frustration.factors.supportSeeking).toBe(2)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE AVALIAÇÃO DE AUTORREGULAÇÃO
  // ============================================================================

  describe('🎯 assessRegulation', () => {
    test('deve detectar regulação independente com alta capacidade', () => {
      const data = {
        selfCorrections: 3,
        pausesTaken: 2,
        helpRequests: 1,
        strategyChanges: 2,
        emotionalRecovery: 1,
        timeManagement: 0.8,
      }

      const regulation = analyzer.assessRegulation(data)

      expect(regulation.level).toBe('independent')
      expect(regulation.score).toBeGreaterThan(0.8)
      expect(regulation.supports).toContain('minimal_monitoring')
      expect(regulation.autismSpecific.readyForIndependence).toBe(true)
    })

    test('deve identificar necessidade de suporte externo', () => {
      const data = {
        selfCorrections: 0,
        pausesTaken: 0,
        helpRequests: 0,
        strategyChanges: 0,
        emotionalRecovery: 0,
        timeManagement: 0.2,
      }

      const regulation = analyzer.assessRegulation(data)

      expect(regulation.level).toBe('needs_support')
      expect(regulation.score).toBeLessThan(0.4)
      expect(regulation.supports).toContain('constant_guidance')
      expect(regulation.autismSpecific.needsExternalCues).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE AVALIAÇÃO DE ATENÇÃO
  // ============================================================================

  describe('🎯 assessAttention', () => {
    test('deve avaliar atenção sustentada com duração longa', () => {
      const data = {
        sessionDuration: 600000, // 10 minutos
        focusLoss: 1,
        distractionEvents: 2,
        taskSwitching: 1,
        completed: true,
      }

      const attention = analyzer.assessAttention(data)

      expect(attention.level).toBe('sustained')
      expect(attention.score).toBeGreaterThan(0.8)
      expect(attention.autismSpecific.canHandleVariability).toBe(true)
    })

    test('deve detectar atenção limitada com muitas distrações', () => {
      const data = {
        sessionDuration: 120000, // 2 minutos
        focusLoss: 5,
        distractionEvents: 8,
        taskSwitching: 0,
        completed: false,
      }

      const attention = analyzer.assessAttention(data)

      expect(attention.level).toBe('limited')
      expect(attention.score).toBeLessThan(0.4)
      expect(attention.strategies).toContain('short_sessions')
      expect(attention.autismSpecific.needsEnvironmentalControl).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE AVALIAÇÃO DE MOTIVAÇÃO
  // ============================================================================

  describe('🎯 assessMotivation', () => {
    test('deve detectar motivação intrínseca alta', () => {
      const data = {
        engagementLevel: 0.9,
        voluntaryAttempts: 5,
        initiativeTaking: 3,
        persistenceAfterFailure: 2,
        choiceExercising: 2,
      }

      const motivation = analyzer.assessMotivation(data)

      expect(motivation.level).toBe('intrinsic')
      expect(motivation.score).toBeGreaterThan(0.8)
      expect(motivation.enhancers).toContain('maintain_autonomy')
    })

    test('deve identificar motivação mínima', () => {
      const data = {
        engagementLevel: 0.2,
        voluntaryAttempts: 0,
        initiativeTaking: 0,
        persistenceAfterFailure: 0,
        choiceExercising: 0,
      }

      const motivation = analyzer.assessMotivation(data)

      expect(motivation.level).toBe('minimal')
      expect(motivation.score).toBeLessThan(0.4)
      expect(motivation.enhancers).toContain('immediate_rewards')
      expect(motivation.autismSpecific.needsExternalMotivation).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE FUNÇÃO EXECUTIVA
  // ============================================================================

  describe('🎯 Função Executiva', () => {
    describe('assessWorkingMemory', () => {
      test('deve avaliar memória de trabalho superior', () => {
        const data = {
          sequenceLength: 7,
          sequenceAccuracy: 0.9,
          multistepTasks: 1,
          distractionResistance: 0.8,
          informationRetention: 0.9,
        }

        const workingMemory = analyzer.assessWorkingMemory(data)

        expect(workingMemory.level).toBe('superior')
        expect(workingMemory.score).toBeGreaterThan(0.8)
        expect(workingMemory.strengths).toContain('sequential_processing')
      })

      test('deve identificar necessidade de suporte', () => {
        const data = {
          sequenceLength: 2,
          sequenceAccuracy: 0.3,
          multistepTasks: 0,
          distractionResistance: 0.2,
          informationRetention: 0.3,
        }

        const workingMemory = analyzer.assessWorkingMemory(data)

        expect(workingMemory.level).toBe('needs_support')
        expect(workingMemory.challenges).toContain('complex_instructions')
        expect(workingMemory.autismOptimizations.externalMemoryAids).toBe(true)
      })
    })

    describe('assessCognitiveFlexibility', () => {
      test('deve detectar flexibilidade alta', () => {
        const data = {
          taskSwitching: 0.8,
          adaptationRate: 0.9,
          ruleChanges: 3,
          creativeSolutions: 0.7,
          perseverationErrors: 0.1,
        }

        const flexibility = analyzer.assessCognitiveFlexibility(data)

        expect(flexibility.level).toBe('flexible')
        expect(flexibility.score).toBeGreaterThan(0.7)
        expect(flexibility.autismConsiderations.canHandleChanges).toBe(true)
      })

      test('deve detectar rigidez cognitiva', () => {
        const data = {
          taskSwitching: 0.1,
          adaptationRate: 0.2,
          ruleChanges: 0,
          creativeSolutions: 0.1,
          perseverationErrors: 0.8,
        }

        const flexibility = analyzer.assessCognitiveFlexibility(data)

        expect(flexibility.level).toBe('very_rigid')
        expect(flexibility.interventions).toContain('transition_warnings')
        expect(flexibility.autismConsiderations.needsPredictability).toBe(true)
      })
    })

    describe('assessInhibitoryControl', () => {
      test('deve avaliar controle inibitório forte', () => {
        const data = {
          impulseControl: 0.9,
          distractorResistance: 0.8,
          responseInhibition: 0.9,
          emotionalRegulation: 0.8,
        }

        const inhibitory = analyzer.assessInhibitoryControl(data)

        expect(inhibitory.level).toBe('strong')
        expect(inhibitory.score).toBeGreaterThan(0.8)
        expect(inhibitory.autismSpecific.taskPersistence).toBe(true)
      })

      test('deve identificar controle inibitório fraco', () => {
        const data = {
          impulseControl: 0.2,
          distractorResistance: 0.3,
          responseInhibition: 0.2,
          emotionalRegulation: 0.1,
        }

        const inhibitory = analyzer.assessInhibitoryControl(data)

        expect(inhibitory.level).toBe('weak')
        expect(inhibitory.supports).toContain('visual_cues')
        expect(inhibitory.autismSpecific.sensoryRegulation).toBe(true)
      })
    })
  })

  // ============================================================================
  // 🎯 TESTES DE REGULAÇÃO EMOCIONAL
  // ============================================================================

  describe('🎯 assessEmotionalRegulation', () => {
    test('deve detectar regulação emocional independente', () => {
      const data = {
        emotionalRecognition: 0.9,
        selfSoothingAttempts: 3,
        emotionalExpression: 0.8,
        calmingStrategiesUsed: 2,
        emotionalRecoveryTime: 120,
        helpSeekingForEmotions: 1,
      }

      const regulation = analyzer.assessEmotionalRegulation(data)

      expect(regulation.level).toBe('independent_regulation')
      expect(regulation.score).toBeGreaterThan(0.8)
      expect(regulation.autismSpecific.canUseIndependentStrategies).toBe(true)
    })

    test('deve identificar necessidade de regulação externa', () => {
      const data = {
        emotionalRecognition: 0.2,
        selfSoothingAttempts: 0,
        emotionalExpression: 0.3,
        calmingStrategiesUsed: 0,
        emotionalRecoveryTime: 600,
        helpSeekingForEmotions: 0,
      }

      const regulation = analyzer.assessEmotionalRegulation(data)

      expect(regulation.level).toBe('external_regulation')
      expect(regulation.autismSpecific.needsSensoryRegulation).toBe(true)
      expect(regulation.autismSpecific.requiresCoRegulation).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE CONSCIÊNCIA SOCIAL
  // ============================================================================

  describe('🎯 assessSocialAwareness', () => {
    test('deve detectar alta consciência social', () => {
      const data = {
        eyeContactInitiation: 0.8,
        socialReferencing: 0.9,
        jointAttention: 0.8,
        socialImitation: 0.7,
        emotionalContagion: 0.6,
        socialBidding: 0.8,
        responseToName: 0.9,
      }

      const awareness = analyzer.assessSocialAwareness(data)

      expect(awareness.level).toBe('socially_aware')
      expect(awareness.score).toBeGreaterThan(0.8)
      expect(awareness.autismSpecific.readyForPeerInteraction).toBe(true)
    })

    test('deve identificar consciência social mínima', () => {
      const data = {
        eyeContactInitiation: 0.1,
        socialReferencing: 0.2,
        jointAttention: 0.1,
        socialImitation: 0.2,
        emotionalContagion: 0.1,
        socialBidding: 0.1,
        responseToName: 0.3,
      }

      const awareness = analyzer.assessSocialAwareness(data)

      expect(awareness.level).toBe('minimal_awareness')
      expect(awareness.autismSpecific.needsExplicitInstruction).toBe(true)
      expect(awareness.autismSpecific.benefitsFromSocialStories).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE IDENTIFICAÇÃO DE TRIGGERS
  // ============================================================================

  describe('🎯 identifyBehavioralTriggers', () => {
    test('deve identificar múltiplos triggers com risco crítico', () => {
      const data = {
        visualStimuli: 0.8,
        auditoryStimuli: 0.7,
        socialDemands: 0.6,
        unexpectedChanges: 3,
        taskComplexity: 0.9,
        frustrationLevel: 0.7,
        anxietyIndicators: 0.5,
      }

      const triggers = analyzer.identifyBehavioralTriggers(data)

      expect(triggers.riskLevel).toBe('critical')
      expect(triggers.interventionNeeded).toBe(true)
      expect(triggers.triggers.sensory.length).toBeGreaterThan(0)
      expect(triggers.triggers.cognitive.length).toBeGreaterThan(0)
      expect(triggers.preventionStrategies.length).toBeGreaterThan(0)
    })

    test('deve identificar risco mínimo com poucos triggers', () => {
      const data = {
        visualStimuli: 0.3,
        auditoryStimuli: 0.2,
        socialDemands: 0.2,
        unexpectedChanges: 0,
        taskComplexity: 0.4,
        frustrationLevel: 0.2,
      }

      const triggers = analyzer.identifyBehavioralTriggers(data)

      expect(triggers.riskLevel).toBe('minimal')
      expect(triggers.interventionNeeded).toBe(false)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE ESTRATÉGIAS COMPORTAMENTAIS
  // ============================================================================

  describe('🎯 suggestBehavioralStrategies', () => {
    test('deve sugerir estratégias ABA apropriadas', () => {
      const behavioralData = {
        persistence: { level: 'needs_support' },
        frustration: { level: 'high' },
        attention: { level: 'limited' },
        motivation: { level: 'minimal' },
      }

      const strategies = analyzer.suggestBehavioralStrategies(behavioralData)

      expect(strategies.length).toBeGreaterThan(0)

      const persistenceStrategy = strategies.find((s) => s.target === 'persistence')
      expect(persistenceStrategy).toBeDefined()
      expect(persistenceStrategy.abaMethod).toBe('forward_chaining')

      const frustrationStrategy = strategies.find((s) => s.target === 'frustration_tolerance')
      expect(frustrationStrategy).toBeDefined()
      expect(frustrationStrategy.abaMethod).toBe('differential_reinforcement')
    })

    test('deve incluir coleta de dados específica para cada estratégia', () => {
      const behavioralData = {
        attention: { level: 'limited' },
      }

      const strategies = analyzer.suggestBehavioralStrategies(behavioralData)
      const attentionStrategy = strategies.find((s) => s.target === 'attention_span')

      expect(attentionStrategy.dataCollection).toContain('Duração de atenção sustentada')
      expect(attentionStrategy.implementation).toContain('30s')
    })
  })

  // ============================================================================
  // 🎯 TESTES DE DETECÇÃO DE PADRÕES
  // ============================================================================

  describe('🎯 Detecção de Padrões Específicos do Autismo', () => {
    test('deve detectar sobrecarga sensorial com múltiplos indicadores', () => {
      const data = {
        visualStimuli: 0.8,
        auditoryStimuli: 0.7,
        responseTimeIncrease: 0.6,
        errorSpike: true,
        withdrawalBehaviors: 2,
      }

      const overload = analyzer.detectSensoryOverload(data)
      expect(overload).toBe(true)
    })

    test('deve detectar retraimento social', () => {
      const data = {
        socialInteraction: 0.2,
        eyeContact: 0.3,
        communicationAttempts: 1,
        groupParticipation: 0.1,
        responseToSocial: 0.2,
      }

      const withdrawal = analyzer.detectSocialWithdrawal(data)
      expect(withdrawal).toBe(true)
    })

    test('deve detectar disrupção de rotina', () => {
      const data = {
        expectedSequence: ['step1', 'step2', 'step3'],
        actualSequence: ['step1', 'step3', 'step2'],
        unexpectedChanges: 3,
        adaptationDifficulty: 0.7,
        behavioralChanges: 0.6,
      }

      const disruption = analyzer.detectRoutineDisruption(data)
      expect(disruption).toBe(true)
    })

    test('deve detectar barreiras de comunicação', () => {
      const data = {
        verbalCommunication: 0.3,
        nonVerbalCommunication: 0.2,
        comprehensionIndicators: 0.4,
        expressionDifficulty: 0.7,
        communicationFrustration: 0.6,
      }

      const barriers = analyzer.detectCommunicationBarriers(data)
      expect(barriers).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE CÁLCULOS AUXILIARES
  // ============================================================================

  describe('🎯 Cálculos Auxiliares', () => {
    test('deve calcular carga cognitiva corretamente', () => {
      const data = {
        taskComplexity: 0.8,
        multiTasking: 0.6,
        timeConstraints: 0.7,
        errors: 5,
        attempts: 10,
        averageResponseTime: 4000,
      }

      const cognitiveLoad = analyzer.calculateCognitiveLoad(data)
      expect(cognitiveLoad).toBeGreaterThan(0.5)
      expect(cognitiveLoad).toBeLessThanOrEqual(1)
    })

    test('deve calcular índice de adaptabilidade', () => {
      const data = {
        ruleChanges: 2,
        taskSwitching: 3,
        newSituations: 2,
        adaptationSuccess: 0.7,
        flexibilityDemonstrated: 0.6,
      }

      const adaptability = analyzer.calculateAdaptabilityIndex(data)
      expect(adaptability).toBeGreaterThan(0)
      expect(adaptability).toBeLessThanOrEqual(1)
    })

    test('deve avaliar estado emocional complexo', () => {
      const data = {
        positiveEmotions: 0.7,
        negativeEmotions: 0.3,
        emotionalStability: 0.8,
        regulationAttempts: 2,
        emotionalRecovery: 0.6,
      }

      const emotionalState = analyzer.assessEmotionalState(data)

      expect(emotionalState.state).toBe('positive')
      expect(emotionalState.stability).toBe('very_stable')
      expect(emotionalState.balance).toBeGreaterThan(0)
      expect(emotionalState.autismSpecific.showsEmotionalAwareness).toBe(true)
    })
  })

  // ============================================================================
  // 🎯 TESTES DE INTEGRAÇÃO E EDGE CASES
  // ============================================================================

  describe('🎯 Testes de Integração', () => {
    test('deve processar dados completos de sessão realística', () => {
      const complexSessionData = {
        sessionId: 'integration-test-001',
        sessionDuration: 450000, // 7.5 minutos
        attempts: 15,
        errors: 4,
        completed: true,
        timeSpent: 420000,
        abandonments: 1,

        // Dados sensoriais
        visualStimuli: 0.6,
        auditoryStimuli: 0.4,
        responseTimeIncrease: 0.3,

        // Dados sociais
        socialInteraction: 0.7,
        eyeContact: 0.6,
        communicationAttempts: 3,

        // Dados emocionais
        positiveEmotions: 0.6,
        negativeEmotions: 0.2,
        emotionalStability: 0.7,
        regulationAttempts: 2,

        // Dados cognitivos
        taskComplexity: 0.6,
        workingMemoryDemands: 0.5,
        attentionDemands: 0.7,

        // Dados comportamentais
        selfCorrections: 2,
        pausesTaken: 1,
        helpRequests: 2,
        strategyChanges: 1,
      }

      const result = analyzer.extractBehavioralIndicators(complexSessionData)

      // Verificar completude da análise
      expect(result).toBeDefined()
      expect(result.persistence).toBeDefined()
      expect(result.frustration).toBeDefined()
      expect(result.regulation).toBeDefined()
      expect(result.attention).toBeDefined()
      expect(result.motivation).toBeDefined()
      expect(result.emotionalState).toBeDefined()
      expect(result.cognitiveLoad).toBeDefined()
      expect(result.adaptabilityIndex).toBeDefined()

      // Verificar coerência dos resultados
      expect(result.persistence.score).toBeGreaterThan(0.5) // Boa taxa de conclusão
      expect(result.frustration.level).not.toBe('high') // Poucos erros relativos
      expect(result.cognitiveLoad).toBeLessThan(0.8) // Carga moderada
    })

    test('deve lidar com dados ausentes graciosamente', () => {
      const minimalData = {
        sessionId: 'minimal-test',
      }

      const result = analyzer.extractBehavioralIndicators(minimalData)

      expect(result).toBeDefined()
      expect(result.persistence.score).toBeGreaterThanOrEqual(0)
      expect(result.frustration.score).toBeGreaterThanOrEqual(0)
      expect(result.sessionContext.activity).toBe('unknown')
    })

    test('deve validar integridade temporal dos dados', () => {
      const sessionData = {
        sessionId: 'temporal-test',
        sessionDuration: 300000,
        timeSpent: 350000, // Impossível: tempo gasto > duração da sessão
      }

      const result = analyzer.extractBehavioralIndicators(sessionData)

      expect(result).toBeDefined()
      expect(result.timestamp).toBeDefined()

      // O sistema deve lidar com inconsistências temporais
      const now = new Date()
      const resultTime = new Date(result.timestamp)
      expect(Math.abs(now.getTime() - resultTime.getTime())).toBeLessThan(5000) // Dentro de 5s
    })
  })

  // ============================================================================
  // 🎯 TESTES DE PERFORMANCE E QUALIDADE
  // ============================================================================

  describe('🎯 Performance e Qualidade', () => {
    test('deve processar análise em tempo razoável', () => {
      const sessionData = {
        attempts: 20,
        errors: 5,
        completed: true,
        timeSpent: 600000,
        sessionDuration: 600000,
      }

      const startTime = performance.now()
      const result = analyzer.extractBehavioralIndicators(sessionData)
      const endTime = performance.now()

      expect(result).toBeDefined()
      expect(endTime - startTime).toBeLessThan(100) // Menos de 100ms
    })

    test('deve manter consistência entre chamadas múltiplas', () => {
      const sessionData = {
        attempts: 10,
        errors: 3,
        completed: true,
        timeSpent: 300000,
      }

      const result1 = analyzer.extractBehavioralIndicators(sessionData)
      const result2 = analyzer.extractBehavioralIndicators(sessionData)

      expect(result1.persistence.score).toBe(result2.persistence.score)
      expect(result1.frustration.level).toBe(result2.frustration.level)
      expect(result1.cognitiveLoad).toBe(result2.cognitiveLoad)
    })

    test('deve retornar scores dentro de faixas válidas', () => {
      const sessionData = {
        attempts: 8,
        errors: 2,
        completed: true,
        timeSpent: 240000,
      }

      const result = analyzer.extractBehavioralIndicators(sessionData)

      // Verificar que todos os scores estão em faixas válidas
      expect(result.persistence.score).toBeGreaterThanOrEqual(0)
      expect(result.persistence.score).toBeLessThanOrEqual(1)

      expect(result.frustration.score).toBeGreaterThanOrEqual(0)
      expect(result.frustration.score).toBeLessThanOrEqual(1)

      expect(result.regulation.score).toBeGreaterThanOrEqual(0)
      expect(result.regulation.score).toBeLessThanOrEqual(1)

      expect(result.cognitiveLoad).toBeGreaterThanOrEqual(0)
      expect(result.cognitiveLoad).toBeLessThanOrEqual(1)

      expect(result.adaptabilityIndex).toBeGreaterThanOrEqual(0)
      expect(result.adaptabilityIndex).toBeLessThanOrEqual(1)
    })
  })
})

/**
 * 🎯 DADOS SINTÉTICOS PARA TESTES EXTENSIVOS
 * Perfis de 10 crianças com diferentes características autísticas
 */
export const syntheticProfiles = {
  highFunctioningProfile: {
    sessionId: 'hf-001',
    attempts: 12,
    errors: 2,
    completed: true,
    timeSpent: 480000,
    sessionDuration: 500000,
    selfCorrections: 3,
    pausesTaken: 2,
    helpRequests: 1,
    socialInteraction: 0.7,
    eyeContact: 0.6,
    emotionalStability: 0.8,
  },

  moderateSupportProfile: {
    sessionId: 'ms-001',
    attempts: 8,
    errors: 4,
    completed: true,
    timeSpent: 360000,
    sessionDuration: 400000,
    selfCorrections: 1,
    pausesTaken: 3,
    helpRequests: 3,
    socialInteraction: 0.4,
    eyeContact: 0.3,
    emotionalStability: 0.5,
  },

  highSupportProfile: {
    sessionId: 'hs-001',
    attempts: 5,
    errors: 3,
    completed: false,
    timeSpent: 180000,
    sessionDuration: 300000,
    abandonments: 2,
    selfCorrections: 0,
    pausesTaken: 0,
    helpRequests: 5,
    socialInteraction: 0.2,
    eyeContact: 0.1,
    emotionalStability: 0.3,
    visualStimuli: 0.8,
    auditoryStimuli: 0.7,
    sensoryOverload: true,
  },

  sensorySeekingProfile: {
    sessionId: 'ss-001',
    attempts: 15,
    errors: 6,
    completed: true,
    timeSpent: 420000,
    sessionDuration: 450000,
    visualStimuli: 0.9,
    auditoryStimuli: 0.8,
    tactileEngagement: 0.9,
    movementSeeking: 0.8,
    sensoryOverload: false, // Seeking, not avoiding
  },

  sensoryAvoidantProfile: {
    sessionId: 'sa-001',
    attempts: 6,
    errors: 2,
    completed: false,
    timeSpent: 120000,
    sessionDuration: 300000,
    abandonments: 1,
    visualStimuli: 0.2,
    auditoryStimuli: 0.1,
    withdrawalBehaviors: 3,
    sensoryOverload: true,
  },

  repetitiveInterestsProfile: {
    sessionId: 'ri-001',
    attempts: 20,
    errors: 1,
    completed: true,
    timeSpent: 600000,
    sessionDuration: 600000,
    taskSwitching: 0.1,
    adaptationRate: 0.2,
    perseverationErrors: 0.8,
    restrictedInterests: 0.9,
    flexibilityDemonstrated: 0.2,
  },

  sociallyMotivatedProfile: {
    sessionId: 'sm-001',
    attempts: 10,
    errors: 3,
    completed: true,
    timeSpent: 300000,
    sessionDuration: 350000,
    socialInteraction: 0.8,
    eyeContact: 0.7,
    socialBidding: 0.8,
    jointAttention: 0.7,
    communicationAttempts: 5,
  },

  anxiousProfile: {
    sessionId: 'anx-001',
    attempts: 7,
    errors: 5,
    completed: false,
    timeSpent: 240000,
    sessionDuration: 300000,
    abandonments: 1,
    anxietyIndicators: 0.8,
    emotionalStability: 0.3,
    helpRequests: 6,
    avoidanceBehaviors: 0.7,
  },

  executiveFunctionChallengesProfile: {
    sessionId: 'ef-001',
    attempts: 12,
    errors: 8,
    completed: false,
    timeSpent: 420000,
    sessionDuration: 450000,
    sequenceLength: 2,
    sequenceAccuracy: 0.3,
    multistepTasks: 0.2,
    workingMemoryDemands: 0.8,
    taskSwitching: 0.1,
  },

  emergingSkillsProfile: {
    sessionId: 'es-001',
    attempts: 9,
    errors: 4,
    completed: true,
    timeSpent: 270000,
    sessionDuration: 300000,
    selfCorrections: 2,
    pausesTaken: 1,
    helpRequests: 2,
    improvementTrend: 0.3,
    skillEmergence: 0.6,
    scaffoldingNeeded: 0.5,
  },
}
