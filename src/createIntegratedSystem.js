/**
 * @file createIntegratedSystem.js
 * @description Factory para criar sistema integrado (Orchestrator + Database + Profiles)
 * Facilita a inicialização completa do Portal Betina
 */

import { DatabaseServiceAdapter } from '../database/DatabaseServiceAdapter.js'
import { SystemOrchestrator } from '../utils/core/SystemOrchestrator.js'
import logger from '../utils/metrics/performanceMonitor.js'

/**
 * Configuração padrão do sistema integrado
 */
const DEFAULT_CONFIG = {
  // Database
  database: {
    connectionTimeout: 30000,
    retryAttempts: 3,
    enableCache: true,
    cacheTimeout: 300000, // 5 minutos
  },

  // Orchestrator
  orchestrator: {
    enableProfileManagement: true,
    enableProfileAnalysis: true,
    enableUserProfileIntegration: true,
    enableAdvancedMetricsEngine: true,
    enableNeuroplasticityAnalyzer: true,
    enableErrorPatternAnalyzer: true,
    enableEmotionalAnalysis: true,
    enableCognitiveAnalysis: true,
    enableTherapeuticIntegration: true,
    orchestrationInterval: 30000,
    systemSyncInterval: 60000,
    therapeuticThreshold: 0.75,
    engagementThreshold: 0.7,
  },

  // Profiles
  profiles: {
    enableCache: true,
    syncInterval: 900000, // 15 minutos
    analysisDepth: 'comprehensive',
    defaultInsights: true,
  }
}

/**
 * Factory para criar sistema integrado completo
 */
export class IntegratedSystemFactory {
  static async create(userConfig = {}) {
    const config = this.mergeConfig(DEFAULT_CONFIG, userConfig)
    
    logger.info('🏗️ Criando sistema integrado Portal Betina...')

    try {
      // 1. Criar adapter de database
      logger.info('📊 Inicializando DatabaseServiceAdapter...')
      const dbAdapter = new DatabaseServiceAdapter(config.database)
      await dbAdapter.initialize()

      // 2. Criar orquestrador com adapter
      logger.info('🎯 Inicializando SystemOrchestrator...')
      const orchestrator = new SystemOrchestrator(dbAdapter, config.orchestrator)
      await orchestrator.initialize()

      // 3. Obter interface de profiles
      const profilesInterface = dbAdapter.getProfilesInterface()

      // 4. Criar interface unificada
      const integratedSystem = new IntegratedSystem({
        dbAdapter,
        orchestrator,
        profilesInterface,
        config
      })

      logger.info('✅ Sistema integrado criado com sucesso')
      return integratedSystem

    } catch (error) {
      logger.error('❌ Erro ao criar sistema integrado:', error)
      throw new Error(`Failed to create integrated system: ${error.message}`)
    }
  }

  /**
   * Merge deep de configurações
   */
  static mergeConfig(defaultConfig, userConfig) {
    const merged = { ...defaultConfig }
    
    for (const key in userConfig) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null) {
        merged[key] = { ...defaultConfig[key], ...userConfig[key] }
      } else {
        merged[key] = userConfig[key]
      }
    }
    
    return merged
  }

  /**
   * Cria sistema integrado com configuração mínima para desenvolvimento
   */
  static async createDevelopment() {
    const devConfig = {
      database: {
        connectionTimeout: 10000,
        retryAttempts: 1,
      },
      orchestrator: {
        orchestrationInterval: 10000, // 10 segundos
        systemSyncInterval: 30000, // 30 segundos
      }
    }

    return this.create(devConfig)
  }

  /**
   * Cria sistema integrado com configuração otimizada para produção
   */
  static async createProduction() {
    const prodConfig = {
      database: {
        connectionTimeout: 60000,
        retryAttempts: 5,
        enableCache: true,
        cacheTimeout: 600000, // 10 minutos
      },
      orchestrator: {
        orchestrationInterval: 60000, // 1 minuto
        systemSyncInterval: 300000, // 5 minutos
        enableAllAnalytics: true,
      }
    }

    return this.create(prodConfig)
  }
}

/**
 * Classe que encapsula o sistema integrado completo
 */
export class IntegratedSystem {
  constructor({ dbAdapter, orchestrator, profilesInterface, config }) {
    this.dbAdapter = dbAdapter
    this.orchestrator = orchestrator
    this.profiles = profilesInterface
    this.config = config
    this.logger = logger

    this.initialized = true
    this.startTime = Date.now()

    this.logger.info('🎯 IntegratedSystem criado')
  }

  // ==========================================
  // INTERFACE PRINCIPAL
  // ==========================================

