import { DatabaseService } from './databaseService';
import { IntelligentCache } from '../database/core/core/IntelligentCache';
import { CircuitBreaker } from '../database/core/core/CircuitBreaker';
import logger from '../utils/metrics/performanceMonitor';

class DatabaseServiceNandrophic extends DatabaseService {
  constructor() {
    super('nandrophic');
    this.cache = new IntelligentCache('nandrophic');
    this.circuitBreaker = new CircuitBreaker();
  }

  /**
   * Initialize Nandrophic database connection
   * @returns {Promise<boolean>} Connection status
   */
  async initialize() {
    try {
      await super.initialize();
      await this.cache.initialize();
      logger.info('Nandrophic database service initialized');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Nandrophic service', error);
      throw error;
    }
  }

  /**
   * Get Nandrophic data by ID
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return this.circuitBreaker.execute(async () => {
      // Try cache first
      const cached = await this.cache.get(id);
      if (cached) return cached;

      // Fallback to database
      const result = await this.query(
        'SELECT * FROM nandrophic_data WHERE id = ?',
        [id]
      );

      if (result.length > 0) {
        await this.cache.set(id, result[0]);
        return result[0];
      }
      return null;
    });
  }

  /**
   * Create new Nandrophic record
   * @param {Object} data 
   * @returns {Promise<string>} Created record ID
   */
  async create(data) {
    return this.circuitBreaker.execute(async () => {
      const result = await this.query(
        'INSERT INTO nandrophic_data SET ?',
        [data]
      );
      
      if (result.insertId) {
        await this.cache.set(result.insertId.toString(), data);
        return result.insertId.toString();
      }
      throw new Error('Failed to create record');
    });
  }

