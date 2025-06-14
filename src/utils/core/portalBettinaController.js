/**
 * 🎯 CENTRO DE CONTROLE - PORTAL BETTINA
 *
 * Sistema de controle centralizado para ativação gradual de funcionalidades
 * Permite monitoramento do progresso da implementação e ativação faseada
 *
 * @author GitHub Copilot
 * @since 2024
 */

import {
  FEATURE_FLAGS,
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  enablePhase,
  enableOnlyEssentials,
  getFeatureReport,
  getEnabledFeatures,
  getDisabledFeatures,
} from './featureFlags.js'

import { NeuropedagogicalAnalyzer } from '../metrics/neuropedagogicalInsights.js'

/**
 * 📊 CLASSE DE CONTROLE DO SISTEMA
 */
export class PortalBettinaController {
  constructor() {
    this.analyzer = new NeuropedagogicalAnalyzer()
    this.initialized = false
  }

  /**
   * 🚀 Inicializa o sistema completo
   */
  async initialize() {
    console.log('🔧 Inicializando Portal BETTINA...')

    // Inicializar o analisador principal
    await this.analyzer.initialize()

    // Configurar ambiente baseado em flags
    this.setupEnvironment()

    this.initialized = true
    console.log('✅ Portal BETTINA inicializado com sucesso!')

    return this.getSystemStatus()
  }

  /**
   * 🔧 Configura o ambiente baseado nas flags
   */
  setupEnvironment() {
    // Em produção, ativar apenas essenciais
    if (process.env.NODE_ENV === 'production') {
      enableOnlyEssentials()
      console.log('🔒 Ambiente de produção: apenas funcionalidades essenciais ativas')
    } else {
      // Em desenvolvimento, ativar Fase 1
      enablePhase(1)
      console.log('🛠️ Ambiente de desenvolvimento: Fase 1 ativa')
    }
  }

  /**
   * 📊 Demonstra gradual de funcionalidades
   */
  demonstrateGradualActivation() {
    console.log('\n🎯 DEMONSTRAÇÃO DE ATIVAÇÃO GRADUAL\n')
    console.log('='.repeat(60))

    // Começar apenas com essenciais
    console.log('\n📌 FASE 0: Apenas Funcionalidades Essenciais')
    enableOnlyEssentials()
    this.showActiveFeatures()

    // Ativar Fase 1
    console.log('\n📌 FASE 1: Funcionalidades Básicas')
    enablePhase(1)
    this.showActiveFeatures()

    // Ativar Fase 2
    console.log('\n📌 FASE 2: Funcionalidades Avançadas')
    enablePhase(2)
    this.showActiveFeatures()

    // Ativar tudo (Fase 3)
    console.log('\n📌 FASE 3: Funcionalidades Experimentais')
    enablePhase(3)
    this.showActiveFeatures()

    console.log('\n='.repeat(60))
  }

  /**
   * 📋 Mostra funcionalidades ativas
   */
  showActiveFeatures() {
    const enabled = getEnabledFeatures()
    const disabled = getDisabledFeatures()

    console.log(`✅ Ativas: ${enabled.length} funcionalidades`)
    console.log(`❌ Inativas: ${disabled.length} funcionalidades`)

    // Mostrar algumas funcionalidades importantes
    const important = [
      'assessCognitiveLevel',
      'assessCommunicationLevel',
      'assessSocialSkillsLevel',
      'calculateExecutiveFunctionScore',
    ]

    important.forEach((feature) => {
      const status = enabled.includes(feature) ? '✅' : '❌'
      console.log(`   ${status} ${feature}`)
    })
  }

  /**
   * 🧪 Testa funcionalidades gradualmente
   */
  async testGradualImplementation() {
    console.log('\n🧪 TESTE DE IMPLEMENTAÇÃO GRADUAL\n')

    // Dados de teste
    const testData = {
      attention: { sustained: 0.7, selective: 0.6, divided: 0.5 },
      memory: { working: 0.8, shortTerm: 0.7, longTerm: 0.6 },
      executive: { planning: 0.6, inhibition: 0.5, monitoring: 0.7 },
      processing: { speed: 0.7, accuracy: 0.8, flexibility: 0.5 },
      verbalCommunication: 0.6,
      nonVerbalCommunication: 0.4,
      socialCommunication: 0.5,
    }

    // Testar com funcionalidades básicas apenas
    console.log('📋 Teste com funcionalidades básicas:')
    enableOnlyEssentials()
    await this.runBasicTests(testData)

    // Testar com funcionalidades avançadas
    console.log('\n📋 Teste com funcionalidades avançadas:')
    enablePhase(2)
    await this.runAdvancedTests(testData)
  }

  /**
   * 🔍 Executa testes básicos
   */
  async runBasicTests(data) {
    try {
      // Testes que sempre devem funcionar
      const attention = this.analyzer.assessAttention(data)
      const working = this.analyzer.assessWorkingMemory(data)
      const flexibility = this.analyzer.assessCognitiveFlexibility(data)

      console.log('✅ Testes básicos executados com sucesso')
      console.log(`   - Atenção: ${attention.level}`)
      console.log(`   - Memória: ${working.level}`)
      console.log(`   - Flexibilidade: ${flexibility.level}`)
    } catch (error) {
      console.log('❌ Erro nos testes básicos:', error.message)
    }
  }

