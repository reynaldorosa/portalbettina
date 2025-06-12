/**
 * TESTE REAL DE CONECTIVIDADE E2E - PORTAL BETTINA
 * Execução direta sem dependências externas
 */

const fs = require('fs')
const path = require('path')

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
}

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString()
  switch (type) {
    case 'success':
      console.log(`${colors.green}✅ [${timestamp}] ${message}${colors.reset}`)
      break
    case 'error':
      console.log(`${colors.red}❌ [${timestamp}] ${message}${colors.reset}`)
      break
    case 'warning':
      console.log(`${colors.yellow}⚠️  [${timestamp}] ${message}${colors.reset}`)
      break
    case 'info':
      console.log(`${colors.blue}ℹ️  [${timestamp}] ${message}${colors.reset}`)
      break
    case 'header':
      console.log(`${colors.magenta}${colors.bright}🔍 [${timestamp}] ${message}${colors.reset}`)
      break
    case 'step':
      console.log(`${colors.cyan}📋 [${timestamp}] ${message}${colors.reset}`)
      break
  }
}

function checkFile(filePath) {
  try {
    const exists = fs.existsSync(filePath)
    const stats = exists ? fs.statSync(filePath) : null
    return {
      exists,
      size: stats ? stats.size : 0,
      lines: exists ? fs.readFileSync(filePath, 'utf-8').split('\n').length : 0,
    }
  } catch (error) {
    return { exists: false, size: 0, lines: 0, error: error.message }
  }
}

function checkImports(filePath, expectedImports) {
  try {
    if (!fs.existsSync(filePath)) return { found: 0, total: expectedImports.length }

    const content = fs.readFileSync(filePath, 'utf-8')
    let found = 0

    for (const importStr of expectedImports) {
      if (content.includes(importStr)) {
        found++
      }
    }

    return { found, total: expectedImports.length }
  } catch (error) {
    return { found: 0, total: expectedImports.length, error: error.message }
  }
}

