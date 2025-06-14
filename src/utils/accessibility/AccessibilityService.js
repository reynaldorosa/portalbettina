import logger from '../metrics/performanceMonitor.js'
import { getDatabaseConfig } from '../../database/core/DatabaseConfig.js'

class AccessibilityService {
  constructor(crudService, cache, profileService) {
    this.crud = crudService
    this.cache = cache
    this.profileService = profileService
    this.config = getDatabaseConfig()

    // Configurações de acessibilidade específicas para autismo
    this.accessibilityConfig = {
      sensoryAdaptations: true,
      cognitiveSupport: true,
      communicationAids: true,
      behavioralSupport: true,
      environmentalModifications: true,
    }

    // Padrões de acessibilidade
    this.defaultSettings = {
      visual: {
        highContrast: false,
        fontSize: 'medium',
        reducedMotion: false,
        colorAdjustment: 'normal',
        screenReader: false,
      },
      auditory: {
        soundEnabled: true,
        volumeLevel: 0.7,
        speechRate: 'normal',
        audioDescriptions: false,
        noiseReduction: false,
      },
      motor: {
        largeButtons: false,
        stickyKeys: false,
        dwellClick: false,
        gestureControl: false,
        eyeTracking: false,
      },
      cognitive: {
        simplifiedInterface: false,
        visualCues: true,
        timeExtensions: false,
        memoryAids: false,
        focusAssistance: false,
      },
      sensory: {
        tactileFeedback: true,
        vibrationEnabled: false,
        textureOptions: 'smooth',
        temperaturePreference: 'neutral',
        lightingPreference: 'soft',
      },
    }

    // Detecção automática de necessidades
    this.autoDetectionRules = new Map()
    this.setupAutoDetectionRules()

    logger.info('AccessibilityService initialized with autism-specific support')
  }

  // **Configurações de Acessibilidade**
  async getAccessibilitySettings(userId, options = {}) {
    try {
      const { useCache = true, includeRecommendations = true, autoDetect = true } = options

      const cacheKey = `accessibility:${userId}`

      // Verificar cache primeiro
      if (useCache) {
        const cached = this.cache.get(cacheKey)
        if (cached) {
          return cached
        }
      }

      // Buscar configurações salvas
      let settings = await this.crud.read('accessibility_settings', userId).catch(() => null)

      // Se não existir, criar padrões baseados no perfil
      if (!settings) {
        const profile = await this.profileService.getProfile(userId)
        settings = await this.generateDefaultSettings(profile)

        // Salvar configurações padrão
        await this.crud.create('accessibility_settings', {
          userId,
          ...settings,
        })
      }

      // Detecção automática de necessidades
      if (autoDetect) {
        const detectedNeeds = await this.detectAccessibilityNeeds(userId)
        settings = await this.applyDetectedNeeds(settings, detectedNeeds)
      }

      // Adicionar recomendações
      if (includeRecommendations) {
        settings.recommendations = await this.generateRecommendations(userId, settings)
      }

      // Enriquecer com adaptações específicas para autismo
      settings.autismAdaptations = await this.generateAutismAdaptations(userId, settings)

      // Cache do resultado
      if (useCache) {
        this.cache.set(cacheKey, settings, 30 * 60 * 1000) // 30 minutos
      }

      logger.info('Accessibility settings retrieved', {
        userId,
        autoDetected: autoDetect,
        adaptations: Object.keys(settings.autismAdaptations || {}).length,
      })

      return settings
    } catch (error) {
      logger.error('Error getting accessibility settings', {
        userId,
        error: error.message,
      })
      throw error
    }
  }

