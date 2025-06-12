/**
 * CENTRALIZED LOGGER - SISTEMA DE LOGGING ROBUSTO PORTAL BETINA
 * Sistema centralizado de logging com níveis, formatação e persistência
 *
 * @version 1.0.0
 * @created 2025-01-08
 * @purpose Logging centralizado e observabilidade
 */

// Níveis de log
export const LOG_LEVELS = {
  ERROR: { value: 0, name: 'ERROR', color: '#ff4444', emoji: '❌' },
  WARN: { value: 1, name: 'WARN', color: '#ffaa00', emoji: '⚠️' },
  INFO: { value: 2, name: 'INFO', color: '#0088ff', emoji: 'ℹ️' },
  DEBUG: { value: 3, name: 'DEBUG', color: '#888888', emoji: '🔍' },
  TRACE: { value: 4, name: 'TRACE', color: '#cccccc', emoji: '🔎' },
}

// Categorias de log
export const LOG_CATEGORIES = {
  SYSTEM: 'SYSTEM',
  ML: 'ML',
  PERFORMANCE: 'PERFORMANCE',
  DATABASE: 'DATABASE',
  API: 'API',
  USER: 'USER',
  SECURITY: 'SECURITY',
  AUTISM: 'AUTISM', // Categoria específica para logs relacionados ao autismo
}

// Configurações de logging otimizadas para autismo
const AUTISM_LOGGING_CONFIG = {
  defaultLevel: LOG_LEVELS.INFO,
  maxLogEntries: 1000,
  maxLogSize: 5 * 1024 * 1024, // 5MB
  persistToLocalStorage: true,
  sendToServer: false,
  bufferSize: 50,
  flushInterval: 10000, // 10 segundos
  sensitiveFields: ['password', 'token', 'key', 'secret'],
  enableStackTrace: true,
  enableSourceMap: true,
  formatters: {
    console: true,
    json: true,
    structured: true,
  },
}

/**
 * Classe principal do Logger
 */
class CentralizedLogger {
  constructor() {
    this.level = AUTISM_LOGGING_CONFIG.defaultLevel
    this.logs = []
    this.buffer = []
    this.listeners = new Map()
    this.flushTimer = null
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()

    this.statistics = {
      totalLogs: 0,
      logsByLevel: {},
      logsByCategory: {},
      errorsCount: 0,
      warningsCount: 0,
      lastLogTime: null,
      sessionDuration: 0,
    }

    this.init()
  }

  /**
   * Inicializa o logger
   */
  init() {
    // Inicializar estatísticas por nível
    Object.values(LOG_LEVELS).forEach((level) => {
      this.statistics.logsByLevel[level.name] = 0
    })

    // Inicializar estatísticas por categoria
    Object.values(LOG_CATEGORIES).forEach((category) => {
      this.statistics.logsByCategory[category] = 0
    })

    // Configurar flush automático
    this.flushTimer = setInterval(() => {
      this.flush()
    }, AUTISM_LOGGING_CONFIG.flushInterval)

    // Interceptar erros globais
    this.setupGlobalErrorHandling()

    // Carregar logs persistidos
    this.loadPersistedLogs()

    this.info('🚀 CentralizedLogger inicializado', {
      sessionId: this.sessionId,
      level: this.level.name,
      config: AUTISM_LOGGING_CONFIG,
    })
  }

  /**
   * Configura tratamento de erros globais
   */
  setupGlobalErrorHandling() {
    // Erros JavaScript não capturados
    window.addEventListener('error', (event) => {
      this.error('Erro JavaScript não capturado', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        category: LOG_CATEGORIES.SYSTEM,
      })
    })

