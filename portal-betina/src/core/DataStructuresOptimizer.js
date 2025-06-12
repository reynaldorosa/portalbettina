/**
 * DATA STRUCTURES OPTIMIZER - SISTEMA DE OTIMIZAÇÃO DE ESTRUTURAS DE DADOS
 * Sistema para implementar e otimizar estruturas de dados apropriadas
 *
 * @version 1.0.0
 * @created 2025-01-08
 * @purpose Otimização de estruturas de dados e algoritmos
 */

import logger from '../utils/logger.js'

// Tipos de estruturas de dados otimizadas
export const DATA_STRUCTURE_TYPES = {
  HASH_MAP: 'hash_map',
  TREE_MAP: 'tree_map',
  LRU_CACHE: 'lru_cache',
  PRIORITY_QUEUE: 'priority_queue',
  TRIE: 'trie',
  BLOOM_FILTER: 'bloom_filter',
  DISJOINT_SET: 'disjoint_set',
  SEGMENT_TREE: 'segment_tree',
}

// Configurações otimizadas para autismo
const AUTISM_DATA_OPTIMIZATION = {
  cacheSize: 1000,
  prefetchThreshold: 0.8,
  compressionRatio: 0.7,
  indexingStrategy: 'btree',
  memoryLimit: 100 * 1024 * 1024, // 100MB
  performanceThresholds: {
    search: 10, // ms
    insert: 5, // ms
    delete: 5, // ms
    update: 3, // ms
  },
}

/**
 * Cache LRU otimizado para dados de autismo
 */
class OptimizedLRUCache {
  constructor(capacity = AUTISM_DATA_OPTIMIZATION.cacheSize) {
    this.capacity = capacity
    this.cache = new Map()
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0,
    }
  }

  get(key) {
    this.statistics.totalRequests++

    if (this.cache.has(key)) {
      this.statistics.hits++
      const value = this.cache.get(key)
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    } else {
      this.statistics.misses++
      return null
    }
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // Update existing
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
      this.statistics.evictions++
    }

    this.cache.set(key, value)
  }

  getHitRate() {
    return this.statistics.totalRequests > 0
      ? this.statistics.hits / this.statistics.totalRequests
      : 0
  }

  getStatistics() {
    return {
      ...this.statistics,
      hitRate: this.getHitRate(),
      size: this.cache.size,
      capacity: this.capacity,
    }
  }

  clear() {
    this.cache.clear()
    this.statistics = { hits: 0, misses: 0, evictions: 0, totalRequests: 0 }
  }
}

/**
 * Trie otimizada para sugestões e busca
 */
class OptimizedTrie {
  constructor() {
    this.root = { children: new Map(), isWord: false, frequency: 0 }
    this.wordCount = 0
  }

  insert(word, frequency = 1) {
    let node = this.root

    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), isWord: false, frequency: 0 })
      }
      node = node.children.get(char)
    }

    if (!node.isWord) {
      this.wordCount++
    }

    node.isWord = true
    node.frequency += frequency
  }

  search(word) {
    let node = this.root

    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        return false
      }
      node = node.children.get(char)
    }

    return node.isWord
  }

  startsWith(prefix) {
    let node = this.root

    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return false
      }
      node = node.children.get(char)
    }

    return true
  }

  getSuggestions(prefix, limit = 10) {
    let node = this.root

    // Navigate to prefix
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return []
      }
      node = node.children.get(char)
    }

    // Collect all words with this prefix
    const suggestions = []
    this.collectWords(node, prefix, suggestions)

    // Sort by frequency and limit
    return suggestions
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map((item) => item.word)
  }

  collectWords(node, prefix, results) {
    if (node.isWord) {
      results.push({ word: prefix, frequency: node.frequency })
    }

    for (const [char, childNode] of node.children.entries()) {
      this.collectWords(childNode, prefix + char, results)
    }
  }

  getSize() {
    return this.wordCount
  }
}

