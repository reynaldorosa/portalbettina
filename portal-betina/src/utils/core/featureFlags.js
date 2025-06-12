/**
 * 🎯 SISTEMA DE FLAGS DE FUNCIONALIDADES
 *
 * Sistema modular para ativar/desativar funcionalidades do Portal BETTINA
 * Permite desenvolvimento incremental e deployment seguro
 *
 * @author GitHub Copilot
 * @since 2024
 */

/**
 * 🔧 CONFIGURAÇÃO DAS FLAGS
 *
 * true = Funcionalidade ATIVA
 * false = Funcionalidade INATIVA (usa fallback básico)
 */
export const FEATURE_FLAGS = {
  // ============================================================================
  // 🧠 SISTEMA DE AVALIAÇÃO COGNITIVA
  // ============================================================================
  COGNITIVE_ASSESSMENT: {
    // Métodos já implementados (podem ser ativados)
    assessWorkingMemory: true, // ✅ Implementado
    assessCognitiveFlexibility: true, // ✅ Implementado
    assessInhibitoryControl: true, // ✅ Implementado
    assessAttention: true, // ✅ Implementado
    assessMotivation: true, // ✅ Implementado

    // Métodos que precisam ser implementados
    assessCognitiveLevel: false, // 🔄 Precisa implementar
    assessCommunicationLevel: false, // 🔄 Precisa implementar
    assessSocialSkillsLevel: false, // 🔄 Precisa implementar (assessSocialAwareness existe)
    assessAdaptiveSkills: false, // 🔄 Precisa implementar
    assessPlanningOrganization: false, // 🔄 Precisa implementar
    assessTimeManagement: false, // 🔄 Precisa implementar
    calculateExecutiveFunctionScore: false, // 🔄 Precisa implementar
  },

  // ============================================================================
  // 🎭 ANÁLISE SENSORIAL AVANÇADA
  // ============================================================================
  SENSORY_ANALYSIS: {
    // Métodos que precisam ser implementados
    assessVisualProcessing: false, // 🔄 Precisa implementar
    assessAuditoryProcessing: false, // 🔄 Precisa implementar
    assessTactileProcessing: false, // 🔄 Precisa implementar
    assessVestibularProcessing: false, // 🔄 Precisa implementar
    assessProprioceptiveProcessing: false, // 🔄 Precisa implementar
    createSensoryProfile: false, // 🔄 Precisa implementar
    determineSensoryProfile: false, // 🔄 Precisa implementar
    analyzeSensoryProcessing: false, // 🔄 Precisa implementar
  },

  // ============================================================================
  // 🎯 SISTEMA DE CÁLCULO DE SUPORTE
  // ============================================================================
  SUPPORT_CALCULATION: {
    // Métodos que precisam ser implementados
    calculateVisualSupportLevel: false, // 🔄 Precisa implementar
    calculateAuditorySupportLevel: false, // 🔄 Precisa implementar
    calculateMotorSupportLevel: false, // 🔄 Precisa implementar
    calculateCognitiveSupportLevel: false, // 🔄 Precisa implementar
    calculateSocialSupportLevel: false, // 🔄 Precisa implementar
    calculateBehavioralSupportLevel: false, // 🔄 Precisa implementar
    calculateSensorySupportLevel: false, // 🔄 Precisa implementar
    calculateAutismSupportLevel: false, // 🔄 Precisa implementar
    calculateSensoryRegulationNeeds: false, // 🔄 Precisa implementar
    calculateCommunicationSupport: false, // 🔄 Precisa implementar
  },

  // ============================================================================
  // 📈 ANÁLISE COMPORTAMENTAL AVANÇADA
  // ============================================================================
  BEHAVIORAL_ANALYSIS: {
    // Métodos já implementados (podem ser ativados)
    extractBehavioralIndicators: true, // ✅ Implementado
    assessPersistence: true, // ✅ Implementado
    assessFrustration: true, // ✅ Implementado
    assessRegulation: true, // ✅ Implementado
    assessEmotionalRegulation: true, // ✅ Implementado
    assessSocialAwareness: true, // ✅ Implementado
    identifyBehavioralTriggers: true, // ✅ Implementado
    suggestBehavioralStrategies: true, // ✅ Implementado
  },

  // ============================================================================
  // 🔮 PERFIS ADAPTATIVOS E RECOMENDAÇÕES
  // ============================================================================
  ADAPTIVE_PROFILES: {
    // Métodos que precisam ser implementados
    identifyProfileStrengths: false, // 🔄 Precisa implementar
    identifyProfileNeeds: false, // 🔄 Precisa implementar
    suggestTherapyGoals: false, // 🔄 Precisa implementar
    recommendInterventions: false, // 🔄 Precisa implementar
    createBehavioralProfile: false, // 🔄 Precisa implementar
    assessEmpathySkills: false, // 🔄 Precisa implementar
    assessRelationshipSkills: false, // 🔄 Precisa implementar
    assessDecisionMaking: false, // 🔄 Precisa implementar
  },

  // ============================================================================
  // ⚙️ SISTEMA DE PARÂMETROS ADAPTATIVOS AVANÇADOS
  // ============================================================================
  ADAPTIVE_PARAMETERS: {
    // Métodos que precisam ser implementados
    generateSessionTherapyOptimizations: false, // 🔄 Precisa implementar
    calculateSessionAutismSupports: false, // 🔄 Precisa implementar
    optimizeCognitiveLoad: false, // 🔄 Precisa implementar
    optimizeSensorySupport: false, // 🔄 Precisa implementar
    optimizeCommunicationSupport: false, // 🔄 Precisa implementar
    optimizeSocialSupport: false, // 🔄 Precisa implementar
    optimizeBehavioralSupport: false, // 🔄 Precisa implementar
    optimizeExecutiveSupport: false, // 🔄 Precisa implementar
    suggestSensoryStrategies: false, // 🔄 Precisa implementar
    suggestCommunicationStrategies: false, // 🔄 Precisa implementar
    suggestExecutiveStrategies: false, // 🔄 Precisa implementar
    identifyExecutiveNeeds: false, // 🔄 Precisa implementar
  },
}

