import logger from '../../utils/metrics/performanceMonitor.js'
import { getDatabaseConfig } from '../core/DatabaseConfig.js'

class ProfileService {
  constructor(crudService, cache, cognitiveAnalyzer) {
    this.crud = crudService
    this.cache = cache
    this.cognitiveAnalyzer = cognitiveAnalyzer
    this.config = getDatabaseConfig()

    // Configurações específicas para perfis
    this.profileConfig = {
      updateInterval: 24 * 60 * 60 * 1000, // 24 horas
      backupInterval: 7 * 24 * 60 * 60 * 1000, // 7 dias
      analysisDepth: 'comprehensive',
      privacyLevel: 'high',
    }

    this.profileTypes = {
      CHILD: 'child',
      PARENT: 'parent',
      THERAPIST: 'therapist',
      CAREGIVER: 'caregiver',
    }

    logger.info('ProfileService initialized')
  }

  // **Criação e Gerenciamento de Perfis**
  async createProfile(type, profileData, options = {}) {
    try {
      const { generateInsights = true, setupDefaults = true, parentNotification = false } = options

      // Validar tipo de perfil
      if (!Object.values(this.profileTypes).includes(type)) {
        throw new Error(`Invalid profile type: ${type}`)
      }

      // Aplicar configurações específicas do tipo
      const enhancedData = await this.enhanceProfileData(type, profileData)

      // Configurar padrões baseados no tipo
      if (setupDefaults) {
        enhancedData.settings = await this.generateDefaultSettings(type, profileData)
        enhancedData.preferences = await this.generateDefaultPreferences(type, profileData)
      }

      // Gerar insights iniciais
      if (generateInsights && this.cognitiveAnalyzer) {
        enhancedData.initialInsights = await this.cognitiveAnalyzer.generateInitialInsights(
          type,
          enhancedData
        )
      }

      // Configurar privacidade
      enhancedData.privacy = await this.setupPrivacySettings(type, profileData)

      // Criar perfil
      const profile = await this.crud.create(
        'profile',
        {
          type,
          ...enhancedData,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: '1.0.0',
        },
        { parentNotification }
      )

      // Cache do perfil
      this.cache.set(`profile:${profile.id}`, profile)
      this.cache.set(`profile:${type}:${profile.id}`, profile)

      logger.info('Profile created', {
        type,
        id: profile.id,
        hasInsights: Boolean(enhancedData.initialInsights),
      })

      return profile
    } catch (error) {
      logger.error('Error creating profile', {
        type,
        error: error.message,
      })
      throw error
    }
  }

  async getProfile(profileId, options = {}) {
    try {
      const {
        includeInsights = true,
        includeHistory = false,
        includeRecommendations = true,
        useCache = true,
      } = options

      // Tentar cache primeiro
      const cacheKey = `profile:${profileId}`
      if (useCache) {
        const cached = this.cache.get(cacheKey)
        if (cached) {
          return await this.enrichProfile(cached, options)
        }
      }

      // Buscar perfil
      const profile = await this.crud.read('profile', profileId)

      // Enriquecer com dados adicionais
      const enrichedProfile = await this.enrichProfile(profile, {
        includeInsights,
        includeHistory,
        includeRecommendations,
      })

      // Cache do resultado
      if (useCache) {
        this.cache.set(cacheKey, enrichedProfile)
      }

      return enrichedProfile
    } catch (error) {
      logger.error('Error getting profile', {
        profileId,
        error: error.message,
      })
      throw error
    }
  }

