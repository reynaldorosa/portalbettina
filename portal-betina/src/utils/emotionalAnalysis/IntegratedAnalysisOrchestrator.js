/**
 * @file IntegratedAnalysisOrchestrator.js
 * @description Orquestrador principal que integra análises emocionais e de neuroplasticidade
 * Sistema central que coordena todos os serviços de análise
 * @version 1.0.0
 * @created 2025-01-11
 */

import EmotionalAnalysisService from '../emotionalAnalysis/EmotionalAnalysisService.js'
import NeuroplasticityService from '../neuroplasticity/NeuroplasticityService.js'
import EmotionalDataCollector from '../emotionalAnalysis/dataCollectors/EmotionalDataCollector.js'
import NeuroplasticityDataCollector from '../neuroplasticity/dataCollectors/NeuroplasticityDataCollector.js'

export default class IntegratedAnalysisOrchestrator {
  constructor(databaseService, config = {}) {
    this.db = databaseService
    this.config = {
      realtimeAnalysis: config.realtimeAnalysis !== false,
      analysisInterval: config.analysisInterval || 5000, // 5 segundos
      autoOptimization: config.autoOptimization !== false,
      ...config,
    }

    // Inicializar serviços principais
    this.emotionalService = null
    this.neuroplasticityService = null

    // Coletores de dados
    this.emotionalCollector = new EmotionalDataCollector()
    this.neuroplasticityCollector = new NeuroplasticityDataCollector()

    // Estado da sessão
    this.currentSession = null
    this.isAnalyzing = false
    this.analysisHistory = []

    // Fila de otimizações
    this.optimizationQueue = []
    this.interventionQueue = []
  }

  /**
   * Inicializa o orquestrador
   */
  async initialize(userProfile = {}) {
    try {
      console.log('🚀 Inicializando IntegratedAnalysisOrchestrator...')

      // Inicializar serviços
      this.emotionalService = new EmotionalAnalysisService(this.db, userProfile)
      this.neuroplasticityService = new NeuroplasticityService(this.db, userProfile)

      await Promise.all([
        this.emotionalService.initialize(),
        this.neuroplasticityService.initialize(),
      ])

      console.log('✅ IntegratedAnalysisOrchestrator inicializado com sucesso')
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar IntegratedAnalysisOrchestrator:', error)
      return false
    }
  }

  /**
   * Inicia uma nova sessão de análise
   */
  async startSession(sessionConfig) {
    try {
      this.currentSession = {
        sessionId: sessionConfig.sessionId || this.generateSessionId(),
        userId: sessionConfig.userId,
        startTime: Date.now(),
        config: sessionConfig,
        status: 'active',
      }

      // Iniciar coletores de dados
      this.emotionalCollector.startCollection(
        this.currentSession.sessionId,
        this.currentSession.userId
      )

      this.neuroplasticityCollector.startCollection(
        this.currentSession.sessionId,
        this.currentSession.userId
      )

      // Iniciar análise em tempo real se habilitada
      if (this.config.realtimeAnalysis) {
        this.startRealtimeAnalysis()
      }

      console.log(`📊 Sessão iniciada: ${this.currentSession.sessionId}`)
      return this.currentSession
    } catch (error) {
      console.error('❌ Erro ao iniciar sessão:', error)
      throw error
    }
  }

  /**
   * Finaliza sessão de análise
   */
  async endSession() {
    if (!this.currentSession) {
      throw new Error('Nenhuma sessão ativa encontrada')
    }

    try {
      this.currentSession.endTime = Date.now()
      this.currentSession.status = 'completed'

      // Parar coletores
      const emotionalSummary = this.emotionalCollector.stopCollection()
      const neuroplasticitySummary = this.neuroplasticityCollector.stopCollection()

      // Parar análise em tempo real
      this.stopRealtimeAnalysis()

      // Executar análise final da sessão
      const finalAnalysis = await this.analyzeFinalSession(emotionalSummary, neuroplasticitySummary)

      // Armazenar resultados
      await this.storeFinalResults(finalAnalysis)

      console.log(`📊 Sessão finalizada: ${this.currentSession.sessionId}`)

      const sessionResult = {
        session: this.currentSession,
        analysis: finalAnalysis,
        summary: {
          emotional: emotionalSummary,
          neuroplasticity: neuroplasticitySummary,
        },
      }

      this.currentSession = null
      return sessionResult
    } catch (error) {
      console.error('❌ Erro ao finalizar sessão:', error)
      throw error
    }
  }

