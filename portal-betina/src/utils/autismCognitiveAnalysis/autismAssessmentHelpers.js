/**
 * @file autismAssessmentHelpers.js
 * @description Métodos auxiliares específicos para avaliação cognitiva no autismo
 * Implementa funções de suporte para análise detalhada
 */

/**
 * Helpers para Avaliação de Autismo
 * Métodos auxiliares para análise cognitiva especializada
 */
export class AutismAssessmentHelpers {
  // ==================== AVALIAÇÃO DE CARACTERÍSTICAS DO AUTISMO ====================

  /**
   * Avalia desafios de comunicação social
   */
  static assessSocialCommunicationChallenges(sessionData) {
    const indicators = {
      eyeContact: sessionData.eyeContactFrequency || 0.5,
      jointAttention: sessionData.jointAttentionSkills || 0.5,
      socialReciprocity: sessionData.socialReciprocity || 0.5,
      nonVerbalCommunication: sessionData.nonVerbalCommunication || 0.5,
      socialEmotionalReciprocity: sessionData.socialEmotionalReciprocity || 0.5,
    }

    const averageScore =
      Object.values(indicators).reduce((sum, val) => sum + val, 0) / Object.keys(indicators).length

    return {
      indicators,
      overallScore: averageScore,
      level: averageScore < 0.3 ? 'significant' : averageScore < 0.6 ? 'moderate' : 'mild',
      supportNeeds: this.generateSocialCommunicationSupports(indicators),
    }
  }

  /**
   * Avalia interesses restritos
   */
  static assessRestrictedInterests(sessionData) {
    const patterns = {
      intensity: sessionData.interestIntensity || 0.5,
      fixation: sessionData.fixationLevel || 0.5,
      flexibility: 1 - (sessionData.topicFlexibility || 0.5), // Invertido
      duration: sessionData.interestDuration || 0.5,
      interference: sessionData.functionalInterference || 0.5,
    }

    const restrictionLevel =
      Object.values(patterns).reduce((sum, val) => sum + val, 0) / Object.keys(patterns).length

    return {
      patterns,
      restrictionLevel,
      category:
        restrictionLevel > 0.7
          ? 'highly_restricted'
          : restrictionLevel > 0.4
            ? 'moderately_restricted'
            : 'flexible',
      interventions: this.generateInterestInterventions(patterns),
    }
  }

  /**
   * Avalia comportamentos repetitivos
   */
  static assessRepetitiveBehaviors(sessionData) {
    const behaviors = {
      motor: sessionData.motorStereotypies || 0,
      vocal: sessionData.vocalStereotypies || 0,
      object: sessionData.objectStereotypies || 0,
      routine: sessionData.routineRigidity || 0,
      sensory: sessionData.sensorySeeking || 0,
    }

    const frequency = sessionData.repetitiveBehaviorFrequency || 0
    const intensity = sessionData.repetitiveBehaviorIntensity || 0

    return {
      behaviors,
      frequency,
      intensity,
      functionalImpact: this.calculateFunctionalImpact(behaviors, frequency, intensity),
      interventionPriority: this.calculateInterventionPriority(behaviors, frequency, intensity),
    }
  }

  /**
   * Avalia diferenças sensoriais
   */
  static assessSensoryDifferences(sessionData) {
    const domains = {
      hyper: sessionData.hypersensitivities || {},
      hypo: sessionData.hyposensitivities || {},
      seeking: sessionData.sensorySeeking || {},
      avoiding: sessionData.sensoryAvoiding || {},
    }

    return {
      domains,
      overallProfile: this.createSensoryDifferenceProfile(domains),
      impactLevel: this.calculateSensoryImpact(domains),
      adaptationPriority: this.prioritizeSensoryAdaptations(domains),
    }
  }

  // ==================== AVALIAÇÃO DE PROCESSAMENTO SENSORIAL ====================

