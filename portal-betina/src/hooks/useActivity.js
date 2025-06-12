/**
 * HOOK PADRONIZADO DE ATIVIDADE - PLATAFORMA BETINA
 * Centraliza toda a lógica comum das atividades em um hook reutilizável
 *
 * @version 2.0.0
 * @created 2025-06-05
 * @purpose Padronização e escalabilidade
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import useSound from './useSound'
import useProgress from './useProgress'
import { useUser } from '../contexts/UserContext'
import { useConfig, logger } from '../config/environment'
import { useMetrics } from '../services/metricsService'
import { createAdaptiveModel } from '../utils/adaptive'
import { getSystemOrchestrator } from '../core/SystemOrchestrator'
import {
  announceToScreenReader,
  vibrateSuccess,
  vibrateError,
  prefersHighContrast,
  prefersReducedMotion,
} from '../utils/accessibility/index.js'

/**
 * Hook padronizado para atividades
 * @param {string} activityId - ID único da atividade
 * @param {object} options - Opções de configuração
 */
export const useActivity = (activityId, options = {}) => {
  const {
    defaultDifficulty = 'easy',
    enableAdaptiveML = true,
    enableMetrics = true,
    enableAccessibility = true,
    enableSound = true,
    autoStart = false,
    maxDuration = 30 * 60 * 1000, // 30 minutos
    ...customOptions
  } = options

  // ==================== ESTADOS PADRONIZADOS ====================

  // Estados de controle de jogo
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [difficulty, setDifficulty] = useState(defaultDifficulty)
  const [isLoading, setIsLoading] = useState(false)

  // Estados de feedback e UI
  const [feedback, setFeedback] = useState(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showResults, setShowResults] = useState(false)

  // Estados de métricas
  const [sessionMetrics, setSessionMetrics] = useState({
    attempts: 0,
    successes: 0,
    errors: 0,
    score: 0,
    accuracy: 0,
    timeSpent: 0,
  })

  // Estados de acessibilidade
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    reducedMotion: false,
    screenReaderEnabled: false,
    fontSize: 'normal',
  })

  // Estados de configuração
  const [activityConfig, setActivityConfig] = useState({
    name: '',
    description: '',
    category: '',
    therapeuticFocus: [],
    minAge: 3,
    maxAge: 12,
    ...customOptions,
  })

  // ==================== HOOKS EXTERNOS ====================

  const { config, environment, logger: envLogger } = useConfig()
  const { userId, userDetails, loading: userLoading } = useUser()
  const sound = enableSound ? useSound() : null
  const progress = useProgress(activityId)
  const metrics = enableMetrics ? useMetrics(activityId) : null

  // ==================== REFS ====================

  const adaptiveModelRef = useRef(null)
  const sessionStartRef = useRef(null)
  const sessionIdRef = useRef(null)
  const timerRef = useRef(null)
  const lastActionRef = useRef(null)
  const componentLogger = useRef(new envLogger.constructor(activityId))
  const orchestratorRef = useRef(null)

  // ==================== SYSTEM ORCHESTRATOR INTEGRATION ====================

  // Inicializar SystemOrchestrator
  useEffect(() => {
    const initOrchestrator = async () => {
      try {
        orchestratorRef.current = await getSystemOrchestrator()
        componentLogger.current.info('SystemOrchestrator integrado com useActivity')
      } catch (error) {
        componentLogger.current.error('Erro ao integrar SystemOrchestrator:', error)
      }
    }

    if (userId && !orchestratorRef.current) {
      initOrchestrator()
    }
  }, [userId])

  // ==================== CALLBACKS PADRONIZADOS ====================

  // Inicializar atividade
  const initializeActivity = useCallback(async () => {
    try {
      setIsLoading(true)
      componentLogger.current.info('Inicializando atividade', { activityId, userId })

      // Verificar se usuário está carregado
      if (userLoading) {
        componentLogger.current.debug('Aguardando carregamento do usuário')
        return
      }

      // Inicializar modelo adaptativo
      if (enableAdaptiveML && userId && !adaptiveModelRef.current) {
        adaptiveModelRef.current = createAdaptiveModel(activityId, userId)
        componentLogger.current.info('Modelo adaptativo inicializado')
      }

      // Aplicar configurações de acessibilidade
      if (enableAccessibility) {
        setAccessibilitySettings({
          highContrast: prefersHighContrast(),
          reducedMotion: prefersReducedMotion(),
          screenReaderEnabled: window.speechSynthesis !== undefined,
          fontSize: localStorage.getItem('betina_font_size') || 'normal',
        })
      }

      // Auto-iniciar se configurado
      if (autoStart) {
        await startGame()
      }
    } catch (error) {
      componentLogger.current.error('Erro na inicialização', error)
    } finally {
      setIsLoading(false)
    }
  }, [activityId, userId, userLoading, enableAdaptiveML, enableAccessibility, autoStart])

  // Iniciar jogo
  const startGame = useCallback(async () => {
    try {
      componentLogger.current.info('Iniciando jogo')

      setGameStarted(true)
      setGameFinished(false)
      setShowInstructions(false)
      sessionStartRef.current = Date.now()

      // Iniciar sessão de progresso
      if (progress.startActivity) {
        await progress.startActivity()
      }

      // Iniciar sessão de métricas
      if (metrics && userId) {
        sessionIdRef.current = metrics.startSession(userId, difficulty)
        componentLogger.current.debug('Sessão de métricas iniciada', {
          sessionId: sessionIdRef.current,
        })
      }

      // Configurar timer de duração máxima
      if (maxDuration) {
        timerRef.current = setTimeout(() => {
          finishGame('timeout')
        }, maxDuration)
      }

      // Anunciar para leitores de tela
      if (accessibilitySettings.screenReaderEnabled) {
        announceToScreenReader(`Atividade ${activityConfig.name} iniciada. Nível ${difficulty}.`)
      }

      return true
    } catch (error) {
      componentLogger.current.error('Erro ao iniciar jogo', error)
      return false
    }
  }, [difficulty, userId, metrics, progress, accessibilitySettings, activityConfig, maxDuration])

  // Pausar jogo
  const pauseGame = useCallback(() => {
    if (!gameStarted || gamePaused) return

    setGamePaused(true)

    if (progress.pauseActivity) {
      progress.pauseActivity()
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    componentLogger.current.info('Jogo pausado')
  }, [gameStarted, gamePaused, progress])

  // Retomar jogo
  const resumeGame = useCallback(() => {
    if (!gameStarted || !gamePaused) return

    setGamePaused(false)

    if (progress.resumeActivity) {
      progress.resumeActivity()
    }

    componentLogger.current.info('Jogo retomado')
  }, [gameStarted, gamePaused, progress])

  // Finalizar jogo
  const finishGame = useCallback(
    async (reason = 'completed') => {
      try {
        componentLogger.current.info('Finalizando jogo', { reason })

        setGameFinished(true)
        setGameStarted(false)
        setGamePaused(false)

        // Limpar timer
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        // Calcular tempo total
        const endTime = Date.now()
        const totalTime = sessionStartRef.current ? endTime - sessionStartRef.current : 0

        // Finalizar sessão de progresso
        if (progress.finishActivity) {
          await progress.finishActivity()
        }

        // Finalizar sessão de métricas
        if (metrics && sessionIdRef.current) {
          const finalMetrics = await metrics.finishSession(sessionIdRef.current, {
            reason,
            totalTime,
            finalScore: sessionMetrics.score,
            ...activityConfig,
          })

          componentLogger.current.info('Métricas finalizadas', finalMetrics)
        }

        // Salvar no modelo adaptativo
        if (adaptiveModelRef.current) {
          adaptiveModelRef.current.saveGameData({
            difficulty,
            accuracy: sessionMetrics.accuracy,
            score: sessionMetrics.score,
            timeSpent: totalTime,
            reason,
          })
        }

        // Enviar métricas comportamentais para o SystemOrchestrator
        if (orchestratorRef.current && userId) {
          const behavioralMetrics = {
            activityId,
            userId,
            reason,
            totalTime,
            score: sessionMetrics.score,
            accuracy: sessionMetrics.accuracy,
            difficulty,
          }

          orchestratorRef.current.sendMetrics(behavioralMetrics)
          componentLogger.current.info('Métricas comportamentais enviadas', behavioralMetrics)
        }

        setShowResults(true)

        return true
      } catch (error) {
        componentLogger.current.error('Erro ao finalizar jogo', error)
        return false
      }
    },
    [difficulty, sessionMetrics, metrics, progress, activityConfig]
  )
  // Registrar sucesso
  const recordSuccess = useCallback(
    (data = {}) => {
      setSessionMetrics((prev) => {
        const newSuccesses = prev.successes + 1
        const newAttempts = prev.attempts + 1
        const newScore = prev.score + (data.points || 10)
        const newAccuracy = (newSuccesses / newAttempts) * 100

        return {
          ...prev,
          successes: newSuccesses,
          attempts: newAttempts,
          score: newScore,
          accuracy: Math.round(newAccuracy),
        }
      })

      // Registrar em métricas
      if (metrics && sessionIdRef.current) {
        metrics.recordSuccess(sessionIdRef.current, data)
      }

      // Registrar em progresso
      if (progress.recordSuccess) {
        progress.recordSuccess(data)
      }

      // 🎯 ENVIAR MÉTRICAS COMPORTAMENTAIS PARA SYSTEMORCHESTRATOR
      if (orchestratorRef.current && sessionIdRef.current) {
        const behavioralMetrics = {
          sessionId: sessionIdRef.current,
          activityId,
          userId,
          eventType: 'success',
          timestamp: Date.now(),
          responseTime: data.responseTime || 0,
          accuracy: sessionMetrics.accuracy,
          score: sessionMetrics.score + (data.points || 10),
          difficulty,
          metadata: data,
        }

        orchestratorRef.current
          .processBehavioralMetrics(sessionIdRef.current, behavioralMetrics)
          .catch((error) =>
            componentLogger.current.error('Erro ao enviar métricas de sucesso:', error)
          )
      }

      // Feedback sonoro
      if (sound?.playSuccess) {
        sound.playSuccess()
      }

      // Vibração
      vibrateSuccess()

      // Anunciar para leitores de tela
      if (accessibilitySettings.screenReaderEnabled) {
        announceToScreenReader('Correto! Muito bem!')
      }

      lastActionRef.current = { type: 'success', timestamp: Date.now(), data }
      componentLogger.current.debug('Sucesso registrado', data)
    },
    [
      metrics,
      progress,
      sound,
      accessibilitySettings,
      activityId,
      userId,
      difficulty,
      sessionMetrics,
    ]
  )
  // Registrar erro
  const recordError = useCallback(
    (data = {}) => {
      setSessionMetrics((prev) => {
        const newErrors = prev.errors + 1
        const newAttempts = prev.attempts + 1
        const newAccuracy = prev.successes > 0 ? (prev.successes / newAttempts) * 100 : 0

        return {
          ...prev,
          errors: newErrors,
          attempts: newAttempts,
          accuracy: Math.round(newAccuracy),
        }
      })

      // Registrar em métricas
      if (metrics && sessionIdRef.current) {
        metrics.recordError(sessionIdRef.current, data)
      }

      // Registrar em progresso
      if (progress.recordError) {
        progress.recordError(data)
      }

      // 🎯 ENVIAR MÉTRICAS COMPORTAMENTAIS PARA SYSTEMORCHESTRATOR
      if (orchestratorRef.current && sessionIdRef.current) {
        const behavioralMetrics = {
          sessionId: sessionIdRef.current,
          activityId,
          userId,
          eventType: 'error',
          timestamp: Date.now(),
          responseTime: data.responseTime || 0,
          errorType: data.errorType || 'unknown',
          accuracy: sessionMetrics.accuracy,
          score: sessionMetrics.score,
          difficulty,
          metadata: data,
        }

        orchestratorRef.current
          .processBehavioralMetrics(sessionIdRef.current, behavioralMetrics)
          .catch((error) =>
            componentLogger.current.error('Erro ao enviar métricas de erro:', error)
          )
      }

      // Feedback sonoro
      if (sound?.playError) {
        sound.playError()
      }

      // Vibração
      vibrateError()

      // Anunciar para leitores de tela
      if (accessibilitySettings.screenReaderEnabled) {
        announceToScreenReader('Tente novamente!')
      }

      lastActionRef.current = { type: 'error', timestamp: Date.now(), data }
      componentLogger.current.debug('Erro registrado', data)
    },
    [
      metrics,
      progress,
      sound,
      accessibilitySettings,
      activityId,
      userId,
      difficulty,
      sessionMetrics,
    ]
  )

  // Alterar dificuldade
  const changeDifficulty = useCallback(
    (newDifficulty) => {
      componentLogger.current.info('Alterando dificuldade', { from: difficulty, to: newDifficulty })
      setDifficulty(newDifficulty)

      // Anunciar mudança
      if (accessibilitySettings.screenReaderEnabled) {
        announceToScreenReader(`Dificuldade alterada para ${newDifficulty}`)
      }
    },
    [difficulty, accessibilitySettings]
  )

  // Mostrar feedback temporário
  const showFeedback = useCallback(
    (message, type = 'info', duration = 3000) => {
      setFeedback({ message, type, timestamp: Date.now() })

      // Anunciar feedback
      if (accessibilitySettings.screenReaderEnabled && type !== 'debug') {
        announceToScreenReader(message)
      }

      // Limpar feedback automaticamente
      setTimeout(() => {
        setFeedback((prev) => (prev?.timestamp === Date.now() ? null : prev))
      }, duration)
    },
    [accessibilitySettings]
  )

  // ==================== EFFECTS ====================

  // Effect de inicialização
  useEffect(() => {
    initializeActivity()
  }, [initializeActivity])

  // Effect de limpeza
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Finalizar sessão se ainda ativa
      if (gameStarted && !gameFinished) {
        finishGame('component_unmount')
      }
    }
  }, [gameStarted, gameFinished, finishGame])

  // Effect de monitoramento de tempo
  useEffect(() => {
    if (!gameStarted || gamePaused) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - (sessionStartRef.current || Date.now())
      setSessionMetrics((prev) => ({
        ...prev,
        timeSpent: elapsed,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, gamePaused])

  // ==================== RETORNO DO HOOK ====================

  return {
    // Estados
    gameStarted,
    gamePaused,
    gameFinished,
    difficulty,
    isLoading,
    feedback,
    showInstructions,
    showResults,
    sessionMetrics,
    accessibilitySettings,
    activityConfig,

    // Dados externos
    userId,
    userDetails,
    config,
    environment,

    // Ações de controle
    startGame,
    pauseGame,
    resumeGame,
    finishGame,
    changeDifficulty,

    // Ações de registro
    recordSuccess,
    recordError,
    showFeedback,

    // Configurações
    setActivityConfig,
    setShowInstructions,
    setShowResults,

    // Utilitários
    sound,
    progress,
    metrics,
    adaptiveModel: adaptiveModelRef.current,
    sessionId: sessionIdRef.current,
    logger: componentLogger.current,

    // Dados calculados
    currentAccuracy: sessionMetrics.accuracy,
    currentScore: sessionMetrics.score,
    elapsedTime: sessionMetrics.timeSpent,
    isActive: gameStarted && !gamePaused && !gameFinished,
  }
}

export default useActivity