  async updateAccessibilitySettings(userId, updates, options = {}) {
    try {
      const {
        validateChanges = true,
        generateRecommendations = true,
        notifyChanges = true,
      } = options

      // Obter configurações atuais
      const currentSettings = await this.getAccessibilitySettings(userId, { useCache: false })

      // Validar mudanças
      if (validateChanges) {
        const validation = await this.validateAccessibilityChanges(currentSettings, updates)
        if (!validation.valid) {
          throw new Error(`Invalid accessibility changes: ${validation.errors.join(', ')}`)
        }
      }

      // Aplicar mudanças com otimizações
      const optimizedUpdates = await this.optimizeAccessibilitySettings(updates, currentSettings)

      // Gerar terapias otimizadas baseadas nas mudanças
      const therapyOptimizations = await this.generateTherapyOptimizations(optimizedUpdates)

      // Preparar dados de atualização
      const updateData = {
        ...optimizedUpdates,
        therapyOptimizations,
        lastUpdated: new Date().toISOString(),
        updateHistory: [
          ...(currentSettings.updateHistory || []).slice(-9), // Manter últimas 10
          {
            timestamp: new Date().toISOString(),
            changes: Object.keys(updates),
            reason: options.reason || 'user_preference',
          },
        ],
      }

      // Atualizar no banco
      const updatedSettings = await this.crud.update('accessibility_settings', userId, updateData, {
        parentNotification: notifyChanges,
      })

      // Invalidar cache
      this.cache.delete(`accessibility:${userId}`)

      // Gerar novas recomendações
      if (generateRecommendations) {
        updatedSettings.recommendations = await this.generateRecommendations(
          userId,
          updatedSettings
        )
      }

      logger.info('Accessibility settings updated', {
        userId,
        changes: Object.keys(updates),
        optimized: Object.keys(optimizedUpdates).length,
      })

      return updatedSettings
    } catch (error) {
      logger.error('Error updating accessibility settings', {
        userId,
        error: error.message,
      })
      throw error
    }
  }

  // **Detecção Automática de Necessidades**
  async detectAccessibilityNeeds(userId) {
    try {
      const profile = await this.profileService.getProfile(userId)
      const sessionHistory = await this.getRecentSessionHistory(userId)
      const behaviorData = await this.getRecentBehaviorData(userId)

      const detectedNeeds = {
        visual: await this.detectVisualNeeds(profile, sessionHistory, behaviorData),
        auditory: await this.detectAuditoryNeeds(profile, sessionHistory, behaviorData),
        motor: await this.detectMotorNeeds(profile, sessionHistory, behaviorData),
        cognitive: await this.detectCognitiveNeeds(profile, sessionHistory, behaviorData),
        sensory: await this.detectSensoryNeeds(profile, sessionHistory, behaviorData),
        communication: await this.detectCommunicationNeeds(profile, sessionHistory, behaviorData),
      }

      // Aplicar regras de detecção automática
      const processedNeeds = await this.processDetectionRules(detectedNeeds, profile)

      logger.debug('Accessibility needs detected', {
        userId,
        categories: Object.keys(processedNeeds).filter((k) => processedNeeds[k].detected),
      })

      return processedNeeds
    } catch (error) {
      logger.error('Error detecting accessibility needs', {
        userId,
        error: error.message,
      })
      return {}
    }
  }

  async applyDetectedNeeds(currentSettings, detectedNeeds) {
    const updatedSettings = { ...currentSettings }

    // Aplicar detecções visuais
    if (detectedNeeds.visual?.detected) {
      updatedSettings.visual = {
        ...updatedSettings.visual,
        ...detectedNeeds.visual.recommendations,
      }
    }

    // Aplicar detecções auditivas
    if (detectedNeeds.auditory?.detected) {
      updatedSettings.auditory = {
        ...updatedSettings.auditory,
        ...detectedNeeds.auditory.recommendations,
      }
    }

    // Aplicar detecções motoras
    if (detectedNeeds.motor?.detected) {
      updatedSettings.motor = {
        ...updatedSettings.motor,
        ...detectedNeeds.motor.recommendations,
      }
    }

    // Aplicar detecções cognitivas
    if (detectedNeeds.cognitive?.detected) {
      updatedSettings.cognitive = {
        ...updatedSettings.cognitive,
        ...detectedNeeds.cognitive.recommendations,
      }
    }

    // Aplicar detecções sensoriais
    if (detectedNeeds.sensory?.detected) {
      updatedSettings.sensory = {
        ...updatedSettings.sensory,
        ...detectedNeeds.sensory.recommendations,
      }
    }

    return updatedSettings
  }

