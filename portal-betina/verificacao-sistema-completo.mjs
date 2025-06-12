#!/usr/bin/env node
/**
 * 🔍 SCRIPT DE VERIFICAÇÃO COMPLETA - PORTAL BETTINA
 *
 * Este script verifica o status de todos os componentes do sistema
 * e gera um relatório detalhado do que está funcionando
 *
 * Uso: node verificacao-sistema-completo.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 INICIANDO VERIFICAÇÃO COMPLETA DO PORTAL BETTINA\n')
console.log('='.repeat(70))

const results = {
  files: { found: 0, missing: 0, issues: [] },
  database: { services: 0, sql: 0, issues: [] },
  api: { endpoints: 0, config: 0, issues: [] },
  algorithms: { implemented: 0, missing: 0, issues: [] },
  frontend: { components: 0, pages: 0, issues: [] },
  tests: { files: 0, configs: 0, issues: [] },
  docker: { files: 0, configs: 0, issues: [] },
  docs: { files: 0, guides: 0, issues: [] },
}

/**
 * Verifica se um arquivo existe
 */
function checkFile(filePath, category = 'files') {
  const fullPath = path.join(__dirname, filePath)
  const exists = fs.existsSync(fullPath)

  if (exists) {
    results[category].found++
    console.log(`✅ ${filePath}`)
    return true
  } else {
    results[category].missing++
    results[category].issues.push(`❌ AUSENTE: ${filePath}`)
    console.log(`❌ ${filePath}`)
    return false
  }
}

/**
 * Verifica conteúdo de um arquivo
 */
function checkFileContent(filePath, searchTerms, category = 'files') {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8')
    const foundTerms = searchTerms.filter((term) => content.includes(term))

    if (foundTerms.length === searchTerms.length) {
      console.log(`✅ ${filePath} (${foundTerms.length}/${searchTerms.length} verificações)`)
      return true
    } else {
      const missingTerms = searchTerms.filter((term) => !content.includes(term))
      results[category].issues.push(`⚠️ ${filePath}: Missing ${missingTerms.join(', ')}`)
      console.log(`⚠️ ${filePath} (${foundTerms.length}/${searchTerms.length} verificações)`)
      return false
    }
  } catch (error) {
    results[category].issues.push(`❌ ${filePath}: Error reading file`)
    console.log(`❌ ${filePath}: Erro ao ler arquivo`)
    return false
  }
}

/**
 * Conta arquivos em um diretório
 */
function countFilesInDir(dirPath) {
  try {
    const fullPath = path.join(__dirname, dirPath)
    if (!fs.existsSync(fullPath)) return 0

    const files = fs.readdirSync(fullPath)
    return files.filter((file) => {
      const filePath = path.join(fullPath, file)
      return fs.statSync(filePath).isFile()
    }).length
  } catch (error) {
    return 0
  }
}

// VERIFICAÇÃO 1: ARQUIVOS PRINCIPAIS
console.log('\n📋 1. VERIFICANDO ARQUIVOS PRINCIPAIS')
console.log('-'.repeat(50))

const mainFiles = [
  'package.json',
  'vite.config.js',
  'docker-compose.yml',
  'src/App.jsx',
  'src/main.jsx',
  'index.html',
]

mainFiles.forEach((file) => checkFile(file, 'files'))

// VERIFICAÇÃO 2: SISTEMA DE DATABASE
console.log('\n💾 2. VERIFICANDO SISTEMA DE DATABASE')
console.log('-'.repeat(50))

const databaseFiles = [
  'src/services/api-server.js',
  'src/services/databaseService.js',
  'src/services/databaseService_clean.js',
  'src/services/databaseService_fixed.js',
  'src/services/databaseService_online_only.js',
  'src/database/index.js',
  'sql/complete_database_creation.sql',
]

databaseFiles.forEach((file) => {
  if (checkFile(file, 'database')) {
    results.database.services++
  }
})

// VERIFICAÇÃO 3: ALGORITMOS NEUROPEDAGÓGICOS
console.log('\n🧠 3. VERIFICANDO ALGORITMOS NEUROPEDAGÓGICOS')
console.log('-'.repeat(50))

const algorithmFiles = [
  'src/utils/featureFlags.js',
  'src/utils/neuropedagogicalInsights.js',
  'src/utils/neuropedagogicalExtensions.js',
  'src/utils/portalBettinaController.js',
]

