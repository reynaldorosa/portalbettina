/**
 * @file shared/index.js
 * @description Exportações dos utilitários compartilhados
 */

// Exportar todas as constantes
export * from './constants.js'

// Exportar utilitários de áudio
export * from './audioGenerator.js'

// Exportar templates de desenho
export * from './drawTemplate.js'

// Exportar internacionalização
export * from './i18n.js'

// Exportar serviços de database específicos
export * from './databaseService_UserProfiles.js'

// Exportar relatórios de progresso
export * from './progressReports.js'

// Exportar circuit breaker e utilitários avançados
export { AccessibilityManager, HealthChecker, QualityAssessor } from './circuitBreakerUtils.js'
