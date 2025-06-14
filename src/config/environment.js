import { z } from 'zod';

// Helper para obter variáveis de ambiente compatível com Node.js e browser
function getEnvVar(varName, defaultValue = '') {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[varName] || defaultValue;
  }
  if (typeof window !== 'undefined' && window.ENV) {
    return window.ENV[varName] || defaultValue;
  }
  return defaultValue;
}

// Função para obter todas as variáveis de ambiente como objeto
function getAllEnvVars() {
  const baseEnv = {
    VITE_API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
    VITE_API_HOST: getEnvVar('VITE_API_HOST', 'localhost'),
    VITE_API_PORT: getEnvVar('VITE_API_PORT', '3000'),
    VITE_PRODUCTION_API_URL: getEnvVar('VITE_PRODUCTION_API_URL', 'https://api.betina.com'),
    VITE_DEBUG_MODE: getEnvVar('VITE_DEBUG_MODE', 'true'),
    VITE_METRICS_INTERVAL: getEnvVar('VITE_METRICS_INTERVAL', '2000'),
    VITE_ENABLE_CACHE: getEnvVar('VITE_ENABLE_CACHE', 'true'),
    VITE_LOG_LEVEL: getEnvVar('VITE_LOG_LEVEL', 'debug'),
    VITE_DOCKER_ENV: getEnvVar('VITE_DOCKER_ENV', 'true'),
    VITE_VERSION: getEnvVar('VITE_VERSION', '2.0.0'),
    VITE_DB_URL: getEnvVar('VITE_DB_URL', ''),
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    CORS_ORIGINS: getEnvVar('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173'),
    RATE_LIMIT_WINDOW_MS: getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'),
    RATE_LIMIT_MAX_REQUESTS: getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'),
    RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS: getEnvVar('RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS', 'true'),
    VITE_API_TIMEOUT: getEnvVar('VITE_API_TIMEOUT', '15000'),
    VITE_API_RETRY_ATTEMPTS: getEnvVar('VITE_API_RETRY_ATTEMPTS', '3'),
    VITE_CACHE_TTL: getEnvVar('VITE_CACHE_TTL', '3600'),
    VITE_BATCH_SIZE: getEnvVar('VITE_BATCH_SIZE', '50')
  };
  return baseEnv;
}

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_API_HOST: z.string().default('localhost'),
  VITE_API_PORT: z.coerce.number().default(3000),
  VITE_PRODUCTION_API_URL: z.string().url().default('https://api.betina.com'),
  VITE_DEBUG_MODE: z.coerce.boolean().default(true),
  VITE_METRICS_INTERVAL: z.coerce.number().default(2000),
  VITE_ENABLE_CACHE: z.coerce.boolean().default(true),
  VITE_LOG_LEVEL: z.string().default('debug'),
  VITE_DOCKER_ENV: z.coerce.boolean().default(true),
  VITE_VERSION: z.string().default('2.0.0'),
  VITE_DB_URL: z.string().default(''),
  NODE_ENV: z.string().default('development'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS: z.coerce.boolean().default(true),
  VITE_API_TIMEOUT: z.coerce.number().default(15000),
  VITE_API_RETRY_ATTEMPTS: z.coerce.number().default(3),
  VITE_CACHE_TTL: z.coerce.number().default(3600),
  VITE_BATCH_SIZE: z.coerce.number().default(50)
});

const env = envSchema.parse(getAllEnvVars());

