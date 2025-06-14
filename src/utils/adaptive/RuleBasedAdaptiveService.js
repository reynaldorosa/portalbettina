/**
 * @file RuleBasedAdaptiveService.js
 * @description Serviço adaptativo baseado em regras para Portal Betina
 * Substitui o EnhancedAdaptiveMLService sem utilizar machine learning
 *
 * 🎯 FASE 3.5 - Integração Adaptativa Cognitiva-Comportamental
 * Integra o sistema adaptativo baseado em regras com análise cognitiva de autismo
 * e engajamento comportamental para adaptações personalizadas
 * SEM MACHINE LEARNING - Apenas algoritmos determinísticos baseados em regras
 *
 * @version 2.0.0
 * @created 2025-06-12
 */

import { logger } from '../../config/api-config.js'

/**
 * @class RuleBasedAdaptiveService
 * @description Implementação baseada em regras que substitui a implementação ML
 * Fornece a mesma API externa do EnhancedAdaptiveMLService para manter compatibilidade
 * Fase 3.5 - Integração com sistemas cognitivos e comportamentais
 */
export class RuleBasedAdaptiveService {
  constructor(databaseService, config = {}) {
    this.db = databaseService
    this.logger = databaseService?.logger || logger || console
    this.cache = databaseService?.cache || new Map()

    this.config = {
      adaptiveThreshold: 0.75,
      autismSpecificOptimizations: true,
      neurodiversitySupport: true,
      therapeuticAlignment: true,
      personalizedAdaptations: true,
      realTimeAdaptation: true,
      contextualAwareness: true,
      // Configurações da Fase 3.5
      enableCognitiveIntegration: true,
      enableBehavioralIntegration: true,
      enableSystemOrchestration: true,
      adaptationSyncInterval: 30000, // 30 segundos
      ...config,
    }

    // Dados de usuário e métricas
    this.userProfiles = new Map()
    this.sessionMetrics = new Map()
    this.adaptationCache = new Map()
    this.predictionListeners = []
    this.accessibilityListeners = []

    // Fase 3.5 - Referências para integração
    this.cognitiveAnalysisRef = null
    this.behavioralAnalysisRef = null
    this.orchestratorRef = null

    // Cache e status de integração Fase 3.5
    this.integrationStatus = {
      cognitiveAnalysis: false,
      behavioralAnalysis: false,
      systemOrchestrator: false,
      lastSyncTimestamp: null,
      syncErrors: 0,
    }

    this.adaptiveInsightsCache = new Map()
    this.cognitiveAdaptationRules = new Map()

    // Estado atual
    this.lastUpdateTimestamp = Date.now()
    this.ready = false
  }

  /**
   * @method initialize
   * @async
   * @description Inicializa o serviço adaptativo baseado em regras
   * Fase 3.5 - Inicialização com integrações cognitivas e comportamentais
   */
  async initialize() {
    try {
      this.logger.info('🚀 Inicializando Rule-Based Adaptive Service...')

      // Carregar dados iniciais do banco de dados
      if (this.db && this.db.loadAdaptiveRules) {
        const rules = await this.db.loadAdaptiveRules()
        if (rules) {
          this.rules = rules
        }
      }

      // Inicializar regras padrão se não houver no banco
      if (!this.rules) {
        this.initializeDefaultRules()
      }

      // Configurar qualquer estado necessário
      this.setupAdaptiveSystem()

      // Fase 3.5 - Inicializar integrações cognitivas e comportamentais
      if (this.config.enableCognitiveIntegration) {
        this.initializeCognitiveIntegration()
      }

      if (this.config.enableBehavioralIntegration) {
        this.initializeBehavioralIntegration()
      }

      if (this.config.enableSystemOrchestration) {
        this.initializeSystemOrchestration()
      }

      this.ready = true
      this.logger.info('✅ Rule-Based Adaptive Service inicializado com sucesso')
      return true
    } catch (error) {
      this.logger.error('❌ Erro ao inicializar Rule-Based Adaptive Service:', error)
      return false
    }
  }

  /**
   * @method initializeDefaultRules
   * @private
   * @description Inicializa regras padrão para adaptações
   */
  initializeDefaultRules() {
    this.rules = {
      accessibilityRules: [
        {
          condition: 'visual_preference_high',
          adaptation: 'enhance_visual_elements',
          threshold: 0.7,
          priority: 'high',
        },
        {
          condition: 'auditory_preference_high',
          adaptation: 'enhance_audio_feedback',
          threshold: 0.7,
          priority: 'high',
        },
        {
          condition: 'low_motor_control',
          adaptation: 'increase_touch_targets',
          threshold: 0.6,
          priority: 'medium',
        },
        {
          condition: 'autism_sensory_sensitivity',
          adaptation: 'reduce_sensory_load',
          threshold: 0.5,
          priority: 'high',
        },
      ],
      difficultyRules: [
        {
          condition: 'consecutive_failures',
          adaptation: 'reduce_difficulty',
          threshold: 3,
          priority: 'high',
        },
        {
          condition: 'high_success_rate',
          adaptation: 'increase_difficulty',
          threshold: 0.8,
          priority: 'medium',
        },
        {
          condition: 'completion_time_excessive',
          adaptation: 'simplify_task',
          threshold: 1.5, // 1.5x tempo médio
          priority: 'medium',
        },
      ],
      engagementRules: [
        {
          condition: 'low_interaction_rate',
          adaptation: 'add_interactive_elements',
          threshold: 0.4,
          priority: 'medium',
        },
        {
          condition: 'frequent_distractions',
          adaptation: 'reduce_distractions',
          threshold: 0.6,
          priority: 'high',
        },
        {
          condition: 'rapid_task_switching',
          adaptation: 'increase_focus_elements',
          threshold: 0.7,
          priority: 'medium',
        },
      ],
      therapyRules: [
        {
          condition: 'skill_mastery',
          adaptation: 'introduce_related_skill',
          threshold: 0.9,
          priority: 'medium',
        },
        {
          condition: 'repeated_mistake',
          adaptation: 'provide_focused_practice',
          threshold: 3,
          priority: 'high',
        },
        {
          condition: 'emotional_distress',
          adaptation: 'offer_calming_activity',
          threshold: 0.7,
          priority: 'critical',
        },
      ],
    }
  }

