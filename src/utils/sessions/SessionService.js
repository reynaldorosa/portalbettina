/**
 * @file SessionService.js
 * @description Serviço para gerenciamento de sessões de jogos
 * Integra com métricas e análise terapêutica
 */

import { SessionAnalyzer } from './SessionAnalyzer.js'
import { metricsManager } from '../metrics/index.js'

export class SessionService {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService?.logger || console
    this.cache = databaseService?.cache
    this.sessionAnalyzer = new SessionAnalyzer(databaseService)

    // Estados de sessão
    this.activeSessions = new Map()
    this.sessionHistory = new Map()
    this.sessionMetrics = new Map()

    this.ready = false
  }

  /**
   * @method initialize
   * @async
   * @description Inicializa o serviço de sessões
   */
  async initialize() {
    try {
      this.logger.info('🎮 Initializing SessionService...')

      // Inicializar integração com métricas
      await this.initializeMetricsIntegration()

      // Carregar sessões pendentes
      await this.loadPendingSessions()

      this.ready = true
      this.logger.info('✅ SessionService initialized successfully')
    } catch (error) {
      this.logger.error('❌ Failed to initialize SessionService', {
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method isReady
   * @description Verifica se o serviço está pronto
   */
  isReady() {
    return this.ready
  }

  /**
   * @method startSession
   * @description Inicia uma nova sessão de jogo
   * @param {Object} params - Parâmetros da sessão
   * @returns {Object} Dados da sessão iniciada
   */
  async startSession({ userId, gameId, difficulty = 'medium', options = {} }) {
    try {
      const sessionId = this.generateSessionId()
      const startTime = Date.now()

      const session = {
        sessionId,
        userId,
        gameId,
        difficulty,
        startTime,
        status: 'active',
        options,
        metrics: {
          interactions: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          totalTime: 0,
          hints: 0,
        },
        events: [],
      }

      // Armazenar sessão ativa
      this.activeSessions.set(sessionId, session)

      // Inicializar coleta de métricas
      if (metricsManager.initialized) {
        metricsManager.startSession(sessionId, gameId, options)
      }

      this.logger.info('🎯 Session started', {
        sessionId,
        userId,
        gameId,
        difficulty,
      })

      return {
        sessionId,
        startTime,
        gameId,
        difficulty,
        status: 'active',
      }
    } catch (error) {
      this.logger.error('❌ Failed to start session', {
        userId,
        gameId,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method recordInteraction
   * @description Registra uma interação do usuário
   * @param {string} sessionId - ID da sessão
   * @param {Object} interaction - Dados da interação
   */
  recordInteraction(sessionId, interaction) {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      this.logger.warn('Session not found for interaction', { sessionId })
      return
    }

    const timestamp = Date.now()
    const enrichedInteraction = {
      ...interaction,
      timestamp,
      sessionTime: timestamp - session.startTime,
    }

    // Adicionar evento à sessão
    session.events.push(enrichedInteraction)

    // Atualizar métricas
    this.updateSessionMetrics(session, enrichedInteraction)

    // Enviar para sistema de métricas
    if (metricsManager.initialized) {
      metricsManager.recordInteraction(enrichedInteraction)
    }
  }

  /**
   * @method endSession
   * @description Finaliza uma sessão de jogo
   * @param {string} sessionId - ID da sessão
   * @param {Object} finalData - Dados finais da sessão
   * @returns {Object} Relatório final da sessão
   */
  async endSession(sessionId, finalData = {}) {
    try {
      const session = this.activeSessions.get(sessionId)
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`)
      }

      const endTime = Date.now()
      const duration = endTime - session.startTime

      // Finalizar dados da sessão
      const finalSession = {
        ...session,
        endTime,
        duration,
        status: 'completed',
        finalData,
        performance: this.calculatePerformance(session),
      }

      // Análise da sessão
      const analysis = await this.sessionAnalyzer.analyzeSessionPerformance(finalSession)
      finalSession.analysis = analysis

      // Gerar recomendações terapêuticas
      const recommendations = this.sessionAnalyzer.generateTherapeuticRecommendations(analysis)
      finalSession.recommendations = recommendations

      // Finalizar métricas
      let metricsReport = null
      if (metricsManager.initialized) {
        metricsReport = await metricsManager.endSession()
      }

      // Mover para histórico
      this.activeSessions.delete(sessionId)
      this.sessionHistory.set(sessionId, finalSession)

      // Salvar sessão
      await this.saveSession(finalSession, metricsReport)

      this.logger.info('🏁 Session completed', {
        sessionId,
        duration,
        performance: finalSession.performance,
      })

      return {
        sessionId,
        duration,
        performance: finalSession.performance,
        analysis,
        recommendations,
        metrics: metricsReport,
      }
    } catch (error) {
      this.logger.error('❌ Failed to end session', {
        sessionId,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method getSessionData
   * @description Obtém dados de uma sessão específica
   * @param {string} sessionId - ID da sessão
   * @returns {Object|null} Dados da sessão
   */
  getSessionData(sessionId) {
    return this.activeSessions.get(sessionId) || this.sessionHistory.get(sessionId) || null
  }

  /**
   * @method getActiveSessions
   * @description Obtém todas as sessões ativas
   * @returns {Array} Lista de sessões ativas
   */
  getActiveSessions() {
    return Array.from(this.activeSessions.values())
  }

  /**
   * @method getUserSessions
   * @description Obtém sessões de um usuário específico
   * @param {string} userId - ID do usuário
   * @param {Object} options - Opções de busca
   * @returns {Array} Lista de sessões
   */
  async getUserSessions(userId, options = {}) {
    const { gameId = null, limit = 50, includeActive = true, includeAnalysis = false } = options

    try {
      const sessions = []

      // Incluir sessões ativas se solicitado
      if (includeActive) {
        const activeSessions = Array.from(this.activeSessions.values())
          .filter((session) => session.userId === userId)
          .filter((session) => !gameId || session.gameId === gameId)

        sessions.push(...activeSessions)
      }

      // Buscar sessões do histórico/banco de dados
      if (this.db) {
        const dbSessions = await this.db.getModule('sessions')?.getSessions?.(userId, gameId, limit)
        if (dbSessions) {
          sessions.push(...dbSessions)
        }
      }

      // Enriquecer com análises se solicitado
      if (includeAnalysis) {
        for (const session of sessions) {
          if (!session.analysis) {
            session.analysis = await this.sessionAnalyzer.analyzeSessionPerformance(session)
          }
        }
      }

      // Ordenar por data mais recente
      sessions.sort((a, b) => (b.endTime || b.startTime) - (a.endTime || a.startTime))

      return sessions.slice(0, limit)
    } catch (error) {
      this.logger.error('❌ Failed to get user sessions', {
        userId,
        gameId,
        error: error.message,
      })
      throw error
    }
  }

  // ============== MÉTODOS PRIVADOS ==============

  /**
   * @method generateSessionId
   * @private
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * @method updateSessionMetrics
   * @private
   */
  updateSessionMetrics(session, interaction) {
    const { type, correct, timeSpent, hint } = interaction

    session.metrics.interactions++

    if (correct === true) {
      session.metrics.correctAnswers++
    } else if (correct === false) {
      session.metrics.incorrectAnswers++
    }

    if (timeSpent) {
      session.metrics.totalTime += timeSpent
    }

    if (hint) {
      session.metrics.hints++
    }
  }

  /**
   * @method calculatePerformance
   * @private
   */
  calculatePerformance(session) {
    const metrics = session.metrics
    const totalAnswers = metrics.correctAnswers + metrics.incorrectAnswers

    return {
      accuracy: totalAnswers > 0 ? metrics.correctAnswers / totalAnswers : 0,
      totalInteractions: metrics.interactions,
      correctAnswers: metrics.correctAnswers,
      incorrectAnswers: metrics.incorrectAnswers,
      averageTime: metrics.interactions > 0 ? metrics.totalTime / metrics.interactions : 0,
      hintsUsed: metrics.hints,
      completed: session.status === 'completed',
      duration: session.endTime ? session.endTime - session.startTime : 0,
    }
  }

  /**
   * @method initializeMetricsIntegration
   * @private
   */
  async initializeMetricsIntegration() {
    try {
      if (!metricsManager.initialized) {
        this.logger.info(
          'Metrics manager not initialized, sessions will work without advanced metrics'
        )
      }
    } catch (error) {
      this.logger.warn('Failed to initialize metrics integration', {
        error: error.message,
      })
    }
  }

  /**
   * @method loadPendingSessions
   * @private
   */
  async loadPendingSessions() {
    try {
      // Carregar sessões pendentes do localStorage
      const pendingKey = 'betina_pending_sessions'
      const pending = localStorage.getItem(pendingKey)

      if (pending) {
        const sessions = JSON.parse(pending)
        sessions.forEach((session) => {
          this.activeSessions.set(session.sessionId, session)
        })

        this.logger.info(`Loaded ${sessions.length} pending sessions`)
      }
    } catch (error) {
      this.logger.warn('Failed to load pending sessions', {
        error: error.message,
      })
    }
  }

  /**
   * @method saveSession
   * @private
   */
  async saveSession(session, metricsReport = null) {
    try {
      // Salvar no localStorage como backup
      const storageKey = `betina_session_${session.sessionId}`
      const sessionData = {
        ...session,
        metricsReport,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem(storageKey, JSON.stringify(sessionData))

      // Salvar no banco de dados se disponível
      if (this.db) {
        await this.db.getModule('storage')?.recordMetrics?.('session', sessionData)
      }
    } catch (error) {
      this.logger.error('Failed to save session', {
        sessionId: session.sessionId,
        error: error.message,
      })
    }
  }
}

export default SessionService
