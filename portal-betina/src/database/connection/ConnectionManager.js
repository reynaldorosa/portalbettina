/**
 * @file ConnectionManager.js
 * @description Gerenciador de conexões e requisições HTTP
 */

export class ConnectionManager {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService.logger
    this.circuitBreaker = databaseService.circuitBreaker
    this.config = databaseService.config
    this.apiConfig = databaseService.apiConfig
    this.authService = databaseService.authService
    this.requestQueue = databaseService.requestQueue
    this.ready = false
  }

  async initialize() {
    this.logger.info('🔗 Initializing ConnectionManager...')
    this.ready = true
    return true
  }

  isReady() {
    return this.ready
  }

  /**
   * @method checkApiHealth
   * @async
   * @description Verifica saúde da API
   * @returns {Promise<Object>} Status da API
   */
  async checkApiHealth() {
    if (!navigator.onLine) {
      throw new Error('🚨 Portal Betina: No internet connection')
    }

    try {
      const response = await fetch(`${this.config.API_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      })

      if (!response.ok) {
        throw new Error(`API Health Check Failed: ${response.status}`)
      }

      const healthData = await response.json()

      this.logger.info('✅ API Health Check passed', healthData)
      return {
        status: 'healthy',
        ...healthData,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      this.logger.error('❌ API Health Check failed', { error: error.message })
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      }
    }
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
    if (!this.authService.isAuthenticated()) {
      throw new Error('User not authenticated')
    }

    const token = this.authService.getToken()
    const headers = {
      ...this.apiConfig.DEFAULT_HEADERS,
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    }

    // Remove Authorization header se token for null/undefined
    if (!token) {
      delete headers.Authorization
    }

    const fetchOptions = {
      timeout: this.apiConfig.TIMEOUT,
      ...options,
      headers,
    }

    try {
      const response = await this.timeoutFetch(url, fetchOptions)

      // Log da requisição para debug
      this.logger.debug('HTTP Request completed', {
        url,
        method: fetchOptions.method || 'GET',
        status: response.status,
        authenticated: !!token,
      })

      return response
    } catch (error) {
      this.logger.error('HTTP Request failed', {
        url,
        method: fetchOptions.method || 'GET',
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method withRetry
   * @async
   * @description Executa função com retries e backoff exponencial
   * @param {Function} fn - Função a ser executada
   * @param {string} context - Contexto da operação
   * @returns {Promise<*>} Resultado da função
   */
  async withRetry(fn, context = 'operation') {
    let lastError

    for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
      try {
        return await this.circuitBreaker.execute(fn)
      } catch (error) {
        lastError = error

        if (attempt === this.config.RETRY_ATTEMPTS) {
          this.logger.error(`All retry attempts failed for ${context}`, {
            attempts: attempt,
            finalError: error.message,
          })
          break
        }

        const delay = Math.min(this.config.RETRY_DELAY * Math.pow(2, attempt - 1), 10000)

        this.logger.debug(`Retry ${attempt}/${this.config.RETRY_ATTEMPTS} for ${context}`, {
          error: error.message,
          nextRetryIn: delay,
        })

        await this.delay(delay)
      }
    }

    throw lastError
  }

  /**
   * @method deduplicatedRequest
   * @async
   * @description Evita requisições duplicadas para a mesma chave
   * @param {string} key - Chave única para a requisição
   * @param {Function} fn - Função que realiza a requisição
   * @returns {Promise<*>} Resultado da requisição
   */
  async deduplicatedRequest(key, fn) {
    if (this.requestQueue.has(key)) {
      this.logger.debug('Returning cached request', { key })
      return this.requestQueue.get(key)
    }

    const promise = fn().finally(() => {
      this.requestQueue.delete(key)
      this.logger.debug('Request completed and removed from queue', { key })
    })

    this.requestQueue.set(key, promise)
    this.logger.debug('New request added to queue', { key })

    return promise
  }

  /**
   * @method createAnonymousUser
   * @async
   * @description Cria usuário anônimo
   * @returns {Promise<Object>} Dados do usuário criado
   */
  async createAnonymousUser() {
    if (!navigator.onLine) {
      // Criar usuário local em modo offline
      const localUser = {
        userId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user: {
          id: `local_${Date.now()}`,
          is_anonymous: true,
          is_local: true,
          created_at: new Date().toISOString(),
        },
      }

      this.logger.warn('🚨 Portal Betina: Created local anonymous user (offline)', {
        userId: localUser.userId,
      })

      return localUser
    }

    try {
      return await this.withRetry(async () => {
        // Tentar usar authService primeiro
        if (this.authService.createAnonymousUser) {
          return await this.authService.createAnonymousUser()
        }

        // Fallback para criação via API
        const response = await fetch(`${this.config.API_URL}/auth/anonymous`, {
          method: 'POST',
          headers: this.apiConfig.DEFAULT_HEADERS,
          timeout: this.apiConfig.TIMEOUT,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const userData = await response.json()

        this.logger.info('🌟 Portal Betina: Anonymous user created', {
          userId: userData.userId,
        })

        return userData
      }, 'createAnonymousUser')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to create anonymous user', {
        error: error.message,
      })

      // Criar usuário local como fallback
      const fallbackUser = {
        userId: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user: {
          id: `fallback_${Date.now()}`,
          is_anonymous: true,
          is_fallback: true,
          created_at: new Date().toISOString(),
        },
      }

      this.logger.warn('🚨 Portal Betina: Created fallback anonymous user', {
        userId: fallbackUser.userId,
      })

      return fallbackUser
    }
  }

  /**
   * @method getUser
   * @async
   * @description Obtém dados do usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async getUser(userId) {
    const userIdStr = String(userId)
    const cacheKey = `${this.db.localStoragePrefix}user_${userIdStr}`

    // Verificar cache primeiro
    const cached = this.db.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }

    // Verificar armazenamento local
    const localUser = this.db.getLocalData(cacheKey)
    if (localUser) {
      this.db.cache.set(cacheKey, localUser, 1800000) // 30 minutos
      return localUser
    }

    if (!navigator.onLine) {
      throw new Error('🚨 Portal Betina: Internet connection required to fetch user data')
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.config.API_URL}${this.apiConfig.ENDPOINTS.users}/${userIdStr}`,
          { method: 'GET' }
        )

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found')
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const userData = await response.json()

        // Cache dos dados do usuário
        this.db.cache.set(cacheKey, userData, 1800000)
        this.db.setLocalData(cacheKey, userData)

        this.logger.info('🌟 Portal Betina: User data retrieved', {
          userId: userIdStr,
        })

        return userData
      }, 'getUser')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to retrieve user data', {
        userId: userIdStr,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method updateUserPreferences
   * @async
   * @description Atualiza preferências do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} preferences - Preferências a serem atualizadas
   * @returns {Promise<Object>} Resultado da operação
   */
  async updateUserPreferences(userId, preferences) {
    const userIdStr = String(userId)
    const sanitizedPreferences = this.sanitizeUserPreferences(preferences)

    // Salvar localmente primeiro
    const cacheKey = `${this.db.localStoragePrefix}user_preferences_${userIdStr}`
    this.db.setLocalData(cacheKey, sanitizedPreferences)
    this.db.cache.set(cacheKey, sanitizedPreferences, 1800000)

    if (!navigator.onLine) {
      this.logger.warn('🚨 Portal Betina: Preferences saved locally (offline mode)', {
        userId: userIdStr,
      })
      return { success: true, offline: true }
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.config.API_URL}${this.apiConfig.ENDPOINTS.users}/${userIdStr}/preferences`,
          {
            method: 'PUT',
            headers: { ...this.apiConfig.DEFAULT_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitizedPreferences),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        // Invalidar cache do usuário
        this.db.cache.invalidate(`user_${userIdStr}`)

        this.logger.info('🌟 Portal Betina: User preferences updated', {
          userId: userIdStr,
        })

        return { success: true, offline: false, data: result }
      }, 'updateUserPreferences')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to update user preferences', {
        userId: userIdStr,
        error: error.message,
      })
      return { success: true, offline: true, syncError: error.message }
    }
  }

  // ============== MÉTODOS AUXILIARES ==============

  /**
   * @method timeoutFetch
   * @async
   * @description Fetch com timeout customizado
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição
   * @returns {Promise<Response>} Resposta da requisição
   */
  async timeoutFetch(url, options = {}) {
    const timeout = options.timeout || this.apiConfig.TIMEOUT

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`)
      }

      throw error
    }
  }

  /**
   * @method delay
   * @async
   * @description Cria um delay assíncrono
   * @param {number} ms - Milissegundos para aguardar
   * @returns {Promise<void>}
   */
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * @method sanitizeUserPreferences
   * @description Sanitiza preferências do usuário
   * @param {Object} preferences - Preferências a serem sanitizadas
   * @returns {Object} Preferências sanitizadas
   */
  sanitizeUserPreferences(preferences) {
    return {
      language: this.db.helpers.sanitizeEnum(preferences.language, ['pt', 'en', 'es'], 'pt'),
      theme: this.db.helpers.sanitizeEnum(preferences.theme, ['light', 'dark', 'auto'], 'auto'),
      notifications:
        typeof preferences.notifications === 'boolean' ? preferences.notifications : true,
      autoSave: typeof preferences.autoSave === 'boolean' ? preferences.autoSave : true,
      difficulty: this.db.helpers.sanitizeEnum(
        preferences.difficulty,
        ['easy', 'medium', 'hard', 'adaptive'],
        'adaptive'
      ),
      accessibility: this.sanitizeAccessibilityPreferences(preferences.accessibility || {}),
      gameplay: this.sanitizeGameplayPreferences(preferences.gameplay || {}),
      privacy: this.sanitizePrivacyPreferences(preferences.privacy || {}),
    }
  }

  /**
   * @method sanitizeAccessibilityPreferences
   * @description Sanitiza preferências de acessibilidade
   * @param {Object} accessibility - Preferências de acessibilidade
   * @returns {Object} Preferências sanitizadas
   */
  sanitizeAccessibilityPreferences(accessibility) {
    return {
      fontSize: this.db.helpers.sanitizeEnum(
        accessibility.fontSize,
        ['small', 'medium', 'large', 'extra-large'],
        'medium'
      ),
      contrast: this.db.helpers.sanitizeEnum(accessibility.contrast, ['normal', 'high'], 'normal'),
      motion: this.db.helpers.sanitizeEnum(
        accessibility.motion,
        ['full', 'reduced', 'none'],
        'full'
      ),
      audio: typeof accessibility.audio === 'boolean' ? accessibility.audio : true,
      captions: typeof accessibility.captions === 'boolean' ? accessibility.captions : false,
      screenReader:
        typeof accessibility.screenReader === 'boolean' ? accessibility.screenReader : false,
    }
  }

  /**
   * @method sanitizeGameplayPreferences
   * @description Sanitiza preferências de gameplay
   * @param {Object} gameplay - Preferências de gameplay
   * @returns {Object} Preferências sanitizadas
   */
  sanitizeGameplayPreferences(gameplay) {
    return {
      autoProgress: typeof gameplay.autoProgress === 'boolean' ? gameplay.autoProgress : true,
      hints: typeof gameplay.hints === 'boolean' ? gameplay.hints : true,
      timer: typeof gameplay.timer === 'boolean' ? gameplay.timer : true,
      feedback: this.db.helpers.sanitizeEnum(
        gameplay.feedback,
        ['minimal', 'standard', 'detailed'],
        'standard'
      ),
      pauseOnFocus: typeof gameplay.pauseOnFocus === 'boolean' ? gameplay.pauseOnFocus : true,
    }
  }

  /**
   * @method sanitizePrivacyPreferences
   * @description Sanitiza preferências de privacidade
   * @param {Object} privacy - Preferências de privacidade
   * @returns {Object} Preferências sanitizadas
   */
  sanitizePrivacyPreferences(privacy) {
    return {
      dataCollection: typeof privacy.dataCollection === 'boolean' ? privacy.dataCollection : true,
      analytics: typeof privacy.analytics === 'boolean' ? privacy.analytics : true,
      sharing: typeof privacy.sharing === 'boolean' ? privacy.sharing : false,
      publicProfile: typeof privacy.publicProfile === 'boolean' ? privacy.publicProfile : false,
    }
  }

  /**
   * @method getConnectionStats
   * @description Obtém estatísticas de conexão
   * @returns {Object} Estatísticas
   */
  getConnectionStats() {
    return {
      online: navigator.onLine,
      circuitBreaker: this.circuitBreaker.getState(),
      requestQueue: {
        size: this.requestQueue.size,
        keys: Array.from(this.requestQueue.keys()),
      },
      config: {
        retryAttempts: this.config.RETRY_ATTEMPTS,
        timeout: this.apiConfig.TIMEOUT,
        apiUrl: this.config.API_URL,
      },
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * @method resetConnections
   * @description Reseta estado das conexões
   */
  resetConnections() {
    this.circuitBreaker.reset()
    this.requestQueue.clear()

    this.logger.info('🔄 Connection state reset', {
      circuitBreaker: 'reset',
      requestQueue: 'cleared',
    })
  }

  /**
   * @method testConnection
   * @async
   * @description Testa conectividade com a API
   * @returns {Promise<Object>} Resultado do teste
   */
  async testConnection() {
    const startTime = Date.now()

    try {
      const healthCheck = await this.checkApiHealth()
      const endTime = Date.now()
      const latency = endTime - startTime

      return {
        success: true,
        latency,
        health: healthCheck,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const endTime = Date.now()
      const latency = endTime - startTime

      return {
        success: false,
        error: error.message,
        latency,
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * @method syncOfflineData
   * @async
   * @description Sincroniza dados offline quando conexão é restaurada
   * @returns {Promise<Object>} Resultado da sincronização
   */
  async syncOfflineData() {
    if (!navigator.onLine) {
      throw new Error('Cannot sync offline data: no internet connection')
    }

    const syncResults = {
      synced: 0,
      failed: 0,
      errors: [],
    }

    try {
      // Implementar lógica de sincronização específica
      // Por enquanto, apenas log
      this.logger.info('🔄 Starting offline data sync...')

      // Aqui seria implementada a sincronização real
      // Por exemplo: percorrer localStorage, identificar dados offline, enviar para API

      this.logger.info('✅ Offline data sync completed', syncResults)
      return syncResults
    } catch (error) {
      this.logger.error('❌ Offline data sync failed', {
        error: error.message,
        results: syncResults,
      })
      throw error
    }
  }

  /**
   * @method monitorConnection
   * @description Monitora estado da conexão
   */
  monitorConnection() {
    // Listeners já configurados no ConnectionStrategy
    // Aqui podemos adicionar lógica adicional se necessário

    window.addEventListener('online', () => {
      this.logger.info('🌐 Connection restored - attempting to sync offline data')
      this.syncOfflineData().catch((error) => {
        this.logger.error('Failed to sync offline data after reconnection', {
          error: error.message,
        })
      })
    })
  }
}