  /**
   * @method setupAdaptiveSystem
   * @private
   * @description Configura o sistema adaptativo
   */
  setupAdaptiveSystem() {
    // Configurar intervalo para limpeza de cache
    setInterval(() => {
      this.cleanupCache()
    }, 3600000) // Limpar a cada hora
  }

  /**
   * @method cleanupCache
   * @private
   * @description Limpa caches antigos
   */
  cleanupCache() {
    const now = Date.now()
    const maxAge = 86400000 // 24 horas

    // Limpar cache de adaptação
    this.adaptationCache.forEach((data, key) => {
      if (now - data.timestamp > maxAge) {
        this.adaptationCache.delete(key)
      }
    })

    // Fase 3.5 - Limpar cache de insights adaptativos
    this.adaptiveInsightsCache.forEach((data, key) => {
      if (now - data.timestamp > maxAge) {
        this.adaptiveInsightsCache.delete(key)
      }
    })
  }

  /**
   * @method onPrediction
   * @description Registra um callback para quando uma predição é feita
   * @param {Function} callback - Função a ser chamada com a predição
   */
  onPrediction(callback) {
    if (typeof callback === 'function') {
      this.predictionListeners.push(callback)
    }
  }

  /**
   * @method onAccessibilityPrediction
   * @description Registra um callback para quando uma predição de acessibilidade é feita
   * @param {Function} callback - Função a ser chamada com a predição
   */
  onAccessibilityPrediction(callback) {
    if (typeof callback === 'function') {
      this.accessibilityListeners.push(callback)
    }
  }

  /**
   * @method getCurrentState
   * @async
   * @description Obtém o estado atual do sistema adaptativo
   * @returns {Object} Estado atual do sistema
   */
  async getCurrentState() {
    return {
      ready: this.ready,
      lastUpdateTimestamp: this.lastUpdateTimestamp,
      activeUserCount: this.userProfiles.size,
      activeSessionCount: this.sessionMetrics.size,
      cacheSize: this.adaptationCache.size,
      ruleCount: Object.values(this.rules || {}).reduce((total, arr) => total + arr.length, 0),
    }
  }

  /**
   * @method getPredictionsForMetrics
   * @async
   * @description Obtém predições baseadas em métricas (substituindo ML com regras)
   * @returns {Object} Predições geradas por regras
   */
  async getPredictionsForMetrics() {
    const predictions = {
      difficulty: this.calculateDifficultyPredictions(),
      engagement: this.calculateEngagementPredictions(),
      therapy: this.calculateTherapyPredictions(),
      timestamp: Date.now(),
    }

    // Notificar listeners
    this.predictionListeners.forEach((listener) => {
      try {
        listener(predictions)
      } catch (error) {
        this.logger.error('Erro ao notificar listener de predição:', error)
      }
    })

    return predictions
  }

  /**
   * @method getAccessibilityPredictions
   * @async
   * @description Obtém predições de acessibilidade baseadas em regras
   * @returns {Object} Predições de acessibilidade
   */
  async getAccessibilityPredictions() {
    const predictions = {
      sensory: this.calculateSensoryPredictions(),
      interface: this.calculateInterfacePredictions(),
      interaction: this.calculateInteractionPredictions(),
      timestamp: Date.now(),
    }

    // Notificar listeners
    this.accessibilityListeners.forEach((listener) => {
      try {
        listener(predictions)
      } catch (error) {
        this.logger.error('Erro ao notificar listener de acessibilidade:', error)
      }
    })

    return predictions
  }

  /**
   * @method incorporateMetricsInsight
   * @async
   * @description Incorpora insights de métricas no sistema adaptativo
   * @param {Object} insight - Insights de métricas
   * @returns {Boolean} Sucesso da operação
   */
  async incorporateMetricsInsight(insight) {
    if (!insight) return false

    try {
      // Processar insights e atualizar métricas internas
      if (insight.userId) {
        const userProfile = this.userProfiles.get(insight.userId) || {}

        // Atualizar perfil com novos insights
        this.userProfiles.set(insight.userId, {
          ...userProfile,
          lastInsight: insight,
          lastUpdate: Date.now(),
          metricHistory: [...(userProfile.metricHistory || []).slice(-9), insight],
        })
      }

      // Atualizar timestamp
      this.lastUpdateTimestamp = Date.now()
      return true
    } catch (error) {
      this.logger.error('Erro ao incorporar insight:', error)
      return false
    }
  }

  /**
   * @method initializeUserSession
   * @async
   * @description Inicializa uma sessão de usuário
   * @param {Object} sessionData - Dados da sessão
   * @returns {Boolean} Sucesso da inicialização
   */
  async initializeUserSession(sessionData) {
    if (!sessionData || !sessionData.userId) return false

    try {
      // Registrar sessão
      this.sessionMetrics.set(sessionData.userId, {
        ...sessionData,
        startTime: Date.now(),
        interactions: 0,
        adaptations: [],
      })

      // Inicializar perfil de usuário se não existir
      if (!this.userProfiles.has(sessionData.userId)) {
        this.userProfiles.set(sessionData.userId, {
          userId: sessionData.userId,
          created: Date.now(),
          metricHistory: [],
        })
      }

      return true
    } catch (error) {
      this.logger.error('Erro ao inicializar sessão:', error)
      return false
    }
  }

