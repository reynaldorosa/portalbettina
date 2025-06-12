/**
 * @file autismCognitiveAnalyzer.js
 * @description Sistema avançado de análise cognitiva específico para autismo
 * Implementa algoritmos especializados para adaptações e otimizações terapêuticas
 */

import AutismAssessmentHelpers from './autismAssessmentHelpers.js'

/**
 * Sistema de Análise Cognitiva para Autismo
 * Implementa algoritmos específicos para análise e adaptação cognitiva
 */
class AutismCognitiveAnalyzer {
  constructor() {
    this.userProfiles = new Map()
    this.assessmentHistory = new Map()
    this.adaptationStrategies = new Map()
    this.isInitialized = false

    // Configurações específicas para autismo
    this.autismParameters = {
      sensoryProcessingThresholds: {
        hypersensitive: 0.3,
        hyposensitive: 0.7,
        normal: [0.3, 0.7],
      },
      communicationLevels: {
        nonVerbal: 0,
        singleWords: 1,
        phrases: 2,
        sentences: 3,
        advanced: 4,
      },
      supportLevels: {
        level1: 'requiring support',
        level2: 'requiring substantial support',
        level3: 'requiring very substantial support',
      },
      cognitivePatterns: {
        strengthAreas: ['pattern_recognition', 'visual_processing', 'systematic_thinking'],
        challengeAreas: ['social_communication', 'flexibility', 'sensory_integration'],
      },
    }
  }

  /**
   * Inicializa o analisador cognitivo para autismo
   */
  async initialize() {
    try {
      this.isInitialized = true
      console.log('🧩 AutismCognitiveAnalyzer inicializado')
      return true
    } catch (error) {
      console.error('Erro ao inicializar analisador de autismo:', error)
      return false
    }
  }

  /**
   * Calcula adaptações específicas para autismo
   * @param {string} userId - ID do usuário
   * @param {Object} sessionData - Dados da sessão atual
   * @param {Object} userProfile - Perfil cognitivo do usuário
   * @returns {Object} Adaptações personalizadas para autismo
   */
  calculateAutismAdaptations(userId, sessionData, userProfile = {}) {
    if (!this.isInitialized) {
      this.initialize()
    }

    try {
      // Análise de características do autismo
      const autismCharacteristics = this.assessAutismCharacteristics(sessionData, userProfile)

      // Avaliação de processamento sensorial
      const sensoryProfile = this.assessSensoryProcessing(sessionData, userProfile)

      // Análise de comunicação
      const communicationLevel = this.assessCommunicationLevel(sessionData, userProfile)

      // Avaliação de função executiva
      const executiveFunction = this.assessExecutiveFunction(sessionData, userProfile)

      // Cálculo do nível de suporte necessário
      const supportLevel = this.calculateSupportLevel(
        autismCharacteristics,
        sensoryProfile,
        communicationLevel
      )

      // Geração de adaptações específicas
      const adaptations = {
        timestamp: new Date().toISOString(),
        userId,

        // Características identificadas
        autismCharacteristics,
        sensoryProfile,
        communicationLevel,
        executiveFunction,
        supportLevel,

        // Adaptações recomendadas
        sensoryAdaptations: this.generateSensoryAdaptations(sensoryProfile),
        communicationAdaptations: this.generateCommunicationAdaptations(communicationLevel),
        cognitiveAdaptations: this.generateCognitiveAdaptations(executiveFunction),
        environmentalAdaptations: this.generateEnvironmentalAdaptations(autismCharacteristics),

        // Estratégias de ensino
        teachingStrategies: this.generateTeachingStrategies(autismCharacteristics, supportLevel),

        // Recomendações imediatas
        immediateRecommendations: this.generateImmediateRecommendations(sessionData, supportLevel),

        // Métricas de confiança
        confidenceScore: this.calculateAdaptationConfidence(sessionData, userProfile),

        // Próximos passos
        nextSteps: this.generateNextSteps(autismCharacteristics, supportLevel),
      }

      // Armazenar perfil do usuário
      this.userProfiles.set(userId, {
        ...adaptations,
        lastUpdated: new Date().toISOString(),
      })

      return adaptations
    } catch (error) {
      console.error('Erro ao calcular adaptações para autismo:', error)
      return null
    }
  }

  /**
   * Gera otimizações terapêuticas baseadas na análise cognitiva
   * @param {string} userId - ID do usuário
   * @param {Object} sessionData - Dados da sessão
   * @param {Object} therapyGoals - Objetivos terapêuticos
   * @returns {Object} Otimizações terapêuticas personalizadas
   */
  generateTherapyOptimizations(userId, sessionData, therapyGoals = {}) {
    try {
      const userProfile = this.userProfiles.get(userId) || {}

      // Análise de progresso terapêutico
      const progressAnalysis = this.analyzeTherapeuticProgress(userId, sessionData)

      // Identificação de áreas de foco
      const focusAreas = this.identifyTherapyFocusAreas(sessionData, userProfile, therapyGoals)

      // Geração de estratégias otimizadas
      const optimizations = {
        timestamp: new Date().toISOString(),
        userId,

        // Análise de progresso
        progressAnalysis,
        focusAreas,

        // Otimizações específicas
        activityOptimizations: this.optimizeActivitySettings(sessionData, userProfile),
        behavioralInterventions: this.generateBehavioralInterventions(progressAnalysis, focusAreas),
        sensoryOptimizations: this.optimizeSensoryInput(userProfile.sensoryProfile || {}),
        communicationOptimizations: this.optimizeCommunicationSupport(
          userProfile.communicationLevel || {}
        ),

        // Plano de intervenção
        interventionPlan: this.createInterventionPlan(focusAreas, userProfile.supportLevel),

        // Métricas de objetivo
        goalMetrics: this.calculateGoalMetrics(therapyGoals, progressAnalysis),

        // Recomendações de frequência
        frequencyRecommendations: this.calculateOptimalFrequency(progressAnalysis, userProfile),

        // Estratégias de generalização
        generalizationStrategies: this.generateGeneralizationStrategies(focusAreas, userProfile),

        // Monitoramento recomendado
        monitoringPlan: this.createMonitoringPlan(focusAreas, therapyGoals),
      }

      // Armazenar histórico de otimizações
      const history = this.assessmentHistory.get(userId) || []
      history.push(optimizations)
      this.assessmentHistory.set(userId, history.slice(-20)) // Manter últimas 20

      return optimizations
    } catch (error) {
      console.error('Erro ao gerar otimizações terapêuticas:', error)
      return null
    }
  }

  /**
   * Avalia nível cognitivo geral
   * @param {Object} sessionData - Dados da sessão
   * @param {Object} userProfile - Perfil do usuário
   * @returns {Object} Avaliação do nível cognitivo
   */
  assessCognitiveLevel(sessionData, userProfile = {}) {
    const cognitiveMetrics = {
      processingSpeed: this.calculateProcessingSpeed(sessionData),
      workingMemory: this.assessWorkingMemory(sessionData),
      attention: this.assessAttentionCapacity(sessionData),
      problemSolving: this.assessProblemSolving(sessionData),
      flexibility: this.assessCognitiveFlexibility(sessionData),
    }

    const overallLevel = this.calculateOverallCognitiveLevel(cognitiveMetrics)

    return {
      metrics: cognitiveMetrics,
      overallLevel,
      strengths: this.identifyCognitiveStrengths(cognitiveMetrics),
      challenges: this.identifyCognitiveChallenges(cognitiveMetrics),
      recommendations: this.generateCognitiveRecommendations(cognitiveMetrics, overallLevel),
    }
  }

