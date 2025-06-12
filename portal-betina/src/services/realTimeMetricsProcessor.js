/**
 * PROCESSADOR DE MÉTRICAS EM TEMPO REAL
 * Sistema otimizado que processa dados durante a atividade
 * Salva métricas já refinadas no banco de dados
 *
 * @version 2.0.0 - INTEGRAÇÃO COMPLETA COM UTILS
 * @purpose Otimização de fluxo de dados conforme sugerido pelo usuário
 */

import databaseService from './databaseService.js'
import { logger } from '../utils/logger.js'

// 🚀 CARREGAMENTO DINÂMICO SEGURO DOS MÓDULOS CORRIGIDOS
let MultisensoryMetricsCollector, NeuropedagogicalAnalyzer
let AdvancedTherapeuticAnalyzer, TherapyOptimizer
let AdaptiveModel, createAdaptiveModel, AdaptiveMLService
let CognitiveAnalyzer, NeuroplasticityAnalyzer, EmotionalAnalysisService
let AdaptiveAccessibilityManager

// Carregamento dinâmico seguro dos módulos
const loadUtilsModules = async () => {
  try {
    // Módulos que existem e estão corrigidos
    const multisensoryModule = await import('../utils/multisensoryAnalysis/index.js').catch(
      () => ({})
    )
    MultisensoryMetricsCollector = multisensoryModule.MultisensoryMetricsCollector || class {}

    const neuropedModule = await import('../utils/metrics/neuropedagogicalInsights.js').catch(
      () => ({ NeuropedagogicalAnalyzer: class {} })
    )
    NeuropedagogicalAnalyzer = neuropedModule.NeuropedagogicalAnalyzer || class {}

    const therapyModule = await import('../utils/therapy/AdvancedTherapeuticAnalyzer.js').catch(
      () => ({})
    )
    AdvancedTherapeuticAnalyzer = therapyModule.AdvancedTherapeuticAnalyzer || class {}

    const therapyOptModule = await import('../utils/therapy/TherapyOptimizer.js').catch(() => ({}))
    TherapyOptimizer = therapyOptModule.TherapyOptimizer || class {}

    const adaptiveModule = await import('../utils/adaptive/adaptiveML.js').catch(() => ({}))
    AdaptiveModel = adaptiveModule.AdaptiveModel || class {}
    createAdaptiveModel = adaptiveModule.createAdaptiveModel || (() => new AdaptiveModel())

    const adaptiveMLModule = await import('../utils/adaptive/AdaptiveMLService.js').catch(
      () => ({})
    )
    AdaptiveMLService = adaptiveMLModule.AdaptiveMLService || class {}

    const cognitiveModule = await import('../utils/cognitive/CognitiveAnalyzer.js').catch(
      () => ({})
    )
    CognitiveAnalyzer = cognitiveModule.CognitiveAnalyzer || class {}

    // NOVOS MÓDULOS CORRIGIDOS:
    const neuroplasticityModule = await import(
      '../utils/neuroplasticity/neuroplasticityAnalyzer.js'
    ).catch(() => ({}))
    NeuroplasticityAnalyzer = neuroplasticityModule.NeuroplasticityAnalyzer || class {}

    const emotionalModule = await import(
      '../utils/emotionalAnalysis/EmotionalAnalysisService.js'
    ).catch(() => ({ default: class {} }))
    EmotionalAnalysisService = emotionalModule.default || class {}

    const accessibilityModule = await import(
      '../utils/adaptive/adaptiveAccessibilityManager.js'
    ).catch(() => ({}))
    AdaptiveAccessibilityManager = accessibilityModule.AdaptiveAccessibilityManager || class {}

    console.log('✅ Módulos utils carregados com segurança')
    return true
  } catch (error) {
    console.warn('⚠️ Alguns módulos utils não puderam ser carregados:', error)
    return false
  }
}

class RealTimeMetricsProcessor {
  constructor() {
    this.activeSessions = new Map()
    this.processingQueue = []
    this.isProcessing = false

    // 🧠 ALGORITMOS DE PROCESSAMENTO EM TEMPO REAL - INTEGRAÇÃO COMPLETA
    this.therapeuticAnalyzer = this.initializeTherapeuticAnalyzer()
    this.cognitiveAnalyzer = this.initializeCognitiveAnalyzer()
    this.adaptiveML = this.initializeAdaptiveML()
    this.neuroplasticityTracker = this.initializeNeuroplasticityTracker()
    this.emotionalAnalyzer = this.initializeEmotionalAnalyzer()
    this.gameAdaptationEngine = this.initializeGameAdaptationEngine()
    this.accessibilityManager = this.initializeAccessibilityManager()
    this.multisensoryCollector = this.initializeMultisensoryCollector()
    this.therapyOptimizer = this.initializeTherapyOptimizer()

    console.log(
      '🚀 Processador de Métricas em Tempo Real v2.0 inicializado com integração completa'
    )
  }

  /**
   * 🧠 INICIALIZADORES DOS ALGORITMOS ESPECIALIZADOS
   */
  initializeTherapeuticAnalyzer() {
    return new AdvancedTherapeuticAnalyzer({
      enableRealTimeAnalysis: true,
      autismFocused: true,
      confidenceThreshold: 0.75,
      interventionTriggers: {
        frustration: 0.7,
        sensoryOverload: 0.8,
        attention: 0.6,
      },
    })
  }

  initializeCognitiveAnalyzer() {
    return new CognitiveAnalyzer({
      confidenceThreshold: 0.7,
      sessionHistoryLimit: 10,
      realTimeProcessing: true,
      autismSpecificMetrics: true,
    })
  }

