/**
 * @file databaseService_UserProfiles.js
 * @description Serviço especializado para gerenciamento de perfis de usuários
 * Portal Betina - Suporte terapêutico para crianças autistas
 * ATUALIZADO: Usando nova arquitetura consolidada
 */

import ProfileController from './ProfileController.js'
import logger from '../../utils/metrics/performanceMonitor.js'

/**
 * @class DatabaseService_UserProfiles
 * @description Serviço integrado para gerenciamento completo de perfis de usuários
 * CONSOLIDADO: Agora usa ProfileController como interface única
 */
class DatabaseService_UserProfiles {
  constructor(databaseService) {
    this.databaseService = databaseService
    
    // ✅ NOVA ARQUITETURA: Controller único ao invés de múltiplos serviços
    this.profileController = new ProfileController(
      databaseService,
      databaseService.cache,
      databaseService.cognitiveAnalyzer,
      databaseService.authService
    )

    this.logger = logger
    this.initialized = false

    this.logger.info('✨ DatabaseService_UserProfiles initialized with consolidated architecture')
  }

  /**
   * Inicializa o serviço de perfis
   */
  async initialize() {
    try {
      // ✅ Inicialização simplificada - apenas o controller      this.initialized = true
      this.logger.info('✅ DatabaseService_UserProfiles fully initialized')
      return true
    } catch (error) {
      this.logger.error('❌ Failed to initialize DatabaseService_UserProfiles:', error)
      throw error
    }
  }

  // ==========================================
  // MÉTODOS CONSOLIDADOS (usando ProfileController)
  // ==========================================

  /**
   * Criar novo perfil de usuário
   */
  async createUserProfile(type, profileData, options = {}) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.createProfile(type, profileData, options)
  }

  /**
   * Buscar perfil por ID
   */
  async getUserProfile(userId) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.getProfile(userId)
  }

  /**
   * Buscar todos os perfis de um usuário
   */
  async getUserProfiles(userId) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.getProfiles(userId)
  }

  /**
   * Atualizar perfil de usuário
   */
  async updateUserProfile(userId, updateData) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.updateProfile(userId, updateData)
  }

  /**
   * Deletar perfil de usuário
   */
  async deleteUserProfile(profileId, options = {}) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.deleteProfile(profileId, options)
  }

  // ==========================================
  // CRIAÇÃO DE PERFIS ESPECÍFICOS
  // ==========================================

  /**
   * Criar perfil de criança
   */
  async createChildProfile(profileData, options = {}) {
    return await this.profileController.createChildProfile(profileData, options)
  }

  /**
   * Criar perfil de responsável
   */
  async createParentProfile(profileData, options = {}) {
    return await this.profileController.createParentProfile(profileData, options)
  }

  /**
   * Criar perfil de terapeuta
   */
  async createTherapistProfile(profileData, options = {}) {
    return await this.profileController.createTherapistProfile(profileData, options)
  }

  // ==========================================
  // ANÁLISE E INSIGHTS
  // ==========================================

  /**
   * Análise comportamental do usuário
   */
  async analyzeUserBehavior(userId, timeframe = '30days') {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.analyzeBehaviorPatterns(userId, timeframe)
  }

  /**
   * Gerar insights de desenvolvimento
   */
  async generateDevelopmentInsights(userId) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.generateDevelopmentInsights(userId)
  }

  /**
   * Obter métricas do perfil
   */
  async getProfileMetrics(userId) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.getProfileStatistics()
  }

  /**
   * Comparar perfis
   */
  async compareProfiles(profileIds, criteria = {}) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.compareProfiles(profileIds, criteria)
  }

  // ==========================================
  // OPERAÇÕES DE USUÁRIO
  // ==========================================

  /**
   * Criar usuário anônimo
   */
  async createAnonymousUser() {
    return await this.profileController.createAnonymousUser()
  }

  /**
   * Obter dados de usuário
   */
  async getUser(userId, options = {}) {
    return await this.profileController.getUser(userId, options)
  }

  /**
   * Atualizar preferências de usuário
   */
  async updateUserPreferences(userId, preferences) {
    return await this.profileController.updateUserPreferences(userId, preferences)
  }

  // ==========================================
  // SINCRONIZAÇÃO E CACHE
  // ==========================================

  /**
   * Sincronizar perfis
   */
  async syncProfiles(userId) {
    if (!this.initialized) {
      await this.initialize()
    }

    return await this.profileController.syncProfiles(userId)
  }

  /**
   * Limpar cache de perfis
   */
  clearProfileCache(userId = null) {
    return this.profileController.clearProfileCache(userId)
  }

  // ==========================================
  // STATUS E DIAGNÓSTICO
  // ==========================================

  /**
   * Obter status do serviço
   */
  getStatus() {
    return {
      service: 'DatabaseService_UserProfiles',
      initialized: this.initialized,
      controller: this.profileController.getStatus(),
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Executar verificação de saúde
   */
  async healthCheck() {
    const controllerHealth = await this.profileController.healthCheck()
    
    return {
      service: 'DatabaseService_UserProfiles',
      initialized: this.initialized,
      controller: controllerHealth,
      healthy: this.initialized && controllerHealth.healthy,
      timestamp: new Date().toISOString()
    }
  }
}

export default DatabaseService_UserProfiles
