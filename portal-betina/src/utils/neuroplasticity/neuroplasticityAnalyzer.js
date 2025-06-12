/**
 * Sistema de Análise de Neuroplasticidade - Portal Betina
 * Algoritmos avançados para tracking e otimização da plasticidade neural
 *
 * @author Portal Betina Team
 * @version 2.0.0
 * @date 2025-06-10
 */

import { format, subDays, differenceInDays } from 'date-fns'

/**
 * Classe principal para análise de neuroplasticidade
 */
export class NeuroplasticityAnalyzer {
  constructor() {
    this.baselineData = new Map()
    this.progressHistory = new Map()
    this.learningWindows = new Map()
    this.consolidationData = new Map()
  }

  /**
   * ALGORITMO 1: Tracking de Melhoria Cognitiva
   * Mede a plasticidade neural ao longo do tempo em diferentes domínios
   */
  async trackCognitiveImprovement(userId, sessionData, cognitiveProfile) {
    try {
      const domains = [
        'memory',
        'attention',
        'processing_speed',
        'pattern_recognition',
        'cognitive_flexibility',
      ]
      const improvements = {}

      for (const domain of domains) {
        const baseline = await this.getBaseline(userId, domain)
        const currentScore = this.extractDomainScore(sessionData, domain)

        if (baseline && currentScore !== null) {
          const improvement = this.calculateImprovementRate(baseline, currentScore, domain)
          const neuroplasticityIndex = this.calculateNeuroplasticityIndex(improvement, domain)

          improvements[domain] = {
            baseline: baseline.score,
            current: currentScore,
            improvement: improvement.rate,
            neuroplasticityIndex,
            timeFrame: improvement.timeFrame,
            significance: this.assessImprovementSignificance(improvement),
            trend: improvement.trend,
          }
        }
      }

      // Atualizar histórico de progresso
      await this.updateProgressHistory(userId, improvements)

      return {
        cognitiveImprovements: improvements,
        overallNeuroplasticity: this.calculateOverallNeuroplasticity(improvements),
        recommendations: this.generateNeuroplasticityRecommendations(improvements),
        adaptiveStrategies: this.suggestAdaptiveStrategies(improvements),
      }
    } catch (error) {
      console.error('Erro no tracking de melhoria cognitiva:', error)
      return null
    }
  }

  /**
   * ALGORITMO 2: Identificação de Janela de Oportunidade
   * Detecta momentos ótimos para aprendizado baseado em padrões neurais
   */
  async identifyOptimalLearningWindow(userId, currentMetrics) {
    try {
      const historicalData = await this.getProgressHistory(userId)
      const circadianPatterns = this.analyzeCircadianPatterns(historicalData)
      const cognitiveReadiness = this.assessCognitiveReadiness(currentMetrics)
      const fatigueLevel = this.calculateFatigueLevel(currentMetrics, historicalData)

      const windowAnalysis = {
        currentReadiness: cognitiveReadiness,
        optimalTimeWindow: this.calculateOptimalTimeWindow(circadianPatterns, cognitiveReadiness),
        neuroplasticityPotential: this.assessNeuroplasticityPotential(currentMetrics),
        recommendedActivities: this.recommendActivitiesForWindow(cognitiveReadiness),
        sessionDuration: this.calculateOptimalSessionDuration(fatigueLevel, cognitiveReadiness),
        difficultyRecommendation: this.recommendDifficultyForWindow(cognitiveReadiness),
      }

      // Detectar janelas críticas de desenvolvimento
      const criticalWindows = this.detectCriticalDevelopmentWindows(historicalData, currentMetrics)

      return {
        learningWindow: windowAnalysis,
        criticalPeriods: criticalWindows,
        neuroplasticityForecast: this.forecastNeuroplasticity(historicalData, currentMetrics),
        interventionTiming: this.calculateOptimalInterventionTiming(windowAnalysis),
      }
    } catch (error) {
      console.error('Erro na identificação de janela de oportunidade:', error)
      return null
    }
  }

