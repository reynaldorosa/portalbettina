/**
 * @file DatabaseConnection.js
 * @description Gerenciamento de conexão com APIs e autenticação
 */

// Importamos o logger centralizado em vez do performanceMonitor
import sharedLogger from '../../utils/logger.js'
// Ainda podemos usar o monitor para métricas de performance
import performanceMonitor from '../../utils/metrics/performanceMonitor.js'

// Definimos o logger para uso local
const logger = sharedLogger

class DatabaseConnection {
  constructor(config = {}) {    this.config = {
      baseUrl: 'http://localhost:3000/api',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...config,
    }

    this.authService = null // Será injetado
    this.connectionState = 'disconnected'
    this.lastHealthCheck = null

    logger.info('DatabaseConnection initialized', {
      baseUrl: this.config.baseUrl,
    })
  }

  /**
   * @method setAuthService
   * @description Define o serviço de autenticação
   * @param {Object} authService - Serviço de autenticação
   */
  setAuthService(authService) {
    this.authService = authService
    logger.info('Auth service configured for DatabaseConnection')
  }

  /**
   * @method checkHealth
   * @async
   * @description Verifica a saúde da conexão com a API
   * @returns {Promise<boolean>} Status da conexão
   */
  async checkHealth() {
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection')
      }

      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        headers: this.config.headers,
        signal: AbortSignal.timeout(this.config.timeout),
      })

      if (response.ok) {
        this.connectionState = 'connected'
        this.lastHealthCheck = new Date().toISOString()
        logger.info('✅ Database connection healthy')
        return true
      } else {
        throw new Error(`Health check failed: ${response.status}`)
      }
    } catch (error) {
      this.connectionState = 'error'
      logger.error('❌ Database connection health check failed', {
        error: error.message,
      })

      // Para desenvolvimento/fallback, não falhar completamente
      if (this.config.fallbackMode) {
        logger.warn('⚠️ Running in fallback mode')
        return true
      }

      throw error
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
    // Preparar headers com autenticação
    const headers = {
      ...this.config.headers,
      ...options.headers,
    }

    // Adicionar token de autenticação se disponível
    if (this.authService && this.authService.getToken) {
      const token = this.authService.getToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    // Preparar URL completa
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`

    // Configurar opções da requisição
    const fetchOptions = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.config.timeout),
    }

    try {
      logger.debug('Making authenticated request', {
        url: fullUrl,
        method: options.method || 'GET',
      })

      const response = await fetch(fullUrl, fetchOptions)

      // Log da resposta
      logger.debug('Request completed', {
        url: fullUrl,
        status: response.status,
        ok: response.ok,
      })

      return response
    } catch (error) {
      logger.error('Authenticated fetch failed', {
        url: fullUrl,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method createAnonymousUser
   * @async
   * @description Cria um usuário anônimo
   * @returns {Promise<Object>} Dados do usuário criado
   */
  async createAnonymousUser() {
    try {
      if (this.authService && this.authService.createAnonymousUser) {
        return await this.authService.createAnonymousUser()
      }

      // Fallback para criação local
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const userData = {
        userId,
        user: {
          id: userId,
          is_anonymous: true,
          created_at: new Date().toISOString(),
        },
      }

      logger.info('Created anonymous user (fallback)', { userId })
      return userData
    } catch (error) {
      logger.error('Failed to create anonymous user', {
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method getStatus
   * @description Obtém status da conexão
   * @returns {Object} Status da conexão
   */
  getStatus() {
    return {
      state: this.connectionState,
      baseUrl: this.config.baseUrl,
      lastHealthCheck: this.lastHealthCheck,
      online: navigator.onLine,
      authenticated: this.authService ? this.authService.isAuthenticated() : false,
    }
  }

  /**
   * @method close
   * @async
   * @description Encerra a conexão
   */
  async close() {
    this.connectionState = 'disconnected'
    logger.info('DatabaseConnection closed')
  }
}

export default DatabaseConnection