/**
 * Priority Queue otimizada para processamento de dados
 */
class OptimizedPriorityQueue {
  constructor(compareFn = (a, b) => a.priority - b.priority) {
    this.heap = []
    this.compare = compareFn
  }

  enqueue(item, priority) {
    const element = { item, priority }
    this.heap.push(element)
    this.heapifyUp(this.heap.length - 1)
  }

  dequeue() {
    if (this.isEmpty()) return null

    const root = this.heap[0]
    const lastElement = this.heap.pop()

    if (!this.isEmpty()) {
      this.heap[0] = lastElement
      this.heapifyDown(0)
    }

    return root.item
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0].item
  }

  isEmpty() {
    return this.heap.length === 0
  }

  size() {
    return this.heap.length
  }

  heapifyUp(index) {
    const parentIndex = Math.floor((index - 1) / 2)

    if (parentIndex >= 0 && this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
      this.swap(index, parentIndex)
      this.heapifyUp(parentIndex)
    }
  }

  heapifyDown(index) {
    const leftChild = 2 * index + 1
    const rightChild = 2 * index + 2
    let smallest = index

    if (
      leftChild < this.heap.length &&
      this.compare(this.heap[leftChild], this.heap[smallest]) < 0
    ) {
      smallest = leftChild
    }

    if (
      rightChild < this.heap.length &&
      this.compare(this.heap[rightChild], this.heap[smallest]) < 0
    ) {
      smallest = rightChild
    }

    if (smallest !== index) {
      this.swap(index, smallest)
      this.heapifyDown(smallest)
    }
  }

  swap(i, j) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }
}

/**
 * Bloom Filter para verificação rápida de existência
 */
class OptimizedBloomFilter {
  constructor(expectedElements = 10000, falsePositiveRate = 0.01) {
    this.expectedElements = expectedElements
    this.falsePositiveRate = falsePositiveRate

    // Calculate optimal parameters
    this.bitArraySize = Math.ceil(
      (-expectedElements * Math.log(falsePositiveRate)) / (Math.log(2) * Math.log(2))
    )
    this.hashFunctions = Math.ceil((this.bitArraySize * Math.log(2)) / expectedElements)

    this.bitArray = new Array(this.bitArraySize).fill(false)
    this.addedElements = 0
  }

  add(item) {
    const hashes = this.getHashes(item)

    for (const hash of hashes) {
      this.bitArray[hash % this.bitArraySize] = true
    }

    this.addedElements++
  }

  mightContain(item) {
    const hashes = this.getHashes(item)

    for (const hash of hashes) {
      if (!this.bitArray[hash % this.bitArraySize]) {
        return false
      }
    }

    return true
  }

  getHashes(item) {
    const str = typeof item === 'string' ? item : JSON.stringify(item)
    const hashes = []

    for (let i = 0; i < this.hashFunctions; i++) {
      hashes.push(this.hash(str, i))
    }

    return hashes
  }

  hash(str, seed = 0) {
    let hash = seed

    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff
    }

    return Math.abs(hash)
  }

  getCurrentFalsePositiveRate() {
    const ratio = this.addedElements / this.expectedElements
    return Math.pow(1 - Math.exp(-this.hashFunctions * ratio), this.hashFunctions)
  }

  getStatistics() {
    return {
      bitArraySize: this.bitArraySize,
      hashFunctions: this.hashFunctions,
      addedElements: this.addedElements,
      expectedElements: this.expectedElements,
      targetFalsePositiveRate: this.falsePositiveRate,
      currentFalsePositiveRate: this.getCurrentFalsePositiveRate(),
      memoryUsage: this.bitArraySize / 8, // bytes
    }
  }
}

/**
 * Sistema principal de otimização de estruturas de dados
 */
