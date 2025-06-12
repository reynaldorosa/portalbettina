/**
 * @file NeuroplasticityDataCollector.js
 * @description Coletor principal de dados de neuroplasticidade
 * Coleta dados específicos para análise de plasticidade neural
 * @version 1.0.0
 */

export class NeuroplasticityDataCollector {
  constructor(config = {}) {
    this.config = {
      samplingRate: config.samplingRate || 500, // 0.5 segundos
      bufferSize: config.bufferSize || 200,
      ...config,
    }

    this.dataBuffer = []
    this.isCollecting = false
    this.collectors = {
      cognitive: new CognitiveDataCollector(),
      learning: new LearningDataCollector(),
      memory: new MemoryDataCollector(),
      adaptation: new AdaptationDataCollector(),
    }
  }

  /**
   * Inicia coleta de dados de neuroplasticidade
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

    console.log('🧠 Coleta de dados de neuroplasticidade iniciada')
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

    console.log('🧠 Coleta de dados de neuroplasticidade finalizada')
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

    // Coletar dados de cada coletor especializado
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
      plasticity: {},
    }

    // Resumir dados de cada coletor
    for (const [type, collector] of Object.entries(this.collectors)) {
      summary.plasticity[type] = collector.getSummary()
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
 * @class CognitiveDataCollector
 * @description Coleta dados cognitivos específicos
 */
class CognitiveDataCollector {
  constructor() {
    this.cognitiveEvents = []
    this.performanceMetrics = []
    this.improvements = []
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
    this.baselinePerformance = null
  }

  stop() {
    // Cleanup
  }

  collect(eventData) {
    const cognitiveEvent = {
      task: eventData.task,
      performance: eventData.performance,
      accuracy: eventData.accuracy,
      responseTime: eventData.responseTime,
      difficulty: eventData.difficulty,
      cognitiveLoad: eventData.cognitiveLoad,
      timestamp: Date.now(),
    }

    // Rastrear melhorias de performance
    if (this.baselinePerformance === null) {
      this.baselinePerformance = cognitiveEvent.performance
    } else if (cognitiveEvent.performance > this.baselinePerformance * 1.1) {
      this.improvements.push({
        improvement: cognitiveEvent.performance - this.baselinePerformance,
        task: cognitiveEvent.task,
        timestamp: cognitiveEvent.timestamp,
      })
    }

    this.cognitiveEvents.push(cognitiveEvent)
    this.performanceMetrics.push(cognitiveEvent.performance)

    return cognitiveEvent
  }

  getSummary() {
    return {
      totalEvents: this.cognitiveEvents.length,
      avgPerformance: this.calculateAvgPerformance(),
      performanceImprovement: this.calculateImprovement(),
      cognitiveLoad: this.calculateAvgCognitiveLoad(),
      improvements: this.improvements.length,
      taskDistribution: this.getTaskDistribution(),
    }
  }

  calculateAvgPerformance() {
    return this.performanceMetrics.length > 0
      ? this.performanceMetrics.reduce((a, b) => a + b, 0) / this.performanceMetrics.length
      : 0
  }

  calculateImprovement() {
    if (this.performanceMetrics.length < 2) return 0

    const firstHalf = this.performanceMetrics.slice(
      0,
      Math.floor(this.performanceMetrics.length / 2)
    )
    const secondHalf = this.performanceMetrics.slice(Math.floor(this.performanceMetrics.length / 2))

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

    return (secondAvg - firstAvg) / firstAvg
  }

  calculateAvgCognitiveLoad() {
    const loads = this.cognitiveEvents
      .filter((e) => e.cognitiveLoad !== undefined)
      .map((e) => e.cognitiveLoad)

    return loads.length > 0 ? loads.reduce((a, b) => a + b, 0) / loads.length : 0
  }

  getTaskDistribution() {
    const distribution = {}
    for (const event of this.cognitiveEvents) {
      distribution[event.task] = (distribution[event.task] || 0) + 1
    }
    return distribution
  }
}

/**
 * @class LearningDataCollector
 * @description Coleta dados de aprendizagem
 */
class LearningDataCollector {
  constructor() {
    this.learningEvents = []
    this.skillAcquisitions = []
    this.transferEvents = []
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
  }

  stop() {
    // Cleanup
  }

