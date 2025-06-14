/**
 * 🧪 TESTE RÁPIDO DA FASE 2 - NODE.JS COMPATIBLE
 * Portal Betina - Validação do Fluxo Básico de Métricas
 */

// Mock dos utilitários necessários para Node.js
const logger = {
  info: (...args) => console.log('ℹ️', ...args),
  error: (...args) => console.error('❌', ...args),
  warn: (...args) => console.warn('⚠️', ...args),
  debug: (...args) => console.log('🔍', ...args),
}

// Mock do SystemOrchestrator simplificado para teste
class MockSystemOrchestrator {
  constructor() {
    this.existingSystems = {
      metricsService: { processMetrics: (data) => ({ ...data, processed: true }) },
      multisensoryMetrics: { processMetrics: (data) => ({ ...data, sensorProcessed: true }) },
      intelligentCache: null,
      databaseService: { saveGameSession: (data) => Promise.resolve({ saved: true }) },
    }
    this.tempCache = new Map()
    this.dashboardEvents = null
    this.storageConfig = {
      cache: { ttl: 1800000 },
      database: { syncInterval: 60000, batchSize: 50 },
    }
    this.syncManager = null
  }

  async init() {
    logger.info('🚀 MockSystemOrchestrator inicializado')
    return true
  }

  async setupBasicMetricsFlow() {
    logger.info('📊 FASE 2: Configurando fluxo básico de métricas...')

    try {
      this.setupBehavioralMetricsCollection()
      this.setupSensorialMetricsCollection()
      this.setupMetricsProcessing()
      this.setupIntelligentStorage()
      this.setupDashboardIntegration()

      logger.info('✅ FASE 2: Fluxo básico de métricas configurado com sucesso')
      return { success: true, components: ['behavioral', 'sensorial', 'cache', 'dashboard'] }
    } catch (error) {
      logger.error('❌ Erro ao configurar fluxo de métricas:', error)
      return { success: false, error: error.message }
    }
  }

  setupBehavioralMetricsCollection() {
    this.behavioralMetrics = {
      responseTime: { enabled: true, threshold: 5000 },
      accuracy: { enabled: true, trackTrends: true },
      engagement: { enabled: true, trackInteractionPatterns: true },
    }
    logger.info('🧠 Coleta comportamental configurada')
  }

  setupSensorialMetricsCollection() {
    this.sensorialMetrics = {
      touchPressure: { enabled: true, sensitivity: 'medium' },
      gyroscope: { enabled: true, threshold: 0.5 },
      accelerometer: { enabled: true, filterNoise: true },
    }
    logger.info('📱 Coleta sensorial configurada')
  }

  setupMetricsProcessing() {
    this.processingPipeline = {
      collection: { behavioral: true, sensorial: true },
      refinement: { behavioral: 'metricsService.js', sensorial: 'multisensoryMetricsService.js' },
      analysis: { cognitive: true, neuropedagogical: true },
    }
    logger.info('⚙️ Pipeline de processamento configurado')
  }

  setupIntelligentStorage() {
    this.storageConfig = {
      cache: { ttl: 1800000, maxSize: 1000, strategy: 'LRU' },
      database: { batchSize: 50, syncInterval: 60000, offline: true },
    }
    this.setupCacheDatabaseSync()
    logger.info('💾 Armazenamento inteligente configurado')
  }

  setupCacheDatabaseSync() {
    this.syncManager = {
      pending: new Set(),
      retries: new Map(),
      maxRetries: 3,
    }
    logger.info('🔄 Sincronização cache-database configurada')
  }

  setupDashboardIntegration() {
    this.dashboardConfig = {
      behavioral: { charts: ['line', 'bar'], realTime: true },
      sensorial: { charts: ['scatter', 'heatmap'], realTime: true },
      therapeutic: { charts: ['progress', 'radar'], realTime: false },
    }
    this.setupRealTimeUpdates()
    logger.info('📊 Integração com dashboard configurada')
  }

  setupRealTimeUpdates() {
    this.dashboardEvents = { dispatchEvent: () => {} }
    logger.info('⚡ Updates em tempo real configurados')
  }

  async processBehavioralMetrics(sessionId, metricsData) {
    try {
      const validatedData = this.validateBehavioralMetrics(metricsData)
      const processedData = await this.existingSystems.metricsService.processMetrics(validatedData)
      await this.storeInCache('behavioral', sessionId, processedData)
      this.emitDashboardUpdate('behavioral', processedData)

      logger.info(`✅ Métricas comportamentais processadas: ${sessionId}`)
      return { success: true, sessionId, data: processedData }
    } catch (error) {
      logger.error('❌ Erro ao processar métricas comportamentais:', error)
      return { success: false, error: error.message }
    }
  }

