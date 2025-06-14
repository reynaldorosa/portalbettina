// SystemOrchestrator.js - VERSÃO FINAL TERAPÊUTICA (SEM ML)
// Portal Betina System Orchestrator - Orquestrador Principal do Sistema
// FLUXO: JOGOS → MÉTRICAS → ORQUESTRADOR → DATABASE → DASHBOARDS

// === IMPORTS LIMPOS - APENAS MÓDULOS TERAPÊUTICOS ===

// Logging
import sharedLogger from '../logger.js'

// Metrics and Analytics (APENAS AVALIATIVOS - SEM ML)
import { AdvancedMetricsEngine } from '../metrics/AdvancedMetricsEngine.js'
import { ErrorPatternAnalyzer } from '../metrics/errorPatternAnalyzer.js'
import { MetricsService } from '../metrics/metricsService.js'
import performanceMonitor from '../metrics/performanceMonitor.js'
import { metricsManager } from '../metrics/index.js'

// === NOVOS IMPORTS - ALGORITMOS ADICIONAIS ===

// Machine Learning Models (Análise, não ML real)
// import { BehaviorAnalysisModel } from '../ml/BehaviorAnalysisModel.js'
// import { CognitiveAssessmentModel } from '../ml/CognitiveAssessmentModel.js'
// import { DifficultyAdaptiveModel } from '../ml/DifficultyAdaptiveModel.js'
// import { EmotionalStateModel } from '../ml/EmotionalStateModel.js'
// import { LearningProgressModel } from '../ml/LearningProgressModel.js'
// import { PersonalityPredictiveModel } from '../ml/PersonalityPredictiveModel.js'

// Predictive Analysis
// import { PredictiveAnalysisEngine } from '../predictiveAnalysis/predictiveAnalysisEngine.js'

// Adaptive Services Expanded
// import { AdaptiveService } from '../adaptive/AdaptiveService.js'
// import { AdaptiveMLService } from '../adaptive/AdaptiveMLService.js'
// import { EnhancedAdaptiveMLService } from '../adaptive/EnhancedAdaptiveMLService.js'
// import { AdaptiveAccessibilityManager } from '../adaptive/adaptiveAccessibilityManager.js'

// Emotional Analysis Algorithms
// import { IntegratedAnalysisOrchestrator } from '../emotionalAnalysis/IntegratedAnalysisOrchestrator.js'
// import { EmotionalAnalysisEngine } from '../emotionalAnalysis/emotionalAnalysisEngine.js'

// === IMPORTS EXISTENTES ===

// Therapeutic and Adaptive Services
import { RuleBasedAdaptiveService } from '../adaptive/RuleBasedAdaptiveService.js'
import { AdvancedTherapeuticAnalyzer } from '../therapy/AdvancedTherapeuticAnalyzer.js'

// Accessibility and Cognitive Services
import { AccessibilityService } from '../accessibility/AccessibilityService.js'
import CognitiveAnalyzer from '../cognitive/CognitiveAnalyzer.js'
import { EmotionalAnalysisService } from '../emotionalAnalysis/EmotionalAnalysisService.js'

// Neuroplasticity and Multisensory (ANÁLISE, NÃO ML)
import { NeuroplasticityAnalyzer } from '../neuroplasticity/neuroplasticityAnalyzer.js'
import { MultisensoryMetricsCollector } from '../multisensoryAnalysis/multisensoryMetrics.js'

// Audio and TTS
import audioGenerator from '../audio/audioGenerator.js'
import { ttsManager } from '../tts/ttsManager.js'

// Session and Game Management
import { SessionManager } from '../sessions/SessionManager.js'
import { incrementGameUsage, getGameUsageCounts } from '../game/gameUsage.js'

// Database and Storage
import globalNeuropedagogicalDB from '../storage/globalNeuropedagogicalDatabase.js'

// ✅ SISTEMA DE PROFILES CONSOLIDADO
import { DatabaseServiceAdapter } from '../../database/DatabaseServiceAdapter.js'

// Módulos avançados de análise cognitiva para autismo
import { AdvancedAnalysisOrchestrator } from '../autismCognitiveAnalysis/advancedAnalysisOrchestrator.js'
import AdvancedSupportCalculator from '../autismCognitiveAnalysis/advancedSupportCalculations.js'
import { AutismAssessmentHelpers } from '../autismCognitiveAnalysis/autismAssessmentHelpers.js'
import autismCognitiveAnalyzer from '../autismCognitiveAnalysis/autismCognitiveAnalyzer.js'
import neuropedagogicalAnalyzer from '../autismCognitiveAnalysis/neuropedagogicalInsights.js'
import { featureFlags, isFeatureEnabled } from '../autismCognitiveAnalysis/featureFlags.js'

// Analytics Systems 
import { BehavioralEngagementAnalyzer } from '../analytics/behavioralEngagementAnalyzer.js'
import { generateProgressReport } from '../analytics/progressReports.js'

// Analysis Systems (verificar se existe)
// import { AnalysisSystemManager } from '../analysisSystem/index.js'

// Standards and Components (verificar se existem)
// import { ActivityStandards } from '../standards/activityStandards.js'
// import { ComponentPatterns } from '../standards/componentPatterns.js'

// Shared Services (verificar se existem)
// import { SharedConstants } from '../shared/constants.js'
// import { DatabaseServiceUserProfiles } from '../shared/databaseService_UserProfiles.js'
// import { I18nService } from '../shared/i18n.js'

// === CONSTANTES E CONFIGURAÇÕES TERAPÊUTICAS ===

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

// Configurações do sistema otimizadas para terapia de autismo
const THERAPEUTIC_SYSTEM_CONFIG = {
  // Thresholds de performance terapêutica
  therapeuticThresholds: {
    sessionDuration: 1800000, // 30 minutos max
    responseTime: 200, // ms
    memoryUsage: 150, // MB
    errorRate: 0.01, // 1%
    engagementRate: 0.7, // 70% mínimo
  },

  // Configurações de monitoramento terapêutico
  monitoring: {
    enabled: true,
    interval: 5000, // 5 segundos
    retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 dias
    alertThresholds: {
      critical: 0.95,
      warning: 0.8,
      info: 0.6,
    },
  },

  // Configurações de otimização terapêutica
  optimization: {
    autoOptimize: true,
    optimizationInterval: 30 * 60 * 1000, // 30 minutos
    maxOptimizationCycles: 5,
    therapeuticTargets: {
      userEngagement: 0.8,
      sessionCompletion: 0.85,
      therapeuticGoalAchievement: 0.75,
    },
  },

  // Configurações específicas para autismo
  autism: {
    sensoryOptimization: true,
    cognitiveLoadManagement: true,
    adaptivePersonalization: true,
    therapeuticGoalTracking: true,
    behavioralPatternAnalysis: true,
    multisensoryIntegration: true,
  },
}

// === CLASSE PRINCIPAL ===

/**
 * @class SystemOrchestrator
 * @description Orquestrador principal do sistema terapêutico Portal Betina
 * FLUXO: JOGOS → MÉTRICAS → ORQUESTRADOR → DATABASE → DASHBOARDS
 * FOCO: Análise terapêutica e avaliativa (SEM Machine Learning)
 */
export class SystemOrchestrator {
  constructor(databaseService, config = {}) {
    // ✅ INICIALIZAÇÃO DO DATABASE ADAPTER
    if (databaseService instanceof DatabaseServiceAdapter) {
      this.db = databaseService
      this.dbAdapter = databaseService
    } else {
      // Compatibilidade com database service legado
      this.db = databaseService
      this.dbAdapter = null
    }
    
    this.logger = sharedLogger || databaseService?.logger || console

    this.config = {
      // Módulos terapêuticos ativos
      enableAdvancedMetricsEngine: true,
      enableNeuroplasticityAnalyzer: true,
      enableErrorPatternAnalyzer: true,
      enableEmotionalAnalysis: true,
      enableCognitiveAnalysis: true,
      enableNeuroplasticityTracking: true,
      enableMultisensoryIntegration: true,
      enableAudioIntegration: true,
      enableTTSIntegration: true,
      enableGameUsageTracking: true,
      enableSessionIntegration: true,
      enableTherapeuticIntegration: true,
      enableAdaptiveOptimization: true,
      // ✅ MÓDULO DE PROFILES INTEGRADO
      enableProfileManagement: true,
      enableProfileAnalysis: true,
      enableUserProfileIntegration: true,
      // Módulos avançados de análise cognitiva para autismo
      enableAutismCognitiveAnalysis: true,
      enableAdvancedAnalysisOrchestrator: true,
      enableAdvancedSupportCalculator: true,
      enableNeuropedagogicalAnalysis: true,
      enableAutismSpecificAlgorithms: true,
      enableTherapeuticRecommendations: true,
      // Intervalos de operação
      orchestrationInterval: 30000, // 30 segundos
      systemSyncInterval: 60000, // 1 minuto
      // Thresholds terapêuticos
      therapeuticThreshold: 0.75,
      engagementThreshold: 0.7,
      optimizationThreshold: 0.8,
      ...config,
    }// Estados e componentes
    this.state = SYSTEM_STATES.INITIALIZING
    this.mode = OPERATION_MODES.PRODUCTION
    this.components = new Map()
    this.integrations = new Map()
    this.therapeuticMetrics = new Map()
    this.sessionData = new Map()
    this.newSystems = {}
    this.existingSystems = {}
    this.intervals = new Map()    // Sistemas terapêuticos
    this.therapeuticSystems = {
      metricsManager: null,
      performanceMonitor: null,
      multisensoryMetrics: null,
      advancedMetricsEngine: null,
      errorPatternAnalyzer: null,
      metricsService: null,
      audioGenerator: null,
      ttsManager: null,
      sessionManager: null,
      cognitiveAnalyzer: null,
      adaptiveService: null,
      accessibilityService: null,
      therapeuticAnalyzer: null,
      neuroplasticityAnalyzer: null,
      emotionalAnalysisService: null,
      // ✅ SISTEMA DE PROFILES INTEGRADO
      profileController: null,
      profileAnalyzer: null,
      userProfilesService: null,
      // Módulos avançados de análise cognitiva para autismo
      autismCognitiveAnalyzer: null,
      advancedAnalysisOrchestrator: null,
      advancedSupportCalculator: null,
      neuropedagogicalAnalyzer: null,
      // === NOVOS ALGORITMOS INTEGRADOS ===
      // Analytics Systems
      behavioralEngagementAnalyzer: null,
      progressReports: null,
      // Machine Learning Models (Análise comportamental)
      behaviorAnalysisModel: null,
      cognitiveAssessmentModel: null,
      difficultyAdaptiveModel: null,
      emotionalStateModel: null,
      learningProgressModel: null,
      personalityPredictiveModel: null,
      // Predictive Analysis
      predictiveAnalysisEngine: null,
      // Enhanced Adaptive Services
      adaptiveMLService: null,
      enhancedAdaptiveMLService: null,
      adaptiveAccessibilityManager: null,
      // Emotional Analysis
      integratedAnalysisOrchestrator: null,
      emotionalAnalysisEngine: null,
    }

    this.statistics = {
      uptime: 0,
      totalSessions: 0,
      totalGamesPlayed: 0,
      totalTherapeuticGoalsAchieved: 0,
      averageSessionDuration: 0,
      averageEngagementRate: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      therapeuticSuccessRate: 0,
      // ✅ ESTATÍSTICAS DE PROFILES
      totalProfiles: 0,
      profilesCreated: 0,
      profilesAnalyzed: 0,
      userInteractions: 0,
      averageProfileEngagement: 0,
      // Timing
      startTime: Date.now(),
      lastOptimization: null,
      optimizationCycles: 0,
    }

    this.activeSession = null
    this.intervals = new Map()

    this.logger.info('🏥 SystemOrchestrator Terapêutico criado')
  }
  /**
   * Inicializa o sistema terapêutico completo
   */
  async init() {
    try {
      this.logger.info('🏥 Iniciando Portal Betina Therapeutic Orchestrator...')

      // Fase 1: Inicializar componentes terapêuticos
      await this.initializeTherapeuticComponents()

      // Fase 2: Configurar fluxo de dados
      await this.setupDataFlow()

      // Fase 3: Iniciar monitoramento terapêutico
      this.startTherapeuticMonitoring()

      // Fase 4: Configurar otimização automática
      if (THERAPEUTIC_SYSTEM_CONFIG.optimization.autoOptimize) {
        this.startTherapeuticOptimization()
      }

      this.state = SYSTEM_STATES.READY
      this.logger.info('✅ Sistema orquestrador terapêutico inicializado')
      
      return this
    } catch (error) {
      this.logger.error('❌ Erro ao inicializar sistema terapêutico:', error)
      this.state = SYSTEM_STATES.ERROR
      throw error
    }
  }