  async updateProfile(profileId, updates, options = {}) {
    try {
      const { analyzeChanges = true, updateInsights = true, parentNotification = false } = options

      // Obter perfil atual
      const currentProfile = await this.getProfile(profileId, { useCache: false })

      // Análise de mudanças
      let changeAnalysis = null
      if (analyzeChanges) {
        changeAnalysis = await this.analyzeProfileChanges(currentProfile, updates)
      }

      // Preparar dados de atualização
      const updateData = {
        ...updates,
        lastUpdated: new Date().toISOString(),
        version: this.incrementVersion(currentProfile.version),
      }

      // Adicionar análise de mudanças se significativa
      if (changeAnalysis?.significant) {
        updateData.changeLog = changeAnalysis
        options.parentNotification = true
      }

      // Atualizar insights se necessário
      if (updateInsights && this.cognitiveAnalyzer && this.shouldUpdateInsights(updates)) {
        updateData.insights = await this.cognitiveAnalyzer.updateInsights(currentProfile, updates)
      }

      // Aplicar atualização
      const updatedProfile = await this.crud.update('profile', profileId, updateData, {
        parentNotification,
        trackChanges: true,
      })

      // Atualizar cache
      this.cache.delete(`profile:${profileId}`)
      this.cache.set(`profile:${profileId}`, updatedProfile)

      logger.info('Profile updated', {
        profileId,
        significantChanges: changeAnalysis?.significant,
        insightsUpdated: Boolean(updateData.insights),
      })

      return updatedProfile
    } catch (error) {
      logger.error('Error updating profile', {
        profileId,
        error: error.message,
      })
      throw error
    }
  }

  // **Perfis Específicos por Tipo**
  async createChildProfile(childData, options = {}) {
    const enhancedData = {
      ...childData,
      developmentalProfile: await this.generateDevelopmentalProfile(childData),
      sensoryProfile: await this.generateSensoryProfile(childData),
      communicationProfile: await this.generateCommunicationProfile(childData),
      behaviorProfile: await this.generateBehaviorProfile(childData),
      learningProfile: await this.generateLearningProfile(childData),
    }

    return await this.createProfile(this.profileTypes.CHILD, enhancedData, {
      ...options,
      generateInsights: true,
      setupDefaults: true,
    })
  }

  async createParentProfile(parentData, options = {}) {
    const enhancedData = {
      ...parentData,
      parentingStyle: await this.assessParentingStyle(parentData),
      communicationPreferences: await this.setupParentCommunication(parentData),
      involvementLevel: await this.assessInvolvementLevel(parentData),
      supportNeeds: await this.identifySupportNeeds(parentData),
    }

    return await this.createProfile(this.profileTypes.PARENT, enhancedData, options)
  }

  async createTherapistProfile(therapistData, options = {}) {
    const enhancedData = {
      ...therapistData,
      expertise: await this.mapTherapistExpertise(therapistData),
      approachPreferences: await this.identifyTherapeuticApproaches(therapistData),
      certifications: await this.validateCertifications(therapistData),
      caseloadPreferences: await this.determineCaseloadPreferences(therapistData),
    }

    return await this.createProfile(this.profileTypes.THERAPIST, enhancedData, options)
  }

  async createCaregiverProfile(caregiverData, options = {}) {
    const enhancedData = {
      ...caregiverData,
      careLevel: await this.assessCareLevel(caregiverData),
      relationship: await this.mapRelationship(caregiverData),
      availability: await this.assessAvailability(caregiverData),
      skills: await this.assessCaregivingSkills(caregiverData),
    }

    return await this.createProfile(this.profileTypes.CAREGIVER, enhancedData, options)
  }

  // **Análise e Enriquecimento de Perfis**
  async enrichProfile(profile, options = {}) {
    const {
      includeInsights = true,
      includeHistory = false,
      includeRecommendations = true,
    } = options

    const enriched = { ...profile }

    // Adicionar insights atualizados
    if (includeInsights && this.cognitiveAnalyzer) {
      enriched.currentInsights = await this.cognitiveAnalyzer.getCurrentInsights(profile.id)
    }

    // Adicionar histórico se solicitado
    if (includeHistory) {
      enriched.history = await this.getProfileHistory(profile.id)
    }

    // Adicionar recomendações
    if (includeRecommendations) {
      enriched.recommendations = await this.generateRecommendations(profile)
    }

    // Adicionar métricas de perfil
    enriched.metrics = await this.calculateProfileMetrics(profile)

    return enriched
  }

