/**
 * @file FrustrationDetection.js
 * @description Algoritmo de detecção de frustração em tempo real
 * Analisa padrões comportamentais para identificar sinais de frustração
 * @version 1.0.0
 */

export class FrustrationDetection {
  constructor(config = {}) {
    this.config = {
      errorThreshold: config.errorThreshold || 0.3,
      timeThreshold: config.timeThreshold || 5000, // 5 segundos
      repetitionThreshold: config.repetitionThreshold || 3,
      intensityWeight: config.intensityWeight || 1.0,
      ...config,
    }

    this.frustrationIndicators = {
      rapidClicks: { weight: 0.8, threshold: 5 },
      longPauses: { weight: 0.6, threshold: 3000 },
      errorRepetition: { weight: 0.9, threshold: 3 },
      backtracking: { weight: 0.7, threshold: 2 },
      timeoutEvents: { weight: 0.9, threshold: 1 },
      irregularRhythm: { weight: 0.5, threshold: 0.7 },
    }

    this.isInitialized = false
    this.sessionData = []
    this.frustrationHistory = []
    this.currentFrustrationLevel = 0
  }

  async initialize() {
    this.isInitialized = true
    console.log('😤 FrustrationDetection inicializado')
  }

  /**
   * Executa detecção de frustração
   * @param {Object} userProfile - Perfil do usuário
   * @param {Object} sessionData - Dados da sessão
   */
  async execute(userProfile, sessionData) {
    try {
      const frustrationMetrics = this.analyzeFrustrationMetrics(sessionData)
      const behavioralPatterns = this.analyzeBehavioralPatterns(sessionData)
      const temporalAnalysis = this.analyzeTemporalPatterns(sessionData)

      const frustrationLevel = this.calculateFrustrationLevel(
        frustrationMetrics,
        behavioralPatterns,
        temporalAnalysis
      )

      const result = {
        algorithm: 'FrustrationDetection',
        timestamp: new Date(),
        score: 1 - frustrationLevel, // Score alto = baixa frustração
        confidence: this.calculateConfidence(sessionData),
        frustrationLevel,
        frustrationMetrics,
        behavioralPatterns,
        temporalAnalysis,
        triggers: this.identifyTriggers(frustrationMetrics, behavioralPatterns),
        interventionNeeded: frustrationLevel > this.config.errorThreshold,
        insights: this.generateInsights(frustrationLevel, frustrationMetrics),
        recommendations: this.generateRecommendations(frustrationLevel, behavioralPatterns),
        riskFactors: this.identifyRiskFactors(frustrationLevel, behavioralPatterns),
      }

      this.updateFrustrationHistory(result)
      this.currentFrustrationLevel = frustrationLevel

      return result
    } catch (error) {
      console.error('❌ Erro na detecção de frustração:', error)
      return this.getDefaultResult()
    }
  }

  /**
   * Análise em tempo real para intervenções imediatas
   */
  async analyzeRealtime(interactionData) {
    const realtimeIndicators = this.analyzeRealtimeIndicators(interactionData)
    const frustrationSpike = this.detectFrustrationSpike(realtimeIndicators)

    return {
      currentFrustrationLevel: this.currentFrustrationLevel,
      realtimeIndicators,
      frustrationSpike,
      immediateIntervention: frustrationSpike && this.currentFrustrationLevel > 0.8,
    }
  }

  /**
   * Analisa métricas de frustração
   */
  analyzeFrustrationMetrics(sessionData) {
    const metrics = {
      errorRate: this.calculateErrorRate(sessionData),
      avgResponseTime: this.calculateAverageResponseTime(sessionData),
      taskCompletionRate: this.calculateTaskCompletionRate(sessionData),
      helpRequestFrequency: this.calculateHelpRequestFrequency(sessionData),
      retryAttempts: this.calculateRetryAttempts(sessionData),
    }

    return metrics
  }

  /**
   * Analisa padrões comportamentais
   */
  analyzeBehavioralPatterns(sessionData) {
    const patterns = {
      rapidClicks: this.detectRapidClicks(sessionData),
      longPauses: this.detectLongPauses(sessionData),
      errorRepetition: this.detectErrorRepetition(sessionData),
      backtracking: this.detectBacktracking(sessionData),
      irregularRhythm: this.detectIrregularRhythm(sessionData),
    }

    return patterns
  }

