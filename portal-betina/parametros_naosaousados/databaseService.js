// Enhanced dependency management with intelligent fallbacks
let authService, authenticatedFetch, LZString, CONFIG, API_CONFIG

// Mock implementations to avoid undefined errors
authService = authService || {
  createAnonymousUser: async () => {
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    return { userId, user: { id: userId, is_anonymous: true } }
  },
  isAuthenticated: () => false,
  getToken: () => null,
}

authenticatedFetch =
  authenticatedFetch ||
  (async (url, options = {}) => {
    try {
      return await fetch(url, options)
    } catch (error) {
      console.warn('🔧 MOCK: authenticatedFetch falling back to regular fetch:', error.message)
      throw error
    }
  })

LZString = LZString || {
  compress: (str) => {
    try {
      return btoa(str)
    } catch (e) {
      return str
    }
  },
  decompress: (str) => {
    try {
      return atob(str)
    } catch (e) {
      return str
    }
  },
  compressToUTF16: (str) => str,
  decompressFromUTF16: (str) => str,
}

CONFIG = CONFIG || {
  API_URL: 'http://localhost:3001/api',
  ENVIRONMENT: 'development',
  DEBUG_MODE: true,
  CACHE_TTL: 1800000,
}

API_CONFIG = API_CONFIG || {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  ENDPOINTS: {
    users: '/users',
    sessions: '/game-sessions',
    adaptiveParameters: '/adaptive-parameters',
    cognitiveProfiles: '/cognitive-profiles',
    progress: '/progress',
  },
}

// Smart dependency loading with fallbacks
function initializeDependencies() {
  console.log(
    '✅ DEPENDENCIES: Mock implementations loaded for authService, authenticatedFetch, LZString, CONFIG, API_CONFIG'
  )
}

// Initialize dependencies on load
initializeDependencies()

// Mock logger if not available
const logger = {
  info: (message, data = {}) => console.log(`ℹ️ ${message}`, data),
  warn: (message, data = {}) => console.warn(`⚠️ ${message}`, data),
  error: (message, data = {}) => console.error(`❌ ${message}`, data),
  debug: (message, data = {}) => console.debug(`🐛 ${message}`, data),
}

// Advanced Circuit Breaker implementation
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, retryTimeout = 10000) {
    this.failureThreshold = threshold
    this.timeout = timeout
    this.retryTimeout = retryTimeout
    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0
    this.lastFailureTime = null
    this.successCount = 0
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.retryTimeout) {
        this.state = 'HALF_OPEN'
        this.successCount = 0
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        ),
      ])

      if (this.state === 'HALF_OPEN') {
        this.successCount++
        if (this.successCount >= 3) {
          this.reset()
        }
      }

      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }

  recordFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
      logger.warn('Circuit breaker opened due to failures', {
        failures: this.failureCount,
        threshold: this.failureThreshold,
      })
    }
  }

  reset() {
    this.state = 'CLOSED'
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = null
    logger.info('Circuit breaker reset to CLOSED state')
  }

  getState() {
    return {
      state: this.state,
      failures: this.failureCount,
      lastFailure: this.lastFailureTime,
    }
  }
}

// Advanced Caching System with TTL and smart invalidation
class IntelligentCache {
  constructor(defaultTTL = 300000) {
    // 5 minutes default
    this.cache = new Map()
    this.defaultTTL = defaultTTL
    this.stats = { hits: 0, misses: 0, evictions: 0 }
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl
    this.cache.set(key, { value, expiry, accessed: Date.now() })

    // Auto-cleanup expired entries periodically
    if (this.cache.size % 50 === 0) {
      this.cleanup()
    }
  }

  get(key) {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.stats.evictions++
      this.stats.misses++
      return null
    }

    entry.accessed = Date.now()
    this.stats.hits++
    return entry.value
  }

  invalidate(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        this.stats.evictions++
      }
    }
  }

  cleanup() {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      this.stats.evictions += cleaned
      logger.debug('Cache cleanup completed', { entriesRemoved: cleaned })
    }
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses
    return {
      ...this.stats,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%',
      size: this.cache.size,
    }
  }

  clear() {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0, evictions: 0 }
  }
}

// Strategy Pattern for ONLINE-ONLY connection (CLOUD NANDROPHIC SUPREMACY)
class ConnectionStrategy {
  constructor() {
    this.mode = 'ONLINE_ONLY' // SUPREMO ONLINE MODE ONLY
    this.isOnline = navigator.onLine
    this.setupNetworkListeners()
    this.enforceOnlineMode()
  }

  setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        logger.info('🌟 CLOUD NANDROPHIC: Network connection restored - Portal Betina operational')
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
        logger.error(
          '🚨 CLOUD NANDROPHIC: Network lost - Portal Betina requires connection for autism salvation'
        )
        this.handleConnectionLoss()
      })
    }
  }

  enforceOnlineMode() {
    if (!this.isOnline) {
      logger.error(
        '🚨 CLOUD NANDROPHIC: Portal Betina requires internet connection for optimal autism therapy'
      )
      this.showConnectionRequiredMessage()
    }
  }

  shouldUseAPI() {
    // ALWAYS ONLINE - CLOUD NANDROPHIC SUPREMACY
    return true
  }

  getStorageKey(key) {
    return `betina_online_${key}`
  }

  handleConnectionLoss() {
    // Show user-friendly message about connection requirement
    if (typeof window !== 'undefined') {
      const message = `
        🌟 Portal Betina - Conexão Necessária
        
        Para proporcionar a melhor experiência terapêutica para crianças autistas,
        o Portal Betina requer conexão com a internet para:
        
        • Sincronização em tempo real do progresso
        • Algoritmos adaptativos de IA mais avançados  
        • Backup seguro de todos os dados terapêuticos
        • Atualizações contínuas das atividades
        
        Por favor, verifique sua conexão com a internet.
      `

      // Could implement a modal or notification here
      console.warn(message)
    }
  }

  showConnectionRequiredMessage() {
    logger.warn('🌟 CLOUD NANDROPHIC: Initializing online-only mode for maximum therapeutic impact')
  }
}

