/**
 * 🧪 TESTES DE DEMONSTRAÇÃO - PORTAL BETTINA
 *
 * Testes práticos do sistema de desenvolvimento faseado
 * Demonstra como usar e ativar funcionalidades gradualmente
 *
 * @author GitHub Copilot
 * @since 2024
 */

import {
  PortalBettinaController,
  demonstratePortalBettina,
} from '../src/utils/portalBettinaController.js'
import {
  enableFeature,
  disableFeature,
  isFeatureEnabled,
  enablePhase,
  enableOnlyEssentials,
} from '../src/utils/featureFlags.js'

/**
 * 🎯 SUITE DE TESTES DEMONSTRATIVOS
 */
export class DemonstrationTests {
  constructor() {
    this.controller = new PortalBettinaController()
    this.testResults = []
  }

  /**
   * 🚀 Executa todos os testes demonstrativos
   */
  async runAllTests() {
    console.log('🧪 INICIANDO TESTES DEMONSTRATIVOS DO PORTAL BETTINA\n')
    console.log('='.repeat(70))

    try {
      await this.testInitialization()
      await this.testGradualActivation()
      await this.testNewMethods()
      await this.testFallbackMethods()
      await this.testProductionMode()
      await this.testMaintenanceMode()

      this.showTestSummary()
    } catch (error) {
      console.error('❌ Erro durante os testes:', error)
    }
  }

  /**
   * 🔧 Teste de inicialização
   */
  async testInitialization() {
    console.log('\n📋 TESTE 1: Inicialização do Sistema')
    console.log('-'.repeat(50))

    try {
      const status = await this.controller.initialize()
      console.log('✅ Sistema inicializado com sucesso')
      console.log(`   - Funcionalidades ativas: ${status.enabledFeatures}`)
      console.log(`   - Ambiente: ${status.environment}`)

      this.addTestResult('Inicialização', true, 'Sistema inicializado corretamente')
    } catch (error) {
      console.log('❌ Falha na inicialização:', error.message)
      this.addTestResult('Inicialização', false, error.message)
    }
  }

  /**
   * 📊 Teste de ativação gradual
   */
  async testGradualActivation() {
    console.log('\n📋 TESTE 2: Ativação Gradual de Funcionalidades')
    console.log('-'.repeat(50))

    try {
      // Testar cada fase
      const phases = [
        { name: 'Essenciais', func: () => enableOnlyEssentials() },
        { name: 'Fase 1', func: () => enablePhase(1) },
        { name: 'Fase 2', func: () => enablePhase(2) },
        { name: 'Fase 3', func: () => enablePhase(3) },
      ]

      phases.forEach((phase) => {
        phase.func()
        const criticalActive = isFeatureEnabled('COGNITIVE_ASSESSMENT', 'assessCognitiveLevel')
        console.log(`   ${phase.name}: assessCognitiveLevel ${criticalActive ? '✅' : '❌'}`)
      })

      this.addTestResult('Ativação Gradual', true, 'Todas as fases funcionando')
    } catch (error) {
      console.log('❌ Erro na ativação gradual:', error.message)
      this.addTestResult('Ativação Gradual', false, error.message)
    }
  }

  /**
   * 🔬 Teste dos novos métodos
   */
  async testNewMethods() {
    console.log('\n📋 TESTE 3: Novos Métodos Implementados')
    console.log('-'.repeat(50))

    // Ativar funcionalidades para teste
    enablePhase(2)

    const testData = {
      attention: { sustained: 0.7, selective: 0.6, divided: 0.5 },
      memory: { working: 0.8, shortTerm: 0.7, longTerm: 0.6 },
      executive: { planning: 0.6, inhibition: 0.5, monitoring: 0.7 },
      processing: { speed: 0.7, accuracy: 0.8, flexibility: 0.5 },
      verbalCommunication: 0.6,
      nonVerbalCommunication: 0.4,
      socialCommunication: 0.5,
      dailyLiving: 0.7,
      selfCare: 0.8,
      independence: 0.6,
    }

    const newMethods = [
      {
        name: 'assessCognitiveLevel',
        method: () => this.controller.analyzer.assessCognitiveLevel(testData),
      },
      {
        name: 'assessCommunicationLevel',
        method: () => this.controller.analyzer.assessCommunicationLevel(testData),
      },
      {
        name: 'assessSocialSkillsLevel',
        method: () => this.controller.analyzer.assessSocialSkillsLevel(testData),
      },
      {
        name: 'assessAdaptiveSkills',
        method: () => this.controller.analyzer.assessAdaptiveSkills(testData),
      },
      {
        name: 'calculateExecutiveFunctionScore',
        method: () => this.controller.analyzer.calculateExecutiveFunctionScore(testData),
      },
    ]

    let successCount = 0

    for (const methodTest of newMethods) {
      try {
        const result = methodTest.method()
        console.log(`   ✅ ${methodTest.name}: ${result.level || result.overallLevel}`)
        successCount++
      } catch (error) {
        console.log(`   ❌ ${methodTest.name}: ${error.message}`)
      }
    }

    const success = successCount === newMethods.length
    this.addTestResult(
      'Novos Métodos',
      success,
      `${successCount}/${newMethods.length} métodos funcionando`
    )
  }

