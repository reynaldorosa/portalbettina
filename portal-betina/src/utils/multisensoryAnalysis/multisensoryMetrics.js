// Sistema Avançado de Métricas Multissensoriais
// Coleta e análise de dados detalhados sobre interações sensoriais e cognitivas

export class MultisensoryMetricsCollector {
  constructor() {
    this.sessionMetrics = {
      sessionId: null,
      userId: null,
      startTime: null,
      endTime: null,
      totalDuration: 0,

      // Métricas visuais
      visualInteractions: [],
      visualProcessingTimes: [],
      visualErrors: [],
      visualDiscriminationAccuracy: 0,
      eyeMovementPatterns: [],
      visualAttentionSpan: 0,

      // Métricas auditivas
      auditoryInteractions: [],
      ttsUsageEvents: [],
      soundResponseTimes: [],
      auditoryMemoryRetention: [],
      voiceRecognitionAccuracy: 0,
      auditoryProcessingDelay: 0,

      // Métricas táteis/cinestésicas
      touchInteractions: [],
      gesturePatterns: [],
      motionSensorData: [],
      hapticFeedbackResponses: [],
      fingerTrackingData: [],

      // Métricas cognitivas
      decisionMakingPatterns: [],
      problemSolvingApproaches: [],
      memoryRecallEvents: [],
      attentionFocusPoints: [],
      executiveFunctionIndicators: [],

      // Métricas comportamentais
      frustrationIndicators: [],
      engagementLevels: [],
      motivationSignals: [],
      fatigueSigns: [],
      socialInteractionPreferences: [],

      // Métricas adaptativas
      difficultyAdjustments: [],
      learningStyleIndicators: [],
      personalizationEffectiveness: [],
      accommodationUsage: [],

      // Métricas temporais
      responseTimeVariability: [],
      taskSwitchingAbility: [],
      sustainedAttentionDuration: 0,
      processingSpeedConsistency: [],
      // Métricas de erro e recuperação
      errorPatterns: [],
      errorRecoveryStrategies: [],
      helpSeekingBehaviors: [],
      selfCorrectionAttempts: [],

      // NOVAS MÉTRICAS ESPECÍFICAS PARA DISPOSITIVOS MÓVEIS

      // Dados de contexto da sessão
      sessionContext: {
        date: null,
        time: null,
        timezone: null,
        location: {
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp: null,
          city: null,
          country: null,
        },
        device: {
          type: null, // 'tablet' | 'phone'
          orientation: null, // 'portrait' | 'landscape'
          screenWidth: null,
          screenHeight: null,
          pixelDensity: null,
          touchSupport: null,
          platform: null,
          userAgent: null,
          model: null,
          operatingSystem: null,
          browser: null,
        },
        environment: {
          networkType: null,
          connectionSpeed: null,
          batteryLevel: null,
          brightness: null,
          isCharging: null,
          memoryUsage: null,
          availableStorage: null,
        },
      },

      // Métricas de toque detalhadas (foco principal para mobile)
      touchMetrics: {
        touchEvents: [], // Todos os eventos de toque com detalhes completos
        pressureMeasurements: [], // Medições de pressão do toque (0-1)
        touchDuration: [], // Duração de cada toque em ms
        touchCoordinates: [], // Coordenadas precisas de cada toque (x, y)
        fingerTracking: [], // Rastreamento de dedos individuais
        gestureComplexity: [], // Complexidade dos gestos (0-100)
        multiTouchPatterns: [], // Padrões de multi-toque
        touchVelocity: [], // Velocidade de movimento dos toques (px/ms)
        touchAcceleration: [], // Aceleração dos movimentos
        touchFrequency: 0, // Frequência de toques por minuto
        averagePressure: 0, // Pressão média aplicada
        touchPrecision: [], // Precisão dos toques em relação aos alvos
        swipePatterns: [], // Padrões de deslizamento
        tapConsistency: [], // Consistência dos toques
        doubleTapAccuracy: [], // Precisão de duplo toque
        longPressEvents: [], // Eventos de pressão longa
        pinchZoomGestures: [], // Gestos de pinça para zoom
        rotationGestures: [], // Gestos de rotação
      },

      // Dados de sensores móveis
      sensorData: {
        accelerometer: [], // Dados do acelerômetro (x, y, z)
        gyroscope: [], // Dados do giroscópio (alpha, beta, gamma)
        orientation: [], // Mudanças de orientação do dispositivo
        deviceMotion: [], // Movimentos gerais do dispositivo
        proximityEvents: [], // Eventos de proximidade
        ambientLight: [], // Medições de luz ambiente
        magnetometer: [], // Dados do magnetômetro
        gravity: [], // Dados de gravidade
        linearAcceleration: [], // Aceleração linear
      },

      // Métricas temporais específicas
      temporalMetrics: {
        timeOfDay: null,
        sessionStartTime: null,
        sessionEndTime: null,
        timeSpentPerActivity: {},
        pauseEvents: [],
        focusLossEvents: [],
        returnToFocusEvents: [],
        breakPatterns: [],
        optimalPerformanceTimeWindows: [],
        taskCompletionTimes: [],
        timeOnTask: [],
        procrastinationIndicators: [],
        rushingBehaviors: [],
      },

      // Geolocalização e contexto espacial
      locationData: {
        gpsCoordinates: [],
        locationHistory: [],
        movementPatterns: [],
        stationaryPeriods: [],
        locationAccuracy: [],
        indoorOutdoorDetection: [],
        environmentalContext: [],
        proximityToDistractions: [],
        preferredWorkingLocations: [],
      },

      // Métricas comportamentais específicas para neurodivergência
      neurodivergenceMetrics: {
        repetitivePatterns: [],
        stimulationSeeking: [],
        sensoryOverload: [],
        attentionShifts: [],
        hyperfocusEpisodes: [],
        sensoryPreferences: {},
        avoidanceBehaviors: [],
        selfRegulationAttempts: [],
        adaptationStrategies: [],
        stimming: [],
        executiveFunctionChallenges: [],
        socialCommunicationPatterns: [],
        rigidityFlexibilityBalance: [],
      },

      // Métricas de acessibilidade e adaptação
      accessibilityMetrics: {
        assistiveTechnologyUsage: [],
        accommodationEffectiveness: [],
        customizationPreferences: {},
        adaptiveInterfaceChanges: [],
        difficultyAdjustmentResponses: [],
        supportToolUsage: [],
        breakFrequency: [],
        fatigueMitigation: [],
      },
    }

    this.realTimeAnalysis = {
      currentEngagement: 0,
      currentFrustration: 0,
      currentCognitiveLload: 0,
      adaptiveRecommendations: [],
    }

    this.dataCollectionActive = false
    this.samplingInterval = null
    this.lastInteractionTime = null
  }
  // Iniciar coleta de métricas para uma nova sessão
  startMetricsCollection(sessionId, userId) {
    this.sessionMetrics.sessionId = sessionId
    this.sessionMetrics.userId = userId
    this.sessionMetrics.startTime = Date.now()
    this.dataCollectionActive = true
    this.lastInteractionTime = Date.now()

    // Coletar dados de contexto inicial
    this.collectSessionContext()

    // Inicializar sensores móveis
    this.initializeMobileSensors()

    // Iniciar coleta de geolocalização
    this.startLocationTracking()

    // Iniciar coleta em tempo real
    this.startRealTimeMonitoring()

    console.log(
      `📊 Iniciando coleta de métricas multissensoriais para mobile - Sessão: ${sessionId}`
    )
  }