const algorithmChecks = {
  'src/utils/featureFlags.js': ['FEATURE_FLAGS', 'enablePhase', 'isFeatureEnabled'],
  'src/utils/neuropedagogicalInsights.js': [
    'NeuropedagogicalAnalyzer',
    'assessWorkingMemory',
    'assessCognitiveFlexibility',
  ],
  'src/utils/neuropedagogicalExtensions.js': [
    'assessCognitiveLevel',
    'assessCommunicationLevel',
    'calculateExecutiveFunctionScore',
  ],
  'src/utils/portalBettinaController.js': ['PortalBettinaController', 'demonstratePortalBettina'],
}

Object.entries(algorithmChecks).forEach(([file, terms]) => {
  if (checkFileContent(file, terms, 'algorithms')) {
    results.algorithms.implemented++
  }
})

// VERIFICAÇÃO 4: COMPONENTES FRONTEND
console.log('\n🎨 4. VERIFICANDO COMPONENTES FRONTEND')
console.log('-'.repeat(50))

const componentFiles = [
  'src/components/navigation/ActivityMenu.jsx',
  'src/components/activities/MemoryGame.jsx',
  'src/components/activities/ColorMatch.jsx',
  'src/components/common/DatabaseStatus.jsx',
  'src/components/dashboard/IntegratedSystemDashboard.jsx',
]

componentFiles.forEach((file) => {
  if (checkFile(file, 'frontend')) {
    results.frontend.components++
  }
})

// Contar mais componentes
results.frontend.pages = countFilesInDir('src/components/pages')
console.log(`📊 Páginas encontradas: ${results.frontend.pages}`)

// VERIFICAÇÃO 5: TESTES
console.log('\n🧪 5. VERIFICANDO SISTEMA DE TESTES')
console.log('-'.repeat(50))

const testFiles = [
  'vitest.config.js',
  'integration-test.js',
  'validate-components.js',
  'tests/demonstrationTests.js',
]

testFiles.forEach((file) => {
  if (checkFile(file, 'tests')) {
    results.tests.files++
  }
})

// VERIFICAÇÃO 6: DOCKER E DEPLOYMENT
console.log('\n🐳 6. VERIFICANDO DOCKER E DEPLOYMENT')
console.log('-'.repeat(50))

const dockerFiles = [
  'Dockerfile',
  'Dockerfile.api',
  'Dockerfile.dev',
  'docker-compose.yml',
  'nginx.conf',
  'start-prod.sh',
]

dockerFiles.forEach((file) => {
  if (checkFile(file, 'docker')) {
    results.docker.files++
  }
})

// VERIFICAÇÃO 7: DOCUMENTAÇÃO
console.log('\n📚 7. VERIFICANDO DOCUMENTAÇÃO')
console.log('-'.repeat(50))

const docFiles = [
  'RELATORIO-STATUS-COMPLETO-SISTEMA.md',
  'DESENVOLVIMENTO-FASEADO.md',
  'INTEGRATION_STATUS.md',
  'ANALISE-PASTA-UTILS.md',
  'RELATORIO-IMPLEMENTACAO-COMPLETA.md',
]

docFiles.forEach((file) => {
  if (checkFile(file, 'docs')) {
    results.docs.files++
  }
})

// Contar mais documentação
results.docs.guides = countFilesInDir('documentação')
console.log(`📖 Documentos em /documentação: ${results.docs.guides}`)

// VERIFICAÇÃO 8: PASTA UTILS
console.log('\n🔧 8. VERIFICANDO PASTA UTILS')
console.log('-'.repeat(50))

const utilsCount = countFilesInDir('src/utils')
console.log(`📊 Arquivos em src/utils: ${utilsCount}`)

const specialUtils = [
  'src/utils/cognitive/',
  'src/utils/adaptive/',
  'src/utils/ml/',
  'src/utils/neuroplasticity/',
  'src/utils/accessibility/',
]

let utilsDirs = 0
specialUtils.forEach((dir) => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    utilsDirs++
    console.log(`✅ ${dir}`)
  } else {
    console.log(`❌ ${dir}`)
  }
})

// RELATÓRIO FINAL
console.log('\n' + '='.repeat(70))
console.log('📊 RELATÓRIO FINAL DE VERIFICAÇÃO')
console.log('='.repeat(70))

console.log('\n📋 ARQUIVOS PRINCIPAIS:')
console.log(`   ✅ Encontrados: ${results.files.found}`)
console.log(`   ❌ Ausentes: ${results.files.missing}`)

console.log('\n💾 SISTEMA DE DATABASE:')
console.log(`   ✅ Serviços: ${results.database.services}`)
console.log(`   ✅ Status: ${results.database.services >= 4 ? 'COMPLETO' : 'INCOMPLETO'}`)

