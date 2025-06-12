/**
 * @file DatabaseService.js
 * @description Serviço principal do banco de dados - Portal Betina
 * Ponto de entrada unificado para todas as funcionalidades do banco de dados
 * com foco em suporte terapêutico para crianças autistas.
 */

// Importar módulos organizados
import { CircuitBreaker, IntelligentCache, ConnectionStrategy } from '../../database/core/index.js'
import { AccessibilityManager } from './accessibility/index.js'
import { SessionManager } from '../../utils/sessions/index.js'
import { CacheManager } from '../../database/cache/index.js'
import { HelperUtils } from '../../database/helpers/index.js'
import { CognitiveAnalyzer } from '../../utils/cognitive/index.js'
import { ProfileManager } from '../../database/profiles/index.js'
import { ConnectionManager } from '../../database/connection/index.js'

// Configurações e dependências
import { CONFIG, API_CONFIG, authService, LZString } from '../../database/core/dependencies.js'

/**
 * @class DatabaseService
 * @description Serviço principal do banco de dados com arquitetura modular
 * para suporte terapêutico especializado para crianças autistas.
 */
class DatabaseService {
  constructor() {
    this.config = CONFIG
    this.apiConfig = API_CONFIG
    this.authService = authService
    this.localStoragePrefix = 'betina_v2_'

    // Inicializar componentes modulares
    this.circuitBreaker = new CircuitBreaker()
    this.cache = new IntelligentCache()
    this.connectionStrategy = new ConnectionStrategy()

    // Inicializar managers especializados
    this.accessibility = new AccessibilityManager(this)
    this.sessions = new SessionManager(this)
    this.cacheManager = new CacheManager(this)
    this.helpers = new HelperUtils(this)
    this.cognitive = new CognitiveAnalyzer(this)
    this.profiles = new ProfileManager(this)
    this.connections = new ConnectionManager(this)

    // Queue para evitar requisições duplicadas
    this.requestQueue = new Map()

    // Logger
    this.logger = {
      info: (message, data = {}) => console.log(`ℹ️ Portal Betina: ${message}`, data),
      warn: (message, data = {}) => console.warn(`⚠️ Portal Betina: ${message}`, data),
      error: (message, data = {}) => console.error(`❌ Portal Betina: ${message}`, data),
      debug: (message, data = {}) => console.debug(`🐛 Portal Betina: ${message}`, data),
    }
  }

  /**
   * @method initialize
   * @async
   * @description Inicializa o serviço de banco de dados
   * @returns {Promise<boolean>} Sucesso da inicialização
   */
  async initialize() {
    try {
      this.logger.info('🌟 Initializing Portal Betina Database Service...')

      // Verificar conectividade
      await this.connections.checkApiHealth()

      // Inicializar componentes
      await Promise.all([
        this.accessibility.initialize(),
        this.sessions.initialize(),
        this.profiles.initialize(),
        this.cognitive.initialize(),
      ])

      this.logger.info('✅ Portal Betina Database Service initialized successfully')
      return true
    } catch (error) {
      this.logger.error('Failed to initialize DatabaseService', { error: error.message })
      return false
    }
  }

  // ============== DELEGAÇÃO PARA MANAGERS ESPECIALIZADOS ==============

  // Accessibility Methods
  async getAccessibilitySettings(userId) {
    return this.accessibility.getSettings(userId)
  }

  async updateAccessibilitySettings(userId, settings) {
    return this.accessibility.updateSettings(userId, settings)
  }

  // Session Methods
  async getGameSessions(userId, gameId = null, limit = 50) {
    return this.sessions.getSessions(userId, gameId, limit)
  }

  async createGameSession(sessionData) {
    return this.sessions.createSession(sessionData)
  }

  // Profile Methods
  async getUserProfiles(userId) {
    return this.profiles.getProfiles(userId)
  }

  async createUserProfile(userId, profileData) {
    return this.profiles.createProfile(userId, profileData)
  }

  async updateUserProfile(userId, profileId, updateData) {
    return this.profiles.updateProfile(userId, profileId, updateData)
  }

  // Cognitive Analysis Methods
  async getAdaptiveParameters(userId, gameId, sessionData = null) {
    return this.cognitive.getAdaptiveParameters(userId, gameId, sessionData)
  }

