/**
 * @class TherapeuticAnalyzer
 * @description Analyzes therapeutic context for autism support in Circuit Breaker operations
 * Part of Portal Betina's therapeutic support system
 */
export class TherapeuticAnalyzer {
  constructor(config = {}) {
    this.config = {
      enableTherapeuticMode: true,
      autismSpecificAdaptations: true,
      sensoryConsiderations: true,
      communicationSupport: true,
      behavioralAdaptations: true,
      stressReduction: true,
      timeoutMultipliers: {
        high_stress: 2.0,
        sensory_overload: 1.8,
        communication_difficulty: 1.5,
        attention_challenge: 1.3,
        normal: 1.0,
      },
      ...config,
    }

    this.therapeuticHistory = []
    this.userProfiles = new Map()
    this.sessionAnalytics = new Map()
    this.interventionStrategies = new Map()

    this.statistics = {
      totalInterventions: 0,
      successfulAdaptations: 0,
      stressReductions: 0,
      behavioralImprovements: 0,
      communicationEnhancements: 0,
      sensoryAdaptations: 0,
    }

    this.initializeInterventionStrategies()
  }

  /**
   * @method analyze
   * @description Analyze therapeutic context for circuit breaker decision making
   * @param {Object} therapeuticContext - Therapeutic context data
   * @returns {Object} Analysis result
   */
  analyze(therapeuticContext) {
    if (!therapeuticContext || !this.config.enableTherapeuticMode) {
      return this.getDefaultAnalysis()
    }

    const analysis = {
      riskLevel: 'low',
      timeoutMultiplier: 1.0,
      requiredAdaptations: [],
      interventionStrategy: null,
      confidenceScore: 0.8,
      therapeuticRecommendations: [],
    }

    // Analyze user profile
    const userProfile = this.getUserProfile(therapeuticContext.userId)
    if (userProfile) {
      analysis.userProfile = userProfile
      this.analyzeUserSpecificFactors(analysis, userProfile, therapeuticContext)
    }

    // Analyze current session state
    this.analyzeSessionState(analysis, therapeuticContext)

    // Analyze sensory factors
    this.analyzeSensoryFactors(analysis, therapeuticContext)

    // Analyze communication factors
    this.analyzeCommunicationFactors(analysis, therapeuticContext)

    // Analyze behavioral factors
    this.analyzeBehavioralFactors(analysis, therapeuticContext)

    // Determine intervention strategy
    analysis.interventionStrategy = this.determineInterventionStrategy(analysis, therapeuticContext)

    // Calculate final risk and timeout
    this.calculateFinalRiskAssessment(analysis, therapeuticContext)

    // Record analysis for learning
    this.recordAnalysis(therapeuticContext, analysis)

    return analysis
  }

  /**
   * @method checkExecution
   * @description Check if execution is safe from therapeutic perspective
   * @param {Object} executionContext - Execution context
   * @returns {Object} Safety check result
   */
  async checkExecution(executionContext) {
    const therapeuticContext = executionContext.therapeuticContext
    if (!therapeuticContext) {
      return { safe: true, block: false, requiredAdaptations: [] }
    }

    const analysis = this.analyze(therapeuticContext)
    const safetyCheck = {
      safe: true,
      block: false,
      requiredAdaptations: [...analysis.requiredAdaptations],
      interventions: [],
      recommendations: [...analysis.therapeuticRecommendations],
    }

    // Check stress levels
    if (therapeuticContext.stressLevel && therapeuticContext.stressLevel > 0.8) {
      safetyCheck.requiredAdaptations.push('stress_reduction_protocol')
      safetyCheck.interventions.push('implement_calming_measures')

      if (therapeuticContext.stressLevel > 0.9) {
        safetyCheck.safe = false
        safetyCheck.block = true
        safetyCheck.interventions.push('emergency_stress_intervention')
      }
    }

    // Check sensory overload
    if (this.detectSensoryOverload(therapeuticContext)) {
      safetyCheck.requiredAdaptations.push('sensory_adaptation_protocol')
      safetyCheck.interventions.push('reduce_sensory_input')

      if (therapeuticContext.sensoryOverloadLevel > 0.8) {
        safetyCheck.safe = false
        safetyCheck.block = true
      }
    }

    // Check communication barriers
    if (this.detectCommunicationBarriers(therapeuticContext)) {
      safetyCheck.requiredAdaptations.push('communication_support_protocol')
      safetyCheck.interventions.push('activate_alternative_communication')
    }

    // Check behavioral state
    if (this.detectBehavioralConcerns(therapeuticContext)) {
      safetyCheck.requiredAdaptations.push('behavioral_support_protocol')
      safetyCheck.interventions.push('implement_behavioral_strategies')
    }

    return safetyCheck
  }

  /**
   * @method adaptFallback
   * @description Adapt fallback function for therapeutic considerations
   * @param {Function} fallbackFunction - Original fallback function
   * @param {Error} error - Original error
   * @param {Object} context - Execution context
   * @returns {Function} Adapted fallback function
   */
  adaptFallback(fallbackFunction, error, context) {
    const therapeuticContext = context.therapeuticContext
    if (!therapeuticContext || !this.config.enableTherapeuticMode) {
      return fallbackFunction
    }

    return async () => {
      try {
        // Pre-fallback therapeutic preparation
        await this.prepareFallbackEnvironment(therapeuticContext)

        // Apply therapeutic adaptations
        const adaptedContext = this.applyTherapeuticAdaptations(context, therapeuticContext)

        // Execute with therapeutic monitoring
        const result = await this.executeWithTherapeuticMonitoring(
          fallbackFunction,
          adaptedContext,
          therapeuticContext
        )

        // Post-fallback therapeutic support
        await this.provideFallbackSupport(therapeuticContext, result)

        return result
      } catch (fallbackError) {
        // Handle fallback failure with therapeutic considerations
        return this.handleTherapeuticFallbackFailure(fallbackError, error, therapeuticContext)
      }
    }
  }

