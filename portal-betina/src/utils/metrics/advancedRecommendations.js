// Sistema Avançado de Recomendações Adaptativas
// Algoritmos inteligentes para personalização dinâmica baseada em ML e padrões comportamentais

import { createAdaptiveModel } from '../adaptive/adaptiveML.js'
import neuropedagogicalAnalyzer from './neuropedagogicalInsights.js'
import multisensoryMetrics from '../multisensoryAnalysis/index.js'

export class AdvancedRecommendationEngine {
  constructor() {
    this.recommendationTypes = {
      DIFFICULTY: 'difficulty_adjustment',
      MODALITY: 'sensory_modality',
      PACING: 'task_pacing',
      FEEDBACK: 'feedback_type',
      CONTENT: 'content_adaptation',
      INTERFACE: 'interface_modification',
      THERAPEUTIC: 'therapeutic_intervention',
    }

    this.confidenceLevels = {
      HIGH: 0.8,
      MEDIUM: 0.6,
      LOW: 0.4,
    }

    this.adaptationStrategies = {
      IMMEDIATE: 'immediate_response',
      GRADUAL: 'gradual_transition',
      SCHEDULED: 'scheduled_change',
      CONDITIONAL: 'conditional_trigger',
    }

    this.userProfiles = new Map()
    this.sessionHistory = new Map()
    this.realTimeAdaptations = new Map()
  }

  // Inicializar engine para um usuário específico
  async initializeForUser(userId, userProfile = null) {
    try {
      if (userProfile) {
        this.userProfiles.set(userId, userProfile)
      } else {
        // Carregar perfil existente ou criar novo
        const profile = await this.loadOrCreateUserProfile(userId)
        this.userProfiles.set(userId, profile)
      }

      console.log(`🤖 Engine de recomendações inicializada para usuário: ${userId}`)
      return true
    } catch (error) {
      console.error('Erro ao inicializar engine de recomendações:', error)
      return false
    }
  }

  // Gerar recomendações em tempo real baseadas na sessão atual
  generateRealTimeRecommendations(sessionData) {
    const userId = sessionData.userId
    const userProfile = this.userProfiles.get(userId)

    if (!userProfile) {
      console.warn(`Perfil não encontrado para usuário ${userId}`)
      return []
    }

    const recommendations = []

    // Análise de performance em tempo real
    const performanceAnalysis = this.analyzeRealTimePerformance(sessionData)

    // Recomendações baseadas em dificuldade
    const difficultyRecs = this.generateDifficultyRecommendations(
      performanceAnalysis,
      userProfile,
      sessionData
    )
    recommendations.push(...difficultyRecs)

    // Recomendações baseadas em modalidade sensorial
    const modalityRecs = this.generateModalityRecommendations(
      sessionData.sensoryInteractions,
      userProfile.sensoryPreferences
    )
    recommendations.push(...modalityRecs)

    // Recomendações baseadas em engagement
    const engagementRecs = this.generateEngagementRecommendations(
      sessionData.engagementMetrics,
      userProfile.motivationFactors
    )
    recommendations.push(...engagementRecs)

    // Recomendações baseadas em padrões de erro
    const errorRecs = this.generateErrorPatternRecommendations(
      sessionData.errorPatterns,
      userProfile.learningStrategies
    )
    recommendations.push(...errorRecs)

    // Filtrar e priorizar recomendações
    const prioritizedRecs = this.prioritizeRecommendations(recommendations, sessionData)

    // Armazenar para análise futura
    this.storeRecommendations(userId, prioritizedRecs, sessionData)

    return prioritizedRecs
  }

  // Gerar recomendações para próxima sessão
  generateNextSessionRecommendations(userId, historicalData) {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) return []

    const recommendations = []

    // Análise de tendências históricas
    const trendAnalysis = this.analyzeLongTermTrends(historicalData)

    // Recomendações baseadas em progressão
    const progressionRecs = this.generateProgressionRecommendations(trendAnalysis, userProfile)
    recommendations.push(...progressionRecs)

    // Recomendações terapêuticas
    const therapeuticRecs = this.generateTherapeuticRecommendations(
      userProfile.cognitiveProfile,
      trendAnalysis
    )
    recommendations.push(...therapeuticRecs)

    // Recomendações de personalização
    const personalizationRecs = this.generatePersonalizationRecommendations(
      userProfile,
      historicalData
    )
    recommendations.push(...personalizationRecs)