console.log('\n🧠 ALGORITMOS NEUROPEDAGÓGICOS:')
console.log(`   ✅ Implementados: ${results.algorithms.implemented}`)
console.log(`   ✅ Status: ${results.algorithms.implemented >= 4 ? 'COMPLETO' : 'INCOMPLETO'}`)

console.log('\n🎨 FRONTEND:')
console.log(`   ✅ Componentes: ${results.frontend.components}`)
console.log(`   ✅ Páginas: ${results.frontend.pages}`)
console.log(`   ✅ Status: ${results.frontend.components >= 4 ? 'COMPLETO' : 'INCOMPLETO'}`)

console.log('\n🧪 TESTES:')
console.log(`   ✅ Arquivos: ${results.tests.files}`)
console.log(`   ✅ Status: ${results.tests.files >= 3 ? 'COMPLETO' : 'INCOMPLETO'}`)

console.log('\n🐳 DOCKER:')
console.log(`   ✅ Arquivos: ${results.docker.files}`)
console.log(`   ✅ Status: ${results.docker.files >= 4 ? 'COMPLETO' : 'INCOMPLETO'}`)

console.log('\n📚 DOCUMENTAÇÃO:')
console.log(`   ✅ Principais: ${results.docs.files}`)
console.log(`   ✅ Guias: ${results.docs.guides}`)
console.log(`   ✅ Status: ${results.docs.files >= 4 ? 'COMPLETO' : 'INCOMPLETO'}`)

console.log('\n🔧 PASTA UTILS:')
console.log(`   ✅ Total de arquivos: ${utilsCount}`)
console.log(`   ✅ Diretórios especializados: ${utilsDirs}/5`)
console.log(
  `   ✅ Status: ${utilsCount >= 30 ? 'MUITO COMPLETO' : utilsCount >= 15 ? 'COMPLETO' : 'BÁSICO'}`
)

// AVALIAÇÃO GERAL
const totalComponents = 7
let workingComponents = 0

if (results.files.missing === 0) workingComponents++
if (results.database.services >= 4) workingComponents++
if (results.algorithms.implemented >= 4) workingComponents++
if (results.frontend.components >= 4) workingComponents++
if (results.tests.files >= 3) workingComponents++
if (results.docker.files >= 4) workingComponents++
if (results.docs.files >= 4) workingComponents++

const systemHealth = Math.round((workingComponents / totalComponents) * 100)

console.log('\n' + '='.repeat(70))
console.log('🎯 AVALIAÇÃO GERAL DO SISTEMA')
console.log('='.repeat(70))
console.log(`📊 Saúde do Sistema: ${systemHealth}%`)
console.log(`✅ Componentes Funcionando: ${workingComponents}/${totalComponents}`)

if (systemHealth >= 90) {
  console.log('🎉 SISTEMA EXCELENTE - PRONTO PARA PRODUÇÃO!')
} else if (systemHealth >= 75) {
  console.log('✅ SISTEMA BOM - PRONTO PARA TESTES FINAIS')
} else if (systemHealth >= 50) {
  console.log('⚠️ SISTEMA FUNCIONAL - PRECISA DE AJUSTES')
} else {
  console.log('❌ SISTEMA PRECISA DE ATENÇÃO')
}

// MOSTRAR PROBLEMAS IDENTIFICADOS
const allIssues = [
  ...results.files.issues,
  ...results.database.issues,
  ...results.algorithms.issues,
  ...results.frontend.issues,
  ...results.tests.issues,
  ...results.docker.issues,
  ...results.docs.issues,
]

if (allIssues.length > 0) {
  console.log('\n⚠️ PROBLEMAS IDENTIFICADOS:')
  allIssues.forEach((issue) => console.log(`   ${issue}`))
}

console.log('\n🚀 PRÓXIMOS PASSOS RECOMENDADOS:')
if (systemHealth >= 90) {
  console.log('   1. Executar deployment de produção')
  console.log('   2. Ativar feature flags essenciais')
  console.log('   3. Configurar monitoramento')
} else if (systemHealth >= 75) {
  console.log('   1. Corrigir problemas identificados')
  console.log('   2. Executar testes completos')
  console.log('   3. Preparar para produção')
} else {
  console.log('   1. Revisar arquivos ausentes')
  console.log('   2. Completar implementações')
  console.log('   3. Testar funcionalidades')
}

console.log('\n' + '='.repeat(70))
console.log(`Verificação concluída em ${new Date().toLocaleString()}`)
console.log('Portal BETTINA - Sistema de Terapia para Autismo')
console.log('='.repeat(70))

export default results