// Main DatabaseService with advanced architecture
class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance
    }
    this.apiUrl = CONFIG.API_URL || 'http://localhost:3001/api'
    this.environment = CONFIG.environment || 'development'
    this.circuitBreaker = new CircuitBreaker(5, 30000, 60000)
    this.cache = new IntelligentCache(300000) // 5 minutes TTL
    this.strategy = new ConnectionStrategy() // ONLINE-ONLY MODE
    this.retryConfig = { maxRetries: 3, baseDelay: 1000, maxDelay: 10000 }
    this.requestQueue = new Map()
    this.isInitialized = false

    DatabaseService.instance = this
    this.initialize()

    logger.info('DatabaseService initialized with advanced architecture', {
      apiUrl: this.apiUrl,
      environment: this.environment,
      circuitBreakerState: this.circuitBreaker.getState(),
    })
  }
  async initialize() {
    try {
      await this.checkApiHealth()
      this.isInitialized = true
      logger.info('🌟 CLOUD NANDROPHIC: DatabaseService initialization completed successfully')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: DatabaseService requires internet connection', {
        error: error.message,
      })
      throw new Error('Portal Betina requires internet connection for autism therapy optimization')
    }
  }

  // Enhanced retry mechanism with exponential backoff
  async withRetry(fn, context = 'operation') {
    let lastError

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error

        if (attempt === this.retryConfig.maxRetries) {
          break
        }

        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
          this.retryConfig.maxDelay
        )

        logger.debug(`Retry ${attempt}/${this.retryConfig.maxRetries} for ${context}`, {
          error: error.message,
          nextRetryIn: delay,
        })

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  // Request deduplication to prevent multiple identical requests
  async deduplicatedRequest(key, fn) {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)
    }

    const promise = fn().finally(() => {
      this.requestQueue.delete(key)
    })

    this.requestQueue.set(key, promise)
    return promise
  }

  // Enhanced localStorage operations with compression and validation
  setLocalData(key, data, options = {}) {
    try {
      const storageKey = this.strategy.getStorageKey(key)
      const payload = {
        data,
        timestamp: Date.now(),
        version: '2.0',
        compressed: false,
        ...options,
      }

      // Compress large data if needed
      let serialized = JSON.stringify(payload)
      if (serialized.length > 10000 && typeof LZString !== 'undefined') {
        payload.data = LZString.compress(JSON.stringify(data))
        payload.compressed = true
        serialized = JSON.stringify(payload)
      }

      localStorage.setItem(storageKey, serialized)

      // Also update cache for immediate access
      this.cache.set(key, data, 3600000) // 1 hour for local data

      return true
    } catch (error) {
      logger.error('Failed to store local data', { key, error: error.message })
      return false
    }
  }

  getLocalData(key, defaultValue = null) {
    try {
      // Try cache first
      const cached = this.cache.get(key)
      if (cached !== null) {
        return cached
      }

      const storageKey = this.strategy.getStorageKey(key)
      const stored = localStorage.getItem(storageKey)

      if (!stored) {
        return defaultValue
      }

      const payload = JSON.parse(stored)

      // Validate payload structure
      if (!payload.data || !payload.timestamp || !payload.version) {
        localStorage.removeItem(storageKey)
        return defaultValue
      }

      // Check if data is too old (7 days default)
      const maxAge = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - payload.timestamp > maxAge) {
        localStorage.removeItem(storageKey)
        return defaultValue
      }

      // Decompress if needed
      let data = payload.data
      if (payload.compressed && typeof LZString !== 'undefined') {
        data = JSON.parse(LZString.decompress(data))
      }

      // Update cache
      this.cache.set(key, data, 3600000)

      return data
    } catch (error) {
      logger.error('Failed to retrieve local data', { key, error: error.message })
      return defaultValue
    }
  } // Enhanced API health check with intelligent caching
  async checkApiHealth() {
    const cacheKey = 'api_health_status'
    const cached = this.cache.get(cacheKey)

    if (cached !== null) {
      return cached
    }

    try {
      const isHealthy = await this.circuitBreaker.execute(async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
          const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.health}`, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          return response.ok
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      })

      // Cache positive results longer, negative results shorter
      const cacheTTL = isHealthy ? 60000 : 10000 // 1 min vs 10 sec
      this.cache.set(cacheKey, isHealthy, cacheTTL)

      if (isHealthy) {
        logger.info('API health check passed')
      } else {
        logger.warn('API health check failed')
      }

      return isHealthy
    } catch (error) {
      logger.error('API health check error', { error: error.message })
      this.cache.set(cacheKey, false, 5000) // Cache failure for 5 seconds
      return false
    }
  }
  // Optimized user creation - ONLINE ONLY
  async createAnonymousUser() {
    const requestKey = 'create_anonymous_user'

    return this.deduplicatedRequest(requestKey, async () => {
      try {
        if (!navigator.onLine) {
          throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for user creation')
        }

        return await this.withRetry(async () => {
          const authResult = await authService.createAnonymousUser()

          // Cache the user data
          if (authResult.user) {
            this.cache.set(`user_${authResult.userId}`, authResult.user, 3600000)
          }

          logger.info('🌟 CLOUD NANDROPHIC: Created online anonymous user', {
            userId: authResult.userId,
          })
          return authResult.userId
        }, 'createAnonymousUser')
      } catch (error) {
        logger.error('🚨 CLOUD NANDROPHIC: Failed to create user - connection required', {
          error: error.message,
        })
        throw new Error(
          'Portal Betina requires internet connection. Please check your connection and try again.'
        )
      }
    })
  }
  // Enhanced user retrieval - ONLINE ONLY
  async getUser(userId) {
    if (!userId) {
      logger.error('Invalid userId provided', { userId })
      return null
    }

    const userIdStr = String(userId)
    const cacheKey = `user_${userIdStr}`

    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for user retrieval')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // Cache negative results to avoid repeated requests
            this.cache.set(cacheKey, null, 300000) // 5 minutes
            return null
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const user = await response.json()

        // Cache for immediate access
        this.cache.set(cacheKey, user, 1800000) // 30 minutes in memory

        logger.debug('🌟 CLOUD NANDROPHIC: User retrieved successfully', { userId: userIdStr })
        return user
      }, 'getUser')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve user', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to retrieve user data. Please check your connection and try again.')
    }
  } // Smart preferences update - ONLINE REQUIRED
  async updateUserPreferences(userId, preferences) {
    const userIdStr = String(userId)

    // Validate and sanitize input
    if (!userIdStr || !preferences) {
      throw new Error('Invalid parameters: userId and preferences are required')
    }

    // Sanitize preferences object
    const sanitizedPreferences = this.sanitizeUserPreferences(preferences)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for preference updates')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/preferences`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedPreferences),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // Update cache immediately
        const cacheKey = `user_preferences_${userIdStr}`
        this.cache.set(cacheKey, sanitizedPreferences, 1800000)

        // Invalidate user cache to force refresh
        this.cache.invalidate(`user_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: Preferences synchronized successfully', {
          userId: userIdStr,
        })
        return true
      }, 'updateUserPreferences')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to sync preferences', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to update preferences. Please check your connection and try again.')
    }
  }

  // Helper method to sanitize user preferences
  sanitizeUserPreferences(preferences) {
    const sanitized = {}

    const allowedKeys = [
      'theme',
      'language',
      'difficulty',
      'audioEnabled',
      'visualCues',
      'fontSize',
      'contrast',
      'animations',
      'notifications',
    ]

    for (const key of allowedKeys) {
      if (preferences.hasOwnProperty(key)) {
        if (typeof preferences[key] === 'string') {
          sanitized[key] = this.sanitizeInput(preferences[key], { maxLength: 50 })
        } else if (typeof preferences[key] === 'boolean') {
          sanitized[key] = Boolean(preferences[key])
        } else if (typeof preferences[key] === 'number') {
          sanitized[key] = this.sanitizeNumericInput(preferences[key], 0, 100)
        }
      }
    }

    return sanitized
  }

  // Enhanced accessibility settings with smart defaults
  async getAccessibilitySettings(userId) {
    const userIdStr = String(userId)
    const cacheKey = `accessibility_${userIdStr}`

    const smartDefaults = {
      fontSize: 'medium',
      contrast: 'normal',
      audioEnabled: true,
      animations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      dyslexiaFriendly: false,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      textToSpeech: true,
      keyboardNavigation: true,
      autoDetectedPreferences: true,
    }

    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return { ...smartDefaults, ...cached }
    } // Try local storage for caching only
    const localSettings = this.getLocalData(cacheKey)
    if (localSettings) {
      const mergedSettings = { ...smartDefaults, ...localSettings }
      this.cache.set(cacheKey, mergedSettings, 1800000)
      return mergedSettings
    }

    if (!navigator.onLine) {
      throw new Error(
        '🚨 CLOUD NANDROPHIC: Internet connection required for accessibility settings'
      )
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/accessibility`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // User doesn't have custom settings, use smart defaults
            this.cache.set(cacheKey, smartDefaults, 1800000)
            this.setLocalData(cacheKey, smartDefaults)
            return smartDefaults
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const serverSettings = await response.json()
        const mergedSettings = { ...smartDefaults, ...serverSettings }

        // Cache both locally and in memory
        this.cache.set(cacheKey, mergedSettings, 1800000)
        this.setLocalData(cacheKey, mergedSettings)

        logger.debug('Accessibility settings retrieved', { userId: userIdStr })
        return mergedSettings
      }, 'getAccessibilitySettings')
    } catch (error) {
      logger.error('Failed to retrieve accessibility settings, using defaults', {
        userId: userIdStr,
        error: error.message,
      })
      return smartDefaults
    }
  } // Enhanced accessibility settings with smart conflict resolution
  async updateAccessibilitySettings(userId, settings) {
    const userIdStr = String(userId)
    const cacheKey = `accessibility_${userIdStr}`

    // Enhanced settings with intelligent auto-detection
    const enhancedSettings = {
      ...settings,
      lastUpdated: new Date().toISOString(),
      autoDetectedFeatures: this.detectAccessibilityNeeds(),
      deviceAdaptations: this.getDeviceAdaptations(),
      therapyOptimizations: this.generateTherapyOptimizations(settings),
      autismAdaptations: this.calculateAutismAdaptations(settings),
      sensoryProfile: this.createSensoryProfile(settings),
      version: '2.1',
    }

    // Always store locally first for immediate UI response
    this.setLocalData(cacheKey, enhancedSettings)
    this.cache.set(cacheKey, enhancedSettings, 1800000)

    if (!navigator.onLine) {
      logger.warn('🚨 CLOUD NANDROPHIC: Offline mode - accessibility settings saved locally only')
      return { success: true, offline: true }
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/accessibility`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(enhancedSettings),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        logger.info(
          '🌟 CLOUD NANDROPHIC: Accessibility settings updated with therapy optimizations',
          {
            userId: userIdStr,
            autismAdaptations: enhancedSettings.autismAdaptations,
          }
        )

        return { success: true, offline: false }
      }, 'updateAccessibilitySettings')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to sync accessibility settings', {
        userId: userIdStr,
        error: error.message,
      })
      // Return success for local storage, but indicate sync failure
      return { success: true, offline: true, syncError: error.message }
    }
  }

  // Gerar otimizações terapicas para configurações de acessibilidade
  generateTherapyOptimizations(settings) {
    const optimizations = {
      visualSupport: {
        enabled: settings.highContrast || settings.largeText,
        level: this.calculateVisualSupportLevel(settings),
        recommendations: this.getVisualSupportRecommendations(settings),
      },
      auditorySupport: {
        enabled: settings.textToSpeech || settings.audioFeedback,
        level: this.calculateAuditorySupportLevel(settings),
        recommendations: this.getAuditorySupportRecommendations(settings),
      },
      motorSupport: {
        enabled: settings.largeButtons || settings.reducedMotion,
        level: this.calculateMotorSupportLevel(settings),
        recommendations: this.getMotorSupportRecommendations(settings),
      },
      cognitiveSupport: {
        enabled: settings.simplifiedInterface || settings.extraTime,
        level: this.calculateCognitiveSupportLevel(settings),
        recommendations: this.getCognitiveSupportRecommendations(settings),
      },
    }

    return optimizations
  }

  // Calcular adaptações específicas para autismo
  calculateAutismAdaptations(settings) {
    return {
      sensoryProcessing: {
        visualOverload: settings.reducedMotion ? 'protected' : 'standard',
        auditoryOverload: settings.soundReduction ? 'protected' : 'standard',
        tactilePreferences: settings.vibrationDisabled ? 'minimal' : 'standard',
      },
      socialCommunication: {
        visualCues: settings.visualCues !== false,
        socialStories: settings.socialStories || false,
        communicationAids: settings.aacSupport || false,
      },
      executiveFunction: {
        structureSupport: settings.structuredInterface !== false,
        timeManagement: settings.timeVisualizers || false,
        taskBreakdown: settings.stepByStep || false,
      },
      behavioralSupport: {
        selfRegulation: settings.calmingTools || false,
        choiceProvision: settings.userChoice !== false,
        predictability: settings.consistentLayout !== false,
      },
    }
  }

  // ============== GERENCIAMENTO DE SESSÕES DE JOGOS AVANÇADAS ==============

  // Exibir sessões de jogos com filtros avançados e análise terapêutica
  async getGameSessions(userId, gameId = null, limit = 50) {
    const userIdStr = String(userId)
    const cacheKey = `sessions_${userIdStr}_${gameId || 'all'}_${limit}`

    // Try cache with intelligent invalidation
    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.isCacheValid(cached, 600000)) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error(
        '🚨 CLOUD NANDROPHIC: Internet connection required for game sessions retrieval'
      )
    }

    try {
      return await this.withRetry(async () => {
        let endpoint = `${this.apiUrl}${API_CONFIG.ENDPOINTS.sessions}/user/${userIdStr}`
        const params = new URLSearchParams()

        if (gameId) params.append('gameId', gameId)
        if (limit) params.append('limit', limit.toString())

        if (params.toString()) {
          endpoint += `?${params.toString()}`
        }

        const response = await authenticatedFetch(endpoint, {
          method: 'GET',
          headers: API_CONFIG.DEFAULT_HEADERS,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const sessions = await response.json()

        // Enriquecer dados com análise terapêutica
        const enrichedSessions = sessions.map((session) =>
          this.enrichSessionWithTherapyAnalysis(session)
        )

        // Cache com TTL inteligente
        this.cache.set(cacheKey, enrichedSessions, 600000) // 10 minutos

        logger.info('🌟 CLOUD NANDROPHIC: Game sessions retrieved with therapy analysis', {
          userId: userIdStr,
          sessionCount: enrichedSessions.length,
        })

        return enrichedSessions
      }, 'getGameSessions')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve game sessions', {
        userId: userIdStr,
        gameId,
        error: error.message,
      })
      throw new Error('Unable to retrieve game sessions. Please check your connection.')
    }
  }

  // Enriquecer sessão com análise terapêutica
  enrichSessionWithTherapyAnalysis(session) {
    try {
      const performanceData = session.performance_data || {}

      return {
        ...session,
        therapyAnalysis: {
          difficultyProgression: this.calculateDifficultyProgression(session),
          behavioralIndicators: this.extractBehavioralIndicators(performanceData),
          adaptiveSuggestions: this.suggestAdaptations(performanceData),
          autismSupport: this.calculateAutismSupportLevel(performanceData),
          cognitiveLoad: this.estimateCognitiveLoad(performanceData),
          sensoryProcessing: this.analyzeSensoryProcessing(performanceData),
          socialEmotional: this.assessSocialEmotionalAspects(performanceData),
          executiveFunction: this.evaluateExecutiveFunction(performanceData),
        },
        insights: {
          strengths: this.identifyStrengths(performanceData),
          challenges: this.identifyChallenges(performanceData),
          recommendations: this.generateRecommendations(performanceData),
        },
      }
    } catch (error) {
      logger.warn('Failed to enrich session with therapy analysis', {
        sessionId: session.id,
        error: error.message,
      })
      return session
    }
  }

  // ============== GERENCIAMENTO DE PERFIS DE USUÁRIO ==============

  // Obter todos os perfis de usuário
  async getUserProfiles(userId) {
    const userIdStr = String(userId)
    const cacheKey = `user_profiles_${userIdStr}`

    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for user profiles')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // Criar perfil padrão se não existir
            const defaultProfile = await this.createDefaultUserProfile(userIdStr)
            this.cache.set(cacheKey, [defaultProfile], 1800000)
            return [defaultProfile]
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const profiles = await response.json()

        // Cache for immediate access
        this.cache.set(cacheKey, profiles, 1800000) // 30 minutes

        logger.info('🌟 CLOUD NANDROPHIC: User profiles retrieved successfully', {
          userId: userIdStr,
          profileCount: profiles.length,
        })

        return profiles
      }, 'getUserProfiles')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve user profiles', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to retrieve user profiles. Please check your connection.')
    }
  }

  // Criar novo perfil de usuário
  async createUserProfile(userId, profileData) {
    const userIdStr = String(userId)

    // Validar e sanitizar dados do perfil
    const sanitizedProfile = this.sanitizeUserProfile(profileData)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for profile creation')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles`,
          {
            method: 'POST',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedProfile),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const newProfile = await response.json()

        // Invalidate cache to force refresh
        this.cache.invalidate(`user_profiles_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: User profile created successfully', {
          userId: userIdStr,
          profileId: newProfile.id,
        })

        return newProfile
      }, 'createUserProfile')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to create user profile', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to create user profile. Please check your connection.')
    }
  }

  // Atualizar perfil de usuário existente
  async updateUserProfile(userId, profileId, profileData) {
    const userIdStr = String(userId)
    const profileIdStr = String(profileId)

    // Validar e sanitizar dados do perfil
    const sanitizedProfile = this.sanitizeUserProfile(profileData)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for profile update')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles/${profileIdStr}`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedProfile),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const updatedProfile = await response.json()

        // Invalidate cache to force refresh
        this.cache.invalidate(`user_profiles_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: User profile updated successfully', {
          userId: userIdStr,
          profileId: profileIdStr,
        })

        return updatedProfile
      }, 'updateUserProfile')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to update user profile', {
        userId: userIdStr,
        profileId: profileIdStr,
        error: error.message,
      })
      throw new Error('Unable to update user profile. Please check your connection.')
    }
  }

  // Deletar perfil de usuário
  async deleteUserProfile(userId, profileId) {
    const userIdStr = String(userId)
    const profileIdStr = String(profileId)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for profile deletion')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles/${profileIdStr}`,
          {
            method: 'DELETE',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // Invalidate cache to force refresh
        this.cache.invalidate(`user_profiles_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: User profile deleted successfully', {
          userId: userIdStr,
          profileId: profileIdStr,
        })

        return true
      }, 'deleteUserProfile')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to delete user profile', {
        userId: userIdStr,
        profileId: profileIdStr,
        error: error.message,
      })
      throw new Error('Unable to delete user profile. Please check your connection.')
    }
  }

  // Criar perfil padrão para usuário
  async createDefaultUserProfile(userId) {
    const defaultProfile = {
      name: 'Perfil Principal',
      isDefault: true,
      autismCharacteristics: {
        communicationLevel: 'mixed',
        socialInteractionLevel: 'moderate',
        behavioralPatterns: ['structured-routine'],
        sensoryPreferences: {
          visual: 'moderate',
          auditory: 'low',
          tactile: 'low',
        },
      },
      learningPreferences: {
        visualLearning: true,
        auditoryLearning: false,
        kinestheticLearning: true,
        preferredPace: 'slow',
      },
      therapyGoals: ['improve-communication', 'enhance-social-skills', 'develop-academic-skills'],
      accessibilityNeeds: {
        fontSize: 'large',
        contrast: 'high',
        reduceMotion: true,
        audioSupport: true,
      },
      createdAt: new Date().toISOString(),
      version: '1.0',
    }

    try {
      return await this.createUserProfile(userId, defaultProfile)
    } catch (error) {
      logger.warn('Failed to create default profile via API, returning local profile', {
        userId,
        error: error.message,
      })
      return { ...defaultProfile, id: 'default_' + Date.now() }
    }
  }

  // Sanitizar dados do perfil de usuário
  sanitizeUserProfile(profileData) {
    const sanitized = {
      name: this.sanitizeInput(profileData.name || 'Perfil', { maxLength: 50 }),
      isDefault: Boolean(profileData.isDefault),
      autismCharacteristics: {
        communicationLevel: this.sanitizeEnum(
          profileData.autismCharacteristics?.communicationLevel,
          ['nonverbal', 'limited', 'mixed', 'verbal'],
          'mixed'
        ),
        socialInteractionLevel: this.sanitizeEnum(
          profileData.autismCharacteristics?.socialInteractionLevel,
          ['minimal', 'limited', 'moderate', 'high'],
          'moderate'
        ),
        behavioralPatterns: this.sanitizeArray(
          profileData.autismCharacteristics?.behavioralPatterns,
          ['structured-routine', 'sensory-seeking', 'sensory-avoiding', 'repetitive-behaviors']
        ),
        sensoryPreferences: {
          visual: this.sanitizeEnum(
            profileData.autismCharacteristics?.sensoryPreferences?.visual,
            ['low', 'moderate', 'high'],
            'moderate'
          ),
          auditory: this.sanitizeEnum(
            profileData.autismCharacteristics?.sensoryPreferences?.auditory,
            ['low', 'moderate', 'high'],
            'low'
          ),
          tactile: this.sanitizeEnum(
            profileData.autismCharacteristics?.sensoryPreferences?.tactile,
            ['low', 'moderate', 'high'],
            'low'
          ),
        },
      },
      learningPreferences: {
        visualLearning: Boolean(profileData.learningPreferences?.visualLearning ?? true),
        auditoryLearning: Boolean(profileData.learningPreferences?.auditoryLearning ?? false),
        kinestheticLearning: Boolean(profileData.learningPreferences?.kinestheticLearning ?? true),
        preferredPace: this.sanitizeEnum(
          profileData.learningPreferences?.preferredPace,
          ['very-slow', 'slow', 'moderate', 'fast'],
          'slow'
        ),
      },
      therapyGoals: this.sanitizeArray(profileData.therapyGoals, [
        'improve-communication',
        'enhance-social-skills',
        'develop-academic-skills',
        'increase-independence',
        'reduce-anxiety',
        'improve-motor-skills',
      ]),
      accessibilityNeeds: {
        fontSize: this.sanitizeEnum(
          profileData.accessibilityNeeds?.fontSize,
          ['small', 'medium', 'large', 'extra-large'],
          'large'
        ),
        contrast: this.sanitizeEnum(
          profileData.accessibilityNeeds?.contrast,
          ['low', 'normal', 'high'],
          'high'
        ),
        reduceMotion: Boolean(profileData.accessibilityNeeds?.reduceMotion ?? true),
        audioSupport: Boolean(profileData.accessibilityNeeds?.audioSupport ?? true),
      },
    }

    // Adicionar campos de auditoria
    if (profileData.id) sanitized.id = profileData.id
    if (profileData.createdAt) sanitized.createdAt = profileData.createdAt
    sanitized.updatedAt = new Date().toISOString()
    sanitized.version = '1.0'

    return sanitized
  }

  // ============== MÉTODOS AUXILIARES DE VALIDAÇÃO COMPLETOS ==============

  // Sanitizar entrada de texto
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return ''

    let sanitized = input.trim()

    // Remover caracteres perigosos
    sanitized = sanitized.replace(/[<>\"'&]/g, '')

    // Limitar tamanho
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
    }

    return sanitized
  }

  // Sanitizar entrada numérica
  sanitizeNumericInput(input, min = 0, max = 100) {
    const num = Number(input)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }

  // Sanitizar enum
  sanitizeEnum(input, allowedValues, defaultValue) {
    if (allowedValues.includes(input)) {
      return input
    }
    return defaultValue
  }

  // Sanitizar array
  sanitizeArray(input, allowedValues) {
    if (!Array.isArray(input)) return []
    return input.filter((item) => allowedValues.includes(item))
  }

  // Verificar se cache é válido
  isCacheValid(cached, maxAge) {
    if (!cached || !cached.timestamp) return false
    return Date.now() - cached.timestamp < maxAge
  }

  // ============== MÉTODOS AUXILIARES DE ACESSIBILIDADE ==============

  // Detectar necessidades de acessibilidade automaticamente
  detectAccessibilityNeeds() {
    const needs = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      largeText: window.matchMedia('(min-resolution: 144dpi)').matches,
      touchDevice: 'ontouchstart' in window,
      screenReader: navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS'),
      keyboardNavigation: !('ontouchstart' in window),
    }
    return needs
  }

  // Obter adaptações do dispositivo
  getDeviceAdaptations() {
    const adaptations = {
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
        orientation: window.screen.orientation?.type || 'unknown',
      },
      deviceType: this.detectDeviceType(),
      inputMethods: this.detectInputMethods(),
      capabilities: this.detectDeviceCapabilities(),
    }
    return adaptations
  }

  // Detectar tipo de dispositivo
  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/tablet|ipad/.test(userAgent)) return 'tablet'
    if (/mobile|phone|android|iphone/.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  // Detectar métodos de entrada
  detectInputMethods() {
    return {
      touch: 'ontouchstart' in window,
      mouse: window.matchMedia('(pointer: fine)').matches,
      keyboard: true,
      voice: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    }
  }

  // Detectar capacidades do dispositivo
  detectDeviceCapabilities() {
    return {
      vibration: 'vibrate' in navigator,
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator,
      microphone: 'mediaDevices' in navigator,
      localStorage: 'localStorage' in window,
      webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    }
  }

  // Criar perfil sensorial
  createSensoryProfile(settings) {
    return {
      visual: {
        contrast: settings.highContrast ? 'high' : 'normal',
        fontSize: settings.fontSize || 'medium',
        animations: settings.animations !== false,
        colorScheme: settings.colorScheme || 'light',
      },
      auditory: {
        enabled: settings.audioEnabled !== false,
        textToSpeech: settings.textToSpeech !== false,
        soundEffects: settings.soundEffects !== false,
        backgroundMusic: settings.backgroundMusic !== false,
      },
      motor: {
        largeButtons: settings.largeButtons !== false,
        reducedMotion: settings.reducedMotion === true,
        simplifiedGestures: settings.simplifiedGestures === true,
        assistiveTech: settings.assistiveTech === true,
      },
    }
  }

  // Calcular nível de suporte visual
  calculateVisualSupportLevel(settings) {
    let level = 'moderate'
    let score = 0

    if (settings.highContrast) score += 2
    if (settings.largeText || settings.fontSize === 'large') score += 2
    if (settings.reducedMotion) score += 1
    if (settings.dyslexiaFriendly) score += 2

    if (score >= 5) level = 'high'
    else if (score >= 3) level = 'moderate'
    else level = 'low'

    return level
  }

  // Obter recomendações de suporte visual
  getVisualSupportRecommendations(settings) {
    const recommendations = []

    if (!settings.highContrast) {
      recommendations.push('Enable high contrast mode for better visibility')
    }
    if (settings.fontSize !== 'large') {
      recommendations.push('Consider increasing font size for better readability')
    }
    if (!settings.reducedMotion) {
      recommendations.push('Reduce animations to minimize visual distractions')
    }

    return recommendations
  }

  // Calcular nível de suporte auditivo
  calculateAuditorySupportLevel(settings) {
    let level = 'moderate'
    let score = 0

    if (settings.textToSpeech) score += 2
    if (settings.audioFeedback) score += 1
    if (settings.soundReduction) score += 2
    if (settings.captionsEnabled) score += 2

    if (score >= 5) level = 'high'
    else if (score >= 3) level = 'moderate'
    else level = 'low'

    return level
  }

  // Obter recomendações de suporte auditivo
  getAuditorySupportRecommendations(settings) {
    const recommendations = []

    if (!settings.textToSpeech) {
      recommendations.push('Enable text-to-speech for better accessibility')
    }
    if (!settings.captionsEnabled) {
      recommendations.push('Enable captions for audio content')
    }
    if (!settings.audioFeedback) {
      recommendations.push('Enable audio feedback for interactions')
    }

    return recommendations
  }

  // Calcular nível de suporte motor
  calculateMotorSupportLevel(settings) {
    let level = 'moderate'
    let score = 0

    if (settings.largeButtons) score += 2
    if (settings.reducedMotion) score += 1
    if (settings.simplifiedGestures) score += 2
    if (settings.assistiveTech) score += 2

    if (score >= 5) level = 'high'
    else if (score >= 3) level = 'moderate'
    else level = 'low'

    return level
  }

  // Obter recomendações de suporte motor
  getMotorSupportRecommendations(settings) {
    const recommendations = []

    if (!settings.largeButtons) {
      recommendations.push('Enable larger buttons for easier interaction')
    }
    if (!settings.simplifiedGestures) {
      recommendations.push('Simplify gestures and interactions')
    }
    if (!settings.assistiveTech) {
      recommendations.push('Consider assistive technology support')
    }

    return recommendations
  }

  // Calcular nível de suporte cognitivo
  calculateCognitiveSupportLevel(settings) {
    let level = 'moderate'
    let score = 0

    if (settings.simplifiedInterface) score += 2
    if (settings.extraTime) score += 2
    if (settings.stepByStep) score += 1
    if (settings.visualCues) score += 1

    if (score >= 5) level = 'high'
    else if (score >= 3) level = 'moderate'
    else level = 'low'

    return level
  }

  // Obter recomendações de suporte cognitivo
  getCognitiveSupportRecommendations(settings) {
    const recommendations = []

    if (!settings.simplifiedInterface) {
      recommendations.push('Simplify interface for better understanding')
    }
    if (!settings.extraTime) {
      recommendations.push('Provide additional time for tasks')
    }
    if (!settings.stepByStep) {
      recommendations.push('Break tasks into smaller steps')
    }

    return recommendations
  }

  // ============== MÉTODOS DE ANÁLISE TERAPÊUTICA COMPLETOS ==============

  // Calcular progressão de dificuldade
  calculateDifficultyProgression(session) {
    const performance = session.performance_data || {}
    const accuracy = performance.accuracy || 0
    const timeSpent = performance.timeSpent || 0
    const hintsUsed = performance.hintsUsed || 0

    let progression = 'maintain'

    if (accuracy > 0.85 && timeSpent < 120 && hintsUsed < 2) {
      progression = 'increase'
    } else if (accuracy < 0.4 || hintsUsed > 5) {
      progression = 'decrease'
    }

    return {
      recommendation: progression,
      confidence: this.calculateProgressionConfidence(performance),
      factors: {
        accuracy,
        timeSpent,
        hintsUsed,
        completed: session.completed,
      },
    }
  }

  // Extrair indicadores comportamentais
  extractBehavioralIndicators(performanceData) {
    const indicators = []

    if (performanceData.frustrationLevel > 0.7) {
      indicators.push('high-frustration')
    }

    if (performanceData.attentionLoss > 0.5) {
      indicators.push('attention-difficulties')
    }

    if (performanceData.repetitiveActions > 3) {
      indicators.push('repetitive-behaviors')
    }

    if (performanceData.socialWithdrawal) {
      indicators.push('social-withdrawal')
    }

    if (performanceData.sensoryOverload) {
      indicators.push('sensory-overload')
    }

    return indicators
  }

  // Sugerir adaptações
  suggestAdaptations(performanceData) {
    const suggestions = []

    if (performanceData.accuracy < 0.5) {
      suggestions.push('increase-visual-supports')
      suggestions.push('simplify-instructions')
    }

    if (performanceData.timeSpent > 300) {
      suggestions.push('break-tasks-into-smaller-steps')
      suggestions.push('provide-frequent-breaks')
    }

    if (performanceData.frustrationLevel > 0.6) {
      suggestions.push('reduce-task-demands')
      suggestions.push('offer-calming-strategies')
    }

    if (performanceData.hintsUsed > 5) {
      suggestions.push('increase-scaffolding')
      suggestions.push('provide-additional-practice')
    }

    return suggestions
  }

  // Calcular nível de suporte para autismo
  calculateAutismSupportLevel(performanceData) {
    let supportLevel = 'moderate'
    let supportScore = 0

    // Avaliar necessidades baseadas na performance
    if (performanceData.accuracy < 0.4) supportScore += 2
    if (performanceData.frustrationLevel > 0.7) supportScore += 2
    if (performanceData.attentionLoss > 0.6) supportScore += 1
    if (performanceData.sensoryOverload) supportScore += 2
    if (performanceData.socialWithdrawal) supportScore += 1

    if (supportScore >= 5) {
      supportLevel = 'high'
    } else if (supportScore >= 3) {
      supportLevel = 'moderate'
    } else {
      supportLevel = 'low'
    }

    return {
      level: supportLevel,
      score: supportScore,
      recommendations: this.getSupportRecommendations(supportLevel),
    }
  }

  // Estimar carga cognitiva
  estimateCognitiveLoad(performanceData) {
    const factors = {
      taskComplexity: performanceData.taskComplexity || 0.5,
      timeSpent: performanceData.timeSpent || 0,
      errorsCommitted: performanceData.errors || 0,
      hintsUsed: performanceData.hintsUsed || 0,
    }

    let cognitiveLoad = factors.taskComplexity

    // Ajustar baseado no tempo gasto
    if (factors.timeSpent > 300) cognitiveLoad += 0.2
    if (factors.timeSpent < 60) cognitiveLoad -= 0.1

    // Ajustar baseado em erros
    cognitiveLoad += factors.errorsCommitted * 0.1

    // Ajustar baseado em dicas usadas
    cognitiveLoad += factors.hintsUsed * 0.05

    return {
      estimated: Math.max(0, Math.min(1, cognitiveLoad)),
      factors,
      recommendation: cognitiveLoad > 0.7 ? 'reduce-complexity' : 'maintain-level',
    }
  }

  // Analisar processamento sensorial
  analyzeSensoryProcessing(performanceData) {
    const analysis = {
      visual: this.analyzeSensoryModality(performanceData, 'visual'),
      auditory: this.analyzeSensoryModality(performanceData, 'auditory'),
      tactile: this.analyzeSensoryModality(performanceData, 'tactile'),
      overall: 'typical',
    }

    // Determinar padrão geral
    const overloadCount = Object.values(analysis).filter((a) => a === 'overload').length
    const seekingCount = Object.values(analysis).filter((a) => a === 'seeking').length

    if (overloadCount >= 2) {
      analysis.overall = 'hypersensitive'
    } else if (seekingCount >= 2) {
      analysis.overall = 'hyposensitive'
    }

    return analysis
  }

  // Avaliar aspectos socioemocionais
  assessSocialEmotionalAspects(performanceData) {
    return {
      emotionalRegulation: this.assessEmotionalRegulation(performanceData),
      socialEngagement: this.assessSocialEngagement(performanceData),
      motivationLevel: this.assessMotivation(performanceData),
      anxietyLevel: this.assessAnxiety(performanceData),
    }
  }

  // Avaliar função executiva
  evaluateExecutiveFunction(performanceData) {
    return {
      workingMemory: this.assessWorkingMemory(performanceData),
      attention: this.assessAttention(performanceData),
      planning: this.assessPlanning(performanceData),
      flexibility: this.assessCognitiveFlexibility(performanceData),
      inhibition: this.assessInhibition(performanceData),
    }
  }

  // Identificar pontos fortes
  identifyStrengths(performanceData) {
    const strengths = []

    if (performanceData.accuracy > 0.8) strengths.push('high-accuracy')
    if (performanceData.persistence > 0.7) strengths.push('task-persistence')
    if (performanceData.speedOfCompletion < 0.5) strengths.push('efficient-processing')
    if (performanceData.creativeSolutions > 0) strengths.push('creative-thinking')
    if (performanceData.selfCorrection > 0.6) strengths.push('self-monitoring')

    return strengths
  }

  // Identificar desafios
  identifyChallenges(performanceData) {
    const challenges = []

    if (performanceData.accuracy < 0.4) challenges.push('accuracy-difficulties')
    if (performanceData.timeSpent > 300) challenges.push('processing-speed')
    if (performanceData.frustrationLevel > 0.7) challenges.push('emotional-regulation')
    if (performanceData.attentionLoss > 0.5) challenges.push('sustained-attention')
    if (performanceData.errors > 5) challenges.push('error-monitoring')

    return challenges
  }

  // Gerar recomendações
  generateRecommendations(performanceData) {
    const recommendations = []
    const challenges = this.identifyChallenges(performanceData)
    const strengths = this.identifyStrengths(performanceData)

    // Recomendações baseadas em desafios
    if (challenges.includes('accuracy-difficulties')) {
      recommendations.push('Increase visual supports and break down tasks into smaller steps')
    }

    if (challenges.includes('processing-speed')) {
      recommendations.push('Allow additional time and reduce time pressure')
    }

    if (challenges.includes('emotional-regulation')) {
      recommendations.push('Implement calming strategies and reduce task demands')
    }

    // Recomendações baseadas em pontos fortes
    if (strengths.includes('creative-thinking')) {
      recommendations.push('Incorporate creative problem-solving opportunities')
    }

    if (strengths.includes('task-persistence')) {
      recommendations.push('Gradually increase task complexity to challenge abilities')
    }

    return recommendations
  }

  // ============== MÉTODOS AUXILIARES DE ANÁLISE COMPLETOS ==============

  calculateProgressionConfidence(performance) {
    let confidence = 0.5

    if (performance.completionRate > 0.8) confidence += 0.2
    if (performance.consistency > 0.7) confidence += 0.2
    if (performance.sessionCount > 5) confidence += 0.1

    return Math.min(1, confidence)
  }

  getSupportRecommendations(level) {
    const recommendations = {
      low: ['maintain-current-supports', 'monitor-progress'],
      moderate: ['increase-visual-supports', 'provide-frequent-breaks', 'simplify-instructions'],
      high: [
        'intensive-support',
        'one-to-one-assistance',
        'modified-activities',
        'frequent-reinforcement',
      ],
    }

    return recommendations[level] || recommendations.moderate
  }

  analyzeSensoryModality(performanceData, modality) {
    const sensitivity = performanceData[`${modality}Sensitivity`] || 0.5
    const reactions = performanceData[`${modality}Reactions`] || []

    if (reactions.includes('overload') || sensitivity > 0.8) return 'overload'
    if (reactions.includes('seeking') || sensitivity < 0.2) return 'seeking'
    return 'typical'
  }

  assessEmotionalRegulation(performanceData) {
    const frustration = performanceData.frustrationLevel || 0
    const recovery = performanceData.emotionalRecovery || 0.5

    if (frustration > 0.7 && recovery < 0.3) return 'poor'
    if (frustration < 0.3 && recovery > 0.7) return 'excellent'
    return 'adequate'
  }

  assessSocialEngagement(performanceData) {
    const engagement = performanceData.socialEngagement || 0.5

    if (engagement > 0.7) return 'high'
    if (engagement < 0.3) return 'low'
    return 'moderate'
  }

  assessMotivation(performanceData) {
    const taskPersistence = performanceData.taskPersistence || 0.5
    const choiceAcceptance = performanceData.choiceAcceptance || 0.5

    return (taskPersistence + choiceAcceptance) / 2
  }

  assessAnxiety(performanceData) {
    const stressIndicators = performanceData.stressIndicators || []
    const avoidanceBehaviors = performanceData.avoidanceBehaviors || []

    const anxietyScore = (stressIndicators.length + avoidanceBehaviors.length) / 10
    return Math.min(1, anxietyScore)
  }

  assessWorkingMemory(performanceData) {
    const memoryTasks = performanceData.memoryTaskPerformance || 0.5
    const multistepCompletion = performanceData.multistepCompletion || 0.5

    return (memoryTasks + multistepCompletion) / 2
  }

  assessAttention(performanceData) {
    const focusTime = performanceData.focusTime || 0
    const distractibility = performanceData.distractibility || 0.5

    const attentionScore = focusTime / 300 - distractibility
    return Math.max(0, Math.min(1, attentionScore))
  }

  assessPlanning(performanceData) {
    const strategicApproach = performanceData.strategicApproach || 0.5
    const organizationSkills = performanceData.organizationSkills || 0.5

    return (strategicApproach + organizationSkills) / 2
  }

  assessCognitiveFlexibility(performanceData) {
    const adaptationToChanges = performanceData.adaptationToChanges || 0.5
    const problemSolvingFlexibility = performanceData.problemSolvingFlexibility || 0.5

    return (adaptationToChanges + problemSolvingFlexibility) / 2
  }

  assessInhibition(performanceData) {
    const impulseControl = performanceData.impulseControl || 0.5
    const errorCorrection = performanceData.errorCorrection || 0.5

    return (impulseControl + errorCorrection) / 2
  }

  /**
   * Obtém parâmetros adaptativos tradicionais para um usuário e jogo.
   * Se integração ML estiver disponível, recomenda usar getAdaptiveParametersWithML.
   * @param {string} userId
   * @param {string} gameId
   * @param {object} sessionData
   * @returns {Promise<object>} Parâmetros adaptativos
   */
  async getAdaptiveParameters(userId, gameId, sessionData = null) {
    // Chave de cache
    const cacheKey = `adaptive_params_${userId}_${gameId}`
    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.isCacheValid(cached, 600000)) {
      return cached
    }

    // Parâmetros padrão caso não haja dados suficientes
    const defaultParams = {
      difficulty: { level: 'MEDIUM', adaptationRate: 0.15 },
      timing: { baseTime: 90, adaptationFactor: 0.25 },
      feedback: { frequency: 'moderate', type: 'visual' },
      support: { scaffoldingLevel: 'moderate' },
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      source: 'default',
    }

    if (!navigator.onLine) {
      // Se offline, tenta localStorage
      const local = this.getLocalData(cacheKey)
      if (local) return local
      return defaultParams
    }

    try {
      return await this.withRetry(async () => {
        // Busca parâmetros do backend
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.adaptiveParameters}/user/${userId}/game/${gameId}`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )
        if (!response.ok) {
          if (response.status === 404) {
            // Não existe, retorna padrão
            this.cache.set(cacheKey, defaultParams, 600000)
            this.setLocalData(cacheKey, defaultParams)
            return defaultParams
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const params = await response.json()
        // Atualiza cache
        this.cache.set(cacheKey, params, 600000)
        this.setLocalData(cacheKey, params)
        return params
      }, 'getAdaptiveParameters')
    } catch (error) {
      logger.error('Erro ao obter parâmetros adaptativos tradicionais', {
        userId,
        gameId,
        error: error.message,
      })
      return defaultParams
    }
  }

  /**
   * Obtém parâmetros adaptativos avançados com Machine Learning para um usuário e jogo.
   * Utiliza algoritmos inteligentes para adaptar a dificuldade e experiência com base no
   * perfil do usuário, histórico de sessões e características de autismo.
   *
   * @param {string} userId - ID do usuário
   * @param {string} gameId - ID do jogo
   * @param {object} sessionData - Dados da sessão atual (opcional)
   * @param {object} options - Opções avançadas
   * @param {boolean} options.useRealTimeAdaptation - Se deve usar adaptação em tempo real
   * @param {string} options.modelVersion - Versão do modelo ML a usar
   * @returns {Promise<object>} Parâmetros adaptativos avançados com ML
   */
  async getAdaptiveParametersWithML(userId, gameId, sessionData = null, options = {}) {
    // Configurações padrão
    const defaultOptions = {
      useRealTimeAdaptation: true,
      modelVersion: 'v2',
      sessionLimit: 10,
      confidenceThreshold: 0.7,
    }

    // Mesclar com opções fornecidas
    const finalOptions = { ...defaultOptions, ...options }

    // Chave de cache adaptativa que inclui versão do modelo
    const cacheKey = `ml_adaptive_params_${userId}_${gameId}_${finalOptions.modelVersion}`

    // Verificar cache com TTL mais curto para adaptação em tempo real
    const cacheTTL = finalOptions.useRealTimeAdaptation ? 300000 : 1800000 // 5 min ou 30 min
    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.isCacheValid(cached, cacheTTL)) {
      return cached
    }

    // Parâmetros padrão caso o ML falhe
    const defaultParams = {
      difficulty: { level: 'MEDIUM', adaptationRate: 0.15 },
      timing: { baseTime: 90, adaptationFactor: 0.25 },
      feedback: { frequency: 'moderate', type: 'visual' },
      support: { scaffoldingLevel: 'moderate' },
      cognitiveScaffolding: { level: 'MEDIUM', autoAdjust: true },
      sensoryAdaptations: {
        visual: { complexity: 'MEDIUM', contrast: 'standard' },
        auditory: { volume: 'MEDIUM', complexity: 'low' },
        haptic: { enabled: false },
      },
      version: '2.0',
      mlEnhanced: true,
      lastUpdated: new Date().toISOString(),
      source: 'ml-default',
    }

    if (!navigator.onLine) {
      // Se offline, tenta localStorage
      const local = this.getLocalData(cacheKey)
      if (local) {
        logger.info('🌟 CLOUD NANDROPHIC: Usando parâmetros ML em cache offline', {
          userId,
          gameId,
        })
        return local
      }
      logger.warn('🚨 CLOUD NANDROPHIC: Offline - usando parâmetros ML padrão', { userId, gameId })
      return defaultParams
    }

    try {
      return await this.withRetry(async () => {
        // 1. Buscar perfil cognitivo do usuário
        const userProfile = await this.getUserCognitiveProfile(userId)

        // 2. Buscar histórico de sessões para análise
        const sessionHistory = await this.getGameSessionsForML(
          userId,
          gameId,
          finalOptions.sessionLimit
        )

        // 3. Preparar payload para o serviço ML
        const mlPayload = {
          userId,
          gameId,
          userProfile,
          sessionHistory,
          currentSession: sessionData || null,
          options: {
            modelVersion: finalOptions.modelVersion,
            realTimeAdaptation: finalOptions.useRealTimeAdaptation,
          },
          deviceContext: {
            type: this.detectDeviceType(),
            capabilities: this.detectDeviceCapabilities(),
            accessibilitySettings: this.detectAccessibilityNeeds(),
          },
        }

        // 4. Chamar API de ML para obtenção de parâmetros adaptativos
        const response = await authenticatedFetch(`${this.apiUrl}/ml/adaptive-parameters`, {
          method: 'POST',
          headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mlPayload),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const mlResult = await response.json()

        // 5. Verificar confiança do modelo e decidir se usa resultado ou valores padrão
        if (mlResult.confidence < finalOptions.confidenceThreshold) {
          logger.warn('🔍 ML: Baixa confiança nas recomendações adaptativas', {
            userId,
            gameId,
            confidence: mlResult.confidence,
            threshold: finalOptions.confidenceThreshold,
          })

          // Se confiança baixa, mesclar com padrões dando mais peso aos padrões
          const mergedParams = this.mergeAdaptiveParams(defaultParams, mlResult.parameters, 0.3)
          mergedParams.source = 'ml-low-confidence-hybrid'

          // Cache com TTL reduzido para tentar novamente em breve
          this.cache.set(cacheKey, mergedParams, 300000) // 5 minutos
          this.setLocalData(cacheKey, mergedParams)

          return mergedParams
        }

        // 6. Processar e enriquecer resultado do ML
        const enhancedParams = {
          ...mlResult.parameters,
          metaData: {
            modelVersion: finalOptions.modelVersion,
            confidence: mlResult.confidence,
            generatedAt: new Date().toISOString(),
            factors: mlResult.influentialFactors || [],
            adaptationHistory: mlResult.adaptationHistory || [],
          },
          source: 'ml-high-confidence',
          lastUpdated: new Date().toISOString(),
        }

        // 7. Salvar no cache e localStorage
        this.cache.set(cacheKey, enhancedParams, cacheTTL)
        this.setLocalData(cacheKey, enhancedParams)

        logger.info('🌟 ML: Parâmetros adaptativos avançados gerados com sucesso', {
          userId,
          gameId,
          confidence: mlResult.confidence,
          difficulty: enhancedParams.difficulty.level,
        })

        return enhancedParams
      }, 'getAdaptiveParametersWithML')
    } catch (error) {
      logger.error('🚨 ML: Erro ao obter parâmetros adaptativos avançados', {
        userId,
        gameId,
        error: error.message,
      })

      // Se falhar, tenta parâmetros tradicionais e depois fallback para defaults
      try {
        const traditionalParams = await this.getAdaptiveParameters(userId, gameId, sessionData)
        traditionalParams.source = 'traditional-fallback'
        return traditionalParams
      } catch (e) {
        return defaultParams
      }
    }
  }

  /**
   * Mescla dois conjuntos de parâmetros adaptativos com peso específico
   * @private
   */
  mergeAdaptiveParams(baseParams, newParams, newParamsWeight = 0.5) {
    // Clone para não modificar os originais
    const result = JSON.parse(JSON.stringify(baseParams))
    const weight = Math.max(0, Math.min(1, newParamsWeight))

    // Mesclar dificuldade
    if (newParams.difficulty) {
      // Converter níveis enum para valores numéricos para interpolação
      const difficultyLevels = {
        VERY_EASY: 1,
        EASY: 2,
        MEDIUM: 3,
        HARD: 4,
        VERY_HARD: 5,
      }

      const baseDiffValue = difficultyLevels[result.difficulty.level] || 3
      const newDiffValue = difficultyLevels[newParams.difficulty.level] || 3

      // Calcular nível ponderado
      const weightedDiffValue = Math.round(baseDiffValue * (1 - weight) + newDiffValue * weight)

      // Converter de volta para string
      const difficultyKeys = Object.keys(difficultyLevels)
      result.difficulty.level =
        difficultyKeys.find((key) => difficultyLevels[key] === weightedDiffValue) || 'MEDIUM'

      // Mesclar taxa de adaptação
      if (typeof newParams.difficulty.adaptationRate === 'number') {
        result.difficulty.adaptationRate =
          result.difficulty.adaptationRate * (1 - weight) +
          newParams.difficulty.adaptationRate * weight
      }
    }

    // Mesclar timing
    if (newParams.timing) {
      if (typeof newParams.timing.baseTime === 'number') {
        result.timing.baseTime = Math.round(
          result.timing.baseTime * (1 - weight) + newParams.timing.baseTime * weight
        )
      }

      if (typeof newParams.timing.adaptationFactor === 'number') {
        result.timing.adaptationFactor =
          result.timing.adaptationFactor * (1 - weight) + newParams.timing.adaptationFactor * weight
      }
    }

    // Mesclar feedback - preferir o mais específico para usuários com autismo
    if (newParams.feedback) {
      if (weight > 0.5) {
        result.feedback.type = newParams.feedback.type || result.feedback.type
        result.feedback.frequency = newParams.feedback.frequency || result.feedback.frequency
      }
    }

    // Mesclar suporte
    if (newParams.support && typeof newParams.support.scaffoldingLevel === 'string') {
      const scaffoldingLevels = {
        minimal: 1,
        light: 2,
        moderate: 3,
        high: 4,
        intensive: 5,
      }

      const baseScaffLevel = scaffoldingLevels[result.support.scaffoldingLevel] || 3
      const newScaffLevel = scaffoldingLevels[newParams.support.scaffoldingLevel] || 3

      const weightedScaffLevel = Math.round(baseScaffLevel * (1 - weight) + newScaffLevel * weight)

      const scaffoldingKeys = Object.keys(scaffoldingLevels)
      result.support.scaffoldingLevel =
        scaffoldingKeys.find((key) => scaffoldingLevels[key] === weightedScaffLevel) || 'moderate'
    }

    // Adicionar parâmetros ML se existirem
    if (newParams.cognitiveScaffolding && weight > 0.3) {
      result.cognitiveScaffolding = newParams.cognitiveScaffolding
    }

    if (newParams.sensoryAdaptations && weight > 0.3) {
      result.sensoryAdaptations = newParams.sensoryAdaptations
    }

    return result
  }

  /**
   * Obtém o perfil cognitivo do usuário para alimentar o algoritmo de ML
   * @private
   */
  async getUserCognitiveProfile(userId) {
    const cacheKey = `cognitive_profile_${userId}`

    // Tentar cache primeiro
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }

    try {
      const response = await authenticatedFetch(
        `${this.apiUrl}${API_CONFIG.ENDPOINTS.cognitiveProfiles}/${userId}`,
        {
          method: 'GET',
          headers: API_CONFIG.DEFAULT_HEADERS,
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          // Criar perfil default baseado em dados disponíveis
          return this.createDefaultCognitiveProfile(userId)
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const profile = await response.json()

      // Armazenar em cache
      this.cache.set(cacheKey, profile, 3600000) // 1 hora

      return profile
    } catch (error) {
      logger.warn('Erro ao obter perfil cognitivo, usando padrão', {
        userId,
        error: error.message,
      })
      return this.createDefaultCognitiveProfile(userId)
    }
  }

  /**
   * Cria um perfil cognitivo padrão quando não há dados suficientes
   * @private
   */
  createDefaultCognitiveProfile(userId) {
    return {
      userId,
      cognitiveAreas: {
        attention: { score: 0.5, confidence: 0.3 },
        memory: { score: 0.5, confidence: 0.3 },
        language: { score: 0.5, confidence: 0.3 },
        executiveFunction: { score: 0.5, confidence: 0.3 },
        socialCognition: { score: 0.5, confidence: 0.3 },
      },
      autismCharacteristics: {
        communicationStyle: 'mixed',
        socialInteraction: 'moderate',
        repetitiveBehaviors: 'moderate',
        sensoryProcessing: 'moderate',
      },
      learningPreferences: {
        visual: true,
        auditory: false,
        kinesthetic: false,
        preferredPace: 'moderate',
      },
      confidence: 0.3,
      lastUpdated: new Date().toISOString(),
      generatedBy: 'system-default',
    }
  }

  /**
   * Obtém histórico de sessões otimizado para análise de ML
   * @private
   */
  async getGameSessionsForML(userId, gameId, limit = 10) {
    try {
      const sessions = await this.getGameSessions(userId, gameId, limit)

      // Extrair apenas os dados relevantes para economizar payload
      return sessions.map((session) => ({
        id: session.id,
        gameId: session.gameId,
        startTime: session.startTime,
        endTime: session.endTime,
        completed: session.completed,
        difficulty: session.difficulty,
        performance: {
          accuracy: session.performance_data?.accuracy || 0,
          timeSpent: session.performance_data?.timeSpent || 0,
          hintsUsed: session.performance_data?.hintsUsed || 0,
          errors: session.performance_data?.errors || 0,
          frustrationLevel: session.performance_data?.frustrationLevel || 0,
        },
        adaptiveParameters: session.adaptiveParameters,
      }))
    } catch (error) {
      logger.warn('Erro ao obter histórico de sessões para ML', {
        userId,
        gameId,
        error: error.message,
      })
      return []
    }
  }
}

// Criar e exportar instância única
const databaseService = new DatabaseService()

// Export default
export default databaseService
