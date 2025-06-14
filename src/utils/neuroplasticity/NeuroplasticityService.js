/**
 * @file NeuroplasticityService.js
 * @description Serviço principal de análise de neuroplasticidade
 * Sistema integrado de 6 algoritmos para análise de neuroplasticidade
 * @version 1.0.0
 * @created 2025-01-11
 */

import { CognitiveImprovementTracker } from './algorithms/CognitiveImprovementTracker.js'
import { OpportunityWindowIdentifier } from './algorithms/OpportunityWindowIdentifier.js'
import { MemoryConsolidationSystem } from './algorithms/MemoryConsolidationSystem.js'
import { CognitiveBreakthroughDetector } from './algorithms/CognitiveBreakthroughDetector.js'
import { CognitiveRecovery } from './algorithms/CognitiveRecovery.js'
import { LearningTransferSystem } from './algorithms/LearningTransferSystem.js'

export default class NeuroplasticityService {
  constructor(databaseService, userProfile = {}) {
    this.db = databaseService
    this.userProfile = userProfile
    this.isInitialized = false

    // Inicializar algoritmos especializados
    this.algorithms = {
      improvementTracker: new CognitiveImprovementTracker({
        baselineCognitive: userProfile.baselineCognitive || {},
      }),
      opportunityWindow: new OpportunityWindowIdentifier({
        learningOptimization: userProfile.learningOptimization || 'adaptive',
      }),
      memoryConsolidation: new MemoryConsolidationSystem({
        memoryCapacity: userProfile.memoryCapacity || 0.6,
      }),
      breakthroughDetector: new CognitiveBreakthroughDetector({
        breakthroughThreshold: userProfile.breakthroughThreshold || 0.85,
      }),
      cognitiveRecovery: new CognitiveRecovery({
        recoveryRate: userProfile.recoveryRate || 0.5,
      }),
      learningTransfer: new LearningTransferSystem({
        transferCapacity: userProfile.transferCapacity || 0.5,
      }),
    }

    this.analysisHistory = []
    this.neuroplasticityMetrics = new Map()
    this.optimizationQueue = []
  }

  /**
   * Inicializa o serviço de neuroplasticidade
   */
  async initialize() {
    try {
      // Inicializar todos os algoritmos
      for (const [name, algorithm] of Object.entries(this.algorithms)) {
        await algorithm.initialize()
        console.log(`✅ ${name} inicializado`)
      }

      this.isInitialized = true
      console.log('🧠 NeuroplasticityService inicializado com sucesso')
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar NeuroplasticityService:', error)
      return false
    }
  }

  /**
   * Analisa uma sessão completa
   * @param {Object} sessionData - Dados da sessão
   */
  async analyzeSession(sessionData) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const results = {
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        timestamp: new Date(),
        algorithms: {},
      }

      // Executar todos os algoritmos
      for (const [name, algorithm] of Object.entries(this.algorithms)) {
        results.algorithms[name] = await algorithm.execute(this.userProfile, sessionData)
      }

      // Gerar análise integrada
      results.integratedAnalysis = this.generateIntegratedAnalysis(results.algorithms)

      // Gerar recomendações de otimização
      results.optimizations = this.generateOptimizations(results.integratedAnalysis)

      // Armazenar resultados
      await this.storeResults(results)

      // Adicionar ao histórico
      this.analysisHistory.push(results)