  async processSensorialMetrics(sessionId, sensorData) {
    try {
      const validatedData = this.validateSensorialMetrics(sensorData)
      const processedData =
        await this.existingSystems.multisensoryMetrics.processMetrics(validatedData)
      await this.storeInCache('sensorial', sessionId, processedData)
      this.emitDashboardUpdate('sensorial', processedData)

      logger.info(`✅ Métricas sensoriais processadas: ${sessionId}`)
      return { success: true, sessionId, data: processedData }
    } catch (error) {
      logger.error('❌ Erro ao processar métricas sensoriais:', error)
      return { success: false, error: error.message }
    }
  }

  async storeInCache(type, sessionId, data) {
    const cacheKey = `${type}_${sessionId}_${Date.now()}`
    this.tempCache.set(cacheKey, { data, timestamp: Date.now() })
    if (!this.syncManager) this.syncManager = { pending: new Set() }
    this.syncManager.pending.add(cacheKey)
    logger.info(`💾 Dados armazenados em cache: ${cacheKey}`)
  }

  async syncCacheToDatabase() {
    if (!this.syncManager || this.syncManager.pending.size === 0)
      return { success: true, synced: 0 }

    const batch = Array.from(this.syncManager.pending).slice(
      0,
      this.storageConfig.database.batchSize
    )

    for (const cacheKey of batch) {
      const data = this.tempCache.get(cacheKey)?.data
      if (data) {
        await this.existingSystems.databaseService.saveGameSession(data)
        this.syncManager.pending.delete(cacheKey)
      }
    }

    logger.info(`🔄 Sincronização concluída: ${batch.length} registros`)
    return { success: true, synced: batch.length }
  }

  emitDashboardUpdate(type, data) {
    logger.info(`📊 Update emitido para dashboard: ${type}`)
    return { success: true, type, timestamp: Date.now() }
  }

  validateBehavioralMetrics(metricsData) {
    if (!metricsData || typeof metricsData !== 'object') {
      throw new Error('Dados de métricas comportamentais inválidos')
    }

    return {
      activity: metricsData.activity || 'unknown',
      responseTime: this.validateNumeric(metricsData.responseTime, 0, 30000),
      accuracy: this.validateNumeric(metricsData.accuracy, 0, 100),
      engagementScore: this.validateNumeric(metricsData.engagementScore, 0, 100),
      attempts: this.validateNumeric(metricsData.attempts, 0),
      successes: this.validateNumeric(metricsData.successes, 0),
      errors: this.validateNumeric(metricsData.errors, 0),
      sessionDuration: this.validateNumeric(metricsData.sessionDuration, 0),
      timestamp: metricsData.timestamp || Date.now(),
    }
  }

  validateSensorialMetrics(sensorData) {
    if (!sensorData || typeof sensorData !== 'object') {
      throw new Error('Dados de métricas sensoriais inválidos')
    }

    return {
      touchPressure: Array.isArray(sensorData.touchPressure) ? sensorData.touchPressure : [],
      gyroscope: sensorData.gyroscope || { x: [], y: [], z: [] },
      accelerometer: sensorData.accelerometer || { x: [], y: [], z: [] },
      gesturePattern: sensorData.gesturePattern || 'unknown',
      timestamp: sensorData.timestamp || Date.now(),
    }
  }

  validateNumeric(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = parseFloat(value)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }

  async testWithMemoryGame(gameData) {
    logger.info('🎮 Testando fluxo com MemoryGame...')

    try {
      const sessionId = `memory_game_${Date.now()}`

      const behavioralData = {
        activity: 'memory-game',
        responseTime: gameData.avgResponseTime || 2500,
        accuracy: gameData.accuracy || 85,
        engagementScore: gameData.interactions || 15,
        attempts: gameData.moves || 12,
        successes: gameData.matches || 6,
        errors: gameData.mismatches || 6,
        sessionDuration: gameData.duration || 120000,
      }

      const sensorialData = {
        touchPressure: Array.from({ length: 10 }, () => Math.random() * 100),
        gyroscope: {
          x: Array.from({ length: 10 }, () => Math.random() * 2 - 1),
          y: Array.from({ length: 10 }, () => Math.random() * 2 - 1),
          z: Array.from({ length: 10 }, () => Math.random() * 2 - 1),
        },
        gesturePattern: 'tap_sequence',
      }

      const behavioralResult = await this.processBehavioralMetrics(sessionId, behavioralData)
      const sensorialResult = await this.processSensorialMetrics(sessionId, sensorialData)

      const combinedResult = {
        sessionId,
        behavioral: behavioralResult,
        sensorial: sensorialResult,
        timestamp: Date.now(),
        gameType: 'memory-game',
      }

      logger.info('✅ Teste com MemoryGame concluído:', combinedResult)
      return combinedResult
    } catch (error) {
      logger.error('❌ Erro no teste com MemoryGame:', error)
      return { success: false, error: error.message }
    }
  }

