/**
 * @file EmotionalDataCollector.js
 * @description Coletor principal de dados emocionais
 * Coleta dados de múltiplas fontes para análise emocional
 * @version 1.0.0
 */

export class EmotionalDataCollector {
  constructor(config = {}) {
    this.config = {
      samplingRate: config.samplingRate || 1000, // 1 segundo
      bufferSize: config.bufferSize || 100,
      ...config,
    }

    this.dataBuffer = []
    this.isCollecting = false
    this.collectors = {
      interaction: new InteractionDataCollector(),
      behavioral: new BehavioralDataCollector(),
      temporal: new TemporalDataCollector(),
      contextual: new ContextualDataCollector(),
    }
  }

  /**
   * Inicia coleta de dados
   */
  startCollection(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
    this.isCollecting = true
    this.sessionStartTime = Date.now()

    // Iniciar todos os coletores
    for (const collector of Object.values(this.collectors)) {
      collector.start(sessionId, userId)
    }

    console.log('📊 Coleta de dados emocionais iniciada')
  }

  /**
   * Para coleta de dados
   */
  stopCollection() {
    this.isCollecting = false

    // Parar todos os coletores
    for (const collector of Object.values(this.collectors)) {
      collector.stop()
    }

    console.log('📊 Coleta de dados emocionais finalizada')
    return this.generateSessionSummary()
  }

  /**
   * Coleta dados em tempo real
   */
  collectRealtimeData(eventData) {
    if (!this.isCollecting) return

    const timestamp = Date.now()
    const dataPoint = {
      timestamp,
      sessionTime: timestamp - this.sessionStartTime,
      ...eventData,
    }

    // Coletar dados de cada coletor
    for (const [type, collector] of Object.entries(this.collectors)) {
      dataPoint[type] = collector.collect(eventData)
    }

    this.dataBuffer.push(dataPoint)

    // Limitar tamanho do buffer
    if (this.dataBuffer.length > this.config.bufferSize) {
      this.dataBuffer.shift()
    }

    return dataPoint
  }

  /**
   * Gera resumo da sessão
   */
  generateSessionSummary() {
    const summary = {
      sessionId: this.sessionId,
      userId: this.userId,
      duration: Date.now() - this.sessionStartTime,
      totalDataPoints: this.dataBuffer.length,
      dataTypes: {},
    }

    // Resumir dados de cada coletor
    for (const [type, collector] of Object.entries(this.collectors)) {
      summary.dataTypes[type] = collector.getSummary()
    }

    return summary
  }

  /**
   * Obtém dados coletados
   */
  getCollectedData() {
    return {
      buffer: [...this.dataBuffer],
      summary: this.generateSessionSummary(),
    }
  }
}

/**
 * @class InteractionDataCollector
 * @description Coleta dados de interação do usuário
 */
class InteractionDataCollector {
  constructor() {
    this.interactions = []
    this.clickSequences = []
    this.lastClickTime = 0
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
    this.interactions = []
  }

  stop() {
    // Cleanup se necessário
  }

  collect(eventData) {
    const interaction = {
      type: eventData.type,
      target: eventData.target,
      timestamp: Date.now(),
      coordinates: eventData.coordinates,
      pressure: eventData.pressure,
      duration: eventData.duration,
    }

    // Detectar cliques rápidos
    if (eventData.type === 'click') {
      const timeSinceLastClick = interaction.timestamp - this.lastClickTime
      if (timeSinceLastClick < 300) {
        this.clickSequences.push({
          interval: timeSinceLastClick,
          timestamp: interaction.timestamp,
        })
      }
      this.lastClickTime = interaction.timestamp
    }

    this.interactions.push(interaction)
    return interaction
  }

  getSummary() {
    return {
      totalInteractions: this.interactions.length,
      clickSequences: this.clickSequences.length,
      interactionTypes: this.getInteractionTypes(),
      avgInteractionInterval: this.calculateAvgInterval(),
    }
  }

  getInteractionTypes() {
    const types = {}
    for (const interaction of this.interactions) {
      types[interaction.type] = (types[interaction.type] || 0) + 1
    }
    return types
  }

  calculateAvgInterval() {
    if (this.interactions.length < 2) return 0

    let totalInterval = 0
    for (let i = 1; i < this.interactions.length; i++) {
      totalInterval += this.interactions[i].timestamp - this.interactions[i - 1].timestamp
    }

    return totalInterval / (this.interactions.length - 1)
  }
}

/**
 * @class BehavioralDataCollector
 * @description Coleta dados comportamentais
 */
class BehavioralDataCollector {
  constructor() {
    this.behaviors = []
    this.patterns = {
      backtracking: [],
      hesitation: [],
      repetition: [],
    }
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
    this.behaviors = []
  }

  stop() {
    // Cleanup
  }

  collect(eventData) {
    const behavior = {
      action: eventData.action,
      context: eventData.context,
      success: eventData.success,
      errorType: eventData.errorType,
      timestamp: Date.now(),
    }

    // Detectar padrões comportamentais
    this.detectBacktracking(behavior)
    this.detectHesitation(eventData)
    this.detectRepetition(behavior)

    this.behaviors.push(behavior)
    return behavior
  }

  detectBacktracking(behavior) {
    const lastBehavior = this.behaviors[this.behaviors.length - 1]
    if (lastBehavior && this.isBacktrackingBehavior(lastBehavior, behavior)) {
      this.patterns.backtracking.push({
        original: lastBehavior,
        backtrack: behavior,
        timestamp: behavior.timestamp,
      })
    }
  }

  detectHesitation(eventData) {
    if (eventData.pauseDuration && eventData.pauseDuration > 3000) {
      this.patterns.hesitation.push({
        duration: eventData.pauseDuration,
        context: eventData.context,
        timestamp: Date.now(),
      })
    }
  }

