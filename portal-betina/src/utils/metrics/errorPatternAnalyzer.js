/**
 * @class ErrorPatternAnalyzer
 * @description Analyzes error patterns for intelligent decision making in Circuit Breaker
 * Part of Portal Betina's advanced monitoring system for autism support
 */
export class ErrorPatternAnalyzer {
  constructor(config = {}) {
    this.config = {
      maxPatternHistory: 1000,
      patternWindow: 100,
      minPatternOccurrences: 3,
      confidenceThreshold: 0.7,
      enableLearning: true,
      ...config,
    }

    this.patterns = new Map()
    this.history = []
    this.predictions = new Map()
    this.contextPatterns = new Map()
    this.temporalPatterns = new Map()
    this.seasonalityDetector = new SeasonalityDetector()

    this.statistics = {
      totalErrors: 0,
      patternsDetected: 0,
      correctPredictions: 0,
      totalPredictions: 0,
      accuracy: 0,
    }
  }

  /**
   * @method recordFailure
   * @description Record a failure for pattern analysis
   * @param {Error} error - The error that occurred
   * @param {Object} context - Execution context
   */
  recordFailure(error, context) {
    const timestamp = Date.now()
    const errorRecord = {
      timestamp,
      errorType: this.categorizeError(error),
      errorMessage: error.message,
      context: context.context || 'unknown',
      priority: context.priority || 'normal',
      therapeuticContext: context.therapeuticContext || null,
      stackTrace: error.stack ? this.hashStackTrace(error.stack) : null,
    }

    this.history.push(errorRecord)
    this.statistics.totalErrors++

    // Maintain history size
    if (this.history.length > this.config.maxPatternHistory) {
      this.history.shift()
    }

    // Update patterns
    this.updatePatterns(errorRecord)

    // Update temporal patterns
    this.updateTemporalPatterns(errorRecord)

    // Update context-specific patterns
    this.updateContextPatterns(errorRecord)

    // Check for new pattern emergence
    this.detectEmergingPatterns()
  }

  /**
   * @method recordSuccess
   * @description Record a success to improve pattern accuracy
   * @param {Object} context - Execution context
   * @param {number} responseTime - Response time in ms
   */
  recordSuccess(context, responseTime) {
    const successRecord = {
      timestamp: Date.now(),
      context: context.context || 'unknown',
      responseTime,
      priority: context.priority || 'normal',
      therapeuticContext: context.therapeuticContext || null,
    }

    // Update pattern confidence based on successful operations
    this.updatePatternConfidence(successRecord)
  }

  /**
   * @method predict
   * @description Predict risk based on patterns
   * @param {string} context - Operation context
   * @returns {Object} Prediction result
   */
  predict(context) {
    const baseRisk = this.calculateBaseRisk(context)
    const patternRisk = this.calculatePatternRisk(context)
    const temporalRisk = this.calculateTemporalRisk()
    const therapeuticRisk = this.calculateTherapeuticRisk(context)

    const combinedRisk = this.combineRiskFactors({
      base: baseRisk,
      pattern: patternRisk,
      temporal: temporalRisk,
      therapeutic: therapeuticRisk,
    })

    const prediction = {
      riskLevel: this.categorizeRisk(combinedRisk),
      riskScore: combinedRisk,
      riskMultiplier: this.calculateRiskMultiplier(combinedRisk),
      confidence: this.calculatePredictionConfidence(context),
      recommendedActions: this.generateRecommendations(combinedRisk, context),
      patterns: this.getRelevantPatterns(context),
    }

    // Store prediction for accuracy tracking
    this.storePrediction(context, prediction)

    return prediction
  }

  /**
   * @method categorizeError
   * @description Categorize error types for pattern analysis
   * @param {Error} error - Error to categorize
   * @returns {string} Error category
   */
  categorizeError(error) {
    const message = error.message.toLowerCase()

    if (message.includes('timeout')) return 'timeout'
    if (message.includes('network') || message.includes('fetch')) return 'network'
    if (message.includes('auth') || message.includes('unauthorized')) return 'authentication'
    if (message.includes('500') || message.includes('internal')) return 'server'
    if (message.includes('400') || message.includes('bad request')) return 'client'
    if (message.includes('429') || message.includes('rate limit')) return 'rate_limit'
    if (message.includes('connection')) return 'connection'
    if (message.includes('parse') || message.includes('json')) return 'parsing'

    return 'unknown'
  }

