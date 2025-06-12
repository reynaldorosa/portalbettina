/**
 * @file BehaviorAnalysisModel.js
 * @description Modelo de análise comportamental para identificação de padrões
 */

export class BehaviorAnalysisModel {
  constructor() {
    this.patterns = {
      interactionFrequency: [],
      responseLatency: [],
      errorPatterns: [],
      preferenceShifts: [],
      emotionalStates: [],
    }

    this.behaviorProfile = {
      dominant: null,
      secondary: null,
      adaptability: 0.5,
      consistency: 0.5,
      progression: 0.5,
    }

    this.isInitialized = false
    this.analysisHistory = []
  }

  /**
   * Inicializa o modelo
   */
  async initialize() {
    try {
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao inicializar BehaviorAnalysisModel:', error)
      return false
    }
  }

  /**
   * Analisa padrões comportamentais
   * @param {Object} behaviorData - Dados comportamentais
   */
  analyze(behaviorData) {
    if (!this.isInitialized) {
      this.initialize()
    }

    try {
      const analysis = {
        timestamp: Date.now(),
        patterns: this.identifyPatterns(behaviorData),
        anomalies: this.detectAnomalies(behaviorData),
        trends: this.analyzeTrends(behaviorData),
        recommendations: [],
      }

      // Registra a análise
      this.analysisHistory.push(analysis)

      // Mantém apenas os últimos 100 registros
      if (this.analysisHistory.length > 100) {
        this.analysisHistory.shift()
      }

      // Atualiza perfil comportamental
      this.updateBehaviorProfile(analysis)

      // Gera recomendações
      analysis.recommendations = this.generateRecommendations(analysis)

      return analysis
    } catch (error) {
      console.error('Erro na análise comportamental:', error)
      return null
    }
  }

  /**
   * Identifica padrões comportamentais
   * @param {Object} data - Dados comportamentais
   */
  identifyPatterns(data) {
    const patterns = {
      consistency: this.calculateConsistency(data),
      adaptation: this.calculateAdaptation(data),
      engagement: this.calculateEngagement(data),
      performance: this.calculatePerformance(data),
    }

    return patterns
  }

  /**
   * Detecta anomalias comportamentais
   * @param {Object} data - Dados comportamentais
   */
  detectAnomalies(data) {
    const anomalies = []

    // Detecta mudanças súbitas na performance
    if (data.performance?.current < data.performance?.average * 0.7) {
      anomalies.push({
        type: 'performance_drop',
        severity: 'medium',
        description: 'Queda súbita na performance',
      })
    }

    // Detecta mudanças no tempo de resposta
    if (data.responseTime?.current > data.responseTime?.average * 1.5) {
      anomalies.push({
        type: 'response_delay',
        severity: 'low',
        description: 'Aumento no tempo de resposta',
      })
    }

    // Detecta padrões de erro incomuns
    if (data.errors?.frequency > data.errors?.baseline * 2) {
      anomalies.push({
        type: 'error_spike',
        severity: 'high',
        description: 'Aumento significativo de erros',
      })
    }

    return anomalies
  }

  /**
   * Analisa tendências comportamentais
   * @param {Object} data - Dados comportamentais
   */
  analyzeTrends(data) {
    if (this.analysisHistory.length < 5) {
      return { insufficient_data: true }
    }

    const recent = this.analysisHistory.slice(-5)

    return {
      performance: this.calculateTrend(recent, 'performance'),
      engagement: this.calculateTrend(recent, 'engagement'),
      consistency: this.calculateTrend(recent, 'consistency'),
      adaptation: this.calculateTrend(recent, 'adaptation'),
    }
  }

  /**
   * Calcula tendência para uma métrica específica
   * @param {Array} data - Dados históricos
   * @param {string} metric - Métrica a analisar
   */
  calculateTrend(data, metric) {
    const values = data.map((item) => item.patterns?.[metric] || 0)

    if (values.length < 2) return 0

    let sum = 0
    for (let i = 1; i < values.length; i++) {
      sum += values[i] - values[i - 1]
    }

    return sum / (values.length - 1)
  }

  /**
   * Calcula consistência comportamental
   * @param {Object} data - Dados comportamentais
   */
  calculateConsistency(data) {
    if (!data.sessions || data.sessions.length < 2) return 0.5

    const performances = data.sessions.map((s) => s.performance || 0)
    const mean = performances.reduce((a, b) => a + b, 0) / performances.length
    const variance =
      performances.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / performances.length

    // Consistência maior = menor variância
    return Math.max(0, 1 - variance / mean)
  }

  /**
   * Calcula capacidade de adaptação
   * @param {Object} data - Dados comportamentais
   */
  calculateAdaptation(data) {
    if (!data.adaptationEvents) return 0.5

    const successRate = data.adaptationEvents.successful / data.adaptationEvents.total
    const responseTime = Math.max(0, 1 - data.adaptationEvents.averageTime / 10000) // 10s max

    return (successRate + responseTime) / 2
  }

  /**
   * Calcula nível de engajamento
   * @param {Object} data - Dados comportamentais
   */
  calculateEngagement(data) {
    const factors = []

    if (data.sessionDuration) {
      factors.push(Math.min(data.sessionDuration / 1800000, 1)) // 30 min max
    }

    if (data.interactionRate) {
      factors.push(Math.min(data.interactionRate / 100, 1)) // 100 interactions max
    }

    if (data.completionRate) {
      factors.push(data.completionRate)
    }

    return factors.length > 0 ? factors.reduce((a, b) => a + b) / factors.length : 0.5
  }