  /**
   * @method recordSuccess
   * @description Record successful operation with therapeutic context
   * @param {Object} executionContext - Execution context
   */
  recordSuccess(executionContext) {
    const therapeuticContext = executionContext.therapeuticContext
    if (!therapeuticContext) return

    const record = {
      timestamp: Date.now(),
      type: 'success',
      userId: therapeuticContext.userId,
      sessionId: therapeuticContext.sessionId,
      context: executionContext.context,
      therapeuticFactors: this.extractTherapeuticFactors(therapeuticContext),
      outcome: 'positive',
    }

    this.therapeuticHistory.push(record)
    this.statistics.successfulAdaptations++

    // Update user profile with positive outcome
    this.updateUserProfile(therapeuticContext.userId, record)

    // Learn from successful patterns
    this.learnFromSuccess(record, therapeuticContext)
  }

  /**
   * @method recordFailure
   * @description Record failed operation with therapeutic context
   * @param {Error} error - Error that occurred
   * @param {Object} executionContext - Execution context
   */
  recordFailure(error, executionContext) {
    const therapeuticContext = executionContext.therapeuticContext
    if (!therapeuticContext) return

    const record = {
      timestamp: Date.now(),
      type: 'failure',
      userId: therapeuticContext.userId,
      sessionId: therapeuticContext.sessionId,
      context: executionContext.context,
      error: error.message,
      therapeuticFactors: this.extractTherapeuticFactors(therapeuticContext),
      outcome: 'negative',
      potentialTriggers: this.identifyPotentialTriggers(therapeuticContext, error),
    }

    this.therapeuticHistory.push(record)

    // Update user profile with negative outcome
    this.updateUserProfile(therapeuticContext.userId, record)

    // Analyze failure for therapeutic insights
    this.analyzeTherapeuticFailure(record, therapeuticContext, error)

    // Trigger therapeutic intervention if needed
    this.triggerInterventionIfNeeded(therapeuticContext, record)
  }

  /**
   * @method getStatus
   * @description Get current therapeutic analyzer status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      interventions: this.therapeuticHistory.length,
      activeProfiles: this.userProfiles.size,
      activeSessions: this.sessionAnalytics.size,
      statistics: { ...this.statistics },
      recentAnalytics: this.getRecentAnalytics(),
      interventionStrategies: Array.from(this.interventionStrategies.keys()),
    }
  }

  // Private helper methods

  /**
   * @method initializeInterventionStrategies
   * @description Initialize therapeutic intervention strategies
   */
  initializeInterventionStrategies() {
    this.interventionStrategies.set('stress_reduction', {
      name: 'Stress Reduction Protocol',
      triggers: ['high_stress', 'anxiety_indicators'],
      actions: ['reduce_stimulation', 'provide_calming_environment', 'extend_timeouts'],
      effectiveness: 0.85,
    })

    this.interventionStrategies.set('sensory_adaptation', {
      name: 'Sensory Adaptation Protocol',
      triggers: ['sensory_overload', 'hypersensitivity'],
      actions: ['modify_sensory_input', 'provide_sensory_breaks', 'adjust_environment'],
      effectiveness: 0.78,
    })

    this.interventionStrategies.set('communication_support', {
      name: 'Communication Support Protocol',
      triggers: ['communication_difficulty', 'language_barriers'],
      actions: ['simplify_language', 'provide_visual_aids', 'use_alternative_communication'],
      effectiveness: 0.72,
    })

    this.interventionStrategies.set('behavioral_support', {
      name: 'Behavioral Support Protocol',
      triggers: ['behavioral_concerns', 'self_regulation_difficulties'],
      actions: ['provide_structure', 'implement_coping_strategies', 'offer_choices'],
      effectiveness: 0.8,
    })

    this.interventionStrategies.set('attention_support', {
      name: 'Attention Support Protocol',
      triggers: ['attention_difficulties', 'focus_challenges'],
      actions: ['break_tasks', 'provide_breaks', 'reduce_distractions'],
      effectiveness: 0.75,
    })
  }

  /**
   * @method getDefaultAnalysis
   * @description Get default analysis when no therapeutic context
   * @returns {Object} Default analysis
   */
  getDefaultAnalysis() {
    return {
      riskLevel: 'low',
      timeoutMultiplier: 1.0,
      requiredAdaptations: [],
      interventionStrategy: null,
      confidenceScore: 0.5,
      therapeuticRecommendations: [],
    }
  }

  /**
   * @method getUserProfile
   * @description Get user profile for therapeutic analysis
   * @param {string} userId - User ID
   * @returns {Object|null} User profile
   */
  getUserProfile(userId) {
    return this.userProfiles.get(userId) || null
  }