  /**
   * Processa evento em tempo real
   */
  async processRealtimeEvent(eventData) {
    if (!this.currentSession || !this.config.realtimeAnalysis) {
      return null
    }

    try {
      // Coletar dados
      const emotionalData = this.emotionalCollector.collectRealtimeData(eventData)
      const neuroplasticityData = this.neuroplasticityCollector.collectRealtimeData(eventData)

      // Análise rápida para intervenções imediatas
      const realtimeAnalysis = await this.performRealtimeAnalysis(
        emotionalData,
        neuroplasticityData
      )

      // Verificar necessidade de intervenções
      await this.checkRealtimeInterventions(realtimeAnalysis)

      return realtimeAnalysis
    } catch (error) {
      console.error('❌ Erro no processamento em tempo real:', error)
      return null
    }
  }

  /**
   * Executa análise em tempo real
   */
  async performRealtimeAnalysis(emotionalData, neuroplasticityData) {
    const promises = []

    // Análise emocional rápida
    if (emotionalData) {
      promises.push(this.emotionalService.analyzeRealtime(emotionalData))
    }

    // Análise de neuroplasticidade (algoritmos prioritários)
    if (neuroplasticityData) {
      promises.push(
        this.neuroplasticityService.algorithms.improvementTracker.analyzeRealtime?.(
          neuroplasticityData
        ) || Promise.resolve({})
      )
    }

    const [emotionalResults, neuroplasticityResults] = await Promise.all(promises)

    return {
      timestamp: Date.now(),
      emotional: emotionalResults,
      neuroplasticity: neuroplasticityResults,
      integrated: this.integrateRealtimeResults(emotionalResults, neuroplasticityResults),
    }
  }

  /**
   * Integra resultados em tempo real
   */
  integrateRealtimeResults(emotional, neuroplasticity) {
    const riskScore = this.calculateRiskScore(emotional, neuroplasticity)
    const opportunityScore = this.calculateOpportunityScore(emotional, neuroplasticity)

    return {
      riskScore,
      opportunityScore,
      recommendedActions: this.generateRealtimeRecommendations(riskScore, opportunityScore),
      interventionNeeded: riskScore > 0.7 || emotional.frustrationLevel > 0.8,
      optimizationOpportunity: opportunityScore > 0.7,
    }
  }

  /**
   * Calcula score de risco
   */
  calculateRiskScore(emotional, neuroplasticity) {
    let riskScore = 0
    let factors = 0

    if (emotional.frustrationLevel !== undefined) {
      riskScore += emotional.frustrationLevel * 0.4
      factors += 0.4
    }

    if (emotional.anxietyLevel !== undefined) {
      riskScore += emotional.anxietyLevel * 0.3
      factors += 0.3
    }

    if (neuroplasticity.cognitiveOverload !== undefined) {
      riskScore += neuroplasticity.cognitiveOverload * 0.3
      factors += 0.3
    }

    return factors > 0 ? riskScore / factors : 0
  }

  /**
   * Calcula score de oportunidade
   */
  calculateOpportunityScore(emotional, neuroplasticity) {
    let opportunityScore = 0
    let factors = 0

    if (emotional.engagementLevel !== undefined) {
      opportunityScore += emotional.engagementLevel * 0.4
      factors += 0.4
    }

    if (emotional.motivationLevel !== undefined) {
      opportunityScore += emotional.motivationLevel * 0.3
      factors += 0.3
    }

    if (neuroplasticity.improvementPotential !== undefined) {
      opportunityScore += neuroplasticity.improvementPotential * 0.3
      factors += 0.3
    }

    return factors > 0 ? opportunityScore / factors : 0
  }

