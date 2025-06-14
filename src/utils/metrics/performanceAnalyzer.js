/**
 * @class PerformanceAnalyzer
 * @description Analyzes performance patterns and trends for Circuit Breaker optimization
 * Part of Portal Betina's advanced monitoring system with autism support considerations
 */
export class PerformanceAnalyzer {
  constructor(config = {}) {
    this.config = {
      maxHistorySize: 1000,
      performanceThreshold: 2000, // 2 seconds
      degradationThreshold: 0.7, // 70% of baseline
      monitoringWindow: 300000, // 5 minutes
      enablePredictiveAnalysis: true,
      therapeuticAdjustments: true,
      ...config,
    }

    this.activeMonitors = new Map()
    this.performanceHistory = []
    this.baselineMetrics = new Map()
    this.trendAnalyzer = new TrendAnalyzer()
    this.predictiveModel = new PerformancePredictiveModel()

    this.statistics = {
      totalOperations: 0,
      averageResponseTime: 0,
      medianResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      fastestResponse: Infinity,
      slowestResponse: 0,
      performanceDegradations: 0,
      performanceImprovements: 0,
      predictiveAccuracy: 0,
    }

    this.contextMetrics = new Map()
    this.therapeuticMetrics = new Map()
  }

  /**
   * @method startMonitoring
   * @description Start monitoring a specific operation
   * @param {string} id - Unique monitoring ID
   * @param {Object} context - Execution context
   * @returns {Object} Monitor object with recording methods
   */
  startMonitoring(id, context) {
    const monitor = {
      id,
      context: context || {},
      startTime: Date.now(),
      metrics: {
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCpuUsage(),
        networkLatency: 0,
        therapeuticContext: context.therapeuticContext || null,
      },
      events: [],
    }

    this.activeMonitors.set(id, monitor)

    return {
      recordSuccess: (responseTime) => this.recordSuccess(id, responseTime),
      recordError: (error, responseTime) => this.recordError(id, error, responseTime),
      recordEvent: (eventType, data) => this.recordEvent(id, eventType, data),
      recordMetric: (name, value) => this.recordMetric(id, name, value),
    }
  }

  /**
   * @method stopMonitoring
   * @description Stop monitoring and analyze results
   * @param {string} id - Monitoring ID
   * @returns {Object} Performance analysis results
   */
  stopMonitoring(id) {
    const monitor = this.activeMonitors.get(id)
    if (!monitor) return null

    const endTime = Date.now()
    const totalDuration = endTime - monitor.startTime

    const result = {
      id,
      context: monitor.context,
      startTime: monitor.startTime,
      endTime,
      duration: totalDuration,
      metrics: { ...monitor.metrics },
      events: [...monitor.events],
      analysis: this.analyzePerformance(monitor, totalDuration),
    }

    // Add to history
    this.addToHistory(result)

    // Update statistics
    this.updateStatistics(result)

    // Update context-specific metrics
    this.updateContextMetrics(result)

    // Update therapeutic metrics if applicable
    if (result.context.therapeuticContext) {
      this.updateTherapeuticMetrics(result)
    }

    // Clean up
    this.activeMonitors.delete(id)

    return result
  }

  /**
   * @method recordSuccess
   * @description Record successful operation completion
   * @param {string} id - Monitoring ID
   * @param {number} responseTime - Response time in ms
   */
  recordSuccess(id, responseTime) {
    const monitor = this.activeMonitors.get(id)
    if (!monitor) return

    monitor.metrics.responseTime = responseTime
    monitor.metrics.success = true
    monitor.metrics.endTime = Date.now()

    this.recordEvent(id, 'success', { responseTime })
  }

  /**
   * @method recordError
   * @description Record operation error
   * @param {string} id - Monitoring ID
   * @param {Error} error - Error that occurred
   * @param {number} responseTime - Response time in ms
   */
  recordError(id, error, responseTime) {
    const monitor = this.activeMonitors.get(id)
    if (!monitor) return

    monitor.metrics.error = error.message
    monitor.metrics.errorType = this.categorizeError(error)
    monitor.metrics.responseTime = responseTime
    monitor.metrics.success = false
    monitor.metrics.endTime = Date.now()

    this.recordEvent(id, 'error', {
      error: error.message,
      errorType: monitor.metrics.errorType,
      responseTime,
    })
  }

  /**
   * @method recordEvent
   * @description Record a specific event during monitoring
   * @param {string} id - Monitoring ID
   * @param {string} eventType - Type of event
   * @param {Object} data - Event data
   */
  recordEvent(id, eventType, data) {
    const monitor = this.activeMonitors.get(id)
    if (!monitor) return

    monitor.events.push({
      timestamp: Date.now(),
      type: eventType,
      data: data || {},
    })
  }