  /**
   * @method analyzeUserSpecificFactors
   * @description Analyze user-specific therapeutic factors
   * @param {Object} analysis - Analysis object to update
   * @param {Object} userProfile - User profile
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeUserSpecificFactors(analysis, userProfile, therapeuticContext) {
    // Analyze autism characteristics
    if (userProfile.autismCharacteristics) {
      const characteristics = userProfile.autismCharacteristics

      if (characteristics.sensoryProfile) {
        this.analyzeSensoryProfile(analysis, characteristics.sensoryProfile, therapeuticContext)
      }

      if (characteristics.communicationLevel) {
        this.analyzeCommunicationLevel(
          analysis,
          characteristics.communicationLevel,
          therapeuticContext
        )
      }

      if (characteristics.behavioralPatterns) {
        this.analyzeBehavioralPatterns(
          analysis,
          characteristics.behavioralPatterns,
          therapeuticContext
        )
      }
    }

    // Analyze learning preferences
    if (userProfile.learningPreferences) {
      this.analyzeLearningPreferences(analysis, userProfile.learningPreferences, therapeuticContext)
    }

    // Analyze therapy goals
    if (userProfile.therapyGoals) {
      this.analyzeTherapyGoals(analysis, userProfile.therapyGoals, therapeuticContext)
    }
  }

  /**
   * @method analyzeSessionState
   * @description Analyze current session state
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeSessionState(analysis, therapeuticContext) {
    const sessionId = therapeuticContext.sessionId
    if (!sessionId) return

    const sessionData = this.sessionAnalytics.get(sessionId) || {}

    // Analyze session duration
    if (sessionData.duration && sessionData.duration > 1800000) {
      // 30 minutes
      analysis.requiredAdaptations.push('session_break_needed')
      analysis.riskLevel = this.elevateRisk(analysis.riskLevel)
    }

    // Analyze error frequency in session
    if (sessionData.errorCount && sessionData.errorCount > 5) {
      analysis.requiredAdaptations.push('error_pattern_intervention')
      analysis.riskLevel = this.elevateRisk(analysis.riskLevel)
    }

    // Analyze stress indicators
    if (therapeuticContext.stressLevel) {
      const stressCategory = this.categorizeStress(therapeuticContext.stressLevel)
      analysis.timeoutMultiplier = Math.max(
        analysis.timeoutMultiplier,
        this.config.timeoutMultipliers[stressCategory] || 1.0
      )
    }
  }

  /**
   * @method analyzeSensoryFactors
   * @description Analyze sensory factors affecting performance
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeSensoryFactors(analysis, therapeuticContext) {
    if (!this.config.sensoryConsiderations) return

    // Visual sensitivity
    if (therapeuticContext.visualSensitivity === 'high') {
      analysis.requiredAdaptations.push('reduce_visual_complexity')
      analysis.therapeuticRecommendations.push('implement_high_contrast_mode')
    }

    // Auditory sensitivity
    if (therapeuticContext.auditorySensitivity === 'high') {
      analysis.requiredAdaptations.push('reduce_audio_stimulation')
      analysis.therapeuticRecommendations.push('minimize_background_sounds')
    }

    // Tactile sensitivity
    if (therapeuticContext.tactileSensitivity === 'high') {
      analysis.requiredAdaptations.push('minimize_tactile_feedback')
      analysis.therapeuticRecommendations.push('reduce_haptic_responses')
    }

    // Overall sensory overload
    if (this.detectSensoryOverload(therapeuticContext)) {
      analysis.riskLevel = 'high'
      analysis.timeoutMultiplier = Math.max(analysis.timeoutMultiplier, 1.8)
      analysis.requiredAdaptations.push('sensory_break_protocol')
    }
  }

  /**
   * @method analyzeCommunicationFactors
   * @description Analyze communication factors
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeCommunicationFactors(analysis, therapeuticContext) {
    if (!this.config.communicationSupport) return

    if (therapeuticContext.communicationLevel === 'limited') {
      analysis.requiredAdaptations.push('simplified_communication')
      analysis.therapeuticRecommendations.push('use_visual_communication_aids')
      analysis.timeoutMultiplier = Math.max(analysis.timeoutMultiplier, 1.5)
    }

    if (therapeuticContext.languageProcessingDifficulty) {
      analysis.requiredAdaptations.push('language_processing_support')
      analysis.therapeuticRecommendations.push('provide_processing_time')
    }
  }

  /**
   * @method analyzeBehavioralFactors
   * @description Analyze behavioral factors
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeBehavioralFactors(analysis, therapeuticContext) {
    if (!this.config.behavioralAdaptations) return

    if (therapeuticContext.behavioralState === 'dysregulated') {
      analysis.riskLevel = 'high'
      analysis.requiredAdaptations.push('behavioral_regulation_support')
      analysis.therapeuticRecommendations.push('implement_calming_strategies')
    }

    if (therapeuticContext.repetitiveBehaviors) {
      analysis.requiredAdaptations.push('accommodate_repetitive_behaviors')
      analysis.therapeuticRecommendations.push('provide_structured_environment')
    }
  }

  /**
   * @method determineInterventionStrategy
   * @description Determine appropriate intervention strategy
   * @param {Object} analysis - Current analysis
   * @param {Object} therapeuticContext - Therapeutic context
   * @returns {Object|null} Intervention strategy
   */
  determineInterventionStrategy(analysis, therapeuticContext) {
    for (const [strategyName, strategy] of this.interventionStrategies) {
      if (this.shouldApplyStrategy(strategy, analysis, therapeuticContext)) {
        return {
          name: strategyName,
          strategy,
          priority: this.calculateStrategyPriority(strategy, analysis),
        }
      }
    }

    return null
  }