  /**
   * Avalia nível de comunicação
   * @param {Object} sessionData - Dados da sessão
   * @param {Object} userProfile - Perfil do usuário
   * @returns {Object} Avaliação da comunicação
   */
  assessCommunicationLevel(sessionData, userProfile = {}) {
    const communicationMetrics = {
      expressiveLanguage: this.assessExpressiveLanguage(sessionData),
      receptiveLanguage: this.assessReceptiveLanguage(sessionData),
      socialCommunication: this.assessSocialCommunication(sessionData),
      nonVerbalCommunication: this.assessNonVerbalCommunication(sessionData),
      pragmatics: this.assessPragmaticSkills(sessionData),
    }

    const level = this.determineCommunicationLevel(communicationMetrics)

    return {
      level,
      metrics: communicationMetrics,
      modalityPreferences: this.identifyPreferredModalities(sessionData),
      barriers: this.identifyCommunicationBarriers(communicationMetrics),
      supports: this.recommendCommunicationSupports(level, communicationMetrics),
    }
  }

  /**
   * Avalia processamento sensorial
   * @param {Object} sessionData - Dados da sessão
   * @param {Object} userProfile - Perfil do usuário
   * @returns {Object} Perfil de processamento sensorial
   */
  assessSensoryProcessing(sessionData, userProfile = {}) {
    const sensoryDomains = {
      visual: this.assessVisualProcessing(sessionData),
      auditory: this.assessAuditoryProcessing(sessionData),
      tactile: this.assessTactileProcessing(sessionData),
      proprioceptive: this.assessProprioceptiveProcessing(sessionData),
      vestibular: this.assessVestibularProcessing(sessionData),
      gustatory: this.assessGustatoryProcessing(sessionData),
      olfactory: this.assessOlfactoryProcessing(sessionData),
    }

    return {
      sensoryDomains,
      overallProfile: this.createOverallSensoryProfile(sensoryDomains),
      sensitivities: this.identifySensitivities(sensoryDomains),
      seekingBehaviors: this.identifySeekingBehaviors(sensoryDomains),
      adaptationNeeds: this.identifySensoryAdaptationNeeds(sensoryDomains),
    }
  }

  /**
   * Avalia função executiva
   * @param {Object} sessionData - Dados da sessão
   * @param {Object} userProfile - Perfil do usuário
   * @returns {Object} Avaliação da função executiva
   */
  assessExecutiveFunction(sessionData, userProfile = {}) {
    const executiveSkills = {
      workingMemory: this.assessWorkingMemory(sessionData),
      cognitiveFlexibility: this.assessCognitiveFlexibility(sessionData),
      inhibitoryControl: this.assessInhibitoryControl(sessionData),
      planning: this.assessPlanningSkills(sessionData),
      organization: this.assessOrganizationSkills(sessionData),
      timeManagement: this.assessTimeManagement(sessionData),
      taskInitiation: this.assessTaskInitiation(sessionData),
      selfMonitoring: this.assessSelfMonitoring(sessionData),
    }

    return {
      skills: executiveSkills,
      overallFunction: this.calculateOverallExecutiveFunction(executiveSkills),
      strengthAreas: this.identifyExecutiveStrengths(executiveSkills),
      challengeAreas: this.identifyExecutiveChallenges(executiveSkills),
      interventions: this.recommendExecutiveInterventions(executiveSkills),
    }
  }

  /**
   * Cria perfil sensorial detalhado
   * @param {string} userId - ID do usuário
   * @param {Object} assessmentData - Dados de avaliação
   * @returns {Object} Perfil sensorial completo
   */
  createSensoryProfile(userId, assessmentData) {
    const sensoryAssessment = this.assessSensoryProcessing(assessmentData)

    const profile = {
      userId,
      timestamp: new Date().toISOString(),

      // Perfil detalhado por modalidade
      modalityProfiles: sensoryAssessment.sensoryDomains,

      // Padrões gerais
      overallPattern: sensoryAssessment.overallProfile,

      // Identificação de preferências
      preferences: {
        highInput: this.identifyHighInputPreferences(sensoryAssessment.sensoryDomains),
        lowInput: this.identifyLowInputPreferences(sensoryAssessment.sensoryDomains),
        variableInput: this.identifyVariableInputPreferences(sensoryAssessment.sensoryDomains),
      },

      // Estratégias de regulação
      regulationStrategies: this.generateRegulationStrategies(sensoryAssessment),

      // Adaptações ambientais
      environmentalMods: this.generateEnvironmentalModifications(sensoryAssessment),

      // Metas terapêuticas
      therapyGoals: this.generateSensoryTherapyGoals(sensoryAssessment),

      // Plano de monitoramento
      monitoringPlan: this.createSensoryMonitoringPlan(sensoryAssessment),
    }

    return profile
  }

  /**
   * Cria perfil comportamental
   * @param {string} userId - ID do usuário
   * @param {Object} behavioralData - Dados comportamentais
   * @returns {Object} Perfil comportamental completo
   */
  createBehavioralProfile(userId, behavioralData) {
    const behavioralAnalysis = this.analyzeBehavioralPatterns(behavioralData)

    const profile = {
      userId,
      timestamp: new Date().toISOString(),

      // Padrões comportamentais identificados
      patterns: behavioralAnalysis.patterns,

      // Funções dos comportamentos
      behaviorFunctions: this.identifyBehaviorFunctions(behavioralData),

      // Antecedentes e consequentes
      abcAnalysis: this.performABCAnalysis(behavioralData),

      // Comportamentos adaptativos vs. desafiadores
      adaptiveBehaviors: this.identifyAdaptiveBehaviors(behavioralData),
      challengingBehaviors: this.identifyChallengingBehaviors(behavioralData),

      // Estratégias de intervenção
      interventionStrategies: this.generateBehavioralInterventions(behavioralAnalysis),

      // Plano de substituição comportamental
      replacementBehaviors: this.identifyReplacementBehaviors(behavioralAnalysis),

      // Sistema de reforço
      reinforcementPlan: this.createReinforcementPlan(behavioralAnalysis),

      // Metas comportamentais
      behavioralGoals: this.generateBehavioralGoals(behavioralAnalysis),
    }

    return profile
  }

  /**
   * Calcula nível de suporte necessário
   * @param {Object} autismCharacteristics - Características do autismo
   * @param {Object} sensoryProfile - Perfil sensorial
   * @param {Object} communicationLevel - Nível de comunicação
   * @returns {Object} Nível de suporte calculado
   */
  calculateSupportLevel(autismCharacteristics, sensoryProfile, communicationLevel) {
    const supportFactors = {
      communicationNeeds: this.calculateCommunicationSupportNeeds(communicationLevel),
      socialNeeds: this.calculateSocialSupportNeeds(autismCharacteristics),
      sensoryNeeds: this.calculateSensorySupportNeeds(sensoryProfile),
      behavioralNeeds: this.calculateBehavioralSupportNeeds(autismCharacteristics),
      cognitiveNeeds: this.calculateCognitiveSupportNeeds(autismCharacteristics),
    }

    const overallScore = this.calculateOverallSupportScore(supportFactors)
    const level = this.determineSupportLevel(overallScore)

    return {
      level,
      score: overallScore,
      factors: supportFactors,
      supports: this.recommendSpecificSupports(level, supportFactors),
      intensity: this.calculateSupportIntensity(level, supportFactors),
      frequency: this.calculateSupportFrequency(level, supportFactors),
    }
  }

  // ==================== MÉTODOS AUXILIARES ESPECÍFICOS ====================
  /**
   * Avalia características do autismo
   */
  assessAutismCharacteristics(sessionData, userProfile) {
    return AutismAssessmentHelpers.assessSocialCommunicationChallenges(sessionData)
  }

