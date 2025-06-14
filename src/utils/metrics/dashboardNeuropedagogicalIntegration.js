// Integração do Sistema Neuropedagógico com Performance Dashboard
// Coleta métricas avançadas em background para análise terapêutica

import neuropedagogicalAnalyzer from './neuropedagogicalInsights.js'
import databaseService from '../../database/core/DatabaseService.js'

class DashboardNeuropedagogicalIntegration {
  constructor() {
    this.sessionBuffer = new Map() // Buffer para métricas da sessão atual
    this.analysisHistory = [] // Histórico de análises
    this.isAnalysisEnabled = true
    this.collectionInterval = null
  }

  // Inicializar coleta de métricas para uma sessão
  initializeSession(userId, sessionId, gameId) {
    if (!this.isAnalysisEnabled) return

    const sessionData = {
      userId,
      sessionId,
      gameId,
      startTime: Date.now(),
      metrics: {
        // Métricas básicas
        totalInteractions: 0,
        correctResponses: 0,
        incorrectResponses: 0,
        averageResponseTime: 0,
        responseTimes: [],

        // Métricas neuropedagógicas específicas
        visualDiscriminationErrors: 0,
        visualTaskSuccessRate: 0,
        ttsUsageFrequency: 0,
        auditoryTaskAccuracy: 0,
        soundEnabled: false,
        taskPlanningTime: 0,
        errorPatternConsistency: 0,
        strategyChangeFrequency: 0,
        impulsiveResponses: 0,
        intersessionRetention: 0,
        forgettingCurveSlope: 0,
        repeatedItemsAccuracy: 0,
        performanceConsistency: 0,
        fatigueDecline: 0,
        distractibilityEvents: 0,
        sustainedAttentionDuration: 0,
        accuracyPerSecond: 0,
        responseTimeVariability: 0,
        userAge: 8, // Padrão, pode ser obtido do perfil do usuário
      },
      events: [], // Log de eventos para análise de padrões
      analysisResult: null,
    }

    this.sessionBuffer.set(sessionId, sessionData)

    // Iniciar coleta contínua de métricas
    this.startContinuousCollection(sessionId)

    console.log(`🧠 [Neuropedagogical] Sessão iniciada: ${sessionId} para usuário ${userId}`)
  }

