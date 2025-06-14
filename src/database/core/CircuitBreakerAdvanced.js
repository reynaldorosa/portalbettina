import performanceMonitor from '../../utils/metrics/performanceMonitor.js'
import { ErrorPatternAnalyzer } from '../../utils/metrics/errorPatternAnalyzer.js'
import { PerformanceAnalyzer } from '../../utils/metrics/performanceAnalyzer.js'
import { TherapeuticAnalyzer } from '../../utils/therapy/therapeuticAnalyzer.js'
import {
  AccessibilityManager,
  HealthChecker,
  QualityAssessor,
} from '../../utils/accessibility/circuitBreakerUtils.js'

/**
 * @class CircuitBreakerAdvanced
 * @description Advanced Circuit Breaker implementation with intelligent fallbacks and adaptive behavior
 * Enhanced version with machine learning patterns, adaptive timeouts, and comprehensive monitoring
 * Designed for Portal Betina's autism support system with therapeutic considerations
 */
class CircuitBreakerAdvanced {
  constructor(config = {}) {
    this.config = {
      failureThreshold: 3, // Lower threshold for testing
      timeout: 60000,
      retryTimeout: 10000,
      halfOpenMaxCalls: 3,
      monitor: true,
      adaptiveTimeout: true,
      maxTimeout: 120000,
      minTimeout: 5000,
      therapeuticMode: true,
      autismFriendly: true,
      enablePatternAnalysis: true,
      ...config,
    }

    // Estados possíveis: CLOSED, OPEN, HALF_OPEN
    this.state = 'CLOSED'
    this.failureCount = 0
    this.lastFailureTime = null
    this.successCount = 0
    this.halfOpenCalls = 0 // Timeout adaptativo
    this.currentTimeout = this.config.timeout
    this.timeoutAdjustments = []

    // Current adaptations
    this.currentAccessibilityAdaptations = null
    this.currentTherapeuticAdaptations = null

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
      adaptiveAdjustments: 0,
      performanceScore: 100,
    }

    // Monitoramento e fallbacks avançados
    this.responseTimesHistory = []
    this.performanceHistory = []
    this.stateChangeListeners = []
    this.fallbackStrategies = new Map()
    this.requestQueue = new Map()
    this.healthChecks = []

    // Sistema de métricas inteligente
    this.metricsCollector = {
      errorPatterns: new Map(),
      performanceTrends: [],
      healthIndicators: new Map(),
    } // Logger integrado
    this.logger = performanceMonitor

    // Inicializar classes utilitárias
    this.initializeUtilityClasses()

    this.logger.info('🚀 Advanced CircuitBreaker initialized with intelligent features', {
      state: this.state,
      config: this.config,
      features: [
        'adaptive-timeout',
        'intelligent-fallbacks',
        'performance-monitoring',
        'health-checks',
        'error-pattern-analysis',
      ],
    })

    // Inicializar monitoramento contínuo
    this.startContinuousMonitoring()