  /**
   * @method calculateFinalRiskAssessment
   * @description Calculate final risk assessment and timeout
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  calculateFinalRiskAssessment(analysis, therapeuticContext) {
    // Combine all risk factors
    const riskFactors = [
      analysis.riskLevel === 'high' ? 0.8 : analysis.riskLevel === 'medium' ? 0.5 : 0.2,
      therapeuticContext.stressLevel || 0,
      therapeuticContext.sensoryOverloadLevel || 0,
      therapeuticContext.communicationDifficulty || 0,
    ]

    const averageRisk = riskFactors.reduce((sum, risk) => sum + risk, 0) / riskFactors.length

    // Update final risk level
    if (averageRisk > 0.7) {
      analysis.riskLevel = 'high'
    } else if (averageRisk > 0.4) {
      analysis.riskLevel = 'medium'
    } else {
      analysis.riskLevel = 'low'
    }

    // Ensure timeout multiplier reflects therapeutic needs
    analysis.timeoutMultiplier = Math.max(
      analysis.timeoutMultiplier,
      this.config.timeoutMultipliers[analysis.riskLevel] || 1.0
    )
  }

  /**
   * 🎯 FASE 3: MÉTRICAS TERAPÊUTICAS - MÉTODO BÁSICO DE PROCESSAMENTO
   * Analisa métricas comportamentais e sensoriais para gerar scores terapêuticos
   * @param {Object} data - Dados comportamentais e sensoriais
   * @returns {Object} Scores de atenção e coordenação
   */
  process(data) {
    if (!data || typeof data !== 'object') {
      return {
        attentionScore: 'unknown',
        coordinationScore: 'unknown',
        therapeuticRecommendations: ['data_collection_needed'],
        timestamp: Date.now(),
      }
    }

    const { responseTime, accuracy } = data

    // Calcular score de atenção baseado no tempo de resposta
    let attentionScore = 'unknown'
    if (typeof responseTime === 'number') {
      attentionScore = responseTime < 1000 ? 'high' : 'low'
    }

    // Calcular score de coordenação baseado na precisão
    let coordinationScore = 'unknown'
    if (typeof accuracy === 'number') {
      coordinationScore = accuracy > 0.8 ? 'high' : 'low'
    }

    // Gerar recomendações terapêuticas básicas
    const therapeuticRecommendations = []

    if (attentionScore === 'low') {
      therapeuticRecommendations.push('increase_attention_exercises')
    }

    if (coordinationScore === 'low') {
      therapeuticRecommendations.push('improve_coordination_activities')
    }

    if (attentionScore === 'high' && coordinationScore === 'high') {
      therapeuticRecommendations.push('maintain_current_level')
    }

    // Registrar estatísticas
    this.statistics.totalInterventions++
    if (attentionScore === 'high' || coordinationScore === 'high') {
      this.statistics.successfulAdaptations++
    }

    const result = {
      attentionScore,
      coordinationScore,
      therapeuticRecommendations,
      responseTime,
      accuracy,
      timestamp: Date.now(),
      sessionData: data,
    }

    // Registrar na história terapêutica
    this.therapeuticHistory.push(result)

    return result
  }

  /**
   * 🎯 FASE 3: MÉTODO DE PROCESSAMENTO DE MÉTRICAS COMBINADAS
   * Processa métricas comportamentais e sensoriais combinadas
   * @param {Object} behavioralMetrics - Métricas comportamentais
   * @param {Object} sensorialMetrics - Métricas sensoriais
   * @returns {Object} Análise terapêutica completa
   */
  processCombinadMetrics(behavioralMetrics, sensorialMetrics) {
    const behavioralAnalysis = this.process(behavioralMetrics)

    // Análise sensorial adicional
    const sensorialAnalysis = {
      sensoryStabilityScore: 'medium',
      overloadRisk: 'low',
      calmingNeeded: false,
    }

    if (sensorialMetrics) {
      // Analisar padrões de toque e movimento
      const { touchPressure, gyroscope, gesturePattern } = sensorialMetrics

      if (Array.isArray(touchPressure)) {
        const avgPressure = touchPressure.reduce((a, b) => a + b, 0) / touchPressure.length
        sensorialAnalysis.sensoryStabilityScore =
          avgPressure > 70 ? 'high' : avgPressure > 40 ? 'medium' : 'low'

        if (avgPressure > 80) {
          sensorialAnalysis.overloadRisk = 'high'
          sensorialAnalysis.calmingNeeded = true
        }
      }

      if (gyroscope && Array.isArray(gyroscope.x)) {
        const movementVariance = Math.abs(Math.max(...gyroscope.x) - Math.min(...gyroscope.x))
        if (movementVariance > 2) {
          sensorialAnalysis.overloadRisk = 'high'
          sensorialAnalysis.calmingNeeded = true
        }
      }
    }

    // Combinar análises
    const combinedAnalysis = {
      ...behavioralAnalysis,
      sensorialAnalysis,
      overallTherapeuticScore: this.calculateOverallScore(behavioralAnalysis, sensorialAnalysis),
      interventionPriority: this.calculateInterventionPriority(
        behavioralAnalysis,
        sensorialAnalysis
      ),
    }

    return combinedAnalysis
  }

