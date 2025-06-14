import logger from '../../utils/metrics/performanceMonitor.js'

class DatabaseConfig {
  constructor() {
    this.config = new Map()
    this.listeners = new Map()
    this.validators = new Map()
    this.encrypted = new Set()
    this.loadDefaultConfig()

    logger.info('DatabaseConfig initialized')
  }

  // **Configuração Padrão**
  loadDefaultConfig() {
    const defaults = {
      // Configurações de Conexão
      connection: {
        baseUrl: process.env.BETINA_API_URL || 'https://api.portalbetina.com',
        timeout: 30000,
        retries: 3,
        retryDelay: 1000,
        keepAlive: true,
        pool: {
          min: 2,
          max: 10,
          acquireTimeout: 30000,
          idleTimeout: 300000,
        },
      },

      // Configurações de Cache
      cache: {
        enabled: true,
        maxSize: 1000,
        ttl: 300000, // 5 minutos
        cleanupInterval: 60000,
        compressionThreshold: 1024,
        memoryLimit: 50 * 1024 * 1024, // 50MB
      },

      // Circuit Breaker
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        recoveryTimeout: 30000,
        timeout: 10000,
        halfOpenMaxCalls: 3,
      },

      // Configurações de Segurança
      security: {
        encryption: {
          algorithm: 'AES-256-GCM',
          keyRotationInterval: 24 * 60 * 60 * 1000, // 24 horas
        },
        authentication: {
          tokenExpiry: 3600000, // 1 hora
          refreshThreshold: 300000, // 5 minutos
          maxRetries: 3,
        },
        rateLimit: {
          windowMs: 60000, // 1 minuto
          maxRequests: 100,
          enabled: true,
        },
      },

      // Configurações Específicas do Portal Betina
      betina: {
        autism: {
          // Configurações específicas para crianças autistas
          sensorySettings: {
            enableLowStimulation: true,
            reduceAnimations: true,
            highContrast: false,
            fontSize: 'medium',
          },
          cognitiveSupport: {
            simplifiedInterface: true,
            visualCues: true,
            audioSupport: true,
            predictiveText: true,
          },
          accessibility: {
            screenReader: true,
            keyboardNavigation: true,
            focusIndicators: true,
            skipLinks: true,
          },
        },
        therapy: {
          sessionDuration: 30, // minutos
          breakInterval: 5, // minutos
          adaptiveSettings: true,
          progressTracking: true,
          parentReports: true,
        },
        analytics: {
          behaviorTracking: true,
          progressMetrics: true,
          anonymizeData: true,
          retentionDays: 90,
        },
      },

      // Performance e Monitoramento
      performance: {
        monitoring: {
          enabled: true,
          sampleRate: 0.1, // 10% das requisições
          metricsInterval: 60000,
        },
        optimization: {
          lazyLoading: true,
          prefetching: true,
          compression: true,
          caching: true,
        },
      },

      // Configurações de Log
      logging: {
        level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
        format: 'json',
        maxFiles: 10,
        maxSize: '10MB',
        categories: {
          database: true,
          cache: true,
          auth: true,
          performance: true,
          errors: true,
        },
      },

      // Configurações de Desenvolvimento
      development: {
        mockData: process.env.NODE_ENV !== 'production',
        debugMode: process.env.NODE_ENV === 'development',
        hotReload: true,
        sourceMap: true,
      },
    }

    // Aplicar configurações padrão
    Object.entries(defaults).forEach(([key, value]) => {
      this.set(key, value)
    })