  /**
   * Enriquece perfil com dados terapêuticos especializados
   */
  enrichProfileWithTherapyData(profile) {
    return {
      ...profile,
      therapyData: this.generateTherapyData(profile),
      adaptiveParameters: this.generateAdaptiveParameters(profile),
      accessibilityProfile: this.generateAccessibilityProfile(profile),
      cognitiveAssessment: this.generateCognitiveAssessment(profile),
      interventionPlan: this.generateInterventionPlan(profile),
      progressTracking: this.initializeProgressTracking(profile),
    }
  }

  async analyzeProfileChanges(currentProfile, updates) {
    const analysis = {
      significant: false,
      categories: [],
      impact: 'low',
      recommendations: [],
    }

    // Detectar mudanças em campos críticos
    const criticalFields = this.getCriticalFields(currentProfile.type)
    const criticalChanges = criticalFields.filter(
      (field) => updates[field] !== undefined && updates[field] !== currentProfile[field]
    )

    if (criticalChanges.length > 0) {
      analysis.significant = true
      analysis.categories = criticalChanges
      analysis.impact = this.assessChangeImpact(criticalChanges, currentProfile, updates)
    }

    // Gerar recomendações baseadas nas mudanças
    if (analysis.significant) {
      analysis.recommendations = await this.generateChangeRecommendations(
        currentProfile,
        updates,
        criticalChanges
      )
    }

    return analysis
  }

  // **Configurações e Padrões**
  async enhanceProfileData(type, profileData) {
    const enhanced = { ...profileData }

    switch (type) {
      case this.profileTypes.CHILD:
        enhanced.autismSpecificData = await this.generateAutismSpecificData(profileData)
        break
      case this.profileTypes.PARENT:
        enhanced.familyDynamics = await this.analyzeFamilyDynamics(profileData)
        break
      case this.profileTypes.THERAPIST:
        enhanced.professionalProfile = await this.generateProfessionalProfile(profileData)
        break
      case this.profileTypes.CAREGIVER:
        enhanced.careProfile = await this.generateCareProfile(profileData)
        break
    }

    return enhanced
  }

  async generateDefaultSettings(type, profileData) {
    const defaultSettings = {
      privacy: {
        shareData: false,
        allowResearch: false,
        parentalControl: true,
      },
      notifications: {
        progress: true,
        sessions: true,
        milestones: true,
        alerts: true,
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        audioSupport: false,
        simplifiedInterface: false,
      },
    }

    // Personalizar com base no tipo
    if (type === this.profileTypes.CHILD) {
      defaultSettings.therapy = {
        sessionDuration: 30,
        frequency: 'weekly',
        modalities: ['visual', 'auditory'],
        adaptiveLevel: 'moderate',
      }
    }

    return defaultSettings
  }

  async generateDefaultPreferences(type, profileData) {
    const preferences = {
      communication: 'visual',
      learning: 'structured',
      environment: 'quiet',
      interaction: 'one-on-one',
    }

    // Personalizar baseado no perfil e tipo
    return this.personalizePreferences(preferences, type, profileData)
  }

  async setupPrivacySettings(type, profileData) {
    return {
      level: 'high',
      consentRequired: true,
      dataRetention: '7years',
      anonymizeResearch: true,
      parentalConsent: type === this.profileTypes.CHILD,
      encryptSensitiveData: true,
    }
  }

  // **Geradores de Perfil Específicos**
  async generateDevelopmentalProfile(childData) {
    return {
      cognitiveLevel: 'age-appropriate',
      languageLevel: 'emerging',
      motorSkills: 'developing',
      socialSkills: 'supported',
      adaptiveSkills: 'learning',
      milestones: await this.assessDevelopmentalMilestones(childData),
    }
  }

  async generateSensoryProfile(childData) {
    return {
      processing: {
        visual: 'typical',
        auditory: 'sensitive',
        tactile: 'seeking',
        vestibular: 'typical',
        proprioceptive: 'seeking',
      },
      preferences: {
        lighting: 'soft',
        sounds: 'quiet',
        textures: 'smooth',
        movement: 'gentle',
      },
      adaptations: await this.generateSensoryAdaptations(childData),
    }
  }

