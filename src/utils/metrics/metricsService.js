import databaseService from '../../database/core/DatabaseService.js'
import { logger, API_CONFIG, CONFIG } from '../../config/api-config.js'
import { getSystemOrchestrator } from '../core/SystemOrchestrator.js'

export const METRICS_SCHEMA = {
  sessionId: { type: 'string', required: true },
  userId: { type: 'string', required: true },
  activityId: { type: 'string', required: true },
  startTime: { type: 'number', required: true },
  endTime: { type: 'number', required: true },
  duration: { type: 'number', required: true, min: 0 },
  attempts: { type: 'number', required: true, min: 0 },
  successes: { type: 'number', required: true, min: 0 },
  errors: { type: 'number', required: true, min: 0 },
  accuracy: { type: 'number', required: true, min: 0, max: 100 },
  score: { type: 'number', required: true, min: 0 },
  difficulty: { type: 'string', required: true, enum: ['easy', 'medium', 'hard'] },
  adaptiveData: {
    type: 'object',
    required: false,
    properties: {
      difficultyChanges: { type: 'array' },
      parameters: { type: 'object' },
    },
  },
  contextualData: {
    type: 'object',
    required: true,
    properties: {
      timeOfDay: { type: 'number', min: 0, max: 23 },
      dayOfWeek: { type: 'number', min: 0, max: 6 },
      deviceType: { type: 'string' },
      inputMethod: { type: 'string' },
      screenResolution: { type: 'object' },
      userAgent: { type: 'string' },
      language: { type: 'string' },
      responseLatency: { type: 'number', min: 0 },
      engagementScore: { type: 'number', min: 0, max: 100 },
      pausePatterns: { type: 'array' },
    },
  },
  activitySpecificData: { type: 'object', required: false },
  learningRate: { type: 'number', required: false, min: -100, max: 100 },
}