  /**
   * ALGORITMO 3: Sistema de Consolidação de Memória
   * Implementa repetição espaçada personalizada baseada em neurociência
   */
  async optimizeMemoryConsolidation(userId, learningData, memoryProfile) {
    try {
      const forgettingCurve = this.calculatePersonalizedForgettingCurve(userId, learningData)
      const consolidationSchedule = this.generateConsolidationSchedule(
        forgettingCurve,
        memoryProfile
      )

      const consolidationPlan = {
        spacedRepetition: this.calculateSpacedRepetitionIntervals(forgettingCurve),
        sleepOptimization: this.analyzeSleepPatterns(userId),
        memoryReactivation: this.scheduleMemoryReactivation(learningData),
        crossModalReinforcement: this.designCrossModalReinforcement(learningData),
        consolidationEfficiency: this.measureConsolidationEfficiency(userId),
      }

      // Implementar estratégias específicas de consolidação
      const strategies = {
        immediate: this.generateImmediateConsolidationStrategies(learningData),
        shortTerm: this.generateShortTermStrategies(consolidationSchedule),
        longTerm: this.generateLongTermStrategies(forgettingCurve),
        maintenance: this.generateMaintenanceStrategies(memoryProfile),
      }

      return {
        consolidationPlan,
        strategies,
        nextReviewSchedule: this.calculateNextReviewSchedule(consolidationSchedule),
        memoryStrengthPrediction: this.predictMemoryStrength(forgettingCurve),
        adaptiveAdjustments: this.generateAdaptiveAdjustments(consolidationPlan),
      }
    } catch (error) {
      console.error('Erro na otimização de consolidação de memória:', error)
      return null
    }
  }

  /**
   * ALGORITMO 4: Detector de Breakthrough Cognitivo
   * Identifica saltos significativos no desenvolvimento cognitivo
   */
  async detectCognitiveBreakthrough(userId, recentSessions, historicalBaseline) {
    try {
      const breakthroughAnalysis = {}
      const domains = [
        'memory',
        'attention',
        'processing_speed',
        'pattern_recognition',
        'executive_function',
      ]

      for (const domain of domains) {
        const domainAnalysis = await this.analyzeDomainBreakthrough(
          userId,
          domain,
          recentSessions,
          historicalBaseline
        )

        if (domainAnalysis.breakthroughDetected) {
          breakthroughAnalysis[domain] = {
            breakthroughType: domainAnalysis.type,
            magnitude: domainAnalysis.magnitude,
            significance: domainAnalysis.significance,
            triggeringFactors: domainAnalysis.triggers,
            sustainabilityPrediction: this.predictBreakthroughSustainability(domainAnalysis),
            consolidationNeeds: this.assessConsolidationNeeds(domainAnalysis),
            nextSteps: this.recommendPostBreakthroughSteps(domainAnalysis),
          }
        }
      }

      // Análise de breakthrough global
      const globalBreakthrough = this.analyzeGlobalBreakthrough(breakthroughAnalysis)

      return {
        domainBreakthroughs: breakthroughAnalysis,
        globalBreakthrough,
        neuroplasticityBoost: this.calculateNeuroplasticityBoost(breakthroughAnalysis),
        interventionOpportunities: this.identifyInterventionOpportunities(breakthroughAnalysis),
        progressAcceleration: this.calculateProgressAcceleration(globalBreakthrough),
      }
    } catch (error) {
      console.error('Erro na detecção de breakthrough cognitivo:', error)
      return null
    }
  }

