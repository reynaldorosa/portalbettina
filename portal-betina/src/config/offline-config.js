// Configuração simplificada para modo offline - apenas métricas locais
export const OFFLINE_MODE = true

export const CONFIG = {
  OFFLINE_MODE: true,
  DISABLE_API_CALLS: true,
  DISABLE_DATABASE_CALLS: true,
  ENABLE_LOCAL_METRICS: true,
  LOG_LEVEL: 'warn', // Reduzir logs para evitar recursão
  API_URL: null, // Desabilitar completamente
}

export const API_CONFIG = {
  OFFLINE_MODE: true,
  DISABLE_NETWORK_CALLS: true,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  TIMEOUT: {
    default: 1000,
  },
}

// Logger simplificado para evitar recursão
export const logger = {
  info: (msg, data) => console.log(`ℹ️ ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`⚠️ ${msg}`, data || ''),
  error: (msg, data) => console.error(`❌ ${msg}`, data || ''),
  debug: () => {}, // Desabilitar debug
}

console.log('🔧 Modo OFFLINE ativado - apenas métricas locais')
