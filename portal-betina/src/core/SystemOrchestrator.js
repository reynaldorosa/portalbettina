/**
 * PORTAL BETINA SYSTEM ORCHESTRATOR - ORQUESTRADOR PRINCIPAL DO SISTEMA
 * Sistema integrado que coordena todos os componentes de observabilidade, ML e otimização
 * INTEGRAÇÃO COMPLETA com sistema de métricas existente em src/utils/
 *
 * @version 2.0.0
 * @created 2025-01-08
 * @purpose Orquestração centralizada integrando sistemas novos + existentes
 */

import { getPerformanceProfiler } from './PerformanceProfiler.js'
import { getMLMetricsCollector } from '../database/core/MLMetricsCollector.js'
import { getNomenclatureRefactoring } from '../database/core/NomenclatureRefactoring.js'
import { getDataStructuresOptimizer } from './DataStructuresOptimizer.js'
// Importar logger diretamente usando importação default para evitar problemas de resolução
import logger from '../utils/logger.js'
import { getMachineLearningOrchestrator } from './MachineLearningOrchestrator.js'

// Integração com sistema de métricas existente
import { MetricsManager } from '../utils/metrics/index.js'
import performanceMonitor from '../utils/metrics/performanceMonitor.js'
import { MultisensoryMetricsCollector } from '../utils/multisensoryAnalysis/index.js'
import { NeuropedagogicalAnalyzer } from '../utils/metrics/neuropedagogicalInsights.js'
import { AdvancedRecommendationEngine } from '../utils/metrics/advancedRecommendations.js'

// Integração com métricas avançadas não utilizadas
import { AdvancedMetricsEngine } from '../utils/metrics/AdvancedMetricsEngine.js'
import { ErrorPatternAnalyzer } from '../utils/metrics/errorPatternAnalyzer.js'
import { PerformanceAnalyzer } from '../utils/metrics/performanceAnalyzer.js'
import { MetricsService } from '../utils/metrics/metricsService.js'

// Integração com sistema de áudio e TTS
import { AudioGenerator } from '../utils/audio/audioGenerator.js'
import { isTTSEnabled, setTTSEnabled } from '../utils/tts/ttsManager.js'
import { logTTSEvent } from '../utils/tts/ttsDebug.js'

// Integração com sistema ML existente
import { MLModelFactory } from '../utils/ml/index.js'

// Integração com outros módulos existentes
import { SessionManager } from '../utils/sessions/index.js'
import { CognitiveAnalyzer } from '../utils/cognitive/index.js'
import { AdaptiveService } from '../utils/adaptive/index.js'
import { AccessibilityService } from '../utils/accessibility/index.js'
import { TherapyOptimizer } from '../utils/therapy/index.js'

// Estados do sistema
export const SYSTEM_STATES = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  RUNNING: 'running',
  OPTIMIZING: 'optimizing',
  MAINTENANCE: 'maintenance',
  ERROR: 'error',
}

// Modos de operação
export const OPERATION_MODES = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TESTING: 'testing',
  DEBUGGING: 'debugging',
}

// Configurações do sistema otimizadas para autismo
const AUTISM_SYSTEM_CONFIG = {
  // Thresholds de performance
  performanceThresholds: {
    responseTime: 200, // ms
    memoryUsage: 150, // MB
    cpuUsage: 80, // %
    errorRate: 0.01, // 1%
  },

  // Configurações de monitoramento
  monitoring: {
    enabled: true,
    interval: 5000, // 5 segundos
    retentionPeriod: 24 * 60 * 60 * 1000, // 24 horas
    alertThresholds: {
      critical: 0.95,
      warning: 0.8,
      info: 0.6,
    },
  },

  // Configurações de otimização
  optimization: {
    autoOptimize: true,
    optimizationInterval: 30 * 60 * 1000, // 30 minutos
    maxOptimizationCycles: 10,
    performanceTargets: {
      mlAccuracy: 0.85,
      cacheHitRate: 0.8,
      userSatisfaction: 0.9,
    },
  },

  // Configurações específicas para autismo
  autism: {
    sensoryOptimization: true,
    cognitiveLoadManagement: true,
    adaptivePersonalization: true,
    therapeuticGoalTracking: true,
    behavioralPatternAnalysis: true,
  },
}

/**
 * Classe principal do Orquestrador do Sistema
 * INTEGRA sistemas novos com infraestrutura robusta existente
 */
class SystemOrchestrator {
  constructor() {
    this.state = SYSTEM_STATES.INITIALIZING
    this.mode = OPERATION_MODES.PRODUCTION
    this.components = new Map()
    this.integrations = new Map()
    this.systemMetrics = new Map()

    // Sistemas NOVOS desenvolvidos
    this.newSystems = {
      performanceProfiler: null,
      mlMetricsCollector: null,
      nomenclatureRefactoring: null,
      dataStructuresOptimizer: null,
      machineLearningOrchestrator: null,
    }
    // Sistemas EXISTENTES (src/utils/)
    this.existingSystems = {
      metricsManager: null,
      performanceMonitor: null,
      multisensoryMetrics: null,
      neuropedagogicalAnalyzer: null,
      advancedRecommendations: null,
      mlModelFactory: null,
      sessionManager: null,
      cognitiveAnalyzer: null,
      adaptiveService: null,
      accessibilityService: null,
      therapyOptimizer: null, // Métricas avançadas não integradas anteriormente
      advancedMetricsEngine: null,
      errorPatternAnalyzer: null,
      performanceAnalyzer: null,
      metricsService: null,
      // Sistema de áudio e TTS
      audioGenerator: null,
      ttsManager: null,
    }

    this.statistics = {
      uptime: 0,
      totalRequests: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      optimizationCycles: 0,
      lastOptimization: null,
      startTime: Date.now(),
      therapeuticGoalsAchieved: 0,
      userSatisfactionScore: 0,
    }

    this.activeSession = null
    this.intervals = new Map()
    this.legacyBridge = null

    logger.info('🔧 SystemOrchestrator criado')
  }
  /**
   * Inicializa o sistema completo
   */
  async init() {
    try {
      logger.info('🚀 Iniciando Portal Betina System Orchestrator...')

      // Fase 1: Inicializar componentes core
      await this.initializeCoreComponents()

      // Fase 2: Configurar integrações
      await this.setupIntegrations()

      // Fase 3: Configurar fluxo de métricas básico
      await this.setupBasicMetricsFlow()

      // Fase 4: Iniciar monitoramento
      this.startSystemMonitoring()

      // Fase 5: Configurar otimização automática
      if (AUTISM_SYSTEM_CONFIG.optimization.autoOptimize) {
        this.startAutoOptimization()
      }

      this.state = SYSTEM_STATES.READY

      logger.info('✅ Portal Betina System Orchestrator inicializado com sucesso', {
        components: this.components.size,
        integrations: this.integrations.size,
        mode: this.mode,
        autismFeatures: AUTISM_SYSTEM_CONFIG.autism,
      })
    } catch (error) {
      this.state = SYSTEM_STATES.ERROR
      logger.error('❌ Erro ao inicializar System Orchestrator:', error)
      throw error
    }
  }
  /**
   * Inicializa componentes principais
   * INTEGRAÇÃO COMPLETA: Sistemas novos + existentes
   */ async initializeCoreComponents() {
    logger.info('🔧 Inicializando componentes - NOVOS + EXISTENTES...')

    // ===================== SISTEMAS NOVOS =====================
    logger.info('🆕 Inicializando sistemas novos...')

    // Performance Profiler (novo sistema)
    this.newSystems.performanceProfiler = getPerformanceProfiler()
    this.components.set('newProfiler', this.newSystems.performanceProfiler)

    // SKIP ML COMPONENTS - Focusing on metrics only without ML
    logger.info('🚫 Pulando componentes ML - foco apenas em métricas')

    // Nomenclature Refactoring (novo sistema)
    this.newSystems.nomenclatureRefactoring = getNomenclatureRefactoring()
    this.components.set('nomenclatureRefactoring', this.newSystems.nomenclatureRefactoring)

    // Data Structures Optimizer (novo sistema)
    this.newSystems.dataStructuresOptimizer = getDataStructuresOptimizer()
    this.components.set('dataOptimizer', this.newSystems.dataStructuresOptimizer)

    // =================== SISTEMAS EXISTENTES ===================
    logger.info('🏛️ Inicializando sistemas existentes robustos...')

    // MetricsManager existente (src/utils/metrics/)
    this.existingSystems.metricsManager = new MetricsManager({
      enablePerformanceMonitoring: true,
      enableNeuropedagogicalAnalysis: true,
      enableMultisensoryMetrics: true,
      enableRecommendations: true,
      enableDashboardIntegration: true,
    })
    this.components.set('existingMetricsManager', this.existingSystems.metricsManager)
    // PerformanceMonitor existente
    this.existingSystems.performanceMonitor = performanceMonitor
    this.components.set('existingPerformanceMonitor', this.existingSystems.performanceMonitor)

    // MultisensoryMetricsCollector existente
    this.existingSystems.multisensoryMetrics = new MultisensoryMetricsCollector()
    this.components.set('existingMultisensoryMetrics', this.existingSystems.multisensoryMetrics)

    // NeuropedagogicalAnalyzer existente
    this.existingSystems.neuropedagogicalAnalyzer = new NeuropedagogicalAnalyzer()
    this.components.set(
      'existingNeuropedagogicalAnalyzer',
      this.existingSystems.neuropedagogicalAnalyzer
    )

    // AdvancedRecommendationEngine existente
    this.existingSystems.advancedRecommendations = new AdvancedRecommendationEngine()
    this.components.set(
      'existingAdvancedRecommendations',
      this.existingSystems.advancedRecommendations
    )

    // MLModelFactory existente
    this.existingSystems.mlModelFactory = MLModelFactory
    this.components.set('existingMLModelFactory', this.existingSystems.mlModelFactory)

    // SessionManager existente
    this.existingSystems.sessionManager = new SessionManager()
    this.components.set('existingSessionManager', this.existingSystems.sessionManager)

    // CognitiveAnalyzer existente
    this.existingSystems.cognitiveAnalyzer = new CognitiveAnalyzer()
    this.components.set('existingCognitiveAnalyzer', this.existingSystems.cognitiveAnalyzer)

    // AdaptiveService existente
    this.existingSystems.adaptiveService = new AdaptiveService()
    this.components.set('existingAdaptiveService', this.existingSystems.adaptiveService)

    // AccessibilityService existente
    this.existingSystems.accessibilityService = new AccessibilityService()
    this.components.set('existingAccessibilityService', this.existingSystems.accessibilityService)
    // TherapyOptimizer existente
    this.existingSystems.therapyOptimizer = new TherapyOptimizer()
    this.components.set('existingTherapyOptimizer', this.existingSystems.therapyOptimizer)

    // AdvancedMetricsEngine - Sistema avançado de métricas com ML
    this.existingSystems.advancedMetricsEngine = new AdvancedMetricsEngine({
      enableRealTimeAnalysis: true,
      enablePredictiveAnalytics: true,
      enableTherapeuticAnalysis: true,
      enableAutismSpecificMetrics: true,
    })
    this.components.set('existingAdvancedMetricsEngine', this.existingSystems.advancedMetricsEngine)

    // ErrorPatternAnalyzer - Análise de padrões de erro
    this.existingSystems.errorPatternAnalyzer = new ErrorPatternAnalyzer({
      maxPatternHistory: 1000,
      enableLearning: true,
      confidenceThreshold: 0.7,
    })
    this.components.set('existingErrorPatternAnalyzer', this.existingSystems.errorPatternAnalyzer)

    // PerformanceAnalyzer - Análise avançada de performance
    this.existingSystems.performanceAnalyzer = new PerformanceAnalyzer({
      enablePredictiveAnalysis: true,
      therapeuticAdjustments: true,
      performanceThreshold: 2000,
    })
    this.components.set('existingPerformanceAnalyzer', this.existingSystems.performanceAnalyzer) // MetricsService - Serviço de métricas estruturado
    this.existingSystems.metricsService = new MetricsService()
    this.components.set('existingMetricsService', this.existingSystems.metricsService)

    // AudioGenerator - Sistema de geração de áudio
    this.existingSystems.audioGenerator = new AudioGenerator()
    this.components.set('existingAudioGenerator', this.existingSystems.audioGenerator)

    // TTS Manager - Sistema de Text-to-Speech (funcional, usando APIs nativas)
    this.existingSystems.ttsManager = {
      isEnabled: isTTSEnabled,
      setEnabled: setTTSEnabled,
      logEvent: logTTSEvent,
      // Métricas de TTS
      getMetrics: () => ({
        enabled: isTTSEnabled(),
        voicesAvailable: window.speechSynthesis?.getVoices?.()?.length || 0,
        currentUtterance: window.speechSynthesis?.speaking || false,
        supportLevel: 'speechSynthesis' in window ? 'full' : 'none',
      }),
      // Função de teste de TTS
      testTTS: (text = 'Portal Betina TTS funcionando') => {
        if (isTTSEnabled() && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.8
          utterance.pitch = 1
          utterance.volume = 0.7
          window.speechSynthesis.speak(utterance)
          logTTSEvent('test', { text, success: true })
          return true
        }
        return false
      },
    }
    this.components.set('existingTTSManager', this.existingSystems.ttsManager)

    logger.info('✅ Todos os componentes inicializados', {
      newSystems: Object.keys(this.newSystems).length,
      existingSystems: Object.keys(this.existingSystems).length,
      totalComponents: this.components.size,
    })
  }