      return results
    } catch (error) {
      console.error('❌ Erro na análise de neuroplasticidade:', error)
      throw error
    }
  }

  /**
   * Gera análise integrada combinando todos os algoritmos
   * @param {Object} algorithmResults - Resultados de todos os algoritmos
   */
  generateIntegratedAnalysis(algorithmResults) {
    const weights = {
      improvementTracker: 0.25,
      opportunityWindow: 0.2,
      memoryConsolidation: 0.15,
      breakthroughDetector: 0.15,
      cognitiveRecovery: 0.15,
      learningTransfer: 0.1,
    }

    let overallNeuroplasticity = 0
    let confidenceScore = 0
    const insights = []

    // Combinar resultados ponderados
    for (const [algorithm, result] of Object.entries(algorithmResults)) {
      if (weights[algorithm] && result.score !== undefined) {
        overallNeuroplasticity += result.score * weights[algorithm]
        confidenceScore += (result.confidence || 0.5) * weights[algorithm]
      }

      if (result.insights) {
        insights.push(...result.insights)
      }
    }

    return {
      overallNeuroplasticity: Math.round(overallNeuroplasticity * 100) / 100,
      confidenceScore: Math.round(confidenceScore * 100) / 100,
      cognitiveGrowth: this.calculateCognitiveGrowth(algorithmResults),
      learningEfficiency: this.calculateLearningEfficiency(algorithmResults),
      adaptabilityScore: this.calculateAdaptabilityScore(algorithmResults),
      insights: insights,
      timestamp: new Date(),
    }
  }

  /**
   * Gera otimizações baseadas na análise
   * @param {Object} integratedAnalysis - Análise integrada
   */
  generateOptimizations(integratedAnalysis) {
    const optimizations = []

    // Otimizações baseadas no nível de neuroplasticidade
    if (integratedAnalysis.overallNeuroplasticity > 0.7) {
      optimizations.push({
        type: 'enhancement',
        priority: 'high',
        action: 'increase_complexity',
        description: 'Alto potencial neuroplástico - aumentar complexidade das tarefas',
      })
    }

    if (integratedAnalysis.learningEfficiency < 0.4) {
      optimizations.push({
        type: 'efficiency',
        priority: 'medium',
        action: 'optimize_learning_path',
        description: 'Otimizar caminho de aprendizagem para melhor eficiência',
      })
    }

    return optimizations
  }

  /**
   * Calcula crescimento cognitivo
   */
  calculateCognitiveGrowth(algorithmResults) {
    const improvement = algorithmResults.improvementTracker?.improvementScore || 0
    const breakthroughs = algorithmResults.breakthroughDetector?.breakthroughsDetected || 0

    return Math.min(improvement * 0.7 + breakthroughs * 0.3, 1)
  }

  /**
   * Calcula eficiência de aprendizagem
   */
  calculateLearningEfficiency(algorithmResults) {
    const memoryScore = algorithmResults.memoryConsolidation?.consolidationScore || 0
    const transferScore = algorithmResults.learningTransfer?.transferScore || 0

    return (memoryScore + transferScore) / 2
  }

  /**
   * Calcula score de adaptabilidade
   */
  calculateAdaptabilityScore(algorithmResults) {
    const recoveryScore = algorithmResults.cognitiveRecovery?.recoveryScore || 0
    const opportunityScore = algorithmResults.opportunityWindow?.opportunityScore || 0

    return (recoveryScore + opportunityScore) / 2
  }

  /**
   * Armazena resultados no banco de dados
   */
  async storeResults(results) {
    try {
      await this.db.insertData('neuroplasticity_analysis', results)
    } catch (error) {
      console.error('❌ Erro ao armazenar resultados:', error)
    }
  }

  /**
   * Obtém histórico de análises
   * @param {string} userId - ID do usuário
   * @param {number} limit - Limite de resultados
   */
  async getAnalysisHistory(userId, limit = 10) {
    try {
      return await this.db.findData(
        'neuroplasticity_analysis',
        { userId },
        { limit, sort: { timestamp: -1 } }
      )
    } catch (error) {
      console.error('❌ Erro ao obter histórico:', error)
      return []
    }
  }

  /**
   * Atualiza perfil do usuário
   * @param {Object} newProfile - Novo perfil
   */
  updateUserProfile(newProfile) {
    this.userProfile = { ...this.userProfile, ...newProfile }

    // Atualizar configurações dos algoritmos
    for (const algorithm of Object.values(this.algorithms)) {
      if (algorithm.updateProfile) {
        algorithm.updateProfile(this.userProfile)
      }
    }
  }

  /**
   * Obtém métricas de neuroplasticidade
   */
  getNeuroplasticityMetrics() {
    return Array.from(this.neuroplasticityMetrics.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 50) // Últimas 50 métricas
  }

  /**
   * Obtém fila de otimizações
   */
  getOptimizationQueue() {
    return this.optimizationQueue
  }

  /**
   * Limpa otimizações processadas
   */
  clearProcessedOptimizations() {
    this.optimizationQueue = []
  }

  /**
   * Exporta relatório de neuroplasticidade
   */
  async exportNeuroplasticityReport(userId, startDate, endDate) {
    const analysisData = await this.getAnalysisHistory(userId, 1000)

    const filteredData = analysisData.filter((analysis) => {
      const date = new Date(analysis.timestamp)
      return date >= startDate && date <= endDate
    })

    return {
      userId,
      period: { start: startDate, end: endDate },
      totalSessions: filteredData.length,
      averageNeuroplasticity: this.calculateAverageNeuroplasticity(filteredData),
      cognitiveGrowthTrend: this.analyzeCognitiveGrowthTrend(filteredData),
      learningEfficiencyTrend: this.analyzeLearningEfficiencyTrend(filteredData),
      recommendations: this.generatePeriodRecommendations(filteredData),
    }
  }

  calculateAverageNeuroplasticity(analysisData) {
    const sum = analysisData.reduce(
      (acc, analysis) => acc + (analysis.integratedAnalysis?.overallNeuroplasticity || 0),
      0
    )
    return analysisData.length > 0 ? sum / analysisData.length : 0
  }

  analyzeCognitiveGrowthTrend(analysisData) {
    // Implementar análise de tendências de crescimento cognitivo
    if (analysisData.length < 2) return 'insufficient_data'

    const recent = analysisData.slice(0, Math.ceil(analysisData.length / 2))
    const older = analysisData.slice(Math.ceil(analysisData.length / 2))

    const recentAvg =
      recent.reduce((sum, item) => sum + (item.integratedAnalysis?.cognitiveGrowth || 0), 0) /
      recent.length
    const olderAvg =
      older.reduce((sum, item) => sum + (item.integratedAnalysis?.cognitiveGrowth || 0), 0) /
      older.length

    if (recentAvg > olderAvg * 1.1) return 'improving'
    if (recentAvg < olderAvg * 0.9) return 'declining'
    return 'stable'
  }

  analyzeLearningEfficiencyTrend(analysisData) {
    // Implementar análise de tendências de eficiência de aprendizagem
    return 'stable' // Placeholder
  }

  generatePeriodRecommendations(analysisData) {
    // Implementar recomendações baseadas no período
    const recommendations = []

    const avgNeuroplasticity = this.calculateAverageNeuroplasticity(analysisData)

    if (avgNeuroplasticity > 0.7) {
      recommendations.push({
        type: 'enhancement',
        description: 'Aproveitar alto potencial neuroplástico com desafios avançados',
      })
    } else if (avgNeuroplasticity < 0.3) {
      recommendations.push({
        type: 'support',
        description: 'Implementar estratégias de suporte para melhorar neuroplasticidade',
      })
    }

    return recommendations
  }
}

// Exportar classe principal
export { NeuroplasticityService }