class DataStructuresOptimizer {
  constructor() {
    this.caches = new Map()
    this.tries = new Map()
    this.priorityQueues = new Map()
    this.bloomFilters = new Map()

    this.statistics = {
      totalStructures: 0,
      memoryUsage: 0,
      operationsCount: 0,
      averageResponseTime: 0,
      optimizationsSuggested: 0,
    }

    this.performanceMetrics = {
      search: [],
      insert: [],
      delete: [],
      update: [],
    }

    this.init()
  }

  /**
   * Inicializa o sistema
   */
  init() {
    // Criar estruturas padrão para autismo
    this.createOptimizedCache('userProfiles', 500)
    this.createOptimizedTrie('therapeuticTerms')
    this.createOptimizedPriorityQueue('taskPriority')
    this.createOptimizedBloomFilter('processedData', 50000)

    logger.info('🚀 DataStructuresOptimizer inicializado')
  }

  /**
   * Cria cache LRU otimizado
   */
  createOptimizedCache(name, capacity = AUTISM_DATA_OPTIMIZATION.cacheSize) {
    const cache = new OptimizedLRUCache(capacity)
    this.caches.set(name, cache)
    this.statistics.totalStructures++

    logger.debug(`📦 Cache LRU criado: ${name} (capacidade: ${capacity})`)
    return cache
  }

  /**
   * Cria Trie otimizada
   */
  createOptimizedTrie(name) {
    const trie = new OptimizedTrie()
    this.tries.set(name, trie)
    this.statistics.totalStructures++

    logger.debug(`🌳 Trie criada: ${name}`)
    return trie
  }

  /**
   * Cria Priority Queue otimizada
   */
  createOptimizedPriorityQueue(name, compareFn) {
    const queue = new OptimizedPriorityQueue(compareFn)
    this.priorityQueues.set(name, queue)
    this.statistics.totalStructures++

    logger.debug(`📋 Priority Queue criada: ${name}`)
    return queue
  }

  /**
   * Cria Bloom Filter otimizado
   */
  createOptimizedBloomFilter(name, expectedElements, falsePositiveRate) {
    const filter = new OptimizedBloomFilter(expectedElements, falsePositiveRate)
    this.bloomFilters.set(name, filter)
    this.statistics.totalStructures++

    logger.debug(`🌸 Bloom Filter criado: ${name}`)
    return filter
  }

  /**
   * Obtém cache por nome
   */
  getCache(name) {
    return this.caches.get(name)
  }

  /**
   * Obtém Trie por nome
   */
  getTrie(name) {
    return this.tries.get(name)
  }

  /**
   * Obtém Priority Queue por nome
   */
  getPriorityQueue(name) {
    return this.priorityQueues.get(name)
  }

  /**
   * Obtém Bloom Filter por nome
   */
  getBloomFilter(name) {
    return this.bloomFilters.get(name)
  }

  /**
   * Realiza operação com medição de performance
   */
  measureOperation(operation, operationType, ...args) {
    const startTime = performance.now()

    try {
      const result = operation(...args)
      const duration = performance.now() - startTime

      this.recordPerformanceMetric(operationType, duration)
      this.statistics.operationsCount++

      // Verificar se precisa de otimização
      if (duration > AUTISM_DATA_OPTIMIZATION.performanceThresholds[operationType]) {
        this.suggestOptimization(operationType, duration)
      }

      return result
    } catch (error) {
      logger.error(`Erro na operação ${operationType}:`, error)
      throw error
    }
  }

  /**
   * Registra métrica de performance
   */
  recordPerformanceMetric(type, duration) {
    if (!this.performanceMetrics[type]) {
      this.performanceMetrics[type] = []
    }

    this.performanceMetrics[type].push(duration)

    // Manter apenas últimas 1000 métricas
    if (this.performanceMetrics[type].length > 1000) {
      this.performanceMetrics[type] = this.performanceMetrics[type].slice(-1000)
    }

    // Atualizar média
    this.updateAverageResponseTime()
  }

