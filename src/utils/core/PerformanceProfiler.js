/**
 * PERFORMANCE PROFILER - SISTEMA DE OBSERVABILIDADE PORTAL BETINA
 * Sistema robusto de profiling e telemetria com métricas detalhadas
 *
 * @version 1.0.0
 * @created 2025-01-08
 * @purpose Monitoramento de performance e observabilidade
 */

import logger from '../logger.js'

// Estados do profiler
export const PROFILER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  COLLECTING: 'collecting',
  ANALYZING: 'analyzing',
  ERROR: 'error',
}

// Tipos de métricas de performance
export const PERFORMANCE_METRIC_TYPES = {
  RENDER: 'render',
  INTERACTION: 'interaction',
  MEMORY: 'memory',
  NETWORK: 'network',
  CPU: 'cpu',
  CUSTOM: 'custom',
}

// Configurações otimizadas para autismo
const AUTISM_OPTIMIZED_PROFILING = {
  renderThreshold: 16, // 60 FPS target
  interactionThreshold: 100, // Resposta em 100ms
  memoryThreshold: 50, // 50MB limite
  cpuThreshold: 80, // 80% CPU usage
  networkThreshold: 2000, // 2s para requisições
  samplingRate: 1000, // Amostragem a cada 1s
  retentionPeriod: 300000, // 5 minutos de dados
  alertThresholds: {
    critical: 0.9,
    warning: 0.7,
    info: 0.5,
  },
}

/**
 * Classe principal do Performance Profiler
 */
class PerformanceProfiler {
  constructor() {
    this.state = PROFILER_STATES.IDLE
    this.metrics = new Map()
    this.timers = new Map()
    this.observers = new Map()
    this.alerts = new Map()
    this.samplingInterval = null
    this.startTime = null
    this.statistics = {
      totalMeasurements: 0,
      averageRenderTime: 0,
      averageInteractionTime: 0,
      memoryUsagePeak: 0,
      alertsTriggered: 0,
      performanceScore: 100,
    }

    this.init()
  }

  /**
   * Inicializa o profiler
   */
  init() {
    try {
      this.setupPerformanceObservers()
      this.setupMemoryMonitoring()
      this.setupNetworkMonitoring()

      logger.info('🔍 PerformanceProfiler inicializado com sucesso')
    } catch (error) {
      logger.error('Erro ao inicializar PerformanceProfiler:', error)
      this.state = PROFILER_STATES.ERROR
    }
  }

  /**
   * Inicia o profiling
   */
  start() {
    if (this.state === PROFILER_STATES.RUNNING) {
      logger.warn('Profiler já está rodando')
      return
    }

    this.state = PROFILER_STATES.RUNNING
    this.startTime = performance.now()
    this.metrics.clear()
    this.alerts.clear()

    // Iniciar amostragem contínua
    this.samplingInterval = setInterval(() => {
      this.collectSystemMetrics()
    }, AUTISM_OPTIMIZED_PROFILING.samplingRate)

    logger.info('🚀 PerformanceProfiler iniciado')
  }

  /**
   * Para o profiling
   */
  stop() {
    if (this.state !== PROFILER_STATES.RUNNING) {
      logger.warn('Profiler não está rodando')
      return null
    }

    this.state = PROFILER_STATES.ANALYZING

    if (this.samplingInterval) {
      clearInterval(this.samplingInterval)
      this.samplingInterval = null
    }

    const report = this.generatePerformanceReport()
    this.state = PROFILER_STATES.IDLE

    logger.info('⏹️ PerformanceProfiler parado', {
      duration: performance.now() - this.startTime,
      totalMetrics: this.metrics.size,
    })

    return report
  }

