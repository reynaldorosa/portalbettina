/**
 * Verificador de importações do Portal Betina
 * Este script é executado após reorganizações de código para verificar
 * se todas as importações estão funcionando corretamente
 */

// Importações de utils principais
import * as utils from '../utils/index.js'

// Importações de submodules específicos
import * as shared from '../utils/shared/index.js'
import * as adaptive from '../utils/adaptive/index.js'
import * as core from '../utils/core/index.js'
import * as accessibility from '../utils/accessibility/index.js'

// Funções específicas para testar
import { generateProgressReport, getProgressSummary } from '../utils/shared/progressReports.js'
import { AdaptiveAccessibilityManager } from '../utils/adaptive/adaptiveAccessibilityManager.js'

// Verificação de funções importantes
const verificarImportacao = (nome, objeto) => {
  if (objeto === undefined || objeto === null) {
    console.error(`❌ ERRO: ${nome} não foi importado corretamente`)
    return false
  }
  console.log(`✅ OK: ${nome} importado corretamente`)
  return true
}

// VERIFICAÇÕES DE UTILS GERAIS
console.log('\n=== VERIFICANDO IMPORTAÇÕES DE UTILS ===')
verificarImportacao('utils', utils)

// VERIFICAÇÕES DE SHARED
console.log('\n=== VERIFICANDO IMPORTAÇÕES DE SHARED ===')
verificarImportacao('shared', shared)
verificarImportacao('generateProgressReport', generateProgressReport)
verificarImportacao('getProgressSummary', getProgressSummary)

// VERIFICAÇÕES DE ADAPTIVE
console.log('\n=== VERIFICANDO IMPORTAÇÕES DE ADAPTIVE ===')
verificarImportacao('adaptive', adaptive)
verificarImportacao('AdaptiveAccessibilityManager', AdaptiveAccessibilityManager)
// Verificar se progressReports está sendo importado corretamente via shared
verificarImportacao('adaptive.generateProgressReport', adaptive.generateProgressReport)

// VERIFICAÇÕES DE CORE
console.log('\n=== VERIFICANDO IMPORTAÇÕES DE CORE ===')
verificarImportacao('core', core)

// VERIFICAÇÕES DE ACCESSIBILITY
console.log('\n=== VERIFICANDO IMPORTAÇÕES DE ACCESSIBILITY ===')
verificarImportacao('accessibility', accessibility)

console.log('\n=== VERIFICAÇÃO COMPLETA ===')