  /**
   * Analisa padrões temporais
   */
  analyzeTemporalPatterns(sessionData) {
    return {
      sessionDuration: this.calculateSessionDuration(sessionData),
      activitySwitchingRate: this.calculateActivitySwitchingRate(sessionData),
      peakFrustrationTimes: this.identifyPeakFrustrationTimes(sessionData),
      recoveryTime: this.calculateRecoveryTime(sessionData),
    }
  }

  /**
   * Calcula nível geral de frustração
   */
  calculateFrustrationLevel(metrics, patterns, temporal) {
    let frustrationScore = 0
    let totalWeight = 0

    // Métricas de erro
    if (metrics.errorRate > this.config.errorThreshold) {
      frustrationScore += metrics.errorRate * 0.3
      totalWeight += 0.3
    }

    // Padrões comportamentais
    for (const [pattern, data] of Object.entries(patterns)) {
      if (this.frustrationIndicators[pattern] && data.detected) {
        const indicator = this.frustrationIndicators[pattern]
        const intensity = Math.min(data.intensity / indicator.threshold, 1)
        frustrationScore += intensity * indicator.weight * 0.4
        totalWeight += indicator.weight * 0.4
      }
    }

    // Fatores temporais
    if (temporal.sessionDuration > 1800000) {
      // 30 minutos
      frustrationScore += 0.2
      totalWeight += 0.2
    }

    if (temporal.activitySwitchingRate > 0.5) {
      frustrationScore += 0.1
      totalWeight += 0.1
    }

    return totalWeight > 0 ? Math.min(frustrationScore / totalWeight, 1) : 0
  }

  /**
   * Detecta cliques rápidos
   */
  detectRapidClicks(sessionData) {
    const clicks = sessionData.interactions?.filter((i) => i.type === 'click') || []
    const rapidSequences = []

    for (let i = 0; i < clicks.length - 1; i++) {
      const timeDiff = clicks[i + 1].timestamp - clicks[i].timestamp
      if (timeDiff < 300) {
        // Menos de 300ms entre cliques
        rapidSequences.push({ start: i, interval: timeDiff })
      }
    }

    return {
      detected: rapidSequences.length >= this.frustrationIndicators.rapidClicks.threshold,
      intensity: rapidSequences.length,
      sequences: rapidSequences,
    }
  }

  /**
   * Detecta pausas longas
   */
  detectLongPauses(sessionData) {
    const interactions = sessionData.interactions || []
    const longPauses = []

    for (let i = 0; i < interactions.length - 1; i++) {
      const timeDiff = interactions[i + 1].timestamp - interactions[i].timestamp
      if (timeDiff > this.config.timeThreshold) {
        longPauses.push({ duration: timeDiff, position: i })
      }
    }

    return {
      detected: longPauses.length >= this.frustrationIndicators.longPauses.threshold,
      intensity: longPauses.length,
      pauses: longPauses,
      averagePauseDuration:
        longPauses.length > 0
          ? longPauses.reduce((sum, p) => sum + p.duration, 0) / longPauses.length
          : 0,
    }
  }

  /**
   * Detecta repetição de erros
   */
  detectErrorRepetition(sessionData) {
    const errors = sessionData.errors || []
    const errorPatterns = {}

    // Agrupar erros por tipo
    for (const error of errors) {
      const key = `${error.type}_${error.context}`
      if (!errorPatterns[key]) {
        errorPatterns[key] = { count: 0, timestamps: [] }
      }
      errorPatterns[key].count++
      errorPatterns[key].timestamps.push(error.timestamp)
    }

    // Encontrar padrões repetitivos
    const repetitiveErrors = Object.entries(errorPatterns).filter(
      ([, data]) => data.count >= this.config.repetitionThreshold
    )

    return {
      detected: repetitiveErrors.length > 0,
      intensity: repetitiveErrors.length,
      patterns: repetitiveErrors,
      maxRepetitions: Math.max(...Object.values(errorPatterns).map((p) => p.count), 0),
    }
  }