  // **Adaptações Específicas para Autismo**
  async generateAutismAdaptations(userId, settings) {
    try {
      const profile = await this.profileService.getProfile(userId)

      if (profile.type !== 'child' || !profile.autismSpecificData) {
        return {}
      }

      const adaptations = {
        sensoryProcessing: await this.generateSensoryProcessingAdaptations(profile, settings),
        socialCommunication: await this.generateSocialCommunicationAdaptations(profile, settings),
        executiveFunction: await this.generateExecutiveFunctionAdaptations(profile, settings),
        behavioralSupport: await this.generateBehavioralSupportAdaptations(profile, settings),
        environmentalModifications: await this.generateEnvironmentalModifications(
          profile,
          settings
        ),
      }

      return adaptations
    } catch (error) {
      logger.error('Error generating autism adaptations', {
        userId,
        error: error.message,
      })
      return {}
    }
  }

  async generateSensoryProcessingAdaptations(profile, settings) {
    const sensoryProfile = profile.sensoryProfile || {}

    return {
      visualProcessing: {
        reduceVisualClutter: sensoryProfile.visual?.sensitivity === 'high',
        useHighContrast: settings.visual?.highContrast || false,
        minimizeAnimations: settings.visual?.reducedMotion || false,
        adjustBrightness: sensoryProfile.visual?.lightSensitivity || false,
      },
      auditoryProcessing: {
        reduceBackgroundNoise: sensoryProfile.auditory?.sensitivity === 'high',
        useVisualCues: true,
        provideSoundWarnings: true,
        adjustVolumeLevels: settings.auditory?.volumeLevel < 0.5,
      },
      tactileProcessing: {
        minimizeTactileInput: sensoryProfile.tactile?.sensitivity === 'high',
        provideTextureOptions: true,
        useGentleVibrations: settings.sensory?.vibrationEnabled || false,
        temperatureConsiderations: sensoryProfile.tactile?.temperatureSensitive || false,
      },
    }
  }

  async generateSocialCommunicationAdaptations(profile, settings) {
    const communicationProfile = profile.communicationProfile || {}

    return {
      visualSupports: {
        useVisualSchedules: true,
        providePictureCards: communicationProfile.preferredMethods?.includes('visual'),
        socialStories: true,
        visualCues: settings.cognitive?.visualCues || true,
      },
      communicationAids: {
        textToSpeech: settings.auditory?.audioDescriptions || false,
        speechToText: true,
        symbolSupport: communicationProfile.nonverbalCommunication === 'primary',
        gestureRecognition: settings.motor?.gestureControl || false,
      },
      socialInteraction: {
        provideSocialScripts: true,
        useRolePlayScenarios: true,
        graduatedExposure: true,
        peerMediatedSupport: false, // Configurável
      },
    }
  }

  async generateExecutiveFunctionAdaptations(profile, settings) {
    return {
      organization: {
        useVisualOrganizers: true,
        provideCheckLists: true,
        structuredLayouts: settings.cognitive?.simplifiedInterface || false,
        colorCoding: true,
      },
      timeManagement: {
        visualTimers: true,
        scheduleReminders: true,
        timeExtensions: settings.cognitive?.timeExtensions || false,
        breakReminders: true,
      },
      planning: {
        stepByStepInstructions: true,
        taskBreakdown: true,
        goalVisualization: true,
        progressTracking: true,
      },
      workingMemory: {
        memoryAids: settings.cognitive?.memoryAids || false,
        visualReminders: true,
        repetitionSupport: true,
        chunking: true,
      },
    }
  }

  async generateBehavioralSupportAdaptations(profile, settings) {
    const behaviorProfile = profile.behaviorProfile || {}

    return {
      selfRegulation: {
        calmingStrategies: true,
        sensoryBreaks: true,
        choiceProvision: true,
        selfMonitoring: false, // Baseado na idade
      },
      routineSupport: {
        predictableStructure: true,
        transitionWarnings: true,
        visualSchedules: true,
        flexibilityTraining: false, // Gradual
      },
      motivationSupport: {
        reinforcementSystems: true,
        interestBasedActivities: true,
        choiceOptions: true,
        strengthBasedApproach: true,
      },
    }
  }

