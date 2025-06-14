/**
 * @file MachineLearningOrchestrator.js
 * @description Orquestrador central de Machine Learning com TensorFlow.js
 * Implementa pipeline completo de ML para análise preditiva e adaptativa
 *
 * @version 2.0.0
 * @created 2025-01-10
 * @author Engineering Team
 */

import * as tf from '@tensorflow/tfjs'
import { getPerformanceProfiler } from '../utils/core/PerformanceProfiler.js'
import { getMLMetricsCollector } from './MLMetricsCollector.js'
import logger from '../utils/logger.js'

/**
 * Estados do pipeline de ML
 */
const ML_PIPELINE_STATES = {
  IDLE: 'idle',
  TRAINING: 'training',
  VALIDATING: 'validating',
  PREDICTING: 'predicting',
  ERROR: 'error',
}

/**
 * Tipos de modelos suportados
 */
const MODEL_TYPES = {
  DIFFICULTY_PREDICTOR: 'difficulty_predictor',
  ENGAGEMENT_CLASSIFIER: 'engagement_classifier',
  LEARNING_STYLE_DETECTOR: 'learning_style_detector',
  COGNITIVE_PROFILER: 'cognitive_profiler',
  BEHAVIORAL_ANALYZER: 'behavioral_analyzer',
}

/**
 * Configurações de hiperparâmetros otimizadas para autismo
 */
const AUTISM_OPTIMIZED_HYPERPARAMS = {
  learningRate: 0.001,
  batchSize: 16,
  epochs: 50,
  validationSplit: 0.2,
  patience: 10,
  minDelta: 0.001,
}

class MachineLearningOrchestrator {
  constructor() {
    this.models = new Map()
    this.pipelineState = ML_PIPELINE_STATES.IDLE
    this.profiler = getPerformanceProfiler()
    this.metricsCollector = getMLMetricsCollector()

    // Cache para predições frequentes
    this.predictionCache = new Map()
    this.cacheMaxSize = 1000
    this.cacheHitRate = 0

    // Métricas de performance
    this.performanceMetrics = {
      totalPredictions: 0,
      averageInferenceTime: 0,
      modelAccuracies: new Map(),
      trainingTimes: new Map(),
    }

    this.initializeMLPipeline()
  }
  /**
   * Inicializa o pipeline de ML
   */
  async initializeMLPipeline() {
    try {
      const startTime = performance.now()

      // Configurar backend otimizado
      await tf.ready()
      await this.setupOptimizedBackend()

      // Carregar modelos pré-treinados se existirem
      await this.loadPretrainedModels()

      const duration = performance.now() - startTime

      logger.info('🧠 ML Pipeline inicializado com sucesso', {
        backend: tf.getBackend(),
        memoryInfo: tf.memory(),
        modelsLoaded: this.models.size,
        initializationTime: duration,
      })
    } catch (error) {
      this.pipelineState = ML_PIPELINE_STATES.ERROR
      logger.error('❌ Erro ao inicializar ML Pipeline', { error: error.message })
      throw error
    }
  }

  /**
   * Configura backend otimizado para performance
   */
  async setupOptimizedBackend() {
    try {
      // Tentar usar WebGL para aceleração GPU
      if (await tf.setBackend('webgl')) {
        logger.info('🚀 WebGL backend ativado para aceleração GPU')
      } else if (await tf.setBackend('cpu')) {
        logger.info('💻 CPU backend ativado')
      } else {
        throw new Error('Nenhum backend ML disponível')
      }
    } catch (error) {
      logger.warn('⚠️ Fallback para CPU backend', { error: error.message })
      await tf.setBackend('cpu')
    }
  }

