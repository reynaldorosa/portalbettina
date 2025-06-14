/**
 * @file EmotionalStateModel.js
 * @description Modelo de análise de estado emocional
 */

export class EmotionalStateModel {
  constructor() {
    this.emotionalStates = {
      valence: 0.5, // Positivo/Negativo
      arousal: 0.5, // Ativação/Calma
      dominance: 0.5, // Controle/Submissão
      engagement: 0.5, // Engajamento
      frustration: 0.0, // Frustração
      confidence: 0.5, // Confiança
      anxiety: 0.0, // Ansiedade
      joy: 0.5, // Alegria
      focus: 0.5, // Foco
    }

    this.history = []
    this.patterns = new Map()
    this.triggers = new Map()
    this.isInitialized = false
  }

  async initialize() {
    this.isInitialized = true
    return true
  }

  analyzeEmotionalState(behaviorData) {
    if (!this.isInitialized) {
      this.initialize()
    }

    const analysis = {
      timestamp: Date.now(),
      currentState: this.calculateCurrentState(behaviorData),
      stateChange: this.detectStateChange(behaviorData),
      triggers: this.identifyTriggers(behaviorData),
      recommendations: [],
    }

    this.updateEmotionalStates(analysis.currentState)
    this.history.push(analysis)

    // Manter apenas últimos 100 registros
    if (this.history.length > 100) {
      this.history.shift()
    }

    analysis.recommendations = this.generateEmotionalRecommendations(analysis)
    return analysis
  }

  calculateCurrentState(data) {
    const state = { ...this.emotionalStates }

    // Análise baseada em performance
    if (data.performance) {
      if (data.performance > 0.8) {
        state.confidence = Math.min(state.confidence + 0.1, 1.0)
        state.joy = Math.min(state.joy + 0.1, 1.0)
        state.valence = Math.min(state.valence + 0.1, 1.0)
      } else if (data.performance < 0.3) {
        state.frustration = Math.min(state.frustration + 0.2, 1.0)
        state.confidence = Math.max(state.confidence - 0.1, 0.0)
        state.valence = Math.max(state.valence - 0.1, 0.0)
      }
    }

    // Análise baseada em tempo de resposta
    if (data.responseTime) {
      if (data.responseTime > 5000) {
        state.anxiety = Math.min(state.anxiety + 0.1, 1.0)
        state.arousal = Math.max(state.arousal - 0.1, 0.0)
      }
    }

    // Análise baseada em erros
    if (data.errorRate) {
      if (data.errorRate > 0.5) {
        state.frustration = Math.min(state.frustration + 0.15, 1.0)
        state.focus = Math.max(state.focus - 0.1, 0.0)
      }
    }

    // Análise baseada em engajamento
    if (data.engagement) {
      state.engagement = data.engagement
      state.focus = data.engagement
    }

    return state
  }

  detectStateChange(data) {
    if (this.history.length < 2) {
      return { hasChange: false }
    }

    const previous = this.history[this.history.length - 1].currentState
    const current = this.calculateCurrentState(data)

    const changes = {}
    let significantChange = false

    Object.keys(current).forEach((key) => {
      const change = current[key] - previous[key]
      if (Math.abs(change) > 0.15) {
        changes[key] = change
        significantChange = true
      }
    })

    return {
      hasChange: significantChange,
      changes,
      magnitude: significantChange ? Math.max(...Object.values(changes).map(Math.abs)) : 0,
    }
  }

  identifyTriggers(data) {
    const triggers = []

    if (data.taskType && data.performance < 0.4) {
      triggers.push({
        type: 'task_difficulty',
        task: data.taskType,
        impact: 'negative',
        strength: 0.7,
      })
    }

    if (data.sessionDuration > 1800000) {
      // 30 min
      triggers.push({
        type: 'fatigue',
        duration: data.sessionDuration,
        impact: 'negative',
        strength: 0.5,
      })
    }

    if (data.consecutiveErrors > 3) {
      triggers.push({
        type: 'error_cascade',
        count: data.consecutiveErrors,
        impact: 'negative',
        strength: 0.8,
      })
    }

    return triggers
  }

