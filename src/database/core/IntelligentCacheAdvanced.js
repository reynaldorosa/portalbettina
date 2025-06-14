import performanceMonitor from '../../utils/metrics/performanceMonitor.js'

/**
 * @class IntelligentCacheAdvanced
 * @description Sistema de cache avançado com TTL, compressão e invalidação inteligente
 * Baseado no arquivo BKP com funcionalidades completas para Portal Betina
 */
class IntelligentCacheAdvanced {
  constructor(config = {}) {
    this.config = {
      defaultTTL: 300000, // 5 minutos
      maxSize: 1000,
      compressionThreshold: 10000, // 10KB
      cleanupInterval: 60000, // 1 minuto
      enableStatistics: true,
      enableCompression: true,
      enableSmartEviction: true,
      enablePredictiveLoading: false,
      ...config,
    }

    // Cache principal
    this.cache = new Map()

    // Estatísticas avançadas
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
      decompressions: 0,
      totalSize: 0,
      averageAccessTime: 0,
      hotKeys: new Map(),
      accessPatterns: new Map(),
      predictiveHits: 0,
      smartEvictions: 0,
    }

    // Sistemas auxiliares
    this.accessHistory = new Map()
    this.sizeTracker = new Map()
    this.compressionStats = new Map()
    this.evictionStrategy = 'lru' // lru, lfu, adaptive
    this.predictiveEngine = new Map()

    // Monitoramento
    this.performanceMetrics = []
    this.accessPatterns = new Map()
    this.logger = performanceMonitor

    // LZString para compressão (fallback se não disponível)
    this.compressionEngine = this.initializeCompression()

    // Inicializar limpeza automática
    this.startAutomaticCleanup()

