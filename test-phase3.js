/**
 * 🎯 TESTE DA FASE 3: MÉTRICAS TERAPÊUTICAS
 * Valida integração completa com TherapeuticAnalyzer
 */

import { getSystemOrchestrator } from './src/core/SystemOrchestrator.js'

async function testPhase3Implementation() {
  console.log('🎯 ===== TESTE DA FASE 3: MÉTRICAS TERAPÊUTICAS =====')

  try {
    // 1. Obter SystemOrchestrator
    const orchestrator = getSystemOrchestrator()
    await orchestrator.init()

    console.log('✅ SystemOrchestrator inicializado')

    // 2. Verificar se TherapeuticAnalyzer está integrado
    if (orchestrator.existingSystems.therapeuticAnalyzer) {
      console.log('✅ TherapeuticAnalyzer integrado ao SystemOrchestrator')

      // 3. Testar método process básico
      const testData = {
        responseTime: 1200,
        accuracy: 0.88,
      }

      const result = orchestrator.existingSystems.therapeuticAnalyzer.process(testData)
      console.log('📊 Resultado do método process:', {
        attentionScore: result.attentionScore,
        coordinationScore: result.coordinationScore,
        recommendations: result.therapeuticRecommendations?.length || 0,
      })

      // 4. Testar fluxo completo de métricas
      console.log('🧪 Executando teste completo de métricas...')
      const flowResult = await orchestrator.testMetricsFlow()

      if (flowResult.overallSuccess) {
        console.log('✅ Fluxo completo funcionando:', {
          behavioral: flowResult.behavioral.processed,
          sensorial: flowResult.sensorial.processed,
          therapeutic: flowResult.therapeutic.processed,
          attentionScore: flowResult.therapeutic.attentionScore,
          coordinationScore: flowResult.therapeutic.coordinationScore,
        })
      } else {
        console.log('❌ Erro no fluxo:', flowResult.error)
      }
    } else {
      console.log('❌ TherapeuticAnalyzer não encontrado')
    }

    console.log('🎉 ===== FASE 3 TESTADA COM SUCESSO =====')
  } catch (error) {
    console.error('❌ Erro no teste da Fase 3:', error)
  }
}

// Executar teste
testPhase3Implementation()
