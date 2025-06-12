import logger from '../metrics/performanceMonitor.js'
import { getDatabaseConfig } from '../../database/core/DatabaseConfig.js'

class AdaptiveService {
  constructor(crudService, cache, cognitiveAnalyzer, profileService, sessionService) {
    this.crud = crudService
    this.cache = cache
    this.cognitiveAnalyzer = cognitiveAnalyzer
    this.profileService = profileService
    this.sessionService = sessionService
    this.config = getDatabaseConfig()

    // Configurações adaptativas
    this.adaptiveConfig = {
      realTimeAdaptation: true,
      learningEnabled: true,
      autismOptimized: true,
      personalizedThresholds: true,
      continuousImprovement: true,
    }

    // Estratégias adaptativas para autismo
    this.autismStrategies = {
      sensoryRegulation: {
        triggers: ['overstimulation', 'understimulation', 'sensory_seeking'],
        adaptations: ['reduce_stimuli', 'increase_breaks', 'provide_alternatives'],
        thresholds: { stress: 0.7, engagement: 0.3, sensory_load: 0.8 },
      },
      communicationSupport: {
        triggers: ['communication_difficulty', 'social_anxiety', 'language_barriers'],
        adaptations: ['visual_supports', 'simplified_language', 'extra_time'],
        thresholds: { comprehension: 0.5, response_time: 2.0, frustration: 0.6 },
      },
      executiveFunction: {
        triggers: ['task_switching_difficulty', 'working_memory_overload', 'planning_challenges'],
        adaptations: ['step_by_step', 'visual_organizers', 'memory_aids'],
        thresholds: { cognitive_load: 0.7, task_completion: 0.4, error_rate: 0.3 },
      },
      behavioralSupport: {
        triggers: ['repetitive_behaviors', 'transition_difficulty', 'emotional_dysregulation'],
        adaptations: ['routine_supports', 'calming_strategies', 'choice_provision'],
        thresholds: { behavioral_stress: 0.6, routine_disruption: 0.5, emotional_intensity: 0.8 },
      },
    }

    // Estado adaptativo
    this.adaptiveState = new Map()
    this.learningHistory = new Map()

    // Estatísticas
    this.stats = {
      adaptationsTriggered: 0,
      successfulAdaptations: 0,
      learningIterations: 0,
      userSatisfaction: 0,
    }

    logger.info('AdaptiveService initialized with autism-specific strategies')
  }

  // **Sistema de Adaptação Principal**
  async initiateAdaptation(userId, context, options = {}) {
    try {
      const {
        realTime = true,
        strategy = 'comprehensive',
        priority = 'medium',
        userInitiated = false,
      } = options

      // Obter estado atual
      const currentState = await this.getCurrentAdaptiveState(userId)
      const profile = await this.profileService.getProfile(userId)
      const recentSessions = await this.getRecentSessionData(userId)

      // Análise de necessidades adaptativas
      const adaptationNeeds = await this.analyzeAdaptationNeeds(
        userId,
        context,
        currentState,
        profile,
        recentSessions
      )

      // Verificar se adaptação é necessária
      if (!this.shouldTriggerAdaptation(adaptationNeeds, currentState)) {
        logger.debug('No adaptation needed', { userId, context: context.type })
        return { adapted: false, reason: 'no_needs_detected' }
      }

      // Selecionar estratégias adaptativas
      const selectedStrategies = await this.selectAdaptationStrategies(
        adaptationNeeds,
        profile,
        strategy
      )

      // Aplicar adaptações
      const adaptationResults = await this.applyAdaptations(userId, selectedStrategies, context, {
        realTime,
        priority,
      })

      // Registrar adaptação
      await this.recordAdaptation(userId, {
        context,
        needs: adaptationNeeds,
        strategies: selectedStrategies,
        results: adaptationResults,
        timestamp: new Date().toISOString(),
        userInitiated,
      })

      // Atualizar estado adaptativo
      await this.updateAdaptiveState(userId, adaptationResults)

      this.stats.adaptationsTriggered++
      if (adaptationResults.success) {
        this.stats.successfulAdaptations++
      }

      logger.info('Adaptation initiated', {
        userId,
        strategies: selectedStrategies.length,
        success: adaptationResults.success,
        realTime,
      })

      return adaptationResults
    } catch (error) {
      logger.error('Error initiating adaptation', {
        userId,
        error: error.message,
      })
      throw error
    }
  }