  /**
   * Inicializa o Sistema Orquestrador Terapêutico
   * @returns {Promise<SystemOrchestrator>} Instância inicializada
   */
  async initialize() {
    try {
      this.logger.info('🚀 Inicializando Sistema Orquestrador Terapêutico...')
      this.state = SYSTEM_STATES.INITIALIZING

      // Fase 1: Inicializar componentes terapêuticos
      await this.initializeTherapeuticComponents()

      // Fase 2: Configurar fluxo de dados
      await this.setupDataFlow()

      // Fase 3: Iniciar monitoramento terapêutico
      this.startTherapeuticMonitoring()

      // Fase 4: Configurar otimização automática
      if (THERAPEUTIC_SYSTEM_CONFIG.optimization.autoOptimize) {
        this.startTherapeuticOptimization()
      }

      this.state = SYSTEM_STATES.READY
      this.logger.info('✅ Sistema orquestrador terapêutico inicializado')
      
      return this
    } catch (error) {
      this.logger.error('❌ Erro ao inicializar sistema terapêutico:', error)
      this.state = SYSTEM_STATES.ERROR
      throw error
    }
  }

  /**
   * Inicializa componentes terapêuticos
   */
  async initializeTherapeuticComponents() {
    this.logger.info('🔧 Inicializando componentes terapêuticos...')

    try {
      // Sistemas de métricas terapêuticas
      this.therapeuticSystems.metricsManager = metricsManager
      this.therapeuticSystems.performanceMonitor = performanceMonitor
      
      if (this.config.enableAdvancedMetricsEngine) {
        this.therapeuticSystems.advancedMetricsEngine = new AdvancedMetricsEngine()
      }
      
      if (this.config.enableErrorPatternAnalyzer) {
        this.therapeuticSystems.errorPatternAnalyzer = new ErrorPatternAnalyzer()
      }
        if (this.config.enableMultisensoryIntegration) {
        this.therapeuticSystems.multisensoryMetrics = new MultisensoryMetricsCollector()
      }
        if (this.config.enableAudioIntegration) {
        this.therapeuticSystems.audioGenerator = audioGenerator
      }
      
      if (this.config.enableTTSIntegration) {
        this.therapeuticSystems.ttsManager = ttsManager
      }        if (this.config.enableSessionIntegration) {
        this.therapeuticSystems.sessionManager = new SessionManager(this.db)
      }
      
      if (this.config.enableCognitiveAnalysis) {
        this.therapeuticSystems.cognitiveAnalyzer = new CognitiveAnalyzer(this.db)
      }
      
      if (this.config.enableTherapeuticIntegration) {
        this.therapeuticSystems.therapeuticAnalyzer = new AdvancedTherapeuticAnalyzer()
      }
      
      if (this.config.enableNeuroplasticityAnalyzer) {
        this.therapeuticSystems.neuroplasticityAnalyzer = new NeuroplasticityAnalyzer()
      }
        if (this.config.enableEmotionalAnalysis) {
        this.therapeuticSystems.emotionalAnalysisService = new EmotionalAnalysisService()
      }

      // Inicializar módulos avançados de análise cognitiva para autismo
      if (this.config.enableAutismCognitiveAnalysis) {
        this.therapeuticSystems.autismCognitiveAnalyzer = autismCognitiveAnalyzer
        await this.therapeuticSystems.autismCognitiveAnalyzer.initialize()
      }
      
      if (this.config.enableAdvancedAnalysisOrchestrator) {
        this.therapeuticSystems.advancedAnalysisOrchestrator = new AdvancedAnalysisOrchestrator()
      }
      
      if (this.config.enableAdvancedSupportCalculator) {
        this.therapeuticSystems.advancedSupportCalculator = new AdvancedSupportCalculator()
        await this.therapeuticSystems.advancedSupportCalculator.initialize()
      }
        if (this.config.enableNeuropedagogicalAnalysis) {
        this.therapeuticSystems.neuropedagogicalAnalyzer = neuropedagogicalAnalyzer
        await this.therapeuticSystems.neuropedagogicalAnalyzer.initialize()
      }      // === INICIALIZAR NOVOS ALGORITMOS ===
      
      // Analytics Systems
      if (this.config.enableBehavioralEngagement !== false) {
        this.therapeuticSystems.behavioralEngagementAnalyzer = new BehavioralEngagementAnalyzer()
        await this.therapeuticSystems.behavioralEngagementAnalyzer.initialize()
        this.logger.info('✅ BehavioralEngagementAnalyzer inicializado')
      }
        if (this.config.enableProgressReports !== false) {
        this.therapeuticSystems.progressReports = { generateProgressReport }
        this.logger.info('✅ ProgressReports integrado')
      }
      
      // Machine Learning Models (Análise comportamental) - TEMPORARIAMENTE DESABILITADOS
      /*
      if (this.config.enableBehaviorAnalysis !== false) {
        this.therapeuticSystems.behaviorAnalysisModel = new BehaviorAnalysisModel()
        await this.therapeuticSystems.behaviorAnalysisModel.initialize()
        this.logger.info('✅ BehaviorAnalysisModel inicializado')
      }
      
      if (this.config.enableCognitiveAssessment !== false) {
        this.therapeuticSystems.cognitiveAssessmentModel = new CognitiveAssessmentModel()
        this.logger.info('✅ CognitiveAssessmentModel inicializado')
      }
      
      if (this.config.enableDifficultyAdaptive !== false) {
        this.therapeuticSystems.difficultyAdaptiveModel = new DifficultyAdaptiveModel()
        this.logger.info('✅ DifficultyAdaptiveModel inicializado')
      }
      
      if (this.config.enableEmotionalState !== false) {
        this.therapeuticSystems.emotionalStateModel = new EmotionalStateModel()
        this.logger.info('✅ EmotionalStateModel inicializado')
      }
      
      if (this.config.enableLearningProgress !== false) {
        this.therapeuticSystems.learningProgressModel = new LearningProgressModel()
        this.logger.info('✅ LearningProgressModel inicializado')
      }
      
      if (this.config.enablePersonalityPredictive !== false) {
        this.therapeuticSystems.personalityPredictiveModel = new PersonalityPredictiveModel()
        this.logger.info('✅ PersonalityPredictiveModel inicializado')
      }
      
      // Predictive Analysis
      if (this.config.enablePredictiveAnalysis !== false) {
        this.therapeuticSystems.predictiveAnalysisEngine = new PredictiveAnalysisEngine()
        await this.therapeuticSystems.predictiveAnalysisEngine.initialize()
        this.logger.info('✅ PredictiveAnalysisEngine inicializado')
      }
      
      // Enhanced Adaptive Services
      if (this.config.enableAdaptiveML !== false) {
        this.therapeuticSystems.adaptiveMLService = new AdaptiveMLService()
        this.logger.info('✅ AdaptiveMLService inicializado')
      }
      
      if (this.config.enableEnhancedAdaptiveML !== false) {
        this.therapeuticSystems.enhancedAdaptiveMLService = new EnhancedAdaptiveMLService()
        this.logger.info('✅ EnhancedAdaptiveMLService inicializado')
      }
      
      if (this.config.enableAdaptiveAccessibility !== false) {
        this.therapeuticSystems.adaptiveAccessibilityManager = new AdaptiveAccessibilityManager()
        this.logger.info('✅ AdaptiveAccessibilityManager inicializado')
      }
      
      // Emotional Analysis Expanded
      if (this.config.enableIntegratedAnalysisOrchestrator !== false) {
        this.therapeuticSystems.integratedAnalysisOrchestrator = new IntegratedAnalysisOrchestrator()
        await this.therapeuticSystems.integratedAnalysisOrchestrator.initialize()
        this.logger.info('✅ IntegratedAnalysisOrchestrator inicializado')
      }
      
      if (this.config.enableEmotionalAnalysisEngine !== false) {
        this.therapeuticSystems.emotionalAnalysisEngine = new EmotionalAnalysisEngine()
        this.logger.info('✅ EmotionalAnalysisEngine inicializado')
      }
      */

      // ✅ SISTEMA DE PROFILES INTEGRADO
      if (this.config.enableProfileManagement && this.dbAdapter) {
        this.logger.info('🎯 Inicializando ProfileController...')
        this.therapeuticSystems.profileController = this.dbAdapter.getProfilesInterface()
        
        // Verificar se está inicializado
        if (this.therapeuticSystems.profileController) {
          this.logger.info('✅ ProfileController integrado ao orquestrador')
        }
      }

      if (this.config.enableProfileAnalysis && this.therapeuticSystems.profileController) {
        this.therapeuticSystems.profileAnalyzer = this.therapeuticSystems.profileController.analyzer
        this.logger.info('✅ ProfileAnalyzer integrado')
      }

      if (this.config.enableUserProfileIntegration && this.therapeuticSystems.profileController) {
        this.therapeuticSystems.userProfilesService = this.therapeuticSystems.profileController.userService
        this.logger.info('✅ UserProfilesService integrado')
      }

      this.logger.info('✅ Componentes terapêuticos inicializados')
    } catch (error) {
      this.logger.error('❌ Erro ao inicializar componentes terapêuticos:', error)
      throw error
    }
  }

  /**
   * Configura fluxo de dados terapêuticos
   * FLUXO: JOGOS → MÉTRICAS → ORQUESTRADOR → DATABASE → DASHBOARDS
   */
  async setupDataFlow() {
    this.logger.info('🔗 Configurando fluxo de dados terapêuticos...')

    try {
      // Configurar pipeline de métricas
      this.dataFlow = {
        gameInput: this.processGameInput.bind(this),
        metricsCollection: this.collectTherapeuticMetrics.bind(this),        orchestratorProcessing: this.processTherapeuticData.bind(this),
        databaseStorage: this.storeTherapeuticData.bind(this),
        dashboardOutput: this.prepareDashboardData.bind(this),
      }

      this.logger.info('✅ Fluxo de dados terapêuticos configurado')
    } catch (error) {
      this.logger.error('❌ Erro ao configurar fluxo de dados:', error)
      throw error
    }
  }

  /**
   * Processa entrada de dados dos jogos
   */
  async processGameInput(gameData) {
    try {
      this.logger.info('🎮 Processando entrada de dados do jogo...')
      
      // Validar dados de entrada
      if (!gameData || !gameData.gameId) {
        throw new Error('Dados de jogo inválidos')
      }

      // Estruturar dados para processamento
      const processedData = {
        gameId: gameData.gameId,
        userId: gameData.userId,
        sessionId: gameData.sessionId,
        timestamp: Date.now(),
        gameMetrics: gameData.metrics || {},
        interactions: gameData.interactions || [],
        performance: gameData.performance || {},
        sensoryData: gameData.sensoryData || {}
      }

      this.logger.debug('Dados do jogo processados:', processedData)
      return processedData
    } catch (error) {
      this.logger.error('❌ Erro ao processar entrada do jogo:', error)
      throw error
    }
  }

  /**
   * Coleta métricas terapêuticas
   */
  async collectTherapeuticMetrics(gameData) {
    try {
      this.logger.info('📊 Coletando métricas terapêuticas...')
      
      const metrics = {
        timestamp: Date.now(),
        userId: gameData.userId,
        gameId: gameData.gameId,
        sessionId: gameData.sessionId,
        engagement: await this.calculateEngagementMetrics(gameData),
        cognitive: await this.calculateCognitiveMetrics(gameData),
        behavioral: await this.calculateBehavioralMetrics(gameData),
        sensory: await this.calculateSensoryMetrics(gameData),
        therapeutic: await this.calculateTherapeuticMetrics(gameData)
      }

      this.logger.debug('Métricas terapêuticas coletadas:', metrics)
      return metrics
    } catch (error) {
      this.logger.error('❌ Erro ao coletar métricas terapêuticas:', error)
      return {}
    }
  }

