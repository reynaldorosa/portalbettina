/**
 * @file utils/index.js
 * @description Ponto de entrada principal para todos os utilitários do Portal Betina
 * Sistema modular integrado para análise, métricas, sessões e terapia
 */

// Módulos principais
export * from './metrics/index.js'
export * from './sessions/index.js'
export * from './cognitive/index.js'
export * from './adaptive/index.js'
export * from './accessibility/index.js'
export * from './therapy/index.js'
export * from './ml/index.js'

// Módulos de análise emocional e neuroplasticidade
export * from './emotionalAnalysis/EmotionalAnalysisService.js'
export * from './neuroplasticity/NeuroplasticityService.js'
export * from './autismCognitiveAnalysis/index.js'
export * from './multisensoryAnalysis/index.js'
export * from './predictiveAnalysis/index.js'

// Módulos específicos
export * from './game/index.js'
export * from './storage/index.js'
export * from './tts/index.js'
export * from './shared/index.js'
export * from './standards/index.js'
export * from './core/index.js'

// Módulo de núcleo
export { SystemOrchestrator } from './core/SystemOrchestrator.js'

// Gerenciadores principais (exportação com alias para clareza)
export { metricsManager as MetricsManager } from './metrics/index.js'
export { SessionManager } from './sessions/index.js'
export { CognitiveAnalyzer } from './cognitive/index.js'
export { AdaptiveService } from './adaptive/index.js'
export { AccessibilityService } from './accessibility/index.js'
export { TherapyOptimizer } from './therapy/index.js'

// Exportar serviços de análise avançada
export { EmotionalAnalysisService } from './emotionalAnalysis/EmotionalAnalysisService.js'
export { NeuroplasticityService } from './neuroplasticity/NeuroplasticityService.js'

/**
 * @class PortalBetinaUtils
 * @description Classe principal para inicialização de todos os utilitários
 */
export class PortalBetinaUtils {
  constructor(config = {}) {
    this.config = {
      enableMetrics: true,
      enableCognitive: true,
      enableAdaptive: true,
      enableAccessibility: true,
      enableTherapy: true,
      enableTTS: true,
      ...config,
    }

    this.modules = {}
    this.initialized = false
  }

  /**
   * @method initialize
   * @async
   * @description Inicializa todos os módulos utilitários
   */
  async initialize(databaseService, userProfile = null) {
    try {
      console.log('🚀 Initializing Portal Betina Utils...')

      // Inicializar módulos baseados na configuração
      if (this.config.enableMetrics) {
        const { metricsManager } = await import('./metrics/index.js')
        await metricsManager.initialize(userProfile?.userId, userProfile)
        this.modules.metrics = metricsManager
      }

      if (this.config.enableCognitive) {
        const { CognitiveAnalyzer } = await import('./cognitive/index.js')
        this.modules.cognitive = new CognitiveAnalyzer(databaseService)
        await this.modules.cognitive.initialize()
      }

      if (this.config.enableAdaptive) {
        const { AdaptiveService } = await import('./adaptive/index.js')
        this.modules.adaptive = new AdaptiveService(
          databaseService?.getModule?.('crud'),
          databaseService?.cache,
          this.modules.cognitive,
          databaseService?.getModule?.('profiles'),
          databaseService?.getModule?.('sessions')
        )
      }

      if (this.config.enableAccessibility) {
        const { AccessibilityService } = await import('./accessibility/index.js')
        this.modules.accessibility = new AccessibilityService(databaseService)
        await this.modules.accessibility.initialize()
      }

      if (this.config.enableTherapy) {
        const { TherapyOptimizer } = await import('./therapy/index.js')
        this.modules.therapy = new TherapyOptimizer(databaseService)
        await this.modules.therapy.initialize()
      }

      this.initialized = true
      console.log('✅ Portal Betina Utils initialized successfully!')

      return this.modules
    } catch (error) {
      console.error('❌ Failed to initialize Portal Betina Utils:', error)
      throw error
    }
  }

  /**
   * @method getModule
   * @description Obtém um módulo específico
   */
  getModule(moduleName) {
    return this.modules[moduleName] || null
  }

  /**
   * @method isReady
   * @description Verifica se todos os módulos estão prontos
   */
  isReady() {
    if (!this.initialized) return false

    return Object.values(this.modules).every((module) => !module.isReady || module.isReady())
  }

  /**
   * @method getStatus
   * @description Obtém status completo do sistema
   */
  getStatus() {
    return {
      initialized: this.initialized,
      ready: this.isReady(),
      config: this.config,
      modules: Object.keys(this.modules).reduce((acc, key) => {
        const module = this.modules[key]
        acc[key] = {
          loaded: !!module,
          ready: module.isReady ? module.isReady() : true,
        }
        return acc
      }, {}),
    }
  }
}

// Instância singleton
export const portalBetinaUtils = new PortalBetinaUtils()

// Exportação padrão
export default portalBetinaUtils
