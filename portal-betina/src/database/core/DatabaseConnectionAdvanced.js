import performanceMonitor from '../../utils/metrics/performanceMonitor.js'

/**
 * @class DatabaseConnectionAdvanced
 * @description Sistema avançado de conexão com banco de dados
 * Baseado no arquivo BKP com funcionalidades completas para Portal Betina
 */
class DatabaseConnectionAdvanced {
  constructor(config = {}) {
    this.config = {
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      maxRetryDelay: 10000,
      healthCheckInterval: 60000,
      enableConnectionPooling: true,
      enableRequestDeduplication: true,
      enableAdaptiveTimeout: true,
      enableOfflineSupport: true,
      ...config,
    }

    // Estado da conexão
    this.connectionState = {
      isOnline: navigator.onLine,
      isApiHealthy: false,
      lastHealthCheck: null,
      connectionQuality: 'unknown', // good, fair, poor
      latency: null,
      errors: [],
    }

    // Pool de conexões
    this.connectionPool = {
      active: new Map(),
      idle: new Set(),
      maxConnections: 10,
      currentConnections: 0,
    }

    // Sistema de deduplicação
    this.requestQueue = new Map()
    this.requestHistory = new Map()

    // Monitoramento e métricas
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      retries: 0,
      averageLatency: 0,
      connectionPoolHits: 0,
      deduplicationHits: 0,
    }

    // Timeout adaptativo
    this.adaptiveTimeout = {
      current: this.config.timeout,
      history: [],
      adjustmentFactor: 0.1,
    }

    // Estratégias offline
    this.offlineStrategies = new Map()
    this.offlineQueue = []

    // Logger
    this.logger = performanceMonitor

    // Inicializar monitoramento
    this.initializeMonitoring()
    this.startHealthChecks()