  /**
   * @method updatePatterns
   * @description Update error patterns based on new error
   * @param {Object} errorRecord - Error record
   */
  updatePatterns(errorRecord) {
    const patternKey = this.generatePatternKey(errorRecord)

    if (!this.patterns.has(patternKey)) {
      this.patterns.set(patternKey, {
        count: 0,
        firstSeen: errorRecord.timestamp,
        lastSeen: errorRecord.timestamp,
        contexts: new Set(),
        errors: [],
        confidence: 0,
      })
    }

    const pattern = this.patterns.get(patternKey)
    pattern.count++
    pattern.lastSeen = errorRecord.timestamp
    pattern.contexts.add(errorRecord.context)
    pattern.errors.push(errorRecord)

    // Maintain error history size
    if (pattern.errors.length > 100) {
      pattern.errors.shift()
    }

    // Update confidence
    pattern.confidence = this.calculatePatternConfidence(pattern)

    // Mark as detected pattern if meets threshold
    if (pattern.count >= this.config.minPatternOccurrences) {
      this.statistics.patternsDetected++
    }
  }

  /**
   * @method generatePatternKey
   * @description Generate a unique key for pattern identification
   * @param {Object} errorRecord - Error record
   * @returns {string} Pattern key
   */
  generatePatternKey(errorRecord) {
    const components = [
      errorRecord.errorType,
      errorRecord.context,
      this.getTimeOfDay(errorRecord.timestamp),
      this.getDayOfWeek(errorRecord.timestamp),
    ]

    return components.join('|')
  }

  /**
   * @method calculateBaseRisk
   * @description Calculate base risk for a context
   * @param {string} context - Operation context
   * @returns {number} Risk score (0-1)
   */
  calculateBaseRisk(context) {
    const recentErrors = this.getRecentErrors(300000) // Last 5 minutes
    const contextErrors = recentErrors.filter((error) => error.context === context)

    if (recentErrors.length === 0) return 0.1 // Base low risk

    const errorRate = contextErrors.length / Math.max(recentErrors.length, 1)
    return Math.min(errorRate * 2, 1) // Scale and cap at 1
  }

  /**
   * @method calculatePatternRisk
   * @description Calculate risk based on detected patterns
   * @param {string} context - Operation context
   * @returns {number} Risk score (0-1)
   */
  calculatePatternRisk(context) {
    let maxRisk = 0

    for (const [patternKey, pattern] of this.patterns) {
      if (pattern.contexts.has(context) && pattern.confidence > this.config.confidenceThreshold) {
        const recentOccurrences = this.getRecentPatternOccurrences(pattern, 600000) // Last 10 minutes
        const risk = Math.min(recentOccurrences * 0.2, 1)
        maxRisk = Math.max(maxRisk, risk)
      }
    }

    return maxRisk
  }

  /**
   * @method getPatterns
   * @description Get all detected patterns
   * @returns {Array} Array of patterns
   */
  getPatterns() {
    return Array.from(this.patterns.entries()).map(([key, pattern]) => ({
      key,
      ...pattern,
      contexts: Array.from(pattern.contexts),
    }))
  }

  /**
   * @method getLastPattern
   * @description Get the most recent pattern
   * @returns {Object|null} Last pattern or null
   */
  getLastPattern() {
    if (this.history.length === 0) return null

    const lastError = this.history[this.history.length - 1]
    const patternKey = this.generatePatternKey(lastError)
    const pattern = this.patterns.get(patternKey)

    return pattern ? { key: patternKey, ...pattern } : null
  }

  /**
   * @method getRelevantPatterns
   * @description Get patterns relevant to a context
   * @param {string} context - Operation context
   * @returns {Array} Relevant patterns
   */
  getRelevantPatterns(context) {
    return this.getPatterns().filter(
      (pattern) =>
        pattern.contexts.includes(context) && pattern.confidence > this.config.confidenceThreshold
    )
  }

