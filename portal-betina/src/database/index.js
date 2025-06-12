/**
 * @file index.js
 * @description Ponto de entrada do sistema de database modular
 * Integra utils existentes como módulos do database
 */

import DatabaseService from './core/DatabaseService.js'
import { databaseConfig } from '../config/database.js'

/**
 * @function createDatabaseService
 * @description Factory para criar instância do DatabaseService
 * @param {Object} config - Configurações personalizadas
 * @returns {DatabaseService} Instância configurada
 */
export function createDatabaseService(config = {}) {
  return new DatabaseService({
    ...databaseConfig,
    ...config,
  })
}

/**
 * @function initializeDatabase
 * @async
 * @description Inicializa database com módulos padrão
 * @param {Object} config - Configurações personalizadas
 * @returns {Promise<DatabaseService>} Database inicializado
 */
export async function initializeDatabase(config = {}) {
  const db = createDatabaseService(config)
  await db.initialize()
  return db
}

// Instância global padrão
let globalDatabase = null

/**
 * @function getGlobalDatabase
 * @description Obtém instância global do database
 * @returns {DatabaseService|null} Instância global
 */
export function getGlobalDatabase() {
  return globalDatabase
}

/**
 * @function setGlobalDatabase
 * @description Define instância global do database
 * @param {DatabaseService} db - Instância do database
 */
export function setGlobalDatabase(db) {
  globalDatabase = db
}

/**
 * @function initializeGlobalDatabase
 * @async
 * @description Inicializa database global
 * @param {Object} config - Configurações personalizadas
 * @returns {Promise<DatabaseService>} Database global inicializado
 */
export async function initializeGlobalDatabase(config = {}) {
  if (globalDatabase) {
    return globalDatabase
  }

  globalDatabase = await initializeDatabase(config)
  return globalDatabase
}

// Exportar tipos e classes principais
export { DatabaseService }
export { databaseConfig }

// Exportar interfaces de acesso aos módulos
export const DatabaseAPI = {
  /**
   * @method getCognitiveModule
   * @description Acesso ao módulo cognitivo (integra neuropedagogicalInsights + multisensoryMetrics)
   * @returns {Object} Módulo cognitivo
   */
  getCognitiveModule() {
    return globalDatabase?.getModule('cognitive')
  },

  /**
   * @method getAdaptiveModule
   * @description Acesso ao módulo adaptativo (integra adaptiveML + advancedRecommendations)
   * @returns {Object} Módulo adaptativo
   */
  getAdaptiveModule() {
    return globalDatabase?.getModule('adaptive')
  },

  /**
   * @method getSessionsModule
   * @description Acesso ao módulo de sessões (integra progressReports + dashboardIntegration)
   * @returns {Object} Módulo de sessões
   */
  getSessionsModule() {
    return globalDatabase?.getModule('sessions')
  },

  /**
   * @method getAccessibilityModule
   * @description Acesso ao módulo de acessibilidade (integra accessibility + ttsManager)
   * @returns {Object} Módulo de acessibilidade
   */
  getAccessibilityModule() {
    return globalDatabase?.getModule('accessibility')
  },

  /**
   * @method getTherapyModule
   * @description Acesso ao módulo de terapia (orquestra outros módulos)
   * @returns {Object} Módulo de terapia
   */
  getTherapyModule() {
    return globalDatabase?.getModule('therapy')
  },

  /**
   * @method getStorageModule
   * @description Acesso ao módulo de storage (integra globalNeuropedagogicalDatabase)
   * @returns {Object} Módulo de storage
   */
  getStorageModule() {
    return globalDatabase?.getModule('storage')
  },

  /**
   * @method analyzeSession
   * @async
   * @description Análise completa de sessão usando múltiplos módulos
   * @param {Object} sessionData - Dados da sessão
   * @param {Object} userProfile - Perfil do usuário
   * @returns {Promise<Object>} Análise completa
   */
  async analyzeSession(sessionData, userProfile = {}) {
    const cognitive = this.getCognitiveModule()
    const adaptive = this.getAdaptiveModule()
    const sessions = this.getSessionsModule()
    const therapy = this.getTherapyModule()

    const analysis = {}

    // Análise cognitiva
    if (cognitive) {
      analysis.cognitive = await cognitive.analyzeSession(sessionData)
    }

    // Análise adaptativa
    if (adaptive) {
      analysis.adaptive = await adaptive.getAdaptiveParameters(
        userProfile.userId,
        sessionData.gameId,
        sessionData
      )
    }

    // Análise de sessão
    if (sessions) {
      analysis.session = await sessions.analyzeSession(sessionData)
    }

    // Recomendações terapêuticas
    if (therapy) {
      analysis.therapy = therapy.generateTherapyRecommendations(sessionData, userProfile)
    }

    return {
      ...analysis,
      combined: this.combineAnalyses(analysis),
      timestamp: new Date().toISOString(),
    }
  },

  /**
   * @method combineAnalyses
   * @description Combina análises de múltiplos módulos
   * @param {Object} analyses - Análises dos módulos
   * @returns {Object} Análise combinada
   */
  combineAnalyses(analyses) {
    const combined = {
      recommendations: [],
      interventions: [],
      adaptations: [],
      confidence: 1.0,
    }

    // Combinar recomendações de todos os módulos
    Object.values(analyses).forEach((analysis) => {
      if (analysis?.recommendations) {
        combined.recommendations.push(...analysis.recommendations)
      }
      if (analysis?.interventions) {
        combined.interventions.push(...analysis.interventions)
      }
      if (analysis?.adaptations) {
        combined.adaptations.push(...analysis.adaptations)
      }
      if (analysis?.confidence) {
        combined.confidence = Math.min(combined.confidence, analysis.confidence)
      }
    })

    // Priorizar recomendações
    combined.recommendations = this.prioritizeRecommendations(combined.recommendations)

    return combined
  },

  /**
   * @method prioritizeRecommendations
   * @description Prioriza recomendações por importância
   * @param {Array} recommendations - Lista de recomendações
   * @returns {Array} Recomendações priorizadas
   */
  prioritizeRecommendations(recommendations) {
    const priorityOrder = { high: 3, medium: 2, low: 1 }

    return recommendations.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 1
      const priorityB = priorityOrder[b.priority] || 1
      return priorityB - priorityA
    })
  },

  /**
   * @method recordMetrics
   * @async
   * @description Registra métricas usando módulo de storage
   * @param {string} dataType - Tipo de dados
   * @param {Object} metricsData - Dados das métricas
   * @param {Object} metadata - Metadados
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async recordMetrics(dataType, metricsData, metadata = {}) {
    const storage = this.getStorageModule()
    if (storage) {
      return storage.recordMetrics(dataType, metricsData, metadata)
    }
    return false
  },

  /**
   * @method getAccessibilitySettings
   * @description Obtém configurações de acessibilidade
   * @param {string} userId - ID do usuário
   * @returns {Object} Configurações de acessibilidade
   */
  getAccessibilitySettings(userId) {
    const accessibility = this.getAccessibilityModule()
    if (accessibility) {
      return accessibility.getAccessibilitySettings(userId)
    }
    return null
  },

  /**
   * @method updateAccessibilitySettings
   * @description Atualiza configurações de acessibilidade
   * @param {Object} settings - Novas configurações
   */
  updateAccessibilitySettings(settings) {
    const accessibility = this.getAccessibilityModule()
    if (accessibility) {
      accessibility.updateAccessibilitySettings(settings)
    }
  },
}

export default DatabaseAPI