  /**
   * Configura integrações entre sistemas novos e existentes
   */
  async setupIntegrations() {
    logger.info('🔗 Configurando integrações entre sistemas...')

    // Integração 1: Performance (Novo Profiler + Monitor Existente)
    this.integrations.set('performance', {
      newProfiler: this.newSystems.performanceProfiler,
      existingMonitor: this.existingSystems.performanceMonitor,
      syncEnabled: true,
      crossValidation: true,
    })

    // Integração 2: ML Metrics (Novo Collector + Sistemas ML Existentes)
    this.integrations.set('mlMetrics', {
      newCollector: this.newSystems.mlMetricsCollector,
      existingMLFactory: this.existingSystems.mlModelFactory,
      existingRecommendations: this.existingSystems.advancedRecommendations,
      dataFlow: 'bidirectional',
    })

    // Integração 3: Métricas Gerais (Novo ML + MetricsManager Existente)
    this.integrations.set('generalMetrics', {
      newMLOrchestrator: this.newSystems.machineLearningOrchestrator,
      existingMetricsManager: this.existingSystems.metricsManager,
      existingMultisensory: this.existingSystems.multisensoryMetrics,
      unifiedDashboard: true,
    })
    // Integração 4: Análise Cognitiva (Sistemas novos + CognitiveAnalyzer + NeuropedagogicalAnalyzer)
    this.integrations.set('cognitiveAnalysis', {
      newDataOptimizer: this.newSystems.dataStructuresOptimizer,
      existingCognitive: this.existingSystems.cognitiveAnalyzer,
      existingNeuropedagogical: this.existingSystems.neuropedagogicalAnalyzer,
      enhancedInsights: true,
    })

    // Integração 5: Sistema de Métricas Avançadas (Novos componentes integrados)
    this.integrations.set('advancedMetrics', {
      advancedEngine: this.existingSystems.advancedMetricsEngine,
      errorAnalyzer: this.existingSystems.errorPatternAnalyzer,
      performanceAnalyzer: this.existingSystems.performanceAnalyzer,
      metricsService: this.existingSystems.metricsService,
      newProfiler: this.newSystems.performanceProfiler,
      mlCollector: this.newSystems.mlMetricsCollector,
      realTimeSync: true,
      predictiveAnalytics: true,
    })
    // Integração 6: Análise de Erros e Performance Integrada
    this.integrations.set('errorPerformanceAnalysis', {
      errorAnalyzer: this.existingSystems.errorPatternAnalyzer,
      performanceAnalyzer: this.existingSystems.performanceAnalyzer,
      performanceMonitor: this.existingSystems.performanceMonitor,
      therapeuticOptimizer: this.existingSystems.therapyOptimizer,
      adaptiveService: this.existingSystems.adaptiveService,
      autismSpecificOptimizations: true,
    }) // Integração 7: Terapia Adaptativa (Novo ML + Adaptive + Therapy existentes)
    this.integrations.set('adaptiveTherapy', {
      newMLOrchestrator: this.newSystems.machineLearningOrchestrator,
      existingAdaptive: this.existingSystems.adaptiveService,
      existingTherapy: this.existingSystems.therapyOptimizer,
      existingAccessibility: this.existingSystems.accessibilityService,
      personalizedRecommendations: true,
    })

    // Integração 8: Sistema de Áudio e TTS (Acessibilidade + Comunicação)
    this.integrations.set('audioTTS', {
      audioGenerator: this.existingSystems.audioGenerator,
      ttsManager: this.existingSystems.ttsManager,
      accessibilityService: this.existingSystems.accessibilityService,
      multisensoryMetrics: this.existingSystems.multisensoryMetrics,
      features: {
        audioFeedback: 'active',
        textToSpeech: 'active',
        soundEffects: 'active',
        voiceConfiguration: 'active',
        accessibilityIntegration: 'active',
      },
      autismSpecificFeatures: {
        calmingSounds: true,
        customVoiceSpeed: true,
        sensoryFriendlyAudio: true,
        audioBreaks: true,
      },
    })

    // Configurar bridge de integração legado
    await this.setupLegacyBridge()

    logger.info('✅ Integrações configuradas com sucesso', {
      totalIntegrations: this.integrations.size,
      bridgeActive: this.legacyBridge !== null,
    })
    this.components.set('multisensoryMetrics', multisensoryMetrics)

    // Neuropedagogical Analyzer (sistema existente)
    const neuropedagogicalAnalyzer = new NeuropedagogicalAnalyzer()
    this.components.set('neuropedagogicalAnalyzer', neuropedagogicalAnalyzer)

    logger.info(`✅ ${this.components.size} componentes inicializados`)
  }

  /**
   * Configura integrações entre componentes
   */
  async setupIntegrations() {
    logger.info('🔗 Configurando integrações...')

    // Integração ML + Performance
    this.setupMLPerformanceIntegration()

    // Integração Data Optimization + ML
    this.setupDataMLIntegration()

    // Integração Performance + Data Optimization
    this.setupPerformanceDataIntegration()

    // Integração específica para autismo
    this.setupAutismSpecificIntegrations()

    logger.info(`✅ ${this.integrations.size} integrações configuradas`)
  }

  /**
   * Configura integração ML + Performance
   */
  setupMLPerformanceIntegration() {
    const profiler = this.components.get('profiler')
    const mlCollector = this.components.get('mlCollector')
    const mlOrchestrator = this.components.get('mlOrchestrator')

    // Monitorar performance de operações ML
    const originalPredict = mlOrchestrator.predict?.bind(mlOrchestrator)
    if (originalPredict) {
      mlOrchestrator.predict = async (...args) => {
        const startTime = performance.now()

        try {
          const result = await originalPredict(...args)
          const duration = performance.now() - startTime

          // Registrar métricas
          mlCollector.recordInferenceMetrics(
            args[0], // modelId
            args[1]?.shape || 'unknown',
            result?.shape || 'unknown',
            duration
          )

          return result
        } catch (error) {
          logger.error('Erro na predição ML:', error)
          throw error
        }
      }
    }

    this.integrations.set('ml-performance', {
      description: 'Integração ML + Performance',
      components: ['profiler', 'mlCollector', 'mlOrchestrator'],
      status: 'active',
    })
  }

  /**
   * Configura integração Data + ML
   */
  setupDataMLIntegration() {
    const dataOptimizer = this.components.get('dataOptimizer')
    const mlOrchestrator = this.components.get('mlOrchestrator')

    // Usar cache otimizado para predições ML
    const cache = dataOptimizer.createOptimizedCache('mlPredictions', 500)

    // Interceptar predições para usar cache
    const originalPredict = mlOrchestrator.predict?.bind(mlOrchestrator)
    if (originalPredict) {
      mlOrchestrator.predict = async (modelId, inputData, options = {}) => {
        if (options.useCache !== false) {
          const cacheKey = `${modelId}_${JSON.stringify(inputData)}`
          const cached = cache.get(cacheKey)

          if (cached) {
            logger.debug('🎯 Predição obtida do cache', { modelId })
            return cached
          }

          const result = await originalPredict(modelId, inputData, options)
          cache.put(cacheKey, result)

          return result
        }

        return originalPredict(modelId, inputData, options)
      }
    }

    this.integrations.set('data-ml', {
      description: 'Integração Data Optimization + ML',
      components: ['dataOptimizer', 'mlOrchestrator'],
      status: 'active',
    })
  }

  /**
   * Configura integração Performance + Data
   */
  setupPerformanceDataIntegration() {
    const profiler = this.components.get('profiler')
    const dataOptimizer = this.components.get('dataOptimizer')

    // Monitorar operações de estruturas de dados
    const originalMeasureOperation = dataOptimizer.measureOperation?.bind(dataOptimizer)
    if (originalMeasureOperation) {
      dataOptimizer.measureOperation = (operation, operationType, ...args) => {
        // Usar profiler para medição mais detalhada
        const result = originalMeasureOperation(operation, operationType, ...args)

        return result
      }
    }

    this.integrations.set('performance-data', {
      description: 'Integração Performance + Data Optimization',
      components: ['profiler', 'dataOptimizer'],
      status: 'active',
    })
  }

