/**
 * @file EmotionalAnalysisService.js
 * @description Serviço principal de análise emocional
 * Sistema integrado de 7 algoritmos emocionais para análise comportamental
 * @version 1.0.0
 * @created 2025-01-11
 */

import { ColorPsychologicalAnalysis } from './algorithms/ColorPsychologicalAnalysis.js'
import { FrustrationDetection } from './algorithms/FrustrationDetection.js'
import { EmotionalEngagementAnalysis } from './algorithms/EmotionalEngagementAnalysis.js'
import { AnxietyDetector } from './algorithms/AnxietyDetector.js'
import { AdaptiveMotivation } from './algorithms/AdaptiveMotivation.js'
import { EmotionalRegulationSystem } from './algorithms/EmotionalRegulationSystem.js'
import { CreativeExpressionAnalysis } from './algorithms/CreativeExpressionAnalysis.js'

export default class EmotionalAnalysisService {
  constructor(databaseService, userProfile = {}) {
    this.db = databaseService
    this.userProfile = userProfile
    this.isInitialized = false

    // Inicializar algoritmos especializados
    this.algorithms = {
      colorAnalysis: new ColorPsychologicalAnalysis({
        personalityType: userProfile.personalityType,
        cognitiveProfile: userProfile.cognitiveProfile,
      }),
      frustrationDetection: new FrustrationDetection({
        errorThreshold: userProfile.errorTolerance || 0.3,
        timeThreshold: userProfile.frustrationTime || 5000,
      }),
      engagementAnalysis: new EmotionalEngagementAnalysis({
        baselineEngagement: userProfile.baselineEngagement || 0.5,
      }),
      anxietyDetector: new AnxietyDetector({
        sensitivityLevel: userProfile.anxietySensitivity || 'medium',
      }),
      adaptiveMotivation: new AdaptiveMotivation({
        motivationStyle: userProfile.motivationStyle || 'balanced',
      }),
      emotionalRegulation: new EmotionalRegulationSystem({
        regulationCapacity: userProfile.emotionalRegulation || 0.6,
      }),
      creativeExpression: new CreativeExpressionAnalysis({
        expressionPreferences: userProfile.creativePreferences || {},
      }),
    }

    this.analysisHistory = []
    this.realtimeMetrics = new Map()
    this.interventionQueue = []
  }

  /**
   * Inicializa o serviço de análise emocional
   */
  async initialize() {
    try {
      // Inicializar todos os algoritmos
      for (const [name, algorithm] of Object.entries(this.algorithms)) {
        await algorithm.initialize()
        console.log(`✅ ${name} inicializado`)
      }

      this.isInitialized = true
      console.log('🧠 EmotionalAnalysisService inicializado com sucesso')
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar EmotionalAnalysisService:', error)
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

      // Gerar recomendações
      results.recommendations = this.generateRecommendations(results.integratedAnalysis)

      // Armazenar resultados
      await this.storeResults(results)

      // Adicionar ao histórico
      this.analysisHistory.push(results)

      return results
    } catch (error) {
      console.error('❌ Erro na análise emocional:', error)
      throw error
    }
  }

  /**
   * Análise em tempo real
   * @param {Object} interactionData - Dados de interação em tempo real
   */
  async analyzeRealtime(interactionData) {
    const realtimeResults = {}

    // Análises prioritárias para tempo real
    const priorityAlgorithms = ['frustrationDetection', 'anxietyDetector', 'engagementAnalysis']

    for (const algorithmName of priorityAlgorithms) {
      if (this.algorithms[algorithmName]) {
        realtimeResults[algorithmName] =
          await this.algorithms[algorithmName].analyzeRealtime(interactionData)
      }
    }

    // Verificar necessidade de intervenções
    const intervention = this.checkInterventionNeeds(realtimeResults)
    if (intervention) {
      this.interventionQueue.push(intervention)
    }

    // Atualizar métricas em tempo real
    this.realtimeMetrics.set(Date.now(), realtimeResults)

    return realtimeResults
  }

  /**
   * Gera análise integrada combinando todos os algoritmos
   * @param {Object} algorithmResults - Resultados de todos os algoritmos
   */
  generateIntegratedAnalysis(algorithmResults) {
    const weights = {
      colorAnalysis: 0.15,
      frustrationDetection: 0.2,
      engagementAnalysis: 0.2,
      anxietyDetector: 0.15,
      adaptiveMotivation: 0.1,
      emotionalRegulation: 0.1,
      creativeExpression: 0.1,
    }

    let overallEmotionalState = 0
    let confidenceScore = 0
    const insights = []

    // Combinar resultados ponderados
    for (const [algorithm, result] of Object.entries(algorithmResults)) {
      if (weights[algorithm] && result.score !== undefined) {
        overallEmotionalState += result.score * weights[algorithm]
        confidenceScore += (result.confidence || 0.5) * weights[algorithm]
      }

      if (result.insights) {
        insights.push(...result.insights)
      }
    }

    return {
      overallEmotionalState: Math.round(overallEmotionalState * 100) / 100,
      confidenceScore: Math.round(confidenceScore * 100) / 100,
      dominantEmotions: this.identifyDominantEmotions(algorithmResults),
      riskFactors: this.identifyRiskFactors(algorithmResults),
      strengths: this.identifyStrengths(algorithmResults),
      insights: insights,
      timestamp: new Date(),
    }
  }

