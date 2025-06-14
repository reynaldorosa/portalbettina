/**
 * @file AnxietyDetector.js
 * @description Algoritmo de detecção de ansiedade
 */

export class AnxietyDetector {
  constructor(config = {}) {
    this.config = {
      sensitivityLevel: config.sensitivityLevel || 'medium',
      ...config,
    }
    this.isInitialized = false
  }

  async initialize() {
    this.isInitialized = true
    console.log('😰 AnxietyDetector inicializado')
  }

  async execute(userProfile, sessionData) {
    const anxietyIndicators = this.analyzeAnxietyIndicators(sessionData)
    const physiologicalSigns = this.analyzePhysiologicalSigns(sessionData)

    return {
      algorithm: 'AnxietyDetector',
      timestamp: new Date(),
      score: 1 - anxietyIndicators.anxietyLevel,
      confidence: 0.75,
      anxietyLevel: anxietyIndicators.anxietyLevel,
      indicators: anxietyIndicators,
      physiologicalSigns,
      insights: this.generateInsights(anxietyIndicators),
      recommendations: this.generateRecommendations(anxietyIndicators),
    }
  }

  async analyzeRealtime(interactionData) {
    const rapidActions = interactionData.actionsPerSecond > 3
    const hesitation = interactionData.pauseDuration > 3000
    const anxietyLevel = (rapidActions + hesitation) / 2

    return {
      anxietyLevel,
      immediateIntervention: anxietyLevel > 0.8,
    }
  }

  analyzeAnxietyIndicators(sessionData) {
    const hesitationTime = sessionData.hesitationTime || 0
    const errorRate = sessionData.errors?.length || 0
    const helpRequests = sessionData.helpRequests?.length || 0

    const anxietyLevel = Math.min(hesitationTime / 5000 + errorRate * 0.1 + helpRequests * 0.2, 1)

    return {
      anxietyLevel,
      hesitationTime,
      errorRate,
      helpRequests,
      avoidanceBehavior: sessionData.taskSkips || 0,
    }
  }

  analyzePhysiologicalSigns(sessionData) {
    return {
      rapidInteractions: sessionData.rapidInteractions || false,
      longPauses: sessionData.longPauses || false,
      irregularPattern: sessionData.irregularPattern || false,
    }
  }

  generateInsights(indicators) {
    const insights = []
    if (indicators.anxietyLevel > 0.6) {
      insights.push({
        type: 'warning',
        message: 'Sinais de ansiedade detectados - considerar suporte adicional',
        confidence: 0.8,
      })
    }
    return insights
  }

  generateRecommendations(indicators) {
    const recommendations = []
    if (indicators.anxietyLevel > 0.5) {
      recommendations.push({
        type: 'calming',
        action: 'breathing_exercise',
        description: 'Sugerir exercício de respiração para reduzir ansiedade',
      })
    }
    return recommendations
  }

  updateProfile(newProfile) {
    this.config = { ...this.config, ...newProfile }
  }
}

export default AnxietyDetector