  /**
   * Gera adaptações sensoriais
   */
  generateSensoryAdaptations(sensoryProfile) {
    const adaptations = []

    Object.entries(sensoryProfile.sensoryDomains || {}).forEach(([domain, assessment]) => {
      if (assessment.threshold < this.autismParameters.sensoryProcessingThresholds.hypersensitive) {
        adaptations.push({
          domain,
          type: 'reduction',
          strategies:
            AutismAssessmentHelpers.getHypersensitiveStrategies?.(domain) ||
            this.getHypersensitiveStrategies(domain),
          priority: 'high',
        })
      } else if (
        assessment.threshold > this.autismParameters.sensoryProcessingThresholds.hyposensitive
      ) {
        adaptations.push({
          domain,
          type: 'enhancement',
          strategies:
            AutismAssessmentHelpers.getHyposensitiveStrategies?.(domain) ||
            this.getHyposensitiveStrategies(domain),
          priority: 'medium',
        })
      }
    })

    return adaptations
  }

  /**
   * Gera adaptações de comunicação
   */
  generateCommunicationAdaptations(communicationLevel) {
    const level = communicationLevel.level || 0

    return {
      visualSupports: this.recommendVisualSupports(level),
      augmentativeDevices: this.recommendAAC(level),
      environmentalMods: this.recommendCommunicationEnvironment(level),
      teachingStrategies: this.recommendCommunicationTeaching(level),
      socialSkillsSupport: this.recommendSocialSkillsSupport(level),
    }
  }

  /**
   * Gera adaptações cognitivas
   */
  generateCognitiveAdaptations(executiveFunction) {
    return {
      structuralSupports: this.recommendStructuralSupports(executiveFunction),
      organizationalAids: this.recommendOrganizationalAids(executiveFunction),
      memorySupports: this.recommendMemorySupports(executiveFunction),
      attentionStrategies: this.recommendAttentionStrategies(executiveFunction),
      flexibilitySupports: this.recommendFlexibilitySupports(executiveFunction),
    }
  }

  /**
   * Calcula confiança das adaptações
   */
  calculateAdaptationConfidence(sessionData, userProfile) {
    const factors = {
      dataQuality: this.assessDataQuality(sessionData),
      profileCompleteness: this.assessProfileCompleteness(userProfile),
      consistencyScore: this.calculateConsistencyScore(sessionData),
      validationLevel: this.assessValidationLevel(sessionData, userProfile),
    }

    return Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length
  }

  // ==================== IMPLEMENTAÇÕES DOS MÉTODOS AUXILIARES ====================

  assessSocialCommunicationChallenges(sessionData) {
    return AutismAssessmentHelpers.assessSocialCommunicationChallenges(sessionData)
  }

  assessRestrictedInterests(sessionData) {
    return AutismAssessmentHelpers.assessRestrictedInterests(sessionData)
  }

  assessRepetitiveBehaviors(sessionData) {
    return AutismAssessmentHelpers.assessRepetitiveBehaviors(sessionData)
  }

  assessSensoryDifferences(sessionData) {
    return AutismAssessmentHelpers.assessSensoryDifferences(sessionData)
  }

  identifyAutismStrengths(sessionData, userProfile) {
    const strengths = []

    // Força em reconhecimento de padrões
    if (sessionData.patternRecognition > 0.7) {
      strengths.push('excellent pattern recognition')
    }

    // Força em processamento visual
    if (sessionData.visualProcessing > 0.7) {
      strengths.push('strong visual processing')
    }

    // Força em pensamento sistemático
    if (sessionData.systematicThinking > 0.7) {
      strengths.push('systematic thinking abilities')
    }

    // Força em atenção aos detalhes
    if (sessionData.detailOrientation > 0.7) {
      strengths.push('attention to detail')
    }

    return strengths
  }

  assessVisualProcessing(sessionData) {
    return AutismAssessmentHelpers.assessVisualProcessing(sessionData)
  }

  assessAuditoryProcessing(sessionData) {
    return AutismAssessmentHelpers.assessAuditoryProcessing(sessionData)
  }

  assessTactileProcessing(sessionData) {
    return AutismAssessmentHelpers.assessTactileProcessing(sessionData)
  }

  assessProprioceptiveProcessing(sessionData) {
    const metrics = {
      bodyAwareness: sessionData.bodyAwareness || 0.5,
      positionSense: sessionData.positionSense || 0.5,
      movementPlanning: sessionData.movementPlanning || 0.5,
      forceModulation: sessionData.forceModulation || 0.5,
    }

    const threshold = sessionData.proprioceptiveThreshold || 0.5

    return {
      metrics,
      threshold,
      profile: threshold < 0.3 ? 'hyper' : threshold > 0.7 ? 'hypo' : 'typical',
      needsAssessment: Object.values(metrics).some((val) => val < 0.4 || val > 0.8),
    }
  }

  assessVestibularProcessing(sessionData) {
    const metrics = {
      balance: sessionData.balanceSkills || 0.5,
      coordination: sessionData.coordinationSkills || 0.5,
      motionTolerance: sessionData.motionTolerance || 0.5,
      spatialOrientation: sessionData.spatialOrientation || 0.5,
    }

    const threshold = sessionData.vestibularThreshold || 0.5

    return {
      metrics,
      threshold,
      profile: threshold < 0.3 ? 'hyper' : threshold > 0.7 ? 'hypo' : 'typical',
      strategies: this.generateVestibularStrategies(metrics, threshold),
    }
  }

  assessGustatoryProcessing(sessionData) {
    const preferences = sessionData.tastePreferences || {}
    const sensitivities = sessionData.tasteSensitivities || {}

    return {
      preferences,
      sensitivities,
      restrictionLevel: Object.keys(sensitivities).length / 10, // Normalizado
      interventions: this.generateGustatoryInterventions(preferences, sensitivities),
    }
  }

  assessOlfactoryProcessing(sessionData) {
    const sensitivities = sessionData.smellSensitivities || {}
    const preferences = sessionData.smellPreferences || {}

    return {
      sensitivities,
      preferences,
      impactLevel: Object.keys(sensitivities).length / 10, // Normalizado
      adaptations: this.generateOlfactoryAdaptations(sensitivities, preferences),
    }
  }

  assessExpressiveLanguage(sessionData) {
    return AutismAssessmentHelpers.assessExpressiveLanguage(sessionData)
  }

  assessReceptiveLanguage(sessionData) {
    return AutismAssessmentHelpers.assessReceptiveLanguage(sessionData)
  }

  assessSocialCommunication(sessionData) {
    return AutismAssessmentHelpers.assessSocialCommunication(sessionData)
  }

  assessNonVerbalCommunication(sessionData) {
    const skills = {
      gestures: sessionData.gestureUse || 0,
      facialExpressions: sessionData.facialExpressionUse || 0,
      bodyLanguage: sessionData.bodyLanguageUse || 0,
      proximics: sessionData.proximicsUse || 0,
      eyeGaze: sessionData.eyeGazeUse || 0,
    }

    return {
      skills,
      overallLevel:
        Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length,
      supports: this.recommendNonVerbalSupports(skills),
    }
  }

  assessPragmaticSkills(sessionData) {
    const skills = {
      conversationSkills: sessionData.conversationSkills || 0,
      contextualUse: sessionData.contextualLanguageUse || 0,
      socialRules: sessionData.socialLanguageRules || 0,
      narrativeSkills: sessionData.narrativeSkills || 0,
      inferenceSkills: sessionData.inferenceSkills || 0,
    }

    return {
      skills,
      overallLevel:
        Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length,
      interventions: this.recommendPragmaticInterventions(skills),
    }
  }