  detectRepetition(behavior) {
    const recentBehaviors = this.behaviors.slice(-5)
    const similarBehaviors = recentBehaviors.filter(
      (b) => b.action === behavior.action && b.context === behavior.context
    )

    if (similarBehaviors.length >= 3) {
      this.patterns.repetition.push({
        action: behavior.action,
        context: behavior.context,
        occurrences: similarBehaviors.length,
        timestamp: behavior.timestamp,
      })
    }
  }

  isBacktrackingBehavior(previous, current) {
    return (
      (previous.action === 'select' && current.action === 'deselect') ||
      (previous.action === 'create' && current.action === 'delete') ||
      (previous.action === 'move' && current.action === 'undo')
    )
  }

  getSummary() {
    return {
      totalBehaviors: this.behaviors.length,
      successRate: this.calculateSuccessRate(),
      patterns: {
        backtracking: this.patterns.backtracking.length,
        hesitation: this.patterns.hesitation.length,
        repetition: this.patterns.repetition.length,
      },
      errorTypes: this.getErrorTypes(),
    }
  }

  calculateSuccessRate() {
    const successfulBehaviors = this.behaviors.filter((b) => b.success).length
    return this.behaviors.length > 0 ? successfulBehaviors / this.behaviors.length : 0
  }

  getErrorTypes() {
    const errorTypes = {}
    for (const behavior of this.behaviors) {
      if (behavior.errorType) {
        errorTypes[behavior.errorType] = (errorTypes[behavior.errorType] || 0) + 1
      }
    }
    return errorTypes
  }
}

/**
 * @class TemporalDataCollector
 * @description Coleta dados temporais
 */
class TemporalDataCollector {
  constructor() {
    this.timeEvents = []
    this.rhythmData = []
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
    this.startTime = Date.now()
  }

  stop() {
    this.endTime = Date.now()
  }

  collect(eventData) {
    const timeEvent = {
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      eventDuration: eventData.duration || 0,
      responseTime: eventData.responseTime || 0,
    }

    // Calcular ritmo
    if (this.timeEvents.length > 0) {
      const lastEvent = this.timeEvents[this.timeEvents.length - 1]
      const interval = timeEvent.timestamp - lastEvent.timestamp
      this.rhythmData.push(interval)
    }

    this.timeEvents.push(timeEvent)
    return timeEvent
  }

  getSummary() {
    return {
      sessionDuration: this.endTime - this.startTime,
      totalEvents: this.timeEvents.length,
      avgResponseTime: this.calculateAvgResponseTime(),
      rhythmVariability: this.calculateRhythmVariability(),
      peakActivityPeriods: this.identifyPeakPeriods(),
    }
  }

  calculateAvgResponseTime() {
    const responseTimes = this.timeEvents
      .filter((e) => e.responseTime > 0)
      .map((e) => e.responseTime)

    return responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0
  }

  calculateRhythmVariability() {
    if (this.rhythmData.length < 2) return 0

    const mean = this.rhythmData.reduce((a, b) => a + b, 0) / this.rhythmData.length
    const variance =
      this.rhythmData.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) /
      this.rhythmData.length

    return Math.sqrt(variance) / mean // Coeficiente de variação
  }

  identifyPeakPeriods() {
    // Identificar períodos de alta atividade
    const windows = []
    const windowSize = 30000 // 30 segundos

    for (let i = 0; i < this.timeEvents.length; i += 10) {
      const windowEvents = this.timeEvents.slice(i, i + 10)
      if (windowEvents.length > 0) {
        const eventRate = windowEvents.length / (windowSize / 1000)
        if (eventRate > 5) {
          // Mais de 5 eventos por segundo
          windows.push({
            start: windowEvents[0].timestamp,
            end: windowEvents[windowEvents.length - 1].timestamp,
            eventRate,
          })
        }
      }
    }

    return windows
  }
}

/**
 * @class ContextualDataCollector
 * @description Coleta dados contextuais
 */
class ContextualDataCollector {
  constructor() {
    this.contexts = []
    this.environmentalFactors = []
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
  }

  stop() {
    // Cleanup
  }

  collect(eventData) {
    const context = {
      activity: eventData.activity,
      difficulty: eventData.difficulty,
      modality: eventData.modality,
      socialContext: eventData.socialContext,
      environmentalNoise: eventData.environmentalNoise,
      timeOfDay: new Date().getHours(),
      timestamp: Date.now(),
    }

    this.contexts.push(context)
    return context
  }

  getSummary() {
    return {
      totalContexts: this.contexts.length,
      activities: this.getUniqueActivities(),
      difficultyLevels: this.getDifficultyDistribution(),
      modalityUsage: this.getModalityUsage(),
      timeDistribution: this.getTimeDistribution(),
    }
  }

  getUniqueActivities() {
    const activities = new Set(this.contexts.map((c) => c.activity))
    return Array.from(activities)
  }

  getDifficultyDistribution() {
    const distribution = {}
    for (const context of this.contexts) {
      const diff = context.difficulty || 'unknown'
      distribution[diff] = (distribution[diff] || 0) + 1
    }
    return distribution
  }

  getModalityUsage() {
    const modalities = {}
    for (const context of this.contexts) {
      const mod = context.modality || 'unknown'
      modalities[mod] = (modalities[mod] || 0) + 1
    }
    return modalities
  }

  getTimeDistribution() {
    const hours = {}
    for (const context of this.contexts) {
      const hour = context.timeOfDay
      hours[hour] = (hours[hour] || 0) + 1
    }
    return hours
  }
}

export default EmotionalDataCollector
export {
  InteractionDataCollector,
  BehavioralDataCollector,
  TemporalDataCollector,
  ContextualDataCollector,
}