  /**
   * ALGORITMO 5: Sistema de Recuperação Cognitiva
   * Estratégias para superar plateaus e regressões
   */
  async implementCognitiveRecovery(userId, plateauData, regressionIndicators) {
    try {
      const recoveryAnalysis = {
        plateauType: this.classifyPlateauType(plateauData),
        regressionSeverity: this.assessRegressionSeverity(regressionIndicators),
        underlyingCauses: this.identifyUnderlyingCauses(plateauData, regressionIndicators),
        neuroplasticityReserve: this.assessNeuroplasticityReserve(userId),
      }

      const recoveryStrategies = {
        immediate: this.generateImmediateRecoveryStrategies(recoveryAnalysis),
        progressive: this.generateProgressiveRecoveryPlan(recoveryAnalysis),
        adaptive: this.generateAdaptiveRecoveryMethods(recoveryAnalysis),
        preventive: this.generatePreventiveStrategies(recoveryAnalysis),
      }

      const recoveryProtocol = {
        phaseOne: this.designRecoveryPhaseOne(recoveryAnalysis),
        phaseTwo: this.designRecoveryPhaseTwo(recoveryAnalysis),
        phaseThree: this.designRecoveryPhaseThree(recoveryAnalysis),
        monitoring: this.setupRecoveryMonitoring(recoveryAnalysis),
      }

      return {
        recoveryAnalysis,
        recoveryStrategies,
        recoveryProtocol,
        expectedTimeline: this.estimateRecoveryTimeline(recoveryAnalysis),
        successPredictors: this.identifyRecoverySuccessPredictors(recoveryAnalysis),
        adaptiveAdjustments: this.planAdaptiveAdjustments(recoveryProtocol),
      }
    } catch (error) {
      console.error('Erro na implementação de recuperação cognitiva:', error)
      return null
    }
  }

  /**
   * ALGORITMO 6: Sistema de Transferência de Aprendizado
   * Facilita aplicação de habilidades entre diferentes atividades
   */
  async optimizeLearningTransfer(userId, sourceSkills, targetActivities) {
    try {
      const transferAnalysis = {}

      for (const targetActivity of targetActivities) {
        const transferPotential = this.assessTransferPotential(sourceSkills, targetActivity)
        const transferStrategies = this.designTransferStrategies(sourceSkills, targetActivity)

        transferAnalysis[targetActivity] = {
          potential: transferPotential,
          strategies: transferStrategies,
          scaffolding: this.designTransferScaffolding(sourceSkills, targetActivity),
          timeline: this.estimateTransferTimeline(transferPotential),
          success_predictors: this.identifyTransferSuccessPredictors(transferPotential),
        }
      }

      const optimizationPlan = {
        generalTransfer: this.optimizeGeneralTransfer(sourceSkills),
        specificTransfer: this.optimizeSpecificTransfer(transferAnalysis),
        metacognitive: this.enhanceMetacognitiveTransfer(sourceSkills),
        crossModal: this.facilitateCrossModalTransfer(sourceSkills, targetActivities),
      }

      return {
        transferAnalysis,
        optimizationPlan,
        transferEfficiency: this.calculateTransferEfficiency(transferAnalysis),
        neuroplasticityLeverage: this.calculateNeuroplasticityLeverage(optimizationPlan),
        adaptivePathways: this.generateAdaptiveTransferPathways(transferAnalysis),
      }
    } catch (error) {
      console.error('Erro na otimização de transferência de aprendizado:', error)
      return null
    }
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES DE CÁLCULO
  // ==========================================================================

  /**
   * Calcula a taxa de melhoria para um domínio específico
   */
  calculateImprovementRate(baseline, currentScore, domain) {
    const timeDiff = Date.now() - new Date(baseline.timestamp).getTime()
    const timeDays = timeDiff / (1000 * 60 * 60 * 24)

    const rawImprovement = currentScore - baseline.score
    const normalizedImprovement = rawImprovement / baseline.score
    const dailyRate = normalizedImprovement / timeDays

    return {
      rate: dailyRate,
      absolute: rawImprovement,
      relative: normalizedImprovement,
      timeFrame: timeDays,
      trend: this.calculateTrend(baseline, currentScore, timeDays),
    }
  }

  /**
   * Calcula o índice de neuroplasticidade para um domínio
   */
  calculateNeuroplasticityIndex(improvement, domain) {
    const baseNeuroplasticity = this.getDomainNeuroplasticityBaseline(domain)
    const ageFactors = this.getAgePlasticityFactors()
    const environmentalFactors = this.getEnvironmentalPlasticityFactors()

    const plasticityIndex =
      baseNeuroplasticity * improvement.rate * ageFactors * environmentalFactors

    return Math.max(0, Math.min(1, plasticityIndex))
  }

  /**
   * Analisa padrões circadianos de performance
   */
  analyzeCircadianPatterns(historicalData) {
    const hourlyPerformance = {}

    historicalData.forEach((session) => {
      const hour = new Date(session.timestamp).getHours()
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = []
      }
      hourlyPerformance[hour].push(session.performance)
    })

    const patterns = {}
    Object.keys(hourlyPerformance).forEach((hour) => {
      const performances = hourlyPerformance[hour]
      patterns[hour] = {
        average: performances.reduce((a, b) => a + b, 0) / performances.length,
        variance: this.calculateVariance(performances),
        consistency: this.calculateConsistency(performances),
      }
    })

    return {
      patterns,
      peakHours: this.identifyPeakHours(patterns),
      lowHours: this.identifyLowHours(patterns),
      optimalWindow: this.calculateOptimalCircadianWindow(patterns),
    }
  }

