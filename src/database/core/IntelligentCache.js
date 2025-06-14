import performanceMonitor from '../../utils/metrics/performanceMonitor.js'
import sharedLogger from '../../utils/logger.js'
import { getSystemOrchestrator } from '../../utils/core/SystemOrchestrator.js'

// Usar o logger centralizado
const logger = sharedLogger;

class IntelligentCache {
  constructor(config = {}) {
    this.config = {
      maxSize: 100,
      ttl: 300000, // 5 minutos
      cleanupInterval: 60000, // 1 minuto
      compressionThreshold: 1024,
      // 🎯 Configurações para integração de métricas
      metricsEnabled: true,
      syncWithOrchestrator: true,
      persistentStorage: true,
      ...config,
    }
    this.cache = new Map()
    this.accessTimes = new Map()
    this.hitCount = 0
    this.missCount = 0
    this.cleanupTimer = null
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
    }

    // 🎯 INTEGRAÇÃO COM SYSTEM ORCHESTRATOR
    this.orchestratorRef = null
    this.initializeOrchestrator()

    this.startCleanupTimer()
    logger.info('IntelligentCache initialized', {
      config: this.config,
      maxSize: this.config.maxSize,
      metricsEnabled: this.config.metricsEnabled,
    })
  }  // 🎯 CONFIGURAÇÃO DO SYSTEM ORCHESTRATOR
  async initializeOrchestrator() {
    if (!this.config.syncWithOrchestrator) return

    try {
      this.orchestratorRef = await getSystemOrchestrator()
      logger.info('🎯 SystemOrchestrator integrado com IntelligentCache')
    } catch (error) {
      logger.error('Erro ao integrar SystemOrchestrator com IntelligentCache:', error)
      // Tentar novamente em caso de erro
      setTimeout(() => this.initializeOrchestrator(), 2000)
    }
  }

  // **Operações Básicas de Cache com Métricas**
  set(key, value, customTtl = null) {
    try {
      const ttl = customTtl || this.config.ttl
      const size = this.estimateSize(value)

      // Compressão para objetos grandes
      let processedValue = value
      if (size > this.config.compressionThreshold) {
        processedValue = this.compress(value)
        this.statistics.compressions++
      }

      const entry = {
        value: processedValue,
        timestamp: Date.now(),
        ttl,
        size,
        accessCount: 1,
        lastAccess: Date.now(),
        compressed: size > this.config.compressionThreshold,
      }

      // Verificar espaço disponível
      if (this.cache.size >= this.config.maxSize) {
        this.evictLeastUsed()
      }

      this.cache.set(key, entry)
      this.accessTimes.set(key, Date.now())

      // 🎯 Enviar métricas de cache para SystemOrchestrator
      this.sendCacheMetrics('cache_set', {
        key: this.sanitizeKey(key),
        size,
        compressed: entry.compressed,
        cacheSize: this.cache.size,
      })

      logger.debug('Cache entry set', {
        key: this.sanitizeKey(key),
        size,
        compressed: entry.compressed,
        cacheSize: this.cache.size,
      })

      return true
    } catch (error) {
      logger.error('Error setting cache entry', {
        key: this.sanitizeKey(key),
        error: error.message,
      })
      return false
    }
  }

  get(key) {
    try {
      const entry = this.cache.get(key)

      if (!entry) {
        this.statistics.misses++
        this.missCount++

        // 🎯 Enviar métrica de cache miss
        this.sendCacheMetrics('cache_miss', {
          key: this.sanitizeKey(key),
        })

        return null
      }

      // Verificar expiração
      if (this.isExpired(entry)) {
        this.delete(key)
        this.statistics.misses++
        this.missCount++

        // 🎯 Enviar métrica de cache expired
        this.sendCacheMetrics('cache_expired', {
          key: this.sanitizeKey(key),
          age: Date.now() - entry.timestamp,
        })

        return null
      }

      // Atualizar estatísticas de acesso
      entry.accessCount++
      entry.lastAccess = Date.now()
      this.accessTimes.set(key, Date.now())
      this.statistics.hits++
      this.hitCount++

      // 🎯 Enviar métrica de cache hit
      this.sendCacheMetrics('cache_hit', {
        key: this.sanitizeKey(key),
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp,
      })

      // Descomprimir se necessário
      let value = entry.value
      if (entry.compressed) {
        value = this.decompress(entry.value)
      }

      logger.debug('Cache hit', {
        key: this.sanitizeKey(key),
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp,
      })

      return value
    } catch (error) {
      logger.error('Error getting cache entry', {
        key: this.sanitizeKey(key),
        error: error.message,
      })
      this.statistics.misses++
      return null
    }
  }

  // 🎯 ENVIO DE MÉTRICAS PARA SYSTEM ORCHESTRATOR
  async sendCacheMetrics(eventType, metricData) {
    if (!this.config.metricsEnabled || !this.orchestratorRef) return

    try {
      const cacheMetrics = {
        type: 'cache_metrics',
        eventType,
        timestamp: Date.now(),
        cacheStatistics: this.getStatistics(),
        ...metricData,
      }

      await this.orchestratorRef.processBehavioralMetrics('cache_session', cacheMetrics)
    } catch (error) {
      logger.error('Erro ao enviar métricas de cache para SystemOrchestrator:', error)
    }
  }

  // 🎯 ARMAZENAMENTO PERSISTENTE INTEGRADO
  async setWithPersistence(key, value, customTtl = null, options = {}) {
    // Salvar no cache em memória
    const cacheResult = this.set(key, value, customTtl)

    // Salvar no armazenamento persistente se habilitado
    if (this.config.persistentStorage && options.persist !== false) {
      try {
        const persistentKey = this.getPersistentKey(key)
        const persistentData = {
          value,
          timestamp: Date.now(),
          ttl: customTtl || this.config.ttl,
          compressed: false,
        }

        localStorage.setItem(persistentKey, JSON.stringify(persistentData))

        // 🎯 Enviar métrica de persistência
        this.sendCacheMetrics('cache_persist', {
          key: this.sanitizeKey(key),
          size: this.estimateSize(value),
        })
      } catch (error) {
        logger.error('Erro ao salvar no armazenamento persistente:', error)
      }
    }

    return cacheResult
  }

  async getWithFallback(key, fallbackProvider = null) {
    // Tentar cache em memória primeiro
    let value = this.get(key)
    if (value !== null) return value

    // Tentar armazenamento persistente
    if (this.config.persistentStorage) {
      value = this.getFromPersistent(key)
      if (value !== null) {
        // Restaurar no cache em memória
        this.set(key, value)
        return value
      }
    }

    // Usar fallback provider se disponível
    if (fallbackProvider && typeof fallbackProvider === 'function') {
      try {
        value = await fallbackProvider()
        if (value !== null) {
          this.setWithPersistence(key, value)
          return value
        }
      } catch (error) {
        logger.error('Erro no fallback provider:', error)
      }
    }

    return null
  }

  getFromPersistent(key) {
    try {
      const persistentKey = this.getPersistentKey(key)
      const stored = localStorage.getItem(persistentKey)

      if (!stored) return null

      const persistentData = JSON.parse(stored)

      // Verificar expiração
      if (Date.now() - persistentData.timestamp > persistentData.ttl) {
        localStorage.removeItem(persistentKey)
        return null
      }

      return persistentData.value
    } catch (error) {
      logger.error('Erro ao ler armazenamento persistente:', error)
      return null
    }
  }

  // **Métodos Utilitários**
  sanitizeKey(key) {
    // Remove informações sensíveis da chave para logs
    if (typeof key === 'string' && key.includes('user_')) {
      return key.replace(/user_\d+/, 'user_***')
    }
    return key
  }

  getPersistentKey(key) {
    return `betina_cache_${key}`
  }

  getStatistics() {
    const total = this.statistics.hits + this.statistics.misses
    return {
      ...this.statistics,
      hitRate: total > 0 ? ((this.statistics.hits / total) * 100).toFixed(2) : '0',
      cacheSize: this.cache.size,
      maxSize: this.config.maxSize,
      memoryUsage: this.estimateMemoryUsage(),
    }
  }

  // **Limpeza e Evicção de Cache**
  evictLeastUsed() {
    let leastUsedKey = null
    let leastUsedScore = Infinity

    for (const [key, entry] of this.cache.entries()) {
      // Score baseado em frequência e recência
      const frequency = entry.accessCount
      const recency = Date.now() - entry.lastAccess
      const score = frequency - recency / 1000 // Menor score = menos usado

      if (score < leastUsedScore) {
        leastUsedScore = score
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.delete(leastUsedKey)
      this.statistics.evictions++
      logger.debug('Evicted least used entry', {
        key: leastUsedKey,
        score: leastUsedScore,
      })
    }
  }

  evictExpired() {
    const now = Date.now()
    const expiredKeys = []

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach((key) => this.delete(key))

    if (expiredKeys.length > 0) {
      logger.debug('Evicted expired entries', { count: expiredKeys.length })
    }

    return expiredKeys.length
  }

  // **Cache Inteligente com Predição**
  prefetch(key, valueProvider, priority = 'normal') {
    // Cache preditivo baseado em padrões de acesso
    if (!this.cache.has(key)) {
      const accessPattern = this.analyzeAccessPattern(key)
      if (accessPattern.shouldPrefetch || priority === 'high') {
        this.fetchAndCache(key, valueProvider)
      }
    }
  }

  async fetchAndCache(key, valueProvider) {
    try {
      const value = await valueProvider()
      this.set(key, value)
      logger.debug('Prefetched and cached', { key })
      return value
    } catch (error) {
      logger.error('Error in prefetch', { key, error: error.message })
      return null
    }
  }

  analyzeAccessPattern(key) {
    const baseKey = this.extractBaseKey(key)
    const relatedKeys = [...this.accessTimes.keys()].filter((k) => k.startsWith(baseKey))

    const recentAccesses = relatedKeys.filter(
      (k) => Date.now() - this.accessTimes.get(k) < 60000
    ).length

    return {
      shouldPrefetch: recentAccesses > 2,
      confidence: Math.min(recentAccesses / 5, 1),
      relatedKeys: relatedKeys.length,
    }
  }

  // **Cache Multi-Camadas**
  setWithTiers(key, value, tiers = ['memory', 'persistent']) {
    // Implementar cache em múltiplas camadas
    const success = { memory: false, persistent: false }

    if (tiers.includes('memory')) {
      success.memory = this.set(key, value)
    }

    if (tiers.includes('persistent')) {
      success.persistent = this.setPersistent(key, value)
    }

    return success
  }

  setPersistent(key, value) {
    try {
      // Simular persistência (localStorage ou IndexedDB)
      if (typeof window !== 'undefined' && window.localStorage) {
        const entry = {
          value,
          timestamp: Date.now(),
          ttl: this.config.ttl,
        }
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
        return true
      }
      return false
    } catch (error) {
      logger.error('Error setting persistent cache', { key, error: error.message })
      return false
    }
  }

  // **Utilitários e Estatísticas**
  getStatistics() {
    const hitRate = this.hitCount + this.missCount > 0 
      ? ((this.hitCount / (this.hitCount + this.missCount)) * 100).toFixed(2) + '%'
      : '0%'

    return {
      ...this.statistics,
      hitRate,
      totalEntries: this.cache.size,
      memoryUsage: this.calculateMemoryUsage(),
      averageAge: this.calculateAverageAge(),
      config: this.config,
    }
  }

  calculateMemoryUsage() {
    let totalSize = 0
    for (const entry of this.cache.values()) {
      totalSize += entry.size || 0
    }
    return {
      bytes: totalSize,
      mb: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
    }
  }

  calculateAverageAge() {
    if (this.cache.size === 0) return 0

    const now = Date.now()
    let totalAge = 0

    for (const entry of this.cache.values()) {
      totalAge += now - entry.timestamp
    }

    return Math.round(totalAge / this.cache.size / 1000) // segundos
  }

  // **Compressão Simples**
  compress(value) {
    try {
      return JSON.stringify(value)
    } catch (error) {
      logger.error('Compression error', { error: error.message })
      return value
    }
  }

  decompress(compressedValue) {
    try {
      return JSON.parse(compressedValue)
    } catch (error) {
      logger.error('Decompression error', { error: error.message })
      return compressedValue
    }
  }

  // **Utilitários Internos**
  isExpired(entry) {
    return Date.now() - entry.timestamp > entry.ttl
  }

  estimateSize(value) {
    try {
      return JSON.stringify(value).length
    } catch {
      return 100 // Estimativa padrão
    }
  }

  extractBaseKey(key) {
    return key.split(':')[0] || key
  }

  resetStatistics() {
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
    }
    this.hitCount = 0
    this.missCount = 0
  }

  startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }

    this.cleanupTimer = setInterval(() => {
      this.evictExpired()
    }, this.config.cleanupInterval)
  }

  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  destroy() {
    this.stopCleanupTimer()
    this.clear()
    logger.info('IntelligentCache destroyed')
  }

  /**
   * Obtém estatísticas do cache
   * @returns {Object} Estatísticas do cache
   */
  getStats() {
    const hitRate = this.hitCount + this.missCount > 0 
      ? ((this.hitCount / (this.hitCount + this.missCount)) * 100).toFixed(2) + '%'
      : '0%'

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate,
      statistics: this.statistics,
      compressionEnabled: this.config.compressionThreshold > 0,
      metricsEnabled: this.config.metricsEnabled,
      orchestratorConnected: !!this.orchestratorRef
    }
  }

  /**
   * Limpa todas as entradas do cache
   */
  clear() {
    this.cache.clear();
    this.accessTimes.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
    };
    
    logger.info('Cache cleared');
  }
}

export default IntelligentCache