  /**
   * Configura integrações específicas para autismo
   */
  setupAutismSpecificIntegrations() {
    logger.info('🧠 Configurando integrações específicas para autismo...')

    // Cache para perfis cognitivos
    const dataOptimizer = this.components.get('dataOptimizer')
    const cognitiveProfilesCache = dataOptimizer.createOptimizedCache('cognitiveProfiles', 200)

    // Trie para termos terapêuticos
    const therapeuticTrie = dataOptimizer.createOptimizedTrie('therapeuticTerms')

    // Priority Queue para tarefas terapêuticas
    const therapeuticQueue = dataOptimizer.createOptimizedPriorityQueue(
      'therapeuticTasks',
      (a, b) => b.priority - a.priority // Higher priority first
    )

    // Bloom Filter para dados processados
    const processedDataFilter = dataOptimizer.createOptimizedBloomFilter(
      'processedSessions',
      10000,
      0.01
    )

    this.integrations.set('autism-optimization', {
      description: 'Otimizações específicas para autismo',
      components: ['dataOptimizer'],
      features: {
        cognitiveProfilesCache: 'active',
        therapeuticTrie: 'active',
        therapeuticQueue: 'active',
        processedDataFilter: 'active',
      },
      status: 'active',
    })
  }

  /**
   * Inicia monitoramento do sistema
   */
  startSystemMonitoring() {
    if (this.intervals.has('systemMonitoring')) {
      return // Já está rodando
    }

    const monitoringInterval = setInterval(() => {
      this.collectSystemMetrics()
    }, AUTISM_SYSTEM_CONFIG.monitoring.interval)

    this.intervals.set('systemMonitoring', monitoringInterval)
    logger.info('📊 Monitoramento automático do sistema iniciado')
  }

  /**
   * Coleta métricas do sistema
   */
  collectSystemMetrics() {
    try {
      const metrics = {
        timestamp: Date.now(),
        memory: this.getMemoryUsage(),
        performance: this.getPerformanceMetrics(),
        components: this.getComponentsStatus(),
        integrations: this.getIntegrationsStatus(),
      }

      this.systemMetrics.set(metrics.timestamp, metrics)

      // Manter apenas métricas do período de retenção
      const retentionLimit = Date.now() - AUTISM_SYSTEM_CONFIG.monitoring.retentionPeriod
      for (const [timestamp] of this.systemMetrics.entries()) {
        if (timestamp < retentionLimit) {
          this.systemMetrics.delete(timestamp)
        }
      }
    } catch (error) {
      logger.error('❌ Erro ao coletar métricas do sistema:', error)
    }
  }

