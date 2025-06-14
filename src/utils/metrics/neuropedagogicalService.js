import { z } from 'zod'
import { logger, API_CONFIG } from '../../config/api-config.js'
import databaseService from '../../database/core/DatabaseService.js'

class NeuropedagogicalService {  constructor() {
    // Fallback para ambiente Node.js
    let env = {}
    try {
      env = import.meta.env || {}
    } catch {
      env = process.env || {}
    }
    this.retryAttempts = parseInt(env.VITE_API_RETRY_ATTEMPTS || env.API_RETRY_ATTEMPTS || '3')
    this.timeout = parseInt(env.VITE_API_TIMEOUT || env.API_TIMEOUT || '5000')

    this.paramsSchema = z.object({
      userId: z.string().min(1).optional(),
      gameId: z.string().min(1).optional(),
      sessionId: z.string().min(1).optional(),
      limit: z.number().int().min(1).optional(),
      timeframe: z
        .string()
        .regex(/^\d+[dwmy]$/)
        .optional(),
      patternType: z.string().min(1).optional(),
      cognitiveDomain: z.string().min(1).optional(),
    })

    this.profileSchema = z.object({
      user_id: z.string().min(1),
      game_id: z.string().min(1).optional(),
      processing_speed: z.number().min(0).max(100).optional(),
      attention_span: z.number().min(0).max(100).optional(),
      working_memory: z.number().min(0).max(100).optional(),
      pattern_recognition: z.number().min(0).max(100).optional(),
      visual_learner_score: z.number().min(0).max(100).optional(),
      auditory_learner_score: z.number().min(0).max(100).optional(),
      kinesthetic_learner_score: z.number().min(0).max(100).optional(),
      consistency_score: z.number().min(0).max(100).optional(),
    })
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    let attempts = 0
    while (attempts <= this.retryAttempts) {
      try {
        attempts++
        logger.info('Iniciando requisição', {
          endpoint,
          method: options.method || 'GET',
          attempt: attempts,
        })
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)
        const response = await databaseService.authenticatedFetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...API_CONFIG.DEFAULT_HEADERS,
            ...options.headers,
          },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || response.statusText
          if (
            (response.status === 429 || response.status >= 500) &&
            attempts <= this.retryAttempts
          ) {
            const delay = 1000 * Math.pow(2, attempts - 1)
            logger.warn('Erro na requisição, tentando novamente', {
              endpoint,
              status: response.status,
              error: errorMessage,
              delay,
            })
            await this.delay(delay)
            continue
          }
          throw new Error(`HTTP error: ${response.status} ${errorMessage}`)
        }
        const result = await response.json()
        logger.info('Requisição bem-sucedida', { endpoint, status: response.status })
        return result
      } catch (error) {
        if (error.name === 'AbortError') {
          logger.error('Requisição atingiu timeout', { endpoint, timeout: this.timeout })
          throw new Error(`Timeout após ${this.timeout}ms`)
        }
        if (attempts <= this.retryAttempts) {
          const delay = 1000 * Math.pow(2, attempts - 1)
          logger.warn('Erro na requisição, tentando novamente', {
            endpoint,
            error: error.message,
            delay,
          })
          await this.delay(delay)
          continue
        }
        logger.error('Erro na requisição após tentativas', { endpoint, error: error.message })
        throw error
      }
    }
  }

  async getCognitiveProfiles(userId, gameId = null, limit = null) {
    this.paramsSchema.parse({ userId, gameId, limit })
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (gameId) params.append('game_id', gameId)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(`/cognitive-profiles${queryString ? `?${queryString}` : ''}`)
  }

  async createCognitiveProfile(profileData) {
    this.profileSchema.parse(profileData)
    return this.makeRequest('/cognitive-profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    })
  }

  async getMLFeatures(userId, sessionId = null, limit = null) {
    this.paramsSchema.parse({ userId, sessionId, limit })
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (sessionId) params.append('session_id', sessionId)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(`/ml-features${queryString ? `?${queryString}` : ''}`)
  }

  async getNeuropedagogicalInsights(userId, timeframe = '30d', limit = null) {
    this.paramsSchema.parse({ userId, timeframe, limit })
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (timeframe) params.append('timeframe', timeframe)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(`/neuropedagogical-insights${queryString ? `?${queryString}` : ''}`)
  }

  async getLearningPatterns(userId, patternType = null, limit = null) {
    this.paramsSchema.parse({ userId, patternType, limit })
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (patternType) params.append('pattern_type', patternType)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(`/learning-patterns${queryString ? `?${queryString}` : ''}`)
  }

  async getEngagementMetrics(userId, sessionId = null, limit = null) {
    this.paramsSchema.parse({ userId, sessionId, limit })
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (sessionId) params.append('session_id', sessionId)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(`/engagement-metrics${queryString ? `?${queryString}` : ''}`)
  }

  async getNeuroplasticityTracking(userId, cognitiveDomain = null, limit = null) {
    this.paramsSchema.parse({ userId, cognitiveDomain, limit })
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (cognitiveDomain) params.append('cognitive_domain', cognitiveDomain)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(`/neuroplasticity-tracking${queryString ? `?${queryString}` : ''}`)
  }

  async getDashboardMetrics(userId, timeframe = '30d') {
    this.paramsSchema.parse({ userId, timeframe })
    const params = new URLSearchParams()
    if (timeframe) params.append('timeframe', timeframe)
    const queryString = params.toString()
    return this.makeRequest(`/dashboard-metrics/${userId}${queryString ? `?${queryString}` : ''}`)
  }

  async getUserGameSessions(userId, gameId = null, limit = null) {
    this.paramsSchema.parse({ userId, gameId, limit })
    const params = new URLSearchParams()
    if (gameId) params.append('game_id', gameId)
    if (limit) params.append('limit', limit)
    const queryString = params.toString()
    return this.makeRequest(
      `${API_CONFIG.ENDPOINTS.gameSessions}/${userId}${queryString ? `?${queryString}` : ''}`
    )
  }

  processPerformanceData(sessions) {
    if (!sessions?.length) {
      return { labels: [], datasets: [], trend: 0 }
    }
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.created_at).toLocaleDateString('pt-BR')
      acc[date] = acc[date] || []
      acc[date].push(session)
      return acc
    }, {})
    const labels = Object.keys(sessionsByDate).sort()
    const scoreData = labels.map((date) => {
      const dailySessions = sessionsByDate[date]
      return dailySessions.reduce((sum, s) => sum + (s.score || 0), 0) / dailySessions.length
    })
    const accuracyData = labels.map((date) => {
      const dailySessions = sessionsByDate[date]
      return dailySessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / dailySessions.length
    })
    const trend = scoreData.length >= 2 ? scoreData[scoreData.length - 1] - scoreData[0] : 0
    return {
      labels,
      datasets: [
        {
          label: 'Pontuação Média',
          data: scoreData,
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Precisão Média (%)',
          data: accuracyData,
          borderColor: '#50C878',
          backgroundColor: 'rgba(80, 200, 120, 0.1)',
          tension: 0.4,
        },
      ],
      trend: Math.round(trend),
    }
  }

  processGameDistribution(sessions) {
    if (!sessions?.length) {
      return { labels: [], datasets: [], difficultyBreakdown: {} }
    }
    const gameCount = sessions.reduce((acc, session) => {
      acc[session.game_id] = (acc[session.game_id] || 0) + 1
      return acc
    }, {})
    const difficultyBreakdown = sessions.reduce((acc, session) => {
      const game = session.game_id
      const difficulty = session.difficulty?.toLowerCase() || 'unknown'
      acc[game] = acc[game] || { easy: 0, medium: 0, hard: 0, unknown: 0 }
      acc[game][difficulty]++
      return acc
    }, {})
    const gameNames = {
      'letter-recognition': 'Reconhecimento de Letras',
      'number-sequence': 'Sequência Numérica',
      'shape-matching': 'Combinação de Formas',
      'color-memory': 'Memória de Cores',
      'word-building': 'Construção de Palavras',
      'pattern-memory': 'Memória de Padrões',
      'sound-recognition': 'Reconhecimento de Sons',
      'music-creation': 'Criação Musical',
      'paint-creation': 'Pintura Criativa',
    }
    return {
      labels: Object.keys(gameCount).map((gameId) => gameNames[gameId] || gameId),
      datasets: [
        {
          label: 'Sessões por Jogo',
          data: Object.values(gameCount),
          backgroundColor: [
            '#4A90E2',
            '#6B48FF',
            '#F093FB',
            '#FF9500',
            '#50C878',
            '#00C4B4',
            '#FF6B6B',
            '#4ECDC4',
            '#96CEB4',
          ],
        },
      ],
      difficultyBreakdown,
    }
  }

  processCognitiveProfile(cognitiveData) {
    if (!cognitiveData?.length) {
      return { labels: [], datasets: [], averageScore: 0 }
    }
    const labels = [
      'Velocidade de Processamento',
      'Atenção',
      'Memória de Trabalho',
      'Reconhecimento de Padrões',
      'Aprendizado Visual',
      'Aprendizado Auditivo',
      'Aprendizado Cinestésico',
      'Consistência',
    ]
    const averages = cognitiveData.reduce(
      (acc, profile) => {
        acc.processing_speed += profile.processing_speed || 0
        acc.attention_span += profile.attention_span || 0
        acc.working_memory += profile.working_memory || 0
        acc.pattern_recognition += profile.pattern_recognition || 0
        acc.visual_learner_score += profile.visual_learner_score || 0
        acc.auditory_learner_score += profile.auditory_learner_score || 0
        acc.kinesthetic_learner_score += profile.kinesthetic_learner_score || 0
        acc.consistency_score += profile.consistency_score || 0
        return acc
      },
      {
        processing_speed: 0,
        attention_span: 0,
        working_memory: 0,
        pattern_recognition: 0,
        visual_learner_score: 0,
        auditory_learner_score: 0,
        kinesthetic_learner_score: 0,
        consistency_score: 0,
      }
    )
    const count = cognitiveData.length
    const data = [
      averages.processing_speed / count,
      averages.attention_span / count,
      averages.working_memory / count,
      averages.pattern_recognition / count,
      averages.visual_learner_score / count,
      averages.auditory_learner_score / count,
      averages.kinesthetic_learner_score / count,
      averages.consistency_score / count,
    ].map(Math.round)
    const averageScore = data.reduce((sum, v) => sum + v, 0) / data.length
    return {
      labels,
      datasets: [
        {
          label: 'Perfil Cognitivo',
          data,
          borderColor: '#6B48FF',
          backgroundColor: 'rgba(107, 72, 255, 0.2)',
          pointBackgroundColor: '#6B48FF',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6B48FF',
        },
      ],
      averageScore: Math.round(averageScore),
    }
  }

  processEngagementMetrics(engagementData) {
    if (!engagementData?.length) {
      return {
        focus_duration: 0,
        total_interactions: 0,
        avg_interaction_time: 0,
        frustration_level: 0,
        attention_drops: 0,
        help_seeking: 0,
        periodBreakdown: {},
      }
    }
    const periodBreakdown = {
      morning: { count: 0, focus: 0 },
      afternoon: { count: 0, focus: 0 },
      night: { count: 0, focus: 0 },
    }
    const metrics = engagementData.reduce(
      (acc, item) => {
        const timestamp = new Date(item.created_at || Date.now())
        const hour = timestamp.getHours()
        const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'night'
        periodBreakdown[period].count++
        periodBreakdown[period].focus += item.flow_state_duration || 0
        acc.focus_duration += item.flow_state_duration || 0
        acc.total_interactions += item.total_interactions || 0
        acc.avg_interaction_time += item.avg_interaction_time || 0
        acc.attention_drops += item.attention_drops || 0
        acc.help_seeking += item.help_seeking_frequency || 0
        acc.frustration_level += Array.isArray(item.frustration_indicators)
          ? item.frustration_indicators.length
          : 0
        return acc
      },
      {
        focus_duration: 0,
        total_interactions: 0,
        avg_interaction_time: 0,
        frustration_level: 0,
        attention_drops: 0,
        help_seeking: 0,
      }
    )
    const count = engagementData.length
    Object.keys(periodBreakdown).forEach((p) => {
      periodBreakdown[p].focus = periodBreakdown[p].count
        ? Math.round(periodBreakdown[p].focus / periodBreakdown[p].count)
        : 0
    })
    return {
      focus_duration: Math.round(metrics.focus_duration / count),
      total_interactions: Math.round(metrics.total_interactions / count),
      avg_interaction_time: Math.round((metrics.avg_interaction_time / count) * 100) / 100,
      frustration_level: Math.round(metrics.frustration_level / count),
      attention_drops: Math.round(metrics.attention_drops / count),
      help_seeking: Math.round(metrics.help_seeking / count),
      period_breakdown: periodBreakdown,
    }
  }

  delay(ms) {    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export { NeuropedagogicalService }
export default NeuropedagogicalService
