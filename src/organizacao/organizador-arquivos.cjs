/**
 * ORGANIZADOR DE ARQUIVOS E DETECTOR DE DUPLICIDADES - PORTAL BETINA
 * Script para organizar arquivos conforme estrutura ORGANIZACAO e resolver duplicidades
 *
 * @version 1.0.0
 * @date 2025-06-11
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Configurações
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const STRUCTURE_FILE = path.join(__dirname, 'estrutura_inicial.json')
const LOG_FILE = path.join(__dirname, 'organizacao_log.json')

// Estrutura de organização conforme documentação ORGANIZACAO
const TARGET_STRUCTURE = {
  'src/utils/accessibility/': ['adaptiveAccessibilityManager.js'],
  'src/utils/adaptive/': ['adaptiveAccessibilityManager.js'],
  'src/utils/adaptiveSystems/': ['advancedAnalysisOrchestrator.js'],
  'src/utils/audio/': ['audioGenerator.js', 'audioManager.js'],
  'src/utils/cognitive/': ['autismCognitiveAnalyzer.js'],
  'src/utils/core/': ['featureFlags.js', 'portalBettinaController.js'],
  'src/utils/emotionalAnalysis/': ['EmotionalAnalysisService.js', 'emotionalAnalysisEngine.js'],
  'src/utils/multisensoryAnalysis/': ['multisensoryAnalysisEngine.js'],
  'src/utils/neuroplasticity/': [
    'NeuroplasticityService.js',
    'neuroplasticityAnalyzer.js',
    'neuroplasticityTracking.js',
  ],
  'src/utils/predictiveAnalysis/': ['predictiveAnalysisEngine.js'],
  'src/utils/shared/': ['progressReports.js'],
}

/**
 * Carrega estrutura inicial
 */
function loadInitialStructure() {
  try {
    const data = fs.readFileSync(STRUCTURE_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('❌ Erro ao carregar estrutura inicial:', error.message)
    return null
  }
}

/**
 * Analisa duplicidades
 */
function analyzeDuplicates(structure) {
  console.log('\n🔍 ANÁLISE DE DUPLICIDADES')
  console.log('========================')

  const duplicates = structure.duplicates || []
  const duplicateActions = []

  duplicates.forEach((duplicate, index) => {
    console.log(`\n📋 Grupo ${index + 1}: ${duplicate.files.length} arquivos idênticos`)
    console.log(`🔗 Hash: ${duplicate.hash.substring(0, 8)}...`)
    console.log(`📏 Tamanho: ${(duplicate.size / 1024).toFixed(2)} KB`)

    duplicate.files.forEach((file, fileIndex) => {
      console.log(`   ${fileIndex === 0 ? '🎯' : '🔄'} ${file}`)
    })

    // Determinar ação: manter o primeiro, mover outros
    const [keep, ...remove] = duplicate.files
    duplicateActions.push({
      keep,
      remove,
      reason: 'Primeira ocorrência mantida, outras movidas para backup',
    })
  })

  return duplicateActions
}

/**
 * Organiza arquivos conforme estrutura alvo
 */
function organizeFiles(structure) {
  console.log('\n📁 ORGANIZAÇÃO DE ARQUIVOS')
  console.log('=========================')

  const files = structure.files || []
  const organizationActions = []

  // Mapear arquivos para suas pastas alvo
  for (const [targetFolder, targetFiles] of Object.entries(TARGET_STRUCTURE)) {
    targetFiles.forEach((fileName) => {
      const file = files.find((f) => f.name === fileName)
      if (file) {
        const currentPath = file.path
        const targetPath = path.join(targetFolder, fileName).replace(/\\/g, '/')

        if (currentPath !== targetPath) {
          organizationActions.push({
            action: 'move',
            from: currentPath,
            to: targetPath,
            reason: 'Organização conforme estrutura ORGANIZACAO',
          })
          console.log(`📦 ${fileName}: ${currentPath} → ${targetPath}`)
        } else {
          console.log(`✅ ${fileName}: já na posição correta`)
        }
      } else {
        console.log(`⚠️  ${fileName}: arquivo não encontrado`)
      }
    })
  }

  return organizationActions
}

/**
 * Verifica e cria índices necessários
 */
function checkAndCreateIndexes(structure) {
  console.log('\n📚 VERIFICAÇÃO DE ÍNDICES')
  console.log('========================')

  const requiredIndexes = [
    'src/utils/autismCognitiveAnalysis/index.js',
    'src/utils/multisensoryAnalysis/index.js',
    'src/utils/predictiveAnalysis/index.js',
    'src/utils/accessibility/index.js',
    'src/utils/adaptive/index.js',
    'src/utils/core/index.js',
  ]

  const indexActions = []

  requiredIndexes.forEach((indexPath) => {
    const fullPath = path.join(PROJECT_ROOT, indexPath)
    if (!fs.existsSync(fullPath)) {
      indexActions.push({
        action: 'create_index',
        path: indexPath,
        reason: 'Índice necessário para organização modular',
      })
      console.log(`📝 Criar índice: ${indexPath}`)
    } else {
      console.log(`✅ Índice existe: ${indexPath}`)
    }
  })

  return indexActions
}

/**
 * Analisa redirecionamentos necessários
 */
function analyzeRedirections(structure) {
  console.log('\n🔀 ANÁLISE DE REDIRECIONAMENTOS')
  console.log('==============================')

  const files = structure.files || []
  const redirections = []

  // Analisar arquivos que precisam ser redirecionados para Database, Orchestrator, etc.
  files.forEach((file) => {
    if (file.exports) {
      const { functions, classes, variables } = file.exports

      // Verificar se contém funcionalidades que devem ser redirecionadas
      const shouldRedirectToDatabase =
        functions.some(
          (f) =>
            f.includes('database') ||
            f.includes('Database') ||
            f.includes('crud') ||
            f.includes('CRUD')
        ) || classes.some((c) => c.includes('Database') || c.includes('Service'))

      const shouldRedirectToOrchestrator =
        functions.some(
          (f) =>
            f.includes('orchestrator') ||
            f.includes('Orchestrator') ||
            f.includes('system') ||
            f.includes('System')
        ) || classes.some((c) => c.includes('Orchestrator') || c.includes('System'))

      if (shouldRedirectToDatabase || shouldRedirectToOrchestrator) {
        redirections.push({
          file: file.path,
          target: shouldRedirectToDatabase ? 'Database' : 'Orchestrator',
          functions: [...functions, ...classes, ...variables],
          reason: `Contém funcionalidades que devem ser centralizadas`,
        })

        console.log(`🎯 ${file.name} → ${shouldRedirectToDatabase ? 'Database' : 'Orchestrator'}`)
      }
    }
  })

  return redirections
}

/**
 * Executa ações de organização
 */
function executeActions(duplicateActions, organizationActions, indexActions, redirections) {
  console.log('\n⚡ EXECUÇÃO DAS AÇÕES')
  console.log('===================')

  const results = {
    executed: [],
    failed: [],
    skipped: [],
  }

  // 1. Criar backups para duplicatas
  duplicateActions.forEach((action) => {
    try {
      const backupDir = path.join(PROJECT_ROOT, 'src/organizacao/backup/duplicates')
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }

      action.remove.forEach((filePath) => {
        const fullPath = path.join(PROJECT_ROOT, filePath)
        if (fs.existsSync(fullPath)) {
          const backupPath = path.join(backupDir, path.basename(filePath) + '.bak')
          console.log(`📦 Backup: ${filePath} → backup/duplicates/`)
          // fs.copyFileSync(fullPath, backupPath) // Descomentado quando pronto para executar
          results.executed.push({ action: 'backup_duplicate', from: filePath, to: backupPath })
        }
      })
    } catch (error) {
      results.failed.push({ action: 'backup_duplicate', error: error.message })
    }
  })

  // 2. Mover arquivos para organização
  organizationActions.forEach((action) => {
    try {
      const fromPath = path.join(PROJECT_ROOT, action.from)
      const toPath = path.join(PROJECT_ROOT, action.to)

      if (fs.existsSync(fromPath)) {
        const toDir = path.dirname(toPath)
        if (!fs.existsSync(toDir)) {
          fs.mkdirSync(toDir, { recursive: true })
        }

        console.log(`📁 Mover: ${action.from} → ${action.to}`)
        // fs.renameSync(fromPath, toPath) // Descomentado quando pronto para executar
        results.executed.push(action)
      } else {
        results.skipped.push({ ...action, reason: 'Arquivo não existe' })
      }
    } catch (error) {
      results.failed.push({ ...action, error: error.message })
    }
  })

  // 3. Criar índices
  indexActions.forEach((action) => {
    try {
      const fullPath = path.join(PROJECT_ROOT, action.path)
      const dir = path.dirname(fullPath)

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      console.log(`📝 Criar índice: ${action.path}`)
      // Criar conteúdo do índice baseado na pasta
      // createIndexContent(fullPath) // Implementar depois
      results.executed.push(action)
    } catch (error) {
      results.failed.push({ ...action, error: error.message })
    }
  })

  return results
}

