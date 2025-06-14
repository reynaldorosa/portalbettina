// test-orchestrator-quick.js - TESTE TERAPÊUTICO SEM ML
import { SystemOrchestrator, getSystemOrchestrator } from './src/utils/core/SystemOrchestrator.js';

async function testTherapeuticOrchestrator() {
  console.log('🏥 Testando SystemOrchestrator Terapêutico...');
  
  try {
    // Teste 1: Criar instância
    const orchestrator = getSystemOrchestrator();
    console.log('✅ Instância terapêutica criada com sucesso');
    
    // Teste 2: Inicializar sistema
    await orchestrator.init();
    console.log('✅ Sistema terapêutico inicializado com sucesso');
    
    // Teste 3: Verificar estado
    const stats = orchestrator.getUnifiedStatistics();
    console.log('✅ Estatísticas terapêuticas obtidas:', {
      state: stats.systemState,
      uptime: stats.uptime,
      totalSessions: stats.totalSessions
    });
    
    // Teste 4: Processar evento de jogo
    const gameResult = await orchestrator.processEvent({
      type: 'game_start',
      data: { 
        gameId: 'memory-game', 
        userId: 'test-user',
        timestamp: Date.now() 
      }
    });
    console.log('✅ Evento de jogo processado:', gameResult.success);
    
    // Teste 5: Shutdown
    orchestrator.shutdown();
    console.log('✅ Sistema terapêutico parado com sucesso');
    
    console.log('🎉 Todos os testes terapêuticos passaram!');
    
  } catch (error) {
    console.error('❌ Erro no teste terapêutico:', error.message);
    console.error(error.stack);
  }
}

testTherapeuticOrchestrator();
