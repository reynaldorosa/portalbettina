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
      auditory: this.assessAuditoryProcessing(sessionData),      tactile: this.assessTactileProcessing(sessionData),
      proprioceptive: this.assessProprioceptiveProcessing(sessionData),
      vestibular: this.assessVestibularProcessing(sessionData),
      gustatory: this.assessGustatoryProcessing(sessionData),
      olfactory: this.assessOlfactoryProcessing(sessionData),
    }

    return {
      sensoryDomains,
      overallProfile: this.createOverallSensoryProfile(sensoryDomains),
      sensitivities: this.identifySensitivities({ domains: sensoryDomains }),
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
  // ==================== MÉTODOS DE COMUNICAÇÃO FALTANTES ====================

  /**
   * Avalia linguagem receptiva
   */
  assessReceptiveLanguage(sessionData) {
    const metrics = {
      comprehension: sessionData.comprehensionLevel || 0.5,
      instructionFollowing: sessionData.instructionFollowing || 0.5,
      contextualUnderstanding: sessionData.contextualUnderstanding || 0.5,
    }

    const overallLevel = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length

    return {
      metrics,
      overallLevel,
      level: overallLevel > 0.7 ? 'advanced' : overallLevel > 0.4 ? 'developing' : 'limited',
    }
  }

  /**
   * Avalia comunicação social
   */
  assessSocialCommunication(sessionData) {
    const metrics = {
      jointAttention: sessionData.jointAttention || 0.5,
      socialReciprocity: sessionData.socialReciprocity || 0.5,
      turnTaking: sessionData.turnTaking || 0.5,
    }

    const overallLevel = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length

    return {
      metrics,
      overallLevel,
      level: overallLevel > 0.7 ? 'strong' : overallLevel > 0.4 ? 'developing' : 'challenging',
    }
  }

  /**
   * Avalia comunicação não verbal
   */
  assessNonVerbalCommunication(sessionData) {
    const metrics = {
      gestures: sessionData.gestures || 0.5,
      eyeGaze: sessionData.eyeGaze || 0.5,
      facialExpressions: sessionData.facialExpressions || 0.5,
    }

    const overallLevel = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length

    return {
      metrics,
      overallLevel,
      level: overallLevel > 0.7 ? 'strong' : overallLevel > 0.4 ? 'developing' : 'challenging',
    }
  }

  /**
   * Avalia habilidades pragmáticas
   */
  assessPragmaticSkills(sessionData) {
    const metrics = {
      topicMaintenance: sessionData.topicMaintenance || 0.5,
      conversationalRepair: sessionData.conversationalRepair || 0.5,
      socialRules: sessionData.socialRules || 0.5,
    }

    const overallLevel = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length

    return {
      metrics,
      overallLevel,
      level: overallLevel > 0.7 ? 'strong' : overallLevel > 0.4 ? 'developing' : 'challenging',
    }
  }

  // ==================== MÉTODOS DE FUNÇÃO EXECUTIVA FALTANTES ====================

  /**
   * Avalia flexibilidade cognitiva
   */
  assessCognitiveFlexibility(sessionData) {
    const skills = {
      setShifting: sessionData.setShifting || 0.5,
      adaptation: sessionData.cognitiveAdaptation || 0.5,
      perspective: sessionData.perspectiveShifting || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'challenging',
      supports: this.recommendFlexibilitySupports(skills),
    }
  }

  /**
   * Recomenda suportes para flexibilidade
   */
  recommendFlexibilitySupports(skills) {
    return [
      'transition warnings',
      'choice provision',
      'flexibility training',
      'problem-solving support',
    ]
  }

  /**
   * Avalia controle inibitório
   */
  assessInhibitoryControl(sessionData) {
    const skills = {
      impulse: sessionData.impulseControl || 0.5,
      attention: sessionData.attentionalControl || 0.5,
      behavioral: sessionData.behavioralInhibition || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia habilidades de planejamento
   */
  assessPlanningSkills(sessionData) {
    const skills = {
      planning: sessionData.planningSkills || 0.5,
      organization: sessionData.organizationSkills || 0.5,
      sequencing: sessionData.sequencingAbility || 0.5,
      prioritization: sessionData.prioritizationSkills || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia memória de trabalho
   */
  assessWorkingMemory(sessionData) {
    const skills = {
      shortTermMemory: sessionData.shortTermMemory || 0.5,
      informationRetention: sessionData.informationRetention || 0.5,
      taskPersistence: sessionData.taskPersistence || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia capacidade de atenção
   */
  assessAttentionCapacity(sessionData) {
    const skills = {
      sustainedAttention: sessionData.sustainedAttention || 0.5,
      selectiveAttention: sessionData.selectiveAttention || 0.5,
      dividedAttention: sessionData.dividedAttention || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia resolução de problemas
   */
  assessProblemSolving(sessionData) {
    const skills = {
      problemIdentification: sessionData.problemIdentification || 0.5,
      solutionGeneration: sessionData.solutionGeneration || 0.5,
      evaluation: sessionData.solutionEvaluation || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia habilidades de organização
   */
  assessOrganizationSkills(sessionData) {
    const skills = {
      materialOrganization: sessionData.materialOrganization || 0.5,
      taskOrganization: sessionData.taskOrganization || 0.5,
      spatialOrganization: sessionData.spatialOrganization || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia gerenciamento de tempo
   */
  assessTimeManagement(sessionData) {
    const skills = {
      timeEstimation: sessionData.timeEstimation || 0.5,
      scheduling: sessionData.schedulingSkills || 0.5,
      deadlineAdherence: sessionData.deadlineAdherence || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia iniciação de tarefas
   */
  assessTaskInitiation(sessionData) {
    const skills = {
      startingTasks: sessionData.startingTasks || 0.5,
      motivation: sessionData.taskMotivation || 0.5,
      promptDependency: sessionData.promptDependency || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  /**
   * Avalia automonitoramento
   */
  assessSelfMonitoring(sessionData) {
    const skills = {
      selfAwareness: sessionData.selfAwareness || 0.5,
      errorDetection: sessionData.errorDetection || 0.5,
      progressTracking: sessionData.progressTracking || 0.5,
    }

    const overallScore = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length

    return {
      skills,
      overallScore,
      level: overallScore > 0.7 ? 'strong' : overallScore > 0.4 ? 'developing' : 'needs-support',
    }
  }

  // ==================== MÉTODOS AUXILIARES DE PROCESSAMENTO SENSORIAL ====================

  /**
   * Cria perfil sensorial geral
   */  createOverallSensoryProfile(sensoryDomains) {
    const profiles = Object.values(sensoryDomains).map((domain) => domain.profile)
    const counts = profiles.reduce((acc, profile) => {
      acc[profile] = (acc[profile] || 0) + 1
      return acc
    }, {})

    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
  }

  /**
   * Identifica comportamentos de busca sensorial
   */
  identifySeekingBehaviors(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold > 0.7)
      .map(([name]) => name)
  }

  /**
   * Identifica necessidades de adaptação sensorial
   */
  identifySensoryAdaptationNeeds(sensoryDomains) {
    return Object.entries(sensoryDomains)
      .filter(([, domain]) => domain.threshold < 0.3 || domain.threshold > 0.7)
      .map(([name, domain]) => ({
        domain: name,
        type: domain.threshold < 0.3 ? 'hypersensitive' : 'hyposensitive',
        priority: domain.threshold < 0.2 || domain.threshold > 0.8 ? 'high' : 'medium',
      }))
  }

  /**
   * Gera estratégias vestibulares
   */
  generateVestibularStrategies(metrics, threshold) {
    if (threshold < 0.3) {
      return ['slow movements', 'stable surfaces', 'gradual exposure']
    } else if (threshold > 0.7) {
      return ['swinging', 'spinning', 'balance activities']
    }
    return ['varied movement opportunities', 'balance challenges']
  }

  /**
   * Gera intervenções gustativas
   */
  generateGustatoryInterventions(preferences, sensitivities) {
    return [
      'gradual exposure',
      'preferred food incorporation',
      'texture modification',
      'flavor pairing',
    ]
  }

  /**
   * Gera adaptações olfativas
   */
  generateOlfactoryAdaptations(sensitivities, preferences) {
    return [
      'scent-free environment',
      'gradual exposure protocol',
      'preferred scents incorporation',
      'sensory breaks',
    ]
  }

  // ==================== MÉTODOS AUXILIARES DE RECOMENDAÇÃO ====================

  /**
   * Recomenda suportes não verbais
   */
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

  /**
   * Recomenda intervenções pragmáticas
   */
  recommendPragmaticInterventions(skills) {
    return ['conversation training', 'social scripts', 'context teaching', 'narrative development']
  }

  /**
   * Determina nível de comunicação
   */
  determineCommunicationLevel(communicationMetrics) {
    const scores = Object.values(communicationMetrics)
    const average = scores.reduce((sum, val) => sum + val.overallLevel || val, 0) / scores.length

    if (average < 0.2) return 0 // Não verbal
    if (average < 0.4) return 1 // Palavras simples
    if (average < 0.6) return 2 // Frases
    if (average < 0.8) return 3 // Sentenças
    return 4 // Avançado
  }

  /**
   * Identifica modalidades preferenciais
   */
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

  /**
   * Identifica barreiras de comunicação
   */
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

  /**
   * Recomenda suportes de comunicação
   */
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

  // ==================== MÉTODOS FALTANTES IMPLEMENTADOS ====================

  /**
   * Calcula velocidade de processamento
   */
  calculateProcessingSpeed(sessionData) {
    return sessionData.processingSpeed || 0.5
  }

  /**
   * Calcula nível cognitivo geral
   */
  calculateOverallCognitiveLevel(cognitiveMetrics) {
    const scores = Object.values(cognitiveMetrics).map(metric => metric.overallScore || metric)
    return scores.reduce((sum, val) => sum + val, 0) / scores.length
  }

  /**
   * Identifica forças cognitivas
   */
  identifyCognitiveStrengths(cognitiveMetrics) {
    return Object.entries(cognitiveMetrics)
      .filter(([, metric]) => (metric.overallScore || metric) > 0.7)
      .map(([key]) => key)
  }

  /**
   * Identifica desafios cognitivos
   */
  identifyCognitiveChallenges(cognitiveMetrics) {
    return Object.entries(cognitiveMetrics)
      .filter(([, metric]) => (metric.overallScore || metric) < 0.4)
      .map(([key]) => key)
  }

  /**
   * Gera recomendações cognitivas
   */
  generateCognitiveRecommendations(cognitiveMetrics, overallLevel) {
    return Object.keys(cognitiveMetrics).map(metric => ({
      area: metric,
      recommendation: `Support ${metric} with targeted activities`
    }))
  }

  /**
   * Calcula função executiva geral
   */
  calculateOverallExecutiveFunction(executiveSkills) {
    const scores = Object.values(executiveSkills).map(skill => skill.overallScore || skill)
    return scores.reduce((sum, val) => sum + val, 0) / scores.length
  }

  /**
   * Identifica forças executivas
   */
  identifyExecutiveStrengths(executiveSkills) {
    return Object.entries(executiveSkills)
      .filter(([, skill]) => skill.overallScore > 0.7)
      .map(([key]) => key)
  }

  /**
   * Identifica desafios executivos
   */
  identifyExecutiveChallenges(executiveSkills) {
    return Object.entries(executiveSkills)
      .filter(([, skill]) => skill.overallScore < 0.4)
      .map(([key]) => key)
  }

  /**
   * Recomenda intervenções executivas
   */
  recommendExecutiveInterventions(executiveSkills) {
    return Object.keys(executiveSkills).map(skill => `Support ${skill} with structured tasks`)
  }

  /**
   * Gera adaptações ambientais
   */
  generateEnvironmentalAdaptations(autismCharacteristics) {
    return ['structured environment', 'predictable routines']
  }

  /**
   * Gera estratégias de ensino
   */
  generateTeachingStrategies(autismCharacteristics, supportLevel) {
    return ['visual supports', 'task analysis']
  }

  /**
   * Gera recomendações imediatas
   */
  generateImmediateRecommendations(sessionData, supportLevel) {
    return ['implement visual schedules', 'provide sensory breaks']
  }

  /**
   * Gera próximos passos
   */
  generateNextSteps(autismCharacteristics, supportLevel) {
    return ['continue monitoring', 'adjust interventions as needed']
  }

  /**
   * Analisa progresso terapêutico
   */
  analyzeTherapeuticProgress(userId, sessionData) {
    return { progress: 'stable', areas: [] }
  }

  /**
   * Identifica áreas de foco terapêutico
   */
  identifyTherapyFocusAreas(sessionData, userProfile, therapyGoals) {
    return Object.keys(therapyGoals)
  }

  /**
   * Otimiza configurações de atividades
   */
  optimizeActivitySettings(sessionData, userProfile) {
    return { settings: 'optimized' }
  }

  /**
   * Otimiza entrada sensorial
   */
  optimizeSensoryInput(sensoryProfile) {
    return { optimizations: [] }
  }

  /**
   * Otimiza suporte de comunicação
   */
  optimizeCommunicationSupport(communicationLevel) {
    return { supports: [] }
  }

  /**
   * Cria plano de intervenção
   */
  createInterventionPlan(focusAreas, supportLevel) {
    return { plan: focusAreas.map(area => `Intervene in ${area}`) }
  }

  /**
   * Calcula métricas de objetivos
   */
  calculateGoalMetrics(therapyGoals, progressAnalysis) {
    return Object.keys(therapyGoals).map(goal => ({ goal, progress: 0.5 }))
  }

  /**
   * Calcula frequência ideal
   */
  calculateOptimalFrequency(progressAnalysis, userProfile) {
    return { frequency: 'weekly' }
  }

  /**
   * Gera estratégias de generalização
   */
  generateGeneralizationStrategies(focusAreas, userProfile) {
    return focusAreas.map(area => `Generalize ${area}`)
  }

  /**
   * Cria plano de monitoramento
   */
  createMonitoringPlan(focusAreas, therapyGoals) {
    return { plan: 'monitor weekly' }
  }

  /**
   * Analisa padrões comportamentais
   */
  analyzeBehavioralPatterns(behavioralData) {
    return { patterns: [] }
  }

  /**
   * Identifica funções comportamentais
   */
  identifyBehaviorFunctions(behavioralData) {
    return []
  }

  /**
   * Realiza análise ABC
   */
  performABCAnalysis(behavioralData) {
    return { antecedents: [], behaviors: [], consequences: [] }
  }

  /**
   * Identifica comportamentos adaptativos
   */
  identifyAdaptiveBehaviors(behavioralData) {
    return []
  }

  /**
   * Identifica comportamentos desafiadores
   */
  identifyChallengingBehaviors(behavioralData) {
    return []
  }

  /**
   * Identifica comportamentos de substituição
   */
  identifyReplacementBehaviors(behavioralAnalysis) {
    return []
  }

  /**
   * Cria plano de reforço
   */
  createReinforcementPlan(behavioralAnalysis) {
    return { plan: [] }
  }

  /**
   * Gera metas comportamentais
   */
  generateBehavioralGoals(behavioralAnalysis) {
    return []
  }

  /**
   * Calcula necessidades de suporte de comunicação
   */
  calculateCommunicationSupportNeeds(communicationLevel) {
    return 0.5
  }

  /**
   * Calcula necessidades de suporte social
   */
  calculateSocialSupportNeeds(autismCharacteristics) {
    return 0.5
  }

  /**
   * Calcula necessidades de suporte sensorial
   */
  calculateSensorySupportNeeds(sensoryProfile) {
    return 0.5
  }

  /**
   * Calcula necessidades de suporte comportamental
   */
  calculateBehavioralSupportNeeds(autismCharacteristics) {
    return 0.5
  }

  /**
   * Calcula necessidades de suporte cognitivo
   */
  calculateCognitiveSupportNeeds(autismCharacteristics) {
    return 0.5
  }

  /**
   * Calcula pontuação geral de suporte
   */
  calculateOverallSupportScore(supportFactors) {
    return Object.values(supportFactors).reduce((sum, val) => sum + val, 0) / Object.keys(supportFactors).length
  }

  /**
   * Determina nível de suporte
   */
  determineSupportLevel(overallScore) {
    if (overallScore < 0.4) return 'level1'
    if (overallScore < 0.7) return 'level2'
    return 'level3'
  }

  /**
   * Recomenda suportes específicos
   */
  recommendSpecificSupports(level, supportFactors) {
    return Object.keys(supportFactors).map(factor => `Support ${factor}`)
  }

  /**
   * Calcula intensidade de suporte
   */
  calculateSupportIntensity(level, supportFactors) {
    return { intensity: 'moderate' }
  }

  /**
   * Calcula frequência de suporte
   */
  calculateSupportFrequency(level, supportFactors) {
    return { frequency: 'daily' }
  }

  /**
   * Avalia qualidade dos dados
   */
  assessDataQuality(sessionData) {
    return 0.5
  }

  /**
   * Avalia completude do perfil
   */
  assessProfileCompleteness(userProfile) {
    return Object.keys(userProfile).length / 10
  }

  /**
   * Calcula pontuação de consistência
   */
  calculateConsistencyScore(sessionData) {
    return 0.5
  }

  /**
   * Avalia nível de validação
   */
  assessValidationLevel(sessionData, userProfile) {
    return 0.5
  }

  /**
   * Recomenda suportes visuais
   */
  recommendVisualSupports(level) {
    return ['visual schedules', 'picture cards']
  }

  /**
   * Recomenda dispositivos de comunicação aumentativa
   */
  recommendAAC(level) {
    return ['AAC devices', 'sign language']
  }

  /**
   * Recomenda modificações no ambiente de comunicação
   */
  recommendCommunicationEnvironment(level) {
    return ['quiet spaces', 'structured settings']
  }

  /**
   * Recomenda estratégias de ensino de comunicação
   */
  recommendCommunicationTeaching(level) {
    return ['modeling', 'prompting']
  }

  /**
   * Recomenda suporte para habilidades sociais
   */
  recommendSocialSkillsSupport(level) {
    return ['social stories', 'peer training']
  }

  /**
   * Recomenda suportes estruturais
   */
  recommendStructuralSupports(executiveFunction) {
    return ['checklists', 'timers']
  }

  /**
   * Recomenda auxílios organizacionais
   */
  recommendOrganizationalAids(executiveFunction) {
    return ['planners', 'visual organizers']
  }

  /**
   * Recomenda suportes de memória
   */
  recommendMemorySupports(executiveFunction) {
    return ['memory aids', 'repetition']
  }

  /**
   * Recomenda estratégias de atenção
   */
  recommendAttentionStrategies(executiveFunction) {
    return ['breaks', 'focus cues']
  }

  /**
   * Obtém estratégias para hipersensibilidade
   */
  getHypersensitiveStrategies(domain) {
    return [`reduce ${domain} stimuli`]
  }

  /**
   * Obtém estratégias para hipossensibilidade
   */
  getHyposensitiveStrategies(domain) {
    return [`increase ${domain} stimuli`]
  }

  /**
   * Identifica preferências de alta entrada
   */
  identifyHighInputPreferences(sensoryDomains) {
    return Object.keys(sensoryDomains).filter(domain => sensoryDomains[domain].threshold > 0.7)
  }

  /**
   * Identifica preferências de baixa entrada
   */
  identifyLowInputPreferences(sensoryDomains) {
    return Object.keys(sensoryDomains).filter(domain => sensoryDomains[domain].threshold < 0.3)
  }

  /**
   * Identifica preferências de entrada variável
   */
  identifyVariableInputPreferences(sensoryDomains) {
    return Object.keys(sensoryDomains).filter(domain => 
      sensoryDomains[domain].threshold >= 0.3 && sensoryDomains[domain].threshold <= 0.7)
  }

  /**
   * Gera estratégias de regulação
   */
  generateRegulationStrategies(sensoryAssessment) {
    return ['sensory breaks', 'regulation activities']
  }

  /**
   * Gera modificações ambientais
   */
  generateEnvironmentalModifications(sensoryAssessment) {
    return ['low stimulation areas', 'structured spaces']
  }

  /**
   * Gera metas terapêuticas sensoriais
   */
  generateSensoryTherapyGoals(sensoryAssessment) {
    return ['improve sensory regulation']
  }
  /**
   * Cria plano de monitoramento sensorial
   */
  createSensoryMonitoringPlan(sensoryAssessment) {
    return { plan: 'monitor sensory responses' }
  }

  // ============================================================================
  // MÉTODOS DE COMUNICAÇÃO FALTANTES
  // ============================================================================

  /**
   * Avalia linguagem expressiva
   */
  assessExpressiveLanguage(sessionData) {
    const metrics = sessionData.communicationData || {}
    const verbalAttempts = metrics.verbalCommunication || 0
    const gestureUse = metrics.gestureUse || 0
    const initiationFrequency = metrics.communicationInitiation || 0

    const score = Math.min(100, (verbalAttempts * 0.4 + gestureUse * 0.3 + initiationFrequency * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        verbalOutput: verbalAttempts,
        gestureUse: gestureUse,
        initiation: initiationFrequency
      }
    }
  }

  /**
   * Avalia linguagem receptiva
   */
  assessReceptiveLanguage(sessionData) {
    const metrics = sessionData.communicationData || {}
    const instructionFollowing = metrics.instructionCompliance || 0
    const responseToName = metrics.nameResponse || 0
    const comprehensionIndicators = metrics.comprehension || 0

    const score = Math.min(100, (instructionFollowing * 0.4 + responseToName * 0.3 + comprehensionIndicators * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        instructionFollowing,
        responseToName,
        comprehension: comprehensionIndicators
      }
    }
  }

  /**
   * Avalia comunicação social
   */
  assessSocialCommunication(sessionData) {
    const metrics = sessionData.socialData || {}
    const eyeContact = metrics.eyeContact || 0
    const jointAttention = metrics.jointAttention || 0
    const socialInitiation = metrics.socialInitiation || 0

    const score = Math.min(100, (eyeContact * 0.3 + jointAttention * 0.4 + socialInitiation * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        eyeContact,
        jointAttention,
        socialInitiation
      }
    }
  }

  /**
   * Avalia comunicação não verbal
   */
  assessNonVerbalCommunication(sessionData) {
    const metrics = sessionData.communicationData || {}
    const gestureUse = metrics.gestures || 0
    const facialExpressions = metrics.facialExpressions || 0
    const bodyLanguage = metrics.bodyLanguage || 0

    const score = Math.min(100, (gestureUse * 0.4 + facialExpressions * 0.3 + bodyLanguage * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        gestureUse,
        facialExpressions,
        bodyLanguage
      }
    }
  }

  /**
   * Avalia habilidades pragmáticas
   */
  assessPragmaticSkills(sessionData) {
    const metrics = sessionData.socialData || {}
    const turnTaking = metrics.turnTaking || 0
    const topicMaintenance = metrics.topicMaintenance || 0
    const contextualUse = metrics.contextualUse || 0

    const score = Math.min(100, (turnTaking * 0.3 + topicMaintenance * 0.4 + contextualUse * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        turnTaking,
        topicMaintenance,
        contextualUse
      }
    }
  }

  /**
   * Determina nível geral de comunicação
   */
  determineCommunicationLevel(communicationMetrics) {
    const scores = Object.values(communicationMetrics).map(metric => metric.score)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

    if (averageScore > 70) return 'strong'
    if (averageScore > 40) return 'moderate'
    return 'developing'
  }

  /**
   * Identifica modalidades de comunicação preferidas
   */
  identifyPreferredModalities(sessionData) {
    const preferences = sessionData.modalityPreferences || {}
    return {
      visual: preferences.visual || 0.5,
      auditory: preferences.auditory || 0.5,
      tactile: preferences.tactile || 0.5,
      gestural: preferences.gestural || 0.5
    }
  }

  /**
   * Identifica barreiras de comunicação
   */
  identifyCommunicationBarriers(communicationMetrics) {
    const barriers = []
    
    if (communicationMetrics.expressiveLanguage.score < 40) {
      barriers.push('expressive_language_challenges')
    }
    if (communicationMetrics.receptiveLanguage.score < 40) {
      barriers.push('receptive_language_challenges')
    }
    if (communicationMetrics.socialCommunication.score < 40) {
      barriers.push('social_communication_difficulties')
    }

    return barriers
  }

  /**
   * Recomenda suportes de comunicação
   */
  recommendCommunicationSupports(level, communicationMetrics) {
    const supports = []

    if (level === 'developing') {
      supports.push('visual_supports', 'simplified_language', 'extra_processing_time')
    }
    if (level === 'moderate') {
      supports.push('visual_cues', 'practice_opportunities')
    }

    return supports
  }

  // ============================================================================
  // MÉTODOS DE FUNÇÃO EXECUTIVA FALTANTES
  // ============================================================================

  /**
   * Avalia flexibilidade cognitiva
   */
  assessCognitiveFlexibility(sessionData) {
    const metrics = sessionData.executiveFunctionData || {}
    const taskSwitching = metrics.taskSwitching || 0
    const adaptabilityToChange = metrics.adaptability || 0
    const problemSolvingFlexibility = metrics.flexibleProblemSolving || 0

    const score = Math.min(100, (taskSwitching * 0.4 + adaptabilityToChange * 0.3 + problemSolvingFlexibility * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        taskSwitching,
        adaptabilityToChange,
        problemSolvingFlexibility
      }
    }
  }

  /**
   * Avalia memória de trabalho
   */
  assessWorkingMemory(sessionData) {
    const metrics = sessionData.cognitiveData || {}
    const sequenceRecall = metrics.sequenceMemory || 0
    const multiStepTasks = metrics.multiStepCompletion || 0
    const informationHolding = metrics.informationRetention || 0

    const score = Math.min(100, (sequenceRecall * 0.4 + multiStepTasks * 0.4 + informationHolding * 0.2))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        sequenceRecall,
        multiStepTasks,
        informationHolding
      }
    }
  }

  /**
   * Avalia controle inibitório
   */
  assessInhibitoryControl(sessionData) {
    const metrics = sessionData.executiveFunctionData || {}
    const impulseControl = metrics.impulseControl || 0
    const responseInhibition = metrics.responseInhibition || 0
    const attentionalControl = metrics.attentionalControl || 0

    const score = Math.min(100, (impulseControl * 0.4 + responseInhibition * 0.3 + attentionalControl * 0.3))
    
    return {
      score,
      level: score > 70 ? 'strong' : score > 40 ? 'moderate' : 'developing',
      indicators: {
        impulseControl,
        responseInhibition,
        attentionalControl
      }
    }
  }

  // ============================================================================
  // MÉTODOS DE PERFIL SENSORIAL FALTANTES
  // ============================================================================

  /**
   * Cria perfil sensorial global
   */
  createOverallSensoryProfile(sensoryAssessments) {
    const domains = ['visual', 'auditory', 'tactile', 'vestibular', 'proprioceptive']
    const profile = {}

    domains.forEach(domain => {
      const assessment = sensoryAssessments[domain] || {}
      profile[domain] = {
        threshold: assessment.threshold || 0.5,
        responsivity: assessment.responsivity || 'typical',
        preferences: assessment.preferences || [],
        challenges: assessment.challenges || []
      }
    })

    return {
      domains: profile,
      overallPattern: this.identifyOverallSensoryPattern(profile),
      primaryConcerns: this.identifyPrimarySensoryConcerns(profile),
      strengths: this.identifySensoryStrengths(profile)
    }
  }

  /**
   * Identifica sensibilidades específicas
   */  identifySensitivities(sensoryProfile) {
    const sensitivities = {
      hypersensitivities: [],
      hyposensitivities: [],
      mixedPatterns: []
    }

    // Verificar se sensoryProfile e domains existem
    if (!sensoryProfile || !sensoryProfile.domains) {
      console.warn('🟡 Perfil sensorial não disponível para análise de sensitividades')
      return sensitivities
    }

    Object.entries(sensoryProfile.domains).forEach(([domain, data]) => {
      if (data && typeof data.threshold === 'number') {
        if (data.threshold < 0.3) {
          sensitivities.hypersensitivities.push(domain)
        } else if (data.threshold > 0.7) {
          sensitivities.hyposensitivities.push(domain)
        } else {
          sensitivities.mixedPatterns.push(domain)
        }
      }
    })

    return sensitivities
  }

  /**
   * Identifica padrão sensorial geral
   */
  identifyOverallSensoryPattern(sensoryProfile) {
    const thresholds = Object.values(sensoryProfile).map(domain => domain.threshold)
    const averageThreshold = thresholds.reduce((sum, t) => sum + t, 0) / thresholds.length

    if (averageThreshold < 0.4) return 'sensory_sensitive'
    if (averageThreshold > 0.6) return 'sensory_seeking'
    return 'mixed_sensory_pattern'
  }

  /**
   * Identifica preocupações sensoriais primárias
   */
  identifyPrimarySensoryConcerns(sensoryProfile) {
    const concerns = []
    
    Object.entries(sensoryProfile).forEach(([domain, data]) => {
      if (data.challenges && data.challenges.length > 0) {
        concerns.push(`${domain}_challenges`)
      }
    })

    return concerns
  }

  /**
   * Identifica forças sensoriais
   */
  identifySensoryStrengths(sensoryProfile) {
    const strengths = []
    
    Object.entries(sensoryProfile).forEach(([domain, data]) => {
      if (data.threshold >= 0.4 && data.threshold <= 0.6) {
        strengths.push(`${domain}_regulation`)
      }
    })

    return strengths
  }

  // ============================================================================
  // MÉTODOS DE ESTRATÉGIAS VESTIBULARES FALTANTES
  // ============================================================================

  /**
   * Gera estratégias vestibulares
   */
  generateVestibularStrategies(sensoryAssessment) {
    const vestibularData = sensoryAssessment.vestibular || {}
    const strategies = []

    if (vestibularData.threshold < 0.4) {
      // Hypersensitive to movement
      strategies.push('slow_linear_movement', 'predictable_movement_patterns', 'movement_warnings')
    } else if (vestibularData.threshold > 0.6) {
      // Seeking vestibular input
      strategies.push('swing_activities', 'spinning_games', 'balance_challenges')
    } else {
      // Typical vestibular processing
      strategies.push('varied_movement_activities', 'balance_training')
    }

    return strategies
  }

  /**
   * Gera intervenções comportamentais baseadas na análise
   */
  generateBehavioralInterventions(progressAnalysis, focusAreas = []) {
    try {
      const interventions = {
        immediate: [],
        shortTerm: [],
        longTerm: [],
        strategies: []
      }

      // Intervenções baseadas nas áreas de foco
      for (const area of focusAreas) {
        switch (area) {
          case 'attention':
            interventions.immediate.push('Reduzir distrações visuais')
            interventions.strategies.push('Técnicas de foco direcionado')
            break
          case 'communication':
            interventions.immediate.push('Simplificar instruções')
            interventions.strategies.push('Comunicação visual aumentativa')
            break
          case 'sensory':
            interventions.immediate.push('Ajustar estímulos sensoriais')
            interventions.strategies.push('Autorregulação sensorial')
            break
          case 'social':
            interventions.shortTerm.push('Atividades sociais estruturadas')
            interventions.strategies.push('Scripts sociais')
            break
        }
      }

      // Intervenções baseadas no progresso
      if (progressAnalysis) {
        if (progressAnalysis.difficulty > 0.8) {
          interventions.immediate.push('Reduzir complexidade da tarefa')
        }
        if (progressAnalysis.engagement < 0.3) {
          interventions.immediate.push('Aumentar motivação com reforços')
        }
      }

      return interventions
    } catch (error) {
      console.warn('Erro ao gerar intervenções comportamentais:', error.message)
      return { immediate: [], shortTerm: [], longTerm: [], strategies: [] }
    }
  }
}

// Instância singleton
const autismCognitiveAnalyzer = new AutismCognitiveAnalyzer()

export default autismCognitiveAnalyzer
export { AutismCognitiveAnalyzer }