/**
 * @file core/index.js
 * @description Exportações do módulo central
 * Sistema orquestrador principal do Portal Betina
 */

// Exportar Sistema Orquestrador
export { SystemOrchestrator } from './SystemOrchestrator.js'

// Exportar Feature Flags
export * from './featureFlags.js'

// Exportar Controlador do Portal Betina
export * from './portalBettinaController.js'

// Exportação padrão
export { SystemOrchestrator as default } from './SystemOrchestrator.js'