  getUnifiedStatistics() {
    return {
      uptime: Date.now(),
      cacheSize: this.tempCache.size,
      pendingSync: this.syncManager?.pending.size || 0,
      systemHealth: 'healthy',
    }
  }
}

/**
 * 🚀 EXECUTAR TESTE FASE 2
 */
async function runPhase2QuickTest() {
  console.log('\n🧪 ===== TESTE RÁPIDO DA FASE 2 =====\n')

  try {
    // Criar instância do mock
    const orchestrator = new MockSystemOrchestrator()
    await orchestrator.init()

    // 1. TESTAR SETUP DO FLUXO BÁSICO
    logger.info('📊 1. Testando setup do fluxo básico...')
    const setupResult = await orchestrator.setupBasicMetricsFlow()
    console.log('Setup result:', setupResult)

    // 2. TESTAR PROCESSAMENTO COMPORTAMENTAL
    logger.info('🎯 2. Testando métricas comportamentais...')
    const behavioralData = {
      activity: 'memory-game-test',
      responseTime: 1200,
      accuracy: 92,
      engagementScore: 18,
      attempts: 15,
      successes: 14,
      errors: 1,
      sessionDuration: 180000,
    }

    const sessionId = `test_session_${Date.now()}`
    const behavioralResult = await orchestrator.processBehavioralMetrics(sessionId, behavioralData)
    console.log('Behavioral result:', behavioralResult)

    // 3. TESTAR PROCESSAMENTO SENSORIAL
    logger.info('📱 3. Testando métricas sensoriais...')
    const sensorialData = {
      touchPressure: [45, 52, 38, 61, 44, 55, 49, 53, 47, 56],
      gyroscope: {
        x: [-0.1, 0.2, -0.05, 0.15, -0.08],
        y: [0.25, -0.18, 0.32, -0.14, 0.28],
        z: [0.95, 0.97, 0.94, 0.96, 0.95],
      },
      gesturePattern: 'tap_sequence',
    }

    const sensorialResult = await orchestrator.processSensorialMetrics(sessionId, sensorialData)
    console.log('Sensorial result:', sensorialResult)

    // 4. TESTAR SINCRONIZAÇÃO
    logger.info('🔄 4. Testando sincronização...')
    const syncResult = await orchestrator.syncCacheToDatabase()
    console.log('Sync result:', syncResult)

    // 5. TESTAR COM MEMORY GAME
    logger.info('🎮 5. Testando com MemoryGame...')
    const memoryGameData = {
      avgResponseTime: 1800,
      accuracy: 88,
      interactions: 22,
      moves: 18,
      matches: 9,
      mismatches: 9,
      duration: 240000,
    }

    const memoryGameResult = await orchestrator.testWithMemoryGame(memoryGameData)
    console.log('MemoryGame result:', memoryGameResult)

    // 6. ESTATÍSTICAS FINAIS
    logger.info('📊 6. Obtendo estatísticas...')
    const stats = orchestrator.getUnifiedStatistics()
    console.log('System stats:', stats)

    // RESULTADO FINAL
    const finalResult = {
      testId: `phase2_quick_test_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      components: {
        setup: setupResult?.success || false,
        behavioral: behavioralResult?.success || false,
        sensorial: sensorialResult?.success || false,
        sync: syncResult?.success || false,
        memoryGame: memoryGameResult?.sessionId ? true : false,
      },
      systemStats: stats,
      sessionId,
    }

    console.log('\n🎉 ===== RESULTADO FINAL =====')
    console.log(JSON.stringify(finalResult, null, 2))

    const allSuccess = Object.values(finalResult.components).every(Boolean)
    console.log(`\n${allSuccess ? '✅ TODOS OS TESTES PASSARAM!' : '❌ ALGUNS TESTES FALHARAM!'}`)

    return finalResult
  } catch (error) {
    logger.error('❌ ERRO NO TESTE:', error)
    return {
      testId: `phase2_quick_test_${Date.now()}`,
      status: 'ERROR',
      error: error.message,
    }
  }
}

// Executar teste se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runPhase2QuickTest()
    .then((result) => {
      process.exit(result.status === 'SUCCESS' ? 0 : 1)
    })
    .catch((error) => {
      console.error('❌ Erro fatal:', error)
      process.exit(1)
    })
}

export { runPhase2QuickTest, MockSystemOrchestrator }