  // **Análise de Necessidades Adaptativas**
  async analyzeAdaptationNeeds(userId, context, currentState, profile, sessionData) {
    const needs = {
      sensory: await this.analyzeSensoryNeeds(context, profile, sessionData),
      cognitive: await this.analyzeCognitiveNeeds(context, profile, sessionData),
      communication: await this.analyzeCommunicationNeeds(context, profile, sessionData),
      behavioral: await this.analyzeBehavioralNeeds(context, profile, sessionData),
      environmental: await this.analyzeEnvironmentalNeeds(context, profile, sessionData),
      social: await this.analyzeSocialNeeds(context, profile, sessionData),
    }

    // Análise específica para autismo
    if (profile.autismSpecificData) {
      needs.autismSpecific = await this.analyzeAutismSpecificNeeds(context, profile, sessionData)
    }

    // Priorização das necessidades
    needs.prioritized = await this.prioritizeNeeds(needs, profile, currentState)

    return needs
  }

  async analyzeSensoryNeeds(context, profile, sessionData) {
    const sensoryProfile = profile.sensoryProfile || {}
    const currentLoad = context.sensoryLoad || {}

    return {
      visual: {
        overload: currentLoad.visual > (sensoryProfile.visual?.threshold || 0.8),
        understimulation: currentLoad.visual < (sensoryProfile.visual?.minimum || 0.2),
        adaptations: this.getSensoryAdaptations(
          'visual',
          currentLoad.visual,
          sensoryProfile.visual
        ),
      },
      auditory: {
        overload: currentLoad.auditory > (sensoryProfile.auditory?.threshold || 0.7),
        understimulation: currentLoad.auditory < (sensoryProfile.auditory?.minimum || 0.1),
        adaptations: this.getSensoryAdaptations(
          'auditory',
          currentLoad.auditory,
          sensoryProfile.auditory
        ),
      },
      tactile: {
        overload: currentLoad.tactile > (sensoryProfile.tactile?.threshold || 0.9),
        understimulation: currentLoad.tactile < (sensoryProfile.tactile?.minimum || 0.1),
        adaptations: this.getSensoryAdaptations(
          'tactile',
          currentLoad.tactile,
          sensoryProfile.tactile
        ),
      },
    }
  }

  async analyzeCognitiveNeeds(context, profile, sessionData) {
    const cognitiveLoad = context.cognitiveLoad || 0
    const cognitiveProfile = profile.cognitiveProfile || {}

    return {
      overload: cognitiveLoad > (cognitiveProfile.threshold || 0.7),
      processing: {
        speed: context.processingSpeed < (cognitiveProfile.minimumSpeed || 0.5),
        accuracy: context.accuracy < (cognitiveProfile.targetAccuracy || 0.7),
        workingMemory: context.workingMemoryLoad > (cognitiveProfile.memoryCapacity || 0.8),
      },
      adaptations: await this.getCognitiveAdaptations(cognitiveLoad, cognitiveProfile, context),
    }
  }

  async analyzeCommunicationNeeds(context, profile, sessionData) {
    const communicationProfile = profile.communicationProfile || {}
    const currentCommunication = context.communication || {}

    return {
      comprehension: currentCommunication.comprehensionRate < 0.7,
      expression: currentCommunication.expressionDifficulty > 0.5,
      social: currentCommunication.socialEngagement < 0.6,
      adaptations: await this.getCommunicationAdaptations(
        currentCommunication,
        communicationProfile
      ),
    }
  }

