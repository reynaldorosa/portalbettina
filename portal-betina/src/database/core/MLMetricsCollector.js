/**
 * ML METRICS COLLECTOR - SISTEMA DE COLETA DE MÉTRICAS DE MACHINE LEARNING
 * Sistema especializado para coletar métricas de performance dos modelos ML
 *
 * @version 1.0.0
 * @created 2025-01-08
 * @purpose Coleta e análise de métricas de Machine Learning
 */

import logger from '../../utils/logger.js'
import * as tf from '@tensorflow/tfjs'

// Tipos de métricas ML
export const ML_METRIC_TYPES = {
  TRAINING: 'training',
  INFERENCE: 'inference',
  PREDICTION: 'prediction',
  MODEL_PERFORMANCE: 'model_performance',
  DATA_QUALITY: 'data_quality',
  ACCURACY: 'accuracy',
  LOSS: 'loss',
  LATENCY: 'latency',
  MEMORY_USAGE: 'memory_usage',
  CACHE: 'cache',
}

// Estados do collector
export const COLLECTOR_STATES = {
  IDLE: 'idle',
  COLLECTING: 'collecting',
  PROCESSING: 'processing',
  READY: 'ready',
  ERROR: 'error',
}

// Configurações otimizadas para autismo
const AUTISM_ML_METRICS_CONFIG = {
  maxMetricsRetention: 1000,
  samplingInterval: 5000, // 5 segundos
  batchSize: 50,
  accuracyThresholds: {
    excellent: 0.95,
    good: 0.85,
    fair: 0.7,
    poor: 0.5,
  },
  latencyThresholds: {
    fast: 50, // ms
    acceptable: 200,
    slow: 500,
    critical: 1000,
  },
  memoryThresholds: {
    low: 10, // MB
    medium: 50,
    high: 100,
    critical: 200,
  },
}

/**
 * Classe principal do ML Metrics Collector
 */
class MLMetricsCollector {
  constructor() {
    this.state = COLLECTOR_STATES.IDLE
    this.metrics = new Map()
    this.aggregatedStats = new Map()
    this.modelStats = new Map()
    this.alerts = new Map()
    this.collectionInterval = null
    this.startTime = null

    this.statistics = {
      totalMetrics: 0,
      totalTrainingSessions: 0,
      totalInferences: 0,
      averageAccuracy: 0,
      averageLatency: 0,
      averageMemoryUsage: 0,
      alertsTriggered: 0,
      modelsTracked: 0,
      performanceScore: 100,
    }

    this.init()
  }

  /**
   * Inicializa o collector
   */
  init() {
    try {
      this.setupTensorFlowCallbacks()
      this.state = COLLECTOR_STATES.READY

      logger.info('📊 MLMetricsCollector inicializado com sucesso')
    } catch (error) {
      logger.error('Erro ao inicializar MLMetricsCollector:', error)
      this.state = COLLECTOR_STATES.ERROR
    }
  }

  /**
   * Configura callbacks do TensorFlow.js
   */ setupTensorFlowCallbacks() {
    // Interceptar criação de modelos
    const originalModel = tf.model
    const originalSequential = tf.sequential

    // Criar funções wrapper em vez de reatribuir imports
    this.tfModelWrapper = (config) => {
      const model = originalModel(config)
      this.trackModel(model)
      return model
    }

    this.tfSequentialWrapper = (config) => {
      const model = originalSequential(config)
      this.trackModel(model)
      return model
    }
  }

  /**
   * Inicia coleta de métricas
   */
  startCollection() {
    if (this.state === COLLECTOR_STATES.COLLECTING) {
      logger.warn('MLMetricsCollector já está coletando')
      return
    }

    this.state = COLLECTOR_STATES.COLLECTING
    this.startTime = Date.now()

    // Iniciar coleta automática
    this.collectionInterval = setInterval(() => {
      this.collectSystemMetrics()
    }, AUTISM_ML_METRICS_CONFIG.samplingInterval)

    logger.info('🚀 MLMetricsCollector iniciado')
  }