  async generateCommunicationProfile(childData) {
    return {
      expressiveLanguage: 'developing',
      receptiveLanguage: 'strong',
      nonverbalCommunication: 'emerging',
      socialCommunication: 'supported',
      preferredMethods: ['visual', 'gesture'],
      supports: await this.identifyCommunicationSupports(childData),
    }
  }

  async generateBehaviorProfile(childData) {
    return {
      strengths: ['focused attention', 'routine following'],
      challenges: ['transitions', 'social interaction'],
      triggers: ['loud noises', 'unexpected changes'],
      strategies: ['visual schedules', 'advance warning'],
      reinforcers: ['praise', 'preferred activities'],
    }
  }

  async generateLearningProfile(childData) {
    return {
      style: 'visual',
      pace: 'steady',
      strengths: ['pattern recognition', 'detail focus'],
      needs: ['structure', 'repetition'],
      accommodations: ['visual supports', 'extra time'],
      goals: await this.generateLearningGoals(childData),
    }
  }

  // **Métodos de Avaliação**
  async assessParentingStyle(parentData) {
    return 'supportive' // Placeholder
  }

  async setupParentCommunication(parentData) {
    return {
      preferred: 'app',
      frequency: 'weekly',
      types: ['progress', 'sessions', 'milestones'],
    }
  }

  async assessInvolvementLevel(parentData) {
    return 'high' // Placeholder
  }

  async identifySupportNeeds(parentData) {
    return ['education', 'emotional support', 'practical strategies']
  }

  // **Utilitários**
  getCriticalFields(profileType) {
    const fieldMap = {
      [this.profileTypes.CHILD]: [
        'developmentalProfile',
        'sensoryProfile',
        'communicationProfile',
        'behaviorProfile',
      ],
      [this.profileTypes.PARENT]: ['parentingStyle', 'involvementLevel', 'supportNeeds'],
      [this.profileTypes.THERAPIST]: ['expertise', 'certifications', 'approachPreferences'],
      [this.profileTypes.CAREGIVER]: ['careLevel', 'availability', 'skills'],
    }

    return fieldMap[profileType] || []
  }

  incrementVersion(currentVersion) {
    const parts = currentVersion.split('.')
    const patch = parseInt(parts[2]) + 1
    return `${parts[0]}.${parts[1]}.${patch}`
  }

  shouldUpdateInsights(updates) {
    const insightTriggers = [
      'developmentalProfile',
      'behaviorProfile',
      'communicationProfile',
      'sensoryProfile',
    ]

    return insightTriggers.some((field) => updates[field] !== undefined)
  }

  // **Placeholder methods para funcionalidades futuras**
  async getProfileHistory(profileId) {
    return []
  }
  async generateRecommendations(profile) {
    return []
  }
  async calculateProfileMetrics(profile) {
    return {}
  }
  async assessChangeImpact(changes, current, updates) {
    return 'moderate'
  }
  async generateChangeRecommendations(current, updates, changes) {
    return []
  }
  async generateAutismSpecificData(data) {
    return {}
  }
  async analyzeFamilyDynamics(data) {
    return {}
  }
  async generateProfessionalProfile(data) {
    return {}
  }
  async generateCareProfile(data) {
    return {}
  }
  async personalizePreferences(preferences, type, data) {
    return preferences
  }
  async assessDevelopmentalMilestones(data) {
    return []
  }
  async generateSensoryAdaptations(data) {
    return []
  }
  async identifyCommunicationSupports(data) {
    return []
  }
  async generateLearningGoals(data) {
    return []
  }
  async mapTherapistExpertise(data) {
    return []
  }
  async identifyTherapeuticApproaches(data) {
    return []
  }
  async validateCertifications(data) {
    return []
  }
  async determineCaseloadPreferences(data) {
    return {}
  }
  async assessCareLevel(data) {
    return 'standard'
  }
  async mapRelationship(data) {
    return 'family'
  }
  async assessAvailability(data) {
    return {}
  }
  async assessCaregivingSkills(data) {
    return []
  }