/**
 * 🎯 FUNCIONALIDADES ESSENCIAIS (FASE 1)
 *
 * Métodos críticos que devem estar ativos para funcionamento básico
 */
export const ESSENTIAL_FEATURES = [
  'COGNITIVE_ASSESSMENT.assessWorkingMemory',
  'COGNITIVE_ASSESSMENT.assessCognitiveFlexibility',
  'COGNITIVE_ASSESSMENT.assessInhibitoryControl',
  'COGNITIVE_ASSESSMENT.assessAttention',
  'BEHAVIORAL_ANALYSIS.extractBehavioralIndicators',
  'BEHAVIORAL_ANALYSIS.assessPersistence',
  'BEHAVIORAL_ANALYSIS.assessFrustration',
  'BEHAVIORAL_ANALYSIS.assessRegulation',
]

/**
 * 🔄 FUNCIONALIDADES EM DESENVOLVIMENTO (FASE 2)
 *
 * Métodos que serão ativados progressivamente
 */
export const DEVELOPMENT_FEATURES = [
  'COGNITIVE_ASSESSMENT.assessCognitiveLevel',
  'COGNITIVE_ASSESSMENT.assessCommunicationLevel',
  'SUPPORT_CALCULATION.calculateVisualSupportLevel',
  'SUPPORT_CALCULATION.calculateCognitiveSupportLevel',
  'SENSORY_ANALYSIS.createSensoryProfile',
]

/**
 * 🚀 FUNCIONALIDADES FUTURAS (FASE 3)
 *
 * Métodos para implementação futura
 */
export const FUTURE_FEATURES = [
  'ADAPTIVE_PARAMETERS.generateSessionTherapyOptimizations',
  'ADAPTIVE_PARAMETERS.optimizeCognitiveLoad',
  'ADAPTIVE_PROFILES.createBehavioralProfile',
]

/**
 * 🔍 VERIFICA SE UMA FUNCIONALIDADE ESTÁ ATIVA
 *
 * @param {string} category - Categoria da funcionalidade
 * @param {string} feature - Nome da funcionalidade
 * @returns {boolean} True se ativa, false se inativa
 *
 * @example
 * isFeatureEnabled('COGNITIVE_ASSESSMENT', 'assessWorkingMemory') // true
 * isFeatureEnabled('SENSORY_ANALYSIS', 'createSensoryProfile') // false
 */
export function isFeatureEnabled(category, feature) {
  try {
    return FEATURE_FLAGS[category]?.[feature] || false
  } catch (error) {
    console.warn(`⚠️ Flag não encontrada: ${category}.${feature}`)
    return false
  }
}

/**
 * 🔧 ATIVA UMA FUNCIONALIDADE DINAMICAMENTE
 *
 * @param {string} category - Categoria da funcionalidade
 * @param {string} feature - Nome da funcionalidade
 *
 * @example
 * enableFeature('COGNITIVE_ASSESSMENT', 'assessCognitiveLevel')
 */