    // Configurar validadores padrão
    this.setupDefaultValidators()
  }

  // **Operações Básicas**
  set(key, value, options = {}) {
    try {
      const { validate = true, encrypt = false, notify = true } = options

      // Validação
      if (validate && this.validators.has(key)) {
        const validator = this.validators.get(key)
        const isValid = validator(value)
        if (!isValid) {
          throw new Error(`Invalid value for configuration key: ${key}`)
        }
      }

      // Criptografia
      let processedValue = value
      if (encrypt) {
        processedValue = this.encrypt(value)
        this.encrypted.add(key)
      }

      // Valor anterior para comparação
      const oldValue = this.config.get(key)

      // Definir novo valor
      this.config.set(key, processedValue)

      // Notificar listeners
      if (notify && oldValue !== processedValue) {
        this.notifyListeners(key, processedValue, oldValue)
      }

      logger.debug('Configuration set', {
        key,
        encrypted: encrypt,
        hasListeners: this.listeners.has(key),
      })

      return true
    } catch (error) {
      logger.error('Error setting configuration', {
        key,
        error: error.message,
      })
      return false
    }
  }

  get(key, defaultValue = null) {
    try {
      let value = this.config.get(key)

      if (value === undefined) {
        return defaultValue
      }

      // Descriptografar se necessário
      if (this.encrypted.has(key)) {
        value = this.decrypt(value)
      }

      return value
    } catch (error) {
      logger.error('Error getting configuration', {
        key,
        error: error.message,
      })
      return defaultValue
    }
  }

  has(key) {
    return this.config.has(key)
  }

  delete(key) {
    const deleted = this.config.delete(key)
    this.encrypted.delete(key)

    if (deleted) {
      this.notifyListeners(key, undefined, this.config.get(key))
      logger.debug('Configuration deleted', { key })
    }

    return deleted
  }

  // **Configuração Aninhada**
  getNestedConfig(path, defaultValue = null) {
    const keys = path.split('.')
    let current = this.config

    for (const key of keys) {
      if (current instanceof Map) {
        current = current.get(key)
      } else if (typeof current === 'object' && current !== null) {
        current = current[key]
      } else {
        return defaultValue
      }

      if (current === undefined) {
        return defaultValue
      }
    }

    return current
  }

  setNestedConfig(path, value, options = {}) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = null

    // Navegar até o objeto pai
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if (i === 0) {
        current = this.config.get(key) || {}
        if (typeof current !== 'object') {
          current = {}
        }
      } else {
        if (typeof current[key] !== 'object') {
          current[key] = {}
        }
        current = current[key]
      }
    }

    // Definir o valor
    if (current && typeof current === 'object') {
      current[lastKey] = value
      this.set(keys[0], this.config.get(keys[0]), options)
      return true
    }

    return false
  }

  // **Validação**
  setupDefaultValidators() {
    // Validador para configurações de conexão
    this.addValidator('connection', (value) => {
      return (
        value &&
        typeof value === 'object' &&
        typeof value.baseUrl === 'string' &&
        typeof value.timeout === 'number' &&
        value.timeout > 0
      )
    })

    // Validador para configurações de cache
    this.addValidator('cache', (value) => {
      return (
        value &&
        typeof value === 'object' &&
        typeof value.maxSize === 'number' &&
        value.maxSize > 0 &&
        typeof value.ttl === 'number' &&
        value.ttl > 0
      )
    })

    // Validador para configurações de segurança
    this.addValidator('security', (value) => {
      return (
        value &&
        typeof value === 'object' &&
        value.authentication &&
        typeof value.authentication.tokenExpiry === 'number'
      )
    })
  }

  addValidator(key, validator) {
    if (typeof validator !== 'function') {
      throw new Error('Validator must be a function')
    }

    this.validators.set(key, validator)
    logger.debug('Validator added', { key })
  }

  removeValidator(key) {
    return this.validators.delete(key)
  }

  // **Sistema de Listeners**
  onChange(key, listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }

    this.listeners.get(key).add(listener)

    // Retornar função de cleanup
    return () => {
      const keyListeners = this.listeners.get(key)
      if (keyListeners) {
        keyListeners.delete(listener)
        if (keyListeners.size === 0) {
          this.listeners.delete(key)
        }
      }
    }
  }

  notifyListeners(key, newValue, oldValue) {
    const keyListeners = this.listeners.get(key)
    if (keyListeners) {
      keyListeners.forEach((listener) => {
        try {
          listener(newValue, oldValue, key)
        } catch (error) {
          logger.error('Error in config change listener', {
            key,
            error: error.message,
          })
        }
      })
    }
  }

  // **Configurações Específicas do Portal Betina**
  getAutismConfig() {
    return this.getNestedConfig('betina.autism', {})
  }

  updateAutismConfig(updates) {
    const current = this.getAutismConfig()
    const merged = { ...current, ...updates }
    return this.setNestedConfig('betina.autism', merged)
  }

  getTherapyConfig() {
    return this.getNestedConfig('betina.therapy', {})
  }

  updateTherapyConfig(updates) {
    const current = this.getTherapyConfig()
    const merged = { ...current, ...updates }
    return this.setNestedConfig('betina.therapy', merged)
  }

  getAccessibilityConfig() {
    return this.getNestedConfig('betina.autism.accessibility', {})
  }

  updateAccessibilityConfig(updates) {
    const current = this.getAccessibilityConfig()
    const merged = { ...current, ...updates }
    return this.setNestedConfig('betina.autism.accessibility', merged)
  }

  // **Persistência e Sincronização**
  export() {
    const exportData = {}

    for (const [key, value] of this.config.entries()) {
      if (!this.encrypted.has(key)) {
        exportData[key] = value
      } else {
        exportData[key] = '[ENCRYPTED]'
      }
    }

    return {
      config: exportData,
      timestamp: Date.now(),
      version: '1.0.0',
    }
  }

  import(data, options = {}) {
    const { merge = true, validate = true } = options

    try {
      if (!merge) {
        this.config.clear()
        this.encrypted.clear()
      }

      Object.entries(data.config || data).forEach(([key, value]) => {
        if (value !== '[ENCRYPTED]') {
          this.set(key, value, { validate, notify: false })
        }
      })

      logger.info('Configuration imported', {
        keys: Object.keys(data.config || data).length,
        merge,
      })

      return true
    } catch (error) {
      logger.error('Error importing configuration', {
        error: error.message,
      })
      return false
    }
  }

  // **Criptografia Simples**
  encrypt(value) {
    // Implementação simples - em produção usar crypto real
    return Buffer.from(JSON.stringify(value)).toString('base64')
  }

  decrypt(encryptedValue) {
    try {
      return JSON.parse(Buffer.from(encryptedValue, 'base64').toString())
    } catch (error) {
      logger.error('Decryption error', { error: error.message })
      return null
    }
  }

  // **Configuração de Ambiente**
  loadFromEnvironment() {
    const envMappings = {
      BETINA_API_URL: 'connection.baseUrl',
      BETINA_CACHE_SIZE: 'cache.maxSize',
      BETINA_CACHE_TTL: 'cache.ttl',
      BETINA_DEBUG: 'development.debugMode',
      BETINA_LOG_LEVEL: 'logging.level',
    }

    Object.entries(envMappings).forEach(([envKey, configPath]) => {
      const envValue = process.env[envKey]
      if (envValue !== undefined) {
        let processedValue = envValue

        // Tentar converter tipos
        if (envValue === 'true') processedValue = true
        else if (envValue === 'false') processedValue = false
        else if (!isNaN(envValue)) processedValue = Number(envValue)

        this.setNestedConfig(configPath, processedValue, { notify: false })
      }
    })

    logger.info('Environment configuration loaded')
  }

  // **Utilitários**
  getAllKeys() {
    return Array.from(this.config.keys())
  }

  getSize() {
    return this.config.size
  }

  clear() {
    this.config.clear()
    this.encrypted.clear()
    this.loadDefaultConfig()
    logger.info('Configuration cleared and reset to defaults')
  }

  validate() {
    const errors = []

    for (const [key, validator] of this.validators.entries()) {
      const value = this.config.get(key)
      try {
        if (!validator(value)) {
          errors.push(`Invalid configuration for key: ${key}`)
        }
      } catch (error) {
        errors.push(`Validation error for key ${key}: ${error.message}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // **Cleanup**
  destroy() {
    this.config.clear()
    this.listeners.clear()
    this.validators.clear()
    this.encrypted.clear()
    logger.info('DatabaseConfig destroyed')
  }
}

// Singleton pattern
let instance = null

export const getDatabaseConfig = () => {
  if (!instance) {
    instance = new DatabaseConfig()
    instance.loadFromEnvironment()
  }
  return instance
}

export default DatabaseConfig