  // **Funcionalidades migradas do ProfileManager**
  /**
   * Sanitiza dados do perfil com validações específicas
   */
  sanitizeProfileData(profileData) {
    return {
      name: this.sanitizeInput(profileData.name || '', { maxLength: 50 }),
      age: this.sanitizeNumericInput(profileData.age, 1, 100),
      autismLevel: this.sanitizeEnum(
        profileData.autismLevel,
        ['level1', 'level2', 'level3', 'unknown'],
        'unknown'
      ),
      communicationStyle: this.sanitizeEnum(
        profileData.communicationStyle,
        ['verbal', 'nonverbal', 'mixed', 'aac'],
        'mixed'
      ),
      sensoryPreferences: this.sanitizeSensoryPreferences(profileData.sensoryPreferences || {}),
      learningStyle: this.sanitizeEnum(
        profileData.learningStyle,
        ['visual', 'auditory', 'kinesthetic', 'mixed'],
        'mixed'
      ),
      interests: this.sanitizeArray(profileData.interests || [], [
        'music', 'art', 'technology', 'nature', 'animals', 'sports', 'books', 'games',
      ]),
      challenges: this.sanitizeArray(profileData.challenges || [], [
        'communication', 'social', 'sensory', 'behavioral', 'cognitive', 'motor',
      ]),
      strengths: this.sanitizeArray(profileData.strengths || [], [
        'memory', 'pattern_recognition', 'attention_to_detail', 'creativity', 'logical_thinking',
      ]),
      goals: this.sanitizeGoals(profileData.goals || []),
      medicalInfo: this.sanitizeMedicalInfo(profileData.medicalInfo || {}),
    }
  }

  /**
   * Gera dados terapêuticos iniciais
   */
  generateTherapyData(profile) {
    return {
      assessmentDate: new Date().toISOString(),
      therapyApproaches: this.recommendTherapyApproaches(profile),
      sessionPreferences: this.generateSessionPreferences(profile),
      reinforcementSchedule: this.generateReinforcementSchedule(profile),
      emergencyProtocols: this.generateEmergencyProtocols(profile),
      parentGuidelines: this.generateParentGuidelines(profile),
    }
  }

  /**
   * Gera parâmetros adaptativos baseados no perfil
   */
  generateAdaptiveParameters(profile) {
    const baseParameters = {
      difficulty: 'medium',
      pace: 'normal',
      repetition: 'standard',
      feedback: 'balanced',
    }

    // Ajustar baseado no nível do autismo
    if (profile.autismLevel === 'level3') {
      return {
        ...baseParameters,
        difficulty: 'easy',
        pace: 'slow',
        repetition: 'high',
        feedback: 'frequent',
        visualSupport: 'enhanced',
        breakFrequency: 'high',
      }
    }

    if (profile.autismLevel === 'level1') {
      return {
        ...baseParameters,
        difficulty: 'progressive',
        pace: 'adaptive',
        repetition: 'minimal',
        feedback: 'goal-oriented',
        independence: 'encouraged',
      }
    }

    return baseParameters
  }

  /**
   * Gera perfil de acessibilidade
   */
  generateAccessibilityProfile(profile) {
    const base = {
      visualSupport: true,
      audioSupport: true,
      tactileSupport: false,
      highContrast: false,
      largeText: false,
      slowMotion: false,
      reducedStimuli: false,
    }

    // Ajustar baseado nas preferências sensoriais
    if (profile.sensoryPreferences) {
      if (profile.sensoryPreferences.visualSensitive) {
        base.highContrast = true
        base.reducedStimuli = true
      }
      
      if (profile.sensoryPreferences.auditoryHypersensitive) {
        base.audioSupport = false
        base.reducedStimuli = true
      }

      if (profile.sensoryPreferences.tactilePreferred) {
        base.tactileSupport = true
      }
    }

    return base
  }

