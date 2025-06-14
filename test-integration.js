/**
 * @file test-integration.js
 * @description Teste de integração entre database e utils
 * Para verificar se a nova estrutura modular está funcionando
 */

import { PortalBetina } from './src/index.js'
import { databaseConfig } from './src/config/database.js'

async function testIntegration() {
  console.log('🧪 Iniciando teste de integração Portal Betina...')

  try {
    // Criar instância do Portal Betina
    const portal = new PortalBetina(databaseConfig)

    // Inicializar sistema
    console.log('📦 Inicializando sistemas...')
    const success = await portal.initialize()

    if (!success) {
      throw new Error('Falha na inicialização')
    }

    console.log('✅ Sistemas inicializados com sucesso!')

    // Testar acesso aos serviços
    console.log('🔍 Testando acesso aos serviços...')

    const sessionService = portal.getSessionService()
    const therapyOptimizer = portal.getTherapyOptimizer()
    const metricsManager = portal.getMetricsManager()
    const cognitiveAnalyzer = portal.getCognitiveAnalyzer()

    console.log('📊 Serviços disponíveis:')
    console.log('- SessionService:', !!sessionService)
    console.log('- TherapyOptimizer:', !!therapyOptimizer)
    console.log('- MetricsManager:', !!metricsManager)
    console.log('- CognitiveAnalyzer:', !!cognitiveAnalyzer)

    // Testar funcionalidade básica
    console.log('🧠 Testando funcionalidades básicas...')

    if (sessionService) {
      const testSession = await sessionService.createSession({
        userId: 'test-user-123',
        activityType: 'memory-game',
        difficulty: 'easy',
      })
      console.log('✅ Sessão criada:', testSession.sessionId)
    }

    if (metricsManager) {
      metricsManager.recordEvent('test-integration', {
        timestamp: Date.now(),
        success: true,
      })
      console.log('✅ Métricas registradas')
    }

    // Obter status do sistema
    const status = portal.getSystemStatus()
    console.log('📈 Status do sistema:', {
      initialized: status.initialized,
      uptime: `${Math.round(status.uptime / 1000)}s`,
      services: Object.keys(status.services || {}).length,
    })

    // Encerrar sistema
    console.log('🔄 Encerrando sistemas...')
    await portal.shutdown()
    console.log('✅ Sistemas encerrados com sucesso!')

    console.log('🎉 Teste de integração concluído com SUCESSO!')
    return true
  } catch (error) {
    console.error('❌ Erro no teste de integração:', error)
    console.error('Stack:', error.stack)
    return false
  }
}

// Executar teste se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testIntegration().then((success) => {
    process.exit(success ? 0 : 1)
  })
}

export { testIntegration }