export function enableFeature(category, feature) {
  if (FEATURE_FLAGS[category] && feature in FEATURE_FLAGS[category]) {
    FEATURE_FLAGS[category][feature] = true
    console.log(`✅ Funcionalidade ativada: ${category}.${feature}`)
  } else {
    console.warn(`⚠️ Funcionalidade não encontrada: ${category}.${feature}`)
  }
}

/**
 * 🔇 DESATIVA UMA FUNCIONALIDADE DINAMICAMENTE
 *
 * @param {string} category - Categoria da funcionalidade
 * @param {string} feature - Nome da funcionalidade
 *
 * @example
 * disableFeature('SENSORY_ANALYSIS', 'createSensoryProfile')
 */
export function disableFeature(category, feature) {
  if (FEATURE_FLAGS[category] && feature in FEATURE_FLAGS[category]) {
    FEATURE_FLAGS[category][feature] = false
    console.log(`🔇 Funcionalidade desativada: ${category}.${feature}`)
  } else {
    console.warn(`⚠️ Funcionalidade não encontrada: ${category}.${feature}`)
  }
}

/**
 * 📊 RELATÓRIO DE STATUS DAS FUNCIONALIDADES
 *
 * @returns {Object} Status detalhado de todas as funcionalidades
 */
export function getFeatureReport() {
  const report = {
    total: 0,
    active: 0,
    inactive: 0,
    byCategory: {},
  }

  Object.keys(FEATURE_FLAGS).forEach((category) => {
    report.byCategory[category] = {
      total: 0,
      active: 0,
      inactive: 0,
      features: {},
    }

    Object.keys(FEATURE_FLAGS[category]).forEach((feature) => {
      const isActive = FEATURE_FLAGS[category][feature]

      report.total++
      report.byCategory[category].total++
      report.byCategory[category].features[feature] = isActive

      if (isActive) {
        report.active++
        report.byCategory[category].active++
      } else {
        report.inactive++
        report.byCategory[category].inactive++
      }
    })
  })

  return report
}

/**
 * 🎯 ATIVA APENAS FUNCIONALIDADES ESSENCIAIS
 *
 * Usado para deployment inicial ou modo de segurança
 */
export function enableOnlyEssentials() {
  // Desativar tudo primeiro
  Object.keys(FEATURE_FLAGS).forEach((category) => {
    Object.keys(FEATURE_FLAGS[category]).forEach((feature) => {
      FEATURE_FLAGS[category][feature] = false
    })
  })

  // Ativar apenas essenciais
  ESSENTIAL_FEATURES.forEach((path) => {
    const [category, feature] = path.split('.')
    if (FEATURE_FLAGS[category] && feature in FEATURE_FLAGS[category]) {
      FEATURE_FLAGS[category][feature] = true
    }
  })

  console.log('🎯 Modo essencial ativado - apenas funcionalidades críticas')
}

/**
 * 🚀 ATIVA FUNCIONALIDADES POR FASE
 *
 * @param {number} phase - Fase a ser ativada (1, 2 ou 3)
 */
export function enablePhase(phase) {
  switch (phase) {
    case 1:
      enableOnlyEssentials()
      break

    case 2:
      enableOnlyEssentials()
      DEVELOPMENT_FEATURES.forEach((path) => {
        const [category, feature] = path.split('.')
        enableFeature(category, feature)
      })
      console.log('🔄 Fase 2 ativada - funcionalidades em desenvolvimento')
      break

    case 3:
      enablePhase(2)
      FUTURE_FEATURES.forEach((path) => {
        const [category, feature] = path.split('.')
        enableFeature(category, feature)
      })
      console.log('🚀 Fase 3 ativada - funcionalidades futuras')
      break

    default:
      console.warn('⚠️ Fase inválida. Use 1, 2 ou 3')
  }
}

// ============================================================================
// 📱 CONFIGURAÇÃO INICIAL BASEADA NO AMBIENTE
// ============================================================================

/**
 * 🔧 CONFIGURAÇÃO AUTOMÁTICA BASEADA NO AMBIENTE
 */
export function initializeFeatures() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    // Produção: apenas essenciais
    enableOnlyEssentials()
    console.log('🏭 Ambiente de produção - funcionalidades essenciais ativas')
  } else if (isDevelopment) {
    // Desenvolvimento: essenciais + desenvolvimento
    enablePhase(2)
    console.log('🔧 Ambiente de desenvolvimento - funcionalidades em teste ativas')
  } else {
    // Padrão: apenas essenciais
    enableOnlyEssentials()
    console.log('⚡ Configuração padrão - funcionalidades essenciais ativas')
  }
}

// Inicializar automaticamente
initializeFeatures()

export default FEATURE_FLAGS