  async analyzeCognitiveProfile(userId, data) {
    return this.cognitive.analyzeProfile(userId, data)
  }

  // User Management Methods
  async createAnonymousUser() {
    return this.connections.createAnonymousUser()
  }

  async getUser(userId) {
    return this.connections.getUser(userId)
  }

  async updateUserPreferences(userId, preferences) {
    return this.connections.updateUserPreferences(userId, preferences)
  }

  // Helper Methods - delegação direta
  sanitizeInput(input, options = {}) {
    return this.helpers.sanitizeInput(input, options)
  }

  sanitizeNumericInput(input, min = 0, max = 100) {
    return this.helpers.sanitizeNumericInput(input, min, max)
  }

  detectAccessibilityNeeds() {
    return this.helpers.detectAccessibilityNeeds()
  }

  getDeviceAdaptations() {
    return this.helpers.getDeviceAdaptations()
  }

  // Cache Methods
  setLocalData(key, data, options = {}) {
    return this.cacheManager.setLocalData(key, data, options)
  }

  getLocalData(key, defaultValue = null) {
    return this.cacheManager.getLocalData(key, defaultValue)
  }

  isCacheValid(cached, maxAge) {
    return this.helpers.isCacheValid(cached, maxAge)
  }

  // ============== MÉTODOS CORE DO SERVIÇO ==============

  /**
   * @method withRetry
   * @async
   * @description Executa uma função com retries e backoff exponencial
   * @param {Function} fn - Função a ser executada
   * @param {string} context - Contexto da operação
   * @returns {Promise<*>} Resultado da função
   */
  async withRetry(fn, context = 'operation') {
    return this.connections.withRetry(fn, context)
  }

  /**
   * @method deduplicatedRequest
   * @async
   * @description Evita requisições duplicadas para a mesma chave
   * @param {string} key - Chave única
   * @param {Function} fn - Função da requisição
   * @returns {Promise<*>} Resultado da requisição
   */
  async deduplicatedRequest(key, fn) {
    return this.connections.deduplicatedRequest(key, fn)
  }

  /**
   * @method authenticatedFetch
   * @async
   * @description Realiza requisição HTTP autenticada
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição
   * @returns {Promise<Response>} Resposta da requisição
   */
  async authenticatedFetch(url, options = {}) {
    return this.connections.authenticatedFetch(url, options)
  }

  // ============== MÉTODOS DE STATUS E DIAGNÓSTICO ==============

  /**
   * @method getServiceStatus
   * @description Obtém status detalhado do serviço
   * @returns {Object} Status completo do serviço
   */
  getServiceStatus() {
    return {
      initialized: !!this.circuitBreaker,
      online: navigator.onLine,
      circuitBreaker: this.circuitBreaker.getState(),
      cache: this.cache.getStats(),
      components: {
        accessibility: this.accessibility.isReady(),
        sessions: this.sessions.isReady(),
        profiles: this.profiles.isReady(),
        cognitive: this.cognitive.isReady(),
        connections: this.connections.isReady(),
      },
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * @method clearAllCaches
   * @description Limpa todos os caches do sistema
   */
  clearAllCaches() {
    this.cache.clear()
    this.cacheManager.clearLocalStorage()
    this.logger.info('🧹 All caches cleared successfully')
  }

  /**
   * @method exportUserData
   * @async
   * @description Exporta dados completos do usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Dados exportados
   */
  async exportUserData(userId) {
    try {
      const [profiles, sessions, accessibility, cognitive] = await Promise.all([
        this.profiles.getProfiles(userId),
        this.sessions.getSessions(userId),
        this.accessibility.getSettings(userId),
        this.cognitive.getCognitiveProfile(userId),
      ])

      return {
        userId,
        exportDate: new Date().toISOString(),
        profiles,
        sessions,
        accessibility,
        cognitive,
        metadata: {
          version: '2.1',
          platform: 'Portal Betina',
          therapy: 'Autism Support',
        },
      }
    } catch (error) {
      this.logger.error('Failed to export user data', { userId, error: error.message })
      throw error
    }
  }
}

export default DatabaseService
