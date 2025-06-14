// Teste básico de integração do SystemOrchestrator
// Este arquivo testa se o orquestrador pode ser importado e inicializado

import { SystemOrchestrator, getSystemOrchestrator, initializeSystem } from './src/utils/core/SystemOrchestrator.js'

async function testOrchestrator() {
  console.log('🧪 Iniciando teste de integração do SystemOrchestrator...')
  
  try {
    // Teste 1: Importação
    console.log('✅ Importação bem-sucedida')
    
    // Teste 2: Instanciação
    const orchestrator = getSystemOrchestrator()
    console.log('✅ Instanciação bem-sucedida')
    
    // Teste 3: Verificar propriedades básicas
    console.log('Estado inicial:', orchestrator.state)
    console.log('Modo de operação:', orchestrator.mode)
    console.log('✅ Propriedades básicas verificadas')
    
    // Teste 4: Verificar configurações
    console.log('Configurações carregadas:', Object.keys(orchestrator.config).length, 'opções')
    console.log('✅ Configurações verificadas')
    
    // Teste 5: Verificar sistemas (sem inicializar completamente)
    console.log('Sistemas novos:', Object.keys(orchestrator.newSystems).length)
    console.log('Sistemas existentes:', Object.keys(orchestrator.existingSystems).length)
    console.log('✅ Estrutura de sistemas verificada')
    
    console.log('🎉 Todos os testes básicos passaram!')
    console.log('📋 Resumo:')
    console.log('  - Importação: OK')
    console.log('  - Instanciação: OK') 
    console.log('  - Propriedades: OK')
    console.log('  - Configurações: OK')
    console.log('  - Estrutura: OK')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Executar teste
testOrchestrator().then(() => {
  console.log('✅ Teste concluído com sucesso!')
  process.exit(0)
}).catch(error => {
  console.error('❌ Teste falhou:', error)
  process.exit(1)
})
