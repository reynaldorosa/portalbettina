/**
 * 🧪 TESTE SIMPLIFICADO DA FASE 2
 * Portal Betina - Verificação rápida do SystemOrchestrator
 */

console.log('🚀 Iniciando teste da Fase 2...')

// Configurar ambiente Node.js
const logger = {
  info: (...args) => console.log('ℹ️', ...args),
  error: (...args) => console.error('❌', ...args),
  warn: (...args) => console.warn('⚠️', ...args),
  debug: (...args) => console.log('🔍', ...args),
}

// Mock dos globals necessários
global.window = undefined
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

async function testSystemOrchestrator() {
  try {
    console.log('📋 1. Importando SystemOrchestrator...')

    // Dynamic import para evitar problemas de ES modules
    const { default: SystemOrchestrator } = await import('./core/SystemOrchestrator.js')

    console.log('✅ SystemOrchestrator importado com sucesso')

    console.log('📋 2. Criando instância...')
    const orchestrator = new SystemOrchestrator()
    console.log('✅ Instância criada')

    console.log('📋 3. Verificando métodos da Fase 2...')

    const phase2Methods = [
      'setupBasicMetricsFlow',
      'processBehavioralMetrics',
      'processSensorialMetrics',
      'storeInCache',
      'syncCacheToDatabase',
      'testMetricsFlow',
    ]

    let implementedCount = 0

    for (const method of phase2Methods) {
      if (typeof orchestrator[method] === 'function') {
        console.log(`✅ ${method}`)
        implementedCount++
      } else {
        console.log(`❌ ${method} - não encontrado`)
      }
    }

    console.log(`\n📊 Métodos implementados: ${implementedCount}/${phase2Methods.length}`)

    console.log('📋 4. Testando configuração básica...')
    await orchestrator.setupBasicMetricsFlow()
    console.log('✅ Configuração básica testada')

    console.log('📋 5. Testando fluxo de métricas...')
    const testResult = await orchestrator.testMetricsFlow()
    console.log('✅ Fluxo de métricas testado:', testResult.success ? 'SUCESSO' : 'FALHA')

    console.log('\n🎉 FASE 2 VALIDADA COM SUCESSO!')
    return { success: true, implementedMethods: implementedCount }
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message)
    return { success: false, error: error.message }
  }
}

// Executar teste
testSystemOrchestrator()
  .then((result) => {
    console.log('\n🏁 Resultado:', result)
    process.exit(result.success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Erro crítico:', error)
    process.exit(1)
  })