  /**
   * Avalia processamento visual
   */
  static assessVisualProcessing(sessionData) {
    const metrics = {
      discrimination: sessionData.visualDiscrimination || 0.5,
      tracking: sessionData.visualTracking || 0.5,
      memory: sessionData.visualMemory || 0.5,
      processing: sessionData.visualProcessingSpeed || 0.5,
      integration: sessionData.visualIntegration || 0.5,
    }

    const threshold = this.calculateSensoryThreshold('visual', sessionData)

    return {
      metrics,
      threshold,
      profile: this.determineVisualProfile(metrics, threshold),
      adaptations: this.recommendVisualAdaptations(metrics, threshold),
    }
  }

  /**
   * Avalia processamento auditivo
   */
  static assessAuditoryProcessing(sessionData) {
    const metrics = {
      discrimination: sessionData.auditoryDiscrimination || 0.5,
      filtering: sessionData.backgroundNoiseFiltering || 0.5,
      localization: sessionData.soundLocalization || 0.5,
      memory: sessionData.auditoryMemory || 0.5,
      processing: sessionData.auditoryProcessingSpeed || 0.5,
    }

    const threshold = this.calculateSensoryThreshold('auditory', sessionData)

    return {
      metrics,
      threshold,
      profile: this.determineAuditoryProfile(metrics, threshold),
      adaptations: this.recommendAuditoryAdaptations(metrics, threshold),
    }
  }

  /**
   * Avalia processamento tátil
   */
  static assessTactileProcessing(sessionData) {
    const metrics = {
      discrimination: sessionData.tactileDiscrimination || 0.5,
      defensiveness: sessionData.tactileDefensiveness || 0.5,
      seeking: sessionData.tactileSeeking || 0.5,
      registration: sessionData.tactileRegistration || 0.5,
      modulation: sessionData.tactileModulation || 0.5,
    }

    const threshold = this.calculateSensoryThreshold('tactile', sessionData)

    return {
      metrics,
      threshold,
      profile: this.determineTactileProfile(metrics, threshold),
      adaptations: this.recommendTactileAdaptations(metrics, threshold),
    }
  }

  // ==================== AVALIAÇÃO DE COMUNICAÇÃO ====================

  /**
   * Avalia linguagem expressiva
   */
  static assessExpressiveLanguage(sessionData) {
    const skills = {
      vocabulary: sessionData.vocabularySize || 0,
      grammar: sessionData.grammarComplexity || 0,
      fluency: sessionData.speechFluency || 0,
      clarity: sessionData.speechClarity || 0,
      pragmatics: sessionData.pragmaticSkills || 0,
    }

    return {
      skills,
      overallLevel: this.calculateLanguageLevel(skills),
      strengths: this.identifyLanguageStrengths(skills),
      needs: this.identifyLanguageNeeds(skills),
    }
  }

  /**
   * Avalia linguagem receptiva
   */
  static assessReceptiveLanguage(sessionData) {
    const skills = {
      comprehension: sessionData.languageComprehension || 0,
      following: sessionData.instructionFollowing || 0,
      processing: sessionData.languageProcessing || 0,
      memory: sessionData.auditoryMemory || 0,
      attention: sessionData.listeningAttention || 0,
    }

    return {
      skills,
      overallLevel: this.calculateLanguageLevel(skills),
      strengths: this.identifyLanguageStrengths(skills),
      needs: this.identifyLanguageNeeds(skills),
    }
  }

  /**
   * Avalia comunicação social
   */
  static assessSocialCommunication(sessionData) {
    const skills = {
      initiation: sessionData.communicationInitiation || 0,
      maintenance: sessionData.conversationMaintenance || 0,
      turnTaking: sessionData.conversationalTurnTaking || 0,
      topicManagement: sessionData.topicManagement || 0,
      contextualUse: sessionData.contextualLanguageUse || 0,
    }

    return {
      skills,
      overallLevel: this.calculateSocialCommunicationLevel(skills),
      supports: this.recommendSocialCommunicationSupports(skills),
    }
  }

  // ==================== AVALIAÇÃO DE FUNÇÃO EXECUTIVA ====================