  // Iniciar coleta contínua de métricas (sem interferir no jogo)
  startContinuousCollection(sessionId) {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval)
    }

    this.collectionInterval = setInterval(() => {
      this.collectBackgroundMetrics(sessionId)
    }, 10000) // Coleta a cada 10 segundos
  }

  // Coletar métricas em background
  collectBackgroundMetrics(sessionId) {
    const session = this.sessionBuffer.get(sessionId)
    if (!session) return

    const currentTime = Date.now()
    const sessionDuration = currentTime - session.startTime

    // Atualizar duração de atenção sustentada
    session.metrics.sustainedAttentionDuration = sessionDuration

    // Calcular variabilidade de tempo de resposta
    if (session.metrics.responseTimes.length > 1) {
      const times = session.metrics.responseTimes
      const mean = times.reduce((a, b) => a + b, 0) / times.length
      const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length
      session.metrics.responseTimeVariability = Math.sqrt(variance)
    }

    // Detectar padrão de fadiga (declínio na performance)
    this.detectFatiguePattern(session)

    // Calcular consistência de performance
    this.calculatePerformanceConsistency(session)
  }

  // Registrar interação do usuário (chamado pelos componentes de atividade)
  recordInteraction(sessionId, interactionData) {
    const session = this.sessionBuffer.get(sessionId)
    if (!session) return

    const timestamp = Date.now()
    session.metrics.totalInteractions++

    // Registrar tempo de resposta
    if (interactionData.responseTime) {
      session.metrics.responseTimes.push(interactionData.responseTime)
      session.metrics.averageResponseTime =
        session.metrics.responseTimes.reduce((a, b) => a + b, 0) /
        session.metrics.responseTimes.length
    }

    // Registrar acurácia
    if (interactionData.isCorrect === true) {
      session.metrics.correctResponses++
    } else if (interactionData.isCorrect === false) {
      session.metrics.incorrectResponses++

      // Detectar respostas impulsivas (tempo < 1s)
      if (interactionData.responseTime && interactionData.responseTime < 1000) {
        session.metrics.impulsiveResponses++
      }
    }

    // Métricas específicas por tipo de interação
    this.recordSpecificMetrics(session, interactionData)

    // Registrar evento para análise de padrões
    session.events.push({
      timestamp,
      type: interactionData.type || 'interaction',
      data: interactionData,
    })

    // Detectar eventos de distração (pausas longas)
    this.detectDistractionEvents(session, timestamp)
  }

  // Registrar métricas específicas baseadas no tipo de atividade
  recordSpecificMetrics(session, interactionData) {
    switch (interactionData.type) {
      case 'visual_task':
        if (interactionData.isCorrect === false) {
          session.metrics.visualDiscriminationErrors++
        }
        session.metrics.visualTaskSuccessRate =
          session.metrics.correctResponses / session.metrics.totalInteractions
        break

      case 'auditory_task':
        session.metrics.auditoryTaskAccuracy =
          session.metrics.correctResponses / session.metrics.totalInteractions
        break

      case 'tts_usage':
        session.metrics.ttsUsageFrequency =
          (session.metrics.ttsUsageFrequency * (session.metrics.totalInteractions - 1) + 1) /
          session.metrics.totalInteractions
        break

      case 'sound_toggle':
        session.metrics.soundEnabled = interactionData.enabled
        break

      case 'planning_phase':
        session.metrics.taskPlanningTime = interactionData.planningTime || 0
        break

      case 'strategy_change':
        session.metrics.strategyChangeFrequency++
        break
    }
  }

  // Detectar eventos de distração
  detectDistractionEvents(session, currentTimestamp) {
    const events = session.events
    if (events.length < 2) return

    const lastEvent = events[events.length - 2]
    const timeSinceLastInteraction = currentTimestamp - lastEvent.timestamp

    // Pausa > 30 segundos indica possível distração
    if (timeSinceLastInteraction > 30000) {
      session.metrics.distractibilityEvents++
    }
  }

  // Detectar padrão de fadiga
  detectFatiguePattern(session) {
    const recentResponses = session.events.slice(-10).filter((e) => e.data.isCorrect !== undefined)

    if (recentResponses.length >= 10) {
      const firstHalf = recentResponses.slice(0, 5)
      const secondHalf = recentResponses.slice(5)

      const firstHalfAccuracy = firstHalf.filter((r) => r.data.isCorrect).length / 5
      const secondHalfAccuracy = secondHalf.filter((r) => r.data.isCorrect).length / 5

      const decline = firstHalfAccuracy - secondHalfAccuracy
      session.metrics.fatigueDecline = Math.max(session.metrics.fatigueDecline, decline * 100)
    }
  }

  // Calcular consistência de performance
  calculatePerformanceConsistency(session) {
    const responses = session.events.filter((e) => e.data.isCorrect !== undefined)

    if (responses.length >= 5) {
      const accuracyWindows = []
      for (let i = 0; i <= responses.length - 5; i++) {
        const window = responses.slice(i, i + 5)
        const accuracy = window.filter((r) => r.data.isCorrect).length / 5
        accuracyWindows.push(accuracy)
      }

      const mean = accuracyWindows.reduce((a, b) => a + b, 0) / accuracyWindows.length
      const variance =
        accuracyWindows.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) /
        accuracyWindows.length

      session.metrics.performanceConsistency = Math.max(0, 100 - Math.sqrt(variance) * 100)
    }
  }

  // Finalizar sessão e gerar análise neuropedagógica
  async finalizeSession(sessionId) {
    const session = this.sessionBuffer.get(sessionId)
    if (!session) return null

    // Parar coleta contínua
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval)
      this.collectionInterval = null
    }

    // Calcular métricas finais
    this.calculateFinalMetrics(session)

    // Gerar análise neuropedagógica
    try {
      const historicalData = await this.getHistoricalData(session.userId)
      const analysisResult = neuropedagogicalAnalyzer.generateComprehensiveReport(
        session.metrics,
        historicalData
      )

      session.analysisResult = analysisResult
      this.analysisHistory.push(analysisResult)

      // Salvar no dashboard storage
      await this.saveToDashboard(session)

      console.log(
        `🧠 [Neuropedagogical] Análise concluída para sessão ${sessionId}:`,
        analysisResult
      )

      // Remover do buffer
      this.sessionBuffer.delete(sessionId)

      return analysisResult
    } catch (error) {
      console.error('Erro ao gerar análise neuropedagógica:', error)
      return null
    }
  }

  // Calcular métricas finais da sessão
  calculateFinalMetrics(session) {
    const totalResponses = session.metrics.correctResponses + session.metrics.incorrectResponses

    if (totalResponses > 0) {
      session.metrics.accuracyPerSecond =
        session.metrics.correctResponses /
        totalResponses /
        (session.metrics.sustainedAttentionDuration / 1000)
    }

    // Calcular padrão de erro consistente
    const incorrectEvents = session.events.filter((e) => e.data.isCorrect === false)
    if (incorrectEvents.length > 1) {
      // Analisar se os erros seguem um padrão específico
      const errorTypes = incorrectEvents.map((e) => e.data.errorType || 'unknown')
      const mostCommonError = this.getMostFrequent(errorTypes)
      const consistency = errorTypes.filter((t) => t === mostCommonError).length / errorTypes.length
      session.metrics.errorPatternConsistency = consistency * 100
    }
  }

  // Obter dados históricos para comparação
  async getHistoricalData(userId) {
    try {
      // Buscar análises anteriores dos últimos 30 dias
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

      const historicalSessions = await databaseService.getGameSessions(userId, null, 50)

      return historicalSessions
        .filter((session) => new Date(session.created_at) >= thirtyDaysAgo)
        .map((session) => ({
          timestamp: session.created_at,
          gameId: session.game_id,
          overallScore: session.score,
          accuracy: session.accuracy,
          timeSpent: session.time_spent,
        }))
    } catch (error) {
      console.warn('Não foi possível obter dados históricos:', error)
      return []
    }
  }

  // Salvar análise no dashboard
  async saveToDashboard(session) {
    try {
      const dashboardData = {
        userId: session.userId,
        sessionId: session.sessionId,
        gameId: session.gameId,
        timestamp: new Date().toISOString(),
        neuropedagogicalMetrics: session.metrics,
        cognitiveAnalysis: session.analysisResult,
        sessionDuration: session.metrics.sustainedAttentionDuration,
        totalInteractions: session.metrics.totalInteractions,
      }

      // Salvar em localStorage para dashboard offline
      const existingData = JSON.parse(localStorage.getItem('neuropedagogical_analyses') || '[]')
      existingData.push(dashboardData)

      // Manter apenas os últimos 100 registros
      if (existingData.length > 100) {
        existingData.splice(0, existingData.length - 100)
      }

      localStorage.setItem('neuropedagogical_analyses', JSON.stringify(existingData))

      // Tentar salvar no banco de dados se disponível
      try {
        await databaseService.saveNeuropedagogicalAnalysis(dashboardData)
      } catch (dbError) {
        console.warn('Análise salva localmente - sincronização com BD pendente')
      }
    } catch (error) {
      console.error('Erro ao salvar análise no dashboard:', error)
    }
  }

  // Obter insights para o dashboard
  getDashboardInsights(userId = null) {
    const analyses = JSON.parse(localStorage.getItem('neuropedagogical_analyses') || '[]')

    let relevantAnalyses = analyses
    if (userId) {
      relevantAnalyses = analyses.filter((a) => a.userId === userId)
    }

    if (relevantAnalyses.length === 0) {
      return {
        summary: 'Nenhuma análise neuropedagógica disponível',
        recommendations: [],
        cognitiveProfile: null,
        progressionTrend: 'stable',
      }
    }

    const latestAnalysis = relevantAnalyses[relevantAnalyses.length - 1]
    const cognitiveProfile = this.buildCognitiveProfile(relevantAnalyses)
    const recommendations = this.getPrioritizedRecommendations(relevantAnalyses)

    return {
      summary: this.generateInsightSummary(relevantAnalyses),
      recommendations,
      cognitiveProfile,
      progressionTrend: latestAnalysis.cognitiveAnalysis?.progressionTrend || 'stable',
      totalSessions: relevantAnalyses.length,
      lastAnalysis: latestAnalysis.timestamp,
    }
  }

  // Construir perfil cognitivo agregado
  buildCognitiveProfile(analyses) {
    if (analyses.length === 0) return null

    const recentAnalyses = analyses.slice(-5)
    const cognitiveAreas = ['visual', 'auditory', 'executive', 'memory', 'attention', 'speed']

    const profile = {}

    cognitiveAreas.forEach((area) => {
      const scores = recentAnalyses
        .map((a) => a.cognitiveAnalysis?.cognitivePatterns?.[area]?.score || 0)
        .filter((score) => score > 0)

      if (scores.length > 0) {
        profile[area] = {
          averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
          trend: this.calculateTrend(scores),
          level: this.getCognitiveLevel(scores[scores.length - 1] || 0),
        }
      }
    })

    return profile
  }

  // Obter recomendações priorizadas
  getPrioritizedRecommendations(analyses) {
    const allRecommendations = []

    analyses.slice(-3).forEach((analysis) => {
      if (analysis.cognitiveAnalysis?.recommendations) {
        allRecommendations.push(...analysis.cognitiveAnalysis.recommendations)
      }
    })

    // Agrupar recomendações similares e priorizar
    const groupedRecs = this.groupRecommendations(allRecommendations)

    return groupedRecs
      .sort((a, b) => {
        const priorityOrder = { alta: 3, média: 2, baixa: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
      .slice(0, 5) // Top 5 recomendações
  }

  // Utilitários
  getMostFrequent(arr) {
    const counts = {}
    arr.forEach((item) => (counts[item] = (counts[item] || 0) + 1))
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
  }

  calculateTrend(values) {
    if (values.length < 2) return 0
    const first = values[0]
    const last = values[values.length - 1]
    return ((last - first) / first) * 100
  }

  getCognitiveLevel(score) {
    if (score >= 80) return 'excelente'
    if (score >= 65) return 'bom'
    if (score >= 50) return 'adequado'
    if (score >= 35) return 'em_desenvolvimento'
    return 'necessita_suporte'
  }

  groupRecommendations(recommendations) {
    const grouped = {}

    recommendations.forEach((rec) => {
      const key = rec.type + '_' + rec.description.substring(0, 20)
      if (!grouped[key]) {
        grouped[key] = { ...rec, frequency: 1 }
      } else {
        grouped[key].frequency++
      }
    })

    return Object.values(grouped)
  }

  generateInsightSummary(analyses) {
    const totalSessions = analyses.length
    const recentAnalyses = analyses.slice(-3)

    if (recentAnalyses.length === 0) {
      return 'Aguardando mais sessões para gerar insights.'
    }

    const strengths = []
    const concerns = []

    recentAnalyses.forEach((analysis) => {
      const patterns = analysis.cognitiveAnalysis?.cognitivePatterns || {}
      Object.entries(patterns).forEach(([area, data]) => {
        if (data.level === 'excelente' || data.level === 'bom') {
          strengths.push(area)
        } else if (data.level === 'necessita_suporte') {
          concerns.push(area)
        }
      })
    })

    let summary = `Análise baseada em ${totalSessions} sessões. `

    if (strengths.length > 0) {
      const uniqueStrengths = [...new Set(strengths)]
      summary += `Pontos fortes: ${uniqueStrengths.join(', ')}. `
    }

    if (concerns.length > 0) {
      const uniqueConcerns = [...new Set(concerns)]
      summary += `Áreas de atenção: ${uniqueConcerns.join(', ')}.`
    }

    return summary
  }

  // Ativar/desativar análise
  toggleAnalysis(enabled) {
    this.isAnalysisEnabled = enabled
    console.log(`🧠 [Neuropedagogical] Análise ${enabled ? 'ativada' : 'desativada'}`)
  }

  // Limpar dados (para testes)
  clearAnalysisData() {
    localStorage.removeItem('neuropedagogical_analyses')
    this.analysisHistory = []
    this.sessionBuffer.clear()
    console.log('🧠 [Neuropedagogical] Dados de análise limpos')
  }
}

export default new DashboardNeuropedagogicalIntegration()