  /**
   * Para coleta de métricas
   */
  stopCollection() {
    if (this.state !== COLLECTOR_STATES.COLLECTING) {
      logger.warn('MLMetricsCollector não está coletando')
      return null
    }

    this.state = COLLECTOR_STATES.PROCESSING

    if (this.collectionInterval) {
      clearInterval(this.collectionInterval)
      this.collectionInterval = null
    }

    const report = this.generateReport()
    this.state = COLLECTOR_STATES.READY

    logger.info('⏹️ MLMetricsCollector parado', {
      duration: Date.now() - this.startTime,
      totalMetrics: this.metrics.size,
    })

    return report
  }

  /**
   * Registra métricas de treinamento
   */
  recordTrainingMetrics(modelId, epoch, logs) {
    const metricKey = `training_${modelId}_${epoch}_${Date.now()}`

    const metric = {
      type: ML_METRIC_TYPES.TRAINING,
      modelId,
      epoch,
      logs: { ...logs },
      loss: logs.loss || 0,
      accuracy: logs.acc || logs.accuracy || 0,
      val_loss: logs.val_loss || null,
      val_accuracy: logs.val_acc || logs.val_accuracy || null,
      timestamp: Date.now(),
      memoryUsage: this.getTensorFlowMemoryUsage(),
    }

    this.metrics.set(metricKey, metric)
    this.updateModelStats(modelId, metric)
    this.updateStatistics(metric)
    this.checkTrainingThresholds(metric)

    return metricKey
  }

  /**
   * Registra métricas de inferência
   */
  recordInferenceMetrics(modelId, inputShape, outputShape, latency, accuracy = null) {
    const metricKey = `inference_${modelId}_${Date.now()}`

    const metric = {
      type: ML_METRIC_TYPES.INFERENCE,
      modelId,
      inputShape,
      outputShape,
      latency,
      accuracy,
      timestamp: Date.now(),
      memoryUsage: this.getTensorFlowMemoryUsage(),
    }

    this.metrics.set(metricKey, metric)
    this.updateModelStats(modelId, metric)
    this.updateStatistics(metric)
    this.checkInferenceThresholds(metric)

    return metricKey
  }

  /**
   * Registra métricas de predição
   */
  recordPredictionMetrics(modelId, confidence, inputData, outputData, processingTime) {
    const metricKey = `prediction_${modelId}_${Date.now()}`

    const metric = {
      type: ML_METRIC_TYPES.PREDICTION,
      modelId,
      confidence,
      inputDataSize: this.calculateDataSize(inputData),
      outputDataSize: this.calculateDataSize(outputData),
      processingTime,
      timestamp: Date.now(),
      memoryUsage: this.getTensorFlowMemoryUsage(),
    }

    this.metrics.set(metricKey, metric)
    this.updateModelStats(modelId, metric)
    this.updateStatistics(metric)
    this.checkPredictionThresholds(metric)

    return metricKey
  }

  /**
   * Registra métricas de cache
   */
  recordCacheMetrics(operation, hit, keySize, valueSize, retrievalTime) {
    const metricKey = `cache_${operation}_${Date.now()}`

    const metric = {
      type: ML_METRIC_TYPES.CACHE,
      operation,
      hit,
      keySize,
      valueSize,
      retrievalTime,
      timestamp: Date.now(),
    }

    this.metrics.set(metricKey, metric)
    this.updateStatistics(metric)

    return metricKey
  }

  /**
   * Rastreia modelo
   */
  trackModel(model) {
    const modelId = this.generateModelId(model)

    if (!this.modelStats.has(modelId)) {
      this.modelStats.set(modelId, {
        id: modelId,
        name: model.name || 'unnamed',
        layers: model.layers ? model.layers.length : 0,
        trainableParams: model.countParams ? model.countParams() : 0,
        createdAt: Date.now(),
        trainingMetrics: [],
        inferenceMetrics: [],
        predictionMetrics: [],
        lastUsed: Date.now(),
        performanceScore: 100,
      })

      this.statistics.modelsTracked++
      logger.info(`🤖 Modelo rastreado: ${modelId}`, this.modelStats.get(modelId))
    }

    return modelId
  }