  /**
   * Avalia flexibilidade cognitiva
   */
  static assessCognitiveFlexibility(sessionData) {
    const indicators = {
      setShifting: sessionData.setShiftingAbility || 0.5,
      adaptability: sessionData.adaptabilityScore || 0.5,
      problemSolving: sessionData.flexibleProblemSolving || 0.5,
      perspective: sessionData.perspectiveTaking || 0.5,
      creativity: sessionData.creativeProblemSolving || 0.5,
    }

    return {
      indicators,
      overallFlexibility:
        Object.values(indicators).reduce((sum, val) => sum + val, 0) /
        Object.keys(indicators).length,
      interventions: this.recommendFlexibilityInterventions(indicators),
    }
  }

  /**
   * Avalia controle inibitório
   */
  static assessInhibitoryControl(sessionData) {
    const measures = {
      impulseControl: sessionData.impulseControl || 0.5,
      responseInhibition: sessionData.responseInhibition || 0.5,
      interference: sessionData.interferenceControl || 0.5,
      delayGratification: sessionData.delayOfGratification || 0.5,
    }

    return {
      measures,
      overallControl:
        Object.values(measures).reduce((sum, val) => sum + val, 0) / Object.keys(measures).length,
      strategies: this.recommendInhibitoryStrategies(measures),
    }
  }

  /**
   * Avalia habilidades de planejamento
   */
  static assessPlanningSkills(sessionData) {
    const skills = {
      goalSetting: sessionData.goalSettingAbility || 0.5,
      sequencing: sessionData.sequencingSkills || 0.5,
      organization: sessionData.organizationSkills || 0.5,
      monitoring: sessionData.selfMonitoring || 0.5,
      evaluation: sessionData.selfEvaluation || 0.5,
    }

    return {
      skills,
      overallPlanning:
        Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length,
      supports: this.recommendPlanningSupports(skills),
    }
  }

  // ==================== CÁLCULOS DE SUPORTE ====================

  /**
   * Calcula necessidades de suporte em comunicação
   */
  static calculateCommunicationSupportNeeds(communicationLevel) {
    const level = communicationLevel.level || 0
    const barriers = communicationLevel.barriers || []

    let supportScore = 0

    // Baseado no nível de comunicação
    if (level === 0) supportScore += 0.9
    else if (level === 1) supportScore += 0.7
    else if (level === 2) supportScore += 0.5
    else if (level === 3) supportScore += 0.3
    else supportScore += 0.1

    // Ajustar baseado nas barreiras
    supportScore += barriers.length * 0.1

    return Math.min(1, supportScore)
  }

  /**
   * Calcula necessidades de suporte social
   */
  static calculateSocialSupportNeeds(autismCharacteristics) {
    const socialChallenges = autismCharacteristics.socialCommunication || {}
    const level = socialChallenges.level || 'mild'

    const supportMapping = {
      significant: 0.9,
      moderate: 0.6,
      mild: 0.3,
    }

    return supportMapping[level] || 0.5
  }

  /**
   * Calcula necessidades de suporte sensorial
   */
  static calculateSensorySupportNeeds(sensoryProfile) {
    const impactLevel = sensoryProfile.impactLevel || 0.5
    const adaptationNeeds = sensoryProfile.adaptationNeeds || []

    let supportScore = impactLevel
    supportScore += adaptationNeeds.length * 0.1

    return Math.min(1, supportScore)
  }