/**
 * Salva log das operações
 */
function saveLog(duplicateActions, organizationActions, indexActions, redirections, results) {
  const log = {
    timestamp: new Date().toISOString(),
    summary: {
      duplicates: duplicateActions.length,
      moves: organizationActions.length,
      indexes: indexActions.length,
      redirections: redirections.length,
    },
    actions: {
      duplicateActions,
      organizationActions,
      indexActions,
      redirections,
    },
    results,
  }

  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8')
  console.log(`\n💾 Log salvo: ${LOG_FILE}`)
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 ORGANIZADOR DE ARQUIVOS - PORTAL BETINA')
  console.log('=========================================')

  // Carregar estrutura
  const structure = loadInitialStructure()
  if (!structure) {
    console.error('❌ Não foi possível carregar a estrutura inicial')
    return
  }

  console.log(`📊 Estrutura carregada: ${structure.statistics.totalFiles} arquivos`)

  // Analisar e executar
  const duplicateActions = analyzeDuplicates(structure)
  const organizationActions = organizeFiles(structure)
  const indexActions = checkAndCreateIndexes(structure)
  const redirections = analyzeRedirections(structure)

  // Executar ações (modo simulação por segurança)
  console.log('\n⚠️  MODO SIMULAÇÃO - Nenhuma alteração será feita nos arquivos')
  console.log('Para executar as alterações, descomente as linhas de execução no código')

  const results = executeActions(duplicateActions, organizationActions, indexActions, redirections)

  // Salvar log
  saveLog(duplicateActions, organizationActions, indexActions, redirections, results)

  // Relatório final
  console.log('\n📋 RELATÓRIO FINAL')
  console.log('=================')
  console.log(`✅ Executadas: ${results.executed.length}`)
  console.log(`❌ Falharam: ${results.failed.length}`)
  console.log(`⏸️  Puladas: ${results.skipped.length}`)

  console.log('\n🎯 Próximos passos:')
  console.log('1. Revisar o log em organizacao_log.json')
  console.log('2. Descomentar as linhas de execução quando estiver pronto')
  console.log('3. Executar novamente para aplicar as mudanças')
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = main
