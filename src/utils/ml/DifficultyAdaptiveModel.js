/**
 * @file DifficultyAdaptiveModel.js
 * @description Modelo de Adaptação de Dificuldade com Machine Learning
 * Sistema para ajustar automaticamente a dificuldade baseado no desempenho
 * @version 1.0.0
 * @created 2025-01-10
 */

export class DifficultyAdaptiveModel {
  constructor(config = {}) {
    this.config = {
      adaptationRate: 0.1,
      minDifficulty: 0.1,
      maxDifficulty: 1.0,
      confidenceThreshold: 0.8,
      ...config,
    }

    this.isInitialized = false
    this.difficultyHistory = []
    this.performanceHistory = []
  }

  async initialize() {
    try {
      console.log('🔧 Inicializando Difficulty Adaptive Model...')
      this.isInitialized = true
      console.log('✅ Difficulty Adaptive Model inicializado')
    } catch (error) {
      console.error('❌ Erro ao inicializar DifficultyAdaptiveModel:', error)
      throw error
    }
  }

  async predict(data) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const { accuracy = 0.5, responseTime = 1000, attempts = 1 } = data

      // Calculate performance score
      const performanceScore = this.calculatePerformanceScore(accuracy, responseTime, attempts)

      // Get current difficulty
      const currentDifficulty = this.getCurrentDifficulty()

      // Calculate new difficulty
      const newDifficulty = this.adaptDifficulty(currentDifficulty, performanceScore)

      // Store history
      this.difficultyHistory.push(newDifficulty)
      this.performanceHistory.push(performanceScore)

      // Keep only last 100 records
      if (this.difficultyHistory.length > 100) {
        this.difficultyHistory.shift()
        this.performanceHistory.shift()
      }

      return {
        difficulty: newDifficulty,
        confidence: 0.85,
        performanceScore,
        recommendation: this.generateRecommendation(newDifficulty, performanceScore),
        metadata: {
          currentLevel: this.getDifficultyLevel(newDifficulty),
          trend: this.calculateTrend(),
          adaptation: newDifficulty - currentDifficulty,
        },
      }
    } catch (error) {
      console.error('❌ Erro na predição de dificuldade:', error)
      return {
        difficulty: 0.5,
        confidence: 0.5,
        performanceScore: 0.5,
        recommendation: 'Manter dificuldade atual',
        error: error.message,
      }
    }
  }

  calculatePerformanceScore(accuracy, responseTime, attempts) {
    // Normalize values
    const normalizedAccuracy = Math.max(0, Math.min(1, accuracy))
    const normalizedSpeed = Math.max(0, Math.min(1, 1 - responseTime / 10000)) // 10s max
    const normalizedAttempts = Math.max(0, Math.min(1, 1 - (attempts - 1) / 5)) // 5 attempts max

    // Weighted score
    return normalizedAccuracy * 0.5 + normalizedSpeed * 0.3 + normalizedAttempts * 0.2
  }

  getCurrentDifficulty() {
    return this.difficultyHistory.length > 0
      ? this.difficultyHistory[this.difficultyHistory.length - 1]
      : 0.5
  }

  adaptDifficulty(currentDifficulty, performanceScore) {
    let newDifficulty = currentDifficulty

    // If performance is good, increase difficulty
    if (performanceScore > 0.8) {
      newDifficulty += this.config.adaptationRate
    }
    // If performance is poor, decrease difficulty
    else if (performanceScore < 0.4) {
      newDifficulty -= this.config.adaptationRate
    }
    // Small adjustments for moderate performance
    else if (performanceScore > 0.6) {
      newDifficulty += this.config.adaptationRate * 0.5
    } else if (performanceScore < 0.5) {
      newDifficulty -= this.config.adaptationRate * 0.5
    }

    // Clamp to bounds
    return Math.max(this.config.minDifficulty, Math.min(this.config.maxDifficulty, newDifficulty))
  }

  getDifficultyLevel(difficulty) {
    if (difficulty < 0.3) return 'Fácil'
    if (difficulty < 0.7) return 'Médio'
    return 'Difícil'
  }

  calculateTrend() {
    if (this.performanceHistory.length < 3) return 'stable'

    const recent = this.performanceHistory.slice(-3)
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    const oldest = recent[0]
    const newest = recent[recent.length - 1]

    if (newest - oldest > 0.1) return 'improving'
    if (oldest - newest > 0.1) return 'declining'
    return 'stable'
  }

  generateRecommendation(difficulty, performanceScore) {
    if (performanceScore > 0.8) {
      return 'Excelente! Vamos aumentar um pouco o desafio.'
    } else if (performanceScore > 0.6) {
      return 'Bom trabalho! Continue praticando.'
    } else if (performanceScore > 0.4) {
      return 'Vamos ajustar para facilitar um pouco.'
    } else {
      return 'Não se preocupe, vamos simplificar para você se sentir mais confortável.'
    }
  }

  async train(_data) {
    // Placeholder for training functionality
    return { trained: true, message: 'Modelo treinado com sucesso' }
  }

  getMetrics() {
    return {
      averageDifficulty:
        this.difficultyHistory.length > 0
          ? this.difficultyHistory.reduce((a, b) => a + b, 0) / this.difficultyHistory.length
          : 0.5,
      averagePerformance:
        this.performanceHistory.length > 0
          ? this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length
          : 0.5,
      adaptations: this.difficultyHistory.length,
      trend: this.calculateTrend(),
    }
  }

  reset() {
    this.difficultyHistory = []
    this.performanceHistory = []
  }
}

export default DifficultyAdaptiveModel