    // Promises rejeitadas não capturadas
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Promise rejeitada não capturada', {
        reason: event.reason,
        stack: event.reason?.stack,
        category: LOG_CATEGORIES.SYSTEM,
      })
    })

    // Console interceptation disabled to prevent infinite loops
    // Original console methods preserved
  }

  /**
   * Gera ID único da sessão
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Log de erro
   */
  error(message, data = {}, category = LOG_CATEGORIES.SYSTEM) {
    return this.log(LOG_LEVELS.ERROR, message, data, category)
  }

  /**
   * Log de warning
   */
  warn(message, data = {}, category = LOG_CATEGORIES.SYSTEM) {
    return this.log(LOG_LEVELS.WARN, message, data, category)
  }

  /**
   * Log de informação
   */
  info(message, data = {}, category = LOG_CATEGORIES.SYSTEM) {
    return this.log(LOG_LEVELS.INFO, message, data, category)
  }

  /**
   * Log de debug
   */
  debug(message, data = {}, category = LOG_CATEGORIES.SYSTEM) {
    return this.log(LOG_LEVELS.DEBUG, message, data, category)
  }

  /**
   * Log de trace
   */
  trace(message, data = {}, category = LOG_CATEGORIES.SYSTEM) {
    return this.log(LOG_LEVELS.TRACE, message, data, category)
  }

  /**
   * Logs específicos para autismo
   */
  autism = {
    sensoryOverload: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.WARN,
        `🔊 Sobrecarga Sensorial: ${message}`,
        {
          ...data,
          autismType: 'sensory_overload',
        },
        LOG_CATEGORIES.AUTISM
      )
    },

    adaptiveChange: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.INFO,
        `🔄 Adaptação: ${message}`,
        {
          ...data,
          autismType: 'adaptive_change',
        },
        LOG_CATEGORIES.AUTISM
      )
    },

    behavioralPattern: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.INFO,
        `🧠 Padrão Comportamental: ${message}`,
        {
          ...data,
          autismType: 'behavioral_pattern',
        },
        LOG_CATEGORIES.AUTISM
      )
    },

    therapeuticGoal: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.INFO,
        `🎯 Meta Terapêutica: ${message}`,
        {
          ...data,
          autismType: 'therapeutic_goal',
        },
        LOG_CATEGORIES.AUTISM
      )
    },

    cognitiveLoad: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.DEBUG,
        `🧩 Carga Cognitiva: ${message}`,
        {
          ...data,
          autismType: 'cognitive_load',
        },
        LOG_CATEGORIES.AUTISM
      )
    },
  }

  /**
   * Logs específicos para ML
   */
  ml = {
    training: (message, data = {}) => {
      return this.log(LOG_LEVELS.INFO, `🤖 Treinamento ML: ${message}`, data, LOG_CATEGORIES.ML)
    },

    inference: (message, data = {}) => {
      return this.log(LOG_LEVELS.DEBUG, `🔮 Inferência ML: ${message}`, data, LOG_CATEGORIES.ML)
    },

    modelUpdate: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.INFO,
        `📊 Atualização de Modelo: ${message}`,
        data,
        LOG_CATEGORIES.ML
      )
    },

    predictionError: (message, data = {}) => {
      return this.log(LOG_LEVELS.ERROR, `❌ Erro na Predição: ${message}`, data, LOG_CATEGORIES.ML)
    },

    dataQuality: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.WARN,
        `📋 Qualidade dos Dados: ${message}`,
        data,
        LOG_CATEGORIES.ML
      )
    },
  }

  /**
   * Logs específicos para performance
   */
  performance = {
    slow: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.WARN,
        `⏱️ Performance Lenta: ${message}`,
        data,
        LOG_CATEGORIES.PERFORMANCE
      )
    },

    memory: (message, data = {}) => {
      return this.log(LOG_LEVELS.DEBUG, `💾 Memória: ${message}`, data, LOG_CATEGORIES.PERFORMANCE)
    },

    optimization: (message, data = {}) => {
      return this.log(
        LOG_LEVELS.INFO,
        `⚡ Otimização: ${message}`,
        data,
        LOG_CATEGORIES.PERFORMANCE
      )
    },
  }

  /**
   * Método principal de log
   */
  log(level, message, data = {}, category = LOG_CATEGORIES.SYSTEM) {
    // Verificar se deve logar baseado no nível
    if (level.value > this.level.value) {
      return null
    }

    const timestamp = Date.now()
    const logEntry = {
      id: `log_${timestamp}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp,
      sessionId: this.sessionId,
      level: level.name,
      message,
      data: this.sanitizeData(data),
      category,
      source: this.getLogSource(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Adicionar stack trace se habilitado e for erro
    if (AUTISM_LOGGING_CONFIG.enableStackTrace && level.value <= LOG_LEVELS.WARN.value) {
      logEntry.stack = new Error().stack
    }

    // Adicionar ao buffer
    this.buffer.push(logEntry)

    // Atualizar estatísticas
    this.updateStatistics(logEntry)

    // Logar no console se habilitado
    if (AUTISM_LOGGING_CONFIG.formatters.console) {
      this.logToConsole(logEntry)
    }

    // Notificar listeners
    this.notifyListeners(logEntry)

    // Flush se buffer estiver cheio
    if (this.buffer.length >= AUTISM_LOGGING_CONFIG.bufferSize) {
      this.flush()
    }

    return logEntry.id
  }
  /**
   * Sanitiza dados sensíveis
   */ sanitizeData(data, depth = 0) {
    // Prevent infinite recursion and excessive depth
    if (depth > 3 || !data) {
      return data
    }

    // Handle primitive types
    if (typeof data !== 'object' || data === null) {
      return data
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.slice(0, 10).map((item) => {
        if (typeof item === 'object' && item !== null) {
          return '[Object]'
        }
        return item
      })
    }

    // Handle circular references more safely
    try {
      const sanitized = {}
      let keyCount = 0

      for (const [key, value] of Object.entries(data)) {
        // Limit number of keys to prevent excessive processing
        if (keyCount++ > 20) break

        // Redact sensitive fields
        if (AUTISM_LOGGING_CONFIG.sensitiveFields.includes(key)) {
          sanitized[key] = '[REDACTED]'
        } else if (typeof value === 'object' && value !== null && depth < 2) {
          sanitized[key] = this.sanitizeData(value, depth + 1)
        } else if (typeof value === 'function') {
          sanitized[key] = '[Function]'
        } else {
          sanitized[key] = value
        }
      }

      return sanitized
    } catch (error) {
      return '[Error sanitizing data]'
    }
  }

  /**
   * Obtém fonte do log
   */
  getLogSource() {
    try {
      const stack = new Error().stack
      const lines = stack.split('\n')

      // Procurar primeira linha que não seja do logger
      for (let i = 3; i < lines.length; i++) {
        const line = lines[i]
        if (line && !line.includes('CentralizedLogger') && !line.includes('logger.js')) {
          const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/)
          if (match) {
            return {
              function: match[1],
              file: match[2],
              line: parseInt(match[3]),
              column: parseInt(match[4]),
            }
          }
        }
      }
    } catch (error) {
      // Ignorar erros de stack trace
    }

    return null
  }

  /**
   * Loga no console
   */
  logToConsole(logEntry) {
    const level = LOG_LEVELS[logEntry.level]
    const emoji = level.emoji
    const color = level.color

    const prefix = `${emoji} [${logEntry.category}] ${new Date(logEntry.timestamp).toISOString()}`
    const message = `${prefix} ${logEntry.message}`

    // Estilo do console
    const style = `color: ${color}; font-weight: bold;`

    switch (logEntry.level) {
      case 'ERROR':
        console.error(`%c${message}`, style, logEntry.data)
        break
      case 'WARN':
        console.warn(`%c${message}`, style, logEntry.data)
        break
      case 'INFO':
        console.info(`%c${message}`, style, logEntry.data)
        break
      case 'DEBUG':
        console.debug(`%c${message}`, style, logEntry.data)
        break
      case 'TRACE':
        console.trace(`%c${message}`, style, logEntry.data)
        break
      default:
        console.log(`%c${message}`, style, logEntry.data)
    }
  }

  /**
   * Atualiza estatísticas
   */
  updateStatistics(logEntry) {
    this.statistics.totalLogs++
    this.statistics.logsByLevel[logEntry.level]++
    this.statistics.logsByCategory[logEntry.category]++
    this.statistics.lastLogTime = logEntry.timestamp
    this.statistics.sessionDuration = logEntry.timestamp - this.startTime

    if (logEntry.level === 'ERROR') {
      this.statistics.errorsCount++
    }

    if (logEntry.level === 'WARN') {
      this.statistics.warningsCount++
    }
  }

  /**
   * Notifica listeners
   */
  notifyListeners(logEntry) {
    for (const [id, listener] of this.listeners.entries()) {
      try {
        if (typeof listener === 'function') {
          listener(logEntry)
        }
      } catch (error) {
        console.error('Erro no listener de log:', error)
        this.listeners.delete(id)
      }
    }
  }

  /**
   * Flush buffer para persistência
   */
  flush() {
    if (this.buffer.length === 0) return

    // Adicionar ao array principal
    this.logs.push(...this.buffer)

    // Persistir se habilitado
    if (AUTISM_LOGGING_CONFIG.persistToLocalStorage) {
      this.persistLogs()
    }

    // Enviar para servidor se habilitado
    if (AUTISM_LOGGING_CONFIG.sendToServer) {
      this.sendLogsToServer()
    }

    // Limpar buffer
    this.buffer = []

    // Manter tamanho máximo de logs
    if (this.logs.length > AUTISM_LOGGING_CONFIG.maxLogEntries) {
      const excess = this.logs.length - AUTISM_LOGGING_CONFIG.maxLogEntries
      this.logs.splice(0, excess)
    }
  }

  /**
   * Persiste logs no localStorage
   */
  persistLogs() {
    try {
      const data = {
        sessionId: this.sessionId,
        logs: this.logs.slice(-AUTISM_LOGGING_CONFIG.maxLogEntries),
        statistics: this.statistics,
        persistedAt: Date.now(),
      }

      const serialized = JSON.stringify(data)

      // Verificar tamanho
      if (serialized.length > AUTISM_LOGGING_CONFIG.maxLogSize) {
        // Reduzir logs se muito grande
        data.logs = data.logs.slice(-Math.floor(AUTISM_LOGGING_CONFIG.maxLogEntries / 2))
        localStorage.setItem('betina_logs', JSON.stringify(data))
      } else {
        localStorage.setItem('betina_logs', serialized)
      }
    } catch (error) {
      console.error('Erro ao persistir logs:', error)
    }
  }

  /**
   * Carrega logs persistidos
   */
  loadPersistedLogs() {
    try {
      const data = localStorage.getItem('betina_logs')
      if (data) {
        const parsed = JSON.parse(data)

        // Verificar se é da sessão atual ou sessão anterior válida
        const age = Date.now() - parsed.persistedAt
        if (age < 24 * 60 * 60 * 1000) {
          // 24 horas
          this.logs = parsed.logs || []
          this.info('📁 Logs anteriores carregados', {
            count: this.logs.length,
            sessionId: parsed.sessionId,
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar logs persistidos:', error)
    }
  }

  /**
   * Envia logs para servidor (placeholder)
   */
  async sendLogsToServer() {
    // Implementar envio para servidor se necessário
    // try {
    //   await fetch('/api/logs', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       sessionId: this.sessionId,
    //       logs: this.buffer
    //     })
    //   });
    // } catch (error) {
    //   console.error('Erro ao enviar logs para servidor:', error);
    // }
  }

  /**
   * Define nível de log
   */
  setLevel(level) {
    this.level = level
    this.info('📊 Nível de log alterado', { newLevel: level.name })
  }

  /**
   * Adiciona listener
   */
  addListener(callback) {
    const id = `listener_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    this.listeners.set(id, callback)
    return id
  }

  /**
   * Remove listener
   */
  removeListener(id) {
    return this.listeners.delete(id)
  }

  /**
   * Busca logs
   */
  searchLogs(criteria = {}) {
    let filtered = [...this.logs]

    if (criteria.level) {
      filtered = filtered.filter((log) => log.level === criteria.level)
    }

    if (criteria.category) {
      filtered = filtered.filter((log) => log.category === criteria.category)
    }

    if (criteria.message) {
      const searchTerm = criteria.message.toLowerCase()
      filtered = filtered.filter((log) => log.message.toLowerCase().includes(searchTerm))
    }

    if (criteria.dateFrom) {
      filtered = filtered.filter((log) => log.timestamp >= criteria.dateFrom)
    }

    if (criteria.dateTo) {
      filtered = filtered.filter((log) => log.timestamp <= criteria.dateTo)
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Obtém estatísticas
   */
  getStatistics() {
    return {
      ...this.statistics,
      sessionId: this.sessionId,
      bufferSize: this.buffer.length,
      totalLogsInMemory: this.logs.length,
      listenersCount: this.listeners.size,
      currentLevel: this.level.name,
      uptime: Date.now() - this.startTime,
    }
  }

  /**
   * Exporta logs
   */
  exportLogs(format = 'json') {
    const data = {
      sessionId: this.sessionId,
      exportedAt: Date.now(),
      statistics: this.statistics,
      logs: this.logs,
    }

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2)

      case 'csv':
        return this.exportToCSV(data.logs)

      case 'txt':
        return this.exportToText(data.logs)

      default:
        return data
    }
  }

  /**
   * Exporta para CSV
   */
  exportToCSV(logs) {
    const headers = ['timestamp', 'level', 'category', 'message', 'data']
    const rows = logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.level,
      log.category,
      log.message,
      JSON.stringify(log.data),
    ])

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  }

  /**
   * Exporta para texto
   */
  exportToText(logs) {
    return logs
      .map((log) => {
        const timestamp = new Date(log.timestamp).toISOString()
        const level = LOG_LEVELS[log.level]
        return `${timestamp} ${level.emoji} [${log.category}] ${log.message}\n${JSON.stringify(log.data, null, 2)}\n`
      })
      .join('\n---\n')
  }

  /**
   * Limpa logs
   */
  clearLogs() {
    const count = this.logs.length
    this.logs = []
    this.buffer = []

    // Limpar localStorage
    localStorage.removeItem('betina_logs')

    this.info('🧹 Logs limpos', { clearedCount: count })
  }

  /**
   * Destroy: limpa recursos
   */
  destroy() {
    // Flush final
    this.flush()

    // Limpar timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    // Limpar listeners
    this.listeners.clear()

    this.info('🧹 CentralizedLogger destruído')
  }
}

// Instância singleton
let loggerInstance = null

/**
 * Obtém instância do logger (singleton)
 */
export const getLogger = () => {
  if (!loggerInstance) {
    loggerInstance = new CentralizedLogger()
  }
  return loggerInstance
}

// Exportar instância como padrão
export const logger = getLogger()

// Funções utilitárias
export const setLogLevel = (level) => logger.setLevel(level)
export const searchLogs = (criteria) => logger.searchLogs(criteria)
export const exportLogs = (format) => logger.exportLogs(format)
export const clearLogs = () => logger.clearLogs()
export const getLogStats = () => logger.getStatistics()

export default logger