  determineCommunicationLevel(communicationMetrics) {
    const scores = Object.values(communicationMetrics)
    const average = scores.reduce((sum, val) => sum + val.overallLevel || val, 0) / scores.length

    if (average < 0.2) return 0 // Não verbal
    if (average < 0.4) return 1 // Palavras simples
    if (average < 0.6) return 2 // Frases
    if (average < 0.8) return 3 // Sentenças
    return 4 // Avançado
  }

  identifyPreferredModalities(sessionData) {
    const modalities = {
      visual: sessionData.visualPreference || 0.5,
      auditory: sessionData.auditoryPreference || 0.5,
      tactile: sessionData.tactilePreference || 0.5,
      gestural: sessionData.gesturalPreference || 0.5,
    }

    return Object.entries(modalities)
      .sort(([, a], [, b]) => b - a)
      .map(([modality, score]) => ({ modality, score }))
  }

  identifyCommunicationBarriers(communicationMetrics) {
    const barriers = []

    Object.entries(communicationMetrics).forEach(([area, metrics]) => {
      if (metrics.overallLevel < 0.4) {
        barriers.push({
          area,
          severity: metrics.overallLevel < 0.2 ? 'severe' : 'moderate',
          specificChallenges: Object.entries(metrics.skills || {})
            .filter(([, score]) => score < 0.4)
            .map(([skill]) => skill),
        })
      }
    })

    return barriers
  }

  recommendCommunicationSupports(level, communicationMetrics) {
    const supports = []

    if (level <= 1) {
      supports.push('AAC devices', 'picture communication', 'gesture training')
    }

    if (level <= 2) {
      supports.push('visual schedules', 'social stories', 'video modeling')
    }

    if (level <= 3) {
      supports.push('conversation scripts', 'pragmatic training', 'peer interaction support')
    }

    return supports
  }

  assessProblemSolving(sessionData) {
    const skills = {
      identification: sessionData.problemIdentification || 0.5,
      strategy: sessionData.strategyGeneration || 0.5,
      implementation: sessionData.strategyImplementation || 0.5,
      evaluation: sessionData.solutionEvaluation || 0.5,
      flexibility: sessionData.alternativeSolutions || 0.5,
    }

    return Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length
  }

  calculateOverallCognitiveLevel(cognitiveMetrics) {
    const weights = {
      processingSpeed: 0.2,
      workingMemory: 0.25,
      attention: 0.2,
      problemSolving: 0.2,
      flexibility: 0.15,
    }

    return Object.entries(weights).reduce((sum, [metric, weight]) => {
      return sum + (cognitiveMetrics[metric] || 0.5) * weight
    }, 0)
  }

  identifyCognitiveStrengths(cognitiveMetrics) {
    return Object.entries(cognitiveMetrics)
      .filter(([, score]) => score > 0.7)
      .map(([area]) => area)
  }

  identifyCognitiveChallenges(cognitiveMetrics) {
    return Object.entries(cognitiveMetrics)
      .filter(([, score]) => score < 0.4)
      .map(([area]) => area)
  }

  generateCognitiveRecommendations(cognitiveMetrics, overallLevel) {
    const recommendations = []

    Object.entries(cognitiveMetrics).forEach(([area, score]) => {
      if (score < 0.4) {
        recommendations.push({
          area,
          priority: 'high',
          interventions: this.getCognitiveInterventions(area),
          frequency: 'daily',
        })
      } else if (score > 0.7) {
        recommendations.push({
          area,
          priority: 'low',
          interventions: [`build on ${area} strengths`],
          frequency: 'weekly',
        })
      }
    })

    return recommendations
  }

  getCognitiveInterventions(area) {
    const interventions = {
      processingSpeed: ['processing speed drills', 'timed activities', 'speed training'],
      workingMemory: ['memory games', 'chunking strategies', 'rehearsal techniques'],
      attention: ['attention training', 'mindfulness exercises', 'focus activities'],
      problemSolving: ['step-by-step training', 'strategy instruction', 'scaffolded practice'],
      flexibility: ['set-shifting games', 'perspective taking', 'adaptation exercises'],
    }

    return interventions[area] || ['general cognitive training']
  }

  // ==================== MÉTODOS DE CÁLCULO ESPECÍFICOS ====================

  calculateProcessingSpeed(sessionData) {
    const responseTimes = sessionData.responseTimes || []
    if (responseTimes.length === 0) return 0.5

    const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    return Math.max(0, Math.min(1, 1 - (avgTime - 2000) / 8000)) // Normalizado para 2-10 segundos
  }

  assessWorkingMemory(sessionData) {
    const accuracy = sessionData.accuracy || 0
    const complexity = sessionData.taskComplexity || 1
    return Math.min(1, accuracy * (1 + complexity * 0.2))
  }

  assessAttentionCapacity(sessionData) {
    const duration = sessionData.sessionDuration || 0
    const consistency = sessionData.consistencyScore || 0.5
    return Math.min(1, (duration / 600000) * consistency) // 10 minutos baseline
  }

  // ==================== MÉTODOS DE AVALIAÇÃO AVANÇADOS ====================

  analyzeTherapeuticProgress(userId, sessionData) {
    const history = this.assessmentHistory.get(userId) || []

    if (history.length < 2) {
      return {
        trend: 'insufficient_data',
        rate: 0,
        areas: [],
      }
    }

    const recent = history.slice(-5)
    const trends = this.calculateProgressTrends(recent)

    return {
      overallTrend: trends.overall,
      domainTrends: trends.domains,
      progressRate: trends.rate,
      plateauAreas: trends.plateaus,
      acceleratingAreas: trends.accelerating,
      recommendations: this.generateProgressRecommendations(trends),
    }
  }

  optimizeActivitySettings(sessionData, userProfile) {
    const currentSettings = sessionData.activitySettings || {}
    const preferences = userProfile.preferences || {}

    return {
      difficulty: this.optimizeDifficulty(sessionData, preferences),
      pacing: this.optimizePacing(sessionData, preferences),
      feedback: this.optimizeFeedback(sessionData, preferences),
      breaks: this.optimizeBreaks(sessionData, preferences),
      reinforcement: this.optimizeReinforcement(sessionData, preferences),
    }
  }

  // ==================== MÉTODOS DE SUPORTE AUXILIARES ====================

  getHypersensitiveStrategies(domain) {
    const strategies = {
      visual: ['dimmed lighting', 'reduced visual clutter', 'high contrast materials'],
      auditory: ['noise reduction', 'headphones', 'quiet spaces'],
      tactile: ['soft textures', 'gradual exposure', 'protective clothing'],
      proprioceptive: ['heavy work activities', 'compression', 'resistance exercises'],
      vestibular: ['slow movements', 'stable surfaces', 'linear motion'],
    }

    return strategies[domain] || []
  }

  getHyposensitiveStrategies(domain) {
    const strategies = {
      visual: ['bright lighting', 'colorful materials', 'visual stimulation'],
      auditory: ['music', 'sound tools', 'auditory cues'],
      tactile: ['varied textures', 'fidget tools', 'tactile exploration'],
      proprioceptive: ['jumping', 'pushing', 'carrying activities'],
      vestibular: ['swinging', 'spinning', 'balance activities'],
    }

    return strategies[domain] || []
  }