  /**
   * Avalia prontidão cognitiva atual
   */
  assessCognitiveReadiness(currentMetrics) {
    const factors = {
      attention: currentMetrics.attentionLevel || 0.5,
      energy: currentMetrics.energyLevel || 0.5,
      mood: currentMetrics.moodState || 0.5,
      motivation: currentMetrics.motivationLevel || 0.5,
      stress: 1 - (currentMetrics.stressLevel || 0.5),
    }

    const weightedScore =
      factors.attention * 0.25 +
      factors.energy * 0.2 +
      factors.mood * 0.2 +
      factors.motivation * 0.2 +
      factors.stress * 0.15

    return {
      score: weightedScore,
      factors,
      readinessLevel: this.categorizeReadinessLevel(weightedScore),
      recommendations: this.generateReadinessRecommendations(factors),
    }
  }

  /**
   * Calcula curva de esquecimento personalizada
   */
  calculatePersonalizedForgettingCurve(userId, learningData) {
    const retentionData = this.extractRetentionData(learningData)
    const personalFactors = this.getPersonalForgettingFactors(userId)

    // Implementar modelo de Ebbinghaus personalizado
    const curve = {
      initialRetention: retentionData.initial || 1.0,
      decayRate: this.calculatePersonalDecayRate(retentionData, personalFactors),
      consolidationFactor: this.calculateConsolidationFactor(personalFactors),
      interferenceResistance: this.calculateInterferenceResistance(personalFactors),
    }

    return curve
  }

  /**
   * Detecta janelas críticas de desenvolvimento
   */
  detectCriticalDevelopmentWindows(historicalData, currentMetrics) {
    const windows = []

    // Janela de sensibilidade para novas habilidades
    if (this.detectSensitivityWindow(historicalData, currentMetrics)) {
      windows.push({
        type: 'sensitivity',
        duration: this.calculateSensitivityDuration(currentMetrics),
        opportunities: this.identifySensitivityOpportunities(currentMetrics),
        urgency: 'high',
      })
    }

    // Janela de consolidação
    if (this.detectConsolidationWindow(historicalData)) {
      windows.push({
        type: 'consolidation',
        duration: this.calculateConsolidationDuration(historicalData),
        focus: this.identifyConsolidationFocus(historicalData),
        urgency: 'medium',
      })
    }

    // Janela de transferência
    if (this.detectTransferWindow(historicalData, currentMetrics)) {
      windows.push({
        type: 'transfer',
        duration: this.calculateTransferDuration(currentMetrics),
        targets: this.identifyTransferTargets(historicalData),
        urgency: 'medium',
      })
    }

    return windows
  }