  /**
   * Atualiza tempo médio de resposta
   */
  updateAverageResponseTime() {
    let totalDuration = 0
    let totalOperations = 0

    Object.values(this.performanceMetrics).forEach((metrics) => {
      totalDuration += metrics.reduce((sum, duration) => sum + duration, 0)
      totalOperations += metrics.length
    })

    this.statistics.averageResponseTime = totalOperations > 0 ? totalDuration / totalOperations : 0
  }

  /**
   * Sugere otimização
   */
  suggestOptimization(operationType, duration) {
    const threshold = AUTISM_DATA_OPTIMIZATION.performanceThresholds[operationType]

    logger.warn(
      `⚠️ Operação ${operationType} lenta: ${duration.toFixed(2)}ms (limite: ${threshold}ms)`
    )

    const suggestion = this.generateOptimizationSuggestion(operationType, duration)

    logger.info(`💡 Sugestão de otimização: ${suggestion.message}`, suggestion)

    this.statistics.optimizationsSuggested++

    return suggestion
  }

  /**
   * Gera sugestão de otimização
   */
  generateOptimizationSuggestion(operationType, duration) {
    const suggestions = {
      search: {
        message: 'Considere implementar indexação ou cache para buscas',
        actions: ['Criar índice B-tree', 'Implementar cache LRU', 'Usar Bloom Filter'],
        priority: 'HIGH',
      },
      insert: {
        message: 'Otimize inserções com batch processing',
        actions: ['Implementar inserção em lote', 'Usar estrutura de dados mais eficiente'],
        priority: 'MEDIUM',
      },
      delete: {
        message: 'Considere soft delete ou lazy deletion',
        actions: ['Implementar soft delete', 'Usar garbage collection'],
        priority: 'MEDIUM',
      },
      update: {
        message: 'Implemente cache write-through ou write-back',
        actions: ['Cache write-through', 'Batch updates', 'Optimistic locking'],
        priority: 'HIGH',
      },
    }

    return {
      ...suggestions[operationType],
      operationType,
      duration,
      threshold: AUTISM_DATA_OPTIMIZATION.performanceThresholds[operationType],
    }
  }

  /**
   * Analisa uso de memória
   */
  analyzeMemoryUsage() {
    let totalMemory = 0
    const analysis = {
      caches: {},
      tries: {},
      priorityQueues: {},
      bloomFilters: {},
      totalMemory: 0,
      memoryBreakdown: {},
    }

    // Analisar caches
    for (const [name, cache] of this.caches.entries()) {
      const stats = cache.getStatistics()
      const memoryEstimate = stats.size * 1024 // Estimativa grosseira
      analysis.caches[name] = { ...stats, memoryEstimate }
      totalMemory += memoryEstimate
    }

    // Analisar Bloom Filters
    for (const [name, filter] of this.bloomFilters.entries()) {
      const stats = filter.getStatistics()
      analysis.bloomFilters[name] = stats
      totalMemory += stats.memoryUsage
    }

    // Analisar Tries (estimativa)
    for (const [name, trie] of this.tries.entries()) {
      const size = trie.getSize()
      const memoryEstimate = size * 100 // Estimativa
      analysis.tries[name] = { size, memoryEstimate }
      totalMemory += memoryEstimate
    }

    // Analisar Priority Queues (estimativa)
    for (const [name, queue] of this.priorityQueues.entries()) {
      const size = queue.size()
      const memoryEstimate = size * 50 // Estimativa
      analysis.priorityQueues[name] = { size, memoryEstimate }
      totalMemory += memoryEstimate
    }

    analysis.totalMemory = totalMemory
    analysis.memoryBreakdown = {
      caches: Object.values(analysis.caches).reduce((sum, c) => sum + c.memoryEstimate, 0),
      tries: Object.values(analysis.tries).reduce((sum, t) => sum + t.memoryEstimate, 0),
      priorityQueues: Object.values(analysis.priorityQueues).reduce(
        (sum, q) => sum + q.memoryEstimate,
        0
      ),
      bloomFilters: Object.values(analysis.bloomFilters).reduce((sum, f) => sum + f.memoryUsage, 0),
    }

    this.statistics.memoryUsage = totalMemory

    return analysis
  }