  // NOVOS MÉTODOS ESPECÍFICOS PARA DISPOSITIVOS MÓVEIS

  // Coletar dados de contexto da sessão
  collectSessionContext() {
    const now = new Date()

    // Dados temporais
    this.sessionMetrics.sessionContext.date = now.toISOString().split('T')[0]
    this.sessionMetrics.sessionContext.time = now.toTimeString().split(' ')[0]
    this.sessionMetrics.sessionContext.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Dados do dispositivo
    this.sessionMetrics.sessionContext.device = {
      type: this.detectDeviceType(),
      orientation: this.getScreenOrientation(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelDensity: window.devicePixelRatio,
      touchSupport: 'ontouchstart' in window,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      model: this.getDeviceModel(),
      operatingSystem: this.getOperatingSystem(),
      browser: this.getBrowserInfo(),
    }

    // Dados do ambiente
    this.sessionMetrics.sessionContext.environment = {
      networkType: this.getNetworkType(),
      connectionSpeed: this.getConnectionSpeed(),
      batteryLevel: this.getBatteryLevel(),
      brightness: this.getScreenBrightness(),
      isCharging: this.getChargingStatus(),
      memoryUsage: this.getMemoryUsage(),
      availableStorage: this.getAvailableStorage(),
    }
  }

  // Inicializar sensores móveis
  initializeMobileSensors() {
    if (!this.dataCollectionActive) return

    // Acelerômetro e Giroscópio
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (event) => {
        this.recordSensorData('accelerometer', {
          timestamp: Date.now(),
          x: event.acceleration?.x || 0,
          y: event.acceleration?.y || 0,
          z: event.acceleration?.z || 0,
          interval: event.interval,
        })

        this.recordSensorData('gyroscope', {
          timestamp: Date.now(),
          alpha: event.rotationRate?.alpha || 0,
          beta: event.rotationRate?.beta || 0,
          gamma: event.rotationRate?.gamma || 0,
        })
      })
    }

