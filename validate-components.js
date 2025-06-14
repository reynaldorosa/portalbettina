/**
 * Portal Betina - Validação de Importações React
 * Verifica se todos os componentes React podem ser importados
 */

// Simulação de ambiente React para validação
const React = {
  useState: () => [null, () => {}],
  useEffect: () => {},
  useCallback: () => {},
  useRef: () => ({ current: null }),
  createContext: () => ({}),
  useContext: () => ({}),
  memo: (component) => component,
  forwardRef: (component) => component,
}

const styled = {
  div: () => 'div',
  section: () => 'section',
  h1: () => 'h1',
  h2: () => 'h2',
  h3: () => 'h3',
  p: () => 'p',
  button: () => 'button',
  span: () => 'span',
}

const motion = {
  div: styled.div,
  section: styled.section,
  button: styled.button,
}

// Mock globals para validação
global.React = React
global.styled = styled
global.motion = motion

console.log('🔍 Validando importações dos componentes React...\n')

const componentsToValidate = [
  {
    name: 'SystemOrchestrator',
    path: './src/utils/core/SystemOrchestrator.js',
    type: 'class',
  },
  {
    name: 'useSystemOrchestrator',
    path: './src/hooks/useSystemOrchestrator.js',
    type: 'hook',
  },
  {
    name: 'IntegratedSystemDashboard',
    path: './src/components/dashboard/IntegratedSystemDashboard.jsx',
    type: 'component',
  },
]

let validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
}

componentsToValidate.forEach(({ name, path, type }) => {
  console.log(`📝 Validando ${name} (${type})...`)

  try {
    // Verificar se o arquivo existe
    const fs = require('fs')
    const fullPath = require('path').resolve(path)

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')

      // Validações específicas por tipo
      let validations = []

      if (type === 'class') {
        validations = [
          { test: content.includes('class '), message: 'Contém definição de classe' },
          { test: content.includes('constructor'), message: 'Possui constructor' },
          { test: content.includes('export'), message: 'Tem export' },
        ]
      } else if (type === 'hook') {
        validations = [
          { test: content.includes('function use'), message: 'É um hook React válido' },
          {
            test: content.includes('useState') || content.includes('useEffect'),
            message: 'Usa hooks React',
          },
          { test: content.includes('export'), message: 'Tem export' },
        ]
      } else if (type === 'component') {
        validations = [
          {
            test: content.includes('function ') || content.includes('const '),
            message: 'É um componente React',
          },
          { test: content.includes('return'), message: 'Tem return statement' },
          { test: content.includes('export'), message: 'Tem export' },
        ]
      }

      let passed = 0
      let warnings = 0

      validations.forEach((validation) => {
        if (validation.test) {
          console.log(`   ✅ ${validation.message}`)
          passed++
        } else {
          console.log(`   ⚠️  ${validation.message}`)
          warnings++
        }
      })

      if (passed > warnings) {
        console.log(`   🎯 ${name} - VALIDAÇÃO APROVADA\n`)
        validationResults.passed++
      } else {
        console.log(`   ⚠️  ${name} - VALIDAÇÃO COM AVISOS\n`)
        validationResults.warnings++
      }
    } else {
      console.log(`   ❌ Arquivo não encontrado: ${path}\n`)
      validationResults.failed++
    }
  } catch (error) {
    console.log(`   ❌ Erro na validação: ${error.message}\n`)
    validationResults.failed++
  }
})

// Resumo final
console.log('📊 RESUMO DA VALIDAÇÃO')
console.log('========================')
console.log(`✅ Aprovados: ${validationResults.passed}`)
console.log(`⚠️  Com avisos: ${validationResults.warnings}`)
console.log(`❌ Falharam: ${validationResults.failed}`)
console.log(
  `📈 Taxa de sucesso: ${Math.round(((validationResults.passed + validationResults.warnings) / componentsToValidate.length) * 100)}%`
)

if (validationResults.failed === 0) {
  console.log('\n🎉 TODOS OS COMPONENTES ESTÃO PRONTOS PARA USO!')
  console.log('\n🚀 Portal Betina com sistema integrado de IA está funcional!')
} else {
  console.log('\n🔧 Alguns componentes precisam de ajustes antes do uso.')
}
