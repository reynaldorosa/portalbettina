/**
 * @file metrics/index.js
 * @description Ponto de entrada unificado para todos os módulos de métricas
 * Sistema integrado de coleta, análise e recomendações do Portal Betina
 */

// Importar todos os módulos de métricas
import performanceMonitor from './performanceMonitor.js'
import {
  generateProgressReport,
  getProgressSummary,
  generateSuggestions,
  exportProgressData,
} from '../shared/progressReports.js'
import DashboardNeuropedagogicalIntegration from './dashboardNeuropedagogicalIntegration.js'
import { MultisensoryMetricsCollector } from '../multisensoryAnalysis/index.js'
import { NeuropedagogicalAnalyzer } from './neuropedagogicalInsights.js'
import { AdvancedRecommendationEngine } from './advancedRecommendations.js'
export { ErrorPatternAnalyzer } from './errorPatternAnalyzer.js'
export { PerformanceAnalyzer } from './performanceAnalyzer.js'

/**
 * @class MetricsManager
 * @description Gerenciador principal do sistema de métricas
 */
export class MetricsManager {
  constructor(config = {}) {
    this.config = {
      enablePerformanceMonitoring: true,
      enableNeuropedagogicalAnalysis: true,
      enableMultisensoryMetrics: true,
      enableRecommendations: true,
      enableDashboardIntegration: true,
      ...config,
    }

    this.modules = {}
    this.activeSession = null
    this.userProfile = null
    this.initialized = false
  }

  /**
   * @method initialize
   * @description Inicializa todos os módulos de métricas
   * @param {string} userId - ID do usuário
   * @param {Object} userProfile - Perfil do usuário
   */
  async initialize(userId, userProfile = null) {
    try {
      console.log('🚀 Inicializando sistema de métricas...')

      this.userProfile = userProfile // Inicializar módulos conforme configuração
      if (this.config.enablePerformanceMonitoring) {
        this.modules.performance = performanceMonitor
        console.log('✅ Performance Monitor ativado')
      }

      if (this.config.enableNeuropedagogicalAnalysis) {
        this.modules.neuropedagogical = new NeuropedagogicalAnalyzer()
        console.log('✅ Análise Neuropedagógica ativada')
      }

      if (this.config.enableMultisensoryMetrics) {
        this.modules.multisensory = new MultisensoryMetricsCollector()
        console.log('✅ Métricas Multissensoriais ativadas')
      }

      if (this.config.enableRecommendations) {
        this.modules.recommendations = new AdvancedRecommendationEngine()
        await this.modules.recommendations.initializeForUser(userId, userProfile)
        console.log('✅ Engine de Recomendações ativado')
      }
      if (this.config.enableDashboardIntegration) {
        this.modules.dashboard = DashboardNeuropedagogicalIntegration
        console.log('✅ Integração Dashboard ativada')
      }

      this.initialized = true
      console.log('🎉 Sistema de métricas inicializado com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao inicializar sistema de métricas:', error)
      throw error
    }
  }

  /**
   * @method startSession
   * @description Inicia uma nova sessão de coleta de métricas
   * @param {string} sessionId - ID da sessão
   * @param {string} gameId - ID do jogo
   * @param {Object} options - Opções da sessão
   */
  startSession(sessionId, gameId, options = {}) {
    if (!this.initialized) {
      console.warn('Sistema de métricas não inicializado')
      return
    }

    this.activeSession = {
      sessionId,
      gameId,
      startTime: Date.now(),
      options,
      metrics: {},
    }

    // Inicializar coleta em todos os módulos ativos
    if (this.modules.dashboard) {
      this.modules.dashboard.initializeSession(this.userProfile?.userId, sessionId, gameId)
    }

    if (this.modules.multisensory) {
      this.modules.multisensory.startSession(sessionId, this.userProfile?.userId, gameId)
    }

    console.log(`📊 Sessão iniciada: ${sessionId} (${gameId})`)
  }

  /**
   * @method recordInteraction
   * @description Registra uma interação do usuário
   * @param {Object} interaction - Dados da interação
   */
  recordInteraction(interaction) {
    if (!this.activeSession) return

    const timestamp = Date.now()
    const enrichedInteraction = {
      ...interaction,
      timestamp,
      sessionId: this.activeSession.sessionId,
      gameId: this.activeSession.gameId,
    }

    // Distribuir para módulos relevantes
    if (this.modules.dashboard) {
      this.modules.dashboard.recordInteraction(enrichedInteraction)
    }

    if (this.modules.multisensory) {
      this.modules.multisensory.recordInteraction(enrichedInteraction)
    }

    if (this.modules.performance) {
      this.modules.performance.recordInteraction?.(enrichedInteraction)
    }
  }

  /**
   * @method analyzeSession
   * @description Analisa a sessão atual e gera insights
   * @returns {Object} Análise completa da sessão
   */
  async analyzeSession() {
    if (!this.activeSession) {
      throw new Error('Nenhuma sessão ativa para analisar')
    }

    const analysis = {
      sessionId: this.activeSession.sessionId,
      gameId: this.activeSession.gameId,
      duration: Date.now() - this.activeSession.startTime,
      timestamp: new Date().toISOString(),
      modules: {},
    }

    try {
      // Coletar análises de todos os módulos
      if (this.modules.neuropedagogical) {
        const sessionMetrics = this.getSessionMetrics()
        analysis.modules.neuropedagogical =
          this.modules.neuropedagogical.analyzeCognitivePatterns(sessionMetrics)
      }

      if (this.modules.multisensory) {
        analysis.modules.multisensory = this.modules.multisensory.generateRealTimeReport()
      }

      if (this.modules.dashboard) {
        analysis.modules.dashboard = this.modules.dashboard.analyzeSession()
      }

      // Gerar recomendações integradas
      if (this.modules.recommendations) {
        analysis.recommendations =
          await this.modules.recommendations.generateRealTimeRecommendations(analysis)
      }

      console.log('📈 Análise da sessão concluída:', analysis.sessionId)
      return analysis
    } catch (error) {
      console.error('❌ Erro na análise da sessão:', error)
      throw error
    }
  }