  /**
   * 🔬 Executa testes avançados
   */
  async runAdvancedTests(data) {
    try {
      // Testes dos novos métodos
      const cognitive = this.analyzer.assessCognitiveLevel(data)
      const communication = this.analyzer.assessCommunicationLevel(data)
      const executive = this.analyzer.calculateExecutiveFunctionScore(data)

      console.log('✅ Testes avançados executados com sucesso')
      console.log(`   - Nível Cognitivo: ${cognitive.level}`)
      console.log(`   - Comunicação: ${communication.level}`)
      console.log(`   - Função Executiva: ${executive.overallLevel}`)
    } catch (error) {
      console.log('❌ Erro nos testes avançados:', error.message)
    }
  }

  /**
   * 📊 Relatório completo do sistema
   */
  getSystemStatus() {
    const report = getFeatureReport()
    const enabled = getEnabledFeatures()
    const disabled = getDisabledFeatures()

    return {
      initialized: this.initialized,
      environment: process.env.NODE_ENV || 'development',
      totalFeatures: enabled.length + disabled.length,
      enabledFeatures: enabled.length,
      disabledFeatures: disabled.length,
      enabledPercentage: Math.round((enabled.length / (enabled.length + disabled.length)) * 100),
      phaseStatus: {
        essentials: report.COGNITIVE_ASSESSMENT.assessWorkingMemory,
        phase1: report.COGNITIVE_ASSESSMENT.assessCognitiveLevel,
        phase2: report.SENSORY_ANALYSIS
          ? Object.values(report.SENSORY_ANALYSIS).some((v) => v)
          : false,
        phase3: report.FUTURE_FEATURES
          ? Object.values(report.FUTURE_FEATURES).some((v) => v)
          : false,
      },
      criticalMethods: {
        assessCognitiveLevel: isFeatureEnabled('COGNITIVE_ASSESSMENT', 'assessCognitiveLevel'),
        assessCommunicationLevel: isFeatureEnabled(
          'COGNITIVE_ASSESSMENT',
          'assessCommunicationLevel'
        ),
        assessSocialSkillsLevel: isFeatureEnabled(
          'COGNITIVE_ASSESSMENT',
          'assessSocialSkillsLevel'
        ),
        calculateExecutiveFunctionScore: isFeatureEnabled(
          'COGNITIVE_ASSESSMENT',
          'calculateExecutiveFunctionScore'
        ),
      },
      recommendations: this.getDeploymentRecommendations(),
    }
  }

  /**
   * 💡 Recomendações de deployment
   */
  getDeploymentRecommendations() {
    const enabled = getEnabledFeatures()
    const recommendations = []

    if (enabled.length < 10) {
      recommendations.push('🔧 Considere ativar mais funcionalidades básicas')
    }

    if (process.env.NODE_ENV === 'production' && enabled.length > 15) {
      recommendations.push('⚠️ Muitas funcionalidades ativas em produção - considere otimizar')
    }

    if (!isFeatureEnabled('COGNITIVE_ASSESSMENT', 'assessCognitiveLevel')) {
      recommendations.push('📋 Ativar assessCognitiveLevel para análises completas')
    }

    if (!isFeatureEnabled('COGNITIVE_ASSESSMENT', 'calculateExecutiveFunctionScore')) {
      recommendations.push('🧠 Ativar calculateExecutiveFunctionScore para avaliação executiva')
    }

    return recommendations
  }

  /**
   * ⚡ Ativação rápida de funcionalidades críticas
   */
  enableCriticalFeatures() {
    console.log('⚡ Ativando funcionalidades críticas...')

    const critical = [
      'assessCognitiveLevel',
      'assessCommunicationLevel',
      'assessSocialSkillsLevel',
      'calculateExecutiveFunctionScore',
    ]

    critical.forEach((feature) => {
      enableFeature('COGNITIVE_ASSESSMENT', feature)
      console.log(`✅ ${feature} ativado`)
    })

    console.log('🎯 Funcionalidades críticas ativadas!')
  }

  /**
   * 🔧 Modo de manutenção (desativa funcionalidades não essenciais)
   */
  enableMaintenanceMode() {
    console.log('🔧 Ativando modo de manutenção...')
    enableOnlyEssentials()
    console.log('✅ Modo de manutenção ativo - apenas funcionalidades essenciais')
  }
}

// ============================================================================
// 🎯 EXEMPLO DE USO
// ============================================================================

/**
 * 📋 Função de demonstração
 */
export async function demonstratePortalBettina() {
  console.log('🌟 PORTAL BETTINA - DEMONSTRAÇÃO DE DESENVOLVIMENTO FASEADO\n')

  const controller = new PortalBettinaController()

  // Inicializar sistema
  const status = await controller.initialize()
  console.log('\n📊 Status inicial:', status)

  // Demonstrar ativação gradual
  controller.demonstrateGradualActivation()

  // Testar implementação
  await controller.testGradualImplementation()

  // Ativar funcionalidades críticas
  console.log('\n' + '='.repeat(60))
  controller.enableCriticalFeatures()

  // Status final
  const finalStatus = controller.getSystemStatus()
  console.log('\n📊 Status final:', finalStatus)

  return controller
}

export default PortalBettinaController
