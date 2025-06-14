/**
 * @file dependencies.js
 * @description Gerenciamento inteligente de dependências com fallbacks
 */

// Mock implementations to avoid undefined errors
let authService, LZString, CONFIG, API_CONFIG

authService = authService || {
  createAnonymousUser: async () => {
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    return { userId, user: { id: userId, is_anonymous: true } }
  },
  isAuthenticated: () => false,
  getToken: () => null,
}

LZString = LZString || {
  compress: (str) => {
    try {
      return btoa(str)
    } catch (e) {
      return str
    }
  },
  decompress: (str) => {
    try {
      return atob(str)
    } catch (e) {
      return str
    }
  },
  compressToUTF16: (str) => str,
  decompressFromUTF16: (str) => str,
}

CONFIG = CONFIG || {
  API_URL: 'http://localhost:3001/api',
  ENVIRONMENT: 'development',
  DEBUG_MODE: true,
  CACHE_TTL: 1800000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

API_CONFIG = API_CONFIG || {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  ENDPOINTS: {
    users: '/users',
    sessions: '/game-sessions',
    adaptiveParameters: '/adaptive-parameters',
    cognitiveProfiles: '/cognitive-profiles',
    progress: '/progress',
    accessibility: '/accessibility',
  },
}

// Smart dependency loading with fallbacks
function initializeDependencies() {
  console.log(
    '✅ DEPENDENCIES: Mock implementations loaded for authService, LZString, CONFIG, API_CONFIG'
  )
}

// Initialize dependencies on load
initializeDependencies()

export { authService, LZString, CONFIG, API_CONFIG }
