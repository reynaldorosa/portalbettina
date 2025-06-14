/**
 * @file DatabaseServiceAdapter.js
 * @description Adapter para integração entre database e SystemOrchestrator
 * Fornece interface unificada para o orquestrador central
 */

import { ProfileController } from './profiles/index.js'
import DatabaseService from './core/DatabaseService.js'
import logger from '../utils/metrics/performanceMonitor.js'

/**
 * @class DatabaseServiceAdapter
 * @description Adapter que conecta sistema de database ao SystemOrchestrator
 */
export class DatabaseServiceAdapter {
  constructor(config = {}) {
    this.logger = logger
    this.config = config
    
    // Inicializar DatabaseService principal
    this.databaseService = new DatabaseService(config)
    
    // Interface de perfis consolidada
    this.profiles = null
    
    this.initialized = false
    this.logger.info('🔗 DatabaseServiceAdapter created')
  }

  /**
   * Inicializa o adapter e todos os serviços
   */
  async initialize() {
    try {
      this.logger.info('🚀 Initializing DatabaseServiceAdapter...')
      
      // Inicializar serviço principal de database
      await this.databaseService.initialize()
      
      // Inicializar controlador de perfis
      this.profiles = {
        controller: new ProfileController(
          this.databaseService,
          this.databaseService.cache,
          this.databaseService.cognitiveAnalyzer,
          this.databaseService.authService
        )
      }
      
      this.initialized = true
      this.logger.info('✅ DatabaseServiceAdapter initialized successfully')
      
      return this
    } catch (error) {
      this.logger.error('❌ Failed to initialize DatabaseServiceAdapter:', error)
      throw error
    }
  }

  /**
   * Obtém interface de perfis para o orquestrador
   */
  getProfilesInterface() {
    if (!this.initialized) {
      throw new Error('DatabaseServiceAdapter not initialized')
    }
    return this.profiles.controller
  }

  /**
   * Obtém instância do database service principal
   */
  getDatabaseService() {
    return this.databaseService
  }

  /**
   * Interface para o SystemOrchestrator
   */
  getOrchestratorInterface() {
    return {
      // Interface de perfis
      profiles: this.getProfilesInterface(),
      
      // Serviços principais
      database: this.getDatabaseService(),
      cache: this.databaseService.cache,
      logger: this.logger,
      
      // Métodos de conveniência
      isReady: () => this.initialized,
      getStatus: () => this.getStatus(),
      healthCheck: () => this.healthCheck()
    }
  }

  /**
   * Obtém status do adapter
   */
  getStatus() {
    return {
      adapter: 'DatabaseServiceAdapter',
      initialized: this.initialized,
      database: this.databaseService?.isReady() || false,
      profiles: !!this.profiles?.controller,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Executa verificação de saúde
   */
  async healthCheck() {
    const checks = {
      adapter: this.initialized,
      database: false,
      profiles: false
    }

    try {
      if (this.databaseService) {
        checks.database = await this.databaseService.healthCheck()
      }
      
      if (this.profiles?.controller) {
        const profileHealth = await this.profiles.controller.healthCheck()
        checks.profiles = profileHealth.healthy
      }

      const healthy = Object.values(checks).every(check => check === true)

      return {
        healthy,
        checks,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      this.logger.error('❌ Health check failed:', error)
      return {
        healthy: false,
        checks,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Métodos de conveniência para o orquestrador
   */

  // Perfis
  async createProfile(type, profileData, options = {}) {
    return await this.profiles.controller.createProfile(type, profileData, options)
  }

  async getProfile(profileId, options = {}) {
    return await this.profiles.controller.getProfile(profileId, options)
  }

  async updateProfile(profileId, updates, options = {}) {
    return await this.profiles.controller.updateProfile(profileId, updates, options)
  }

  async getProfiles(userId) {
    return await this.profiles.controller.getProfiles(userId)
  }

  // Análise
  async analyzeBehaviorPatterns(profileId, timeframe = '30days') {
    return await this.profiles.controller.analyzeBehaviorPatterns(profileId, timeframe)
  }

  async generateDevelopmentInsights(profileId) {
    return await this.profiles.controller.generateDevelopmentInsights(profileId)
  }

  // Usuários
  async createAnonymousUser() {
    return await this.profiles.controller.createAnonymousUser()
  }

  async getUser(userId, options = {}) {
    return await this.profiles.controller.getUser(userId, options)
  }

  // Cache e sincronização
  async syncProfiles(userId) {
    return await this.profiles.controller.syncProfiles(userId)
  }

  clearProfileCache(userId = null) {
    return this.profiles.controller.clearProfileCache(userId)
  }
}

export default DatabaseServiceAdapter