  /**
   * @method processInteraction
   * @async
   * @description Processa uma interação do usuário
   * @param {Object} interactionData - Dados da interação
   * @returns {Object} Resultado do processamento
   */
  async processInteraction(interactionData) {
    if (!interactionData || !interactionData.userId) return { success: false }

    try {
      // Obter sessão atual
      const session = this.sessionMetrics.get(interactionData.userId)
      if (!session) {
        // Inicializar nova sessão se não existir
        this.initializeUserSession({ userId: interactionData.userId })
      }

      // Atualizar dados da sessão
      this.sessionMetrics.set(interactionData.userId, {
        ...session,
        lastInteractionTime: Date.now(),
        interactions: (session?.interactions || 0) + 1,
      })

      // Avaliar adaptações necessárias
      const adaptations = this.evaluateAdaptationsForInteraction(interactionData)

      return {
        success: true,
        adaptations,
        insights: this.generateInteractionInsights(interactionData),
      }
    } catch (error) {
      this.logger.error('Erro ao processar interação:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * @method generateUserProfile
   * @async
   * @description Gera perfil de usuário baseado em regras
   * @param {String} userId - ID do usuário
   * @returns {Object} Perfil do usuário
   */
  async generateUserProfile(userId) {
    if (!userId) return null

    try {
      const userProfile = this.userProfiles.get(userId)
      const sessionData = this.sessionMetrics.get(userId)

      // Se não há dados suficientes, retorna perfil básico
      if (!userProfile) {
        return {
          userId,
          initialProfile: true,
          confidenceScore: 0.3,
          generationTimestamp: Date.now(),
        }
      }

      // Análise baseada em histórico
      const metricHistory = userProfile.metricHistory || []

      // Calcular preferências e necessidades com base nas métricas
      const accessibilityProfile = this.calculateAccessibilityProfile(metricHistory)
      const learningProfile = this.calculateLearningProfile(metricHistory)
      const engagementPattern = this.calculateEngagementPattern(metricHistory)

      // Gerar perfil final
      const profile = {
        userId,
        accessibilityProfile,
        learningProfile,
        engagementPattern,
        recentActivity: {
          sessionCount: metricHistory.length,
          lastActive: sessionData?.lastInteractionTime || userProfile.lastUpdate,
        },
        confidenceScore: this.calculateProfileConfidence(metricHistory),
        generationTimestamp: Date.now(),
      }

      return profile
    } catch (error) {
      this.logger.error('Erro ao gerar perfil de usuário:', error)
      return {
        userId,
        error: true,
        confidenceScore: 0,
        generationTimestamp: Date.now(),
      }
    }
  }

  // ========== MÉTODOS DE CÁLCULO BASEADOS EM REGRAS ==========

  /**
   * Calcula predições de dificuldade baseadas em regras
   * @private
   */
  calculateDifficultyPredictions() {
    // Implementação baseada em regras para substituir ML
    const activeSessions = Array.from(this.sessionMetrics.values()).filter(
      (session) => Date.now() - session.lastInteractionTime < 3600000
    )

    const predictions = {}

    activeSessions.forEach((session) => {
      const userId = session.userId
      const userProfile = this.userProfiles.get(userId)

      if (userProfile && userProfile.metricHistory && userProfile.metricHistory.length > 0) {
        const recentMetrics = userProfile.metricHistory.slice(-5)

        // Calcular taxa média de sucesso
        const successRates = recentMetrics
          .filter((metric) => metric.performance?.successRate !== undefined)
          .map((metric) => metric.performance.successRate)

        const avgSuccessRate =
          successRates.length > 0
            ? successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length
            : 0.5

        // Determinar nível de dificuldade recomendado
        let recommendedLevel = 'medium'
        if (avgSuccessRate > 0.8) recommendedLevel = 'hard'
        else if (avgSuccessRate < 0.4) recommendedLevel = 'easy'

        predictions[userId] = {
          currentLevel: session.difficulty || 'medium',
          recommendedLevel,
          confidenceScore: Math.min(0.9, 0.5 + successRates.length * 0.1),
          reasoning: `Taxa média de sucesso: ${(avgSuccessRate * 100).toFixed(1)}%`,
        }
      }
    })

    return predictions
  }

  /**
   * Calcula predições de engajamento baseadas em regras
   * @private
   */
  calculateEngagementPredictions() {
    const predictions = {}

    this.userProfiles.forEach((profile, userId) => {
      const session = this.sessionMetrics.get(userId)
      if (!session) return

      const metricHistory = profile.metricHistory || []
      if (metricHistory.length === 0) return

      // Analisar métricas de engajamento
      const engagementMetrics = metricHistory
        .filter((metric) => metric.engagement !== undefined)
        .map((metric) => metric.engagement)

      if (engagementMetrics.length > 0) {
        const recentEngagement = engagementMetrics.slice(-3)
        const avgEngagement =
          recentEngagement.reduce((sum, val) => sum + val, 0) / recentEngagement.length

        // Verificar tendência (crescente ou decrescente)
        const engagementTrend =
          recentEngagement.length > 1
            ? (recentEngagement[recentEngagement.length - 1] - recentEngagement[0]) /
              recentEngagement.length
            : 0

        predictions[userId] = {
          currentEngagement: avgEngagement,
          predictedTrend:
            engagementTrend > 0 ? 'increasing' : engagementTrend < 0 ? 'decreasing' : 'stable',
          confidenceScore: Math.min(0.85, 0.4 + engagementMetrics.length * 0.05),
          interventionNeeded: avgEngagement < 0.4 || engagementTrend < -0.1,
        }
      }
    })

    return predictions
  }

  /**
   * Calcula predições terapêuticas baseadas em regras
   * @private
   */
  calculateTherapyPredictions() {
    const predictions = {}

    this.userProfiles.forEach((profile, userId) => {
      const metricHistory = profile.metricHistory || []
      if (metricHistory.length < 3) return

      // Extrair métricas relevantes
      const skillMetrics = metricHistory
        .filter((metric) => metric.skillProgress)
        .map((metric) => metric.skillProgress)

      if (skillMetrics.length > 0) {
        // Agrupar habilidades
        const skillGroups = {}

        skillMetrics.forEach((skillSet) => {
          Object.entries(skillSet).forEach(([skill, progress]) => {
            if (!skillGroups[skill]) skillGroups[skill] = []
            skillGroups[skill].push(progress)
          })
        })

        // Analisar progresso por habilidade
        const skillAnalysis = {}
        Object.entries(skillGroups).forEach(([skill, progressList]) => {
          const avgProgress = progressList.reduce((sum, val) => sum + val, 0) / progressList.length
          const recentProgress = progressList.slice(-3)
          const progressRate =
            recentProgress.length > 1
              ? (recentProgress[recentProgress.length - 1] - recentProgress[0]) /
                recentProgress.length
              : 0

          skillAnalysis[skill] = {
            currentLevel: avgProgress,
            progressRate,
            mastered: avgProgress > 0.85,
            needsFocus: avgProgress < 0.4 || progressRate < 0,
          }
        })

        // Gerar recomendações
        const mastered = Object.entries(skillAnalysis)
          .filter(([_, data]) => data.mastered)
          .map(([skill]) => skill)

        const needsFocus = Object.entries(skillAnalysis)
          .filter(([_, data]) => data.needsFocus)
          .map(([skill]) => skill)

        predictions[userId] = {
          skillAnalysis,
          recommendations: {
            masteredSkills: mastered,
            focusSkills: needsFocus,
            nextSteps: this.generateTherapyNextSteps(skillAnalysis),
          },
          confidenceScore: Math.min(0.8, 0.3 + Object.keys(skillAnalysis).length * 0.05),
        }
      }
    })

    return predictions
  }

  /**
   * Calcula predições sensoriais baseadas em regras
   * @private
   */
  calculateSensoryPredictions() {
    const predictions = {}

    this.userProfiles.forEach((profile, userId) => {
      const metricHistory = profile.metricHistory || []
      if (metricHistory.length === 0) return

      // Extrair métricas sensoriais
      const sensoryMetrics = metricHistory
        .filter((metric) => metric.sensoryResponse)
        .map((metric) => metric.sensoryResponse)

      if (sensoryMetrics.length > 0) {
        // Analisar preferências e sensibilidades
        const sensoryPreferences = {
          visual: 0,
          auditory: 0,
          tactile: 0,
        }

        const sensorySensitivities = {
          visual: 0,
          auditory: 0,
          tactile: 0,
        }

        let sensoryDataPoints = 0

        sensoryMetrics.forEach((data) => {
          if (data.preferences) {
            sensoryPreferences.visual += data.preferences.visual || 0
            sensoryPreferences.auditory += data.preferences.auditory || 0
            sensoryPreferences.tactile += data.preferences.tactile || 0
            sensoryDataPoints++
          }

          if (data.sensitivities) {
            sensorySensitivities.visual += data.sensitivities.visual || 0
            sensorySensitivities.auditory += data.sensitivities.auditory || 0
            sensorySensitivities.tactile += data.sensitivities.tactile || 0
          }
        })

        // Normalizar
        if (sensoryDataPoints > 0) {
          sensoryPreferences.visual /= sensoryDataPoints
          sensoryPreferences.auditory /= sensoryDataPoints
          sensoryPreferences.tactile /= sensoryDataPoints

          sensorySensitivities.visual /= sensoryDataPoints
          sensorySensitivities.auditory /= sensoryDataPoints
          sensorySensitivities.tactile /= sensoryDataPoints
        }

        // Determinar preferência dominante
        const prefValues = Object.values(sensoryPreferences)
        const maxPref = Math.max(...prefValues)
        const dominantModality =
          Object.keys(sensoryPreferences).find((key) => sensoryPreferences[key] === maxPref) ||
          'visual'

        predictions[userId] = {
          dominantModality,
          sensoryPreferences,
          sensorySensitivities,
          confidenceScore: Math.min(0.85, 0.4 + sensoryMetrics.length * 0.05),
        }
      }
    })

    return predictions
  }

  /**
   * Calcula predições de interface baseadas em regras
   * @private
   */
  calculateInterfacePredictions() {
    // Implementação simplificada baseada em regras
    const predictions = {}

    this.userProfiles.forEach((profile, userId) => {
      const session = this.sessionMetrics.get(userId)
      if (!session) return

      // Usar sensory predictions como base
      const sensoryPredictions = this.calculateSensoryPredictions()[userId]
      if (!sensoryPredictions) return

      const adaptations = []

      // Adaptar baseado na modalidade dominante
      switch (sensoryPredictions.dominantModality) {
        case 'visual':
          adaptations.push('enhance_visual_elements', 'increase_contrast', 'use_structured_layout')
          break
        case 'auditory':
          adaptations.push(
            'enhance_audio_feedback',
            'provide_verbal_instructions',
            'reduce_visual_clutter'
          )
          break
        case 'tactile':
          adaptations.push('enlarge_touch_targets', 'add_haptic_feedback', 'simplify_gestures')
          break
      }

      // Adaptar baseado em sensitividades
      if (sensoryPredictions.sensorySensitivities.visual > 0.7) {
        adaptations.push('reduce_animations', 'provide_neutral_theme', 'reduce_visual_complexity')
      }

      if (sensoryPredictions.sensorySensitivities.auditory > 0.7) {
        adaptations.push(
          'reduce_audio_volume',
          'provide_visual_alternatives',
          'simplify_audio_environment'
        )
      }

      predictions[userId] = {
        recommendedAdaptations: adaptations,
        priorityLevel:
          sensoryPredictions.sensorySensitivities.visual > 0.8 ||
          sensoryPredictions.sensorySensitivities.auditory > 0.8
            ? 'high'
            : 'medium',
        confidenceScore: sensoryPredictions.confidenceScore,
      }
    })

    return predictions
  }

  /**
   * Calcula predições de interação baseadas em regras
   * @private
   */
  calculateInteractionPredictions() {
    const predictions = {}

    this.userProfiles.forEach((profile, userId) => {
      const session = this.sessionMetrics.get(userId)
      if (!session) return

      const metricHistory = profile.metricHistory || []

      // Extrair métricas de interação
      const interactionMetrics = metricHistory
        .filter((metric) => metric.interaction)
        .map((metric) => metric.interaction)

      if (interactionMetrics.length > 0) {
        const recentInteractions = interactionMetrics.slice(-3)

        // Calcular médias
        let avgResponseTime = 0
        let avgErrorRate = 0
        let avgCompletionRate = 0
        let dataPoints = 0

        recentInteractions.forEach((data) => {
          if (data.responseTime !== undefined) {
            avgResponseTime += data.responseTime
            dataPoints++
          }

          if (data.errorRate !== undefined) {
            avgErrorRate += data.errorRate
          }

          if (data.completionRate !== undefined) {
            avgCompletionRate += data.completionRate
          }
        })

        if (dataPoints > 0) {
          avgResponseTime /= dataPoints
          avgErrorRate /= dataPoints
          avgCompletionRate /= dataPoints
        }

        // Determinar adaptações necessárias
        const adaptations = []

        if (avgResponseTime > 3000) {
          adaptations.push('increase_response_time', 'simplify_interaction_steps')
        }

        if (avgErrorRate > 0.3) {
          adaptations.push(
            'provide_additional_guidance',
            'increase_error_tolerance',
            'simplify_interaction_requirements'
          )
        }

        if (avgCompletionRate < 0.7) {
          adaptations.push(
            'break_into_smaller_steps',
            'provide_progress_indicators',
            'add_completion_incentives'
          )
        }

        predictions[userId] = {
          interactionMetrics: {
            avgResponseTime,
            avgErrorRate,
            avgCompletionRate,
          },
          recommendedAdaptations: adaptations,
          confidenceScore: Math.min(0.8, 0.3 + interactionMetrics.length * 0.05),
        }
      }
    })

    return predictions
  }

  /**
   * Avalia adaptações necessárias para uma interação
   * @private
   */
  evaluateAdaptationsForInteraction(interactionData) {
    const adaptations = []

    // Verificar cache primeiro
    const cacheKey = `${interactionData.userId}-${interactionData.type}`
    const cachedAdaptations = this.adaptationCache.get(cacheKey)

    if (cachedAdaptations && Date.now() - cachedAdaptations.timestamp < 60000) {
      return cachedAdaptations.adaptations
    }

    // Avaliar adaptações baseadas em regras
    if (interactionData.errorRate && interactionData.errorRate > 0.5) {
      adaptations.push({
        type: 'support',
        action: 'provide_guidance',
        priority: 'high',
        explanation: 'Taxa de erros elevada detectada',
      })
    }

    if (interactionData.responseTime && interactionData.responseTime > 5000) {
      adaptations.push({
        type: 'interface',
        action: 'simplify_current_step',
        priority: 'medium',
        explanation: 'Tempo de resposta elevado',
      })
    }

    if (interactionData.frustration && interactionData.frustration > 0.7) {
      adaptations.push({
        type: 'emotional',
        action: 'offer_break',
        priority: 'critical',
        explanation: 'Nível de frustração alto detectado',
      })
    }

    // Armazenar em cache
    this.adaptationCache.set(cacheKey, {
      adaptations,
      timestamp: Date.now(),
    })

    return adaptations
  }

  /**
   * Gera insights com base em uma interação
   * @private
   */
  generateInteractionInsights(interactionData) {
    return {
      timestamp: Date.now(),
      insights: [
        {
          type: 'engagement',
          value: this.calculateEngagementScore(interactionData),
          confidence: 0.7,
        },
        {
          type: 'usability',
          value: this.calculateUsabilityScore(interactionData),
          confidence: 0.6,
        },
      ],
    }
  }

  /**
   * Calcula perfil de acessibilidade com base em histórico
   * @private
   */
  calculateAccessibilityProfile(metricHistory) {
    // Implementação baseada em regras
    return {
      visual: this.extractAverageMetric(metricHistory, 'sensoryResponse.preferences.visual') || 0.5,
      auditory:
        this.extractAverageMetric(metricHistory, 'sensoryResponse.preferences.auditory') || 0.5,
      tactile:
        this.extractAverageMetric(metricHistory, 'sensoryResponse.preferences.tactile') || 0.5,
      sensitivities: {
        visual:
          this.extractAverageMetric(metricHistory, 'sensoryResponse.sensitivities.visual') || 0,
        auditory:
          this.extractAverageMetric(metricHistory, 'sensoryResponse.sensitivities.auditory') || 0,
        tactile:
          this.extractAverageMetric(metricHistory, 'sensoryResponse.sensitivities.tactile') || 0,
      },
    }
  }

  /**
   * Calcula perfil de aprendizagem com base em histórico
   * @private
   */
  calculateLearningProfile(metricHistory) {
    return {
      preferredPace: this.determineLearningPace(metricHistory),
      errorTolerance: this.determineErrorTolerance(metricHistory),
      repetitionNeeds: this.determineRepetitionNeeds(metricHistory),
    }
  }

  /**
   * Calcula padrão de engajamento com base em histórico
   * @private
   */
  calculateEngagementPattern(metricHistory) {
    return {
      averageSessionDuration:
        this.extractAverageMetric(metricHistory, 'sessionData.duration') || 300,
      preferredActivities: this.determinePreferredActivities(metricHistory),
      attentionSpan: this.determineAttentionSpan(metricHistory),
    }
  }

  /**
   * Calcula confiança do perfil com base no histórico
   * @private
   */
  calculateProfileConfidence(metricHistory) {
    return Math.min(0.9, 0.3 + metricHistory.length * 0.05)
  }

  /**
   * Gera próximos passos terapêuticos
   * @private
   */
  generateTherapyNextSteps(skillAnalysis) {
    // Implementação baseada em regras
    const nextSteps = []

    // Identificar habilidades para expansão
    const expansion = Object.entries(skillAnalysis)
      .filter(([_, data]) => data.mastered)
      .map(([skill]) => {
        if (skill === 'basicCounting') return 'advancedCounting'
        if (skill === 'letterRecognition') return 'wordReading'
        if (skill === 'basicColors') return 'colorMixing'
        return `advanced${skill.charAt(0).toUpperCase()}${skill.slice(1)}`
      })

    // Identificar habilidades para reforço
    const reinforcement = Object.entries(skillAnalysis)
      .filter(([_, data]) => data.currentLevel > 0.4 && data.currentLevel < 0.8)
      .map(([skill]) => skill)

    // Identificar habilidades para recuperação
    const recovery = Object.entries(skillAnalysis)
      .filter(([_, data]) => data.currentLevel < 0.4)
      .map(([skill]) => skill)

    // Adicionar recomendações baseadas em regras
    if (expansion.length > 0) {
      nextSteps.push({
        type: 'expansion',
        activities: expansion.map((skill) => `expand_${skill}`),
        priority: 'medium',
      })
    }

    if (reinforcement.length > 0) {
      nextSteps.push({
        type: 'reinforcement',
        activities: reinforcement.map((skill) => `reinforce_${skill}`),
        priority: 'high',
      })
    }

    if (recovery.length > 0) {
      nextSteps.push({
        type: 'recovery',
        activities: recovery.map((skill) => `recover_${skill}`),
        priority: 'critical',
      })
    }

    return nextSteps
  }

  // ========== MÉTODOS AUXILIARES DA FASE 3.5 ==========

  /**
   * @method getCognitiveAdaptationStrategy
   * @private
   * @description Obtém estratégia de adaptação para uma barreira cognitiva
   */
  getCognitiveAdaptationStrategy(barrier) {
    const strategyMap = {
      attentional_focus: 'reduce_distractions_increase_focus_cues',
      working_memory: 'provide_memory_aids_chunk_information',
      cognitive_flexibility: 'use_structured_transitions_visual_schedules',
      processing_speed: 'allow_extra_time_simplify_instructions',
      executive_function: 'break_tasks_provide_step_by_step_guidance',
    }

    return strategyMap[barrier.area] || 'general_cognitive_support'
  }

  /**
   * @method generateSensoryAdaptations
   * @private
   * @description Gera adaptações baseadas em considerações sensoriais
   */
  generateSensoryAdaptations(sensoryConsiderations) {
    const adaptations = []

    if (sensoryConsiderations.visual) {
      adaptations.push({
        type: 'visual_adaptation',
        modifications: [
          'adjust_brightness_contrast',
          'reduce_visual_clutter',
          'use_high_contrast_colors',
        ],
        priority: sensoryConsiderations.visual.sensitivity > 0.7 ? 'high' : 'medium',
      })
    }

    if (sensoryConsiderations.auditory) {
      adaptations.push({
        type: 'auditory_adaptation',
        modifications: [
          'control_volume_levels',
          'provide_noise_cancellation_options',
          'use_visual_alternatives',
        ],
        priority: sensoryConsiderations.auditory.sensitivity > 0.7 ? 'high' : 'medium',
      })
    }

    if (sensoryConsiderations.tactile) {
      adaptations.push({
        type: 'tactile_adaptation',
        modifications: [
          'adjust_haptic_feedback',
          'provide_texture_alternatives',
          'customize_touch_sensitivity',
        ],
        priority: sensoryConsiderations.tactile.sensitivity > 0.7 ? 'high' : 'medium',
      })
    }

    return adaptations
  }

  /**
   * @method categorizeEngagementLevel
   * @private
   * @description Categoriza nível de engajamento
   */
  categorizeEngagementLevel(engagementScore) {
    if (engagementScore >= 80) return 'high'
    if (engagementScore >= 60) return 'medium'
    if (engagementScore >= 40) return 'low'
    return 'critical'
  }

  /**
   * @method generateEngagementAdaptations
   * @private
   * @description Gera adaptações baseadas no nível de engajamento
   */
  generateEngagementAdaptations(engagementLevel, behavioralData) {
    const adaptations = []

    switch (engagementLevel) {
      case 'critical':
        adaptations.push(
          { type: 'motivation', action: 'introduce_immediate_rewards' },
          { type: 'difficulty', action: 'reduce_task_complexity' },
          { type: 'content', action: 'switch_to_preferred_activities' }
        )
        break

      case 'low':
        adaptations.push(
          { type: 'interaction', action: 'increase_interactive_elements' },
          { type: 'feedback', action: 'provide_more_frequent_feedback' },
          { type: 'variety', action: 'introduce_activity_variety' }
        )
        break

      case 'medium':
        adaptations.push(
          { type: 'challenge', action: 'gradually_increase_challenge' },
          { type: 'support', action: 'maintain_current_support_level' }
        )
        break

      case 'high':
        adaptations.push(
          { type: 'expansion', action: 'introduce_new_challenges' },
          { type: 'autonomy', action: 'increase_user_choice_options' }
        )
        break
    }

    return adaptations
  }

  /**
   * @method identifyAdaptationTriggers
   * @private
   * @description Identifica gatilhos para adaptações baseados em dados comportamentais
   */
  identifyAdaptationTriggers(behavioralData) {
    const triggers = []

    if (behavioralData.abandonmentRate && behavioralData.abandonmentRate > 0.3) {
      triggers.push({
        type: 'abandonment',
        severity: behavioralData.abandonmentRate > 0.5 ? 'high' : 'medium',
        action: 'reduce_difficulty_increase_support',
      })
    }

    if (behavioralData.errorRate && behavioralData.errorRate > 0.4) {
      triggers.push({
        type: 'error_rate',
        severity: behavioralData.errorRate > 0.6 ? 'high' : 'medium',
        action: 'provide_additional_guidance',
      })
    }

    if (behavioralData.frustrationLevel && behavioralData.frustrationLevel > 0.6) {
      triggers.push({
        type: 'frustration',
        severity: behavioralData.frustrationLevel > 0.8 ? 'critical' : 'high',
        action: 'offer_break_or_calming_activity',
      })
    }

    return triggers
  }

  /**
   * @method generateFrustrationAdaptations
   * @private
   * @description Gera adaptações baseadas no nível de frustração
   */
  generateFrustrationAdaptations(frustrationLevel) {
    const adaptations = []

    if (frustrationLevel > 0.8) {
      adaptations.push({
        type: 'immediate_intervention',
        actions: ['offer_break', 'switch_to_calming_activity', 'provide_emotional_support'],
        priority: 'critical',
      })
    } else if (frustrationLevel > 0.6) {
      adaptations.push({
        type: 'preventive_intervention',
        actions: ['reduce_task_demands', 'increase_success_opportunities', 'provide_encouragement'],
        priority: 'high',
      })
    } else if (frustrationLevel > 0.4) {
      adaptations.push({
        type: 'monitoring',
        actions: ['increase_check_ins', 'provide_choice_options', 'adjust_pacing'],
        priority: 'medium',
      })
    }

    return adaptations
  }

  /**
   * @method generateContextualAdaptations
   * @private
   * @description Gera adaptações baseadas no contexto atual
   */
  generateContextualAdaptations(contextData) {
    const adaptations = []

    if (contextData.gameType) {
      const gameAdaptations = this.getGameSpecificAdaptations(contextData.gameType)
      adaptations.push(...gameAdaptations)
    }

    if (contextData.currentActivity) {
      const activityAdaptations = this.getActivitySpecificAdaptations(contextData.currentActivity)
      adaptations.push(...activityAdaptations)
    }

    if (contextData.timeOfDay) {
      const timeAdaptations = this.getTimeBasedAdaptations(contextData.timeOfDay)
      adaptations.push(...timeAdaptations)
    }

    return adaptations
  }

  /**
   * @method determinePriorityAdaptations
   * @private
   * @description Determina prioridades de adaptação baseadas nas correlações
   */
  determinePriorityAdaptations(correlations) {
    const priorityAdaptations = []

    // Adaptações críticas (segurança emocional e bem-estar)
    if (correlations.emotionalAdaptations) {
      correlations.emotionalAdaptations.forEach((adaptation) => {
        if (adaptation.priority === 'critical') {
          priorityAdaptations.push({
            ...adaptation,
            timing: 'immediate',
            category: 'emotional_wellbeing',
          })
        }
      })
    }

    // Adaptações de alta prioridade (barreiras cognitivas significativas)
    if (correlations.cognitiveAdaptationNeeds.adaptations) {
      correlations.cognitiveAdaptationNeeds.adaptations.forEach((adaptation) => {
        if (adaptation.priority === 'critical' || adaptation.priority === 'high') {
          priorityAdaptations.push({
            ...adaptation,
            timing: adaptation.priority === 'critical' ? 'immediate' : 'short_term',
            category: 'cognitive_support',
          })
        }
      })
    }

    // Adaptações de engajamento (quando engajamento está baixo)
    if (
      correlations.behavioralAdaptationTriggers.engagementLevel === 'critical' ||
      correlations.behavioralAdaptationTriggers.engagementLevel === 'low'
    ) {
      correlations.behavioralAdaptationTriggers.adaptations.forEach((adaptation) => {
        priorityAdaptations.push({
          ...adaptation,
          timing: 'immediate',
          category: 'engagement_recovery',
        })
      })
    }

    return priorityAdaptations.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * @method determineAdaptationStrategy
   * @private
   * @description Determina estratégia geral de adaptação
   */
  determineAdaptationStrategy(cognitiveData, behavioralData, contextData) {
    // Análise de múltiplos fatores para determinar estratégia
    let cognitiveComplexity = 'medium'
    let behavioralStability = 'stable'

    if (cognitiveData && cognitiveData.cognitiveEngagementProfile) {
      const barriers = cognitiveData.cognitiveEngagementProfile.cognitiveBarriers || []
      cognitiveComplexity = barriers.length > 2 ? 'high' : barriers.length > 0 ? 'medium' : 'low'
    }

    if (behavioralData) {
      const engagementScore = behavioralData.engagementScore || 50
      const frustrationLevel = behavioralData.frustrationLevel || 0

      if (engagementScore < 40 || frustrationLevel > 0.7) {
        behavioralStability = 'unstable'
      } else if (engagementScore > 70 && frustrationLevel < 0.3) {
        behavioralStability = 'very_stable'
      }
    }

    // Matriz de estratégias
    const strategyMatrix = {
      high_unstable: 'conservative_supportive',
      high_stable: 'gradual_challenge',
      high_very_stable: 'moderate_challenge',
      medium_unstable: 'stabilization_focus',
      medium_stable: 'balanced_adaptation',
      medium_very_stable: 'growth_oriented',
      low_unstable: 'gentle_stabilization',
      low_stable: 'exploration_encouraged',
      low_very_stable: 'accelerated_learning',
    }

    const strategyKey = `${cognitiveComplexity}_${behavioralStability}`
    return strategyMatrix[strategyKey] || 'balanced_adaptation'
  }

  /**
   * @method getAdaptationImplementation
   * @private
   * @description Obtém detalhes de implementação para uma adaptação
   */
  getAdaptationImplementation(adaptation) {
    // Implementação baseada no tipo de adaptação
    const implementationMap = {
      cognitive_support: {
        method: 'interface_modification',
        parameters: ['reduce_cognitive_load', 'provide_scaffolding'],
        duration: 'session',
      },
      sensory_adaptation: {
        method: 'environmental_adjustment',
        parameters: ['modify_sensory_input', 'provide_alternatives'],
        duration: 'persistent',
      },
      engagement_recovery: {
        method: 'content_adaptation',
        parameters: ['increase_motivation', 'adjust_difficulty'],
        duration: 'immediate',
      },
    }

    return (
      implementationMap[adaptation.type] || {
        method: 'general_adaptation',
        parameters: ['assess_and_adjust'],
        duration: 'variable',
      }
    )
  }

  /**
   * @method estimateAdaptationImpact
   * @private
   * @description Estima o impacto de uma adaptação
   */
  estimateAdaptationImpact(adaptation, correlations) {
    // Estimativa baseada em regras
    let impactScore = 0.5 // Base

    // Ajustar baseado na prioridade
    if (adaptation.priority === 'critical') impactScore += 0.3
    else if (adaptation.priority === 'high') impactScore += 0.2
    else if (adaptation.priority === 'medium') impactScore += 0.1

    // Ajustar baseado no tipo
    if (adaptation.type === 'emotional_wellbeing') impactScore += 0.2
    else if (adaptation.type === 'cognitive_support') impactScore += 0.15
    else if (adaptation.type === 'engagement_recovery') impactScore += 0.1

    // Ajustar baseado na estratégia geral
    if (correlations.adaptationStrategy === 'conservative_supportive') impactScore *= 1.2
    else if (correlations.adaptationStrategy === 'accelerated_learning') impactScore *= 0.8

    return Math.min(Math.max(impactScore, 0.1), 1.0)
  }

  /**
   * @method getProgressiveTimeline
   * @private
   * @description Obtém cronograma para adaptação progressiva
   */
  getProgressiveTimeline(adaptation) {
    const timelineMap = {
      cognitive_support: { phases: 3, duration: '2_weeks' },
      sensory_adaptation: { phases: 2, duration: '1_week' },
      skill_development: { phases: 4, duration: '1_month' },
      behavioral_modification: { phases: 3, duration: '3_weeks' },
    }

    return timelineMap[adaptation.type] || { phases: 2, duration: '1_week' }
  }

  /**
   * @method generateAdaptationMilestones
   * @private
   * @description Gera marcos para acompanhamento de adaptação
   */
  generateAdaptationMilestones(adaptation) {
    const timeline = this.getProgressiveTimeline(adaptation)
    const milestones = []

    for (let i = 1; i <= timeline.phases; i++) {
      milestones.push({
        phase: i,
        description: `Fase ${i} de adaptação ${adaptation.type}`,
        criteria: this.getMilestoneCriteria(adaptation, i),
        targetDate: this.calculateMilestoneDate(timeline.duration, i, timeline.phases),
      })
    }

    return milestones
  }

  /**
   * @method assessContextualApplicability
   * @private
   * @description Avalia aplicabilidade contextual de uma adaptação
   */
  assessContextualApplicability(adaptation, contextData) {
    let applicabilityScore = 0.5 // Base

    // Avaliar compatibilidade com o contexto atual
    if (contextData.gameType && adaptation.supportedGameTypes) {
      applicabilityScore += adaptation.supportedGameTypes.includes(contextData.gameType)
        ? 0.3
        : -0.2
    }

    if (contextData.currentActivity && adaptation.supportedActivities) {
      applicabilityScore += adaptation.supportedActivities.includes(contextData.currentActivity)
        ? 0.2
        : -0.1
    }

    // Avaliar adequação temporal
    if (contextData.sessionDuration && adaptation.minSessionDuration) {
      applicabilityScore +=
        contextData.sessionDuration >= adaptation.minSessionDuration ? 0.1 : -0.2
    }

    return Math.min(Math.max(applicabilityScore, 0), 1)
  }

  // Métodos auxiliares adicionais para suporte às funcionalidades acima
  getGameSpecificAdaptations(gameType) {
    return []
  }
  getActivitySpecificAdaptations(activity) {
    return []
  }
  getTimeBasedAdaptations(timeOfDay) {
    return []
  }
  getTherapeuticIntervention(barrier) {
    return {}
  }
  generateMeasurableGoals(barrier) {
    return []
  }
  setupProgressTracking(barrier) {
    return {}
  }
  getMilestoneCriteria(adaptation, phase) {
    return []
  }
  calculateMilestoneDate(duration, phase, totalPhases) {
    return new Date()
  }
}

/**
 * Instância singleton do serviço adaptativo baseado em regras
 */
export const ruleBasedAdaptiveService = new RuleBasedAdaptiveService()

/**
 * Exportação padrão
 */
export default RuleBasedAdaptiveService
