/**
 * @file ConnectionStrategy.js
 * @description Estratégia de conexão ONLINE-ONLY para Portal Betina
 */

export class ConnectionStrategy {
  constructor() {
    this.mode = 'ONLINE_ONLY'
    this.isOnline = navigator.onLine
    this.logger = {
      info: (message, data = {}) => console.log(`ℹ️ Connection: ${message}`, data),
      warn: (message, data = {}) => console.warn(`⚠️ Connection: ${message}`, data),
      error: (message, data = {}) => console.error(`❌ Connection: ${message}`, data),
    }

    this.setupNetworkListeners()
    this.enforceOnlineMode()
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.logger.info('🌟 Portal Betina: Network connection restored')
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.logger.error('🚨 Portal Betina: Network lost - Connection required')
      this.handleConnectionLoss()
    })
  }

  enforceOnlineMode() {
    if (!this.isOnline) {
      this.logger.error('🚨 Portal Betina: Internet connection required')
      this.showConnectionRequiredMessage()
    }
  }

  handleConnectionLoss() {
    const message = `
      🌟 Portal Betina - Conexão Necessária
      Para proporcionar a melhor experiência terapêutica para crianças autistas,
      o Portal Betina requer conexão com a internet para:
      • Sincronização em tempo real do progresso
      • Algoritmos adaptativos de IA
      • Backup seguro de dados terapêuticos
      • Atualizações contínuas das atividades
      Por favor, verifique sua conexão com a internet.
    `
    console.warn(message)
  }

  showConnectionRequiredMessage() {
    this.logger.warn('🌟 Portal Betina: Initializing online-only mode')
  }

  getStorageKey(key) {
    return `betina_online_${key}`
  }

  shouldUseAPI() {
    return this.isOnline
  }
}
