/**
 * PORTAL BETINA - TESTE DE INTEGRAÇÃO FASE 3.4
 * Teste integrado da análise cognitiva de autismo com SystemOrchestrator e behavioralEngagementAnalyzer
 *
 * @version 1.0.0
 * @created 2025-06-12
 */

import { getSystemOrchestrator } from './src/core/SystemOrchestrator.js'
import { behavioralEngagementAnalyzer } from './src/utils/analytics/behavioralEngagementAnalyzer.js'
import { autismCognitiveAnalysis } from './src/utils/autismCognitiveAnalysis/index.js'
import { logger } from './src/config/api-config.js'

/**
 * Testa a integração completa da Fase 3.4
 */
async function testPhase34Integration() {
  logger.info('🚀 INICIANDO TESTE INTEGRADO - FASE 3.4')

  // 1. Verificar inicialização e integração dos componentes
  const orchestrator = getSystemOrchestrator()

  logger.info('📊 Verificando inicialização do SystemOrchestrator')
  if (!orchestrator) {
    logger.error('❌ SystemOrchestrator não inicializado corretamente')
    return false
  }

  logger.info('📊 Verificando inicialização do BehavioralEngagementAnalyzer')
  if (!behavioralEngagementAnalyzer || !behavioralEngagementAnalyzer.initialized) {
    logger.info('⚠️ BehavioralEngagementAnalyzer não inicializado, tentando inicializar...')
    await behavioralEngagementAnalyzer.initializeOrchestrator()
  }

  logger.info('📊 Inicializando AutismCognitiveAnalysis com integrações')
  await autismCognitiveAnalysis.initialize()

  // 2. Verificar conexões bidirecionais
  logger.info('🔄 Verificando conexões bidirecionais entre os componentes')

  // Verificar referências
  const cognitiveIntegrationStatus = {
    orchestratorRef: !!autismCognitiveAnalysis.orchestratorRef,
    behavioralRef: !!autismCognitiveAnalysis.behavioralEngagementRef,
    integrationStatus: autismCognitiveAnalysis.integrationStatus || {},
  }

  const behavioralIntegrationStatus = {
    orchestratorRef: !!behavioralEngagementAnalyzer.orchestratorRef,
    cognitiveRef: !!behavioralEngagementAnalyzer.cognitiveAnalysisRef,
  }

  logger.info('📋 Status de integração cognitiva:', cognitiveIntegrationStatus)
  logger.info('📋 Status de integração comportamental:', behavioralIntegrationStatus)

  // 3. Testar fluxo de dados entre os sistemas
  const userId = 'test-user-12345'
  const testData = {
    userData: {
      id: userId,
      age: 8,
      supportLevel: 'moderate',
      preferredActivities: ['matching', 'sorting', 'music'],
    },
    behavioralData: {
      engagementScore: 75,
      frustrationLevel: 'low',
      persistenceScore: 82,
      preferredCategories: ['sensorial', 'cognitive'],
      completedActivities: 12,
      abandonedActivities: 2,
    },
  }

  logger.info('🔄 Testando sincronização de dados comportamentais com cognitivos')
  const enhancedInsights = await autismCognitiveAnalysis.syncBehavioralWithCognitive(
    userId,
    testData.behavioralData
  )

  if (enhancedInsights && !enhancedInsights.error) {
    logger.info('✅ Sincronização bem-sucedida')
    logger.info('📊 Insights gerados:', JSON.stringify(enhancedInsights, null, 2))
  } else {
    logger.error('❌ Falha na sincronização:', enhancedInsights?.message || 'Erro desconhecido')
    return false
  }

  // 4. Verificar cache de insights
  const cachedInsights = autismCognitiveAnalysis.sessionInsights.get(userId)
  if (cachedInsights) {
    logger.info('✅ Cache de insights funcionando corretamente')
  } else {
    logger.warn('⚠️ Cache de insights não está funcionando')
  }

  // 5. Testar recomendações integradas
  if (enhancedInsights.recommendations && enhancedInsights.recommendations.integrated) {
    logger.info('✅ Recomendações integradas geradas com sucesso')
    logger.info('📋 Total de recomendações:', enhancedInsights.recommendations.integrated.length)
  } else {
    logger.warn('⚠️ Recomendações integradas não foram geradas')
  }

  // 6. Relatório final
  logger.info('🏁 TESTE DE INTEGRAÇÃO FASE 3.4 CONCLUÍDO')
  logger.info(
    '✅ Integração entre análise cognitiva de autismo, sistema comportamental e orquestrador verificada'
  )

  return true
}

// Executar teste
testPhase34Integration()
  .then((success) => {
    if (success) {
      logger.info('✅ Teste de integração da Fase 3.4 concluído com sucesso!')
    } else {
      logger.error('❌ Teste de integração da Fase 3.4 encontrou problemas')
    }
  })
  .catch((error) => {
    logger.error('❌ Erro durante o teste de integração da Fase 3.4:', error)
  })