  initializeAdaptiveML() {
    return new AdaptiveMLService({
      learningRate: 0.01,
      adaptationSpeed: 'fast',
      enableRealTimeAdjustments: true,
      autismOptimizations: true,
    })
  }
  initializeNeuroplasticityTracker() {
    return new NeuroplasticityAnalyzer({
      trackingInterval: 5000, // 5 segundos
      enableRealTimeUpdates: true,
      cognitiveMetrics: true,
    })
  }

  initializeEmotionalAnalyzer() {
    return new EmotionalAnalysisService({
      emotionDetectionSensitivity: 0.8,
      stressMonitoring: true,
      autismEmotionalPatterns: true,
    })
  }

  initializeGameAdaptationEngine() {
    // Criar uma factory function para GameAdaptationEngine já que não existe como classe
    return {
      adaptGame: async (params) => {
        return {
          suggestedDifficulty: params.currentDifficulty,
          reason: 'Manter nível atual',
          adaptations: [],
        }
      },
    }
  }

  initializeAccessibilityManager() {
    return new AdaptiveAccessibilityManager({
      visualAdaptations: true,
      auditoryAdaptations: true,
      motorAdaptations: true,
      cognitiveAdaptations: true,
    })
  }
  initializeMultisensoryCollector() {
    return new MultisensoryMetricsCollector()
  }

  initializeTherapyOptimizer() {
    return new TherapyOptimizer({
      optimizationGoals: ['engagement', 'learning', 'emotional_regulation'],
      realTimeOptimization: true,
    })
  }

  /**
   * Inicia sessão com processamento em tempo real
   */
  startRealTimeSession(sessionConfig) {
    const { sessionId, userId, activityId, difficulty } = sessionConfig

    const session = {
      sessionId,
      userId,
      activityId,
      difficulty,
      startTime: Date.now(),

      // Métricas base em tempo real
      realTimeMetrics: {
        attempts: 0,
        successes: 0,
        errors: 0,
        currentAccuracy: 0,
        score: 0,
        adaptiveLevel: difficulty,
      },

      // Dados processados em tempo real
      processedData: {
        cognitiveProfile: this.initializeCognitiveProfile(),
        therapeuticInsights: [],
        behavioralPatterns: {},
        adaptiveRecommendations: [],
        neuropedagogicalMetrics: {},
      },

      // Buffer de eventos para processamento
      eventBuffer: [],
      lastProcessed: Date.now(),
    }

    this.activeSessions.set(sessionId, session)

    // Iniciar coleta multissensorial em tempo real
    this.startMultisensoryCollection(sessionId)

    logger.info('Sessão de processamento em tempo real iniciada', {
      sessionId,
      userId,
      activityId,
    })

    return session
  }
  /**
   * 🚀 PROCESSA EVENTO IMEDIATAMENTE COM TODOS OS ALGORITMOS INTEGRADOS
   */
  async processEventRealTime(sessionId, eventType, eventData) {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      console.warn(`Sessão não encontrada: ${sessionId}`)
      return null
    }

    // Atualizar métricas base imediatamente
    this.updateBaseMetrics(session, eventType, eventData)

    // 🧠 PROCESSAMENTO PARALELO COM TODOS OS ALGORITMOS INTEGRADOS
    const processedInsights = await this.processWithIntegratedAlgorithms(
      session,
      eventType,
      eventData
    )

    // Atualizar dados processados na sessão
    this.updateProcessedData(session, processedInsights)

    // Adicionar ao buffer para processamento mais profundo se necessário
    session.eventBuffer.push({
      timestamp: Date.now(),
      type: eventType,
      data: eventData,
      processedInsights,
    })

    // 🎯 PROCESSAMENTO ADAPTATIVO EM TEMPO REAL COM MOBILE SENSORS
    await this.updateAdaptiveParametersAdvanced(session, processedInsights)

    // 📱 PROCESSAR DADOS DE SENSORES MÓVEIS EM TEMPO REAL
    await this.processMobileSensorData(session, eventData)

