export const ENVIRONMENT_CONFIG = {
  development: {
    API_URL: import.meta.env.VITE_API_URL || `http://${import.meta.env.VITE_API_HOST || 'localhost'}:${import.meta.env.VITE_API_PORT || '3000'}/api`,
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
    METRICS_INTERVAL: import.meta.env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: import.meta.env.VITE_ENABLE_CACHE,
    CACHE_TTL: import.meta.env.VITE_CACHE_TTL,
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'debug',
    BATCH_SIZE: import.meta.env.VITE_BATCH_SIZE,
    COMPRESSION_ENABLED: import.meta.env.VITE_COMPRESSION_ENABLED,
    ENCRYPTION_ENABLED: import.meta.env.VITE_ENCRYPTION_ENABLED,
  },
  production: {
    API_URL: import.meta.env.VITE_PRODUCTION_API_URL || 'https://api.betina.com',
    DEBUG_MODE: false,
    METRICS_INTERVAL: import.meta.env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: true,
    CACHE_TTL: import.meta.env.VITE_CACHE_TTL,
    LOG_LEVEL: 'error',
    BATCH_SIZE: import.meta.env.VITE_BATCH_SIZE,
    COMPRESSION_ENABLED: true,
    ENCRYPTION_ENABLED: true,
  },
  docker_local: {
    API_URL: import.meta.env.VITE_API_URL || '/api',
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
    METRICS_INTERVAL: import.meta.env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: import.meta.env.VITE_ENABLE_CACHE,
    CACHE_TTL: import.meta.env.VITE_CACHE_TTL,
    LOG_LEVEL: 'info',
    BATCH_SIZE: import.meta.env.VITE_BATCH_SIZE,
    COMPRESSION_ENABLED: import.meta.env.VITE_COMPRESSION_ENABLED,
    ENCRYPTION_ENABLED: import.meta.env.VITE_ENCRYPTION_ENABLED,
  },
  docker_production: {
    API_URL: import.meta.env.VITE_PRODUCTION_API_URL || '/api',
    DB_URL: import.meta.env.VITE_DB_URL,
    DEBUG_MODE: false,
    METRICS_INTERVAL: import.meta.env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: true,
    CACHE_TTL: import.meta.env.VITE_CACHE_TTL,
    LOG_LEVEL: 'warn',
    BATCH_SIZE: import.meta.env.VITE_BATCH_SIZE,
    COMPRESSION_ENABLED: true,
    ENCRYPTION_ENABLED: true,
  }
};

export const getCurrentEnvironment = () => {
  const isDockerByHostname = typeof window !== 'undefined' && 
                            window.location.hostname !== 'localhost' && 
                            window.location.hostname !== '127.0.0.1' && 
                            window.location.hostname !== '';
  const dockerEnvVar = import.meta.env.VITE_DOCKER_ENV;
  const isProduction = import.meta.env.VITE_ENVIRONMENT === 'production' || import.meta.env.NODE_ENV === 'production';
  const isDocker = dockerEnvVar || isDockerByHostname;
  
  if (isDocker && isProduction) {
    return 'docker_production';
  } else if (isDocker) {
    return 'docker_local';
  } else if (isProduction) {
    return 'production';
  } else {
    return 'development';
  }
};

const currentEnv = getCurrentEnvironment();
export const CONFIG = ENVIRONMENT_CONFIG[currentEnv];

export const DOCKER_CONFIG = {
  HEALTH_CHECK_INTERVAL: 30000,
  HEALTH_CHECK_TIMEOUT: 5000,
  HEALTH_CHECK_RETRIES: 3,
  INTERNAL_PORT: parseInt(import.meta.env.VITE_API_PORT) || 3000,
  EXTERNAL_PORT: parseInt(import.meta.env.VITE_API_PORT) || 3000,
  VOLUMES: {
    uploads: '/app/uploads',
    logs: '/app/logs',
    cache: '/app/cache'
  },
  ENV_VARS: {
    NODE_ENV: import.meta.env.NODE_ENV || 'production',
    VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    VITE_DB_URL: import.meta.env.VITE_DB_URL,
    VITE_VERSION: import.meta.env.VITE_VERSION || '2.0.0',
    VITE_ENVIRONMENT: currentEnv,
    DOCKER_ENV: 'true'
  }
};

