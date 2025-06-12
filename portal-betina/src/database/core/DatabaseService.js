/**
 * @file DatabaseService.js
 * @description Núcleo do serviço de banco de dados - Portal Betina
 * Ponto de entrada unificado para todas as funcionalidades do banco de dados
 * com foco em suporte terapêutico para crianças autistas.
 */

import performanceMonitor from '../../utils/metrics/performanceMonitor.js'
import { PortalBetinaUtils } from '../../utils/index.js'
import DatabaseConnection from './DatabaseConnection.js'
import IntelligentCache from './IntelligentCache.js'
import CircuitBreaker from './CircuitBreaker.js'
import { databaseConfig } from '../../config/database.js'
import PluginManager from '../plugins/PluginManager.js'

class DatabaseService {
  constructor(config = {}) {
    this.config = { ...databaseConfig, ...config }
    this.logger = performanceMonitor
    this.localStoragePrefix = this.config.core.LOCAL_STORAGE_PREFIX

    // Inicializar sistema de utils integrado
    this.utils = new PortalBetinaUtils(this.config)

    // Inicializar componentes do núcleo
    this.connection = new DatabaseConnection(this.config.connection)
    this.cache = new IntelligentCache(this.config.cache)
    this.circuitBreaker = new CircuitBreaker(this.config.circuitBreaker)

    // Inicializar gerenciador de plugins/módulos
    this.pluginManager = new PluginManager(this)

    // Status de inicialização    this.initialized = false
    this.modules = new Map()

    this.logger.info('DatabaseService core initialized', {
      config: this.config,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * @method initialize
   * @async
   * @description Inicializa o serviço de banco de dados e todos os módulos ativos
   * @returns {Promise<boolean>} Sucesso da inicialização
   */
  async initialize() {
    try {
      this.logger.info('🌟 Initializing Portal Betina Database Service...')

      // Inicializar sistema de utils primeiro
      await this.utils.initialize()

      // Verificar conectividade
      await this.connection.checkHealth()

      // Carregar módulos ativos baseado na configuração
      await this.loadActiveModules()

      // Inicializar módulos carregados
      await this.initializeModules()

      this.initialized = true
      this.logger.info('✅ Portal Betina Database Service initialized successfully')
      return true
    } catch (error) {
      this.logger.error('❌ Failed to initialize DatabaseService', {
        error: error.message,
        stack: error.stack,
      })
      return false
    }
  }

  /**
   * @method loadActiveModules
   * @async
   * @description Carrega módulos ativos baseado na configuração
   */
  async loadActiveModules() {
    const activeModules = this.config.modules || {}

    for (const [moduleName, moduleConfig] of Object.entries(activeModules)) {
      if (moduleConfig.enabled) {
        try {
          await this.pluginManager.loadModule(moduleName, moduleConfig)
          this.logger.info(`📦 Module ${moduleName} loaded successfully`)
        } catch (error) {
          this.logger.error(`❌ Failed to load module ${moduleName}`, {
            error: error.message,
          })
        }
      }
    }
  }

  /**
   * @method initializeModules
   * @async
   * @description Inicializa todos os módulos carregados
   */
  async initializeModules() {
    const modulePromises = []

    for (const [moduleName, module] of this.modules) {
      if (module.initialize) {
        modulePromises.push(
          module.initialize().catch((error) => {
            this.logger.error(`❌ Failed to initialize module ${moduleName}`, {
              error: error.message,
            })
          })
        )
      }
    }

    await Promise.allSettled(modulePromises)
  }

  /**
   * @method registerModule
   * @description Registra um módulo no serviço
   * @param {string} name - Nome do módulo
   * @param {Object} module - Instância do módulo
   */
  registerModule(name, module) {
    this.modules.set(name, module)
    this.logger.info(`🔌 Module ${name} registered`)
  }

  /**
   * @method getModule
   * @description Obtém um módulo registrado
   * @param {string} name - Nome do módulo
   * @returns {Object|null} Instância do módulo ou null
   */
  getModule(name) {
    return this.modules.get(name) || null
  }

  // ============== DELEGAÇÃO PARA MÓDULOS ==============

  /**
   * @method withRetry
   * @async
   * @description Executa uma função com retries e backoff exponencial
   * @param {Function} fn - Função a ser executada
   * @param {string} context - Contexto da operação
   * @returns {Promise<*>} Resultado da função
   */
  async withRetry(fn, context = 'operation') {
    return this.circuitBreaker.execute(async () => {
      let lastError
      const maxAttempts = this.config.retry?.attempts || 3
      const baseDelay = this.config.retry?.delay || 1000

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn()
        } catch (error) {
          lastError = error

          if (attempt === maxAttempts) {
            this.logger.error(`❌ ${context} failed after ${maxAttempts} attempts`, {
              error: error.message,
              attempts: maxAttempts,
            })
            throw error
          }

          const delay = baseDelay * Math.pow(2, attempt - 1)
          this.logger.warn(`⚠️ ${context} attempt ${attempt} failed, retrying in ${delay}ms`, {
            error: error.message,
            attempt,
            delay,
          })

          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      throw lastError
    })
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
    return this.connection.authenticatedFetch(url, options)
  }

  // ============== MÉTODOS DE CACHE ==============

  /**
   * @method setLocalData
   * @description Armazena dados no localStorage
   * @param {string} key - Chave do armazenamento
   * @param {*} data - Dados a serem armazenados
   * @param {Object} options - Opções adicionais
   * @returns {boolean} Sucesso da operação
   */
  setLocalData(key, data, options = {}) {
    try {
      const prefixedKey = `${this.localStoragePrefix}${key}`
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: this.config.version || '1.0',
      })

      localStorage.setItem(prefixedKey, serializedData)
      return true
    } catch (error) {
      this.logger.error('Failed to save to localStorage', {
        key,
        error: error.message,
      })
      return false
    }
  }

  /**
   * @method getLocalData
   * @description Recupera dados do localStorage
   * @param {string} key - Chave do armazenamento
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Dados recuperados ou valor padrão
   */
  getLocalData(key, defaultValue = null) {
    try {
      const prefixedKey = `${this.localStoragePrefix}${key}`
      const stored = localStorage.getItem(prefixedKey)

      if (!stored) return defaultValue

      const parsed = JSON.parse(stored)
      return parsed.data || defaultValue
    } catch (error) {
      this.logger.error('Failed to retrieve from localStorage', {
        key,
        error: error.message,
      })
      return defaultValue
    }
  }

  // ============== MÉTODOS DE STATUS E DIAGNÓSTICO ==============

  /**
   * @method getServiceStatus
   * @description Obtém status detalhado do serviço
   * @returns {Object} Status completo do serviço
   */
  getServiceStatus() {
    const moduleStatus = {}
    for (const [name, module] of this.modules) {
      moduleStatus[name] = {
        loaded: true,
        ready: module.isReady ? module.isReady() : true,
        lastActivity: module.lastActivity || null,
      }
    }

    return {
      initialized: this.initialized,
      online: navigator.onLine,
      connection: this.connection.getStatus(),
      circuitBreaker: this.circuitBreaker.getState(),
      cache: this.cache.getStats(),
      modules: moduleStatus,
      timestamp: new Date().toISOString(),
      version: this.config.version || '1.0',
    }
  }

  /**
   * @method clearAllCaches
   * @description Limpa todos os caches do sistema
   */
  clearAllCaches() {
    this.cache.clear()

    // Limpar localStorage relacionado
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.localStoragePrefix)) {
        localStorage.removeItem(key)
      }
    })

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
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        version: this.config.version || '1.0',
        data: {},
      }

      // Coletar dados de todos os módulos que suportam exportação
      for (const [moduleName, module] of this.modules) {
        if (module.exportUserData) {
          try {
            exportData.data[moduleName] = await module.exportUserData(userId)
          } catch (error) {
            this.logger.error(`Failed to export data from module ${moduleName}`, {
              userId,
              error: error.message,
            })
          }
        }
      }

      return exportData
    } catch (error) {
      this.logger.error('Failed to export user data', {
        userId,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method shutdown
   * @async
   * @description Encerra o serviço graciosamente
   */
  async shutdown() {
    this.logger.info('🔄 Shutting down DatabaseService...')

    // Encerrar módulos
    for (const [moduleName, module] of this.modules) {
      if (module.shutdown) {
        try {
          await module.shutdown()
          this.logger.info(`✅ Module ${moduleName} shutdown completed`)
        } catch (error) {
          this.logger.error(`❌ Failed to shutdown module ${moduleName}`, {
            error: error.message,
          })
        }
      }
    } // Encerrar conexão
    await this.connection.close()

    // Encerrar sistema de utils
    await this.utils.shutdown()

    this.initialized = false
    this.logger.info('✅ DatabaseService shutdown completed')
  }

  // **Métodos de Acesso aos Serviços de Utils**

  /**
   * @method getSessionService
   * @returns {SessionService} Serviço de gerenciamento de sessões
   */
  getSessionService() {
    return this.utils.sessions
  }

  /**
   * @method getTherapyOptimizer
   * @returns {TherapyOptimizer} Sistema de otimização terapêutica
   */
  getTherapyOptimizer() {
    return this.utils.therapy
  }

  /**
   * @method getMetricsManager
   * @returns {MetricsManager} Gerenciador de métricas
   */
  getMetricsManager() {
    return this.utils.metrics
  }

  /**
   * @method getCognitiveAnalyzer
   * @returns {CognitiveAnalyzer} Analisador cognitivo
   */
  getCognitiveAnalyzer() {
    return this.utils.cognitive
  }

  /**
   * @method getAdaptiveSystem
   * @returns {AdaptiveSystem} Sistema adaptativo
   */
  getAdaptiveSystem() {
    return this.utils.adaptive
  }

  /**
   * @method getAccessibilityService
   * @returns {AccessibilityService} Serviços de acessibilidade
   */
  getAccessibilityService() {
    return this.utils.accessibility
  }
}

export default DatabaseService