  /**
   * Gera avaliação cognitiva inicial
   */
  generateCognitiveAssessment(profile) {
    return {
      assessmentDate: new Date().toISOString(),
      cognitiveStrengths: profile.strengths || [],
      areasForDevelopment: profile.challenges || [],
      recommendedActivities: this.recommendActivities(profile),
      learningGoals: this.generateLearningGoals(profile),
      progress: {
        baseline: 0,
        current: 0,
        target: 100,
      },
    }
  }

  /**
   * Gera plano de intervenção
   */
  generateInterventionPlan(profile) {
    return {
      createdDate: new Date().toISOString(),
      objectives: this.generateObjectives(profile),
      strategies: this.recommendStrategies(profile),
      timeline: this.generateTimeline(profile),
      milestones: this.generateMilestones(profile),
      reviewSchedule: this.generateReviewSchedule(profile),
    }
  }

  /**
   * Inicializa rastreamento de progresso
   */
  initializeProgressTracking(profile) {
    return {
      startDate: new Date().toISOString(),
      metrics: {
        engagement: { baseline: 0, current: 0, target: 80 },
        completion: { baseline: 0, current: 0, target: 70 },
        independence: { baseline: 0, current: 0, target: 60 },
        communication: { baseline: 0, current: 0, target: 75 },
        social: { baseline: 0, current: 0, target: 65 },
      },
      sessions: [],
      observations: [],
      recommendations: [],
    }
  }

  // **Métodos auxiliares de sanitização**

  sanitizeInput(input, options = {}) {
    const { maxLength = 100 } = options
    return typeof input === 'string' ? input.trim().slice(0, maxLength) : ''
  }

  sanitizeNumericInput(input, min = 0, max = 150) {
    const num = parseInt(input)
    return isNaN(num) ? min : Math.max(min, Math.min(max, num))
  }

  sanitizeEnum(input, validValues, defaultValue) {
    return validValues.includes(input) ? input : defaultValue
  }

  sanitizeArray(input, validValues) {
    if (!Array.isArray(input)) return []
    return input.filter(item => validValues.includes(item))
  }

  sanitizeSensoryPreferences(preferences) {
    return {
      visualSensitive: Boolean(preferences.visualSensitive),
      auditoryHypersensitive: Boolean(preferences.auditoryHypersensitive),
      tactilePreferred: Boolean(preferences.tactilePreferred),
      vestibularSeeking: Boolean(preferences.vestibularSeeking),
      proprioceptiveSeeking: Boolean(preferences.proprioceptiveSeeking),
    }
  }

  sanitizeGoals(goals) {
    if (!Array.isArray(goals)) return []
    return goals.map(goal => ({
      id: goal.id || `goal_${Date.now()}`,
      description: this.sanitizeInput(goal.description, { maxLength: 200 }),
      category: this.sanitizeEnum(goal.category, ['communication', 'social', 'cognitive', 'behavioral'], 'behavioral'),
      priority: this.sanitizeEnum(goal.priority, ['low', 'medium', 'high'], 'medium'),
      targetDate: goal.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    }))
  }

  sanitizeMedicalInfo(medicalInfo) {
    return {
      allergies: this.sanitizeArray(medicalInfo.allergies || [], ['food', 'medication', 'environmental']),
      medications: this.sanitizeInput(medicalInfo.medications || ''),
      conditions: this.sanitizeArray(medicalInfo.conditions || [], ['adhd', 'epilepsy', 'anxiety', 'sensory_processing']),
      emergencyContact: {
        name: this.sanitizeInput(medicalInfo.emergencyContact?.name || ''),
        phone: this.sanitizeInput(medicalInfo.emergencyContact?.phone || ''),
        relationship: this.sanitizeInput(medicalInfo.emergencyContact?.relationship || ''),
      },
    }
  }

  // **Métodos de recomendação e geração**