  /**
   * Update Nandrophic record
   * @param {string} id 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  async update(id, data) {
    return this.circuitBreaker.execute(async () => {
      const result = await this.query(
        'UPDATE nandrophic_data SET ? WHERE id = ?',
        [data, id]
      );
      
      if (result.affectedRows > 0) {
        await this.cache.set(id, data);
        return true;
      }
      return false;
    });
  }

  /**
   * Delete Nandrophic record
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    return this.circuitBreaker.execute(async () => {
      const result = await this.query(
        'DELETE FROM nandrophic_data WHERE id = ?',
        [id]
      );
      
      if (result.affectedRows > 0) {
        await this.cache.del(id);
        return true;
      }
      return false;
    });
  }

  /**
   * Search Nandrophic records with filters
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  async search(filters = {}) {
    return this.circuitBreaker.execute(async () => {
      let query = 'SELECT * FROM nandrophic_data';
      const params = [];
      
      if (Object.keys(filters).length > 0) {
        query += ' WHERE ';
        query += Object.keys(filters)
          .map(key => `${key} = ?`)
          .join(' AND ');
        params.push(...Object.values(filters));
      }

      return await this.query(query, params);
    });
  }
}

export default new DatabaseServiceNandrophic();
        level: this.calculateSocialSupportLevel(settings),
        recommendations: this.getSocialSupportRecommendations(settings),
      },
      behavioralSupport: {
        enabled: settings.behaviorSupports || settings.selfRegulationTools,
        level: this.calculateBehavioralSupportLevel(settings),
        recommendations: this.getBehavioralSupportRecommendations(settings),
      },
      sensorySupport: {
        enabled: settings.sensoryBreaks || settings.sensoryTools,
        level: this.calculateSensorySupportLevel(settings),
        recommendations: this.getSensorySupportRecommendations(settings),
      },
    };
  }

  // **Métodos de Avaliação Cognitiva**
  assessCognitiveLevel(data) {
    const indicators = {
      problemSolving: data.problemSolvingSkills || 50,
      memory: data.memoryCapacity || 50,
      attention: data.attentionSpan || 50,
      processing: data.processingSpeed || 50,
    };
    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4;
    if (average > 88) return 'advanced';
    if (average > 66) return 'appropriate';
    if (average > 48) return 'emerging';
    return 'developing';
  }

  assessCommunicationLevel(data) {
    const preferences = data.preferences || {};
    const indicators = {
      verbalSkills: preferences.verbalCommunication ? 75 : 25,
      nonverbalSkills: preferences.gestureUse ? 75 : 25,
      socialCommunication: preferences.socialInteraction ? 75 : 25,
    };
    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 3;
    if (average > 75) return 'independent';
    if (average > 50) return 'supported';
    if (average > 25) return 'emerging';
    return 'minimal';
  }

  assessSocialSkillsLevel(data) {
    const preferences = data.preferences || {};
    const indicators = {
      socialInitiation: preferences.socialInitiation ? 75 : 25,
      socialReciprocity: preferences.socialReciprocity ? 75 : 25,
      peerInteraction: preferences.peerInteraction ? 75 : 25,
    };
    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 3;
    if (average > 75) return 'independent';
    if (average > 50) return 'supported';
    if (average > 25) return 'emerging';
    return 'minimal';
  }

  // **Criação de Perfis**
  createSensoryProfile(data) {
    const preferences = data.preferences || {};
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
    };
  }

  createBehavioralProfile(data) {
    const preferences = data.preferences || {};
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
    };
  }

  assessAdaptiveSkills(data) {
    const preferences = data.preferences || {};
    return {
      dailyLiving: preferences.dailyLivingSkills || 'emerging',
      socialSkills: preferences.socialSkills || 'emerging',
      communicationSkills: preferences.communicationSkills || 'emerging',
      motorSkills: preferences.motorSkills || 'developing',
    };
  }

  // **Cálculo de Níveis de Suporte**
  calculateVisualSupportLevel(preferences) {
    const needs = [
      preferences.highContrast,
      preferences.largeText,
      preferences.visualSchedules,
      preferences.pictureSupports,
      preferences.colorBlindnessSupport,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  calculateAuditorySupportLevel(preferences) {
    const needs = [
      preferences.textToSpeech,
      preferences.audioFeedback,
      preferences.auditoryPrompts,
      preferences.soundReduction,
      preferences.volumeModulation,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  calculateMotorSupportLevel(preferences) {
    const needs = [
      preferences.largeButtons,
      preferences.reducedMotion,
      preferences.motorAssistance,
      preferences.physicalSupports,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  calculateCognitiveSupportLevel(preferences) {
    const needs = [
      preferences.simplifiedInterface,
      preferences.extraTime,
      preferences.stepByStep,
      preferences.cognitiveAids,
      preferences.memorySupports,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  calculateSocialSupportLevel(preferences) {
    const needs = [
      preferences.socialStories,
      preferences.peerSupport,
      preferences.socialCues,
      preferences.interactionGuides,
      preferences.socialScripts,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  calculateBehavioralSupportLevel(preferences) {
    const needs = [
      preferences.behaviorSupports,
      preferences.selfRegulationTools,
      preferences.calmingStrategies,
      preferences.reinforcementSystems,
      preferences.behaviorPlans,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  calculateSensorySupportLevel(preferences) {
    const needs = [
      preferences.sensoryBreaks,
      preferences.sensoryTools,
      preferences.environmentalMods,
      preferences.sensoryDiet,
      preferences.sensoryRegulation,
    ].filter(Boolean).length;
    if (needs > 3) return 'maximum';
    if (needs > 2) return 'moderate';
    if (needs > 1) return 'minimal';
    return 'none';
  }

  // **Análise de Processamento Sensorial**
  assessVisualProcessing(data) {
    return {
      acuity: data.visualAcuity || 'typical',
      tracking: data.visualTracking || 'developing',
      discrimination: data.visualDiscrimination || 'emerging',
      memory: data.visualMemory || 'developing',
    };
  }

  assessAuditoryProcessing(data) {
    return {
      discrimination: data.auditoryDiscrimination || 'developing',
      memory: data.auditoryMemory || 'emerging',
      processing: data.auditoryProcessing || 'typical',
      attention: data.auditoryAttention || 'variable',
    };
  }

  assessTactileProcessing(data) {
    return {
      sensitivity: data.tactileSensitivity || 'typical',
      discrimination: data.tactileDiscrimination || 'developing',
      tolerance: data.tactileTolerance || 'variable',
    };
  }

  assessVestibularProcessing(data) {
    return {
      balance: data.balance || 'developing',
      movement: data.movementTolerance || 'typical',
    };
  }

  assessProprioceptiveProcessing(data) {
    return {
      bodyAwareness: data.bodyAwareness || 'developing',
      forcePlanning: data.forcePlanning || 'emerging',
      motorPlanning: data.motorPlanning || 'developing',
    };
  }

  determineSensoryProfile(data) {
    const patterns = {
      seeking: data.sensorySeeking || false,
      avoiding: data.sensoryAvoiding || false,
      sensitive: data.sensorySensitive || false,
      registration: data.sensoryRegistration || 'typical',
    };
    if (patterns.seeking && patterns.avoiding) return 'mixed';
    if (patterns.seeking) return 'seeker';
    if (patterns.avoiding) return 'avoider';
    if (patterns.sensitive) return 'sensitive';
    return 'typical';
  }

  // **Avaliação Socioemocional**
  assessEmotionalRegulation(data) {
    return {
      recognition: data.emotionRecognition || 'developing',
      expression: data.emotionExpression || 'emerging',
      regulation: data.emotionRegulation || 'needs-support',
      coping: data.copingStrategies || 'limited',
    };
  }

  assessSocialAwareness(data) {
    return {
      perspective: data.perspectiveTaking || 'emerging',
      empathy: data.empathySkills || 'developing',
      socialCues: data.socialCueReading || 'challenging',
      context: data.socialContext || 'literal',
    };
  }

  assessEmpathySkills(data) {
    return {
      cognitive: data.cognitiveEmpathy || 'developing',
      affective: data.affectiveEmpathy || 'emerging',
      behavioral: data.behavioralEmpathy || 'needs-support',
    };
  }

  assessRelationshipSkills(data) {
    return {
      initiation: data.socialInitiation || 'passive',
      maintenance: data.relationshipMaintenance || 'challenging',
      reciprocity: data.socialReciprocity || 'needs-support',
      boundaries: data.socialBoundaries || 'needs-support',
    };
  }

  assessDecisionMaking(data) {
    return {
      problemSolving: data.problemSolving || 'concrete',
      consequences: data.consequenceUnderstanding || 'emerging',
      values: data.valuesBased || 'developing',
    };
  }

  // **Avaliação de Função Executiva**
  assessWorkingMemory(data) {
    return {
      verbal: data.verbalWorkingMemory || 'developing',
      visual: data.visualWorkingMemory || 'emerging',
      capacity: data.workingMemoryCapacity || 'limited',
    };
  }

  assessCognitiveFlexibility(data) {
    return {
      setShifting: data.setShifting || 'challenging',
      adaptation: data.cognitiveAdaptation || 'rigid',
      perspective: data.perspectiveShifting || 'default',
    };
  }

  assessInhibitoryControl(data) {
    return {
      impulse: data.impulseControl || 'developing',
      attention: data.attentionalControl || 'variable',
      behavioral: data.behavioralInhibition || 'needs-support',
    };
  }

  assessPlanningOrganization(data) {
    return {
      planning: data.planningSkills || 'emerging',
      organization: data.organizationSkills || 'needs-support',
      sequencing: data.sequencingAbility || 'developing',
      prioritization: data.prioritizationSkills || 'challenging',
    };
  }

  assessTimeManagement(data) {
    return {
      awareness: data.timeAwareness || 'emerging',
      estimation: data.timeEstimation || 'inaccurate',
      scheduling: data.timeScheduling || 'needs-support',
    };
  }

  calculateExecutiveFunctionScore(data) {
    const scores = [
      this.scoreExecutiveComponent(data.workingMemory),
      this.scoreExecutiveComponent(data.cognitiveFlexibility),
      this.scoreExecutiveComponent(data.inhibitoryControl),
      this.scoreExecutiveComponent(data.planningOrganization),
      this.scoreExecutiveComponent(data.timeManagement),
    ];
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (average > 75) return 'strong';
    if (average > 50) return 'developing';
    if (average > 25) return 'emerging';
    return 'needs-significant-support';
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
    };
    return typeof level === 'string' ? (levelsScores[level] || 50) : 50;
  }

  evaluateExecutiveFunction(data) {
    return {
      workingMemory: this.assessWorkingMemory(data),
      cognitiveFlexibility: this.assessCognitiveFlexibility(data),
      inhibitoryControl: this.assessInhibitoryControl(data),
      planningOrganization: this.assessPlanningOrganization(data),
      timeManagement: this.assessTimeManagement(data),
      overallScore: this.calculateExecutiveFunctionScore(data),
    };
  }

  // **Identificação de Padrões**
  identifyStrengths(data) {
    const strengths = [];
    if (data.accuracy > 0.8) strengths.push('high-accuracy-performance');
    if (data.consistentPerformance) strengths.push('performance-consistency');
    if (data.taskPersistence) strengths.push('task-persistence');
    if (data.selfRegulation) strengths.push('self-regulation-skills');
    if (data.problemSolving) strengths.push('problem-solving-ability');
    if (data.creativeSolutions) strengths.push('creative-thinking');
    return strengths;
  }

  identifyChallenges(data) {
    const challenges = [];
    if (data.accuracy < 0.4) challenges.push('accuracy-difficulties');
    if (data.timeSpent > 600) challenges.push('extended-processing-time');
    if (data.frustrationLevel > 0.7) challenges.push('frustration-management');
    if (data.attentionDifficulties) challenges.push('attention-regulation');
    if (data.sensoryOverload) challenges.push('sensory-processing');
    if (data.socialDifficulties) challenges.push('social-interaction');
    if (data.communicationBarriers) challenges.push('communication-skills');
    if (data.behavioralChallenges) challenges.push('behavioral-regulation');
    return challenges;
  }

  generateRecommendations(data) {
    const recommendations = [];
    const challenges = this.identifyChallenges(data);
    const strengths = this.identifyStrengths(data);

    if (challenges.includes('accuracy-difficulties')) {
      recommendations.push('implement-errorless-learning-strategies');
      recommendations.push('break-tasks-into-smaller-steps');
    }
    if (challenges.includes('attention-regulation')) {
      recommendations.push('implement-attention-building-activities');
      recommendations.push('reduce-environmental-distractions');
      recommendations.push('use-movement-breaks');
    }
    if (challenges.includes('sensory-processing')) {
      recommendations.push('conduct-sensory-assessment');
      recommendations.push('implement-sensory-diet');
      recommendations.push('modify-environmental-inputs');
    }
    if (strengths.includes('memory-skills')) {
      recommendations.push('leverage-memory-strength-for-learning');
      recommendations.push('use-memory-based-teaching-strategies');
    }
    if (strengths.includes('creative-thinking')) {
      recommendations.push('incorporate-creative-activities');
      recommendations.push('encourage-divergent-thinking-tasks');
    }
    return recommendations;
  }

  // **Gerenciamento de Perfis**
  identifyProfileStrengths(profile) {
    const preferences = profile.preferences || {};
    const strengths = [];
    if (preferences.visualLearning) strengths.push('visual-learning-preference');
    if (preferences.auditoryLearning) strengths.push('auditory-learning-preference');
    if (preferences.kinestheticLearning) strengths.push('kinesthetic-learning-preference');
    if (preferences.routineFollowing) strengths.push('routine-adherence');
    if (preferences.detailOriented) strengths.push('attention-to-detail');
    if (preferences.memorySkills) strengths.push('memory-abilities');
    if (preferences.patternRecognition) strengths.push('pattern-recognition');
    return strengths;
  }

  identifyProfileNeeds(profile) {
    const preferences = profile.preferences || {};
    const needs = [];
    if (preferences.socialSupport) needs.push('social-skills-development');
    if (preferences.communicationSupport) needs.push('communication-enhancement');
    if (preferences.behavioralSupport) needs.push('behavioral-regulation');
    if (preferences.sensorySupport) needs.push('sensory-processing-support');
    if (preferences.academicSupport) needs.push('academic-skill-building');
    if (preferences.motorSupport) needs.push('motor-skill-development');
    if (preferences.cognitiveSupport) needs.push('cognitive-skill-enhancement');
    return needs;
  }

  suggestTherapyGoals(profile) {
    const needs = this.identifyProfileNeeds(profile);
    const goals = [];
    if (needs.includes('social-skills-development')) {
      goals.push('improve-peer-interaction-skills');
      goals.push('develop-social-initiation-abilities');
      goals.push('enhance-social-reciprocity');
    }
    if (needs.includes('communication-enhancement')) {
      goals.push('expand-expressive-communication');
      goals.push('improve-receptive-language');
      goals.push('develop-functional-communication');
    }
    if (needs.includes('behavioral-regulation')) {
      goals.push('develop-self-regulation-strategies');
      goals.push('improve-emotional-regulation');
      goals.push('enhance-coping-mechanisms');
    }
    return goals;
  }

  recommendInterventions(profile) {
    const interventions = [];
    const goals = this.suggestTherapyGoals(profile);
    if (goals.includes('improve-peer-interaction-skills')) {
      interventions.push('structured-social-activities');
      interventions.push('peer-mediated-interventions');
      interventions.push('social-stories-implementation');
    }
    if (goals.includes('develop-self-regulation-strategies')) {
      interventions.push('mindfulness-based-interventions');
      interventions.push('sensory-regulation-techniques');
      interventions.push('cognitive-behavioral-strategies');
    }
    return interventions;
  }

  // **Análise de Dificuldade e Progressão**
  calculateDifficultyProgression(session) {
    const performanceData = session.performanceData || {};
    const accuracy = performanceData.accuracy || 0;
    const timeSpent = performanceData.timeSpent || 0;
    const hintsUsed = performanceData.hintsUsed || 0;
    let progression = 'maintain';

    if (accuracy > 0.85 && timeSpent < 300 && hintsUsed < 2) {
      progression = 'increase';
    } else if (accuracy < 0.4 || timeSpent > 600 || hintsUsed > 5) {
      progression = 'decrease';
    }

    return {
      recommendation: progression,
      confidence: this.calculateProgressionConfidence(performanceData),
      factors: {
        accuracy,
        timeSpent,
        hintsUsed,
        completed: session.completed,
      },
    };
  }

  calculateProgressionConfidence(data) {
    let confidence = 0.5;
    if (data.attempts > 5) confidence += 0.2;
    if (data.timeSpent > 60) confidence += 0.1;
    if (data.consistency) confidence += 0.2;
    return Math.min(confidence, 1.0);
  }

  explainProgressionReasoning(data, progression) {
    const reasons = [];
    if (progression === 'increase') {
      if (data.accuracy > 0.85) reasons.push('high-accuracy-achieved');
      if (data.timeSpent < 300) reasons.push('efficient-completion-time');
    } else if (progression === 'decrease') {
      if (data.accuracy < 0.4) reasons.push('accuracy-below-threshold');
      if (data.timeSpent > 600) reasons.push('extended-processing-time');
      if (data.frustrationLevel > 0.7) reasons.push('high-frustration-observed');
    }
    return reasons;
  }

  // **Extração de Indicadores Comportamentais**
  extractBehavioralIndicators(data) {
    return {
      engagement: this.assessEngagement(data),
      persistence: this.assessPersistence(data),
      frustration: this.assessFrustration(data),
      regulation: this.assessRegulation(data),
      attention: this.assessAttention(data),
      motivation: this.assessMotivation(data),
    };
  }

  assessEngagement(data) {
    const attempts = data.attempts || 0;
    const interactions = data.interactions || 0;
    let score = 0;
    if (attempts > 3) score += 0.3;
    if (interactions > 5) score += 0.4;
    if (score > 0.8) return 'high';
    if (score > 0.2) return 'moderate';
    return 'low';
  }

  assessPersistence(data) {
    const attempts = data.attempts || 0;
    const errors = data.errors || 0;
    const completion = data.completion || false;
    if (completion && attempts > errors * 2) return 'high';
    if (attempts > 5) return 'moderate';
    if (attempts > 2) return 'low';
    return 'minimal';
  }

  assessFrustration(data) {
    const frustrationLevel = data.frustrationLevel || 0;
    const errorRate = data.errors / Math.max(data.attempts, 1);
    const abandonmentRate = data.abandonmentRate || 0;
    let indicators = 0;
    if (frustrationLevel > 0.7) indicators++;
    if (errorRate > 0.3) indicators++;
    if (abandonmentRate > 0.3) indicators++;
    if (indicators > 2) return 'high';
    if (indicators > 1) return 'moderate';
    if (indicators > 0) return 'low';
    return 'minimal';
  }

  assessRegulation(data) {
    const selfCorrections = data.selfCorrections || 0;
    const pausesTaken = data.pausesTaken || 0;
    const helpSeeking = data.helpSeeking || 0;
    let score = 0;
    if (selfCorrections > 2) score += 0.4;
    if (pausesTaken > 1) score += 0.3;
    if (helpSeeking > 0) score += 0.3;
    if (score > 0.8) return 'independent';
    if (score > 0.2) return 'emerging';
    return 'needs-support';
  }

  assessAttention(data) {
    const focusTime = data.focusTime || 0;
    const distractions = data.distrations || 0;
    const taskSwitching = data.taskSwitching || 0;
    let score = focusTime /  }

    if (score > 0.8) return 'sustained';
    return 'difficult';
  }

  assessMotivation(data) {
    const taskInitiation = data.taskInitiation || false;
    const taskCompletion = data.taskCompletion || false;
    const positiveResponse = data.positiveResponse || false;
    const requestForMore = data.requestForMore || false;

    let motivationIndicators = 0;
    if (taskInitiation) motivationIndicators++;
    if (taskCompletion) motivationIndicators++;
    if (positiveResponse) motivationIndicators++;
    if (requestForMore) motivationIndicators++;

    if (motivationIndicators >= 4) return 'high';
    if (motivationIndicators >= 3) return 'moderate';
    if (motivationIndicators >= 2) return 'emerging';
    return 'low';
  }

  // **Recomendações de Suporte**
  getVisualSupportRecommendations(settings) {
    const recommendations = [];
    if (settings.highContrast) {
      recommendations.push('maintain-high-contrast-interface');
      recommendations.push('use-bold-visual-elements');
    }
    if (settings.largeText) {
      recommendations.push('implement-scalable-text-options');
      recommendations.push('ensure-readable-font-choices');
    }
    recommendations.push('provide-visual-cues-for-navigation');
    recommendations.push('use-consistent-visual-layouts');
    return recommendations;
  }

  getAuditorySupportRecommendations(settings) {
    const recommendations = [];
    if (settings.textToSpeech) {
      recommendations.push('implement-comprehensive-tts');
      recommendations.push('provide-audio-descriptions');
    }
    if (settings.audioFeedback) {
      recommendations.push('use-meaningful-audio-cues');
      recommendations.push('provide-audio-confirmation');
    }
    recommendations.push('offer-volume-control-options');
    recommendations.push('minimize-background-audio-interference');
    return recommendations;
  }

  getMotorSupportRecommendations(settings) {
    const recommendations = [];
    if (settings.largeButtons) {
      recommendations.push('implement-touch-friendly-interfaces');
      recommendations.push('ensure-adequate-button-spacing');
    }
    if (settings.reducedMotion) {
      recommendations.push('minimize-animated-elements');
      recommendations.push('provide-static-alternatives');
    }
    recommendations.push('support-keyboard-navigation');
    recommendations.push('implement-gesture-alternatives');
    return recommendations;
  }

  getCognitiveSupportRecommendations(settings) {
    const recommendations = [];
    if (settings.simplifiedInterface) {
      recommendations.push('reduce-interface-complexity');
      recommendations.push('prioritize-essential-functions');
    }
    if (settings.extraTime) {
      recommendations.push('provide-extended-time-limits');
      recommendations.push('implement-paced-task-delivery');
    }
    recommendations.push('offer-step-by-step-guidance');
    recommendations.push('use-memory-aids-for-tasks');
    return recommendations;
  }

  getSocialSupportRecommendations(settings) {
    const recommendations = [];
    if (settings.socialStories) recommendations.push('implement-social-stories');
    if (settings.peerSupport) recommendations.push('facilitate-peer-interactions');
    recommendations.push('provide-social-cue-training');
    return recommendations;
  }

  getBehavioralSupportRecommendations(settings) {
    const recommendations = [];
    if (settings.behaviorSupports) recommendations.push('implement-behavioral-interventions');
    if (settings.selfRegulationTools) recommendations.push('provide-self-regulation');
    recommendations.push('use-calming-tools');
    return recommendations;
  }

  getSensorySupportRecommendations(settings) {
    const recommendations = [];
    if (settings.sensoryBreaks) recommendations.push('schedule-sensory-breaks');
    if (settings.sensoryTools) recommendations.push('provide-sensory-tools');
    recommendations.push('modify-environmental-sensory-inputs');
    return recommendations;
  }

  // **Gerenciamento de Perfis de Usuário**
  async getUserProfiles(userId) {
    const userIdStr = String(userId);
    const cacheKey = `${this.localStoragePrefix}user_profiles_${userIdStr}`;

    const cached = this.cache.get(cacheKey);
    if (cached !== null) {
      this.logger.debug('Retrieved user profiles from cache', { userId: userIdStr });
      return cached;
    }

    if (!navigator.onLine) {
      const local = this.getLocalData(cacheKey);
      if (local) {
        this.logger.info('Retrieved offline user profiles', { userId: userIdStr });
        return local;
      }
      throw new Error('Internet connection required for user profiles');
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles`,
          {
            method: 'GET',
            headers: {
              ...this.API_CONFIG.DEFAULT_HEADERS,
              Authorization: `Bearer ${this.authService.getToken()}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            const defaultProfile = await this.createDefaultUserProfile(userIdStr);
            this.cache.set(cacheKey, [defaultProfile], 1800000);
            this.setLocalData(cacheKey, [defaultProfile]);
            return [defaultProfile];
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const profiles = await response.json();
        this.cache.set(cacheKey, profiles, 1800000);
        this.setLocalData(cacheKey, profiles);
        this.logger.info('User profiles retrieved successfully', {
          userId: userIdStr,
          profileCount: profiles.length,
        });

        return profiles;
      }, 'getUserProfiles');
    } catch (error) {
      this.logger.error('Failed to retrieve user profiles', {
        userId: userIdStr,
        error: error.message,
      });
      throw new Error('Unable to retrieve user profiles. Please check your connection.');
    }
  }

  async createUserProfile(userId, profileData) {
    const userIdStr = String(userId);
    const cacheKey = `${this.localStoragePrefix}user_profiles_${userIdStr}`;

    const sanitizedProfile = this.sanitizeUserProfile(profileData);

    if (!navigator.onLine) {
      throw new Error('Internet connection required for profile creation');
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles}`,
          {
            method: 'POST',
            headers: {
              ...this.API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.authService.getToken()}`,
            },
            body: JSON.stringify(sanitizedProfile),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const newProfile = await response.json();
        this.cache.invalidate(cacheKey);
        this.logger.info('User profile created successfully', {
          userId: userIdStr,
          profileId: newProfile.id,
        });

        return newProfile;
      }, 'createUserProfile');
    } catch (error) {
      this.logger.error('Failed to create user profile', {
        userId: userIdStr,
        error: error.message,
      });
      throw new Error('Unable to create user profile. Please check your connection.');
    }
  }

  async updateUserProfile(userId, profileId, profileData) => {
    const userIdStr = String(userId);
    const profileIdStr = String(profileId);
    const cacheKey = `${this.localStoragePrefix}user_profiles_${userIdStr}`;

    const sanitizedProfile = this.sanitizeUserProfile(profileData);

    if (!navigator.onLine) {
      throw new Error('Internet connection required for profile update');
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles}/${profileIdStr}`,
          {
            method: 'PUT',
            headers: {
              ...this.API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.authService.getToken()}`,
            },
            body: JSON.stringify(sanitizedProfile),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedProfile = await response.json();
        this.cache.invalidate(cacheKey);
        this.logger.info('User profile updated successfully', {
          userId: userIdStr,
          profileId: profileIdStr,
        });

        return updatedProfile;
      }, 'updateUserProfile');
    } catch (error) {
      this.logger.error('Failed to update user profile', {
        userId: userIdStr,
        profileId: profileIdStr,
        error: error.message,
      });
      throw new Error('Unable to update user profile. Please check your connection.');
    }
  }

  async deleteUserProfile(userId, profileId) {
    const userIdStr = String(userId);
    const profileIdStr = String(profileId);
    const cacheKey = `${this.localStoragePrefix}user_profiles_${userIdStr}`;

    if (!navigator.onLine) {
      throw new Error('Internet connection required for profile deletion');
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles/${profileIdStr}`,
          {
            method: 'DELETE',
            headers: {
              ...this.API_CONFIG.DEFAULT_HEADERS,
              Authorization: `Bearer ${this.authService.getToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        this.cache.invalidate(cacheKey);
        this.logger.info('User profile deleted successfully', {
          userId: userIdStr,
          profileId: profileIdStr,
        });

        return { success: true };
      }, 'deleteUserProfile');
    } catch (error) {
      this.logger.error('Failed to delete user profile', {
        userId: userIdStr,
        profileId: profileIdStr,
        error: error.message,
      });
      throw new Error('Unable to delete user profile. Please check your connection.');
    }
  }

  async createDefaultUserProfile(userId) {
    const defaultProfile = {
      name: 'Perfil Principal',
      isDefault: true,
      autismCharacteristics: {
        communicationLevel: 'mixed',
        socialInteractionLevel: 'moderate',
        behavioralPatterns: ['structured-routine'],
        sensoryPreferences: {
          visual: 'moderate',
          auditory: 'low',
          tactile: 'low',
        },
      },
      learningPreferences: {
        visualLearning: true,
        auditoryLearning: false,
        kinestheticLearning: true,
        preferredPace: 'slow',
      },
      therapyGoals: [
        'improve-communication',
        'enhance-social-skills',
        'develop-academic-skills',
      ],
      accessibilityNeeds: {
        fontSize: 'large',
        contrast: 'high',
        reduceMotion: true,
        audioSupport: true,
      },
      createdAt: new Date().toISOString(),
      version: '1.0',
    };

    try {
      return await this.createUserProfile(userId, defaultProfile);
    }
  }

  sanitizeUserProfile(profileData) {
    const sanitized = {
      name: this.sanitizeInput(profileData.name || '0Perfil', { maxLength: 50 }),
      isDefault: Boolean(profileData.isDefault),
      autismCharacteristics: {
        communicationLevel: this.sanitizeEnum(
          profileData.autismCharacteristics?.communicationLevel,
          ['nonverbal', 'limited', 'mixed', 'verbal'],
          'mixed'
        ),
        socialInteractionLevel: this.sanitizeEnum(
          profileData.autismCharacteristics?.socialInteractionLevel,
          ['minimal', 'limited', 'moderate', 'high'],
          'moderate'
        ),
        behavioralPatterns: this.sanitizeArray(
          profileData.autismCharacteristics?.behavioralPatterns,
          ['structured-routine', 'sensory-seeking', 'sensory-avoiding', 'repetitive-behaviors']
        ),
        sensoryPreferences: {
          visual: this.sanitizeEnum(
            profileData.autismCharacteristics?.sensoryPreferences?.visual,
            ['low', 'moderate', 'high'],
            'moderate'
          ),
          auditory: this.sanitizeEnum(
            profileData.autismCharacteristics?.sensoryPreferences?.auditory,
            ['low', 'moderate', 'high'],
            'low'
          ),
          tactile: this.sanitizeEnum(
            profileData.autismCharacteristics?.sensoryPreferences?.tactile,
            ['low', 'moderate', 'high'],
            'low'
          ),
        },
      },
      learningPreferences: {
        visualLearning: Boolean(profileData.learningPreferences?.visualLearning ?? true),
        auditoryLearning: Boolean(profileData.learningPreferences?.auditoryLearning ?? false),
        kinestheticLearning: Boolean(profileData.learningPreferences?.kinestheticLearning ?? true),
        preferredPace: this.sanitizeEnum(
          profileData.learningPreferences?.preferredPace,
          ['very-slow', 'slow', 'moderate', 'fast'],
          'slow'
        ),
      },
      therapyGoals: this.sanitizeArray(profileData.therapyGoals, [
        'improve-communication',
        'enhance-social-skills',
        'develop-academic-skills',
        'increase-independence',
        'reduce-anxiety',
        'improve-motor-skills',
      ]),
      accessibilityNeeds: {
        fontSize: this.sanitizeEnum(
          profileData.accessibilityNeeds?.fontSize,
          ['small', 'medium', 'large', 'extra-large'],
          'large'
        ),
        contrast: this.sanitizeEnum(
          profileData.accessibilityNeeds?.contrast,
          ['low', 'normal', 'high'],
          'high'
        ),
        reduceMotion: Boolean(profileData.accessibilityNeeds?.reduceMotion ?? true),
        audioSupport: Boolean(profileData.accessibilityNeeds?.audioSupport ?? true),
      },
    };

    if (profileData.id) sanitized.id = profileData.id;
    if (profileData.createdAt) sanitized.createdAt = profileData.createdAt;
    sanitized.updatedAt = new Date().toISOString();
    sanitized.version = '1.0';

    return sanitized;
  }

  // **Parâmetros Adaptativos**
  async getAdaptiveParameters(userId, gameId, sessionData = null) {
    const cacheKey = `${this.localStoragePrefix}adaptive_params_${userId}_${gameId}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== null && this.isCacheValid(cached, 600000)) {
      return cached;
    }

    const defaultParams = {
      difficulty: { level: 'MEDIUM', adaptationRate: 0.15 },
      timing: { baseTime: 90, adaptationFactor: 0.25 },
      feedback: { frequency: 'moderate', type: 'visual' },
      support: { scaffoldingLevel: 'moderate' },
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      source: 'default',
    };

    if (!navigator.onLine) {
      const local = this.getLocalData(cacheKey);
      if (local) return local;
      return defaultParams;
    }

    try {
      return await this.withRetry(async () => {
        const response = await this.authenticatedFetch(
          `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.adaptiveParameters}/user/${userId}/game/${gameId}`,
          {
            method: 'GET',
            headers: {
              ...this.API_CONFIG.DEFAULT_HEADERS,
              Authorization: `Bearer ${this.authService.getToken()}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            this.cache.set(cacheKey, defaultParams, 600000);
            this.setLocalData(cacheKey, defaultParams);
            return defaultParams;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const params = await response.json();
        this.cache.set(cacheKey, params, 600000);
        this.setLocalData(cacheKey, params);
        return params;
      }, 'getAdaptiveParameters');
    } catch (error) {
      this.logger.error('Failed to get adaptive parameters', {
        userId,
        gameId,
        error: error.message,
      });
      return defaultParams;
    }
  }

  async getAdaptiveParametersWithML(userId, gameId, sessionData = null, options = {}) {
    const defaultOptions = {
      useRealTimeAdaptation: true,
      modelVersion: 'v2',
      sessionLimit: 10,
      confidenceThreshold: 0.7,
    };
    const finalOptions = { ...defaultOptions, ...options };
    const cacheKey = `${this.localStoragePrefix}ml_adaptive_params_${userId}_${gameId}_${${finalOptions.modelVersion}`;
    const cacheTTL = finalOptions.useRealTimeAdaptation ? 300000 : 1800000;

    const cached = this.cache.get(cacheKey);
    if (cached !== null && this.isCacheValid(cached, cacheTTL)) {
      return cached;
    }

    const defaultParams = {
      difficulty: { level: 'MEDIUM', adaptationRate: 0.15 },
      timing: { baseTime: 90, adaptationFactor: 0.25 },
      feedback: { frequency: 'moderate', type: 'visual' },
      support: { scaffoldingLevel: 'moderate' },
      cognitiveScaffolding: { level: 'medium', autoAdjust: true },
      sensoryAdaptations: {
        visual: { complexity: 'medium', contrast: 'standard' },
        auditory: { volume: 'medium', complexity: 'low' },
        haptic: { enabled: false },
      },
      version: '2.0',
      mlEnhanced: true,
      lastUpdated: new Date().toISOString(),
      source: 'ml-default',
    };

    if (!navigator.onLine) {
      const local = this.getLocalData(cacheKey);
      if (local) {
        this.logger.info('Using offline ML parameters', { userId, gameId });
        return local;
      }
      this.logger.warn('Offline - using default ML parameters', { userId, gameId });
      return defaultParams;
    }

    try {
      return await this.withRetry(async () => {
        const userProfile = await this.getUserCognitiveProfile(userId);
        const sessionHistory = await this.getGameSessionsForML(userId, gameId, finalOptions.sessionLimit);

        const mlPayload = {
          userId,
          gameId,
          userProfile,
          sessionHistory,
          currentSession: sessionData || null,
          options: {
            modelVersion: finalOptions.modelVersion,
            realTimeAdaptation: finalOptions.useRealTimeAdaptation,
          },
          deviceContext: {
            type: this.detectDeviceType(),
            capabilities: this.detectDeviceCapabilities(),
            accessibilitySettings: this.detectAccessibilityNeeds(),
          },
        };

        const response = await this.authenticatedFetch(
          `${this.apiUrl}/ml/adaptive-parameters`,
          {
            method: 'POST',
            headers: {
              ...this.API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.authService.getToken()}`,
            },
            body: JSON.stringify(mlPayload),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const mlResult = await response.json();
        if (mlResult.confidence < finalOptions.confidenceThreshold) {
          this.logger.warn('Low ML confidence', {
            userId,
            gameId,
            confidence: mlResult.confidence,
            threshold: finalOptions.confidenceThreshold,
          });
          const mergedParams = this.mergeAdaptiveParams(defaultParams, mlResult.parameters, 0.3);
          mergedParams.source = 'ml-low-confidence-hybrid';
          this.cache.set(cacheKey, mergedParams, 300000);
          this.setLocalData(cacheKey, mergedParams);
          return mergedParams;
        }

        const enhancedParams = {
          ...mlResult.parameters,
          metaData: {
            modelVersion: finalOptions.modelVersion,
            confidence: mlResult.confidence,
            generatedAt: new Date().toISOString(),
            factors: mlResult.influentialFactors || [],
            adaptationHistory: mlResult.adaptationHistory || [],
          },
          source: 'ml-high-confidence',
          lastUpdated: new Date().toISOString(),
        };

        this.cache.set(cacheKey, enhancedParams, cacheTTL);
        this.setLocalData(cacheKey, enhancedParams);
        this.logger.info('ML adaptive parameters generated successfully', {
          userId,
          gameId,
          confidence: mlResult.confidence,
          difficulty: enhancedParams.difficulty.level,
        });

        return enhancedParams;
      }, 'getAdaptiveParametersWithML');
    } catch (error) {
      this.logger.error('Failed to get ML adaptive parameters', {
        userId,
        gameId,
        error: error.message,
      });
      try {
        const traditionalParams = await this.getAdaptiveParameters(userId, gameId, sessionData);
        traditionalParams.source = 'traditional-fallback';
        return traditionalParams;
      } catch (e) {
        return defaultParams;
      }
    }
  }

  mergeAdaptiveParams(baseParams, newParams, newParamsWeight = 0.5) {
    const result = JSON.parse(JSON.stringify(baseParams));
    const weight = Math.max(0, Math.min(1, newParamsWeight));

    if (newParams.difficulty) {
      const difficultyLevels = {
        VERY_EASY: 1,
        EASY: 2,
        MEDIUM: 3,
        HARD: 4,
        VERY_HARD: 5,
      };
      const baseDiffValue = difficultyLevels[result.difficulty.level] || 3;
      const newDiffValue = difficultyLevels[newParams.difficulty.level] || 3;
      const weightedDiffValue = Math.round((baseDiffValue * (1 - weight)) + (newDiffValue * weight));
      const difficultyKeys = Object.keys(difficultyLevels);
      result.difficulty.level = difficultyKeys.find(
        key => difficultyLevels[key] === weightedDiffValue
      ) || 'MEDIUM';
      if (typeof newParams.difficulty.adaptationRate === 'number') {
        result.difficulty.adaptationRate =
          (result.difficulty.adaptationRate * (1 - weight)) +
          (newParams.difficulty.adaptationRate * weight);
      }
    }

    if (newParams.timing) {
      if (typeof newParams.timing.baseTime === 'number') {
        result.timing.baseTime = Math.round(
          (result.timing.baseTime * (1 - weight)) + (newParams.timing.baseTime * weight)
        );
      }
      if (typeof newParams.timing.adaptationFactor === 'number') {
        result.timing.adaptationFactor =
          (result.timing.adaptationFactor * (1 - weight)) +
          (newParams.timing.adaptationFactor * weight);
      }
    }

    if (newParams.feedback && weight > 0.5) {
      result.feedback.type = newParams.feedback.type || result.feedback.type;
      result.feedback.frequency = newParams.feedback.frequency || result.feedback.frequency;
    }

    if (newParams.support && typeof newParams.support.scaffoldingLevel === 'string') {
      const scaffoldingLevels = {
        minimal: 1,
        light: 2,
        moderate: 3,
        high: 4,
        intensive: 5,
      };
      const baseScaffLevel = scaffoldingLevels[result.support.scaffoldingLevel] || 3;
      const newScaffLevel = scaffoldingLevels[newParams.support.scaffoldingLevel] || 3;
      const weightedScaffLevel = Math.round((baseScaffLevel * (1 - weight)) + (newScaffLevel * weight));
      const scaffoldingKeys = Object.keys(scaffoldingLevels);
      result.support.scaffoldingLevel = scaffoldingKeys.find(
        key => scaffoldingLevels[key] === weightedScaffLevel
      ) || 'moderate';
    }

    if (newParams.cognitiveScaffolding && weight > 0.3) {
      result.cognitiveScaffolding = newParams.cognitiveScaffolding;
    }
    if (newParams.sensoryAdaptations && weight > 0.3) {
      result.sensoryAdaptations = newParams.sensoryAdaptations;
    }

    return result;
  }

  async getUserCognitiveProfile(userId) {
    const cacheKey = `${this.localStoragePrefix}cognitive_profile_${userId}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      const response = await this.authenticatedFetch(
        `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.cognitiveProfiles}/${userId}`,
        {
        method: 'GET',
        headers: {
          ...this.API_CONFIG.DEFAULT_HEADERS,
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return this.createDefaultCognitiveProfile(userId);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const profile = await response.json();
    this.cache.set(cacheKey, profile, 3600000); // 1 hora
    return profile;
  } catch (error) {
    this.logger.warn('Failed to get cognitive profile, using default', {
      userId,
      error: error.message,
    });
    return this.createDefaultCognitiveProfile(userId);
  }
}

createDefaultCognitiveProfile(userId) {
  return {
    userId,
    cognitiveAreas: {
      attention: { score: 0.5, confidence: 0.3 },
      memory: { score: 0.5, confidence: 0.3 },
      language: { score: 0.5, confidence: 0.3 },
      executiveFunction: { score: 0.5, confidence: 0.3 },
      socialCognition: { score: 0.5, confidence: 0.3 },
    },
    autismCharacteristics: {
      communicationStyle: 'mixed',
      socialInteraction: 'moderate',
      repetitiveBehaviors: 'moderate',
      sensoryProcessing: 'moderate',
    },
    learningPreferences: {
      visual: true,
      auditory: false,
      kinesthetic: false,
      preferredPace: 'moderate',
    },
    confidence: 0.3,
    lastUpdated: new Date().toISOString(),
    generatedBy: 'system-default',
  };
}

async getGameSessionsForML(userId, gameId, limit = 10) {
  try {
    const sessions = await this.getGameSessions(userId, gameId, limit);
    return sessions.map(session => ({
      id: session.id,
      gameId: session.gameId,
      startTime: session.startTime,
      endTime: session.endTime,
      completed: session.completed,
      difficulty: session.difficulty,
      performance: {
        accuracy: session.performance_data?.accuracy || 0,
        timeSpent: session.performance_data?.timeSpent || 0,
        hintsUsed: session.performance_data?.hintsUsed || 0,
        errors: session.performance_data?.errors || 0,
        frustrationLevel: session.performance_data?.frustrationLevel || 0,
      },
      adaptiveParameters: session.adaptiveParameters,
    }));
  } catch (error) {
    this.logger.warn('Failed to get sessions for ML', {
      userId,
      gameId,
      error: error.message,
    });
    return [];
  }
}

async getGameSessions(userId, gameId, limit = 10) {
  const cacheKey = `${this.localStoragePrefix}sessions_${userId}_${gameId}`;
  const cached = this.cache.get(cacheKey);
  if (cached !== null) {
    return cached.slice(0, limit);
  }

  if (!navigator.onLine) {
    const local = this.getLocalData(cacheKey);
    if (local) return local.slice(0, limit);
    throw new Error('Internet connection required for game sessions');
  }

  try {
    const response = await this.authenticatedFetch(
      `${this.apiUrl}${this.API_CONFIG.ENDPOINTS.sessions}/user/${userId}/game/${gameId}?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...this.API_CONFIG.DEFAULT_HEADERS,
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const sessions = await response.json();
    this.cache.set(cacheKey, sessions, 1800000);
    this.setLocalData(cacheKey, sessions);
    return sessions.slice(0, limit);
  } catch (error) {
    this.logger.error('Failed to retrieve game sessions', {
      userId,
      gameId,
      error: error.message,
    });
    throw error;
  }
}

enrichProfileWithTherapyData(profile) {
  try {
    return {
      ...profile,
      therapyAnalysis: {
        cognitiveLevel: this.assessCognitiveLevel(profile),
        communicationProfile: this.assessCommunicationLevel(profile),
        socialSkillsLevel: this.assessSocialSkillsLevel(profile),
        sensoryProfile: this.createSensoryProfile(profile),
        behavioralProfile: this.createBehavioralProfile(profile),
        adaptiveSkills: this.assessAdaptiveSkills(profile),
      },
      supportNeeds: {
        visualSupport: this.calculateVisualSupportLevel(profile.preferences || {}),
        auditorySupport: this.calculateAuditorySupportLevel(profile.preferences || {}),
        motorSupport: this.calculateMotorSupportLevel(profile.preferences || {}),
        cognitiveSupport: this.calculateCognitiveSupportLevel(profile.preferences || {}),
        socialSupport: this.calculateSocialSupportLevel(profile.preferences || {})),
        behavioralSupport: this.calculateBehavioralSupportLevel(profile.preferences || {})),
        sensorySupport: this.calculateSensorySupportLevel(profile.preferences || {})),
      },
      recommendations: {
        strengths: this.identifyProfileStrengths(profile),
        needs: this.identifyProfileNeeds(profile),
        goals: this.suggestTherapyGoals(profile),
        interventions: this.recommendInterventions(profile),
      },
    };
  } catch (error) {
    this.logger.warn('Failed to enrich profile with therapy data', {
      profileId: profile.id,
      error: error.message,
    });
    return profile;
  }
}

generateInitialTherapyData(profileData) {
  return {
    assessmentDate: new Date().toISOString(),
    cognitiveProfile: this.assessCognitiveLevel(profileData),
    communicationProfile: this.assessCommunicationLevel(profileData),
    socialSkillsLevel: this.assessSocialSkillsLevel(profileData),
    sensoryProfile: this.createSensoryProfile(profileData),
    behavioralProfile: this.createBehavioralProfile(profileData),
    adaptiveSkills: this.assessAdaptiveSkills(profileData),
    needsAssessment: {
      priority: 'initial-assessment',
      areas: this.identifyProfileNeeds(profileData),
    },
    recommendations: this.generateRecommendations(profileData),
  };
}

generateInitialAdaptiveParameters(profileData) {
  const preferences = profileData.preferences || {};
  return {
    difficulty: {
      baseLevel: preferences.skillLevel || 'MEDIUM',
      adaptationRate: 0.1,
      minLevel: 'EASY',
      maxLevel: 'HARD',
    },
    timing: {
      baseTimeLimit: preferences.preferredPace === 'slow'
        ? 128
        : preferences.preferredPace === 'fast'
          ? 64
          : 96,
      adaptationFactor: 0.2,
      minTime: 30,
      maxTime: 360,
    },
    feedback: {
      frequency: preferences.feedbackLevel || 'moderate',
      type: preferences.feedbackType || 'visual',
      reinforcement: preferences.reinforcementType || 'positive',
    },
    scaffolding: {
      level: preferences.supportLevel || 'moderate',
      fadeRate: 0.05,
      minSupport: 0.1,
      maxSupport: 1.0,
    },
    visual: {
      highContrast: preferences.visualNeeds?.highContrast || false,
      largeText: preferences.visualNeeds?.largeText || false,
      colorBlindnessSupport: preferences.visualNeeds?.colorBlindness || false,
      motionSensitivity: preferences.motionSensitive || false,
    },
    auditory: {
      hearingImpairment: preferences.hearingImpairment || false,
      soundSensitivity: preferences.soundSensitivity || false,
      textToSpeech: preferences.needsTTS || false,
      captionsRequired: preferences.needsCaptions || false,
    },
    motor: {
      fineMotorDifficulties: preferences.fineMotorDifficulties || false,
      grossMotorDifficulties: preferences.grossMotorDifficulties || false,
      alternativeInput: preferences.needsAlternativeInput || false,
      tremor: preferences.hasTremor || false,
    },
    cognitive: {
      processingSpeed: preferences.processingSpeed || 'typical',
      memorySupport: preferences.needsMemorySupport || false,
      attentionSupport: preferences.needsAttentionSupport || false,
      executiveSupport: preferences.needsExecutiveSupport || false,
    },
    autismOptimizations: {
      extendedProcessingTime: true,
      transitionWarnings: true,
      flexibleTimeouts: true,
    },
    sensory: {
      visualIntensity: 0.7,
      auditoryIntensity: 0.6,
      tactileIntensity: 0.5,
      overloadProtection: {
        enabled: true,
        threshold: 0.8,
        recoveryTime: 30,
      },
      autismOptimizations: {
        sensoryBreaks: true,
        graduatedExposure: true,
        choiceOptions: true,
      },
    },
    communication: {
      modalityPreference: 'visual',
      complexityLevel: 'concrete',
      supportLevel: 'moderate',
      autismOptimizations: {
        visualSupports: true,
        socialStories: true,
        predictableLanguage: true,
      },
    },
    social: {
      interactionLevel: 'structured',
      groupSize: 'small',
      recommendation: 'auto',
      autismOptimizations: {
        peerSupport: true,
        choiceInParticipation: true,
      },
    },
    behavioral: {
      reinforcementSchedule: 'frequent',
      feedbackType: 'immediate',
      selfRegulationSupport: 'high',
      autismOptimizations: {
        visualSchedules: true,
        choiceBoards: true,
        calmingStrategies: true,
      },
    },
    executive: {
      workingMemorySupport: 'high',
      attentionSupport: 'moderate',
      planningSupport: 'structured',
      autismOptimizations: {
        taskBreakdown: true,
        visualOrganizers: true,
        routineSupport: true,
      },
    },
  };
}

// Análise de Processamento Sensorial
analyzeSensoryProcessing(data) {
  return {
    visual: this.assessVisualProcessing(data),
    auditory: this.assessAuditoryProcessing(data),
    tactile: this.assessTactileProcessing(data),
    vestibular: this.assessVestibularProcessing(data),
    proprioceptive: this.assessProprioceptiveProcessing(data)),
    integration: this.determineSensoryProfile(data),
  };
}

assessSocialEmotionalAspects(data) {
  return {
    emotionalRegulation: this.assessEmotionalRegulation(data),
    socialAwareness: this.assessSocialAwareness(data),
    empathySkills: this.assessEmpathySkills(data),
    relationshipSkills: this.assessRelationshipSkills(data),
    decisionMaking: this.assessDecisionMaking(data)),
  };
}

calculateAutismSupportLevel(data) {
  const supportAreas = {
    communication: this.calculateCommunicationSupportLevel(data),
    social: this.calculateSocialSupportLevel(data)),
    sensory: this.calculateSensorySupportLevel(data),
    executive: this.calculateExecutiveSupport(data),
  };

  const supportLevels = Object.values(supportAreas);
  const averageSupport = supportLevels.reduce((sum, level) => sum + this.convertSupportLevelToNumber(level), 0) / supportLevels.length;

  if (averageSupport >= 3) return 'extensive';
  if (averageSupport >= 2) return 'substantial';
  if (averageSupport >= 1) return 'moderate';
  return 'minimal';
}

convertSupportLevelToNumber(level) {
  const LEVEL_MAP = {
    none: 0,
    minimal: 1,
    moderate: 2,
    substantial: 3,
    extensive: 4,
    maximum: 4,
  };
  return LEVEL_MAP[level] || 2;
}

calculateSupportAdjustments(sessionData) {
  return {
    cognitive: this.calculateCognitiveAdjustments(sessionData)},
    sensory: this.calculateSensoryAdjustments(sessionData)),
    communication: this.calculateCommunicationAdjustments(sessionData)),
    behavioral: this.calculateBehavioralAdjustments(sDataionData)},
  };
}

calculateCognitiveAdjustments(sessionData) {
  const performance = sessionData.performance || {};
  return {
    processingTime: performance.needsExtraTime ? 1.5 : 1.0,
    complexity: performance.strugglesWithComplexity ? 0.7 : 1.0,
    support: performance.needsCognitiveSupport ? 'increase' : 'maintain',
  };
}

calculateSensoryAdjustments(sessionData) {
  const indicators = sessionData.indicators || {};
  return {
    visual: indicators.visualOverload ? 0.8 : 1.0,
    auditory: indicators.sensoryOverload ? 0 :.5 : 1.0,
    tactile: indicators.tactileAvoidance ? 0 :.3 : 1.0,
  };
}

calculateBehavioralAdjustments(sessionsData) {
  const indicators = sessionData.indicators || {};
  return {
    structure: indicators.needsStructure ? 'increase' : 'maintain',
    reinforcement: indicators.motivationIssues ? 'increase' : 'maintain',
    regulation: indicators.regulationDifficulties ? 'support' : 'maintain',
  };
}

calculateCommunicationAdjustments(sessionData)) {
  const performance = sessionData.performance || {};
  return {
    modality: performance.preferredCommunicationMode || 'visual',
    complexity: performance.communicationLevel || 'simple',
    support: performance.needsNeedsCommunicationSupport ? 'increase' : 'maintain',
  };
}

suggestAdaptations(data) {
  const adaptations = [];
  if (data.accuracy < 0.85) {
    adaptations.push('reduce-task-difficulty');
    adaptations.push('break-tasks-into-smaller-part');
    adaptations.push('provide-processing-breaks');
  }
  if (data.frustrationLevel > 0.7) {
    adaptations.push('implement-calming-strategies');
    adaptations.push('adjust-expectations');
    adaptations.push('increase-positive-reinforcement');
  }
  if (data.engagementLevel < 0.3) {
    adaptations.push('increase-motivational-elements');
    adaptations.push('reputation-preferred-interests');
    adaptations.push('adjust-presentation-style');
  }
  if (data.timeSpent > 360) {
    adaptations.push('extend-time-limits');
  }
  return adaptations;
}

analyzeCurrentPerformance(sessionData) {
  const data = sessionData.performance || {};
  return {
    accuracy: data.accuracy || 0,
    speed: data.averageResponseTime || 0,
    consistency: data.consistencyScore || 0,
    engagement: data.engagementLevel || 0,
    effort: data.effortLevel || 0,
    progress: data.progressRate ||,
0,
  };
}

calculateDifficultyModifier(sessionData) {
  const performance = this.analyzeCurrentPerformance(sessionData);
  if (performance.accuracy > 0.85 && performance.speed < 0.7) return 0.2;
  return 0;
}

identifyBehavioralTriggers(indicatorss) {
  const triggers = [];
  if (indicators.sensoryOverload) triggers.push('sensory-overload');
  if (indicators.changeResistance бутыл triggers.push('unexpected-changes');
  if (indicators.socialAnxiety) triggers.push('social-demands');
  if (indicators.taskFrustration) triggers.push('task-difficulty');
  return triggers;
}

suggestBehavioralStrategies(indicators) {
  const strategies = [];
  if (indicators.selfRegulationNeeds) {
    strategies.push('breathing-techniques');
    strategies.push('calming-tools');
  }
  if (indicators.emotionalRegulation) {
    strategies.push('emotion-identification');
  }
  return strategies;
}

suggestCommunicationStrategies(indicators) {
  const strategies = [];
  if (indicators.verbalChallenges) {
    strategies.push('visual-communication-supports');
    strategies.push('simplified-language');
  }
  if (indicators.socialCommunication) {
    strategies.push('social-stories');
    strategies.push('conversation-starters');
  }
  return strategies;
}

suggestSensoryStrategies(indicators) {
  const strategies = [];
  if (indicators.sensoryOverload) {
    strategies.push('sensory-breaks');
    strategies.push('sensory-diet');
  }
  return strategies;
}

suggestExecutiveStrategies(indicators) {
  const strategies = [];
  if (indicators.planningDifficulties) {
    strategies.push('step-by-step-instructions');
    strategies.push('visual-schedules');
  }
  if (indicators.organizationChallenges) {
    strategies.push('color-coding-systems');
    strategies.push('structured-environments');
  }
  if (indicators.memorySupport) strategies.push('memory-supports');
  if (indicators.flexibilityNeeds) strategies.push('transition-supports');
  return strategies;
}

generateSessionTherapyOptimizations(sessionData) {
  const performance = sessionData.performance || {};
  return {
    cognitiveLoad: this.optimizeCognitiveLoad(performance),
    sensorySupport: this.optimizeSensorySupport(performance),
    communicationSupport: this.optimizeCommunicationSupport(performance),
    socialSupport: this.optimizeSocialSupport(performance),
    behavioralSupport: this.optimizeBehavioralSupport(performance),
    executiveSupport: this.optimizeExecutiveSupport(performance),
  };
}

optimizeCognitiveLoad(performance) {
  const complexity = performance.taskComplexity || 0.5;
  const errorRate = performance.errorRate || 0.2;
  const processingTime = performance.responseTime || 0;
  if (errorRate > 0.5 || processingTime > 120) return 'reduce';
  if (errorRate < 0.1 && processingTime < 30) return 'increase';
  return 'maintain';
}

optimizeSensorySupport(performance) {
  return {
    visual: performance.visualOverload ? 'reduce' : 'maintain',
    auditory: performance.auditoryDifficulties ? 'reduce' : 'maintain',
    tactile: performance.tactileAvoidance ? 'minimize' : 'maintain',
  };
}

optimizeCommunicationSupport(performance) {
  return {
    level: performance.communicationDifficulties ? 'increase' : 'maintain',
    modality: performance.preferredModality || 'visual',
    complexity: performance.languageComplexity || 'simple',
  };
}

optimizeSocialSupport(performance) {
  return {
    interaction: performance.socialWithdrawal ? 'reduce' : 'maintain',
    groupSize: performance.groupAnxiety ? 'individual' : 'small',
    structure: performance.socialConfusion ? 'high' : 'moderate',
  };
}

optimizeBehavioralSupport(performance) {
  return {
    regulation: performance.behavioralChallenges ? 'increase' : 'maintain',
    reinforcement: performance.motivationLevel ? 'moderate' : 'maintain',
    structure: performance.needsStructure ? 'high' : 'moderate',
  };
}

optimizeExecutiveSupport(performance) {
  return {
    planning: performance.planningDifficulties ? 'increase' : 'maintain',
    organization: performance.organizationNeeds ? 'high' : 'moderate',
    memory: performance.memorySupport ? 'increase' : 'maintain',
  };
}

calculateSessionAutismSupports(sessionData) {
  const indicators = sessionData.indicators || {};
  return {
    sensoryRegulation: {
      needed: indicators.sensoryOverload || false,
      intensity: this.calculateSensoryRegulationNeeds(indicators),
      strategies: this.suggestSensoryStrategies(indicators),
    },
    socialCommunication: {
      needed: indicators.communicationDifficulty || false,
      level: this.calculateCommunicationSupport(indicators),
      strategies: this.suggestCommunicationStrategies(indicators),
    },
    executiveFunction: {
      needed: indicators.executiveDifficulties || false,
      areas: this.identifyExecutiveNeeds(indicators),
      strategies: this.suggestExecutiveStrategies(indicators),
    },
    behavioralRegulation: {
      needed: indicators.behavioralChallenges || false,
      triggers: this.identifyBehavioralTriggers(indicators),
      strategies: this.suggestBehavioralStrategies(indicators),
    },
  };
}

calculateSensoryRegulationNeeds(indicators) {
  let intensity = 0.5;
  if (indicators.sensoryOverload) intensity += 0.3;
  if (indicators.sensorySensitivity) intensity += 0.2;
  return Math.min(1.0, intensity);
}

calculateCommunicationSupport(indicators) {
  let level = 'moderate';
  if (indicators.verbalChallenges || indicators.communicationDifficulty) {
    level = 'high';
  } else if (indicators.socialCommunication) {
    level = 'medium';
  }
  return level;
}

identifyExecutiveNeeds(indicators) {
  const needs = [];
  if (indicators.placementingDifficulties) needs.push('planning');
  if (indicators.organizationChallenges) needs.push('organization');
  if (indicators.memorySupport) needs.push('memory');
  if (needs.length > 2) return 'extensive';
  if (needs.length > 1) return 'moderate';
  return 'minimal';
}

enhanceAdaptiveParameters(baseParameters, sessionData) {
  if (!sessionData) return baseParameters;

  return {
    ...baseParameters,
    sessionSpecific: {
      performance: this.analyzeCurrentPerformance(sessionData),
      adaptiveAdjustments: this.calculateAdaptiveAdjustments(sessionData),
      therapyOptimizations: this.generateSessionTherapyOptimizations(sessionData),
      autismSupports: this.calculateSessionAutismSupports(sessionData),
    },
    realTimeAdaptations: {
      difficultyModifier: this.calculateDifficultyModModifier(sessionData),
      timingAdjustments: this.calculateTimingAdjustments(sessionData),
      sensoryAdjustments: this.calculateSensoryAdjustments(sessionData),
      supportAdjustments: this.calculateSupportAdjustments(sDataessionData),
    },
  };
}

mergeAdaptiveParameters(base, server) {
  const merged = { ...base };
  Object.keys(server).forEach(category => {
    if (merged[category] && typeof merged[category] === 'object') {
      merged[category] = { ...merged[category], ...server[category] };
    } else {
      merged[category] = server[category];
    }
  });
  return merged;
}

calculateTimingAdjustments(sessionData) {
  const performance = sessionData.performance || {};
  return {
    baseTime: performance.needsExtraTime ? 1.2 : 1.0,
    adaptationFactor: performance.responseTime ? 1 : 0.8,
  };
}

estimateCognitiveLoad(performanceData) {
  const factors = {
    taskComplexity: performanceData.taskComplexity || 0.5,
    timeSpent: performanceData.timeSpent || 0,
    errors: performanceData.errors || 0,
    hintsUsed: performanceData.hintsUsed || 0,
  };
  let cognitiveLoad = factors.taskComplexity;

  if (factors.timeSpent > 300) cognitiveLoad += 0.2;
  if (factors.timeSpent < 60) cognitiveLoad -= - 0.1;
  cognitiveLoad += (factors.errors * 0.1) + (factors.hintsUsed * 0.05);
  ```javascript
  estimateCognitiveLoad(performanceData) {
    const factors = {
      taskComplexity: performanceData.taskComplexity || 0.5,
      timeSpent: performanceData.timeSpent || 0,
      errors: performanceData.errors || 0,
      hintsUsed: performanceData.hintsUsed || 0,
    };
    let cognitiveLoad = factors.taskComplexity;

    if (factors.timeSpent > 300) cognitiveLoad += 0.2;
    if (factors.timeSpent < 60) cognitiveLoad -= 0.1;
    cognitiveLoad += factors.errors * 0.1;
    cognitiveLoad += factors.hintsUsed * 0.05;

    return {
      estimated: Math.max(0, Math.min(1, cognitiveLoad)),
      factors,
      recommendation: cognitiveLoad > 0.7 ? 'reduce-complexity' : 'maintain-level',
    };
  }

  // **Análise de Modalidade Sensorial**
  analyzeSensoryModality(performanceData, modality) {
    const sensitivity = performanceData[`${modality}Sensitivity`] || 0.5;
    const reactions = performanceData[`${modality}Reactions`] || [];

    if (reactions.includes('overload') || sensitivity > 0.8) return 'overload';
    if (reactions.includes('seeking') || sensitivity < 0.2) return 'seeking';
    return 'typical';
  }

  // **Avaliação de Aspectos Socioemocionais**
  assessSocialEngagement(performanceData) {
    const engagement = performanceData.socialEngagement || 0.5;
    if (engagement > 0.7) return 'high';
    if (engagement < 0.3) return 'low';
    return 'moderate';
  }

  assessAnxiety(performanceData) {
    const stressIndicators = performanceData.stressIndicators || [];
    const avoidanceBehaviors = performanceData.avoidanceBehaviors || [];
    const anxietyScore = (stressIndicators.length + avoidanceBehaviors.length) / 10;
    return Math.min(1, anxietyScore);
  }

  // **Métodos de Detecção de Necessidades e Dispositivos**
  detectAccessibilityNeeds() {
    const needs = {
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      largeText: window.matchMedia('(min-resolution: 144dpi)').matches,
      touchDevice: 'ontouchstart' in window,
      screenReader: navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS'),
      keyboardNavigation: !('ontouchstart' in window),
      vibrationSupport: !!navigator.vibrate,
      textToSpeechSupport: 'speechSynthesis' in window,
    };
    return needs;
  }

  getDeviceAdaptations() {
    return {
      touchSupport: 'ontouchstart' in window,
      screenSize: this.getScreenSizeCategory(),
      orientation: this.getScreenOrientation(),
      inputMethods: this.getAvailableInputMethods(),
      capabilities: this.getDeviceCapabilities(),
    };
  }

  getScreenSizeCategory() {
    const width = window.innerWidth;
    if (width < 576) return 'mobile';
    if (width < 768) return 'tablet-small';
    if (width < 992) return 'tablet';
    if (width < 1280) return 'desktop';
    return 'large-desktop';
  }

  getScreenOrientation() {
    return screen.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }

  getAvailableInputMethods() {
    const methods = ['mouse', 'keyboard'];
    if ('ontouchstart' in window) methods.push('touch');
    if (navigator.getGamepads) methods.push('gamepad');
    if (navigator.mediaDevices) methods.push('camera');
    return methods;
  }

  getDeviceCapabilities() {
    return {
      webGL: !!window.WebGLRenderingContext,
      webAudio: !!window.AudioContext || !!window.webkitAudioContext,
      webRTC: !!window.RTCPeerConnection,
      serviceWorker: 'serviceWorker' in navigator,
      notification: 'Notification' in window,
      geolocation: 'geolocation' in navigator,
      camera: !!navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
      microphone: !!navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
    };
  }

  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad/.test(userAgent)) return 'tablet';
    if (/mobile|phone|android|iphone/.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  detectInputMethods() {
    return {
      touch: 'ontouchstart' in window,
      mouse: window.matchMedia('(pointer: fine)').matches,
      keyboard: true,
      voice: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    };
  }

  detectDeviceCapabilities() {
    return {
      vibration: 'vibrate' in navigator,
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator,
      microphone: 'mediaDevices' in navigator,
      localStorage: 'localStorage' in window,
      webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    };
  }

  // **Métodos de Validação e Sanitização**
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return '';
    let sanitized = input.trim().replace(/[<>\"'&]/g, '');
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }
    return sanitized;
  }

  sanitizeNumericInput(input, min = 0, max = 100) {
    const num = parseFloat(input);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  }

  sanitizeEnum(input, allowedValues, defaultValue) {
    return allowedValues.includes(input) ? input : defaultValue;
  }

  sanitizeArray(input, allowedValues) {
    if (!Array.isArray(input)) return [];
    return input.filter(item => allowedValues.includes(item));
  }

  isCacheValid(cached, maxAge) {
    if (!cached || !cached.timestamp) return false;
    return Date.now() - cached.timestamp < maxAge;
  }

  // **Gerenciamento de Dados Locais**
  setLocalData(key, data) {
    try {
      localStorage.setItem(`${this.localStoragePrefix}${key}`, JSON.stringify(data));
    } catch (e) {
      this.logger.error('Failed to save to localStorage', { error: e.message });
    }
  }

  getLocalData(key) {
    try {
      const data = localStorage.getItem(`${this.localStoragePrefix}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      this.logger.error('Failed to retrieve from localStorage', { error: e.message });
      return null;
    }
  }

  // **Utilitários de Conexão e Retry**
  async authenticatedFetch(url, options) {
    if (!this.authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const token = this.authService.getToken();
    const headers = {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    };
    return fetch(url, { ...options, headers });
  }

  async withRetry(fn, operationName, retries = this.maxRetries) {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await this.circuitBreaker.execute(fn);
      } catch (error) {
        attempt++;
        if (attempt === retries) {
          this.logger.error(`Max retries reached for ${operationName}`, { error: error.message });
          throw error;
        }
        const delay = this.connectionStrategy.getRetryDelay(attempt);
        this.logger.warn(`Retrying ${operationName} - Attempt ${attempt}`, { error: error.message });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // **Métodos de Análise Terapêutica**
  calculateAdaptiveAdjustments(sessionData) {
    const performance = sessionData.performance || {};
    return {
      difficulty: performance.accuracy > 0.85 ? 'increase' : performance.accuracy < 0.4 ? 'decrease' : 'maintain',
      timing: performance.responseTime > 300 ? 'extend' : performance.responseTime < 60 ? 'reduce' : 'maintain',
      support: performance.hintsUsed > 5 ? 'increase' : performance.hintsUsed < 2 ? 'decrease' : 'maintain',
    };
  }

  getSupportRecommendations(level) {
    const recommendations = {
      low: ['maintain-current-supports', 'monitor-progress'],
      moderate: ['increase-visual-supports', 'provide-frequent-breaks', 'simplify-instructions'],
      high: ['intensive-support', 'one-to-one-assistance', 'modified-activities', 'frequent-reinforcement'],
      maximum: ['comprehensive-support', 'multisensory-interventions', 'structured-environment'],
    };
    return recommendations[level] || recommendations.moderate;
  }

  // **Métodos de Inicialização e Configuração**
  initializeDependencies() {
    if (!window.authService) {
      window.authService = {
        getCurrentUser: () => ({ id: 'anonymous', name: 'Anonymous User' }),
        isAuthenticated: () => false,
        getToken: () => null,
      };
    }
    if (!window.logger) {
      window.logger = {
        info: (message, data) => console.log('INFO:', message, data),
        warn: (message, data) => console.warn('WARN:', message, data),
        error: (message, data) => console.error('ERROR:', message, data),
        debug: (message, data) => console.debug('DEBUG:', message, data),
      };
    }
    if (!window.IntelligentCache) {
      window.IntelligentCache = class {
        constructor(defaultTTL = 300000) {
          this.cache = new Map();
          this.ttls = new Map();
          this.defaultTTL = defaultTTL;
        }
        set(key, value, ttl = this.defaultTTL) {
          this.cache.set(key, { value, timestamp: Date.now() });
          this.ttls.set(key, ttl);
        }
        get(key) {
          const item = this.cache.get(key);
          if (!item) return null;
          const ttl = this.ttls.get(key) || this.defaultTTL;
          if (Date.now() - item.timestamp > ttl) {
            this.cache.delete(key);
            this.ttls.delete(key);
            return null;
          }
          return item.value;
        }
        invalidate(key) {
          this.cache.delete(key);
          this.ttls.delete(key);
        }
        clear() {
          this.cache.clear();
          this.ttls.clear();
        }
      };
    }
    if (!window.CircuitBreaker) {
      window.CircuitBreaker = class {
        constructor(threshold, timeout, cooldown) {
          this.threshold = threshold;
          this.timeout = timeout;
          this.cooldown = cooldown;
          this.failures = 0;
          this.state = 'CLOSED';
          this.nextAttempt = Date.now();
        }
        async execute(fn) {
          if (this.state === 'OPEN' && Date.now() < this.nextAttempt) {
            throw new Error('Circuit breaker is OPEN');
          }
          this.state = 'HALF_OPEN';
          try {
            const result = await Promise.race([
              fn(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), this.timeout)),
            ]);
            this.onSuccess();
            return result;
          } catch (error) {
            this.onFailure();
            throw error;
          }
        }
        onSuccess() {
          this.failures = 0;
          this.state = 'CLOSED';
        }
        onFailure() {
          this.failures++;
          if (this.failures >= this.threshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.cooldown;
          }
        }
        getState() {
          return this.state;
        }
      };
    }
    if (!window.ConnectionStrategy) {
      window.ConnectionStrategy = class {
        getStorageKey(key) {
          return `autism_support_${key}`;
        }
        shouldUseCache() {
          return !navigator.onLine;
        }
        getRetryDelay(attempt) {
          return Math.min(1000 * Math.pow(2, attempt), 10000);
        }
      };
    }
  }
}
// Enhanced dependency management with intelligent fallbacks
let authService, authenticatedFetch, LZString, CONFIG, API_CONFIG

// Mock implementations to avoid undefined errors
authService = authService || {
  createAnonymousUser: async () => {
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    return { userId, user: { id: userId, is_anonymous: true } }
  },
  isAuthenticated: () => false,
  getToken: () => null,
}

authenticatedFetch =
  authenticatedFetch ||
  (async (url, options = {}) => {
    try {
      return await fetch(url, options)
    } catch (error) {
      console.warn('🔧 MOCK: authenticatedFetch falling back to regular fetch:', error.message)
      throw error
    }
  })

LZString = LZString || {
  compress: (str) => {
    try {
      return btoa(str)
    } catch (e) {
      return str
    }
  },
  decompress: (str) => {
    try {
      return atob(str)
    } catch (e) {
      return str
    }
  },
  compressToUTF16: (str) => str,
  decompressFromUTF16: (str) => str,
}

CONFIG = CONFIG || {
  API_URL: 'http://localhost:3001/api',
  ENVIRONMENT: 'development',
  DEBUG_MODE: true,
  CACHE_TTL: 1800000,
}

API_CONFIG = API_CONFIG || {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  ENDPOINTS: {
    users: '/users',
    sessions: '/game-sessions',
    adaptiveParameters: '/adaptive-parameters',
    cognitiveProfiles: '/cognitive-profiles',
    progress: '/progress',
  },
}

// Smart dependency loading with fallbacks
function initializeDependencies() {
  console.log(
    '✅ DEPENDENCIES: Mock implementations loaded for authService, authenticatedFetch, LZString, CONFIG, API_CONFIG'
  )
}

// Initialize dependencies on load
initializeDependencies()

// Mock logger if not available
const logger = {
  info: (message, data = {}) => console.log(`ℹ️ ${message}`, data),
  warn: (message, data = {}) => console.warn(`⚠️ ${message}`, data),
  error: (message, data = {}) => console.error(`❌ ${message}`, data),
  debug: (message, data = {}) => console.debug(`🐛 ${message}`, data),
}

// Advanced Circuit Breaker implementation
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, retryTimeout = 10000) {
    this.failureThreshold = threshold
    this.timeout = timeout
    this.retryTimeout = retryTimeout
    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0
    this.lastFailureTime = null
    this.successCount = 0
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.retryTimeout) {
        this.state = 'HALF_OPEN'
        this.successCount = 0
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        ),
      ])

      if (this.state === 'HALF_OPEN') {
        this.successCount++
        if (this.successCount >= 3) {
          this.reset()
        }
      }

      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }

  recordFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
      logger.warn('Circuit breaker opened due to failures', {
        failures: this.failureCount,
        threshold: this.failureThreshold,
      })
    }
  }

  reset() {
    this.state = 'CLOSED'
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = null
    logger.info('Circuit breaker reset to CLOSED state')
  }

  getState() {
    return {
      state: this.state,
      failures: this.failureCount,
      lastFailure: this.lastFailureTime,
    }
  }
}

// Advanced Caching System with TTL and smart invalidation
class IntelligentCache {
  constructor(defaultTTL = 300000) {
    // 5 minutes default
    this.cache = new Map()
    this.defaultTTL = defaultTTL
    this.stats = { hits: 0, misses: 0, evictions: 0 }
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl
    this.cache.set(key, { value, expiry, accessed: Date.now() })

    // Auto-cleanup expired entries periodically
    if (this.cache.size % 50 === 0) {
      this.cleanup()
    }
  }

  get(key) {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.stats.evictions++
      this.stats.misses++
      return null
    }

    entry.accessed = Date.now()
    this.stats.hits++
    return entry.value
  }

  invalidate(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        this.stats.evictions++
      }
    }
  }

  cleanup() {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      this.stats.evictions += cleaned
      logger.debug('Cache cleanup completed', { entriesRemoved: cleaned })
    }
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses
    return {
      ...this.stats,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%',
      size: this.cache.size,
    }
  }

  clear() {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0, evictions: 0 }
  }
}

// Strategy Pattern for ONLINE-ONLY connection (CLOUD NANDROPHIC SUPREMACY)
class ConnectionStrategy {
  constructor() {
    this.mode = 'ONLINE_ONLY' // SUPREMO ONLINE MODE ONLY
    this.isOnline = navigator.onLine
    this.setupNetworkListeners()
    this.enforceOnlineMode()
  }

  setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        logger.info('🌟 CLOUD NANDROPHIC: Network connection restored - Portal Betina operational')
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
        logger.error(
          '🚨 CLOUD NANDROPHIC: Network lost - Portal Betina requires connection for autism salvation'
        )
        this.handleConnectionLoss()
      })
    }
  }

  enforceOnlineMode() {
    if (!this.isOnline) {
      logger.error(
        '🚨 CLOUD NANDROPHIC: Portal Betina requires internet connection for optimal autism therapy'
      )
      this.showConnectionRequiredMessage()
    }
  }

  shouldUseAPI() {
    // ALWAYS ONLINE - CLOUD NANDROPHIC SUPREMACY
    return true
  }

  getStorageKey(key) {
    return `betina_online_${key}`
  }

  handleConnectionLoss() {
    // Show user-friendly message about connection requirement
    if (typeof window !== 'undefined') {
      const message = `
        🌟 Portal Betina - Conexão Necessária
        
        Para proporcionar a melhor experiência terapêutica para crianças autistas,
        o Portal Betina requer conexão com a internet para:
        
        • Sincronização em tempo real do progresso
        • Algoritmos adaptativos de IA mais avançados  
        • Backup seguro de todos os dados terapêuticos
        • Atualizações contínuas das atividades
        
        Por favor, verifique sua conexão com a internet.
      `

      // Could implement a modal or notification here
      console.warn(message)
    }
  }

  showConnectionRequiredMessage() {
    logger.warn('🌟 CLOUD NANDROPHIC: Initializing online-only mode for maximum therapeutic impact')
  }
}

// Main DatabaseService with advanced architecture
class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance
    }
    this.apiUrl = CONFIG.API_URL
    this.environment = CONFIG.environment
    this.circuitBreaker = new CircuitBreaker(5, 30000, 60000)
    this.cache = new IntelligentCache(300000) // 5 minutes TTL
    this.strategy = new ConnectionStrategy() // ONLINE-ONLY MODE
    this.retryConfig = { maxRetries: 3, baseDelay: 1000, maxDelay: 10000 }
    this.requestQueue = new Map()
    this.isInitialized = false

    DatabaseService.instance = this
    this.initialize()

    logger.info('DatabaseService initialized with advanced architecture', {
      apiUrl: this.apiUrl,
      environment: this.environment,
      circuitBreakerState: this.circuitBreaker.getState(),
    })
  }
  async initialize() {
    try {
      await this.checkApiHealth()
      this.isInitialized = true
      logger.info('🌟 CLOUD NANDROPHIC: DatabaseService initialization completed successfully')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: DatabaseService requires internet connection', {
        error: error.message,
      })
      throw new Error('Portal Betina requires internet connection for autism therapy optimization')
    }
  }

  // Enhanced retry mechanism with exponential backoff
  async withRetry(fn, context = 'operation') {
    let lastError

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error

        if (attempt === this.retryConfig.maxRetries) {
          break
        }

        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
          this.retryConfig.maxDelay
        )

        logger.debug(`Retry ${attempt}/${this.retryConfig.maxRetries} for ${context}`, {
          error: error.message,
          nextRetryIn: delay,
        })

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  // Request deduplication to prevent multiple identical requests
  async deduplicatedRequest(key, fn) {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)
    }

    const promise = fn().finally(() => {
      this.requestQueue.delete(key)
    })

    this.requestQueue.set(key, promise)
    return promise
  }

  // Enhanced localStorage operations with compression and validation
  setLocalData(key, data, options = {}) {
    try {
      const storageKey = this.strategy.getStorageKey(key)
      const payload = {
        data,
        timestamp: Date.now(),
        version: '2.0',
        compressed: false,
        ...options,
      }

      // Compress large data if needed
      let serialized = JSON.stringify(payload)
      if (serialized.length > 10000 && typeof LZString !== 'undefined') {
        payload.data = LZString.compress(JSON.stringify(data))
        payload.compressed = true
        serialized = JSON.stringify(payload)
      }

      localStorage.setItem(storageKey, serialized)

      // Also update cache for immediate access
      this.cache.set(key, data, 3600000) // 1 hour for local data

      return true
    } catch (error) {
      logger.error('Failed to store local data', { key, error: error.message })
      return false
    }
  }

  getLocalData(key, defaultValue = null) {
    try {
      // Try cache first
      const cached = this.cache.get(key)
      if (cached !== null) {
        return cached
      }

      const storageKey = this.strategy.getStorageKey(key)
      const stored = localStorage.getItem(storageKey)

      if (!stored) {
        return defaultValue
      }

      const payload = JSON.parse(stored)

      // Validate payload structure
      if (!payload.data || !payload.timestamp || !payload.version) {
        localStorage.removeItem(storageKey)
        return defaultValue
      }

      // Check if data is too old (7 days default)
      const maxAge = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - payload.timestamp > maxAge) {
        localStorage.removeItem(storageKey)
        return defaultValue
      }

      // Decompress if needed
      let data = payload.data
      if (payload.compressed && typeof LZString !== 'undefined') {
        data = JSON.parse(LZString.decompress(data))
      }

      // Update cache
      this.cache.set(key, data, 3600000)

      return data
    } catch (error) {
      logger.error('Failed to retrieve local data', { key, error: error.message })
      return defaultValue
    }
  } // Enhanced API health check with intelligent caching
  async checkApiHealth() {
    const cacheKey = 'api_health_status'
    const cached = this.cache.get(cacheKey)

    if (cached !== null) {
      return cached
    }

    try {
      const isHealthy = await this.circuitBreaker.execute(async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
          const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.health}`, {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          return response.ok
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      })

      // Cache positive results longer, negative results shorter
      const cacheTTL = isHealthy ? 60000 : 10000 // 1 min vs 10 sec
      this.cache.set(cacheKey, isHealthy, cacheTTL)

      if (isHealthy) {
        logger.info('API health check passed')
      } else {
        logger.warn('API health check failed')
      }

      return isHealthy
    } catch (error) {
      logger.error('API health check error', { error: error.message })
      this.cache.set(cacheKey, false, 5000) // Cache failure for 5 seconds
      return false
    }
  }
  // Optimized user creation - ONLINE ONLY
  async createAnonymousUser() {
    const requestKey = 'create_anonymous_user'

    return this.deduplicatedRequest(requestKey, async () => {
      try {
        if (!navigator.onLine) {
          throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for user creation')
        }

        return await this.withRetry(async () => {
          const authResult = await authService.createAnonymousUser()

          // Cache the user data
          if (authResult.user) {
            this.cache.set(`user_${authResult.userId}`, authResult.user, 3600000)
          }

          logger.info('🌟 CLOUD NANDROPHIC: Created online anonymous user', {
            userId: authResult.userId,
          })
          return authResult.userId
        }, 'createAnonymousUser')
      } catch (error) {
        logger.error('🚨 CLOUD NANDROPHIC: Failed to create user - connection required', {
          error: error.message,
        })
        throw new Error(
          'Portal Betina requires internet connection. Please check your connection and try again.'
        )
      }
    })
  }
  // Enhanced user retrieval - ONLINE ONLY
  async getUser(userId) {
    if (!userId) {
      logger.error('Invalid userId provided', { userId })
      return null
    }

    const userIdStr = String(userId)
    const cacheKey = `user_${userIdStr}`

    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for user retrieval')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // Cache negative results to avoid repeated requests
            this.cache.set(cacheKey, null, 300000) // 5 minutes
            return null
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const user = await response.json()

        // Cache for immediate access
        this.cache.set(cacheKey, user, 1800000) // 30 minutes in memory

        logger.debug('🌟 CLOUD NANDROPHIC: User retrieved successfully', { userId: userIdStr })
        return user
      }, 'getUser')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve user', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to retrieve user data. Please check your connection and try again.')
    }
  } // Smart preferences update - ONLINE REQUIRED
  async updateUserPreferences(userId, preferences) {
    const userIdStr = String(userId)

    // Validate and sanitize input
    if (!userIdStr || !preferences) {
      throw new Error('Invalid parameters: userId and preferences are required')
    }

    // Sanitize preferences object
    const sanitizedPreferences = this.sanitizeUserPreferences(preferences)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for preference updates')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/preferences`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedPreferences),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // Update cache immediately
        const cacheKey = `user_preferences_${userIdStr}`
        this.cache.set(cacheKey, sanitizedPreferences, 1800000)

        // Invalidate user cache to force refresh
        this.cache.invalidate(`user_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: Preferences synchronized successfully', {
          userId: userIdStr,
        })
        return true
      }, 'updateUserPreferences')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to sync preferences', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to update preferences. Please check your connection and try again.')
    }
  }

  // Helper method to sanitize user preferences
  sanitizeUserPreferences(preferences) {
    const sanitized = {}

    const allowedKeys = [
      'theme',
      'language',
      'difficulty',
      'audioEnabled',
      'visualCues',
      'fontSize',
      'contrast',
      'animations',
      'notifications',
    ]

    for (const key of allowedKeys) {
      if (preferences.hasOwnProperty(key)) {
        if (typeof preferences[key] === 'string') {
          sanitized[key] = this.sanitizeInput(preferences[key], { maxLength: 50 })
        } else if (typeof preferences[key] === 'boolean') {
          sanitized[key] = Boolean(preferences[key])
        } else if (typeof preferences[key] === 'number') {
          sanitized[key] = this.sanitizeNumericInput(preferences[key], 0, 100)
        }
      }
    }

    return sanitized
  }

  // Enhanced accessibility settings with smart defaults
  async getAccessibilitySettings(userId) {
    const userIdStr = String(userId)
    const cacheKey = `accessibility_${userIdStr}`

    const smartDefaults = {
      fontSize: 'medium',
      contrast: 'normal',
      audioEnabled: true,
      animations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      dyslexiaFriendly: false,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      textToSpeech: true,
      keyboardNavigation: true,
      autoDetectedPreferences: true,
    }

    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return { ...smartDefaults, ...cached }
    } // Try local storage for caching only
    const localSettings = this.getLocalData(cacheKey)
    if (localSettings) {
      const mergedSettings = { ...smartDefaults, ...localSettings }
      this.cache.set(cacheKey, mergedSettings, 1800000)
      return mergedSettings
    }

    if (!navigator.onLine) {
      throw new Error(
        '🚨 CLOUD NANDROPHIC: Internet connection required for accessibility settings'
      )
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/accessibility`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // User doesn't have custom settings, use smart defaults
            this.cache.set(cacheKey, smartDefaults, 1800000)
            this.setLocalData(cacheKey, smartDefaults)
            return smartDefaults
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const serverSettings = await response.json()
        const mergedSettings = { ...smartDefaults, ...serverSettings }

        // Cache both locally and in memory
        this.cache.set(cacheKey, mergedSettings, 1800000)
        this.setLocalData(cacheKey, mergedSettings)

        logger.debug('Accessibility settings retrieved', { userId: userIdStr })
        return mergedSettings
      }, 'getAccessibilitySettings')
    } catch (error) {
      logger.error('Failed to retrieve accessibility settings, using defaults', {
        userId: userIdStr,
        error: error.message,
      })
      return smartDefaults
    }
  } // Enhanced accessibility settings with smart conflict resolution
  async updateAccessibilitySettings(userId, settings) {
    const userIdStr = String(userId)
    const cacheKey = `accessibility_${userIdStr}`

    // Enhanced settings with intelligent auto-detection
    const enhancedSettings = {
      ...settings,
      lastUpdated: new Date().toISOString(),
      autoDetectedFeatures: this.detectAccessibilityNeeds(),
      deviceAdaptations: this.getDeviceAdaptations(),
      therapyOptimizations: this.generateTherapyOptimizations(settings),
      autismAdaptations: this.calculateAutismAdaptations(settings),
      sensoryProfile: this.createSensoryProfile(settings),
      version: '2.1',
    }

    // Always store locally first for immediate UI response
    this.setLocalData(cacheKey, enhancedSettings)
    this.cache.set(cacheKey, enhancedSettings, 1800000)

    if (!navigator.onLine) {
      logger.warn('🚨 CLOUD NANDROPHIC: Offline mode - accessibility settings saved locally only')
      return { success: true, offline: true }
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/accessibility`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(enhancedSettings),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        logger.info(
          '🌟 CLOUD NANDROPHIC: Accessibility settings updated with therapy optimizations',
          {
            userId: userIdStr,
            autismAdaptations: enhancedSettings.autismAdaptations,
          }
        )

        return { success: true, offline: false }
      }, 'updateAccessibilitySettings')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to sync accessibility settings', {
        userId: userIdStr,
        error: error.message,
      })
      // Return success for local storage, but indicate sync failure
      return { success: true, offline: true, syncError: error.message }
    }
  }

  // Gerar otimizações terapicas para configurações de acessibilidade
  generateTherapyOptimizations(settings) {
    const optimizations = {
      visualSupport: {
        enabled: settings.highContrast || settings.largeText,
        level: this.calculateVisualSupportLevel(settings),
        recommendations: this.getVisualSupportRecommendations(settings),
      },
      auditorySupport: {
        enabled: settings.textToSpeech || settings.audioFeedback,
        level: this.calculateAuditorySupportLevel(settings),
        recommendations: this.getAuditorySupportRecommendations(settings),
      },
      motorSupport: {
        enabled: settings.largeButtons || settings.reducedMotion,
        level: this.calculateMotorSupportLevel(settings),
        recommendations: this.getMotorSupportRecommendations(settings),
      },
      cognitiveSupport: {
        enabled: settings.simplifiedInterface || settings.extraTime,
        level: this.calculateCognitiveSupportLevel(settings),
        recommendations: this.getCognitiveSupportRecommendations(settings),
      },
    }

    return optimizations
  }

  // Calcular adaptações específicas para autismo
  calculateAutismAdaptations(settings) {
    return {
      sensoryProcessing: {
        visualOverload: settings.reducedMotion ? 'protected' : 'standard',
        auditoryOverload: settings.soundReduction ? 'protected' : 'standard',
        tactilePreferences: settings.vibrationDisabled ? 'minimal' : 'standard',
      },
      socialCommunication: {
        visualCues: settings.visualCues !== false,
        socialStories: settings.socialStories || false,
        communicationAids: settings.aacSupport || false,
      },
      executiveFunction: {
        structureSupport: settings.structuredInterface !== false,
        timeManagement: settings.timeVisualizers || false,
        taskBreakdown: settings.stepByStep || false,
      },
      behavioralSupport: {
        selfRegulation: settings.calmingTools || false,
        choiceProvision: settings.userChoice !== false,
        predictability: settings.consistentLayout !== false,
      },
    }
  }

  // ============== GERENCIAMENTO DE SESSÕES DE JOGOS AVANÇADAS ==============

  // Exibir sessões de jogos com filtros avançados e análise terapêutica
  async getGameSessions(userId, gameId = null, limit = 50) {
    const userIdStr = String(userId)
    const cacheKey = `sessions_${userIdStr}_${gameId || 'all'}_${limit}`

    // Try cache with intelligent invalidation
    const cached = this.cache.get(cacheKey)
    if (cached !== null && this.isCacheValid(cached, 600000)) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error(
        '🚨 CLOUD NANDROPHIC: Internet connection required for game sessions retrieval'
      )
    }

    try {
      return await this.withRetry(async () => {
        let endpoint = `${this.apiUrl}${API_CONFIG.ENDPOINTS.sessions}/user/${userIdStr}`
        const params = new URLSearchParams()

        if (gameId) params.append('gameId', gameId)
        if (limit) params.append('limit', limit.toString())

        if (params.toString()) {
          endpoint += `?${params.toString()}`
        }

        const response = await authenticatedFetch(endpoint, {
          method: 'GET',
          headers: API_CONFIG.DEFAULT_HEADERS,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const sessions = await response.json()

        // Enriquecer dados com análise terapêutica
        const enrichedSessions = sessions.map((session) =>
          this.enrichSessionWithTherapyAnalysis(session)
        )

        // Cache com TTL inteligente
        this.cache.set(cacheKey, enrichedSessions, 600000) // 10 minutos

        logger.info('🌟 CLOUD NANDROPHIC: Game sessions retrieved with therapy analysis', {
          userId: userIdStr,
          sessionCount: enrichedSessions.length,
        })

        return enrichedSessions
      }, 'getGameSessions')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve game sessions', {
        userId: userIdStr,
        gameId,
        error: error.message,
      })
      throw new Error('Unable to retrieve game sessions. Please check your connection.')
    }
  }

  // Enriquecer sessão com análise terapêutica
  enrichSessionWithTherapyAnalysis(session) {
    try {
      const performanceData = session.performance_data || {}

      return {
        ...session,
        therapyAnalysis: {
          difficultyProgression: this.calculateDifficultyProgression(session),
          behavioralIndicators: this.extractBehavioralIndicators(performanceData),
          adaptiveSuggestions: this.suggestAdaptations(performanceData),
          autismSupport: this.calculateAutismSupportLevel(performanceData),
          cognitiveLoad: this.estimateCognitiveLoad(performanceData),
          sensoryProcessing: this.analyzeSensoryProcessing(performanceData),
          socialEmotional: this.assessSocialEmotionalAspects(performanceData),
          executiveFunction: this.evaluateExecutiveFunction(performanceData),
        },
        insights: {
          strengths: this.identifyStrengths(performanceData),
          challenges: this.identifyChallenges(performanceData),
          recommendations: this.generateRecommendations(performanceData),
        },
      }
    } catch (error) {
      logger.warn('Failed to enrich session with therapy analysis', {
        sessionId: session.id,
        error: error.message,
      })
      return session
    }
  }

  // ============== CONFIGURAÇÕES DE ACESSIBILIDADE AVANÇADAS ==============

  // Permitir ajustes de acessibilidade com suporte terapêutico
  async updateAccessibilitySettings(userId, settings) {
    const userIdStr = String(userId)
    const cacheKey = `accessibility_${userIdStr}`

    // Enhanced settings with intelligent auto-detection
    const enhancedSettings = {
      ...settings,
      lastUpdated: new Date().toISOString(),
      autoDetectedFeatures: this.detectAccessibilityNeeds(),
      deviceAdaptations: this.getDeviceAdaptations(),
      therapyOptimizations: this.generateTherapyOptimizations(settings),
      autismAdaptations: this.calculateAutismAdaptations(settings),
      sensoryProfile: this.createSensoryProfile(settings),
      version: '2.1',
    }

    // Always store locally first for immediate UI response
    this.setLocalData(cacheKey, enhancedSettings)
    this.cache.set(cacheKey, enhancedSettings, 1800000)

    if (!navigator.onLine) {
      logger.warn('🚨 CLOUD NANDROPHIC: Offline mode - accessibility settings saved locally only')
      return { success: true, offline: true }
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/accessibility`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(enhancedSettings),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        logger.info(
          '🌟 CLOUD NANDROPHIC: Accessibility settings updated with therapy optimizations',
          {
            userId: userIdStr,
            autismAdaptations: enhancedSettings.autismAdaptations,
          }
        )

        return { success: true, offline: false }
      }, 'updateAccessibilitySettings')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to sync accessibility settings', {
        userId: userIdStr,
        error: error.message,
      })
      // Return success for local storage, but indicate sync failure
      return { success: true, offline: true, syncError: error.message }
    }
  }

  // Gerar otimizações terapicas para configurações de acessibilidade
  generateTherapyOptimizations(settings) {
    const optimizations = {
      visualSupport: {
        enabled: settings.highContrast || settings.largeText,
        level: this.calculateVisualSupportLevel(settings),
        recommendations: this.getVisualSupportRecommendations(settings),
      },
      auditorySupport: {
        enabled: settings.textToSpeech || settings.audioFeedback,
        level: this.calculateAuditorySupportLevel(settings),
        recommendations: this.getAuditorySupportRecommendations(settings),
      },
      motorSupport: {
        enabled: settings.largeButtons || settings.reducedMotion,
        level: this.calculateMotorSupportLevel(settings),
        recommendations: this.getMotorSupportRecommendations(settings),
      },
      cognitiveSupport: {
        enabled: settings.simplifiedInterface || settings.extraTime,
        level: this.calculateCognitiveSupportLevel(settings),
        recommendations: this.getCognitiveSupportRecommendations(settings),
      },
    }

    return optimizations
  }

  // Calcular adaptações específicas para autismo
  calculateAutismAdaptations(settings) {
    return {
      sensoryProcessing: {
        visualOverload: settings.reducedMotion ? 'protected' : 'standard',
        auditoryOverload: settings.soundReduction ? 'protected' : 'standard',
        tactilePreferences: settings.vibrationDisabled ? 'minimal' : 'standard',
      },
      socialCommunication: {
        visualCues: settings.visualCues !== false,
        socialStories: settings.socialStories || false,
        communicationAids: settings.aacSupport || false,
      },
      executiveFunction: {
        structureSupport: settings.structuredInterface !== false,
        timeManagement: settings.timeVisualizers || false,
        taskBreakdown: settings.stepByStep || false,
      },
      behavioralSupport: {
        selfRegulation: settings.calmingTools || false,
        choiceProvision: settings.userChoice !== false,
        predictability: settings.consistentLayout !== false,
      },
    }
  }

  // ============== MÉTODOS AUXILIARES TERAPÊUTICOS IMPLEMENTADOS ==============

  // Métodos de avaliação cognitiva
  assessCognitiveLevel(data) {
    const indicators = {
      problemSolving: data.problemSolvingSkills || 50,
      memory: data.memoryCapacity || 50,
      attention: data.attentionSpan || 50,
      processing: data.processingSpeed || 50,
    }

    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4

    if (average >= 80) return 'advanced'
    if (average >= 60) return 'appropriate'
    if (average >= 40) return 'emerging'
    return 'developing'
  }

  assessCommunicationLevel(data) {
    const preferences = data.preferences || {}
    const indicators = {
      verbalSkills: preferences.verbalCommunication !== false ? 75 : 25,
      nonverbalSkills: preferences.gestureUse !== false ? 75 : 25,
      socialCommunication: preferences.socialInteraction || 50,
      functionalCommunication: preferences.expressiveNeeds !== false ? 75 : 25,
    }

    const average = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4

    if (average >= 75) return 'independent'
    if (average >= 50) return 'supported'
    if (average >= 25) return 'emerging'
    return 'minimal'
  }

  assessSocialSkillsLevel(data) {
    const preferences = data.preferences || {}
    return {
      peerInteraction: preferences.socialPlay ? 'developing' : 'emerging',
      adultInteraction: preferences.adultSupport !== false ? 'supported' : 'independent',
      groupParticipation: preferences.groupActivities ? 'engaged' : 'reluctant',
      socialInitiation: preferences.socialInitiation ? 'active' : 'passive',
    }
  }

  createSensoryProfile(data) {
    const preferences = data.preferences || {}
    return {
      visual: {
        sensitivity: preferences.visualSensitivity || 'typical',
        preferences: preferences.visualPreferences || [],
        supports: preferences.visualSupports !== false,
      },
      auditory: {
        sensitivity: preferences.auditorySensitivity || 'typical',
        preferences: preferences.auditoryPreferences || [],
        supports: preferences.auditorySupports !== false,
      },
      tactile: {
        sensitivity: preferences.tactileSensitivity || 'typical',
        preferences: preferences.tactilePreferences || [],
        supports: preferences.tactileSupports !== false,
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
        strategies: preferences.copingStrategies || [],
        triggers: preferences.behavioralTriggers || [],
      },
      attention: {
        span: preferences.attentionSpan || 'variable',
        focus: preferences.focusAbility || 'emerging',
        distractibility: preferences.distractibility || 'moderate',
      },
      flexibility: {
        changeAdaptation: preferences.changeAdaptation || 'challenging',
        routinePreference: preferences.routinePreference !== false,
        transitionSupport: preferences.transitionSupport !== false,
      },
    }
  }

  assessAdaptiveSkills(data) {
    const preferences = data.preferences || {}
    return {
      dailyLiving: preferences.dailyLivingSkills || 'emerging',
      socialSkills: preferences.socialSkills || 'developing',
      communicationSkills: preferences.communicationSkills || 'emerging',
      motorSkills: preferences.motorSkills || 'developing',
    }
  }

  // Métodos de cálculo de suporte
  calculateVisualSupportLevel(preferences) {
    const needs = [
      preferences.highContrast,
      preferences.largeText,
      preferences.visualCues,
      preferences.visualSchedules,
      preferences.pictureSupports,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  calculateAuditorySupportLevel(preferences) {
    const needs = [
      preferences.textToSpeech,
      preferences.audioFeedback,
      preferences.auditoryPrompts,
      preferences.soundReduction,
      preferences.voiceModulation,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  calculateMotorSupportLevel(preferences) {
    const needs = [
      preferences.largeButtons,
      preferences.reducedMotion,
      preferences.motorAssistance,
      preferences.adaptiveInput,
      preferences.physicalSupports,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  calculateCognitiveSupportLevel(preferences) {
    const needs = [
      preferences.simplifiedInterface,
      preferences.extraTime,
      preferences.stepByStep,
      preferences.cognitiveAids,
      preferences.memorySupports,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  calculateSocialSupportLevel(preferences) {
    const needs = [
      preferences.socialStories,
      preferences.peerSupport,
      preferences.socialCues,
      preferences.interactionGuides,
      preferences.socialScripts,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  calculateBehavioralSupportLevel(preferences) {
    const needs = [
      preferences.behaviorSupports,
      preferences.selfRegulationTools,
      preferences.calmingStrategies,
      preferences.reinforcementSystems,
      preferences.behaviorPlans,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  calculateSensorySupportLevel(preferences) {
    const needs = [
      preferences.sensoryBreaks,
      preferences.sensoryTools,
      preferences.environmentalMods,
      preferences.sensoryDiet,
      preferences.sensoryRegulation,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  // Métodos de análise específica
  assessVisualProcessing(data) {
    return {
      acuity: data.visualAcuity || 'typical',
      tracking: data.visualTracking || 'developing',
      discrimination: data.visualDiscrimination || 'emerging',
      memory: data.visualMemory || 'developing',
    }
  }

  assessAuditoryProcessing(data) {
    return {
      discrimination: data.auditoryDiscrimination || 'developing',
      memory: data.auditoryMemory || 'emerging',
      processing: data.auditoryProcessing || 'typical',
      attention: data.auditoryAttention || 'variable',
    }
  }

  assessTactileProcessing(data) {
    return {
      sensitivity: data.tactileSensitivity || 'typical',
      discrimination: data.tactileDiscrimination || 'developing',
      tolerance: data.tactileTolerance || 'variable',
    }
  }

  assessVestibularProcessing(data) {
    return {
      balance: data.balance || 'developing',
      movement: data.movementTolerance || 'typical',
      spatial: data.spatialAwareness || 'emerging',
    }
  }

  assessProprioceptiveProcessing(data) {
    return {
      bodyAwareness: data.bodyAwareness || 'developing',
      forceGrading: data.forceGrading || 'emerging',
      motorPlanning: data.motorPlanning || 'developing',
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

  // Métodos de avaliação socioemocional
  assessEmotionalRegulation(data) {
    return {
      recognition: data.emotionRecognition || 'developing',
      expression: data.emotionExpression || 'emerging',
      regulation: data.emotionRegulation || 'needs-support',
      coping: data.copingStrategies || 'limited',
    }
  }

  assessSocialAwareness(data) {
    return {
      perspective: data.perspectiveTaking || 'emerging',
      empathy: data.empathySkills || 'developing',
      socialCues: data.socialCueReading || 'challenging',
      context: data.socialContext || 'literal',
    }
  }

  assessEmpathySkills(data) {
    return {
      cognitive: data.cognitiveEmpathy || 'developing',
      affective: data.affectiveEmpathy || 'emerging',
      behavioral: data.behavioralEmpathy || 'needs-support',
    }
  }

  assessRelationshipSkills(data) {
    return {
      initiation: data.socialInitiation || 'passive',
      maintenance: data.relationshipMaintenance || 'challenging',
      reciprocity: data.socialReciprocity || 'developing',
      boundaries: data.socialBoundaries || 'needs-support',
    }
  }

  assessDecisionMaking(data) {
    return {
      problemSolving: data.problemSolving || 'concrete',
      consequences: data.consequenceUnderstanding || 'emerging',
      values: data.valuesBased || 'developing',
      independence: data.independentChoices || 'supported',
    }
  }

  // Métodos de avaliação de função executiva
  assessWorkingMemory(data) {
    return {
      verbal: data.verbalWorkingMemory || 'developing',
      visual: data.visualWorkingMemory || 'emerging',
      capacity: data.workingMemoryCapacity || 'limited',
    }
  }

  assessCognitiveFlexibility(data) {
    return {
      setShifting: data.setShifting || 'challenging',
      adaptation: data.cognitiveAdaptation || 'rigid',
      perspective: data.perspectiveShifting || 'difficult',
    }
  }

  assessInhibitoryControl(data) {
    return {
      impulse: data.impulseControl || 'developing',
      attention: data.attentionalControl || 'variable',
      behavioral: data.behavioralInhibition || 'needs-support',
    }
  }

  assessPlanningOrganization(data) {
    return {
      planning: data.planningSkills || 'emerging',
      organization: data.organizationSkills || 'needs-support',
      sequencing: data.sequencingAbility || 'developing',
      prioritization: data.prioritizationSkills || 'challenging',
    }
  }

  assessTimeManagement(data) {
    return {
      awareness: data.timeAwareness || 'emerging',
      estimation: data.timeEstimation || 'inaccurate',
      scheduling: data.timeScheduling || 'needs-support',
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

    if (average >= 75) return 'strong'
    if (average >= 50) return 'developing'
    if (average >= 25) return 'emerging'
    return 'needs-significant-support'
  }

  scoreExecutiveComponent(level) {
    const levelScores = {
      strong: 100,
      independent: 90,
      developing: 75,
      emerging: 50,
      'needs-support': 25,
      challenging: 15,
      difficult: 10,
      'needs-significant-support': 5,
    }

    return levelScores[level] || 50
  }

  // Métodos para identificar padrões
  identifyStrengths(data) {
    const strengths = []

    if (data.accuracy > 0.8) strengths.push('high-accuracy-performance')
    if (data.consistentPerformance) strengths.push('performance-consistency')
    if (data.persistance) strengths.push('task-persistence')
    if (data.selfRegulation) strengths.push('self-regulation-skills')
    if (data.problemSolving) strengths.push('problem-solving-ability')
    if (data.creativity) strengths.push('creative-thinking')
    if (data.attention) strengths.push('sustained-attention')
    if (data.memory) strengths.push('memory-skills')

    return strengths
  }

  identifyChallenges(data) {
    const challenges = []

    if (data.accuracy < 0.4) challenges.push('accuracy-difficulties')
    if (data.timeSpent > 600) challenges.push('extended-processing-time')
    if (data.frustrationLevel > 0.7) challenges.push('frustration-management')
    if (data.attentionDifficulties) challenges.push('attention-regulation')
    if (data.sensoryOverload) challenges.push('sensory-processing')
    if (data.socialDifficulties) challenges.push('social-interaction')
    if (data.communicationBarriers) challenges.push('communication-skills')
    if (data.behavioralChallenges) challenges.push('behavioral-regulation')

    return challenges
  }

  generateRecommendations(data) {
    const recommendations = []
    const challenges = this.identifyChallenges(data)
    const strengths = this.identifyStrengths(data)

    // Baseadas em desafios
    if (challenges.includes('accuracy-difficulties')) {
      recommendations.push('implement-errorless-learning-strategies')
      recommendations.push('increase-visual-supports')
      recommendations.push('break-tasks-into-smaller-steps')
    }

    if (challenges.includes('attention-regulation')) {
      recommendations.push('implement-attention-building-activities')
      recommendations.push('reduce-environmental-distractions')
      recommendations.push('use-movement-breaks')
    }

    if (challenges.includes('sensory-processing')) {
      recommendations.push('conduct-sensory-assessment')
      recommendations.push('implement-sensory-diet')
      recommendations.push('modify-environmental-factors')
    }

    // Baseadas em pontos fortes
    if (strengths.includes('memory-skills')) {
      recommendations.push('leverage-memory-strengths-for-learning')
      recommendations.push('use-memory-based-teaching-strategies')
    }

    if (strengths.includes('creative-thinking')) {
      recommendations.push('incorporate-creative-activities')
      recommendations.push('encourage-divergent-thinking-tasks')
    }

    return recommendations
  }

  // Métodos para perfis
  identifyProfileStrengths(profile) {
    const preferences = profile.preferences || {}
    const strengths = []

    if (preferences.visualLearning) strengths.push('visual-learning-preference')
    if (preferences.auditoryLearning) strengths.push('auditory-learning-preference')
    if (preferences.kinestheticLearning) strengths.push('kinesthetic-learning-preference')
    if (preferences.routineFollowing) strengths.push('routine-adherence')
    if (preferences.detailOriented) strengths.push('attention-to-detail')
    if (preferences.memorySkills) strengths.push('memory-abilities')
    if (preferences.patternRecognition) strengths.push('pattern-recognition')

    return strengths
  }

  identifyProfileNeeds(profile) {
    const preferences = profile.preferences || {}
    const needs = []

    if (preferences.socialSupport) needs.push('social-skills-development')
    if (preferences.communicationSupport) needs.push('communication-enhancement')
    if (preferences.behavioralSupport) needs.push('behavioral-regulation')
    if (preferences.sensorySupport) needs.push('sensory-processing-support')
    if (preferences.academicSupport) needs.push('academic-skill-building')
    if (preferences.motorSupport) needs.push('motor-skills-development')
    if (preferences.cognitiveSupport) needs.push('cognitive-skill-enhancement')

    return needs
  }

  suggestTherapyGoals(profile) {
    const needs = this.identifyProfileNeeds(profile)
    const goals = []

    if (needs.includes('social-skills-development')) {
      goals.push('improve-peer-interaction-skills')
      goals.push('develop-social-initiation-abilities')
      goals.push('enhance-social-reciprocity')
    }

    if (needs.includes('communication-enhancement')) {
      goals.push('expand-expressive-communication')
      goals.push('improve-receptive-language')
      goals.push('develop-functional-communication')
    }

    if (needs.includes('behavioral-regulation')) {
      goals.push('develop-self-regulation-strategies')
      goals.push('improve-emotional-regulation')
      goals.push('enhance-coping-mechanisms')
    }

    return goals
  }

  recommendInterventions(profile) {
    const goals = this.suggestTherapyGoals(profile)
    const interventions = []

    if (goals.includes('improve-peer-interaction-skills')) {
      interventions.push('structured-social-activities')
      interventions.push('peer-mediated-interventions')
      interventions.push('social-stories-implementation')
    }

    if (goals.includes('develop-self-regulation-strategies')) {
      interventions.push('mindfulness-based-interventions')
      interventions.push('sensory-regulation-techniques')
      interventions.push('cognitive-behavioral-strategies')
    }

    return interventions
  }

  // Métodos de análise de dificuldade
  calculateDifficultyProgression(session) {
    const performanceData = session.performance_data || {}
    const accuracy = performanceData.accuracy || 0
    const timeSpent = performanceData.timeSpent || 0

    let progression = 'maintain'

    if (accuracy > 0.85 && timeSpent < 300) {
      progression = 'increase'
    } else if (accuracy < 0.4 || timeSpent > 600) {
      progression = 'decrease'
    }

    return {
      current: session.difficulty || 'MEDIUM',
      recommended: progression,
      confidence: this.calculateProgressionConfidence(performanceData),
      reasoning: this.explainProgressionReasoning(performanceData, progression),
    }
  }

  calculateProgressionConfidence(data) {
    let confidence = 0.5

    if (data.attempts >= 5) confidence += 0.2
    if (data.timeSpent >= 60) confidence += 0.1
    if (data.consistency) confidence += 0.2

    return Math.min(confidence, 1.0)
  }

  explainProgressionReasoning(data, progression) {
    const reasons = []

    if (progression === 'increase') {
      if (data.accuracy > 0.85) reasons.push('high-accuracy-achieved')
      if (data.timeSpent < 300) reasons.push('efficient-completion-time')
      if (data.frustrationLevel < 0.3) reasons.push('low-frustration-observed')
    } else if (progression === 'decrease') {
      if (data.accuracy < 0.4) reasons.push('accuracy-below-threshold')
      if (data.timeSpent > 600) reasons.push('extended-processing-time')
      if (data.frustrationLevel > 0.7) reasons.push('high-frustration-observed')
    }

    return reasons
  }

  // Extrair indicadores comportamentais
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
    const timeSpent = data.timeSpent || 0
    const attempts = data.attempts || 0
    const interactions = data.interactions || 0

    let engagementScore = 0

    if (timeSpent > 60) engagementScore += 0.3
    if (attempts > 3) engagementScore += 0.3
    if (interactions > 5) engagementScore += 0.4

    if (engagementScore >= 0.8) return 'high'
    if (engagementScore >= 0.5) return 'moderate'
    if (engagementScore >= 0.2) return 'low'
    return 'minimal'
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

    let frustrationIndicators = 0

    if (frustrationLevel > 0.7) frustrationIndicators++
    if (errorRate > 0.6) frustrationIndicators++
    if (abandonmentRate > 0.3) frustrationIndicators++

    if (frustrationIndicators >= 3) return 'high'
    if (frustrationIndicators >= 2) return 'moderate'
    if (frustrationIndicators >= 1) return 'low'
    return 'minimal'
  }

  assessRegulation(data) {
    const selfCorrections = data.selfCorrections || 0
    const pausesTaken = data.pausesTaken || 0
    const helpSeeking = data.helpSeeking || 0

    let regulationScore = 0

    if (selfCorrections > 2) regulationScore += 0.4
    if (pausesTaken > 1) regulationScore += 0.3
    if (helpSeeking > 0) regulationScore += 0.3

    if (regulationScore >= 0.8) return 'independent'
    if (regulationScore >= 0.5) return 'emerging'
    if (regulationScore >= 0.2) return 'minimal'
    return 'needs-support'
  }

  assessAttention(data) {
    const focusTime = data.focusTime || 0
    const distractions = data.distractions || 0
    const taskSwitching = data.taskSwitching || 0

    let attentionScore = focusTime / 100 // Normalize to percentage
    attentionScore -= distractions * 0.1
    attentionScore -= taskSwitching * 0.05

    if (attentionScore >= 0.8) return 'sustained'
    if (attentionScore >= 0.5) return 'variable'
    if (attentionScore >= 0.2) return 'brief'
    return 'difficult'
  }

  assessMotivation(data) {
    const taskInitiation = data.taskInitiation || false
    const taskCompletion = data.taskCompletion || false
    const positiveResponse = data.positiveResponse || false
    const requestForMore = data.requestForMore || false

    let motivationIndicators = 0

    if (taskInitiation) motivationIndicators++
    if (taskCompletion) motivationIndicators++
    if (positiveResponse) motivationIndicators++
    if (requestForMore) motivationIndicators++

    if (motivationIndicators >= 4) return 'high'
    if (motivationIndicators >= 3) return 'moderate'
    if (motivationIndicators >= 2) return 'emerging'
    return 'low'
  }

  // Métodos de recomendação de suporte
  getVisualSupportRecommendations(settings) {
    const recommendations = []

    if (settings.highContrast) {
      recommendations.push('maintain-high-contrast-interface')
      recommendations.push('use-bold-visual-elements')
    }

    if (settings.largeText) {
      recommendations.push('implement-scalable-text-options')
      recommendations.push('ensure-readable-font-choices')
    }

    recommendations.push('provide-visual-cues-for-navigation')
    recommendations.push('use-consistent-visual-layouts')

    return recommendations
  }

  getAuditorySupportRecommendations(settings) {
    const recommendations = []

    if (settings.textToSpeech) {
      recommendations.push('implement-comprehensive-tts')
      recommendations.push('provide-audio-descriptions')
    }

    if (settings.audioFeedback) {
      recommendations.push('use-meaningful-audio-cues')
      recommendations.push('provide-audio-confirmation')
    }

    recommendations.push('offer-volume-control-options')
    recommendations.push('minimize-background-audio-interference')

    return recommendations
  }

  getMotorSupportRecommendations(settings) {
    const recommendations = []

    if (settings.largeButtons) {
      recommendations.push('implement-touch-friendly-interfaces')
      recommendations.push('ensure-adequate-button-spacing')
    }

    if (settings.reducedMotion) {
      recommendations.push('minimize-animated-elements')
      recommendations.push('provide-static-alternatives')
    }

    recommendations.push('support-keyboard-navigation')
    recommendations.push('implement-gesture-alternatives')

    return recommendations
  }

  getCognitiveSupportRecommendations(settings) {
    const recommendations = []

    if (settings.simplifiedInterface) {
      recommendations.push('reduce-interface-complexity')
      recommendations.push('prioritize-essential-functions')
    }

    if (settings.extraTime) {
      recommendations.push('implement-flexible-time-limits')
      recommendations.push('provide-progress-indicators')
    }

    recommendations.push('offer-step-by-step-guidance')
    recommendations.push('provide-contextual-help')

    return recommendations
  }

  // Método auxiliar para estimativa de carga cognitiva
  estimateCognitiveLoad(data) {
    const factors = {
      complexity: data.taskComplexity || 0.5,
      duration: Math.min(data.timeSpent / 600, 1), // Normalize to 10 minutes max
      errorRate: data.errors / Math.max(data.attempts, 1),
      multimodal: data.multimodalElements ? 0.2 : 0,
    }

    const load =
      factors.complexity * 0.4 +
      factors.duration * 0.3 +
      factors.errorRate * 0.2 +
      factors.multimodal

    if (load >= 0.8) return 'high'
    if (load >= 0.6) return 'moderate'
    if (load >= 0.3) return 'low'
    return 'minimal'
  }

  // Método para extrair métricas adaptativas
  extractAdaptiveMetrics(data) {
    return {
      learningRate: this.calculateLearningRate(data),
      adaptationSpeed: this.calculateAdaptationSpeed(data),
      transferAbility: this.assessTransferAbility(data),
      retentionLevel: this.assessRetentionLevel(data),
      motivationIndex: this.calculateMotivationIndex(data),
    }
  }

  calculateLearningRate(data) {
    const initialAccuracy = data.initialAccuracy || 0
    const finalAccuracy = data.finalAccuracy || data.accuracy || 0
    const timeSpent = data.timeSpent || 1

    return (finalAccuracy - initialAccuracy) / (timeSpent / 60) // Per minute
  }

  calculateAdaptationSpeed(data) {
    const adaptationPoints = data.adaptationPoints || []
    if (adaptationPoints.length < 2) return 0

    const timeToAdapt = adaptationPoints[1].time - adaptationPoints[0].time
    return 1 / (timeToAdapt / 60) // Adaptations per minute
  }

  assessTransferAbility(data) {
    const similarTasksPerformance = data.similarTasksPerformance || []
    if (similarTasksPerformance.length === 0) return 0.5

    const averageTransfer =
      similarTasksPerformance.reduce((sum, perf) => sum + perf, 0) / similarTasksPerformance.length
    return averageTransfer
  }

  assessRetentionLevel(data) {
    const retentionTests = data.retentionTests || []
    if (retentionTests.length === 0) return 0.5

    const averageRetention =
      retentionTests.reduce((sum, test) => sum + test.score, 0) / retentionTests.length
    return averageRetention
  }
  calculateMotivationIndex(data) {
    const engagementTime = data.engagementTime || 0
    const totalTime = data.timeSpent || 1
    const voluntaryRepeats = data.voluntaryRepeats || 0
    const positiveExpressions = data.positiveExpressions || 0

    const engagementRatio = engagementTime / totalTime
    const motivationScore =
      engagementRatio * 0.5 + voluntaryRepeats * 0.2 + positiveExpressions * 0.3

    return Math.min(motivationScore, 1.0)
  }

  // ============== GERENCIAMENTO DE PERFIS DE USUÁRIO ==============

  // Obter perfis de usuário com análise terapêutica
  async getUserProfiles(userId) {
    const userIdStr = String(userId)
    const cacheKey = `user_profiles_${userIdStr}`

    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for user profiles')
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const profiles = await response.json()

        // Enriquecer perfis com análise terapêutica
        const enrichedProfiles = profiles.map((profile) =>
          this.enrichProfileWithTherapyData(profile)
        )

        // Cache the result
        this.cache.set(cacheKey, enrichedProfiles, 1800000) // 30 minutes

        logger.info('🌟 CLOUD NANDROPHIC: User profiles retrieved with therapy analysis', {
          userId: userIdStr,
          profileCount: enrichedProfiles.length,
        })

        return enrichedProfiles
      }, 'getUserProfiles')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve user profiles', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to retrieve user profiles. Please check your connection.')
    }
  }

  // Criar perfil de usuário com dados terapêuticos
  async createUserProfile(userId, profileData) {
    const userIdStr = String(userId)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for profile creation')
    }

    // Enriquecer dados do perfil com análise terapêutica
    const enhancedProfileData = {
      ...profileData,
      createdAt: new Date().toISOString(),
      therapyData: this.generateInitialTherapyData(profileData),
      adaptiveParameters: this.generateInitialAdaptiveParameters(profileData),
      accessibilityProfile: this.generateAccessibilityProfile(profileData),
      version: '2.1',
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles`,
          {
            method: 'POST',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(enhancedProfileData),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const newProfile = await response.json()

        // Invalidate cache
        this.cache.invalidate(`user_profiles_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: User profile created with therapy data', {
          userId: userIdStr,
          profileId: newProfile.id,
        })

        return newProfile
      }, 'createUserProfile')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to create user profile', {
        userId: userIdStr,
        error: error.message,
      })
      throw new Error('Unable to create user profile. Please check your connection.')
    }
  }

  // Atualizar perfil de usuário
  async updateUserProfile(userId, profileId, updateData) {
    const userIdStr = String(userId)

    if (!navigator.onLine) {
      throw new Error('🚨 CLOUD NANDROPHIC: Internet connection required for profile updates')
    }

    const enhancedUpdateData = {
      ...updateData,
      updatedAt: new Date().toISOString(),
      version: '2.1',
    }

    try {
      return await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.users}/${userIdStr}/profiles/${profileId}`,
          {
            method: 'PUT',
            headers: {
              ...API_CONFIG.DEFAULT_HEADERS,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(enhancedUpdateData),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const updatedProfile = await response.json()

        // Invalidate cache
        this.cache.invalidate(`user_profiles_${userIdStr}`)

        logger.info('🌟 CLOUD NANDROPHIC: User profile updated', {
          userId: userIdStr,
          profileId: profileId,
        })

        return updatedProfile
      }, 'updateUserProfile')
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to update user profile', {
        userId: userIdStr,
        profileId: profileId,
        error: error.message,
      })
      throw new Error('Unable to update user profile. Please check your connection.')
    }
  }

  // Enriquecer perfil com dados terapêuticos
  enrichProfileWithTherapyData(profile) {
    try {
      return {
        ...profile,
        therapyAnalysis: {
          cognitiveLevel: this.assessCognitiveLevel(profile),
          communicationLevel: this.assessCommunicationLevel(profile),
          socialSkillsLevel: this.assessSocialSkillsLevel(profile),
          sensoryProfile: this.createSensoryProfile(profile),
          behavioralProfile: this.createBehavioralProfile(profile),
          adaptiveSkills: this.assessAdaptiveSkills(profile),
        },
        supportNeeds: {
          visualSupport: this.calculateVisualSupportLevel(profile.preferences || {}),
          auditorySupport: this.calculateAuditorySupportLevel(profile.preferences || {}),
          motorSupport: this.calculateMotorSupportLevel(profile.preferences || {}),
          cognitiveSupport: this.calculateCognitiveSupportLevel(profile.preferences || {}),
          socialSupport: this.calculateSocialSupportLevel(profile.preferences || {}),
          behavioralSupport: this.calculateBehavioralSupportLevel(profile.preferences || {}),
          sensorySupport: this.calculateSensorySupportLevel(profile.preferences || {}),
        },
        recommendations: {
          strengths: this.identifyProfileStrengths(profile),
          needs: this.identifyProfileNeeds(profile),
          goals: this.suggestTherapyGoals(profile),
          interventions: this.recommendInterventions(profile),
        },
      }
    } catch (error) {
      logger.warn('Failed to enrich profile with therapy data', {
        profileId: profile.id,
        error: error.message,
      })
      return profile
    }
  }

  // Gerar dados terapêuticos iniciais
  generateInitialTherapyData(profileData) {
    return {
      assessmentDate: new Date().toISOString(),
      cognitiveProfile: this.assessCognitiveLevel(profileData),
      communicationProfile: this.assessCommunicationLevel(profileData),
      socialProfile: this.assessSocialSkillsLevel(profileData),
      sensoryProfile: this.createSensoryProfile(profileData),
      behavioralProfile: this.createBehavioralProfile(profileData),
      adaptiveProfile: this.assessAdaptiveSkills(profileData),
      needsAssessment: {
        priority: 'initial-assessment',
        areas: this.identifyProfileNeeds(profileData),
        recommendations: this.generateRecommendations(profileData),
      },
    }
  }

  // Gerar parâmetros adaptativos iniciais
  generateInitialAdaptiveParameters(profileData) {
    const preferences = profileData.preferences || {}

    return {
      difficulty: {
        baseLevel: preferences.skillLevel || 'MEDIUM',
        adaptationRate: 0.1,
        minLevel: 'EASY',
        maxLevel: 'HARD',
      },
      timing: {
        baseTimeLimit:
          preferences.preferredPace === 'slow'
            ? 120
            : preferences.preferredPace === 'fast'
              ? 60
              : 90,
        adaptationFactor: 0.2,
        minTime: 30,
        maxTime: 300,
      },
      feedback: {
        frequency: preferences.feedbackLevel || 'moderate',
        type: preferences.feedbackType || 'visual',
        reinforcement: preferences.reinforcementType || 'positive',
      },
      scaffolding: {
        level: preferences.supportLevel || 'moderate',
        fadeRate: 0.05,
        minSupport: 0.1,
        maxSupport: 1.0,
      },
    }
  }

  // Gerar perfil de acessibilidade
  generateAccessibilityProfile(profileData) {
    const preferences = profileData.preferences || {}

    return {
      visual: {
        highContrast: preferences.visualNeedsHighContrast || false,
        largeText: preferences.visualNeedsLargeText || false,
        colorBlindSupport: preferences.colorBlindness || false,
        motionSensitivity: preferences.motionSensitive || false,
      },
      auditory: {
        hearingImpairment: preferences.hearingImpairment || false,
        soundSensitivity: preferences.soundSensitive || false,
        textToSpeech: preferences.needsTTS || false,
        captionsRequired: preferences.needsCaptions || false,
      },
      motor: {
        fineMotorDifficulties: preferences.fineMotorDifficulties || false,
        grossMotorDifficulties: preferences.grossMotorDifficulties || false,
        alternativeInput: preferences.needsAlternativeInput || false,
        tremor: preferences.hasTremor || false,
      },
      cognitive: {
        processingSpeed: preferences.processingSpeed || 'typical',
        memorySupport: preferences.needsMemorySupport || false,
        attentionSupport: preferences.needsAttentionSupport || false,
        executiveSupport: preferences.needsExecutiveSupport || false,
      },
    }
  }

  // ============== FUNCIONALIDADES TERAPÊUTICAS AVANÇADAS ==============

  // Restaurar getAdaptiveParameters com parâmetros detalhados
  async getAdaptiveParameters(userId, gameId, sessionData = null) {
    const userIdStr = String(userId)
    const cacheKey = `adaptive_params_${userIdStr}_${gameId}`

    try {
      // Try cache first for quick response
      const cached = this.cache.get(cacheKey)
      if (cached !== null && this.isCacheValid(cached, 300000)) {
        // 5 minutes cache
        return this.enhanceAdaptiveParameters(cached, sessionData)
      }

      // Base parameters with autism-specific optimizations
      const baseParameters = {
        difficulty: {
          level: 'MEDIUM',
          adaptationRate: 0.15,
          stabilityThreshold: 0.7,
          autismOptimizations: {
            consistentProgression: true,
            predictablePatterns: true,
            reducedCognitiveDemand: true,
          },
        },
        timing: {
          baseTime: 90,
          adaptationFactor: 0.25,
          processingTime: {
            visual: 2.0,
            auditory: 1.5,
            motor: 2.5,
            cognitive: 3.0,
          },
          autismOptimizations: {
            extendedProcessingTime: true,
            transitionWarnings: true,
            flexibleTimeouts: true,
          },
        },
        sensory: {
          visualIntensity: 0.7,
          auditoryIntensity: 0.6,
          tactileIntensity: 0.5,
          overloadProtection: {
            enabled: true,
            threshold: 0.8,
            recoveryTime: 30,
          },
          autismOptimizations: {
            sensoryBreaks: true,
            graduatedExposure: true,
            choiceOptions: true,
          },
        },
        communication: {
          modalityPreference: 'visual',
          complexityLevel: 'concrete',
          supportLevel: 'moderate',
          autismOptimizations: {
            visualSupports: true,
            socialStories: true,
            predictableLanguage: true,
          },
        },
        social: {
          interactionLevel: 'structured',
          groupSize: 'small',
          socialDemands: 'minimal',
          autismOptimizations: {
            socialScripts: true,
            peerSupport: true,
            choiceInParticipation: true,
          },
        },
        behavioral: {
          reinforcementSchedule: 'frequent',
          feedbackType: 'immediate',
          selfRegulationSupport: 'high',
          autismOptimizations: {
            visualSchedules: true,
            choiceBoards: true,
            calmingStrategies: true,
          },
        },
        executive: {
          workingMemorySupport: 'high',
          attentionSupport: 'moderate',
          planningSupport: 'structured',
          autismOptimizations: {
            taskBreakdown: true,
            visualOrganizers: true,
            routineSupport: true,
          },
        },
      }

      if (!navigator.onLine) {
        logger.warn('🚨 CLOUD NANDROPHIC: Using cached adaptive parameters (offline)')
        const localParams = this.getLocalData(cacheKey, baseParameters)
        return this.enhanceAdaptiveParameters(localParams, sessionData)
      }

      // Try to get user-specific parameters from server
      const serverParameters = await this.withRetry(async () => {
        const response = await authenticatedFetch(
          `${this.apiUrl}${API_CONFIG.ENDPOINTS.games}/${gameId}/adaptive-parameters/${userIdStr}`,
          {
            method: 'GET',
            headers: API_CONFIG.DEFAULT_HEADERS,
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            // No specific parameters found, use base
            return baseParameters
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      }, 'getAdaptiveParameters')

      // Merge with base parameters for safety
      const mergedParameters = this.mergeAdaptiveParameters(baseParameters, serverParameters)

      // Cache the result
      this.cache.set(cacheKey, mergedParameters, 300000)
      this.setLocalData(cacheKey, mergedParameters)

      logger.info('🌟 CLOUD NANDROPHIC: Adaptive parameters retrieved with autism optimizations', {
        userId: userIdStr,
        gameId: gameId,
      })

      return this.enhanceAdaptiveParameters(mergedParameters, sessionData)
    } catch (error) {
      logger.error('🚨 CLOUD NANDROPHIC: Failed to retrieve adaptive parameters', {
        userId: userIdStr,
        gameId: gameId,
        error: error.message,
      })

      // Return enhanced base parameters as fallback
      return this.enhanceAdaptiveParameters(baseParameters, sessionData)
    }
  }

  // Enhance adaptive parameters with session-specific data
  enhanceAdaptiveParameters(parameters, sessionData) {
    if (!sessionData) return parameters

    const enhancements = {
      ...parameters,
      sessionSpecific: {
        currentPerformance: this.analyzeCurrentPerformance(sessionData),
        adaptiveAdjustments: this.calculateAdaptiveAdjustments(sessionData),
        therapyOptimizations: this.generateSessionTherapyOptimizations(sessionData),
        autismSupports: this.calculateSessionAutismSupports(sessionData),
      },
      realTimeAdaptations: {
        difficultyModifier: this.calculateDifficultyModifier(sessionData),
        timingAdjustments: this.calculateTimingAdjustments(sessionData),
        sensoryAdjustments: this.calculateSensoryAdjustments(sessionData),
        supportAdjustments: this.calculateSupportAdjustments(sessionData),
      },
    }

    return enhancements
  }

  // Merge adaptive parameters safely
  mergeAdaptiveParameters(base, server) {
    const merged = { ...base }

    Object.keys(server).forEach((category) => {
      if (merged[category] && typeof merged[category] === 'object') {
        merged[category] = { ...merged[category], ...server[category] }
      } else {
        merged[category] = server[category]
      }
    })

    return merged
  }

  // Calculate session-specific therapy optimizations
  generateSessionTherapyOptimizations(sessionData) {
    const performance = sessionData.performance || {}

    return {
      cognitiveLoad: this.optimizeCognitiveLoad(performance),
      sensorySupport: this.optimizeSensorySupport(performance),
      communicationSupport: this.optimizeCommunicationSupport(performance),
      socialSupport: this.optimizeSocialSupport(performance),
      behavioralSupport: this.optimizeBehavioralSupport(performance),
      executiveSupport: this.optimizeExecutiveSupport(performance),
    }
  }

  // Calculate autism-specific supports for session
  calculateSessionAutismSupports(sessionData) {
    const indicators = sessionData.indicators || {}

    return {
      sensoryRegulation: {
        needed: indicators.sensoryOverload || false,
        intensity: this.calculateSensoryRegulationNeeds(indicators),
        strategies: this.suggestSensoryStrategies(indicators),
      },
      socialCommunication: {
        needed: indicators.communicationDifficulties || false,
        level: this.calculateCommunicationSupport(indicators),
        strategies: this.suggestCommunicationStrategies(indicators),
      },
      executiveFunction: {
        needed: indicators.executiveDifficulties || false,
        areas: this.identifyExecutiveNeeds(indicators),
        strategies: this.suggestExecutiveStrategies(indicators),
      },
      behavioralRegulation: {
        needed: indicators.behavioralChallenges || false,
        triggers: this.identifyBehavioralTriggers(indicators),
        strategies: this.suggestBehavioralStrategies(indicators),
      },
    }
  }

  // Helper methods for optimization calculations
  optimizeCognitiveLoad(performance) {
    const complexity = performance.taskComplexity || 0.5
    const errorRate = performance.errorRate || 0.2
    const processingTime = performance.averageResponseTime || 0

    if (errorRate > 0.5 || processingTime > 120) {
      return 'reduce'
    } else if (errorRate < 0.1 && processingTime < 30) {
      return 'increase'
    }
    return 'maintain'
  }

  optimizeSensorySupport(performance) {
    return {
      visual: performance.visualOverload ? 'reduce' : 'maintain',
      auditory: performance.auditoryDifficulties ? 'reduce' : 'maintain',
      tactile: performance.tactileAvoidance ? 'minimize' : 'maintain',
    }
  }

  optimizeCommunicationSupport(performance) {
    return {
      level: performance.communicationDifficulties ? 'increase' : 'maintain',
      modality: performance.preferredModality || 'visual',
      complexity: performance.languageComplexity || 'simple',
    }
  }

  optimizeSocialSupport(performance) {
    return {
      interaction: performance.socialWithdrawal ? 'reduce' : 'maintain',
      groupSize: performance.groupAnxiety ? 'individual' : 'small',
      structure: performance.socialConfusion ? 'high' : 'moderate',
    }
  }

  optimizeBehavioralSupport(performance) {
    return {
      regulation: performance.behavioralChallenges ? 'increase' : 'maintain',
      reinforcement: performance.motivationLevel || 'moderate',
      structure: performance.needsStructure ? 'high' : 'moderate',
    }
  }

  optimizeExecutiveSupport(performance) {
    return {
      planning: performance.planningDifficulties ? 'increase' : 'maintain',
      organization: performance.organizationNeeds ? 'high' : 'moderate',
      memory: performance.memorySupport ? 'increase' : 'maintain',
    }
  }

  // ============== MÉTODOS AUXILIARES DE ANÁLISE ==============

  // Analyze sensory processing from session data
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

  // Assess social-emotional aspects
  assessSocialEmotionalAspects(data) {
    return {
      emotionalRegulation: this.assessEmotionalRegulation(data),
      socialAwareness: this.assessSocialAwareness(data),
      empathy: this.assessEmpathySkills(data),
      relationships: this.assessRelationshipSkills(data),
      decisionMaking: this.assessDecisionMaking(data),
    }
  }

  // Evaluate executive function
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

  // Calculate autism support level
  calculateAutismSupportLevel(data) {
    const supportAreas = {
      communication: this.calculateCommunicationSupport(data),
      social: this.calculateSocialSupport(data),
      behavioral: this.calculateBehavioralSupport(data),
      sensory: this.calculateSensorySupport(data),
      executive: this.calculateExecutiveSupport(data),
    }

    const supportLevels = Object.values(supportAreas)
    const averageSupport =
      supportLevels.reduce((sum, level) => {
        const numLevel = this.convertSupportLevelToNumber(level)
        return sum + numLevel
      }, 0) / supportLevels.length

    if (averageSupport >= 3) return 'extensive'
    if (averageSupport >= 2) return 'substantial'
    if (averageSupport >= 1) return 'intermittent'
    return 'minimal'
  }

  convertSupportLevelToNumber(level) {
    const levelMap = {
      none: 0,
      minimal: 1,
      moderate: 2,
      substantial: 3,
      extensive: 4,
      maximum: 4,
    }
    return levelMap[level] || 2
  }

  // Calculate support adjustments
  calculateSupportAdjustments(sessionData) {
    return {
      cognitive: this.calculateCognitiveAdjustments(sessionData),
      sensory: this.calculateSensoryAdjustments(sessionData),
      communication: this.calculateCommunicationAdjustments(sessionData),
      behavioral: this.calculateBehavioralAdjustments(sessionData),
    }
  }

  calculateCognitiveAdjustments(sessionData) {
    const performance = sessionData.performance || {}
    return {
      processingTime: performance.needsExtraTime ? 1.5 : 1.0,
      complexity: performance.strugglesWithComplexity ? 0.7 : 1.0,
      support: performance.needsCognitiveSupport ? 'increase' : 'maintain',
    }
  }

  calculateBehavioralAdjustments(sessionData) {
    const indicators = sessionData.indicators || {}
    return {
      structure: indicators.needsStructure ? 'increase' : 'maintain',
      reinforcement: indicators.motivationIssues ? 'increase' : 'maintain',
      regulation: indicators.regulationDifficulties ? 'support' : 'maintain',
    }
  }

  calculateCommunicationAdjustments(sessionData) {
    const performance = sessionData.performance || {}
    return {
      modality: performance.preferredCommunicationMode || 'visual',
      complexity: performance.communicationLevel || 'simple',
      support: performance.needsCommunicationSupport ? 'increase' : 'maintain',
    }
  }

  // Suggest adaptations based on performance
  suggestAdaptations(data) {
    const adaptations = []

    if (data.accuracy < 0.5) {
      adaptations.push('reduce-task-difficulty')
      adaptations.push('increase-scaffolding')
      adaptations.push('provide-more-examples')
    }

    if (data.timeSpent > 300) {
      adaptations.push('extend-time-limits')
      adaptations.push('break-tasks-into-smaller-parts')
      adaptations.push('provide-processing-breaks')
    }

    if (data.frustrationLevel > 0.7) {
      adaptations.push('implement-calming-strategies')
      adaptations.push('adjust-expectations')
      adaptations.push('increase-positive-reinforcement')
    }

    if (data.engagementLevel < 0.3) {
      adaptations.push('increase-motivational-elements')
      adaptations.push('incorporate-preferred-interests')
      adaptations.push('adjust-presentation-style')
    }

    return adaptations
  }

  // Detect accessibility needs automatically
  detectAccessibilityNeeds() {
    const detectedNeeds = {}

    // Check for high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      detectedNeeds.highContrast = true
    }

    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detectedNeeds.reducedMotion = true
    }

    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      detectedNeeds.darkMode = true
    }

    // Check device capabilities
    if (navigator.vibrate) {
      detectedNeeds.vibrationSupport = true
    }

    if ('speechSynthesis' in window) {
      detectedNeeds.textToSpeechSupport = true
    }

    return detectedNeeds
  }

  // Get device adaptations
  getDeviceAdaptations() {
    const adaptations = {
      touchSupport: 'ontouchstart' in window,
      screenSize: this.getScreenSizeCategory(),
      orientation: this.getScreenOrientation(),
      inputMethods: this.getAvailableInputMethods(),
      capabilities: this.getDeviceCapabilities(),
    }

    return adaptations
  }

  getScreenSizeCategory() {
    const width = window.innerWidth
    if (width < 576) return 'mobile'
    if (width < 768) return 'tablet-small'
    if (width < 992) return 'tablet'
    if (width < 1200) return 'desktop'
    return 'large-desktop'
  }

  getScreenOrientation() {
    if (screen.orientation) {
      return screen.orientation.type
    }
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  }

  getAvailableInputMethods() {
    const methods = ['mouse', 'keyboard']

    if ('ontouchstart' in window) methods.push('touch')
    if (navigator.getGamepads) methods.push('gamepad')
    if (navigator.mediaDevices) methods.push('camera')

    return methods
  }

  getDeviceCapabilities() {
    return {
      webGL: !!window.WebGLRenderingContext,
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      webRTC: !!window.RTCPeerConnection,
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
      geolocation: 'geolocation' in navigator,
      camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    }
  }

  // Utility method to check cache validity
  isCacheValid(cached, maxAge) {
    if (!cached || !cached.timestamp) return false
    return Date.now() - cached.timestamp < maxAge
  }

  // Helper method to calculate performance metrics
  analyzeCurrentPerformance(sessionData) {
    const data = sessionData.performance || {}

    return {
      accuracy: data.accuracy || 0,
      speed: data.averageResponseTime || 0,
      consistency: data.consistencyScore || 0,
      engagement: data.engagementLevel || 0,
      effort: data.effortLevel || 0,
      progress: data.progressRate || 0,
    }
  }

  // Calculate adaptive adjustments
  calculateAdaptiveAdjustments(sessionData) {
    const performance = this.analyzeCurrentPerformance(sessionData)

    return {
      difficulty: this.calculateDifficultyAdjustment(performance),
      timing: this.calculateTimingAdjustment(performance),
      support: this.calculateSupportAdjustment(performance),
      feedback: this.calculateFeedbackAdjustment(performance),
    }
  }

  calculateDifficultyAdjustment(performance) {
    if (performance.accuracy > 0.85 && performance.speed < 0.7) return 'increase'
    if (performance.accuracy < 0.4 || performance.speed > 1.5) return 'decrease'
    return 'maintain'
  }

  calculateTimingAdjustment(performance) {
    if (performance.speed > 1.3) return 'extend'
    if (performance.speed < 0.5) return 'reduce'
    return 'maintain'
  }

  calculateSupportAdjustment(performance) {
    if (performance.effort > 0.8 && performance.accuracy < 0.5) return 'increase'
    if (performance.accuracy > 0.9 && performance.effort < 0.3) return 'decrease'
    return 'maintain'
  }
  calculateFeedbackAdjustment(performance) {
    if (performance.engagement < 0.3) return 'increase'
    if (performance.consistency > 0.9) return 'reduce'
    return 'maintain'
  }

  // ============== MÉTODOS AUXILIARES COMPLETOS ==============

  // Métodos de análise comportamental completos
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

    let frustrationIndicators = 0
    if (frustrationLevel > 0.7) frustrationIndicators++
    if (errorRate > 0.6) frustrationIndicators++
    if (abandonmentRate > 0.3) frustrationIndicators++

    if (frustrationIndicators >= 3) return 'high'
    if (frustrationIndicators >= 2) return 'moderate'
    if (frustrationIndicators >= 1) return 'low'
    return 'minimal'
  }

  assessRegulation(data) {
    const selfCorrections = data.selfCorrections || 0
    const pausesTaken = data.pausesTaken || 0
    const helpSeeking = data.helpSeeking || 0

    let regulationScore = 0
    if (selfCorrections > 2) regulationScore += 0.4
    if (pausesTaken > 1) regulationScore += 0.3
    if (helpSeeking > 0) regulationScore += 0.3

    if (regulationScore >= 0.8) return 'independent'
    if (regulationScore >= 0.5) return 'emerging'
    if (regulationScore >= 0.2) return 'minimal'
    return 'needs-support'
  }

  assessAttention(data) {
    const focusTime = data.focusTime || 0
    const distractions = data.distractions || 0
    const taskSwitching = data.taskSwitching || 0

    let attentionScore = focusTime / 100
    attentionScore -= distractions * 0.1
    attentionScore -= taskSwitching * 0.05

    if (attentionScore >= 0.8) return 'sustained'
    if (attentionScore >= 0.5) return 'variable'
    if (attentionScore >= 0.2) return 'brief'
    return 'difficult'
  }

  assessMotivation(data) {
    const taskInitiation = data.taskInitiation || false
    const taskCompletion = data.taskCompletion || false
    const positiveResponse = data.positiveResponse || false
    const requestForMore = data.requestForMore || false

    let motivationIndicators = 0
    if (taskInitiation) motivationIndicators++
    if (taskCompletion) motivationIndicators++
    if (positiveResponse) motivationIndicators++
    if (requestForMore) motivationIndicators++

    if (motivationIndicators >= 4) return 'high'
    if (motivationIndicators >= 3) return 'moderate'
    if (motivationIndicators >= 2) return 'emerging'
    return 'low'
  }

  // ============== MÉTODOS DE SUPORTE DETALHADOS ==============

  // Análise sensorial completa
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

  // Avaliação socioemocional
  assessSocialEmotionalAspects(data) {
    return {
      emotionalRegulation: this.assessEmotionalRegulation(data),
      socialAwareness: this.assessSocialAwareness(data),
      empathy: this.assessEmpathySkills(data),
      relationships: this.assessRelationshipSkills(data),
      decisionMaking: this.assessDecisionMaking(data),
    }
  }

  // Avaliação de função executiva
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

  // Calcular nível de suporte para autismo
  calculateAutismSupportLevel(data) {
    const supportAreas = {
      communication: this.calculateCommunicationSupport(data),
      social: this.calculateSocialSupport(data),
      behavioral: this.calculateBehavioralSupport(data),
      sensory: this.calculateSensorySupport(data),
      executive: this.calculateExecutiveSupport(data),
    }

    const supportLevels = Object.values(supportAreas)
    const averageSupport =
      supportLevels.reduce((sum, level) => {
        const numLevel = this.convertSupportLevelToNumber(level)
        return sum + numLevel
      }, 0) / supportLevels.length

    if (averageSupport >= 3) return 'extensive'
    if (averageSupport >= 2) return 'substantial'
    if (averageSupport >= 1) return 'intermittent'
    return 'minimal'
  }

  convertSupportLevelToNumber(level) {
    const levelMap = {
      none: 0,
      minimal: 1,
      moderate: 2,
      substantial: 3,
      extensive: 4,
      maximum: 4,
    }
    return levelMap[level] || 2
  }

  // Métodos de suporte específico
  calculateCommunicationSupport(data) {
    const needs = [
      data.verbalDifficulties,
      data.nonverbalNeeds,
      data.socialCommunicationChallenges,
      data.functionalCommunicationNeeds,
    ].filter(Boolean).length

    if (needs >= 3) return 'extensive'
    if (needs >= 2) return 'substantial'
    if (needs >= 1) return 'intermittent'
    return 'minimal'
  }

  calculateSocialSupport(data) {
    const needs = [
      data.peerInteractionDifficulties,
      data.socialInitiationChallenges,
      data.groupParticipationNeeds,
      data.socialReciprocitySupport,
    ].filter(Boolean).length

    if (needs >= 3) return 'extensive'
    if (needs >= 2) return 'substantial'
    if (needs >= 1) return 'intermittent'
    return 'minimal'
  }

  calculateBehavioralSupport(data) {
    const needs = [
      data.selfRegulationDifficulties,
      data.behavioralChallenges,
      data.emotionalRegulationNeeds,
      data.copingStrategiesSupport,
    ].filter(Boolean).length

    if (needs >= 3) return 'extensive'
    if (needs >= 2) return 'substantial'
    if (needs >= 1) return 'intermittent'
    return 'minimal'
  }

  calculateSensorySupport(data) {
    const needs = [
      data.sensoryOverload,
      data.sensorySeekingBehaviors,
      data.sensoryAvoidance,
      data.sensoryProcessingDifficulties,
    ].filter(Boolean).length

    if (needs >= 3) return 'extensive'
    if (needs >= 2) return 'substantial'
    if (needs >= 1) return 'intermittent'
    return 'minimal'
  }

  calculateExecutiveSupport(data) {
    const needs = [
      data.workingMemoryDifficulties,
      data.planningChallenges,
      data.organizationNeeds,
      data.flexibilitySupport,
    ].filter(Boolean).length

    if (needs >= 3) return 'extensive'
    if (needs >= 2) return 'substantial'
    if (needs >= 1) return 'intermittent'
    return 'minimal'
  }

  // ============== MÉTODOS DE ADAPTAÇÃO E SUGESTÕES ==============

  // Sugerir adaptações baseadas em desempenho
  suggestAdaptations(data) {
    const adaptations = []

    if (data.accuracy < 0.5) {
      adaptations.push('reduce-task-difficulty')
      adaptations.push('increase-scaffolding')
      adaptations.push('provide-more-examples')
    }

    if (data.timeSpent > 300) {
      adaptations.push('extend-time-limits')
      adaptations.push('break-tasks-into-smaller-parts')
      adaptations.push('provide-processing-breaks')
    }

    if (data.frustrationLevel > 0.7) {
      adaptations.push('implement-calming-strategies')
      adaptations.push('adjust-expectations')
      adaptations.push('increase-positive-reinforcement')
    }

    if (data.engagementLevel < 0.3) {
      adaptations.push('increase-motivational-elements')
      adaptations.push('incorporate-preferred-interests')
      adaptations.push('adjust-presentation-style')
    }

    return adaptations
  }

  // Detectar necessidades de acessibilidade automaticamente
  detectAccessibilityNeeds() {
    const detectedNeeds = {}

    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      detectedNeeds.highContrast = true
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detectedNeeds.reducedMotion = true
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      detectedNeeds.darkMode = true
    }

    if (navigator.vibrate) {
      detectedNeeds.vibrationSupport = true
    }

    if ('speechSynthesis' in window) {
      detectedNeeds.textToSpeechSupport = true
    }

    return detectedNeeds
  }

  // Adaptações de dispositivo
  getDeviceAdaptations() {
    return {
      touchSupport: 'ontouchstart' in window,
      screenSize: this.getScreenSizeCategory(),
      orientation: this.getScreenOrientation(),
      inputMethods: this.getAvailableInputMethods(),
      capabilities: this.getDeviceCapabilities(),
    }
  }

  getScreenSizeCategory() {
    const width = window.innerWidth
    if (width < 576) return 'mobile'
    if (width < 768) return 'tablet-small'
    if (width < 992) return 'tablet'
    if (width < 1200) return 'desktop'
    return 'large-desktop'
  }

  getScreenOrientation() {
    if (screen.orientation) {
      return screen.orientation.type
    }
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  }

  getAvailableInputMethods() {
    const methods = ['mouse', 'keyboard']
    if ('ontouchstart' in window) methods.push('touch')
    if (navigator.getGamepads) methods.push('gamepad')
    if (navigator.mediaDevices) methods.push('camera')
    return methods
  }

  getDeviceCapabilities() {
    return {
      webGL: !!window.WebGLRenderingContext,
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      webRTC: !!window.RTCPeerConnection,
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
      geolocation: 'geolocation' in navigator,
      camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    }
  }

  // ============== MÉTODOS UTILITÁRIOS ==============

  // Verificar validade do cache
  isCacheValid(cached, maxAge) {
    if (!cached || !cached.timestamp) return false
    return Date.now() - cached.timestamp < maxAge
  }

  // Análise de desempenho atual
  analyzeCurrentPerformance(sessionData) {
    const data = sessionData.performance || {}
    return {
      accuracy: data.accuracy || 0,
      speed: data.averageResponseTime || 0,
      consistency: data.consistencyScore || 0,
      engagement: data.engagementLevel || 0,
      effort: data.effortLevel || 0,
      progress: data.progressRate || 0,
    }
  }

  // Calcular modificadores de dificuldade
  calculateDifficultyModifier(sessionData) {
    const performance = this.analyzeCurrentPerformance(sessionData)

    if (performance.accuracy > 0.85 && performance.speed < 0.7) return 0.2
    if (performance.accuracy < 0.4 || performance.speed > 1.5) return -0.2
    return 0
  }

  // Ajustes de timing
  calculateTimingAdjustments(sessionData) {
    const performance = this.analyzeCurrentPerformance(sessionData)

    return {
      baseTimeMultiplier: performance.speed > 1.3 ? 1.5 : performance.speed < 0.5 ? 0.8 : 1.0,
      processingTimeExtension: performance.accuracy < 0.5 ? 2.0 : 1.0,
      transitionTime: performance.attention === 'brief' ? 3.0 : 1.5,
    }
  }

  // Métodos de suporte específicos para autismo
  calculateSensoryRegulationNeeds(indicators) {
    let needsLevel = 0
    if (indicators.sensoryOverload) needsLevel += 2
    if (indicators.sensoryAvoidance) needsLevel += 1
    if (indicators.sensorySeeking) needsLevel += 1

    if (needsLevel >= 3) return 'high'
    if (needsLevel >= 2) return 'moderate'
    if (needsLevel >= 1) return 'low'
    return 'minimal'
  }

  suggestSensoryStrategies(indicators) {
    const strategies = []

    if (indicators.sensoryOverload) {
      strategies.push('provide-sensory-breaks')
      strategies.push('reduce-environmental-stimuli')
    }

    if (indicators.sensoryAvoidance) {
      strategies.push('gradual-exposure')
      strategies.push('choice-in-sensory-activities')
    }

    if (indicators.sensorySeeking) {
      strategies.push('provide-sensory-input-opportunities')
      strategies.push('structured-movement-breaks')
    }

    return strategies
  }

  suggestCommunicationStrategies(indicators) {
    const strategies = []

    if (indicators.verbalChallenges) {
      strategies.push('visual-communication-supports')
      strategies.push('simplified-language')
    }

    if (indicators.socialCommunication) {
      strategies.push('social-scripts')
      strategies.push('conversation-starters')
    }

    return strategies
  }

  identifyExecutiveNeeds(indicators) {
    const needs = []

    if (indicators.planningDifficulties) needs.push('task-breakdown')
    if (indicators.organizationChallenges) needs.push('visual-organizers')
    if (indicators.memorySupport) needs.push('memory-aids')
    if (indicators.flexibilityNeeds) needs.push('transition-supports')

    return needs
  }

  suggestExecutiveStrategies(indicators) {
    const strategies = []

    if (indicators.planningDifficulties) {
      strategies.push('step-by-step-instructions')
      strategies.push('visual-schedules')
    }

    if (indicators.organizationChallenges) {
      strategies.push('color-coding-systems')
      strategies.push('structured-environments')
    }

    return strategies
  }

  identifyBehavioralTriggers(indicators) {
    const triggers = []

    if (indicators.sensoryOverload) triggers.push('sensory-overload')
    if (indicators.changeResistance) triggers.push('unexpected-changes')
    if (indicators.socialAnxiety) triggers.push('social-demands')
    if (indicators.taskFrustration) triggers.push('task-difficulty')

    return triggers
  }

  suggestBehavioralStrategies(indicators) {
    const strategies = []

    if (indicators.selfRegulationNeeds) {
      strategies.push('breathing-techniques')
      strategies.push('calming-tools')
    }

    if (indicators.emotionalRegulation) {
      strategies.push('emotion-identification')
      strategies.push('coping-strategies')
    }

    return strategies
  }

  // Métodos auxiliares de sanitização
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return ''

    let sanitized = input.trim()
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
    }

    // Remove caracteres perigosos
    sanitized = sanitized.replace(/[<>]/g, '')

    return sanitized
  }

  sanitizeNumericInput(input, min = 0, max = 100) {
    const num = parseFloat(input)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }
}

// ============== DEFINIÇÕES DE DEPENDÊNCIAS MOCK ==============

// Mock para authService se não estiver disponível
if (typeof authService === 'undefined') {
  window.authService = {
    getCurrentUser: () => ({ id: 'anonymous', name: 'Anonymous User' }),
    isAuthenticated: () => false,
    getToken: () => null,
  }
}

// Mock para authenticatedFetch se não estiver disponível
if (typeof authenticatedFetch === 'undefined') {
  window.authenticatedFetch = async (url, options = {}) => {
    // Simular requisição autenticada
    const token = window.authService?.getToken?.()
    const headers = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    return fetch(url, { ...options, headers })
  }
}

// Mock para CONFIG se não estiver disponível
if (typeof CONFIG === 'undefined') {
  window.CONFIG = {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    environment: process.env.NODE_ENV || 'development',
  }
}

// Mock para API_CONFIG se não estiver disponível
if (typeof API_CONFIG === 'undefined') {
  window.API_CONFIG = {
    ENDPOINTS: {
      users: '/users',
      sessions: '/sessions',
      games: '/games',
      analytics: '/analytics',
    },
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
}

// Mock para LZString se não estiver disponível
if (typeof LZString === 'undefined') {
  window.LZString = {
    compress: (str) => str,
    decompress: (str) => str,
    compressToUTF16: (str) => str,
    decompressFromUTF16: (str) => str,
  }
}

// Mock para logger se não estiver disponível
if (typeof logger === 'undefined') {
  window.logger = {
    info: (message, data) => console.log('INFO:', message, data),
    warn: (message, data) => console.warn('WARN:', message, data),
    error: (message, data) => console.error('ERROR:', message, data),
    debug: (message, data) => console.debug('DEBUG:', message, data),
  }
}

// Classes auxiliares se não estiverem disponíveis
if (typeof CircuitBreaker === 'undefined') {
  class CircuitBreaker {
    constructor(threshold, timeout, cooldown) {
      this.threshold = threshold
      this.timeout = timeout
      this.cooldown = cooldown
      this.failures = 0
      this.state = 'CLOSED'
      this.nextAttempt = Date.now()
    }

    async execute(fn) {
      if (this.state === 'OPEN') {
        if (Date.now() < this.nextAttempt) {
          throw new Error('Circuit breaker is OPEN')
        }
        this.state = 'HALF_OPEN'
      }

      try {
        const result = await fn()
        this.onSuccess()
        return result
      } catch (error) {
        this.onFailure()
        throw error
      }
    }

    onSuccess() {
      this.failures = 0
      this.state = 'CLOSED'
    }

    onFailure() {
      this.failures++
      if (this.failures >= this.threshold) {
        this.state = 'OPEN'
        this.nextAttempt = Date.now() + this.cooldown
      }
    }

    getState() {
      return this.state
    }
  }
  window.CircuitBreaker = CircuitBreaker
}

if (typeof IntelligentCache === 'undefined') {
  class IntelligentCache {
    constructor(defaultTTL = 300000) {
      this.cache = new Map()
      this.ttls = new Map()
      this.defaultTTL = defaultTTL
    }

    set(key, value, ttl = this.defaultTTL) {
      this.cache.set(key, { value, timestamp: Date.now() })
      this.ttls.set(key, ttl)
    }

    get(key) {
      const item = this.cache.get(key)
      if (!item) return null

      const ttl = this.ttls.get(key) || this.defaultTTL
      if (Date.now() - item.timestamp > ttl) {
        this.cache.delete(key)
        this.ttls.delete(key)
        return null
      }

      return item.value
    }

    invalidate(key) {
      this.cache.delete(key)
      this.ttls.delete(key)
    }

    clear() {
      this.cache.clear()
      this.ttls.clear()
    }
  }
  window.IntelligentCache = IntelligentCache
}

if (typeof ConnectionStrategy === 'undefined') {
  class ConnectionStrategy {
    getStorageKey(key) {
      return `portal_betina_${key}`
    }

    shouldUseCache() {
      return !navigator.onLine
    }

    getRetryDelay(attempt) {
      return Math.min(1000 * Math.pow(2, attempt), 10000)
    }
  }
  window.ConnectionStrategy = ConnectionStrategy
}

// Export da classe principal
export default DatabaseService
