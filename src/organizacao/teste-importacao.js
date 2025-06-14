/**
 * Script de teste para verificar as importações
 * dos arquivos reorganizados no projeto
 */

import {
  // Importando das pastas principais
  generateProgressReport,
  getProgressSummary,
  generateSuggestions,
  exportProgressData,
} from '../utils/shared/index.js'

import { AdaptiveAccessibilityManager } from '../utils/adaptive/index.js'

// Importações do arquivo principal de utils
import {
  // Principais serviços
  AccessibilityService,
  AdaptiveService,
  EmotionalAnalysisService,
  NeuroplasticityService,
} from '../utils/index.js'

// Imprimir status das importações
console.log('==== TESTE DE IMPORTAÇÃO DE MÓDULOS REORGANIZADOS ====')

// Verificar funções de progressReports
console.log('\n1. Verificando funções de relatório de progresso:')
console.log(
  `- generateProgressReport: ${typeof generateProgressReport === 'function' ? 'OK' : 'ERRO'}`
)
console.log(`- getProgressSummary: ${typeof getProgressSummary === 'function' ? 'OK' : 'ERRO'}`)
console.log(`- generateSuggestions: ${typeof generateSuggestions === 'function' ? 'OK' : 'ERRO'}`)
console.log(`- exportProgressData: ${typeof exportProgressData === 'function' ? 'OK' : 'ERRO'}`)

// Verificar serviços principais
console.log('\n2. Verificando serviços principais:')
console.log(
  `- AdaptiveAccessibilityManager: ${typeof AdaptiveAccessibilityManager === 'function' ? 'OK' : 'ERRO'}`
)
console.log(`- AccessibilityService: ${typeof AccessibilityService === 'function' ? 'OK' : 'ERRO'}`)
console.log(`- AdaptiveService: ${typeof AdaptiveService === 'function' ? 'OK' : 'ERRO'}`)
console.log(
  `- EmotionalAnalysisService: ${typeof EmotionalAnalysisService === 'function' ? 'OK' : 'ERRO'}`
)
console.log(
  `- NeuroplasticityService: ${typeof NeuroplasticityService === 'function' ? 'OK' : 'ERRO'}`
)

console.log('\n==== TESTE DE IMPORTAÇÃO CONCLUÍDO ====')