  /**
   * Detecta retrocesso nas ações
   */
  detectBacktracking(sessionData) {
    const actions = sessionData.actions || []
    const backtrackingEvents = []

    for (let i = 0; i < actions.length - 1; i++) {
      const currentAction = actions[i]
      const nextAction = actions[i + 1]

      // Verificar se a próxima ação desfaz a atual
      if (this.isBacktrackingAction(currentAction, nextAction)) {
        backtrackingEvents.push({
          original: currentAction,
          backtrack: nextAction,
          position: i,
        })
      }
    }

    return {
      detected: backtrackingEvents.length >= this.frustrationIndicators.backtracking.threshold,
      intensity: backtrackingEvents.length,
      events: backtrackingEvents,
    }
  }

  /**
   * Detecta ritmo irregular
   */
  detectIrregularRhythm(sessionData) {
    const interactions = sessionData.interactions || []
    if (interactions.length < 3) return { detected: false, intensity: 0 }

    const intervals = []
    for (let i = 0; i < interactions.length - 1; i++) {
      intervals.push(interactions[i + 1].timestamp - interactions[i].timestamp)
    }

    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance =
      intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) /
      intervals.length
    const standardDeviation = Math.sqrt(variance)
    const coefficientOfVariation = standardDeviation / meanInterval