    // Orientação do dispositivo
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (event) => {
        this.recordSensorData('orientation', {
          timestamp: Date.now(),
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
          absolute: event.absolute,
        })
      })
    }

    // Mudanças de orientação da tela
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.sessionMetrics.sessionContext.device.orientation = this.getScreenOrientation()
        this.sessionMetrics.sessionContext.device.screenWidth = window.screen.width
        this.sessionMetrics.sessionContext.device.screenHeight = window.screen.height
      }, 100)
    })
  }

  // Registrar evento de toque detalhado
  recordDetailedTouchEvent(event) {
    if (!this.dataCollectionActive) return

    const touchEvent = {
      timestamp: Date.now(),
      type: event.type, // 'touchstart', 'touchmove', 'touchend'
      touches: Array.from(event.touches || []).map((touch) => ({
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        screenX: touch.screenX,
        screenY: touch.screenY,
        radiusX: touch.radiusX || 0,
        radiusY: touch.radiusY || 0,
        rotationAngle: touch.rotationAngle || 0,
        force: touch.force || 0,
      })),
      changedTouches: Array.from(event.changedTouches || []).map((touch) => ({
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force || 0,
      })),
      targetElement: event.target?.tagName || 'unknown',
      elementId: event.target?.id || null,
      elementClass: event.target?.className || null,
    }

    this.sessionMetrics.touchMetrics.touchEvents.push(touchEvent)

    // Calcular métricas específicas de toque
    if (event.type === 'touchstart') {
      this.recordTouchStart(touchEvent)
    } else if (event.type === 'touchend') {
      this.recordTouchEnd(touchEvent)
    } else if (event.type === 'touchmove') {
      this.recordTouchMove(touchEvent)
    }
  }

  // Registrar início de toque
  recordTouchStart(touchEvent) {
    touchEvent.touches.forEach((touch) => {
      this.sessionMetrics.touchMetrics.pressureMeasurements.push({
        timestamp: touchEvent.timestamp,
        touchId: touch.identifier,
        pressure: touch.force,
        startTime: touchEvent.timestamp,
      })

      this.sessionMetrics.touchMetrics.touchCoordinates.push({
        timestamp: touchEvent.timestamp,
        touchId: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        type: 'start',
      })
    })
  }

  // Registrar fim de toque
  recordTouchEnd(touchEvent) {
    touchEvent.changedTouches.forEach((touch) => {
      const startEvent = this.findTouchStart(touch.identifier)
      if (startEvent) {
        const duration = touchEvent.timestamp - startEvent.timestamp
        this.sessionMetrics.touchMetrics.touchDuration.push({
          touchId: touch.identifier,
          duration,
          startTime: startEvent.timestamp,
          endTime: touchEvent.timestamp,
        })
      }

      this.sessionMetrics.touchMetrics.touchCoordinates.push({
        timestamp: touchEvent.timestamp,
        touchId: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        type: 'end',
      })
    })
  }

  // Registrar movimento de toque
  recordTouchMove(touchEvent) {
    touchEvent.touches.forEach((touch) => {
      const previousPosition = this.getPreviousTouchPosition(touch.identifier)

      if (previousPosition) {
        const deltaX = touch.clientX - previousPosition.x
        const deltaY = touch.clientY - previousPosition.y
        const deltaTime = touchEvent.timestamp - previousPosition.timestamp
        const velocity = deltaTime > 0 ? Math.sqrt(deltaX ** 2 + deltaY ** 2) / deltaTime : 0

        this.sessionMetrics.touchMetrics.touchVelocity.push({
          touchId: touch.identifier,
          velocity,
          direction: Math.atan2(deltaY, deltaX),
          timestamp: touchEvent.timestamp,
        })
      }

      this.sessionMetrics.touchMetrics.touchCoordinates.push({
        timestamp: touchEvent.timestamp,
        touchId: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        type: 'move',
      })
    })
  }

  // Iniciar rastreamento de localização
  startLocationTracking() {
    if (!navigator.geolocation || !this.dataCollectionActive) return

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }

    // Obter localização inicial
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.recordLocationData(position)
      },
      (error) => {
        console.warn('Erro ao obter localização:', error.message)
      },
      options
    )

    // Monitorar mudanças de localização
    if (navigator.geolocation.watchPosition) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          this.recordLocationData(position)
        },
        (error) => {
          console.warn('Erro no monitoramento de localização:', error.message)
        },
        options
      )
    }
  }

  // Registrar dados de localização
  recordLocationData(position) {
    if (!this.dataCollectionActive) return

    const locationData = {
      timestamp: Date.now(),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
    }

    this.sessionMetrics.locationData.gpsCoordinates.push(locationData)

    // Atualizar contexto de localização
    this.sessionMetrics.sessionContext.location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: Date.now(),
    }

    // Detectar se está em movimento ou parado
    this.detectMovementPattern(locationData)
  }

  // Registrar dados de sensores
  recordSensorData(sensorType, data) {
    if (!this.dataCollectionActive) return

    switch (sensorType) {
      case 'accelerometer':
        this.sessionMetrics.sensorData.accelerometer.push(data)
        break
      case 'gyroscope':
        this.sessionMetrics.sensorData.gyroscope.push(data)
        break
      case 'orientation':
        this.sessionMetrics.sensorData.orientation.push(data)
        break
      case 'deviceMotion':
        this.sessionMetrics.sensorData.deviceMotion.push(data)
        break
      case 'proximity':
        this.sessionMetrics.sensorData.proximityEvents.push(data)
        break
      case 'ambientLight':
        this.sessionMetrics.sensorData.ambientLight.push(data)
        break
    }
  }

  // Detectar padrões de movimento do dispositivo
  detectMovementPattern(locationData) {
    const previousLocation = this.getLastLocationData()

    if (previousLocation) {
      const distance = this.calculateDistance(
        previousLocation.latitude,
        previousLocation.longitude,
        locationData.latitude,
        locationData.longitude
      )

      const timeDiff = locationData.timestamp - previousLocation.timestamp
      const speed = distance / (timeDiff / 1000) // metros por segundo

      if (speed < 0.5) {
        // Praticamente parado
        this.sessionMetrics.locationData.stationaryPeriods.push({
          startTime: previousLocation.timestamp,
          endTime: locationData.timestamp,
          location: locationData,
          duration: timeDiff,
        })
      } else {
        this.sessionMetrics.locationData.movementPatterns.push({
          startTime: previousLocation.timestamp,
          endTime: locationData.timestamp,
          startLocation: previousLocation,
          endLocation: locationData,
          distance,
          speed,
          direction: this.calculateBearing(
            previousLocation.latitude,
            previousLocation.longitude,
            locationData.latitude,
            locationData.longitude
          ),
        })
      }
    }
  }

  // Registrar métricas específicas de neurodivergência
  recordNeurodivergenceMetric(type, data) {
    if (!this.dataCollectionActive) return

    const metric = {
      timestamp: Date.now(),
      type,
      data,
      context: this.getCurrentActivityContext(),
      intensity: data.intensity || 0,
      duration: data.duration || 0,
    }

    switch (type) {
      case 'repetitive_pattern':
        this.sessionMetrics.neurodivergenceMetrics.repetitivePatterns.push(metric)
        break
      case 'stimulation_seeking':
        this.sessionMetrics.neurodivergenceMetrics.stimulationSeeking.push(metric)
        break
      case 'sensory_overload':
        this.sessionMetrics.neurodivergenceMetrics.sensoryOverload.push(metric)
        break
      case 'attention_shift':
        this.sessionMetrics.neurodivergenceMetrics.attentionShifts.push(metric)
        break
      case 'hyperfocus':
        this.sessionMetrics.neurodivergenceMetrics.hyperfocusEpisodes.push(metric)
        break
      case 'avoidance':
        this.sessionMetrics.neurodivergenceMetrics.avoidanceBehaviors.push(metric)
        break
      case 'self_regulation':
        this.sessionMetrics.neurodivergenceMetrics.selfRegulationAttempts.push(metric)
        break
      case 'stimming':
        this.sessionMetrics.neurodivergenceMetrics.stimming.push(metric)
        break
    }
  }
  // Parar coleta de métricas
  stopMetricsCollection() {
    this.sessionMetrics.endTime = Date.now()
    this.sessionMetrics.totalDuration = this.sessionMetrics.endTime - this.sessionMetrics.startTime
    this.dataCollectionActive = false

    if (this.samplingInterval) {
      clearInterval(this.samplingInterval)
      this.samplingInterval = null
    }

    // Remove sensor listeners
    window.removeEventListener('devicemotion', this._onDeviceMotion)
    window.removeEventListener('deviceorientation', this._onDeviceOrientation)
    window.removeEventListener('orientationchange', this._onOrientationChange)

    // Stop geolocation watcher
    if (this.locationWatchId != null && navigator.geolocation.clearWatch) {
      navigator.geolocation.clearWatch(this.locationWatchId)
      this.locationWatchId = null
    }

    console.log(
      `📊 Finalizando coleta de métricas - Duração: ${this.sessionMetrics.totalDuration}ms`
    )
    return this.generateFinalReport()
  }

  // Monitoramento em tempo real
  startRealTimeMonitoring() {
    this.samplingInterval = setInterval(() => {
      if (this.dataCollectionActive) {
        this.updateRealTimeAnalysis()
        this.detectBehavioralPatterns()
        this.generateAdaptiveRecommendations()
      }
    }, 1000) // Atualizar a cada segundo
  }

  // Registrar interação visual
  recordVisualInteraction(type, elementId, responseTime, accuracy, coordinates = null) {
    if (!this.dataCollectionActive) return

    const interaction = {
      timestamp: Date.now(),
      type, // 'click', 'hover', 'focus', 'scroll'
      elementId,
      responseTime,
      accuracy,
      coordinates,
      visualContext: this.getCurrentVisualContext(),
    }

    this.sessionMetrics.visualInteractions.push(interaction)
    this.sessionMetrics.visualProcessingTimes.push(responseTime)

    if (accuracy === false) {
      this.sessionMetrics.visualErrors.push(interaction)
    }

    this.updateLastInteractionTime()
  }

  // Registrar interação auditiva
  recordAuditoryInteraction(type, audioElement, responseTime, comprehension = null) {
    if (!this.dataCollectionActive) return

    const interaction = {
      timestamp: Date.now(),
      type, // 'tts_play', 'tts_pause', 'sound_response', 'voice_input'
      audioElement,
      responseTime,
      comprehension,
      volume: this.getCurrentVolume(),
      auditoryContext: this.getCurrentAuditoryContext(),
    }

    this.sessionMetrics.auditoryInteractions.push(interaction)

    if (type === 'tts_play' || type === 'tts_pause') {
      this.sessionMetrics.ttsUsageEvents.push(interaction)
    }

    this.sessionMetrics.soundResponseTimes.push(responseTime)
    this.updateLastInteractionTime()
  }

  // Registrar interação tátil/cinestésica
  recordTactileInteraction(type, gesture, force = null, duration = null) {
    if (!this.dataCollectionActive) return

    const interaction = {
      timestamp: Date.now(),
      type, // 'touch', 'swipe', 'pinch', 'long_press', 'drag'
      gesture,
      force,
      duration,
      fingerCount: gesture.touches?.length || 1,
      tactileContext: this.getCurrentTactileContext(),
    }

    this.sessionMetrics.touchInteractions.push(interaction)
    this.sessionMetrics.gesturePatterns.push({
      type: gesture.type || type,
      complexity: this.calculateGestureComplexity(gesture),
      precision: this.calculateGesturePrecision(gesture),
    })

    this.updateLastInteractionTime()
  }

  // Registrar padrão cognitivo
  recordCognitiveEvent(type, context, performance) {
    if (!this.dataCollectionActive) return

    const cognitiveEvent = {
      timestamp: Date.now(),
      type, // 'decision_making', 'problem_solving', 'memory_recall', 'attention_shift'
      context,
      performance,
      cognitiveLoad: this.estimateCognitiveLoad(),
      processingStrategy: this.identifyProcessingStrategy(type, context),
    }

    switch (type) {
      case 'decision_making':
        this.sessionMetrics.decisionMakingPatterns.push(cognitiveEvent)
        break
      case 'problem_solving':
        this.sessionMetrics.problemSolvingApproaches.push(cognitiveEvent)
        break
      case 'memory_recall':
        this.sessionMetrics.memoryRecallEvents.push(cognitiveEvent)
        break
      case 'attention_shift':
        this.sessionMetrics.attentionFocusPoints.push(cognitiveEvent)
        break
    }

    this.updateLastInteractionTime()
  }

  // Registrar indicador comportamental
  recordBehavioralIndicator(type, intensity, context = null) {
    if (!this.dataCollectionActive) return

    const indicator = {
      timestamp: Date.now(),
      type, // 'frustration', 'engagement', 'motivation', 'fatigue'
      intensity, // 0-100
      context,
      sessionPhase: this.getCurrentSessionPhase(),
      cumulativeEffect: this.calculateCumulativeEffect(type, intensity),
    }

    switch (type) {
      case 'frustration':
        this.sessionMetrics.frustrationIndicators.push(indicator)
        break
      case 'engagement':
        this.sessionMetrics.engagementLevels.push(indicator)
        break
      case 'motivation':
        this.sessionMetrics.motivationSignals.push(indicator)
        break
      case 'fatigue':
        this.sessionMetrics.fatigueSigns.push(indicator)
        break
    }

    // Atualizar análise em tempo real
    this.realTimeAnalysis[`current${type.charAt(0).toUpperCase() + type.slice(1)}`] = intensity
  }

  // Registrar erro e estratégia de recuperação
  recordErrorAndRecovery(errorType, errorContext, recoveryStrategy, recoverySuccess) {
    if (!this.dataCollectionActive) return

    const errorEvent = {
      timestamp: Date.now(),
      errorType,
      errorContext,
      recoveryStrategy,
      recoverySuccess,
      timeToRecovery: this.calculateTimeToRecovery(),
      errorSequence: this.identifyErrorSequence(),
      learningFromError: this.assessLearningFromError(errorType, recoverySuccess),
    }

    this.sessionMetrics.errorPatterns.push(errorEvent)

    if (recoveryStrategy) {
      this.sessionMetrics.errorRecoveryStrategies.push({
        strategy: recoveryStrategy,
        effectiveness: recoverySuccess ? 100 : 0,
        context: errorContext,
      })
    }
  }
  // Atualizar análise em tempo real
  updateRealTimeAnalysis() {
    const now = Date.now()
    // const timeSinceStart = now - this.sessionMetrics.startTime; // Commented out as it's not used

    // Calcular engagement atual baseado em interações recentes
    const recentInteractions = this.getRecentInteractions(30000) // Últimos 30 segundos
    this.realTimeAnalysis.currentEngagement = this.calculateEngagement(recentInteractions)

    // Calcular frustração baseada em padrões de erro
    const recentErrors = this.getRecentErrors(60000) // Último minuto
    this.realTimeAnalysis.currentFrustration = this.calculateFrustration(recentErrors)

    // Calcular carga cognitiva
    this.realTimeAnalysis.currentCognitiveLoad = this.estimateCognitiveLoad()

    // Detectar necessidade de intervenção
    if (this.realTimeAnalysis.currentFrustration > 70) {
      this.triggerFrustrationIntervention()
    }

    if (this.realTimeAnalysis.currentEngagement < 30) {
      this.triggerEngagementBoost()
    }
  }

  // Detectar padrões comportamentais emergentes
  detectBehavioralPatterns() {
    const patterns = {
      fatiguePattern: this.detectFatiguePattern(),
      learningStyleEvolution: this.detectLearningStyleEvolution(),
      attentionCycles: this.detectAttentionCycles(),
      errorPatternEvolution: this.detectErrorPatternEvolution(),
      motivationTrends: this.detectMotivationTrends(),
    }

    // Armazenar padrões detectados
    this.sessionMetrics.detectedPatterns = patterns

    return patterns
  }

  // Gerar recomendações adaptativas em tempo real
  generateAdaptiveRecommendations() {
    const recommendations = []

    // Baseado no engagement
    if (this.realTimeAnalysis.currentEngagement < 40) {
      recommendations.push({
        type: 'engagement_boost',
        action: 'increase_interactivity',
        priority: 'high',
        implementation: 'add_gamification_elements',
      })
    }

    // Baseado na frustração
    if (this.realTimeAnalysis.currentFrustration > 60) {
      recommendations.push({
        type: 'frustration_reduction',
        action: 'simplify_task',
        priority: 'immediate',
        implementation: 'reduce_difficulty_temporarily',
      })
    }

    // Baseado na carga cognitiva
    if (this.realTimeAnalysis.currentCognitiveLload > 80) {
      recommendations.push({
        type: 'cognitive_relief',
        action: 'provide_break',
        priority: 'high',
        implementation: 'suggest_pause_or_easier_task',
      })
    }

    // Baseado em padrões de aprendizagem
    const preferredModality = this.identifyPreferredModalityRealTime()
    if (preferredModality) {
      recommendations.push({
        type: 'modality_optimization',
        action: 'emphasize_preferred_modality',
        priority: 'medium',
        implementation: `increase_${preferredModality}_elements`,
      })
    }

    this.realTimeAnalysis.adaptiveRecommendations = recommendations
    return recommendations
  }

  // Calcular engagement baseado em interações
  calculateEngagement(interactions) {
    if (interactions.length === 0) return 0

    let engagementScore = 0
    const totalInteractions = interactions.length

    // Frequência de interações
    const interactionFrequency = totalInteractions / 30 // Por segundo nos últimos 30s
    engagementScore += Math.min(interactionFrequency * 20, 40)

    // Variedade de tipos de interação
    const interactionTypes = new Set(interactions.map((i) => i.type))
    engagementScore += Math.min(interactionTypes.size * 10, 30)

    // Velocidade de resposta (mais rápido = mais engajado)
    const avgResponseTime =
      interactions.reduce((sum, i) => sum + (i.responseTime || 0), 0) / totalInteractions
    if (avgResponseTime > 0) {
      engagementScore += Math.max(30 - (avgResponseTime / 1000) * 5, 0)
    }

    return Math.min(engagementScore, 100)
  }

  // Calcular frustração baseada em erros
  calculateFrustration(errors) {
    if (errors.length === 0) return 0

    let frustrationScore = 0

    // Frequência de erros
    frustrationScore += Math.min(errors.length * 15, 60)

    // Erros consecutivos (mais frustrante)
    const consecutiveErrors = this.countConsecutiveErrors(errors)
    frustrationScore += Math.min(consecutiveErrors * 10, 30)

    // Tempo gasto sem sucesso
    const timeWithoutSuccess = this.calculateTimeWithoutSuccess()
    frustrationScore += Math.min(timeWithoutSuccess / 10000, 10) // 10ms = 1 ponto

    return Math.min(frustrationScore, 100)
  }

  // Estimar carga cognitiva atual
  estimateCognitiveLoad() {
    let cognitiveLoad = 0

    // Baseado na complexidade da tarefa atual
    const currentTaskComplexity = this.getCurrentTaskComplexity()
    cognitiveLoad += currentTaskComplexity * 30

    // Baseado no tempo de resposta (maior = mais carga)
    const recentResponseTimes = this.getRecentResponseTimes(15000)
    if (recentResponseTimes.length > 0) {
      const avgResponseTime =
        recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length
      cognitiveLoad += Math.min((avgResponseTime / 1000) * 10, 40)
    }

    // Baseado na variabilidade de performance
    const performanceVariability = this.calculatePerformanceVariability()
    cognitiveLoad += performanceVariability * 30

    return Math.min(cognitiveLoad, 100)
  }

  // Gerar relatório final da sessão
  generateFinalReport() {
    const report = {
      sessionSummary: {
        sessionId: this.sessionMetrics.sessionId,
        userId: this.sessionMetrics.userId,
        duration: this.sessionMetrics.totalDuration,
        totalInteractions: this.getTotalInteractionCount(),
        completionRate: this.calculateCompletionRate(),
      },

      sensoryProfileAnalysis: {
        visualProcessing: this.analyzeVisualProcessing(),
        auditoryProcessing: this.analyzeAuditoryProcessing(),
        tactileProcessing: this.analyzeTactileProcessing(),
        multisensoryIntegration: this.analyzeMultisensoryIntegration(),
      },

      cognitiveProfileAnalysis: {
        executiveFunction: this.analyzeExecutiveFunction(),
        memoryPerformance: this.analyzeMemoryPerformance(),
        attentionPatterns: this.analyzeAttentionPatterns(),
        processingSpeed: this.analyzeProcessingSpeed(),
      },

      behavioralProfileAnalysis: {
        engagementPatterns: this.analyzeEngagementPatterns(),
        frustrationTolerance: this.analyzeFrustrationTolerance(),
        motivationFactors: this.analyzeMotivationFactors(),
        learningPreferences: this.analyzeLearningPreferences(),
      },

      adaptiveInsights: {
        recommendedDifficulty: this.recommendDifficulty(),
        preferredModalities: this.identifyPreferredModalities(),
        accommodationNeeds: this.identifyAccommodationNeeds(),
        nextSessionOptimizations: this.generateNextSessionOptimizations(),
      },

      therapeuticRecommendations: {
        strengthsToLeverage: this.identifyStrengths(),
        areasForDevelopment: this.identifyDevelopmentAreas(),
        interventionSuggestions: this.generateInterventionSuggestions(),
        progressIndicators: this.defineProgressIndicators(),
      },
    }

    return report
  }

  // Métodos auxiliares (alguns exemplos)
  getCurrentVisualContext() {
    return {
      screenBrightness: this.estimateScreenBrightness(),
      visualComplexity: this.estimateVisualComplexity(),
      colorScheme: this.getCurrentColorScheme(),
      textSize: this.getCurrentTextSize(),
    }
  }

  getCurrentAuditoryContext() {
    return {
      backgroundNoise: this.estimateBackgroundNoise(),
      volume: this.getCurrentVolume(),
      audioQuality: this.estimateAudioQuality(),
      speechRate: this.getCurrentSpeechRate(),
    }
  }

  getCurrentTactileContext() {
    return {
      deviceType: this.detectDeviceType(),
      touchSensitivity: this.estimateTouchSensitivity(),
      hapticCapability: this.detectHapticCapability(),
    }
  }

  updateLastInteractionTime() {
    this.lastInteractionTime = Date.now()
  }

  getRecentInteractions(timeWindow) {
    const cutoff = Date.now() - timeWindow
    return [
      ...this.sessionMetrics.visualInteractions,
      ...this.sessionMetrics.auditoryInteractions,
      ...this.sessionMetrics.touchInteractions,
    ].filter((interaction) => interaction.timestamp >= cutoff)
  }

  getRecentErrors(timeWindow) {
    const cutoff = Date.now() - timeWindow
    return this.sessionMetrics.errorPatterns.filter((error) => error.timestamp >= cutoff)
  }
  // MÉTODOS AUXILIARES ESPECÍFICOS PARA DISPOSITIVOS MÓVEIS

  // Detectar tipo de dispositivo
  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase()
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const minDimension = Math.min(screenWidth, screenHeight)

    if (/tablet|ipad/.test(userAgent) || minDimension >= 768) {
      return 'tablet'
    } else if (/mobile|phone|android|iphone/.test(userAgent) || minDimension < 768) {
      return 'phone'
    }
    return 'desktop'
  }

  // Obter orientação da tela
  getScreenOrientation() {
    if (screen.orientation) {
      return screen.orientation.angle === 0 || screen.orientation.angle === 180
        ? 'portrait'
        : 'landscape'
    }
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  }

  // Obter modelo do dispositivo
  getDeviceModel() {
    const userAgent = navigator.userAgent

    // iOS
    if (/iPhone/.test(userAgent)) {
      const match = userAgent.match(/iPhone OS (\d+)/)
      return `iPhone (iOS ${match ? match[1] : 'unknown'})`
    }
    if (/iPad/.test(userAgent)) {
      const match = userAgent.match(/OS (\d+)/)
      return `iPad (iOS ${match ? match[1] : 'unknown'})`
    }

    // Android
    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/Android (\d+\.?\d*)/)
      return `Android ${match ? match[1] : 'unknown'}`
    }

    return 'Unknown'
  }

  // Obter sistema operacional
  getOperatingSystem() {
    const userAgent = navigator.userAgent

    if (/Windows/.test(userAgent)) return 'Windows'
    if (/Mac/.test(userAgent)) return 'macOS'
    if (/iPhone|iPad/.test(userAgent)) return 'iOS'
    if (/Android/.test(userAgent)) return 'Android'
    if (/Linux/.test(userAgent)) return 'Linux'

    return 'Unknown'
  }

  // Obter informações do navegador
  getBrowserInfo() {
    const userAgent = navigator.userAgent

    if (/Chrome/.test(userAgent)) return 'Chrome'
    if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari'
    if (/Firefox/.test(userAgent)) return 'Firefox'
    if (/Edge/.test(userAgent)) return 'Edge'

    return 'Unknown'
  }

  // Obter tipo de rede
  getNetworkType() {
    if (navigator.connection) {
      return navigator.connection.effectiveType || navigator.connection.type
    }
    return 'unknown'
  }

  // Obter velocidade de conexão
  getConnectionSpeed() {
    if (navigator.connection) {
      return navigator.connection.downlink || 0
    }
    return 0
  }

  // Obter nível da bateria
  getBatteryLevel() {
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        this.sessionMetrics.sessionContext.environment.batteryLevel = battery.level * 100
        this.sessionMetrics.sessionContext.environment.isCharging = battery.charging
      })
    }
    return null
  }
  // Obter brilho da tela (estimativa)
  getScreenBrightness() {
    // Não é possível obter diretamente, mas podemos usar ambient light sensor se disponível
    if (window.AmbientLightSensor) {
      try {
        // eslint-disable-next-line no-undef
        const sensor = new AmbientLightSensor()
        sensor.addEventListener('reading', () => {
          this.recordSensorData('ambientLight', {
            timestamp: Date.now(),
            illuminance: sensor.illuminance,
          })
        })
        sensor.start()
      } catch (error) {
        console.warn('Ambient light sensor não disponível:', error)
      }
    }
    return null
  }

  // Obter status de carregamento
  getChargingStatus() {
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        this.sessionMetrics.sessionContext.environment.isCharging = battery.charging
      })
    }
    return null
  }

  // Obter uso de memória
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      }
    }
    return null
  }

  // Obter armazenamento disponível
  getAvailableStorage() {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        this.sessionMetrics.sessionContext.environment.availableStorage = {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota - estimate.usage,
        }
      })
    }
    return null
  }

  // Encontrar início de toque
  findTouchStart(touchId) {
    const touchEvents = this.sessionMetrics.touchMetrics.touchEvents
    for (let i = touchEvents.length - 1; i >= 0; i--) {
      const event = touchEvents[i]
      if (event.type === 'touchstart') {
        const touch = event.touches.find((t) => t.identifier === touchId)
        if (touch) return { timestamp: event.timestamp, touch }
      }
    }
    return null
  }

  // Obter posição anterior do toque
  getPreviousTouchPosition(touchId) {
    const coordinates = this.sessionMetrics.touchMetrics.touchCoordinates
    for (let i = coordinates.length - 1; i >= 0; i--) {
      const coord = coordinates[i]
      if (coord.touchId === touchId && coord.type === 'move') {
        return coord
      }
    }
    return null
  }

  // Obter últimos dados de localização
  getLastLocationData() {
    const coords = this.sessionMetrics.locationData.gpsCoordinates
    return coords.length > 0 ? coords[coords.length - 1] : null
  }

  // Calcular distância entre dois pontos geográficos
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3 // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Calcular direção entre dois pontos
  calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const y = Math.sin(Δλ) * Math.cos(φ2)
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

    const θ = Math.atan2(y, x)
    return ((θ * 180) / Math.PI + 360) % 360
  }

  // Obter contexto atual da atividade
  getCurrentActivityContext() {
    return {
      timestamp: Date.now(),
      currentActivity: this.getCurrentActivity(),
      duration: Date.now() - this.sessionMetrics.startTime,
      deviceOrientation: this.getScreenOrientation(),
      batteryLevel: this.sessionMetrics.sessionContext.environment.batteryLevel,
      networkType: this.sessionMetrics.sessionContext.environment.networkType,
    }
  }

  // Obter atividade atual
  getCurrentActivity() {
    // Seria implementado baseado no sistema de atividades do Portal Betina
    return 'unknown_activity'
  }

  // Métodos existentes atualizados para mobile
  estimateScreenBrightness() {
    return this.getScreenBrightness() || 50
  }
  estimateVisualComplexity() {
    return 50
  }
  getCurrentColorScheme() {
    return 'default'
  }
  getCurrentTextSize() {
    return 'medium'
  }
  estimateBackgroundNoise() {
    return 20
  }
  getCurrentVolume() {
    return 75
  }
  estimateAudioQuality() {
    return 90
  }
  getCurrentSpeechRate() {
    return 150
  }
  estimateTouchSensitivity() {
    return 75
  }
  detectHapticCapability() {
    return 'vibrate' in navigator
  }
  calculateGestureComplexity(gesture) {
    if (!gesture.touches) return 0
    return Math.min(gesture.touches.length * 25, 100)
  }
  calculateGesturePrecision(_gesture) {
    return 75
  }
  identifyProcessingStrategy(_type, _context) {
    return 'sequential'
  }
  getCurrentSessionPhase() {
    return 'active'
  }
  calculateCumulativeEffect(type, intensity) {
    return intensity
  }
  calculateTimeToRecovery() {
    return 2000
  }
  identifyErrorSequence() {
    return 'isolated'
  }
  assessLearningFromError(errorType, recoverySuccess) {
    return recoverySuccess ? 75 : 25
  }
  triggerFrustrationIntervention() {
    console.log('🚨 Intervenção de frustração ativada')
  }
  triggerEngagementBoost() {
    console.log('⚡ Impulso de engajamento ativado')
  }
  detectFatiguePattern() {
    return 'stable'
  }
  detectLearningStyleEvolution() {
    return 'visual_preference'
  }
  detectAttentionCycles() {
    return 'consistent'
  }
  detectErrorPatternEvolution() {
    return 'improving'
  }
  detectMotivationTrends() {
    return 'stable'
  }
  identifyPreferredModalityRealTime() {
    return 'visual'
  }
  getTotalInteractionCount() {
    return (
      this.sessionMetrics.visualInteractions.length +
      this.sessionMetrics.auditoryInteractions.length +
      this.sessionMetrics.touchInteractions.length
    )
  }
  calculateCompletionRate() {
    return 85
  }
  countConsecutiveErrors(_errors) {
    return 0
  }
  calculateTimeWithoutSuccess(_timeWindow) {
    return 5000
  }
  getCurrentTaskComplexity() {
    return 50
  }
  getRecentResponseTimes(_timeWindow) {
    return [2000, 2500, 1800]
  }
  calculatePerformanceVariability() {
    return 0.3
  }

  // Analysis methods (would be fully implemented)
  analyzeVisualProcessing() {
    return { score: 75, patterns: ['good_discrimination'] }
  }
  analyzeAuditoryProcessing() {
    return { score: 80, patterns: ['strong_comprehension'] }
  }
  analyzeTactileProcessing() {
    return { score: 70, patterns: ['adequate_motor_control'] }
  }
  analyzeMultisensoryIntegration() {
    return { score: 85, patterns: ['good_integration'] }
  }
  analyzeExecutiveFunction() {
    return { score: 75, patterns: ['good_planning'] }
  }
  analyzeMemoryPerformance() {
    return { score: 80, patterns: ['strong_working_memory'] }
  }
  analyzeAttentionPatterns() {
    return { score: 70, patterns: ['variable_attention'] }
  }
  analyzeProcessingSpeed() {
    return { score: 75, patterns: ['adequate_speed'] }
  }
  analyzeEngagementPatterns() {
    return { score: 85, patterns: ['high_initial_engagement'] }
  }
  analyzeFrustrationTolerance() {
    return { score: 70, patterns: ['moderate_tolerance'] }
  }
  analyzeMotivationFactors() {
    return { score: 80, patterns: ['intrinsically_motivated'] }
  }
  analyzeLearningPreferences() {
    return { score: 75, patterns: ['visual_preference'] }
  }
  recommendDifficulty() {
    return 'medium'
  }
  identifyPreferredModalities() {
    return ['visual', 'auditory']
  }
  identifyAccommodationNeeds() {
    return ['extended_time']
  }
  generateNextSessionOptimizations() {
    return ['increase_visual_cues']
  }
  identifyStrengths() {
    return ['visual_processing', 'memory']
  }
  identifyDevelopmentAreas() {
    return ['attention_span']
  }
  generateInterventionSuggestions() {
    return ['attention_training']
  }
  defineProgressIndicators() {
    return ['sustained_attention_duration']
  }
}

// Manter uma instância padrão para compatibilidade
export default new MultisensoryMetricsCollector()
