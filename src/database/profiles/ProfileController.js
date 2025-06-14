/**
 * @file ProfileController.js
 * @description Controlador principal para orquestração de serviços de perfil
 * Centraliza todas as operações de perfil e coordena entre os diferentes serviços
 */

import { UserProfilesService } from './UserProfilesService.js'
import ProfileService from './ProfileService.js'
import ProfileAnalyzer from './ProfileAnalyzer.js'
import logger from '../../utils/metrics/performanceMonitor.js'

export class ProfileController {
  constructor(databaseService, cache, cognitiveAnalyzer, authService) {
    this.db = databaseService
    this.cache = cache
    this.logger = logger

    // Inicializar serviços especializados
    this.userService = new UserProfilesService(cache, logger, databaseService.deduplicatedRequest, authService)
    this.profileService = new ProfileService(databaseService.crud, cache, cognitiveAnalyzer)
    this.analyzer = new ProfileAnalyzer(cognitiveAnalyzer, cache)

    this.logger.info('🎯 ProfileController initialized')
  }

  // ==========================================
  // OPERAÇÕES DE USUÁRIO (UserProfilesService)
  // ==========================================

  /**
   * Cria um usuário anônimo
   */
  async createAnonymousUser() {
    return await this.userService.createAnonymousUser()
  }

  /**
   * Obtém dados de um usuário
   */
  async getUser(userId, options = {}) {
    return await this.userService.getUser(userId, options)
  }

  /**
   * Atualiza preferências do usuário
   */
  async updateUserPreferences(userId, preferences) {
    return await this.userService.updateUserPreferences(userId, preferences)
  }

  // ==========================================
  // OPERAÇÕES DE PERFIL (ProfileService)
  // ==========================================

  /**
   * Cria um perfil por tipo específico
   */
  async createProfile(type, profileData, options = {}) {
    return await this.profileService.createProfile(type, profileData, options)
  }

  /**
   * Obtém um perfil específico
   */
  async getProfile(profileId, options = {}) {
    return await this.profileService.getProfile(profileId, options)
  }

  /**
   * Atualiza um perfil
   */
  async updateProfile(profileId, updates, options = {}) {
    return await this.profileService.updateProfile(profileId, updates, options)
  }

  /**
   * Remove um perfil
   */
  async deleteProfile(profileId, options = {}) {
    return await this.profileService.deleteProfile(profileId, options)
  }

  // ==========================================
  // PERFIS ESPECÍFICOS (ProfileService)
  // ==========================================

  /**
   * Cria perfil de criança
   */
  async createChildProfile(profileData, options = {}) {
    return await this.profileService.createChildProfile(profileData, options)
  }

  /**
   * Cria perfil de responsável
   */
  async createParentProfile(profileData, options = {}) {
    return await this.profileService.createParentProfile(profileData, options)
  }

  /**
   * Cria perfil de terapeuta
   */
  async createTherapistProfile(profileData, options = {}) {
    return await this.profileService.createTherapistProfile(profileData, options)
  }

  /**
   * Cria perfil de cuidador
   */
  async createCaregiverProfile(profileData, options = {}) {
    return await this.profileService.createCaregiverProfile(profileData, options)
  }

  // ==========================================
  // OPERAÇÕES EM LOTE
  // ==========================================

  /**
   * Obtém todos os perfis de um usuário
   * MIGRADO DO ProfileManager
   */
  async getProfiles(userId) {
    const userIdStr = String(userId)
    const cacheKey = `${this.db.localStoragePrefix}profiles_${userIdStr}`

    // Verificar cache primeiro
    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.db.helpers.isCacheValid(cached, 900000)) {
      return cached
    }

    // Se offline, usar dados locais
    if (!navigator.onLine) {
      const localProfiles = this.db.getLocalData(cacheKey, [])
      return localProfiles.length > 0 ? localProfiles : [this.createDefaultProfile(userIdStr)]
    }

    try {
      return await this.db.withRetry(async () => {
        const response = await this.db.authenticatedFetch(
          `${this.db.config.API_URL}/profiles/user/${userIdStr}`,
          { method: 'GET', headers: this.db.apiConfig.DEFAULT_HEADERS }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const profiles = await response.json()
        
        // Cache dos resultados
        this.cache.set(cacheKey, profiles, 900000)
        this.db.saveLocalData(cacheKey, profiles)

        this.logger.info('👤 Retrieved profiles for user', {
          userId: userIdStr,
          count: profiles.length
        })

        return profiles
      }, 'getProfiles')
    } catch (error) {
      this.logger.error('❌ Failed to get profiles', { userId: userIdStr, error: error.message })
      
      // Fallback para dados locais em caso de erro
      const localProfiles = this.db.getLocalData(cacheKey, [])
      return localProfiles.length > 0 ? localProfiles : [this.createDefaultProfile(userIdStr)]
    }
  }

  /**
   * Obtém estatísticas dos perfis
   */
  async getProfileStatistics() {
    return await this.profileService.getProfileStatistics()
  }

  /**
   * Obtém perfis por tipo
   */
  async getProfilesByType() {
    return await this.profileService.getProfilesByType()
  }

  // ==========================================
  // ANÁLISE DE PERFIS (ProfileAnalyzer)
  // ==========================================