  /**
   * Configura observadores de performance
   */
  setupPerformanceObservers() {
    // Observer para medições de performance
    if ('PerformanceObserver' in window) {
      const performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordPerformanceEntry(entry)
        })
      })

      performanceObserver.observe({
        entryTypes: ['measure', 'navigation', 'resource', 'paint', 'largest-contentful-paint'],
      })

      this.observers.set('performance', performanceObserver)
    }

    // Observer para Long Tasks (tarefas que bloqueiam a UI)
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordLongTask(entry)
        })
      })

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.set('longtask', longTaskObserver)
      } catch (e) {
        // Long Task API não suportado em todos os browsers
        logger.debug('Long Task API não suportada')
      }
    }
  }

  /**
   * Configura monitoramento de memória
   */
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memoryInfo = performance.memory
        this.recordMemoryMetrics(memoryInfo)
      }, AUTISM_OPTIMIZED_PROFILING.samplingRate * 2) // Menos frequente
    }
  }

  /**
   * Configura monitoramento de rede
   */
  setupNetworkMonitoring() {
    // Interceptar fetch para monitorar requisições
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0]

      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()

        this.recordNetworkMetric({
          url,
          method: args[1]?.method || 'GET',
          status: response.status,
          duration: endTime - startTime,
          success: response.ok,
        })

        return response
      } catch (error) {
        const endTime = performance.now()

        this.recordNetworkMetric({
          url,
          method: args[1]?.method || 'GET',
          status: 0,
          duration: endTime - startTime,
          success: false,
          error: error.message,
        })

        throw error
      }
    }
  }

  /**
   * Registra entrada de performance
   */
  recordPerformanceEntry(entry) {
    const metricKey = `${entry.entryType}_${Date.now()}`

    const metric = {
      type: PERFORMANCE_METRIC_TYPES.RENDER,
      name: entry.name,
      entryType: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration,
      timestamp: Date.now(),
    }

    this.metrics.set(metricKey, metric)
    this.checkPerformanceThresholds(metric)
    this.updateStatistics(metric)
  }

  /**
   * Registra Long Task
   */
  recordLongTask(entry) {
    const metricKey = `longtask_${Date.now()}`

    const metric = {
      type: PERFORMANCE_METRIC_TYPES.CPU,
      name: 'Long Task',
      duration: entry.duration,
      startTime: entry.startTime,
      timestamp: Date.now(),
    }

    this.metrics.set(metricKey, metric)

    // Long tasks são sempre críticas
    this.triggerAlert('CRITICAL', `Long Task detectada: ${entry.duration.toFixed(2)}ms`, metric)
  }

  /**
   * Registra métricas de memória
   */
  recordMemoryMetrics(memoryInfo) {
    const metricKey = `memory_${Date.now()}`

    const metric = {
      type: PERFORMANCE_METRIC_TYPES.MEMORY,
      usedJSHeapSize: memoryInfo.usedJSHeapSize,
      totalJSHeapSize: memoryInfo.totalJSHeapSize,
      jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
      usagePercentage: (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100,
      timestamp: Date.now(),
    }

    this.metrics.set(metricKey, metric)
    this.checkMemoryThresholds(metric)
    this.updateStatistics(metric)
  }

  /**
   * Registra métrica de rede
   */
  recordNetworkMetric(networkData) {
    const metricKey = `network_${Date.now()}`

    const metric = {
      type: PERFORMANCE_METRIC_TYPES.NETWORK,
      ...networkData,
      timestamp: Date.now(),
    }

    this.metrics.set(metricKey, metric)
    this.checkNetworkThresholds(metric)
  }

  /**
   * Coleta métricas do sistema
   */
  collectSystemMetrics() {
    this.state = PROFILER_STATES.COLLECTING

    try {
      // Métricas de CPU (aproximação através de timing)
      const cpuMetric = this.measureCPUUsage()
      if (cpuMetric) {
        this.metrics.set(`cpu_${Date.now()}`, cpuMetric)
      }

      // Métricas de FPS
      const fpsMetric = this.measureFPS()
      if (fpsMetric) {
        this.metrics.set(`fps_${Date.now()}`, fpsMetric)
      }

      // Limpar métricas antigas
      this.cleanupOldMetrics()
    } catch (error) {
      logger.error('Erro ao coletar métricas do sistema:', error)
    }

    this.state = PROFILER_STATES.RUNNING
  }

  /**
   * Mede uso aproximado de CPU
   */
  measureCPUUsage() {
    const startTime = performance.now()

    // Realizar operação intensiva para medir CPU
    let sum = 0
    for (let i = 0; i < 10000; i++) {
      sum += Math.random()
    }

    const endTime = performance.now()
    const executionTime = endTime - startTime

    return {
      type: PERFORMANCE_METRIC_TYPES.CPU,
      executionTime,
      approximateUsage: Math.min((executionTime / 16) * 100, 100), // Baseado em 16ms frame
      timestamp: Date.now(),
    }
  }

  /**
   * Mede FPS
   */
  measureFPS() {
    if (!this.lastFrameTime) {
      this.lastFrameTime = performance.now()
      this.frameCount = 0
      return null
    }

    this.frameCount++
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastFrameTime

    if (deltaTime >= 1000) {
      // Calcular FPS a cada segundo
      const fps = (this.frameCount * 1000) / deltaTime

      this.lastFrameTime = currentTime
      this.frameCount = 0

      return {
        type: PERFORMANCE_METRIC_TYPES.RENDER,
        name: 'FPS',
        value: fps,
        timestamp: Date.now(),
      }
    }

    return null
  }

  /**
   * Verifica limites de performance
   */
  checkPerformanceThresholds(metric) {
    if (metric.duration > AUTISM_OPTIMIZED_PROFILING.renderThreshold) {
      const severity = metric.duration > 50 ? 'CRITICAL' : 'WARNING'
      this.triggerAlert(severity, `Renderização lenta: ${metric.duration.toFixed(2)}ms`, metric)
    }
  }

  /**
   * Verifica limites de memória
   */
  checkMemoryThresholds(metric) {
    const memoryMB = metric.usedJSHeapSize / (1024 * 1024)

    if (memoryMB > AUTISM_OPTIMIZED_PROFILING.memoryThreshold) {
      const severity = memoryMB > 100 ? 'CRITICAL' : 'WARNING'
      this.triggerAlert(severity, `Alto uso de memória: ${memoryMB.toFixed(2)}MB`, metric)
    }

    // Atualizar pico de memória
    if (memoryMB > this.statistics.memoryUsagePeak) {
      this.statistics.memoryUsagePeak = memoryMB
    }
  }

  /**
   * Verifica limites de rede
   */
  checkNetworkThresholds(metric) {
    if (metric.duration > AUTISM_OPTIMIZED_PROFILING.networkThreshold) {
      this.triggerAlert(
        'WARNING',
        `Requisição lenta: ${metric.url} (${metric.duration.toFixed(2)}ms)`,
        metric
      )
    }

    if (!metric.success) {
      this.triggerAlert('ERROR', `Falha na rede: ${metric.url} (Status: ${metric.status})`, metric)
    }
  }

  /**
   * Dispara alerta
   */
  triggerAlert(severity, message, metric) {
    const alertKey = `${severity}_${Date.now()}`

    const alert = {
      severity,
      message,
      metric,
      timestamp: Date.now(),
    }

    this.alerts.set(alertKey, alert)
    this.statistics.alertsTriggered++

    logger.warn(`🚨 Alert ${severity}: ${message}`, metric)
  }

  /**
   * Atualiza estatísticas
   */
  updateStatistics(metric) {
    this.statistics.totalMeasurements++

    if (metric.type === PERFORMANCE_METRIC_TYPES.RENDER && metric.duration) {
      const currentAvg = this.statistics.averageRenderTime
      const count = this.statistics.totalMeasurements
      this.statistics.averageRenderTime = (currentAvg * (count - 1) + metric.duration) / count
    }

    if (metric.type === PERFORMANCE_METRIC_TYPES.INTERACTION && metric.duration) {
      const currentAvg = this.statistics.averageInteractionTime
      const count = this.statistics.totalMeasurements
      this.statistics.averageInteractionTime = (currentAvg * (count - 1) + metric.duration) / count
    }

    // Calcular score de performance
    this.calculatePerformanceScore()
  }

  /**
   * Calcula score de performance
   */
  calculatePerformanceScore() {
    let score = 100

    // Penalizar render time alto
    if (this.statistics.averageRenderTime > AUTISM_OPTIMIZED_PROFILING.renderThreshold) {
      score -= 20
    }

    // Penalizar memória alta
    if (this.statistics.memoryUsagePeak > AUTISM_OPTIMIZED_PROFILING.memoryThreshold) {
      score -= 15
    }

    // Penalizar alertas
    score -= this.statistics.alertsTriggered * 5

    this.statistics.performanceScore = Math.max(0, score)
  }

  /**
   * Limpa métricas antigas
   */
  cleanupOldMetrics() {
    const now = Date.now()
    const retentionPeriod = AUTISM_OPTIMIZED_PROFILING.retentionPeriod

    for (const [key, metric] of this.metrics.entries()) {
      if (now - metric.timestamp > retentionPeriod) {
        this.metrics.delete(key)
      }
    }

    // Limpar alertas antigos também
    for (const [key, alert] of this.alerts.entries()) {
      if (now - alert.timestamp > retentionPeriod) {
        this.alerts.delete(key)
      }
    }
  }

  /**
   * Gera relatório de performance
   */
  generatePerformanceReport() {
    const report = {
      profileSession: {
        startTime: this.startTime,
        endTime: performance.now(),
        duration: performance.now() - this.startTime,
        totalMetrics: this.metrics.size,
        totalAlerts: this.alerts.size,
      },
      statistics: { ...this.statistics },
      topIssues: this.getTopPerformanceIssues(),
      recommendations: this.generateRecommendations(),
      metricsSummary: this.getMetricsSummary(),
      alertsSummary: this.getAlertsSummary(),
    }

    logger.info('📊 Relatório de performance gerado', report)
    return report
  }

  /**
   * Obtém principais problemas de performance
   */
  getTopPerformanceIssues() {
    const issues = []

    // Analisar métricas por tipo
    const metricsByType = new Map()

    for (const metric of this.metrics.values()) {
      const type = metric.type
      if (!metricsByType.has(type)) {
        metricsByType.set(type, [])
      }
      metricsByType.get(type).push(metric)
    }

    // Identificar problemas principais
    for (const [type, metrics] of metricsByType.entries()) {
      const avgDuration = metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / metrics.length

      if (
        type === PERFORMANCE_METRIC_TYPES.RENDER &&
        avgDuration > AUTISM_OPTIMIZED_PROFILING.renderThreshold
      ) {
        issues.push({
          type: 'Renderização lenta',
          severity: 'HIGH',
          avgDuration,
          count: metrics.length,
        })
      }

      if (
        type === PERFORMANCE_METRIC_TYPES.NETWORK &&
        avgDuration > AUTISM_OPTIMIZED_PROFILING.networkThreshold
      ) {
        issues.push({
          type: 'Requisições de rede lentas',
          severity: 'MEDIUM',
          avgDuration,
          count: metrics.length,
        })
      }
    }

    return issues.sort((a, b) => b.severity.localeCompare(a.severity))
  }

  /**
   * Gera recomendações
   */
  generateRecommendations() {
    const recommendations = []

    if (this.statistics.averageRenderTime > AUTISM_OPTIMIZED_PROFILING.renderThreshold) {
      recommendations.push({
        type: 'PERFORMANCE',
        priority: 'HIGH',
        message: 'Otimizar componentes React para reduzir tempo de renderização',
        action: 'Usar React.memo, useMemo e useCallback',
      })
    }

    if (this.statistics.memoryUsagePeak > AUTISM_OPTIMIZED_PROFILING.memoryThreshold) {
      recommendations.push({
        type: 'MEMORY',
        priority: 'MEDIUM',
        message: 'Otimizar uso de memória',
        action: 'Implementar cleanup de event listeners e timers',
      })
    }

    if (this.statistics.alertsTriggered > 10) {
      recommendations.push({
        type: 'MONITORING',
        priority: 'LOW',
        message: 'Muitos alertas detectados',
        action: 'Revisar thresholds de alertas',
      })
    }

    return recommendations
  }

  /**
   * Obtém resumo das métricas
   */
  getMetricsSummary() {
    const summary = {
      total: this.metrics.size,
      byType: {},
    }

    for (const metric of this.metrics.values()) {
      const type = metric.type
      if (!summary.byType[type]) {
        summary.byType[type] = 0
      }
      summary.byType[type]++
    }

    return summary
  }

  /**
   * Obtém resumo dos alertas
   */
  getAlertsSummary() {
    const summary = {
      total: this.alerts.size,
      bySeverity: {},
    }

    for (const alert of this.alerts.values()) {
      const severity = alert.severity
      if (!summary.bySeverity[severity]) {
        summary.bySeverity[severity] = 0
      }
      summary.bySeverity[severity]++
    }

    return summary
  }

  /**
   * Obtém estatísticas do profiler
   */
  getStatistics() {
    return {
      state: this.state,
      statistics: this.statistics,
      metricsCount: this.metrics.size,
      alertsCount: this.alerts.size,
      observersActive: this.observers.size,
      uptime: this.startTime ? performance.now() - this.startTime : 0,
    }
  }

  /**
   * Destroy: limpa recursos
   */
  destroy() {
    // Parar intervalos
    if (this.samplingInterval) {
      clearInterval(this.samplingInterval)
    }

    // Desconectar observers
    for (const observer of this.observers.values()) {
      observer.disconnect()
    }

    // Limpar dados
    this.metrics.clear()
    this.alerts.clear()
    this.observers.clear()

    this.state = PROFILER_STATES.IDLE

    logger.info('🧹 PerformanceProfiler destruído')
  }
}

