/**
 * @file utils/autismCognitiveAnalysis/index.js
 * @description Módulo de análise cognitiva específica para autismo
 * Integra algoritmos especializados para avaliação e acompanhamento cognitivo
 */

// Importar o analisador cognitivo principal
import { autismCognitiveAnalyzer } from '../autismCognitiveAnalyzer.js'
import { autismAssessmentHelpers } from '../autismAssessmentHelpers.js'

/**
 * @class AutismCognitiveAnalysis
 * @description Serviço integrado de análise cognitiva para autismo
 */
export class AutismCognitiveAnalysis {
  constructor(options = {}) {
    this.options = {
      enableRealTimeAnalysis: true,
      enableProgressTracking: true,
      enableAdaptiveAssessment: true,
      ...options,
    }

    this.analyzer = null
    this.helpers = null
    this.initialized = false
  }

  /**
   * Inicializa o serviço de análise cognitiva
   */
  async initialize() {
    try {
      this.analyzer = autismCognitiveAnalyzer
      this.helpers = autismAssessmentHelpers

      if (this.options.enableRealTimeAnalysis) {
        await this.setupRealTimeAnalysis()
      }

      this.initialized = true
      console.log('✅ Autism Cognitive Analysis initialized successfully')

      return this
    } catch (error) {
      console.error('❌ Error initializing Autism Cognitive Analysis:', error)
      throw error
    }
  }

  /**
   * Configura análise em tempo real
   */
  async setupRealTimeAnalysis() {
    // Configuração para análise em tempo real
    return true
  }

  /**
   * Executa análise cognitiva completa
   */
  async performCognitiveAnalysis(userData, activityData) {
    if (!this.initialized) {
      await this.initialize()
    }

    return this.analyzer.analyzeUserCognitiveProfile(userData, activityData)
  }

  /**
   * Gera relatório de progresso cognitivo
   */
  async generateProgressReport(userId, timeframe = '30d') {
    return this.helpers.generateProgressReport(userId, timeframe)
  }

  /**
   * Avalia necessidades adaptativas
   */
  async assessAdaptiveNeeds(userProfile, currentPerformance) {
    return this.helpers.assessAdaptiveNeeds(userProfile, currentPerformance)
  }
}

// Instância singleton
let autismCognitiveAnalysisInstance = null

/**
 * Factory function para obter instância do serviço
 */
export function getAutismCognitiveAnalysis(options = {}) {
  if (!autismCognitiveAnalysisInstance) {
    autismCognitiveAnalysisInstance = new AutismCognitiveAnalysis(options)
  }
  return autismCognitiveAnalysisInstance
}

// Exportações principais
export { autismCognitiveAnalyzer } from '../autismCognitiveAnalyzer.js'
export { autismAssessmentHelpers } from '../autismAssessmentHelpers.js'

// Exportação padrão
export default AutismCognitiveAnalysis