  recommendVisualSupports(communicationLevel) {
    const supports = {
      0: ['picture cards', 'visual schedules', 'choice boards'],
      1: ['word-picture combinations', 'visual instructions', 'social stories'],
      2: ['text with pictures', 'graphic organizers', 'visual timers'],
      3: ['written instructions', 'checklists', 'mind maps'],
      4: ['complex graphics', 'digital tools', 'multimedia supports'],
    }

    return supports[communicationLevel] || supports[0]
  }

  // ==================== MÉTODO DE EXPORTAÇÃO ====================
  /**
   * Exporta dados do analisador
   */
  export() {
    return {
      userProfiles: Object.fromEntries(this.userProfiles),
      assessmentHistory: Object.fromEntries(this.assessmentHistory),
      adaptationStrategies: Object.fromEntries(this.adaptationStrategies),
      timestamp: Date.now(),
    }
  }

  /**
   * Importa dados do analisador
   */
  import(data) {
    try {
      this.userProfiles = new Map(Object.entries(data.userProfiles || {}))
      this.assessmentHistory = new Map(Object.entries(data.assessmentHistory || {}))
      this.adaptationStrategies = new Map(Object.entries(data.adaptationStrategies || {}))
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao importar dados do analisador de autismo:', error)
      return false
    }
  }

  // ==================== MÉTODOS AUXILIARES ADICIONAIS ====================

  createOverallSensoryProfile(sensoryDomains) {
    const profiles = Object.values(sensoryDomains).map((domain) => domain.profile)
    const counts = profiles.reduce((acc, profile) => {
      acc[profile] = (acc[profile] || 0) + 1
      return acc
    }, {})

    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
  }

