/**
 * @file index.js  
 * @description Interface unificada do sistema de database
 * Integração com SystemOrchestrator (utils/core/)
 */

// Exports de módulos principais
export * from './cache/index.js'
export * from './connection/index.js'
export * from './core/index.js'
export * from './crud/index.js'
export * from './helpers/index.js'
export * from './plugins/index.js'
export * from './sessions/index.js'

// Sistema de Perfis Consolidado
export * from './profiles/index.js'
export { ProfileController } from './profiles/index.js'

// Interface principal para o SystemOrchestrator
export { DatabaseServiceAdapter } from './DatabaseServiceAdapter.js'
