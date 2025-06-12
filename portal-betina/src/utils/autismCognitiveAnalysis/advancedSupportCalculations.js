/**
 * @file utils/advancedSupportCalculations.js
 * @description Algoritmos avançados para cálculo de níveis de suporte
 * 🎯 FASE 1 - PRIORIDADE ALTA: Sistema de Suporte Personalizado
 */

/**
 * 🧠 Classe para cálculos avançados de suporte específicos para autismo
 */
class AdvancedSupportCalculator {
  constructor() {
    this.supportProfiles = new Map()
    this.calculationHistory = new Map()
    this.isInitialized = false
  }

  /**
   * Inicializa o calculador
   */
  async initialize() {
    this.isInitialized = true
    console.log('🎯 AdvancedSupportCalculator inicializado')
    return true
  }

  /**
   * 🎯 Calcula nível de suporte visual específico para autismo
   * @param {Object} preferences - Preferências e dados do usuário
   * @returns {Object} Análise detalhada do suporte visual necessário
   */
  calculateVisualSupportLevel(preferences) {
    const {
      visualProcessingSpeed = 0.5,
      visualAttention = 0.5,
      visualMemory = 0.5,
      sensorySensitivity = 0.5,
      comprehensionLevel = 0.5,
      needsHighContrast = false,
      prefersSimpleLayouts = false,
      motionSensitive = false,
    } = preferences

    // Algoritmo avançado de suporte visual
    let supportLevel = 0
    let recommendations = []
    let adaptations = []

    // Fator 1: Velocidade de processamento visual (peso 25%)
    if (visualProcessingSpeed < 0.3) {
      supportLevel += 0.8 * 0.25
      recommendations.push('extended_visual_presentation_time')
      adaptations.push('slow_transitions')
    } else if (visualProcessingSpeed < 0.6) {
      supportLevel += 0.5 * 0.25
      recommendations.push('moderate_visual_pacing')
    } else {
      supportLevel += 0.2 * 0.25
    }

    // Fator 2: Atenção visual (peso 20%)
    if (visualAttention < 0.4) {
      supportLevel += 0.8 * 0.2
      recommendations.push('visual_focus_aids', 'distraction_reduction')
      adaptations.push('simplified_backgrounds', 'highlighted_targets')
    } else if (visualAttention < 0.7) {
      supportLevel += 0.5 * 0.2
      recommendations.push('attention_guides')
    }

    // Fator 3: Memória visual (peso 20%)
    if (visualMemory < 0.4) {
      supportLevel += 0.7 * 0.2
      recommendations.push('visual_memory_aids', 'reference_materials')
      adaptations.push('persistent_visual_cues', 'step_by_step_guides')
    }

    // Fator 4: Sensibilidade sensorial (peso 20%)
    if (sensorySensitivity > 0.7 || motionSensitive) {
      supportLevel += 0.8 * 0.2
      recommendations.push('reduced_visual_stimulation', 'calming_colors')
      adaptations.push('minimal_animations', 'soft_transitions')
    } else if (sensorySensitivity > 0.5) {
      supportLevel += 0.5 * 0.2
      recommendations.push('moderate_stimulation_control')
    }

    // Fator 5: Nível de compreensão (peso 15%)
    if (comprehensionLevel < 0.4) {
      supportLevel += 0.7 * 0.15
      recommendations.push('pictorial_instructions', 'visual_scaffolding')
      adaptations.push('icon_based_navigation', 'visual_feedback')
    }

    // Ajustes específicos para preferências
    if (needsHighContrast) {
      adaptations.push('high_contrast_mode', 'bold_outlines')
    }
    if (prefersSimpleLayouts) {
      adaptations.push('minimalist_design', 'clear_hierarchy')
    }

    // Classificação do nível de suporte
    let level = 'minimal'
    if (supportLevel >= 0.7) level = 'extensive'
    else if (supportLevel >= 0.5) level = 'substantial'
    else if (supportLevel >= 0.3) level = 'moderate'

    return {
      level,
      score: supportLevel,
      recommendations,
      adaptations,
      specificNeeds: {
        processingSupport: visualProcessingSpeed < 0.5,
        attentionSupport: visualAttention < 0.6,
        memorySupport: visualMemory < 0.5,
        sensoryAccommodation: sensorySensitivity > 0.6,
        comprehensionAids: comprehensionLevel < 0.5,
      },
      autismOptimizations: {
        reduceVisualClutter: true,
        providePredictableLayouts: true,
        useConsistentVisualLanguage: true,
        offerVisualChoices: supportLevel > 0.4,
      },
    }
  }

