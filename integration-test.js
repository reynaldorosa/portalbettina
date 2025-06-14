/**
 * Portal Betina - Sistema de Teste de Integração
 * Verifica se todos os componentes principais estão funcionando
 */

import { SystemOrchestrator } from './src/utils/core/SystemOrchestrator.js'

console.log('🚀 Iniciando teste de integração do Portal Betina...\n')

// Teste 1: Verificar se o SystemOrchestrator carrega
console.log('📋 Teste 1: Carregamento do SystemOrchestrator')
try {
  const orchestrator = new SystemOrchestrator()
  console.log('✅ SystemOrchestrator carregado com sucesso')
  console.log(`   - Sistemas registrados: ${Object.keys(orchestrator.systems).length}`)
} catch (error) {
  console.log('❌ Erro ao carregar SystemOrchestrator:', error.message)
}

// Teste 2: Verificar estrutura de pastas
console.log('\n📁 Teste 2: Estrutura de arquivos')
const requiredFiles = [
  './src/utils/core/SystemOrchestrator.js',
  './src/hooks/useSystemOrchestrator.js',
  './src/components/dashboard/IntegratedSystemDashboard.jsx',
  './src/components/pages/App.jsx',
  './src/components/navigation/ActivityMenu.jsx',
]

requiredFiles.forEach((file) => {
  try {
    const path = require('path')
    const fs = require('fs')
    if (fs.existsSync(path.resolve(file))) {
      console.log(`✅ ${file} existe`)
    } else {
      console.log(`❌ ${file} não encontrado`)
    }
  } catch (error) {
    console.log(`⚠️  Não foi possível verificar ${file}`)
  }
})

// Teste 3: Verificar dependências principais
console.log('\n📦 Teste 3: Dependências')
const dependencies = ['react', 'styled-components', 'framer-motion', 'chart.js']
dependencies.forEach((dep) => {
  try {
    require.resolve(dep)
    console.log(`✅ ${dep} disponível`)
  } catch (error) {
    console.log(`❌ ${dep} não encontrado`)
  }
})

console.log('\n🎯 Teste de integração concluído!')
console.log('\n💡 Para testar completamente, execute: npm run dev')
console.log('   E navegue até o "Dashboard Inteligente" no menu de atividades.')
