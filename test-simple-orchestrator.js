import { SystemOrchestrator } from './src/utils/core/SystemOrchestrator.js'
import databaseService from './src/database/core/DatabaseService.js'

console.log('🔄 Iniciando teste do SystemOrchestrator...')

try {
  console.log('📦 Importações carregadas com sucesso')
  
  const orchestrator = new SystemOrchestrator(databaseService)
  console.log('✅ SystemOrchestrator instanciado com sucesso')
  
  await orchestrator.init()
  console.log('✅ SystemOrchestrator inicializado com sucesso')
  
} catch (error) {
  console.error('❌ Erro:', error.message)
  console.error('Stack:', error.stack)
}
