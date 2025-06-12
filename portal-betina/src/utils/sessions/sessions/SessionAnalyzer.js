/**
 * @file SessionAnalyzer.js
 * @description Análise de sessões com métricas terapêuticas
 * Extraído do databaseService_AdaptiveParameters.js para modularização
 */

export class SessionAnalyzer {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService.logger
    this.cognitiveAnalyzer = databaseService.getModule('cognitive')
  }

  /**
   * @method analyzeSessionPerformance
   * @description Analisa o desempenho de uma sessão de jogo
   * @param {Object} sessionData - Dados da sessão
   * @returns {Object} Análise completa do desempenho
   */
  analyzeSessionPerformance(sessionData) {
    const performance = sessionData.performance || {}
    
    return {
      accuracy: this.calculateAccuracyMetrics(performance),
      speed: this.calculateSpeedMetrics(performance),
      consistency: this.calculateConsistencyMetrics(performance),
      engagement: this.calculateEngagementMetrics(performance),
      progress: this.calculateProgressMetrics(performance),
      therapeutic: this.generateTherapeuticInsights(sessionData)
    }
  }

  /**
   * @method calculateAccuracyMetrics
   * @description Calcula métricas de precisão
   * @param {Object} performance - Dados de desempenho
   * @returns {Object} Métricas de precisão
   */
  calculateAccuracyMetrics(performance) {
    const accuracy = performance.accuracy || 0.5
    
    return {
      current: accuracy,
      level: accuracy > 0.85 ? 'high' : accuracy > 0.65 ? 'medium' : 'low',
      trend: this.calculateAccuracyTrend(performance),
      improvement: this.calculateAccuracyImprovement(performance),
      confidence: this.calculateConfidenceLevel(performance)
    }
  }

  /**
   * @method calculateSpeedMetrics
   * @description Calcula métricas de velocidade
   * @param {Object} performance - Dados de desempenho
   * @returns {Object} Métricas de velocidade
   */
  calculateSpeedMetrics(performance) {
    const responseTime = performance.responseTime || 5000
    
    return {
      averageTime: responseTime,
      level: responseTime < 3000 ? 'fast' : responseTime < 7000 ? 'moderate' : 'slow',
      processingSpeed: this.calculateProcessingSpeed(performance),
      adaptations: this.suggestSpeedAdaptations(performance)
    }
  }

  /**
   * @method calculateConsistencyMetrics
   * @description Calcula métricas de consistência
   * @param {Object} performance - Dados de desempenho
   * @returns {Object} Métricas de consistência
   */
  calculateConsistencyMetrics(performance) {
    const consistency = performance.consistency || 0.5
    
    return {
      score: consistency,
      level: consistency > 0.8 ? 'high' : consistency > 0.6 ? 'medium' : 'low',
      variability: this.calculatePerformanceVariability(performance),
      patterns: this.identifyPerformancePatterns(performance)
    }
  }

  /**
   * @method calculateEngagementMetrics
   * @description Calcula métricas de engajamento
   * @param {Object} performance - Dados de desempenho
   * @returns {Object} Métricas de engajamento
   */
  calculateEngagementMetrics(performance) {
    const engagement = performance.engagement || 0.5
    const timeSpent = performance.timeSpent || 0
    
    return {
      level: engagement > 0.8 ? 'high' : engagement > 0.6 ? 'medium' : 'low',
      duration: timeSpent,
      attention: this.calculateAttentionMetrics(performance),
      motivation: this.calculateMotivationLevel(performance),
      fatigue: this.calculateFatigueLevel(performance)
    }
  }

  /**
   * @method calculateProgressMetrics
   * @description Calcula métricas de progresso
   * @param {Object} performance - Dados de desempenho
   * @returns {Object} Métricas de progresso
   */
  calculateProgressMetrics(performance) {
    return {
      completion: performance.completed || false,
      milestones: this.identifyMilestonesReached(performance),
      skills: this.analyzeSkillDevelopment(performance),
      therapeutic: this.analyzeTherapeuticProgress(performance)
    }
  }

  /**
   * @method generateTherapeuticInsights
   * @description Gera insights terapêuticos da sessão
   * @param {Object} sessionData - Dados da sessão
   * @returns {Object} Insights terapêuticos
   */
  generateTherapeuticInsights(sessionData) {
    const performance = sessionData.performance || {}
    const indicators = sessionData.indicators || {}
    
    return {
      cognitive: this.analyzeCognitiveAspects(performance, indicators),
      sensory: this.analyzeSensoryAspects(performance, indicators),
      social: this.analyzeSocialAspects(performance, indicators),
      behavioral: this.analyzeBehavioralAspects(performance, indicators),
      communication: this.analyzeCommunicationAspects(performance, indicators),
      executive: this.analyzeExecutiveAspects(performance, indicators)
    }
  }

  /**
   * @method enrichSessionWithTherapyAnalysis
   * @description Enriquece sessão com análise terapêutica
   * @param {Object} session - Dados da sessão
   * @returns {Object} Sessão enriquecida
   */
  enrichSessionWithTherapyAnalysis(session) {
    if (!this.cognitiveAnalyzer) {
      this.logger.warn('CognitiveAnalyzer not available for session enrichment')
      return session
    }

    const analysis = this.analyzeSessionPerformance(session)
    
    return {
      ...session,
      analysis,
      therapeuticRecommendations: this.generateTherapeuticRecommendations(analysis),
      adaptiveAdjustments: this.calculateAdaptiveAdjustments(session),
      timestamp: new Date().toISOString()
    }
  }

  /**
   * @method generateTherapeuticRecommendations
   * @description Gera recomendações terapêuticas
   * @param {Object} analysis - Análise da sessão
   * @returns {Object} Recomendações terapêuticas
   */
  generateTherapeuticRecommendations(analysis) {
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      adaptations: {}
    }

    // Recomendações baseadas na precisão
    if (analysis.accuracy.level === 'low') {
      recommendations.immediate.push('reduce-task-complexity')
      recommendations.immediate.push('increase-visual-supports')
    }

    // Recomendações baseadas na velocidade
    if (analysis.speed.level === 'slow') {
      recommendations.immediate.push('extend-processing-time')
      recommendations.shortTerm.push('processing-speed-exercises')
    }

    // Recomendações baseadas no engajamento
    if (analysis.engagement.level === 'low') {
      recommendations.immediate.push('increase-motivation')
      recommendations.immediate.push('sensory-break')
    }

    return recommendations
  }

  /**
   * @method calculateAdaptiveAdjustments
   * @description Calcula ajustes adaptativos para próximas sessões
   * @param {Object} sessionData - Dados da sessão
   * @returns {Object} Ajustes adaptativos
   */
  calculateAdaptiveAdjustments(sessionData) {
    const performance = sessionData.performance || {}
    
    return {
      difficulty: this.calculateDifficultyAdjustment(performance),
      timing: this.calculateTimingAdjustments(performance),
      support: this.calculateSupportAdjustments(performance),
      sensory: this.calculateSensoryAdjustments(sessionData.indicators || {})
    }
  }

  // ============== MÉTODOS AUXILIARES ==============

  calculateAccuracyTrend(performance) {
    // Implementar lógica de tendência de precisão
    return performance.accuracyHistory ? 'improving' : 'stable'
  }

  calculateAccuracyImprovement(performance) {
    // Implementar cálculo de melhoria
    return performance.previousAccuracy ? 
      performance.accuracy - performance.previousAccuracy : 0
  }

  calculateConfidenceLevel(performance) {
    // Implementar cálculo de nível de confiança
    const factors = [
      performance.accuracy || 0.5,
      performance.consistency || 0.5,
      performance.engagement || 0.5
    ]
    return factors.reduce((a, b) => a + b, 0) / factors.length
  }

  calculateProcessingSpeed(performance) {
    const responseTime = performance.responseTime || 5000
    return responseTime < 2000 ? 'very-fast' : 
           responseTime < 4000 ? 'fast' :
           responseTime < 6000 ? 'moderate' :
           responseTime < 8000 ? 'slow' : 'very-slow'
  }

  suggestSpeedAdaptations(performance) {
    const adaptations = []
    
    if (performance.responseTime > 8000) {
      adaptations.push('extend-time-limits')
      adaptations.push('reduce-time-pressure')
    }
    
    if (performance.responseTime < 2000) {
      adaptations.push('increase-complexity')
      adaptations.push('add-time-challenges')
    }
    
    return adaptations
  }

  calculatePerformanceVariability(performance) {
    // Implementar cálculo de variabilidade
    return performance.responses ? 
      this.calculateStandardDeviation(performance.responses) : 0
  }

  identifyPerformancePatterns(performance) {
    const patterns = []
    
    if (performance.timePatterns) {
      patterns.push('time-of-day-effect')
    }
    
    if (performance.difficultyPatterns) {
      patterns.push('difficulty-dependent')
    }
    
    return patterns
  }

  calculateAttentionMetrics(performance) {
    return {
      span: performance.attentionSpan || 'moderate',
      focus: performance.focusLevel || 0.5,
      distractibility: performance.distractibility || 0.3
    }
  }

  calculateMotivationLevel(performance) {
    const factors = [
      performance.engagement || 0.5,
      performance.persistence || 0.5,
      1 - (performance.frustrationLevel || 0.3)
    ]
    return factors.reduce((a, b) => a + b, 0) / factors.length
  }

  calculateFatigueLevel(performance) {
    const timeSpent = performance.timeSpent || 0
    const engagement = performance.engagement || 0.5
    
    // Fadiga aumenta com tempo e diminui com engajamento
    return Math.min(1, (timeSpent / 600000) * (1 - engagement))
  }

  identifyMilestonesReached(performance) {
    const milestones = []
    
    if (performance.accuracy > 0.9) milestones.push('high-accuracy')
    if (performance.consistency > 0.8) milestones.push('consistent-performance')
    if (performance.completed) milestones.push('task-completion')
    
    return milestones
  }

  analyzeSkillDevelopment(performance) {
    return {
      cognitive: performance.cognitiveSkills || 'developing',
      motor: performance.motorSkills || 'developing',
      social: performance.socialSkills || 'developing',
      communication: performance.communicationSkills || 'developing'
    }
  }

  analyzeTherapeuticProgress(performance) {
    return {
      goals: this.assessGoalProgress(performance),
      interventions: this.evaluateInterventions(performance),
      outcomes: this.measureOutcomes(performance)
    }
  }

  // Métodos de análise por domínio

  analyzeCognitiveAspects(performance, indicators) {
    return {
      workingMemory: indicators.memoryLoad || 'moderate',
      attention: indicators.attentionLevel || 'moderate',
      processing: indicators.processingSpeed || 'moderate',
      executive: indicators.executiveFunction || 'moderate'
    }
  }

  analyzeSensoryAspects(performance, indicators) {
    return {
      visual: indicators.visualProcessing || 'typical',
      auditory: indicators.auditoryProcessing || 'typical',
      tactile: indicators.tactileProcessing || 'typical',
      integration: indicators.sensoryIntegration || 'typical'
    }
  }

  analyzeSocialAspects(performance, indicators) {
    return {
      interaction: indicators.socialInteraction || 'appropriate',
      communication: indicators.socialCommunication || 'appropriate',
      awareness: indicators.socialAwareness || 'appropriate'
    }
  }

  analyzeBehavioralAspects(performance, indicators) {
    return {
      regulation: indicators.behavioralRegulation || 'stable',
      adaptation: indicators.behavioralAdaptation || 'flexible',
      responses: indicators.behavioralResponses || 'appropriate'
    }
  }

  analyzeCommunicationAspects(performance, indicators) {
    return {
      verbal: indicators.verbalCommunication || 'developing',
      nonverbal: indicators.nonverbalCommunication || 'developing',
      receptive: indicators.receptiveCommunication || 'developing',
      expressive: indicators.expressiveCommunication || 'developing'
    }
  }

  analyzeExecutiveAspects(performance, indicators) {
    return {
      planning: indicators.planning || 'developing',
      organization: indicators.organization || 'developing',
      flexibility: indicators.cognitiveFlexibility || 'developing',
      inhibition: indicators.inhibitoryControl || 'developing'
    }
  }

  calculateDifficultyAdjustment(performance) {
    if (performance.accuracy > 0.9 && performance.timeSpent < 300000) {
      return 'increase'
    } else if (performance.accuracy < 0.4 || performance.frustrationLevel > 0.7) {
      return 'decrease'
    }
    return 'maintain'
  }

  calculateTimingAdjustments(performance) {
    return {
      processingTime: performance.accuracy < 0.5 ? 1.5 : 1.0,
      responseWindow: performance.responseTime > 8000 ? 1.3 : 1.0,
      transitionTime: performance.attention === 'brief' ? 2.0 : 1.0
    }
  }

  calculateSupportAdjustments(performance) {
    return {
      visual: performance.visualProcessingDifficulties ? 'increase' : 'maintain',
      cognitive: performance.cognitiveLoad > 0.8 ? 'increase' : 'maintain',
      behavioral: performance.behavioralChallenges ? 'increase' : 'maintain',
      communication: performance.communicationDifficulties ? 'increase' : 'maintain'
    }
  }

  calculateSensoryAdjustments(indicators) {
    return {
      visual: indicators.visualOverload ? 0.7 : 1.0,
      auditory: indicators.sensoryOverload ? 0.5 : 1.0,
      tactile: indicators.tactileAvoidance ? 0.3 : 1.0
    }
  }

  // Métodos estatísticos

  calculateStandardDeviation(values) {
    if (!values || values.length === 0) return 0
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  assessGoalProgress(performance) {
    // Implementar avaliação de progresso de metas
    return {
      cognitive: performance.cognitiveGoals || 'in-progress',
      behavioral: performance.behavioralGoals || 'in-progress',
      social: performance.socialGoals || 'in-progress'
    }
  }

  evaluateInterventions(performance) {
    // Implementar avaliação de intervenções
    return {
      effectiveness: performance.interventionEffectiveness || 'moderate',
      adherence: performance.interventionAdherence || 'good',
      modifications: performance.interventionModifications || []
    }
  }

  measureOutcomes(performance) {
    // Implementar medição de resultados
    return {
      shortTerm: performance.shortTermOutcomes || 'positive',
      mediumTerm: performance.mediumTermOutcomes || 'developing',
      longTerm: performance.longTermOutcomes || 'monitoring'
    }
  }
}

export default SessionAnalyzer