  /**
   * 🎯 Calcula nível de suporte auditivo específico para autismo
   * @param {Object} preferences - Preferências e dados do usuário
   * @returns {Object} Análise detalhada do suporte auditivo necessário
   */
  calculateAuditorySupportLevel(preferences) {
    const {
      auditoryProcessing = 0.5,
      soundSensitivity = 0.5,
      speechComprehension = 0.5,
      auditoryMemory = 0.5,
      backgroundNoiseFiltering = 0.5,
      needsRepeatedInstructions = false,
      prefersVisualCues = false,
    } = preferences

    let supportLevel = 0
    let recommendations = []
    let adaptations = []

    // Fator 1: Processamento auditivo (peso 30%)
    if (auditoryProcessing < 0.3) {
      supportLevel += 0.9 * 0.3
      recommendations.push('visual_alternatives', 'text_based_instructions')
      adaptations.push('minimize_audio_reliance', 'visual_confirmation')
    } else if (auditoryProcessing < 0.6) {
      supportLevel += 0.6 * 0.3
      recommendations.push('supplementary_visual_cues', 'slower_speech')
    }

    // Fator 2: Sensibilidade sonora (peso 25%)
    if (soundSensitivity > 0.7) {
      supportLevel += 0.8 * 0.25
      recommendations.push('volume_control', 'sound_dampening')
      adaptations.push('optional_audio', 'quiet_environments')
    } else if (soundSensitivity > 0.5) {
      supportLevel += 0.5 * 0.25
      recommendations.push('volume_adjustment_options')
    }

    // Fator 3: Compreensão da fala (peso 25%)
    if (speechComprehension < 0.4) {
      supportLevel += 0.8 * 0.25
      recommendations.push('simplified_language', 'key_word_emphasis')
      adaptations.push('pictorial_communication', 'gesture_support')
    }

    // Fator 4: Memória auditiva (peso 20%)
    if (auditoryMemory < 0.4) {
      supportLevel += 0.7 * 0.2
      recommendations.push('written_summaries', 'audio_replay_options')
      adaptations.push('persistent_visual_reminders')
    }

    // Ajustes para preferências específicas
    if (needsRepeatedInstructions) {
      adaptations.push('instruction_repetition', 'audio_loops')
    }
    if (prefersVisualCues) {
      adaptations.push('visual_audio_indicators', 'sound_visualization')
    }

    let level = 'minimal'
    if (supportLevel >= 0.7) level = 'extensive'
    else if (supportLevel >= 0.5) level = 'substantial'
    else if (supportLevel >= 0.3) level = 'moderate'

    return {
      level,
      score: supportLevel,
      recommendations,
      adaptations,
      specificNeeds: {
        processingSupport: auditoryProcessing < 0.5,
        sensitivityAccommodation: soundSensitivity > 0.6,
        comprehensionAids: speechComprehension < 0.5,
        memorySupport: auditoryMemory < 0.5,
      },
      autismOptimizations: {
        provideVisualAlternatives: auditoryProcessing < 0.6,
        controlAuditoryEnvironment: soundSensitivity > 0.5,
        useSimpleLanguage: speechComprehension < 0.6,
        offerAudioControls: true,
      },
    }
  }

