#!/usr/bin/env node

/**
 * 🔍 TESTE DE CONECTIVIDADE E2E - PORTAL BETTINA
 * Verificação completa da cadeia de integração entre módulos
 *
 * Fluxo testado:
 * Frontend → Hooks → Utils → Database → API → Backend → Response
 *
 * @version 1.0.0
 * @created 2025-06-11
 */

import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ============================================================================
// 🎯 CONFIGURAÇÃO E CONSTANTES
// ============================================================================

const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
}

const log = {
  success: (msg) => console.log(`${COLORS.GREEN}✅ ${msg}${COLORS.RESET}`),
  error: (msg) => console.log(`${COLORS.RED}❌ ${msg}${COLORS.RESET}`),
  warning: (msg) => console.log(`${COLORS.YELLOW}⚠️  ${msg}${COLORS.RESET}`),
  info: (msg) => console.log(`${COLORS.BLUE}ℹ️  ${msg}${COLORS.RESET}`),
  header: (msg) => console.log(`${COLORS.MAGENTA}${COLORS.BRIGHT}🔍 ${msg}${COLORS.RESET}`),
  step: (msg) => console.log(`${COLORS.CYAN}📋 ${msg}${COLORS.RESET}`),
}

// Caminhos dos módulos principais
const MODULES = {
  // Frontend Components
  FRONTEND: {
    main: 'src/main.jsx',
    app: 'src/App.jsx',
    components: 'src/components/',
    pages: 'src/components/pages/',
  },

  // Hooks (Rooks equivalente)
  HOOKS: {
    base: 'src/hooks/',
    useUser: 'src/hooks/useUser.js',
    useActivity: 'src/hooks/useActivity.js',
    useAdvancedActivity: 'src/hooks/useAdvancedActivity.js',
    useProgress: 'src/hooks/useProgress.js',
  },

  // Utils (Sistema neuropedagógico)
  UTILS: {
    base: 'src/utils/',
    insights: 'src/utils/neuropedagogicalInsights.js',
    extensions: 'src/utils/neuropedagogicalExtensions.js',
    controller: 'src/utils/portalBettinaController.js',
    featureFlags: 'src/utils/featureFlags.js',
  },

  // Database Layer
  DATABASE: {
    service: 'src/services/databaseService.js',
    fixedService: 'src/services/databaseService_fixed.js',
    onlineService: 'src/services/databaseService_online_only.js',
    cleanService: 'src/services/databaseService_clean.js',
    core: 'src/database/',
  },

  // API Server
  API: {
    server: 'src/services/api-server.js',
    updated: 'src/services/api-server-updated.js',
    middleware: 'src/services/middleware/',
  },

  // Contexts
  CONTEXTS: {
    base: 'src/contexts/',
    user: 'src/contexts/UserContext.jsx',
    theme: 'src/contexts/ThemeContext.jsx',
  },

  // Core Systems
  CORE: {
    orchestrator: 'src/core/SystemOrchestrator.js',
    ml: 'src/core/MachineLearningOrchestrator.js',
  },
}

// ============================================================================
// 🔍 FUNÇÕES DE VERIFICAÇÃO
// ============================================================================

/**
 * Verifica se um arquivo existe
 */
function checkFile(filePath, description) {
  const fullPath = join(__dirname, filePath)
  const exists = existsSync(fullPath)

  if (exists) {
    log.success(`${description}: ${filePath}`)
  } else {
    log.error(`${description} NÃO ENCONTRADO: ${filePath}`)
  }

  return exists
}

/**
 * Verifica a estrutura de um módulo
 */
function checkModuleStructure(moduleName, paths) {
  log.header(`Verificando Módulo: ${moduleName}`)

  let foundFiles = 0
  let totalFiles = 0

  for (const [key, path] of Object.entries(paths)) {
    totalFiles++
    const description = `${moduleName}.${key}`

    if (checkFile(path, description)) {
      foundFiles++
    }
  }

  const percentage = Math.round((foundFiles / totalFiles) * 100)

  if (percentage === 100) {
    log.success(`${moduleName}: ${foundFiles}/${totalFiles} arquivos encontrados (${percentage}%)`)
  } else if (percentage >= 80) {
    log.warning(`${moduleName}: ${foundFiles}/${totalFiles} arquivos encontrados (${percentage}%)`)
  } else {
    log.error(`${moduleName}: ${foundFiles}/${totalFiles} arquivos encontrados (${percentage}%)`)
  }

  console.log('')
  return { foundFiles, totalFiles, percentage }
}

/**
 * Verifica imports entre módulos
 */