  async analyzeBehavioralNeeds(context, profile, sessionData) {
    const behaviorProfile = profile.behaviorProfile || {}
    const currentBehavior = context.behavior || {}

    return {
      stress: currentBehavior.stressLevel > (behaviorProfile.stressThreshold || 0.6),
      engagement: currentBehavior.engagement < (behaviorProfile.minimumEngagement || 0.5),
      regulation: currentBehavior.selfRegulation < (behaviorProfile.regulationCapacity || 0.6),
      adaptations: await this.getBehavioralAdaptations(currentBehavior, behaviorProfile),
    }
  }

  // **Seleção de Estratégias Adaptativas**
  async selectAdaptationStrategies(needs, profile, strategy) {
    const strategies = []

    // Estratégias baseadas em necessidades sensoriais
    if (needs.sensory) {
      strategies.push(...(await this.selectSensoryStrategies(needs.sensory, profile)))
    }

    // Estratégias baseadas em necessidades cognitivas
    if (needs.cognitive?.overload) {
      strategies.push(...(await this.selectCognitiveStrategies(needs.cognitive, profile)))
    }

    // Estratégias baseadas em necessidades de comunicação
    if (needs.communication) {
      strategies.push(...(await this.selectCommunicationStrategies(needs.communication, profile)))
    }

    // Estratégias baseadas em necessidades comportamentais
    if (needs.behavioral) {
      strategies.push(...(await this.selectBehavioralStrategies(needs.behavioral, profile)))
    }

    // Estratégias específicas para autismo
    if (needs.autismSpecific && profile.autismSpecificData) {
      strategies.push(...(await this.selectAutismSpecificStrategies(needs.autismSpecific, profile)))
    }

    // Filtrar e priorizar estratégias
    const filteredStrategies = await this.filterStrategies(strategies, profile, strategy)
    const prioritizedStrategies = await this.prioritizeStrategies(filteredStrategies, needs)

    return prioritizedStrategies
  }

  async selectSensoryStrategies(sensoryNeeds, profile) {
    const strategies = []

    Object.entries(sensoryNeeds).forEach(([modality, need]) => {
      if (need.overload) {
        strategies.push({
          type: 'sensory_reduction',
          modality,
          intensity: 'high',
          adaptations: need.adaptations?.reduce || [],
        })
      }

      if (need.understimulation) {
        strategies.push({
          type: 'sensory_enhancement',
          modality,
          intensity: 'moderate',
          adaptations: need.adaptations?.increase || [],
        })
      }
    })

    return strategies
  }

  async selectAutismSpecificStrategies(autismNeeds, profile) {
    const strategies = []

    // Estratégias para regulação sensorial
    if (autismNeeds.sensoryRegulation) {
      strategies.push({
        type: 'autism_sensory_regulation',
        interventions: this.autismStrategies.sensoryRegulation.adaptations,
        triggers: autismNeeds.sensoryRegulation.triggers,
        intensity: autismNeeds.sensoryRegulation.severity || 'moderate',
      })
    }

    // Estratégias para suporte à comunicação
    if (autismNeeds.communicationSupport) {
      strategies.push({
        type: 'autism_communication_support',
        interventions: this.autismStrategies.communicationSupport.adaptations,
        visualSupports: true,
        languageSimplification: true,
      })
    }

    // Estratégias para função executiva
    if (autismNeeds.executiveFunction) {
      strategies.push({
        type: 'autism_executive_support',
        interventions: this.autismStrategies.executiveFunction.adaptations,
        structureLevel: 'high',
        memorySupport: true,
      })
    }

    // Estratégias para suporte comportamental
    if (autismNeeds.behavioralSupport) {
      strategies.push({
        type: 'autism_behavioral_support',
        interventions: this.autismStrategies.behavioralSupport.adaptations,
        regulationSupport: true,
        routineSupport: true,
      })
    }

    return strategies
  }

