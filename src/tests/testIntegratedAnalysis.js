/**
 * @file testIntegratedAnalysis.js
 * @description Teste de integração do sistema completo
 * @version 1.0.0
 */

import IntegratedAnalysisOrchestrator from '../utils/emotionalAnalysis/IntegratedAnalysisOrchestrator.js'

// Mock do DatabaseService para teste
class MockDatabaseService {
  constructor() {
    this.data = new Map()
  }

  async insertData(collection, data) {
    if (!this.data.has(collection)) {
      this.data.set(collection, [])
    }
    this.data.get(collection).push({ ...data, _id: Date.now() })
    return { _id: Date.now() }
  }

  async findData(collection, query = {}, options = {}) {
    const collectionData = this.data.get(collection) || []
    return collectionData.slice(0, options.limit || 10)
  }
}

// Função de teste principal
async function testIntegratedAnalysis() {
  console.log('🧪 Iniciando teste do sistema de análise integrada...')

  try {
    // 1. Inicializar sistema
    const mockDB = new MockDatabaseService()
    const userProfile = {
      id: 'test_user_001',
      personalityType: 'analytical',
      cognitiveProfile: { attention: 0.7, memory: 0.6 },
      emotionalProfile: { stability: 0.8 },
    }

    const orchestrator = new IntegratedAnalysisOrchestrator(mockDB, {
      realtimeAnalysis: true,
      analysisInterval: 2000,
    })

    console.log('✅ Orquestrador criado')

    // 2. Inicializar serviços
    const initSuccess = await orchestrator.initialize(userProfile)
    if (!initSuccess) {
      throw new Error('Falha na inicialização')
    }
    console.log('✅ Serviços inicializados')

    // 3. Iniciar sessão
    const session = await orchestrator.startSession({
      userId: userProfile.id,
      activityType: 'cognitive_training',
    })
    console.log('✅ Sessão iniciada:', session.sessionId)

    // 4. Simular eventos em tempo real
    console.log('📊 Simulando eventos em tempo real...')

    const testEvents = [
      {
        type: 'click',
        target: 'button_1',
        timestamp: Date.now(),
        performance: 0.8,
        responseTime: 1200,
        accuracy: 0.9,
      },
      {
        type: 'task_completion',
        task: 'memory_test',
        performance: 0.7,
        difficulty: 'medium',
        success: true,
        timestamp: Date.now() + 1000,
      },
      {
        type: 'error',
        errorType: 'attention_lapse',
        context: 'visual_task',
        timestamp: Date.now() + 2000,
      },
      {
        type: 'breakthrough',
        skill: 'pattern_recognition',
        improvementScore: 0.9,
        timestamp: Date.now() + 3000,
      },
    ]

    // Processar eventos
    for (const event of testEvents) {
      const analysis = await orchestrator.processRealtimeEvent(event)
      if (analysis) {
        console.log(`📈 Análise em tempo real:`, {
          riskScore: analysis.integrated?.riskScore || 0,
          opportunityScore: analysis.integrated?.opportunityScore || 0,
          interventionNeeded: analysis.integrated?.interventionNeeded || false,
        })
      }

      // Aguardar um pouco entre eventos
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // 5. Verificar filas
    const queues = orchestrator.getQueues()
    console.log('📋 Filas de processamento:', {
      interventions: queues.interventions.length,
      optimizations: queues.optimizations.length,
    })

    // 6. Finalizar sessão
    console.log('🏁 Finalizando sessão...')
    const sessionResults = await orchestrator.endSession()

    console.log('✅ Sessão finalizada com sucesso!')
    console.log('📊 Resultados da sessão:', {
      duration: sessionResults.session.endTime - sessionResults.session.startTime,
      overallWellbeing: sessionResults.analysis.integrated.overallWellbeing,
      learningEffectiveness: sessionResults.analysis.integrated.learningEffectiveness,
      cognitiveGrowth: sessionResults.analysis.integrated.cognitiveGrowth,
      emotionalStability: sessionResults.analysis.integrated.emotionalStability,
    })

    // 7. Verificar dados coletados
    console.log('📈 Resumo dos dados coletados:', {
      emotional: {
        totalInteractions:
          sessionResults.summary.emotional.dataTypes?.interaction?.totalInteractions || 0,
        successRate: sessionResults.summary.emotional.dataTypes?.behavioral?.successRate || 0,
      },
      neuroplasticity: {
        cognitiveEvents:
          sessionResults.summary.neuroplasticity.plasticity?.cognitive?.totalEvents || 0,
        learningEvents:
          sessionResults.summary.neuroplasticity.plasticity?.learning?.totalLearningEvents || 0,
      },
    })

    console.log('🎉 Teste concluído com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    return false
  }
}

// Executar teste se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testIntegratedAnalysis()
    .then((success) => {
      console.log(success ? '✅ Todos os testes passaram!' : '❌ Alguns testes falharam!')
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('❌ Erro fatal no teste:', error)
      process.exit(1)
    })
}

export { testIntegratedAnalysis }
export default testIntegratedAnalysis