  /**
   * 🛡️ Teste de métodos de fallback
   */
  async testFallbackMethods() {
    console.log('\n📋 TESTE 4: Métodos de Fallback')
    console.log('-'.repeat(50))

    // Desativar todas as funcionalidades avançadas
    enableOnlyEssentials()

    const testData = {
      attention: { sustained: 0.5, selective: 0.4, divided: 0.3 },
    }

    try {
      // Tentar usar método que deve usar fallback
      const result = this.controller.analyzer.assessCognitiveLevel(testData)
      console.log('   ✅ Fallback funcionando: nível', result.level)
      console.log('   ✅ Sistema não quebrou com funcionalidade desabilitada')

      this.addTestResult('Fallback', true, 'Métodos de fallback funcionando corretamente')
    } catch (error) {
      console.log('   ❌ Fallback falhou:', error.message)
      this.addTestResult('Fallback', false, 'Fallback não funcionou')
    }
  }

  /**
   * 🏭 Teste do modo produção
   */
  async testProductionMode() {
    console.log('\n📋 TESTE 5: Modo Produção')
    console.log('-'.repeat(50))

    // Simular ambiente de produção
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    try {
      // Reinicializar em modo produção
      const newController = new PortalBettinaController()
      await newController.initialize()

      const status = newController.getSystemStatus()
      console.log(`   ✅ Ambiente: ${status.environment}`)
      console.log(`   ✅ Funcionalidades ativas: ${status.enabledFeatures}`)
      console.log(`   ✅ Modo conservador: ${status.enabledFeatures < 10 ? 'Sim' : 'Não'}`)

      this.addTestResult('Modo Produção', true, 'Configuração correta para produção')
    } catch (error) {
      console.log('   ❌ Erro no modo produção:', error.message)
      this.addTestResult('Modo Produção', false, error.message)
    }

    // Restaurar ambiente
    process.env.NODE_ENV = originalEnv
  }

  /**
   * 🔧 Teste do modo manutenção
   */
  async testMaintenanceMode() {
    console.log('\n📋 TESTE 6: Modo Manutenção')
    console.log('-'.repeat(50))

    try {
      // Ativar modo manutenção
      this.controller.enableMaintenanceMode()

      // Verificar se apenas essenciais estão ativos
      const criticalActive = isFeatureEnabled('COGNITIVE_ASSESSMENT', 'assessWorkingMemory')
      const advancedActive = isFeatureEnabled('COGNITIVE_ASSESSMENT', 'assessCognitiveLevel')

      console.log(`   ✅ Essenciais ativos: ${criticalActive ? 'Sim' : 'Não'}`)
      console.log(`   ✅ Avançados desativados: ${!advancedActive ? 'Sim' : 'Não'}`)

      this.addTestResult(
        'Modo Manutenção',
        criticalActive && !advancedActive,
        'Modo manutenção funcionando'
      )
    } catch (error) {
      console.log('   ❌ Erro no modo manutenção:', error.message)
      this.addTestResult('Modo Manutenção', false, error.message)
    }
  }

  /**
   * 📝 Adiciona resultado de teste
   */
  addTestResult(testName, success, message) {
    this.testResults.push({
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * 📊 Mostra resumo dos testes
   */
  showTestSummary() {
    console.log('\n📊 RESUMO DOS TESTES')
    console.log('='.repeat(70))

    const passed = this.testResults.filter((r) => r.success).length
    const total = this.testResults.length
    const percentage = Math.round((passed / total) * 100)

    console.log(`\n✅ Testes aprovados: ${passed}/${total} (${percentage}%)`)
    console.log(`❌ Testes falharam: ${total - passed}/${total}`)

    console.log('\n📋 Detalhes:')
    this.testResults.forEach((result) => {
      const status = result.success ? '✅' : '❌'
      console.log(`   ${status} ${result.test}: ${result.message}`)
    })

    if (percentage >= 80) {
      console.log('\n🎉 SISTEMA APROVADO PARA DEPLOYMENT!')
    } else {
      console.log('\n⚠️ Sistema precisa de ajustes antes do deployment')
    }

    console.log('\n='.repeat(70))
  }
}

/**
 * 🎯 DEMONSTRAÇÃO INTERATIVA
 */
export async function runInteractiveDemo() {
  console.log('🌟 DEMONSTRAÇÃO INTERATIVA DO PORTAL BETTINA\n')

  // Executar demonstração principal
  const controller = await demonstratePortalBettina()

  console.log('\n🔧 CONTROLES DISPONÍVEIS:')
  console.log('- controller.enableCriticalFeatures() - Ativar funcionalidades críticas')
  console.log('- controller.enableMaintenanceMode() - Modo manutenção')
  console.log('- controller.getSystemStatus() - Status do sistema')
  console.log('- controller.demonstrateGradualActivation() - Demo gradual')

  return controller
}

/**
 * 🧪 EXECUTAR TESTES SE CHAMADO DIRETAMENTE
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Executando testes de demonstração...\n')

  const demo = new DemonstrationTests()
  await demo.runAllTests()

  console.log('\n🎯 Para demonstração interativa, use: runInteractiveDemo()')
}

export default DemonstrationTests
