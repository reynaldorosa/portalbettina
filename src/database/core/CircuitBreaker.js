import performanceMonitor from '../../utils/metrics/performanceMonitor.js'
import sharedLogger from '../../utils/logger.js'

/**
 * @class CircuitBreaker
 * @description Advanced Circuit Breaker implementation with intelligent fallbacks
 * Baseado no arquivo BKP com melhorias para Portal Betina
 */
class CircuitBreaker {
  constructor(config = {}) {
    this.config = {
      failureThreshold: 5,
      timeout: 60000,
      retryTimeout: 10000,      halfOpenMaxCalls: 3,
      monitor: true,
      ...config,
    }

    // Estados possíveis: CLOSED, OPEN, HALF_OPEN
    this.state = 'CLOSED'
    this.failureCount = 0
    this.lastFailureTime = null
    this.successCount = 0
    this.halfOpenCalls = 0
    
    // Usar o logger centralizado
    this.logger = sharedLogger
    
    // Estatísticas avançadas
    this.statistics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      timeouts: 0,
      circuitBreakerActivations: 0,
      averageResponseTime: 0,
      lastStateChange: Date.now(),
      fallbackExecutions: 0,
      recoveryAttempts: 0,
    }

    // Monitoramento e fallbacks
    this.responseTimesHistory = []
    this.stateChangeListeners = []
    this.fallbackStrategies = new Map()
    this.requestQueue = new Map()    // Logger integrado
    this.logger = sharedLogger