  /**
   * Gera ID único para modelo
   */
  generateModelId(model) {
    const name = model.name || 'model'
    const params = model.countParams ? model.countParams() : Math.random()
    return `${name}_${params}_${Date.now()}`
  }

  /**
   * Obtém uso de memória do TensorFlow
   */
  getTensorFlowMemoryUsage() {
    try {
      const memoryInfo = tf.memory()
      return {
        numBytes: memoryInfo.numBytes,
        numTensors: memoryInfo.numTensors,
        numDataBuffers: memoryInfo.numDataBuffers,
        unreliable: memoryInfo.unreliable || false,
      }
    } catch (error) {
      logger.error('Erro ao obter uso de memória TensorFlow:', error)
      return null
    }
  }

  /**
   * Calcula tamanho de dados
   */
  calculateDataSize(data) {
    if (!data) return 0

    if (data.constructor === Float32Array || data.constructor === Int32Array) {
      return data.length * 4 // 4 bytes por elemento
    }

    if (Array.isArray(data)) {
      return data.length * 8 // Aproximação
    }

    if (typeof data === 'object') {
      return JSON.stringify(data).length
    }

    return 0
  }

  /**
   * Atualiza estatísticas do modelo
   */
  updateModelStats(modelId, metric) {
    const modelStat = this.modelStats.get(modelId)
    if (!modelStat) return

    modelStat.lastUsed = Date.now()

    switch (metric.type) {
      case ML_METRIC_TYPES.TRAINING:
        modelStat.trainingMetrics.push(metric)
        break
      case ML_METRIC_TYPES.INFERENCE:
        modelStat.inferenceMetrics.push(metric)
        break
      case ML_METRIC_TYPES.PREDICTION:
        modelStat.predictionMetrics.push(metric)
        break
    }

    // Calcular score de performance do modelo
    this.calculateModelPerformanceScore(modelId)
  }

  /**
   * Calcula score de performance do modelo
   */
  calculateModelPerformanceScore(modelId) {
    const modelStat = this.modelStats.get(modelId)
    if (!modelStat) return

    let score = 100

    // Analisar accuracy se disponível
    const recentTraining = modelStat.trainingMetrics.slice(-10)
    if (recentTraining.length > 0) {
      const avgAccuracy =
        recentTraining.reduce((sum, m) => sum + (m.accuracy || 0), 0) / recentTraining.length

      if (avgAccuracy < AUTISM_ML_METRICS_CONFIG.accuracyThresholds.poor) {
        score -= 30
      } else if (avgAccuracy < AUTISM_ML_METRICS_CONFIG.accuracyThresholds.fair) {
        score -= 15
      } else if (avgAccuracy >= AUTISM_ML_METRICS_CONFIG.accuracyThresholds.excellent) {
        score += 10
      }
    }

    // Analisar latência
    const recentInferences = modelStat.inferenceMetrics.slice(-10)
    if (recentInferences.length > 0) {
      const avgLatency =
        recentInferences.reduce((sum, m) => sum + (m.latency || 0), 0) / recentInferences.length

      if (avgLatency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.critical) {
        score -= 25
      } else if (avgLatency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.slow) {
        score -= 10
      } else if (avgLatency <= AUTISM_ML_METRICS_CONFIG.latencyThresholds.fast) {
        score += 5
      }
    }

    modelStat.performanceScore = Math.max(0, Math.min(100, score))
  }

  /**
   * Atualiza estatísticas gerais
   */
  updateStatistics(metric) {
    this.statistics.totalMetrics++

    switch (metric.type) {
      case ML_METRIC_TYPES.TRAINING:
        this.statistics.totalTrainingSessions++
        if (metric.accuracy) {
          this.updateAverageAccuracy(metric.accuracy)
        }
        break

      case ML_METRIC_TYPES.INFERENCE:
        this.statistics.totalInferences++
        if (metric.latency) {
          this.updateAverageLatency(metric.latency)
        }
        break
    }

    if (metric.memoryUsage && metric.memoryUsage.numBytes) {
      this.updateAverageMemoryUsage(metric.memoryUsage.numBytes / (1024 * 1024)) // Convert to MB
    }

    this.calculateOverallPerformanceScore()
  }