  /**
   * Calcula score terapêutico geral
   */
  calculateOverallScore(behavioral, sensorial) {
    let score = 0

    if (behavioral.attentionScore === 'high') score += 2
    if (behavioral.coordinationScore === 'high') score += 2
    if (sensorial.sensoryStabilityScore === 'high') score += 1
    if (sensorial.overloadRisk === 'low') score += 1

    if (score >= 5) return 'excellent'
    if (score >= 3) return 'good'
    if (score >= 1) return 'fair'
    return 'needs_improvement'
  }

  /**
   * Calcula prioridade de intervenção
   */
  calculateInterventionPriority(behavioral, sensorial) {
    if (sensorial.calmingNeeded || sensorial.overloadRisk === 'high') {
      return 'immediate'
    }

    if (behavioral.attentionScore === 'low' && behavioral.coordinationScore === 'low') {
      return 'high'
    }

    if (behavioral.attentionScore === 'low' || behavioral.coordinationScore === 'low') {
      return 'medium'
    }

    return 'low'
  }

  /**
   * Obtém histórico terapêutico recente
   */
  getTherapeuticHistory(limit = 10) {
    return this.therapeuticHistory.slice(-limit)
  }

  /**
   * Obtém estatísticas terapêuticas
   */
  getTherapeuticStatistics() {
    return {
      ...this.statistics,
      historyLength: this.therapeuticHistory.length,
      lastAnalysis: this.therapeuticHistory[this.therapeuticHistory.length - 1] || null,
    }
  }

  // Additional helper methods

  /**
   * @method initializeInterventionStrategies
   * @description Initialize therapeutic intervention strategies
   */
  initializeInterventionStrategies() {
    this.interventionStrategies.set('stress_reduction', {
      name: 'Stress Reduction Protocol',
      triggers: ['high_stress', 'anxiety_indicators'],
      actions: ['reduce_stimulation', 'provide_calming_environment', 'extend_timeouts'],
      effectiveness: 0.85,
    })

    this.interventionStrategies.set('sensory_adaptation', {
      name: 'Sensory Adaptation Protocol',
      triggers: ['sensory_overload', 'hypersensitivity'],
      actions: ['modify_sensory_input', 'provide_sensory_breaks', 'adjust_environment'],
      effectiveness: 0.78,
    })

    this.interventionStrategies.set('communication_support', {
      name: 'Communication Support Protocol',
      triggers: ['communication_difficulty', 'language_barriers'],
      actions: ['simplify_language', 'provide_visual_aids', 'use_alternative_communication'],
      effectiveness: 0.72,
    })

    this.interventionStrategies.set('behavioral_support', {
      name: 'Behavioral Support Protocol',
      triggers: ['behavioral_concerns', 'self_regulation_difficulties'],
      actions: ['provide_structure', 'implement_coping_strategies', 'offer_choices'],
      effectiveness: 0.8,
    })

    this.interventionStrategies.set('attention_support', {
      name: 'Attention Support Protocol',
      triggers: ['attention_difficulties', 'focus_challenges'],
      actions: ['break_tasks', 'provide_breaks', 'reduce_distractions'],
      effectiveness: 0.75,
    })
  }

  /**
   * @method getDefaultAnalysis
   * @description Get default analysis when no therapeutic context
   * @returns {Object} Default analysis
   */
  getDefaultAnalysis() {
    return {
      riskLevel: 'low',
      timeoutMultiplier: 1.0,
      requiredAdaptations: [],
      interventionStrategy: null,
      confidenceScore: 0.5,
      therapeuticRecommendations: [],
    }
  }

  /**
   * @method getUserProfile
   * @description Get user profile for therapeutic analysis
   * @param {string} userId - User ID
   * @returns {Object|null} User profile
   */
  getUserProfile(userId) {
    return this.userProfiles.get(userId) || null
  }