  /**
   * @method recordMetric
   * @description Record a custom metric
   * @param {string} id - Monitoring ID
   * @param {string} name - Metric name
   * @param {*} value - Metric value
   */
  recordMetric(id, name, value) {
    const monitor = this.activeMonitors.get(id)
    if (!monitor) return

    monitor.metrics[name] = value
    this.recordEvent(id, 'metric_recorded', { name, value })
  }

  /**
   * @method predict
   * @description Predict performance for a given context
   * @param {string} context - Operation context
   * @returns {Object} Performance prediction
   */
  predict(context) {
    const baseline = this.getBaselinePerformance(context)
    const recentTrend = this.getRecentTrend(context)
    const currentLoad = this.getCurrentSystemLoad()

    let prediction = {
      expectedResponseTime: baseline.averageResponseTime || 1000,
      confidence: 0.5,
      factors: {
        baseline: baseline.averageResponseTime || 1000,
        trend: recentTrend.direction,
        load: currentLoad.level,
      },
      recommendations: [],
    }

    // Apply trend adjustments
    if (recentTrend.direction === 'degrading') {
      prediction.expectedResponseTime *= 1.5
      prediction.recommendations.push('performance_degradation_detected')
    } else if (recentTrend.direction === 'improving') {
      prediction.expectedResponseTime *= 0.8
    }

    // Apply load adjustments
    if (currentLoad.level === 'high') {
      prediction.expectedResponseTime *= 1.3
      prediction.recommendations.push('high_system_load')
    }

    // Therapeutic adjustments
    if (this.config.therapeuticAdjustments && context.therapeuticContext) {
      const therapeuticAdjustment = this.calculateTherapeuticAdjustment(context.therapeuticContext)
      prediction.expectedResponseTime *= therapeuticAdjustment.multiplier
      prediction.recommendations.push(...therapeuticAdjustment.recommendations)
    }

    // Use predictive model if available
    if (this.config.enablePredictiveAnalysis) {
      const modelPrediction = this.predictiveModel.predict(context, {
        baseline,
        trend: recentTrend,
        load: currentLoad,
      })

      prediction = this.mergePredictions(prediction, modelPrediction)
    }

    return prediction
  }

  /**
   * @method analyzePerformance
   * @description Analyze performance data from a completed operation
   * @param {Object} monitor - Monitor object
   * @param {number} duration - Total duration
   * @returns {Object} Performance analysis
   */
  analyzePerformance(monitor, duration) {
    const context = monitor.context.context || 'unknown'
    const baseline = this.getBaselinePerformance(context)

    const analysis = {
      status: 'normal',
      score: 100,
      issues: [],
      improvements: [],
      therapeuticImpact: null,
    }

    // Performance scoring
    if (duration > this.config.performanceThreshold) {
      analysis.status = 'slow'
      analysis.score -= 30
      analysis.issues.push('slow_response_time')
    }

    if (baseline.averageResponseTime && duration > baseline.averageResponseTime * 2) {
      analysis.status = 'degraded'
      analysis.score -= 50
      analysis.issues.push('significant_performance_degradation')
    }

    // Memory analysis
    if (monitor.metrics.memoryUsage > 100 * 1024 * 1024) {
      // 100MB
      analysis.score -= 20
      analysis.issues.push('high_memory_usage')
    }

    // Error analysis
    if (!monitor.metrics.success) {
      analysis.status = 'failed'
      analysis.score -= 70
      analysis.issues.push('operation_failed')
    }

    // Therapeutic context analysis
    if (monitor.context.therapeuticContext) {
      analysis.therapeuticImpact = this.analyzeTherapeuticImpact(monitor, duration)
    }

    // Generate recommendations
    analysis.recommendations = this.generatePerformanceRecommendations(analysis, monitor)

    return analysis
  }

  /**
   * @method getBaselinePerformance
   * @description Get baseline performance metrics for a context
   * @param {string} context - Operation context
   * @returns {Object} Baseline metrics
   */
  getBaselinePerformance(context) {
    if (!this.baselineMetrics.has(context)) {
      return { averageResponseTime: null, count: 0 }
    }

    return this.baselineMetrics.get(context)
  }