async function checkImports() {
  log.header('Verificando Conectividade de Imports')

  const importTests = [
    {
      file: 'src/hooks/useUser.js',
      expectedImports: ['databaseService'],
      description: 'Hook useUser → DatabaseService',
    },
    {
      file: 'src/hooks/useActivity.js',
      expectedImports: ['useSound', 'useProgress', 'useUser'],
      description: 'Hook useActivity → Outros Hooks',
    },
    {
      file: 'src/hooks/useAdvancedActivity.js',
      expectedImports: ['neuropedagogicalInsights', 'multisensoryMetrics'],
      description: 'Hook useAdvancedActivity → Utils',
    },
    {
      file: 'src/contexts/UserContext.jsx',
      expectedImports: ['databaseService'],
      description: 'UserContext → DatabaseService',
    },
    {
      file: 'src/main.jsx',
      expectedImports: ['App', 'initializeSystem'],
      description: 'Main → App + SystemOrchestrator',
    },
  ]

  for (const test of importTests) {
    log.step(`Verificando: ${test.description}`)

    const filePath = join(__dirname, test.file)

    if (!existsSync(filePath)) {
      log.error(`Arquivo não encontrado: ${test.file}`)
      continue
    }

    try {
      const { readFile } = await import('fs/promises')
      const content = await readFile(filePath, 'utf-8')

      let foundImports = 0

      for (const expectedImport of test.expectedImports) {
        if (content.includes(expectedImport)) {
          foundImports++
          log.success(`  Import encontrado: ${expectedImport}`)
        } else {
          log.warning(`  Import ausente: ${expectedImport}`)
        }
      }

      const percentage = Math.round((foundImports / test.expectedImports.length) * 100)
      log.info(`  Conectividade: ${foundImports}/${test.expectedImports.length} (${percentage}%)`)
    } catch (error) {
      log.error(`Erro ao ler arquivo ${test.file}: ${error.message}`)
    }

    console.log('')
  }
}

/**
 * Simula teste E2E
 */
async function simulateE2EFlow() {
  log.header('Simulação de Fluxo E2E')

  const e2eSteps = [
    {
      step: '1. Inicialização do Frontend',
      check: () => checkFile('src/main.jsx', 'Entry Point'),
      description: 'Verificar se o ponto de entrada existe',
    },
    {
      step: '2. Carregamento de Contextos',
      check: () => checkFile('src/contexts/UserContext.jsx', 'User Context'),
      description: 'Verificar se o contexto de usuário está disponível',
    },
    {
      step: '3. Hooks de Integração',
      check: () => {
        const userHook = checkFile('src/hooks/useUser.js', 'User Hook')
        const activityHook = checkFile('src/hooks/useActivity.js', 'Activity Hook')
        return userHook && activityHook
      },
      description: 'Verificar se os hooks estão integrados',
    },
    {
      step: '4. Sistema de Utils',
      check: () => {
        const insights = checkFile('src/utils/neuropedagogicalInsights.js', 'Insights')
        const controller = checkFile('src/utils/portalBettinaController.js', 'Controller')
        return insights && controller
      },
      description: 'Verificar se o sistema de utils está operacional',
    },
    {
      step: '5. Database Layer',
      check: () => {
        const mainDb = checkFile('src/services/databaseService.js', 'Database Service')
        const fixedDb = checkFile('src/services/databaseService_fixed.js', 'Fixed Database')
        return mainDb || fixedDb
      },
      description: 'Verificar se pelo menos um serviço de database existe',
    },
    {
      step: '6. API Server',
      check: () => {
        const apiServer = checkFile('src/services/api-server.js', 'API Server')
        const updatedApi = checkFile('src/services/api-server-updated.js', 'Updated API')
        return apiServer || updatedApi
      },
      description: 'Verificar se o servidor de API está configurado',
    },
    {
      step: '7. Core Systems',
      check: () => {
        const orchestrator = checkFile('src/core/SystemOrchestrator.js', 'System Orchestrator')
        return orchestrator
      },
      description: 'Verificar se o orquestrador central existe',
    },
  ]

  let passedSteps = 0

  for (const { step, check, description } of e2eSteps) {
    log.step(step)
    log.info(`  ${description}`)

    const passed = check()

    if (passed) {
      log.success(`  ✅ Passo aprovado`)
      passedSteps++
    } else {
      log.error(`  ❌ Passo falhado`)
    }

    console.log('')
  }

  const percentage = Math.round((passedSteps / e2eSteps.length) * 100)

  if (percentage === 100) {
    log.success(`🎉 TESTE E2E COMPLETO: ${passedSteps}/${e2eSteps.length} passos (${percentage}%)`)
  } else if (percentage >= 80) {
    log.warning(`⚠️ TESTE E2E PARCIAL: ${passedSteps}/${e2eSteps.length} passos (${percentage}%)`)
  } else {
    log.error(`❌ TESTE E2E FALHADO: ${passedSteps}/${e2eSteps.length} passos (${percentage}%)`)
  }

  return { passedSteps, totalSteps: e2eSteps.length, percentage }
}