  // **Aplicação de Adaptações**
  async applyAdaptations(userId, strategies, context, options = {}) {
    const { realTime = true, priority = 'medium' } = options
    const results = {
      success: false,
      adaptations: [],
      errors: [],
      metrics: {},
    }

    try {
      // Aplicar cada estratégia
      for (const strategy of strategies) {
        try {
          const adaptationResult = await this.applyIndividualAdaptation(userId, strategy, context, {
            realTime,
            priority,
          })

          results.adaptations.push(adaptationResult)

          if (!adaptationResult.success) {
            results.errors.push({
              strategy: strategy.type,
              error: adaptationResult.error,
            })
          }
        } catch (error) {
          results.errors.push({
            strategy: strategy.type,
            error: error.message,
          })
          logger.error('Error applying individual adaptation', {
            userId,
            strategy: strategy.type,
            error: error.message,
          })
        }
      }

      // Calcular sucesso geral
      const successfulAdaptations = results.adaptations.filter((a) => a.success).length
      results.success = successfulAdaptations > 0

      // Métricas de aplicação
      results.metrics = {
        totalStrategies: strategies.length,
        successfulAdaptations,
        successRate: strategies.length > 0 ? successfulAdaptations / strategies.length : 0,
        applicationTime: Date.now() - context.startTime,
      }

      // Validação pós-aplicação
      if (results.success && realTime) {
        await this.validateAdaptationEffectiveness(userId, results)
      }

      return results
    } catch (error) {
      logger.error('Error applying adaptations', {
        userId,
        error: error.message,
      })
      results.errors.push({ general: error.message })
      return results
    }
  }

  async applyIndividualAdaptation(userId, strategy, context, options) {
    const adaptationResult = {
      strategy: strategy.type,
      success: false,
      changes: [],
      metrics: {},
    }

    try {
      switch (strategy.type) {
        case 'sensory_reduction':
          adaptationResult.changes = await this.applySensoryReduction(strategy, context)
          break
        case 'sensory_enhancement':
          adaptationResult.changes = await this.applySensoryEnhancement(strategy, context)
          break
        case 'cognitive_support':
          adaptationResult.changes = await this.applyCognitiveSupport(strategy, context)
          break
        case 'communication_enhancement':
          adaptationResult.changes = await this.applyCommunicationEnhancement(strategy, context)
          break
        case 'behavioral_regulation':
          adaptationResult.changes = await this.applyBehavioralRegulation(strategy, context)
          break
        case 'autism_sensory_regulation':
          adaptationResult.changes = await this.applyAutismSensoryRegulation(strategy, context)
          break
        case 'autism_communication_support':
          adaptationResult.changes = await this.applyAutismCommunicationSupport(strategy, context)
          break
        case 'autism_executive_support':
          adaptationResult.changes = await this.applyAutismExecutiveSupport(strategy, context)
          break
        case 'autism_behavioral_support':
          adaptationResult.changes = await this.applyAutismBehavioralSupport(strategy, context)
          break
        default:
          throw new Error(`Unknown adaptation strategy: ${strategy.type}`)
      }

      adaptationResult.success = adaptationResult.changes.length > 0

      // Métricas específicas da adaptação
      adaptationResult.metrics = await this.calculateAdaptationMetrics(
        strategy,
        adaptationResult.changes,
        context
      )

      return adaptationResult
    } catch (error) {
      adaptationResult.error = error.message
      return adaptationResult
    }
  }