  updateEmotionalStates(newState) {
    const alpha = 0.1 // Taxa de aprendizado

    Object.keys(this.emotionalStates).forEach((key) => {
      if (newState[key] !== undefined) {
        this.emotionalStates[key] = this.emotionalStates[key] * (1 - alpha) + newState[key] * alpha
      }
    })
  }

  generateEmotionalRecommendations(analysis) {
    const recommendations = []

    // Recomendações baseadas em frustração alta
    if (analysis.currentState.frustration > 0.7) {
      recommendations.push({
        type: 'intervention',
        priority: 'high',
        message: 'Nível de frustração elevado - considere pausa ou redução de dificuldade',
        action: 'reduce_difficulty',
      })
    }

    // Recomendações baseadas em ansiedade
    if (analysis.currentState.anxiety > 0.6) {
      recommendations.push({
        type: 'support',
        priority: 'medium',
        message: 'Ansiedade detectada - oferecer suporte e encorajamento',
        action: 'provide_encouragement',
      })
    }

    // Recomendações baseadas em baixo engajamento
    if (analysis.currentState.engagement < 0.4) {
      recommendations.push({
        type: 'motivation',
        priority: 'medium',
        message: 'Baixo engajamento - variar atividades ou adicionar elementos motivacionais',
        action: 'increase_variety',
      })
    }

    // Recomendações para estado positivo
    if (analysis.currentState.joy > 0.8 && analysis.currentState.confidence > 0.7) {
      recommendations.push({
        type: 'progression',
        priority: 'low',
        message: 'Estado emocional positivo - momento ideal para progressão',
        action: 'advance_level',
      })
    }

    return recommendations
  }

  getEmotionalProfile() {
    return {
      currentStates: this.emotionalStates,
      dominantEmotion: this.getDominantEmotion(),
      stability: this.calculateEmotionalStability(),
      trends: this.calculateTrends(),
      riskFactors: this.identifyRiskFactors(),
    }
  }

  getDominantEmotion() {
    const emotions = Object.entries(this.emotionalStates)
    emotions.sort((a, b) => b[1] - a[1])
    return emotions[0][0]
  }

  calculateEmotionalStability() {
    if (this.history.length < 5) return 0.5

    const recent = this.history.slice(-5)
    const variance = this.calculateVariance(recent.map((h) => h.currentState.valence))

    return Math.max(0, 1 - variance)
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    return variance
  }

  calculateTrends() {
    if (this.history.length < 10) return {}

    const recent = this.history.slice(-10)
    const trends = {}

    Object.keys(this.emotionalStates).forEach((emotion) => {
      const values = recent.map((h) => h.currentState[emotion])
      trends[emotion] = this.calculateTrendSlope(values)
    })

    return trends
  }

  calculateTrendSlope(values) {
    const n = values.length
    const x = Array.from({ length: n }, (_, i) => i)
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = values.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  }

  identifyRiskFactors() {
    const risks = []

    if (this.emotionalStates.frustration > 0.7) {
      risks.push({
        type: 'high_frustration',
        level: 'high',
        description: 'Nível de frustração crítico',
      })
    }

    if (this.emotionalStates.anxiety > 0.6) {
      risks.push({
        type: 'anxiety',
        level: 'medium',
        description: 'Ansiedade elevada',
      })
    }

    if (this.emotionalStates.engagement < 0.3) {
      risks.push({
        type: 'disengagement',
        level: 'medium',
        description: 'Baixo engajamento',
      })
    }

    return risks
  }

  export() {
    return {
      emotionalStates: this.emotionalStates,
      history: this.history.slice(-20),
      patterns: Object.fromEntries(this.patterns),
      triggers: Object.fromEntries(this.triggers),
      timestamp: Date.now(),
    }
  }

  import(modelData) {
    try {
      this.emotionalStates = modelData.emotionalStates || this.emotionalStates
      this.history = modelData.history || []
      this.patterns = new Map(Object.entries(modelData.patterns || {}))
      this.triggers = new Map(Object.entries(modelData.triggers || {}))
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao importar EmotionalStateModel:', error)
      return false
    }
  }
}

export default EmotionalStateModel