  /**
   * Determina nível de suporte geral
   */
  static determineSupportLevel(overallScore) {
    if (overallScore >= 0.7) {
      return {
        level: 3,
        description: 'requiring very substantial support',
        intensity: 'high',
        frequency: 'continuous',
      }
    } else if (overallScore >= 0.4) {
      return {
        level: 2,
        description: 'requiring substantial support',
        intensity: 'moderate',
        frequency: 'frequent',
      }
    } else {
      return {
        level: 1,
        description: 'requiring support',
        intensity: 'low',
        frequency: 'intermittent',
      }
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Calcula limiar sensorial
   */
  static calculateSensoryThreshold(modality, sessionData) {
    const reactions = sessionData[`${modality}Reactions`] || []
    if (reactions.length === 0) return 0.5

    const averageReaction =
      reactions.reduce((sum, reaction) => sum + reaction.intensity, 0) / reactions.length
    return Math.max(0, Math.min(1, averageReaction))
  }

  /**
   * Calcula impacto funcional
   */
  static calculateFunctionalImpact(behaviors, frequency, intensity) {
    const behaviorSum = Object.values(behaviors).reduce((sum, val) => sum + val, 0)
    const impact = (behaviorSum * frequency * intensity) / (Object.keys(behaviors).length * 100)
    return Math.max(0, Math.min(1, impact))
  }

  /**
   * Calcula prioridade de intervenção
   */
  static calculateInterventionPriority(behaviors, frequency, intensity) {
    const functionalImpact = this.calculateFunctionalImpact(behaviors, frequency, intensity)

    if (functionalImpact > 0.7) return 'high'
    if (functionalImpact > 0.4) return 'medium'
    return 'low'
  }

  /**
   * Cria perfil de diferenças sensoriais
   */
  static createSensoryDifferenceProfile(domains) {
    const hyperCount = Object.keys(domains.hyper || {}).length
    const hypoCount = Object.keys(domains.hypo || {}).length
    const seekingCount = Object.keys(domains.seeking || {}).length
    const avoidingCount = Object.keys(domains.avoiding || {}).length

    const total = hyperCount + hypoCount + seekingCount + avoidingCount

    if (total === 0) return 'typical'

    const predominant = Math.max(hyperCount, hypoCount, seekingCount, avoidingCount)

    if (predominant === hyperCount) return 'hypersensitive'
    if (predominant === hypoCount) return 'hyposensitive'
    if (predominant === seekingCount) return 'seeking'
    if (predominant === avoidingCount) return 'avoiding'

    return 'mixed'
  }

  /**
   * Calcula impacto sensorial
   */
  static calculateSensoryImpact(domains) {
    const totalDifferences =
      Object.keys(domains.hyper || {}).length +
      Object.keys(domains.hypo || {}).length +
      Object.keys(domains.seeking || {}).length +
      Object.keys(domains.avoiding || {}).length

    return Math.min(1, totalDifferences / 10) // Normalizado para 10 diferenças máximas
  }

  /**
   * Gera suportes para comunicação social
   */
  static generateSocialCommunicationSupports(indicators) {
    const supports = []

    if (indicators.eyeContact < 0.5) {
      supports.push('eye contact training', 'visual attention supports')
    }

    if (indicators.jointAttention < 0.5) {
      supports.push('joint attention activities', 'pointing practice')
    }

    if (indicators.socialReciprocity < 0.5) {
      supports.push('turn-taking games', 'social scripts')
    }

    return supports
  }

  /**
   * Recomenda adaptações visuais
   */
  static recommendVisualAdaptations(metrics, threshold) {
    const adaptations = []

    if (threshold < 0.3) {
      // Hipersensível
      adaptations.push('dimmed lighting', 'reduced visual clutter', 'neutral colors')
    } else if (threshold > 0.7) {
      // Hiposensível
      adaptations.push('bright colors', 'visual stimulation', 'high contrast materials')
    }

    if (metrics.processing < 0.5) {
      adaptations.push('extra processing time', 'simplified visuals')
    }

    return adaptations
  }

  /**
   * Recomenda adaptações auditivas
   */
  static recommendAuditoryAdaptations(metrics, threshold) {
    const adaptations = []

    if (threshold < 0.3) {
      // Hipersensível
      adaptations.push('noise reduction', 'quiet spaces', 'noise-canceling headphones')
    } else if (threshold > 0.7) {
      // Hiposensível
      adaptations.push('background music', 'auditory stimulation', 'sound tools')
    }

    if (metrics.filtering < 0.5) {
      adaptations.push('reduce background noise', 'clear audio signals')
    }

    return adaptations
  }
}

export default AutismAssessmentHelpers
