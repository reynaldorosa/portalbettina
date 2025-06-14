/**
 * @file database.js
 * @description Configuração avançada do sistema de banco de dados
 * Baseada no arquivo BKP com funcionalidades completas para Portal Betina
 */

export const databaseConfig = {  // Configuração do núcleo
  core: {
    LOCAL_STORAGE_PREFIX: 'portal_betina_',
    VERSION: '2.1.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    DEBUG_MODE: process.env.DEBUG === 'true',
    fallbackMode: process.env.NODE_ENV === 'development' || process.env.FALLBACK_MODE === 'true',
  },
  // Configuração de conexão
  connection: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    healthCheckInterval: 60000,
    enableConnectionPooling: true,
    enableRequestDeduplication: true,
    enableAdaptiveTimeout: true,
    enableOfflineSupport: true,
    maxConnections: 10,
    connectionTimeout: 15000,

    // Headers padrão
    defaultHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Client-Version': '2.1.0',
      'X-Client-Type': 'portal-betina',
    },

    // Endpoints da API
    endpoints: {
      health: '/health',
      users: '/users',
      sessions: '/game-sessions',
      adaptiveParameters: '/adaptive-parameters',
      cognitiveProfiles: '/cognitive-profiles',
      progress: '/progress',
      accessibility: '/accessibility',
      metrics: '/metrics',
      analytics: '/analytics',
    },
  },

  // Configuração do cache
  cache: {
    defaultTTL: 300000, // 5 minutos
    maxSize: 1000,
    compressionThreshold: 10000, // 10KB
    cleanupInterval: 60000, // 1 minuto
    enableStatistics: true,
    enableCompression: true,
    enableSmartEviction: true,
    enablePredictiveLoading: true,

    // Estratégias de eviction
    evictionStrategy: 'adaptive', // lru, lfu, adaptive

    // TTLs específicos por tipo de dados
    ttlByType: {
      users: 1800000, // 30 minutos
      sessions: 900000, // 15 minutos
      adaptiveParams: 600000, // 10 minutos
      cognitiveProfiles: 3600000, // 1 hora
      accessibility: 7200000, // 2 horas
      metrics: 300000, // 5 minutos
    },
  },

  // Configuração do Circuit Breaker
  circuitBreaker: {
    failureThreshold: 5,
    timeout: 60000,
    retryTimeout: 10000,
    halfOpenMaxCalls: 3,
    monitor: true,
    adaptiveTimeout: true,
    maxTimeout: 120000,
    minTimeout: 5000,

    // Configurações específicas por contexto
    contextConfig: {
      'user-operations': {
        failureThreshold: 3,
        timeout: 30000,
      },
      'session-operations': {
        failureThreshold: 7,
        timeout: 45000,
      },
      'analytics-operations': {
        failureThreshold: 10,
        timeout: 90000,
      },
    },
  },
  modules: {
    enabled: ['cognitive', 'adaptive', 'sessions', 'accessibility', 'therapy', 'storage'],

    // Configurações específicas por módulo
    cognitive: {
      enabled: true,
      utils: ['neuropedagogicalInsights', 'multisensoryMetrics'],
      analysisInterval: 5000, // 5 segundos
      confidenceThreshold: 0.6,
    },

    adaptive: {
      enabled: true,
      utils: ['adaptiveML', 'advancedRecommendations'],
      updateInterval: 10000, // 10 segundos
      historySize: 10,
      mlThresholds: {
        easyToMedium: 0.7,
        mediumToHard: 0.8,
        hardToMedium: 0.4,
        mediumToEasy: 0.3,
      },
    },

    sessions: {
      enabled: true,
      utils: ['progressReports', 'dashboardNeuropedagogicalIntegration'],
      autoSave: true,
      saveInterval: 30000, // 30 segundos
      maxSessionLength: 3600000, // 1 hora
    },

    accessibility: {
      enabled: true,
      utils: ['accessibility', 'ttsManager', 'ttsDebug'],
      autoDetect: true,
      defaultSettings: {
        ttsEnabled: true,
        highContrast: false,
        reducedMotion: false,
        largeText: false,
      },
    },

    therapy: {
      enabled: true,
      integrations: ['cognitive', 'adaptive', 'sessions'],
      autismSupport: true,
      realTimeOptimizations: true,
      recommendationEngine: true,
    },

    storage: {
      enabled: true,
      utils: ['globalNeuropedagogicalDatabase'],
      localStorageEnabled: true,
      cloudSync: true,
      syncInterval: 300000, // 5 minutos
      maxRetries: 3,
    },
  },

  // API Endpoints
  API_CONFIG: {
    TIMEOUT: 10000,
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ENDPOINTS: {
      users: '/users',
      sessions: '/sessions',
      adaptiveParameters: '/adaptive-parameters',
      accessibility: '/accessibility',
      therapy: '/therapy',
      metrics: '/metrics',
    },
  },

  // Configuração dos módulos
  modules: {
    // Módulo de cache avançado
    cache: {
      enabled: true,
      priority: 0,
      lazy: false,
      config: {
        enableIntelligentPrefetch: true,
        enableCompressionAnalysis: true,
        enableAccessPatternLearning: true,
      },
    },

    // Módulo de métricas
    metrics: {
      enabled: true,
      priority: 1,
      lazy: false,
      config: {
        enableRealTimeMetrics: true,
        enablePerformanceMonitoring: true,
        enableUserBehaviorTracking: true,
        metricsInterval: 30000,
      },
    },

    // Módulo de acessibilidade
    accessibility: {
      enabled: true,
      priority: 1,
      lazy: false,
      config: {
        enableAutoDetection: true,
        enableAdaptiveUI: true,
        enableTherapyOptimization: true,
        enableAutismSupport: true,
      },
    },

    // Módulo de usuários
    users: {
      enabled: true,
      priority: 2,
      lazy: true,
      config: {
        enableCognitiveProfileAnalysis: true,
        enableBehavioralPatternDetection: true,
        enableAdaptiveLearning: true,
        enableProgressTracking: true,
      },
    },

    // Módulo de sessões
    sessions: {
      enabled: true,
      priority: 2,
      lazy: true,
      config: {
        enableRealTimeAnalysis: true,
        enableTherapyInsights: true,
        enableAdaptiveAdjustments: true,
        enablePerformanceOptimization: true,
        sessionAnalysisDepth: 'comprehensive',
      },
    },

    // Módulo de parâmetros adaptativos
    adaptive: {
      enabled: true,
      priority: 3,
      lazy: true,
      config: {
        enableMachineLearning: true,
        enableRealTimeOptimization: true,
        enablePredictiveModeling: true,
        adaptationSensitivity: 'high',
        learningRate: 0.1,
      },
    },

    // Módulo de perfis cognitivos
    cognitive: {
      enabled: true,
      priority: 3,
      lazy: true,
      config: {
        enableDeepAnalysis: true,
        enableNeurodiversitySupport: true,
        enableAutismSpecificAnalysis: true,
        enableLongitudinalTracking: true,
        analysisComplexity: 'advanced',
      },
    },

    // Módulo de análise de progresso
    progress: {
      enabled: true,
      priority: 4,
      lazy: true,
      config: {
        enablePredictiveAnalytics: true,
        enableMultiDimensionalAnalysis: true,
        enableTherapyRecommendations: true,
        enableParentReporting: true,
        analysisFrequency: 'real-time',
      },
    },
  },

  // Configuração de retry
  retry: {
    attempts: 3,
    delay: 1000,
    backoffFactor: 2,
    maxDelay: 10000,
    enableJitter: true,

    // Configurações específicas por tipo de operação
    operationConfig: {
      read: {
        attempts: 5,
        delay: 500,
      },
      write: {
        attempts: 3,
        delay: 1000,
      },
      analysis: {
        attempts: 2,
        delay: 2000,
      },
    },
  },

  // Configuração de performance
  performance: {
    enableMonitoring: true,
    enableOptimization: true,
    enableCaching: true,
    enableProfiling: process.env.NODE_ENV === 'development',

    // Métricas de performance
    metrics: {
      enableLatencyTracking: true,
      enableThroughputTracking: true,
      enableErrorRateTracking: true,
      enableResourceUsageTracking: true,
      samplingRate: 0.1, // 10% das operações
    },

    // Limites de performance
    limits: {
      maxResponseTime: 5000,
      maxConcurrentOperations: 50,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      maxCacheSize: 50 * 1024 * 1024, // 50MB
    },
  },

  // Configuração específica para autismo
  autism: {
    enableSpecializedSupport: true,
    enableSensoryAdaptations: true,
    enableCommunicationSupport: true,
    enableBehavioralAnalysis: true,
    enableExecutiveFunctionSupport: true,

    // Configurações sensoriais
    sensorySupport: {
      enableVisualAdaptations: true,
      enableAuditoryAdaptations: true,
      enableTactileAdaptations: true,
      enableVestibularSupport: true,
      enableProprioceptiveSupport: true,
    },

    // Configurações de comunicação
    communicationSupport: {
      enableAAC: true, // Augmentative and Alternative Communication
      enableVisualSchedules: true,
      enableSocialStories: true,
      enablePictureSupports: true,
      enableGestureRecognition: true,
    },

    // Configurações comportamentais
    behavioralSupport: {
      enableSelfRegulationTools: true,
      enableCalmingStrategies: true,
      enableTransitionSupport: true,
      enableRoutineSupport: true,
      enableChoiceProvision: true,
    },
  },

  // Configuração de terapia
  therapy: {
    enableTherapeuticAnalysis: true,
    enablePersonalizedInterventions: true,
    enableProgressTracking: true,
    enableGoalSetting: true,
    enableDataDrivenDecisions: true,

    // Tipos de terapia suportados
    supportedTherapies: [
      'ABA', // Applied Behavior Analysis
      'TEACCH', // Treatment and Education of Autistic and related Communication-handicapped Children
      'PECS', // Picture Exchange Communication System
      'RDI', // Relationship Development Intervention
      'DIR', // Developmental, Individual-differences, Relationship-based
      'ESDM', // Early Start Denver Model
    ],

    // Configurações de análise
    analysis: {
      enableRealTimeAnalysis: true,
      enablePredictiveModeling: true,
      enableOutcomeTracking: true,
      enableInterventionOptimization: true,
      analysisDepth: 'comprehensive',
    },
  },

  // Configuração de desenvolvimento
  development: {
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableVerboseLogging: process.env.DEBUG === 'true',
    enableMockData: process.env.MOCK_DATA === 'true',
    enableTestingHelpers: process.env.NODE_ENV === 'test',

    // Configurações de debugging
    debug: {
      enableNetworkLogging: true,
      enableStateLogging: true,
      enablePerformanceLogging: true,
      enableErrorStack: true,
      logLevel: 'info',
    },
  },
}

