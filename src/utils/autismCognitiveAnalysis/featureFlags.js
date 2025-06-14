/**
 * @file featureFlags.js
 * @description Feature flags para controle de funcionalidades do Portal Betina
 * Sistema de controle de recursos para desenvolvimento e produção
 * @version 1.0.0
 * @created 2025-06-12
 */

/**
 * Feature flags para controle de funcionalidades
 */
export const featureFlags = {
  // Funcionalidades de análise cognitiva
  enableAdvancedCognitiveAnalysis: true,
  enableNeuropedagogicalExtensions: true,
  enableAutismSpecificAlgorithms: true,

  // Funcionalidades adaptativas
  enableAdaptiveRecommendations: true,
  enableRealTimeAdaptation: true,
  enablePersonalizedContent: true,

  // Funcionalidades de acessibilidade
  enableAccessibilityAdaptations: true,
  enableSensoryAdaptations: true,
  enableCommunicationSupports: true,

  // Funcionalidades de análise comportamental
  enableBehavioralAnalysis: true,
  enableEngagementTracking: true,
  enableFrustrationDetection: true,

  // Funcionalidades terapêuticas
  enableTherapeuticRecommendations: true,
  enableProgressTracking: true,
  enableGoalSetting: true,

  // Funcionalidades de Machine Learning (desabilitadas)
  enableMLPredictions: false,
  enableDeepLearning: false,
  enableNeuralNetworks: false,

  // Funcionalidades experimentais
  enableExperimentalFeatures: false,
  enableBetaFeatures: false,
  enableDebugMode: false,

  // Integrações
  enableSystemOrchestration: true,
  enableCognitiveIntegration: true,
  enableBehavioralIntegration: true,
  // Fase 5: Algoritmos avançados
  enableAdvancedMetricsEngine: false,
  enableNeuroplasticityAnalyzer: false,
  enableErrorPatternAnalyzer: false,

  // Performance e otimização
  enableCaching: true,
  enablePerformanceOptimization: true,
  enableRealTimeMetrics: true,
}

/**
 * Verifica se uma feature está habilitada
 * @param {string} flagName - Nome da feature flag
 * @returns {boolean} Status da feature
 */
export function isFeatureEnabled(flagName) {
  return featureFlags[flagName] === true
}

/**
 * Habilita uma feature flag
 * @param {string} flagName - Nome da feature flag
 */
export function enableFeature(flagName) {
  if (flagName in featureFlags) {
    featureFlags[flagName] = true
  }
}

/**
 * Desabilita uma feature flag
 * @param {string} flagName - Nome da feature flag
 */
export function disableFeature(flagName) {
  if (flagName in featureFlags) {
    featureFlags[flagName] = false
  }
}

/**
 * Obtém todas as feature flags
 * @returns {Object} Objeto com todas as feature flags
 */
export function getAllFeatureFlags() {
  return { ...featureFlags }
}

/**
 * Obtém apenas as features habilitadas
 * @returns {Array} Array com nomes das features habilitadas
 */
export function getEnabledFeatures() {
  return Object.keys(featureFlags).filter((flag) => featureFlags[flag] === true)
}

/**
 * Obtém apenas as features desabilitadas
 * @returns {Array} Array com nomes das features desabilitadas
 */
export function getDisabledFeatures() {
  return Object.keys(featureFlags).filter((flag) => featureFlags[flag] === false)
}

/**
 * Define múltiplas feature flags de uma vez
 * @param {Object} flags - Objeto com flags para definir
 */
export function setFeatureFlags(flags) {
  Object.keys(flags).forEach((flag) => {
    if (flag in featureFlags) {
      featureFlags[flag] = flags[flag]
    }
  })
}

/**
 * Reseta todas as feature flags para valores padrão
 */
export function resetFeatureFlags() {
  Object.keys(featureFlags).forEach((flag) => {
    // Resetar para valores padrão baseados no contexto
    if (flag.includes('ML') || flag.includes('Neural') || flag.includes('DeepLearning')) {
      featureFlags[flag] = false // ML desabilitado por padrão
    } else if (flag.includes('experimental') || flag.includes('beta') || flag.includes('debug')) {
      featureFlags[flag] = false // Features experimentais desabilitadas por padrão
    } else {
      featureFlags[flag] = true // Outras features habilitadas por padrão
    }
  })
}

/**
 * Exportação padrão
 */
export default featureFlags