  /**
   * @method analyzeUserSpecificFactors
   * @description Analyze user-specific therapeutic factors
   * @param {Object} analysis - Analysis object to update
   * @param {Object} userProfile - User profile
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeUserSpecificFactors(analysis, userProfile, therapeuticContext) {
    // Analyze autism characteristics
    if (userProfile.autismCharacteristics) {
      const characteristics = userProfile.autismCharacteristics

      if (characteristics.sensoryProfile) {
        this.analyzeSensoryProfile(analysis, characteristics.sensoryProfile, therapeuticContext)
      }

      if (characteristics.communicationLevel) {
        this.analyzeCommunicationLevel(
          analysis,
          characteristics.communicationLevel,
          therapeuticContext
        )
      }

      if (characteristics.behavioralPatterns) {
        this.analyzeBehavioralPatterns(
          analysis,
          characteristics.behavioralPatterns,
          therapeuticContext
        )
      }
    }

    // Analyze learning preferences
    if (userProfile.learningPreferences) {
      this.analyzeLearningPreferences(analysis, userProfile.learningPreferences, therapeuticContext)
    }

    // Analyze therapy goals
    if (userProfile.therapyGoals) {
      this.analyzeTherapyGoals(analysis, userProfile.therapyGoals, therapeuticContext)
    }
  }

  /**
   * @method analyzeSessionState
   * @description Analyze current session state
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeSessionState(analysis, therapeuticContext) {
    const sessionId = therapeuticContext.sessionId
    if (!sessionId) return

    const sessionData = this.sessionAnalytics.get(sessionId) || {}

    // Analyze session duration
    if (sessionData.duration && sessionData.duration > 1800000) {
      // 30 minutes
      analysis.requiredAdaptations.push('session_break_needed')
      analysis.riskLevel = this.elevateRisk(analysis.riskLevel)
    }

    // Analyze error frequency in session
    if (sessionData.errorCount && sessionData.errorCount > 5) {
      analysis.requiredAdaptations.push('error_pattern_intervention')
      analysis.riskLevel = this.elevateRisk(analysis.riskLevel)
    }

    // Analyze stress indicators
    if (therapeuticContext.stressLevel) {
      const stressCategory = this.categorizeStress(therapeuticContext.stressLevel)
      analysis.timeoutMultiplier = Math.max(
        analysis.timeoutMultiplier,
        this.config.timeoutMultipliers[stressCategory] || 1.0
      )
    }
  }

  /**
   * @method analyzeSensoryFactors
   * @description Analyze sensory factors affecting performance
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeSensoryFactors(analysis, therapeuticContext) {
    if (!this.config.sensoryConsiderations) return

    // Visual sensitivity
    if (therapeuticContext.visualSensitivity === 'high') {
      analysis.requiredAdaptations.push('reduce_visual_complexity')
      analysis.therapeuticRecommendations.push('implement_high_contrast_mode')
    }

    // Auditory sensitivity
    if (therapeuticContext.auditorySensitivity === 'high') {
      analysis.requiredAdaptations.push('reduce_audio_stimulation')
      analysis.therapeuticRecommendations.push('minimize_background_sounds')
    }

    // Tactile sensitivity
    if (therapeuticContext.tactileSensitivity === 'high') {
      analysis.requiredAdaptations.push('minimize_tactile_feedback')
      analysis.therapeuticRecommendations.push('reduce_haptic_responses')
    }

    // Overall sensory overload
    if (this.detectSensoryOverload(therapeuticContext)) {
      analysis.riskLevel = 'high'
      analysis.timeoutMultiplier = Math.max(analysis.timeoutMultiplier, 1.8)
      analysis.requiredAdaptations.push('sensory_break_protocol')
    }
  }

  /**
   * @method analyzeCommunicationFactors
   * @description Analyze communication factors
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeCommunicationFactors(analysis, therapeuticContext) {
    if (!this.config.communicationSupport) return

    if (therapeuticContext.communicationLevel === 'limited') {
      analysis.requiredAdaptations.push('simplified_communication')
      analysis.therapeuticRecommendations.push('use_visual_communication_aids')
      analysis.timeoutMultiplier = Math.max(analysis.timeoutMultiplier, 1.5)
    }

    if (therapeuticContext.languageProcessingDifficulty) {
      analysis.requiredAdaptations.push('language_processing_support')
      analysis.therapeuticRecommendations.push('provide_processing_time')
    }
  }

  /**
   * @method analyzeBehavioralFactors
   * @description Analyze behavioral factors
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  analyzeBehavioralFactors(analysis, therapeuticContext) {
    if (!this.config.behavioralAdaptations) return

    if (therapeuticContext.behavioralState === 'dysregulated') {
      analysis.riskLevel = 'high'
      analysis.requiredAdaptations.push('behavioral_regulation_support')
      analysis.therapeuticRecommendations.push('implement_calming_strategies')
    }

    if (therapeuticContext.repetitiveBehaviors) {
      analysis.requiredAdaptations.push('accommodate_repetitive_behaviors')
      analysis.therapeuticRecommendations.push('provide_structured_environment')
    }
  }

  /**
   * @method determineInterventionStrategy
   * @description Determine appropriate intervention strategy
   * @param {Object} analysis - Current analysis
   * @param {Object} therapeuticContext - Therapeutic context
   * @returns {Object|null} Intervention strategy
   */
  determineInterventionStrategy(analysis, therapeuticContext) {
    for (const [strategyName, strategy] of this.interventionStrategies) {
      if (this.shouldApplyStrategy(strategy, analysis, therapeuticContext)) {
        return {
          name: strategyName,
          strategy,
          priority: this.calculateStrategyPriority(strategy, analysis),
        }
      }
    }

    return null
  }

  /**
   * @method calculateFinalRiskAssessment
   * @description Calculate final risk assessment and timeout
   * @param {Object} analysis - Analysis object to update
   * @param {Object} therapeuticContext - Therapeutic context
   */
  calculateFinalRiskAssessment(analysis, therapeuticContext) {
    // Combine all risk factors
    const riskFactors = [
      analysis.riskLevel === 'high' ? 0.8 : analysis.riskLevel === 'medium' ? 0.5 : 0.2,
      therapeuticContext.stressLevel || 0,
      therapeuticContext.sensoryOverloadLevel || 0,
      therapeuticContext.communicationDifficulty || 0,
    ]

    const averageRisk = riskFactors.reduce((sum, risk) => sum + risk, 0) / riskFactors.length

    // Update final risk level
    if (averageRisk > 0.7) {
      analysis.riskLevel = 'high'
    } else if (averageRisk > 0.4) {
      analysis.riskLevel = 'medium'
    } else {
      analysis.riskLevel = 'low'
    }

    // Ensure timeout multiplier reflects therapeutic needs
    analysis.timeoutMultiplier = Math.max(
      analysis.timeoutMultiplier,
      this.config.timeoutMultipliers[analysis.riskLevel] || 1.0
    )
  }