  collect(eventData) {
    const learningEvent = {
      skill: eventData.skill,
      acquisitionRate: eventData.acquisitionRate,
      retentionRate: eventData.retentionRate,
      transferability: eventData.transferability,
      masteryLevel: eventData.masteryLevel,
      learningStrategy: eventData.learningStrategy,
      timestamp: Date.now(),
    }

    // Detectar aquisição de novas habilidades
    if (eventData.newSkillAcquired) {
      this.skillAcquisitions.push({
        skill: eventData.skill,
        acquisitionTime: eventData.acquisitionTime,
        difficulty: eventData.difficulty,
        timestamp: learningEvent.timestamp,
      })
    }

    // Detectar transferência de aprendizagem
    if (eventData.skillTransfer) {
      this.transferEvents.push({
        fromSkill: eventData.fromSkill,
        toSkill: eventData.toSkill,
        transferRate: eventData.transferRate,
        timestamp: learningEvent.timestamp,
      })
    }

    this.learningEvents.push(learningEvent)
    return learningEvent
  }

  getSummary() {
    return {
      totalLearningEvents: this.learningEvents.length,
      skillsAcquired: this.skillAcquisitions.length,
      transferEvents: this.transferEvents.length,
      avgAcquisitionRate: this.calculateAvgAcquisitionRate(),
      avgRetentionRate: this.calculateAvgRetentionRate(),
      learningEfficiency: this.calculateLearningEfficiency(),
      strategiesUsed: this.getStrategiesUsed(),
    }
  }

  calculateAvgAcquisitionRate() {
    const rates = this.learningEvents
      .filter((e) => e.acquisitionRate !== undefined)
      .map((e) => e.acquisitionRate)

    return rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0
  }

  calculateAvgRetentionRate() {
    const rates = this.learningEvents
      .filter((e) => e.retentionRate !== undefined)
      .map((e) => e.retentionRate)

    return rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0
  }

  calculateLearningEfficiency() {
    const avgAcquisition = this.calculateAvgAcquisitionRate()
    const avgRetention = this.calculateAvgRetentionRate()

    return (avgAcquisition + avgRetention) / 2
  }

  getStrategiesUsed() {
    const strategies = {}
    for (const event of this.learningEvents) {
      if (event.learningStrategy) {
        strategies[event.learningStrategy] = (strategies[event.learningStrategy] || 0) + 1
      }
    }
    return strategies
  }
}

/**
 * @class MemoryDataCollector
 * @description Coleta dados de memória
 */
class MemoryDataCollector {
  constructor() {
    this.memoryEvents = []
    this.consolidationEvents = []
    this.retrievalEvents = []
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
  }

  stop() {
    // Cleanup
  }

  collect(eventData) {
    const memoryEvent = {
      type: eventData.memoryType, // working, short-term, long-term
      operation: eventData.operation, // encode, consolidate, retrieve
      content: eventData.content,
      success: eventData.success,
      latency: eventData.latency,
      interference: eventData.interference,
      timestamp: Date.now(),
    }

    // Rastrear eventos específicos
    if (eventData.operation === 'consolidate') {
      this.consolidationEvents.push({
        content: eventData.content,
        consolidationTime: eventData.consolidationTime,
        strength: eventData.memoryStrength,
        timestamp: memoryEvent.timestamp,
      })
    }

    if (eventData.operation === 'retrieve') {
      this.retrievalEvents.push({
        content: eventData.content,
        retrievalTime: eventData.latency,
        accuracy: eventData.accuracy,
        confidence: eventData.confidence,
        timestamp: memoryEvent.timestamp,
      })
    }

    this.memoryEvents.push(memoryEvent)
    return memoryEvent
  }

  getSummary() {
    return {
      totalMemoryEvents: this.memoryEvents.length,
      consolidationEvents: this.consolidationEvents.length,
      retrievalEvents: this.retrievalEvents.length,
      memoryTypes: this.getMemoryTypeDistribution(),
      avgRetrievalTime: this.calculateAvgRetrievalTime(),
      memoryAccuracy: this.calculateMemoryAccuracy(),
      consolidationEfficiency: this.calculateConsolidationEfficiency(),
    }
  }

  getMemoryTypeDistribution() {
    const distribution = {}
    for (const event of this.memoryEvents) {
      distribution[event.type] = (distribution[event.type] || 0) + 1
    }
    return distribution
  }

