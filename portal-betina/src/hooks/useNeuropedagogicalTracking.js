import { useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import dashboardNeuropedagogicalIntegration from '../utils/shared/dashboardNeuropedagogicalIntegration.js'

/**
 * Hook para integração com o sistema de análise neuropedagógica
 * Permite coleta de métricas em background sem interromper o jogo
 */
const useNeuropedagogicalTracking = (gameId, options = {}) => {
  const { userId } = useUser()
  const sessionIdRef = useRef(null)
  const isInitialized = useRef(false)

  const { autoStart = true, trackDetailedMetrics = true, enableAnalysis = true } = options

  // Inicializar sessão automaticamente
  useEffect(() => {
    if (autoStart && userId && gameId && !isInitialized.current) {
      startTracking()
    }

    // Cleanup ao desmontar
    return () => {
      if (sessionIdRef.current) {
        finishTracking()
      }
    }
  }, [userId, gameId, autoStart])

  // Iniciar rastreamento
  const startTracking = () => {
    if (!userId || !gameId || !enableAnalysis) return null

    const sessionId = `${gameId}_${userId}_${Date.now()}`
    sessionIdRef.current = sessionId
    isInitialized.current = true

    dashboardNeuropedagogicalIntegration.initializeSession(userId, sessionId, gameId)

    console.log(`🧠 [Tracking] Iniciado para ${gameId} - Sessão: ${sessionId}`)
    return sessionId
  }

  // Finalizar rastreamento
  const finishTracking = async () => {
    if (!sessionIdRef.current) return null

    const sessionId = sessionIdRef.current
    sessionIdRef.current = null
    isInitialized.current = false

    try {
      const analysisResult = await dashboardNeuropedagogicalIntegration.finalizeSession(sessionId)
      console.log(`🧠 [Tracking] Finalizado para ${gameId} - Análise:`, analysisResult)
      return analysisResult
    } catch (error) {
      console.error('Erro ao finalizar tracking neuropedagógico:', error)
      return null
    }
  }

  // Registrar interação do usuário
  const recordInteraction = (interactionData) => {
    if (!sessionIdRef.current || !enableAnalysis) return

    const enrichedData = {
      ...interactionData,
      timestamp: Date.now(),
      gameId,
    }

    dashboardNeuropedagogicalIntegration.recordInteraction(sessionIdRef.current, enrichedData)
  }

  // Métodos de conveniência para tipos específicos de interação
  const recordCorrectAnswer = (responseTime, additionalData = {}) => {
    recordInteraction({
      type: 'answer',
      isCorrect: true,
      responseTime,
      ...additionalData,
    })
  }

  const recordIncorrectAnswer = (responseTime, errorType = 'unknown', additionalData = {}) => {
    recordInteraction({
      type: 'answer',
      isCorrect: false,
      responseTime,
      errorType,
      ...additionalData,
    })
  }

  const recordVisualTask = (isCorrect, responseTime, taskComplexity = 'medium') => {
    recordInteraction({
      type: 'visual_task',
      isCorrect,
      responseTime,
      taskComplexity,
      visualProcessingDemand: getVisualProcessingDemand(taskComplexity),
    })
  }

  const recordAuditoryTask = (isCorrect, responseTime, hasAudioFeedback = false) => {
    recordInteraction({
      type: 'auditory_task',
      isCorrect,
      responseTime,
      hasAudioFeedback,
      auditoryProcessingDemand: hasAudioFeedback ? 'high' : 'medium',
    })
  }

  const recordTTSUsage = () => {
    recordInteraction({
      type: 'tts_usage',
      auditorySupport: true,
    })
  }

  const recordSoundToggle = (enabled) => {
    recordInteraction({
      type: 'sound_toggle',
      enabled,
      userPreference: enabled,
    })
  }

  const recordPlanningPhase = (planningTime) => {
    recordInteraction({
      type: 'planning_phase',
      planningTime,
      executiveFunctionDemand: planningTime > 3000 ? 'high' : 'medium',
    })
  }

  const recordStrategyChange = (oldStrategy, newStrategy, reason = 'user_choice') => {
    recordInteraction({
      type: 'strategy_change',
      oldStrategy,
      newStrategy,
      changeReason: reason,
      adaptiveThinking: true,
    })
  }

  const recordDifficultyChange = (oldLevel, newLevel, automatic = false) => {
    recordInteraction({
      type: 'difficulty_change',
      oldLevel,
      newLevel,
      automatic,
      adaptiveResponse: !automatic,
    })
  }

  const recordGamePause = (duration) => {
    recordInteraction({
      type: 'game_pause',
      pauseDuration: duration,
      possibleDistraction: duration > 30000, // Mais de 30 segundos
    })
  }

  const recordAttentionEvent = (eventType, intensity = 'medium') => {
    recordInteraction({
      type: 'attention_event',
      eventType, // 'focus', 'distraction', 'fatigue', 'engagement'
      intensity,
      timestamp: Date.now(),
    })
  }

  const recordMemoryTask = (isCorrect, itemRepeated = false, timeSinceLastSeen = 0) => {
    recordInteraction({
      type: 'memory_task',
      isCorrect,
      itemRepeated,
      timeSinceLastSeen,
      memoryDemand: timeSinceLastSeen > 60000 ? 'high' : 'medium',
    })
  }

  // Utilitários
  const getVisualProcessingDemand = (complexity) => {
    switch (complexity) {
      case 'easy':
        return 'low'
      case 'medium':
        return 'medium'
      case 'hard':
        return 'high'
      default:
        return 'medium'
    }
  }

  // Método para registrar métricas customizadas específicas do jogo
  const recordCustomMetric = (metricName, value, context = {}) => {
    recordInteraction({
      type: 'custom_metric',
      metricName,
      value,
      context,
      gameSpecific: true,
    })
  }

  // Método para registrar uma sequência de ações (útil para jogos complexos)
  const recordActionSequence = (actions, sequenceType = 'unknown') => {
    recordInteraction({
      type: 'action_sequence',
      actions,
      sequenceType,
      sequenceLength: actions.length,
      executiveComplexity: actions.length > 3 ? 'high' : 'medium',
    })
  }

  return {
    // Controle de sessão
    startTracking,
    finishTracking,
    isTracking: !!sessionIdRef.current,
    sessionId: sessionIdRef.current,

    // Registro básico
    recordInteraction,

    // Métodos específicos por tipo
    recordCorrectAnswer,
    recordIncorrectAnswer,
    recordVisualTask,
    recordAuditoryTask,
    recordTTSUsage,
    recordSoundToggle,
    recordPlanningPhase,
    recordStrategyChange,
    recordDifficultyChange,
    recordGamePause,
    recordAttentionEvent,
    recordMemoryTask,

    // Métodos avançados
    recordCustomMetric,
    recordActionSequence,

    // Utilitários
    getVisualProcessingDemand,
  }
}

export default useNeuropedagogicalTracking