export class MetricsService {
  constructor() {
    this.sessions = new Map()
    this.isOnline = true
    this.init()
  }
  init() {
    this.checkConnectivity()
    
    // Verificar se estamos em ambiente browser (não Node.js)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        logger.info('Conexão restabelecida')      })
      window.addEventListener('offline', () => {
        this.isOnline = false
        logger.warn('Conexão perdida')
      })
    } else {
      // Em Node.js, assumir sempre online
      this.isOnline = true
      logger.info('MetricsService iniciado em ambiente Node.js')
    }
  }
  async checkConnectivity() {
    try {
      // Em Node.js, não temos fetch nativo, então simular conectividade
      if (typeof fetch === 'undefined') {
        this.isOnline = true
        logger.info('Conectividade assumida como ativa (Node.js)')
        return
      }
      
      // Para browser, tentar verificar conectividade
      const response = await fetch(`${CONFIG.API_URL}/health`, {
        method: 'HEAD',
        timeout: 5000,
      })
      this.isOnline = response.ok
      logger.info('Conexão verificada', { status: response.ok })
    } catch (error) {
      this.isOnline = false
      logger.error('Erro ao verificar conectividade', { error: error.message })
    }
  }

  startSession(activityId, userId, difficulty = 'easy') {
    if (!userId || !activityId) {
      logger.error('Parâmetros obrigatórios ausentes', { userId, activityId })
      return null
    }
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      logger.warn('Dificuldade inválida, usando padrão', { difficulty })
      difficulty = 'easy'
    }
    const sessionId = this.generateSessionId()
    const startTime = Date.now()
    const session = {
      sessionId,
      userId: String(userId),
      activityId,
      game_id: activityId,
      difficulty,
      startTime,
      endTime: null,
      duration: 0,
      attempts: 0,
      successes: 0,
      errors: 0,
      accuracy: 0,
      score: 0,
      events: [],
      adaptiveData: { difficultyChanges: [], parameters: {} },
      contextualData: this.getContextualData(),
      activitySpecificData: {},
      learningRate: 0,
    }
    this.sessions.set(sessionId, session)
    logger.info('Sessão de métricas iniciada', { sessionId, activityId, userId })
    return sessionId
  }

  recordEvent(sessionId, eventType, eventData = {}) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      logger.warn('Sessão não encontrada', { sessionId })
      return false
    }
    const timestamp = Date.now()
    const event = { timestamp, type: eventType, data: eventData }
    session.events.push(event)

    switch (eventType) {
      case 'attempt':
        session.attempts++
        break
      case 'success':
        session.successes++
        session.score += eventData.points || 10
        break
      case 'error':
        session.errors++
        break
      case 'difficulty_change':
        if (['easy', 'medium', 'hard'].includes(eventData.newDifficulty)) {
          session.adaptiveData.difficultyChanges.push({
            newDifficulty: eventData.newDifficulty,
            timestamp,
            reason: eventData.reason || 'unspecified',
          })
          session.difficulty = eventData.newDifficulty
        }
        break
      case 'adaptive_update':
        session.adaptiveData.parameters = {
          ...session.adaptiveData.parameters,
          ...eventData.parameters,
        }
        break
    }

    if (session.attempts > 0) {
      session.accuracy = Math.round((session.successes / session.attempts) * 100)
    }

    this.updateLearningRate(session)
    this.updateContextualMetrics(session)
    return true
  }

  async finishSession(sessionId, additionalData = {}) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      logger.warn('Sessão não encontrada', { sessionId })
      return null
    }
    session.endTime = Date.now()
    session.duration = session.endTime - session.startTime
    session.activitySpecificData = { ...session.activitySpecificData, ...additionalData }
    this.updateContextualMetrics(session)

    const validationResult = this.validateMetrics(session)
    if (!validationResult.isValid) {
      logger.error('Métricas inválidas', { sessionId, errors: validationResult.errors })
      return null
    }    try {
      if (!this.isOnline) {
        logger.warn('Sem conexão, sessão não salva', { sessionId })
        return null
      }

      // ✅ NOVO FLUXO: Passar dados pelo SystemOrchestrator para refinamento
      const orchestrator = await getSystemOrchestrator()
      const refinedSessionData = await orchestrator.refineMetricsData({
        user_id: session.userId,
        game_id: session.activityId,
        difficulty: session.difficulty.toUpperCase(),
        score: session.score,
        accuracy: session.accuracy,
        time_spent: session.duration,
        completed: true,
        correct_answers: session.successes,
        total_attempts: session.attempts,
        data: {
          events: session.events,
          adaptiveData: session.adaptiveData,
          contextualData: session.contextualData,
          activitySpecificData: session.activitySpecificData,          learningRate: session.learningRate,
        },
      })

      // Salvar dados refinados no banco
      const saved = await databaseService.saveGameSession(refinedSessionData)
      
      logger.info('Métricas salvas com sucesso', { sessionId, savedId: saved.id })
      this.sessions.delete(sessionId)
      return session
    } catch (error) {
      logger.error('Erro ao salvar métricas', { sessionId, error: error.message })
      return null
    }
  }

  validateMetrics(metrics) {
    const errors = []
    Object.entries(METRICS_SCHEMA).forEach(([field, schema]) => {
      if (schema.required && (metrics[field] === undefined || metrics[field] === null)) {
        errors.push(`Campo obrigatório ausente: ${field}`)
      }
      if (metrics[field] !== undefined) {
        if (schema.type && typeof metrics[field] !== schema.type) {
          errors.push(
            `Tipo inválido para ${field}: esperado ${schema.type}, recebido ${typeof metrics[field]}`
          )
        }
        if (schema.min !== undefined && metrics[field] < schema.min) {
          errors.push(`Valor de ${field} abaixo do mínimo: ${metrics[field]} < ${schema.min}`)
        }
        if (schema.max !== undefined && metrics[field] > schema.max) {
          errors.push(`Valor de ${field} acima do máximo: ${metrics[field]} > ${schema.max}`)
        }
        if (schema.enum && !schema.enum.includes(metrics[field])) {
          errors.push(
            `Valor inválido para ${field}: ${metrics[field]} não está em [${schema.enum.join(', ')}]`
          )
        }
        if (schema.properties) {
          Object.entries(schema.properties).forEach(([prop, propSchema]) => {
            if (metrics[field]?.[prop] !== undefined) {
              if (propSchema.type && typeof metrics[field][prop] !== propSchema.type) {
                errors.push(
                  `Tipo inválido para ${field}.${prop}: esperado ${propSchema.type}, recebido ${typeof metrics[field][prop]}`
                )
              }
              if (propSchema.min !== undefined && metrics[field][prop] < propSchema.min) {
                errors.push(
                  `Valor de ${field}.${prop} abaixo do mínimo: ${metrics[field][prop]} < ${propSchema.min}`
                )
              }
              if (propSchema.max !== undefined && metrics[field][prop] > propSchema.max) {
                errors.push(
                  `Valor de ${field}.${prop} acima do máximo: ${metrics[field][prop]} > ${propSchema.max}`
                )
              }
            }
          })
        }
      }
    })
    return { isValid: errors.length === 0, errors }
  }

  updateLearningRate(session) {
    if (session.events.length < 5) {
      session.learningRate = 0
      return
    }
    const attemptEvents = session.events.filter((e) => ['success', 'error'].includes(e.type))
    if (attemptEvents.length < 5) {
      session.learningRate = 0
      return
    }
    const windowSize = Math.floor(attemptEvents.length / 3)
    const accuracies = []
    for (let i = 0; i < attemptEvents.length; i += windowSize) {
      const slice = attemptEvents.slice(i, i + windowSize)
      const successes = slice.filter((e) => e.type === 'success').length
      const attempts = slice.length
      accuracies.push(attempts > 0 ? (successes / attempts) * 100 : 0)
    }
    const trend = accuracies[accuracies.length - 1] - accuracies[0]
    session.learningRate = Math.round(Math.max(-100, Math.min(100, trend)))
  }

  updateContextualMetrics(session) {
    const attemptEvents = session.events.filter((e) => e.type === 'attempt')
    if (attemptEvents.length > 1) {
      const latencies = []
      for (let i = 1; i < attemptEvents.length; i++) {
        latencies.push(attemptEvents[i].timestamp - attemptEvents[i - 1].timestamp)
      }
      session.contextualData.responseLatency = Math.round(
        latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length
      )
    } else {
      session.contextualData.responseLatency = 0
    }

    const durationSeconds = (session.duration || Date.now() - session.startTime) / 1000
    const eventFrequency = session.events.length / (durationSeconds || 1)
    const engagementScore = Math.min(
      100,
      Math.round(
        eventFrequency * 20 +
          session.accuracy * 0.5 +
          (session.successes / (session.attempts || 1)) * 30
      )
    )
    session.contextualData.engagementScore = engagementScore

    const pauses = []
    let lastTime = session.startTime
    for (const event of session.events) {
      const gap = event.timestamp - lastTime
      if (gap > 2000) {
        pauses.push({ start: lastTime, duration: gap, end: event.timestamp })
      }
      lastTime = event.timestamp
    }
    session.contextualData.pausePatterns = pauses
  }

  getContextualData() {
    const now = new Date()
    return {
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      deviceType: this.getDeviceType(),
      inputMethod: this.getInputMethod(),
      screenResolution: { width: window.screen.width, height: window.screen.height },
      userAgent: navigator.userAgent,
      language: navigator.language,
      responseLatency: 0,
      engagementScore: 0,
      pausePatterns: [],
    }
  }

  getDeviceType() {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  getInputMethod() {
    return 'ontouchstart' in window ? 'touch' : 'mouse'
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getSessionMetrics(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      logger.warn('Sessão não encontrada', { sessionId })
      return null
    }
    return session
  }

  async getOverallStats(userId, activityId = null, timeRange = 0) {
    try {
      const sessions = await databaseService.getGameSessions(
        userId,
        activityId,
        timeRange ? 50 : null
      )
      if (!sessions.length) {
        logger.info('Nenhuma sessão encontrada', { userId, activityId })
        return this.getEmptyStats()
      }
      const stats = {
        totalSessions: sessions.length,
        totalDuration: sessions.reduce((sum, s) => sum + (s.time_spent || 0), 0),
        totalAttempts: sessions.reduce((sum, s) => sum + (s.total_attempts || 0), 0),
        totalSuccesses: sessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0),
        totalErrors: sessions.reduce(
          (sum, s) => sum + (s.total_attempts - (s.correct_answers || 0)),
          0
        ),
        averageAccuracy: 0,
        averageScore: 0,
        improvementTrend: 0,
        averageLearningRate: 0,
        engagementByDay: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
        averageResponseLatency: 0,
        averageEngagementScore: 0,
      }
      if (stats.totalAttempts > 0) {
        stats.averageAccuracy = Math.round((stats.totalSuccesses / stats.totalAttempts) * 100)
      }
      if (sessions.length > 0) {
        stats.averageScore = Math.round(
          sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
        )
        stats.averageLearningRate = Math.round(
          sessions.reduce((sum, s) => sum + (s.data?.learningRate || 0), 0) / sessions.length
        )
        stats.averageResponseLatency = Math.round(
          sessions.reduce((sum, s) => sum + (s.data?.contextualData?.responseLatency || 0), 0) /
            sessions.length
        )
        stats.averageEngagementScore = Math.round(
          sessions.reduce((sum, s) => sum + (s.data?.contextualData?.engagementScore || 0), 0) /
            sessions.length
        )
      }
      if (sessions.length >= 10) {
        const recent = sessions.slice(0, 5)
        const older = sessions.slice(-5)
        const recentAvg = recent.reduce((sum, s) => sum + (s.accuracy || 0), 0) / 5
        const olderAvg = older.reduce((sum, s) => sum + (s.accuracy || 0), 0) / 5
        stats.improvementTrend = Math.round(recentAvg - olderAvg)
      }
      sessions.forEach((s) => {
        const day = new Date(s.created_at).getDay()
        stats.engagementByDay[day]++
        stats.difficultyDistribution[s.difficulty.toLowerCase()]++
      })
      logger.info('Estatísticas gerais obtidas', { userId, sessions: sessions.length })
      return stats
    } catch (error) {
      logger.error('Erro ao obter estatísticas', { userId, error: error.message })
      return this.getEmptyStats()
    }
  }

  getEmptyStats() {
    return {
      totalSessions: 0,
      totalDuration: 0,
      totalAttempts: 0,
      totalSuccesses: 0,
      totalErrors: 0,
      averageAccuracy: 0,
      averageScore: 0,
      improvementTrend: 0,
      averageLearningRate: 0,
      engagementByDay: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
      averageResponseLatency: 0,
      averageEngagementScore: 0,
    }
  }
}