  /**
   * 🎯 FASE 3: MÉTRICAS TERAPÊUTICAS - MÉTODO BÁSICO DE PROCESSAMENTO
   * Analisa métricas comportamentais e sensoriais para gerar scores terapêuticos
   * @param {Object} data - Dados comportamentais e sensoriais
   * @returns {Object} Scores de atenção e coordenação
   */
  process(data) {
    if (!data || typeof data !== 'object') {
      return {
        attentionScore: 'unknown',
        coordinationScore: 'unknown',
        therapeuticRecommendations: ['data_collection_needed'],
        timestamp: Date.now(),
      }
    }

    const { responseTime, accuracy } = data

    // Calcular score de atenção baseado no tempo de resposta
    let attentionScore = 'unknown'
    if (typeof responseTime === 'number') {
      attentionScore = responseTime < 1000 ? 'high' : 'low'
    }

    // Calcular score de coordenação baseado na precisão
    let coordinationScore = 'unknown'
    if (typeof accuracy === 'number') {
      coordinationScore = accuracy > 0.8 ? 'high' : 'low'
    }

    // Gerar recomendações terapêuticas básicas
    const therapeuticRecommendations = []

    if (attentionScore === 'low') {
      therapeuticRecommendations.push('increase_attention_exercises')
    }

    if (coordinationScore === 'low') {
      therapeuticRecommendations.push('improve_coordination_activities')
    }

    if (attentionScore === 'high' && coordinationScore === 'high') {
      therapeuticRecommendations.push('maintain_current_level')
    }

    // Registrar estatísticas
    this.statistics.totalInterventions++
    if (attentionScore === 'high' || coordinationScore === 'high') {
      this.statistics.successfulAdaptations++
    }

    const result = {
      attentionScore,
      coordinationScore,
      therapeuticRecommendations,
      responseTime,
      accuracy,
      timestamp: Date.now(),
      sessionData: data,
    }

    // Registrar na história terapêutica
    this.therapeuticHistory.push(result)

    return result
  }

  /**
   * 🎯 FASE 3: MÉTODO DE PROCESSAMENTO DE MÉTRICAS COMBINADAS
   * Processa métricas comportamentais e sensoriais combinadas
   * @param {Object} behavioralMetrics - Métricas comportamentais
   * @param {Object} sensorialMetrics - Métricas sensoriais
   * @returns {Object} Análise terapêutica completa
   */
  processCombinadMetrics(behavioralMetrics, sensorialMetrics) {
    const behavioralAnalysis = this.process(behavioralMetrics)

    // Análise sensorial adicional
    const sensorialAnalysis = {
      sensoryStabilityScore: 'medium',
      overloadRisk: 'low',
      calmingNeeded: false,
    }

    if (sensorialMetrics) {
      // Analisar padrões de toque e movimento
      const { touchPressure, gyroscope, gesturePattern } = sensorialMetrics

      if (Array.isArray(touchPressure)) {
        const avgPressure = touchPressure.reduce((a, b) => a + b, 0) / touchPressure.length
        sensorialAnalysis.sensoryStabilityScore =
          avgPressure > 70 ? 'high' : avgPressure > 40 ? 'medium' : 'low'

        if (avgPressure > 80) {
          sensorialAnalysis.overloadRisk = 'high'
          sensorialAnalysis.calmingNeeded = true
        }
      }

      if (gyroscope && Array.isArray(gyroscope.x)) {
        const movementVariance = Math.abs(Math.max(...gyroscope.x) - Math.min(...gyroscope.x))
        if (movementVariance > 2) {
          sensorialAnalysis.overloadRisk = 'high'
          sensorialAnalysis.calmingNeeded = true
        }
      }
    }

    // Combinar análises
    const combinedAnalysis = {
      ...behavioralAnalysis,
      sensorialAnalysis,
      overallTherapeuticScore: this.calculateOverallScore(behavioralAnalysis, sensorialAnalysis),
      interventionPriority: this.calculateInterventionPriority(
        behavioralAnalysis,
        sensorialAnalysis
      ),
    }

    return combinedAnalysis
  }

  /**
   * Calcula score terapêutico geral
   */
  calculateOverallScore(behavioral, sensorial) {
    let score = 0

    if (behavioral.attentionScore === 'high') score += 2
    if (behavioral.coordinationScore === 'high') score += 2
    if (sensorial.sensoryStabilityScore === 'high') score += 1
    if (sensorial.overloadRisk === 'low') score += 1

    if (score >= 5) return 'excellent'
    if (score >= 3) return 'good'
    if (score >= 1) return 'fair'
    return 'needs_improvement'
  }

  /**
   * Calcula prioridade de intervenção
   */
  calculateInterventionPriority(behavioral, sensorial) {
    if (sensorial.calmingNeeded || sensorial.overloadRisk === 'high') {
      return 'immediate'
    }

    if (behavioral.attentionScore === 'low' && behavioral.coordinationScore === 'low') {
      return 'high'
    }

    if (behavioral.attentionScore === 'low' || behavioral.coordinationScore === 'low') {
      return 'medium'
    }

    return 'low'
  }

  /**
   * Obtém histórico terapêutico recente
   */
  getTherapeuticHistory(limit = 10) {
    return this.therapeuticHistory.slice(-limit)
  }