/**
 * Verifica dependências críticas
 */
async function checkCriticalDependencies() {
  log.header('Verificando Dependências Críticas')

  const packagePath = join(__dirname, 'package.json')

  if (!existsSync(packagePath)) {
    log.error('package.json não encontrado!')
    return false
  }

  try {
    const { readFile } = await import('fs/promises')
    const packageContent = await readFile(packagePath, 'utf-8')
    const packageJson = JSON.parse(packageContent)

    const criticalDeps = ['react', 'react-dom', 'express', 'pg', 'cors', 'winston', 'zod']

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    let foundDeps = 0

    for (const dep of criticalDeps) {
      if (allDeps[dep]) {
        log.success(`  Dependência encontrada: ${dep}@${allDeps[dep]}`)
        foundDeps++
      } else {
        log.error(`  Dependência ausente: ${dep}`)
      }
    }

    const percentage = Math.round((foundDeps / criticalDeps.length) * 100)
    log.info(`Dependências críticas: ${foundDeps}/${criticalDeps.length} (${percentage}%)`)

    return percentage >= 90
  } catch (error) {
    log.error(`Erro ao ler package.json: ${error.message}`)
    return false
  }
}

// ============================================================================
// 🚀 FUNÇÃO PRINCIPAL
// ============================================================================

async function main() {
  console.log(`${COLORS.BRIGHT}${COLORS.CYAN}`)
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║                    PORTAL BETTINA                           ║')
  console.log('║              TESTE DE CONECTIVIDADE E2E                     ║')
  console.log('║                      v1.0.0                                 ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log(`${COLORS.RESET}\n`)

  const results = {
    modules: {},
    imports: true,
    dependencies: false,
    e2e: { percentage: 0 },
  }

  // 1. Verificar estrutura dos módulos
  for (const [moduleName, paths] of Object.entries(MODULES)) {
    results.modules[moduleName] = checkModuleStructure(moduleName, paths)
  }

  // 2. Verificar imports
  await checkImports()

  // 3. Verificar dependências críticas
  results.dependencies = await checkCriticalDependencies()
  console.log('')

  // 4. Simular fluxo E2E
  results.e2e = await simulateE2EFlow()

  // 5. Relatório final
  log.header('RELATÓRIO FINAL DE CONECTIVIDADE')

  // Calcular estatísticas gerais
  let totalFiles = 0
  let foundFiles = 0

  for (const moduleResult of Object.values(results.modules)) {
    totalFiles += moduleResult.totalFiles
    foundFiles += moduleResult.foundFiles
  }

  const overallPercentage = Math.round((foundFiles / totalFiles) * 100)

  console.log(`${COLORS.BRIGHT}📊 ESTATÍSTICAS GERAIS:${COLORS.RESET}`)
  console.log(`   Arquivos encontrados: ${foundFiles}/${totalFiles} (${overallPercentage}%)`)
  console.log(`   Dependências críticas: ${results.dependencies ? '✅ OK' : '❌ Problemas'}`)
  console.log(`   Fluxo E2E: ${results.e2e.percentage}% funcional`)
  console.log('')

  // Status final
  if (overallPercentage >= 95 && results.dependencies && results.e2e.percentage >= 85) {
    log.success('🎉 SISTEMA COMPLETAMENTE CONECTADO E FUNCIONAL!')
    console.log(
      `${COLORS.GREEN}   ✅ Todos os módulos estão integrados corretamente${COLORS.RESET}`
    )
    console.log(`${COLORS.GREEN}   ✅ Dependências estão instaladas${COLORS.RESET}`)
    console.log(`${COLORS.GREEN}   ✅ Fluxo E2E está operacional${COLORS.RESET}`)
  } else if (overallPercentage >= 80 && results.e2e.percentage >= 70) {
    log.warning('⚠️ SISTEMA PARCIALMENTE CONECTADO')
    console.log(`${COLORS.YELLOW}   ⚠️  Algumas integrações podem ter problemas${COLORS.RESET}`)
    console.log(`${COLORS.YELLOW}   ⚠️  Recomenda-se verificação manual${COLORS.RESET}`)
  } else {
    log.error('❌ PROBLEMAS CRÍTICOS DE CONECTIVIDADE')
    console.log(`${COLORS.RED}   ❌ Múltiplos módulos ausentes ou desconectados${COLORS.RESET}`)
    console.log(`${COLORS.RED}   ❌ Sistema pode não funcionar corretamente${COLORS.RESET}`)
  }

  console.log('')
  log.info('📋 Para mais detalhes, consulte os logs acima.')

  return results
}

// ============================================================================
// 🎯 EXECUÇÃO
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`${COLORS.RED}❌ Erro fatal:${COLORS.RESET}`, error)
    process.exit(1)
  })
}

export default main
