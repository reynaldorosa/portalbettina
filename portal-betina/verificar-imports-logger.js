// verificar-imports-logger.js
// Script para verificar se todas as importações do logger estão corretas

console.log('🔍 Iniciando verificação de importações do logger...')

// Importa o logger diretamente para verificar se é uma exportação default válida
import logger from './src/utils/logger.js'

// Função para verificar se o logger é válido
function verificarLogger(origem, loggerObj) {
  console.log(`\n📋 Verificando logger importado de: ${origem}`)

  if (!loggerObj) {
    console.error(`❌ ERRO: Logger não definido em: ${origem}`)
    return false
  }

  // Verificar se tem os métodos esperados do logger
  const metodos = ['info', 'error', 'warn', 'debug']
  const metodosPresentes = metodos.filter((m) => typeof loggerObj[m] === 'function')

  if (metodosPresentes.length === metodos.length) {
    console.log(`✅ SUCESSO: Logger de ${origem} possui todos os métodos necessários`)
    // Testar um log para verificar a funcionalidade
    loggerObj.info(`Teste de logger de ${origem}`, { testeId: Date.now() })
    return true
  } else {
    console.error(
      `❌ ERRO: Logger de ${origem} está incompleto. Métodos presentes: ${metodosPresentes.join(', ')}`
    )
    console.error(`Métodos esperados: ${metodos.join(', ')}`)
    return false
  }
}

// Verificar logger principal
if (verificarLogger('utils/logger.js (direct)', logger)) {
  console.log('\n✅ Logger exportado corretamente como default!')
} else {
  console.log('\n❌ PROBLEMA com a exportação default do logger!')
}

// Importar módulos que usam o logger para verificar
async function verificarModulos() {
  try {
    // Core modules
    const { getMachineLearningOrchestrator } = await import(
      './src/core/MachineLearningOrchestrator.js'
    )
    const mlOrch = getMachineLearningOrchestrator()
    console.log('\n✅ MachineLearningOrchestrator importado com sucesso!')

    const { getDataStructuresOptimizer } = await import('./src/core/DataStructuresOptimizer.js')
    const dsOpt = getDataStructuresOptimizer()
    console.log('✅ DataStructuresOptimizer importado com sucesso!')

    const { getPerformanceProfiler } = await import('./src/core/PerformanceProfiler.js')
    const perfProfiler = getPerformanceProfiler()
    console.log('✅ PerformanceProfiler importado com sucesso!')

    // Database modules
    const { getMLMetricsCollector } = await import('./src/database/core/MLMetricsCollector.js')
    const mlMetrics = getMLMetricsCollector()
    console.log('✅ MLMetricsCollector importado com sucesso!')

    const { getNomenclatureRefactoring } = await import(
      './src/database/core/NomenclatureRefactoring.js'
    )
    const nomenclature = getNomenclatureRefactoring()
    console.log('✅ NomenclatureRefactoring importado com sucesso!')

    console.log('\n✅ TODOS OS MÓDULOS VERIFICADOS COM SUCESSO!')
  } catch (error) {
    console.error('\n❌ ERRO ao importar módulos:', error)
  }
}

// Executar verificação
verificarModulos().catch(console.error)
