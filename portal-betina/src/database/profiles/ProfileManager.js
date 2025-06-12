/**
 * @file ProfileManager.js
 * @description Gerenciador de perfis de usuário com foco terapêutico
 */

export class ProfileManager {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService.logger
    this.cache = databaseService.cache
    this.ready = false
  }

  async initialize() {
    this.logger.info('👤 Initializing ProfileManager...')
    this.ready = true
    return true
  }

  isReady() {
    return this.ready
  }

  /**
   * @method getProfiles
   * @async
   * @description Obtém todos os perfis de um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Array>} Lista de perfis
   */
  async getProfiles(userId) {
    const userIdStr = String(userId)
    const cacheKey = `${this.db.localStoragePrefix}profiles_${userIdStr}`

    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.db.helpers.isCacheValid(cached, 900000)) {
      // 15 minutos
      return cached
    }

    if (!navigator.onLine) {
      const localProfiles = this.db.getLocalData(cacheKey, [])
      return localProfiles.length > 0 ? localProfiles : [this.createDefaultProfile(userIdStr)]
    }

    try {
      return await this.db.withRetry(async () => {
        const response = await this.db.authenticatedFetch(
          `${this.db.config.API_URL}/profiles/user/${userIdStr}`,
          { method: 'GET', headers: this.db.apiConfig.DEFAULT_HEADERS }
        )

        if (!response.ok) {
          if (response.status === 404) {
            const defaultProfile = await this.createProfile(userIdStr, this.getDefaultProfileData())
            return [defaultProfile]
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const profiles = await response.json()
        const enrichedProfiles = profiles.map((profile) =>
          this.enrichProfileWithTherapyData(profile)
        )

        this.cache.set(cacheKey, enrichedProfiles, 900000)
        this.db.setLocalData(cacheKey, enrichedProfiles)

        this.logger.info('🌟 Portal Betina: User profiles retrieved', {
          userId: userIdStr,
          profileCount: enrichedProfiles.length,
        })

        return enrichedProfiles
      }, 'getUserProfiles')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to retrieve user profiles', {
        userId: userIdStr,
        error: error.message,
      })

      // Retornar perfis locais ou criar padrão
      const localProfiles = this.db.getLocalData(cacheKey, [])
      return localProfiles.length > 0 ? localProfiles : [this.createDefaultProfile(userIdStr)]
    }
  }

  /**
   * @method createProfile
   * @async
   * @description Cria um novo perfil de usuário
   * @param {string} userId - ID do usuário
   * @param {Object} profileData - Dados do perfil
   * @returns {Promise<Object>} Perfil criado
   */
  async createProfile(userId, profileData) {
    const userIdStr = String(userId)
    const sanitizedData = this.sanitizeProfileData(profileData)
    const enrichedData = this.enrichProfileWithTherapyData(sanitizedData)

    if (!navigator.onLine) {
      // Criar perfil localmente
      const localProfile = {
        id: `local_${Date.now()}`,
        userId: userIdStr,
        ...enrichedData,
        isLocal: true,
        createdAt: new Date().toISOString(),
      }

      // Salvar no cache local
      const cacheKey = `${this.db.localStoragePrefix}profiles_${userIdStr}`
      const existingProfiles = this.db.getLocalData(cacheKey, [])
      existingProfiles.push(localProfile)
      this.db.setLocalData(cacheKey, existingProfiles)
      this.cache.invalidate(`profiles_${userIdStr}`)

      this.logger.warn('🚨 Portal Betina: Profile created locally (offline mode)', {
        userId: userIdStr,
        profileId: localProfile.id,
      })

      return localProfile
    }

    try {
      return await this.db.withRetry(async () => {
        const response = await this.db.authenticatedFetch(`${this.db.config.API_URL}/profiles`, {
          method: 'POST',
          headers: { ...this.db.apiConfig.DEFAULT_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userIdStr, ...enrichedData }),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const createdProfile = await response.json()

        // Invalidar cache
        this.cache.invalidate(`profiles_${userIdStr}`)

        this.logger.info('🌟 Portal Betina: User profile created', {
          userId: userIdStr,
          profileId: createdProfile.id,
        })

        return this.enrichProfileWithTherapyData(createdProfile)
      }, 'createUserProfile')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to create user profile', {
        userId: userIdStr,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method updateProfile
   * @async
   * @description Atualiza um perfil existente
   * @param {string} userId - ID do usuário
   * @param {string} profileId - ID do perfil
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Perfil atualizado
   */
  async updateProfile(userId, profileId, updateData) {
    const userIdStr = String(userId)
    const sanitizedData = this.sanitizeProfileData(updateData)
    const enrichedData = this.enrichProfileWithTherapyData(sanitizedData)

    if (!navigator.onLine) {
      // Atualizar localmente
      const cacheKey = `${this.db.localStoragePrefix}profiles_${userIdStr}`
      const profiles = this.db.getLocalData(cacheKey, [])
      const profileIndex = profiles.findIndex((p) => p.id === profileId)

      if (profileIndex !== -1) {
        profiles[profileIndex] = {
          ...profiles[profileIndex],
          ...enrichedData,
          updatedAt: new Date().toISOString(),
          isLocalUpdate: true,
        }

        this.db.setLocalData(cacheKey, profiles)
        this.cache.invalidate(`profiles_${userIdStr}`)

        this.logger.warn('🚨 Portal Betina: Profile updated locally (offline mode)', {
          userId: userIdStr,
          profileId,
        })

        return profiles[profileIndex]
      } else {
        throw new Error('Profile not found locally')
      }
    }

    try {
      return await this.db.withRetry(async () => {
        const response = await this.db.authenticatedFetch(
          `${this.db.config.API_URL}/profiles/${profileId}`,
          {
            method: 'PUT',
            headers: { ...this.db.apiConfig.DEFAULT_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedData),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const updatedProfile = await response.json()

        // Invalidar cache
        this.cache.invalidate(`profiles_${userIdStr}`)

        this.logger.info('🌟 Portal Betina: User profile updated', {
          userId: userIdStr,
          profileId,
        })

        return this.enrichProfileWithTherapyData(updatedProfile)
      }, 'updateUserProfile')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to update user profile', {
        userId: userIdStr,
        profileId,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * @method deleteProfile
   * @async
   * @description Deleta um perfil
   * @param {string} userId - ID do usuário
   * @param {string} profileId - ID do perfil
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteProfile(userId, profileId) {
    const userIdStr = String(userId)

    if (!navigator.onLine) {
      // Deletar localmente
      const cacheKey = `${this.db.localStoragePrefix}profiles_${userIdStr}`
      const profiles = this.db.getLocalData(cacheKey, [])
      const filteredProfiles = profiles.filter((p) => p.id !== profileId)

      this.db.setLocalData(cacheKey, filteredProfiles)
      this.cache.invalidate(`profiles_${userIdStr}`)

      this.logger.warn('🚨 Portal Betina: Profile deleted locally (offline mode)', {
        userId: userIdStr,
        profileId,
      })

      return true
    }

    try {
      return await this.db.withRetry(async () => {
        const response = await this.db.authenticatedFetch(
          `${this.db.config.API_URL}/profiles/${profileId}`,
          { method: 'DELETE', headers: this.db.apiConfig.DEFAULT_HEADERS }
        )

        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // Invalidar cache
        this.cache.invalidate(`profiles_${userIdStr}`)

        this.logger.info('🌟 Portal Betina: User profile deleted', {
          userId: userIdStr,
          profileId,
        })

        return true
      }, 'deleteUserProfile')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to delete user profile', {
        userId: userIdStr,
        profileId,
        error: error.message,
      })
      return false
    }
  }

  // ============== MÉTODOS DE ENRIQUECIMENTO E PROCESSAMENTO ==============

  /**
   * @method enrichProfileWithTherapyData
   * @description Enriquece perfil com dados terapêuticos
   * @param {Object} profile - Perfil base
   * @returns {Object} Perfil enriquecido
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

  /**
   * @method sanitizeProfileData
   * @description Sanitiza dados do perfil
   * @param {Object} profileData - Dados a serem sanitizados
   * @returns {Object} Dados sanitizados
   */
  sanitizeProfileData(profileData) {
    return {
      name: this.db.helpers.sanitizeInput(profileData.name || '', { maxLength: 50 }),
      age: this.db.helpers.sanitizeNumericInput(profileData.age, 1, 100),
      autismLevel: this.db.helpers.sanitizeEnum(
        profileData.autismLevel,
        ['level1', 'level2', 'level3', 'unknown'],
        'unknown'
      ),
      communicationStyle: this.db.helpers.sanitizeEnum(
        profileData.communicationStyle,
        ['verbal', 'nonverbal', 'mixed', 'aac'],
        'mixed'
      ),
      sensoryPreferences: this.sanitizeSensoryPreferences(profileData.sensoryPreferences || {}),
      learningStyle: this.db.helpers.sanitizeEnum(
        profileData.learningStyle,
        ['visual', 'auditory', 'kinesthetic', 'mixed'],
        'mixed'
      ),
      interests: this.db.helpers.sanitizeArray(profileData.interests || [], [
        'music',
        'art',
        'technology',
        'nature',
        'animals',
        'sports',
        'books',
        'games',
      ]),
      challenges: this.db.helpers.sanitizeArray(profileData.challenges || [], [
        'communication',
        'social',
        'sensory',
        'behavioral',
        'cognitive',
        'motor',
      ]),
      strengths: this.db.helpers.sanitizeArray(profileData.strengths || [], [
        'memory',
        'pattern_recognition',
        'attention_to_detail',
        'creativity',
        'logical_thinking',
      ]),
      goals: this.sanitizeGoals(profileData.goals || []),
      medicalInfo: this.sanitizeMedicalInfo(profileData.medicalInfo || {}),
    }
  }

  /**
   * @method createDefaultProfile
   * @description Cria um perfil padrão
   * @param {string} userId - ID do usuário
   * @returns {Object} Perfil padrão
   */
  createDefaultProfile(userId) {
    return {
      id: `default_${Date.now()}`,
      userId,
      name: 'Perfil Principal',
      age: 8,
      autismLevel: 'unknown',
      communicationStyle: 'mixed',
      sensoryPreferences: this.getDefaultSensoryPreferences(),
      learningStyle: 'mixed',
      interests: ['games'],
      challenges: [],
      strengths: [],
      goals: [],
      medicalInfo: {},
      isDefault: true,
      createdAt: new Date().toISOString(),
      ...this.generateInitialTherapyData(),
    }
  }

  /**
   * @method getDefaultProfileData
   * @description Obtém dados padrão para um novo perfil
   * @returns {Object} Dados padrão
   */
  getDefaultProfileData() {
    return {
      name: 'Novo Perfil',
      age: 8,
      autismLevel: 'unknown',
      communicationStyle: 'mixed',
      sensoryPreferences: this.getDefaultSensoryPreferences(),
      learningStyle: 'mixed',
      interests: ['games'],
      challenges: [],
      strengths: [],
      goals: [
        {
          id: 'goal_1',
          category: 'communication',
          description: 'Melhorar habilidades de comunicação',
          target: 'Aumentar vocabulário expressivo',
          timeline: '3 meses',
          status: 'active',
        },
      ],
      medicalInfo: {},
    }
  }

  // ============== MÉTODOS DE GERAÇÃO DE DADOS TERAPÊUTICOS ==============

  generateTherapyData(profile) {
    return {
      autismProfile: this.assessAutismProfile(profile),
      sensoryProfile: this.createSensoryProfile(profile),
      communicationProfile: this.createCommunicationProfile(profile),
      behavioralProfile: this.createBehavioralProfile(profile),
      cognitiveProfile: this.createCognitiveProfile(profile),
      socialProfile: this.createSocialProfile(profile),
      lastAssessment: new Date().toISOString(),
    }
  }

  generateAdaptiveParameters(profile) {
    return {
      difficulty: this.calculateDifficultyLevel(profile),
      pacing: this.calculatePacingLevel(profile),
      supportLevel: this.calculateSupportLevel(profile),
      sensoryModulations: this.calculateSensoryModulations(profile),
      communicationAdaptations: this.calculateCommunicationAdaptations(profile),
      motivationalFactors: this.identifyMotivationalFactors(profile),
    }
  }

  generateAccessibilityProfile(profile) {
    return {
      visualNeeds: this.assessVisualNeeds(profile),
      auditoryNeeds: this.assessAuditoryNeeds(profile),
      motorNeeds: this.assessMotorNeeds(profile),
      cognitiveNeeds: this.assessCognitiveNeeds(profile),
      communicationNeeds: this.assessCommunicationNeeds(profile),
      environmentalNeeds: this.assessEnvironmentalNeeds(profile),
    }
  }

  generateCognitiveAssessment(profile) {
    return {
      processing: this.assessProcessingSpeed(profile),
      memory: this.assessMemoryCapacity(profile),
      attention: this.assessAttentionSpan(profile),
      executiveFunction: this.assessExecutiveFunction(profile),
      learningStyle: this.analyzeLearnignStyle(profile),
      strengths: this.identifyCognitiveStrengths(profile),
      challenges: this.identifyCognitiveChallenges(profile),
    }
  }

  generateInterventionPlan(profile) {
    return {
      shortTermGoals: this.generateShortTermGoals(profile),
      longTermGoals: this.generateLongTermGoals(profile),
      strategies: this.generateInterventionStrategies(profile),
      accommodations: this.generateAccommodations(profile),
      timeline: this.createInterventionTimeline(profile),
      reviewSchedule: this.createReviewSchedule(profile),
    }
  }

  initializeProgressTracking(profile) {
    return {
      baseline: this.establishBaseline(profile),
      milestones: this.defineMilestones(profile),
      metrics: this.defineProgressMetrics(profile),
      trackingFrequency: this.determineTrackingFrequency(profile),
      reportingSchedule: this.createReportingSchedule(profile),
    }
  }

  // ============== MÉTODOS AUXILIARES ==============

  sanitizeSensoryPreferences(preferences) {
    return {
      visual: this.db.helpers.sanitizeEnum(preferences.visual, ['high', 'normal', 'low'], 'normal'),
      auditory: this.db.helpers.sanitizeEnum(
        preferences.auditory,
        ['high', 'normal', 'low'],
        'normal'
      ),
      tactile: this.db.helpers.sanitizeEnum(
        preferences.tactile,
        ['high', 'normal', 'low'],
        'normal'
      ),
      vestibular: this.db.helpers.sanitizeEnum(
        preferences.vestibular,
        ['high', 'normal', 'low'],
        'normal'
      ),
      proprioceptive: this.db.helpers.sanitizeEnum(
        preferences.proprioceptive,
        ['high', 'normal', 'low'],
        'normal'
      ),
    }
  }

  sanitizeGoals(goals) {
    return goals.map((goal) => ({
      id: this.db.helpers.sanitizeInput(goal.id || `goal_${Date.now()}`, { maxLength: 50 }),
      category: this.db.helpers.sanitizeEnum(
        goal.category,
        ['communication', 'social', 'behavioral', 'cognitive', 'sensory', 'motor'],
        'communication'
      ),
      description: this.db.helpers.sanitizeInput(goal.description || '', { maxLength: 200 }),
      target: this.db.helpers.sanitizeInput(goal.target || '', { maxLength: 200 }),
      timeline: this.db.helpers.sanitizeInput(goal.timeline || '3 meses', { maxLength: 50 }),
      status: this.db.helpers.sanitizeEnum(
        goal.status,
        ['active', 'completed', 'paused'],
        'active'
      ),
    }))
  }

  sanitizeMedicalInfo(medicalInfo) {
    return {
      medications: this.db.helpers.sanitizeArray(medicalInfo.medications || [], []),
      allergies: this.db.helpers.sanitizeArray(medicalInfo.allergies || [], []),
      conditions: this.db.helpers.sanitizeArray(medicalInfo.conditions || [], []),
      therapies: this.db.helpers.sanitizeArray(medicalInfo.therapies || [], []),
      notes: this.db.helpers.sanitizeInput(medicalInfo.notes || '', { maxLength: 500 }),
    }
  }

  getDefaultSensoryPreferences() {
    return {
      visual: 'normal',
      auditory: 'normal',
      tactile: 'normal',
      vestibular: 'normal',
      proprioceptive: 'normal',
    }
  }

  generateInitialTherapyData() {
    return {
      therapyData: {
        autismProfile: { level: 'unknown', characteristics: [] },
        sensoryProfile: { type: 'mixed', preferences: this.getDefaultSensoryPreferences() },
        communicationProfile: { style: 'mixed', level: 'developing' },
        behavioralProfile: { regulation: 'developing', flexibility: 'developing' },
        cognitiveProfile: { processing: 'average', memory: 'average' },
        socialProfile: { interaction: 'developing', awareness: 'developing' },
      },
      adaptiveParameters: {
        difficulty: 'medium',
        pacing: 'normal',
        supportLevel: 'moderate',
      },
      accessibilityProfile: {
        visualNeeds: 'standard',
        auditoryNeeds: 'standard',
        motorNeeds: 'standard',
      },
    }
  }

  // Métodos de avaliação específicos (implementações simplificadas)
  assessAutismProfile(profile) {
    return {
      level: profile.autismLevel || 'unknown',
      characteristics: this.identifyAutismCharacteristics(profile),
      supportNeeds: this.assessSupportNeeds(profile),
    }
  }

  createSensoryProfile(profile) {
    return {
      type: this.determineSensoryType(profile.sensoryPreferences),
      preferences: profile.sensoryPreferences || this.getDefaultSensoryPreferences(),
      triggers: this.identifySensoryTriggers(profile),
      strategies: this.suggestSensoryStrategies(profile),
    }
  }

  createCommunicationProfile(profile) {
    return {
      style: profile.communicationStyle || 'mixed',
      level: this.assessCommunicationLevel(profile),
      modalities: this.identifyPreferredModalities(profile),
      goals: this.generateCommunicationGoals(profile),
    }
  }

  createBehavioralProfile(profile) {
    return {
      regulation: this.assessSelfRegulation(profile),
      flexibility: this.assessCognitiveFlexibility(profile),
      challenges: profile.challenges || [],
      strategies: this.generateBehavioralStrategies(profile),
    }
  }

  createCognitiveProfile(profile) {
    return {
      processing: this.assessProcessingSpeed(profile),
      memory: this.assessMemoryCapacity(profile),
      attention: this.assessAttentionSpan(profile),
      strengths: profile.strengths || [],
      learningStyle: profile.learningStyle || 'mixed',
    }
  }

  createSocialProfile(profile) {
    return {
      interaction: this.assessSocialInteraction(profile),
      awareness: this.assessSocialAwareness(profile),
      goals: this.generateSocialGoals(profile),
      supports: this.generateSocialSupports(profile),
    }
  }

  // Implementações básicas dos métodos de avaliação
  identifyAutismCharacteristics(profile) {
    const characteristics = []
    if (profile.communicationStyle === 'nonverbal') characteristics.push('nonverbal')
    if (profile.challenges && profile.challenges.includes('sensory'))
      characteristics.push('sensory-sensitive')
    if (profile.challenges && profile.challenges.includes('social'))
      characteristics.push('social-challenges')
    return characteristics
  }

  assessSupportNeeds(profile) {
    const challengeCount = (profile.challenges || []).length
    if (challengeCount > 4) return 'intensive'
    if (challengeCount > 2) return 'moderate'
    return 'minimal'
  }

  determineSensoryType(preferences) {
    if (!preferences) return 'mixed'
    const highSensitivity = Object.values(preferences).filter((v) => v === 'high').length
    const lowSensitivity = Object.values(preferences).filter((v) => v === 'low').length

    if (highSensitivity > 2) return 'hypersensitive'
    if (lowSensitivity > 2) return 'hyposensitive'
    return 'mixed'
  }

  assessCommunicationLevel(profile) {
    const age = profile.age || 8
    if (age < 5) return 'emerging'
    if (age < 10) return 'developing'
    return 'established'
  }

  assessProcessingSpeed(profile) {
    if (profile.challenges && profile.challenges.includes('cognitive')) return 'below-average'
    if (profile.strengths && profile.strengths.includes('logical_thinking')) return 'above-average'
    return 'average'
  }

  assessMemoryCapacity(profile) {
    if (profile.strengths && profile.strengths.includes('memory')) return 'above-average'
    if (profile.challenges && profile.challenges.includes('cognitive')) return 'below-average'
    return 'average'
  }

  assessAttentionSpan(profile) {
    const age = profile.age || 8
    const expectedMinutes = Math.min(age * 2, 20) // Regra aproximada
    return {
      expected: expectedMinutes,
      category: 'developing',
      supports: ['visual-cues', 'breaks'],
    }
  }

  // Métodos de geração de objetivos e estratégias
  generateShortTermGoals(profile) {
    const goals = []
    if (profile.challenges && profile.challenges.includes('communication')) {
      goals.push({
        area: 'communication',
        goal: 'Increase expressive vocabulary',
        timeline: '4 weeks',
        measures: ['word count', 'spontaneous use'],
      })
    }
    return goals
  }

  generateLongTermGoals(profile) {
    const goals = []
    goals.push({
      area: 'independence',
      goal: 'Develop independent learning skills',
      timeline: '6 months',
      measures: ['task completion', 'help-seeking'],
    })
    return goals
  }

  generateInterventionStrategies(profile) {
    const strategies = []
    if (profile.learningStyle === 'visual') {
      strategies.push('visual-supports', 'picture-schedules')
    }
    if (profile.challenges && profile.challenges.includes('social')) {
      strategies.push('social-stories', 'peer-mediated-intervention')
    }
    return strategies
  }

  generateAccommodations(profile) {
    const accommodations = []
    if (profile.sensoryPreferences && profile.sensoryPreferences.auditory === 'high') {
      accommodations.push('noise-reducing-headphones', 'quiet-environment')
    }
    return accommodations
  }

  // Métodos básicos adicionais
  calculateDifficultyLevel(profile) {
    const age = profile.age || 8
    if (age < 6) return 'easy'
    if (age > 12) return 'hard'
    return 'medium'
  }

  calculateSupportLevel(profile) {
    const challengeCount = (profile.challenges || []).length
    if (challengeCount > 3) return 'high'
    if (challengeCount > 1) return 'moderate'
    return 'low'
  }

  identifyMotivationalFactors(profile) {
    return profile.interests || ['games']
  }

  assessVisualNeeds(profile) {
    return profile.sensoryPreferences?.visual === 'high' ? 'reduced-stimulation' : 'standard'
  }

  assessAuditoryNeeds(profile) {
    return profile.sensoryPreferences?.auditory === 'high' ? 'reduced-volume' : 'standard'
  }

  assessMotorNeeds(profile) {
    return profile.challenges && profile.challenges.includes('motor')
      ? 'adaptive-controls'
      : 'standard'
  }

  assessCognitiveNeeds(profile) {
    return profile.challenges && profile.challenges.includes('cognitive')
      ? 'simplified-interface'
      : 'standard'
  }

  assessCommunicationNeeds(profile) {
    return profile.communicationStyle === 'nonverbal' ? 'aac-support' : 'standard'
  }

  assessEnvironmentalNeeds(profile) {
    return {
      lighting: 'adjustable',
      noise: 'controlled',
      seating: 'comfortable',
      distractions: 'minimized',
    }
  }

  // Métodos de criação de cronogramas
  createInterventionTimeline(profile) {
    return {
      phase1: '0-4 weeks - Assessment and baseline',
      phase2: '4-12 weeks - Intensive intervention',
      phase3: '12-24 weeks - Maintenance and generalization',
    }
  }

  createReviewSchedule(profile) {
    return {
      weekly: 'Progress monitoring',
      monthly: 'Goal review and adjustment',
      quarterly: 'Comprehensive assessment',
    }
  }

  establishBaseline(profile) {
    return {
      communication: 'baseline-assessment-needed',
      social: 'baseline-assessment-needed',
      behavioral: 'baseline-assessment-needed',
      cognitive: 'baseline-assessment-needed',
    }
  }

  defineMilestones(profile) {
    return [
      { week: 4, target: 'Initial adaptation to platform' },
      { week: 8, target: 'Consistent engagement with activities' },
      { week: 12, target: 'Measurable progress in target areas' },
    ]
  }

  defineProgressMetrics(profile) {
    return {
      engagement: 'time-on-task',
      accuracy: 'correct-responses',
      independence: 'help-requests',
      generalization: 'skill-transfer',
    }
  }

  determineTrackingFrequency(profile) {
    return 'daily'
  }

  createReportingSchedule(profile) {
    return {
      parents: 'weekly',
      therapists: 'bi-weekly',
      team: 'monthly',
    }
  }

  // Métodos auxiliares adicionais
  identifySensoryTriggers(profile) {
    const triggers = []
    if (profile.sensoryPreferences?.auditory === 'high') triggers.push('loud-sounds')
    if (profile.sensoryPreferences?.visual === 'high') triggers.push('bright-lights')
    return triggers
  }

  suggestSensoryStrategies(profile) {
    const strategies = []
    if (profile.sensoryPreferences?.auditory === 'high') strategies.push('headphones')
    if (profile.sensoryPreferences?.tactile === 'low') strategies.push('tactile-input')
    return strategies
  }

  identifyPreferredModalities(profile) {
    const modalities = []
    if (profile.learningStyle === 'visual') modalities.push('visual')
    if (profile.communicationStyle !== 'nonverbal') modalities.push('verbal')
    return modalities
  }

  generateCommunicationGoals(profile) {
    const goals = []
    if (profile.communicationStyle === 'nonverbal') {
      goals.push('Develop alternative communication methods')
    }
    return goals
  }

  assessSelfRegulation(profile) {
    return profile.challenges && profile.challenges.includes('behavioral')
      ? 'developing'
      : 'adequate'
  }

  assessCognitiveFlexibility(profile) {
    return profile.challenges && profile.challenges.includes('behavioral') ? 'rigid' : 'flexible'
  }

  generateBehavioralStrategies(profile) {
    const strategies = []
    if (profile.challenges && profile.challenges.includes('behavioral')) {
      strategies.push('visual-schedules', 'clear-expectations')
    }
    return strategies
  }

  assessSocialInteraction(profile) {
    return profile.challenges && profile.challenges.includes('social') ? 'limited' : 'developing'
  }

  assessSocialAwareness(profile) {
    return profile.challenges && profile.challenges.includes('social') ? 'emerging' : 'developing'
  }

  generateSocialGoals(profile) {
    const goals = []
    if (profile.challenges && profile.challenges.includes('social')) {
      goals.push('Improve peer interaction skills')
    }
    return goals
  }

  generateSocialSupports(profile) {
    const supports = []
    if (profile.challenges && profile.challenges.includes('social')) {
      supports.push('social-stories', 'peer-buddies')
    }
    return supports
  }

  identifyCognitiveStrengths(profile) {
    return profile.strengths || []
  }

  identifyCognitiveChallenges(profile) {
    return profile.challenges ? profile.challenges.filter((c) => c === 'cognitive') : []
  }

  analyzeLearnignStyle(profile) {
    return {
      primary: profile.learningStyle || 'mixed',
      secondary: 'visual',
      accommodations: this.generateLearningAccommodations(profile),
    }
  }

  generateLearningAccommodations(profile) {
    const accommodations = []
    if (profile.learningStyle === 'visual') {
      accommodations.push('visual-aids', 'graphic-organizers')
    }
    return accommodations
  }

  calculatePacingLevel(profile) {
    if (profile.challenges && profile.challenges.includes('cognitive')) return 'slow'
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
