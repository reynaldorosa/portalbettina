/**
 * @file index.js
 * @description Exports consolidados dos serviços de perfil
 * Arquitetura consolidada: Controller + Services especializados
 */

// Controlador principal (NOVO)
export { default as ProfileController } from './ProfileController.js'

// Serviços especializados (MANTIDOS)
export { UserProfilesService } from './UserProfilesService.js'
export { default as ProfileService } from './ProfileService.js'
export { default as ProfileAnalyzer } from './ProfileAnalyzer.js'

// Legacy exports (TEMPORÁRIO - para compatibilidade)
export * from './databaseService_UserProfiles.js'

// ✅ ProfileManager.js REMOVIDO - funcionalidades migradas para ProfileService
