/**
 * CONFIGURAÇÕES DE AMBIENTE - PLATAFORMA BETINA
 * Centraliza todas as configurações para Docker e diferentes ambientes
 * 
 * @version 2.0.0
 * @created 2025-06-05
 * @purpose Padronização Docker e API
 */

// Configurações base por ambiente
export const ENVIRONMENT_CONFIG = {
  development: {
    API_URL: 'http://localhost:3001',
    DB_URL: 'postgresql://betina_user:betina_pass@localhost:5432/betina_db',
    DEBUG_MODE: true,
    METRICS_INTERVAL: 1000,
    CACHE_ENABLED: false,
    LOG_LEVEL: 'debug'
  },
  
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://api.betina.com',
    DB_URL: process.env.REACT_APP_DB_URL,
    DEBUG_MODE: false,
    METRICS_INTERVAL: 5000,
    CACHE_ENABLED: true,
    LOG_LEVEL: 'error'
  },
  
  docker_local: {
    API_URL: 'http://api:3001',
    DB_URL: 'postgresql://betina_user:betina_pass@postgres:5432/betina_db',
    DEBUG_MODE: true,
    METRICS_INTERVAL: 2000,
    CACHE_ENABLED: true,
    LOG_LEVEL: 'info'
  },
  
  docker_production: {
    API_URL: process.env.REACT_APP_API_URL || 'http://api:3001',
    DB_URL: process.env.REACT_APP_DB_URL,
    DEBUG_MODE: false,
    METRICS_INTERVAL: 5000,
    CACHE_ENABLED: true,
    LOG_LEVEL: 'warn'
  }
};

// Detectar ambiente atual
export const getCurrentEnvironment = () => {
  // Verificar se está rodando em Docker
  const isDocker = process.env.DOCKER_ENV === 'true' || 
                   window.location.hostname === 'localhost' && process.env.NODE_ENV === 'production';
  
  // Verificar se é produção
  const isProduction = process.env.NODE_ENV === 'production';
  
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

// Configurações atuais baseadas no ambiente
const currentEnv = getCurrentEnvironment();
export const CONFIG = ENVIRONMENT_CONFIG[currentEnv];

// Configurações específicas para Docker
export const DOCKER_CONFIG = {
  // Health checks
  HEALTH_CHECK_INTERVAL: 30000,
  HEALTH_CHECK_TIMEOUT: 5000,
  HEALTH_CHECK_RETRIES: 3,
  
  // Networking
  INTERNAL_PORT: 3000,
  EXTERNAL_PORT: process.env.REACT_APP_PORT || 3000,
  
  // Volume mappings
  VOLUMES: {
    uploads: '/app/uploads',
    logs: '/app/logs',
    cache: '/app/cache'
  },
  
  // Environment variables para Docker Compose
  ENV_VARS: {
    NODE_ENV: process.env.NODE_ENV || 'production',
    REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://api:3001',
    REACT_APP_DB_URL: process.env.REACT_APP_DB_URL,
    REACT_APP_VERSION: process.env.REACT_APP_VERSION || '2.0.0',
    REACT_APP_ENVIRONMENT: currentEnv,
    DOCKER_ENV: 'true'
  }
};

// Configurações de API padronizadas
export const API_CONFIG = {
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': CONFIG.version || '2.0.0',
    'X-Environment': currentEnv
  },
  
  // Timeouts
  TIMEOUT: {
    default: 10000,
    upload: 30000,
    download: 20000
  },
  
  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000,
    backoff: 2
  },
  
  // Endpoints padrão
  ENDPOINTS: {
    health: '/health',
    users: '/user',
    sessions: '/sessions',
    metrics: '/metrics',
    activities: '/activities',
    progress: '/progress'
  }
};

// Configurações de métricas
export const METRICS_CONFIG = {
  COLLECTION_INTERVAL: CONFIG.METRICS_INTERVAL,
  BATCH_SIZE: 10,
  MAX_QUEUE_SIZE: 100,
  RETENTION_DAYS: 90,
  
  // Métricas a coletar
  COLLECT: {
    performance: true,
    errors: true,
    user_interactions: true,
    accessibility: true,
    device_info: true
  }
};

// Configurações de cache
export const CACHE_CONFIG = {
  ENABLED: CONFIG.CACHE_ENABLED,
  TTL: {
    short: 5 * 60 * 1000,    // 5 minutos
    medium: 30 * 60 * 1000,  // 30 minutos
    long: 24 * 60 * 60 * 1000 // 24 horas
  },
  
  KEYS: {
    user_profile: 'user_profile_',
    game_sessions: 'game_sessions_',
    activities: 'activities_',
    progress: 'progress_'
  }
};

// Configurações de log
export const LOG_CONFIG = {
  LEVEL: CONFIG.LOG_LEVEL,
  
  LEVELS: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },
  
  // Formato de log para diferentes ambientes
  FORMAT: {
    development: 'simple',
    production: 'json',
    docker_local: 'simple',
    docker_production: 'json'
  }
};

// Configurações de segurança
export const SECURITY_CONFIG = {
  // CORS
  CORS: {
    origins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://betina.com',
      'https://app.betina.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Version']
  },
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // requests por window
  },
  
  // Data validation
  VALIDATION: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxStringLength: 1000
  }
};

// Função para validar configuração do ambiente
export const validateEnvironment = () => {
  const errors = [];
  
  // Verificar variáveis obrigatórias em produção
  if (currentEnv.includes('production')) {
    const requiredVars = ['REACT_APP_API_URL', 'REACT_APP_DB_URL'];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        errors.push(`Variável de ambiente obrigatória ausente: ${varName}`);
      }
    });
  }
  
  // Verificar conectividade com API
  const apiUrl = CONFIG.API_URL;
  if (!apiUrl) {
    errors.push('URL da API não configurada');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    environment: currentEnv,
    config: CONFIG
  };
};

// Função para obter informações do sistema
export const getSystemInfo = () => {
  return {
    environment: currentEnv,
    version: process.env.REACT_APP_VERSION || '2.0.0',
    buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    apiUrl: CONFIG.API_URL,
    debugMode: CONFIG.DEBUG_MODE,
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      devicePixelRatio: window.devicePixelRatio
    }
  };
};

// Logger padronizado
export class Logger {
  constructor(component = 'App') {
    this.component = component;
    this.minLevel = LOG_CONFIG.LEVELS[LOG_CONFIG.LEVEL];
  }
  
  log(level, message, data = null) {
    const levelNum = LOG_CONFIG.LEVELS[level] || 0;
    
    if (levelNum < this.minLevel) return;
    
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

// Instância global do logger
export const logger = new Logger('Global');

// Hook para usar configurações nos componentes
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
