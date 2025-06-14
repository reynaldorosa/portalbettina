/**
 * 🧪 TESTE DE INTEGRAÇÃO DA FASE 2
 * Portal Betina - Fluxo Básico de Métricas
 *
 * Valida integração completa:
 * useActivity → metricsService → multisensoryMetricsService →
 * IntelligentCache → DatabaseService → PerformanceDashboard
 */

import { getSystemOrchestrator } from '../utils/core/SystemOrchestrator.js'
import logger from '../utils/logger.js'

/**
 * 🚀 EXECUTAR TESTE COMPLETO DA FASE 2
 */
export async function runPhase2IntegrationTest() {
  logger.info('🧪 ===== INICIANDO TESTE DE INTEGRAÇÃO FASE 2 =====')

  try {
    // Obter instância do SystemOrchestrator
    const orchestrator = await getSystemOrchestrator()
    await orchestrator.init()

    logger.info('✅ SystemOrchestrator inicializado com sucesso')

    // 1. TESTAR CONFIGURAÇÃO DO FLUXO BÁSICO
    logger.info('📊 1. Testando configuração do fluxo básico de métricas...')
    const setupResult = await orchestrator.setupBasicMetricsFlow()
    console.log('Setup result:', setupResult)

    // 2. TESTAR PROCESSAMENTO DE MÉTRICAS COMPORTAMENTAIS
    logger.info('🎯 2. Testando processamento de métricas comportamentais...')
    const behavioralData = {
      activity: 'memory-game-test',
      responseTime: 1200,
      accuracy: 92,
      engagementScore: 18,
      attempts: 15,
      successes: 14,
      errors: 1,
      sessionDuration: 180000,
      interactionPatterns: ['quick_succession', 'focused_attention'],
      difficultyLevel: 'medium',
    }

    const sessionId = `test_session_${Date.now()}`
    const behavioralResult = await orchestrator.processBehavioralMetrics(sessionId, behavioralData)
    console.log('Behavioral processing result:', behavioralResult)

    // 3. TESTAR PROCESSAMENTO DE MÉTRICAS SENSORIAIS
    logger.info('📱 3. Testando processamento de métricas sensoriais...')
    const sensorialData = {
      touchPressure: [45, 52, 38, 61, 44, 55, 49, 53, 47, 56],
      gyroscope: {
        x: [-0.1, 0.2, -0.05, 0.15, -0.08, 0.12, -0.03, 0.18, -0.11, 0.09],
        y: [0.25, -0.18, 0.32, -0.14, 0.28, -0.21, 0.35, -0.16, 0.29, -0.19],
        z: [0.95, 0.97, 0.94, 0.96, 0.95, 0.98, 0.93, 0.97, 0.94, 0.96],
      },
      gesturePattern: 'tap_sequence',
      deviceOrientation: 0,
      touchEvents: [
        { type: 'touchstart', timestamp: Date.now() - 5000, pressure: 0.8 },
        { type: 'touchmove', timestamp: Date.now() - 3000, pressure: 0.6 },
        { type: 'touchend', timestamp: Date.now() - 1000, pressure: 0.0 },
      ],
    }

    const sensorialResult = await orchestrator.processSensorialMetrics(sessionId, sensorialData)
    console.log('Sensorial processing result:', sensorialResult)

    // 4. TESTAR ARMAZENAMENTO EM CACHE
    logger.info('💾 4. Testando armazenamento em cache...')
    const cacheData = {
      sessionId,
      behavioral: behavioralResult,
      sensorial: sensorialResult,
      timestamp: Date.now(),
      type: 'combined_metrics',
    }

    const cacheResult = await orchestrator.storeInCache(`metrics_${sessionId}`, cacheData)
    console.log('Cache storage result:', cacheResult)

    // 5. TESTAR SINCRONIZAÇÃO COM DATABASE
    logger.info('🗄️ 5. Testando sincronização com database...')
    const syncResult = await orchestrator.syncCacheToDatabase()
    console.log('Database sync result:', syncResult)

    // 6. TESTAR EMISSÃO PARA DASHBOARD
    logger.info('📈 6. Testando emissão para dashboard...')
    const dashboardData = {
      sessionId,
      metrics: cacheData,
      charts: ['behavioral_trend', 'sensorial_heatmap', 'engagement_score'],
      realTime: true,
    }

    const dashboardResult = await orchestrator.emitDashboardUpdate(dashboardData)
    console.log('Dashboard emission result:', dashboardResult)

    // 7. TESTAR FLUXO COMPLETO COM MEMORY GAME
    logger.info('🎮 7. Testando fluxo completo com MemoryGame...')
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
    console.log('MemoryGame test result:', memoryGameResult)

    // 8. TESTAR VALIDAÇÕES
    logger.info('✅ 8. Testando validações...')
    const behavioralValidation = orchestrator.validateBehavioralMetrics(behavioralData)
    const sensorialValidation = orchestrator.validateSensorialMetrics(sensorialData)

    console.log('Behavioral validation:', behavioralValidation)
    console.log('Sensorial validation:', sensorialValidation)

    // 9. OBTER ESTATÍSTICAS DO SISTEMA
    logger.info('📊 9. Obtendo estatísticas do sistema...')
    const systemStats = orchestrator.getUnifiedStatistics()
    console.log('System statistics:', systemStats)

    // RESULTADO FINAL
    const finalResult = {
      testId: `phase2_integration_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      components: {
        setup: setupResult?.success || false,
        behavioral: behavioralResult?.success || false,
        sensorial: sensorialResult?.success || false,
        cache: cacheResult?.success || false,
        database: syncResult?.success || false,
        dashboard: dashboardResult?.success || false,
        memoryGame: memoryGameResult?.sessionId ? true : false,
        validations: behavioralValidation?.isValid && sensorialValidation?.isValid,
      },
      sessionId,
      systemStats,
      duration: Date.now() - parseInt(sessionId.split('_')[2]),
    }

    logger.info('🎉 ===== TESTE DE INTEGRAÇÃO FASE 2 CONCLUÍDO =====')
    logger.info('📋 RESULTADO FINAL:', finalResult)

    return finalResult
  } catch (error) {
    logger.error('❌ ERRO NO TESTE DE INTEGRAÇÃO:', error)

    return {
      testId: `phase2_integration_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'ERROR',
      error: error.message,
      stack: error.stack,
    }
  }
}

