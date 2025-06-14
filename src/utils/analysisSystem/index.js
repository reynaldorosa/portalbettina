/**
 * @file index.js
 * @description Arquivo principal de exportações para análise integrada
 * Sistema completo de análise emocional e neuroplasticidade
 * @version 1.0.0
 */

// Serviços principais
export { EmotionalAnalysisService } from '../emotionalAnalysis/EmotionalAnalysisService.js'
export { default as IntegratedAnalysisOrchestrator } from '../emotionalAnalysis/IntegratedAnalysisOrchestrator.js'

// Algoritmos emocionais
export { ColorPsychologicalAnalysis } from '../emotionalAnalysis/algorithms/ColorPsychologicalAnalysis.js'
export { FrustrationDetection } from '../emotionalAnalysis/algorithms/FrustrationDetection.js'
export { EmotionalEngagementAnalysis } from '../emotionalAnalysis/algorithms/EmotionalEngagementAnalysis.js'
export { AnxietyDetector } from '../emotionalAnalysis/algorithms/AnxietyDetector.js'
export { AdaptiveMotivation } from '../emotionalAnalysis/algorithms/AdaptiveMotivation.js'
export { EmotionalRegulationSystem } from '../emotionalAnalysis/algorithms/EmotionalRegulationSystem.js'
export { CreativeExpressionAnalysis } from '../emotionalAnalysis/algorithms/CreativeExpressionAnalysis.js'

// Algoritmos de neuroplasticidade
export { CognitiveImprovementTracker } from '../neuroplasticity/algorithms/CognitiveImprovementTracker.js'
export { OpportunityWindowIdentifier } from '../neuroplasticity/algorithms/OpportunityWindowIdentifier.js'
export { MemoryConsolidationSystem } from '../neuroplasticity/algorithms/MemoryConsolidationSystem.js'
export { CognitiveBreakthroughDetector } from '../neuroplasticity/algorithms/CognitiveBreakthroughDetector.js'
export { CognitiveRecovery } from '../neuroplasticity/algorithms/CognitiveRecovery.js'
export { LearningTransferSystem } from '../neuroplasticity/algorithms/LearningTransferSystem.js'

// Coletores de dados
export { default as EmotionalDataCollector } from '../emotionalAnalysis/dataCollectors/EmotionalDataCollector.js'
export { default as NeuroplasticityDataCollector } from '../neuroplasticity/dataCollectors/NeuroplasticityDataCollector.js'

// Hook de integração
export { default as useIntegratedAnalysis } from '../../hooks/useIntegratedAnalysis.js'

// Constantes e configurações
export const ANALYSIS_TYPES = {
  EMOTIONAL: 'emotional',
  NEUROPLASTICITY: 'neuroplasticity',
  INTEGRATED: 'integrated',
}

export const ALGORITHM_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export const INTERVENTION_TYPES = {
  IMMEDIATE: 'immediate',
  PREVENTIVE: 'preventive',
  ENHANCEMENT: 'enhancement',
}

// Configurações padrão
export const DEFAULT_CONFIG = {
  emotionalAnalysis: {
    realtimeEnabled: true,
    samplingRate: 1000,
    bufferSize: 100,
    algorithms: {
      colorAnalysis: { weight: 0.15 },
      frustrationDetection: { weight: 0.2 },
      engagementAnalysis: { weight: 0.2 },
      anxietyDetector: { weight: 0.15 },
      adaptiveMotivation: { weight: 0.1 },
      emotionalRegulation: { weight: 0.1 },
      creativeExpression: { weight: 0.1 },
    },
  },
  neuroplasticity: {
    realtimeEnabled: true,
    samplingRate: 500,
    bufferSize: 200,
    algorithms: {
      improvementTracker: { weight: 0.25 },
      opportunityWindow: { weight: 0.2 },
      memoryConsolidation: { weight: 0.15 },
      breakthroughDetector: { weight: 0.15 },
      cognitiveRecovery: { weight: 0.15 },
      learningTransfer: { weight: 0.1 },
    },
  },
  integration: {
    realtimeAnalysis: true,
    analysisInterval: 5000,
    autoOptimization: true,
    interventionThreshold: 0.7,
    optimizationThreshold: 0.7,
  },
}

// Funções utilitárias
export const createAnalysisConfig = (userProfile, overrides = {}) => {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    userProfile: {
      personalityType: userProfile.personalityType || 'balanced',
      cognitiveProfile: userProfile.cognitiveProfile || {},
      emotionalProfile: userProfile.emotionalProfile || {},
      learningStyle: userProfile.learningStyle || 'adaptive',
      ...userProfile,
    },
  }
}

export const validateAnalysisResult = (result) => {
  const required = ['algorithm', 'timestamp', 'score', 'confidence']
  return required.every((field) => result.hasOwnProperty(field))
}

export const normalizeScore = (score, min = 0, max = 1) => {
  return Math.max(min, Math.min(max, score))
}

export const calculateWeightedAverage = (scores, weights) => {
  let weightedSum = 0
  let totalWeight = 0

  for (const [key, score] of Object.entries(scores)) {
    const weight = weights[key] || 0
    weightedSum += score * weight
    totalWeight += weight
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Factory para criar instâncias
export const createEmotionalAnalysisService = (databaseService, userProfile, config) => {
  const analysisConfig = createAnalysisConfig(userProfile, config)
  return new EmotionalAnalysisService(databaseService, analysisConfig.userProfile)
}

export const createNeuroplasticityService = (databaseService, userProfile, config) => {
  const analysisConfig = createAnalysisConfig(userProfile, config)
  return new NeuroplasticityService(databaseService, analysisConfig.userProfile)
}

export const createIntegratedOrchestrator = (databaseService, userProfile, config) => {
  const analysisConfig = createAnalysisConfig(userProfile, config)
  return new IntegratedAnalysisOrchestrator(databaseService, analysisConfig.integration)
}

// Versão e informações do sistema
export const SYSTEM_INFO = {
  version: '1.0.0',
  name: 'Portal Betina - Integrated Analysis System',
  description: 'Sistema integrado de análise emocional e neuroplasticidade',
  algorithms: {
    emotional: 7,
    neuroplasticity: 6,
    total: 13,
  },
  features: [
    'Análise emocional em tempo real',
    'Rastreamento de neuroplasticidade',
    'Detecção de intervenções necessárias',
    'Otimização automática de experiência',
    'Coleta de dados multissensorial',
    'Integração com banco de dados',
    'Hooks React personalizados',
    'Exportação de relatórios',
  ],
}