  /**
   * 🎯 Calcula nível de suporte cognitivo específico para autismo
   * @param {Object} preferences - Preferências e dados do usuário
   * @returns {Object} Análise detalhada do suporte cognitivo necessário
   */
  calculateCognitiveSupportLevel(preferences) {
    const {
      executiveFunction = 0.5,
      processingSpeed = 0.5,
      workingMemory = 0.5,
      attention = 0.5,
      flexibility = 0.5,
      problemSolving = 0.5,
      needsStructure = false,
      benefitsFromBreaks = false,
    } = preferences

    let supportLevel = 0
    let recommendations = []
    let adaptations = []

    // Fator 1: Função executiva (peso 25%)
    if (executiveFunction < 0.3) {
      supportLevel += 0.9 * 0.25
      recommendations.push('external_structure', 'step_by_step_guidance')
      adaptations.push('task_breakdown', 'progress_visualization')
    } else if (executiveFunction < 0.6) {
      supportLevel += 0.6 * 0.25
      recommendations.push('organizational_aids', 'planning_support')
    }

    // Fator 2: Velocidade de processamento (peso 20%)
    if (processingSpeed < 0.3) {
      supportLevel += 0.8 * 0.2
      recommendations.push('extended_time', 'reduced_cognitive_load')
      adaptations.push('simplified_tasks', 'extra_processing_time')
    } else if (processingSpeed < 0.6) {
      supportLevel += 0.5 * 0.2
      recommendations.push('flexible_pacing')
    }

    // Fator 3: Memória de trabalho (peso 20%)
    if (workingMemory < 0.4) {
      supportLevel += 0.8 * 0.2
      recommendations.push('external_memory_aids', 'information_chunking')
      adaptations.push('visual_organizers', 'step_reminders')
    }

    // Fator 4: Atenção (peso 20%)
    if (attention < 0.4) {
      supportLevel += 0.7 * 0.2
      recommendations.push('attention_supports', 'distraction_reduction')
      adaptations.push('focus_cues', 'attention_breaks')
    }

    // Fator 5: Flexibilidade cognitiva (peso 15%)
    if (flexibility < 0.3) {
      supportLevel += 0.8 * 0.15
      recommendations.push('transition_preparation', 'choice_provision')
      adaptations.push('predictable_routines', 'change_warnings')
    }

    // Ajustes para necessidades específicas
    if (needsStructure) {
      adaptations.push('structured_environments', 'clear_expectations')
    }
    if (benefitsFromBreaks) {
      adaptations.push('regular_breaks', 'self_paced_activities')
    }

    let level = 'minimal'
    if (supportLevel >= 0.7) level = 'extensive'
    else if (supportLevel >= 0.5) level = 'substantial'
    else if (supportLevel >= 0.3) level = 'moderate'

    return {
      level,
      score: supportLevel,
      recommendations,
      adaptations,
      specificNeeds: {
        executiveSupport: executiveFunction < 0.5,
        processingSupport: processingSpeed < 0.5,
        memorySupport: workingMemory < 0.5,
        attentionSupport: attention < 0.5,
        flexibilitySupport: flexibility < 0.4,
      },
      autismOptimizations: {
        provideStructure: executiveFunction < 0.6,
        allowExtraTime: processingSpeed < 0.6,
        useExternalMemoryAids: workingMemory < 0.6,
        minimizeDistractions: attention < 0.6,
        prepareForChanges: flexibility < 0.5,
      },
    }
  }

  /**
   * 🎯 Calcula nível de suporte sensorial específico para autismo
   * @param {Object} preferences - Preferências e dados do usuário
   * @returns {Object} Análise detalhada do suporte sensorial necessário
   */
  calculateSensorySupportLevel(preferences) {
    const {
      visualSensitivity = 0.5,
      auditorySensitivity = 0.5,
      tactileSensitivity = 0.5,
      vestibularSensitivity = 0.5,
      proprioceptiveSensitivity = 0.5,
      sensorySeekingBehaviors = false,
      sensoryAvoidanceBehaviors = false,
      sensoryOverloadFrequency = 0,
    } = preferences

    let supportLevel = 0
    let recommendations = []
    let adaptations = []
    let interventions = []

    // Análise de sensibilidades múltiplas
    const sensitivities = [
      visualSensitivity,
      auditorySensitivity,
      tactileSensitivity,
      vestibularSensitivity,
      proprioceptiveSensitivity,
    ]

    const highSensitivities = sensitivities.filter((s) => s > 0.7).length
    const moderateSensitivities = sensitivities.filter((s) => s > 0.5 && s <= 0.7).length

    // Cálculo baseado em múltiplas sensibilidades
    if (highSensitivities >= 3) {
      supportLevel = 0.9
      recommendations.push('comprehensive_sensory_plan', 'sensory_breaks')
      adaptations.push('controlled_sensory_environment', 'escape_options')
    } else if (highSensitivities >= 2 || moderateSensitivities >= 3) {
      supportLevel = 0.7
      recommendations.push('targeted_sensory_supports', 'environmental_modifications')
      adaptations.push('sensory_choices', 'gradual_exposure')
    } else if (highSensitivities >= 1 || moderateSensitivities >= 2) {
      supportLevel = 0.5
      recommendations.push('specific_accommodations')
      adaptations.push('sensory_awareness', 'alternative_options')
    } else {
      supportLevel = 0.3
    }

    // Ajustes para comportamentos sensoriais
    if (sensorySeekingBehaviors) {
      interventions.push('sensory_input_opportunities', 'structured_sensory_activities')
      adaptations.push('movement_breaks', 'fidget_tools')
    }

    if (sensoryAvoidanceBehaviors) {
      interventions.push('sensory_protection', 'gradual_desensitization')
      adaptations.push('escape_routes', 'warning_systems')
    }

    // Frequência de sobrecarga
    if (sensoryOverloadFrequency > 0.7) {
      supportLevel = Math.max(supportLevel, 0.8)
      interventions.push('immediate_sensory_regulation', 'crisis_prevention')
    }

    let level = 'minimal'
    if (supportLevel >= 0.8) level = 'extensive'
    else if (supportLevel >= 0.6) level = 'substantial'
    else if (supportLevel >= 0.4) level = 'moderate'

    return {
      level,
      score: supportLevel,
      recommendations,
      adaptations,
      interventions,
      sensoryProfile: {
        visual: this.categorizeSensitivity(visualSensitivity),
        auditory: this.categorizeSensitivity(auditorySensitivity),
        tactile: this.categorizeSensitivity(tactileSensitivity),
        vestibular: this.categorizeSensitivity(vestibularSensitivity),
        proprioceptive: this.categorizeSensitivity(proprioceptiveSensitivity),
      },
      autismSpecific: {
        needsSensoryBreaks: supportLevel > 0.5,
        benefitsFromSensoryTools: sensorySeekingBehaviors || supportLevel > 0.4,
        requiresEnvironmentalControl: supportLevel > 0.6,
        needsCrisisPlanning: sensoryOverloadFrequency > 0.6,
      },
    }
  }

