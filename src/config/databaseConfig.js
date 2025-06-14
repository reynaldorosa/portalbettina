/**
 * PORTAL BETINA - CONFIGURAÇÕES DE BANCO DE DADOS UNIFICADAS
 * Sistema centralizado de configuração para DatabaseService
 *
 * @version 2.0.0
 * @created 2025-01-08
 * @purpose Unificar configurações de 5 versões diferentes do DatabaseService
 */

// =====================================================================
// CONFIGURAÇÕES DE CONEXÃO
// =====================================================================

export const CONNECTION_CONFIG = {
  // URLs de API por ambiente
  apiUrl: {
    development: 'http://localhost:3000/api',
    production: process.env.VITE_PRODUCTION_API_URL || 'https://api.betina.com',
    docker: 'http://localhost:3000/api',
  },

  // Configurações de timeout e retry
  timeout: {
    default: 30000, // 30 segundos
    upload: 60000, // 60 segundos para uploads
    download: 45000, // 45 segundos para downloads
  },

  retry: {
    attempts: 3,
    delay: 1000, // 1 segundo entre tentativas
    backoff: 1.5, // Multiplicador de delay
  },

  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client': 'Portal-Betina-Web',
  },
}

// =====================================================================
// CONFIGURAÇÕES DE CACHE
// =====================================================================

export const CACHE_CONFIG = {
  // Configurações gerais de cache
  enabled: true,
  duration: {
    short: 60000, // 1 minuto
    medium: 300000, // 5 minutos
    long: 1800000, // 30 minutos
    extended: 3600000, // 1 hora
  },

  // Tamanhos máximos de cache
  maxSize: {
    memory: 100, // 100 itens em memória
    localStorage: 1000, // 1000 itens no localStorage
    sessionStorage: 500, // 500 itens no sessionStorage
  },

  // Chaves de cache por tipo de dados
  keys: {
    userProfiles: 'betina_user_profiles',
    gameSessions: 'betina_game_sessions',
    gameParameters: 'betina_game_parameters',
    cognitiveProfiles: 'betina_cognitive_profiles',
    offlineQueue: 'betina_offline_queue',
  },
}

// =====================================================================
// CONFIGURAÇÕES DE MODO OFFLINE
// =====================================================================

export const OFFLINE_CONFIG = {
  // Modo offline habilitado
  enabled: true,

  // Configurações de sincronização
  sync: {
    interval: 60000, // 1 minuto
    maxRetries: 5,
    batchSize: 50, // Sincronizar 50 itens por vez
    autoSync: true,
  },

  // Configurações de armazenamento offline
  storage: {
    prefix: 'betina_offline_',
    maxSize: 10485760, // 10MB em bytes
    compression: false, // Compressão desabilitada por simplicidade
    encryption: false, // Criptografia futura
  },

  // Dados que podem ser armazenados offline
  allowedOfflineData: [
    'game_sessions',
    'user_profiles',
    'cognitive_profiles',
    'progress_data',
    'metrics',
  ],

  // Configurações de detecção de conectividade
  connectivity: {
    checkInterval: 30000, // 30 segundos
    endpoint: '/health',
    timeout: 5000, // 5 segundos para health check
  },
}

// =====================================================================
// CONFIGURAÇÕES DE SEGURANÇA
// =====================================================================

export const SECURITY_CONFIG = {
  // Configurações de validação de dados
  validation: {
    maxStringLength: 10000,
    maxArrayLength: 1000,
    maxObjectDepth: 10,
    allowedMimeTypes: ['application/json', 'text/plain'],
  },

  // Configurações de sanitização
  sanitization: {
    htmlEscape: true,
    sqlInjectionProtection: true,
    xssProtection: true,
    maxInputLength: 5000,
  },

  // Configurações de rate limiting (futuro)
  rateLimit: {
    enabled: false,
    maxRequests: 100,
    timeWindow: 60000, // 1 minuto
  },
}

// =====================================================================
// CONFIGURAÇÕES DE LOG E DEBUG
// =====================================================================

export const LOGGING_CONFIG = {
  // Níveis de log
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  },

  // Configuração por ambiente
  environment: {
    development: {
      level: 'debug',
      console: true,
      persist: false,
    },
    production: {
      level: 'warn',
      console: false,
      persist: true,
    },
    docker: {
      level: 'info',
      console: true,
      persist: true,
    },
  },

  // Configurações de persistência de logs
  persistence: {
    maxSize: 1048576, // 1MB
    maxFiles: 5,
    rotateOnSize: true,
  },
}

// =====================================================================
// CONFIGURAÇÕES DE PERFORMANCE
// =====================================================================

export const PERFORMANCE_CONFIG = {
  // Configurações de batching
  batching: {
    enabled: true,
    maxBatchSize: 100,
    maxWaitTime: 5000, // 5 segundos
    autoFlush: true,
  },

  // Configurações de pool de conexões
  connectionPool: {
    maxConnections: 10,
    minConnections: 2,
    idleTimeout: 30000, // 30 segundos
    maxRetries: 3,
  },

  // Configurações de otimização
  optimization: {
    enableCompression: true,
    enableCaching: true,
    enablePrefetch: false,
    lazyLoading: true,
  },
}

// =====================================================================
// CONFIGURAÇÕES ESPECÍFICAS POR FUNCIONALIDADE
// =====================================================================