  /**
   * @method updateBaselineMetrics
   * @description Update baseline metrics for a context
   * @param {string} context - Operation context
   * @param {number} responseTime - Response time
   */
  updateBaselineMetrics(context, responseTime) {
    if (!this.baselineMetrics.has(context)) {
      this.baselineMetrics.set(context, {
        averageResponseTime: responseTime,
        count: 1,
        totalTime: responseTime,
        minTime: responseTime,
        maxTime: responseTime,
      })
      return
    }

    const baseline = this.baselineMetrics.get(context)
    baseline.count++
    baseline.totalTime += responseTime
    baseline.averageResponseTime = baseline.totalTime / baseline.count
    baseline.minTime = Math.min(baseline.minTime, responseTime)
    baseline.maxTime = Math.max(baseline.maxTime, responseTime)
  }

  /**
   * @method getRecentTrend
   * @description Analyze recent performance trend
   * @param {string} context - Operation context
   * @returns {Object} Trend analysis
   */
  getRecentTrend(context) {
    const recentData = this.getRecentPerformanceData(context, this.config.monitoringWindow)

    if (recentData.length < 2) {
      return { direction: 'stable', confidence: 0.1 }
    }

    return this.trendAnalyzer.analyze(recentData)
  }

  /**
   * @method getCurrentSystemLoad
   * @description Get current system load information
   * @returns {Object} System load info
   */
  getCurrentSystemLoad() {
    const activeMonitorsCount = this.activeMonitors.size
    const recentOperations = this.getRecentOperations(60000) // Last minute

    let level = 'normal'
    if (activeMonitorsCount > 10 || recentOperations > 100) {
      level = 'high'
    } else if (activeMonitorsCount > 5 || recentOperations > 50) {
      level = 'medium'
    }

    return {
      level,
      activeMonitors: activeMonitorsCount,
      recentOperations,
      memoryUsage: this.getMemoryUsage(),
    }
  }

