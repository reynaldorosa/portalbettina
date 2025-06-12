// Hook para coleta automatizada de dados em dispositivos móveis
// Focado em capturar métricas específicas para análise neuropedagógica

import { useEffect, useRef, useCallback } from 'react'
import multisensoryMetrics from '../utils/multisensoryAnalysis/index.js'
import { getSystemOrchestrator } from '../core/SystemOrchestrator'

export const useMobileDataCollection = (isActive = true, options = {}) => {
  const touchDataRef = useRef([])
  const gestureStartRef = useRef(null)
  const deviceMotionRef = useRef({
    accelerometer: [],
    gyroscope: [],
    orientation: [],
  })
  const orchestratorRef = useRef(null)
  const sessionIdRef = useRef(null)

  // Configurações padrão
  const config = {
    collectTouchData: true,
    collectSensorData: true,
    collectLocationData: false, // Requer permissão específica
    touchSampleRate: 60, // Hz
    sensorSampleRate: 30, // Hz
    maxDataPoints: 1000,
    enableOrchestrationIntegration: true,
    ...options,
  }

  // 🎯 INTEGRAÇÃO COM SYSTEM ORCHESTRATOR
  useEffect(() => {
    const initOrchestrator = async () => {
      try {
        orchestratorRef.current = await getSystemOrchestrator()
        console.log('🎯 SystemOrchestrator integrado com useMobileDataCollection')
      } catch (error) {
        console.error('Erro ao integrar SystemOrchestrator:', error)
      }
    }

    if (config.enableOrchestrationIntegration && !orchestratorRef.current) {
      initOrchestrator()
    }
  }, [config.enableOrchestrationIntegration])

  // Função para enviar dados sensoriais ao SystemOrchestrator
  const sendSensorDataToOrchestrator = useCallback(
    (sensorData, eventType) => {
      if (!orchestratorRef.current || !sessionIdRef.current) return

      const sensorialMetrics = {
        sessionId: sessionIdRef.current,
        timestamp: Date.now(),
        eventType,
        sensorType: sensorData.type,
        data: sensorData,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          orientation: screen.orientation?.angle || 0,
          touchSupport: 'ontouchstart' in window,
        },
      }

      orchestratorRef.current
        .processSensorialMetrics(sessionIdRef.current, sensorialMetrics)
        .catch((error) => console.error('Erro ao enviar dados sensoriais:', error))
    },
    [orchestratorRef, sessionIdRef]
  )

  // Iniciar coleta com sessão
  const startCollection = useCallback(
    (sessionId) => {
      sessionIdRef.current = sessionId
      console.log('📱 Coleta de dados móveis iniciada para sessão:', sessionId)
    },
    [sessionIdRef]
  )

  // Parar coleta
  const stopCollection = useCallback(() => {
    sessionIdRef.current = null
    console.log('📱 Coleta de dados móveis finalizada')
  }, [sessionIdRef])
  // Handler para eventos de toque
  const handleTouchStart = useCallback(
    (event) => {
      if (!isActive || !config.collectTouchData) return

      gestureStartRef.current = Date.now()
      multisensoryMetrics.recordDetailedTouchEvent(event)

      // Registrar início de possível padrão repetitivo
      const touchCount = event.touches.length
      if (touchCount > 1) {
        multisensoryMetrics.recordNeurodivergenceMetric('stimulation_seeking', {
          type: 'multi_touch',
          fingerCount: touchCount,
          intensity: Math.min(touchCount * 25, 100),
        })
      }

      // 🎯 ENVIAR DADOS DE TOQUE PARA SYSTEMORCHESTRATOR
      const touchData = {
        type: 'touch_start',
        touchCount,
        touches: Array.from(event.touches).map((touch) => ({
          x: touch.clientX,
          y: touch.clientY,
          force: touch.force || 0,
          radiusX: touch.radiusX || 0,
          radiusY: touch.radiusY || 0,
        })),
        pressure: event.touches[0]?.force || 0,
        timestamp: Date.now(),
      }

      sendSensorDataToOrchestrator(touchData, 'touch_start')

      // Prevenir comportamentos padrão em alguns casos para melhor coleta
      if (event.touches.length > 2) {
        event.preventDefault()
      }
    },
    [isActive, config.collectTouchData, sendSensorDataToOrchestrator]
  )

  const handleTouchMove = useCallback(
    (event) => {
      if (!isActive || !config.collectTouchData) return

      multisensoryMetrics.recordDetailedTouchEvent(event)

      // Detectar possível stimming através de movimentos repetitivos
      const currentTime = Date.now()
      const recentMoves = touchDataRef.current.filter((move) => currentTime - move.timestamp < 2000)

      if (recentMoves.length > 10) {
        const isRepetitive = detectRepetitivePattern(recentMoves)
        if (isRepetitive) {
          multisensoryMetrics.recordNeurodivergenceMetric('stimming', {
            type: 'repetitive_touch_movement',
            pattern: 'circular_or_back_forth',
            intensity: 75,
            duration: currentTime - recentMoves[0].timestamp,
          })
        }
      }

      // 🎯 ENVIAR DADOS DE MOVIMENTO PARA SYSTEMORCHESTRATOR
      const moveData = {
        type: 'touch_move',
        touches: Array.from(event.touches).map((touch) => ({
          x: touch.clientX,
          y: touch.clientY,
          force: touch.force || 0,
        })),
        velocity: calculateVelocity(event.touches[0]),
        pattern:
          recentMoves.length > 10
            ? detectRepetitivePattern(recentMoves)
              ? 'repetitive'
              : 'normal'
            : 'normal',
        timestamp: currentTime,
      }

      sendSensorDataToOrchestrator(moveData, 'touch_move')

      // Armazenar dados para análise de padrões
      touchDataRef.current.push({
        timestamp: currentTime,
        touches: Array.from(event.touches).map((touch) => ({
          x: touch.clientX,
          y: touch.clientY,
          force: touch.force || 0,
        })),
      })

      // Limitar tamanho do array
      if (touchDataRef.current.length > config.maxDataPoints) {
        touchDataRef.current = touchDataRef.current.slice(-config.maxDataPoints)
      }
    },
    [isActive, config.collectTouchData, config.maxDataPoints]
  )

  // Função auxiliar para calcular velocidade do toque
  const calculateVelocity = useCallback((touch) => {
    if (touchDataRef.current.length < 2) return 0

    const lastTouch = touchDataRef.current[touchDataRef.current.length - 1]
    const secondLastTouch = touchDataRef.current[touchDataRef.current.length - 2]

    if (!lastTouch || !secondLastTouch) return 0

    const deltaX = touch.clientX - lastTouch.touches[0]?.x || 0
    const deltaY = touch.clientY - lastTouch.touches[0]?.y || 0
    const deltaTime = Date.now() - lastTouch.timestamp

    if (deltaTime === 0) return 0

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    return distance / deltaTime // pixels per millisecond
  }, [])

  const handleTouchEnd = useCallback(
    (event) => {
      if (!isActive || !config.collectTouchData) return

      multisensoryMetrics.recordDetailedTouchEvent(event)

      // Analisar duração do gesto
      if (gestureStartRef.current) {
        const duration = Date.now() - gestureStartRef.current

        // 🎯 ENVIAR DADOS DE FINALIZAÇÃO PARA SYSTEMORCHESTRATOR
        const endData = {
          type: 'touch_end',
          duration,
          gestureCompleted: true,
          pressure: event.changedTouches[0]?.force || 0,
          timestamp: Date.now(),
        }

        sendSensorDataToOrchestrator(endData, 'touch_end')

        // Detectar long press (possível indicador de dificuldade ou hesitação)
        if (duration > 1000) {
          multisensoryMetrics.recordNeurodivergenceMetric('executive_function', {
            type: 'long_press_hesitation',
            duration,
            intensity: Math.min(duration / 50, 100), // Mais tempo = mais intensidade
          })
        }

        // Detectar toque muito rápido (possível impulsividade)
        if (duration < 100) {
          multisensoryMetrics.recordNeurodivergenceMetric('impulse_control', {
            type: 'rapid_tap',
            duration,
            intensity: 60,
          })
        }
      }

      gestureStartRef.current = null
    },
    [isActive, config.collectTouchData, sendSensorDataToOrchestrator]
  )
  // Handler para movimento do dispositivo
  const handleDeviceMotion = useCallback(
    (event) => {
      if (!isActive || !config.collectSensorData) return

      const currentTime = Date.now()

      // Aceleration data
      if (event.acceleration) {
        const accelerationMagnitude = Math.sqrt(
          Math.pow(event.acceleration.x || 0, 2) +
            Math.pow(event.acceleration.y || 0, 2) +
            Math.pow(event.acceleration.z || 0, 2)
        )

        // 🎯 ENVIAR DADOS DE ACELERAÇÃO PARA SYSTEMORCHESTRATOR
        const accelerationData = {
          type: 'device_acceleration',
          x: event.acceleration.x || 0,
          y: event.acceleration.y || 0,
          z: event.acceleration.z || 0,
          magnitude: accelerationMagnitude,
          timestamp: currentTime,
        }

        sendSensorDataToOrchestrator(accelerationData, 'device_motion')

        multisensoryMetrics.recordSensorData('accelerometer', {
          timestamp: currentTime,
          x: event.acceleration.x || 0,
          y: event.acceleration.y || 0,
          z: event.acceleration.z || 0,
          magnitude: accelerationMagnitude,
        })

        // Detectar movimento excessivo (possível hiperatividade ou fidgeting)
        if (accelerationMagnitude > 2.0) {
          multisensoryMetrics.recordNeurodivergenceMetric('stimulation_seeking', {
            type: 'device_movement',
            intensity: Math.min(accelerationMagnitude * 25, 100),
            magnitude: accelerationMagnitude,
          })
        }
      }

      // Rotation data
      if (event.rotationRate) {
        // 🎯 ENVIAR DADOS DE ROTAÇÃO PARA SYSTEMORCHESTRATOR
        const rotationData = {
          type: 'device_rotation',
          alpha: event.rotationRate.alpha || 0,
          beta: event.rotationRate.beta || 0,
          gamma: event.rotationRate.gamma || 0,
          timestamp: currentTime,
        }

        sendSensorDataToOrchestrator(rotationData, 'device_rotation')

        multisensoryMetrics.recordSensorData('gyroscope', {
          timestamp: currentTime,
          alpha: event.rotationRate.alpha || 0,
          beta: event.rotationRate.beta || 0,
          gamma: event.rotationRate.gamma || 0,
        })
      }
    },
    [isActive, config.collectSensorData, sendSensorDataToOrchestrator]
  )

  // Handler para mudança de orientação
  const handleOrientationChange = useCallback(() => {
    if (!isActive) return

    setTimeout(() => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'

      multisensoryMetrics.recordNeurodivergenceMetric('adaptation_strategy', {
        type: 'orientation_change',
        newOrientation,
        timestamp: Date.now(),
        intention: 'comfort_seeking', // Assumir que mudança de orientação é busca por conforto
      })
    }, 100)
  }, [isActive])

  // Handler para mudança de visibilidade (foco/desfoco)
  const handleVisibilityChange = useCallback(() => {
    if (!isActive) return

    const isHidden = document.hidden
    const currentTime = Date.now()

    if (isHidden) {
      multisensoryMetrics.recordNeurodivergenceMetric('attention_shift', {
        type: 'focus_lost',
        timestamp: currentTime,
        trigger: 'app_backgrounded',
      })
    } else {
      multisensoryMetrics.recordNeurodivergenceMetric('attention_shift', {
        type: 'focus_regained',
        timestamp: currentTime,
        trigger: 'app_foregrounded',
      })
    }
  }, [isActive])

  // Detectar padrões repetitivos
  const detectRepetitivePattern = (moves) => {
    if (moves.length < 6) return false

    // Análise simples: verificar se há movimento em padrão circular ou vai-e-vem
    const positions = moves.map((move) => move.touches[0] || { x: 0, y: 0 })

    let isCircular = true
    let isBackAndForth = true

    // Verificar padrão circular (diferenças de ângulo relativamente constantes)
    for (let i = 2; i < positions.length; i++) {
      const angle1 = Math.atan2(
        positions[i - 1].y - positions[i - 2].y,
        positions[i - 1].x - positions[i - 2].x
      )
      const angle2 = Math.atan2(
        positions[i].y - positions[i - 1].y,
        positions[i].x - positions[i - 1].x
      )

      const angleDiff = Math.abs(angle2 - angle1)
      if (angleDiff < 0.2 || angleDiff > 6.0) {
        isCircular = false
        break
      }
    }

    // Verificar padrão vai-e-vem (direções alternadas)
    for (let i = 3; i < positions.length; i++) {
      const dir1 = positions[i - 2].x - positions[i - 3].x
      const dir2 = positions[i - 1].x - positions[i - 2].x
      const dir3 = positions[i].x - positions[i - 1].x

      if ((dir1 > 0 && dir2 > 0 && dir3 > 0) || (dir1 < 0 && dir2 < 0 && dir3 < 0)) {
        isBackAndForth = false
        break
      }
    }

    return isCircular || isBackAndForth
  }

  // Inicializar coletores de dados
  useEffect(() => {
    if (!isActive) return

    const eventOptions = { passive: false }

    // Event listeners para toque
    if (config.collectTouchData) {
      document.addEventListener('touchstart', handleTouchStart, eventOptions)
      document.addEventListener('touchmove', handleTouchMove, eventOptions)
      document.addEventListener('touchend', handleTouchEnd, eventOptions)
    }

    // Event listeners para sensores
    if (config.collectSensorData) {
      window.addEventListener('devicemotion', handleDeviceMotion)
      window.addEventListener('orientationchange', handleOrientationChange)
    }

    // Event listener para visibilidade
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('devicemotion', handleDeviceMotion)
      window.removeEventListener('orientationchange', handleOrientationChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    isActive,
    config.collectTouchData,
    config.collectSensorData,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDeviceMotion,
    handleOrientationChange,
    handleVisibilityChange,
  ])

  // Função para obter estatísticas da sessão atual
  const getSessionStats = useCallback(() => {
    const touchEvents = touchDataRef.current
    const sessionDuration =
      Date.now() - (multisensoryMetrics.sessionMetrics.startTime || Date.now())

    return {
      totalTouches: touchEvents.length,
      touchFrequency: touchEvents.length / (sessionDuration / 60000), // Por minuto
      averagePressure:
        touchEvents.reduce((sum, event) => {
          const avgForce =
            event.touches.reduce((s, t) => s + (t.force || 0), 0) / event.touches.length
          return sum + avgForce
        }, 0) / touchEvents.length,
      sessionDuration,
      deviceType: multisensoryMetrics.sessionMetrics.sessionContext?.device?.type,
      orientation: multisensoryMetrics.sessionMetrics.sessionContext?.device?.orientation,
    }
  }, [])

  // Função para forçar coleta de dados de contexto
  const captureContextSnapshot = useCallback(() => {
    if (!isActive) return null

    return {
      timestamp: Date.now(),
      deviceContext: {
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        pixelRatio: window.devicePixelRatio,
        online: navigator.onLine,
        userAgent: navigator.userAgent,
      },
      environmentContext: {
        url: window.location.href,
        referrer: document.referrer,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }
  }, [isActive])

  return {
    isCollecting: isActive,
    getSessionStats,
    captureContextSnapshot,
    touchDataCount: touchDataRef.current.length,
    deviceMotionDataCount: Object.values(deviceMotionRef.current).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    startCollection,
    stopCollection,
  }
}

export default useMobileDataCollection