  async generateEnvironmentalModifications(profile, settings) {
    return {
      physicalEnvironment: {
        organizedSpaces: true,
        reducedDistractions: true,
        comfortableSeating: true,
        accessibleMaterials: true,
      },
      digitalEnvironment: {
        simplifiedInterface: settings.cognitive?.simplifiedInterface || false,
        consistentNavigation: true,
        reducedCognitiveLoad: true,
        accessibleDesign: true,
      },
      socialEnvironment: {
        smallGroupActivities: true,
        peerSupport: true,
        adultSupport: true,
        communicationSupport: true,
      },
    }
  }

  // **Otimizações Terapêuticas**
  async generateTherapyOptimizations(settings) {
    return {
      visualSupport: {
        enabled: settings.visual?.highContrast || settings.cognitive?.visualCues,
        level: this.calculateVisualSupportLevel(settings),
        recommendations: await this.getVisualSupportRecommendations(settings),
      },
      auditorySupport: {
        enabled: settings.auditory?.audioDescriptions || settings.auditory?.soundEnabled,
        level: this.calculateAuditorySupportLevel(settings),
        recommendations: await this.getAuditorySupportRecommendations(settings),
      },
      motorSupport: {
        enabled: settings.motor?.largeButtons || settings.motor?.gestureControl,
        level: this.calculateMotorSupportLevel(settings),
        recommendations: await this.getMotorSupportRecommendations(settings),
      },
      cognitiveSupport: {
        enabled: settings.cognitive?.simplifiedInterface || settings.cognitive?.memoryAids,
        level: this.calculateCognitiveSupportLevel(settings),
        recommendations: await this.getCognitiveSupportRecommendations(settings),
      },
      sensorySupport: {
        enabled: settings.sensory?.tactileFeedback || settings.visual?.reducedMotion,
        level: this.calculateSensorySupportLevel(settings),
        recommendations: await this.getSensorySupportRecommendations(settings),
      },
    }
  }

  // **Métodos de Configuração Automática**
  setupAutoDetectionRules() {
    // Regras para detecção de necessidades visuais
    this.autoDetectionRules.set('visual_high_contrast', {
      condition: (profile, sessions, behavior) => {
        return (
          sessions.some((s) => s.difficulties?.includes('visual_tracking')) ||
          behavior.visualStress > 0.7
        )
      },
      recommendation: { highContrast: true, fontSize: 'large' },
    })

    // Regras para detecção de necessidades auditivas
    this.autoDetectionRules.set('auditory_sensitivity', {
      condition: (profile, sessions, behavior) => {
        return (
          behavior.auditoryOverload > 0.6 ||
          sessions.some((s) => s.sensoryTriggers?.includes('loud_sounds'))
        )
      },
      recommendation: { volumeLevel: 0.3, noiseReduction: true },
    })

    // Regras para detecção de necessidades motoras
    this.autoDetectionRules.set('motor_difficulties', {
      condition: (profile, sessions, behavior) => {
        return (
          sessions.some((s) => s.difficulties?.includes('fine_motor')) ||
          behavior.motorChallenges > 0.5
        )
      },
      recommendation: { largeButtons: true, dwellClick: true },
    })

    // Regras para detecção de necessidades cognitivas
    this.autoDetectionRules.set('cognitive_load', {
      condition: (profile, sessions, behavior) => {
        return (
          behavior.cognitiveOverload > 0.6 ||
          sessions.some((s) => s.adaptiveAdjustments?.includes('simplify_interface'))
        )
      },
      recommendation: { simplifiedInterface: true, visualCues: true, timeExtensions: true },
    })
  }

  // **Utilitários e Validação**
  async generateDefaultSettings(profile) {
    const settings = { ...this.defaultSettings }

    // Personalizar baseado no perfil
    if (profile.type === 'child') {
      settings.cognitive.visualCues = true
      settings.cognitive.simplifiedInterface = profile.age < 6

      if (profile.autismSpecificData) {
        settings.sensory.tactileFeedback = true
        settings.visual.reducedMotion = true
        settings.auditory.volumeLevel = 0.5
      }
    }

    return settings
  }

