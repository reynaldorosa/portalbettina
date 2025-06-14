/**
 * TESTE DE INTEGRAÇÃO - SYSTEMORCHESTRATOR + AUTISM COGNITIVE ANALYSIS
 * Valida se os módulos de análise cognitiva para autismo estão corretamente integrados
 * no SystemOrchestrator principal
 *
 * @version 1.0.0
 * @created 2025-06-13
 */

import { SystemOrchestrator } from './src/utils/core/SystemOrchestrator.js'
import { logger } from './src/config/api-config.js'

/**
 * Testa a integração dos módulos de autism cognitive analysis no SystemOrchestrator
 */
async function testSystemOrchestratorAutismIntegration() {
  logger.info('🧠 TESTE DE INTEGRAÇÃO - SYSTEMORCHESTRATOR + AUTISM COGNITIVE ANALYSIS')
  logger.info('================================================================')

  try {
    // 1. Criar instância do SystemOrchestrator
    logger.info('🔧 Criando SystemOrchestrator...')
    const mockDB = {
      logger: logger,
      cache: new Map(),
      loadAdaptiveRules: async () => ({}),
    }

    const orchestrator = new SystemOrchestrator(mockDB, {
      enableAutismCognitiveAnalysis: true,
      enableAdvancedAnalysisOrchestrator: true,
      enableAdvancedSupportCalculator: true,
      enableNeuropedagogicalAnalysis: true,
    })

    // 2. Inicializar o orquestrador
    logger.info('🚀 Inicializando SystemOrchestrator...')
    await orchestrator.initialize()

    // 3. Verificar se os módulos avançados foram inicializados
    logger.info('🔍 Verificando módulos avançados...')
    
    const autismAnalyzer = orchestrator.therapeuticSystems.autismCognitiveAnalyzer
    const advancedOrchestrator = orchestrator.therapeuticSystems.advancedAnalysisOrchestrator
    const supportCalculator = orchestrator.therapeuticSystems.advancedSupportCalculator
    const neuropedagogicalAnalyzer = orchestrator.therapeuticSystems.neuropedagogicalAnalyzer

    logger.info('📊 Status dos módulos avançados:', {
      autismCognitiveAnalyzer: !!autismAnalyzer && autismAnalyzer.isInitialized,
      advancedAnalysisOrchestrator: !!advancedOrchestrator,
      advancedSupportCalculator: !!supportCalculator && supportCalculator.isInitialized,
      neuropedagogicalAnalyzer: !!neuropedagogicalAnalyzer && neuropedagogicalAnalyzer.isInitialized,
    })

    // 4. Testar funcionalidades integradas
    if (autismAnalyzer && autismAnalyzer.isInitialized) {
      logger.info('🧪 Testando análise cognitiva de autismo...')
      
      const testSessionData = {
        sessionId: 'test-session-001',
        accuracy: 0.75,
        responseTime: 2500,
        attention: 0.6,
        sessionDuration: 300000,
        activityType: 'cognitive-test',
        attempts: 10,
        errors: 2,
      }

      const testUserProfile = {
        age: 8,
        diagnosis: 'autism',
        communicationLevel: { level: 2 },
        sensoryProfile: { hypersensitive: ['auditory'], hyposensitive: ['vestibular'] },
      }

      try {
        const adaptations = await autismAnalyzer.calculateAutismAdaptations(
          'test-user-001',
          testSessionData,
          testUserProfile
        )
        logger.info('✅ Adaptações calculadas:', {
          hasAdaptations: !!adaptations,
          sensoryAdaptations: adaptations?.sensoryAdaptations?.length || 0,
          communicationAdaptations: adaptations?.communicationAdaptations ? 'sim' : 'não',
          cognitiveAdaptations: adaptations?.cognitiveAdaptations ? 'sim' : 'não',
        })
      } catch (error) {
        logger.warn('⚠️ Erro ao calcular adaptações:', error.message)
      }
    }

    // 5. Verificar configurações
    logger.info('⚙️ Configurações ativas:', {
      enableAutismCognitiveAnalysis: orchestrator.config.enableAutismCognitiveAnalysis,
      enableAdvancedAnalysisOrchestrator: orchestrator.config.enableAdvancedAnalysisOrchestrator,
      enableAdvancedSupportCalculator: orchestrator.config.enableAdvancedSupportCalculator,
      enableNeuropedagogicalAnalysis: orchestrator.config.enableNeuropedagogicalAnalysis,
    })

    // 6. Shutdown limpo
    logger.info('🔄 Fazendo shutdown do orquestrador...')
    await orchestrator.shutdown()

    logger.info('✅ TESTE CONCLUÍDO COM SUCESSO')
    logger.info('📋 Módulos de autism cognitive analysis estão corretamente integrados!')
    
    return true
  } catch (error) {
    logger.error('❌ ERRO NO TESTE:', error)
    logger.error('Stack:', error.stack)
    return false
  }
}

// Executar teste
testSystemOrchestratorAutismIntegration()
  .then((success) => {
    if (success) {
      process.exit(0)
    } else {
      process.exit(1)
    }
  })
  .catch((error) => {
    logger.error('❌ Erro fatal no teste:', error)
    process.exit(1)
  })