const metricsService = new MetricsService()
export const metricsManager = metricsService

export default metricsService

export const useMetrics = (activityId) => {
  const startSession = (userId, difficulty) => {
    return metricsService.startSession(activityId, userId, difficulty)
  }
  const recordAttempt = (sessionId, data = {}) => {
    return metricsService.recordEvent(sessionId, 'attempt', data)
  }
  const recordSuccess = (sessionId, data = {}) => {
    return metricsService.recordEvent(sessionId, 'success', data)
  }
  const recordError = (sessionId, data = {}) => {
    return metricsService.recordEvent(sessionId, 'error', data)
  }
  const recordDifficultyChange = (sessionId, newDifficulty, reason) => {
    return metricsService.recordEvent(sessionId, 'difficulty_change', { newDifficulty, reason })
  }
  const recordAdaptiveUpdate = (sessionId, parameters) => {
    return metricsService.recordEvent(sessionId, 'adaptive_update', { parameters })
  }
  const finishSession = (sessionId, additionalData = {}) => {
    return metricsService.finishSession(sessionId, additionalData)
  }
  const getStats = (userId, timeRange = 0) => {
    return metricsService.getOverallStats(userId, activityId, timeRange)
  }
  return {
    startSession,
    recordAttempt,
    recordSuccess,
    recordError,
    recordDifficultyChange,
    recordAdaptiveUpdate,
    finishSession,
    getStats,
  }
}