  /**
   * Gera recomendações em tempo real
   */
  generateRealtimeRecommendations(riskScore, opportunityScore) {
    const recommendations = []

    if (riskScore > 0.7) {
      recommendations.push({
        type: 'intervention',
        priority: 'high',
        action: 'immediate_support',
        description: 'Fornecer suporte imediato - alto risco detectado',
      })
    }

    if (opportunityScore > 0.7) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        action: 'increase_challenge',
        description: 'Aumentar desafio - alta oportunidade de crescimento',
      })
    }

    if (riskScore < 0.3 && opportunityScore > 0.5) {
      recommendations.push({
        type: 'enhancement',
        priority: 'low',
        action: 'introduce_complexity',
        description: 'Introduzir maior complexidade gradualmente',
      })
    }

    return recommendations
  }

  /**
   * Verifica necessidade de intervenções em tempo real
   */
  async checkRealtimeInterventions(analysis) {
    if (analysis.integrated.interventionNeeded) {
      const intervention = {
        type: 'immediate',
        timestamp: Date.now(),
        sessionId: this.currentSession.sessionId,
        trigger: analysis,
        action: 'support_user',
        priority: 'high',
      }

      this.interventionQueue.push(intervention)

      // Notificar sistema de intervenções
      await this.triggerIntervention(intervention)
    }

    if (analysis.integrated.optimizationOpportunity) {
      const optimization = {
        type: 'enhancement',
        timestamp: Date.now(),
        sessionId: this.currentSession.sessionId,
        opportunity: analysis,
        action: 'optimize_experience',
        priority: 'medium',
      }

      this.optimizationQueue.push(optimization)
    }
  }

  /**
   * Dispara intervenção
   */
  async triggerIntervention(intervention) {
    // Implementar lógica de intervenção
    console.log('🚨 Intervenção disparada:', intervention)

    // Aqui seria integrado com o sistema de UI para mostrar suporte
    // Por exemplo: mostrar dicas, reduzir dificuldade, oferecer pausa, etc.
  }

  /**
   * Inicia análise em tempo real
   */
  startRealtimeAnalysis() {
    this.realtimeInterval = setInterval(async () => {
      if (this.currentSession && this.isAnalyzing) {
        try {
          const emotionalMetrics = this.emotionalService.getRealtimeMetrics()
          const neuroplasticityMetrics = this.neuroplasticityService.getNeuroplasticityMetrics()

          // Processar métricas se houver dados suficientes
          if (emotionalMetrics.length > 0 || neuroplasticityMetrics.length > 0) {
            await this.processIntervalAnalysis(emotionalMetrics, neuroplasticityMetrics)
          }
        } catch (error) {
          console.error('❌ Erro na análise em tempo real:', error)
        }
      }
    }, this.config.analysisInterval)

    this.isAnalyzing = true
  }

  /**
   * Para análise em tempo real
   */
  stopRealtimeAnalysis() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval)
      this.realtimeInterval = null
    }
    this.isAnalyzing = false
  }

  /**
   * Processa análise por intervalos
   */
  async processIntervalAnalysis(emotionalMetrics, neuroplasticityMetrics) {
    // Análise periódica menos intensiva
    const intervalAnalysis = {
      timestamp: Date.now(),
      emotional: this.analyzeEmotionalTrends(emotionalMetrics),
      neuroplasticity: this.analyzeNeuroplasticityTrends(neuroplasticityMetrics),
    }

    // Armazenar para histórico
    this.analysisHistory.push(intervalAnalysis)
  }

  /**
   * Analisa tendências emocionais
   */
  analyzeEmotionalTrends(metrics) {
    // Implementar análise de tendências emocionais
    return {
      trend: 'stable',
      avgLevel: 0.5,
      volatility: 0.2,
    }
  }

  /**
   * Analisa tendências de neuroplasticidade
   */
  analyzeNeuroplasticityTrends(metrics) {
    // Implementar análise de tendências de neuroplasticidade
    return {
      growthTrend: 'improving',
      avgImprovement: 0.3,
      plasticity: 0.6,
    }
  }

  /**
   * Executa análise final da sessão
   */
  async analyzeFinalSession(emotionalSummary, neuroplasticitySummary) {
    const sessionData = {
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId,
      duration: this.currentSession.endTime - this.currentSession.startTime,
      emotionalData: emotionalSummary,
      neuroplasticityData: neuroplasticitySummary,
    }

    // Executar análises completas
    const [emotionalAnalysis, neuroplasticityAnalysis] = await Promise.all([
      this.emotionalService.analyzeSession(sessionData),
      this.neuroplasticityService.analyzeSession(sessionData),
    ])

    // Integrar resultados
    const integratedAnalysis = this.integrateSessionResults(
      emotionalAnalysis,
      neuroplasticityAnalysis
    )

    return {
      emotional: emotionalAnalysis,
      neuroplasticity: neuroplasticityAnalysis,
      integrated: integratedAnalysis,
      recommendations: this.generateSessionRecommendations(integratedAnalysis),
      insights: this.generateSessionInsights(integratedAnalysis),
    }
  }

  /**
   * Integra resultados da sessão
   */
  integrateSessionResults(emotional, neuroplasticity) {
    const overallWellbeing =
      emotional.integratedAnalysis.overallEmotionalState * 0.6 +
      neuroplasticity.integratedAnalysis.overallNeuroplasticity * 0.4

    const learningEffectiveness =
      emotional.integratedAnalysis.overallEmotionalState * 0.3 +
      neuroplasticity.integratedAnalysis.learningEfficiency * 0.7

    return {
      overallWellbeing,
      learningEffectiveness,
      cognitiveGrowth: neuroplasticity.integratedAnalysis.cognitiveGrowth,
      emotionalStability: emotional.integratedAnalysis.overallEmotionalState,
      adaptabilityScore: neuroplasticity.integratedAnalysis.adaptabilityScore,
      riskFactors: [
        ...emotional.integratedAnalysis.riskFactors,
        ...(neuroplasticity.integratedAnalysis.riskFactors || []),
      ],
      strengths: [
        ...emotional.integratedAnalysis.strengths,
        ...(neuroplasticity.integratedAnalysis.strengths || []),
      ],
    }
  }

  /**
   * Gera recomendações da sessão
   */
  generateSessionRecommendations(integratedAnalysis) {
    const recommendations = []

    if (integratedAnalysis.overallWellbeing < 0.4) {
      recommendations.push({
        type: 'wellbeing',
        priority: 'high',
        description: 'Focar em atividades de bem-estar emocional',
      })
    }

    if (integratedAnalysis.learningEffectiveness > 0.7) {
      recommendations.push({
        type: 'advancement',
        priority: 'medium',
        description: 'Aumentar complexidade das atividades de aprendizagem',
      })
    }

    return recommendations
  }

  /**
   * Gera insights da sessão
   */
  generateSessionInsights(integratedAnalysis) {
    const insights = []

    if (integratedAnalysis.cognitiveGrowth > 0.6) {
      insights.push({
        type: 'growth',
        message: 'Excelente progresso cognitivo identificado nesta sessão',
      })
    }

    return insights
  }

  /**
   * Armazena resultados finais
   */
  async storeFinalResults(analysis) {
    try {
      await this.db.insertData('integrated_analysis', {
        sessionId: this.currentSession.sessionId,
        userId: this.currentSession.userId,
        timestamp: new Date(),
        analysis,
      })
    } catch (error) {
      console.error('❌ Erro ao armazenar resultados:', error)
    }
  }

  /**
   * Gera ID de sessão único
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Obtém status atual
   */
  getStatus() {
    return {
      isActive: !!this.currentSession,
      currentSession: this.currentSession,
      isAnalyzing: this.isAnalyzing,
      interventionQueue: this.interventionQueue.length,
      optimizationQueue: this.optimizationQueue.length,
    }
  }

  /**
   * Obtém filas de processamento
   */
  getQueues() {
    return {
      interventions: [...this.interventionQueue],
      optimizations: [...this.optimizationQueue],
    }
  }

  /**
   * Limpa filas processadas
   */
  clearProcessedQueues() {
    this.interventionQueue = []
    this.optimizationQueue = []
  }
}

export { IntegratedAnalysisOrchestrator }