  /**
   * Analisa padrões comportamentais
   */
  async analyzeBehaviorPatterns(profileId, timeframe = '30days') {
    return await this.analyzer.analyzeBehaviorPatterns(profileId, timeframe)
  }

  /**
   * Gera insights sobre desenvolvimento
   */
  async generateDevelopmentInsights(profileId) {
    return await this.analyzer.generateDevelopmentInsights(profileId)
  }

  /**
   * Compara progresso entre perfis
   */
  async compareProfiles(profileIds, criteria = {}) {
    return await this.analyzer.compareProfiles(profileIds, criteria)
  }

  /**
   * Gera análise preditiva
   */
  async generatePredictiveAnalysis(profileId, horizon = '90days') {
    return await this.analyzer.generatePredictiveAnalysis(profileId, horizon)
  }

  // ==========================================
  // UTILITÁRIOS E HELPERS
  // ==========================================

  /**
   * Cria perfil padrão (migrado do ProfileManager)
   */
  createDefaultProfile(userId) {
    return {
      id: `default_${userId}_${Date.now()}`,
      userId: userId,
      name: 'Perfil Principal',
      type: 'child',
      isDefault: true,
      settings: {
        difficulty: 'medium',
        themes: ['nature', 'animals'],
        accessibility: {
          highContrast: false,
          largeText: false,
          audioFeedback: true
        }
      },
      preferences: {
        gameTypes: ['memory', 'puzzle'],
        sessionDuration: 15,
        breakFrequency: 5
      },
      progress: {
        level: 1,
        experience: 0,
        achievements: []
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Valida dados de perfil
   */
  validateProfileData(profileData) {
    const required = ['name', 'type']
    const missing = required.filter(field => !profileData[field])
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }

    return true
  }

  /**
   * Enriquece dados de perfil com metadados
   */
  enrichProfileData(profileData) {
    return {
      ...profileData,
      id: profileData.id || `profile_${Date.now()}`,
      createdAt: profileData.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: profileData.version || 1
    }
  }

  // ==========================================
  // SINCRONIZAÇÃO E CACHE
  // ==========================================

  /**
   * Sincroniza perfis com servidor
   */
  async syncProfiles(userId) {
    try {
      const localProfiles = this.db.getLocalData(`profiles_${userId}`, [])
      const serverProfiles = await this.getProfiles(userId)

      // Lógica de sincronização (merge inteligente)
      const syncedProfiles = this.mergeProfiles(localProfiles, serverProfiles)
      
      // Salvar resultado sincronizado
      this.cache.set(`profiles_${userId}`, syncedProfiles, 900000)
      this.db.saveLocalData(`profiles_${userId}`, syncedProfiles)

      this.logger.info('🔄 Profiles synchronized', {
        userId,
        localCount: localProfiles.length,
        serverCount: serverProfiles.length,
        syncedCount: syncedProfiles.length
      })

      return syncedProfiles
    } catch (error) {
      this.logger.error('❌ Profile sync failed', { userId, error: error.message })
      throw error
    }
  }

  /**
   * Merge inteligente de perfis
   */
  mergeProfiles(localProfiles, serverProfiles) {
    const merged = new Map()

    // Adicionar perfis do servidor (autoritativo)
    serverProfiles.forEach(profile => {
      merged.set(profile.id, profile)
    })

    // Adicionar perfis locais que não estão no servidor
    localProfiles.forEach(localProfile => {
      if (!merged.has(localProfile.id)) {
        // Marcar como pending sync
        localProfile.pendingSync = true
        merged.set(localProfile.id, localProfile)
      }
    })

    return Array.from(merged.values())
  }

  /**
   * Limpa cache de perfis
   */
  clearProfileCache(userId = null) {
    if (userId) {
      this.cache.delete(`profiles_${userId}`)
    } else {
      // Limpar todo cache de perfis
      const keys = this.cache.keys().filter(key => key.includes('profiles_'))
      keys.forEach(key => this.cache.delete(key))
    }
    
    this.logger.info('🧹 Profile cache cleared', { userId })
  }

  // ==========================================
  // STATUS E DIAGNÓSTICO
  // ==========================================

  /**
   * Obtém status do controlador
   */
  getStatus() {
    return {
      controller: 'ProfileController',
      initialized: true,
      services: {
        userService: !!this.userService,
        profileService: !!this.profileService,
        analyzer: !!this.analyzer
      },
      cache: {
        size: this.cache.size,
        keys: this.cache.keys().filter(key => key.includes('profile')).length
      },
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Executa diagnóstico de saúde
   */
  async healthCheck() {
    const checks = {
      userService: false,
      profileService: false,
      analyzer: false,
      database: false,
      cache: false
    }

    try {
      // Verificar serviços
      checks.userService = !!this.userService
      checks.profileService = !!this.profileService
      checks.analyzer = !!this.analyzer
      checks.cache = !!this.cache && typeof this.cache.get === 'function'
      checks.database = !!this.db

      const healthy = Object.values(checks).every(check => check === true)

      return {
        healthy,
        checks,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      this.logger.error('❌ Health check failed', { error: error.message })
      return {
        healthy: false,
        checks,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
}

export default ProfileController