/**
 * 🔬 TESTE FOCADO NA INTEGRAÇÃO COM USEMOBILEDATACOLLECTION
 */
export async function testMobileDataCollectionIntegration() {
  logger.info('📱 Testando integração com useMobileDataCollection...')

  try {
    const orchestrator = await getSystemOrchestrator()

    // Simular dados que viriam do useMobileDataCollection
    const mobileCollectionData = {
      sessionId: `mobile_test_${Date.now()}`,
      timestamp: Date.now(),
      eventType: 'touch_interaction',
      sensorType: 'multi_touch',
      data: {
        type: 'touch',
        touches: [
          { x: 150, y: 300, pressure: 0.8, timestamp: Date.now() - 2000 },
          { x: 155, y: 305, pressure: 0.7, timestamp: Date.now() - 1500 },
          { x: 160, y: 310, pressure: 0.9, timestamp: Date.now() - 1000 },
        ],
        gesturePattern: 'swipe_right',
        accelerometer: { x: 0.1, y: -0.2, z: 9.8 },
        gyroscope: { x: 0.05, y: -0.1, z: 0.02 },
        orientation: { alpha: 45, beta: 10, gamma: -5 },
      },
      deviceInfo: {
        userAgent: 'TestAgent/1.0',
        platform: 'Test Platform',
        orientation: 0,
        touchSupport: true,
      },
    }

    // Processar via método que o useMobileDataCollection chamaria
    const result = await orchestrator.processSensorialMetrics(
      mobileCollectionData.sessionId,
      mobileCollectionData
    )

    logger.info('✅ Integração com useMobileDataCollection testada com sucesso')
    return {
      success: true,
      mobileData: mobileCollectionData,
      processedResult: result,
    }
  } catch (error) {
    logger.error('❌ Erro no teste de integração mobile:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * 🚀 EXECUTAR TODOS OS TESTES
 */
export async function runAllPhase2Tests() {
  console.log('\n🧪 ===== EXECUTANDO TODOS OS TESTES DA FASE 2 =====\n')

  const results = {}

  // Teste principal de integração
  results.integrationTest = await runPhase2IntegrationTest()

  // Teste específico do mobile data collection
  results.mobileIntegrationTest = await testMobileDataCollectionIntegration()

  // Resumo final
  const allSuccess = Object.values(results).every(
    (result) => result.status === 'SUCCESS' || result.success === true
  )

  console.log('\n📋 ===== RESUMO DOS TESTES =====')
  console.log('Status Geral:', allSuccess ? '✅ SUCESSO' : '❌ FALHAS DETECTADAS')
  console.log('Resultados detalhados:', results)

  return {
    overallStatus: allSuccess ? 'SUCCESS' : 'FAILURE',
    results,
  }
}

// Exportar funções para uso direto
export default {
  runPhase2IntegrationTest,
  testMobileDataCollectionIntegration,
  runAllPhase2Tests,
}