  /**
   * @method getStatistics
   * @description Get analyzer statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      accuracy:
        this.statistics.totalPredictions > 0
          ? this.statistics.correctPredictions / this.statistics.totalPredictions
          : 0,
      totalPatterns: this.patterns.size,
      activePatterns: this.getActivePatterns().length,
    }
  }

  // Helper methods
  getRecentErrors(timeWindow) {
    const cutoff = Date.now() - timeWindow
    return this.history.filter((error) => error.timestamp > cutoff)
  }

  getRecentPatternOccurrences(pattern, timeWindow) {
    const cutoff = Date.now() - timeWindow
    return pattern.errors.filter((error) => error.timestamp > cutoff).length
  }

  calculatePatternConfidence(pattern) {
    const recency = (Date.now() - pattern.lastSeen) / (24 * 60 * 60 * 1000) // Days
    const frequency = Math.min(pattern.count / 10, 1) // Normalize to 0-1
    const consistency = pattern.contexts.size === 1 ? 1 : 0.8 // Higher for single context

    return Math.max(0, (frequency + consistency) / 2 - recency * 0.1)
  }

  getActivePatterns() {
    const cutoff = Date.now() - 3600000 // Last hour
    return this.getPatterns().filter((pattern) => pattern.lastSeen > cutoff)
  }

  getTimeOfDay(timestamp) {
    const hour = new Date(timestamp).getHours()
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
  }

  getDayOfWeek(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  }

  hashStackTrace(stackTrace) {
    // Simple hash function for stack traces
    let hash = 0
    for (let i = 0; i < stackTrace.length; i++) {
      const char = stackTrace.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  // Additional helper methods for advanced pattern analysis
  detectEmergingPatterns() {
    // Implementation for detecting new patterns
  }

  updateTemporalPatterns(errorRecord) {
    // Implementation for temporal pattern tracking
  }

  updateContextPatterns(errorRecord) {
    // Implementation for context-specific patterns
  }

  updatePatternConfidence(successRecord) {
    // Implementation for updating pattern confidence based on successes
  }

  calculateTemporalRisk() {
    // Implementation for temporal risk calculation
    return 0.1
  }

  calculateTherapeuticRisk(context) {
    // Implementation for therapeutic context risk
    return 0.1
  }

  combineRiskFactors(risks) {
    // Weighted combination of risk factors
    const weights = { base: 0.3, pattern: 0.4, temporal: 0.2, therapeutic: 0.1 }
    return Object.entries(risks).reduce(
      (total, [factor, risk]) => total + risk * weights[factor],
      0
    )
  }

  categorizeRisk(riskScore) {
    if (riskScore > 0.8) return 'very_high'
    if (riskScore > 0.6) return 'high'
    if (riskScore > 0.4) return 'medium'
    if (riskScore > 0.2) return 'low'
    return 'very_low'
  }

  calculateRiskMultiplier(riskScore) {
    return 1 + riskScore // Simple linear multiplier
  }

  calculatePredictionConfidence(context) {
    const relevantPatterns = this.getRelevantPatterns(context)
    if (relevantPatterns.length === 0) return 0.5

    const avgConfidence =
      relevantPatterns.reduce((sum, pattern) => sum + pattern.confidence, 0) /
      relevantPatterns.length

    return avgConfidence
  }

  generateRecommendations(riskScore, context) {
    const recommendations = []

    if (riskScore > 0.7) {
      recommendations.push('increase_timeout')
      recommendations.push('enable_circuit_breaker')
    }

    if (riskScore > 0.5) {
      recommendations.push('increase_monitoring')
      recommendations.push('prepare_fallback')
    }

    return recommendations
  }

  storePrediction(context, prediction) {
    // Store for accuracy tracking
    this.predictions.set(`${context}_${Date.now()}`, prediction)
    this.statistics.totalPredictions++
  }
}

/**
 * @class SeasonalityDetector
 * @description Detects seasonal patterns in errors
 */
class SeasonalityDetector {
  constructor() {
    this.patterns = new Map()
  }

  detectSeasonality(data) {
    // Implementation for seasonality detection
    return { seasonal: false, period: null }
  }
}

export default ErrorPatternAnalyzer