    return {
      detected: coefficientOfVariation > this.frustrationIndicators.irregularRhythm.threshold,
      intensity: coefficientOfVariation,
      meanInterval,
      variance: coefficientOfVariation,
    }
  }

  /**
   * Identifica gatilhos de frustração
   */
  identifyTriggers(metrics, patterns) {
    const triggers = []

    if (metrics.errorRate > 0.5) {
      triggers.push({
        type: 'high_error_rate',
        severity: 'high',
        value: metrics.errorRate,
        description: 'Taxa de erro elevada',
      })
    }

    if (patterns.rapidClicks.detected) {
      triggers.push({
        type: 'rapid_clicking',
        severity: 'medium',
        value: patterns.rapidClicks.intensity,
        description: 'Cliques rápidos e impacientes',
      })
    }

    if (patterns.errorRepetition.detected) {
      triggers.push({
        type: 'repeated_errors',
        severity: 'high',
        value: patterns.errorRepetition.maxRepetitions,
        description: 'Repetição dos mesmos erros',
      })
    }

    return triggers
  }

  /**
   * Gera insights baseados na análise
   */
  generateInsights(frustrationLevel, metrics) {
    const insights = []

    if (frustrationLevel > 0.7) {
      insights.push({
        type: 'warning',
        message: 'Alto nível de frustração detectado - intervenção recomendada',
        confidence: 0.9,
      })
    }

    if (metrics.errorRate > 0.4) {
      insights.push({
        type: 'pattern',
        message: 'Padrão de erros frequentes indica possível sobrecarga cognitiva',
        confidence: 0.8,
      })
    }

    if (frustrationLevel < 0.3) {
      insights.push({
        type: 'positive',
        message: 'Usuário demonstra baixos níveis de frustração e boa adaptação',
        confidence: 0.85,
      })
    }

    return insights
  }

  /**
   * Gera recomendações
   */
  generateRecommendations(frustrationLevel, patterns) {
    const recommendations = []

    if (frustrationLevel > 0.6) {
      recommendations.push({
        type: 'immediate',
        action: 'break_suggestion',
        description: 'Sugerir uma pausa para reduzir frustração',
      })

      recommendations.push({
        type: 'difficulty',
        action: 'reduce_complexity',
        description: 'Reduzir dificuldade da atividade atual',
      })
    }

    if (patterns.rapidClicks.detected) {
      recommendations.push({
        type: 'behavioral',
        action: 'slow_down_prompt',
        description: 'Encorajar o usuário a desacelerar e pensar antes de agir',
      })
    }

    if (patterns.errorRepetition.detected) {
      recommendations.push({
        type: 'educational',
        action: 'provide_guidance',
        description: 'Fornecer orientação adicional para evitar erros repetitivos',
      })
    }

    return recommendations
  }

  /**
   * Identifica fatores de risco
   */
  identifyRiskFactors(frustrationLevel, patterns) {
    const riskFactors = []

    if (frustrationLevel > 0.8) {
      riskFactors.push({
        factor: 'severe_frustration',
        severity: 'critical',
        recommendation: 'immediate_intervention',
        description: 'Nível crítico de frustração detectado',
      })
    }

    if (patterns.errorRepetition.intensity > 5) {
      riskFactors.push({
        factor: 'learning_difficulty',
        severity: 'high',
        recommendation: 'adaptive_support',
        description: 'Possível dificuldade de aprendizagem',
      })
    }

    return riskFactors
  }

  // Métodos auxiliares
  calculateErrorRate(sessionData) {
    const totalActions = sessionData.actions?.length || 1
    const errors = sessionData.errors?.length || 0
    return errors / totalActions
  }

  calculateAverageResponseTime(sessionData) {
    const responseTimes = sessionData.responseTimes || []
    return responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0
  }

  calculateTaskCompletionRate(sessionData) {
    const completed = sessionData.completedTasks || 0
    const total = sessionData.totalTasks || 1
    return completed / total
  }

  calculateHelpRequestFrequency(sessionData) {
    const helpRequests = sessionData.helpRequests?.length || 0
    const sessionDuration = this.calculateSessionDuration(sessionData)
    return helpRequests / (sessionDuration / 60000) // Por minuto
  }

  calculateRetryAttempts(sessionData) {
    return sessionData.retryAttempts?.length || 0
  }

  calculateSessionDuration(sessionData) {
    if (!sessionData.startTime || !sessionData.endTime) return 0
    return sessionData.endTime - sessionData.startTime
  }

  calculateActivitySwitchingRate(sessionData) {
    const activities = sessionData.activities || []
    return activities.length > 1 ? (activities.length - 1) / activities.length : 0
  }

  identifyPeakFrustrationTimes(sessionData) {
    // Implementar identificação de picos de frustração ao longo do tempo
    return []
  }

  calculateRecoveryTime(sessionData) {
    // Calcular tempo médio de recuperação após eventos de frustração
    return 0
  }

  analyzeRealtimeIndicators(interactionData) {
    return {
      clickSpeed: this.analyzeClickSpeed(interactionData),
      pauseDuration: this.analyzePauseDuration(interactionData),
      errorOccurred: interactionData.error || false,
    }
  }

  detectFrustrationSpike(indicators) {
    return indicators.clickSpeed > 5 || indicators.pauseDuration > 5000 || indicators.errorOccurred
  }

  analyzeClickSpeed(interactionData) {
    // Analisar velocidade de cliques em tempo real
    return interactionData.clicksPerSecond || 0
  }

  analyzePauseDuration(interactionData) {
    // Analisar duração de pausas em tempo real
    return interactionData.pauseDuration || 0
  }

  isBacktrackingAction(current, next) {
    // Verificar se uma ação desfaz a anterior
    return (
      (current.type === 'action' && next.type === 'undo') ||
      (current.target === next.target && current.action !== next.action)
    )
  }

  updateFrustrationHistory(result) {
    this.frustrationHistory.push(result)
    if (this.frustrationHistory.length > 100) {
      this.frustrationHistory.shift()
    }
  }

  calculateConfidence(sessionData) {
    const dataPoints =
      (sessionData.interactions?.length || 0) +
      (sessionData.actions?.length || 0) +
      (sessionData.errors?.length || 0)
    return Math.min(dataPoints / 20, 1)
  }

  getDefaultResult() {
    return {
      algorithm: 'FrustrationDetection',
      timestamp: new Date(),
      score: 0.5,
      confidence: 0.1,
      frustrationLevel: 0.5,
      frustrationMetrics: {},
      behavioralPatterns: {},
      temporalAnalysis: {},
      triggers: [],
      interventionNeeded: false,
      insights: [],
      recommendations: [],
      riskFactors: [],
    }
  }

  updateProfile(newProfile) {
    this.config = { ...this.config, ...newProfile }
  }
}

export default FrustrationDetection