  async validateAccessibilityChanges(currentSettings, updates) {
    const errors = []

    // Validar configurações visuais
    if (updates.visual) {
      if (
        updates.visual.fontSize &&
        !['small', 'medium', 'large', 'extra-large'].includes(updates.visual.fontSize)
      ) {
        errors.push('Invalid font size')
      }
    }

    // Validar configurações auditivas
    if (updates.auditory) {
      if (
        updates.auditory.volumeLevel &&
        (updates.auditory.volumeLevel < 0 || updates.auditory.volumeLevel > 1)
      ) {
        errors.push('Invalid volume level')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  async optimizeAccessibilitySettings(updates, currentSettings) {
    const optimized = { ...updates }

    // Otimizar conflitos de configuração
    if (optimized.visual?.highContrast && optimized.visual?.colorAdjustment) {
      // Alto contraste pode conflitar com ajustes de cor
      optimized.visual.colorAdjustment = 'auto'
    }

    if (optimized.auditory?.noiseReduction && optimized.auditory?.volumeLevel > 0.8) {
      // Redução de ruído com volume alto pode causar distorção
      optimized.auditory.volumeLevel = 0.7
    }

    return optimized
  }

  // **Placeholder methods para funcionalidades futuras**
  async getRecentSessionHistory(userId) {
    return []
  }
  async getRecentBehaviorData(userId) {
    return {}
  }
  async detectVisualNeeds(profile, sessions, behavior) {
    return { detected: false }
  }
  async detectAuditoryNeeds(profile, sessions, behavior) {
    return { detected: false }
  }
  async detectMotorNeeds(profile, sessions, behavior) {
    return { detected: false }
  }
  async detectCognitiveNeeds(profile, sessions, behavior) {
    return { detected: false }
  }
  async detectSensoryNeeds(profile, sessions, behavior) {
    return { detected: false }
  }
  async detectCommunicationNeeds(profile, sessions, behavior) {
    return { detected: false }
  }

  async processDetectionRules(detectedNeeds, profile) {
    return detectedNeeds
  }
  async generateRecommendations(userId, settings) {
    return []
  }

  calculateVisualSupportLevel(settings) {
    return 'moderate'
  }
  calculateAuditorySupportLevel(settings) {
    return 'moderate'
  }
  calculateMotorSupportLevel(settings) {
    return 'moderate'
  }
  calculateCognitiveSupportLevel(settings) {
    return 'moderate'
  }
  calculateSensorySupportLevel(settings) {
    return 'moderate'
  }

  async getVisualSupportRecommendations(settings) {
    return []
  }
  async getAuditorySupportRecommendations(settings) {
    return []
  }
  async getMotorSupportRecommendations(settings) {
    return []
  }
  async getCognitiveSupportRecommendations(settings) {
    return []
  }
  async getSensorySupportRecommendations(settings) {
    return []
  }

  // **Estatísticas**
  async getAccessibilityStatistics() {
    return {
      totalUsers: await this.crud
        .readMany('accessibility_settings', {}, { limit: 1 })
        .then((r) => r.total),
      adaptationsEnabled: await this.getAdaptationsStatistics(),
      detectionAccuracy: await this.getDetectionAccuracy(),
      userSatisfaction: await this.getUserSatisfactionMetrics(),
    }
  }

  async getAdaptationsStatistics() {
    // Implementar estatísticas de adaptações
    return {
      visual: 0,
      auditory: 0,
      motor: 0,
      cognitive: 0,
      sensory: 0,
    }
  }

  async getDetectionAccuracy() {
    // Implementar métricas de precisão da detecção automática
    return 0.85
  }

  async getUserSatisfactionMetrics() {
    // Implementar métricas de satisfação do usuário
    return {
      averageRating: 4.2,
      usageIncrease: 0.15,
      featureAdoption: 0.68,
    }
  }
}

export default AccessibilityService
export { AccessibilityService }