    // Inicializar funcionalidades avançadas
    this.initializeAdvancedFeatures()
  }

  /**
   * @method initializeAdvancedFeatures
   * @description Initialize all advanced features and components
   */
  initializeAdvancedFeatures() {
    // Setup pattern analysis
    if (this.config.enablePatternAnalysis) {
      this.setupPatternAnalysis()
    }

    // Setup therapeutic features
    if (this.config.therapeuticMode) {
      this.setupTherapeuticFeatures()
    }

    // Setup accessibility features
    if (this.config.autismFriendly) {
      this.setupAccessibilityFeatures()
    }

    // Setup performance monitoring
    this.setupPerformanceMonitoring()
  }

  /**
   * @method setupPatternAnalysis
   * @description Setup error pattern analysis
   */
  setupPatternAnalysis() {
    this.logger.info('🧠 Setting up pattern analysis for intelligent error prediction')

    // Configure pattern analyzer with autism-specific considerations
    this.patternAnalyzer.config.therapeuticAdjustments = this.config.therapeuticMode
    this.patternAnalyzer.config.accessibilityConsiderations = this.config.autismFriendly
  }

  /**
   * @method setupTherapeuticFeatures
   * @description Setup therapeutic analysis features
   */
  setupTherapeuticFeatures() {
    this.logger.info('🏥 Setting up therapeutic features for autism support')

    // Initialize therapeutic intervention strategies
    this.therapeuticAnalyzer.initializeInterventionStrategies()

    // Setup autism-specific timeout multipliers
    this.config.timeoutMultipliers = {
      ...this.config.timeoutMultipliers,
      autism_sensory_overload: 2.5,
      autism_communication_difficulty: 2.0,
      autism_behavioral_dysregulation: 3.0,
    }
  }

  /**
   * @method setupAccessibilityFeatures
   * @description Setup accessibility management features
   */
  setupAccessibilityFeatures() {
    this.logger.info('♿ Setting up accessibility features for autism-friendly experience')

    // Apply default autism-friendly settings
    const defaultAdaptations = this.accessibilityManager.getDefaultPreferences()
    this.currentAccessibilityAdaptations = defaultAdaptations
  }

  /**
   * @method setupPerformanceMonitoring
   * @description Setup advanced performance monitoring
   */
  setupPerformanceMonitoring() {
    this.logger.info('📊 Setting up advanced performance monitoring')

    // Configure performance analyzer with therapeutic considerations
    this.performanceAnalyzer.config.therapeuticAdjustments = this.config.therapeuticMode
    this.performanceAnalyzer.config.accessibilityMetrics = this.config.autismFriendly
  }

  /**
   * @method execute
   * @async
   * @description Execução principal com Circuit Breaker avançado e fallbacks inteligentes
   * @param {Function} asyncFunction - Função a ser executada
   * @param {Object} options - Opções de execução
   * @returns {Promise<*>} Resultado da função
   */
  async execute(asyncFunction, options = {}) {
    const {
      fallbackFunction = null,
      context = 'operation',
      priority = 'normal',
      retryOnFailure = true,
      adaptiveTimeout = this.config.adaptiveTimeout,
    } = options

    this.statistics.totalCalls++
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    // Registrar início da requisição
    this.registerRequestStart(requestId, context, priority)

    try {
      // Verificar se o circuito está aberto
      if (this.state === 'OPEN') {
        if (this.shouldAttemptReset()) {
          this.setState('HALF_OPEN')
        } else {
          return await this.handleCircuitOpen(fallbackFunction, context, requestId)
        }
      }

      // Verificar limite de calls em HALF_OPEN
      if (this.state === 'HALF_OPEN') {
        if (this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
          return await this.handleHalfOpenLimitExceeded(fallbackFunction, context, requestId)
        }
        this.halfOpenCalls++
      }

      // Executar com timeout adaptativo
      const timeoutToUse = adaptiveTimeout
        ? this.calculateAdaptiveTimeout(context)
        : this.config.timeout
      const result = await this.executeWithIntelligentTimeout(
        asyncFunction,
        timeoutToUse,
        context,
        requestId
      )

      // Registrar sucesso
      const responseTime = Date.now() - startTime
      this.recordSuccess(responseTime, context, requestId)

      return result
    } catch (error) {
      // Registrar falha
      const responseTime = Date.now() - startTime
      this.recordFailure(error, context, responseTime, requestId)

      // Tentar fallback inteligente
      if (fallbackFunction && !error.circuitBreakerOpen) {
        return await this.executeIntelligentFallback(fallbackFunction, error, context, requestId)
      }

      // Retry automático se configurado
      if (retryOnFailure && this.shouldRetryOperation(error, context)) {
        this.logger.warn('🔄 Attempting automatic retry', {
          context,
          requestId,
          error: error.message,
        })

        return await this.execute(asyncFunction, {
          ...options,
          retryOnFailure: false, // Evitar retry infinito
        })
      }

      throw error
    }
  }

  /**
   * @method executeWithIntelligentTimeout
   * @async
   * @description Execução com timeout inteligente e monitoramento de performance
   * @param {Function} asyncFunction - Função a ser executada
   * @param {number} timeout - Timeout em milliseconds
   * @param {string} context - Contexto da operação
   * @param {string} requestId - ID único da requisição
   * @returns {Promise<*>} Resultado da função
   */
  async executeWithIntelligentTimeout(asyncFunction, timeout, context, requestId) {
    const performanceMonitor = this.createPerformanceMonitor(context, requestId)

    return Promise.race([
      // Função principal com monitoramento
      this.wrapWithPerformanceMonitoring(asyncFunction, performanceMonitor),

      // Timeout com notificação avançada
      new Promise((_, reject) => {
        setTimeout(() => {
          this.statistics.timeouts++
          this.adjustTimeoutBasedOnHistory(context, 'timeout')

          const timeoutError = new Error(`Intelligent timeout after ${timeout}ms for ${context}`)
          timeoutError.isTimeout = true
          timeoutError.context = context
          timeoutError.requestId = requestId

          this.logger.warn('⏰ Intelligent timeout triggered', {
            context,
            requestId,
            timeout,
            adaptiveTimeout: this.currentTimeout,
          })

          reject(timeoutError)
        }, timeout)
      }),
    ])
  }

  /**
   * @method deduplicatedExecute
   * @async
   * @description Execução com deduplicação inteligente de requests
   * @param {string} key - Chave única para deduplicação
   * @param {Function} asyncFunction - Função a ser executada
   * @param {Object} options - Opções de execução
   * @returns {Promise<*>} Resultado da função
   */
  async deduplicatedExecute(key, asyncFunction, options = {}) {
    if (this.requestQueue.has(key)) {
      this.logger.debug('🔄 Request deduplication hit', { key })
      const existingRequest = this.requestQueue.get(key)

      // Atualizar estatísticas de deduplicação
      this.updateDeduplicationStats(key)

      return existingRequest
    }

    const promise = this.execute(asyncFunction, options).finally(() => {
      this.requestQueue.delete(key)
      this.cleanupRequestData(key)
    })

    this.requestQueue.set(key, promise)
    this.registerDuplicatedRequest(key, options.context || 'unknown')

    return promise
  }

  /**
   * @method executeIntelligentFallback
   * @async
   * @description Executa fallback com estratégia inteligente
   * @param {Function} fallbackFunction - Função de fallback
   * @param {Error} originalError - Erro original
   * @param {string} context - Contexto da operação
   * @param {string} requestId - ID da requisição
   * @returns {Promise<*>} Resultado do fallback
   */
  async executeIntelligentFallback(fallbackFunction, originalError, context, requestId) {
    this.statistics.fallbackExecutions++

    this.logger.warn('🔄 Executing intelligent fallback', {
      context,
      requestId,
      originalError: originalError.message,
      fallbackStrategy: this.analyzeFallbackStrategy(originalError),
    })

    try {
      // Executar fallback com timeout reduzido
      const fallbackTimeout = Math.min(this.currentTimeout * 0.5, 10000)
      const result = await Promise.race([
        fallbackFunction(originalError, context),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Fallback timeout after ${fallbackTimeout}ms`))
          }, fallbackTimeout)
        }),
      ])

      // Registrar sucesso do fallback
      this.recordFallbackSuccess(context, requestId)

      return result
    } catch (fallbackError) {
      this.logger.error('❌ Intelligent fallback failed', {
        context,
        requestId,
        originalError: originalError.message,
        fallbackError: fallbackError.message,
      })

      this.recordFallbackFailure(context, requestId, fallbackError)

      // Retornar erro original se fallback falhar
      throw originalError
    }
  }

  /**
   * @method recordSuccess
   * @description Registra um sucesso com análise inteligente
   * @param {number} responseTime - Tempo de resposta em ms
   * @param {string} context - Contexto da operação
   * @param {string} requestId - ID da requisição
   */
  recordSuccess(responseTime, context, requestId) {
    this.statistics.successfulCalls++
    this.updateAverageResponseTime(responseTime)
    this.updatePerformanceHistory(responseTime, true, context)

    // Ajustar timeout adaptativamente
    if (this.config.adaptiveTimeout) {
      this.adjustTimeoutBasedOnHistory(context, 'success', responseTime)
    }

    if (this.state === 'HALF_OPEN') {
      this.successCount++
      this.halfOpenCalls--

      // Verificar se pode fechar o circuito
      if (this.successCount >= this.config.halfOpenMaxCalls) {
        this.reset()
      }
    }

    // Atualizar métricas de saúde
    this.updateHealthMetrics(context, 'success', responseTime)

    this.logger.debug('✅ Success recorded with intelligent analysis', {
      context,
      requestId,
      state: this.state,
      responseTime,
      adaptiveTimeout: this.currentTimeout,
      performanceScore: this.calculatePerformanceScore(),
    })
  }

  /**
   * @method recordFailure
   * @description Registra uma falha com análise de padrões
   * @param {Error} error - Erro ocorrido
   * @param {string} context - Contexto da operação
   * @param {number} responseTime - Tempo de resposta em ms
   * @param {string} requestId - ID da requisição
   */
  recordFailure(error, context, responseTime, requestId) {
    this.statistics.failedCalls++
    this.failureCount++
    this.lastFailureTime = Date.now()

    // Análise de padrões de erro
    this.analyzeErrorPattern(error, context)
    this.updatePerformanceHistory(responseTime, false, context)

    // Ajustar timeout adaptativamente
    if (this.config.adaptiveTimeout && error.isTimeout) {
      this.adjustTimeoutBasedOnHistory(context, 'timeout', responseTime)
    }

    if (this.state === 'HALF_OPEN') {
      this.halfOpenCalls--
      this.setState('OPEN')
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.setState('OPEN')
      this.statistics.circuitBreakerActivations++
    }

    // Atualizar métricas de saúde
    this.updateHealthMetrics(context, 'failure', responseTime, error)

    this.logger.warn('⚠️ Failure recorded with pattern analysis', {
      context,
      requestId,
      error: error.message,
      errorType: error.constructor.name,
      state: this.state,
      failures: this.failureCount,
      threshold: this.config.failureThreshold,
      errorPattern: this.getErrorPattern(error.message),
    })
  }

  /**
   * @method executeAdvanced
   * @async
   * @description Enhanced execution with advanced features and therapeutic considerations
   * @param {Function} asyncFunction - Function to execute
   * @param {Function} fallbackFunction - Optional fallback function
   * @param {Object} options - Execution options
   * @returns {Promise<*>} Function result
   */
  async executeAdvanced(asyncFunction, fallbackFunction = null, options = {}) {
    const {
      context = 'operation',
      therapeuticContext = null,
      userId = null,
      priority = 'normal',
    } = options

    // Analyze execution context
    const executionContext = await this.analyzeExecutionContext(
      context,
      priority,
      therapeuticContext,
      userId
    )

    // Check therapeutic safety if applicable
    if (therapeuticContext) {
      const safetyCheck = await this.therapeuticAnalyzer.checkExecution(therapeuticContext)

      if (!safetyCheck.safe && safetyCheck.block) {
        this.logger.warn('🚫 Execution blocked due to therapeutic safety concerns', {
          context,
          userId,
          reason: safetyCheck.requiredAdaptations,
        })

        // Apply therapeutic interventions if needed
        if (safetyCheck.interventions && safetyCheck.interventions.length > 0) {
          await this.executeTherapeuticInterventions(safetyCheck.interventions, options)
        }

        // Use therapeutic fallback if available
        if (fallbackFunction) {
          const adaptedFallback = await this.therapeuticAnalyzer.adaptFallback(
            fallbackFunction,
            therapeuticContext
          )
          return await adaptedFallback()
        }

        throw new Error('Execution blocked for therapeutic safety')
      }
    }

    // Apply accessibility adaptations
    if (this.config.autismFriendly && therapeuticContext) {
      await this.accessibilityManager.applyAdaptations(therapeuticContext)
    }

    // Calculate adaptive timeout
    const adaptiveTimeout = await this.calculateAdaptiveTimeout(executionContext)

    // Execute with advanced monitoring
    try {
      const result = await this.executeWithAdvancedMonitoring(
        asyncFunction,
        adaptiveTimeout,
        executionContext
      )

      // Record success in analyzers
      this.therapeuticAnalyzer.recordSuccess(executionContext)
      this.patternAnalyzer.recordSuccess(context)
      this.performanceAnalyzer.recordExecution(Date.now() - executionContext.startTime, true)

      return result
    } catch (error) {
      // Record failure in analyzers
      this.patternAnalyzer.recordFailure(context, error)
      this.performanceAnalyzer.recordExecution(Date.now() - executionContext.startTime, false)

      // Try adaptive fallback
      if (fallbackFunction) {
        const adaptedFallback = therapeuticContext
          ? await this.therapeuticAnalyzer.adaptFallback(fallbackFunction, therapeuticContext)
          : fallbackFunction

        try {
          return await this.executeWithTimeout(adaptedFallback, adaptiveTimeout * 0.5) // Reduced timeout for fallback
        } catch (fallbackError) {
          this.logger.error('❌ Both primary and fallback functions failed', {
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
   * @method calculateAdaptiveTimeout
   * @async
   * @description Calculate adaptive timeout based on context and predictions
   * @param {Object} executionContext - Execution context
   * @returns {Promise<number>} Calculated timeout in milliseconds
   */
  async calculateAdaptiveTimeout(executionContext) {
    let baseTimeout = this.config.timeout

    // Apply therapeutic multipliers
    if (
      executionContext.therapeuticAnalysis &&
      executionContext.therapeuticAnalysis.timeoutMultiplier
    ) {
      baseTimeout *= executionContext.therapeuticAnalysis.timeoutMultiplier
    }

    // Apply autism-specific adjustments
    if (executionContext.therapeuticContext) {
      if (executionContext.therapeuticContext.sensoryOverload) {
        baseTimeout *= 2.0
      }
      if (executionContext.therapeuticContext.visualSensitivity === 'high') {
        baseTimeout *= 1.5
      }
      if (executionContext.therapeuticContext.auditorySensitivity === 'high') {
        baseTimeout *= 1.3
      }
    }

    // Apply performance-based adjustments
    if (executionContext.performancePrediction) {
      const predicted = executionContext.performancePrediction.expectedResponseTime
      const confidence = executionContext.performancePrediction.confidence

      if (confidence > 0.7 && predicted > baseTimeout) {
        baseTimeout = Math.min(predicted * 1.2, this.config.maxTimeout)
      }
    }

    // Ensure timeout is within bounds
    return Math.max(this.config.minTimeout, Math.min(baseTimeout, this.config.maxTimeout))
  }

  /**
   * @method analyzeExecutionContext
   * @async
   * @description Analyze execution context for optimizations
   * @param {string} context - Operation context
   * @param {string} priority - Priority level
   * @param {Object} therapeuticContext - Therapeutic context
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeExecutionContext(context, priority, therapeuticContext, userId) {
    const startTime = Date.now()

    // Get pattern analysis prediction
    const patternPrediction = await this.patternAnalyzer.predict(context)

    // Get performance prediction
    const performancePrediction = await this.performanceAnalyzer.predict(context, {
      priority,
      userId,
      historicalData: this.responseTimesHistory.slice(-50),
    })

    // Get therapeutic analysis if applicable
    let therapeuticAnalysis = null
    if (therapeuticContext) {
      therapeuticAnalysis = await this.therapeuticAnalyzer.analyze(therapeuticContext)
    }

    return {
      context,
      priority,
      therapeuticContext,
      userId,
      startTime,
      patternPrediction,
      performancePrediction,
      therapeuticAnalysis,
    }
  }

  /**
   * @method getEnabledFeatures
   * @description Get list of enabled features
   * @returns {Array<string>} List of enabled features
   */
  getEnabledFeatures() {
    const features = []

    if (this.config.enablePatternAnalysis) {
      features.push('pattern_analysis')
    }

    if (this.config.therapeuticMode) {
      features.push('therapeutic_mode')
    }

    if (this.config.autismFriendly) {
      features.push('autism_friendly')
      features.push('sensory_adaptation')
    }

    if (this.config.adaptiveTimeout) {
      features.push('adaptive_timeout')
    }

    if (this.config.monitor) {
      features.push('performance_monitoring')
    }

    return features
  }

  /**
   * @method getAdvancedState
   * @description Get advanced state information including all metrics
   * @returns {Object} Complete state information
   */
  getAdvancedState() {
    const basicState = this.getState()
    const healthMetrics = this.healthChecker.getHealthMetrics()
    const qualityMetrics = this.qualityAssessor.getQualityMetrics()

    return {
      ...basicState,
      adaptiveMetrics: {
        currentTimeout: this.currentTimeout,
        timeoutAdjustments: this.timeoutAdjustments.length,
        performanceScore: this.statistics.performanceScore,
        adaptiveAdjustments: this.statistics.adaptiveAdjustments,
      },
      health: {
        healthScore: healthMetrics.healthScore,
        qualityScore: qualityMetrics.qualityScore,
        qualityDegraded: qualityMetrics.degraded,
      },
      features: {
        patternAnalysis: this.config.enablePatternAnalysis,
        therapeuticMode: this.config.therapeuticMode,
        accessibilityMode: this.config.autismFriendly,
        performanceAnalysis: this.config.monitor,
      },
      adaptations: {
        accessibility: this.currentAccessibilityAdaptations || {},
        therapeutic: this.currentTherapeuticAdaptations || {},
      },
    }
  }

  /**
   * @method executeTherapeuticInterventions
   * @async
   * @description Execute therapeutic interventions when needed
   * @param {Array<string>} interventions - List of interventions to apply
   * @param {Object} options - Execution options
   * @returns {Promise<void>}
   */
  async executeTherapeuticInterventions(interventions, options = {}) {
    const { therapeuticContext } = options

    for (const intervention of interventions) {
      try {
        await this.therapeuticAnalyzer.executeIntervention(intervention, therapeuticContext)
        this.logger.info(`🏥 Therapeutic intervention executed: ${intervention}`)
      } catch (error) {
        this.logger.error(`❌ Failed to execute therapeutic intervention: ${intervention}`, {
          error: error.message,
        })
      }
    }
  }

  /**
   * @method initializeUtilityClasses
   * @description Initialize all utility classes for advanced functionality
   */
  initializeUtilityClasses() {
    // Initialize pattern analyzer for error prediction
    this.patternAnalyzer = new ErrorPatternAnalyzer({
      maxPatterns: 1000,
      predictionWindow: 300000, // 5 minutes
      confidenceThreshold: 0.7,
    })

    // Initialize performance analyzer for metrics and predictions
    this.performanceAnalyzer = new PerformanceAnalyzer({
      historySize: 500,
      analysisWindow: 600000, // 10 minutes
      performanceThresholds: {
        excellent: 100,
        good: 500,
        acceptable: 1000,
        poor: 2000,
      },
    })

    // Initialize therapeutic analyzer for autism support
    this.therapeuticAnalyzer = new TherapeuticAnalyzer({
      autismSupport: true,
      sensoryAdaptations: true,
      stressMonitoring: true,
      therapeuticInterventions: true,
    })

    // Initialize accessibility manager
    this.accessibilityManager = new AccessibilityManager({
      autismFriendly: this.config.autismFriendly,
      sensoryAdaptations: true,
      cognitiveSupport: true,
    })

    // Initialize health checker
    this.healthChecker = new HealthChecker({
      checkInterval: 30000, // 30 seconds
      healthThresholds: {
        critical: 0.2,
        warning: 0.5,
        good: 0.8,
      },
    })

    // Initialize quality assessor
    this.qualityAssessor = new QualityAssessor({
      qualityThresholds: {
        excellent: 0.9,
        good: 0.7,
        acceptable: 0.5,
      },
      degradationThreshold: 0.3,
    })

    this.logger.info('🔧 Utility classes initialized successfully')
  }

  /**
   * @method startContinuousMonitoring
   * @description Start continuous monitoring of circuit breaker health and performance
   */
  startContinuousMonitoring() {
    // Performance monitoring interval
    this.performanceMonitorInterval = setInterval(() => {
      this.performHealthCheck()
      this.updatePerformanceMetrics()
      this.analyzePatterns()
    }, 30000) // Every 30 seconds

    // Adaptive timeout adjustment interval
    this.adaptiveTimeoutInterval = setInterval(() => {
      this.adjustAdaptiveTimeout()
    }, 60000) // Every minute

    // Cleanup old data interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldData()
    }, 300000) // Every 5 minutes

    this.logger.info('🔄 Continuous monitoring started')
  }

  /**
   * @method cleanup
   * @description Clean up resources and stop monitoring
   */
  cleanup() {
    // Clear all intervals
    if (this.performanceMonitorInterval) {
      clearInterval(this.performanceMonitorInterval)
      this.performanceMonitorInterval = null
    }

    if (this.adaptiveTimeoutInterval) {
      clearInterval(this.adaptiveTimeoutInterval)
      this.adaptiveTimeoutInterval = null
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }

    // Clear request queue
    this.requestQueue.clear()

    // Reset state
    this.stateChangeListeners = []
    this.fallbackStrategies.clear()

    // Cleanup utility classes
    if (this.patternAnalyzer && typeof this.patternAnalyzer.cleanup === 'function') {
      this.patternAnalyzer.cleanup()
    }

    if (this.performanceAnalyzer && typeof this.performanceAnalyzer.cleanup === 'function') {
      this.performanceAnalyzer.cleanup()
    }

    if (this.therapeuticAnalyzer && typeof this.therapeuticAnalyzer.cleanup === 'function') {
      this.therapeuticAnalyzer.cleanup()
    }

    this.logger.info('🧹 CircuitBreakerAdvanced cleanup completed')
  }

  // Métodos auxiliares simplificados
  updateAverageResponseTime(responseTime) {
    this.responseTimesHistory.push({
      time: responseTime,
      timestamp: Date.now(),
    })

    if (this.responseTimesHistory.length > 100) {
      this.responseTimesHistory.shift()
    }

    const recent = this.responseTimesHistory.slice(-50)
    const sum = recent.reduce((acc, entry) => acc + entry.time, 0)
    this.statistics.averageResponseTime = Math.round(sum / recent.length)
  }

  notifyStateChange(oldState, newState) {
    this.stateChangeListeners.forEach((listener) => {
      try {
        listener(oldState, newState, this.getAdvancedState())
      } catch (error) {
        this.logger.error('Error in state change listener', {
          error: error.message,
        })
      }
    })
  }

  // Implementações placeholder para métodos auxiliares
  shouldAttemptReset() {
    if (this.state !== 'OPEN') return false
    const timeSinceFailure = Date.now() - this.lastFailureTime
    return timeSinceFailure >= this.config.retryTimeout
  }

  reset() {
    this.setState('CLOSED')
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = null
    this.halfOpenCalls = 0
    this.logger.info('✅ Circuit breaker reset to CLOSED state')
  }

  // Métodos placeholder que serão implementados conforme necessário
  handleCircuitOpen(fallback, context, requestId) {
    if (fallback) {
      this.statistics.fallbackExecutions++
      return fallback()
    }
    const error = new Error(`Circuit breaker is OPEN for ${context}`)
    error.circuitBreakerOpen = true
    throw error
  }

  handleHalfOpenLimitExceeded(fallback, context, requestId) {
    if (fallback) {
      return fallback()
    }
    const error = new Error(`Circuit breaker HALF_OPEN call limit exceeded for ${context}`)
    error.circuitBreakerHalfOpen = true
    throw error
  }

  createPerformanceMonitor(context, requestId) {
    return {
      context,
      requestId,
      startTime: Date.now(),
    }
  }

  wrapWithPerformanceMonitoring(fn, monitor) {
    return fn()
  }

  adjustTimeoutBasedOnHistory(context, result, responseTime = null) {
    this.timeoutAdjustments.push({
      context,
      result,
      responseTime,
      timestamp: Date.now(),
      oldTimeout: this.currentTimeout,
    })

    if (this.timeoutAdjustments.length > 50) {
      this.timeoutAdjustments.shift()
    }
  }

  updatePerformanceHistory(responseTime, success, context) {
    this.performanceHistory.push({
      responseTime,
      success,
      context,
      timestamp: Date.now(),
    })

    if (this.performanceHistory.length > 200) {
      this.performanceHistory.shift()
    }
  }

  calculatePerformanceScore() {
    const recent = this.performanceHistory.slice(-50)
    if (recent.length === 0) return 100

    const successRate = recent.filter((h) => h.success).length / recent.length
    const avgTime = recent.reduce((sum, h) => sum + h.responseTime, 0) / recent.length

    let score = successRate * 100
    if (avgTime > 1000) score -= (avgTime - 1000) / 100

    return Math.max(0, Math.min(100, score))
  }

  updateHealthMetrics(context, result, responseTime, error = null) {
    const key = `${context}_${result}`
    const current = this.metricsCollector.healthIndicators.get(key) || {
      count: 0,
      avgResponseTime: 0,
      lastUpdate: Date.now(),
    }

    current.count++
    current.avgResponseTime = (current.avgResponseTime + responseTime) / 2
    current.lastUpdate = Date.now()

    this.metricsCollector.healthIndicators.set(key, current)
  }

  // Métodos auxiliares adicionais com implementações básicas
  updateDeduplicationStats(key) {
    // Implementação básica
  }

  cleanupRequestData(key) {
    // Implementação básica
  }

  registerDuplicatedRequest(key, context) {
    // Implementação básica
  }

  registerRequestStart(requestId, context, priority) {
    // Implementação básica
  }

  recordFallbackSuccess(context, requestId) {
    // Implementação básica
  }

  recordFallbackFailure(context, requestId, error) {
    // Implementação básica
  }

  analyzeFallbackStrategy(error) {
    return 'standard'
  }

  getErrorPattern(errorMessage) {
    for (const [key, pattern] of this.metricsCollector.errorPatterns) {
      if (key.includes(errorMessage.substring(0, 20))) {
        return pattern
      }
    }
    return null
  }

  optimizePerformance() {
    // Implementação de otimização
  }

  cleanupOldData() {
    // Limpeza de dados antigos
  }

  performDeepAnalysis() {
    // Análise profunda
  }

  updatePerformanceScore() {
    this.statistics.performanceScore = this.calculatePerformanceScore()
  }

  generateHealthRecommendations(healthScore) {
    const recommendations = []
    if (healthScore < 30) recommendations.push('Critical system intervention required')
    if (healthScore < 50) recommendations.push('Increase timeout values')
    if (healthScore < 70) recommendations.push('Monitor error patterns')
    return recommendations
  }

  getTopErrorPatterns() {
    return Array.from(this.metricsCollector.errorPatterns.entries())
      .sort((a, b) => b[1].frequency - a[1].frequency)
      .slice(0, 5)
      .map(([key, pattern]) => ({ key, ...pattern }))
  }

  getPerformanceTrends() {
    return this.performanceHistory.slice(-20)
  }

  getHealthTrends() {
    return this.healthChecks.slice(-10)
  }

  /**
   * @method applyAccessibilityToFallback
   * @description Apply accessibility adaptations to fallback function
   * @param {Function} fallbackFunction - Original fallback function
   * @param {Object} accessibilityAdaptations - Accessibility adaptations to apply
   * @returns {Function} Adapted fallback function
   */
  applyAccessibilityToFallback(fallbackFunction, accessibilityAdaptations) {
    return async () => {
      // Apply accessibility context before executing fallback
      const adaptedContext = {
        ...accessibilityAdaptations,
        fallbackMode: true,
        reducedComplexity: true,
      }

      // Execute fallback with accessibility considerations
      return fallbackFunction(adaptedContext)
    }
  }

  /**
   * @method applyAdaptations
   * @async
   * @description Apply required adaptations based on state check
   * @param {Array} adaptations - List of adaptations to apply
   * @param {Object} executionContext - Execution context
   */
  async applyAdaptations(adaptations, executionContext) {
    for (const adaptation of adaptations) {
      try {
        switch (adaptation) {
          case 'quality_degradation_mode':
            await this.enableQualityDegradationMode(executionContext)
            break
          case 'accessibility_adaptations_required':
            await this.applyAccessibilityAdaptations(executionContext)
            break
          case 'stress_reduction_protocol':
            await this.activateStressReductionProtocol(executionContext)
            break
          case 'sensory_adaptation_protocol':
            await this.activateSensoryAdaptationProtocol(executionContext)
            break
          default:
            this.logger.warn(`Unknown adaptation: ${adaptation}`)
        }
      } catch (error) {
        this.logger.error(`Failed to apply adaptation ${adaptation}:`, error.message)
      }
    }
  }

  /**
   * @method executeTherapeuticInterventions
   * @async
   * @description Execute therapeutic interventions
   * @param {Array} interventions - List of interventions to execute
   * @param {Object} executionContext - Execution context
   * @returns {Promise<void>}
   */
  async executeTherapeuticInterventions(interventions, executionContext) {
    for (const intervention of interventions) {
      try {
        switch (intervention) {
          case 'implement_calming_measures':
            await this.implementCalmingMeasures(executionContext)
            break
          case 'reduce_sensory_input':
            await this.reduceSensoryInput(executionContext)
            break
          case 'activate_alternative_communication':
            await this.activateAlternativeCommunication(executionContext)
            break
          case 'implement_behavioral_strategies':
            await this.implementBehavioralStrategies(executionContext)
            break
          case 'emergency_stress_intervention':
            await this.emergencyStressIntervention(executionContext)
            break
          default:
            this.logger.warn(`Unknown therapeutic intervention: ${intervention}`)
        }
      } catch (error) {
        this.logger.error(`Failed to execute intervention ${intervention}:`, error.message)
      }
    }
  }

  /**
   * @method executeTherapeuticFallback
   * @async
   * @description Execute fallback with therapeutic considerations
   * @param {Function} fallbackFunction - Fallback function
   * @param {Object} executionContext - Execution context
   * @returns {Promise<*>} Fallback result
   */
  async executeTherapeuticFallback(fallbackFunction, executionContext) {
    this.logger.info('🏥 Executing therapeutic fallback')

    // Apply therapeutic adaptations
    const therapeuticAdaptations = await this.therapeuticAnalyzer.adaptFallback(
      fallbackFunction,
      new Error('Therapeutic safety block'),
      executionContext
    )

    // Execute with extended timeout for therapeutic considerations
    const therapeuticTimeout = this.currentTimeout * 2

    try {
      const result = await Promise.race([
        therapeuticAdaptations(),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Therapeutic fallback timeout after ${therapeuticTimeout}ms`))
          }, therapeuticTimeout)
        }),
      ])

      this.logger.info('✅ Therapeutic fallback completed successfully')
      return result
    } catch (error) {
      this.logger.error('❌ Therapeutic fallback failed:', error.message)
      throw error
    }
  }

  /**
   * @method calculateRiskMultiplier
   * @description Calculate risk multiplier based on pattern prediction
   * @param {Object} patternPrediction - Pattern prediction result
   * @returns {number} Risk multiplier
   */
  calculateRiskMultiplier(patternPrediction) {
    if (!patternPrediction) return 1.0

    const baseMultiplier = patternPrediction.riskMultiplier || 1.0
    const confidenceWeight = patternPrediction.confidence || 0.5

    // Apply confidence weighting
    return 1.0 + (baseMultiplier - 1.0) * confidenceWeight
  }

  /**
   * @method getAdvancedState
   * @description Get comprehensive state information with all advanced features
   * @returns {Object} Advanced state information
   */
  getAdvancedState() {
    const successRate =
      this.statistics.totalCalls > 0
        ? ((this.statistics.successfulCalls / this.statistics.totalCalls) * 100).toFixed(2)
        : '0.00'

    const state = {
      // Basic state
      state: this.state,
      failures: this.failureCount,
      successes: this.successCount,
      lastFailure: this.lastFailureTime,
      halfOpenCalls: this.halfOpenCalls,

      // Advanced metrics
      adaptiveMetrics: {
        currentTimeout: this.currentTimeout,
        baseTimeout: this.config.timeout,
        adaptiveAdjustments: this.statistics.adaptiveAdjustments || 0,
      },

      // Statistics
      statistics: {
        ...this.statistics,
        successRate: `${successRate}%`,
        uptime: Date.now() - this.statistics.lastStateChange,
        therapeuticInterventions: this.statistics.therapeuticInterventions || 0,
      },

      // Health and quality assessment
      health: {
        isHealthy: this.state === 'CLOSED' && this.failureCount < this.config.failureThreshold,
        healthScore: this.healthChecker.getScore(),
        qualityScore: this.qualityAssessor.currentQuality || 1.0,
        qualityDegraded: this.qualityAssessor.isQualityDegraded(),
      },

      // Advanced features status
      features: {
        patternAnalysis: this.config.enablePatternAnalysis
          ? this.patternAnalyzer.getStatistics()
          : null,
        therapeuticMode: this.config.therapeuticMode ? this.therapeuticAnalyzer.getStatus() : null,
        accessibilityMode: this.config.autismFriendly
          ? this.accessibilityManager.getStatistics()
          : null,
        performanceAnalysis: this.performanceAnalyzer.getStatistics(),
      },

      // Current adaptations
      adaptations: {
        accessibility: this.currentAccessibilityAdaptations || {},
        therapeutic: this.currentTherapeuticAdaptations || {},
      },
    }

    return state
  }

  /**
   * @method getEnabledFeatures
   * @description Get list of enabled advanced features
   * @returns {Array} List of enabled features
   */
  getEnabledFeatures() {
    const features = []

    if (this.config.adaptiveTimeout) features.push('adaptive_timeout')
    if (this.config.enablePatternAnalysis) features.push('pattern_analysis')
    if (this.config.therapeuticMode) features.push('therapeutic_mode')
    if (this.config.autismFriendly) features.push('autism_friendly')
    if (this.config.enableQualityAssessment) features.push('quality_assessment')
    if (this.config.sensoryAdaptation) features.push('sensory_adaptation')
    if (this.config.enablePredictiveAnalysis) features.push('predictive_analysis')

    return features
  }

  // Adaptation implementation methods (placeholders for now)
  async enableQualityDegradationMode(executionContext) {
    this.logger.info('🔧 Enabling quality degradation mode')
    // Implementation would reduce feature complexity
  }

  async applyAccessibilityAdaptations(executionContext) {
    this.logger.info('♿ Applying accessibility adaptations')
    // Implementation would apply user-specific accessibility needs
  }

  async activateStressReductionProtocol(executionContext) {
    this.logger.info('😌 Activating stress reduction protocol')
    // Implementation would reduce stimulation and extend timeouts
  }

  async activateSensoryAdaptationProtocol(executionContext) {
    this.logger.info('👁️ Activating sensory adaptation protocol')
    // Implementation would modify sensory inputs
  }

  async implementCalmingMeasures(executionContext) {
    this.logger.info('🧘 Implementing calming measures')
    // Implementation would provide calming interface elements
  }

  async reduceSensoryInput(executionContext) {
    this.logger.info('🔇 Reducing sensory input')
    // Implementation would minimize visual/audio stimulation
  }

  async activateAlternativeCommunication(executionContext) {
    this.logger.info('💬 Activating alternative communication')
    // Implementation would provide visual or symbolic communication aids
  }

  async implementBehavioralStrategies(executionContext) {
    this.logger.info('🎯 Implementing behavioral strategies')
    // Implementation would provide behavioral support tools
  }

  async emergencyStressIntervention(executionContext) {
    this.logger.warn('🚨 Emergency stress intervention activated')
    // Implementation would immediately reduce all stimulation and provide support
  }

  /**
   * @method executeWithAdvancedMonitoring
   * @async
   * @description Execute function with advanced monitoring and metrics
   * @param {Function} asyncFunction - Function to execute
   * @param {number} timeout - Timeout in milliseconds
   * @param {Object} executionContext - Execution context
   * @returns {Promise<*>} Result of execution
   */
  async executeWithAdvancedMonitoring(asyncFunction, timeout, executionContext) {
    const startTime = Date.now()

    // Create promise with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        this.statistics.timeouts++
        reject(new Error(`Advanced timeout after ${timeout}ms for ${executionContext.context}`))
      }, timeout)
    })

    try {
      const result = await Promise.race([asyncFunction(), timeoutPromise])

      // Record metrics
      const responseTime = Date.now() - startTime
      this.updateAverageResponseTime(responseTime)
      this.statistics.successfulCalls++

      return result
    } catch (error) {
      this.statistics.failedCalls++
      throw error
    }
  }

  /**
   * @method performHealthCheck
   * @description Perform health check using HealthChecker
   */
  performHealthCheck() {
    try {
      const healthData = {
        state: this.state,
        failureRate: this.statistics.failedCalls / Math.max(this.statistics.totalCalls, 1),
        responseTime: this.statistics.averageResponseTime,
        circuitActivations: this.statistics.circuitBreakerActivations,
        timestamp: Date.now(),
      }

      this.healthChecker.recordHealthData(healthData)
    } catch (error) {
      this.logger.error('❌ Health check failed', { error: error.message })
    }
  }

  /**
   * @method updatePerformanceMetrics
   * @description Update performance metrics using PerformanceAnalyzer
   */
  updatePerformanceMetrics() {
    try {
      const performanceData = {
        timestamp: Date.now(),
        responseTime: this.statistics.averageResponseTime,
        successRate: this.statistics.successfulCalls / Math.max(this.statistics.totalCalls, 1),
        throughput: this.statistics.totalCalls,
        state: this.state,
      }

      this.performanceAnalyzer.recordMetrics(performanceData)

      // Update performance score
      this.statistics.performanceScore = this.performanceAnalyzer.calculatePerformanceScore()
    } catch (error) {
      this.logger.error('❌ Performance metrics update failed', { error: error.message })
    }
  }

  /**
   * @method analyzePatterns
   * @description Analyze patterns using ErrorPatternAnalyzer
   */
  analyzePatterns() {
    try {
      // Analyze recent failure patterns
      const recentFailures = this.responseTimesHistory.filter(
        (entry) => Date.now() - entry.timestamp < 300000
      ).length // Last 5 minutes

      if (recentFailures > 0) {
        this.patternAnalyzer.analyzePatterns({
          timestamp: Date.now(),
          failureCount: recentFailures,
          state: this.state,
          context: 'periodic_analysis',
        })
      }
    } catch (error) {
      this.logger.error('❌ Pattern analysis failed', { error: error.message })
    }
  }

  /**
   * @method adjustAdaptiveTimeout
   * @description Adjust adaptive timeout based on performance
   */
  adjustAdaptiveTimeout() {
    if (!this.config.adaptiveTimeout) return

    try {
      const recentResponseTimes = this.responseTimesHistory
        .slice(-20) // Last 20 requests
        .map((entry) => entry.time)

      if (recentResponseTimes.length < 5) return

      const avgResponseTime =
        recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length
      const maxResponseTime = Math.max(...recentResponseTimes)

      // Adjust timeout based on recent performance
      let newTimeout = this.currentTimeout

      if (avgResponseTime > this.currentTimeout * 0.8) {
        // Increase timeout if we're hitting the limit
        newTimeout = Math.min(this.currentTimeout * 1.2, this.config.maxTimeout)
      } else if (avgResponseTime < this.currentTimeout * 0.3) {
        // Decrease timeout if response times are consistently low
        newTimeout = Math.max(this.currentTimeout * 0.9, this.config.minTimeout)
      }

      if (newTimeout !== this.currentTimeout) {
        this.timeoutAdjustments.push({
          timestamp: Date.now(),
          oldTimeout: this.currentTimeout,
          newTimeout,
          reason: avgResponseTime > this.currentTimeout * 0.8 ? 'increase' : 'decrease',
        })

        this.currentTimeout = newTimeout
        this.statistics.adaptiveAdjustments++

        this.logger.info('⚙️ Adaptive timeout adjusted', {
          oldTimeout: this.timeoutAdjustments[this.timeoutAdjustments.length - 1].oldTimeout,
          newTimeout,
          avgResponseTime,
        })
      }
    } catch (error) {
      this.logger.error('❌ Adaptive timeout adjustment failed', { error: error.message })
    }
  }

  /**
   * @method cleanupOldData
   * @description Clean up old data to prevent memory leaks
   */
  cleanupOldData() {
    try {
      const maxAge = 3600000 // 1 hour
      const now = Date.now()

      // Clean response times history
      this.responseTimesHistory = this.responseTimesHistory.filter(
        (entry) => now - entry.timestamp < maxAge
      )

      // Clean timeout adjustments
      this.timeoutAdjustments = this.timeoutAdjustments.filter(
        (entry) => now - entry.timestamp < maxAge
      )

      // Keep only last 100 entries
      if (this.responseTimesHistory.length > 100) {
        this.responseTimesHistory = this.responseTimesHistory.slice(-100)
      }

      if (this.timeoutAdjustments.length > 50) {
        this.timeoutAdjustments = this.timeoutAdjustments.slice(-50)
      }

      this.logger.debug('🧹 Old data cleaned up', {
        responseHistorySize: this.responseTimesHistory.length,
        timeoutAdjustmentsSize: this.timeoutAdjustments.length,
      })
    } catch (error) {
      this.logger.error('❌ Data cleanup failed', { error: error.message })
    }
  }

  /**
   * @method generateRequestId
   * @description Generate unique request ID
   * @returns {string} Unique request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * @method registerRequestStart
   * @description Register the start of a request
   * @param {string} requestId - Request ID
   * @param {string} context - Request context
   * @param {string} priority - Request priority
   */
  registerRequestStart(requestId, context, priority) {
    // This could be expanded to track request lifecycle
    this.logger.debug('📝 Request registered', { requestId, context, priority })
  }

  /**
   * @method handleCircuitOpen
   * @async
   * @description Handle execution when circuit is open
   * @param {Function} fallbackFunction - Fallback function
   * @param {string} context - Execution context
   * @param {string} requestId - Request ID
   * @returns {Promise<*>} Result or throws error
   */
  async handleCircuitOpen(fallbackFunction, context, requestId) {
    if (fallbackFunction) {
      this.statistics.fallbackExecutions++
      this.logger.warn('🔄 Circuit breaker OPEN - executing fallback', {
        context,
        requestId,
        state: this.state,
        failures: this.failureCount,
      })
      return await fallbackFunction()
    }

    const error = new Error(`Circuit breaker is OPEN for ${context}`)
    error.circuitBreakerOpen = true
    error.requestId = requestId
    throw error
  }
}

export default CircuitBreakerAdvanced