  /**
   * Otimiza automaticamente estruturas
   */
  autoOptimize() {
    const optimizations = []

    // Otimizar caches com baixa hit rate
    for (const [name, cache] of this.caches.entries()) {
      const stats = cache.getStatistics()

      if (stats.hitRate < 0.5 && stats.totalRequests > 100) {
        // Sugerir aumento de capacidade ou revisão da estratégia
        optimizations.push({
          type: 'CACHE_OPTIMIZATION',
          structure: name,
          issue: 'Baixa hit rate',
          suggestion: 'Aumentar capacidade ou revisar estratégia de cache',
          priority: 'HIGH',
        })
      }
    }

    // Verificar uso de memória
    const memoryAnalysis = this.analyzeMemoryUsage()

    if (memoryAnalysis.totalMemory > AUTISM_DATA_OPTIMIZATION.memoryLimit) {
      optimizations.push({
        type: 'MEMORY_OPTIMIZATION',
        issue: 'Alto uso de memória',
        suggestion: 'Reduzir capacidade de caches ou implementar compressão',
        priority: 'CRITICAL',
        currentUsage: memoryAnalysis.totalMemory,
        limit: AUTISM_DATA_OPTIMIZATION.memoryLimit,
      })
    }

    // Verificar performance
    Object.entries(this.performanceMetrics).forEach(([operation, metrics]) => {
      if (metrics.length > 10) {
        const avgDuration = metrics.reduce((sum, d) => sum + d, 0) / metrics.length
        const threshold = AUTISM_DATA_OPTIMIZATION.performanceThresholds[operation]

        if (avgDuration > threshold) {
          optimizations.push({
            type: 'PERFORMANCE_OPTIMIZATION',
            operation,
            issue: 'Performance abaixo do esperado',
            suggestion: this.generateOptimizationSuggestion(operation, avgDuration),
            priority: 'MEDIUM',
            avgDuration,
            threshold,
          })
        }
      }
    })

    logger.info(`🔧 Auto-otimização executada: ${optimizations.length} otimizações sugeridas`)

    return optimizations
  }

  /**
   * Gera relatório completo
   */
  generateReport() {
    const memoryAnalysis = this.analyzeMemoryUsage()
    const optimizations = this.autoOptimize()

    const report = {
      summary: {
        totalStructures: this.statistics.totalStructures,
        memoryUsage: this.statistics.memoryUsage,
        operationsCount: this.statistics.operationsCount,
        averageResponseTime: this.statistics.averageResponseTime,
        optimizationsSuggested: this.statistics.optimizationsSuggested,
      },
      memoryAnalysis,
      performanceMetrics: this.getPerformanceStatistics(),
      structures: this.getStructuresSummary(),
      optimizations,
      recommendations: this.generateRecommendations(optimizations),
    }

    logger.info('📊 Relatório de estruturas de dados gerado', report.summary)

    return report
  }

  /**
   * Obtém estatísticas de performance
   */
  getPerformanceStatistics() {
    const stats = {}

    Object.entries(this.performanceMetrics).forEach(([operation, metrics]) => {
      if (metrics.length > 0) {
        const sorted = [...metrics].sort((a, b) => a - b)

        stats[operation] = {
          count: metrics.length,
          average: metrics.reduce((sum, d) => sum + d, 0) / metrics.length,
          median: sorted[Math.floor(sorted.length / 2)],
          p95: sorted[Math.floor(sorted.length * 0.95)],
          min: Math.min(...metrics),
          max: Math.max(...metrics),
          threshold: AUTISM_DATA_OPTIMIZATION.performanceThresholds[operation],
        }
      }
    })

    return stats
  }