  /**
   * @method endSession
   * @description Finaliza a sessão atual
   * @returns {Object} Relatório final da sessão
   */
  async endSession() {
    if (!this.activeSession) {
      console.warn('Nenhuma sessão ativa para finalizar')
      return null
    }

    try {
      // Análise final
      const finalAnalysis = await this.analyzeSession()

      // Finalizar em todos os módulos
      if (this.modules.dashboard) {
        this.modules.dashboard.finalizeSession(this.activeSession.sessionId)
      }

      if (this.modules.multisensory) {
        this.modules.multisensory.endSession()
      }

      // Salvar dados da sessão
      await this.saveSessionData(finalAnalysis)

      const sessionReport = {
        ...finalAnalysis,
        endTime: Date.now(),
        totalDuration: Date.now() - this.activeSession.startTime,
      }

      this.activeSession = null
      console.log('🎯 Sessão finalizada com sucesso')

      return sessionReport
    } catch (error) {
      console.error('❌ Erro ao finalizar sessão:', error)
      this.activeSession = null
      throw error
    }
  }

  /**
   * @method generateProgressReport
   * @description Gera relatório de progresso do usuário
   * @param {string} userId - ID do usuário
   * @returns {Object} Relatório de progresso
   */
  async generateProgressReport(userId = null) {
    try {
      const report = await generateProgressReport(userId)

      // Enriquecer com análises neuropedagógicas se disponível
      if (this.modules.neuropedagogical && report) {
        report.neuropedagogicalInsights =
          this.modules.neuropedagogical.generateLongTermInsights(report)
      }

      return report
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de progresso:', error)
      throw error
    }
  }

  /**
   * @method getRecommendations
   * @description Obtém recomendações personalizadas
   * @param {Object} context - Contexto atual
   * @returns {Object} Recomendações
   */
  async getRecommendations(context = {}) {
    if (!this.modules.recommendations) {
      return { recommendations: [], confidence: 0 }
    }

    try {
      return await this.modules.recommendations.generateRealTimeRecommendations(context)
    } catch (error) {
      console.error('❌ Erro ao obter recomendações:', error)
      return { recommendations: [], confidence: 0 }
    }
  }

  /**
   * @method getSystemHealth
   * @description Verifica a saúde do sistema de métricas
   * @returns {Object} Status de saúde
   */
  getSystemHealth() {
    return {
      initialized: this.initialized,
      activeSession: !!this.activeSession,
      modules: Object.keys(this.modules).reduce((acc, key) => {
        acc[key] = {
          loaded: !!this.modules[key],
          functioning: this.testModule(key),
        }
        return acc
      }, {}),
      config: this.config,
    }
  }

  // =============== MÉTODOS PRIVADOS ===============

  /**
   * @method getSessionMetrics
   * @private
   * @description Coleta métricas da sessão atual
   */
  getSessionMetrics() {
    if (!this.activeSession) return {}

    // Agregar métricas de todos os módulos
    const metrics = {
      sessionId: this.activeSession.sessionId,
      gameId: this.activeSession.gameId,
      duration: Date.now() - this.activeSession.startTime,
      ...this.activeSession.metrics,
    }

    // Adicionar métricas específicas de módulos
    if (this.modules.multisensory) {
      Object.assign(metrics, this.modules.multisensory.getCurrentMetrics())
    }

    if (this.modules.dashboard) {
      Object.assign(metrics, this.modules.dashboard.getCurrentMetrics())
    }

    return metrics
  }

  /**
   * @method saveSessionData
   * @private
   * @description Salva dados da sessão
   */
  async saveSessionData(analysis) {
    try {
      // Implementar salvamento nos sistemas de storage apropriados
      const sessionData = {
        sessionId: analysis.sessionId,
        gameId: analysis.gameId,
        userId: this.userProfile?.userId,
        analysis,
        timestamp: new Date().toISOString(),
      }

      // Salvar no localStorage como backup
      const storageKey = `betina_session_${analysis.sessionId}`
      localStorage.setItem(storageKey, JSON.stringify(sessionData))

      console.log('💾 Dados da sessão salvos')
    } catch (error) {
      console.error('❌ Erro ao salvar dados da sessão:', error)
    }
  }

  /**
   * @method testModule
   * @private
   * @description Testa se um módulo está funcionando
   */
  testModule(moduleName) {
    try {
      const module = this.modules[moduleName]
      return module && typeof module === 'object'
    } catch {
      return false
    }
  }
}

// Instância singleton para uso global
export const metricsManager = new MetricsManager()

// Exportações específicas para compatibilidade
export {
  performanceMonitor as PerformanceMonitor,
  generateProgressReport,
  getProgressSummary,
  generateSuggestions,
  exportProgressData,
  DashboardNeuropedagogicalIntegration,
  MultisensoryMetricsCollector,
  NeuropedagogicalAnalyzer,
  AdvancedRecommendationEngine,
}

// Exportação padrão
export default metricsManager