  /**
   * Atualiza accuracy média
   */
  updateAverageAccuracy(accuracy) {
    const currentAvg = this.statistics.averageAccuracy
    const count = this.statistics.totalTrainingSessions
    this.statistics.averageAccuracy = (currentAvg * (count - 1) + accuracy) / count
  }

  /**
   * Atualiza latência média
   */
  updateAverageLatency(latency) {
    const currentAvg = this.statistics.averageLatency
    const count = this.statistics.totalInferences
    this.statistics.averageLatency = (currentAvg * (count - 1) + latency) / count
  }

  /**
   * Atualiza uso médio de memória
   */
  updateAverageMemoryUsage(memoryMB) {
    const currentAvg = this.statistics.averageMemoryUsage
    const count = this.statistics.totalMetrics
    this.statistics.averageMemoryUsage = (currentAvg * (count - 1) + memoryMB) / count
  }

  /**
   * Calcula score geral de performance
   */
  calculateOverallPerformanceScore() {
    let score = 100

    // Penalizar accuracy baixa
    if (this.statistics.averageAccuracy < AUTISM_ML_METRICS_CONFIG.accuracyThresholds.poor) {
      score -= 40
    } else if (this.statistics.averageAccuracy < AUTISM_ML_METRICS_CONFIG.accuracyThresholds.fair) {
      score -= 20
    }

    // Penalizar latência alta
    if (this.statistics.averageLatency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.critical) {
      score -= 30
    } else if (this.statistics.averageLatency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.slow) {
      score -= 15
    }

    // Penalizar uso alto de memória
    if (this.statistics.averageMemoryUsage > AUTISM_ML_METRICS_CONFIG.memoryThresholds.critical) {
      score -= 25
    } else if (
      this.statistics.averageMemoryUsage > AUTISM_ML_METRICS_CONFIG.memoryThresholds.high
    ) {
      score -= 10
    }

    // Penalizar alertas
    score -= this.statistics.alertsTriggered * 2

    this.statistics.performanceScore = Math.max(0, score)
  }

  /**
   * Verifica limites de treinamento
   */
  checkTrainingThresholds(metric) {
    if (metric.accuracy && metric.accuracy < AUTISM_ML_METRICS_CONFIG.accuracyThresholds.poor) {
      this.triggerAlert(
        'WARNING',
        `Accuracy baixa no treinamento: ${(metric.accuracy * 100).toFixed(2)}%`,
        metric
      )
    }

    if (metric.loss && metric.loss > 2.0) {
      this.triggerAlert('WARNING', `Loss alta no treinamento: ${metric.loss.toFixed(4)}`, metric)
    }
  }

  /**
   * Verifica limites de inferência
   */
  checkInferenceThresholds(metric) {
    if (metric.latency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.critical) {
      this.triggerAlert(
        'CRITICAL',
        `Latência crítica na inferência: ${metric.latency.toFixed(2)}ms`,
        metric
      )
    } else if (metric.latency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.slow) {
      this.triggerAlert(
        'WARNING',
        `Latência alta na inferência: ${metric.latency.toFixed(2)}ms`,
        metric
      )
    }
  }