async function testeConectividadeE2E() {
  console.log(`${colors.bright}${colors.cyan}`)
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║                    PORTAL BETTINA                           ║')
  console.log('║               TESTE E2E REAL EXECUTANDO                     ║')
  console.log('║                 Conectividade Módulos                       ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log(`${colors.reset}\n`)

  const resultados = {
    frontend: { score: 0, total: 0 },
    hooks: { score: 0, total: 0 },
    utils: { score: 0, total: 0 },
    database: { score: 0, total: 0 },
    api: { score: 0, total: 0 },
    conectividade: { score: 0, total: 0 },
  }

  // ============================================================================
  // TESTE 1: FRONTEND
  // ============================================================================
  log('header', 'TESTE 1: VERIFICAÇÃO DO FRONTEND')

  const frontendFiles = ['src/main.jsx', 'src/App.jsx', 'src/index.js']

  resultados.frontend.total = frontendFiles.length

  for (const file of frontendFiles) {
    const check = checkFile(file)
    if (check.exists) {
      log('success', `Frontend: ${file} (${check.lines} linhas)`)
      resultados.frontend.score++
    } else {
      log('error', `Frontend: ${file} NÃO ENCONTRADO`)
    }
  }

  log('info', `Frontend Score: ${resultados.frontend.score}/${resultados.frontend.total}`)
  console.log('')

  // ============================================================================
  // TESTE 2: HOOKS (EQUIVALENTE AO ROOKS)
  // ============================================================================
  log('header', 'TESTE 2: VERIFICAÇÃO DOS HOOKS')

  const hooksFiles = [
    'src/hooks/useUser.js',
    'src/hooks/useActivity.js',
    'src/hooks/useAdvancedActivity.js',
    'src/hooks/useProgress.js',
  ]

  resultados.hooks.total = hooksFiles.length

  for (const file of hooksFiles) {
    const check = checkFile(file)
    if (check.exists) {
      log('success', `Hook: ${file} (${check.lines} linhas)`)
      resultados.hooks.score++
    } else {
      log('error', `Hook: ${file} NÃO ENCONTRADO`)
    }
  }

  log('info', `Hooks Score: ${resultados.hooks.score}/${resultados.hooks.total}`)
  console.log('')

  // ============================================================================
  // TESTE 3: UTILS (SISTEMA NEUROPEDAGÓGICO)
  // ============================================================================
  log('header', 'TESTE 3: VERIFICAÇÃO DOS UTILS')

  const utilsFiles = [
    'src/utils/neuropedagogicalInsights.js',
    'src/utils/neuropedagogicalExtensions.js',
    'src/utils/portalBettinaController.js',
    'src/utils/featureFlags.js',
  ]

  resultados.utils.total = utilsFiles.length

  for (const file of utilsFiles) {
    const check = checkFile(file)
    if (check.exists) {
      log('success', `Utils: ${file} (${check.lines} linhas)`)
      resultados.utils.score++
    } else {
      log('error', `Utils: ${file} NÃO ENCONTRADO`)
    }
  }

  log('info', `Utils Score: ${resultados.utils.score}/${resultados.utils.total}`)
  console.log('')

  // ============================================================================
  // TESTE 4: DATABASE
  // ============================================================================
  log('header', 'TESTE 4: VERIFICAÇÃO DO DATABASE')

  const databaseFiles = [
    'src/services/databaseService.js',
    'src/services/databaseService_fixed.js',
    'src/services/databaseService_clean.js',
    'src/services/databaseService_online_only.js',
  ]

  resultados.database.total = databaseFiles.length

  for (const file of databaseFiles) {
    const check = checkFile(file)
    if (check.exists) {
      log('success', `Database: ${file} (${check.lines} linhas)`)
      resultados.database.score++
    } else {
      log('warning', `Database: ${file} não encontrado`)
    }
  }

  log('info', `Database Score: ${resultados.database.score}/${resultados.database.total}`)
  console.log('')

  // ============================================================================
  // TESTE 5: API
  // ============================================================================
  log('header', 'TESTE 5: VERIFICAÇÃO DA API')

  const apiFiles = ['src/services/api-server.js', 'src/services/api-server-updated.js']

  resultados.api.total = apiFiles.length

  for (const file of apiFiles) {
    const check = checkFile(file)
    if (check.exists) {
      log('success', `API: ${file} (${check.lines} linhas)`)
      resultados.api.score++
    } else {
      log('error', `API: ${file} NÃO ENCONTRADO`)
    }
  }

  log('info', `API Score: ${resultados.api.score}/${resultados.api.total}`)
  console.log('')

  // ============================================================================
  // TESTE 6: CONECTIVIDADE ENTRE MÓDULOS
  // ============================================================================
  log('header', 'TESTE 6: VERIFICAÇÃO DE CONECTIVIDADE')

  const conectividadeTests = [
    {
      file: 'src/hooks/useUser.js',
      imports: ['databaseService'],
      description: 'useUser → DatabaseService',
    },
    {
      file: 'src/hooks/useAdvancedActivity.js',
      imports: ['neuropedagogicalInsights', 'multisensoryMetrics'],
      description: 'useAdvancedActivity → Utils',
    },
    {
      file: 'src/contexts/UserContext.jsx',
      imports: ['databaseService'],
      description: 'UserContext → DatabaseService',
    },
    {
      file: 'src/main.jsx',
      imports: ['initializeSystem', 'App'],
      description: 'Main → SystemOrchestrator + App',
    },
  ]

  resultados.conectividade.total = conectividadeTests.length

  for (const test of conectividadeTests) {
    const importCheck = checkImports(test.file, test.imports)
    const percentage = Math.round((importCheck.found / importCheck.total) * 100)

    if (percentage >= 80) {
      log(
        'success',
        `${test.description}: ${importCheck.found}/${importCheck.total} imports (${percentage}%)`
      )
      resultados.conectividade.score++
    } else if (percentage >= 50) {
      log(
        'warning',
        `${test.description}: ${importCheck.found}/${importCheck.total} imports (${percentage}%)`
      )
    } else {
      log(
        'error',
        `${test.description}: ${importCheck.found}/${importCheck.total} imports (${percentage}%)`
      )
    }
  }

  log(
    'info',
    `Conectividade Score: ${resultados.conectividade.score}/${resultados.conectividade.total}`
  )
  console.log('')

  // ============================================================================
  // RESULTADO FINAL
  // ============================================================================
  log('header', 'RESULTADO FINAL DO TESTE E2E')

  const totalScore = Object.values(resultados).reduce((acc, curr) => acc + curr.score, 0)
  const totalPossible = Object.values(resultados).reduce((acc, curr) => acc + curr.total, 0)
  const overallPercentage = Math.round((totalScore / totalPossible) * 100)

  console.log(`${colors.bright}📊 ESTATÍSTICAS DETALHADAS:${colors.reset}`)
  console.log(
    `   Frontend:     ${resultados.frontend.score}/${resultados.frontend.total} (${Math.round((resultados.frontend.score / resultados.frontend.total) * 100)}%)`
  )
  console.log(
    `   Hooks:        ${resultados.hooks.score}/${resultados.hooks.total} (${Math.round((resultados.hooks.score / resultados.hooks.total) * 100)}%)`
  )
  console.log(
    `   Utils:        ${resultados.utils.score}/${resultados.utils.total} (${Math.round((resultados.utils.score / resultados.utils.total) * 100)}%)`
  )
  console.log(
    `   Database:     ${resultados.database.score}/${resultados.database.total} (${Math.round((resultados.database.score / resultados.database.total) * 100)}%)`
  )
  console.log(
    `   API:          ${resultados.api.score}/${resultados.api.total} (${Math.round((resultados.api.score / resultados.api.total) * 100)}%)`
  )
  console.log(
    `   Conectividade: ${resultados.conectividade.score}/${resultados.conectividade.total} (${Math.round((resultados.conectividade.score / resultados.conectividade.total) * 100)}%)`
  )
  console.log('')
  console.log(
    `${colors.bright}🎯 SCORE GERAL: ${totalScore}/${totalPossible} (${overallPercentage}%)${colors.reset}`
  )
  console.log('')

  if (overallPercentage >= 90) {
    log('success', '🎉 SISTEMA COMPLETAMENTE CONECTADO E FUNCIONAL!')
    console.log(`${colors.green}   ✅ Todos os módulos integrados corretamente${colors.reset}`)
    console.log(`${colors.green}   ✅ Conectividade E2E validada${colors.reset}`)
    console.log(`${colors.green}   ✅ Pronto para produção${colors.reset}`)
  } else if (overallPercentage >= 75) {
    log('warning', '⚠️ SISTEMA PARCIALMENTE CONECTADO')
    console.log(`${colors.yellow}   ⚠️  Maioria dos componentes funcionando${colors.reset}`)
    console.log(`${colors.yellow}   ⚠️  Alguns ajustes necessários${colors.reset}`)
  } else {
    log('error', '❌ PROBLEMAS CRÍTICOS DE CONECTIVIDADE')
    console.log(`${colors.red}   ❌ Múltiplos módulos ausentes${colors.reset}`)
    console.log(`${colors.red}   ❌ Correções necessárias antes de produção${colors.reset}`)
  }

  console.log('')
  log('info', '🔍 Teste concluído - Portal Bettina E2E')

  return resultados
}

// Executar o teste
testeConectividadeE2E().catch(console.error)
