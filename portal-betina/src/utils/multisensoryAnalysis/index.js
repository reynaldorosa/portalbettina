/**
 * @file utils/multisensoryAnalysis/index.js
 * @description Módulo de análise multissensorial
 * Integra processamento de dados visuais, auditivos, táteis e proprioceptivos
 */

// Importar o engine de análise multissensorial
import {
  MultisensoryAnalysisEngine,
  createMultisensoryAnalysisEngine,
} from '../metrics/multisensoryAnalysisEngine.js'

/**
 * @class MultisensoryAnalysis
 * @description Serviço integrado de análise multissensorial
 */
export class MultisensoryAnalysis {
  constructor(options = {}) {
    this.options = {
      enableVisualAnalysis: true,
      enableAuditoryAnalysis: true,
      enableTactileAnalysis: true,
      enableProprioceptiveAnalysis: true,
      enableCrossModalIntegration: true,
      ...options,
    }

    this.engine = null
    this.sensors = {
      visual: null,
      auditory: null,
      tactile: null,
      proprioceptive: null,
    }
    this.initialized = false
  }

  /**
   * Inicializa o serviço de análise multissensorial
   */
  async initialize() {
    try {
      this.engine = createMultisensoryAnalysisEngine()

      // Inicializar sensores baseado nas opções
      if (this.options.enableVisualAnalysis) {
        await this.setupVisualSensor()
      }

      if (this.options.enableAuditoryAnalysis) {
        await this.setupAuditorySensor()
      }

      if (this.options.enableTactileAnalysis) {
        await this.setupTactileSensor()
      }

      if (this.options.enableProprioceptiveAnalysis) {
        await this.setupProprioceptiveSensor()
      }

      this.initialized = true
      console.log('✅ Multisensory Analysis initialized successfully')

      return this
    } catch (error) {
      console.error('❌ Error initializing Multisensory Analysis:', error)
      throw error
    }
  }

  /**
   * Configura sensor visual
   */
  async setupVisualSensor() {
    this.sensors.visual = {
      type: 'visual',
      enabled: true,
      calibrated: false,
    }
  }

  /**
   * Configura sensor auditivo
   */
  async setupAuditorySensor() {
    this.sensors.auditory = {
      type: 'auditory',
      enabled: true,
      calibrated: false,
    }
  }

  /**
   * Configura sensor tátil
   */
  async setupTactileSensor() {
    this.sensors.tactile = {
      type: 'tactile',
      enabled: true,
      calibrated: false,
    }
  }

  /**
   * Configura sensor proprioceptivo
   */
  async setupProprioceptiveSensor() {
    this.sensors.proprioceptive = {
      type: 'proprioceptive',
      enabled: true,
      calibrated: false,
    }
  }

  /**
   * Executa análise multissensorial completa
   */
  async performMultisensoryAnalysis(inputData) {
    if (!this.initialized) {
      await this.initialize()
    }

    const analysisResults = {
      timestamp: new Date().toISOString(),
      visual: null,
      auditory: null,
      tactile: null,
      proprioceptive: null,
      integrated: null,
    }

    // Processar cada modalidade sensorial
    if (this.sensors.visual?.enabled && inputData.visual) {
      analysisResults.visual = await this.engine.analyzeVisual(inputData.visual)
    }

    if (this.sensors.auditory?.enabled && inputData.auditory) {
      analysisResults.auditory = await this.engine.analyzeAuditory(inputData.auditory)
    }

    if (this.sensors.tactile?.enabled && inputData.tactile) {
      analysisResults.tactile = await this.engine.analyzeTactile(inputData.tactile)
    }

    if (this.sensors.proprioceptive?.enabled && inputData.proprioceptive) {
      analysisResults.proprioceptive = await this.engine.analyzePropriocetive(
        inputData.proprioceptive
      )
    }

    // Integração cross-modal
    if (this.options.enableCrossModalIntegration) {
      analysisResults.integrated = await this.engine.integrateCrossModal(analysisResults)
    }

    return analysisResults
  }

  /**
   * Gera padrões de preferência sensorial
   */
  async generateSensoryPreferences(userId, historicalData) {
    return this.engine.generateSensoryPreferences(userId, historicalData)
  }

  /**
   * Detecta sobrecarga sensorial
   */
  async detectSensoryOverload(currentInputs, userThresholds) {
    return this.engine.detectSensoryOverload(currentInputs, userThresholds)
  }
}

// Instância singleton
let multisensoryAnalysisInstance = null

/**
 * Factory function para obter instância do serviço
 */
export function getMultisensoryAnalysis(options = {}) {
  if (!multisensoryAnalysisInstance) {
    multisensoryAnalysisInstance = new MultisensoryAnalysis(options)
  }
  return multisensoryAnalysisInstance
}

// Exportações principais
export {
  MultisensoryAnalysisEngine,
  createMultisensoryAnalysisEngine,
} from '../metrics/multisensoryAnalysisEngine.js'

export { MultisensoryMetricsCollector } from './multisensoryMetrics.js'
export { default as MultisensoryMetricsService } from '../metrics/multisensoryMetricsService.js'

// Exportação padrão
export default MultisensoryAnalysis