export const FEATURE_CONFIG = {
  // Configurações para salvamento de sessões de jogo
  gameSessions: {
    autoSave: true,
    saveInterval: 30000, // 30 segundos
    maxHistorySize: 1000,
    compressionEnabled: false,
  },

  // Configurações para perfis cognitivos
  cognitiveProfiles: {
    updateInterval: 300000, // 5 minutos
    minDataPoints: 5,
    maxProfileAge: 2592000000, // 30 dias
    autoUpdateEnabled: true,
  },

  // Configurações para métricas
  metrics: {
    collectionEnabled: true,
    batchSize: 50,
    flushInterval: 60000, // 1 minuto
    maxQueueSize: 1000,
  },

  // Configurações para backup/export
  backup: {
    enabled: true,
    format: 'json',
    compression: false,
    maxFileSize: 10485760, // 10MB
  },
}

// =====================================================================
// CONFIGURAÇÕES DE MODO DE OPERAÇÃO
// =====================================================================

export const OPERATION_MODES = {
  // Modo online completo
  ONLINE: {
    name: 'online',
    description: 'Modo online completo com todas as funcionalidades',
    requiresConnection: true,
    allowsOfflineStorage: true,
    features: ['realtime_sync', 'cloud_backup', 'advanced_analytics'],
  },

  // Modo offline
  OFFLINE: {
    name: 'offline',
    description: 'Modo offline com funcionalidades limitadas',
    requiresConnection: false,
    allowsOfflineStorage: true,
    features: ['local_storage', 'basic_analytics'],
  },

  // Modo híbrido (padrão)
  HYBRID: {
    name: 'hybrid',
    description: 'Modo híbrido que se adapta à conectividade',
    requiresConnection: false,
    allowsOfflineStorage: true,
    features: ['auto_sync', 'offline_queue', 'smart_caching'],
  },
}

// =====================================================================
// FUNÇÕES UTILITÁRIAS DE CONFIGURAÇÃO
// =====================================================================

/**
 * Obtém configuração para o ambiente atual
 * @param {string} environment - Ambiente (development, production, docker)
 * @returns {Object} Configuração completa para o ambiente
 */
export const getEnvironmentConfig = (environment = 'development') => {
  return {
    connection: {
      ...CONNECTION_CONFIG,
      apiUrl: CONNECTION_CONFIG.apiUrl[environment] || CONNECTION_CONFIG.apiUrl.development,
    },
    cache: CACHE_CONFIG,
    offline: OFFLINE_CONFIG,
    security: SECURITY_CONFIG,
    logging: {
      ...LOGGING_CONFIG,
      currentLevel:
        LOGGING_CONFIG.environment[environment] || LOGGING_CONFIG.environment.development,
    },
    performance: PERFORMANCE_CONFIG,
    features: FEATURE_CONFIG,
  }
}

/**
 * Valida se uma configuração é válida
 * @param {Object} config - Configuração a ser validada
 * @returns {Object} Resultado da validação
 */
export const validateConfig = (config) => {
  const errors = []
  const warnings = []

  // Validar configurações obrigatórias
  if (!config.connection?.apiUrl) {
    errors.push('API URL é obrigatória')
  }

  if (!config.cache?.enabled && config.offline?.enabled) {
    warnings.push('Cache desabilitado mas modo offline habilitado pode causar problemas')
  }

  if (config.security?.validation?.maxStringLength < 1000) {
    warnings.push('Limite de string muito baixo pode causar truncamento de dados')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Obtém configuração otimizada para um tipo de uso específico
 * @param {string} useCase - Tipo de uso (therapy, assessment, admin)
 * @returns {Object} Configuração otimizada
 */
export const getOptimizedConfigForUseCase = (useCase) => {
  const baseConfig = getEnvironmentConfig()

  switch (useCase) {
    case 'therapy':
      return {
        ...baseConfig,
        performance: {
          ...baseConfig.performance,
          optimization: {
            ...baseConfig.performance.optimization,
            enablePrefetch: true,
            lazyLoading: false, // Carregar tudo para sessões terapêuticas
          },
        },
        features: {
          ...baseConfig.features,
          gameSessions: {
            ...baseConfig.features.gameSessions,
            saveInterval: 15000, // Salvar mais frequentemente
          },
        },
      }

    case 'assessment':
      return {
        ...baseConfig,
        security: {
          ...baseConfig.security,
          validation: {
            ...baseConfig.security.validation,
            maxStringLength: 50000, // Permitir dados maiores para avaliações
          },
        },
      }

    case 'admin':
      return {
        ...baseConfig,
        logging: {
          ...baseConfig.logging,
          currentLevel: {
            level: 'debug',
            console: true,
            persist: true,
          },
        },
      }

    default:
      return baseConfig
  }
}

// =====================================================================
// CONFIGURAÇÕES DE MIGRAÇÃO E COMPATIBILIDADE
// =====================================================================

export const MIGRATION_CONFIG = {
  // Versões suportadas para migração
  supportedVersions: ['1.0', '1.5', '2.0'],

  // Mapeamentos de chaves antigas para novas
  keyMappings: {
    // DatabaseService legacy
    betina_user_data: 'betina_user_profiles',
    betina_game_data: 'betina_game_sessions',
    betina_settings: 'betina_app_config',
  },

  // Transformações de dados
  dataTransformations: {
    // Converter formato antigo de sessões
    gameSessions: {
      from: { accuracy: 'number' },
      to: { accuracy: 'percentage' },
    },
  },
}

// Exportação principal
export default {
  CONNECTION_CONFIG,
  CACHE_CONFIG,
  OFFLINE_CONFIG,
  SECURITY_CONFIG,
  LOGGING_CONFIG,
  PERFORMANCE_CONFIG,
  FEATURE_CONFIG,
  OPERATION_MODES,
  MIGRATION_CONFIG,
  getEnvironmentConfig,
  validateConfig,
  getOptimizedConfigForUseCase,
}
