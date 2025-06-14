import { logger } from '../logger.js'

class CognitiveAnalyzer {
  constructor(config = {}) {
    this.config = {
      confidenceThreshold: 0.7,
      sessionHistoryLimit: 10,
      ...config,
    }
    this.levelMap = {
      none: 0,
      minimal: 1,
      moderate: 2,
      substantial: 3,
      extensive: 4,
      maximum: 4,
    }
    logger.info('CognitiveAnalyzer initialized', { config: this.config })
  }

  // **Avaliação Cognitiva**
  assessCognitiveLevel(data) {
    const indicators = {
      problemSolving: data.problemSolvingSkills || 50,
      memory: data.memoryCapacity || 50,
      attention: data.attentionSpan || 50,
      processing: data.processingSpeed || 50,
    }
    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4
    const level =
      average > 88
        ? 'advanced'
        : average > 66
          ? 'appropriate'
          : average > 48
            ? 'emerging'
            : 'developing'
    return { level, indicators, confidence: this.calculateConfidence(indicators) }
  }

  // **Avaliação de Comunicação**
  assessCommunicationLevel(data) {
    const preferences = data.preferences || {}
    const indicators = {
      verbalSkills: preferences.verbalCommunication ? 75 : 25,
      nonverbalSkills: preferences.gestureUse ? 75 : 25,
      socialCommunication: preferences.socialInteraction ? 75 : 25,
    }
    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 3
    const level =
      average > 75
        ? 'independent'
        : average > 50
          ? 'supported'
          : average > 25
            ? 'emerging'
            : 'minimal'
    return { level, indicators, confidence: this.calculateConfidence(indicators) }
  }

  // **Avaliação de Habilidades Sociais**
  assessSocialSkillsLevel(data) {
    const preferences = data.preferences || {}
    const indicators = {
      socialInitiation: preferences.socialInitiation ? 75 : 25,
      socialReciprocity: preferences.socialReciprocity ? 75 : 25,
      peerInteraction: preferences.peerInteraction ? 75 : 25,
    }
    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 3
    const level =
      average > 75
        ? 'independent'
        : average > 50
          ? 'supported'
          : average > 25
            ? 'emerging'
            : 'minimal'
    return { level, indicators, confidence: this.calculateConfidence(indicators) }
  }

  // **Criação de Perfis**
  createSensoryProfile(data) {
    const preferences = data.preferences || {}
    return {
      visual: {
        sensitivity: preferences.visualSensitivity || 'typical',
        preferences: preferences.visualPreferences || [],
        supports: preferences.visualSupports || false,
      },
      auditory: {
        sensitivity: preferences.auditorySensitivity || 'typical',
        preferences: preferences.auditoryPreferences || [],
        supports: preferences.auditorySupports || false,
      },
      tactile: {
        sensitivity: preferences.tactileSensitivity || 'typical',
        preferences: preferences.tactilePreferences || [],
        supports: preferences.tactileSupports || false,
      },
      vestibular: {
        seekingBehavior: preferences.movementSeeking || false,
        avoidanceBehavior: preferences.movementAvoidance || false,
      },
      proprioceptive: {
        seekingBehavior: preferences.proprioceptiveSeeking || false,
        bodyAwareness: preferences.bodyAwareness || 'developing',
      },
    }
  }

  createBehavioralProfile(data) {
    const preferences = data.preferences || {}
    return {
      selfRegulation: {
        level: preferences.selfRegulationLevel || 'developing',
        strategies: preferences.behavioralTriggers || [],
      },
      attention: {
        span: preferences.attentionSpan || 'variable',
        focus: preferences.focusAbility || 'emerging',
        distractibility: preferences.distractibility || 'moderate',
      },
      flexibility: {
        changeAdaptation: preferences.changeAdaptation || 'challenging',
      },
    }
  }

  assessAdaptiveSkills(data) {
    const preferences = data.preferences || {}
    return {
      dailyLiving: preferences.dailyLivingSkills || 'emerging',
      socialSkills: preferences.socialSkills || 'emerging',
      communicationSkills: preferences.communicationSkills || 'emerging',
      motorSkills: preferences.motorSkills || 'developing',
    }
  }