// Configurações específicas por ambiente
const environmentConfigs = {
  development: {
    connection: {
      timeout: 60000,
      retryAttempts: 1,
    },
    cache: {
      defaultTTL: 60000, // 1 minuto em dev
    },
    development: {
      enableDebugMode: true,
      enableVerboseLogging: true,
      debug: {
        logLevel: 'debug',
      },
    },
  },

  production: {
    connection: {
      timeout: 15000,
      retryAttempts: 5,
    },
    cache: {
      defaultTTL: 900000, // 15 minutos em prod
    },
    performance: {
      metrics: {
        samplingRate: 0.01, // 1% em produção
      },
    },
    development: {
      enableDebugMode: false,
      enableVerboseLogging: false,
    },
  },

  test: {
    connection: {
      timeout: 5000,
      retryAttempts: 1,
    },
    cache: {
      defaultTTL: 1000, // 1 segundo em teste
    },
    development: {
      enableTestingHelpers: true,
      enableMockData: true,
    },
  },
}

// Aplicar configurações do ambiente
const currentEnv = process.env.NODE_ENV || 'development'
const envConfig = environmentConfigs[currentEnv] || {}

// Merge deep das configurações
function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {}
      mergeDeep(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

export const finalDatabaseConfig = mergeDeep({ ...databaseConfig }, envConfig)

// Validação da configuração
export function validateDatabaseConfig(config = finalDatabaseConfig) {
  const errors = []

  // Validar configurações obrigatórias
  if (!config.connection?.apiUrl) {
    errors.push('connection.apiUrl is required')
  }

  if (!config.core?.LOCAL_STORAGE_PREFIX) {
    errors.push('core.LOCAL_STORAGE_PREFIX is required')
  }

  // Validar limites
  if (config.cache?.maxSize < 100) {
    errors.push('cache.maxSize must be at least 100')
  }

  if (config.circuitBreaker?.failureThreshold < 1) {
    errors.push('circuitBreaker.failureThreshold must be at least 1')
  }

  // Validar módulos
  const moduleNames = Object.keys(config.modules || {})
  for (const moduleName of moduleNames) {
    const moduleConfig = config.modules[moduleName]
    if (typeof moduleConfig.enabled !== 'boolean') {
      errors.push(`modules.${moduleName}.enabled must be boolean`)
    }
    if (typeof moduleConfig.priority !== 'number') {
      errors.push(`modules.${moduleName}.priority must be number`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Database configuration validation failed:\n${errors.join('\n')}`)
  }

  return true
}

// Exportar configuração validada
try {
  validateDatabaseConfig()
  console.log('✅ Database configuration validated successfully')
} catch (error) {
  console.error('❌ Database configuration validation failed:', error.message)
  if (process.env.NODE_ENV === 'production') {
    throw error
  }
}

export default finalDatabaseConfig