export const ENVIRONMENT_CONFIG = {
  development: {
    API_URL: env.VITE_API_URL,
    DEBUG_MODE: env.VITE_DEBUG_MODE,
    METRICS_INTERVAL: env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: env.VITE_ENABLE_CACHE,
    LOG_LEVEL: env.VITE_LOG_LEVEL
  },
  production: {
    API_URL: env.VITE_PRODUCTION_API_URL,
    DEBUG_MODE: env.VITE_DEBUG_MODE,
    METRICS_INTERVAL: env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: env.VITE_ENABLE_CACHE,
    LOG_LEVEL: env.VITE_LOG_LEVEL
  },
  docker_local: {
    API_URL: env.VITE_API_URL,
    DEBUG_MODE: env.VITE_DEBUG_MODE,
    METRICS_INTERVAL: env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: env.VITE_ENABLE_CACHE,
    LOG_LEVEL: env.VITE_LOG_LEVEL
  },
  docker_production: {
    API_URL: env.VITE_PRODUCTION_API_URL,
    DB_URL: env.VITE_DB_URL,
    DEBUG_MODE: false,
    METRICS_INTERVAL: env.VITE_METRICS_INTERVAL,
    CACHE_ENABLED: true,
    LOG_LEVEL: 'warn'
  }
};

export const getCurrentEnvironment = () => {
  const isDockerByHostname = typeof window !== 'undefined' && 
                            window.location.hostname !== 'localhost' && 
                            window.location.hostname !== '127.0.0.1' && 
                            window.location.hostname !== '';
  const dockerEnvVar = env.VITE_DOCKER_ENV;
  const isProduction = getEnvVar('MODE') === 'production' || env.NODE_ENV === 'production';
  const isDocker = dockerEnvVar || isDockerByHostname;
  
  if (isDocker && isProduction) {
    return 'docker_production';
  } else if (isDocker) {
    return 'docker_local';
  } else if (isProduction) {
    return 'production';
  }
  return 'development';
};

const currentEnv = getCurrentEnvironment();
export const CONFIG = ENVIRONMENT_CONFIG[currentEnv];

export const DOCKER_CONFIG = {
  HEALTH_CHECK_INTERVAL: 30000,
  HEALTH_CHECK_TIMEOUT: 5000,
  HEALTH_CHECK_RETRIES: 3,
  INTERNAL_PORT: env.VITE_API_PORT,
  EXTERNAL_PORT: env.VITE_API_PORT,
  VOLUMES: {
    uploads: '/app/uploads',
    logs: '/app/logs',
    cache: '/app/cache'
  },
  ENV_VARS: {
    NODE_ENV: env.NODE_ENV,
    VITE_API_URL: env.VITE_API_URL,
    VITE_DB_URL: env.VITE_DB_URL,
    VITE_VERSION: env.VITE_VERSION,
    VITE_ENVIRONMENT: currentEnv,
    DOCKER_ENV: 'true'
  }
};

export const API_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': env.VITE_VERSION,
    'X-Environment': currentEnv
  },
  TIMEOUT: {
    default: env.VITE_API_TIMEOUT,
    upload: 30000,
    download: 20000
  },
  RETRY: {
    attempts: env.VITE_API_RETRY_ATTEMPTS,
    delay: 1000,
    backoff: 2
  },
  ENDPOINTS: {
    health: '/api/health',
    users: '/api/user',
    sessions: '/api/game-session',
    metrics: '/api/dashboard-metrics',
    activities: '/api/activities',
    progress: '/api/neuropedagogical-insights'
  }
};

export const METRICS_CONFIG = {
  COLLECTION_INTERVAL: CONFIG.METRICS_INTERVAL,
  BATCH_SIZE: env.VITE_BATCH_SIZE,
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
    SHORT: env.VITE_CACHE_TTL * 1000,
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
  LEVEL: env.VITE_LOG_LEVEL,
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
    origin: env.CORS_ORIGINS.split(',').filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  RATE_LIMIT: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    skipSuccessfulRequests: env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS
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
      if (!getEnvVar(varName)) {
        errors.push(`${varName} missing`);
      }
    });
  }
  if (!CONFIG.API_URL) {
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
    version: env.VITE_VERSION,
    buildTime: getEnvVar('VITE_BUILD_TIME') || new Date().toISOString(),
    nodeEnv: env.NODE_ENV,
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