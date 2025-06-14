import { CONFIG, API_CONFIG, logger } from '../../config/api-config.js'
import databaseService from '../../database/core/DatabaseService.js'
// Remover import circular do SystemOrchestrator - será injetado via método

export class MultisensoryMetricsService {
  constructor() {
    this.batchSize = 50
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    this.pendingBatches = new Map()
    this.orchestratorRef = null // Inicializar SystemOrchestrator
    this.initializeOrchestrator()

    // Only add event listeners if running in browser
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.processPendingBatches()
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
      })
    }
  }
  // 🎯 INTEGRAÇÃO COM SYSTEM ORCHESTRATOR
  async initializeOrchestrator() {
    try {
      // SystemOrchestrator será injetado pelo próprio orchestrator para evitar dependência circular
      logger.info('🎯 MultisensoryMetricsService aguardando integração com SystemOrchestrator')
    } catch (error) {
      logger.error('Erro ao integrar SystemOrchestrator:', error)
    }
  }

  // Método para injetar o SystemOrchestrator (chamado pelo próprio orchestrator)
  setOrchestrator(orchestrator) {
    this.orchestratorRef = orchestrator
    logger.info('🎯 SystemOrchestrator integrado com MultisensoryMetricsService')
  }

  // Método para processar dados sensoriais via SystemOrchestrator
  async processSensorData(sessionId, sensorData) {
    if (!this.orchestratorRef) {
      logger.warn('SystemOrchestrator não inicializado em MultisensoryMetricsService')
      return
    }

    try {
      await this.orchestratorRef.processSensorialMetrics(sessionId, sensorData)
      logger.debug('Dados sensoriais processados via SystemOrchestrator', {
        sessionId,
        type: sensorData.type,
      })
    } catch (error) {
      logger.error('Erro ao processar dados sensoriais via SystemOrchestrator:', error)
    }
  }

  async saveFinalReport(finalReport, sessionId, userId) {
    try {
      logger.info('💾 Iniciando salvamento de métricas multissensoriais...')

      const savePromises = []

      if (finalReport.sessionMetrics?.motionSensorData?.length > 0) {
        savePromises.push(
          this.saveMobileSensorData(finalReport.sessionMetrics.motionSensorData, sessionId, userId)
        )
      }

      if (finalReport.sessionMetrics?.geolocationData?.length > 0) {
        savePromises.push(
          this.saveGeolocationData(finalReport.sessionMetrics.geolocationData, sessionId, userId)
        )
      }

      if (finalReport.sessionMetrics?.neurodivergenceMetrics) {
        savePromises.push(
          this.saveNeurodivergenceMetrics(
            finalReport.sessionMetrics.neurodivergenceMetrics,
            sessionId,
            userId
          )
        )
      }

      if (finalReport.sessionMetrics?.accessibilityMetrics) {
        savePromises.push(
          this.saveAccessibilityMetrics(
            finalReport.sessionMetrics.accessibilityMetrics,
            sessionId,
            userId
          )
        )
      }

      if (finalReport.sessionMetrics?.multisensoryInteractions?.length > 0) {
        savePromises.push(
          this.saveMultisensoryInteractions(
            finalReport.sessionMetrics.multisensoryInteractions,
            sessionId,
            userId
          )
        )
      }

      const results = await Promise.allSettled(savePromises)

      const successful = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.filter((r) => r.status === 'rejected').length

      logger.info(`✅ Métricas multissensoriais salvas: ${successful} sucessos, ${failed} falhas`)

      if (failed > 0) {
        logger.error(
          '⚠️ Algumas métricas falharam ao salvar:',
          results.filter((r) => r.status === 'rejected')
        )
      }

      return { successful, failed }
    } catch (error) {
      logger.error('❌ Erro ao salvar relatório final de métricas multissensoriais:', error)

      if (!this.isOnline) {
        this.storePendingBatch('finalReport', { finalReport, sessionId, userId })
      }

      throw error
    }
  }
  async saveMobileSensorData(sensorData, sessionId, userId) {
    try {
      const batches = this.createBatches(sensorData, this.batchSize)

      for (const batch of batches) {
        const formattedData = batch.map((sensor) => ({
          session_id: sessionId,
          user_id: userId,
          timestamp: sensor.timestamp,
          device_info: JSON.stringify(sensor.deviceInfo || {}),
          accelerometer_x: sensor.acceleration?.x || null,
          accelerometer_y: sensor.acceleration?.y || null,
          accelerometer_z: sensor.acceleration?.z || null,
          acceleration_magnitude: this.calculateMagnitude(sensor.acceleration),

          gyroscope_x: sensor.rotationRate?.alpha || null,
          gyroscope_y: sensor.rotationRate?.beta || null,
          gyroscope_z: sensor.rotationRate?.gamma || null,
          rotation_rate: this.calculateMagnitude(sensor.rotationRate),

          orientation_alpha: sensor.orientation?.alpha || null,
          orientation_beta: sensor.orientation?.beta || null,
          orientation_gamma: sensor.orientation?.gamma || null,
          orientation_absolute: sensor.orientation?.absolute || false,

          movement_intensity: sensor.movementIntensity || 0,
          stability_score: sensor.stabilityScore || 0,
          interaction_type: sensor.interactionType || null,

          activity_phase: sensor.activityPhase || null,
          current_task: sensor.currentTask || null,
          difficulty_level: sensor.difficultyLevel || null,
        }))

        await this.batchInsert('mobile_sensor_data', formattedData)
      }

      logger.info(`📱 Salvados ${sensorData.length} registros de sensores móveis`)
    } catch (error) {
      logger.error('❌ Erro ao salvar dados de sensores móveis:', error)
      if (!this.isOnline) {
        this.storePendingBatch('mobileSensor', { sensorData, sessionId, userId })
      }
      throw error
    }
  }
  async saveGeolocationData(geoData, sessionId, userId) {
    try {
      const formattedData = geoData.map((geo, index) => ({
        session_id: sessionId,
        user_id: userId,
        timestamp: geo.timestamp,
        sample_number: index,

        latitude: this.applyPrivacyFilter(geo.coords?.latitude),
        longitude: this.applyPrivacyFilter(geo.coords?.longitude),
        altitude: geo.coords?.altitude || null,
        accuracy: geo.coords?.accuracy || null,
        altitude_accuracy: geo.coords?.altitudeAccuracy || null,
        heading: geo.coords?.heading || null,
        speed: geo.coords?.speed || null,

        movement_pattern: geo.movementPattern || 'unknown',
        distance_from_start: geo.distanceFromStart || 0,
        total_distance_moved: geo.totalDistanceMoved || 0,
        average_speed: geo.averageSpeed || 0,

        indoor_probability: geo.indoorProbability || 0,
        session_phase: geo.sessionPhase || null,
        activity_context: geo.activityContext || null,

        is_approximate: true,
        privacy_level: 3,
      }))

      await this.batchInsert('geolocation_data', formattedData)
      logger.info(`🗺️ Salvados ${geoData.length} registros de geolocalização`)
    } catch (error) {
      logger.error('❌ Erro ao salvar dados de geolocalização:', error)
      if (!this.isOnline) {
        this.storePendingBatch('geolocation', { geoData, sessionId, userId })
      }
      throw error
    }
  }
  async saveNeurodivergenceMetrics(neuroMetrics, sessionId, userId) {
    try {
      const allMetrics = []

      const metricTypes = [
        'repetitivePatterns',
        'stimulationSeeking',
        'sensoryOverload',
        'attentionShifts',
        'hyperfocusEpisodes',
        'avoidanceBehaviors',
        'selfRegulationAttempts',
        'adaptationStrategies',
        'stimming',
        'executiveFunctionChallenges',
        'socialCommunicationPatterns',
        'rigidityFlexibilityBalance',
      ]

      for (const metricType of metricTypes) {
        if (neuroMetrics[metricType] && neuroMetrics[metricType].length > 0) {
          const formattedMetrics = neuroMetrics[metricType].map((metric) => ({
            session_id: sessionId,
            user_id: userId,
            timestamp: metric.timestamp,
            metric_type: metricType.replace(/([A-Z])/g, '_$1').toLowerCase(),

            behavior_intensity: metric.intensity || 0,
            behavior_duration: metric.duration || 0,
            behavior_frequency: metric.frequency || 1,

            trigger_context: JSON.stringify(metric.context || {}),
            response_pattern: JSON.stringify(metric.responsePattern || {}),
            adaptation_strategy: JSON.stringify(metric.adaptationStrategy || {}),

            ...this.extractSpecificNeurodivergenceData(metricType, metric),

            pattern_confidence: metric.confidence || 0,
            recommendation_generated: !!metric.recommendation,
            accommodation_suggested: JSON.stringify(metric.accommodation || {}),
          }))

          allMetrics.push(...formattedMetrics)
        }
      }

      if (allMetrics.length > 0) {
        const batches = this.createBatches(allMetrics, this.batchSize)
        for (const batch of batches) {
          await this.batchInsert('neurodivergence_metrics', batch)
        }
        logger.info(`🧠 Salvadas ${allMetrics.length} métricas de neurodivergência`)
      }
    } catch (error) {
      logger.error('❌ Erro ao salvar métricas de neurodivergência:', error)
      if (!this.isOnline) {
        this.storePendingBatch('neurodivergence', { neuroMetrics, sessionId, userId })
      }
      throw error
    }
  }
  async saveAccessibilityMetrics(accessibilityMetrics, sessionId, userId) {
    try {
      const allMetrics = []

      const categories = [
        'assistiveTechnologyUsage',
        'accommodationEffectiveness',
        'customizationPreferences',
        'adaptiveInterfaceChanges',
        'difficultyAdjustmentResponses',
        'supportToolUsage',
        'breakFrequency',
        'fatigueMitigation',
      ]

      for (const category of categories) {
        if (accessibilityMetrics[category] && accessibilityMetrics[category].length > 0) {
          const formattedMetrics = accessibilityMetrics[category].map((metric) => ({
            session_id: sessionId,
            user_id: userId,
            timestamp: metric.timestamp,
            metric_category: category.replace(/([A-Z])/g, '_$1').toLowerCase(),

            ...this.extractSpecificAccessibilityData(category, metric),
          }))

          allMetrics.push(...formattedMetrics)
        }
      }

      if (allMetrics.length > 0) {
        const batches = this.createBatches(allMetrics, this.batchSize)
        for (const batch of batches) {
          await this.batchInsert('accessibility_metrics', batch)
        }
        logger.info(`♿ Salvadas ${allMetrics.length} métricas de acessibilidade`)
      }
    } catch (error) {
      logger.error('❌ Erro ao salvar métricas de acessibilidade:', error)
      if (!this.isOnline) {
        this.storePendingBatch('accessibility', { accessibilityMetrics, sessionId, userId })
      }
      throw error
    }
  }
  async saveMultisensoryInteractions(interactions, sessionId, userId) {
    try {
      const formattedData = interactions.map((interaction) => ({
        session_id: sessionId,
        user_id: userId,
        timestamp: interaction.timestamp,
        interaction_id:
          interaction.interactionId ||
          `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

        visual_component: !!interaction.visualComponent,
        auditory_component: !!interaction.auditoryComponent,
        tactile_component: !!interaction.tactileComponent,
        motor_component: !!interaction.motorComponent,

        visual_element_type: interaction.visualElementType || null,
        visual_position: JSON.stringify(interaction.visualPosition || {}),
        visual_response_time: interaction.visualResponseTime || null,
        visual_accuracy: interaction.visualAccuracy || null,
        eye_movement_pattern: interaction.eyeMovementPattern || null,

        audio_type: interaction.audioType || null,
        audio_response_time: interaction.audioResponseTime || null,
        audio_comprehension: interaction.audioComprehension || null,
        volume_preference: interaction.volumePreference || null,

        touch_type: interaction.touchType || null,
        touch_pressure: interaction.touchPressure || null,
        touch_duration: interaction.touchDuration || null,
        touch_accuracy: interaction.touchAccuracy || null,
        gesture_complexity: interaction.gestureComplexity || null,

        modality_combination: interaction.modalityCombination || null,
        integration_success: interaction.integrationSuccess || 0,
        processing_efficiency: interaction.processingEfficiency || 0,
        cognitive_load: interaction.cognitiveLoad || 0,

        task_type: interaction.taskType || null,
        task_difficulty: interaction.taskDifficulty || null,
        task_phase: interaction.taskPhase || null,
        expected_modality: interaction.expectedModality || null,

        interaction_success: !!interaction.success,
        error_type: interaction.errorType || null,
        correction_attempts: interaction.correctionAttempts || 0,
        help_requested: !!interaction.helpRequested,

        engagement_level: interaction.engagementLevel || 0,
        frustration_indicators: JSON.stringify(interaction.frustrationIndicators || {}),
        motivation_level: interaction.motivationLevel || 0,
        confidence_level: interaction.confidenceLevel || 0,
      }))

      const batches = this.createBatches(formattedData, this.batchSize)
      for (const batch of batches) {
        await this.batchInsert('multisensory_interactions', batch)
      }

      logger.info(`🔄 Salvadas ${interactions.length} interações multissensoriais`)
    } catch (error) {
      logger.error('❌ Erro ao salvar interações multissensoriais:', error)
      if (!this.isOnline) {
        this.storePendingBatch('multisensoryInteractions', { interactions, sessionId, userId })
      }
      throw error
    }
  }
  calculateMagnitude(vector) {
    if (!vector || typeof vector !== 'object') return null
    const { x = 0, y = 0, z = 0 } = vector
    return Math.sqrt(x * x + y * y + z * z)
  }
  applyPrivacyFilter(coordinate) {
    if (coordinate == null) return null
    return Math.round(coordinate * 1000) / 1000
  }

  createBatches(data, batchSize) {
    const batches = []
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize))
    }
    return batches
  }

  extractSpecificNeurodivergenceData(metricType, metric) {
    const specificData = {}

    switch (metricType) {
      case 'repetitivePatterns':
        specificData.repetition_count = metric.count || null
        specificData.repetition_interval = metric.interval || null
        break
      case 'stimulationSeeking':
        specificData.stimulation_type = metric.stimulationType || null
        specificData.stimulation_intensity = metric.stimulationIntensity || null
        break
      case 'sensoryOverload':
        specificData.overload_indicators = JSON.stringify(metric.indicators || {})
        specificData.recovery_time = metric.recoveryTime || null
        break
      case 'attentionShifts':
        specificData.attention_shift_reason = metric.reason || null
        specificData.focus_duration = metric.focusDuration || null
        specificData.distraction_source = metric.distractionSource || null
        break
      case 'hyperfocusEpisodes':
        specificData.hyperfocus_duration = metric.duration || null
        specificData.hyperfocus_intensity = metric.intensity || null
        specificData.task_engagement_level = metric.taskEngagement || null
        break
      case 'stimming':
        specificData.stimming_type = metric.stimmingType || null
        specificData.stimming_trigger = metric.trigger || null
        specificData.stimming_effect = metric.effect || null
        break
    }

    return specificData
  }

  extractSpecificAccessibilityData(category, metric) {
    const specificData = {}

    switch (category) {
      case 'assistiveTechnologyUsage':
        specificData.assistive_tech_type = metric.techType || null
        specificData.usage_duration = metric.duration || null
        specificData.usage_effectiveness = metric.effectiveness || null
        specificData.errors_encountered = metric.errors || 0
        break
      case 'accommodationEffectiveness':
        specificData.accommodation_type = metric.accommodationType || null
        specificData.accommodation_setting = JSON.stringify(metric.setting || {})
        specificData.user_satisfaction = metric.satisfaction || null
        specificData.task_completion_improvement = metric.improvement || null
        break
      case 'supportToolUsage':
        specificData.support_tool_type = metric.toolType || null
        specificData.tool_usage_frequency = metric.frequency || null
        specificData.tool_effectiveness = metric.effectiveness || null
        break
    }

    return specificData
  }
  async batchInsert(tableName, data) {
    try {
      if (!this.isOnline) {
        throw new Error('Offline - dados serão processados quando conexão for restaurada')
      }

      const insertPromises = data.map((row) =>
        databaseService.query(
          `INSERT INTO ${tableName} (${Object.keys(row).join(', ')}) VALUES (${Object.keys(row)
            .map((_, i) => `$${i + 1}`)
            .join(', ')})`,
          Object.values(row)
        )
      )

      await Promise.all(insertPromises)
    } catch (error) {
      logger.error(`❌ Erro na inserção em lote para ${tableName}:`, error)
      throw error
    }
  }
  storePendingBatch(type, data) {
    const batchId = `${type}_${Date.now()}`
    this.pendingBatches.set(batchId, {
      type,
      data,
      timestamp: Date.now(),
    })

    logger.info(`💾 Lote armazenado para processamento offline: ${batchId}`)
  }
  async processPendingBatches() {
    if (this.pendingBatches.size === 0) return

    logger.info(`🔄 Processando ${this.pendingBatches.size} lotes pendentes...`)

    for (const [batchId, batch] of this.pendingBatches) {
      try {
        const { type, data } = batch

        switch (type) {
          case 'finalReport':
            await this.saveFinalReport(data.finalReport, data.sessionId, data.userId)
            break
          case 'mobileSensor':
            await this.saveMobileSensorData(data.sensorData, data.sessionId, data.userId)
            break
          case 'geolocation':
            await this.saveGeolocationData(data.geoData, data.sessionId, data.userId)
            break
          case 'neurodivergence':
            await this.saveNeurodivergenceMetrics(data.neuroMetrics, data.sessionId, data.userId)
            break
          case 'accessibility':
            await this.saveAccessibilityMetrics(
              data.accessibilityMetrics,
              data.sessionId,
              data.userId
            )
            break
          case 'multisensoryInteractions':
            await this.saveMultisensoryInteractions(data.interactions, data.sessionId, data.userId)
            break
        }

        this.pendingBatches.delete(batchId)
        logger.info(`✅ Lote processado: ${batchId}`)
      } catch (error) {
        logger.error(`❌ Erro ao processar lote ${batchId}:`, error)
      }
    }
  }
  async getSessionAnalysis(sessionId) {
    try {
      const query = `
        SELECT * FROM multisensory_session_analysis 
        WHERE session_id = $1
      `

      const result = await databaseService.query(query, [sessionId])
      return result.rows[0] || null
    } catch (error) {
      logger.error('❌ Erro ao obter análise de sessão:', error)
      return null
    }
  }
  async getUserSensoryPatterns(userId) {
    try {
      const query = `
        SELECT * FROM user_sensory_patterns 
        WHERE user_id = $1
      `

      const result = await databaseService.query(query, [userId])
      return result.rows[0] || null
    } catch (error) {
      logger.error('❌ Erro ao obter padrões sensoriais:', error)
      return null
    }
  }

  async getMultisensoryIntegrationScore(userId, timeframeDays = 30) {
    try {
      const query = `
        SELECT calculate_multisensory_integration_score($1, $2) as score
      `

      const result = await databaseService.query(query, [userId, timeframeDays])
      return result.rows[0]?.score || 0
    } catch (error) {
      logger.error('❌ Erro ao calcular score de integração:', error)
      return 0
    }
  }
  async getDominantNeurodivergencePatterns(userId, limit = 3) {
    try {
      const query = `
        SELECT * FROM identify_dominant_neurodivergence_patterns($1, $2)
      `

      const result = await databaseService.query(query, [userId, limit])
      return result.rows || []
    } catch (error) {
      logger.error('❌ Erro ao identificar padrões de neurodivergência:', error)
      return []
    }
  }
}

const multisensoryMetricsService = new MultisensoryMetricsService()

export default multisensoryMetricsService