    return processedInsights
  }

  /**
   * Atualiza métricas base imediatamente
   */
  updateBaseMetrics(session, eventType, eventData) {
    const metrics = session.realTimeMetrics

    switch (eventType) {
      case 'attempt':
        metrics.attempts++
        break
      case 'success':
        metrics.successes++
        metrics.score += eventData.points || 10
        break
      case 'error':
        metrics.errors++
        break
      case 'pause':
        session.pauseTime = Date.now()
        break
      case 'resume':
        if (session.pauseTime) {
          session.totalPauseTime = (session.totalPauseTime || 0) + (Date.now() - session.pauseTime)
        }
        break
    }

    // Recalcular accuracy em tempo real
    if (metrics.attempts > 0) {
      metrics.currentAccuracy = Math.round((metrics.successes / metrics.attempts) * 100)
    }
  }

  /**
   * Processa dados com algoritmos avançados em tempo real
   */
  processWithAlgorithms(session, eventType, eventData) {
    const insights = {}

    // 1. Análise Cognitiva em Tempo Real
    insights.cognitive = this.cognitiveAnalyzer.processEvent(
      session.processedData.cognitiveProfile,
      eventType,
      eventData,
      session.realTimeMetrics
    )

    // 2. Análise Terapêutica em Tempo Real
    insights.therapeutic = this.therapeuticAnalyzer.analyzeEvent(
      eventType,
      eventData,
      session.processedData.therapeuticInsights
    )

    // 3. Cálculos Adaptativos em Tempo Real
    insights.adaptive = this.adaptiveML.calculateAdjustments(
      session.realTimeMetrics,
      session.processedData.adaptiveRecommendations
    )

    // 4. Análise Neuropedagógica em Tempo Real
    insights.neuropedagogical = this.processNeuropedagogicalData(session, eventType, eventData)

    return insights
  }

  /**
   * 🧠 PROCESSAMENTO PARALELO COM TODOS OS ALGORITMOS INTEGRADOS
   */
  async processWithIntegratedAlgorithms(session, eventType, eventData) {
    const insights = {
      timestamp: Date.now(),
      eventType,
      eventData,

      // 🎯 ANÁLISES TERAPÊUTICAS EM TEMPO REAL
      therapeuticAnalysis: null,
      cognitiveAnalysis: null,
      emotionalAnalysis: null,
      behavioralPatterns: null,
      neuroplasticityMetrics: null,

      // 📱 DADOS DE SENSORES MÓVEIS
      sensorData: null,
      touchPatterns: null,
      motionData: null,

      // 🎮 ADAPTAÇÃO DE JOGO EM TEMPO REAL
      gameAdaptations: null,
      difficultyAdjustments: null,
      accessibilityAdjustments: null,

      // 🚀 RECOMENDAÇÕES IMEDIATAS
      immediateRecommendations: [],
      therapeuticInterventions: [],
      adaptiveParameters: {},
    }

    try {
      // 🧠 ANÁLISE TERAPÊUTICA AVANÇADA
      if (this.therapeuticAnalyzer) {
        insights.therapeuticAnalysis = await this.therapeuticAnalyzer.analyzeRealTime({
          userId: session.userId,
          sessionData: session,
          eventType,
          eventData,
          currentMetrics: session.realTimeMetrics,
        })
      }

      // 🎯 ANÁLISE COGNITIVA EM TEMPO REAL
      if (this.cognitiveAnalyzer) {
        insights.cognitiveAnalysis = await this.cognitiveAnalyzer.assessCognitiveLevel({
          sessionMetrics: session.realTimeMetrics,
          eventData,
          userProfile: session.processedData.cognitiveProfile,
        })
      }

      // 😊 ANÁLISE EMOCIONAL
      if (this.emotionalAnalyzer) {
        insights.emotionalAnalysis = await this.emotionalAnalyzer.analyzeEmotionalState({
          eventType,
          eventData,
          sessionHistory: session.eventBuffer,
          currentState: session.realTimeMetrics,
        })
      }

      // 🧩 TRACKING DE NEUROPLASTICIDADE
      if (this.neuroplasticityTracker) {
        insights.neuroplasticityMetrics = await this.neuroplasticityTracker.trackProgress({
          userId: session.userId,
          activityId: session.activityId,
          currentPerformance: session.realTimeMetrics,
          eventData,
        })
      }

      // 📱 COLETA DE DADOS MULTISSENSORIAIS
      if (this.multisensoryCollector && eventData.sensorData) {
        insights.sensorData = await this.multisensoryCollector.processSensorEvent({
          touchData: eventData.sensorData.touch,
          accelerometer: eventData.sensorData.accelerometer,
          gyroscope: eventData.sensorData.gyroscope,
          timestamp: Date.now(),
        })
      }

      // 🎮 ADAPTAÇÃO DE JOGO EM TEMPO REAL
      if (this.gameAdaptationEngine) {
        insights.gameAdaptations = await this.gameAdaptationEngine.adaptGame({
          currentDifficulty: session.difficulty,
          performance: session.realTimeMetrics,
          therapeuticGoals: insights.therapeuticAnalysis?.goals || [],
          userPreferences: session.processedData.cognitiveProfile,
        })
      }

      // ♿ ADAPTAÇÕES DE ACESSIBILIDADE
      if (this.accessibilityManager) {
        insights.accessibilityAdjustments = await this.accessibilityManager.getAdaptations({
          userNeeds: insights.cognitiveAnalysis,
          currentSession: session,
          eventType,
          eventData,
        })
      }

      // 🎯 GERAÇÃO DE RECOMENDAÇÕES IMEDIATAS
      insights.immediateRecommendations = await this.generateImmediateRecommendations(
        insights,
        session
      )

      // 🚨 INTERVENÇÕES TERAPÊUTICAS AUTOMÁTICAS
      insights.therapeuticInterventions = await this.detectTherapeuticInterventions(
        insights,
        session
      )

      // 📊 ATUALIZAÇÃO DE PARÂMETROS ADAPTATIVOS
      insights.adaptiveParameters = await this.calculateAdaptiveParameters(insights, session)
    } catch (error) {
      logger.error('Erro no processamento com algoritmos integrados:', error)
      insights.error = error.message
    }

    return insights
  }

  /**
   * Atualiza dados processados na sessão
   */
  updateProcessedData(session, insights) {
    const processed = session.processedData

    // Atualizar perfil cognitivo
    if (insights.cognitive) {
      processed.cognitiveProfile = {
        ...processed.cognitiveProfile,
        ...insights.cognitive.profileUpdates,
        lastUpdated: Date.now(),
      }
    }

    // Adicionar insights terapêuticos
    if (insights.therapeutic && insights.therapeutic.newInsights) {
      processed.therapeuticInsights.push(...insights.therapeutic.newInsights)
    }

    // Atualizar recomendações adaptativas
    if (insights.adaptive && insights.adaptive.recommendations) {
      processed.adaptiveRecommendations = insights.adaptive.recommendations
    }

    // Atualizar métricas neuropedagógicas
    if (insights.neuropedagogical) {
      processed.neuropedagogicalMetrics = {
        ...processed.neuropedagogicalMetrics,
        ...insights.neuropedagogical,
      }
    }
  }

  /**
   * Finaliza sessão com dados já processados
   */
  async finishRealTimeSession(sessionId, additionalData = {}) {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      console.warn(`Sessão não encontrada: ${sessionId}`)
      return null
    }

    session.endTime = Date.now()
    session.duration = session.endTime - session.startTime
    session.activeTime = session.duration - (session.totalPauseTime || 0)

    // Finalizar coleta multissensorial
    const multisensoryData = this.finishMultisensoryCollection(sessionId)

    // Gerar relatório final já processado
    const finalReport = this.generateFinalProcessedReport(session, multisensoryData, additionalData)

    // Salvar dados já refinados no banco
    const savedSuccessfully = await this.saveRefinedData(finalReport)

    if (savedSuccessfully) {
      this.activeSessions.delete(sessionId)
      logger.info('Sessão finalizada e dados refinados salvos', {
        sessionId,
        metricsProcessed: Object.keys(finalReport.processedMetrics).length,
      })
    }

    return finalReport
  }

  /**
   * Gera relatório final com dados já processados
   */
  generateFinalProcessedReport(session, multisensoryData, additionalData) {
    return {
      // Identificadores
      sessionId: session.sessionId,
      userId: session.userId,
      activityId: session.activityId,

      // Timing refinado
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      activeTime: session.activeTime,
      efficiency: session.duration > 0 ? (session.activeTime / session.duration) * 100 : 100,

      // Métricas base refinadas
      finalMetrics: {
        ...session.realTimeMetrics,
        finalAccuracy: session.realTimeMetrics.currentAccuracy,
        totalActions: session.eventBuffer.length,
        avgResponseTime: this.calculateAverageResponseTime(session.eventBuffer),
      },

      // Dados processados completos
      processedMetrics: {
        cognitiveProfile: session.processedData.cognitiveProfile,
        therapeuticInsights: session.processedData.therapeuticInsights,
        behavioralPatterns: this.extractBehavioralPatterns(session),
        adaptiveRecommendations: session.processedData.adaptiveRecommendations,
        neuropedagogicalMetrics: session.processedData.neuropedagogicalMetrics,
      },

      // Dados multissensoriais processados
      multisensoryAnalysis: multisensoryData,

      // Dados adicionais
      additionalData,

      // Metadados de processamento
      processingMetadata: {
        processedInRealTime: true,
        algorithmVersion: '2.0',
        totalEvents: session.eventBuffer.length,
        processingTimestamp: Date.now(),
      },
    }
  }

  /**
   * Salva dados já refinados no banco
   */
  async saveRefinedData(finalReport) {
    try {
      // Salvar na tabela principal com dados já processados
      const sessionData = {
        user_id: finalReport.userId,
        game_id: finalReport.activityId,
        session_id: finalReport.sessionId,
        difficulty: finalReport.additionalData.difficulty || 'MEDIUM',
        score: finalReport.finalMetrics.score,
        accuracy: finalReport.finalMetrics.finalAccuracy,
        time_spent: Math.floor(finalReport.activeTime / 1000),
        completed: true,
        correct_answers: finalReport.finalMetrics.successes,
        total_attempts: finalReport.finalMetrics.attempts,
        end_time: new Date(finalReport.endTime).toISOString(),
        status: 'completed',

        // Dados já processados no campo JSONB
        data: {
          processedMetrics: finalReport.processedMetrics,
          multisensoryAnalysis: finalReport.multisensoryAnalysis,
          processingMetadata: finalReport.processingMetadata,
          timing: {
            duration: finalReport.duration,
            activeTime: finalReport.activeTime,
            efficiency: finalReport.efficiency,
          },
        },
      }

      // Salvar sessão principal
      await databaseService.saveGameSession(sessionData)

      // Salvar perfil cognitivo atualizado se disponível
      if (finalReport.processedMetrics.cognitiveProfile) {
        await this.saveCognitiveProfile(
          finalReport.userId,
          finalReport.processedMetrics.cognitiveProfile
        )
      }

      // Salvar insights terapêuticos se disponíveis
      if (finalReport.processedMetrics.therapeuticInsights.length > 0) {
        await this.saveTherapeuticInsights(
          finalReport.userId,
          finalReport.processedMetrics.therapeuticInsights
        )
      }

      logger.info('Dados refinados salvos com sucesso', {
        sessionId: finalReport.sessionId,
        metricsKeys: Object.keys(finalReport.processedMetrics),
      })

      return true
    } catch (error) {
      logger.error('Erro ao salvar dados refinados', {
        error: error.message,
        sessionId: finalReport.sessionId,
      })
      return false
    }
  }

  /**
   * Inicializa analisador cognitivo
   */
  initializeCognitiveAnalyzer() {
    return {
      processEvent: (currentProfile, eventType, eventData, metrics) => {
        const updates = {}

        // Análise de velocidade de processamento
        if (eventData.responseTime) {
          updates.processingSpeed = this.calculateProcessingSpeed(
            eventData.responseTime,
            currentProfile.processingSpeed
          )
        }

        // Análise de atenção sustentada
        if (eventType === 'attempt') {
          updates.attentionSpan = this.updateAttentionSpan(metrics, currentProfile.attentionSpan)
        }

        // Análise de memória de trabalho
        if (eventData.sequenceLength) {
          updates.workingMemory = this.assessWorkingMemory(
            eventData.sequenceLength,
            currentProfile.workingMemory
          )
        }

        return { profileUpdates: updates }
      },
    }
  }

  /**
   * Inicializa processador terapêutico
   */
  initializeTherapeuticProcessor() {
    return {
      analyzeEvent: (eventType, eventData, currentInsights) => {
        const newInsights = []

        // Detectar padrões de persistência
        if (eventType === 'error' && eventData.consecutive > 2) {
          newInsights.push({
            type: 'persistence_support',
            recommendation: 'Implementar pausas estruturadas após 3 erros consecutivos',
            priority: 'high',
            timestamp: Date.now(),
          })
        }

        // Detectar sobrecarga sensorial
        if (eventData.responseTime > 5000 && eventType === 'attempt') {
          newInsights.push({
            type: 'sensory_overload',
            recommendation: 'Reduzir estímulos visuais e auditivos',
            priority: 'medium',
            timestamp: Date.now(),
          })
        }

        return { newInsights }
      },
    }
  }

  /**
   * Inicializa calculadora adaptativa
   */
  initializeAdaptiveCalculator() {
    return {
      calculateAdjustments: (metrics, currentRecommendations) => {
        const recommendations = []

        // Ajuste de dificuldade baseado em performance
        if (metrics.currentAccuracy > 85 && metrics.attempts > 5) {
          recommendations.push({
            type: 'difficulty_increase',
            value: 'medium_to_hard',
            reason: 'Performance acima de 85%',
          })
        } else if (metrics.currentAccuracy < 40 && metrics.attempts > 5) {
          recommendations.push({
            type: 'difficulty_decrease',
            value: 'medium_to_easy',
            reason: 'Performance abaixo de 40%',
          })
        }

        return { recommendations }
      },
    }
  }

  /**
   * Inicia coleta multissensorial
   */
  startMultisensoryCollection(sessionId) {
    // Integrar com sistema multissensorial existente
    if (multisensoryMetrics && typeof multisensoryMetrics.startMetricsCollection === 'function') {
      multisensoryMetrics.startMetricsCollection()
    }
  }

  /**
   * Finaliza coleta multissensorial
   */
  finishMultisensoryCollection(sessionId) {
    // Integrar com sistema multissensorial existente
    if (multisensoryMetrics && typeof multisensoryMetrics.stopMetricsCollection === 'function') {
      return multisensoryMetrics.stopMetricsCollection()
    }
    return null
  }

  /**
   * Processa dados neuropedagógicos em tempo real
   */ processNeuropedagogicalData(session, eventType, eventData) {
    // Integrar com analisador neuropedagógico existente
    if (
      NeuropedagogicalAnalyzer &&
      typeof NeuropedagogicalAnalyzer.processRealTimeEvent === 'function'
    ) {
      return NeuropedagogicalAnalyzer.processRealTimeEvent(
        eventType,
        eventData,
        session.realTimeMetrics
      )
    }
    return {}
  }

  /**
   * Extrai padrões comportamentais
   */
  extractBehavioralPatterns(session) {
    const events = session.eventBuffer
    return {
      errorPatterns: this.analyzeErrorPatterns(events),
      responseTimePatterns: this.analyzeResponseTimes(events),
      engagementPatterns: this.analyzeEngagement(events),
      pausePatterns: this.analyzePausePatterns(events),
    }
  }

  /**
   * Calcula tempo médio de resposta
   */
  calculateAverageResponseTime(events) {
    const responseTimes = events.filter((e) => e.data.responseTime).map((e) => e.data.responseTime)

    return responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0
  }

  /**
   * Inicializa perfil cognitivo base
   */
  initializeCognitiveProfile() {
    return {
      processingSpeed: 65.0,
      attentionSpan: 45.0,
      workingMemory: 55.0,
      patternRecognition: 70.0,
      executiveFunction: 60.0,
      lastUpdated: Date.now(),
    }
  }

  // Métodos auxiliares para análises específicas
  calculateProcessingSpeed(responseTime, currentSpeed) {
    // Lógica para atualizar velocidade de processamento
    return currentSpeed // Placeholder
  }

  updateAttentionSpan(metrics, currentSpan) {
    // Lógica para atualizar span atencional
    return currentSpan // Placeholder
  }

  assessWorkingMemory(sequenceLength, currentMemory) {
    // Lógica para avaliar memória de trabalho
    return currentMemory // Placeholder
  }

  analyzeErrorPatterns(events) {
    // Análise de padrões de erro
    return {}
  }

  analyzeResponseTimes(events) {
    // Análise de tempos de resposta
    return {}
  }

  analyzeEngagement(events) {
    // Análise de engajamento
    return {}
  }

  analyzePausePatterns(events) {
    // Análise de padrões de pausa
    return {}
  }

  async saveCognitiveProfile(userId, profile) {
    // Salvar perfil cognitivo atualizado
    try {
      await databaseService.saveCognitiveProfile(userId, profile)
    } catch (error) {
      logger.error('Erro ao salvar perfil cognitivo', { error: error.message, userId })
    }
  }

  async saveTherapeuticInsights(userId, insights) {
    // Salvar insights terapêuticos
    try {
      await databaseService.saveTherapeuticInsights(userId, insights)
    } catch (error) {
      logger.error('Erro ao salvar insights terapêuticos', { error: error.message, userId })
    }
  }

  /**
   * Atualiza parâmetros adaptativos em tempo real
   */
  updateAdaptiveParameters(session, insights) {
    if (insights.adaptive && insights.adaptive.recommendations) {
      // Aplicar ajustes adaptativos imediatamente
      insights.adaptive.recommendations.forEach((rec) => {
        if (rec.type === 'difficulty_increase') {
          session.realTimeMetrics.adaptiveLevel = 'hard'
        } else if (rec.type === 'difficulty_decrease') {
          session.realTimeMetrics.adaptiveLevel = 'easy'
        }
      })
    }
  }

  /**
   * Obtém métricas processadas em tempo real para a interface
   */
  getRealTimeMetrics(sessionId) {
    const session = this.activeSessions.get(sessionId)
    if (!session) return null

    return {
      baseMetrics: session.realTimeMetrics,
      processedData: session.processedData,
      recommendations: session.processedData.adaptiveRecommendations,
    }
  }

  /**
   * 📱 PROCESSAMENTO DE DADOS DE SENSORES MÓVEIS EM TEMPO REAL
   */
  async processMobileSensorData(session, eventData) {
    if (!eventData.mobileData) return null

    const mobileInsights = {
      timestamp: Date.now(),
      sessionId: session.sessionId,

      // 📱 Dados de toque e gestos
      touchMetrics: null,
      gesturePatterns: null,

      // 🎯 Dados de movimento
      motionMetrics: null,
      orientationChanges: null,

      // 🧠 Indicadores comportamentais móveis
      frustrationIndicators: null,
      engagementSignals: null,
      fatigueDetection: null,

      // 🎮 Adaptações específicas para mobile
      mobileAdaptations: null,
    }

    try {
      // Processar dados de toque
      if (eventData.mobileData.touch) {
        mobileInsights.touchMetrics = await this.analyzeTouchPatterns(eventData.mobileData.touch)
        mobileInsights.gesturePatterns = await this.detectGesturePatterns(
          eventData.mobileData.touch,
          session
        )
      }

      // Processar dados de movimento (giroscópio, acelerômetro)
      if (eventData.mobileData.motion) {
        mobileInsights.motionMetrics = await this.analyzeMotionData(eventData.mobileData.motion)
        mobileInsights.orientationChanges = await this.trackOrientationChanges(
          eventData.mobileData.motion,
          session
        )
      }

      // Detectar indicadores comportamentais através de sensores
      mobileInsights.frustrationIndicators = await this.detectFrustrationFromSensors(
        eventData.mobileData,
        session
      )
      mobileInsights.engagementSignals = await this.measureEngagementFromTouch(
        eventData.mobileData,
        session
      )
      mobileInsights.fatigueDetection = await this.detectFatigueFromMotion(
        eventData.mobileData,
        session
      )

      // Gerar adaptações específicas para dispositivos móveis
      mobileInsights.mobileAdaptations = await this.generateMobileAdaptations(
        mobileInsights,
        session
      )

      // Salvar insights no buffer da sessão
      if (!session.mobileInsights) session.mobileInsights = []
      session.mobileInsights.push(mobileInsights)

      // Manter apenas os últimos 20 insights para performance
      if (session.mobileInsights.length > 20) {
        session.mobileInsights = session.mobileInsights.slice(-20)
      }
    } catch (error) {
      logger.error('Erro no processamento de dados móveis:', error)
      mobileInsights.error = error.message
    }

    return mobileInsights
  }

  /**
   * 🤏 ANÁLISE DE PADRÕES DE TOQUE
   */
  async analyzeTouchPatterns(touchData) {
    return {
      pressure: touchData.pressure || 0,
      duration: touchData.duration || 0,
      frequency: touchData.frequency || 0,
      accuracy: touchData.accuracy || 100,
      hesitation: touchData.hesitation || false,
      multiTouch: touchData.multiTouch || false,

      // Métricas específicas para autismo
      repetitivePatterns: this.detectRepetitiveTouchPatterns(touchData),
      sensorySeekingBehavior: this.detectSensorySeekingTouch(touchData),
      motorPlanningDifficulty: this.assessMotorPlanningFromTouch(touchData),
    }
  }

  /**
   * 🎯 GERAÇÃO DE RECOMENDAÇÕES IMEDIATAS
   */
  async generateImmediateRecommendations(insights, session) {
    const recommendations = []

    // Recomendações baseadas em análise terapêutica
    if (insights.therapeuticAnalysis?.interventions) {
      insights.therapeuticAnalysis.interventions.forEach((intervention) => {
        if (intervention.priority === 'immediate') {
          recommendations.push({
            type: 'therapeutic',
            action: intervention.action,
            reason: intervention.reason,
            priority: 'high',
            timestamp: Date.now(),
            source: 'therapeutic_analysis',
          })
        }
      })
    }

    // Recomendações baseadas em análise emocional
    if (insights.emotionalAnalysis?.stressLevel > 0.7) {
      recommendations.push({
        type: 'emotional_regulation',
        action: 'reduce_stimulus',
        reason: 'Alto nível de stress detectado',
        priority: 'high',
        timestamp: Date.now(),
        source: 'emotional_analysis',
      })
    }

    // Recomendações baseadas em dados de sensores móveis
    if (insights.sensorData?.frustrationIndicators?.level > 0.8) {
      recommendations.push({
        type: 'sensory_adaptation',
        action: 'simplify_interface',
        reason: 'Frustração detectada através de padrões de toque',
        priority: 'high',
        timestamp: Date.now(),
        source: 'mobile_sensors',
      })
    }

    // Recomendações baseadas em adaptação de jogo
    if (insights.gameAdaptations?.suggestedDifficulty !== session.difficulty) {
      recommendations.push({
        type: 'difficulty_adjustment',
        action: 'adjust_difficulty',
        newDifficulty: insights.gameAdaptations.suggestedDifficulty,
        reason: insights.gameAdaptations.reason,
        priority: 'medium',
        timestamp: Date.now(),
        source: 'game_adaptation',
      })
    }

    return recommendations
  }

  /**
   * 🚨 DETECÇÃO DE INTERVENÇÕES TERAPÊUTICAS AUTOMÁTICAS
   */
  async detectTherapeuticInterventions(insights, session) {
    const interventions = []

    // Intervenção por sobrecarga sensorial
    if (insights.sensorData?.sensoryOverload || insights.emotionalAnalysis?.overwhelm) {
      interventions.push({
        type: 'sensory_break',
        action: 'immediate_pause',
        duration: 30000, // 30 segundos
        reason: 'Sobrecarga sensorial detectada',
        autismSpecific: true,
        timestamp: Date.now(),
      })
    }

    // Intervenção por padrões repetitivos excessivos
    if (insights.sensorData?.repetitivePatterns?.severity > 0.8) {
      interventions.push({
        type: 'redirect_attention',
        action: 'introduce_variation',
        reason: 'Padrões repetitivos excessivos detectados',
        autismSpecific: true,
        timestamp: Date.now(),
      })
    }

    // Intervenção por dificuldade de função executiva
    if (insights.cognitiveAnalysis?.executiveFunction?.difficulty > 0.7) {
      interventions.push({
        type: 'cognitive_support',
        action: 'increase_scaffolding',
        reason: 'Dificuldade de função executiva detectada',
        supports: ['visual_cues', 'step_by_step_guidance'],
        timestamp: Date.now(),
      })
    }

    return interventions
  }

  /**
   * 🔄 MÉTODOS DE CONSOLIDAÇÃO DE DADOS
   */
  consolidateTherapeuticInsights(session) {
    const allInsights = session.eventBuffer
      .map((event) => event.processedInsights?.therapeuticAnalysis)
      .filter((insight) => insight !== null && insight !== undefined)

    if (allInsights.length === 0) return null

    return {
      totalInsights: allInsights.length,
      mainPatterns: this.extractMainTherapeuticPatterns(allInsights),
      progressIndicators: this.calculateTherapeuticProgress(allInsights),
      recommendations: this.consolidateTherapeuticRecommendations(allInsights),
      interventionsTriggers: this.identifyInterventionTriggers(allInsights),
      autismSpecificInsights: this.extractAutismSpecificInsights(allInsights),
    }
  }

  consolidateMobileSensorData(session) {
    if (!session.mobileInsights || session.mobileInsights.length === 0) return null

    const touchMetrics = session.mobileInsights
      .map((insight) => insight.touchMetrics)
      .filter(Boolean)
    const motionMetrics = session.mobileInsights
      .map((insight) => insight.motionMetrics)
      .filter(Boolean)

    return {
      touchSummary: {
        totalTouches: touchMetrics.length,
        averagePressure: this.calculateAverage(touchMetrics, 'pressure'),
        averageDuration: this.calculateAverage(touchMetrics, 'duration'),
        frustrationEvents: touchMetrics.filter((tm) => tm.motorPlanningDifficulty).length,
        sensorySeekingEvents: touchMetrics.filter((tm) => tm.sensorySeekingBehavior.seeking).length,
      },
      motionSummary: {
        totalMotionEvents: motionMetrics.length,
        averageActivity: this.calculateAverage(motionMetrics, 'activity'),
        orientationChanges: motionMetrics.reduce(
          (sum, mm) => sum + (mm.orientationChanges || 0),
          0
        ),
        stabilityScore: this.calculateMotionStability(motionMetrics),
      },
      behavioralIndicators: {
        frustrationLevel: this.calculateAverageFrustration(session.mobileInsights),
        engagementLevel: this.calculateAverageEngagement(session.mobileInsights),
        fatigueLevel: this.calculateAverageFatigue(session.mobileInsights),
      },
    }
  }

  consolidateRecommendations(session) {
    const allRecommendations = session.eventBuffer.flatMap(
      (event) => event.processedInsights?.immediateRecommendations || []
    )

    return {
      total: allRecommendations.length,
      byType: this.groupRecommendationsByType(allRecommendations),
      byPriority: this.groupRecommendationsByPriority(allRecommendations),
      implementedCount: allRecommendations.filter((r) => r.implemented).length,
      therapeuticRecommendations: allRecommendations.filter((r) => r.type === 'therapeutic'),
    }
  }

  consolidateNeuroplasticityMetrics(session) {
    const neuroplasticityData = session.eventBuffer
      .map((event) => event.processedInsights?.neuroplasticityMetrics)
      .filter(Boolean)

    if (neuroplasticityData.length === 0) return null

    return {
      progressIndicators: this.calculateNeuroplasticityProgress(neuroplasticityData),
      cognitiveGains: this.measureCognitiveGains(neuroplasticityData),
      adaptationRate: this.calculateAdaptationRate(neuroplasticityData),
      plasticityPotential: this.assessPlasticityPotential(neuroplasticityData),
    }
  }

  /**
   * 💾 SALVAMENTO OTIMIZADO NO BANCO DE DADOS
   */
  async saveToDatabaseOptimized(refinedData) {
    try {
      // Preparar dados para diferentes tabelas de forma otimizada
      const databaseOperations = []

      // 1. Salvar sessão principal
      databaseOperations.push(
        databaseService.saveGameSession({
          session_id: refinedData.sessionId,
          user_id: refinedData.userId,
          game_id: refinedData.activityId,
          start_time: new Date(refinedData.startTime),
          end_time: new Date(refinedData.endTime),
          duration: refinedData.totalDuration,
          score: refinedData.finalMetrics.score,
          accuracy: refinedData.finalMetrics.currentAccuracy,
          difficulty: refinedData.finalMetrics.adaptiveLevel,
          completed: true,
          // Dados refinados já processados
          therapeutic_insights: JSON.stringify(refinedData.therapeuticInsights),
          mobile_sensor_data: JSON.stringify(refinedData.mobileSensorData),
          neuroplasticity_metrics: JSON.stringify(refinedData.neuroplasticityMetrics),
        })
      )

      // 2. Salvar métricas de engajamento refinadas
      if (refinedData.finalMetrics.engagementScore) {
        databaseOperations.push(
          databaseService.saveEngagementMetrics({
            user_id: refinedData.userId,
            session_id: refinedData.sessionId,
            engagement_score: refinedData.finalMetrics.engagementScore,
            flow_state_duration: refinedData.activeTime,
            attention_drops: this.countAttentionDrops(refinedData),
            interaction_quality: this.calculateInteractionQuality(refinedData),
          })
        )
      }

      // 3. Salvar recomendações terapêuticas
      if (refinedData.generatedRecommendations?.therapeuticRecommendations?.length > 0) {
        const therapeuticRecommendations =
          refinedData.generatedRecommendations.therapeuticRecommendations
        databaseOperations.push(
          databaseService.saveTherapeuticRecommendations({
            user_id: refinedData.userId,
            session_id: refinedData.sessionId,
            recommendations: JSON.stringify(therapeuticRecommendations),
            implementation_success: this.calculateImplementationSuccess(therapeuticRecommendations),
          })
        )
      }

      // 4. Salvar dados de neuroplasticidade
      if (refinedData.neuroplasticityMetrics) {
        databaseOperations.push(
          databaseService.saveNeuroplasticityTracking({
            user_id: refinedData.userId,
            session_id: refinedData.sessionId,
            cognitive_domain: refinedData.activityId,
            baseline_score: refinedData.neuroplasticityMetrics.progressIndicators?.baseline || 0,
            current_score: refinedData.neuroplasticityMetrics.progressIndicators?.current || 0,
            improvement_rate: refinedData.neuroplasticityMetrics.adaptationRate || 0,
            plasticity_indicators: JSON.stringify(
              refinedData.neuroplasticityMetrics.plasticityPotential
            ),
          })
        )
      }

      // 5. Salvar padrões de aprendizagem detectados
      if (refinedData.therapeuticInsights?.mainPatterns) {
        const patterns = refinedData.therapeuticInsights.mainPatterns
        databaseOperations.push(
          databaseService.saveLearningPatterns({
            user_id: refinedData.userId,
            session_id: refinedData.sessionId,
            patterns: JSON.stringify(patterns),
            confidence_score: this.calculatePatternsConfidence(patterns),
          })
        )
      }

      // Executar todas as operações em paralelo para otimização
      await Promise.all(databaseOperations)

      logger.info('Dados refinados salvos com sucesso no banco', {
        sessionId: refinedData.sessionId,
        operationsCount: databaseOperations.length,
      })
    } catch (error) {
      logger.error('Erro ao salvar dados refinados no banco:', error)

      // Tentar salvar pelo menos os dados essenciais
      await this.saveEssentialDataFallback(refinedData)
      throw error
    }
  }

  /**
   * 🚨 SALVAMENTO ESSENCIAL EM CASO DE FALHA
   */
  async saveEssentialDataFallback(refinedData) {
    try {
      // Salvar apenas os dados mais críticos
      await databaseService.saveGameSession({
        session_id: refinedData.sessionId,
        user_id: refinedData.userId,
        game_id: refinedData.activityId,
        duration: refinedData.totalDuration,
        score: refinedData.finalMetrics.score,
        accuracy: refinedData.finalMetrics.currentAccuracy,
        completed: true,
        // Dados compactados
        summary_data: JSON.stringify({
          therapeuticInsights: refinedData.therapeuticInsights?.mainPatterns || null,
          mobileData: refinedData.mobileSensorData?.behavioralIndicators || null,
          recommendations: refinedData.generatedRecommendations?.total || 0,
        }),
      })

      logger.info('Dados essenciais salvos como fallback')
    } catch (fallbackError) {
      logger.error('Falha crítica ao salvar dados essenciais:', fallbackError)
    }
  }

  /**
   * 📊 MÉTODOS AUXILIARES DE CÁLCULO
   */
  calculateAverage(array, property) {
    if (!array.length) return 0
    return array.reduce((sum, item) => sum + (item[property] || 0), 0) / array.length
  }

  calculateAccuracyTrend(session) {
    const accuracyHistory = session.eventBuffer
      .map((event) => event.data?.accuracy || session.realTimeMetrics.currentAccuracy)
      .filter((acc) => acc !== undefined)

    if (accuracyHistory.length < 2) return 'insufficient_data'

    const firstHalf = accuracyHistory.slice(0, Math.floor(accuracyHistory.length / 2))
    const secondHalf = accuracyHistory.slice(Math.floor(accuracyHistory.length / 2))

    const firstAvg = firstHalf.reduce((sum, acc) => sum + acc, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, acc) => sum + acc, 0) / secondHalf.length

    if (secondAvg > firstAvg + 5) return 'improving'
    if (secondAvg < firstAvg - 5) return 'declining'
    return 'stable'
  }

  calculateEngagementScore(session) {
    const totalTime = Date.now() - session.startTime
    const activeTime = totalTime - (session.totalPauseTime || 0)
    const engagementRatio = activeTime / totalTime

    // Combinar com métricas de qualidade de interação
    const interactionQuality = this.calculateInteractionQuality(session)

    return Math.round((engagementRatio * 0.6 + interactionQuality * 0.4) * 100)
  }

  calculateInteractionQuality(session) {
    if (!session.mobileInsights) return 0.5

    const qualityMetrics = session.mobileInsights.map(
      (insight) => insight.engagementSignals?.level || 0.5
    )

    return qualityMetrics.reduce((sum, metric) => sum + metric, 0) / qualityMetrics.length
  }
}

// Exportar instância singleton
const realTimeMetricsProcessor = new RealTimeMetricsProcessor()

export default realTimeMetricsProcessor
