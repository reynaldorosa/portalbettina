// api-config.js - VERSÃO CORRIGIDA PARA NODE.JS E BROWSERS
// Configuração de API compatível com Node.js e Browser

// Função helper para obter variáveis de ambiente (compatível com Node.js e browser)
const getEnvVar = (key, fallback = undefined) => {
  // Para o ambiente Vite no navegador
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  // Para Node.js
  else if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  // Usar fallback se não estiver disponível
  return fallback;
};

export const ENVIRONMENT_CONFIG = {
  development: {
    API_URL: getEnvVar('VITE_API_URL') || `http://${getEnvVar('VITE_API_HOST', 'localhost')}:${getEnvVar('VITE_API_PORT', '3000')}/api`,
    DEBUG_MODE: getEnvVar('VITE_DEBUG_MODE', 'true'),
    METRICS_INTERVAL: getEnvVar('VITE_METRICS_INTERVAL', '5000'),
    CACHE_ENABLED: getEnvVar('VITE_ENABLE_CACHE', 'true'),
    CACHE_TTL: getEnvVar('VITE_CACHE_TTL', '300000'),
    LOG_LEVEL: getEnvVar('VITE_LOG_LEVEL', 'debug'),
    BATCH_SIZE: getEnvVar('VITE_BATCH_SIZE', '50'),
    COMPRESSION_ENABLED: getEnvVar('VITE_COMPRESSION_ENABLED', 'true'),
    ENCRYPTION_ENABLED: getEnvVar('VITE_ENCRYPTION_ENABLED', 'false'),
  },
  production: {
    API_URL: getEnvVar('VITE_PRODUCTION_API_URL', 'https://api.betina.com'),
    DEBUG_MODE: false,
    METRICS_INTERVAL: getEnvVar('VITE_METRICS_INTERVAL', '10000'),
    CACHE_ENABLED: true,
    CACHE_TTL: getEnvVar('VITE_CACHE_TTL', '600000'),
    LOG_LEVEL: 'error',
    BATCH_SIZE: getEnvVar('VITE_BATCH_SIZE', '100'),
    COMPRESSION_ENABLED: true,
    ENCRYPTION_ENABLED: true,
  },
  docker_local: {
    API_URL: getEnvVar('VITE_API_URL', '/api'),
    DEBUG_MODE: getEnvVar('VITE_DEBUG_MODE', 'true'),
    METRICS_INTERVAL: getEnvVar('VITE_METRICS_INTERVAL', '5000'),
    CACHE_ENABLED: getEnvVar('VITE_ENABLE_CACHE', 'true'),
    CACHE_TTL: getEnvVar('VITE_CACHE_TTL', '300000'),
    LOG_LEVEL: 'info',
    BATCH_SIZE: getEnvVar('VITE_BATCH_SIZE', '50'),
    COMPRESSION_ENABLED: getEnvVar('VITE_COMPRESSION_ENABLED', 'true'),
    ENCRYPTION_ENABLED: getEnvVar('VITE_ENCRYPTION_ENABLED', 'false'),
  },
  docker_production: {
    API_URL: getEnvVar('VITE_PRODUCTION_API_URL', '/api'),
    DB_URL: getEnvVar('VITE_DB_URL', 'postgresql://localhost:5432/betina'),
    DEBUG_MODE: false,
    METRICS_INTERVAL: getEnvVar('VITE_METRICS_INTERVAL', '10000'),
    CACHE_ENABLED: true,
    CACHE_TTL: getEnvVar('VITE_CACHE_TTL', '600000'),
    LOG_LEVEL: 'warn',
    BATCH_SIZE: getEnvVar('VITE_BATCH_SIZE', '100'),
    COMPRESSION_ENABLED: true,
    ENCRYPTION_ENABLED: true,
  }
};

export const getCurrentEnvironment = () => {
  const isDockerByHostname = typeof window !== 'undefined' && 
                            window.location.hostname !== 'localhost' && 
                            window.location.hostname !== '127.0.0.1' && 
                            window.location.hostname !== '';
  const dockerEnvVar = getEnvVar('VITE_DOCKER_ENV');
  const isProduction = getEnvVar('VITE_ENVIRONMENT') === 'production' || getEnvVar('NODE_ENV') === 'production';
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

export const API_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': getEnvVar('VITE_VERSION', '2.0.0'),
    'X-Environment': currentEnv
  },
  TIMEOUT: {
    default: parseInt(getEnvVar('VITE_API_TIMEOUT', '15000')),
    upload: 30000,
    download: 20000
  },
  RETRY: {
    attempts: parseInt(getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')),
    delay: 1000,
    backoff: 2
  }
};

export const METRICS_CONFIG = {
  enabled: true,
  interval: CONFIG.METRICS_INTERVAL,
  BATCH_SIZE: parseInt(getEnvVar('VITE_BATCH_SIZE', '50')),
  endpoints: {
    performance: '/api/metrics/performance',
    usage: '/api/metrics/usage',
    errors: '/api/metrics/errors'
  }
};

export const LOGGING_CONFIG = {
  LEVEL: getEnvVar('VITE_LOG_LEVEL', 'info'),
  destinations: ['console', 'storage'],
  maxEntries: 1000,
  format: 'json'
};

export function validateEnvironment() {
  const current = getCurrentEnvironment();
  console.log(`✅ Ambiente detectado: ${current}`);
  return true;
}

export const SYSTEM_INFO = {
  environment: getCurrentEnvironment(),
  config: CONFIG,
  timestamp: new Date().toISOString(),
  features: {
    version: getEnvVar('VITE_VERSION', '2.0.0'),
    buildTime: getEnvVar('VITE_BUILD_TIME', new Date().toISOString()),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    therapeutic: true,
    ml: false
  }
};

// Logger simples para compatibilidade
export class Logger {
  constructor(category = 'System') {
    this.category = category;
  }
  
  info(message, data = {}) {
    console.log(`ℹ️ [${this.category}] ${message}`, data);
  }
  
  warn(message, data = {}) {
    console.warn(`⚠️ [${this.category}] ${message}`, data);
  }
  
  error(message, data = {}) {
    console.error(`❌ [${this.category}] ${message}`, data);
  }
}

export const logger = new Logger('API-Config');

export default {
  CONFIG,
  API_CONFIG,
  METRICS_CONFIG,
  LOGGING_CONFIG,
  getCurrentEnvironment,
  validateEnvironment,
  SYSTEM_INFO,
  Logger,
  logger
};