  /**
   * Gera recomendações baseadas na análise
   * @param {Object} integratedAnalysis - Análise integrada
   */
  generateRecommendations(integratedAnalysis) {
    const recommendations = []

    // Recomendações baseadas no estado emocional geral
    if (integratedAnalysis.overallEmotionalState < 0.3) {
      recommendations.push({
        type: 'intervention',
        priority: 'high',
        action: 'emotional_support',
        description: 'Estado emocional baixo detectado - intervenção necessária',
      })
    }

    // Recomendações baseadas em fatores de risco
    for (const risk of integratedAnalysis.riskFactors) {
      recommendations.push({
        type: 'prevention',
        priority: risk.severity,
        action: risk.recommendation,
        description: risk.description,
      })
    }

    return recommendations
  }

  /**
   * Identifica emoções dominantes
   */
  identifyDominantEmotions(algorithmResults) {
    const emotions = []

    if (algorithmResults.frustrationDetection?.frustrationLevel > 0.6) {
      emotions.push('frustration')
    }

    if (algorithmResults.anxietyDetector?.anxietyLevel > 0.6) {
      emotions.push('anxiety')
    }

    if (algorithmResults.engagementAnalysis?.engagementLevel > 0.7) {
      emotions.push('engagement')
    }

    return emotions
  }

  /**
   * Identifica fatores de risco
   */
  identifyRiskFactors(algorithmResults) {
    const riskFactors = []

    // Verificar cada algoritmo por fatores de risco
    for (const [algorithm, result] of Object.entries(algorithmResults)) {
      if (result.riskFactors) {
        riskFactors.push(...result.riskFactors)
      }
    }

    return riskFactors
  }

  /**
   * Identifica pontos fortes
   */
  identifyStrengths(algorithmResults) {
    const strengths = []

    for (const [algorithm, result] of Object.entries(algorithmResults)) {
      if (result.strengths) {
        strengths.push(...result.strengths)
      }
    }

    return strengths
  }

  /**
   * Verifica necessidade de intervenções
   */
  checkInterventionNeeds(realtimeResults) {
    // Verificar frustração alta
    if (realtimeResults.frustrationDetection?.frustrationLevel > 0.8) {
      return {
        type: 'immediate',
        reason: 'high_frustration',
        action: 'provide_support',
        timestamp: new Date(),
      }
    }

    // Verificar ansiedade alta
    if (realtimeResults.anxietyDetector?.anxietyLevel > 0.8) {
      return {
        type: 'immediate',
        reason: 'high_anxiety',
        action: 'calming_intervention',
        timestamp: new Date(),
      }
    }

    return null
  }

  /**
   * Armazena resultados no banco de dados
   */
  async storeResults(results) {
    try {
      await this.db.insertData('emotional_analysis', results)
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
        'emotional_analysis',
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
   * Obtém métricas em tempo real
   */
  getRealtimeMetrics() {
    return Array.from(this.realtimeMetrics.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 100) // Últimas 100 métricas
  }

  /**
   * Obtém fila de intervenções
   */
  getInterventionQueue() {
    return this.interventionQueue
  }

  /**
   * Limpa intervenções processadas
   */
  clearProcessedInterventions() {
    this.interventionQueue = []
  }

  /**
   * Exporta dados para relatório
   */
  async exportAnalysisReport(userId, startDate, endDate) {
    const analysisData = await this.getAnalysisHistory(userId, 1000)

    const filteredData = analysisData.filter((analysis) => {
      const date = new Date(analysis.timestamp)
      return date >= startDate && date <= endDate
    })

    return {
      userId,
      period: { start: startDate, end: endDate },
      totalSessions: filteredData.length,
      averageEmotionalState: this.calculateAverageEmotionalState(filteredData),
      trends: this.analyzeTrends(filteredData),
      recommendations: this.generatePeriodRecommendations(filteredData),
    }
  }

  calculateAverageEmotionalState(analysisData) {
    const sum = analysisData.reduce(
      (acc, analysis) => acc + (analysis.integratedAnalysis?.overallEmotionalState || 0),
      0
    )
    return analysisData.length > 0 ? sum / analysisData.length : 0
  }

  analyzeTrends(analysisData) {
    // Implementar análise de tendências
    return {
      improving: false,
      stable: true,
      declining: false,
    }
  }

  generatePeriodRecommendations(analysisData) {
    // Implementar recomendações baseadas no período
    return []
  }
}

// Exportar classe principal
export { EmotionalAnalysisService }