    this.logger.info('🧠 Advanced IntelligentCache initialized', {
      config: this.config,
      features: [
        'ttl-management',
        'smart-compression',
        'intelligent-eviction',
        'access-pattern-analysis',
        'predictive-loading',
        'performance-monitoring',
      ],
    })
  }

  /**
   * @method set
   * @description Armazena valor no cache com funcionalidades avançadas
   * @param {string} key - Chave do cache
   * @param {*} value - Valor a ser armazenado
   * @param {number} ttl - Time to live em ms (opcional)
   * @param {Object} options - Opções adicionais
   * @returns {boolean} Sucesso da operação
   */
  set(key, value, ttl = this.config.defaultTTL, options = {}) {
    const startTime = Date.now()

    try {
      // Validar entrada
      if (!key || key.trim() === '') {
        throw new Error('Cache key cannot be empty')
      }

      // Preparar payload
      const payload = this.createCachePayload(value, ttl, options)

      // Verificar se precisa de compressão
      const serializedSize = this.calculateSerializedSize(payload)
      if (this.shouldCompress(serializedSize, options)) {
        payload.compressed = true
        payload.data = this.compress(payload.data)
        payload.originalSize = serializedSize
        this.statistics.compressions++
      }

      // Verificar limites de tamanho
      if (this.isMemoryLimitReached()) {
        this.performSmartEviction()
      }

      // Armazenar no cache
      this.cache.set(key, payload)
      this.sizeTracker.set(key, serializedSize)

      // Atualizar estatísticas
      this.updateSetStatistics(key, serializedSize, options)

      // Registrar padrão de acesso
      this.recordAccessPattern(key, 'set', options)

      // Análise preditiva
      if (this.config.enablePredictiveLoading) {
        this.updatePredictiveModel(key, value, options)
      }

      const duration = Date.now() - startTime
      this.updatePerformanceMetrics('set', duration, serializedSize)

      this.logger.debug('✅ Cache set successful', {
        key,
        size: serializedSize,
        compressed: payload.compressed,
        ttl,
        duration,
      })

      return true
    } catch (error) {
      this.logger.error('❌ Cache set failed', {
        key,
        error: error.message,
        duration: Date.now() - startTime,
      })
      return false
    }
  }

  /**
   * @method get
   * @description Recupera valor do cache com análise inteligente
   * @param {string} key - Chave do cache
   * @param {Object} options - Opções adicionais
   * @returns {*} Valor ou null se não encontrado/expirado
   */
  get(key, options = {}) {
    const startTime = Date.now()

    try {
      const entry = this.cache.get(key)

      if (!entry) {
        this.statistics.misses++
        this.recordAccessPattern(key, 'miss', options)

        // Tentativa de carregamento preditivo
        if (this.config.enablePredictiveLoading) {
          this.triggerPredictiveLoading(key, options)
        }

        return null
      }

      // Verificar expiração
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        this.sizeTracker.delete(key)
        this.statistics.evictions++
        this.statistics.misses++
        this.recordAccessPattern(key, 'expired', options)
        return null
      }

      // Descomprimir se necessário
      let value = entry.data
      if (entry.compressed) {
        value = this.decompress(value)
        this.statistics.decompressions++
      }

      // Atualizar estatísticas e padrões
      this.statistics.hits++
      this.updateAccessHistory(key)
      this.recordAccessPattern(key, 'hit', options)

      // Atualizar TTL se configurado para refresh on access
      if (options.refreshOnAccess) {
        entry.expiry = Date.now() + (options.ttl || this.config.defaultTTL)
      }

      const duration = Date.now() - startTime
      this.updatePerformanceMetrics('get', duration, this.sizeTracker.get(key))

      this.logger.debug('✅ Cache hit', {
        key,
        compressed: entry.compressed,
        size: this.sizeTracker.get(key),
        duration,
      })

      return value
    } catch (error) {
      this.statistics.misses++
      this.logger.error('❌ Cache get failed', {
        key,
        error: error.message,
        duration: Date.now() - startTime,
      })
      return null
    }
  }

  /**
   * @method invalidate
   * @description Invalida entradas do cache usando padrões inteligentes
   * @param {string|RegExp} pattern - Padrão para invalidação
   * @param {Object} options - Opções de invalidação
   * @returns {number} Número de entradas removidas
   */
  invalidate(pattern, options = {}) {
    const startTime = Date.now()
    let removedCount = 0

    try {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
      const keysToRemove = []

      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          keysToRemove.push(key)
        }
      }

      // Remover em lote
      for (const key of keysToRemove) {
        this.cache.delete(key)
        this.sizeTracker.delete(key)
        this.accessHistory.delete(key)
        removedCount++
      }

      this.statistics.evictions += removedCount

      // Invalidação em cascata se configurada
      if (options.cascade) {
        this.performCascadeInvalidation(pattern, options)
      }

      const duration = Date.now() - startTime
      this.logger.info('🧹 Cache invalidation completed', {
        pattern: pattern.toString(),
        removedCount,
        duration,
        cascade: options.cascade,
      })

      return removedCount
    } catch (error) {
      this.logger.error('❌ Cache invalidation failed', {
        pattern: pattern.toString(),
        error: error.message,
      })
      return 0
    }
  }

  /**
   * @method mget
   * @description Recupera múltiplas chaves do cache de forma otimizada
   * @param {Array<string>} keys - Array de chaves
   * @param {Object} options - Opções adicionais
   * @returns {Object} Objeto com resultados
   */
  mget(keys, options = {}) {
    const startTime = Date.now()
    const results = {}
    const notFound = []

    for (const key of keys) {
      const value = this.get(key, { ...options, skipMetrics: true })
      if (value !== null) {
        results[key] = value
      } else {
        notFound.push(key)
      }
    }

    // Carregamento preditivo para chaves não encontradas
    if (notFound.length > 0 && this.config.enablePredictiveLoading) {
      this.triggerBatchPredictiveLoading(notFound, options)
    }

    const duration = Date.now() - startTime
    this.updatePerformanceMetrics('mget', duration, keys.length)

    this.logger.debug('📦 Multi-get completed', {
      requestedKeys: keys.length,
      foundKeys: Object.keys(results).length,
      notFoundKeys: notFound.length,
      duration,
    })

    return {
      found: results,
      notFound,
      hitRate: ((Object.keys(results).length / keys.length) * 100).toFixed(2) + '%',
    }
  }

  /**
   * @method mset
   * @description Armazena múltiplas chaves de forma otimizada
   * @param {Object} entries - Objeto com chave-valor
   * @param {number} ttl - TTL padrão
   * @param {Object} options - Opções adicionais
   * @returns {Object} Resultado da operação
   */
  mset(entries, ttl = this.config.defaultTTL, options = {}) {
    const startTime = Date.now()
    const results = { successful: [], failed: [] }

    for (const [key, value] of Object.entries(entries)) {
      try {
        const success = this.set(key, value, ttl, { ...options, skipMetrics: true })
        if (success) {
          results.successful.push(key)
        } else {
          results.failed.push(key)
        }
      } catch (error) {
        results.failed.push(key)
        this.logger.error('❌ Multi-set item failed', {
          key,
          error: error.message,
        })
      }
    }

    const duration = Date.now() - startTime
    this.updatePerformanceMetrics('mset', duration, Object.keys(entries).length)

    this.logger.debug('📦 Multi-set completed', {
      totalEntries: Object.keys(entries).length,
      successful: results.successful.length,
      failed: results.failed.length,
      duration,
    })

    return results
  }

  /**
   * @method cleanup
   * @description Limpeza inteligente do cache
   * @param {Object} options - Opções de limpeza
   */
  cleanup(options = {}) {
    const startTime = Date.now()
    let cleanedEntries = 0

    const { force = false, maxAge = null, pattern = null, freeMemoryPercent = null } = options

    try {
      const now = Date.now()
      const keysToRemove = []

      for (const [key, entry] of this.cache) {
        let shouldRemove = false

        // Verificar expiração
        if (this.isExpired(entry)) {
          shouldRemove = true
        }

        // Verificar idade máxima
        if (maxAge && now - entry.timestamp > maxAge) {
          shouldRemove = true
        }

        // Verificar padrão
        if (pattern && pattern.test(key)) {
          shouldRemove = true
        }

        // Remoção forçada
        if (force) {
          shouldRemove = true
        }

        if (shouldRemove) {
          keysToRemove.push(key)
        }
      }

      // Remover entradas
      for (const key of keysToRemove) {
        this.cache.delete(key)
        this.sizeTracker.delete(key)
        this.accessHistory.delete(key)
        cleanedEntries++
      }

      // Limpeza por percentual de memória
      if (freeMemoryPercent) {
        cleanedEntries += this.freeMemoryByPercent(freeMemoryPercent)
      }

      this.statistics.evictions += cleanedEntries

      const duration = Date.now() - startTime
      this.logger.info('🧹 Cache cleanup completed', {
        cleanedEntries,
        remainingEntries: this.cache.size,
        duration,
        options,
      })
    } catch (error) {
      this.logger.error('❌ Cache cleanup failed', {
        error: error.message,
      })
    }
  }

  /**
   * @method getAdvancedStats
   * @description Obtém estatísticas avançadas do cache
   * @returns {Object} Estatísticas detalhadas
   */
  getAdvancedStats() {
    const total = this.statistics.hits + this.statistics.misses
    const hitRate = total > 0 ? ((this.statistics.hits / total) * 100).toFixed(2) + '%' : '0%'

    const memoryUsage = this.calculateMemoryUsage()
    const topKeys = this.getTopAccessedKeys()
    const performanceSummary = this.getPerformanceSummary()

    return {
      // Estatísticas básicas
      basic: {
        ...this.statistics,
        hitRate,
        size: this.cache.size,
        maxSize: this.config.maxSize,
      },

      // Uso de memória
      memory: {
        totalSize: memoryUsage.total,
        averageEntrySize: memoryUsage.average,
        compressionRatio: this.calculateCompressionRatio(),
        largestEntry: memoryUsage.largest,
      },

      // Padrões de acesso
      access: {
        topKeys: topKeys.slice(0, 10),
        accessPatterns: this.analyzeAccessPatterns(),
        hotKeys: Array.from(this.statistics.hotKeys.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5),
      },

      // Performance
      performance: performanceSummary,

      // Configuração
      config: this.config,

      // Saúde do sistema
      health: {
        isHealthy: this.isHealthy(),
        recommendations: this.generateRecommendations(),
        alerts: this.generateAlerts(),
      },
    }
  }

  /**
   * @method performSmartEviction
   * @description Executa despejo inteligente baseado em estratégias
   */
  performSmartEviction() {
    const targetSize = Math.floor(this.config.maxSize * 0.8) // Remover 20%
    const currentSize = this.cache.size

    if (currentSize <= targetSize) return

    const toRemove = currentSize - targetSize
    let removedCount = 0

    this.logger.info('🧠 Starting smart eviction', {
      currentSize,
      targetSize,
      toRemove,
      strategy: this.evictionStrategy,
    })

    switch (this.evictionStrategy) {
      case 'lru':
        removedCount = this.evictLRU(toRemove)
        break
      case 'lfu':
        removedCount = this.evictLFU(toRemove)
        break
      case 'adaptive':
        removedCount = this.evictAdaptive(toRemove)
        break
      default:
        removedCount = this.evictLRU(toRemove)
    }

    this.statistics.smartEvictions += removedCount
    this.statistics.evictions += removedCount

    this.logger.info('✅ Smart eviction completed', {
      removedCount,
      newSize: this.cache.size,
      strategy: this.evictionStrategy,
    })
  }

  // ============== MÉTODOS AUXILIARES ==============

  /**
   * @method createCachePayload
   * @description Cria payload para armazenamento no cache
   */
  createCachePayload(value, ttl, options) {
    return {
      data: value,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
      accessed: Date.now(),
      accessCount: 1,
      compressed: false,
      version: options.version || '1.0',
      metadata: options.metadata || {},
    }
  }

  /**
   * @method isExpired
   * @description Verifica se uma entrada está expirada
   */
  isExpired(entry) {
    return Date.now() > entry.expiry
  }

  /**
   * @method shouldCompress
   * @description Determina se deve comprimir um valor
   */
  shouldCompress(size, options) {
    if (!this.config.enableCompression) return false
    if (options.noCompression) return false
    return size > this.config.compressionThreshold
  }

  /**
   * @method calculateSerializedSize
   * @description Calcula tamanho serializado aproximado
   */
  calculateSerializedSize(payload) {
    try {
      return JSON.stringify(payload).length * 2 // Aproximação UTF-16
    } catch {
      return 1000 // Fallback
    }
  }

  /**
   * @method compress
   * @description Comprime dados usando LZString ou fallback
   */
  compress(data) {
    try {
      const serialized = JSON.stringify(data)
      return this.compressionEngine.compress(serialized)
    } catch (error) {
      this.logger.warn('⚠️ Compression failed, storing uncompressed', {
        error: error.message,
      })
      return data
    }
  }

  /**
   * @method decompress
   * @description Descomprime dados
   */
  decompress(compressedData) {
    try {
      const decompressed = this.compressionEngine.decompress(compressedData)
      return JSON.parse(decompressed)
    } catch (error) {
      this.logger.error('❌ Decompression failed', {
        error: error.message,
      })
      return compressedData
    }
  }

  /**
   * @method initializeCompression
   * @description Inicializa engine de compressão
   */
  initializeCompression() {
    // Tentar usar LZString se disponível
    if (typeof window !== 'undefined' && window.LZString) {
      return window.LZString
    }

    // Fallback básico
    return {
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
    }
  }

  /**
   * @method startAutomaticCleanup
   * @description Inicia limpeza automática
   */
  startAutomaticCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup({ maxAge: this.config.defaultTTL * 2 })
    }, this.config.cleanupInterval)
  }

  /**
   * @method updateSetStatistics
   * @description Atualiza estatísticas de armazenamento
   */
  updateSetStatistics(key, size, options) {
    this.statistics.totalSize += size

    // Atualizar hot keys
    const hotCount = this.statistics.hotKeys.get(key) || 0
    this.statistics.hotKeys.set(key, hotCount + 1)
  }

  /**
   * @method updateAccessHistory
   * @description Atualiza histórico de acesso
   */
  updateAccessHistory(key) {
    const history = this.accessHistory.get(key) || {
      count: 0,
      lastAccess: 0,
      firstAccess: Date.now(),
    }

    history.count++
    history.lastAccess = Date.now()

    this.accessHistory.set(key, history)
  }

  /**
   * @method recordAccessPattern
   * @description Registra padrão de acesso
   */
  recordAccessPattern(key, type, options) {
    const pattern = `${type}_${options.source || 'unknown'}`
    const current = this.accessPatterns.get(pattern) || 0
    this.accessPatterns.set(pattern, current + 1)
  }

  /**
   * @method updatePerformanceMetrics
   * @description Atualiza métricas de performance
   */
  updatePerformanceMetrics(operation, duration, size) {
    this.performanceMetrics.push({
      operation,
      duration,
      size,
      timestamp: Date.now(),
    })

    // Manter apenas as últimas 1000 métricas
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics.shift()
    }
  }

  /**
   * @method isMemoryLimitReached
   * @description Verifica se limite de memória foi atingido
   */
  isMemoryLimitReached() {
    return this.cache.size >= this.config.maxSize
  }

  /**
   * @method evictLRU
   * @description Despejo Least Recently Used
   */
  evictLRU(count) {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, lastAccess: entry.accessed }))
      .sort((a, b) => a.lastAccess - b.lastAccess)
      .slice(0, count)

    for (const { key } of entries) {
      this.cache.delete(key)
      this.sizeTracker.delete(key)
      this.accessHistory.delete(key)
    }

    return entries.length
  }

  /**
   * @method evictLFU
   * @description Despejo Least Frequently Used
   */
  evictLFU(count) {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, accessCount: entry.accessCount }))
      .sort((a, b) => a.accessCount - b.accessCount)
      .slice(0, count)

    for (const { key } of entries) {
      this.cache.delete(key)
      this.sizeTracker.delete(key)
      this.accessHistory.delete(key)
    }

    return entries.length
  }

  /**
   * @method evictAdaptive
   * @description Despejo adaptativo baseado em múltricos fatores
   */
  evictAdaptive(count) {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => {
        const score = this.calculateEvictionScore(key, entry)
        return { key, score }
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, count)

    for (const { key } of entries) {
      this.cache.delete(key)
      this.sizeTracker.delete(key)
      this.accessHistory.delete(key)
    }

    return entries.length
  }

  /**
   * @method calculateEvictionScore
   * @description Calcula score para despejo adaptativo
   */
  calculateEvictionScore(key, entry) {
    const age = Date.now() - entry.timestamp
    const timeSinceAccess = Date.now() - entry.accessed
    const size = this.sizeTracker.get(key) || 1000

    // Score menor = maior prioridade para remoção
    const ageScore = age / 1000 // Pontos por segundo de idade
    const accessScore = timeSinceAccess / 1000 // Pontos por segundo sem acesso
    const sizeScore = size / 1000 // Pontos por KB
    const frequencyScore = 1000 / (entry.accessCount + 1) // Inverso da frequência

    return ageScore + accessScore + sizeScore + frequencyScore
  }

  // Métodos auxiliares para estatísticas
  calculateMemoryUsage() {
    const sizes = Array.from(this.sizeTracker.values())
    const total = sizes.reduce((sum, size) => sum + size, 0)

    return {
      total,
      average: sizes.length > 0 ? total / sizes.length : 0,
      largest: sizes.length > 0 ? Math.max(...sizes) : 0,
    }
  }

  calculateCompressionRatio() {
    if (this.statistics.compressions === 0) return 1

    // Simplificação - ratio real requer mais dados
    return 0.6 // Aproximação de 60% do tamanho original
  }

  getTopAccessedKeys() {
    return Array.from(this.accessHistory.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, data]) => ({ key, ...data }))
  }

  analyzeAccessPatterns() {
    return Array.from(this.accessPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }))
  }

  getPerformanceSummary() {
    const recent = this.performanceMetrics.slice(-100)
    if (recent.length === 0) return {}

    const avgDuration = recent.reduce((sum, m) => sum + m.duration, 0) / recent.length
    const operations = recent.reduce((acc, m) => {
      acc[m.operation] = (acc[m.operation] || 0) + 1
      return acc
    }, {})

    return {
      averageDuration: Math.round(avgDuration),
      operationCounts: operations,
      recentSamples: recent.length,
    }
  }

  isHealthy() {
    const total = this.statistics.hits + this.statistics.misses
    const hitRate = total > 0 ? this.statistics.hits / total : 1

    return (
      hitRate >= 0.5 && // Hit rate acima de 50%
      this.cache.size < this.config.maxSize * 0.9 && // Não está quase cheio
      this.statistics.averageAccessTime < 100
    ) // Acesso rápido
  }

  generateRecommendations() {
    const recommendations = []
    const stats = this.getAdvancedStats()

    if (parseFloat(stats.basic.hitRate) < 50) {
      recommendations.push('Consider increasing TTL values or cache size')
    }

    if (this.cache.size > this.config.maxSize * 0.8) {
      recommendations.push('Cache is near capacity - consider increasing maxSize')
    }

    if (stats.performance.averageDuration > 50) {
      recommendations.push('Consider enabling compression or optimizing data structure')
    }

    return recommendations
  }

  generateAlerts() {
    const alerts = []

    if (this.cache.size >= this.config.maxSize) {
      alerts.push({ level: 'critical', message: 'Cache is at maximum capacity' })
    }

    const total = this.statistics.hits + this.statistics.misses
    const hitRate = total > 0 ? this.statistics.hits / total : 1

    if (hitRate < 0.3) {
      alerts.push({ level: 'warning', message: 'Cache hit rate is very low' })
    }

    return alerts
  }

  // Métodos preditivos (placeholders)
  updatePredictiveModel(key, value, options) {
    // Implementação futura
  }

  triggerPredictiveLoading(key, options) {
    // Implementação futura
  }

  triggerBatchPredictiveLoading(keys, options) {
    // Implementação futura
  }

  performCascadeInvalidation(pattern, options) {
    // Implementação futura
  }

  freeMemoryByPercent(percent) {
    const targetCount = Math.floor(this.cache.size * (percent / 100))
    return this.performSmartEviction(targetCount)
  }

  /**
   * @method destroy
   * @description Limpa recursos e para intervalos
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }

    this.cache.clear()
    this.accessHistory.clear()
    this.sizeTracker.clear()

    this.logger.info('🧹 IntelligentCache destroyed')
  }
}

export default IntelligentCacheAdvanced