  recommendTherapyApproaches(profile) {
    const approaches = []
    
    if (profile.communicationStyle === 'nonverbal') {
      approaches.push('AAC', 'PECS', 'Sign Language')
    }
    
    if (profile.challenges?.includes('social')) {
      approaches.push('Social Stories', 'Video Modeling')
    }
    
    if (profile.challenges?.includes('sensory')) {
      approaches.push('Sensory Integration', 'Environmental Modifications')
    }
    
    return approaches.length > 0 ? approaches : ['Applied Behavior Analysis']
  }

  generateSessionPreferences(profile) {
    return {
      duration: profile.age < 6 ? 15 : profile.age < 10 ? 20 : 30,
      breakFrequency: profile.autismLevel === 'level3' ? 5 : 10,
      environmentalPreferences: {
        lighting: profile.sensoryPreferences?.visualSensitive ? 'dim' : 'normal',
        noise: profile.sensoryPreferences?.auditoryHypersensitive ? 'minimal' : 'normal',
        distractions: 'minimal',
      },
      reinforcementType: this.recommendReinforcementType(profile),
    }
  }

  recommendReinforcementType(profile) {
    if (profile.interests?.includes('technology')) return 'digital'
    if (profile.interests?.includes('music')) return 'auditory'
    if (profile.interests?.includes('art')) return 'visual'
    return 'social'
  }

  generateReinforcementSchedule(profile) {
    const baseSchedule = profile.autismLevel === 'level3' ? 'continuous' : 'variable'
    
    return {
      type: baseSchedule,
      ratio: baseSchedule === 'continuous' ? 1 : 3,
      preferences: profile.interests || ['praise'],
      progressiveSchedule: true,
    }
  }

  generateEmergencyProtocols(profile) {
    return {
      triggers: profile.challenges || [],
      strategies: [
        'Calm down space',
        'Deep breathing',
        'Preferred item access',
        'Break from activity',
      ],
      contactInfo: {
        emergency: true,
        parent: true,
        therapist: true,
      },
    }
  }

  generateParentGuidelines(profile) {
    return {
      homeStrategies: this.recommendHomeStrategies(profile),
      consistency: {
        routine: 'high',
        expectations: 'clear',
        reinforcement: 'consistent',
      },
      communication: this.recommendParentCommunication(profile),
      resources: this.recommendResources(profile),
    }
  }

  recommendHomeStrategies(profile) {
    const strategies = ['Visual schedules', 'Clear expectations']
    
    if (profile.challenges?.includes('behavioral')) {
      strategies.push('Positive reinforcement', 'Consistent consequences')
    }
    
    if (profile.sensoryPreferences?.visualSensitive) {
      strategies.push('Sensory breaks', 'Environmental modifications')
    }
    
    return strategies
  }

  recommendParentCommunication(profile) {
    return {
      style: profile.communicationStyle,
      supportTools: profile.communicationStyle === 'nonverbal' ? ['AAC device', 'Picture cards'] : ['Clear language'],
      frequency: 'daily',
    }
  }

  recommendResources(profile) {
    return [
      'Autism support groups',
      'Parent training programs',
      'Community resources',
      'Educational materials',
    ]
  }

  recommendActivities(profile) {
    const activities = []
    
    if (profile.interests?.includes('games')) {
      activities.push('Interactive games', 'Puzzle activities')
    }
    
    if (profile.learningStyle === 'visual') {
      activities.push('Visual learning tools', 'Picture-based activities')
    }
    
    if (profile.learningStyle === 'kinesthetic') {
      activities.push('Movement-based learning', 'Hands-on activities')
    }
    
    return activities.length > 0 ? activities : ['Basic interactive games']
  }

  generateLearningGoals(profile) {
    const goals = []
    
    if (profile.challenges?.includes('communication')) {
      goals.push({
        area: 'communication',
        goal: 'Improve expressive communication',
        target: 'Use 10 new functional words/phrases',
      })
    }
    
    if (profile.challenges?.includes('social')) {
      goals.push({
        area: 'social',
        goal: 'Increase social engagement',
        target: 'Initiate 3 social interactions per session',
      })
    }
    
    return goals
  }