  calculateAvgRetrievalTime() {
    const retrievalTimes = this.retrievalEvents.map((e) => e.retrievalTime)
    return retrievalTimes.length > 0
      ? retrievalTimes.reduce((a, b) => a + b, 0) / retrievalTimes.length
      : 0
  }

  calculateMemoryAccuracy() {
    const accuracies = this.retrievalEvents
      .filter((e) => e.accuracy !== undefined)
      .map((e) => e.accuracy)

    return accuracies.length > 0 ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length : 0
  }

  calculateConsolidationEfficiency() {
    const strengths = this.consolidationEvents
      .filter((e) => e.strength !== undefined)
      .map((e) => e.strength)

    return strengths.length > 0 ? strengths.reduce((a, b) => a + b, 0) / strengths.length : 0
  }
}

/**
 * @class AdaptationDataCollector
 * @description Coleta dados de adaptação
 */
class AdaptationDataCollector {
  constructor() {
    this.adaptationEvents = []
    this.flexibilityMeasures = []
    this.recoveryEvents = []
  }

  start(sessionId, userId) {
    this.sessionId = sessionId
    this.userId = userId
  }

  stop() {
    // Cleanup
  }

  collect(eventData) {
    const adaptationEvent = {
      adaptationType: eventData.adaptationType, // cognitive, behavioral, strategic
      trigger: eventData.trigger,
      response: eventData.response,
      adaptationTime: eventData.adaptationTime,
      effectiveness: eventData.effectiveness,
      flexibility: eventData.flexibility,
      timestamp: Date.now(),
    }

    // Rastrear flexibilidade cognitiva
    if (eventData.flexibility !== undefined) {
      this.flexibilityMeasures.push({
        flexibility: eventData.flexibility,
        context: eventData.context,
        timestamp: adaptationEvent.timestamp,
      })
    }

    // Rastrear eventos de recuperação
    if (eventData.recoveryEvent) {
      this.recoveryEvents.push({
        challenge: eventData.challenge,
        recoveryTime: eventData.recoveryTime,
        recoveryStrategy: eventData.recoveryStrategy,
        effectiveness: eventData.effectiveness,
        timestamp: adaptationEvent.timestamp,
      })
    }

    this.adaptationEvents.push(adaptationEvent)
    return adaptationEvent
  }

  getSummary() {
    return {
      totalAdaptations: this.adaptationEvents.length,
      recoveryEvents: this.recoveryEvents.length,
      avgAdaptationTime: this.calculateAvgAdaptationTime(),
      adaptationEffectiveness: this.calculateAdaptationEffectiveness(),
      cognitiveFlexibility: this.calculateCognitiveFlexibility(),
      adaptationTypes: this.getAdaptationTypes(),
      recoveryEfficiency: this.calculateRecoveryEfficiency(),
    }
  }

  calculateAvgAdaptationTime() {
    const times = this.adaptationEvents
      .filter((e) => e.adaptationTime !== undefined)
      .map((e) => e.adaptationTime)

    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }

  calculateAdaptationEffectiveness() {
    const effectiveness = this.adaptationEvents
      .filter((e) => e.effectiveness !== undefined)
      .map((e) => e.effectiveness)

    return effectiveness.length > 0
      ? effectiveness.reduce((a, b) => a + b, 0) / effectiveness.length
      : 0
  }

  calculateCognitiveFlexibility() {
    const flexibility = this.flexibilityMeasures.map((f) => f.flexibility)
    return flexibility.length > 0 ? flexibility.reduce((a, b) => a + b, 0) / flexibility.length : 0
  }

  getAdaptationTypes() {
    const types = {}
    for (const event of this.adaptationEvents) {
      types[event.adaptationType] = (types[event.adaptationType] || 0) + 1
    }
    return types
  }

  calculateRecoveryEfficiency() {
    const efficiencies = this.recoveryEvents
      .filter((e) => e.effectiveness !== undefined)
      .map((e) => e.effectiveness)

    return efficiencies.length > 0
      ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length
      : 0
  }
}

export default NeuroplasticityDataCollector
export {
  CognitiveDataCollector,
  LearningDataCollector,
  MemoryDataCollector,
  AdaptationDataCollector,
}