  // Métodos auxiliares adicionais...
  getDomainNeuroplasticityBaseline(domain) {
    const baselines = {
      memory: 0.8,
      attention: 0.7,
      processing_speed: 0.6,
      pattern_recognition: 0.8,
      executive_function: 0.7,
      cognitive_flexibility: 0.6,
    }
    return baselines[domain] || 0.7
  }

  getAgePlasticityFactors() {
    // Placeholder - em implementação real, considerar idade do usuário
    return 0.9
  }

  getEnvironmentalPlasticityFactors() {
    // Placeholder - em implementação real, considerar fatores ambientais
    return 0.8
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  calculateConsistency(values) {
    const variance = this.calculateVariance(values)
    return 1 / (1 + variance) // Inversely related to variance
  }

  extractDomainScore(sessionData, domain) {
    // Mapear dados da sessão para score do domínio específico
    const mappings = {
      memory: sessionData.memoryScore || sessionData.accuracy,
      attention: sessionData.attentionScore || sessionData.focusLevel,
      processing_speed:
        sessionData.processingScore || (1 / (sessionData.averageResponseTime || 1000)) * 1000,
      pattern_recognition: sessionData.patternScore || sessionData.accuracy,
      cognitive_flexibility: sessionData.flexibilityScore || sessionData.adaptationRate,
    }
    return mappings[domain] || null
  }

  // Métodos de persistência (integração com banco de dados)
  async getBaseline(userId, domain) {
    // Implementar busca no banco de dados
    try {
      // Buscar baseline do banco ou calcular se não existir
      return {
        score: 0.5, // Placeholder
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
      }
    } catch (error) {
      console.error('Erro ao buscar baseline:', error)
      return null
    }
  }

  async updateProgressHistory(userId, improvements) {
    // Implementar salvamento no banco de dados
    try {
      this.progressHistory.set(userId, {
        timestamp: Date.now(),
        improvements,
        neuroplasticityMetrics: this.calculateNeuroplasticityMetrics(improvements),
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar histórico de progresso:', error)
      return false
    }
  }

  async getProgressHistory(userId) {
    // Implementar busca do histórico
    return this.progressHistory.get(userId) || []
  }
}

/**
 * Factory para criar instância do analisador de neuroplasticidade
 */
export const createNeuroplasticityAnalyzer = () => {
  return new NeuroplasticityAnalyzer()
}

/**
 * Hook React para usar análise de neuroplasticidade
 */
export const useNeuroplasticityAnalysis = (userId) => {
  const analyzer = createNeuroplasticityAnalyzer()

  const trackImprovement = async (sessionData, cognitiveProfile) => {
    return await analyzer.trackCognitiveImprovement(userId, sessionData, cognitiveProfile)
  }

  const identifyLearningWindow = async (currentMetrics) => {
    return await analyzer.identifyOptimalLearningWindow(userId, currentMetrics)
  }

  const optimizeConsolidation = async (learningData, memoryProfile) => {
    return await analyzer.optimizeMemoryConsolidation(userId, learningData, memoryProfile)
  }

  const detectBreakthrough = async (recentSessions, historicalBaseline) => {
    return await analyzer.detectCognitiveBreakthrough(userId, recentSessions, historicalBaseline)
  }

  const implementRecovery = async (plateauData, regressionIndicators) => {
    return await analyzer.implementCognitiveRecovery(userId, plateauData, regressionIndicators)
  }

  const optimizeTransfer = async (sourceSkills, targetActivities) => {
    return await analyzer.optimizeLearningTransfer(userId, sourceSkills, targetActivities)
  }

  return {
    trackImprovement,
    identifyLearningWindow,
    optimizeConsolidation,
    detectBreakthrough,
    implementRecovery,
    optimizeTransfer,
    analyzer,
  }
}

export default NeuroplasticityAnalyzer