  // **Aplicações Específicas para Autismo**
  async applyAutismSensoryRegulation(strategy, context) {
    const changes = []

    for (const intervention of strategy.interventions) {
      switch (intervention) {
        case 'reduce_stimulation':
          changes.push({
            type: 'sensory_reduction',
            target: 'all_modalities',
            intensity: 0.3,
            duration: 300000, // 5 minutos
          })
          break
        case 'increase_breaks':
          changes.push({
            type: 'break_schedule',
            frequency: 'every_10_minutes',
            duration: 60000, // 1 minuto
          })
          break
        case 'provide_alternatives':
          changes.push({
            type: 'alternative_activities',
            options: ['fidget_tools', 'quiet_space', 'movement_break'],
          })
          break
      }
    }

    return changes
  }

  async applyAutismCommunicationSupport(strategy, context) {
    const changes = []

    if (strategy.visualSupports) {
      changes.push({
        type: 'visual_supports',
        supports: ['picture_cards', 'visual_schedule', 'social_stories'],
      })
    }

    if (strategy.languageSimplification) {
      changes.push({
        type: 'language_simplification',
        level: 'age_appropriate',
        supports: ['shorter_sentences', 'concrete_language', 'visual_cues'],
      })
    }

    return changes
  }

  async applyAutismExecutiveSupport(strategy, context) {
    const changes = []

    if (strategy.structureLevel === 'high') {
      changes.push({
        type: 'structure_enhancement',
        elements: ['step_by_step', 'visual_organizers', 'task_breakdown'],
      })
    }

    if (strategy.memorySupport) {
      changes.push({
        type: 'memory_support',
        aids: ['visual_reminders', 'audio_prompts', 'written_instructions'],
      })
    }

    return changes
  }

  async applyAutismBehavioralSupport(strategy, context) {
    const changes = []

    if (strategy.regulationSupport) {
      changes.push({
        type: 'regulation_support',
        strategies: ['deep_breathing', 'counting', 'sensory_tools'],
      })
    }

    if (strategy.routineSupport) {
      changes.push({
        type: 'routine_support',
        elements: ['predictable_sequence', 'transition_warnings', 'choice_provision'],
      })
    }

    return changes
  }

  // **Sistema de Aprendizado**
  async updateLearningSystem(userId, adaptationResults, userFeedback) {
    try {
      const learningData = {
        userId,
        timestamp: new Date().toISOString(),
        adaptations: adaptationResults.adaptations,
        effectiveness: await this.calculateEffectiveness(adaptationResults, userFeedback),
        userSatisfaction: userFeedback?.satisfaction || null,
        contextFactors: userFeedback?.context || {},
      }

      // Atualizar histórico de aprendizado
      const userLearning = this.learningHistory.get(userId) || []
      userLearning.push(learningData)

      // Manter apenas os últimos 100 registros
      if (userLearning.length > 100) {
        userLearning.shift()
      }

      this.learningHistory.set(userId, userLearning)

      // Análise de padrões de aprendizado
      const learningPatterns = await this.analyzeLearningPatterns(userId, userLearning)

      // Atualizar modelos adaptativos
      await this.updateAdaptiveModels(userId, learningPatterns)

      this.stats.learningIterations++
      this.stats.userSatisfaction =
        (this.stats.userSatisfaction + (userFeedback?.satisfaction || 0)) / 2

      logger.info('Learning system updated', {
        userId,
        effectiveness: learningData.effectiveness,
        patterns: Object.keys(learningPatterns).length,
      })

      return learningPatterns
    } catch (error) {
      logger.error('Error updating learning system', {
        userId,
        error: error.message,
      })
      throw error
    }
  }

  // **Utilitários**
  shouldTriggerAdaptation(needs, currentState) {
    const criticalNeeds = this.identifyCriticalNeeds(needs)
    const recentAdaptations = currentState.recentAdaptations || []
    const cooldownPeriod = 300000 // 5 minutos

    // Verificar se há necessidades críticas
    if (criticalNeeds.length > 0) {
      return true
    }

    // Verificar cooldown para adaptações não-críticas
    const lastAdaptation = recentAdaptations[0]
    if (lastAdaptation && Date.now() - lastAdaptation.timestamp < cooldownPeriod) {
      return false
    }

    // Verificar se há necessidades suficientes
    const totalNeedScore = this.calculateTotalNeedScore(needs)
    return totalNeedScore > 0.6
  }