  /**
   * Processa dados terapêuticos no orquestrador
   */
  async processTherapeuticData(metrics) {
    try {
      this.logger.info('🔄 Processando dados terapêuticos...')
      
      // Análise de padrões
      const patterns = await this.analyzeTherapeuticPatterns(metrics)
      
      // Geração de insights
      const insights = await this.generateTherapeuticInsights(metrics, patterns)
      
      // Recomendações adaptativas
      const recommendations = await this.generateAdaptiveRecommendations(insights)

      const processedData = {
        originalMetrics: metrics,
        patterns,
        insights,
        recommendations,
        timestamp: Date.now(),
        processingId: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      this.logger.debug('Dados terapêuticos processados:', processedData)
      return processedData
    } catch (error) {
      this.logger.error('❌ Erro ao processar dados terapêuticos:', error)
      throw error
    }
  }

  /**
   * Armazena dados terapêuticos no banco
   */
  async storeTherapeuticData(processedData) {
    try {
      this.logger.info('💾 Armazenando dados terapêuticos...')
      
      // Usar o GlobalDBAdapter para armazenar
      if (this.globalDBAdapter) {
        await this.globalDBAdapter.saveAnalysisResults(processedData.originalMetrics)
        await this.globalDBAdapter.saveGameSession({
          userId: processedData.originalMetrics.userId,
          gameId: processedData.originalMetrics.gameId,
          sessionId: processedData.originalMetrics.sessionId,
          metrics: processedData.originalMetrics,
          insights: processedData.insights,
          recommendations: processedData.recommendations
        })
      }

      // Também armazenar no banco principal se disponível
      if (this.databaseService) {
        await this.databaseService.store('therapeutic_data', processedData)
      }

      this.logger.info('✅ Dados terapêuticos armazenados com sucesso')
      return { success: true, id: processedData.processingId }
    } catch (error) {
      this.logger.error('❌ Erro ao armazenar dados terapêuticos:', error)
      throw error
    }
  }

  /**
   * Prepara dados para dashboards
   */
  async prepareDashboardData(processedData) {
    try {
      this.logger.info('📈 Preparando dados para dashboard...')
      
      const dashboardData = {
        summary: {
          userId: processedData.originalMetrics.userId,
          timestamp: processedData.timestamp,
          sessionCount: 1,
          lastActivity: Date.now()
        },
        metrics: {
          engagement: processedData.originalMetrics.engagement,
          cognitive: processedData.originalMetrics.cognitive,
          behavioral: processedData.originalMetrics.behavioral,
          sensory: processedData.originalMetrics.sensory
        },
        insights: processedData.insights,
        recommendations: processedData.recommendations,
        charts: await this.generateChartData(processedData),
        alerts: await this.generateAlerts(processedData)
      }

      this.logger.debug('Dados preparados para dashboard:', dashboardData)
      return dashboardData
    } catch (error) {
      this.logger.error('❌ Erro ao preparar dados para dashboard:', error)
      return null
    }
  }

  /**
   * Métodos auxiliares para cálculo de métricas
   */
  async calculateEngagementMetrics(gameData) {
    try {
      return {
        timeEngaged: gameData.sessionDuration || 0,
        interactionRate: gameData.interactions?.length || 0,
        completionRate: gameData.performance?.completionRate || 0,
        attentionSpan: gameData.performance?.attentionSpan || 0
      }
    } catch (error) {
      this.logger.error('Erro ao calcular métricas de engajamento:', error)
      return {}
    }
  }

  async calculateCognitiveMetrics(gameData) {
    try {
      return {
        processingSpeed: gameData.performance?.processingSpeed || 0,
        accuracy: gameData.performance?.accuracy || 0,
        memoryRetention: gameData.performance?.memoryRetention || 0,
        problemSolving: gameData.performance?.problemSolving || 0
      }
    } catch (error) {
      this.logger.error('Erro ao calcular métricas cognitivas:', error)
      return {}
    }
  }

  async calculateBehavioralMetrics(gameData) {
    try {
      return {
        adaptability: gameData.behavioral?.adaptability || 0,
        frustrationTolerance: gameData.behavioral?.frustrationTolerance || 0,
        socialInteraction: gameData.behavioral?.socialInteraction || 0,
        selfRegulation: gameData.behavioral?.selfRegulation || 0
      }
    } catch (error) {
      this.logger.error('Erro ao calcular métricas comportamentais:', error)
      return {}
    }
  }

  async calculateSensoryMetrics(gameData) {
    try {
      return {
        visualProcessing: gameData.sensoryData?.visualProcessing || 0,
        auditoryProcessing: gameData.sensoryData?.auditoryProcessing || 0,
        tactileResponse: gameData.sensoryData?.tactileResponse || 0,
        sensoryIntegration: gameData.sensoryData?.sensoryIntegration || 0
      }
    } catch (error) {
      this.logger.error('Erro ao calcular métricas sensoriais:', error)
      return {}
    }
  }

  async calculateTherapeuticMetrics(gameData) {
    try {
      return {
        therapeuticGoals: gameData.therapeutic?.goals || [],
        progress: gameData.therapeutic?.progress || 0,
        milestones: gameData.therapeutic?.milestones || [],
        effectiveness: gameData.therapeutic?.effectiveness || 0
      }
    } catch (error) {
      this.logger.error('Erro ao calcular métricas terapêuticas:', error)
      return {}
    }
  }

  async analyzeTherapeuticPatterns(metrics) {
    try {
      return {
        engagementPatterns: this.identifyEngagementPatterns(metrics.engagement),
        cognitivePatterns: this.identifyCognitivePatterns(metrics.cognitive),
        behavioralPatterns: this.identifyBehavioralPatterns(metrics.behavioral),
        sensoryPatterns: this.identifySensoryPatterns(metrics.sensory)
      }
    } catch (error) {
      this.logger.error('Erro ao analisar padrões terapêuticos:', error)
      return {}
    }
  }

  async generateTherapeuticInsights(metrics, patterns) {
    try {
      return {
        strengths: this.identifyStrengths(metrics, patterns),
        challenges: this.identifyChallenges(metrics, patterns),
        opportunities: this.identifyOpportunities(metrics, patterns),
        recommendations: this.generateBasicRecommendations(metrics, patterns)
      }
    } catch (error) {
      this.logger.error('Erro ao gerar insights terapêuticos:', error)
      return {}
    }
  }

  async generateChartData(processedData) {
    try {
      return {
        engagement: processedData.originalMetrics.engagement,
        cognitive: processedData.originalMetrics.cognitive,
        behavioral: processedData.originalMetrics.behavioral,
        sensory: processedData.originalMetrics.sensory
      }
    } catch (error) {
      this.logger.error('Erro ao gerar dados de gráfico:', error)
      return {}
    }
  }

  async generateAlerts(processedData) {
    try {
      const alerts = []
      
      // Verificar métricas baixas
      if (processedData.originalMetrics.engagement?.timeEngaged < 60) {
        alerts.push({
          type: 'warning',
          message: 'Baixo tempo de engajamento detectado',
          timestamp: Date.now()
        })
      }

      return alerts
    } catch (error) {
      this.logger.error('Erro ao gerar alertas:', error)
      return []
    }
  }

  // Métodos auxiliares para análise de padrões
  identifyEngagementPatterns(engagement) {
    return {
      trend: engagement.timeEngaged > 300 ? 'high' : 'low',
      consistency: engagement.interactionRate > 5 ? 'consistent' : 'inconsistent'
    }
  }

  identifyCognitivePatterns(cognitive) {
    return {
      processing: cognitive.processingSpeed > 70 ? 'fast' : 'slow',
      accuracy: cognitive.accuracy > 80 ? 'high' : 'low'
    }
  }

  identifyBehavioralPatterns(behavioral) {
    return {
      adaptability: behavioral.adaptability > 70 ? 'high' : 'low',
      regulation: behavioral.selfRegulation > 70 ? 'good' : 'needs_support'
    }
  }

  identifySensoryPatterns(sensory) {
    return {
      visual: sensory.visualProcessing > 70 ? 'strong' : 'weak',
      auditory: sensory.auditoryProcessing > 70 ? 'strong' : 'weak'
    }
  }

  identifyStrengths(metrics, patterns) {
    const strengths = []
    if (patterns.cognitivePatterns?.accuracy === 'high') {
      strengths.push('Alta precisão cognitiva')
    }
    if (patterns.engagementPatterns?.trend === 'high') {
      strengths.push('Alto engajamento')
    }
    return strengths
  }

  identifyChallenges(metrics, patterns) {
    const challenges = []
    if (patterns.behavioralPatterns?.regulation === 'needs_support') {
      challenges.push('Autorregulação necessita suporte')
    }
    if (patterns.sensoryPatterns?.visual === 'weak') {
      challenges.push('Processamento visual fraco')
    }
    return challenges
  }

  identifyOpportunities(metrics, patterns) {
    const opportunities = []
    if (patterns.engagementPatterns?.trend === 'low') {
      opportunities.push('Aumentar estratégias de engajamento')
    }
    if (patterns.cognitivePatterns?.processing === 'slow') {
      opportunities.push('Implementar exercícios de velocidade de processamento')
    }
    return opportunities
  }

  generateBasicRecommendations(metrics, patterns) {
    const recommendations = []
    
    if (patterns.engagementPatterns?.trend === 'low') {
      recommendations.push({
        type: 'engagement',
        priority: 'high',
        action: 'Implementar mais elementos interativos'
      })
    }
    
    if (patterns.behavioralPatterns?.regulation === 'needs_support') {
      recommendations.push({
        type: 'behavioral',
        priority: 'medium',
        action: 'Adicionar técnicas de autorregulação'
      })
    }
    
    return recommendations
  }

  /**
   * Inicia monitoramento do sistema
   */
  startSystemMonitoring() {
    if (!AUTISM_SYSTEM_CONFIG.monitoring.enabled) return

    this.logger.info('📊 Iniciando monitoramento do sistema...')

    const monitoringInterval = setInterval(() => {
      this.collectSystemMetrics()
      this.checkSystemHealth()
    }, AUTISM_SYSTEM_CONFIG.monitoring.interval)

    this.intervals.set('monitoring', monitoringInterval)
  }

  /**
   * Coleta métricas do sistema
   */
  collectSystemMetrics() {
    try {
      const metrics = {
        timestamp: Date.now(),
        uptime: Date.now() - this.statistics.startTime,
        memoryUsage: process.memoryUsage(),
        systemState: this.state,
        activeComponents: this.components.size,
        activeIntegrations: this.integrations.size,
      }

      this.systemMetrics.set(metrics.timestamp, metrics)
      this.updateStatistics(metrics)

      // Limitar histórico de métricas
      const cutoff = Date.now() - AUTISM_SYSTEM_CONFIG.monitoring.retentionPeriod
      for (const [timestamp] of this.systemMetrics) {
        if (timestamp < cutoff) {
          this.systemMetrics.delete(timestamp)
        }
      }
    } catch (error) {
      this.logger.error('❌ Erro ao coletar métricas:', error)
    }
  }

  /**
   * Verifica saúde do sistema
   */
  checkSystemHealth() {
    try {
      const currentMetrics = Array.from(this.systemMetrics.values()).slice(-1)[0]
      if (!currentMetrics) return

      const thresholds = AUTISM_SYSTEM_CONFIG.performanceThresholds
      const alerts = []

      // Verificar uso de memória
      const memoryUsageMB = currentMetrics.memoryUsage.heapUsed / 1024 / 1024
      if (memoryUsageMB > thresholds.memoryUsage) {
        alerts.push({
          type: 'memory',
          level: 'warning',
          message: `Alto uso de memória: ${memoryUsageMB.toFixed(2)}MB`,
        })
      }

      // Verificar taxa de erro
      const errorRate = this.statistics.totalErrors / Math.max(this.statistics.totalRequests, 1)
      if (errorRate > thresholds.errorRate) {
        alerts.push({
          type: 'error_rate',
          level: 'critical',
          message: `Alta taxa de erro: ${(errorRate * 100).toFixed(2)}%`,
        })
      }

      // Processar alertas
      alerts.forEach(alert => {
        this.logger.warn(`⚠️ [${alert.level.toUpperCase()}] ${alert.message}`)
        this.handleSystemAlert(alert)
      })

    } catch (error) {
      this.logger.error('❌ Erro ao verificar saúde do sistema:', error)
    }
  }

  /**
   * Trata alertas do sistema
   */
  handleSystemAlert(alert) {
    try {
      switch (alert.type) {
        case 'memory':
          if (this.existingSystems.intelligentCache) {
            this.existingSystems.intelligentCache.cleanup()
          }
          break
        case 'error_rate':
          this.state = SYSTEM_STATES.MAINTENANCE
          this.logger.info('🔧 Sistema em modo manutenção devido a alta taxa de erro')
          break
      }    } catch (error) {
      this.logger.error('❌ Erro ao tratar alerta:', error)
    }
  }

  /**
   * Inicia monitoramento terapêutico específico
   */
  startTherapeuticMonitoring() {
    try {
      this.logger.info('🏥 Iniciando monitoramento terapêutico...')

      // Monitoramento de sessões terapêuticas
      const therapeuticInterval = setInterval(() => {
        this.collectTherapeuticMetrics()
        this.analyzeTherapeuticProgress()
        this.checkTherapeuticGoals()
      }, THERAPEUTIC_SYSTEM_CONFIG?.monitoring?.interval || 30000)

      this.intervals.set('therapeutic-monitoring', therapeuticInterval)

      // Configurar alertas terapêuticos
      this.setupTherapeuticAlerts()

      this.logger.info('✅ Monitoramento terapêutico iniciado')
    } catch (error) {
      this.logger.error('❌ Erro ao iniciar monitoramento terapêutico:', error)
    }
  }

  /**
   * Inicia otimização terapêutica automática
   */
  startTherapeuticOptimization() {
    try {
      this.logger.info('🎯 Iniciando otimização terapêutica...')

      // Otimização periódica
      const optimizationInterval = setInterval(() => {
        this.performTherapeuticOptimization()
      }, THERAPEUTIC_SYSTEM_CONFIG?.optimization?.interval || 60000)

      this.intervals.set('therapeutic-optimization', optimizationInterval)

      // Configurar análise adaptativa
      this.setupAdaptiveAnalysis()

      this.logger.info('✅ Otimização terapêutica iniciada')
    } catch (error) {
      this.logger.error('❌ Erro ao iniciar otimização terapêutica:', error)
    }
  }

  /**
   * Coleta métricas terapêuticas específicas
   */
  collectTherapeuticMetrics() {
    try {
      const metrics = {
        timestamp: Date.now(),
        activeSessions: this.getActiveTherapeuticSessions(),
        engagementLevels: this.calculateCurrentEngagementLevels(),
        progressMetrics: this.getCurrentProgressMetrics(),
        adaptationMetrics: this.getAdaptationMetrics()
      }

      // Armazenar métricas
      if (this.therapeuticMetrics) {
        this.therapeuticMetrics.set(metrics.timestamp, metrics)
      }

      return metrics
    } catch (error) {
      this.logger.error('❌ Erro ao coletar métricas terapêuticas:', error)
      return {}
    }
  }

  /**
   * Analisa progresso terapêutico
   */
  analyzeTherapeuticProgress() {
    try {
      // Implementar análise de progresso
      this.logger.debug('🔍 Analisando progresso terapêutico...')
    } catch (error) {
      this.logger.error('❌ Erro ao analisar progresso terapêutico:', error)
    }
  }

  /**
   * Verifica objetivos terapêuticos
   */
  checkTherapeuticGoals() {
    try {
      // Implementar verificação de objetivos
      this.logger.debug('🎯 Verificando objetivos terapêuticos...')
    } catch (error) {
      this.logger.error('❌ Erro ao verificar objetivos terapêuticos:', error)
    }
  }

  /**
   * Configura alertas terapêuticos
   */
  setupTherapeuticAlerts() {
    try {
      this.logger.debug('⚠️ Configurando alertas terapêuticos...')
      // Implementar configuração de alertas
    } catch (error) {
      this.logger.error('❌ Erro ao configurar alertas terapêuticos:', error)
    }
  }

  /**
   * Executa otimização terapêutica
   */
  performTherapeuticOptimization() {
    try {
      this.logger.debug('⚡ Executando otimização terapêutica...')
      // Implementar otimização
    } catch (error) {
      this.logger.error('❌ Erro ao executar otimização terapêutica:', error)
    }
  }

  /**
   * Configura análise adaptativa
   */
  setupAdaptiveAnalysis() {
    try {
      this.logger.debug('🧠 Configurando análise adaptativa...')
      // Implementar análise adaptativa
    } catch (error) {
      this.logger.error('❌ Erro ao configurar análise adaptativa:', error)
    }
  }

  /**
   * Métodos auxiliares para métricas terapêuticas
   */
  getActiveTherapeuticSessions() {
    return 0 // Placeholder
  }

  calculateCurrentEngagementLevels() {
    return {} // Placeholder
  }

  getCurrentProgressMetrics() {
    return {} // Placeholder
  }

  getAdaptationMetrics() {
    return {} // Placeholder
  }

  /**
   * Configura aprendizado cruzado entre sistemas
   */
  async setupCrossSystemLearning() {
    this.logger.info('🧠 Configurando cross-system learning...')

    try {
      // Configurar sincronização entre sistemas de métricas
      const metricsSync = setInterval(() => {
        this.syncMetricsSystems()
      }, this.config.systemSyncInterval)

      this.intervals.set('metrics-sync', metricsSync)

      // Configurar aprendizado preditivo
      if (this.existingSystems.predictiveAnalysisEngine) {
        const learningSync = setInterval(() => {
          this.updatePredictiveLearning()
        }, this.config.orchestrationInterval)

        this.intervals.set('learning-sync', learningSync)
      }

      this.logger.info('✅ Cross-system learning configurado')
    } catch (error) {
      this.logger.error('❌ Erro ao configurar cross-system learning:', error)
    }
  }

  /**
   * Sincroniza sistemas de métricas
   */
  syncMetricsSystems() {
    try {
      if (this.newSystems.mlMetricsCollector && this.existingSystems.metricsManager) {
        // Sincronizar dados entre sistemas novo e existente
        const newMetrics = this.newSystems.mlMetricsCollector.getLatestMetrics()
        const existingMetrics = this.existingSystems.metricsManager.getCurrentMetrics()

        // Cross-learning entre sistemas
        this.performCrossSystemLearning(newMetrics, existingMetrics)
      }
    } catch (error) {
      this.logger.error('❌ Erro na sincronização de métricas:', error)
    }
  }

  /**
   * Executa aprendizado cruzado
   */
  performCrossSystemLearning(newMetrics, existingMetrics) {
    try {
      if (!newMetrics || !existingMetrics) return

      // Combinar insights dos dois sistemas
      const combinedInsights = {
        timestamp: Date.now(),
        newSystemAccuracy: newMetrics.accuracy || 0,
        existingSystemAccuracy: existingMetrics.accuracy || 0,
        combinedAccuracy: (newMetrics.accuracy + existingMetrics.accuracy) / 2,
        learningRate: this.config.crossSystemLearningRate,
      }

      // Atualizar modelo combinado se disponível
      if (this.newSystems.machineLearningOrchestrator) {
        this.newSystems.machineLearningOrchestrator.updateCombinedModel(combinedInsights)
      }

      this.logger.debug('🧠 Cross-system learning executado', combinedInsights)
    } catch (error) {
      this.logger.error('❌ Erro no cross-system learning:', error)
    }
  }

  /**
   * Atualiza aprendizado preditivo
   */
  updatePredictiveLearning() {
    try {
      if (!this.existingSystems.predictiveAnalysisEngine) return

      const recentMetrics = Array.from(this.systemMetrics.values()).slice(-10)
      if (recentMetrics.length < 5) return

      // Análise preditiva baseada em métricas recentes
      const prediction = this.existingSystems.predictiveAnalysisEngine.predict(recentMetrics)
      
      if (prediction && prediction.confidence > this.config.confidenceThreshold) {
        this.handlePredictiveInsight(prediction)
      }
    } catch (error) {
      this.logger.error('❌ Erro no aprendizado preditivo:', error)
    }
  }

  /**
   * Trata insights preditivos
   */
  handlePredictiveInsight(prediction) {
    try {
      this.logger.info('🔮 Insight preditivo recebido:', prediction)

      // Ações baseadas na predição
      if (prediction.type === 'performance_degradation') {
        this.triggerOptimization()
      } else if (prediction.type === 'user_engagement_drop') {
        this.adjustUserExperience(prediction.recommendations)
      }
    } catch (error) {
      this.logger.error('❌ Erro ao tratar insight preditivo:', error)
    }
  }

  /**
   * Inicia otimização automática
   */
  startAutoOptimization() {
    this.logger.info('⚙️ Iniciando otimização automática...')

    const optimizationInterval = setInterval(() => {
      this.performAutoOptimization()
    }, AUTISM_SYSTEM_CONFIG.optimization.optimizationInterval)

    this.intervals.set('optimization', optimizationInterval)
  }

  /**
   * Executa otimização automática
   */
  async performAutoOptimization() {
    try {
      if (this.statistics.optimizationCycles >= AUTISM_SYSTEM_CONFIG.optimization.maxOptimizationCycles) {
        this.logger.info('🛑 Limite de ciclos de otimização atingido')
        return
      }

      this.logger.info('⚙️ Executando ciclo de otimização...')
      this.state = SYSTEM_STATES.OPTIMIZING

      // Coletar métricas atuais
      const currentMetrics = this.getUnifiedStatistics()
      
      // Executar otimizações nos sistemas
      await this.optimizeSystemPerformance()
      await this.optimizeUserExperience()
      await this.optimizeTherapeuticOutcomes()

      // Atualizar estatísticas
      this.statistics.optimizationCycles++
      this.statistics.lastOptimization = Date.now()

      this.state = SYSTEM_STATES.RUNNING
      this.logger.info('✅ Ciclo de otimização concluído')
    } catch (error) {
      this.logger.error('❌ Erro na otimização automática:', error)
      this.state = SYSTEM_STATES.ERROR
    }
  }

  /**
   * Otimiza performance do sistema
   */
  async optimizeSystemPerformance() {
    try {
      // Otimizar cache
      if (this.existingSystems.intelligentCache) {
        await this.existingSystems.intelligentCache.optimize()
      }

      // Otimizar estruturas de dados
      if (this.newSystems.dataStructuresOptimizer) {
        await this.newSystems.dataStructuresOptimizer.optimize()
      }

      // Limpeza de memória
      if (global.gc) {
        global.gc()
      }
    } catch (error) {
      this.logger.error('❌ Erro na otimização de performance:', error)
    }
  }

  /**
   * Otimiza experiência do usuário
   */
  async optimizeUserExperience() {
    try {
      // Ajustar configurações sensoriais
      if (this.existingSystems.multisensoryMetrics) {
        const sensoryData = await this.existingSystems.multisensoryMetrics.getOptimalSettings()
        await this.applySensoryOptimizations(sensoryData)
      }

      // Otimizar acessibilidade
      if (this.existingSystems.accessibilityService) {
        await this.existingSystems.accessibilityService.optimize()
      }
    } catch (error) {
      this.logger.error('❌ Erro na otimização de UX:', error)
    }
  }

  /**
   * Otimiza resultados terapêuticos
   */
  async optimizeTherapeuticOutcomes() {
    try {
      if (this.existingSystems.therapeuticAnalyzer) {
        const recommendations = await this.existingSystems.therapeuticAnalyzer.getOptimizationRecommendations()
        await this.applyTherapeuticOptimizations(recommendations)
      }
    } catch (error) {
      this.logger.error('❌ Erro na otimização terapêutica:', error)
    }
  }

  /**
   * Aplica otimizações sensoriais
   */
  async applySensoryOptimizations(sensoryData) {
    try {
      if (sensoryData && sensoryData.recommendations) {
        // Aplicar ajustes visuais
        if (sensoryData.recommendations.visual) {
          this.logger.info('👁️ Aplicando otimizações visuais')
        }

        // Aplicar ajustes auditivos
        if (sensoryData.recommendations.auditory && this.existingSystems.audioGenerator) {
          await this.existingSystems.audioGenerator.adjustSettings(sensoryData.recommendations.auditory)
        }

        // Aplicar ajustes táteis
        if (sensoryData.recommendations.tactile) {
          this.logger.info('👋 Aplicando otimizações táteis')
        }
      }
    } catch (error) {
      this.logger.error('❌ Erro ao aplicar otimizações sensoriais:', error)
    }
  }

  /**
   * Aplica otimizações terapêuticas
   */
  async applyTherapeuticOptimizations(recommendations) {
    try {
      if (recommendations) {
        this.logger.info('🩺 Aplicando otimizações terapêuticas:', recommendations)
        
        // Aplicar recomendações específicas
        if (recommendations.sessionDuration) {
          // Ajustar duração da sessão
        }
        
        if (recommendations.difficultyLevel) {
          // Ajustar nível de dificuldade
        }
        
        if (recommendations.interactionFrequency) {
          // Ajustar frequência de interações
        }
      }
    } catch (error) {
      this.logger.error('❌ Erro ao aplicar otimizações terapêuticas:', error)
    }
  }

  /**
   * Dispara otimização manual
   */
  triggerOptimization() {
    this.logger.info('🚀 Disparando otimização manual...')
    this.performAutoOptimization()
  }

  /**
   * Ajusta experiência do usuário baseada em recomendações
   */
  adjustUserExperience(recommendations) {
    try {
      if (recommendations) {
        this.logger.info('🎯 Ajustando experiência do usuário:', recommendations)
        
        // Implementar ajustes específicos baseados nas recomendações
        recommendations.forEach(rec => {
          switch (rec.type) {
            case 'sensory_adjustment':
              this.applySensoryOptimizations({ recommendations: rec.data })
              break
            case 'cognitive_load_reduction':
              if (this.existingSystems.cognitiveAnalyzer) {
                this.existingSystems.cognitiveAnalyzer.reduceCognitiveLoad(rec.data)
              }
              break
            case 'interaction_modification':
              this.modifyInteractionPatterns(rec.data)
              break
          }
        })
      }
    } catch (error) {
      this.logger.error('❌ Erro ao ajustar experiência do usuário:', error)
    }
  }

  /**
   * Modifica padrões de interação
   */
  modifyInteractionPatterns(data) {
    try {
      this.logger.info('🔄 Modificando padrões de interação:', data)
      
      // Implementar modificações nos padrões de interação
      if (data.responseTime) {
        // Ajustar tempo de resposta
      }
      
      if (data.feedbackFrequency) {
        // Ajustar frequência de feedback
      }
      
      if (data.visualCues) {
        // Ajustar pistas visuais
      }
    } catch (error) {
      this.logger.error('❌ Erro ao modificar padrões de interação:', error)
    }
  }

  /**
   * Atualiza estatísticas do sistema
   */
  updateStatistics(metrics) {
    try {
      this.statistics.uptime = metrics.uptime
      this.statistics.memoryUsage = metrics.memoryUsage.heapUsed / 1024 / 1024 // MB
      
      // Calcular métricas derivadas
      const recentMetrics = Array.from(this.systemMetrics.values()).slice(-10)
      if (recentMetrics.length > 0) {
        const avgResponseTime = recentMetrics.reduce((sum, m) => sum + (m.responseTime || 0), 0) / recentMetrics.length
        this.statistics.averageResponseTime = avgResponseTime
      }
    } catch (error) {
      this.logger.error('❌ Erro ao atualizar estatísticas:', error)
    }
  }

  /**
   * Obtém estatísticas unificadas do sistema
   */
  getUnifiedStatistics() {
    const uptime = Date.now() - this.statistics.startTime
    
    return {
      state: this.state,
      uptime: uptime,
      totalSessions: this.statistics.totalSessions || 0,
      totalRequests: this.statistics.totalRequests || 0,
      totalErrors: this.statistics.totalErrors || 0,
      averageResponseTime: this.statistics.averageResponseTime || 0,
      memoryUsage: this.statistics.memoryUsage || 0,
      cpuUsage: this.statistics.cpuUsage || 0,
      optimizationCycles: this.statistics.optimizationCycles || 0,
      lastOptimization: this.statistics.lastOptimization,
      therapeuticGoalsAchieved: this.statistics.therapeuticGoalsAchieved || 0,
      userSatisfactionScore: this.statistics.userSatisfactionScore || 0,
      componentsActive: this.components.size,
      integrationsActive: this.integrations.size,
      systemHealth: this.getSystemHealth()
    }
  }

  /**
   * Obtém status geral de saúde do sistema
   */
  getSystemHealth() {
    try {
      const componentHealth = this.getComponentsStatus()
      const totalComponents = Object.keys(componentHealth).length
      const activeComponents = Object.values(componentHealth).filter((c) => c.active).length
      const errorComponents = Object.values(componentHealth).filter((c) => c.hasError).length

      const healthScore = totalComponents > 0 ? activeComponents / totalComponents : 1

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
    } catch (error) {
      this.logger.error('❌ Erro ao obter saúde do sistema:', error)
      return {
        status: 'error',
        score: 0,
        totalComponents: 0,
        activeComponents: 0,
        errorComponents: 1,
        uptime: 0,
      }
    }
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
   * Obtém tempo de funcionamento do sistema
   */
  getUptime() {
    return Date.now() - this.statistics.startTime
  }

  /**
   * Processa eventos do sistema
   */
  async processEvent(event) {
    try {
      this.statistics.totalRequests++
      
      const startTime = Date.now()
      
      this.logger.debug('📨 Processando evento:', event.type)

      let result = null      // Roteamento baseado no tipo de evento
      switch (event.type) {
        case 'game_start':
          result = await this.handleGameStart(event.data)
          break
        case 'game_end':
          result = await this.handleGameEnd(event.data)
          break
        case 'user_interaction':
          result = await this.handleUserInteraction(event.data)
          break
        case 'metrics_update':
          result = await this.handleMetricsUpdate(event.data)
          break
        case 'therapeutic_session':
          result = await this.handleTherapeuticSession(event.data)
          break
        case 'system_optimization':
          result = await this.handleSystemOptimization(event.data)
          break
        // ✅ EVENTOS DE PROFILES INTEGRADOS
        case 'profile_created':
          result = await this.handleProfileCreated(event.data)
          break
        case 'profile_updated':
          result = await this.handleProfileUpdated(event.data)
          break
        case 'profile_analyzed':
          result = await this.handleProfileAnalyzed(event.data)
          break
        case 'user_profile_interaction':
          result = await this.handleUserProfileInteraction(event.data)
          break
        default:
          this.logger.warn('⚠️ Tipo de evento não reconhecido:', event.type)
          result = { status: 'unknown_event_type', type: event.type }
      }

      const responseTime = Date.now() - startTime
      this.logger.debug(`✅ Evento processado em ${responseTime}ms`)

      return {
        success: true,
        responseTime,
        result,
        timestamp: Date.now(),
      }
    } catch (error) {
      this.statistics.totalErrors++
      this.logger.error('❌ Erro ao processar evento:', error)
      
      return {
        success: false,
        error: error.message,
        timestamp: Date.now(),
      }
    }
  }

  /**
   * Manipula início de jogo
   */
  async handleGameStart(data) {
    try {
      this.logger.info('🎮 Iniciando jogo:', data.gameId)

      // Incrementar contadores de uso
      if (this.config.enableGameUsageTracking) {
        await incrementGameUsage(data.gameId)
      }

      // Inicializar sessão se necessário
      if (this.existingSystems.sessionManager) {
        await this.existingSystems.sessionManager.startSession({
          type: 'game',
          gameId: data.gameId,
          userId: data.userId,
          timestamp: Date.now(),
        })
      }

      // Preparar sistemas de análise
      if (this.existingSystems.cognitiveAnalyzer) {
        await this.existingSystems.cognitiveAnalyzer.prepareForGame(data.gameId)
      }

      return {
        status: 'game_started',
        gameId: data.gameId,
        sessionId: this.existingSystems.sessionManager?.getCurrentSessionId(),
      }
    } catch (error) {
      this.logger.error('❌ Erro ao iniciar jogo:', error)
      throw error
    }
  }

  /**
   * Manipula fim de jogo
   */
  async handleGameEnd(data) {
    try {
      this.logger.info('🏁 Finalizando jogo:', data.gameId)

      // Coletar métricas finais
      const gameMetrics = await this.collectGameMetrics(data)

      // Análise cognitiva
      if (this.existingSystems.cognitiveAnalyzer) {
        const cognitiveAnalysis = await this.existingSystems.cognitiveAnalyzer.analyzeGameSession(data)
        gameMetrics.cognitiveAnalysis = cognitiveAnalysis
      }

      // Análise emocional
      if (this.existingSystems.emotionalAnalysisService) {
        const emotionalAnalysis = await this.existingSystems.emotionalAnalysisService.analyzeSession(data)
        gameMetrics.emotionalAnalysis = emotionalAnalysis
      }

      // Atualizar neuroplasticidade
      if (this.existingSystems.neuroplasticityAnalyzer) {
        await this.existingSystems.neuroplasticityAnalyzer.updateFromGameSession(gameMetrics)
      }

      // Finalizar sessão
      if (this.existingSystems.sessionManager) {
        await this.existingSystems.sessionManager.endSession(gameMetrics)
      }

      return {
        status: 'game_ended',
        gameId: data.gameId,
        metrics: gameMetrics,
      }
    } catch (error) {
      this.logger.error('❌ Erro ao finalizar jogo:', error)
      throw error
    }
  }

  /**
   * Coleta métricas do jogo
   */
  async collectGameMetrics(data) {
    try {
      const metrics = {
        gameId: data.gameId,
        duration: data.duration,
        score: data.score,
        errors: data.errors,
        completionRate: data.completionRate,
        timestamp: Date.now(),
      }

      // Adicionar métricas avançadas se disponíveis
      if (this.existingSystems.advancedMetricsEngine) {
        const advancedMetrics = await this.existingSystems.advancedMetricsEngine.collectGameMetrics(data)
        Object.assign(metrics, advancedMetrics)
      }

      // Adicionar métricas multissensoriais
      if (this.existingSystems.multisensoryMetrics) {
        const sensoryMetrics = await this.existingSystems.multisensoryMetrics.collectMetrics(data)
        metrics.sensoryMetrics = sensoryMetrics
      }

      return metrics
    } catch (error) {
      this.logger.error('❌ Erro ao coletar métricas do jogo:', error)
      return data
    }
  }

  /**
   * Manipula interação do usuário
   */
  async handleUserInteraction(data) {
    try {
      this.logger.debug('👤 Processando interação do usuário:', data.type)

      // Análise cognitiva da interação
      if (this.existingSystems.cognitiveAnalyzer) {
        await this.existingSystems.cognitiveAnalyzer.analyzeInteraction(data)
      }

      // Análise emocional
      if (this.existingSystems.emotionalAnalysisService) {
        await this.existingSystems.emotionalAnalysisService.analyzeInteraction(data)
      }

      // Rastreamento de padrões de erro
      if (this.existingSystems.errorPatternAnalyzer && data.isError) {
        await this.existingSystems.errorPatternAnalyzer.recordError(data)
      }

      // Atualização preditiva
      if (this.existingSystems.predictiveAnalysisEngine) {
        await this.existingSystems.predictiveAnalysisEngine.updateFromInteraction(data)
      }

      return {
        status: 'interaction_processed',
        type: data.type,
        timestamp: Date.now(),
      }
    } catch (error) {
      this.logger.error('❌ Erro ao processar interação:', error)
      throw error
    }
  }

  /**
   * Manipula atualização de métricas
   */
  async handleMetricsUpdate(data) {
    try {
      this.logger.debug('📊 Atualizando métricas')

      // Atualizar sistemas de métricas
      if (this.existingSystems.metricsManager) {
        await this.existingSystems.metricsManager.updateMetrics(data)
      }

      if (this.newSystems.mlMetricsCollector) {
        await this.newSystems.mlMetricsCollector.collectMetrics(data)
      }

      // Sincronizar entre sistemas
      this.syncMetricsSystems()

      return {
        status: 'metrics_updated',
        timestamp: Date.now(),
      }
    } catch (error) {
      this.logger.error('❌ Erro ao atualizar métricas:', error)
      throw error
    }
  }

  /**
   * Manipula sessão terapêutica
   */
  async handleTherapeuticSession(data) {
    try {
      this.logger.info('🩺 Processando sessão terapêutica')

      // Análise terapêutica
      if (this.existingSystems.therapeuticAnalyzer) {
        const analysis = await this.existingSystems.therapeuticAnalyzer.analyzeSession(data)
        data.therapeuticAnalysis = analysis
      }

      // Rastreamento de neuroplasticidade
      if (this.existingSystems.neuroplasticityAnalyzer) {
        await this.existingSystems.neuroplasticityAnalyzer.trackTherapeuticProgress(data)
      }

      // Atualizar objetivos terapêuticos
      if (data.therapeuticAnalysis && data.therapeuticAnalysis.goalsAchieved > 0) {
        this.statistics.therapeuticGoalsAchieved += data.therapeuticAnalysis.goalsAchieved
      }

      return {
        status: 'therapeutic_session_processed',
        analysis: data.therapeuticAnalysis,
        timestamp: Date.now(),
      }
    } catch (error) {
      this.logger.error('❌ Erro ao processar sessão terapêutica:', error)
      throw error
    }
  }

  /**
   * Manipula otimização do sistema
   */
  async handleSystemOptimization(data) {
    try {
      this.logger.info('⚙️ Processando otimização do sistema')

      // Executar otimização baseada nos dados fornecidos
      if (data.type === 'performance') {
        await this.optimizeSystemPerformance()
      } else if (data.type === 'user_experience') {
        await this.optimizeUserExperience()
      } else if (data.type === 'therapeutic') {
        await this.optimizeTherapeuticOutcomes()
      } else {
        // Otimização completa
        await this.performAutoOptimization()
      }

      return {
        status: 'system_optimized',
        type: data.type || 'full',
        timestamp: Date.now(),
      }
    } catch (error) {
      this.logger.error('❌ Erro ao otimizar sistema:', error)
      throw error
    }
  }

  // ==========================================
  // HANDLERS DE EVENTOS DE PROFILES
  // ==========================================

  /**
   * Processa criação de profile
   */
  async handleProfileCreated(data) {
    try {
      this.logger.info('👤 Processando criação de profile:', data.profileId)
      
      // Atualizar estatísticas
      this.statistics.profilesCreated++
      this.statistics.totalProfiles++
      
      // Coletar métricas do novo profile
      if (this.therapeuticSystems.profileController) {
        const profileMetrics = await this.therapeuticSystems.profileController.getProfile(data.profileId)
        
        // Integrar com análise terapêutica
        if (this.therapeuticSystems.therapeuticAnalyzer && profileMetrics) {
          await this.integrateProfileWithTherapeuticAnalysis(profileMetrics)
        }
      }
      
      this.logger.info('✅ Profile criado e integrado ao sistema')
      
      return { 
        status: 'profile_created_processed',
        profileId: data.profileId,
        integrated: true 
      }
    } catch (error) {
      this.logger.error('❌ Erro ao processar criação de profile:', error)
      throw error
    }
  }
  /**
   * Processa atualização de profile
   */
  async handleProfileUpdated(data) {
    try {
      this.logger.info('🔄 Processando atualização de profile:', data.profileId)
      
      // Coletar dados atualizados
      if (this.therapeuticSystems.profileController) {
        const updatedProfile = await this.therapeuticSystems.profileController.getProfile(data.profileId)
        
        // Reanalizar com novos dados
        if (this.therapeuticSystems.therapeuticAnalyzer) {
          await this.integrateProfileWithTherapeuticAnalysis(updatedProfile)
        }
      }
      
      return {
        status: 'profile_updated_processed',
        profileId: data.profileId,
        updated: true
      }
    } catch (error) {
      this.logger.error('❌ Erro ao processar atualização de profile:', error)
      throw error
    }
  }
  /**
   * Processa análise de profile
   */
  async handleProfileAnalyzed(data) {
    try {
      this.logger.info('🧠 Processando análise de profile:', data.profileId)
      
      // Atualizar estatísticas
      this.statistics.profilesAnalyzed++
      
      // Integrar insights com métricas gerais
      if (data.insights && this.therapeuticSystems.advancedMetricsEngine) {
        await this.integrateProfileInsights(data.insights)
      }
      
      // Gerar recomendações terapêuticas
      if (this.therapeuticSystems.therapeuticAnalyzer) {
        const recommendations = await this.generateTherapeuticRecommendations(data)
        
        return {
          status: 'profile_analyzed_processed',
          profileId: data.profileId,
          insights: data.insights,
          recommendations
        }
      }
      
      return {
        status: 'profile_analyzed_processed',
        profileId: data.profileId,
        insights: data.insights
      }
    } catch (error) {
      this.logger.error('❌ Erro ao processar análise de profile:', error)
      throw error
    }
  }

  /**
   * Processa interação de usuário com profile
   */
  async handleUserProfileInteraction(data) {
    try {
      this.logger.info('👆 Processando interação de usuário:', data.userId)
      
      // Atualizar estatísticas
      this.statistics.userInteractions++
      
      // Coletar métricas de engajamento
      const engagementData = {
        userId: data.userId,
        profileId: data.profileId,
        interactionType: data.type,
        timestamp: Date.now(),
        duration: data.duration || 0
      }
      
      // Analisar padrões de engajamento
      if (this.therapeuticSystems.profileAnalyzer) {
        await this.analyzeEngagementPatterns(engagementData)
      }
      
      // Atualizar média de engajamento
      await this.updateEngagementMetrics(engagementData)
      
      return {
        status: 'user_profile_interaction_processed',
        userId: data.userId,
        profileId: data.profileId,
        engagementTracked: true
      }
    } catch (error) {
      this.logger.error('❌ Erro ao processar interação de usuário:', error)
      throw error
    }
  }

  // ==========================================
  // MÉTODOS DE INTEGRAÇÃO TERAPÊUTICA
  // ==========================================

  /**
   * Integra profile com análise terapêutica
   */
  async integrateProfileWithTherapeuticAnalysis(profile) {
    try {
      if (!this.therapeuticSystems.therapeuticAnalyzer) return
      
      // Análise terapêutica baseada no profile
      const therapeuticInsights = {
        autismLevel: profile.autismLevel,
        communicationStyle: profile.communicationStyle,
        sensoryPreferences: profile.sensoryPreferences,
        challenges: profile.challenges,
        strengths: profile.strengths
      }
      
      // Gerar recomendações adaptativas
      if (this.therapeuticSystems.adaptiveService) {
        await this.generateAdaptiveRecommendations(therapeuticInsights)
      }
      
      this.logger.info('🧠 Profile integrado com análise terapêutica')
    } catch (error) {
      this.logger.error('❌ Erro na integração terapêutica:', error)
    }
  }

  /**
   * Atualiza otimizações terapêuticas
   */
  async updateTherapeuticOptimizations(profile, analysis) {
    try {
      // Aplicar otimizações baseadas na análise
      const optimizations = {
        sensoryAdjustments: analysis.sensoryTriggers || [],
        difficultyAdjustments: this.calculateDifficultyAdjustments(profile),
        engagementStrategies: this.generateEngagementStrategies(profile)
      }
      
      // Aplicar otimizações
      await this.applyTherapeuticOptimizations(optimizations)
      
      this.logger.info('⚡ Otimizações terapêuticas atualizadas')
    } catch (error) {
      this.logger.error('❌ Erro ao atualizar otimizações:', error)
    }
  }

  /**
   * Integra insights de profile com métricas gerais
   */
  async integrateProfileInsights(insights) {
    try {
      // Adicionar insights às métricas terapêuticas
      this.therapeuticMetrics.set('profileInsights', {
        ...insights,
        timestamp: Date.now()
      })
      
      // Atualizar dashboard de métricas
      if (this.therapeuticSystems.metricsManager) {
        await this.therapeuticSystems.metricsManager.updateMetrics('profileInsights', insights)
      }
      
      this.logger.info('📊 Insights de profile integrados às métricas')
    } catch (error) {
      this.logger.error('❌ Erro ao integrar insights:', error)
    }
  }

  /**
   * Gera recomendações terapêuticas
   */
  async generateTherapeuticRecommendations(analysisData) {
    try {
      const recommendations = {
        immediate: [],
        shortTerm: [],
        longTerm: []
      }
      
      // Análise do nível de autismo
      if (analysisData.insights?.autismLevel) {
        recommendations.immediate.push(
          `Ajustar configurações para nível ${analysisData.insights.autismLevel}`
        )
      }
      
      // Análise sensorial
      if (analysisData.insights?.sensoryTriggers) {
        recommendations.shortTerm.push(
          'Implementar estratégias de regulação sensorial'
        )
      }
      
      // Análise de engajamento
      if (analysisData.insights?.engagementPatterns) {
        recommendations.longTerm.push(
          'Desenvolver plano de engajamento personalizado'
        )
      }
      
      return recommendations
    } catch (error) {
      this.logger.error('❌ Erro ao gerar recomendações:', error)
      return { immediate: [], shortTerm: [], longTerm: [] }
    }
  }

  /**
   * Analisa padrões de engajamento
   */
  async analyzeEngagementPatterns(engagementData) {
    try {
      // Coletar histórico de engajamento
      const history = this.therapeuticMetrics.get('engagementHistory') || []
      history.push(engagementData)
      
      // Manter apenas últimas 100 interações
      if (history.length > 100) {
        history.splice(0, history.length - 100)
      }
      
      this.therapeuticMetrics.set('engagementHistory', history)
      
      // Calcular métricas de engajamento
      const avgDuration = history.reduce((sum, item) => sum + (item.duration || 0), 0) / history.length
      const interactionFrequency = history.length / (24 * 60 * 60 * 1000) // por dia
      
      this.therapeuticMetrics.set('engagementMetrics', {
        averageDuration: avgDuration,
        interactionFrequency,
        lastUpdated: Date.now()
      })
      
      this.logger.info('📈 Padrões de engajamento analisados')
    } catch (error) {
      this.logger.error('❌ Erro ao analisar engajamento:', error)
    }
  }

  /**
   * Atualiza métricas de engajamento
   */
  async updateEngagementMetrics(engagementData) {
    try {
      // Atualizar estatísticas gerais
      const currentMetrics = this.therapeuticMetrics.get('engagementMetrics') || { averageDuration: 0 }
      
      // Calcular nova média de engajamento
      this.statistics.averageProfileEngagement = (
        (this.statistics.averageProfileEngagement * (this.statistics.userInteractions - 1)) +
        (engagementData.duration || 0)
      ) / this.statistics.userInteractions
      
      this.logger.info('📊 Métricas de engajamento atualizadas')
    } catch (error) {
      this.logger.error('❌ Erro ao atualizar métricas de engajamento:', error)
    }
  }

  /**
   * Calcula ajustes de dificuldade
   */
  calculateDifficultyAdjustments(profile) {
    const adjustments = []
    
    if (profile.autismLevel === 'level3') {
      adjustments.push('reduce_complexity', 'increase_support', 'simplify_instructions')
    } else if (profile.autismLevel === 'level1') {
      adjustments.push('increase_challenge', 'promote_independence')
    }
    
    if (profile.challenges?.includes('cognitive')) {
      adjustments.push('slower_pace', 'more_repetition')
    }
    
    return adjustments
  }

  /**
   * Gera estratégias de engajamento
   */
  generateEngagementStrategies(profile) {
    const strategies = []
    
    if (profile.interests?.includes('technology')) {
      strategies.push('digital_rewards', 'interactive_elements')
    }
    
    if (profile.learningStyle === 'visual') {
      strategies.push('visual_cues', 'picture_supports')
    }
    
    if (profile.communicationStyle === 'nonverbal') {
      strategies.push('gesture_prompts', 'visual_communication')
    }
    
    return strategies
  }

  /**
   * Gera recomendações adaptativas
   */
  async generateAdaptiveRecommendations(therapeuticInsights) {
    try {
      if (!this.therapeuticSystems.adaptiveService) return
      
      const recommendations = {
        sensory: this.calculateSensoryAdaptations(therapeuticInsights.sensoryPreferences),
        communication: this.calculateCommunicationAdaptations(therapeuticInsights.communicationStyle),
        cognitive: this.calculateCognitiveAdaptations(therapeuticInsights.challenges)
      }
      
      // Aplicar recomendações adaptativas
      this.therapeuticMetrics.set('adaptiveRecommendations', {
        ...recommendations,
        timestamp: Date.now()
      })
      
      this.logger.info('🎯 Recomendações adaptativas geradas')
    } catch (error) {
      this.logger.error('❌ Erro ao gerar recomendações adaptativas:', error)
    }
  }

  /**
   * Calcula adaptações sensoriais
   */
  calculateSensoryAdaptations(sensoryPreferences) {
    const adaptations = []
    
    if (sensoryPreferences?.visualSensitive) {
      adaptations.push('reduce_brightness', 'minimize_visual_clutter')
    }
    
    if (sensoryPreferences?.auditoryHypersensitive) {
      adaptations.push('reduce_volume', 'eliminate_background_noise')
    }
    
    if (sensoryPreferences?.tactilePreferred) {
      adaptations.push('add_tactile_feedback', 'vibration_cues')
    }
    
    return adaptations
  }

  /**
   * Calcula adaptações de comunicação
   */
  calculateCommunicationAdaptations(communicationStyle) {
    const adaptations = []
    
    if (communicationStyle === 'nonverbal') {
      adaptations.push('picture_communication', 'gesture_prompts')
    } else if (communicationStyle === 'verbal') {
      adaptations.push('clear_speech', 'simple_language')
    }
    
    return adaptations
  }

  /**
   * Calcula adaptações cognitivas
   */
  calculateCognitiveAdaptations(challenges) {
    const adaptations = []
    
    if (challenges?.includes('attention')) {
      adaptations.push('shorter_sessions', 'frequent_breaks')
    }
    
    if (challenges?.includes('memory')) {
      adaptations.push('visual_reminders', 'repetition')
    }
    
    if (challenges?.includes('processing')) {
      adaptations.push('slower_pace', 'clear_instructions')
    }
    
    return adaptations
  }

  /**
   * Processa evento de jogo usando todos os sistemas terapêuticos
   * ESTE É O MÉTODO PRINCIPAL QUE USA OS ALGORITMOS!
   */
  async processGameEvent(gameEvent) {
    try {
      this.logger.info('🎮 Processando evento de jogo com algoritmos terapêuticos...')
      
      const results = {
        timestamp: Date.now(),
        eventId: gameEvent.id || `event_${Date.now()}`,
        analyses: {}
      }      // 1. USAR O AUTISM COGNITIVE ANALYZER
      if (this.therapeuticSystems.autismCognitiveAnalyzer) {
        this.logger.info('🧩 Executando análise cognitiva para autismo...')
        // Usar método que realmente existe: calculateAutismAdaptations
        results.analyses.autismCognitive = this.therapeuticSystems.autismCognitiveAnalyzer.calculateAutismAdaptations(
          gameEvent.userId, 
          gameEvent, 
          gameEvent.userProfile || {}
        )
        
        // Gerar otimizações terapêuticas se disponível
        if (gameEvent.userId) {
          results.analyses.therapyOptimizations = this.therapeuticSystems.autismCognitiveAnalyzer.generateTherapyOptimizations(
            gameEvent.userId,
            gameEvent,
            gameEvent.therapyGoals || {}
          )
        }
      }

      // 2. USAR O PROFILE CONTROLLER para contexto do usuário
      if (this.therapeuticSystems.profileController && gameEvent.userId) {
        this.logger.info('👤 Analisando perfil do usuário...')
        const userProfile = await this.therapeuticSystems.profileController.getProfile(gameEvent.userId)
        results.analyses.userProfile = userProfile
        
        // Análise comportamental baseada no perfil
        if (userProfile) {
          results.analyses.behaviorPatterns = await this.therapeuticSystems.profileController.analyzeProfile(gameEvent.userId, 'current_session')
        }
      }      // 3. USAR O THERAPEUTIC ANALYZER
      if (this.therapeuticSystems.therapeuticAnalyzer) {
        this.logger.info('🏥 Executando análise terapêutica...')
        try {
          // Usar método que existe: performComprehensiveAnalysis
          results.analyses.therapeutic = await this.therapeuticSystems.therapeuticAnalyzer.performComprehensiveAnalysis(
            gameEvent.userId,
            gameEvent,
            {
              userProfile: results.analyses.userProfile,
              behaviorData: results.analyses.behaviorPatterns,
              gameEvent
            }
          )
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise terapêutica:', error.message)
          results.analyses.therapeutic = { error: error.message }
        }
      }      // 4. USAR O NEUROPLASTICITY ANALYZER
      if (this.therapeuticSystems.neuroplasticityAnalyzer) {
        this.logger.info('🧠 Analisando neuroplasticidade...')
        try {
          // Verificar métodos disponíveis
          if (typeof this.therapeuticSystems.neuroplasticityAnalyzer.trackCognitiveImprovement === 'function') {
            results.analyses.neuroplasticity = await this.therapeuticSystems.neuroplasticityAnalyzer.trackCognitiveImprovement(
              gameEvent.userId,
              gameEvent,
              results.analyses.userProfile
            )
          } else if (typeof this.therapeuticSystems.neuroplasticityAnalyzer.analyze === 'function') {
            results.analyses.neuroplasticity = await this.therapeuticSystems.neuroplasticityAnalyzer.analyze(
              gameEvent,
              results.analises.userProfile
            )
          } else {
            // Método genérico se disponível
            results.analyses.neuroplasticity = { 
              status: 'analyzer_available',
              methods: Object.getOwnPropertyNames(Object.getPrototypeOf(this.therapeuticSystems.neuroplasticityAnalyzer))
                .filter(method => typeof this.therapeuticSystems.neuroplasticityAnalyzer[method] === 'function')
            }
          }
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise de neuroplasticidade:', error.message)
          results.analyses.neuroplasticity = { error: error.message }
        }
      }      // 5. USAR O ADVANCED SUPPORT CALCULATOR
      if (this.therapeuticSystems.advancedSupportCalculator) {
        this.logger.info('🎯 Calculando suporte avançado...')
        try {
          // Verificar métodos disponíveis
          if (typeof this.therapeuticSystems.advancedSupportCalculator.calculateSupport === 'function') {
            results.analyses.supportLevel = await this.therapeuticSystems.advancedSupportCalculator.calculateSupport({
              gameEvent,
              cognitiveAnalysis: results.analyses.autismCognitive,
              userProfile: results.analises.userProfile
            })
          } else if (typeof this.therapeuticSystems.advancedSupportCalculator.calculateVisualSupportLevel === 'function') {
            // Usar métodos específicos que existem
            const visualSupport = this.therapeuticSystems.advancedSupportCalculator.calculateVisualSupportLevel(gameEvent)
            const auditorySupport = this.therapeuticSystems.advancedSupportCalculator.calculateAuditorySupportLevel?.(gameEvent) || {}
            
            results.analyses.supportLevel = {
              visual: visualSupport,
              auditory: auditorySupport,
              overall: (visualSupport.level + (auditorySupport.level || 0)) / 2
            }
          } else {
            results.analyses.supportLevel = { 
              status: 'calculator_available',
              methods: Object.getOwnPropertyNames(Object.getPrototypeOf(this.therapeuticSystems.advancedSupportCalculator))
                .filter(method => typeof this.therapeuticSystems.advancedSupportCalculator[method] === 'function')
            }
          }
        } catch (error) {
          this.logger.warn('⚠️ Erro no cálculo de suporte:', error.message)
          results.analyses.supportLevel = { error: error.message }
        }      }

      // === USAR NOVOS ALGORITMOS INTEGRADOS ===
      
      // 5.1. USAR BEHAVIORAL ENGAGEMENT ANALYZER
      if (this.therapeuticSystems.behavioralEngagementAnalyzer) {
        this.logger.info('📊 Analisando engajamento comportamental...')
        try {
          const behavioralEngagement = await this.therapeuticSystems.behavioralEngagementAnalyzer.analyzeEngagement(
            gameEvent.userId,
            gameEvent
          )
          results.analyses.behavioralEngagement = behavioralEngagement
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise de engajamento:', error.message)
          results.analyses.behavioralEngagement = { error: error.message }
        }
      }
      
      // 5.2. USAR BEHAVIOR ANALYSIS MODEL
      if (this.therapeuticSystems.behaviorAnalysisModel) {
        this.logger.info('🔍 Executando análise comportamental avançada...')
        try {
          const behaviorAnalysis = await this.therapeuticSystems.behaviorAnalysisModel.analyze(gameEvent)
          results.analyses.behaviorAnalysis = behaviorAnalysis
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise comportamental:', error.message)
          results.analyses.behaviorAnalysis = { error: error.message }
        }
      }
      
      // 5.3. USAR COGNITIVE ASSESSMENT MODEL
      if (this.therapeuticSystems.cognitiveAssessmentModel) {
        this.logger.info('🧠 Avaliando capacidades cognitivas...')
        try {
          const cognitiveAssessment = this.therapeuticSystems.cognitiveAssessmentModel.assess(gameEvent)
          results.analyses.cognitiveAssessment = cognitiveAssessment
        } catch (error) {
          this.logger.warn('⚠️ Erro na avaliação cognitiva:', error.message)
          results.analyses.cognitiveAssessment = { error: error.message }
        }
      }
      
      // 5.4. USAR DIFFICULTY ADAPTIVE MODEL
      if (this.therapeuticSystems.difficultyAdaptiveModel) {
        this.logger.info('⚖️ Adaptando nível de dificuldade...')
        try {
          const difficultyAdaptation = this.therapeuticSystems.difficultyAdaptiveModel.adaptDifficulty(
            gameEvent.userId,
            gameEvent
          )
          results.analyses.difficultyAdaptation = difficultyAdaptation
        } catch (error) {
          this.logger.warn('⚠️ Erro na adaptação de dificuldade:', error.message)
          results.analyses.difficultyAdaptation = { error: error.message }
        }
      }
      
      // 5.5. USAR EMOTIONAL STATE MODEL
      if (this.therapeuticSystems.emotionalStateModel) {
        this.logger.info('😊 Analisando estado emocional...')
        try {
          const emotionalState = this.therapeuticSystems.emotionalStateModel.analyzeEmotion(gameEvent)
          results.analyses.emotionalState = emotionalState
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise emocional:', error.message)
          results.analyses.emotionalState = { error: error.message }
        }
      }
      
      // 5.6. USAR LEARNING PROGRESS MODEL
      if (this.therapeuticSystems.learningProgressModel) {
        this.logger.info('📈 Monitorando progresso de aprendizagem...')
        try {
          const learningProgress = this.therapeuticSystems.learningProgressModel.trackProgress(
            gameEvent.userId,
            gameEvent
          )
          results.analyses.learningProgress = learningProgress
        } catch (error) {
          this.logger.warn('⚠️ Erro no monitoramento de progresso:', error.message)
          results.analyses.learningProgress = { error: error.message }
        }
      }
      
      // 5.7. USAR PREDICTIVE ANALYSIS ENGINE
      if (this.therapeuticSystems.predictiveAnalysisEngine) {
        this.logger.info('🔮 Executando análise preditiva...')
        try {
          const predictiveAnalysis = await this.therapeuticSystems.predictiveAnalysisEngine.predict(gameEvent)
          results.analyses.predictiveAnalysis = predictiveAnalysis
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise preditiva:', error.message)
          results.analyses.predictiveAnalysis = { error: error.message }
        }
      }
      
      // 5.8. USAR ENHANCED ADAPTIVE SERVICES
      if (this.therapeuticSystems.enhancedAdaptiveMLService) {
        this.logger.info('🎯 Aplicando adaptações avançadas...')
        try {
          const adaptiveRecommendations = await this.therapeuticSystems.enhancedAdaptiveMLService.getAdaptations(
            gameEvent.userId,
            gameEvent
          )
          results.analyses.adaptiveRecommendations = adaptiveRecommendations
        } catch (error) {
          this.logger.warn('⚠️ Erro nas adaptações avançadas:', error.message)
          results.analyses.adaptiveRecommendations = { error: error.message }
        }
      }
      
      // 5.9. USAR INTEGRATED ANALYSIS ORCHESTRATOR
      if (this.therapeuticSystems.integratedAnalysisOrchestrator) {
        this.logger.info('🎼 Executando análise integrada...')
        try {
          const integratedAnalysis = await this.therapeuticSystems.integratedAnalysisOrchestrator.orchestrate(gameEvent)
          results.analyses.integratedAnalysis = integratedAnalysis
        } catch (error) {
          this.logger.warn('⚠️ Erro na análise integrada:', error.message)
          results.analyses.integratedAnalysis = { error: error.message }
        }
      }

      // 6. GERAR RECOMENDAÇÕES TERAPÊUTICAS
      results.recommendations = this.generateTherapeuticRecommendations(results.analyses)

      // 7. SALVAR NO DATABASE
      if (this.db) {
        await this.db.saveAnalysisResults?.(results)
      }

      this.logger.info('✅ Evento processado com todos os algoritmos terapêuticos')
      return results

    } catch (error) {
      this.logger.error('❌ Erro ao processar evento com algoritmos:', error)
      throw error
    }
  }

  /**
   * Gera recomendações terapêuticas baseadas nas análises
   */
  generateTherapeuticRecommendations(analyses) {
    const recommendations = {
      immediate: [],
      short_term: [],
      long_term: [],
      adaptations: []
    }

    // Recomendações baseadas na análise cognitiva para autismo
    if (analyses.autismCognitive) {
      if (analyses.autismCognitive.difficultyLevel > 0.8) {
        recommendations.immediate.push('Reduzir complexidade do jogo')
        recommendations.adaptations.push('Ativar modo de suporte sensorial')
      }
      
      if (analyses.autismCognitive.sensoryOverload) {
        recommendations.immediate.push('Pausar estímulos visuais/auditivos')
        recommendations.adaptations.push('Aplicar filtros sensoriais')
      }
    }

    // Recomendações baseadas no nível de suporte
    if (analyses.supportLevel) {
      if (analyses.supportLevel.level === 'high') {
        recommendations.immediate.push('Ativar assistência guiada')
        recommendations.short_term.push('Ajustar metas terapêuticas')
      }
    }

    // Recomendações baseadas na neuroplasticidade
    if (analyses.neuroplasticity) {
      if ( analyses.neuroplasticity.learningRate > 0.7) {
        recommendations.short_term.push('Aumentar gradualmente a dificuldade')
        recommendations.long_term.push('Expandir objetivos cognitivos')
      }
    }

    return recommendations
  }

  /**
   * Analisa sessão completa usando todos os algoritmos
   */
  async analyzeSession(sessionData) {
    try {
      this.logger.info('📊 Analisando sessão completa...')
      
      const sessionAnalysis = {
        sessionId: sessionData.id,
        userId: sessionData.userId,
        startTime: sessionData.startTime,
        endTime: Date.now(),
        events: [],
        overallAnalysis: {}
      }

      // Processar todos os eventos da sessão
      for (const event of sessionData.events || []) {
        const eventAnalysis = await this.processGameEvent(event)
        sessionAnalysis.events.push(eventAnalysis)
      }      // Análise geral da sessão
      if (this.therapeuticSystems.autismCognitiveAnalyzer && sessionData.userId) {
        // Usar método que existe: analyzeTherapeuticProgress
        sessionAnalysis.overallAnalysis.cognitive = this.therapeuticSystems.autismCognitiveAnalyzer.analyzeTherapeuticProgress(
          sessionData.userId, 
          sessionData
        )
        
        // Análise comportamental da sessão
        if (sessionData.behavioralData) {
          sessionAnalysis.overallAnalysis.behavioral = this.therapeuticSystems.autismCognitiveAnalyzer.analyzeBehavioralPatterns(
            sessionData.behavioralData
          )
        }
      }

      // Atualizar perfil do usuário com dados da sessão
      if (this.therapeuticSystems.profileController && sessionData.userId) {
        await this.therapeuticSystems.profileController.updateProfile(sessionData.userId, {
          lastSession: sessionAnalysis,
          sessionCount: (sessionData.sessionCount || 0) + 1,
          totalPlayTime: (sessionData.totalPlayTime || 0) + (sessionAnalysis.endTime - sessionAnalysis.startTime)
        })
      }

      this.logger.info('✅ Análise de sessão concluída')
      return sessionAnalysis

    } catch (error) {
      this.logger.error('❌ Erro na análise de sessão:', error)
      throw error
    }
  }

  /**
   * Processa métricas em tempo real
   */
  async processRealTimeMetrics(metricsData) {
    try {
      // Usar algoritmos para análise em tempo real
      const realTimeAnalysis = {
        timestamp: Date.now(),
        metrics: metricsData,
        alerts: [],
        adaptations: []
      }      // Verificar se precisa de intervenção imediata
      if (this.therapeuticSystems.autismCognitiveAnalyzer) {
        // Usar método que existe: analyzeBehavioralPatterns
        const behavioralAnalysis = this.therapeuticSystems.autismCognitiveAnalyzer.analyzeBehavioralPatterns(metricsData)
        
        if (behavioralAnalysis.interventionNeeded) {
          realTimeAnalysis.alerts.push({
            type: 'cognitive_intervention',
            priority: 'high',
            message: 'Intervenção cognitiva necessária',
            recommendations: behavioralAnalysis.recommendations
          })
        }
        
        // Calcular adaptações se houver userId
        if (metricsData.userId) {
          const adaptations = this.therapeuticSystems.autismCognitiveAnalyzer.calculateAutismAdaptations(
            metricsData.userId,
            metricsData,
            metricsData.userProfile || {}
          )
          realTimeAnalysis.adaptations.push(...(adaptations.recommendations || []))
        }
      }

      return realTimeAnalysis

    } catch (error) {
      this.logger.error('❌ Erro no processamento de métricas em tempo real:', error)
      throw error
    }
  }

  /**
   * Interface pública para uso dos algoritmos terapêuticos
   * ESTES SÃO OS MÉTODOS QUE REALMENTE USAM OS ALGORITMOS!
   */
  getTherapeuticInterface() {
    return {
      // Processar eventos de jogo
      processGameEvent: (gameEvent) => this.processGameEvent(gameEvent),
      
      // Analisar sessões completas  
      analyzeSession: (sessionData) => this.analyzeSession(sessionData),
      
      // Processar métricas em tempo real
      processRealTimeMetrics: (metricsData) => this.processRealTimeMetrics(metricsData),
        // Acesso direto aos algoritmos
      algorithms: {
        autismCognitive: this.therapeuticSystems.autismCognitiveAnalyzer,
        profileController: this.therapeuticSystems.profileController,
        therapeutic: this.therapeuticSystems.therapeuticAnalyzer,
        neuroplasticity: this.therapeuticSystems.neuroplasticityAnalyzer,
        supportCalculator: this.therapeuticSystems.advancedSupportCalculator,
        neuropedagogical: this.therapeuticSystems.neuropedagogicalAnalyzer,
        // === NOVOS ALGORITMOS INTEGRADOS ===
        behavioralEngagement: this.therapeuticSystems.behavioralEngagementAnalyzer,
        progressReports: this.therapeuticSystems.progressReports,
        behaviorAnalysis: this.therapeuticSystems.behaviorAnalysisModel,
        cognitiveAssessment: this.therapeuticSystems.cognitiveAssessmentModel,
        difficultyAdaptive: this.therapeuticSystems.difficultyAdaptiveModel,
        emotionalState: this.therapeuticSystems.emotionalStateModel,
        learningProgress: this.therapeuticSystems.learningProgressModel,
        personalityPredictive: this.therapeuticSystems.personalityPredictiveModel,
        predictiveAnalysis: this.therapeuticSystems.predictiveAnalysisEngine,
        adaptiveML: this.therapeuticSystems.adaptiveMLService,
        enhancedAdaptiveML: this.therapeuticSystems.enhancedAdaptiveMLService,
        adaptiveAccessibility: this.therapeuticSystems.adaptiveAccessibilityManager,
        integratedAnalysis: this.therapeuticSystems.integratedAnalysisOrchestrator,
        emotionalAnalysisEngine: this.therapeuticSystems.emotionalAnalysisEngine,
      },
      
      // Status dos algoritmos
      getAlgorithmStatus: () => ({
        autismCognitive: !!this.therapeuticSystems.autismCognitiveAnalyzer,
        profileController: !!this.therapeuticSystems.profileController,
        therapeutic: !!this.therapeuticSystems.therapeuticAnalyzer,
        neuroplasticity: !!this.therapeuticSystems.neuroplasticityAnalyzer,
        supportCalculator: !!this.therapeuticSystems.advancedSupportCalculator,
        neuropedagogical: !!this.therapeuticSystems.neuropedagogicalAnalyzer,
        // === STATUS DOS NOVOS ALGORITMOS ===
        behavioralEngagement: !!this.therapeuticSystems.behavioralEngagementAnalyzer,
        progressReports: !!this.therapeuticSystems.progressReports,
        behaviorAnalysis: !!this.therapeuticSystems.behaviorAnalysisModel,
        cognitiveAssessment: !!this.therapeuticSystems.cognitiveAssessmentModel,
        difficultyAdaptive: !!this.therapeuticSystems.difficultyAdaptiveModel,
        emotionalState: !!this.therapeuticSystems.emotionalStateModel,
        learningProgress: !!this.therapeuticSystems.learningProgressModel,
        personalityPredictive: !!this.therapeuticSystems.personalityPredictiveModel,
        predictiveAnalysis: !!this.therapeuticSystems.predictiveAnalysisEngine,
        adaptiveML: !!this.therapeuticSystems.adaptiveMLService,
        enhancedAdaptiveML: !!this.therapeuticSystems.enhancedAdaptiveMLService,
        adaptiveAccessibility: !!this.therapeuticSystems.adaptiveAccessibilityManager,
        integratedAnalysis: !!this.therapeuticSystems.integratedAnalysisOrchestrator,
        emotionalAnalysisEngine: !!this.therapeuticSystems.emotionalAnalysisEngine,
        total: Object.values(this.therapeuticSystems).filter(system => !!system).length
      })
    }
  }
}

// === INSTÂNCIA SINGLETON E EXPORTS ===

// Instância singleton
let systemOrchestratorInstance = null

/**
 * Obtém instância do orquestrador
 */
export const getSystemOrchestrator = (databaseService = null) => {
  if (!systemOrchestratorInstance) {
    // Se não foi passado um databaseService, criar um mock básico
    const mockDatabase = databaseService || {
      logger: sharedLogger || console,
      query: async () => ({}),
      insert: async () => ({}),
      update: async () => ({}),
      delete: async () => ({})
    };
    systemOrchestratorInstance = new SystemOrchestrator(mockDatabase)
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
  sharedLogger.info(`🔧 Modo do sistema alterado para: ${mode}`)
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

/**
 * Alias para initializeSystem para compatibilidade com código existente
 */
export const initializeSystemOrchestrator = async () => {
  const orchestrator = getSystemOrchestrator()
  await orchestrator.init()
  return orchestrator
}