    this.logger.info('Advanced CircuitBreaker initialized', {
      state: this.state,
      config: this.config,
    })
  }

  /**
   * @method execute
   * @async
   * @description Execução principal com Circuit Breaker avançado
   * @param {Function} asyncFunction - Função a ser executada
   * @param {Function} fallbackFunction - Função de fallback opcional
   * @param {string} context - Contexto da operação
   * @returns {Promise<*>} Resultado da função
   */
  async execute(asyncFunction, fallbackFunction = null, context = 'operation') {
    this.statistics.totalCalls++
    const startTime = Date.now()

    // Verificar se o circuito está aberto
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.setState('HALF_OPEN')
      } else {
        // Executar fallback se disponível
        if (fallbackFunction) {
          this.statistics.fallbackExecutions++
          this.logger.warn('🔄 Circuit breaker OPEN - executing fallback', {
            context,
            state: this.state,
            failures: this.failureCount,
          })
          return await fallbackFunction()
        }

        const error = new Error(`Circuit breaker is OPEN for ${context}`)
        error.circuitBreakerOpen = true
        throw error
      }
    }

    // Verificar limite de calls em HALF_OPEN
    if (this.state === 'HALF_OPEN') {
      if (this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        const error = new Error(`Circuit breaker HALF_OPEN call limit exceeded for ${context}`)
        error.circuitBreakerHalfOpen = true
        throw error
      }
      this.halfOpenCalls++
    }

    try {
      // Executar com timeout inteligente
      const result = await this.executeWithTimeout(asyncFunction, context)

      // Registrar sucesso
      this.recordSuccess(Date.now() - startTime)

      return result
    } catch (error) {
      // Registrar falha
      this.recordFailure(error, context)

      // Tentar fallback em caso de erro
      if (fallbackFunction && !error.circuitBreakerOpen) {
        this.statistics.fallbackExecutions++
        this.logger.warn('⚠️ Primary function failed - executing fallback', {
          context,
          error: error.message,
          state: this.state,
        })

        try {
          return await fallbackFunction()
        } catch (fallbackError) {
          this.logger.error('❌ Fallback function also failed', {
            context,
            primaryError: error.message,
            fallbackError: fallbackError.message,
          })
          throw fallbackError
        }
      }

      throw error
    }
  }

  /**
   * @method executeWithTimeout
   * @async
   * @description Execução com timeout inteligente
   * @param {Function} asyncFunction - Função a ser executada
   * @param {string} context - Contexto da operação
   * @returns {Promise<*>} Resultado da função
   */
  async executeWithTimeout(asyncFunction, context) {
    return Promise.race([
      asyncFunction(),
      new Promise((_, reject) => {
        setTimeout(() => {
          this.statistics.timeouts++
          reject(new Error(`Request timeout after ${this.config.timeout}ms for ${context}`))
        }, this.config.timeout)
      }),
    ])
  }

  /**
   * @method deduplicatedExecute
   * @async
   * @description Execução com deduplicação de requests
   * @param {string} key - Chave única para deduplicação
   * @param {Function} asyncFunction - Função a ser executada
   * @param {Function} fallbackFunction - Função de fallback opcional
   * @returns {Promise<*>} Resultado da função
   */
  async deduplicatedExecute(key, asyncFunction, fallbackFunction = null) {
    if (this.requestQueue.has(key)) {
      this.logger.debug('🔄 Request deduplication hit', { key })
      return this.requestQueue.get(key)
    }

    const promise = this.execute(asyncFunction, fallbackFunction, key).finally(() => {
      this.requestQueue.delete(key)
    })

    this.requestQueue.set(key, promise)
    return promise
  }

  /**
   * @method recordSuccess
   * @description Registra um sucesso na execução
   * @param {number} responseTime - Tempo de resposta em ms
   */
  recordSuccess(responseTime) {
    this.statistics.successfulCalls++
    this.updateAverageResponseTime(responseTime)

    if (this.state === 'HALF_OPEN') {
      this.successCount++
      this.halfOpenCalls--

      // Verificar se pode fechar o circuito
      if (this.successCount >= this.config.halfOpenMaxCalls) {
        this.reset()
      }
    }

    this.logger.debug('✅ Circuit breaker success recorded', {
      state: this.state,
      responseTime,
      successCount: this.successCount,
    })
  }

  /**
   * @method recordFailure
   * @description Registra uma falha na execução
   * @param {Error} error - Erro ocorrido
   * @param {string} context - Contexto da operação
   */
  recordFailure(error, context = 'unknown') {
    this.statistics.failedCalls++
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.state === 'HALF_OPEN') {
      this.halfOpenCalls--
      this.setState('OPEN')
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.setState('OPEN')
      this.statistics.circuitBreakerActivations++
    }

    this.logger.warn('⚠️ Circuit breaker failure recorded', {
      context,
      error: error.message,
      state: this.state,
      failures: this.failureCount,
      threshold: this.config.failureThreshold,
    })
  }

  /**
   * @method shouldAttemptReset
   * @description Verifica se deve tentar resetar o circuit breaker
   * @returns {boolean} Se deve tentar reset
   */
  shouldAttemptReset() {
    if (this.state !== 'OPEN') return false

    const timeSinceFailure = Date.now() - this.lastFailureTime
    return timeSinceFailure >= this.config.retryTimeout
  }

  /**
   * @method setState
   * @description Define o estado do circuit breaker
   * @param {string} newState - Novo estado (CLOSED, OPEN, HALF_OPEN)
   */
  setState(newState) {
    const oldState = this.state
    this.state = newState
    this.statistics.lastStateChange = Date.now()

    if (newState === 'HALF_OPEN') {
      this.halfOpenCalls = 0
      this.successCount = 0
      this.statistics.recoveryAttempts++
    }

    // Notificar listeners
    this.notifyStateChange(oldState, newState)

    this.logger.info(`🔄 Circuit breaker state changed: ${oldState} → ${newState}`, {
      timestamp: new Date().toISOString(),
      failures: this.failureCount,
      successCount: this.successCount,
    })
  }

  /**
   * @method reset
   * @description Reseta o circuit breaker para estado CLOSED
   */
  reset() {
    this.setState('CLOSED')
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = null
    this.halfOpenCalls = 0

    this.logger.info('✅ Circuit breaker reset to CLOSED state')
  }

  /**
   * @method getState
   * @description Obtém o estado atual do circuit breaker
   * @returns {Object} Estado e estatísticas
   */
  getState() {
    const successRate =
      this.statistics.totalCalls > 0
        ? ((this.statistics.successfulCalls / this.statistics.totalCalls) * 100).toFixed(2)
        : '0.00'

    return {
      state: this.state,
      failures: this.failureCount,
      successes: this.successCount,
      lastFailure: this.lastFailureTime,
      halfOpenCalls: this.halfOpenCalls,
      statistics: {
        ...this.statistics,
        successRate: `${successRate}%`,
        uptime: Date.now() - this.statistics.lastStateChange,
      },
      isHealthy: this.state === 'CLOSED' && this.failureCount < this.config.failureThreshold,
    }
  }

  /**
   * @method getStats
   * @description Obtém estatísticas detalhadas
   * @returns {Object} Estatísticas completas
   */
  getStats() {
    return {
      ...this.getState(),
      config: this.config,
      responseTimeHistory: this.responseTimesHistory.slice(-50), // Últimas 50
      queueSize: this.requestQueue.size,
    }
  }

  /**
   * @method updateAverageResponseTime
   * @description Atualiza tempo médio de resposta
   * @param {number} responseTime - Tempo de resposta em ms
   */
  updateAverageResponseTime(responseTime) {
    this.responseTimesHistory.push({
      time: responseTime,
      timestamp: Date.now(),
    })

    // Manter apenas os últimos 100 registros
    if (this.responseTimesHistory.length > 100) {
      this.responseTimesHistory.shift()
    }

    // Calcular média dos últimos 50 registros
    const recent = this.responseTimesHistory.slice(-50)
    const sum = recent.reduce((acc, entry) => acc + entry.time, 0)
    this.statistics.averageResponseTime = Math.round(sum / recent.length)
  }

  /**
   * @method addStateChangeListener
   * @description Adiciona listener para mudanças de estado
   * @param {Function} listener - Função callback
   */
  addStateChangeListener(listener) {
    this.stateChangeListeners.push(listener)
  }

  /**
   * @method removeStateChangeListener
   * @description Remove listener de mudanças de estado
   * @param {Function} listener - Função callback
   */
  removeStateChangeListener(listener) {
    const index = this.stateChangeListeners.indexOf(listener)
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1)
    }
  }

  /**
   * @method notifyStateChange
   * @description Notifica listeners sobre mudança de estado
   * @param {string} oldState - Estado anterior
   * @param {string} newState - Novo estado
   */
  notifyStateChange(oldState, newState) {
    this.stateChangeListeners.forEach((listener) => {
      try {
        listener(oldState, newState, this.getState())
      } catch (error) {
        this.logger.error('Error in state change listener', {
          error: error.message,
        })
      }
    })
  }

  /**
   * @method registerFallbackStrategy
   * @description Registra estratégia de fallback para um contexto
   * @param {string} context - Contexto da operação
   * @param {Function} fallbackFunction - Função de fallback
   */
  registerFallbackStrategy(context, fallbackFunction) {
    this.fallbackStrategies.set(context, fallbackFunction)
    this.logger.info(`🔄 Fallback strategy registered for context: ${context}`)
  }

  /**
   * @method getFallbackStrategy
   * @description Obtém estratégia de fallback para um contexto
   * @param {string} context - Contexto da operação
   * @returns {Function|null} Função de fallback ou null
   */
  getFallbackStrategy(context) {
    return this.fallbackStrategies.get(context) || null
  }

  /**
   * @method clearAllRequests
   * @description Limpa todas as requisições em fila
   */
  clearAllRequests() {
    this.requestQueue.clear()
    this.logger.info('🧹 Circuit breaker request queue cleared')
  }

  /**
   * @method forceHalfOpen
   * @description Força o circuit breaker para estado HALF_OPEN
   * @param {string} reason - Motivo do reset forçado
   */
  forceHalfOpen(reason = 'Manual intervention') {
    this.setState('HALF_OPEN')
    this.logger.info('🔧 Circuit breaker manually set to half-open', { reason })
  }
}

export default CircuitBreaker
