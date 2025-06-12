/**
 * @file index.js
 * @description Exportações do módulo de acessibilidade
 * Sistema completo de acessibilidade para o Portal Betina
 */

// Serviços principais
export { AccessibilityService } from './AccessibilityService.js'
export { AccessibilityAnalyzer } from './AccessibilityAnalyzer.js'

// Utilitários de acessibilidade
export * from './accessibility.js'

// Exportação padrão
export { AccessibilityService as default } from './AccessibilityService.js'