  identifyCriticalNeeds(needs) {
    const critical = []

    // Verificar sobrecarga sensorial crítica
    if (needs.sensory?.visual?.overload || needs.sensory?.auditory?.overload) {
      critical.push('sensory_overload')
    }

    // Verificar stress comportamental alto
    if (needs.behavioral?.stress) {
      critical.push('behavioral_stress')
    }

    // Verificar sobrecarga cognitiva
    if (needs.cognitive?.overload) {
      critical.push('cognitive_overload')
    }

    return critical
  }

  calculateTotalNeedScore(needs) {
    let score = 0
    let count = 0

    Object.values(needs).forEach((category) => {
      if (typeof category === 'object' && category !== null) {
        Object.values(category).forEach((need) => {
          if (typeof need === 'boolean' && need) {
            score += 1
            count += 1
          } else if (typeof need === 'number') {
            score += need
            count += 1
          }
        })
      }
    })

    return count > 0 ? score / count : 0
  }

  // **Placeholder methods para funcionalidades futuras**
  async getCurrentAdaptiveState(userId) {
    return {}
  }
  async getRecentSessionData(userId) {
    return []
  }
  async analyzeEnvironmentalNeeds(context, profile, sessionData) {
    return {}
  }
  async analyzeSocialNeeds(context, profile, sessionData) {
    return {}
  }
  async analyzeAutismSpecificNeeds(context, profile, sessionData) {
    return {}
  }
  async prioritizeNeeds(needs, profile, currentState) {
    return []
  }
  getSensoryAdaptations(modality, currentLoad, profile) {
    return {}
  }
  async getCognitiveAdaptations(cognitiveLoad, profile, context) {
    return []
  }
  async getCommunicationAdaptations(communication, profile) {
    return []
  }
  async getBehavioralAdaptations(behavior, profile) {
    return []
  }
  async selectCognitiveStrategies(needs, profile) {
    return []
  }
  async selectCommunicationStrategies(needs, profile) {
    return []
  }
  async selectBehavioralStrategies(needs, profile) {
    return []
  }
  async filterStrategies(strategies, profile, strategy) {
    return strategies
  }
  async prioritizeStrategies(strategies, needs) {
    return strategies
  }
  async applySensoryReduction(strategy, context) {
    return []
  }
  async applySensoryEnhancement(strategy, context) {
    return []
  }
  async applyCognitiveSupport(strategy, context) {
    return []
  }
  async applyCommunicationEnhancement(strategy, context) {
    return []
  }
  async applyBehavioralRegulation(strategy, context) {
    return []
  }
  async calculateAdaptationMetrics(strategy, changes, context) {
    return {}
  }
  async validateAdaptationEffectiveness(userId, results) {
    return true
  }
  async recordAdaptation(userId, adaptationData) {}
  async updateAdaptiveState(userId, results) {}
  async calculateEffectiveness(results, feedback) {
    return 0.5
  }
  async analyzeLearningPatterns(userId, history) {
    return {}
  }
  async updateAdaptiveModels(userId, patterns) {}

  // **Estatísticas**
  getAdaptiveStatistics() {
    return {
      ...this.stats,
      adaptationSuccessRate:
        this.stats.adaptationsTriggered > 0
          ? this.stats.successfulAdaptations / this.stats.adaptationsTriggered
          : 0,
      learningEfficiency:
        this.stats.learningIterations > 0
          ? this.stats.userSatisfaction / this.stats.learningIterations
          : 0,
      activeUsers: this.adaptiveState.size,
      learningUsers: this.learningHistory.size,
    }
  }

  resetStatistics() {
    Object.keys(this.stats).forEach((key) => {
      this.stats[key] = 0
    })
  }
}

export default AdaptiveService