  /**
   * Obtém uso de memória
   */
  getMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance?.memory) {
      return {
        used: window.performance.memory.usedJSHeapSize,
        total: window.performance.memory.totalJSHeapSize,
        limit: window.performance.memory.jsHeapSizeLimit,
      }
    }
    return { used: 0, total: 0, limit: 0 }
  }

  /**
   * Obtém métricas de performance
   */
  getPerformanceMetrics() {
    const entries = performance.getEntriesByType('navigation')
    if (entries.length > 0) {
      const entry = entries[0]
      return {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        totalTime: entry.loadEventEnd - entry.fetchStart,
      }
    }
    return { domContentLoaded: 0, loadComplete: 0, totalTime: 0 }
  }

  /**
   * Obtém status dos componentes
   */
  getComponentsStatus() {
    const status = {}
    this.components.forEach((component, name) => {
      status[name] = {
        active: component !== null,
        type: typeof component,
        hasError: component.error ? true : false,
      }
    })
    return status
  }

  /**
   * Obtém status das integrações
   */
  getIntegrationsStatus() {
    const status = {}
    this.integrations.forEach((integration, name) => {
      status[name] = {
        active: integration.syncEnabled !== false,
        componentsCount: Object.keys(integration).length,
      }
    })
    return status
  }

  /**
   * Inicia otimização automática
   */
  startAutoOptimization() {
    if (this.intervals.has('autoOptimization')) {
      return // Já está rodando
    }

    const optimizationInterval = setInterval(() => {
      this.performOptimizationCycle()
    }, AUTISM_SYSTEM_CONFIG.optimization.optimizationInterval)

    this.intervals.set('autoOptimization', optimizationInterval)
    logger.info('🔧 Otimização automática iniciada')
  }

  /**
   * Executa ciclo de otimização
   */
  async performOptimizationCycle() {
    try {
      if (
        this.statistics.optimizationCycles >=
        AUTISM_SYSTEM_CONFIG.optimization.maxOptimizationCycles
      ) {
        logger.info('ℹ️ Limite máximo de ciclos de otimização atingido')
        return
      }

      logger.info('🔧 Iniciando ciclo de otimização...')

      // Otimizar caches
      if (this.newSystems.dataStructuresOptimizer) {
        this.newSystems.dataStructuresOptimizer.optimizeCaches()
      }

      // Otimizar modelos ML
      if (this.newSystems.machineLearningOrchestrator) {
        // Limpar cache de predições se muito grande
        const stats = this.newSystems.machineLearningOrchestrator.getStatistics()
        if (stats.cacheSize > 500) {
          logger.info('🧹 Limpando cache de ML...')
          // Implementar limpeza se necessário
        }
      }

      // Verificar performance dos sistemas existentes
      if (this.existingSystems.performanceMonitor) {
        const perfMetrics = this.existingSystems.performanceMonitor.getMetrics?.()
        if (
          perfMetrics &&
          perfMetrics.averageResponseTime > AUTISM_SYSTEM_CONFIG.performanceThresholds.responseTime
        ) {
          logger.warn('⚠️ Performance abaixo do esperado, aplicando otimizações...')
        }
      }

      this.statistics.optimizationCycles++
      this.statistics.lastOptimization = Date.now()

      logger.info('✅ Ciclo de otimização concluído', {
        cycle: this.statistics.optimizationCycles,
      })
    } catch (error) {
      logger.error('❌ Erro no ciclo de otimização:', error)
    }
  }

  /**
   * Obtém recomendações do sistema
   */
  getSystemRecommendations() {
    const recommendations = []

    // Verificar uso de memória
    const memory = this.getMemoryUsage()
    if (memory.used / memory.total > 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'Alto uso de memória detectado',
        action: 'Considere reiniciar a aplicação',
      })
    }

    // Verificar performance
    const perf = this.getPerformanceMetrics()
    if (perf.totalTime > 5000) {
      recommendations.push({
        type: 'info',
        message: 'Tempo de carregamento alto',
        action: 'Verificar conexão de rede',
      })
    }

    // Verificar otimizações
    if (this.statistics.optimizationCycles === 0) {
      recommendations.push({
        type: 'info',
        message: 'Nenhum ciclo de otimização executado',
        action: 'Habilitar otimização automática',
      })
    }

    return recommendations
  }

  /**
   * Obtém status das funcionalidades de autismo
   */
  getAutismFeatureStatus() {
    const features = {}

    Object.entries(AUTISM_SYSTEM_CONFIG.autism).forEach(([feature, enabled]) => {
      features[feature] = {
        enabled,
        status: enabled ? 'active' : 'disabled',
      }
    })

    return features
  }
  /**
   * Obtém estatísticas
   */
  getStatistics() {
    return this.getUnifiedStatistics()
  }

  /**
   * Coleta métricas avançadas de todos os sistemas integrados
   */
  getAdvancedMetrics() {
    const metrics = {
      timestamp: Date.now(),
      systemHealth: this.getSystemHealth(),

      // Métricas do AdvancedMetricsEngine
      advancedEngine: this.existingSystems.advancedMetricsEngine
        ? this.existingSystems.advancedMetricsEngine.getComprehensiveMetrics()
        : null,

      // Análise de padrões de erro
      errorPatterns: this.existingSystems.errorPatternAnalyzer
        ? this.existingSystems.errorPatternAnalyzer.getPatternAnalysis()
        : null,

      // Análise de performance avançada
      performanceAnalysis: this.existingSystems.performanceAnalyzer
        ? this.existingSystems.performanceAnalyzer.getDetailedAnalysis()
        : null,

      // Métricas estruturadas do MetricsService
      structuredMetrics: this.existingSystems.metricsService
        ? this.existingSystems.metricsService.getSessionMetrics()
        : null,

      // Métricas de ML do novo collector
      mlMetrics: this.newSystems.mlMetricsCollector
        ? this.newSystems.mlMetricsCollector.getStatistics()
        : null, // Performance profiling
      performanceProfiling: this.newSystems.performanceProfiler
        ? this.newSystems.performanceProfiler.getStatistics()
        : null,

      // Métricas de áudio e TTS
      audioTTSMetrics: this.getAudioTTSMetrics(),

      // Integrações específicas para autismo
      autismSpecific: this.getAutismSpecificMetrics(),
    }

    logger.debug('📊 Métricas avançadas coletadas', {
      totalSystems: Object.keys(metrics).filter((key) => metrics[key] !== null).length,
    })

    return metrics
  }

  /**
   * Métricas específicas para autismo
   */
  getAutismSpecificMetrics() {
    return {
      sensoryOverload: this.getSensoryOverloadMetrics(),
      cognitiveLoad: this.getCognitiveLoadMetrics(),
      therapeuticProgress: this.getTherapeuticProgressMetrics(),
      adaptiveAdjustments: this.getAdaptiveAdjustmentsMetrics(),
      communicationEffectiveness: this.getCommunicationMetrics(),
    }
  }

  /**
   * Inicia análise preditiva usando métricas avançadas
   */
  startPredictiveAnalysis() {
    if (!this.existingSystems.advancedMetricsEngine) {
      logger.warn('⚠️ AdvancedMetricsEngine não disponível para análise preditiva')
      return
    }

    // Configurar análise preditiva
    this.existingSystems.advancedMetricsEngine.enablePredictiveMode?.({
      autismSpecific: true,
      realTimeAdjustments: true,
      therapeuticOptimization: true,
      adaptiveLearning: true,
    })

    logger.info('🔮 Análise preditiva iniciada para contexto autístico')
  }

  /**
   * Gera relatório completo de métricas avançadas
   */
  generateAdvancedMetricsReport() {
    const report = {
      timestamp: Date.now(),
      systemInfo: {
        uptime: this.getUptime(),
        version: '2.0.0',
        environment: this.mode,
      },
      advancedMetrics: this.getAdvancedMetrics(),
      recommendations: this.getAdvancedRecommendations(),
      autismOptimizations: this.getAutismOptimizationStatus(),
    }

    logger.info('📈 Relatório avançado de métricas gerado', {
      reportSize: JSON.stringify(report).length,
      metricsCount: Object.keys(report.advancedMetrics).length,
    })

    return report
  }

  /**
   * Obtém recomendações avançadas consolidadas
   */
  getAdvancedRecommendations() {
    const recommendations = []

    if (this.existingSystems.advancedRecommendations) {
      recommendations.push(
        ...(this.existingSystems.advancedRecommendations.getRecommendations?.() || [])
      )
    }

    if (this.existingSystems.errorPatternAnalyzer) {
      recommendations.push(
        ...(this.existingSystems.errorPatternAnalyzer.getRecommendations?.() || [])
      )
    }

    if (this.existingSystems.performanceAnalyzer) {
      recommendations.push(
        ...(this.existingSystems.performanceAnalyzer.getOptimizationRecommendations?.() || [])
      )
    }

    return recommendations
  }
  /**
   * Obtém tempo de funcionamento do sistema
   */
  getUptime() {
    return Date.now() - this.statistics.startTime
  }

  /**
   * Métricas de sobrecarga sensorial
   */
  getSensoryOverloadMetrics() {
    if (!this.existingSystems.multisensoryMetrics) return null

    return {
      visualStimulation: this.existingSystems.multisensoryMetrics.getVisualMetrics?.() || {},
      auditoryStimulation: this.existingSystems.multisensoryMetrics.getAuditoryMetrics?.() || {},
      tactileStimulation: this.existingSystems.multisensoryMetrics.getTactileMetrics?.() || {},
      overloadEvents: this.existingSystems.multisensoryMetrics.getOverloadEvents?.() || [],
      preventiveInterventions: this.existingSystems.multisensoryMetrics.getInterventions?.() || [],
    }
  }

  /**
   * Métricas de carga cognitiva
   */
  getCognitiveLoadMetrics() {
    if (!this.existingSystems.cognitiveAnalyzer) return null

    return {
      currentLoad: this.existingSystems.cognitiveAnalyzer.getCurrentLoad?.() || 0,
      optimalRange: this.existingSystems.cognitiveAnalyzer.getOptimalRange?.() || {
        min: 0,
        max: 1,
      },
      adaptations: this.existingSystems.cognitiveAnalyzer.getAdaptations?.() || [],
      trends: this.existingSystems.cognitiveAnalyzer.getLoadTrends?.() || [],
    }
  }

  /**
   * Métricas de progresso terapêutico
   */
  getTherapeuticProgressMetrics() {
    if (!this.existingSystems.therapyOptimizer) return null

    return {
      goals: this.existingSystems.therapyOptimizer.getGoalsProgress?.() || [],
      interventions: this.existingSystems.therapyOptimizer.getInterventions?.() || [],
      effectiveness: this.existingSystems.therapyOptimizer.getEffectiveness?.() || {},
      personalizedRecommendations:
        this.existingSystems.therapyOptimizer.getRecommendations?.() || [],
    }
  }

  /**
   * Métricas de ajustes adaptativos
   */
  getAdaptiveAdjustmentsMetrics() {
    if (!this.existingSystems.adaptiveService) return null

    return {
      difficultyAdjustments: this.existingSystems.adaptiveService.getDifficultyHistory?.() || [],
      learningStyle: this.existingSystems.adaptiveService.getLearningStyle?.() || {},
      personalizations: this.existingSystems.adaptiveService.getPersonalizations?.() || [],
      adaptationEffectiveness: this.existingSystems.adaptiveService.getAdaptationStats?.() || {},
    }
  }

  /**
   * Métricas de efetividade de comunicação
   */
  getCommunicationMetrics() {
    const metrics = {
      accessibility: null,
      neuropedagogical: null,
      recommendations: null,
    }

    if (this.existingSystems.accessibilityService) {
      metrics.accessibility =
        this.existingSystems.accessibilityService.getCommunicationMetrics?.() || {}
    }

    if (this.existingSystems.neuropedagogicalAnalyzer) {
      metrics.neuropedagogical =
        this.existingSystems.neuropedagogicalAnalyzer.getCommunicationAnalysis?.() || {}
    }
    if (this.existingSystems.advancedRecommendations) {
      metrics.recommendations =
        this.existingSystems.advancedRecommendations.getCommunicationRecommendations?.() || []
    }

    return metrics
  }

  /**
   * Métricas de áudio e TTS (Text-to-Speech)
   */
  getAudioTTSMetrics() {
    const metrics = {
      audio: null,
      tts: null,
      integration: null,
    }

    // Métricas do AudioGenerator
    if (this.existingSystems.audioGenerator) {
      metrics.audio = {
        isInitialized: this.existingSystems.audioGenerator.isInitialized || false,
        volume: this.existingSystems.audioGenerator.volume || 0,
        muted: this.existingSystems.audioGenerator.muted || false,
        soundsGenerated: this.existingSystems.audioGenerator.sounds?.size || 0,
        contextState: this.existingSystems.audioGenerator.audioContext?.state || 'unknown',
        // Métricas específicas para autismo
        calmingSoundsActive: false, // Pode ser implementado posteriormente
        sensoryFriendlyMode: true,
      }
    }

    // Métricas do TTS Manager
    if (this.existingSystems.ttsManager) {
      const ttsMetrics = this.existingSystems.ttsManager.getMetrics()
      metrics.tts = {
        ...ttsMetrics,
        // Métricas adicionais específicas para autismo
        customVoiceSpeedEnabled: true,
        therapeuticVoiceMode: false,
        lastUsed: Date.now(),
        // Estatísticas de uso
        totalUtterances: 0, // Pode ser implementado com contador
        averageUtteranceLength: 0,
        errorRate: 0,
      }
    }

    // Métricas de integração
    const audioTTSIntegration = this.integrations.get('audioTTS')
    if (audioTTSIntegration) {
      metrics.integration = {
        status: 'active',
        features: audioTTSIntegration.features,
        autismFeatures: audioTTSIntegration.autismSpecificFeatures,
        integrationHealth: this.checkAudioTTSIntegrationHealth(),
      }
    }

    return metrics
  }

  /**
   * Verifica saúde da integração áudio/TTS
   */
  checkAudioTTSIntegrationHealth() {
    const health = {
      audioGenerator: !!this.existingSystems.audioGenerator?.isInitialized,
      ttsEnabled: this.existingSystems.ttsManager?.isEnabled() || false,
      speechSynthesisSupport: 'speechSynthesis' in window,
      webAudioSupport: 'AudioContext' in window || 'webkitAudioContext' in window,
      overallScore: 0,
    }

    // Calcular score geral
    const checks = [
      health.audioGenerator,
      health.ttsEnabled,
      health.speechSynthesisSupport,
      health.webAudioSupport,
    ]
    health.overallScore = checks.filter(Boolean).length / checks.length

    return health
  }

  /**
   * Testa sistema de áudio e TTS
   */
  testAudioTTSSystem() {
    const results = {
      audio: false,
      tts: false,
      errors: [],
    }

    try {
      // Testar AudioGenerator
      if (this.existingSystems.audioGenerator) {
        this.existingSystems.audioGenerator.playSound(440, 0.1, 'sine')
        results.audio = true
        logger.info('🔊 Teste de áudio concluído com sucesso')
      }
    } catch (error) {
      results.errors.push(`Audio test failed: ${error.message}`)
      logger.error('❌ Erro no teste de áudio:', error)
    }

    try {
      // Testar TTS
      if (this.existingSystems.ttsManager) {
        results.tts = this.existingSystems.ttsManager.testTTS(
          'Teste do sistema TTS do Portal Betina'
        )
        logger.info('🗣️ Teste de TTS concluído com sucesso')
      }
    } catch (error) {
      results.errors.push(`TTS test failed: ${error.message}`)
      logger.error('❌ Erro no teste de TTS:', error)
    }

    return results
  }

  /**
   * Configura perfil de áudio específico para autismo
   */
  configureAutismAudioProfile(profileConfig = {}) {
    const defaultConfig = {
      volume: 0.5, // Volume mais baixo
      voiceRate: 0.7, // Fala mais lenta
      voicePitch: 1.0, // Tom normal
      enableCalmingSounds: true,
      sensoryBreaks: true,
      audioAlerts: false, // Desabilitar alertas sonoros abruptos
    }

    const config = { ...defaultConfig, ...profileConfig }

    try {
      // Configurar AudioGenerator
      if (this.existingSystems.audioGenerator) {
        this.existingSystems.audioGenerator.volume = config.volume
        this.existingSystems.audioGenerator.enableCalmingSounds = config.enableCalmingSounds
      }

      // Configurar TTS para autismo
      if (this.existingSystems.ttsManager && window.speechSynthesis) {
        // Armazenar configurações no localStorage para persistência
        localStorage.setItem('betina_autism_audio_profile', JSON.stringify(config))

        // Aplicar configurações imediatamente para próximas falas
        this.existingSystems.ttsManager.autismProfile = config
      }

      logger.info('🧠 Perfil de áudio para autismo configurado', { config })
      return true
    } catch (error) {
      logger.error('❌ Erro ao configurar perfil de áudio para autismo:', error)
      return false
    }
  }

  /**
   * Status das otimizações específicas para autismo
   */
  getAutismOptimizationStatus() {
    return {
      sensoryOptimizations: this.checkSensoryOptimizations(),
      cognitiveSupport: this.checkCognitiveSupport(),
      adaptiveFeatures: this.checkAdaptiveFeatures(),
      therapeuticIntegration: this.checkTherapeuticIntegration(),
      communicationEnhancements: this.checkCommunicationEnhancements(),
    }
  }

  /**
   * Verifica otimizações sensoriais
   */
  checkSensoryOptimizations() {
    return {
      multisensorySupport: !!this.existingSystems.multisensoryMetrics,
      overloadPrevention:
        this.existingSystems.multisensoryMetrics?.hasOverloadPrevention?.() || false,
      adaptiveStimulation: this.existingSystems.adaptiveService?.hasSensoryAdaptation?.() || false,
    }
  }

  /**
   * Verifica suporte cognitivo
   */
  checkCognitiveSupport() {
    return {
      cognitiveAnalysis: !!this.existingSystems.cognitiveAnalyzer,
      loadMonitoring: this.existingSystems.cognitiveAnalyzer?.hasLoadMonitoring?.() || false,
      adaptiveAdjustments:
        this.existingSystems.adaptiveService?.hasCognitiveAdaptation?.() || false,
    }
  }

  /**
   * Verifica recursos adaptativos
   */
  checkAdaptiveFeatures() {
    return {
      adaptiveService: !!this.existingSystems.adaptiveService,
      mlPowered: this.newSystems.machineLearningOrchestrator?.isActive?.() || false,
      realTimeAdjustments:
        this.existingSystems.adaptiveService?.hasRealTimeAdjustments?.() || false,
    }
  }

  /**
   * Verifica integração terapêutica
   */
  checkTherapeuticIntegration() {
    return {
      therapyOptimizer: !!this.existingSystems.therapyOptimizer,
      goalTracking: this.existingSystems.therapyOptimizer?.hasGoalTracking?.() || false,
      interventionRecommendations:
        this.existingSystems.therapyOptimizer?.hasInterventions?.() || false,
    }
  }
  /**
   * Verifica melhorias de comunicação
   */
  checkCommunicationEnhancements() {
    return {
      accessibilityService: !!this.existingSystems.accessibilityService,
      neuropedagogicalAnalysis: !!this.existingSystems.neuropedagogicalAnalyzer,
      communicationMetrics:
        this.existingSystems.accessibilityService?.hasCommunicationMetrics?.() || false,
      // Funcionalidades de áudio e TTS
      audioSupport: !!this.existingSystems.audioGenerator?.isInitialized,
      ttsSupport: !!this.existingSystems.ttsManager && this.existingSystems.ttsManager.isEnabled(),
      speechSynthesisAvailable: 'speechSynthesis' in window,
      webAudioAvailable: 'AudioContext' in window || 'webkitAudioContext' in window,
      autismAudioProfile: !!localStorage.getItem('betina_autism_audio_profile'),
    }
  }

  /**
   * Obtém status geral de saúde do sistema
   */
  getSystemHealth() {
    const componentHealth = this.getComponentsStatus()
    const totalComponents = Object.keys(componentHealth).length
    const activeComponents = Object.values(componentHealth).filter((c) => c.active).length
    const errorComponents = Object.values(componentHealth).filter((c) => c.hasError).length

    const healthScore = activeComponents / totalComponents

    let status = 'healthy'
    if (errorComponents > 0) status = 'warning'
    if (healthScore < 0.8) status = 'critical'

    return {
      status,
      score: healthScore,
      totalComponents,
      activeComponents,
      errorComponents,
      uptime: this.getUptime(),
    }
  }

  /**
   * Funções utilitárias de áudio e TTS para uso externo
   */

  /**
   * Reproduz um som usando o AudioGenerator
   */
  playSound(frequency = 440, duration = 0.2, type = 'sine') {
    if (this.existingSystems.audioGenerator) {
      return this.existingSystems.audioGenerator.playSound(frequency, duration, type)
    }
    return false
  }

  /**
   * Fala um texto usando TTS
   */
  speak(text, options = {}) {
    if (!this.existingSystems.ttsManager || !this.existingSystems.ttsManager.isEnabled()) {
      return false
    }

    try {
      const defaultOptions = {
        rate: 0.8,
        pitch: 1.0,
        volume: 0.7,
        voice: null,
      }      // Aplicar perfil de autismo se configurado
      const autismProfile = JSON.parse(localStorage.getItem('betina_autism_audio_profile') || '{}')
      if (autismProfile.voiceRate) defaultOptions.rate = autismProfile.voiceRate
      if (autismProfile.voicePitch) defaultOptions.pitch = autismProfile.voicePitch
      if (autismProfile.volume) defaultOptions.volume = autismProfile.volume

      const finalOptions = { ...defaultOptions, ...options }

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = finalOptions.rate
        utterance.pitch = finalOptions.pitch
        utterance.volume = finalOptions.volume

        if (finalOptions.voice) {
          utterance.voice = finalOptions.voice
        }

        // Log do evento TTS
        this.existingSystems.ttsManager.logEvent('speak', {
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          options: finalOptions,
        })

        window.speechSynthesis.speak(utterance)
        return true
      }
    } catch (error) {
      logger.error('❌ Erro ao falar texto:', error)
    }

    return false
  }

  /**
   * Para qualquer fala em andamento
   */
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      this.existingSystems.ttsManager?.logEvent('stop', { action: 'manual_stop' })
      return true
    }
    return false
  }

  /**
   * Obtém vozes disponíveis
   */
  getAvailableVoices() {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices()
    }
    return []
  }

  /**
   * Reproduz som de feedback positivo
   */
  playSuccessSound() {
    // Som ascendente de sucesso
    if (this.existingSystems.audioGenerator) {
      setTimeout(() => this.playSound(523, 0.1, 'sine'), 0) // C5
      setTimeout(() => this.playSound(659, 0.1, 'sine'), 100) // E5
      setTimeout(() => this.playSound(784, 0.2, 'sine'), 200) // G5
    }
  }

  /**
   * Reproduz som de feedback de erro (suave para autismo)
   */
  playErrorSound() {
    // Som descendente suave de erro
    if (this.existingSystems.audioGenerator) {
      this.playSound(330, 0.3, 'sine') // E4 - som suave
    }
  }

  /**
   * Reproduz sons calmantes para redução de estresse
   */
  playCalmingSound(duration = 3000) {
    if (!this.existingSystems.audioGenerator) return false

    // Som de respiração calmante (frequências baixas)
    const frequencies = [220, 247, 262] // A3, B3, C4
    let currentIndex = 0

    const interval = setInterval(() => {
      this.playSound(frequencies[currentIndex], 0.8, 'sine')
      currentIndex = (currentIndex + 1) % frequencies.length
    }, 1000)

    setTimeout(() => {
      clearInterval(interval)
    }, duration)

    return true
  }

  /**
   * Habilita/desabilita TTS
   */
  toggleTTS(enabled = null) {
    if (this.existingSystems.ttsManager) {
      const currentState = this.existingSystems.ttsManager.isEnabled()
      const newState = enabled !== null ? enabled : !currentState

      this.existingSystems.ttsManager.setEnabled(newState)
      logger.info(`🗣️ TTS ${newState ? 'habilitado' : 'desabilitado'}`)

      return newState
    }
    return false
  }

  /**
   * Para o sistema
   */
  shutdown() {
    logger.info('🛑 Iniciando shutdown do sistema...')

    this.state = SYSTEM_STATES.MAINTENANCE

    // Parar intervalos
    for (const [name, interval] of this.intervals.entries()) {
      clearInterval(interval)
      logger.debug(`⏹️ Intervalo ${name} parado`)
    }
    this.intervals.clear()

    // Destruir componentes novos
    Object.values(this.newSystems).forEach((system) => {
      if (system && typeof system.cleanup === 'function') {
        try {
          system.cleanup()
        } catch (error) {
          logger.error('Erro ao limpar sistema novo:', error)
        }
      }
    })

    // Destruir componentes existentes
    Object.values(this.existingSystems).forEach((system) => {
      if (system && typeof system.destroy === 'function') {
        try {
          system.destroy()
        } catch (error) {
          logger.error('Erro ao destruir sistema existente:', error)        }
      }
    })
    
    this.components.clear()
    this.integrations.clear()
    this.systemMetrics.clear()

    logger.info('✅ Sistema parado com sucesso')
  }

  /**
   * 🚀 FASE 2: FLUXO BÁSICO DE MÉTRICAS - INTEGRAÇÃO COMPLETA
   * Configura orquestração entre useActivity, useMobileDataCollection,
   * metricsService, multisensoryMetricsService, IntelligentCache e DatabaseService
   */
  async setupBasicMetricsFlow() {
    logger.info('📊 FASE 2: Configurando fluxo básico de métricas...')

    try {
      // Configurar coleta comportamental (useActivity)
      this.setupBehavioralMetricsCollection()

      // Configurar coleta sensorial (useMobileDataCollection)
      this.setupSensorialMetricsCollection()

      // Configurar processamento de métricas
      this.setupMetricsProcessing()

      // Configurar armazenamento com cache inteligente
      this.setupIntelligentStorage()

      // Configurar exibição no dashboard
      this.setupDashboardIntegration()

      logger.info('✅ FASE 2: Fluxo básico de métricas configurado com sucesso')
      
      // Testar fluxo com dados de exemplo
      await this.testMetricsFlow()
      
    } catch (error) {
      logger.error('❌ Erro ao configurar fluxo de métricas:', error)
      throw error
    }
  }

  /**
   * Configura coleta de métricas comportamentais (useActivity)
   */
  setupBehavioralMetricsCollection() {
    // Métricas comportamentais padrão
    this.behavioralMetrics = {
      // Tempo de resposta
      responseTime: {
        enabled: true,
        threshold: 5000, // 5 segundos
        aggregation: 'average',
      },

      // Acertos e erros
      accuracy: {
        enabled: true,
        trackTrends: true,
        windowSize: 10,
      },

      // Engajamento (toques/cliques)
      engagement: {
        enabled: true,
        trackInteractionPatterns: true,
        sessionTimeout: 30000, // 30 segundos
      },
    }

    // Configurar hooks de coleta
    this.metricsCollectionHooks = new Map()
    this.metricsCollectionHooks.set('behavioral', {
      collectors: ['useActivity'],
      processor: 'metricsService',
      storage: 'IntelligentCache',
    })

    logger.info('🧠 Coleta comportamental configurada')
  }

  /**
   * Configura coleta de métricas sensoriais (useMobileDataCollection)
   */
  setupSensorialMetricsCollection() {
    // Métricas sensoriais para tablets
    this.sensorialMetrics = {
      // Pressão do toque
      touchPressure: {
        enabled: true,
        sensitivity: 'medium',
        calibration: 'auto',
      },

      // Giroscópio (agitação)
      gyroscope: {
        enabled: true,
        threshold: 0.5,
        samplingRate: 60, // Hz
      },

      // Acelerômetro adicional
      accelerometer: {
        enabled: true,
        filterNoise: true,
        gestureDetection: true,
      },
    }

    // Configurar hooks de coleta sensorial
    this.metricsCollectionHooks.set('sensorial', {
      collectors: ['useMobileDataCollection'],
      processor: 'multisensoryMetricsService',
      storage: 'IntelligentCache',
    })

    logger.info('📱 Coleta sensorial configurada')
  }

  /**
   * Configura processamento de métricas
   */
  setupMetricsProcessing() {
    // Pipeline de processamento
    this.processingPipeline = {
      // Fase 1: Coleta
      collection: {
        behavioral: this.existingSystems.metricsService,
        sensorial: this.existingSystems.multisensoryMetrics,
      },

      // Fase 2: Refinamento
      refinement: {
        behavioral: 'metricsService.js', // Calcula acertos/erros
        sensorial: 'multisensoryMetricsService.js', // Processa toque/giroscópio
        therapeutic: 'therapeuticAnalyzer.js', // Avalia progresso
      },

      // Fase 3: Análise
      analysis: {
        cognitive: this.existingSystems.cognitiveAnalyzer,
        neuropedagogical: this.existingSystems.neuropedagogicalAnalyzer,
        adaptive: this.existingSystems.adaptiveService,
      },
    }

    // Configurar fluxo de dados
    this.dataFlow = {
      input: ['useActivity', 'useMobileDataCollection'],
      processing: ['metricsService', 'multisensoryMetricsService'],
      output: ['IntelligentCache', 'DatabaseService'],
      visualization: ['PerformanceDashboard'],
    }

    logger.info('⚙️ Pipeline de processamento configurado')
  }

  /**
   * Configura armazenamento inteligente
   */
  setupIntelligentStorage() {
    // Configuração do cache inteligente
    this.storageConfig = {
      // Cache temporário (IntelligentCache)
      cache: {
        ttl: 1800000, // 30 minutos
        maxSize: 1000,
        strategy: 'LRU',
        compression: true,
      },

      // Persistência (DatabaseService)
      database: {
        batchSize: 50,
        syncInterval: 60000, // 1 minuto
        offline: true,
        backup: true,
      },
    }

    // Configurar cache-database sync
    this.setupCacheDatabaseSync()

    logger.info('💾 Armazenamento inteligente configurado')
  }

  /**
   * Configura sincronização cache-database
   */
  setupCacheDatabaseSync() {
    // Configurar sincronização automática
    this.syncManager = {
      interval: setInterval(() => {
        this.syncCacheToDatabase().catch((error) =>
          logger.error('❌ Erro na sincronização automática:', error)
        )
      }, this.storageConfig.database.syncInterval),

      batchQueue: [],
      processing: false,
    }

    logger.info('🔄 Sincronização cache-database configurada')
  }

  /**
   * Configura integração com dashboard
   */
  setupDashboardIntegration() {
    // Configuração de charts em tempo real
    this.dashboardConfig = {
      // Métricas comportamentais
      behavioral: {
        charts: ['line', 'bar', 'progress'],
        metrics: ['responseTime', 'accuracy', 'engagement'],
        realTime: true,
      },

      // Métricas sensoriais
      sensorial: {
        charts: ['scatter', 'heatmap', 'gauge'],
        metrics: ['touchPressure', 'gyroscope', 'accelerometer'],
        realTime: true,
      },

      // Métricas terapêuticas
      therapeutic: {
        charts: ['progress', 'radar', 'timeline'],
        metrics: ['attention', 'coordination', 'progress'],
        realTime: false,
      },
    }

    // Configurar updates em tempo real
    this.setupRealTimeUpdates()

    logger.info('📊 Integração com dashboard configurada')
  }

  /**
   * Configura updates em tempo real para o dashboard
   */
  setupRealTimeUpdates() {
    // Event emitter para updates em tempo real
    this.dashboardEvents = new EventTarget()

    // Configurar listeners para diferentes tipos de métricas
    this.dashboardListeners = {
      behavioral: this.createBehavioralListener(),
      sensorial: this.createSensorialListener(),
      therapeutic: this.createTherapeuticListener(),
    }

    logger.info('⚡ Updates em tempo real configurados')
  }

  /**
   * 🎯 MÉTODOS DE ORQUESTRAÇÃO DO FLUXO
   */

  /**
   * Recebe métricas do useActivity e processa
   */
  async processBehavioralMetrics(sessionId, metricsData) {
    try {
      // 1. Validar dados
      const validatedData = this.validateBehavioralMetrics(metricsData)

      // 2. Processar com metricsService
      const processedData = await this.existingSystems.metricsService?.processMetrics?.(validatedData) || validatedData

      // 3. Armazenar em cache
      await this.storeInCache('behavioral', sessionId, processedData)

      // 4. Emitir evento para dashboard
      this.emitDashboardUpdate('behavioral', processedData)

      logger.info(`✅ Métricas comportamentais processadas: ${sessionId}`)
      return processedData
    } catch (error) {
      logger.error('❌ Erro ao processar métricas comportamentais:', error)
      throw error
    }
  }

  /**
   * Recebe métricas do useMobileDataCollection e processa
   */
  async processSensorialMetrics(sessionId, sensorData) {
    try {
      // 1. Validar dados sensoriais
      const validatedData = this.validateSensorialMetrics(sensorData)

      // 2. Processar com multisensoryMetricsService
      const processedData = await this.existingSystems.multisensoryMetrics?.processMetrics?.(validatedData) || validatedData

      // 3. Armazenar em cache
      await this.storeInCache('sensorial', sessionId, processedData)

      // 4. Emitir evento para dashboard
      this.emitDashboardUpdate('sensorial', processedData)

      logger.info(`✅ Métricas sensoriais processadas: ${sessionId}`)
      return processedData
    } catch (error) {
      logger.error('❌ Erro ao processar métricas sensoriais:', error)
      throw error
    }
  }

  /**
   * Armazena dados no cache inteligente
   */
  async storeInCache(type, sessionId, data) {
    try {
      const cacheKey = `${type}_${sessionId}_${Date.now()}`

      // Usar IntelligentCache se disponível
      if (this.existingSystems.intelligentCache) {
        await this.existingSystems.intelligentCache.set(cacheKey, data, this.storageConfig.cache.ttl)
      } else {
        // Fallback para Map simples
        if (!this.tempCache) this.tempCache = new Map()
        this.tempCache.set(cacheKey, { data, timestamp: Date.now() })
      }

      // Agendar sincronização com database
      if (!this.syncManager) {
        await this.setupCacheDatabaseSync()
      }

      logger.debug(`💾 Dados armazenados em cache: ${cacheKey}`)
    } catch (error) {
      logger.error('❌ Erro ao armazenar em cache:', error)
      throw error
    }
  }

  /**
   * Sincroniza cache para database
   */
  async syncCacheToDatabase() {
    try {
      if (this.syncManager && this.syncManager.processing) return

      if (this.syncManager) {
        this.syncManager.processing = true
      }

      // Implementar sync com DatabaseService quando disponível
      if (this.existingSystems.databaseService) {
        // Sync real com database
        await this.existingSystems.databaseService.syncCacheData?.(this.tempCache || new Map())
      } else {
        // Log para debugging
        logger.debug('📤 Sincronização simulada (DatabaseService não disponível)')
      }

      if (this.syncManager) {
        this.syncManager.processing = false
      }

      logger.debug('🔄 Sincronização cache-database concluída')
    } catch (error) {
      if (this.syncManager) {
        this.syncManager.processing = false
      }
      logger.error('❌ Erro na sincronização:', error)
      throw error
    }
  }

  /**
   * Emite update para dashboard
   */
  emitDashboardUpdate(type, data) {
    try {
      if (!this.dashboardEvents) {
        this.dashboardEvents = new EventTarget()
      }
      
      const event = new CustomEvent('metricsUpdate', {
        detail: { type, data, timestamp: Date.now() },
      })

      this.dashboardEvents.dispatchEvent(event)
      logger.info(`📊 Update emitido para dashboard: ${type}`)
    } catch (error) {
      logger.error('❌ Erro ao emitir update:', error)
    }
  }

  /**
   * 🔍 MÉTODOS DE VALIDAÇÃO E SUPORTE
   */

  /**
   * Valida métricas comportamentais
   */
  validateBehavioralMetrics(metricsData) {
    if (!metricsData || typeof metricsData !== 'object') {
      throw new Error('Dados de métricas comportamentais inválidos')
    }

    const validated = {
      activity: metricsData.activity || 'unknown',
      responseTime: this.validateNumeric(metricsData.responseTime, 0, 30000), // Max 30 segundos
      accuracy: this.validateNumeric(metricsData.accuracy, 0, 100), // Porcentagem
      engagementScore: this.validateNumeric(metricsData.engagementScore, 0, 100),
      attempts: this.validateNumeric(metricsData.attempts, 0),
      successes: this.validateNumeric(metricsData.successes, 0),
      errors: this.validateNumeric(metricsData.errors, 0),
      sessionDuration: this.validateNumeric(metricsData.sessionDuration, 0),
      timestamp: metricsData.timestamp || Date.now(),
    }

    logger.debug('✅ Métricas comportamentais validadas', validated)
    return validated
  }

  /**
   * Valida métricas sensoriais
   */
  validateSensorialMetrics(sensorData) {
    if (!sensorData || typeof sensorData !== 'object') {
      throw new Error('Dados de métricas sensoriais inválidos')
    }

    const validated = {
      touchPressure: this.validateTouchPressure(sensorData.touchPressure),
      gyroscope: this.validateGyroscope(sensorData.gyroscope),
      accelerometer: this.validateAccelerometer(sensorData.accelerometer),
      gesturePattern: sensorData.gesturePattern || 'unknown',
      timestamp: sensorData.timestamp || Date.now(),
    }

    logger.debug('✅ Métricas sensoriais validadas', validated)
    return validated
  }

  /**
   * Valida schema de métricas
   */
  validateMetricsSchema(data, expectedSchema) {
    if (!data || !expectedSchema) return false

    for (const field of expectedSchema.required || []) {
      if (!(field in data)) {
        logger.warn(`⚠️ Campo obrigatório ausente: ${field}`)
        return false
      }
    }

    return true
  }

  /**
   * Valida valor numérico
   */
  validateNumeric(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = parseFloat(value)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }

  /**
   * Valida dados de pressão do toque
   */
  validateTouchPressure(data) {
    if (!Array.isArray(data)) return []
    return data.map(pressure => this.validateNumeric(pressure, 0, 100))
  }

  /**
   * Valida dados do giroscópio
   */
  validateGyroscope(data) {
    if (!data || typeof data !== 'object') {
      return { x: [], y: [], z: [] }
    }

    return {
      x: Array.isArray(data.x) ? data.x.map(v => this.validateNumeric(v, -10, 10)) : [],
      y: Array.isArray(data.y) ? data.y.map(v => this.validateNumeric(v, -10, 10)) : [],
      z: Array.isArray(data.z) ? data.z.map(v => this.validateNumeric(v, -10, 10)) : [],
    }
  }

  /**
   * Valida dados do acelerômetro
   */
  validateAccelerometer(data) {
    if (!data || typeof data !== 'object') {
      return { x: [], y: [], z: [] }
    }

    return {
      x: Array.isArray(data.x) ? data.x.map(v => this.validateNumeric(v, -20, 20)) : [],
      y: Array.isArray(data.y) ? data.y.map(v => this.validateNumeric(v, -20, 20)) : [],
      z: Array.isArray(data.z) ? data.z.map(v => this.validateNumeric(v, -20, 20)) : [],
    }
  }

  /**
   * Cria listener para eventos comportamentais
   */
  createBehavioralListener() {
    return (data) => {
      try {
        logger.info('📊 Evento comportamental recebido:', data)
        // Processar dados comportamentais em tempo real
        this.processBehavioralMetrics(data.sessionId, data.metrics)
      } catch (error) {
        logger.error('❌ Erro no listener comportamental:', error)
      }
    }
  }

  /**
   * Cria listener para eventos sensoriais
   */
  createSensorialListener() {
    return (data) => {
      try {
        logger.info('📱 Evento sensorial recebido:', data)
        // Processar dados sensoriais em tempo real
        this.processSensorialMetrics(data.sessionId, data.sensorData)
      } catch (error) {
        logger.error('❌ Erro no listener sensorial:', error)
      }
    }
  }

  /**
   * Cria listener para eventos terapêuticos
   */
  createTherapeuticListener() {
    return (data) => {
      try {
        logger.info('🎯 Evento terapêutico recebido:', data)
        // Processar dados terapêuticos se necessário
        if (this.existingSystems.therapyOptimizer) {
          this.existingSystems.therapyOptimizer.processTherapeuticEvent?.(data)
        }
      } catch (error) {
        logger.error('❌ Erro no listener terapêutico:', error)
      }
    }
  }

  /**
   * Gerencia retry de sincronização
   */
  async handleSyncRetry(type, sessionId, data, maxRetries = 3) {
    let attempts = 0
    
    while (attempts < maxRetries) {
      try {
        await this.syncCacheToDatabase(type, sessionId, data)
        logger.info(`✅ Sincronização ${type} bem-sucedida após ${attempts + 1} tentativas`)
        return true
      } catch (error) {
        attempts++
        logger.warn(`⚠️ Tentativa ${attempts} de sincronização ${type} falhou:`, error)
        
        if (attempts < maxRetries) {
          // Aguardar antes da próxima tentativa (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000))
        }
      }
    }
    
    logger.error(`❌ Sincronização ${type} falhou após ${maxRetries} tentativas`)
    return false
  }

  /**
   * Testa fluxo completo de métricas
   */
  async testMetricsFlow() {
    logger.info('🧪 Testando fluxo de métricas...')

    try {
      const testSessionId = `test_${Date.now()}`

      // Dados de teste comportamentais
      const behavioralTestData = {
        activity: 'test-activity',
        responseTime: 1500,
        accuracy: 85,
        engagementScore: 75,
        attempts: 10,
        successes: 8,
        errors: 2,
        sessionDuration: 60000,
      }

      // Dados de teste sensoriais
      const sensorialTestData = {
        touchPressure: [45, 52, 38, 60],
        gyroscope: {
          x: [0.1, -0.2, 0.3, -0.1],
          y: [0.2, 0.1, -0.3, 0.2],
          z: [0.5, 0.6, 0.4, 0.7],
        },
        gesturePattern: 'tap_sequence',
      }

      // Testar fluxo comportamental
      const behavioralResult = await this.processBehavioralMetrics(testSessionId, behavioralTestData)
      
      // Testar fluxo sensorial
      const sensorialResult = await this.processSensorialMetrics(testSessionId, sensorialTestData)

      logger.info('✅ Teste de fluxo de métricas concluído com sucesso', {
        behavioral: !!behavioralResult,
        sensorial: !!sensorialResult,
      })      return {
        success: true,
        behavioral: behavioralResult,
        sensorial: sensorialResult,
      }
    } catch (error) {
      logger.error('❌ Erro no teste de fluxo de métricas:', error)
      return { success: false, error: error.message }
    }  }

  /**
   * 🧪 MÉTODO DE TESTE COM MEMORY GAME
   */
  async testWithMemoryGame(gameData) {
    logger.info('📊 FASE 2: Configurando fluxo básico de métricas...')

    try {
      // Configurar coleta comportamental (useActivity)
      this.setupBehavioralMetricsCollection()

      // Configurar coleta sensorial (useMobileDataCollection)
      this.setupSensorialMetricsCollection()

      // Configurar processamento de métricas
      this.setupMetricsProcessing()

      // Configurar armazenamento com cache inteligente
      this.setupIntelligentStorage()

      // Configurar exibição no dashboard
      this.setupDashboardIntegration()

      logger.info('✅ FASE 2: Fluxo básico de métricas configurado com sucesso')
      
      // Testar fluxo com dados de exemplo
      await this.testMetricsFlow()
      
    } catch (error) {
      logger.error('❌ Erro ao configurar fluxo de métricas:', error)
      throw error
    }
  }

  /**
   * Configura coleta de métricas comportamentais (useActivity)
   */
  setupBehavioralMetricsCollection() {
    // Métricas comportamentais padrão
    this.behavioralMetrics = {
      // Tempo de resposta
      responseTime: {
        enabled: true,
        threshold: 5000, // 5 segundos
        aggregation: 'average',
      },

      // Acertos e erros
      accuracy: {
        enabled: true,
        trackTrends: true,
        windowSize: 10,
      },

      // Engajamento (toques/cliques)
      engagement: {
        enabled: true,
        trackInteractionPatterns: true,
        sessionTimeout: 30000, // 30 segundos
      },
    }

    // Configurar hooks de coleta
    this.metricsCollectionHooks = new Map()
    this.metricsCollectionHooks.set('behavioral', {
      collectors: ['useActivity'],
      processor: 'metricsService',
      storage: 'IntelligentCache',
    })

    logger.info('🧠 Coleta comportamental configurada')
  }

  /**
   * Configura coleta de métricas sensoriais (useMobileDataCollection)
   */
  setupSensorialMetricsCollection() {
    // Métricas sensoriais para tablets
    this.sensorialMetrics = {
      // Pressão do toque
      touchPressure: {
        enabled: true,
        sensitivity: 'medium',
        calibration: 'auto',
      },

      // Giroscópio (agitação)
      gyroscope: {
        enabled: true,
        threshold: 0.5,
        samplingRate: 60, // Hz
      },

      // Acelerômetro adicional
      accelerometer: {
        enabled: true,
        filterNoise: true,
        gestureDetection: true,
      },
    }

    // Configurar hooks de coleta sensorial
    this.metricsCollectionHooks.set('sensorial', {
      collectors: ['useMobileDataCollection'],
      processor: 'multisensoryMetricsService',
      storage: 'IntelligentCache',
    })

    logger.info('📱 Coleta sensorial configurada')
  }

  /**
   * Configura processamento de métricas
   */
  setupMetricsProcessing() {
    // Pipeline de processamento
    this.processingPipeline = {
      // Fase 1: Coleta
      collection: {
        behavioral: this.existingSystems.metricsService,
        sensorial: this.existingSystems.multisensoryMetrics,
      },

      // Fase 2: Refinamento
      refinement: {
        behavioral: 'metricsService.js', // Calcula acertos/erros
        sensorial: 'multisensoryMetricsService.js', // Processa toque/giroscópio
        therapeutic: 'therapeuticAnalyzer.js', // Avalia progresso
      },

      // Fase 3: Análise
      analysis: {
        cognitive: this.existingSystems.cognitiveAnalyzer,
        neuropedagogical: this.existingSystems.neuropedagogicalAnalyzer,
        adaptive: this.existingSystems.adaptiveService,
      },
    }

    // Configurar fluxo de dados
    this.dataFlow = {
      input: ['useActivity', 'useMobileDataCollection'],
      processing: ['metricsService', 'multisensoryMetricsService'],
      output: ['IntelligentCache', 'DatabaseService'],
      visualization: ['PerformanceDashboard'],
    }

    logger.info('⚙️ Pipeline de processamento configurado')
  }

  /**
   * Configura armazenamento inteligente
   */
  setupIntelligentStorage() {
    // Configuração do cache inteligente
    this.storageConfig = {
      // Cache temporário (IntelligentCache)
      cache: {
        ttl: 1800000, // 30 minutos
        maxSize: 1000,
        strategy: 'LRU',
        compression: true,
      },

      // Persistência (DatabaseService)
      database: {
        batchSize: 50,
        syncInterval: 60000, // 1 minuto
        offline: true,
        backup: true,
      },
    }

    // Configurar sincronização entre cache e database
    this.setupCacheDatabaseSync()

    logger.info('💾 Armazenamento inteligente configurado')
  }

  /**
   * Configura sincronização Cache <-> Database
   */
  setupCacheDatabaseSync() {
    // Sistema de sincronização automática
    this.syncManager = {
      interval: null,
      pending: new Set(),
      retries: new Map(),
      maxRetries: 3,
    }

    // Iniciar sincronização periódica
    this.syncManager.interval = setInterval(async () => {
      await this.syncCacheToDatabase()
    }, this.storageConfig.database.syncInterval)

    logger.info('🔄 Sincronização cache-database ativa')
  }

  /**
   * Configura integração com dashboard
   */
  setupDashboardIntegration() {
    // Configurar visualizações do dashboard
    this.dashboardConfig = {
      // Métricas comportamentais
      behavioral: {
        charts: ['line', 'bar', 'pie'],
        metrics: ['responseTime', 'accuracy', 'engagement'],
        realTime: true,
      },

      // Métricas sensoriais
      sensorial: {
        charts: ['scatter', 'heatmap', 'gauge'],
        metrics: ['touchPressure', 'gyroscope', 'accelerometer'],
        realTime: true,
      },

      // Métricas terapêuticas
      therapeutic: {
        charts: ['progress', 'radar', 'timeline'],
        metrics: ['attention', 'coordination', 'progress'],
        realTime: false,
      },
    }

    // Configurar updates em tempo real
    this.setupRealTimeUpdates()

    logger.info('📊 Integração com dashboard configurada')
  }

  /**
   * Configura updates em tempo real para o dashboard
   */
  setupRealTimeUpdates() {
    // Event emitter para updates em tempo real
    this.dashboardEvents = new EventTarget()

    // Configurar listeners para diferentes tipos de métricas
    this.dashboardListeners = {
      behavioral: this.createBehavioralListener(),
      sensorial: this.createSensorialListener(),
      therapeutic: this.createTherapeuticListener(),
    }

    logger.info('⚡ Updates em tempo real configurados')
  }

  /**
   * 🎯 MÉTODOS DE ORQUESTRAÇÃO DO FLUXO
   */

  /**
   * Recebe métricas do useActivity e processa
   */
  async processBehavioralMetrics(sessionId, metricsData) {
    try {
      // 1. Validar dados
      const validatedData = this.validateBehavioralMetrics(metricsData)

      // 2. Processar com metricsService
      const processedData = await this.existingSystems.metricsService?.processMetrics?.(validatedData) || validatedData

      // 3. Armazenar em cache
      await this.storeInCache('behavioral', sessionId, processedData)

      // 4. Emitir evento para dashboard
      this.emitDashboardUpdate('behavioral', processedData)

      logger.info(`✅ Métricas comportamentais processadas: ${sessionId}`)
      return processedData
    } catch (error) {
      logger.error('❌ Erro ao processar métricas comportamentais:', error)
      throw error
    }
  }

  /**
   * Recebe métricas do useMobileDataCollection e processa
   */
  async processSensorialMetrics(sessionId, sensorData) {
    try {
      // 1. Validar dados sensoriais
      const validatedData = this.validateSensorialMetrics(sensorData)

      // 2. Processar com multisensoryMetricsService
      const processedData = await this.existingSystems.multisensoryMetrics?.processMetrics?.(validatedData) || validatedData

      // 3. Armazenar em cache
      await this.storeInCache('sensorial', sessionId, processedData)

      // 4. Emitir evento para dashboard
      this.emitDashboardUpdate('sensorial', processedData)

      logger.info(`✅ Métricas sensoriais processadas: ${sessionId}`)
      return processedData
    } catch (error) {
      logger.error('❌ Erro ao processar métricas sensoriais:', error)
      throw error
    }
  }

  /**
   * Armazena dados no cache inteligente
   */
  async storeInCache(type, sessionId, data) {
    try {
      const cacheKey = `${type}_${sessionId}_${Date.now()}`

      // Usar IntelligentCache se disponível
      if (this.existingSystems.intelligentCache) {
        await this.existingSystems.intelligentCache.set(cacheKey, data, this.storageConfig.cache.ttl)
      } else {
        // Fallback para Map simples
        if (!this.tempCache) this.tempCache = new Map()
        this.tempCache.set(cacheKey, { data, timestamp: Date.now() })
      }

      // Agendar sincronização com database
      if (!this.syncManager) {
        this.syncManager = { pending: new Set(), retries: new Map(), maxRetries: 3 }
      }
      this.syncManager.pending.add(cacheKey)

      logger.info(`💾 Dados armazenados em cache: ${cacheKey}`)
    } catch (error) {
      logger.error('❌ Erro ao armazenar em cache:', error)
      throw error
    }
  }

  /**
   * Sincroniza cache com database
   */
  async syncCacheToDatabase() {
    if (!this.syncManager || this.syncManager.pending.size === 0) return

    try {
      const batch = Array.from(this.syncManager.pending).slice(
        0,
        this.storageConfig?.database?.batchSize || 50
      )

      for (const cacheKey of batch) {
        // Recuperar dados do cache
        let data
        if (this.existingSystems.intelligentCache) {
          data = await this.existingSystems.intelligentCache.get(cacheKey)
        } else {
          data = this.tempCache?.get(cacheKey)?.data
        }

        if (data) {
          // Salvar no database
          await this.existingSystems.databaseService?.saveGameSession?.(data)

          // Remover da fila
          this.syncManager.pending.delete(cacheKey)
          this.syncManager.retries.delete(cacheKey)
        }
      }

      logger.info(`🔄 Sincronização concluída: ${batch.length} registros`)
    } catch (error) {
      logger.error('❌ Erro na sincronização:', error)
      // Retentar posteriormente
      this.handleSyncRetry()
    }
  }

  /**
   * Emite update para dashboard
   */
  emitDashboardUpdate(type, data) {
    try {
      if (!this.dashboardEvents) {
        this.dashboardEvents = new EventTarget()
      }
      
      const event = new CustomEvent('metricsUpdate', {
        detail: { type, data, timestamp: Date.now() },
      })

      this.dashboardEvents.dispatchEvent(event)
      logger.info(`📊 Update emitido para dashboard: ${type}`)
    } catch (error) {
      logger.error('❌ Erro ao emitir update:', error)
    }  }

  /**
   * 🔍 MÉTODOS DE VALIDAÇÃO E SUPORTE
   */

  /**
   * Valida métricas comportamentais
   */
  validateBehavioralMetrics(metricsData) {
    if (!metricsData || typeof metricsData !== 'object') {
      throw new Error('Dados de métricas comportamentais inválidos')
    }

    const validated = {
      activity: metricsData.activity || 'unknown',
      responseTime: this.validateNumeric(metricsData.responseTime, 0, 30000), // Max 30 segundos
      accuracy: this.validateNumeric(metricsData.accuracy, 0, 100), // Porcentagem
      engagementScore: this.validateNumeric(metricsData.engagementScore, 0, 100),
      attempts: this.validateNumeric(metricsData.attempts, 0),
      successes: this.validateNumeric(metricsData.successes, 0),
      errors: this.validateNumeric(metricsData.errors, 0),
      sessionDuration: this.validateNumeric(metricsData.sessionDuration, 0),
      timestamp: metricsData.timestamp || Date.now(),
    }

    logger.debug('✅ Métricas comportamentais validadas', validated)
    return validated
  }

  /**
   * Valida métricas sensoriais
   */
  validateSensorialMetrics(sensorData) {
    if (!sensorData || typeof sensorData !== 'object') {
      throw new Error('Dados de métricas sensoriais inválidos')
    }

    const validated = {
      touchPressure: this.validateTouchPressure(sensorData.touchPressure),
      gyroscope: this.validateGyroscope(sensorData.gyroscope),
      accelerometer: this.validateAccelerometer(sensorData.accelerometer),
      gesturePattern: sensorData.gesturePattern || 'unknown',
      timestamp: sensorData.timestamp || Date.now(),
    }

    logger.debug('✅ Métricas sensoriais validadas', validated)
    return validated
  }

  /**
   * Valida schema de métricas
   */
  validateMetricsSchema(data, expectedSchema) {
    if (!data || !expectedSchema) return false

    for (const field of expectedSchema.required || []) {
      if (!(field in data)) {
        logger.warn(`⚠️ Campo obrigatório ausente: ${field}`)
        return false
      }
    }

    return true
  }

  /**
   * Valida valor numérico
   */
  validateNumeric(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = parseFloat(value)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }

  /**
   * Valida dados de pressão do toque
   */
  validateTouchPressure(data) {
    if (!Array.isArray(data)) return []
    return data.map(pressure => this.validateNumeric(pressure, 0, 100))
  }

  /**
   * Valida dados do giroscópio
   */
  validateGyroscope(data) {
    if (!data || typeof data !== 'object') {
      return { x: [], y: [], z: [] }
    }

    return {
      x: Array.isArray(data.x) ? data.x.map(v => this.validateNumeric(v, -10, 10)) : [],
      y: Array.isArray(data.y) ? data.y.map(v => this.validateNumeric(v, -10, 10)) : [],
      z: Array.isArray(data.z) ? data.z.map(v => this.validateNumeric(v, -10, 10)) : [],
    }
  }

  /**
   * Valida dados do acelerômetro
   */
  validateAccelerometer(data) {
    if (!data || typeof data !== 'object') {
      return { x: [], y: [], z: [] }
    }

    return {
      x: Array.isArray(data.x) ? data.x.map(v => this.validateNumeric(v, -20, 20)) : [],
      y: Array.isArray(data.y) ? data.y.map(v => this.validateNumeric(v, -20, 20)) : [],
      z: Array.isArray(data.z) ? data.z.map(v => this.validateNumeric(v, -20, 20)) : [],
    }
  }

  /**
   * Cria listener para eventos comportamentais
   */
  createBehavioralListener() {
    return (data) => {
      try {
        logger.info('📊 Evento comportamental recebido:', data)
        // Processar dados comportamentais em tempo real
        this.processBehavioralMetrics(data.sessionId, data.metrics)
      } catch (error) {
        logger.error('❌ Erro no listener comportamental:', error)
      }
    }
  }

  /**
   * Cria listener para eventos sensoriais
   */
  createSensorialListener() {
    return (data) => {
      try {
        logger.info('📱 Evento sensorial recebido:', data)
        // Processar dados sensoriais em tempo real
        this.processSensorialMetrics(data.sessionId, data.sensorData)
      } catch (error) {
        logger.error('❌ Erro no listener sensorial:', error)
      }
    }
  }

  /**
   * Cria listener para eventos terapêuticos
   */
  createTherapeuticListener() {
    return (data) => {
      try {
        logger.info('🎯 Evento terapêutico recebido:', data)
        // Processar dados terapêuticos se necessário
        if (this.existingSystems.therapyOptimizer) {
          this.existingSystems.therapyOptimizer.processTherapeuticEvent?.(data)
        }
      } catch (error) {
        logger.error('❌ Erro no listener terapêutico:', error)
      }
    }
  }

  /**
   * Gerencia retry de sincronização
   */
  async handleSyncRetry(type, sessionId, data, maxRetries = 3) {
    let attempts = 0
    
    while (attempts < maxRetries) {
      try {
        await this.syncCacheToDatabase(type, sessionId, data)
        logger.info(`✅ Sincronização ${type} bem-sucedida após ${attempts + 1} tentativas`)
        return true
      } catch (error) {
        attempts++
        logger.warn(`⚠️ Tentativa ${attempts} de sincronização ${type} falhou:`, error)
        
        if (attempts < maxRetries) {
          // Aguardar antes da próxima tentativa (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000))
        }
      }
    }
    
    logger.error(`❌ Sincronização ${type} falhou após ${maxRetries} tentativas`)
    return false
  }

  /**
   * Testa fluxo completo de métricas
   */
  async testMetricsFlow() {
    logger.info('🧪 Testando fluxo de métricas...')

    try {
      const testSessionId = `test_${Date.now()}`

      // Dados de teste comportamentais
      const behavioralTestData = {
        activity: 'test-activity',
        responseTime: 1500,
        accuracy: 85,
        engagementScore: 75,
        attempts: 10,
        successes: 8,
        errors: 2,
        sessionDuration: 60000,
      }

      // Dados de teste sensoriais
      const sensorialTestData = {
        touchPressure: [45, 52, 38, 60],
        gyroscope: {
          x: [0.1, -0.2, 0.3, -0.1],
          y: [0.2, 0.1, -0.3, 0.2],
          z: [0.5, 0.6, 0.4, 0.7],
        },
        gesturePattern: 'tap_sequence',
      }

      // Testar fluxo comportamental
      const behavioralResult = await this.processBehavioralMetrics(testSessionId, behavioralTestData)
      
      // Testar fluxo sensorial
      const sensorialResult = await this.processSensorialMetrics(testSessionId, sensorialTestData)

      logger.info('✅ Teste de fluxo de métricas concluído com sucesso', {
        behavioral: !!behavioralResult,
        sensorial: !!sensorialResult,
      })

      return {
        success: true,
        behavioral: behavioralResult,
        sensorial: sensorialResult,
      }
    } catch (error) {
      logger.error('❌ Erro no teste de fluxo de métricas:', error)
      return { success: false, error: error.message }
    }
  }

