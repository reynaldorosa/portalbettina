/**
 * @file index.js
 * @description Exportações do módulo adaptativo
 * Sistema inteligente de adaptação e machine learning
 */

// Exportar todos os serviços principais
export { default as AdaptiveService } from './AdaptiveService.js'
export { AdaptiveMLService } from './AdaptiveMLService.js'
export { EnhancedAdaptiveMLService } from './EnhancedAdaptiveMLService.js'

// Exportar todas as funções e classes do adaptiveML
export {
  AdaptiveModel,
  analyzeLearningSessions,
  createAdaptiveModel,
  getAdaptiveParameters,
} from './adaptiveML.js'

// Exportar relatórios de progresso (movido para shared/)
export * from '../shared/progressReports.js'

// Exportar adaptiveAccessibilityManager
export { AdaptiveAccessibilityManager } from './adaptiveAccessibilityManager.js'

// Exportação padrão do módulo
export { default } from './AdaptiveService.js'