  /**
   * Obtém estatísticas terapêuticas
   */
  getTherapeuticStatistics() {
    return {
      ...this.statistics,
      historyLength: this.therapeuticHistory.length,
      lastAnalysis: this.therapeuticHistory[this.therapeuticHistory.length - 1] || null,
    }
  }

  // Additional helper methods
  detectSensoryOverload(therapeuticContext) {
    return (therapeuticContext.sensoryOverloadLevel || 0) > 0.6
  }

  detectCommunicationBarriers(therapeuticContext) {
    return therapeuticContext.communicationDifficulty > 0.5
  }

  detectBehavioralConcerns(therapeuticContext) {
    return (
      therapeuticContext.behavioralState === 'dysregulated' ||
      therapeuticContext.selfRegulationDifficulty > 0.6
    )
  }

  elevateRisk(currentRisk) {
    const riskLevels = ['low', 'medium', 'high']
    const currentIndex = riskLevels.indexOf(currentRisk)
    return riskLevels[Math.min(currentIndex + 1, riskLevels.length - 1)]
  }

  categorizeStress(stressLevel) {
    if (stressLevel > 0.8) return 'high_stress'
    if (stressLevel > 0.6) return 'sensory_overload'
    if (stressLevel > 0.4) return 'attention_challenge'
    return 'normal'
  }

  recordAnalysis(therapeuticContext, analysis) {
    this.therapeuticHistory.push({
      timestamp: Date.now(),
      userId: therapeuticContext.userId,
      sessionId: therapeuticContext.sessionId,
      analysis: { ...analysis },
      context: { ...therapeuticContext },
    })

    // Maintain history size
    if (this.therapeuticHistory.length > 1000) {
      this.therapeuticHistory.shift()
    }
  }

  extractTherapeuticFactors(therapeuticContext) {
    return {
      stressLevel: therapeuticContext.stressLevel,
      sensoryState: therapeuticContext.sensoryState,
      communicationState: therapeuticContext.communicationState,
      behavioralState: therapeuticContext.behavioralState,
      environmentalFactors: therapeuticContext.environmentalFactors,
    }
  }

  identifyPotentialTriggers(therapeuticContext, error) {
    const triggers = []

    if (error.message.includes('timeout') && therapeuticContext.stressLevel > 0.5) {
      triggers.push('stress_related_timeout')
    }

    if (therapeuticContext.sensoryOverloadLevel > 0.6) {
      triggers.push('sensory_overload_interference')
    }

    return triggers
  }

  // Additional methods for comprehensive therapeutic support
  prepareFallbackEnvironment(therapeuticContext) {
    // Implementation for preparing therapeutic environment for fallback
    return Promise.resolve()
  }

  applyTherapeuticAdaptations(context, therapeuticContext) {
    // Implementation for applying therapeutic adaptations
    return { ...context, therapeuticAdaptations: true }
  }

  executeWithTherapeuticMonitoring(fallbackFunction, adaptedContext, therapeuticContext) {
    // Implementation for executing with therapeutic monitoring
    return fallbackFunction()
  }

  provideFallbackSupport(therapeuticContext, result) {
    // Implementation for providing post-fallback therapeutic support
    return Promise.resolve()
  }

  handleTherapeuticFallbackFailure(fallbackError, originalError, therapeuticContext) {
    // Implementation for handling fallback failures with therapeutic considerations
    throw fallbackError
  }

  updateUserProfile(userId, record) {
    // Implementation for updating user profile based on therapeutic record
  }

  learnFromSuccess(record, therapeuticContext) {
    // Implementation for learning from successful therapeutic interventions
  }

  analyzeTherapeuticFailure(record, therapeuticContext, error) {
    // Implementation for analyzing therapeutic failures
  }

  triggerInterventionIfNeeded(therapeuticContext, record) {
    // Implementation for triggering therapeutic interventions
  }

  getRecentAnalytics() {
    // Implementation for getting recent therapeutic analytics
    return {
      recentInterventions: this.therapeuticHistory.slice(-10),
      trends: {},
    }
  }

  // Additional helper methods
  analyzeSensoryProfile(analysis, sensoryProfile, therapeuticContext) {
    // Implementation for analyzing sensory profile
  }

  analyzeCommunicationLevel(analysis, communicationLevel, therapeuticContext) {
    // Implementation for analyzing communication level
  }

  analyzeBehavioralPatterns(analysis, behavioralPatterns, therapeuticContext) {
    // Implementation for analyzing behavioral patterns
  }

  analyzeLearningPreferences(analysis, learningPreferences, therapeuticContext) {
    // Implementation for analyzing learning preferences
  }

  analyzeTherapyGoals(analysis, therapyGoals, therapeuticContext) {
    // Implementation for analyzing therapy goals
  }

  shouldApplyStrategy(strategy, analysis, therapeuticContext) {
    // Implementation for determining if strategy should be applied
    return strategy.triggers.some(
      (trigger) =>
        analysis.requiredAdaptations.includes(trigger) ||
        this.detectTriggerInContext(trigger, therapeuticContext)
    )
  }

  calculateStrategyPriority(strategy, analysis) {
    // Implementation for calculating strategy priority
    return strategy.effectiveness * 100
  }

  detectTriggerInContext(trigger, therapeuticContext) {
    // Implementation for detecting triggers in therapeutic context
    return false
  }
}

export default TherapeuticAnalyzer