    return this.prioritizeRecommendations(recommendations, { userId, type: 'next_session' })
  }

  // Analisar performance em tempo real
  analyzeRealTimePerformance(sessionData) {
    const analysis = {
      currentAccuracy: 0,
      responseTimePattern: 'stable',
      frustrationLevel: 0,
      engagementLevel: 0,
      cognitiveLoad: 0,
      adaptationNeeded: false,
    }
    // Calcular precisão atual
    if (sessionData.attempts && sessionData.successes) {
      const tries = Number(sessionData.attempts) || 0
      analysis.currentAccuracy = tries ? (sessionData.successes / tries) * 100 : 0
    }

    // Analisar padrão de tempo de resposta
    if (sessionData.responseTimes && sessionData.responseTimes.length > 0) {
      const recentTimes = sessionData.responseTimes.slice(-5)
      const avgTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length
      const timeVariation = this.calculateVariation(recentTimes)

      if (timeVariation > 0.3) {
        analysis.responseTimePattern = 'inconsistent'
      } else if (avgTime > 8000) {
        analysis.responseTimePattern = 'slow'
      } else if (avgTime < 1000) {
        analysis.responseTimePattern = 'impulsive'
      }
    }

    // Estimar níveis comportamentais
    analysis.frustrationLevel = this.estimateFrustrationLevel(sessionData)
    analysis.engagementLevel = this.estimateEngagementLevel(sessionData)
    analysis.cognitiveLoad = this.estimateCognitiveLoad(sessionData)

    // Determinar se adaptação é necessária
    analysis.adaptationNeeded =
      analysis.frustrationLevel > 70 ||
      analysis.engagementLevel < 30 ||
      analysis.cognitiveLoad > 80 ||
      analysis.currentAccuracy < 30

    return analysis
  }

  // Gerar recomendações de dificuldade
  generateDifficultyRecommendations(performanceAnalysis, userProfile, sessionData) {
    const recommendations = []

    const currentDifficulty = sessionData.currentDifficulty || 'medium'
    const accuracy = performanceAnalysis.currentAccuracy
    const frustration = performanceAnalysis.frustrationLevel
    const cognitiveLoad = performanceAnalysis.cognitiveLoad

    // Lógica avançada para ajuste de dificuldade
    if (accuracy > 85 && frustration < 30 && cognitiveLoad < 60) {
      // Performance excelente - pode aumentar dificuldade
      recommendations.push({
        type: this.recommendationTypes.DIFFICULTY,
        action: 'increase_difficulty',
        confidence: this.confidenceLevels.HIGH,
        strategy: this.adaptationStrategies.GRADUAL,
        details: {
          currentLevel: currentDifficulty,
          recommendedLevel: this.getNextDifficultyLevel(currentDifficulty, 'up'),
          reasoning: 'Performance consistentemente alta com baixa frustração',
          implementation: 'gradual_introduction_complex_elements',
        },
        priority: 'medium',
        timing: 'next_round',
      })
    } else if (accuracy < 40 || frustration > 70 || cognitiveLoad > 80) {
      // Performance baixa ou alta frustração - diminuir dificuldade
      recommendations.push({
        type: this.recommendationTypes.DIFFICULTY,
        action: 'decrease_difficulty',
        confidence: this.confidenceLevels.HIGH,
        strategy: this.adaptationStrategies.IMMEDIATE,
        details: {
          currentLevel: currentDifficulty,
          recommendedLevel: this.getNextDifficultyLevel(currentDifficulty, 'down'),
          reasoning: 'Performance baixa ou alta frustração detectada',
          implementation: 'immediate_simplification',
        },
        priority: 'high',
        timing: 'immediate',
      })
    } else if (performanceAnalysis.responseTimePattern === 'slow') {
      // Tempo de resposta lento - ajustar ritmo
      recommendations.push({
        type: this.recommendationTypes.PACING,
        action: 'adjust_pacing',
        confidence: this.confidenceLevels.MEDIUM,
        strategy: this.adaptationStrategies.GRADUAL,
        details: {
          issue: 'slow_response_times',
          recommendation: 'extend_time_limits',
          implementation: 'increase_response_time_allowance',
        },
        priority: 'medium',
        timing: 'next_round',
      })
    }

    return recommendations
  }

  // Gerar recomendações de modalidade sensorial
  generateModalityRecommendations(sensoryInteractions, sensoryPreferences) {
    const recommendations = []

    if (!sensoryInteractions || !sensoryPreferences) return recommendations

    // Analisar uso de modalidades
    const modalityUsage = this.analyzeModalityUsage(sensoryInteractions)

    // Recomendar modalidade preferida se não está sendo usada
    if (sensoryPreferences.preferred === 'auditory' && modalityUsage.auditory < 0.3) {
      recommendations.push({
        type: this.recommendationTypes.MODALITY,
        action: 'increase_auditory_elements',
        confidence: this.confidenceLevels.HIGH,
        strategy: this.adaptationStrategies.GRADUAL,
        details: {
          currentUsage: modalityUsage.auditory,
          preferredModality: 'auditory',
          suggestion: 'add_more_sound_cues_and_verbal_feedback',
          implementation: 'enable_tts_increase_sound_feedback',
        },
        priority: 'medium',
        timing: 'next_round',
      })
    } else if (sensoryPreferences.preferred === 'visual' && modalityUsage.visual < 0.3) {
      recommendations.push({
        type: this.recommendationTypes.MODALITY,
        action: 'increase_visual_elements',
        confidence: this.confidenceLevels.HIGH,
        strategy: this.adaptationStrategies.GRADUAL,
        details: {
          currentUsage: modalityUsage.visual,
          preferredModality: 'visual',
          suggestion: 'enhance_visual_cues_and_animations',
          implementation: 'add_visual_highlights_increase_contrast',
        },
        priority: 'medium',
        timing: 'next_round',
      })
    }

    // Recomendar modalidade múltipla se performance está baixa
    if (modalityUsage.overall_effectiveness < 0.5) {
      recommendations.push({
        type: this.recommendationTypes.MODALITY,
        action: 'enable_multimodal_support',
        confidence: this.confidenceLevels.MEDIUM,
        strategy: this.adaptationStrategies.IMMEDIATE,
        details: {
          issue: 'low_single_modality_effectiveness',
          suggestion: 'combine_visual_auditory_tactile_feedback',
          implementation: 'activate_all_sensory_channels',
        },
        priority: 'high',
        timing: 'immediate',
      })
    }

    return recommendations
  }

  // Gerar recomendações de engagement
  generateEngagementRecommendations(engagementMetrics, motivationFactors) {
    const recommendations = []

    if (!engagementMetrics) return recommendations

    const currentEngagement = engagementMetrics.currentLevel || 50
    const engagementTrend = engagementMetrics.trend || 'stable'

    if (currentEngagement < 40) {
      // Baixo engagement - ações imediatas
      if (motivationFactors.respondsTo.includes('gamification')) {
        recommendations.push({
          type: this.recommendationTypes.CONTENT,
          action: 'increase_gamification',
          confidence: this.confidenceLevels.HIGH,
          strategy: this.adaptationStrategies.IMMEDIATE,
          details: {
            currentEngagement,
            motivationStyle: 'gamification',
            suggestion: 'add_points_badges_celebrations',
            implementation: 'activate_reward_system',
          },
          priority: 'high',
          timing: 'immediate',
        })
      }

      if (motivationFactors.respondsTo.includes('social_interaction')) {
        recommendations.push({
          type: this.recommendationTypes.CONTENT,
          action: 'add_social_elements',
          confidence: this.confidenceLevels.MEDIUM,
          strategy: this.adaptationStrategies.IMMEDIATE,
          details: {
            currentEngagement,
            motivationStyle: 'social',
            suggestion: 'introduce_character_interactions',
            implementation: 'add_virtual_companion',
          },
          priority: 'medium',
          timing: 'next_round',
        })
      }
    } else if (engagementTrend === 'declining') {
      // Engagement em declínio - prevenção
      recommendations.push({
        type: this.recommendationTypes.PACING,
        action: 'adjust_session_pacing',
        confidence: this.confidenceLevels.MEDIUM,
        strategy: this.adaptationStrategies.GRADUAL,
        details: {
          trend: 'declining_engagement',
          suggestion: 'introduce_variety_and_breaks',
          implementation: 'change_activity_type_add_breaks',
        },
        priority: 'medium',
        timing: 'next_round',
      })
    }

    return recommendations
  }

  // Gerar recomendações baseadas em padrões de erro
  generateErrorPatternRecommendations(errorPatterns, learningStrategies) {
    const recommendations = []

    if (!errorPatterns || errorPatterns.length === 0) return recommendations

    // Analisar tipos de erro mais frequentes
    const errorAnalysis = this.analyzeErrorPatterns(errorPatterns)

    if (errorAnalysis.consecutiveErrors > 3) {
      recommendations.push({
        type: this.recommendationTypes.FEEDBACK,
        action: 'provide_immediate_support',
        confidence: this.confidenceLevels.HIGH,
        strategy: this.adaptationStrategies.IMMEDIATE,
        details: {
          issue: 'consecutive_errors',
          count: errorAnalysis.consecutiveErrors,
          suggestion: 'provide_step_by_step_guidance',
          implementation: 'activate_guided_mode',
        },
        priority: 'high',
        timing: 'immediate',
      })
    }

    if (errorAnalysis.patternType === 'conceptual') {
      recommendations.push({
        type: this.recommendationTypes.THERAPEUTIC,
        action: 'address_conceptual_gap',
        confidence: this.confidenceLevels.MEDIUM,
        strategy: this.adaptationStrategies.SCHEDULED,
        details: {
          errorType: 'conceptual_misunderstanding',
          suggestion: 'provide_additional_examples_and_practice',
          implementation: 'schedule_remedial_activities',
        },
        priority: 'medium',
        timing: 'next_session',
      })
    } else if (errorAnalysis.patternType === 'attention') {
      recommendations.push({
        type: this.recommendationTypes.INTERFACE,
        action: 'reduce_distractions',
        confidence: this.confidenceLevels.HIGH,
        strategy: this.adaptationStrategies.IMMEDIATE,
        details: {
          errorType: 'attention_related',
          suggestion: 'simplify_interface_increase_focus_cues',
          implementation: 'activate_focus_mode',
        },
        priority: 'high',
        timing: 'immediate',
      })
    }

    return recommendations
  }

  // Priorizar recomendações baseado em contexto
  prioritizeRecommendations(recommendations, context) {
    // Critérios de priorização
    const priorityWeights = {
      immediate_safety: 1.0,
      high_confidence_high_priority: 0.9,
      frustration_intervention: 0.8,
      engagement_critical: 0.7,
      performance_improvement: 0.6,
      optimization: 0.5,
      exploratory: 0.3,
    }

    const scoredRecommendations = recommendations.map((rec) => {
      let score = 0

      // Score baseado na prioridade declarada
      if (rec.priority === 'high') score += 0.4
      else if (rec.priority === 'medium') score += 0.2

      // Score baseado na confiança
      score += rec.confidence * 0.3

      // Score baseado no timing
      if (rec.timing === 'immediate') score += 0.3
      else if (rec.timing === 'next_round') score += 0.2

      // Score baseado no tipo de recomendação
      if (
        rec.type === this.recommendationTypes.DIFFICULTY &&
        context.currentPerformance === 'struggling'
      ) {
        score += 0.3
      }

      if (rec.type === this.recommendationTypes.THERAPEUTIC) {
        score += 0.2
      }

      return { ...rec, priorityScore: score }
    })

    // Ordenar por score de prioridade
    return scoredRecommendations.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 10) // Limitar a 10 recomendações principais
  }

  // Métodos auxiliares
  loadOrCreateUserProfile(userId) {
    // Implementação seria conectar com banco de dados
    return {
      userId,
      cognitiveProfile: {
        processingSpeed: 'average',
        workingMemory: 'above_average',
        attention: 'variable',
        executiveFunction: 'developing',
      },
      sensoryPreferences: {
        preferred: 'visual',
        secondary: 'auditory',
        tolerance: { visual: 0.8, auditory: 0.7, tactile: 0.6 },
      },
      learningStrategies: {
        effective: ['visual_cues', 'repetition', 'scaffolding'],
        ineffective: ['time_pressure', 'complex_instructions'],
      },
      motivationFactors: {
        respondsTo: ['gamification', 'positive_feedback', 'choice'],
        demotivatedBy: ['criticism', 'comparison', 'time_limits'],
      },
    }
  }

  getNextDifficultyLevel(current, direction) {
    const levels = ['easy', 'medium', 'hard']
    const currentIndex = levels.indexOf(current)

    if (direction === 'up' && currentIndex < levels.length - 1) {
      return levels[currentIndex + 1]
    } else if (direction === 'down' && currentIndex > 0) {
      return levels[currentIndex - 1]
    }

    return current
  }

  calculateVariation(values) {
    if (values.length < 2) return 0

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    return mean === 0 ? 0 : stdDev / mean
    return stdDev / mean // Coeficiente de variação
  }

  estimateFrustrationLevel(sessionData) {
    let frustration = 0

    // Baseado em erros consecutivos
    if (sessionData.consecutiveErrors) {
      frustration += Math.min(sessionData.consecutiveErrors * 15, 60)
    }

    // Baseado em tempo sem sucesso
    if (sessionData.timeWithoutSuccess > 120000) {
      // 2 minutos
      frustration += 30
    }

    // Baseado em variabilidade de performance
    if (sessionData.performanceVariability > 0.5) {
      frustration += 20
    }

    return Math.min(frustration, 100)
  }

  estimateEngagementLevel(sessionData) {
    let engagement = 50 // Base

    // Baseado em frequência de interações
    if (sessionData.interactionFrequency > 1) {
      // Por segundo
      engagement += 30
    } else if (sessionData.interactionFrequency < 0.5) {
      engagement -= 20
    }

    // Baseado em tempo de resposta
    if (sessionData.avgResponseTime < 3000) {
      engagement += 20
    } else if (sessionData.avgResponseTime > 10000) {
      engagement -= 30
    }

    return Math.max(0, Math.min(engagement, 100))
  }

  estimateCognitiveLoad(sessionData) {
    let load = 50 // Base

    // Baseado em variabilidade de performance
    if (sessionData.performanceVariability > 0.4) {
      load += 30
    }

    // Baseado em tempo de resposta
    if (sessionData.avgResponseTime > 8000) {
      load += 20
    }

    return Math.min(load, 100)
  }

  analyzeModalityUsage(interactions) {
    const total = interactions.length
    if (total === 0) return { visual: 0, auditory: 0, tactile: 0, overall_effectiveness: 0 }

    const visual = interactions.filter((i) => i.type === 'visual').length / total
    const auditory = interactions.filter((i) => i.type === 'auditory').length / total
    const tactile = interactions.filter((i) => i.type === 'tactile').length / total

    const effectiveness = interactions.filter((i) => i.successful).length / total

    return { visual, auditory, tactile, overall_effectiveness: effectiveness }
  }

  analyzeErrorPatterns(errorPatterns) {
    const analysis = {
      consecutiveErrors: 0,
      patternType: 'random',
      frequency: errorPatterns.length,
      recovery: 0,
    }

    // Contar erros consecutivos
    let consecutive = 0
    let maxConsecutive = 0

    for (const error of errorPatterns) {
      if (error.type === 'incorrect_response') {
        consecutive++
        maxConsecutive = Math.max(maxConsecutive, consecutive)
      } else {
        consecutive = 0
      }
    }

    analysis.consecutiveErrors = maxConsecutive

    // Determinar tipo de padrão
    const errorTypes = errorPatterns.map((e) => e.category || 'unknown')
    const typeFrequency = {}

    errorTypes.forEach((type) => {
      typeFrequency[type] = (typeFrequency[type] || 0) + 1
    })

    const dominantType = Object.keys(typeFrequency).reduce((a, b) =>
      typeFrequency[a] > typeFrequency[b] ? a : b
    )

    if (typeFrequency[dominantType] / errorPatterns.length > 0.6) {
      analysis.patternType = dominantType
    }

    return analysis
  }

  storeRecommendations(userId, recommendations, sessionData) {
    // Implementação para armazenar recomendações para análise futura
    console.log(`📊 Armazenando ${recommendations.length} recomendações para usuário ${userId}`)
  }

  analyzeLongTermTrends(historicalData) {
    // Implementação para análise de tendências de longo prazo
    return {
      performanceTrend: 'improving',
      consistencyTrend: 'stable',
      engagementTrend: 'high',
      difficultyProgression: 'appropriate',
    }
  }

  generateProgressionRecommendations(trendAnalysis, userProfile) {
    // Implementação para recomendações de progressão
    return []
  }

  generateTherapeuticRecommendations(cognitiveProfile, trendAnalysis) {
    // Implementação para recomendações terapêuticas
    return []
  }

  generatePersonalizationRecommendations(userProfile, historicalData) {
    // Implementação para recomendações de personalização
    return []
  }
}

export const recommendationEngine = new AdvancedRecommendationEngine()
export default recommendationEngine