// Instância singleton
let profilerInstance = null

/**
 * Obtém instância do profiler (singleton)
 */
export const getPerformanceProfiler = () => {
  if (!profilerInstance) {
    profilerInstance = new PerformanceProfiler()
  }
  return profilerInstance
}

/**
 * Funções utilitárias para uso direto
 */
export const startProfiling = () => getPerformanceProfiler().start()
export const stopProfiling = () => getPerformanceProfiler().stop()
export const getProfilingStats = () => getPerformanceProfiler().getStatistics()

// Hook para uso em componentes React
export const usePerformanceProfiling = (componentName) => {
  const profiler = getPerformanceProfiler()

  return {
    startTimer: (timerName) => {
      const key = `${componentName}_${timerName}`
      profiler.timers.set(key, performance.now())
    },

    endTimer: (timerName) => {
      const key = `${componentName}_${timerName}`
      const startTime = profiler.timers.get(key)

      if (startTime) {
        const duration = performance.now() - startTime
        profiler.recordPerformanceEntry({
          entryType: 'custom',
          name: `${componentName}.${timerName}`,
          startTime,
          duration,
        })
        profiler.timers.delete(key)
        return duration
      }

      return 0
    },

    recordCustomMetric: (metricName, value, type = PERFORMANCE_METRIC_TYPES.CUSTOM) => {
      const metricKey = `custom_${componentName}_${metricName}_${Date.now()}`

      profiler.metrics.set(metricKey, {
        type,
        name: `${componentName}.${metricName}`,
        value,
        component: componentName,
        timestamp: Date.now(),
      })
    },
  }
}

export default PerformanceProfiler