  /**
   * Calcula performance geral
   * @param {Object} data - Dados comportamentais
   */
  calculatePerformance(data) {
    const factors = []

    if (data.accuracy !== undefined) {
      factors.push(data.accuracy)
    }

    if (data.speed !== undefined) {
      factors.push(1 - Math.min(data.speed / 10000, 1)) // Menor tempo = melhor
    }

    if (data.completionRate !== undefined) {
      factors.push(data.completionRate)
    }

    return factors.length > 0 ? factors.reduce((a, b) => a + b) / factors.length : 0.5
  }

  /**
   * Atualiza perfil comportamental
   * @param {Object} analysis - Análise atual
   */
  updateBehaviorProfile(analysis) {
    const patterns = analysis.patterns

    // Identifica padrão dominante
    const patternScores = Object.entries(patterns)
    patternScores.sort((a, b) => b[1] - a[1])

    this.behaviorProfile.dominant = patternScores[0]?.[0]
    this.behaviorProfile.secondary = patternScores[1]?.[0]

    // Atualiza métricas gerais
    this.behaviorProfile.adaptability = this.smoothUpdate(
      this.behaviorProfile.adaptability,
      patterns.adaptation || 0.5,
      0.1
    )

    this.behaviorProfile.consistency = this.smoothUpdate(
      this.behaviorProfile.consistency,
      patterns.consistency || 0.5,
      0.1
    )

    this.behaviorProfile.progression = this.calculateProgression()
  }

  /**
   * Atualização suave de valores
   * @param {number} current - Valor atual
   * @param {number} new_value - Novo valor
   * @param {number} alpha - Taxa de aprendizado
   */
  smoothUpdate(current, new_value, alpha = 0.1) {
    return current * (1 - alpha) + new_value * alpha
  }

  /**
   * Calcula progressão geral
   */
  calculateProgression() {
    if (this.analysisHistory.length < 10) return 0.5

    const recent = this.analysisHistory.slice(-10)
    const older = this.analysisHistory.slice(-20, -10)

    if (older.length === 0) return 0.5

    const recentAvg =
      recent.reduce((sum, item) => {
        return sum + (item.patterns?.performance || 0)
      }, 0) / recent.length

    const olderAvg =
      older.reduce((sum, item) => {
        return sum + (item.patterns?.performance || 0)
      }, 0) / older.length

    return Math.max(0, Math.min(1, 0.5 + (recentAvg - olderAvg)))
  }

  /**
   * Gera recomendações baseadas na análise
   * @param {Object} analysis - Análise comportamental
   */
  generateRecommendations(analysis) {
    const recommendations = []

    // Recomendações baseadas em anomalias
    analysis.anomalies.forEach((anomaly) => {
      switch (anomaly.type) {
        case 'performance_drop':
          recommendations.push({
            type: 'intervention',
            priority: 'high',
            message: 'Considere reduzir a dificuldade temporariamente',
            action: 'adjust_difficulty',
          })
          break
        case 'response_delay':
          recommendations.push({
            type: 'support',
            priority: 'medium',
            message: 'Ofereça dicas adicionais ou pause',
            action: 'provide_hints',
          })
          break
        case 'error_spike':
          recommendations.push({
            type: 'review',
            priority: 'high',
            message: 'Revisar conceitos fundamentais',
            action: 'concept_review',
          })
          break
      }
    })

    // Recomendações baseadas no padrão dominante
    switch (this.behaviorProfile.dominant) {
      case 'consistency':
        recommendations.push({
          type: 'progression',
          priority: 'medium',
          message: 'Usuário demonstra consistência, pode avançar gradualmente',
          action: 'gradual_progression',
        })
        break
      case 'adaptation':
        recommendations.push({
          type: 'challenge',
          priority: 'medium',
          message: 'Usuário se adapta bem, pode receber desafios variados',
          action: 'varied_challenges',
        })
        break
      case 'engagement':
        recommendations.push({
          type: 'content',
          priority: 'low',
          message: 'Manter conteúdo atual, usuário está engajado',
          action: 'maintain_content',
        })
        break
    }

    return recommendations
  }

  /**
   * Obtém estatísticas do modelo
   */
  getStatistics() {
    return {
      totalAnalyses: this.analysisHistory.length,
      behaviorProfile: this.behaviorProfile,
      patterns: this.patterns,
      averagePerformance:
        this.analysisHistory.length > 0
          ? this.analysisHistory.reduce((sum, item) => sum + (item.patterns?.performance || 0), 0) /
            this.analysisHistory.length
          : 0,
      isInitialized: this.isInitialized,
    }
  }

  /**
   * Exporta dados do modelo
   */
  export() {
    return {
      patterns: this.patterns,
      behaviorProfile: this.behaviorProfile,
      analysisHistory: this.analysisHistory.slice(-50), // Últimas 50 análises
      timestamp: Date.now(),
    }
  }

  /**
   * Importa dados do modelo
   * @param {Object} modelData - Dados do modelo
   */
  import(modelData) {
    try {
      this.patterns = modelData.patterns || this.patterns
      this.behaviorProfile = modelData.behaviorProfile || this.behaviorProfile
      this.analysisHistory = modelData.analysisHistory || []
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao importar BehaviorAnalysisModel:', error)
      return false
    }
  }
}

export default BehaviorAnalysisModel