  generateObjectives(profile) {
    return profile.goals?.map(goal => ({
      id: `obj_${goal.id}`,
      goalId: goal.id,
      description: `Work towards: ${goal.description}`,
      measurable: true,
      timeframe: '30 days',
    })) || []
  }

  recommendStrategies(profile) {
    const strategies = ['Positive reinforcement', 'Clear instructions']
    
    if (profile.learningStyle === 'visual') {
      strategies.push('Visual supports', 'Picture schedules')
    }
    
    if (profile.autismLevel === 'level3') {
      strategies.push('Simplified instructions', 'Frequent breaks')
    }
    
    return strategies
  }

  generateTimeline(profile) {
    return {
      phase1: '0-30 days - Assessment and baseline',
      phase2: '31-60 days - Intervention implementation',
      phase3: '61-90 days - Progress evaluation',
      ongoing: 'Continuous monitoring and adjustment',
    }
  }

  generateMilestones(profile) {
    return [
      { week: 2, description: 'Complete initial assessment' },
      { week: 4, description: 'Establish baseline metrics' },
      { week: 8, description: 'Mid-program evaluation' },
      { week: 12, description: 'Final assessment and planning' },
    ]
  }

  generateReviewSchedule(profile) {
    return {
      weekly: 'Progress monitoring',
      monthly: 'Goal review and adjustment',
      quarterly: 'Comprehensive evaluation',
      annually: 'Full program review',
    }
  }

  getDefaultSensoryPreferences() {
    return {
      visualSensitive: false,
      auditoryHypersensitive: false,
      tactilePreferred: false,
      vestibularSeeking: false,
      proprioceptiveSeeking: false,
    }
  }

  generateInitialTherapyData() {
    return {
      therapyData: {
        assessmentDate: new Date().toISOString(),
        therapyApproaches: ['Applied Behavior Analysis'],
        sessionPreferences: {
          duration: 20,
          breakFrequency: 10,
          environmentalPreferences: {
            lighting: 'normal',
            noise: 'normal',
            distractions: 'minimal',
          },
        },
      },
    }
  }

  // **Estatísticas**
  async getProfileStatistics() {
    return {
      totalProfiles: await this.crud.readMany('profile', {}, { limit: 1 }).then((r) => r.total),
      byType: await this.getProfilesByType(),
      recentlyUpdated: await this.getRecentlyUpdatedProfiles(),
      activeProfiles: await this.getActiveProfiles(),
    }
  }

  async getProfilesByType() {
    const types = Object.values(this.profileTypes)
    const counts = {}

    for (const type of types) {
      const result = await this.crud.readMany('profile', { type }, { limit: 1 })
      counts[type] = result.total || 0
    }

    return counts
  }

  async getRecentlyUpdatedProfiles(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    const result = await this.crud.readMany('profile', {
      lastUpdated: { $gte: cutoff },
    })
    return result.data || []
  }

  async getActiveProfiles() {
    const result = await this.crud.readMany('profile', {
      active: true,
    })
    return result.data || []
  }

  // **Métodos de cálculo e adaptação (finais do ProfileManager)**

  calculateOptimalPace(profile) {
    if (profile.autismLevel === 'level3') return 'slow'
    if (profile.age < 6) return 'slow'
    if (profile.challenges?.includes('cognitive')) return 'slow'
    if (profile.strengths && profile.strengths.length > 2) return 'fast'
    return 'normal'
  }

  calculateSensoryModulations(profile) {
    const modulations = {}
    Object.entries(profile.sensoryPreferences || {}).forEach(([sense, level]) => {
      if (level === 'high') modulations[sense] = 'reduce'
      if (level === 'low') modulations[sense] = 'increase'
    })
    return modulations
  }

  calculateCommunicationAdaptations(profile) {
    const adaptations = []
    if (profile.communicationStyle === 'nonverbal') {
      adaptations.push('picture-communication')
    }
    if (profile.learningStyle === 'visual') {
      adaptations.push('visual-supports')
    }
    return adaptations
  }
}

export default ProfileService