    this.logger.info('🌐 Advanced DatabaseConnection initialized', {
      apiUrl: this.config.apiUrl,
      features: [
        'connection-pooling',
        'request-deduplication',
        'adaptive-timeout',
        'health-monitoring',
        'offline-support',
        'quality-assessment',
      ],
    })
  }

  /**
   * @method authenticatedFetch
   * @async
   * @description Executa requisição autenticada com funcionalidades avançadas
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição
   * @returns {Promise<Response>} Resposta da requisição
   */
  async authenticatedFetch(url, options = {}) {
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    try {
      // Preparar requisição
      const requestConfig = this.prepareRequest(url, options, requestId)

      // Verificar deduplicação
      if (this.config.enableRequestDeduplication) {
        const deduplicationKey = this.generateDeduplicationKey(requestConfig)
        const duplicateRequest = this.requestQueue.get(deduplicationKey)

        if (duplicateRequest) {
          this.metrics.deduplicationHits++
          this.logger.debug('🔄 Request deduplication hit', {
            requestId,
            deduplicationKey,
          })
          return duplicateRequest
        }
      }

      // Verificar estado da conexão
      await this.ensureConnection()

      // Executar requisição com retry inteligente
      const promise = this.executeWithRetry(requestConfig, requestId)

      // Armazenar na fila de deduplicação
      if (this.config.enableRequestDeduplication) {
        const deduplicationKey = this.generateDeduplicationKey(requestConfig)
        this.requestQueue.set(deduplicationKey, promise)

        // Limpar após conclusão
        promise.finally(() => {
          this.requestQueue.delete(deduplicationKey)
        })
      }

      const response = await promise

      // Registrar sucesso
      this.recordSuccess(Date.now() - startTime, requestId)

      return response
    } catch (error) {
      // Registrar falha
      this.recordFailure(error, Date.now() - startTime, requestId)

      // Tentar estratégia offline se disponível
      if (!navigator.onLine && this.config.enableOfflineSupport) {
        return this.handleOfflineRequest(url, options, requestId)
      }

      throw error
    }
  }

  /**
   * @method executeWithRetry
   * @async
   * @description Executa requisição com retry inteligente
   * @param {Object} requestConfig - Configuração da requisição
   * @param {string} requestId - ID da requisição
   * @returns {Promise<Response>} Resposta da requisição
   */
  async executeWithRetry(requestConfig, requestId) {
    let lastError
    let attempt = 1

    while (attempt <= this.config.retryAttempts) {
      try {
        this.logger.debug(`🔄 Request attempt ${attempt}`, {
          requestId,
          url: requestConfig.url,
          attempt,
          maxAttempts: this.config.retryAttempts,
        })

        // Obter conexão do pool
        const connection = await this.getConnection()

        // Executar requisição com timeout adaptativo
        const timeout = this.config.enableAdaptiveTimeout
          ? this.calculateAdaptiveTimeout()
          : this.config.timeout

        const response = await this.executeRequest(requestConfig, timeout, connection)

        // Liberar conexão
        this.releaseConnection(connection)

        // Atualizar timeout adaptativo em caso de sucesso
        if (this.config.enableAdaptiveTimeout) {
          this.updateAdaptiveTimeout(Date.now() - requestConfig.startTime, true)
        }

        return response
      } catch (error) {
        lastError = error
        this.metrics.retries++

        // Não fazer retry em certos tipos de erro
        if (this.shouldNotRetry(error)) {
          throw error
        }

        // Último attempt - não fazer delay
        if (attempt === this.config.retryAttempts) {
          throw error
        }

        // Calcular delay do retry com backoff exponencial
        const delay = this.calculateRetryDelay(attempt)

        this.logger.warn(`⚠️ Request failed, retrying in ${delay}ms`, {
          requestId,
          attempt,
          error: error.message,
          delay,
        })

        // Atualizar timeout adaptativo em caso de falha
        if (this.config.enableAdaptiveTimeout) {
          this.updateAdaptiveTimeout(Date.now() - requestConfig.startTime, false)
        }

        await this.delay(delay)
        attempt++
      }
    }

    throw lastError
  }

  /**
   * @method executeRequest
   * @async
   * @description Executa a requisição HTTP com timeout
   * @param {Object} requestConfig - Configuração da requisição
   * @param {number} timeout - Timeout em ms
   * @param {Object} connection - Conexão do pool
   * @returns {Promise<Response>} Resposta da requisição
   */
  async executeRequest(requestConfig, timeout, connection) {
    return Promise.race([
      // Requisição principal
      fetch(requestConfig.url, {
        ...requestConfig.options,
        signal: this.createAbortSignal(timeout),
      }),

      // Timeout
      new Promise((_, reject) => {
        setTimeout(() => {
          this.metrics.timeouts++
          const error = new Error(`Request timeout after ${timeout}ms`)
          error.isTimeout = true
          reject(error)
        }, timeout)
      }),
    ])
  }

  /**
   * @method getConnection
   * @async
   * @description Obtém conexão do pool
   * @returns {Promise<Object>} Objeto de conexão
   */
  async getConnection() {
    if (!this.config.enableConnectionPooling) {
      return { id: 'direct', type: 'direct' }
    }

    // Verificar conexões idle
    if (this.connectionPool.idle.size > 0) {
      const connection = this.connectionPool.idle.values().next().value
      this.connectionPool.idle.delete(connection)
      this.connectionPool.active.set(connection.id, connection)
      this.metrics.connectionPoolHits++
      return connection
    }

    // Criar nova conexão se possível
    if (this.connectionPool.currentConnections < this.connectionPool.maxConnections) {
      const connection = {
        id: this.generateConnectionId(),
        type: 'pooled',
        created: Date.now(),
        lastUsed: Date.now(),
        requestCount: 0,
      }

      this.connectionPool.active.set(connection.id, connection)
      this.connectionPool.currentConnections++

      return connection
    }

    // Aguardar conexão disponível
    return this.waitForConnection()
  }

  /**
   * @method releaseConnection
   * @description Libera conexão de volta ao pool
   * @param {Object} connection - Conexão a ser liberada
   */
  releaseConnection(connection) {
    if (!this.config.enableConnectionPooling || connection.type === 'direct') {
      return
    }

    connection.lastUsed = Date.now()
    connection.requestCount++

    // Mover para idle se ainda válida
    if (this.isConnectionValid(connection)) {
      this.connectionPool.active.delete(connection.id)
      this.connectionPool.idle.add(connection)
    } else {
      // Remover conexão inválida
      this.connectionPool.active.delete(connection.id)
      this.connectionPool.currentConnections--
    }
  }

  /**
   * @method checkHealth
   * @async
   * @description Verifica saúde da API
   * @returns {Promise<Object>} Status de saúde
   */
  async checkHealth() {
    const startTime = Date.now()

    try {
      const healthUrl = `${this.config.apiUrl}/health`
      const response = await fetch(healthUrl, {
        method: 'GET',
        timeout: 10000,
        headers: {
          Accept: 'application/json',
        },
      })

      const latency = Date.now() - startTime
      const isHealthy = response.ok

      // Atualizar estado da conexão
      this.connectionState.isApiHealthy = isHealthy
      this.connectionState.lastHealthCheck = Date.now()
      this.connectionState.latency = latency
      this.connectionState.connectionQuality = this.assessConnectionQuality(latency, isHealthy)

      // Limpar erros se saudável
      if (isHealthy) {
        this.connectionState.errors = []
      }

      this.logger.info('🏥 API health check completed', {
        isHealthy,
        latency,
        quality: this.connectionState.connectionQuality,
        url: healthUrl,
      })

      return {
        isHealthy,
        latency,
        quality: this.connectionState.connectionQuality,
        timestamp: Date.now(),
      }
    } catch (error) {
      this.connectionState.isApiHealthy = false
      this.connectionState.lastHealthCheck = Date.now()
      this.connectionState.errors.push({
        timestamp: Date.now(),
        error: error.message,
      })

      this.logger.error('❌ API health check failed', {
        error: error.message,
        latency: Date.now() - startTime,
      })

      return {
        isHealthy: false,
        error: error.message,
        timestamp: Date.now(),
      }
    }
  }

  /**
   * @method handleOfflineRequest
   * @async
   * @description Manipula requisições offline
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição
   * @param {string} requestId - ID da requisição
   * @returns {Promise<Response>} Resposta ou fallback
   */
  async handleOfflineRequest(url, options, requestId) {
    this.logger.warn('📴 Handling offline request', {
      requestId,
      url,
      method: options.method || 'GET',
    })

    // Verificar estratégia offline específica
    const strategy = this.offlineStrategies.get(url) || this.getDefaultOfflineStrategy()

    switch (strategy.type) {
      case 'cache':
        return this.getFromOfflineCache(url, options)

      case 'queue':
        return this.queueForLater(url, options, requestId)

      case 'mock':
        return this.getMockResponse(url, options)

      case 'fallback':
        return strategy.fallback(url, options, requestId)

      default:
        throw new Error('Network unavailable and no offline strategy configured')
    }
  }

  /**
   * @method getStatus
   * @description Obtém status detalhado da conexão
   * @returns {Object} Status completo
   */
  getStatus() {
    const total = this.metrics.totalRequests
    const successRate =
      total > 0 ? ((this.metrics.successfulRequests / total) * 100).toFixed(2) + '%' : '0%'

    return {
      // Estado da conexão
      connection: {
        ...this.connectionState,
        isConnected: this.connectionState.isOnline && this.connectionState.isApiHealthy,
      },

      // Pool de conexões
      pool: {
        enabled: this.config.enableConnectionPooling,
        active: this.connectionPool.active.size,
        idle: this.connectionPool.idle.size,
        total: this.connectionPool.currentConnections,
        max: this.connectionPool.maxConnections,
        utilization:
          (
            (this.connectionPool.currentConnections / this.connectionPool.maxConnections) *
            100
          ).toFixed(1) + '%',
      },

      // Métricas
      metrics: {
        ...this.metrics,
        successRate,
        averageLatency: this.connectionState.latency || 0,
        pendingRequests: this.requestQueue.size,
        queuedOfflineRequests: this.offlineQueue.length,
      },

      // Timeout adaptativo
      adaptive: {
        enabled: this.config.enableAdaptiveTimeout,
        currentTimeout: this.adaptiveTimeout.current,
        baseTimeout: this.config.timeout,
        adjustments: this.adaptiveTimeout.history.length,
      },

      // Configuração
      config: {
        apiUrl: this.config.apiUrl,
        timeout: this.config.timeout,
        retryAttempts: this.config.retryAttempts,
        features: this.getEnabledFeatures(),
      },

      // Saúde geral
      health: {
        isHealthy: this.isHealthy(),
        score: this.calculateHealthScore(),
        issues: this.getHealthIssues(),
        recommendations: this.getHealthRecommendations(),
      },
    }
  }

  // ============== MÉTODOS AUXILIARES ==============

  /**
   * @method prepareRequest
   * @description Prepara configuração da requisição
   */
  prepareRequest(url, options, requestId) {
    const fullUrl = url.startsWith('http') ? url : `${this.config.apiUrl}${url}`

    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Adicionar token de autenticação se disponível
    const token = this.getAuthToken()
    if (token) {
      requestOptions.headers['Authorization'] = `Bearer ${token}`
    }

    return {
      url: fullUrl,
      options: requestOptions,
      startTime: Date.now(),
      requestId,
    }
  }

  /**
   * @method generateDeduplicationKey
   * @description Gera chave para deduplicação de requisições
   */
  generateDeduplicationKey(requestConfig) {
    const { url, options } = requestConfig
    const method = options.method || 'GET'
    const body = options.body || ''

    // Criar hash simples baseado na requisição
    const key = `${method}:${url}:${body}`
    return btoa(key)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32)
  }

  /**
   * @method calculateAdaptiveTimeout
   * @description Calcula timeout adaptativo baseado no histórico
   */
  calculateAdaptiveTimeout() {
    if (this.adaptiveTimeout.history.length < 5) {
      return this.config.timeout
    }

    // Calcular percentil 95 dos tempos de resposta
    const sortedTimes = this.adaptiveTimeout.history
      .slice(-20) // Últimas 20 requisições
      .sort((a, b) => a - b)

    const p95Index = Math.floor(sortedTimes.length * 0.95)
    const p95Time = sortedTimes[p95Index]

    // Adicionar margem de segurança
    const adaptiveTimeout = Math.min(
      Math.max(p95Time * 2, this.config.timeout * 0.5),
      this.config.timeout * 3
    )

    this.adaptiveTimeout.current = adaptiveTimeout
    return adaptiveTimeout
  }

  /**
   * @method updateAdaptiveTimeout
   * @description Atualiza histórico de timeout adaptativo
   */
  updateAdaptiveTimeout(responseTime, success) {
    if (success) {
      this.adaptiveTimeout.history.push(responseTime)

      // Manter apenas os últimos 50 registros
      if (this.adaptiveTimeout.history.length > 50) {
        this.adaptiveTimeout.history.shift()
      }
    }
  }

  /**
   * @method calculateRetryDelay
   * @description Calcula delay do retry com backoff exponencial
   */
  calculateRetryDelay(attempt) {
    const baseDelay = this.config.retryDelay
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 1000 // Adicionar jitter

    return Math.min(exponentialDelay + jitter, this.config.maxRetryDelay)
  }

  /**
   * @method shouldNotRetry
   * @description Determina se não deve fazer retry
   */
  shouldNotRetry(error) {
    // Não fazer retry para erros 4xx (exceto 408, 429)
    if (error.status >= 400 && error.status < 500) {
      return ![408, 429].includes(error.status)
    }

    // Não fazer retry para erros de rede específicos
    const nonRetryableErrors = ['ENOTFOUND', 'ECONNREFUSED']
    return nonRetryableErrors.some((code) => error.message.includes(code))
  }

  /**
   * @method assessConnectionQuality
   * @description Avalia qualidade da conexão
   */
  assessConnectionQuality(latency, isHealthy) {
    if (!isHealthy) return 'poor'

    if (latency < 100) return 'excellent'
    if (latency < 300) return 'good'
    if (latency < 1000) return 'fair'
    return 'poor'
  }

  /**
   * @method initializeMonitoring
   * @description Inicializa monitoramento de rede
   */
  initializeMonitoring() {
    // Monitorar mudanças na conectividade
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.connectionState.isOnline = true
        this.logger.info('🌐 Network connection restored')
        this.processOfflineQueue()
      })

      window.addEventListener('offline', () => {
        this.connectionState.isOnline = false
        this.logger.warn('📴 Network connection lost')
      })
    }
  }

  /**
   * @method startHealthChecks
   * @description Inicia verificações periódicas de saúde
   */
  startHealthChecks() {
    this.healthCheckInterval = setInterval(() => {
      this.checkHealth().catch((error) => {
        this.logger.error('Health check failed', { error: error.message })
      })
    }, this.config.healthCheckInterval)
  }

  /**
   * @method processOfflineQueue
   * @async
   * @description Processa fila de requisições offline
   */
  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return

    this.logger.info('🔄 Processing offline queue', {
      queueSize: this.offlineQueue.length,
    })

    const queue = [...this.offlineQueue]
    this.offlineQueue = []

    for (const queuedRequest of queue) {
      try {
        await this.authenticatedFetch(queuedRequest.url, queuedRequest.options)

        if (queuedRequest.callback) {
          queuedRequest.callback(null, 'success')
        }
      } catch (error) {
        this.logger.error('Failed to process queued request', {
          url: queuedRequest.url,
          error: error.message,
        })

        if (queuedRequest.callback) {
          queuedRequest.callback(error, null)
        }
      }
    }
  }

  /**
   * @method recordSuccess
   * @description Registra sucesso de requisição
   */
  recordSuccess(responseTime, requestId) {
    this.metrics.totalRequests++
    this.metrics.successfulRequests++

    // Atualizar latência média
    this.updateAverageLatency(responseTime)

    this.logger.debug('✅ Request completed successfully', {
      requestId,
      responseTime,
      successRate:
        ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(2) + '%',
    })
  }

  /**
   * @method recordFailure
   * @description Registra falha de requisição
   */
  recordFailure(error, responseTime, requestId) {
    this.metrics.totalRequests++
    this.metrics.failedRequests++

    // Adicionar erro ao histórico
    this.connectionState.errors.push({
      timestamp: Date.now(),
      error: error.message,
      requestId,
    })

    // Manter apenas os últimos 50 erros
    if (this.connectionState.errors.length > 50) {
      this.connectionState.errors.shift()
    }

    this.logger.warn('⚠️ Request failed', {
      requestId,
      error: error.message,
      responseTime,
      failureRate:
        ((this.metrics.failedRequests / this.metrics.totalRequests) * 100).toFixed(2) + '%',
    })
  }

  /**
   * @method updateAverageLatency
   * @description Atualiza latência média
   */
  updateAverageLatency(responseTime) {
    if (this.metrics.averageLatency === 0) {
      this.metrics.averageLatency = responseTime
    } else {
      this.metrics.averageLatency = (this.metrics.averageLatency + responseTime) / 2
    }
  }

  // Métodos auxiliares
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  generateConnectionId() {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  createAbortSignal(timeout) {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), timeout)
      return controller.signal
    }
    return undefined
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  getAuthToken() {
    // Implementar obtenção de token conforme necessário
    return null
  }

  ensureConnection() {
    // Verificações básicas de conexão
    if (!navigator.onLine) {
      throw new Error('No network connection')
    }
    return Promise.resolve()
  }

  isConnectionValid(connection) {
    const maxAge = 300000 // 5 minutos
    const maxRequests = 1000

    return Date.now() - connection.created < maxAge && connection.requestCount < maxRequests
  }

  waitForConnection() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.connectionPool.idle.size > 0) {
          clearInterval(checkInterval)
          resolve(this.getConnection())
        }
      }, 100)
    })
  }

  getDefaultOfflineStrategy() {
    return {
      type: 'queue',
      maxQueueSize: 100,
    }
  }

  getFromOfflineCache(url, options) {
    // Implementar cache offline
    throw new Error('Offline cache not implemented')
  }

  queueForLater(url, options, requestId) {
    this.offlineQueue.push({ url, options, requestId, timestamp: Date.now() })
    return Promise.resolve({ queued: true, requestId })
  }

  getMockResponse(url, options) {
    // Implementar resposta mock
    return Promise.resolve(
      new Response('{"mock": true}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  }

  isHealthy() {
    const successRate =
      this.metrics.totalRequests > 0
        ? this.metrics.successfulRequests / this.metrics.totalRequests
        : 1

    return (
      this.connectionState.isOnline &&
      this.connectionState.isApiHealthy &&
      successRate >= 0.8 &&
      this.connectionState.latency < 2000
    )
  }

  calculateHealthScore() {
    let score = 100

    if (!this.connectionState.isOnline) score -= 50
    if (!this.connectionState.isApiHealthy) score -= 30

    const successRate =
      this.metrics.totalRequests > 0
        ? this.metrics.successfulRequests / this.metrics.totalRequests
        : 1

    score -= (1 - successRate) * 30

    if (this.connectionState.latency > 1000) score -= 20

    return Math.max(0, score)
  }

  getHealthIssues() {
    const issues = []

    if (!this.connectionState.isOnline) {
      issues.push('No network connection')
    }

    if (!this.connectionState.isApiHealthy) {
      issues.push('API is unhealthy')
    }

    const successRate =
      this.metrics.totalRequests > 0
        ? this.metrics.successfulRequests / this.metrics.totalRequests
        : 1

    if (successRate < 0.8) {
      issues.push(`Low success rate: ${(successRate * 100).toFixed(1)}%`)
    }

    if (this.connectionState.latency > 2000) {
      issues.push(`High latency: ${this.connectionState.latency}ms`)
    }

    return issues
  }

  getHealthRecommendations() {
    const recommendations = []
    const issues = this.getHealthIssues()

    if (issues.includes('High latency')) {
      recommendations.push('Consider enabling adaptive timeout')
      recommendations.push('Check network connection quality')
    }

    if (issues.includes('Low success rate')) {
      recommendations.push('Increase retry attempts')
      recommendations.push('Check API server status')
    }

    if (issues.includes('No network connection')) {
      recommendations.push('Enable offline support')
      recommendations.push('Implement request queueing')
    }

    return recommendations
  }

  getEnabledFeatures() {
    return [
      this.config.enableConnectionPooling && 'connection-pooling',
      this.config.enableRequestDeduplication && 'request-deduplication',
      this.config.enableAdaptiveTimeout && 'adaptive-timeout',
      this.config.enableOfflineSupport && 'offline-support',
    ].filter(Boolean)
  }

  /**
   * @method close
   * @async
   * @description Fecha conexões e limpa recursos
   */
  async close() {
    // Parar health checks
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    // Limpar pool de conexões
    this.connectionPool.active.clear()
    this.connectionPool.idle.clear()
    this.connectionPool.currentConnections = 0

    // Limpar filas
    this.requestQueue.clear()
    this.offlineQueue = []

    this.logger.info('🔌 DatabaseConnection closed')
  }
}

export default DatabaseConnectionAdvanced