  /**
   * Despacha evento para o orquestrador
   */
  async dispatchEvent(type, data) {
    return await this.orchestrator.processEvent({ type, data })
  }

  /**
   * Cria profile com notificação automática ao orquestrador
   */
  async createProfile(type, profileData, options = {}) {
    const profile = await this.profiles.createProfile(type, profileData, options)
    
    await this.dispatchEvent('profile_created', {
      profileId: profile.id,
      type,
      data: profile
    })
    
    return profile
  }

  /**
   * Atualiza profile com notificação automática
   */
  async updateProfile(profileId, updates, options = {}) {
    const profile = await this.profiles.updateProfile(profileId, updates, options)
    
    await this.dispatchEvent('profile_updated', {
      profileId,
      updates,
      data: profile
    })
    
    return profile
  }

  /**
   * Analisa profile com notificação automática
   */
  async analyzeProfile(profileId, timeframe = '30days') {
    const insights = await this.profiles.analyzeBehaviorPatterns(profileId, timeframe)
    
    await this.dispatchEvent('profile_analyzed', {
      profileId,
      timeframe,
      insights
    })
    
    return insights
  }

  /**
   * Rastreia interação de usuário
   */
  async trackUserInteraction(userId, profileId, interactionType, data = {}) {
    return await this.dispatchEvent('user_profile_interaction', {
      userId,
      profileId,
      type: interactionType,
      duration: data.duration || 0,
      ...data
    })
  }

  // ==========================================
  // MÉTODOS DE CONVENIÊNCIA
  // ==========================================

  /**
   * Obtém estatísticas unificadas
   */
  getStatistics() {
    return {
      system: {
        uptime: Date.now() - this.startTime,
        initialized: this.initialized,
        components: {
          database: this.dbAdapter.isReady(),
          orchestrator: this.orchestrator.state,
          profiles: !!this.profiles
        }
      },
      orchestrator: this.orchestrator.getUnifiedStatistics(),
      database: this.dbAdapter.getStatus()
    }
  }

  /**
   * Verifica saúde do sistema completo
   */
  async healthCheck() {
    try {
      const dbHealth = await this.dbAdapter.healthCheck()
      const profilesHealth = await this.profiles.healthCheck()
      const orchHealth = this.orchestrator.getStatus()

      const healthy = dbHealth.healthy && profilesHealth.healthy && 
                     orchHealth.state === 'READY'

      return {
        healthy,
        components: {
          database: dbHealth,
          profiles: profilesHealth,
          orchestrator: orchHealth
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      this.logger.error('❌ Health check failed:', error)
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Para o sistema graciosamente
   */
  async shutdown() {
    try {
      this.logger.info('🛑 Iniciando shutdown do sistema...')
      
      // Parar orquestrador
      if (this.orchestrator && this.orchestrator.stop) {
        await this.orchestrator.stop()
      }
      
      // Fechar conexões de database
      if (this.dbAdapter && this.dbAdapter.shutdown) {
        await this.dbAdapter.shutdown()
      }
      
      this.initialized = false
      this.logger.info('✅ Sistema desligado com sucesso')
      
    } catch (error) {
      this.logger.error('❌ Erro durante shutdown:', error)
      throw error
    }
  }

  // ==========================================
  // PROXIES PARA INTERFACES
  // ==========================================

  // Database
  get database() {
    return this.dbAdapter.getDatabaseService()
  }

  // Profiles (métodos diretos)
  async getProfile(profileId, options = {}) {
    return await this.profiles.getProfile(profileId, options)
  }

  async getProfiles(userId) {
    return await this.profiles.getProfiles(userId)
  }

  async createAnonymousUser() {
    return await this.profiles.createAnonymousUser()
  }

  async syncProfiles(userId) {
    return await this.profiles.syncProfiles(userId)
  }

  // Análises especializadas
  async generateDevelopmentInsights(profileId) {
    return await this.profiles.generateDevelopmentInsights(profileId)
  }

  async compareProfiles(profileIds, criteria = {}) {
    return await this.profiles.compareProfiles(profileIds, criteria)
  }
}

// ==========================================
// EXPORTS E FACTORY FUNCTIONS
// ==========================================

/**
 * Função de conveniência para criar sistema integrado
 */
export const createIntegratedSystem = async (config = {}) => {
  return await IntegratedSystemFactory.create(config)
}

/**
 * Função para desenvolvimento
 */
export const createDevelopmentSystem = async () => {
  return await IntegratedSystemFactory.createDevelopment()
}

/**
 * Função para produção
 */
export const createProductionSystem = async () => {
  return await IntegratedSystemFactory.createProduction()
}

export default IntegratedSystemFactory