  /**
   * Verifica limites de predição
   */
  checkPredictionThresholds(metric) {
    if (metric.confidence && metric.confidence < 0.5) {
      this.triggerAlert(
        'INFO',
        `Baixa confiança na predição: ${(metric.confidence * 100).toFixed(2)}%`,
        metric
      )
    }

    if (metric.processingTime > AUTISM_ML_METRICS_CONFIG.latencyThresholds.slow) {
      this.triggerAlert(
        'WARNING',
        `Processamento lento da predição: ${metric.processingTime.toFixed(2)}ms`,
        metric
      )
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

    logger.warn(`🚨 ML Alert ${severity}: ${message}`, metric)
  }

  /**
   * Coleta métricas do sistema
   */
  collectSystemMetrics() {
    try {
      // Métricas de memória TensorFlow
      const tfMemory = this.getTensorFlowMemoryUsage()
      if (tfMemory) {
        const metricKey = `tf_memory_${Date.now()}`
        this.metrics.set(metricKey, {
          type: ML_METRIC_TYPES.MEMORY_USAGE,
          ...tfMemory,
          timestamp: Date.now(),
        })
      }

      // Limpar métricas antigas
      this.cleanupOldMetrics()
    } catch (error) {
      logger.error('Erro ao coletar métricas do sistema ML:', error)
    }
  }

  /**
   * Limpa métricas antigas
   */
  cleanupOldMetrics() {
    const now = Date.now()
    const retentionPeriod = 30 * 60 * 1000 // 30 minutos

    let removed = 0
    for (const [key, metric] of this.metrics.entries()) {
      if (now - metric.timestamp > retentionPeriod) {
        this.metrics.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      logger.debug(`🧹 Removidas ${removed} métricas antigas`)
    }

    // Manter apenas algumas métricas por modelo
    for (const [modelId, modelStat] of this.modelStats.entries()) {
      if (modelStat.trainingMetrics.length > AUTISM_ML_METRICS_CONFIG.maxMetricsRetention) {
        modelStat.trainingMetrics = modelStat.trainingMetrics.slice(
          -AUTISM_ML_METRICS_CONFIG.maxMetricsRetention
        )
      }
      if (modelStat.inferenceMetrics.length > AUTISM_ML_METRICS_CONFIG.maxMetricsRetention) {
        modelStat.inferenceMetrics = modelStat.inferenceMetrics.slice(
          -AUTISM_ML_METRICS_CONFIG.maxMetricsRetention
        )
      }
      if (modelStat.predictionMetrics.length > AUTISM_ML_METRICS_CONFIG.maxMetricsRetention) {
        modelStat.predictionMetrics = modelStat.predictionMetrics.slice(
          -AUTISM_ML_METRICS_CONFIG.maxMetricsRetention
        )
      }
    }
  }

  /**
   * Gera relatório completo
   */
  generateReport() {
    const report = {
      session: {
        startTime: this.startTime,
        endTime: Date.now(),
        duration: Date.now() - this.startTime,
        totalMetrics: this.metrics.size,
        totalAlerts: this.alerts.size,
      },
      statistics: { ...this.statistics },
      modelStats: Array.from(this.modelStats.values()),
      topPerformingModels: this.getTopPerformingModels(),
      performanceInsights: this.generatePerformanceInsights(),
      recommendations: this.generateRecommendations(),
      metricsSummary: this.getMetricsSummary(),
      alertsSummary: this.getAlertsSummary(),
    }

    logger.info('📊 Relatório ML gerado', report)
    return report
  }

  /**
   * Obtém modelos com melhor performance
   */
  getTopPerformingModels() {
    return Array.from(this.modelStats.values())
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 5)
      .map((model) => ({
        id: model.id,
        name: model.name,
        performanceScore: model.performanceScore,
        totalMetrics:
          model.trainingMetrics.length +
          model.inferenceMetrics.length +
          model.predictionMetrics.length,
        lastUsed: model.lastUsed,
      }))
  }

  /**
   * Gera insights de performance
   */
  generatePerformanceInsights() {
    const insights = []

    if (this.statistics.averageAccuracy > AUTISM_ML_METRICS_CONFIG.accuracyThresholds.excellent) {
      insights.push({
        type: 'POSITIVE',
        message: `Excelente accuracy média: ${(this.statistics.averageAccuracy * 100).toFixed(2)}%`,
      })
    }

    if (this.statistics.averageLatency < AUTISM_ML_METRICS_CONFIG.latencyThresholds.fast) {
      insights.push({
        type: 'POSITIVE',
        message: `Inferência rápida: ${this.statistics.averageLatency.toFixed(2)}ms em média`,
      })
    }

    if (this.statistics.averageMemoryUsage > AUTISM_ML_METRICS_CONFIG.memoryThresholds.high) {
      insights.push({
        type: 'NEGATIVE',
        message: `Alto uso de memória: ${this.statistics.averageMemoryUsage.toFixed(2)}MB em média`,
      })
    }

    const activeDays = this.calculateActiveDays()
    if (activeDays > 0) {
      insights.push({
        type: 'INFO',
        message: `Sistema ativo por ${activeDays} dias consecutivos`,
      })
    }

    return insights
  }

  /**
   * Calcula dias ativos
   */
  calculateActiveDays() {
    if (!this.startTime) return 0
    return Math.floor((Date.now() - this.startTime) / (1000 * 60 * 60 * 24))
  }

  /**
   * Gera recomendações
   */
  generateRecommendations() {
    const recommendations = []

    if (this.statistics.averageAccuracy < AUTISM_ML_METRICS_CONFIG.accuracyThresholds.fair) {
      recommendations.push({
        type: 'MODEL_OPTIMIZATION',
        priority: 'HIGH',
        message: 'Otimizar arquitetura dos modelos para melhorar accuracy',
        action: 'Ajustar hiperparâmetros, aumentar dados de treino ou revisar arquitetura',
      })
    }

    if (this.statistics.averageLatency > AUTISM_ML_METRICS_CONFIG.latencyThresholds.slow) {
      recommendations.push({
        type: 'PERFORMANCE',
        priority: 'MEDIUM',
        message: 'Otimizar velocidade de inferência',
        action: 'Implementar quantização, pruning ou usar modelo mais leve',
      })
    }

    if (this.statistics.averageMemoryUsage > AUTISM_ML_METRICS_CONFIG.memoryThresholds.high) {
      recommendations.push({
        type: 'MEMORY',
        priority: 'MEDIUM',
        message: 'Reduzir uso de memória',
        action: 'Implementar dispose de tensors e otimizar batch size',
      })
    }

    if (this.statistics.alertsTriggered > 50) {
      recommendations.push({
        type: 'MONITORING',
        priority: 'LOW',
        message: 'Muitos alertas disparados',
        action: 'Revisar thresholds de alertas ou investigar problemas recorrentes',
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
   * Obtém estatísticas do collector
   */
  getStatistics() {
    return {
      state: this.state,
      statistics: this.statistics,
      metricsCount: this.metrics.size,
      alertsCount: this.alerts.size,
      modelsTracked: this.modelStats.size,
      uptime: this.startTime ? Date.now() - this.startTime : 0,
    }
  }

  /**
   * Exporta dados para análise externa
   */
  exportData() {
    return {
      metrics: Array.from(this.metrics.entries()),
      modelStats: Array.from(this.modelStats.entries()),
      alerts: Array.from(this.alerts.entries()),
      statistics: this.statistics,
      config: AUTISM_ML_METRICS_CONFIG,
      exportedAt: Date.now(),
    }
  }

  /**
   * Destroy: limpa recursos
   */
  destroy() {
    // Parar intervalos
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval)
    }

    // Limpar dados
    this.metrics.clear()
    this.modelStats.clear()
    this.alerts.clear()

    this.state = COLLECTOR_STATES.IDLE

    logger.info('🧹 MLMetricsCollector destruído')
  }
}

// Instância singleton
let collectorInstance = null

/**
 * Obtém instância do collector (singleton)
 */
export const getMLMetricsCollector = () => {
  if (!collectorInstance) {
    collectorInstance = new MLMetricsCollector()
  }
  return collectorInstance
}

/**
 * Funções utilitárias para uso direto
 */
export const startMLMetricsCollection = () => getMLMetricsCollector().startCollection()
export const stopMLMetricsCollection = () => getMLMetricsCollector().stopCollection()
export const getMLMetricsStats = () => getMLMetricsCollector().getStatistics()
export const recordTraining = (modelId, epoch, logs) =>
  getMLMetricsCollector().recordTrainingMetrics(modelId, epoch, logs)
export const recordInference = (modelId, inputShape, outputShape, latency, accuracy) =>
  getMLMetricsCollector().recordInferenceMetrics(
    modelId,
    inputShape,
    outputShape,
    latency,
    accuracy
  )
export const recordPrediction = (modelId, confidence, inputData, outputData, processingTime) =>
  getMLMetricsCollector().recordPredictionMetrics(
    modelId,
    confidence,
    inputData,
    outputData,
    processingTime
  )

export default MLMetricsCollector