  /**
   * Cria modelo para predição de dificuldade adaptativa
   */
  createDifficultyPredictorModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [8], // features: accuracy, response_time, attempts, etc.
          units: 32,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu',
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 3, // easy, medium, hard
          activation: 'softmax',
        }),
      ],
    })

    model.compile({
      optimizer: tf.train.adam(AUTISM_OPTIMIZED_HYPERPARAMS.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy', 'precision', 'recall'],
    })

    return model
  }

  /**
   * Cria modelo para classificação de engajamento
   */
  createEngagementClassifierModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [12], // features: session_duration, clicks, pauses, etc.
          units: 64,
          activation: 'relu',
        }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 4, // low, medium, high, very_high
          activation: 'softmax',
        }),
      ],
    })

    model.compile({
      optimizer: tf.train.adam(AUTISM_OPTIMIZED_HYPERPARAMS.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy', 'f1Score'],
    })

    return model
  }

  /**
   * Cria modelo para detecção de estilo de aprendizagem
   */
  createLearningStyleDetectorModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [15], // features: visual_score, auditory_score, kinesthetic_score, etc.
          units: 48,
          activation: 'tanh', // tanh funciona bem para perfis cognitivos
        }),
        tf.layers.dropout({ rate: 0.25 }),
        tf.layers.dense({
          units: 24,
          activation: 'tanh',
        }),
        tf.layers.dense({
          units: 3, // visual, auditory, kinesthetic
          activation: 'softmax',
        }),
      ],
    })

    model.compile({
      optimizer: tf.train.adamax(0.002), // Adamax para estabilidade
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  /**
   * Treina modelo com dados de sessão
   */
  async trainModel(modelType, trainingData, validationData = null) {
    try {
      this.pipelineState = ML_PIPELINE_STATES.TRAINING
      this.profiler.startMeasurement(`training_${modelType}`)

      let model = this.models.get(modelType)
      if (!model) {
        model = this.createModelByType(modelType)
        this.models.set(modelType, model)
      }

      // Preparar dados para treinamento
      const { xs, ys } = this.preprocessTrainingData(trainingData, modelType)

      // Configurar callbacks para monitoramento
      const callbacks = this.createTrainingCallbacks(modelType)

      // Treinar modelo
      const history = await model.fit(xs, ys, {
        epochs: AUTISM_OPTIMIZED_HYPERPARAMS.epochs,
        batchSize: AUTISM_OPTIMIZED_HYPERPARAMS.batchSize,
        validationSplit: validationData ? 0 : AUTISM_OPTIMIZED_HYPERPARAMS.validationSplit,
        validationData: validationData
          ? this.preprocessValidationData(validationData, modelType)
          : null,
        callbacks,
        verbose: 0,
      })

      // Calcular métricas de performance
      const metrics = this.calculateTrainingMetrics(history)
      this.performanceMetrics.modelAccuracies.set(modelType, metrics.accuracy)

      this.profiler.endMeasurement(`training_${modelType}`)
      this.pipelineState = ML_PIPELINE_STATES.IDLE

      // Salvar modelo treinado
      await this.saveModel(modelType, model)

      logger.info(`✅ Modelo ${modelType} treinado com sucesso`, {
        accuracy: metrics.accuracy,
        loss: metrics.loss,
        epochs: history.epoch.length,
        trainingTime: this.profiler.getLastMeasurement(`training_${modelType}`),
      })

      return { model, metrics, history }
    } catch (error) {
      this.pipelineState = ML_PIPELINE_STATES.ERROR
      logger.error(`❌ Erro ao treinar modelo ${modelType}`, { error: error.message })
      throw error
    }
  }

  /**
   * Faz predição usando modelo específico
   */
  async predict(modelType, inputData, useCache = true) {
    try {
      this.pipelineState = ML_PIPELINE_STATES.PREDICTING
      this.profiler.startMeasurement(`prediction_${modelType}`)

      // Verificar cache primeiro
      const cacheKey = this.generateCacheKey(modelType, inputData)
      if (useCache && this.predictionCache.has(cacheKey)) {
        this.cacheHitRate =
          (this.cacheHitRate * this.performanceMetrics.totalPredictions + 1) /
          (this.performanceMetrics.totalPredictions + 1)
        this.performanceMetrics.totalPredictions++
        return this.predictionCache.get(cacheKey)
      }

      const model = this.models.get(modelType)
      if (!model) {
        throw new Error(`Modelo ${modelType} não encontrado`)
      }

      // Preprocessar entrada
      const processedInput = this.preprocessInputData(inputData, modelType)

      // Fazer predição
      const prediction = model.predict(processedInput)
      const result = await this.postprocessPrediction(prediction, modelType)

      // Atualizar cache
      if (useCache) {
        this.updatePredictionCache(cacheKey, result)
      }

      // Atualizar métricas
      this.updatePredictionMetrics()

      this.profiler.endMeasurement(`prediction_${modelType}`)
      this.pipelineState = ML_PIPELINE_STATES.IDLE

      // Limpar tensores para evitar memory leak
      processedInput.dispose()
      prediction.dispose()

      return result
    } catch (error) {
      this.pipelineState = ML_PIPELINE_STATES.ERROR
      logger.error(`❌ Erro na predição ${modelType}`, { error: error.message })
      throw error
    }
  }

  /**
   * Cria modelo baseado no tipo
   */
  createModelByType(modelType) {
    switch (modelType) {
      case MODEL_TYPES.DIFFICULTY_PREDICTOR:
        return this.createDifficultyPredictorModel()
      case MODEL_TYPES.ENGAGEMENT_CLASSIFIER:
        return this.createEngagementClassifierModel()
      case MODEL_TYPES.LEARNING_STYLE_DETECTOR:
        return this.createLearningStyleDetectorModel()
      default:
        throw new Error(`Tipo de modelo não suportado: ${modelType}`)
    }
  }

  /**
   * Preprocessa dados de treinamento
   */
  preprocessTrainingData(data, modelType) {
    const features = this.extractFeatures(data, modelType)
    const labels = this.extractLabels(data, modelType)

    return {
      xs: tf.tensor2d(features),
      ys: tf.tensor2d(labels),
    }
  }

  /**
   * Extrai features baseadas no tipo de modelo
   */
  extractFeatures(data, modelType) {
    switch (modelType) {
      case MODEL_TYPES.DIFFICULTY_PREDICTOR:
        return data.map((session) => [
          session.accuracy || 0,
          session.averageResponseTime || 0,
          session.totalAttempts || 1,
          session.hintsUsed || 0,
          session.sessionDuration || 0,
          session.errorsCount || 0,
          session.consecutiveCorrect || 0,
          session.frustrationLevel || 0,
        ])

      case MODEL_TYPES.ENGAGEMENT_CLASSIFIER:
        return data.map((session) => [
          session.sessionDuration || 0,
          session.totalClicks || 0,
          session.pauseCount || 0,
          session.averagePauseTime || 0,
          session.interactionRate || 0,
          session.focusTime || 0,
          session.scrollDistance || 0,
          session.clickAccuracy || 0,
          session.timeToFirstAction || 0,
          session.actionSequenceLength || 0,
          session.returnRate || 0,
          session.completionRate || 0,
        ])

      default:
        throw new Error(`Feature extraction não implementada para ${modelType}`)
    }
  }

  /**
   * Extrai labels baseadas no tipo de modelo
   */
  extractLabels(data, modelType) {
    switch (modelType) {
      case MODEL_TYPES.DIFFICULTY_PREDICTOR:
        return data.map((session) => {
          const difficulty = session.recommendedDifficulty || session.difficulty || 'medium'
          return this.oneHotEncode(difficulty, ['easy', 'medium', 'hard'])
        })

      case MODEL_TYPES.ENGAGEMENT_CLASSIFIER:
        return data.map((session) => {
          const engagement = session.engagementLevel || 'medium'
          return this.oneHotEncode(engagement, ['low', 'medium', 'high', 'very_high'])
        })

      default:
        throw new Error(`Label extraction não implementada para ${modelType}`)
    }
  }

  /**
   * One-hot encoding para labels categóricas
   */
  oneHotEncode(value, categories) {
    const encoded = new Array(categories.length).fill(0)
    const index = categories.indexOf(value)
    if (index !== -1) {
      encoded[index] = 1
    }
    return encoded
  }

  /**
   * Cria callbacks para monitoramento de treinamento
   */
  createTrainingCallbacks(modelType) {
    return [
      tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: AUTISM_OPTIMIZED_HYPERPARAMS.patience,
        minDelta: AUTISM_OPTIMIZED_HYPERPARAMS.minDelta,
        restore_best_weights: true,
      }),

      // Callback personalizado para métricas
      {
        onEpochEnd: async (epoch, logs) => {
          this.metricsCollector.recordTrainingMetrics(modelType, epoch, logs)

          // Log a cada 10 épocas
          if (epoch % 10 === 0) {
            logger.debug(`Treinamento ${modelType} - Época ${epoch}`, {
              loss: logs.loss,
              accuracy: logs.acc || logs.accuracy,
              val_loss: logs.val_loss,
              val_accuracy: logs.val_acc || logs.val_accuracy,
            })
          }
        },
      },
    ]
  }

  /**
   * Calcula métricas de treinamento
   */
  calculateTrainingMetrics(history) {
    const lastEpoch = history.history
    const epochs = Object.keys(lastEpoch).length > 0 ? lastEpoch.loss.length : 0

    return {
      accuracy: lastEpoch.accuracy ? lastEpoch.accuracy[epochs - 1] : 0,
      loss: lastEpoch.loss ? lastEpoch.loss[epochs - 1] : 0,
      val_accuracy: lastEpoch.val_accuracy ? lastEpoch.val_accuracy[epochs - 1] : 0,
      val_loss: lastEpoch.val_loss ? lastEpoch.val_loss[epochs - 1] : 0,
      epochs,
    }
  }

  /**
   * Salva modelo treinado
   */
  async saveModel(modelType, model) {
    try {
      const modelPath = `indexeddb://betina_model_${modelType}`
      await model.save(modelPath)

      logger.info(`💾 Modelo ${modelType} salvo em ${modelPath}`)
    } catch (error) {
      logger.warn(`⚠️ Erro ao salvar modelo ${modelType}`, { error: error.message })
    }
  }

  /**
   * Carrega modelos pré-treinados
   */
  async loadPretrainedModels() {
    const modelTypes = Object.values(MODEL_TYPES)

    for (const modelType of modelTypes) {
      try {
        const modelPath = `indexeddb://betina_model_${modelType}`
        const model = await tf.loadLayersModel(modelPath)
        this.models.set(modelType, model)

        logger.info(`📂 Modelo ${modelType} carregado com sucesso`)
      } catch (error) {
        logger.debug(`ℹ️ Modelo ${modelType} não encontrado, será criado quando necessário`)
      }
    }
  }

  /**
   * Gera chave de cache para predições
   */
  generateCacheKey(modelType, inputData) {
    const dataStr = JSON.stringify(inputData)
    return `${modelType}_${this.hashString(dataStr)}`
  }

  /**
   * Hash simples para strings
   */
  hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }

  /**
   * Atualiza cache de predições
   */
  updatePredictionCache(key, value) {
    if (this.predictionCache.size >= this.cacheMaxSize) {
      // Remove entrada mais antiga (FIFO)
      const firstKey = this.predictionCache.keys().next().value
      this.predictionCache.delete(firstKey)
    }

    this.predictionCache.set(key, {
      result: value,
      timestamp: Date.now(),
    })
  }

  /**
   * Atualiza métricas de predição
   */
  updatePredictionMetrics() {
    this.performanceMetrics.totalPredictions++

    const lastMeasurement = this.profiler.getLastMeasurement(/prediction_/)
    if (lastMeasurement) {
      this.performanceMetrics.averageInferenceTime =
        (this.performanceMetrics.averageInferenceTime *
          (this.performanceMetrics.totalPredictions - 1) +
          lastMeasurement) /
        this.performanceMetrics.totalPredictions
    }
  }

  /**
   * Preprocessa dados de entrada para predição
   */
  preprocessInputData(data, modelType) {
    const features = this.extractFeatures([data], modelType)
    return tf.tensor2d([features[0]])
  }

  /**
   * Pós-processa resultado da predição
   */
  async postprocessPrediction(prediction, modelType) {
    const probabilities = await prediction.data()

    switch (modelType) {
      case MODEL_TYPES.DIFFICULTY_PREDICTOR:
        const difficulties = ['easy', 'medium', 'hard']
        const maxIndex = probabilities.indexOf(Math.max(...probabilities))
        return {
          difficulty: difficulties[maxIndex],
          confidence: probabilities[maxIndex],
          probabilities: {
            easy: probabilities[0],
            medium: probabilities[1],
            hard: probabilities[2],
          },
        }

      case MODEL_TYPES.ENGAGEMENT_CLASSIFIER:
        const engagementLevels = ['low', 'medium', 'high', 'very_high']
        const engagementIndex = probabilities.indexOf(Math.max(...probabilities))
        return {
          engagement: engagementLevels[engagementIndex],
          confidence: probabilities[engagementIndex],
          probabilities: {
            low: probabilities[0],
            medium: probabilities[1],
            high: probabilities[2],
            very_high: probabilities[3],
          },
        }

      default:
        return { probabilities: Array.from(probabilities) }
    }
  }

  /**
   * Obtém estatísticas do orquestrador
   */
  getStatistics() {
    return {
      ...this.performanceMetrics,
      pipelineState: this.pipelineState,
      modelsLoaded: this.models.size,
      cacheSize: this.predictionCache.size,
      cacheHitRate: this.cacheHitRate,
      memoryUsage: tf.memory(),
      profilerStats: this.profiler.getStatistics(),
      metricsStats: this.metricsCollector.getStatistics(),
    }
  }

  /**
   * Limpa recursos e cache
   */
  cleanup() {
    // Limpar modelos
    this.models.forEach((model) => model.dispose())
    this.models.clear()

    // Limpar cache
    this.predictionCache.clear()

    // Reset métricas
    this.performanceMetrics = {
      totalPredictions: 0,
      averageInferenceTime: 0,
      modelAccuracies: new Map(),
      trainingTimes: new Map(),
    }

    logger.info('🧹 ML Orchestrator limpo com sucesso')
  }
}

// Singleton instance
let mlOrchestratorInstance = null

export const getMachineLearningOrchestrator = () => {
  if (!mlOrchestratorInstance) {
    mlOrchestratorInstance = new MachineLearningOrchestrator()
  }
  return mlOrchestratorInstance
}

export { MachineLearningOrchestrator, MODEL_TYPES, ML_PIPELINE_STATES }