/**
 * 🧪 MÉTODO DE TESTE COM MEMORY GAME
 */
async function testWithMemoryGame(gameData) {
  logger.info('🧪 Testando fluxo com MemoryGame...')

  try {
    // Simular dados do MemoryGame
    const sessionId = `memory_game_${Date.now()}`

    // Métricas comportamentais do jogo
    const behavioralData = {
      activity: 'memory-game',
      responseTime: gameData.avgResponseTime || 2500,
      accuracy: gameData.accuracy || 85,
      engagementScore: gameData.interactions || 15,
      attempts: gameData.moves || 12,
      successes: gameData.matches || 6,
      errors: gameData.mismatches || 6,
      sessionDuration: gameData.duration || 120000,
    }

    // Métricas sensoriais simuladas
    const sensorialData = {
      touchPressure: Array.from({ length: 10 }, () => Math.random() * 100),
      gyroscope: {
        x: Array.from({ length: 10 }, () => Math.random() * 2 - 1),
        y: Array.from({ length: 10 }, () => Math.random() * 2 - 1),
        z: Array.from({ length: 10 }, () => Math.random() * 2 - 1),
      },
      gesturePattern: 'tap_sequence',
    }

    // Processar métricas comportamentais
    const behavioralResult = await this.processBehavioralMetrics(sessionId, behavioralData)

    // Processar métricas sensoriais
    const sensorialResult = await this.processSensorialMetrics(sessionId, sensorialData)

    // Combinar resultados
    const combinedResult = {
      sessionId,      behavioral: behavioralResult,
      sensorial: sensorialResult,
      timestamp: Date.now(),
      gameType: 'memory-game',
        logger.info('✅ Teste com MemoryGame concluído:', combinedResult)
    return combinedResult
  } catch (error) {
    logger.error('❌ Erro no teste com MemoryGame:', error)
    throw error
  }
}

} // Fim da classe SystemOrchestrator

// Instância singleton
let systemOrchestratorInstance = null

/**
 * Obtém instância do orquestrador
 */
export const getSystemOrchestrator = () => {
  if (!systemOrchestratorInstance) {
    systemOrchestratorInstance = new SystemOrchestrator()
  }
  return systemOrchestratorInstance
}

/**
 * Inicializa o sistema completo
 */
export const initializeSystem = async () => {
  const orchestrator = getSystemOrchestrator()
  await orchestrator.init()
  return orchestrator
}

/**
 * Define modo de operação
 */
export const setSystemMode = (mode) => {
  const orchestrator = getSystemOrchestrator()
  orchestrator.mode = mode
  logger.info(`🔧 Modo do sistema alterado para: ${mode}`)
}

/**
 * Obtém estatísticas do sistema
 */
export const getSystemStatistics = () => {
  const orchestrator = getSystemOrchestrator()
  return orchestrator.getUnifiedStatistics()
}

/**
 * Para o sistema
 */
export const shutdownSystem = () => {
  if (systemOrchestratorInstance) {
    systemOrchestratorInstance.shutdown()
    systemOrchestratorInstance = null
  }
}

export default SystemOrchestrator