  /**
   * Obtém resumo das estruturas
   */
  getStructuresSummary() {
    return {
      caches: {
        count: this.caches.size,
        names: Array.from(this.caches.keys()),
      },
      tries: {
        count: this.tries.size,
        names: Array.from(this.tries.keys()),
      },
      priorityQueues: {
        count: this.priorityQueues.size,
        names: Array.from(this.priorityQueues.keys()),
      },
      bloomFilters: {
        count: this.bloomFilters.size,
        names: Array.from(this.bloomFilters.keys()),
      },
    }
  }

  /**
   * Gera recomendações
   */
  generateRecommendations(optimizations) {
    const recommendations = []

    const criticalOptimizations = optimizations.filter((o) => o.priority === 'CRITICAL')
    const highOptimizations = optimizations.filter((o) => o.priority === 'HIGH')

    if (criticalOptimizations.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        type: 'IMMEDIATE_ACTION',
        message: `${criticalOptimizations.length} otimizações críticas necessárias`,
        action: 'Implementar imediatamente para evitar problemas de performance',
      })
    }

    if (highOptimizations.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        type: 'PERFORMANCE_IMPROVEMENT',
        message: `${highOptimizations.length} melhorias de performance recomendadas`,
        action: 'Planejar implementação na próxima sprint',
      })
    }

    if (this.statistics.averageResponseTime > 10) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'GENERAL_OPTIMIZATION',
        message: 'Tempo de resposta geral pode ser melhorado',
        action: 'Revisar algoritmos e implementar caching estratégico',
      })
    }

    return recommendations
  }

  /**
   * Obtém estatísticas
   */
  getStatistics() {
    return {
      ...this.statistics,
      memoryAnalysis: this.analyzeMemoryUsage(),
      performanceStats: this.getPerformanceStatistics(),
      structuresSummary: this.getStructuresSummary(),
    }
  }

  /**
   * Limpa todas as estruturas
   */
  clearAll() {
    // Limpar caches
    this.caches.forEach((cache) => cache.clear())

    // Limpar outras estruturas não têm método clear, então recriar
    this.tries.clear()
    this.priorityQueues.clear()
    this.bloomFilters.clear()

    // Reset statistics
    this.statistics = {
      totalStructures: 0,
      memoryUsage: 0,
      operationsCount: 0,
      averageResponseTime: 0,
      optimizationsSuggested: 0,
    }

    this.performanceMetrics = {
      search: [],
      insert: [],
      delete: [],
      update: [],
    }

    logger.info('🧹 Todas as estruturas de dados foram limpas')
  }
}

// Instância singleton
let optimizerInstance = null

/**
 * Obtém instância do otimizador (singleton)
 */
export const getDataStructuresOptimizer = () => {
  if (!optimizerInstance) {
    optimizerInstance = new DataStructuresOptimizer()
  }
  return optimizerInstance
}

// Exportar classes para uso direto
export { OptimizedLRUCache, OptimizedTrie, OptimizedPriorityQueue, OptimizedBloomFilter }

// Funções utilitárias
export const createCache = (name, capacity) =>
  getDataStructuresOptimizer().createOptimizedCache(name, capacity)
export const createTrie = (name) => getDataStructuresOptimizer().createOptimizedTrie(name)
export const createPriorityQueue = (name, compareFn) =>
  getDataStructuresOptimizer().createOptimizedPriorityQueue(name, compareFn)
export const createBloomFilter = (name, expectedElements, falsePositiveRate) =>
  getDataStructuresOptimizer().createOptimizedBloomFilter(name, expectedElements, falsePositiveRate)
export const generateDataStructuresReport = () => getDataStructuresOptimizer().generateReport()
export const getDataStructuresStats = () => getDataStructuresOptimizer().getStatistics()

export default DataStructuresOptimizer