  /**
   * 🎯 Categoriza nível de sensibilidade
   * @param {Number} sensitivity - Valor de sensibilidade (0-1)
   * @returns {String} Categoria de sensibilidade
   */
  categorizeSensitivity(sensitivity) {
    if (sensitivity > 0.8) return 'hypersensitive'
    if (sensitivity > 0.6) return 'sensitive'
    if (sensitivity < 0.3) return 'hyposensitive'
    if (sensitivity < 0.5) return 'seeking'
    return 'typical'
  }

  /**
   * 🎯 Calcula nível geral de suporte para autismo
   * @param {Object} data - Dados completos de avaliação
   * @returns {Object} Nível geral de suporte com DSM-5 compliance
   */
  calculateAutismSupportLevel(data) {
    const {
      socialCommunication = 0.5,
      restrictedInterests = 0.5,
      sensoryIssues = 0.5,
      dailyFunctioning = 0.5,
      independenceLevel = 0.5,
      adaptabilityIndex = 0.5,
    } = data

    // Cálculo baseado nos critérios DSM-5 para TEA
    const communicationImpact = 1 - socialCommunication
    const behavioralImpact = Math.max(restrictedInterests, sensoryIssues)
    const functionalImpact = 1 - Math.min(dailyFunctioning, independenceLevel, adaptabilityIndex)

    const overallSupportNeed =
      communicationImpact * 0.4 + behavioralImpact * 0.3 + functionalImpact * 0.3

    // Classificação DSM-5
    let supportLevel = 'Level 1'
    let description = 'Requiring support'
    let interventions = []

    if (overallSupportNeed >= 0.7) {
      supportLevel = 'Level 3'
      description = 'Requiring very substantial support'
      interventions = [
        'intensive_daily_support',
        'specialized_programming',
        'constant_supervision',
        'comprehensive_intervention_plan',
      ]
    } else if (overallSupportNeed >= 0.4) {
      supportLevel = 'Level 2'
      description = 'Requiring substantial support'
      interventions = [
        'regular_support_services',
        'structured_environments',
        'specialized_instruction',
        'behavioral_interventions',
      ]
    } else {
      interventions = [
        'targeted_supports',
        'social_skills_training',
        'organizational_assistance',
        'environmental_accommodations',
      ]
    }

    return {
      level: supportLevel,
      description,
      score: overallSupportNeed,
      interventions,
      domains: {
        socialCommunication: this.getDomainLevel(communicationImpact),
        restrictedRepetitiveBehaviors: this.getDomainLevel(behavioralImpact),
        dailyFunctioning: this.getDomainLevel(functionalImpact),
      },
      recommendations: this.generateSupportRecommendations(supportLevel, data),
    }
  }

  /**
   * Helper: Determina nível do domínio
   */
  getDomainLevel(impact) {
    if (impact >= 0.7) return 'severe'
    if (impact >= 0.4) return 'moderate'
    return 'mild'
  }

  /**
   * Helper: Gera recomendações específicas de suporte
   */
  generateSupportRecommendations(level, data) {
    const recommendations = []

    if (level === 'Level 3') {
      recommendations.push(
        'Full-time aide support',
        'Highly structured environment',
        'Intensive behavioral intervention',
        'Augmentative communication systems'
      )
    } else if (level === 'Level 2') {
      recommendations.push(
        'Part-time aide support',
        'Structured learning environment',
        'Social skills intervention',
        'Sensory accommodation plan'
      )
    } else {
      recommendations.push(
        'Periodic check-ins',
        'Environmental accommodations',
        'Social coaching',
        'Self-advocacy training'
      )
    }

    return recommendations
  }

  /**
   * Exporta dados do calculador
   */
  export() {
    return {
      supportProfiles: Object.fromEntries(this.supportProfiles),
      calculationHistory: Object.fromEntries(this.calculationHistory),
      timestamp: Date.now(),
    }
  }
}

// Exportar a classe
export default AdvancedSupportCalculator