  /**
   * @method getStatistics
   * @description Get comprehensive performance statistics
   * @returns {Object} Performance statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      activeMonitors: this.activeMonitors.size,
      totalContexts: this.contextMetrics.size,
      baselineContexts: this.baselineMetrics.size,
      recentPerformance: this.getRecentPerformanceStatistics(),
    }
  }

  // Helper methods
  addToHistory(result) {
    this.performanceHistory.push(result)

    // Maintain history size
    if (this.performanceHistory.length > this.config.maxHistorySize) {
      this.performanceHistory.shift()
    }
  }

  updateStatistics(result) {
    this.statistics.totalOperations++

    if (result.metrics.success && result.metrics.responseTime) {
      const responseTime = result.metrics.responseTime

      // Update response time statistics
      this.updateResponseTimeStatistics(responseTime)

      // Update baseline for context
      this.updateBaselineMetrics(result.context.context || 'unknown', responseTime)
    }

    if (!result.metrics.success) {
      // Handle error statistics
    }
  }

  updateResponseTimeStatistics(responseTime) {
    const total = this.statistics.totalOperations
    const currentAvg = this.statistics.averageResponseTime

    this.statistics.averageResponseTime = (currentAvg * (total - 1) + responseTime) / total
    this.statistics.fastestResponse = Math.min(this.statistics.fastestResponse, responseTime)
    this.statistics.slowestResponse = Math.max(this.statistics.slowestResponse, responseTime)

    // Update percentiles (simplified)
    this.updatePercentiles(responseTime)
  }

  updatePercentiles(responseTime) {
    // Simplified percentile calculation
    const recentTimes = this.getRecentResponseTimes(1000) // Last 1000 operations
    if (recentTimes.length === 0) return

    recentTimes.sort((a, b) => a - b)

    this.statistics.medianResponseTime = recentTimes[Math.floor(recentTimes.length * 0.5)]
    this.statistics.p95ResponseTime = recentTimes[Math.floor(recentTimes.length * 0.95)]
    this.statistics.p99ResponseTime = recentTimes[Math.floor(recentTimes.length * 0.99)]
  }

  updateContextMetrics(result) {
    const context = result.context.context || 'unknown'

    if (!this.contextMetrics.has(context)) {
      this.contextMetrics.set(context, {
        totalOperations: 0,
        successfulOperations: 0,
        averageResponseTime: 0,
        errorRate: 0,
      })
    }

    const metrics = this.contextMetrics.get(context)
    metrics.totalOperations++

    if (result.metrics.success) {
      metrics.successfulOperations++
      if (result.metrics.responseTime) {
        const currentAvg = metrics.averageResponseTime
        const successCount = metrics.successfulOperations
        metrics.averageResponseTime =
          (currentAvg * (successCount - 1) + result.metrics.responseTime) / successCount
      }
    }

    metrics.errorRate = 1 - metrics.successfulOperations / metrics.totalOperations
  }

  updateTherapeuticMetrics(result) {
    // Implementation for therapeutic-specific metrics
    const therapeuticContext = result.context.therapeuticContext
    if (!therapeuticContext) return

    // Track therapeutic impact on performance
    // This would help optimize the system for autism support scenarios
  }

  categorizeError(error) {
    const message = error.message.toLowerCase()

    if (message.includes('timeout')) return 'timeout'
    if (message.includes('network')) return 'network'
    if (message.includes('memory')) return 'memory'
    if (message.includes('cpu')) return 'cpu'

    return 'unknown'
  }

  getMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
      return performance.memory.usedJSHeapSize
    }
    return 0
  }

  getCpuUsage() {
    // Simplified CPU usage estimation
    return 0
  }

  getRecentPerformanceData(context, timeWindow) {
    const cutoff = Date.now() - timeWindow
    return this.performanceHistory.filter(
      (result) => result.startTime > cutoff && (result.context.context || 'unknown') === context
    )
  }

  getRecentOperations(timeWindow) {
    const cutoff = Date.now() - timeWindow
    return this.performanceHistory.filter((result) => result.startTime > cutoff).length
  }

  getRecentResponseTimes(limit) {
    return this.performanceHistory
      .filter((result) => result.metrics.success && result.metrics.responseTime)
      .slice(-limit)
      .map((result) => result.metrics.responseTime)
  }

  getRecentPerformanceStatistics() {
    const recentData = this.getRecentPerformanceData('', this.config.monitoringWindow)

    if (recentData.length === 0) {
      return { operations: 0, averageResponseTime: 0, errorRate: 0 }
    }

    const successful = recentData.filter((result) => result.metrics.success)
    const avgResponseTime =
      successful.length > 0
        ? successful.reduce((sum, result) => sum + (result.metrics.responseTime || 0), 0) /
          successful.length
        : 0

    return {
      operations: recentData.length,
      averageResponseTime: avgResponseTime,
      errorRate: 1 - successful.length / recentData.length,
    }
  }

  calculateTherapeuticAdjustment(therapeuticContext) {
    // Implementation for therapeutic adjustments
    return {
      multiplier: 1.2, // Slightly longer timeout for therapeutic contexts
      recommendations: ['therapeutic_mode_active'],
    }
  }

  analyzeTherapeuticImpact(monitor, duration) {
    // Analyze how performance impacts therapeutic effectiveness
    return {
      impact: 'minimal',
      recommendations: [],
    }
  }

  generatePerformanceRecommendations(analysis, monitor) {
    const recommendations = []

    if (analysis.issues.includes('slow_response_time')) {
      recommendations.push('optimize_response_time')
      recommendations.push('check_network_conditions')
    }

    if (analysis.issues.includes('high_memory_usage')) {
      recommendations.push('optimize_memory_usage')
      recommendations.push('implement_memory_cleanup')
    }

    return recommendations
  }

  mergePredictions(basePrediction, modelPrediction) {
    // Merge predictions from different sources
    return {
      ...basePrediction,
      expectedResponseTime:
        (basePrediction.expectedResponseTime + modelPrediction.expectedResponseTime) / 2,
      confidence: Math.max(basePrediction.confidence, modelPrediction.confidence),
    }
  }
}

/**
 * @class TrendAnalyzer
 * @description Analyzes performance trends
 */
class TrendAnalyzer {
  analyze(data) {
    if (data.length < 2) return { direction: 'stable', confidence: 0.1 }

    // Simple trend analysis
    const recent = data.slice(-5) // Last 5 data points
    const older = data.slice(-10, -5) // Previous 5 data points

    if (recent.length === 0 || older.length === 0) {
      return { direction: 'stable', confidence: 0.1 }
    }

    const recentAvg =
      recent.reduce((sum, item) => sum + (item.metrics.responseTime || 0), 0) / recent.length
    const olderAvg =
      older.reduce((sum, item) => sum + (item.metrics.responseTime || 0), 0) / older.length

    const change = (recentAvg - olderAvg) / olderAvg

    if (change > 0.2) return { direction: 'degrading', confidence: 0.8 }
    if (change < -0.2) return { direction: 'improving', confidence: 0.8 }

    return { direction: 'stable', confidence: 0.6 }
  }
}

/**
 * @class PerformancePredictiveModel
 * @description Predictive model for performance forecasting
 */
class PerformancePredictiveModel {
  predict(context, data) {
    // Simplified predictive model
    const baseline = data.baseline.averageResponseTime || 1000
    const trendMultiplier =
      data.trend.direction === 'degrading' ? 1.3 : data.trend.direction === 'improving' ? 0.8 : 1.0

    return {
      expectedResponseTime: baseline * trendMultiplier,
      confidence: 0.7,
    }
  }
}

export default PerformanceAnalyzer
