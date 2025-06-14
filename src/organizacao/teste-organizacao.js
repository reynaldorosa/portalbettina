/**
 * Teste de Organização - Portal Betina
 * Este arquivo verifica se todas as importações após a reorganização estão funcionando corretamente.
 */

// Importar módulos principais
import { generateProgressReport, generateSuggestions } from './utils/shared/progressReports.js'
import { AdaptiveAccessibilityManager } from './utils/adaptive/adaptiveAccessibilityManager.js'
import { SystemOrchestrator } from './utils/core/SystemOrchestrator.js'

// Importações via index.js
import * as adaptive from './utils/adaptive/index.js'
import * as accessibility from './utils/accessibility/index.js'
import * as core from './utils/core/index.js'
import * as shared from './utils/shared/index.js'

// Teste de verificação
console.log('=== TESTE DE ORGANIZAÇÃO - PORTAL BETINA ===')

// Verificar importações diretas
console.log('\n1. Verificando importações diretas:')
console.log('- generateProgressReport:', typeof generateProgressReport === 'function' ? '✅' : '❌')
console.log('- generateSuggestions:', typeof generateSuggestions === 'function' ? '✅' : '❌')
console.log(
  '- AdaptiveAccessibilityManager:',
  typeof AdaptiveAccessibilityManager === 'function' ? '✅' : '❌'
)
console.log('- SystemOrchestrator:', typeof SystemOrchestrator === 'function' ? '✅' : '❌')

// Verificar importações via index
console.log('\n2. Verificando importações via index.js:')
console.log(
  '- adaptive.AdaptiveAccessibilityManager:',
  typeof adaptive.AdaptiveAccessibilityManager === 'function' ? '✅' : '❌'
)
console.log(
  '- adaptive (relatórios de progresso):',
  'generateProgressReport' in adaptive ? '✅' : '❌'
)
console.log(
  '- core.SystemOrchestrator:',
  typeof core.SystemOrchestrator === 'function' ? '✅' : '❌'
)
console.log('- shared (relatórios de progresso):', 'generateProgressReport' in shared ? '✅' : '❌')

console.log('\nTeste de organização concluído!')