export const API_CONFIG = {  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': import.meta.env.VITE_VERSION || '2.0.0',
    'X-Environment': currentEnv
  },
  TIMEOUT: {
    default: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
    upload: 30000,
    download: 20000
  },
  RETRY: {
    attempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    delay: 1000,
    backoff: 2
  },  ENDPOINTS: {
    health: '/health',
    users: '/user',
    sessions: '/game-session',
    metrics: '/dashboard-metrics',
    activities: '/activities',
    progress: '/neuropedagogical-insights',
    authAnonymous: '/auth/anonymous',
    authVerify: '/auth/verify',
    cognitiveProfiles: '/cognitive-profiles',
    learningPatterns: '/learning-patterns',
    engagementMetrics: '/engagement-metrics',
    neuroplasticityTracking: '/neuroplasticity-tracking',
    adaptiveParameters: '/adaptive-parameters',
  }
};

export const METRICS_CONFIG = {
  COLLECTION_INTERVAL: CONFIG.METRICS_INTERVAL,
  BATCH_SIZE: parseInt(import.meta.env.VITE_BATCH_SIZE) || 50,
  MAX_QUEUE_SIZE: 100,
  RETENTION_DAYS: 90,
  COLLECT: {
    performance: true,
    errors: true,
    user_interactions: true,
    accessibility: true,
    device_info: true
  }
};

export const CACHE_CONFIG = {
  ENABLED: CONFIG.CACHE_ENABLED,
  TTL: {
    SHORT: 5 * 60 * 1000,
    MEDIUM: 30 * 60 * 1000,
    LONG: 24 * 60 * 60 * 1000
  },
  KEYS: {
    user_profile: 'user_profile_',
    game_sessions: 'game_sessions_',
    activities: 'activities_',
    progress: 'progress_'
  }
};

export const LOG_CONFIG = {
  LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  LEVELS: {
    debug: '0',
    info: '1',
    warn: '2',
    error: '3'
  },
  FORMAT: {
    development: 'simple',
    production: 'json',
    docker_local: 'simple',
    docker_production: 'json'
  }
};

export const SECURITY_CONFIG = {
  CORS: {
    origin: (import.meta.env.CORS_ORIGINS || '').split(',').filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  RATE_LIMIT: {
    windowMs: parseInt(import.meta.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(import.meta.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    skipSuccessfulRequests: import.meta.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true'
  },
  VALIDATION: {
    maxFileSize: 10 * 1024 * 1024,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxStringLength: 1000
  }
};

export const validateEnvironment = () => {
  const errors = [];
  if (currentEnv.includes('production')) {
    const requiredVars = ['VITE_API_URL', 'VITE_DB_URL'];
    requiredVars.forEach(varName => {
      if (!import.meta.env[varName]) {
        errors.push(`${varName} missing`);
      }
    });
  }
  const apiUrl = CONFIG.API_URL;
  if (!apiUrl) {
    errors.push('API_URL not configured');
  }
  return {
    isValid: errors.length === 0,
    errors,
    environment: currentEnv,
    config: CONFIG
  };
};

export const getSystemInfo = () => {
  return {
    environment: currentEnv,
    version: import.meta.env.VITE_VERSION || '2.0.0',
    buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
    nodeEnv: import.meta.env.NODE_ENV || 'development',
    apiUrl: CONFIG.API_URL,
    debugMode: CONFIG.DEBUG_MODE,
    browser: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
      cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false
    },
    screen: {
      width: typeof window !== 'undefined' ? window.screen.width : 0,
      height: typeof window !== 'undefined' ? window.screen.height : 0,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
    }
  };
};

export class Logger {
  constructor(component = 'App') {
    this.component = component;
    this.minLevel = LOG_CONFIG.LEVELS[LOG_CONFIG.LEVEL] || '0';
  }
  log(level, message, data = null) {
    const levelNum = LOG_CONFIG.LEVELS[level] || '0';
    if (parseInt(levelNum) < parseInt(this.minLevel)) return;
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      component: this.component,
      message,
      ...(data && { data })
    };
    if (LOG_CONFIG.FORMAT[currentEnv] === 'json') {
      console.log(JSON.stringify(logEntry));
    } else {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌'
      }[level] || '';
      console.log(`${emoji} [${this.component}] ${message}`, data || '');
    }
  }
  debug(message, data) { this.log('debug', message, data); }
  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
}

export const logger = new Logger('Global');

export const useConfig = () => {
  return {
    config: CONFIG,
    environment: currentEnv,
    systemInfo: getSystemInfo(),
    logger: new Logger(),
    isProduction: currentEnv.includes('production'),
    isDocker: currentEnv.includes('docker'),
    isDevelopment: currentEnv === 'development'
  };
};

export default {
  CONFIG,
  DOCKER_CONFIG,
  API_CONFIG,
  METRICS_CONFIG,
  CACHE_CONFIG,
  LOG_CONFIG,
  SECURITY_CONFIG,
  getCurrentEnvironment,
  validateEnvironment,
  getSystemInfo,
  Logger,
  logger,
  useConfig
};