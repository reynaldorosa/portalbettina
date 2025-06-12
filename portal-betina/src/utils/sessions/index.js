/**
 * @file index.js
 * @description Exportações do módulo de sessões
 * Ponto de entrada unificado para gerenciamento de sessões
 */

export { SessionManager } from './SessionManager.js'
export { SessionService } from './SessionService.js'
export { SessionAnalyzer } from './sessions/SessionAnalyzer.js'

// Exportação padrão do gerenciador principal
export { SessionManager as default } from './SessionManager.js'