  // **Cálculo de Níveis de Suporte**
  calculateVisualSupportLevel(preferences) {
    const needs = [
      preferences.highContrast,
      preferences.largeText,
      preferences.visualSchedules,
      preferences.pictureSupports,
      preferences.colorBlindnessSupport,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  calculateAuditorySupportLevel(preferences) {
    const needs = [
      preferences.textToSpeech,
      preferences.audioFeedback,
      preferences.auditoryPrompts,
      preferences.soundReduction,
      preferences.volumeModulation,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  calculateMotorSupportLevel(preferences) {
    const needs = [
      preferences.largeButtons,
      preferences.reducedMotion,
      preferences.motorAssistance,
      preferences.physicalSupports,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  calculateCognitiveSupportLevel(preferences) {
    const needs = [
      preferences.simplifiedInterface,
      preferences.extraTime,
      preferences.stepByStep,
      preferences.cognitiveAids,
      preferences.memorySupports,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  calculateSocialSupportLevel(preferences) {
    const needs = [
      preferences.socialStories,
      preferences.peerSupport,
      preferences.socialCues,
      preferences.interactionGuides,
      preferences.socialScripts,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  calculateBehavioralSupportLevel(preferences) {
    const needs = [
      preferences.behaviorSupports,
      preferences.selfRegulationTools,
      preferences.calmingStrategies,
      preferences.reinforcementSystems,
      preferences.behaviorPlans,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  calculateSensorySupportLevel(preferences) {
    const needs = [
      preferences.sensoryBreaks,
      preferences.sensoryTools,
      preferences.environmentalMods,
      preferences.sensoryDiet,
      preferences.sensoryRegulation,
    ].filter(Boolean).length
    return this.determineSupportLevel(needs)
  }

  // **Análise Avançada de Processamento Sensorial**
  analyzeSensoryProcessing(data) {
    return {
      visual: this.assessVisualProcessing(data),
      auditory: this.assessAuditoryProcessing(data),
      tactile: this.assessTactileProcessing(data),
      vestibular: this.assessVestibularProcessing(data),
      proprioceptive: this.assessProprioceptiveProcessing(data),
      integration: this.determineSensoryProfile(data),
    }
  }

  assessVisualProcessing(data) {
    return {
      acuity: data.visualAcuity || 'typical',
      tracking: data.visualTracking || 'developing',
      discrimination: data.visualDiscrimination || 'emerging',
      memory: data.visualMemory || 'developing',
      overloadRisk: data.visualSensitivity > 0.8 ? 'high' : 'low',
    }
  }

  assessAuditoryProcessing(data) {
    return {
      discrimination: data.auditoryDiscrimination || 'developing',
      memory: data.auditoryMemory || 'emerging',
      processing: data.auditoryProcessing || 'typical',
      attention: data.auditoryAttention || 'variable',
      overloadRisk: data.auditorySensitivity > 0.8 ? 'high' : 'low',
    }
  }

  assessTactileProcessing(data) {
    return {
      sensitivity: data.tactileSensitivity || 'typical',
      discrimination: data.tactileDiscrimination || 'developing',
      tolerance: data.tactileTolerance || 'variable',
      avoidance: data.tactileAvoidance ? 'high' : 'low',
    }
  }

  assessVestibularProcessing(data) {
    return {
      balance: data.balance || 'developing',
      movement: data.movementTolerance || 'typical',
      seeking: data.movementSeeking ? 'high' : 'low',
    }
  }

  assessProprioceptiveProcessing(data) {
    return {
      bodyAwareness: data.bodyAwareness || 'developing',
      forcePlanning: data.forcePlanning || 'emerging',
      motorPlanning: data.motorPlanning || 'developing',
      seeking: data.proprioceptiveSeeking ? 'high' : 'low',
    }
  }

  determineSensoryProfile(data) {
    const patterns = {
      seeking: data.sensorySeeking || false,
      avoiding: data.sensoryAvoiding || false,
      sensitive: data.sensorySensitive || false,
      registration: data.sensoryRegistration || 'typical',
    }
    if (patterns.seeking && patterns.avoiding) return 'mixed'
    if (patterns.seeking) return 'seeker'
    if (patterns.avoiding) return 'avoider'
    if (patterns.sensitive) return 'sensitive'
    return 'typical'
  }

  // **Avaliação Socioemocional Avançada**
  assessSocialEmotionalAspects(data) {
    return {
      emotionalRegulation: this.assessEmotionalRegulation(data),
      socialAwareness: this.assessSocialAwareness(data),
      empathySkills: this.assessEmpathySkills(data),
      relationshipSkills: this.assessRelationshipSkills(data),
      decisionMaking: this.assessDecisionMaking(data),
      socialEngagement: this.assessSocialEngagement(data),
      anxietyLevel: this.assessAnxiety(data),
    }
  }

  assessEmotionalRegulation(data) {
    return {
      recognition: data.emotionRecognition || 'developing',
      expression: data.emotionExpression || 'emerging',
      regulation: data.emotionRegulation || 'needs-support',
      coping: data.copingStrategies || 'limited',
      confidence: this.calculateConfidence(data.emotionRegulation),
    }
  }

  assessSocialAwareness(data) {
    return {
      perspective: data.perspectiveTaking || 'emerging',
      empathy: data.empathySkills || 'developing',
      socialCues: data.socialCueReading || 'challenging',
      context: data.socialContext || 'literal',
      confidence: this.calculateConfidence(data.socialCueReading),
    }
  }

  assessEmpathySkills(data) {
    return {
      cognitive: data.cognitiveEmpathy || 'developing',
      affective: data.affectiveEmpathy || 'emerging',
      behavioral: data.behavioralEmpathy || 'needs-support',
      confidence: this.calculateConfidence(data.cognitiveEmpathy),
    }
  }

  assessRelationshipSkills(data) {
    return {
      initiation: data.socialInitiation || 'passive',
      maintenance: data.relationshipMaintenance || 'challenging',
      reciprocity: data.socialReciprocity || 'needs-support',
      boundaries: data.socialBoundaries || 'needs-support',
      confidence: this.calculateConfidence(data.socialReciprocity),
    }
  }

  assessDecisionMaking(data) {
    return {
      problemSolving: data.problemSolving || 'concrete',
      consequences: data.consequenceUnderstanding || 'emerging',
      values: data.valuesBased || 'developing',
      confidence: this.calculateConfidence(data.problemSolving),
    }
  }

  assessSocialEngagement(performanceData) {
    const engagement = performanceData.socialEngagement || 0.5
    return engagement > 0.7 ? 'high' : engagement < 0.3 ? 'low' : 'moderate'
  }

  assessAnxiety(performanceData) {
    const stressIndicators = performanceData.stressIndicators || []
    const avoidanceBehaviors = performanceData.avoidanceBehaviors || []
    const anxietyScore = (stressIndicators.length + avoidanceBehaviors.length) / 10
    return Math.min(1, anxietyScore)
  }

  // **Avaliação de Funções Executivas**
  evaluateExecutiveFunction(data) {
    return {
      workingMemory: this.assessWorkingMemory(data),
      cognitiveFlexibility: this.assessCognitiveFlexibility(data),
      inhibitoryControl: this.assessInhibitoryControl(data),
      planningOrganization: this.assessPlanningOrganization(data),
      timeManagement: this.assessTimeManagement(data),
      overallScore: this.calculateExecutiveFunctionScore(data),
    }
  }

  assessWorkingMemory(data) {
    return {
      verbal: data.verbalWorkingMemory || 'developing',
      visual: data.visualWorkingMemory || 'emerging',
      capacity: data.workingMemoryCapacity || 'limited',
      confidence: this.calculateConfidence(data.workingMemoryCapacity),
    }
  }

  assessCognitiveFlexibility(data) {
    return {
      setShifting: data.setShifting || 'challenging',
      adaptation: data.cognitiveAdaptation || 'rigid',
      perspective: data.perspectiveShifting || 'default',
      confidence: this.calculateConfidence(data.setShifting),
    }
  }

  assessInhibitoryControl(data) {
    return {
      impulse: data.impulseControl || 'developing',
      attention: data.attentionalControl || 'variable',
      behavioral: data.behavioralInhibition || 'needs-support',
      confidence: this.calculateConfidence(data.impulseControl),
    }
  }

  assessPlanningOrganization(data) {
    return {
      planning: data.planningSkills || 'emerging',
      organization: data.organizationSkills || 'needs-support',
      sequencing: data.sequencingAbility || 'developing',
      prioritization: data.prioritizationSkills || 'challenging',
      confidence: this.calculateConfidence(data.planningSkills),
    }
  }

  assessTimeManagement(data) {
    return {
      awareness: data.timeAwareness || 'emerging',
      estimation: data.timeEstimation || 'inaccurate',
      scheduling: data.timeScheduling || 'needs-support',
      confidence: this.calculateConfidence(data.timeAwareness),
    }
  }

  calculateExecutiveFunctionScore(data) {
    const scores = [
      this.scoreExecutiveComponent(data.workingMemory),
      this.scoreExecutiveComponent(data.cognitiveFlexibility),
      this.scoreExecutiveComponent(data.inhibitoryControl),
      this.scoreExecutiveComponent(data.planningOrganization),
      this.scoreExecutiveComponent(data.timeManagement),
    ]
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return average > 75
      ? 'strong'
      : average > 50
        ? 'developing'
        : average > 25
          ? 'emerging'
          : 'needs-significant-support'
  }

  scoreExecutiveComponent(level) {
    const levelsScores = {
      strong: 100,
      independent: 99,
      developing: 75,
      emerging: 50,
      'needs-support': 25,
      challenging: 15,
      'needs-significant-support': 5,
    }
    return typeof level === 'string' ? levelsScores[level] || 50 : 50
  }

  // **Análise Comportamental**
  extractBehavioralIndicators(data) {
    return {
      engagement: this.assessEngagement(data),
      persistence: this.assessPersistence(data),
      frustration: this.assessFrustration(data),
      regulation: this.assessRegulation(data),
      attention: this.assessAttention(data),
      motivation: this.assessMotivation(data),
    }
  }

  assessEngagement(data) {
    const attempts = data.attempts || 0
    const interactions = data.interactions || 0
    let score = 0
    if (attempts > 3) score += 0.3
    if (interactions > 5) score += 0.4
    return score > 0.8 ? 'high' : score > 0.2 ? 'moderate' : 'low'
  }

  assessPersistence(data) {
    const attempts = data.attempts || 0
    const errors = data.errors || 0
    const completion = data.completed || false
    if (completion && attempts > errors * 2) return 'high'
    if (attempts > 5) return 'moderate'
    if (attempts > 2) return 'low'
    return 'minimal'
  }

  assessFrustration(data) {
    const frustrationLevel = data.frustrationLevel || 0
    const errorRate = data.errors / Math.max(data.attempts, 1)
    const abandonmentRate = data.abandonmentRate || 0
    let indicators = 0
    if (frustrationLevel > 0.7) indicators++
    if (errorRate > 0.3) indicators++
    if (abandonmentRate > 0.3) indicators++
    return indicators > 2
      ? 'high'
      : indicators > 1
        ? 'moderate'
        : indicators > 0
          ? 'low'
          : 'minimal'
  }

  assessRegulation(data) {
    const selfCorrections = data.selfCorrections || 0
    const pausesTaken = data.pausesTaken || 0
    const helpSeeking = data.helpSeeking || 0
    let score = 0
    if (selfCorrections > 2) score += 0.4
    if (pausesTaken > 1) score += 0.3
    if (helpSeeking > 0) score += 0.3
    return score > 0.8 ? 'independent' : score > 0.2 ? 'emerging' : 'needs-support'
  }

  assessAttention(data) {
    const focusTime = data.focusTime || 0
    const distractions = data.distractions || 0
    const taskSwitching = data.taskSwitching || 0
    let score = focusTime / 100
    score -= distractions * 0.1
    score -= taskSwitching * 0.05
    return score > 0.8
      ? 'sustained'
      : score > 0.5
        ? 'variable'
        : score > 0.2
          ? 'brief'
          : 'difficult'
  }

  assessMotivation(data) {
    const taskInitiation = data.taskInitiation || false
    const taskCompletion = data.taskCompletion || false
    const positiveResponse = data.positiveResponse || false
    const requestForMore = data.requestForMore || false
    let indicators = 0
    if (taskInitiation) indicators++
    if (taskCompletion) indicators++
    if (positiveResponse) indicators++
    if (requestForMore) indicators++
    return indicators >= 4
      ? 'high'
      : indicators >= 3
        ? 'moderate'
        : indicators >= 2
          ? 'emerging'
          : 'low'
  }

  // **Funcionalidades Avançadas**
  analyzeCurrentPerformance(sessionData) {
    const data = sessionData.performance || {}
    return {
      accuracy: data.accuracy || 0,
      speed: data.averageResponseTime || 0,
      consistency: data.consistencyScore || 0,
      engagement: data.engagementLevel || 0,
      effort: data.effortLevel || 0,
      progress: data.progressRate || 0,
      confidence: this.calculateConfidence(data.accuracy),
    }
  }

  calculateDifficultyProgression(session) {
    const performanceData = session.performanceData || {}
    const accuracy = performanceData.accuracy || 0
    const timeSpent = performanceData.timeSpent || 0
    const hintsUsed = performanceData.hintsUsed || 0
    let progression = 'maintain'
    if (accuracy > 0.85 && timeSpent < 300 && hintsUsed < 2) {
      progression = 'increase'
    } else if (accuracy < 0.4 || timeSpent > 600 || hintsUsed > 5) {
      progression = 'decrease'
    }
    return {
      recommendation: progression,
      confidence: this.calculateProgressionConfidence(performanceData),
      factors: { accuracy, timeSpent, hintsUsed, completed: session.completed },
    }
  }

  calculateProgressionConfidence(data) {
    let confidence = 0.5
    if (data.attempts > 5) confidence += 0.2
    if (data.timeSpent > 60) confidence += 0.1
    if (data.consistency) confidence += 0.2
    return Math.min(confidence, 1.0)
  }

  estimateCognitiveLoad(performanceData) {
    const factors = {
      taskComplexity: performanceData.taskComplexity || 0.5,
      timeSpent: performanceData.timeSpent || 0,
      errors: performanceData.errors || 0,
      hintsUsed: performanceData.hintsUsed || 0,
    }
    let cognitiveLoad = factors.taskComplexity
    if (factors.timeSpent > 300) cognitiveLoad += 0.2
    if (factors.timeSpent < 60) cognitiveLoad -= 0.1
    cognitiveLoad += factors.errors * 0.1 + factors.hintsUsed * 0.05
    return {
      estimated: Math.max(0, Math.min(1, cognitiveLoad)),
      factors,
      recommendation: cognitiveLoad > 0.7 ? 'reduce-complexity' : 'maintain-level',
    }
  }

  // **Análise Multimodal (Nova Funcionalidade)**
  analyzeMultimodalData(dataSources) {
    const { sessionData, sensorData, interactionData } = dataSources
    const analysis = {
      cognitive: this.analyzeCurrentPerformance(sessionData),
      sensory: this.analyzeSensoryProcessing(sensorData || sessionData),
      behavioral: this.extractBehavioralIndicators(interactionData || sessionData),
      confidence: this.calculateCombinedConfidence(dataSources),
    }
    return {
      ...analysis,
      recommendations: this.generateMultimodalRecommendations(analysis),
    }
  }

  calculateCombinedConfidence(dataSources) {
    const weights = {
      sessionData: 0.5,
      sensorData: 0.3,
      interactionData: 0.2,
    }
    let confidence = 0
    if (dataSources.sessionData)
      confidence +=
        weights.sessionData * this.calculateConfidence(dataSources.sessionData.performance)
    if (dataSources.sensorData)
      confidence += weights.sensorData * this.calculateConfidence(dataSources.sensorData)
    if (dataSources.interactionData)
      confidence += weights.interactionData * this.calculateConfidence(dataSources.interactionData)
    return Math.min(1, confidence)
  }

  generateMultimodalRecommendations(analysis) {
    const recommendations = []
    if (analysis.cognitive.accuracy < 0.5) recommendations.push('reduce-task-difficulty')
    if (analysis.sensory.visual.overloadRisk === 'high')
      recommendations.push('reduce-visual-stimuli')
    if (analysis.behavioral.frustration === 'high')
      recommendations.push('implement-calming-strategies')
    return recommendations
  }

  // **Previsão de Necessidades (Nova Funcionalidade)**
  predictSupportNeeds(userId, sessionHistory) {
    const historicalData = sessionHistory.slice(0, this.config.sessionHistoryLimit)
    const trends = this.analyzePerformanceTrends(historicalData)
    return {
      cognitive: this.predictCognitiveSupport(trends),
      sensory: this.predictSensorySupport(trends),
      behavioral: this.predictBehavioralSupport(trends),
      confidence: this.calculatePredictionConfidence(historicalData),
    }
  }

  analyzePerformanceTrends(historicalData) {
    return historicalData.reduce((acc, session) => {
      const perf = session.performance || {}
      acc.accuracy = (acc.accuracy || 0) + (perf.accuracy || 0)
      acc.timeSpent = (acc.timeSpent || 0) + (perf.timeSpent || 0)
      acc.frustration = (acc.frustration || 0) + (perf.frustrationLevel || 0)
      acc.count = (acc.count || 0) + 1
      return acc
    }, {})
  }

  predictCognitiveSupport(trends) {
    const avgAccuracy = trends.accuracy / trends.count
    return avgAccuracy < 0.5 ? 'high' : avgAccuracy < 0.7 ? 'moderate' : 'low'
  }

  predictSensorySupport(trends) {
    const avgTimeSpent = trends.timeSpent / trends.count
    return avgTimeSpent > 600 ? 'high' : avgTimeSpent > 300 ? 'moderate' : 'low'
  }

  predictBehavioralSupport(trends) {
    const avgFrustration = trends.frustration / trends.count
    return avgFrustration > 0.7 ? 'high' : avgFrustration > 0.3 ? 'moderate' : 'low'
  }

  calculatePredictionConfidence(historicalData) {
    return Math.min(
      1,
      (historicalData.length / this.config.sessionHistoryLimit) * this.config.confidenceThreshold
    )
  }

  // **Feedback em Tempo Real (Nova Funcionalidade)**
  provideRealTimeFeedback(sessionData) {
    const performance = this.analyzeCurrentPerformance(sessionData)
    const feedback = {
      type: 'visual', // Pode ser ajustado com base em preferências
      message: '',
      priority: 'normal',
    }
    if (performance.accuracy < 0.4) {
      feedback.message = 'Tente novamente com calma, você consegue!'
      feedback.priority = 'high'
    } else if (performance.engagement < 0.3) {
      feedback.message = 'Que tal uma pausa rápida para recarregar?'
      feedback.priority = 'medium'
    } else {
      feedback.message = 'Ótimo trabalho, continue assim!'
    }
    return feedback
  }

  // **Utilitários**
  determineSupportLevel(needs) {
    return needs > 3 ? 'maximum' : needs > 2 ? 'moderate' : needs > 1 ? 'minimal' : 'none'
  }

  calculateConfidence(data) {
    return data && Object.keys(data).length > 0 ? this.config.confidenceThreshold : 0.5
  }
}

export default CognitiveAnalyzer
