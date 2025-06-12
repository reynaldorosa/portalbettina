/**
 * @file src/index.js
 * @description Ponto de entrada principal do Portal Betina
 * Orquestra a inicialização de todos os sistemas integrados
 */

// Importar sistema principal
import './main.jsx'

// Exportar orquestrador principal para uso externo
export { getSystemOrchestrator, initializeSystem } from './core/SystemOrchestrator.js'

// Exportar utilitários principais
export * from './utils/index.js'

// Exportar database
export * from './database/index.js'

// Exportar contextos
export * from './contexts/UserContext.jsx'
export * from './contexts/ThemeContext.jsx'
export * from './contexts/NotificationContext.jsx'
export * from './contexts/PremiumAuthContext.jsx'

// Exportar serviços principais
export { default as AuthService } from './services/authService.js'
export { default as DeepSeekAIService } from './services/deepSeekAIService.js'

// Exportar configurações
export * from './config/database.js'
export * from './config/environment.js'
export * from './config/aiConfig.js'