  identifySensitivities(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold < 0.3)
      .map(([name]) => name)
  }

  identifySeekingBehaviors(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold > 0.7)
      .map(([name]) => name)
  }

  identifySensoryAdaptationNeeds(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold < 0.3 || domain.threshold > 0.7)
      .map(([name, domain]) => ({
        domain: name,
        type: domain.threshold < 0.3 ? 'hypersensitive' : 'hyposensitive',
        priority: domain.threshold < 0.2 || domain.threshold > 0.8 ? 'high' : 'medium',
      }))
  }

  calculateOverallExecutiveFunction(executiveSkills) {
    return (
      Object.values(executiveSkills).reduce((sum, val) => sum + val, 0) /
      Object.keys(executiveSkills).length
    )
  }

  identifyExecutiveStrengths(executiveSkills) {
    return Object.entries(executiveSkills)
      .filter(([, score]) => score > 0.7)
      .map(([skill]) => skill)
  }

  identifyExecutiveChallenges(executiveSkills) {
    return Object.entries(executiveSkills)
      .filter(([, score]) => score < 0.4)
      .map(([skill]) => skill)
  }

  recommendExecutiveInterventions(executiveSkills) {
    const interventions = []

    Object.entries(executiveSkills).forEach(([skill, score]) => {
      if (score < 0.4) {
        interventions.push({
          skill,
          strategies: this.getExecutiveStrategies(skill),
          frequency: 'daily',
          duration: '15-30 minutes',
        })
      }
    })

    return interventions
  }

  getExecutiveStrategies(skill) {
    const strategies = {
      workingMemory: ['memory games', 'chunking', 'rehearsal'],
      cognitiveFlexibility: ['set-shifting activities', 'perspective taking', 'problem solving'],
      inhibitoryControl: ['stop-and-think strategies', 'impulse control games'],
      planning: ['visual organizers', 'step-by-step guides', 'goal setting'],
      organization: ['color coding', 'categorization', 'systematic approaches'],
      timeManagement: ['visual timers', 'schedules', 'time estimation'],
      taskInitiation: ['break down tasks', 'motivation strategies', 'prompting'],
      selfMonitoring: ['self-check lists', 'reflection activities', 'progress tracking'],
    }

    return strategies[skill] || ['general executive function training']
  }

  assessOrganizationSkills(sessionData) {
    return sessionData.organizationSkills || 0.5
  }

  assessTimeManagement(sessionData) {
    return sessionData.timeManagement || 0.5
  }

  assessTaskInitiation(sessionData) {
    return sessionData.taskInitiation || 0.5
  }

  assessSelfMonitoring(sessionData) {
    return sessionData.selfMonitoring || 0.5
  }

  analyzeBehavioralPatterns(behavioralData) {
    const patterns = {
      frequency: behavioralData.behaviorFrequency || {},
      triggers: behavioralData.behaviorTriggers || {},
      duration: behavioralData.behaviorDuration || {},
      intensity: behavioralData.behaviorIntensity || {},
    }

    return {
      patterns,
      predominantPattern: this.identifyPredominantPattern(patterns),
      interventionTargets: this.identifyInterventionTargets(patterns),
    }
  }

  identifyBehaviorFunctions(behavioralData) {
    const functions = {
      escape: behavioralData.escapeFunction || 0,
      attention: behavioralData.attentionFunction || 0,
      tangible: behavioralData.tangibleFunction || 0,
      sensory: behavioralData.sensoryFunction || 0,
      automatic: behavioralData.automaticFunction || 0,
    }

    return Object.entries(functions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([func, score]) => ({ function: func, likelihood: score }))
  }

  performABCAnalysis(behavioralData) {
    return {
      antecedents: behavioralData.commonAntecedents || [],
      behaviors: behavioralData.targetBehaviors || [],
      consequences: behavioralData.typicalConsequences || [],
    }
  }

  identifyAdaptiveBehaviors(behavioralData) {
    return behavioralData.adaptiveBehaviors || []
  }

  identifyChallengingBehaviors(behavioralData) {
    return behavioralData.challengingBehaviors || []
  }

  generateBehavioralInterventions(behavioralAnalysis) {
    const interventions = []

    behavioralAnalysis.interventionTargets?.forEach((target) => {
      interventions.push({
        target,
        strategies: this.getBehavioralStrategies(target),
        timeline: this.calculateInterventionTimeline(target),
        measurableGoals: this.createMeasurableGoals(target),
      })
    })

    return interventions
  }

  getBehavioralStrategies(target) {
    const strategies = {
      aggression: ['de-escalation', 'alternative communication', 'environmental modification'],
      selfInjury: ['protective equipment', 'alternative sensory input', 'communication training'],
      stereotypy: ['redirection', 'replacement behaviors', 'sensory alternatives'],
      elopement: ['environmental safety', 'communication alternatives', 'choice provision'],
    }

    return strategies[target] || ['individualized assessment needed']
  }

  identifyReplacementBehaviors(behavioralAnalysis) {
    const replacements = []

    behavioralAnalysis.patterns?.triggers &&
      Object.keys(behavioralAnalysis.patterns.triggers).forEach((trigger) => {
        replacements.push({
          trigger,
          currentBehavior: 'challenging behavior',
          replacementBehavior: this.suggestReplacement(trigger),
          teachingMethod: 'differential reinforcement',
        })
      })

    return replacements
  }

  suggestReplacement(trigger) {
    const replacements = {
      attention: 'appropriate attention-seeking behavior',
      escape: 'appropriate break request',
      sensory: 'appropriate sensory tool use',
      tangible: 'appropriate requesting behavior',
    }

    return replacements[trigger] || 'functional communication'
  }

  createReinforcementPlan(behavioralAnalysis) {
    return {
      primaryReinforcer: 'preferred activity/item',
      schedule: 'variable ratio initially, fading to intermittent',
      reinforcementMenu: ['social praise', 'preferred activities', 'tangible items'],
      fading: 'systematic reduction over time',
      generalization: 'across people, settings, and time',
    }
  }

  generateBehavioralGoals(behavioralAnalysis) {
    return [
      'Increase appropriate communication behaviors',
      'Decrease challenging behaviors by 50%',
      'Increase independent coping strategies',
      'Improve emotional regulation skills',
    ]
  }

  calculateCommunicationSupportNeeds(communicationLevel) {
    return AutismAssessmentHelpers.calculateCommunicationSupportNeeds(communicationLevel)
  }

  calculateSocialSupportNeeds(autismCharacteristics) {
    return AutismAssessmentHelpers.calculateSocialSupportNeeds(autismCharacteristics)
  }

  calculateSensorySupportNeeds(sensoryProfile) {
    return AutismAssessmentHelpers.calculateSensorySupportNeeds(sensoryProfile)
  }

  calculateBehavioralSupportNeeds(autismCharacteristics) {
    const behavioralChallenges = autismCharacteristics.repetitiveBehaviors || {}
    const functionalImpact = behavioralChallenges.functionalImpact || 0.5

    return Math.min(1, functionalImpact * 1.2)
  }

  calculateCognitiveSupportNeeds(autismCharacteristics) {
    const cognitiveFlexibility = autismCharacteristics.cognitiveFlexibility || 0.5
    const executiveFunction = autismCharacteristics.executiveFunction || 0.5

    return 1 - (cognitiveFlexibility + executiveFunction) / 2
  }

  calculateOverallSupportScore(supportFactors) {
    const weights = {
      communicationNeeds: 0.3,
      socialNeeds: 0.2,
      sensoryNeeds: 0.2,
      behavioralNeeds: 0.15,
      cognitiveNeeds: 0.15,
    }

    return Object.entries(weights).reduce((sum, [factor, weight]) => {
      return sum + (supportFactors[factor] || 0.5) * weight
    }, 0)
  }

  determineSupportLevel(overallScore) {
    return AutismAssessmentHelpers.determineSupportLevel(overallScore)
  }

  recommendSpecificSupports(level, supportFactors) {
    const supports = []

    Object.entries(supportFactors).forEach(([area, score]) => {
      if (score > 0.6) {
        supports.push({
          area,
          intensity: level.level >= 3 ? 'intensive' : level.level >= 2 ? 'moderate' : 'minimal',
          frequency: level.frequency,
          specificStrategies: this.getAreaSpecificSupports(area),
        })
      }
    })

    return supports
  }

  getAreaSpecificSupports(area) {
    const supports = {
      communicationNeeds: ['AAC devices', 'visual supports', 'communication training'],
      socialNeeds: ['social skills training', 'peer mediation', 'social stories'],
      sensoryNeeds: ['sensory diet', 'environmental modifications', 'sensory tools'],
      behavioralNeeds: ['behavior intervention plan', 'replacement behaviors', 'reinforcement'],
      cognitiveNeeds: ['executive function training', 'cognitive supports', 'structured teaching'],
    }

    return supports[area] || ['individualized assessment']
  }

  calculateSupportIntensity(level, supportFactors) {
    const baseIntensity = level.level
    const avgFactorScore =
      Object.values(supportFactors).reduce((sum, val) => sum + val, 0) /
      Object.keys(supportFactors).length

    if (avgFactorScore > 0.8) return 'very high'
    if (avgFactorScore > 0.6) return 'high'
    if (avgFactorScore > 0.4) return 'moderate'
    return 'low'
  }

  calculateSupportFrequency(level, supportFactors) {
    const frequencies = {
      1: 'weekly',
      2: 'daily',
      3: 'continuous',
    }

    return frequencies[level.level] || 'as needed'
  }

  // Métodos auxiliares para avaliação de qualidade de dados
  assessDataQuality(sessionData) {
    const requiredFields = ['accuracy', 'responseTime', 'sessionDuration', 'attempts']
    const availableFields = requiredFields.filter((field) => sessionData[field] !== undefined)

    return availableFields.length / requiredFields.length
  }

  assessProfileCompleteness(userProfile) {
    const profileFields = ['age', 'diagnosis', 'communicationLevel', 'sensoryProfile']
    const availableFields = profileFields.filter((field) => userProfile[field] !== undefined)

    return availableFields.length / profileFields.length
  }

  calculateConsistencyScore(sessionData) {
    const responses = sessionData.responses || []
    if (responses.length < 3) return 0.5

    const times = responses.map((r) => r.responseTime).filter((t) => t !== undefined)
    if (times.length < 3) return 0.5

    const mean = times.reduce((sum, time) => sum + time, 0) / times.length
    const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length
    const cv = Math.sqrt(variance) / mean

    return Math.max(0, Math.min(1, 1 - cv))
  }

  assessValidationLevel(sessionData, userProfile) {
    let validationScore = 0

    if (sessionData.expertValidation) validationScore += 0.4
    if (sessionData.parentInput) validationScore += 0.3
    if (sessionData.multipleObservations) validationScore += 0.3

    return Math.min(1, validationScore)
  }

  identifyPredominantPattern(patterns) {
    // Implementação simplificada
    return 'sensory-seeking'
  }

  identifyInterventionTargets(patterns) {
    // Implementação simplificada
    return ['attention', 'communication', 'sensory regulation']
  }

  calculateInterventionTimeline(target) {
    const timelines = {
      attention: '4-6 weeks',
      communication: '8-12 weeks',
      'sensory regulation': '6-8 weeks',
    }

    return timelines[target] || '6-8 weeks'
  }

  createMeasurableGoals(target) {
    const goals = {
      attention: 'Maintain attention for 5 minutes during structured activities',
      communication: 'Use functional communication 80% of opportunities',
      'sensory regulation': 'Request sensory breaks independently',
    }

    return goals[target] || 'Individualized goal needed'
  }

  // Implementações dos métodos de recomendação que estavam faltando
  getHypersensitiveStrategies(domain) {
    return (
      AutismAssessmentHelpers.getHypersensitiveStrategies?.(domain) ||
      this.getDefaultHypersensitiveStrategies(domain)
    )
  }

  getHyposensitiveStrategies(domain) {
    return (
      AutismAssessmentHelpers.getHyposensitiveStrategies?.(domain) ||
      this.getDefaultHyposensitiveStrategies(domain)
    )
  }

  getDefaultHypersensitiveStrategies(domain) {
    const strategies = {
      visual: ['dimmed lighting', 'reduced visual clutter', 'high contrast materials'],
      auditory: ['noise reduction', 'headphones', 'quiet spaces'],
      tactile: ['soft textures', 'gradual exposure', 'protective clothing'],
    }
    return strategies[domain] || ['environmental modification']
  }

  getDefaultHyposensitiveStrategies(domain) {
    const strategies = {
      visual: ['bright lighting', 'colorful materials', 'visual stimulation'],
      auditory: ['music', 'sound tools', 'auditory cues'],
      tactile: ['varied textures', 'fidget tools', 'tactile exploration'],
    }
    return strategies[domain] || ['sensory enhancement']
  }

  recommendVisualSupports(level) {
    return (
      AutismAssessmentHelpers.recommendVisualSupports?.(level) ||
      this.getDefaultVisualSupports(level)
    )
  }

  getDefaultVisualSupports(level) {
    const supports = {
      0: ['picture cards', 'visual schedules'],
      1: ['word-picture combinations', 'visual instructions'],
      2: ['text with pictures', 'graphic organizers'],
      3: ['written instructions', 'checklists'],
      4: ['complex graphics', 'digital tools'],
    }
    return supports[level] || supports[0]
  }

  recommendAAC(level) {
    const aacDevices = {
      0: ['picture exchange system', 'communication boards'],
      1: ['simple voice output devices', 'single message devices'],
      2: ['speech generating devices', 'tablet apps'],
      3: ['advanced SGDs', 'text-to-speech'],
      4: ['sophisticated communication software'],
    }
    return aacDevices[level] || aacDevices[0]
  }

  recommendCommunicationEnvironment(level) {
    return [
      'reduce auditory distractions',
      'provide visual supports',
      'create structured interaction opportunities',
      'ensure communication partner training',
    ]
  }

  recommendCommunicationTeaching(level) {
    return [
      'natural environment teaching',
      'structured teaching approaches',
      'peer-mediated interventions',
      'video modeling',
    ]
  }

  recommendSocialSkillsSupport(level) {
    return ['social stories', 'role playing', 'peer buddy systems', 'social skills groups']
  }

  // Mais métodos de recomendação
  recommendStructuralSupports(executiveFunction) {
    const supports = []

    if (executiveFunction.organization < 0.5) {
      supports.push('visual organizers', 'color coding systems', 'labeled storage')
    }

    if (executiveFunction.planning < 0.5) {
      supports.push('task analysis', 'step-by-step guides', 'checklists')
    }

    return supports
  }

  recommendOrganizationalAids(executiveFunction) {
    return ['visual schedules', 'task lists', 'organization systems', 'environmental structure']
  }

  recommendMemorySupports(executiveFunction) {
    return ['visual reminders', 'memory aids', 'repetition strategies', 'chunking techniques']
  }

  recommendAttentionStrategies(executiveFunction) {
    return [
      'attention cues',
      'break schedules',
      'environmental modifications',
      'attention training',
    ]
  }

  recommendFlexibilitySupports(executiveFunction) {
    return [
      'transition warnings',
      'choice provision',
      'flexibility training',
      'problem-solving support',
    ]
  }

  generateVestibularStrategies(metrics, threshold) {
    if (threshold < 0.3) {
      return ['slow movements', 'stable surfaces', 'gradual exposure']
    } else if (threshold > 0.7) {
      return ['swinging', 'spinning', 'balance activities']
    }
    return ['varied movement opportunities', 'balance challenges']
  }

  generateGustatoryInterventions(preferences, sensitivities) {
    return [
      'gradual exposure',
      'preferred food incorporation',
      'texture modification',
      'flavor pairing',
    ]
  }

  generateOlfactoryAdaptations(sensitivities, preferences) {
    return [
      'scent-free environment',
      'gradual exposure protocol',
      'preferred scents incorporation',
      'sensory breaks',
    ]
  }

  recommendNonVerbalSupports(skills) {
    const supports = []

    if (skills.gestures < 0.5) {
      supports.push('gesture modeling', 'gesture training')
    }

    if (skills.eyeGaze < 0.5) {
      supports.push('eye gaze training', 'visual attention activities')
    }

    return supports
  }

  recommendPragmaticInterventions(skills) {
    return ['conversation training', 'social scripts', 'context teaching', 'narrative development']
  }

  // Métodos para otimização terapêutica que estavam faltando
  identifyTherapyFocusAreas(sessionData, userProfile, therapyGoals) {
    const focusAreas = []

    // Baseado no perfil do usuário
    if (userProfile.communicationLevel?.level <= 2) {
      focusAreas.push({
        area: 'communication',
        priority: 'high',
        currentLevel: userProfile.communicationLevel.level,
        targetLevel: userProfile.communicationLevel.level + 1,
      })
    }

    // Baseado nos dados da sessão
    if (sessionData.attention < 0.4) {
      focusAreas.push({
        area: 'attention',
        priority: 'high',
        currentLevel: sessionData.attention,
        targetLevel: 0.6,
      })
    }

    // Baseado nos objetivos terapêuticos
    Object.entries(therapyGoals).forEach(([goal, target]) => {
      focusAreas.push({
        area: goal,
        priority: 'medium',
        currentLevel: sessionData[goal] || 0.5,
        targetLevel: target,
      })
    })

    return focusAreas
  }

  optimizeActivitySettings(sessionData, userProfile) {
    return {
      difficulty: this.optimizeDifficulty(sessionData, userProfile),
      pacing: this.optimizePacing(sessionData, userProfile),
      feedback: this.optimizeFeedback(sessionData, userProfile),
      breaks: this.optimizeBreaks(sessionData, userProfile),
      reinforcement: this.optimizeReinforcement(sessionData, userProfile),
    }
  }

  optimizeDifficulty(sessionData, userProfile) {
    const currentAccuracy = sessionData.accuracy || 0.5

    if (currentAccuracy > 0.8) return 'increase'
    if (currentAccuracy < 0.4) return 'decrease'
    return 'maintain'
  }

  optimizePacing(sessionData, userProfile) {
    const averageResponseTime = sessionData.averageResponseTime || 3000

    if (averageResponseTime > 6000) return 'slower'
    if (averageResponseTime < 2000) return 'faster'
    return 'current'
  }

  optimizeFeedback(sessionData, userProfile) {
    const preferences = userProfile.feedbackPreferences || {}

    return {
      type: preferences.type || 'visual',
      frequency: preferences.frequency || 'immediate',
      intensity: preferences.intensity || 'moderate',
    }
  }

  optimizeBreaks(sessionData, userProfile) {
    const attentionSpan = sessionData.attentionSpan || 300000 // 5 minutos

    return {
      frequency: Math.max(300000, attentionSpan * 0.8), // 80% do span de atenção
      duration: 60000, // 1 minuto
      type: 'sensory',
    }
  }

  optimizeReinforcement(sessionData, userProfile) {
    const motivationLevel = sessionData.motivationLevel || 0.5

    return {
      schedule: motivationLevel < 0.5 ? 'continuous' : 'variable',
      type: userProfile.preferredReinforcement || 'social',
      intensity: motivationLevel < 0.3 ? 'high' : 'moderate',
    }
  }

  optimizeSensoryInput(sensoryProfile) {
    const optimizations = []

    Object.entries(sensoryProfile.sensoryDomains || {}).forEach(([domain, assessment]) => {
      if (assessment.threshold < 0.3 || assessment.threshold > 0.7) {
        optimizations.push({
          domain,
          currentThreshold: assessment.threshold,
          recommendedAdjustment: assessment.threshold < 0.3 ? 'reduce' : 'increase',
          strategies: assessment.adaptations || [],
        })
      }
    })

    return optimizations
  }

  optimizeCommunicationSupport(communicationLevel) {
    return {
      currentLevel: communicationLevel.level || 0,
      recommendedSupports: communicationLevel.supports || [],
      progressionPlan: this.createCommunicationProgressionPlan(communicationLevel),
      environmentalMods: this.getOptimalCommunicationEnvironment(communicationLevel),
    }
  }

  createCommunicationProgressionPlan(communicationLevel) {
    const level = communicationLevel.level || 0
    const nextLevel = Math.min(4, level + 1)

    return {
      currentLevel: level,
      targetLevel: nextLevel,
      timeline: '3-6 months',
      milestones: this.getCommunicationMilestones(level, nextLevel),
    }
  }

  getCommunicationMilestones(current, target) {
    const milestones = {
      '0-1': ['first words', 'picture recognition', 'simple requests'],
      '1-2': ['two-word phrases', 'basic questions', 'simple descriptions'],
      '2-3': ['complete sentences', 'past tense', 'story telling'],
      '3-4': ['complex grammar', 'abstract concepts', 'pragmatic skills'],
    }

    return milestones[`${current}-${target}`] || ['individualized milestones']
  }

  getOptimalCommunicationEnvironment(communicationLevel) {
    return [
      'minimize distractions',
      'maximize visual supports',
      'ensure communication partner training',
      'provide choice and control',
    ]
  }

  createInterventionPlan(focusAreas, supportLevel) {
    return {
      primaryGoals: focusAreas.filter((area) => area.priority === 'high'),
      secondaryGoals: focusAreas.filter((area) => area.priority === 'medium'),
      intensity: supportLevel.intensity || 'moderate',
      frequency: supportLevel.frequency || 'weekly',
      duration: '12 weeks initial',
      reviewPeriod: '4 weeks',
    }
  }

  calculateGoalMetrics(therapyGoals, progressAnalysis) {
    return Object.entries(therapyGoals).map(([goal, target]) => ({
      goal,
      target,
      current: progressAnalysis.current?.[goal] || 0.5,
      progress: this.calculateGoalProgress(goal, target, progressAnalysis),
      timeToTarget: this.estimateTimeToTarget(goal, target, progressAnalysis),
    }))
  }

  calculateGoalProgress(goal, target, progressAnalysis) {
    const current = progressAnalysis.current?.[goal] || 0.5
    const baseline = progressAnalysis.baseline?.[goal] || 0.3

    return (current - baseline) / (target - baseline)
  }

  estimateTimeToTarget(goal, target, progressAnalysis) {
    const progressRate = progressAnalysis.progressRate || 0.1
    const current = progressAnalysis.current?.[goal] || 0.5

    if (progressRate <= 0) return 'indefinite'

    const remainingProgress = target - current
    const weeksEstimate = remainingProgress / progressRate

    return `${Math.ceil(weeksEstimate)} weeks`
  }

  calculateOptimalFrequency(progressAnalysis, userProfile) {
    const progressRate = progressAnalysis.progressRate || 0.1
    const supportLevel = userProfile.supportLevel?.level || 2

    if (supportLevel >= 3) return 'daily'
    if (supportLevel >= 2) return '3-4 times per week'
    if (progressRate < 0.1) return 'daily'
    return '2-3 times per week'
  }

  generateGeneralizationStrategies(focusAreas, userProfile) {
    return [
      'multiple exemplar training',
      'varied setting practice',
      'multiple communication partners',
      'natural environment teaching',
      'peer mediation',
    ]
  }

  createMonitoringPlan(focusAreas, therapyGoals) {
    return {
      dataCollection: 'weekly progress monitoring',
      reviewSchedule: 'monthly team meetings',
      adjustmentCriteria: 'less than 10% progress in 4 weeks',
      successCriteria: 'achievement of 80% of goals',
      transitionPlanning: 'begin 4 weeks before goal achievement',
    }
  }

  calculateProgressTrends(history) {
    // Implementação simplificada de análise de tendências
    return {
      overall: 'improving',
      domains: {
        communication: 'stable',
        social: 'improving',
        sensory: 'stable',
      },
      rate: 0.15,
      plateaus: ['sensory regulation'],
      accelerating: ['communication', 'social skills'],
    }
  }

  generateProgressRecommendations(trends) {
    const recommendations = []

    trends.plateaus?.forEach((area) => {
      recommendations.push({
        area,
        type: 'strategy modification',
        reason: 'plateau detected',
        action: 'increase intensity or change approach',
      })
    })

    trends.accelerating?.forEach((area) => {
      recommendations.push({
        area,
        type: 'advancement',
        reason: 'rapid progress',
        action: 'consider increasing complexity',
      })
    })

    return recommendations
  }

  generateTeachingStrategies(autismCharacteristics, supportLevel) {
    const strategies = []

    // Baseado no nível de suporte
    if (supportLevel.level >= 3) {
      strategies.push('discrete trial training', 'intensive structured teaching')
    } else if (supportLevel.level >= 2) {
      strategies.push('structured teaching', 'visual supports')
    } else {
      strategies.push('natural environment teaching', 'peer-mediated instruction')
    }

    // Baseado nas características
    if (autismCharacteristics.restrictedInterests?.restrictionLevel > 0.6) {
      strategies.push('incorporate special interests', 'interest-based teaching')
    }

    if (autismCharacteristics.sensoryDifferences?.impactLevel > 0.6) {
      strategies.push('sensory accommodations', 'sensory diet integration')
    }

    return strategies
  }

  generateEnvironmentalAdaptations(autismCharacteristics) {
    const adaptations = []

    // Adaptações sensoriais
    if (autismCharacteristics.sensoryDifferences?.impactLevel > 0.5) {
      adaptations.push('sensory-friendly lighting', 'noise reduction', 'calm-down space')
    }

    // Adaptações estruturais
    if (autismCharacteristics.restrictedInterests?.restrictionLevel > 0.5) {
      adaptations.push('predictable routines', 'clear boundaries', 'transition warnings')
    }

    // Adaptações de comunicação
    if (autismCharacteristics.socialCommunication?.level === 'significant') {
      adaptations.push(
        'visual communication aids',
        'reduced social demands',
        'communication supports'
      )
    }

    return adaptations
  }

  generateImmediateRecommendations(sessionData, supportLevel) {
    const recommendations = []

    // Baseado no desempenho da sessão
    if (sessionData.accuracy < 0.4) {
      recommendations.push({
        type: 'immediate',
        action: 'reduce difficulty',
        rationale: 'low accuracy indicates frustration',
      })
    }

    if (sessionData.attentionSpan < 180000) {
      // menos de 3 minutos
      recommendations.push({
        type: 'immediate',
        action: 'provide break',
        rationale: 'short attention span detected',
      })
    }

    // Baseado no nível de suporte
    if (supportLevel.level >= 3) {
      recommendations.push({
        type: 'immediate',
        action: 'increase support intensity',
        rationale: 'high support needs identified',
      })
    }

    return recommendations
  }

  generateNextSteps(autismCharacteristics, supportLevel) {
    const steps = []

    steps.push({
      timeline: 'immediate (next session)',
      action: 'implement immediate recommendations',
      responsibility: 'therapist',
    })

    steps.push({
      timeline: '1-2 weeks',
      action: 'develop comprehensive intervention plan',
      responsibility: 'team',
    })

    steps.push({
      timeline: '1 month',
      action: 'review progress and adjust strategies',
      responsibility: 'team',
    })

    steps.push({
      timeline: '3 months',
      action: 'comprehensive reassessment',
      responsibility: 'assessment team',
    })

    return steps
  }

  // Métodos para criação de perfis especializados que estavam faltando
  identifyHighInputPreferences(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold > 0.7)
      .map(([name]) => name)
  }

  identifyLowInputPreferences(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold < 0.3)
      .map(([name]) => name)
  }

  identifyVariableInputPreferences(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold >= 0.3 && domain.threshold <= 0.7)
      .map(([name]) => name)
  }

  generateRegulationStrategies(sensoryAssessment) {
    return [
      'sensory breaks',
      'self-regulation tools',
      'environmental modifications',
      'sensory diet activities',
    ]
  }

  generateEnvironmentalModifications(sensoryAssessment) {
    return [
      'lighting adjustments',
      'noise control',
      'texture modifications',
      'spatial organization',
    ]
  }

  generateSensoryTherapyGoals(sensoryAssessment) {
    return [
      'improve sensory tolerance',
      'develop self-regulation skills',
      'increase sensory awareness',
      'enhance adaptive responses',
    ]
  }
  createSensoryMonitoringPlan(sensoryAssessment) {
    return {
      frequency: 'weekly',
      measures: ['tolerance levels', 'self-regulation frequency', 'environmental needs'],
      reviewPeriod: 'monthly',
      adjustmentCriteria: 'significant changes in sensory responses',
    }
  }
}

// Instância singleton
const autismCognitiveAnalyzer = new AutismCognitiveAnalyzer()

export default autismCognitiveAnalyzer
export { AutismCognitiveAnalyzer }
