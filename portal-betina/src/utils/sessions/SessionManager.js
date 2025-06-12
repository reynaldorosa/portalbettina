/**
 * @file SessionManager.js
 * @description Gerenciador de sessões de jogos com análise terapêutica
 */

export class SessionManager {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService.logger
    this.cache = databaseService.cache
    this.ready = false
  }

  async initialize() {
    this.logger.info('🎮 Initializing SessionManager...')
    this.ready = true
    return true
  }

  isReady() {
    return this.ready
  }

  /**
   * @method getSessions
   * @async
   * @description Recupera sessões de jogos com análise terapêutica
   * @param {string} userId - ID do usuário
   * @param {string} gameId - ID do jogo (opcional)
   * @param {number} limit - Limite de sessões
   * @returns {Promise<Array>} Lista de sessões enriquecidas
   */
  async getSessions(userId, gameId = null, limit = 50) {
    const userIdStr = String(userId)
    const cacheKey = `${this.db.localStoragePrefix}sessions_${userIdStr}_${gameId || 'all'}_${limit}`

    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.db.helpers.isCacheValid(cached, 600000)) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error('🚨 Portal Betina: Internet connection required for game sessions')
    }

    try {
      return await this.db.withRetry(async () => {
        let endpoint = `${this.db.config.API_URL}${this.db.apiConfig.ENDPOINTS.sessions}/user/${userIdStr}`
        const params = new URLSearchParams()

        if (gameId) params.append('gameId', gameId)
        if (limit) params.append('limit', limit.toString())
        if (params.toString()) {
          endpoint += `?${params.toString()}`
        }

        const response = await this.db.authenticatedFetch(endpoint, {
          method: 'GET',
          headers: this.db.apiConfig.DEFAULT_HEADERS,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const sessions = await response.json()
        const enrichedSessions = sessions.map((session) =>
          this.enrichSessionWithTherapyAnalysis(session)
        )

        this.cache.set(cacheKey, enrichedSessions, 600000)

        this.logger.info('🌟 Portal Betina: Game sessions retrieved', {
          userId: userIdStr,
          sessionCount: enrichedSessions.length,
        })

        return enrichedSessions
      }, 'getGameSessions')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to retrieve game sessions', {
        userId: userIdStr,
        gameId,
        error: error.message,
      })
      throw new Error('Unable to retrieve game sessions. Please check your connection.')
    }
  }

  /**
   * @method createSession
   * @async
   * @description Cria uma nova sessão de jogo
   * @param {Object} sessionData - Dados da sessão
   * @returns {Promise<Object>} Sessão criada
   */
  async createSession(sessionData) {
    if (!navigator.onLine) {
      throw new Error('🚨 Portal Betina: Internet connection required to create session')
    }

    try {
      const enhancedSessionData = this.enhanceSessionData(sessionData)

      return await this.db.withRetry(async () => {
        const response = await this.db.authenticatedFetch(
          `${this.db.config.API_URL}${this.db.apiConfig.ENDPOINTS.sessions}`,
          {
            method: 'POST',
            headers: { ...this.db.apiConfig.DEFAULT_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify(enhancedSessionData),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const createdSession = await response.json()

        // Invalidar cache relacionado
        this.cache.invalidate(`sessions_${sessionData.userId}`)

        this.logger.info('🌟 Portal Betina: Game session created', {
          sessionId: createdSession.id,
          userId: sessionData.userId,
        })

        return this.enrichSessionWithTherapyAnalysis(createdSession)
      }, 'createGameSession')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to create game session', {
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method enrichSessionWithTherapyAnalysis
   * @description Enriquece uma sessão com análises terapêuticas
   * @param {Object} session - Dados da sessão
   * @returns {Object} Sessão enriquecida
   */
  enrichSessionWithTherapyAnalysis(session) {
    try {
      const performanceData = session.performance_data || {}

      return {
        ...session,
        therapyAnalysis: {
          difficultyProgression: this.calculateDifficultyProgression(session),
          behavioralIndicators: this.extractBehavioralIndicators(performanceData),
          adaptiveSuggestions: this.suggestAdaptations(performanceData),
          autismSupport: this.calculateAutismSupportLevel(performanceData),
          cognitiveLoad: this.estimateCognitiveLoad(performanceData),
          sensoryProcessing: this.analyzeSensoryProcessing(performanceData),
          socialEmotional: this.assessSocialEmotionalAspects(performanceData),
          executiveFunction: this.evaluateExecutiveFunction(performanceData),
        },
        insights: {
          strengths: this.identifyStrengths(performanceData),
          challenges: this.identifyChallenges(performanceData),
          recommendations: this.generateRecommendations(performanceData),
        },
      }
    } catch (error) {
      this.logger.warn('Failed to enrich session with therapy analysis', {
        sessionId: session.id,
        error: error.message,
      })
      return session
    }
  }

  /**
   * @method enhanceSessionData
   * @description Enriquece dados da sessão antes de criar
   * @param {Object} sessionData - Dados base da sessão
   * @returns {Object} Dados enriquecidos
   */
  enhanceSessionData(sessionData) {
    return {
      ...sessionData,
      timestamp: new Date().toISOString(),
      deviceInfo: this.db.helpers.getDeviceAdaptations(),
      accessibilityContext: this.db.helpers.detectAccessibilityNeeds(),
      version: '2.1',
    }
  }

  // ============== MÉTODOS DE ANÁLISE TERAPÊUTICA ==============

  /**
   * @method calculateDifficultyProgression
   * @description Calcula progressão de dificuldade da sessão
   * @param {Object} session - Dados da sessão
   * @returns {Object} Análise de progressão
   */
  calculateDifficultyProgression(session) {
    const performance = session.performance_data || {}
    const accuracy = performance.accuracy || 0
    const completionTime = performance.completion_time || 0
    const hintsUsed = performance.hints_used || 0

    let progression = 'maintain'
    let confidence = 0.5
    let reasoning = []

    if (accuracy > 0.85 && completionTime < 60 && hintsUsed === 0) {
      progression = 'increase'
      confidence = 0.9
      reasoning.push('High accuracy with fast completion')
    } else if (accuracy < 0.6 || hintsUsed > 3) {
      progression = 'decrease'
      confidence = 0.8
      reasoning.push('Low accuracy or excessive hints needed')
    } else if (accuracy > 0.75 && completionTime < 90) {
      progression = 'slight_increase'
      confidence = 0.7
      reasoning.push('Good performance with room for challenge')
    }

    return {
      recommendation: progression,
      confidence,
      reasoning,
      metrics: { accuracy, completionTime, hintsUsed },
    }
  }

  /**
   * @method extractBehavioralIndicators
   * @description Extrai indicadores comportamentais dos dados
   * @param {Object} performanceData - Dados de desempenho
   * @returns {Object} Indicadores comportamentais
   */
  extractBehavioralIndicators(performanceData) {
    return {
      engagement: this.assessEngagement(performanceData),
      persistence: this.assessPersistence(performanceData),
      frustration: this.assessFrustration(performanceData),
      regulation: this.assessRegulation(performanceData),
      attention: this.assessAttention(performanceData),
      motivation: this.assessMotivation(performanceData),
    }
  }

  /**
   * @method suggestAdaptations
   * @description Sugere adaptações baseadas no desempenho
   * @param {Object} data - Dados de desempenho
   * @returns {Array<string>} Lista de adaptações sugeridas
   */
  suggestAdaptations(data) {
    const adaptations = []

    if (data.accuracy < 0.6) {
      adaptations.push('Reduce task complexity')
      adaptations.push('Provide additional visual cues')
    }

    if (data.completion_time > 300) {
      adaptations.push('Extend time limits')
      adaptations.push('Break tasks into smaller steps')
    }

    if (data.hints_used > 5) {
      adaptations.push('Provide more scaffolding')
      adaptations.push('Include tutorial mode')
    }

    if (data.engagement_level < 0.3) {
      adaptations.push('Increase motivational elements')
      adaptations.push('Add interactive feedback')
    }

    return adaptations
  }

  /**
   * @method calculateAutismSupportLevel
   * @description Calcula nível de suporte específico para autismo
   * @param {Object} performanceData - Dados de desempenho
   * @returns {Object} Análise de suporte para autismo
   */
  calculateAutismSupportLevel(performanceData) {
    const indicators = {
      sensoryOverload: performanceData.sensory_issues || false,
      socialCommunication: performanceData.communication_challenges || false,
      executiveFunction: performanceData.executive_difficulties || false,
      behavioralRegulation: performanceData.behavioral_challenges || false,
    }

    const supportNeeds = Object.values(indicators).filter(Boolean).length

    let level = 'minimal'
    if (supportNeeds >= 3) level = 'intensive'
    else if (supportNeeds >= 2) level = 'moderate'
    else if (supportNeeds >= 1) level = 'targeted'

    return {
      level,
      indicators,
      recommendations: this.getAutismSupportRecommendations(indicators),
    }
  }

  /**
   * @method estimateCognitiveLoad
   * @description Estima carga cognitiva da sessão
   * @param {Object} performanceData - Dados de desempenho
   * @returns {Object} Análise de carga cognitiva
   */
  estimateCognitiveLoad(performanceData) {
    const factors = {
      taskComplexity: performanceData.task_complexity || 0.5,
      timeSpent: performanceData.completion_time || 0,
      errors: performanceData.errors || 0,
      hintsUsed: performanceData.hints_used || 0,
    }

    let cognitiveLoad = factors.taskComplexity

    if (factors.timeSpent > 300) cognitiveLoad += 0.2
    if (factors.timeSpent < 60) cognitiveLoad -= 0.1
    cognitiveLoad += factors.errors * 0.1
    cognitiveLoad += factors.hintsUsed * 0.05

    return {
      estimated: Math.max(0, Math.min(1, cognitiveLoad)),
      factors,
      recommendation: cognitiveLoad > 0.7 ? 'reduce-complexity' : 'maintain-level',
    }
  }

  /**
   * @method analyzeSensoryProcessing
   * @description Analisa processamento sensorial
   * @param {Object} performanceData - Dados de desempenho
   * @returns {Object} Análise sensorial
   */
  analyzeSensoryProcessing(performanceData) {
    return {
      visual: this.analyzeSensoryModality(performanceData, 'visual'),
      auditory: this.analyzeSensoryModality(performanceData, 'auditory'),
      tactile: this.analyzeSensoryModality(performanceData, 'tactile'),
      overall: this.assessOverallSensoryProcessing(performanceData),
    }
  }

  /**
   * @method assessSocialEmotionalAspects
   * @description Avalia aspectos socioemocionais
   * @param {Object} performanceData - Dados de desempenho
   * @returns {Object} Avaliação socioemocional
   */
  assessSocialEmotionalAspects(performanceData) {
    return {
      emotionalRegulation: this.assessEmotionalRegulation(performanceData),
      socialEngagement: this.assessSocialEngagement(performanceData),
      motivation: this.assessMotivation(performanceData),
      anxiety: this.assessAnxiety(performanceData),
    }
  }

  /**
   * @method evaluateExecutiveFunction
   * @description Avalia função executiva
   * @param {Object} performanceData - Dados de desempenho
   * @returns {Object} Avaliação de função executiva
   */
  evaluateExecutiveFunction(performanceData) {
    return {
      workingMemory: this.assessWorkingMemory(performanceData),
      attention: this.assessAttention(performanceData),
      planning: this.assessPlanning(performanceData),
      cognitiveFlexibility: this.assessCognitiveFlexibility(performanceData),
      inhibition: this.assessInhibition(performanceData),
    }
  }

  // ============== MÉTODOS AUXILIARES DE AVALIAÇÃO ==============

  assessEngagement(data) {
    const engagement = data.engagement_level || 0.5
    return {
      level: engagement,
      category: engagement > 0.7 ? 'high' : engagement > 0.4 ? 'moderate' : 'low',
      indicators: data.engagement_indicators || [],
    }
  }

  assessPersistence(data) {
    const attempts = data.attempts || 1
    const giveUpRate = data.give_up_rate || 0

    return {
      attempts,
      giveUpRate,
      level: giveUpRate < 0.2 ? 'high' : giveUpRate < 0.5 ? 'moderate' : 'low',
    }
  }

  assessFrustration(data) {
    const frustrationLevel = data.frustration_level || 0
    return {
      level: frustrationLevel,
      category: frustrationLevel > 0.7 ? 'high' : frustrationLevel > 0.4 ? 'moderate' : 'low',
      triggers: data.frustration_triggers || [],
    }
  }

  assessRegulation(data) {
    return {
      selfRegulation: data.self_regulation_score || 0.5,
      needsSupport: (data.self_regulation_score || 0.5) < 0.4,
      strategies: data.regulation_strategies || [],
    }
  }

  assessAttention(data) {
    return {
      sustained: data.sustained_attention || 0.5,
      selective: data.selective_attention || 0.5,
      divided: data.divided_attention || 0.5,
      overall:
        (data.sustained_attention + data.selective_attention + data.divided_attention) / 3 || 0.5,
    }
  }

  assessMotivation(data) {
    return {
      intrinsic: data.intrinsic_motivation || 0.5,
      extrinsic: data.extrinsic_motivation || 0.5,
      overall: data.motivation_level || 0.5,
      factors: data.motivation_factors || [],
    }
  }

  // Métodos auxiliares adicionais
  analyzeSensoryModality(data, modality) {
    return {
      sensitivity: data[`${modality}_sensitivity`] || 0.5,
      tolerance: data[`${modality}_tolerance`] || 0.5,
      preferences: data[`${modality}_preferences`] || [],
    }
  }

  assessOverallSensoryProcessing(data) {
    return {
      integration: data.sensory_integration || 0.5,
      regulation: data.sensory_regulation || 0.5,
      seeking: data.sensory_seeking || 0.5,
      avoiding: data.sensory_avoiding || 0.5,
    }
  }

  assessEmotionalRegulation(data) {
    return {
      recognition: data.emotion_recognition || 0.5,
      expression: data.emotion_expression || 0.5,
      regulation: data.emotion_regulation || 0.5,
    }
  }

  assessSocialEngagement(data) {
    return {
      interaction: data.social_interaction || 0.5,
      communication: data.social_communication || 0.5,
      cooperation: data.social_cooperation || 0.5,
    }
  }

  assessAnxiety(data) {
    return {
      level: data.anxiety_level || 0,
      triggers: data.anxiety_triggers || [],
      coping: data.anxiety_coping || 0.5,
    }
  }

  assessWorkingMemory(data) {
    return {
      capacity: data.working_memory_capacity || 0.5,
      manipulation: data.working_memory_manipulation || 0.5,
      updating: data.working_memory_updating || 0.5,
    }
  }

  assessPlanning(data) {
    return {
      strategicPlanning: data.strategic_planning || 0.5,
      sequencing: data.task_sequencing || 0.5,
      organization: data.task_organization || 0.5,
    }
  }

  assessCognitiveFlexibility(data) {
    return {
      setShifting: data.set_shifting || 0.5,
      adaptability: data.adaptability || 0.5,
      ruleSwitch: data.rule_switching || 0.5,
    }
  }

  assessInhibition(data) {
    return {
      response: data.response_inhibition || 0.5,
      interference: data.interference_control || 0.5,
      impulse: data.impulse_control || 0.5,
    }
  }

  // Métodos de identificação de padrões
  identifyStrengths(data) {
    const strengths = []

    if (data.accuracy > 0.8) strengths.push('High accuracy')
    if (data.completion_time < 90) strengths.push('Fast completion')
    if (data.engagement_level > 0.7) strengths.push('High engagement')
    if (data.persistence_score > 0.7) strengths.push('Good persistence')

    return strengths
  }

  identifyChallenges(data) {
    const challenges = []

    if (data.accuracy < 0.6) challenges.push('Accuracy needs improvement')
    if (data.completion_time > 300) challenges.push('Processing speed challenges')
    if (data.frustration_level > 0.7) challenges.push('High frustration levels')
    if (data.hints_used > 5) challenges.push('Needs more support')

    return challenges
  }

  generateRecommendations(data) {
    const recommendations = []

    if (data.accuracy < 0.6) {
      recommendations.push('Provide additional practice with similar tasks')
      recommendations.push('Break down complex tasks into simpler steps')
    }

    if (data.engagement_level < 0.4) {
      recommendations.push('Incorporate more interactive elements')
      recommendations.push('Add motivational rewards')
    }

    if (data.frustration_level > 0.7) {
      recommendations.push('Implement calming strategies')
      recommendations.push('Adjust difficulty level')
    }

    return recommendations
  }

  getAutismSupportRecommendations(indicators) {
    const recommendations = []

    if (indicators.sensoryOverload) {
      recommendations.push('Provide sensory breaks')
      recommendations.push('Reduce sensory stimulation')
    }

    if (indicators.socialCommunication) {
      recommendations.push('Use visual communication aids')
      recommendations.push('Provide social scripts')
    }

    if (indicators.executiveFunction) {
      recommendations.push('Add structure and routine')
      recommendations.push('Provide organizational supports')
    }

    if (indicators.behavioralRegulation) {
      recommendations.push('Implement self-regulation strategies')
      recommendations.push('Provide clear expectations')
    }

    return recommendations
  }
}
