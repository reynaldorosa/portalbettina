import { useState, useEffect, useCallback } from 'react'
import databaseService from '../database/core/DatabaseService.js'

export const calculateScore = (successes, attempts) => {
  return successes * 10 - attempts * 2
}

export const updateProgress = (successes, attempts) => {
  const score = calculateScore(successes, attempts)
  return { successes, attempts, score }
}

const useProgress = (activityId) => {
  const [progress, setProgress] = useState({
    score: 0,
    attempts: 0,
    successes: 0,
    accuracy: 0,
    timeSpent: 0,
    level: 1,
    stars: 0,
  })

  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [activityStartTime, setActivityStartTime] = useState(null)
  const [pauseStartTime, setPauseStartTime] = useState(null)
  const [totalPausedTime, setTotalPausedTime] = useState(0)
  const [sessionId, setSessionId] = useState(null)
  const [timeUpdateInterval, setTimeUpdateInterval] = useState(null)
  const [userId, setUserId] = useState(null)

  // Carregar ID do usuário do localStorage
  useEffect(() => {
    const storedId = localStorage.getItem('betina_user_id')
    if (storedId) {
      setUserId(storedId)
    }
  }, []) // Carregar progresso do banco de dados
  useEffect(() => {
    if (activityId && userId) {
      const loadProgress = async () => {
        try {
          const sessions = await databaseService.getGameSessions(userId, activityId, 1)
          if (sessions && sessions.length > 0) {
            const latestSession = sessions[0]
            const progressData = {
              score: latestSession.score || 0,
              attempts: latestSession.total_attempts || 0,
              successes: latestSession.correct_answers || 0,
              timeSpent: latestSession.time_spent || 0,
              level: latestSession.data?.level || 1,
              stars: latestSession.data?.stars || 0,
              difficulty: latestSession.difficulty || 'MEDIUM',
            }
            console.log('Progresso carregado do banco de dados:', progressData)
            setProgress(progressData)
          } else {
            // Se não há sessões, usar valores padrão
            console.log('Nenhuma sessão encontrada no banco de dados, usando valores padrão')
          }
        } catch (error) {
          console.warn('Erro ao carregar progresso do banco de dados:', error.message)
        }

        setStartTime(Date.now())
      }

      loadProgress()
    }
  }, [activityId, userId]) // Salvar progresso no banco de dados
  const saveProgress = useCallback(
    async (newProgress) => {
      if (activityId && userId) {
        const progressToSave = {
          ...progress,
          ...newProgress,
          lastPlayed: new Date().toISOString(),
        }

        // ✅ Atualizar estado local IMEDIATAMENTE para reatividade da UI
        setProgress(progressToSave)

        // Salvar no banco de dados
        try {
          const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
          const accuracy =
            progressToSave.attempts > 0
              ? Math.min(
                  100,
                  Math.round((progressToSave.successes / progressToSave.attempts) * 100)
                )
              : 0

          await databaseService.saveGameSession({
            user_id: userId,
            game_id: activityId,
            difficulty: progressToSave.difficulty || 'MEDIUM',
            score: progressToSave.score || 0,
            accuracy,
            time_spent: timeSpent,
            completed: isCompleted,
            correct_answers: progressToSave.successes || 0,
            total_attempts: progressToSave.attempts || 0,
            data: {
              level: progressToSave.level || 1,
              stars: progressToSave.stars || 0,
              ...newProgress,
            },
          })
          console.log('Progresso salvo no banco de dados com sucesso')
        } catch (error) {
          console.error('Erro ao salvar progresso no banco de dados:', error.message)
        }
      }
    },
    [activityId, progress, userId, startTime, isCompleted]
  )
  // Incrementar sucessos
  const incrementSuccesses = useCallback(() => {
    const newSuccesses = progress.successes + 1
    saveProgress({ successes: newSuccesses })
  }, [progress.successes, saveProgress])

  // Completar atividade
  const completeActivity = useCallback(() => {
    setIsCompleted(true)
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    saveProgress({ timeSpent, completed: true })
  }, [startTime, saveProgress])

  // Atualizar pontuação
  const updateScore = useCallback(
    (newScore) => {
      saveProgress({ score: newScore })
    },
    [saveProgress]
  )

  // Atualizar nível
  const updateLevel = useCallback(
    (newLevel) => {
      saveProgress({ level: newLevel })
    },
    [saveProgress]
  )

  // Incrementar tentativas
  const incrementAttempts = useCallback(() => {
    const newAttempts = progress.attempts + 1
    saveProgress({ attempts: newAttempts })
  }, [progress.attempts, saveProgress]) // Registrar sucesso
  const recordSuccess = useCallback(
    (additionalPoints = 0) => {
      const newSuccesses = progress.successes + 1
      const newAttempts = progress.attempts + 1
      // Adicionar pontos base (10) mais quaisquer pontos adicionais por bônus
      const newScore = progress.score + 10 + additionalPoints
      const accuracy = Math.round((newSuccesses / newAttempts) * 100)

      let stars = 0
      if (accuracy >= 90) stars = 3
      else if (accuracy >= 70) stars = 2
      else if (accuracy >= 50) stars = 1

      const newProgress = {
        successes: newSuccesses,
        attempts: newAttempts,
        score: newScore,
        accuracy: accuracy,
        stars,
      }

      // Atualizar estado local imediatamente para reatividade da UI
      setProgress((prev) => ({
        ...prev,
        ...newProgress,
      }))

      // Salvar no banco/localStorage
      saveProgress(newProgress)

      console.log(
        `✅ Sucesso registrado: Pontos: ${newScore} (+${10 + additionalPoints}), Precisão: ${accuracy}%, Estrelas: ${stars}`
      )

      // Verificar se completou a atividade
      if (newSuccesses >= 5) {
        // Critério de conclusão: 5 sucessos
        setIsCompleted(true)
      }

      return newScore
    },
    [progress, saveProgress]
  )
  // Registrar erro
  const recordError = useCallback(() => {
    const newAttempts = progress.attempts + 1
    const accuracy =
      progress.successes > 0 ? Math.round((progress.successes / newAttempts) * 100) : 0

    let stars = 0
    if (accuracy >= 90) stars = 3
    else if (accuracy >= 70) stars = 2
    else if (accuracy >= 50) stars = 1

    const newProgress = {
      attempts: newAttempts,
      accuracy: accuracy,
      stars,
    }

    // Atualizar estado local imediatamente para reatividade da UI
    setProgress((prev) => ({
      ...prev,
      ...newProgress,
    }))

    // Salvar no banco/localStorage
    saveProgress(newProgress)

    console.log(
      `❌ Erro registrado: Tentativas: ${newAttempts}, Precisão: ${accuracy}%, Estrelas: ${stars}`
    )
  }, [progress, saveProgress])
  // Calcular tempo gasto (legacy - mantido para compatibilidade)
  const updateTimeSpent = useCallback(() => {
    if (startTime) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      saveProgress({ timeSpent })
    }
  }, [startTime, saveProgress])

  // ======== SISTEMA DE RASTREAMENTO DE TEMPO AVANÇADO ========

  // Iniciar sessão de atividade com tempo preciso
  const startActivity = useCallback(async () => {
    const now = Date.now()
    setActivityStartTime(now)
    setStartTime(now)
    setTotalPausedTime(0)
    setPauseStartTime(null)

    // Gerar ID único para a sessão
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(sessionId)

    // Salvar início da sessão no banco se possível
    if (userId) {
      try {
        await databaseService.saveGameSession({
          user_id: userId,
          game_id: activityId,
          session_id: sessionId,
          start_time: new Date(now).toISOString(),
          status: 'started',
          difficulty: progress.difficulty || 'MEDIUM',
          score: 0,
          accuracy: 0,
          time_spent: 0,
          completed: false,
          correct_answers: 0,
          total_attempts: 0,
          data: {
            session_type: 'timed_activity',
            timing_enabled: true,
          },
        })

        console.log(`🕐 Sessão iniciada: ${sessionId} às ${new Date(now).toLocaleTimeString()}`)
      } catch (error) {
        console.error('Erro ao salvar início da sessão:', error)
      }
    }

    // Iniciar intervalo de atualização de tempo
    const interval = setInterval(() => {
      updateCurrentTime()
    }, 1000) // Atualizar a cada segundo

    setTimeUpdateInterval(interval)

    return sessionId
  }, [userId, activityId, progress.difficulty])
  // Pausar atividade
  const pauseActivity = useCallback(() => {
    if (!activityStartTime) {
      console.warn('Tentativa de pausar atividade que não foi iniciada')
      return
    }

    if (!pauseStartTime) {
      setPauseStartTime(Date.now())
      console.log(`⏸️ Atividade pausada às ${new Date().toLocaleTimeString()}`)

      // Parar o intervalo de atualização
      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval)
        setTimeUpdateInterval(null)
      }
    }
  }, [pauseStartTime, timeUpdateInterval, activityStartTime])
  // Retomar atividade
  const resumeActivity = useCallback(() => {
    if (!activityStartTime) {
      console.warn('Tentativa de retomar atividade que não foi iniciada')
      return
    }

    if (!pauseStartTime) {
      console.warn('Tentativa de retomar atividade que não estava pausada')
      return
    }

    if (pauseStartTime) {
      const pauseDuration = Date.now() - pauseStartTime
      setTotalPausedTime((prev) => prev + pauseDuration)
      setPauseStartTime(null)

      console.log(`▶️ Atividade retomada. Pausada por ${Math.floor(pauseDuration / 1000)}s`)

      // Reiniciar intervalo de atualização
      const interval = setInterval(() => {
        updateCurrentTime()
      }, 1000)

      setTimeUpdateInterval(interval)
    }
  }, [pauseStartTime, activityStartTime]) // Finalizar atividade com métricas detalhadas
  const finishActivity = useCallback(
    async (isCompleted = true, multisensoryData = null) => {
      // Se não há activityStartTime, apenas limpar estados sem erro
      if (!activityStartTime) {
        // Silenciosamente limpar estados sem poluir console
        setActivityStartTime(null)
        setStartTime(null)
        setTotalPausedTime(0)
        setPauseStartTime(null)
        setSessionId(null)

        if (timeUpdateInterval) {
          clearInterval(timeUpdateInterval)
          setTimeUpdateInterval(null)
        }

        return {
          isActive: false,
          isPaused: false,
          totalTime: 0,
          activeTime: 0,
          pausedTime: 0,
          efficiency: 100,
          message: 'Nenhuma atividade ativa para finalizar',
        }
      }

      const endTime = Date.now()
      const totalTime = endTime - activityStartTime
      const activeTime = totalTime - totalPausedTime

      // Parar intervalos
      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval)
        setTimeUpdateInterval(null)
      }

      const timeMetrics = {
        sessionId,
        startTime: new Date(activityStartTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        totalTimeMs: totalTime,
        activeTimeMs: activeTime,
        pausedTimeMs: totalPausedTime,
        totalTimeSeconds: Math.floor(totalTime / 1000),
        activeTimeSeconds: Math.floor(activeTime / 1000),
        pausedTimeSeconds: Math.floor(totalPausedTime / 1000),
        efficiency: totalTime > 0 ? (activeTime / totalTime) * 100 : 100,
      }

      console.log('🏁 Atividade finalizada:', timeMetrics)

      // Salvar dados finais no banco
      if (userId && sessionId) {
        try {
          const finalSessionData = {
            user_id: userId,
            game_id: activityId,
            session_id: sessionId,
            difficulty: progress.difficulty || 'MEDIUM',
            score: progress.score,
            accuracy:
              progress.attempts > 0
                ? Math.min(100, Math.round((progress.successes / progress.attempts) * 100))
                : 0,
            time_spent: timeMetrics.activeTimeSeconds,
            completed: isCompleted,
            correct_answers: progress.successes,
            total_attempts: progress.attempts,
            end_time: timeMetrics.endTime,
            status: 'completed',
            data: {
              ...timeMetrics,
              session_type: multisensoryData ? 'advanced_multisensory' : 'timed_activity',
              level: progress.level,
              stars: progress.stars,
              // Incluir dados multissensoriais no campo data (JSONB)
              ...(multisensoryData && { multisensoryData }),
            },
          }

          await databaseService.saveGameSession(finalSessionData)
          console.log(
            '💾 Dados da sessão salvos com sucesso' +
              (multisensoryData ? ' (incluindo métricas multissensoriais)' : '')
          )
        } catch (error) {
          console.error('Erro ao salvar dados finais da sessão:', error)
        }
      }

      // Reset dos estados de timing
      setActivityStartTime(null)
      setStartTime(null)
      setTotalPausedTime(0)
      setPauseStartTime(null)
      setSessionId(null)

      return timeMetrics
    },
    [
      activityStartTime,
      totalPausedTime,
      timeUpdateInterval,
      sessionId,
      userId,
      activityId,
      progress,
      isCompleted,
    ]
  )
  // Atualizar tempo atual
  const updateCurrentTime = useCallback(() => {
    if (!activityStartTime) {
      // Silenciosamente falha para não poluir o console, já que é chamado frequentemente
      return
    }

    if (activityStartTime && !pauseStartTime) {
      const currentTime = Date.now()
      const activeTime = currentTime - activityStartTime - totalPausedTime
      const activeTimeSeconds = Math.floor(activeTime / 1000)

      setProgress((prev) => ({
        ...prev,
        timeSpent: activeTimeSeconds,
      }))
    }
  }, [activityStartTime, pauseStartTime, totalPausedTime])
  // Obter métricas de tempo em tempo real
  const getCurrentTimeMetrics = useCallback(() => {
    if (!activityStartTime) {
      return {
        isActive: false,
        isPaused: false,
        totalTime: 0,
        activeTime: 0,
        pausedTime: 0,
        efficiency: 100, // Valor padrão
        message: 'Atividade não iniciada', // Mensagem informativa
      }
    }

    const currentTime = Date.now()
    const totalTime = currentTime - activityStartTime
    const activeTime =
      totalTime - totalPausedTime - (pauseStartTime ? currentTime - pauseStartTime : 0)
    const efficiency = totalTime > 0 ? Math.round((activeTime / totalTime) * 100) : 100

    return {
      isActive: true,
      isPaused: !!pauseStartTime,
      totalTime: Math.floor(totalTime / 1000),
      activeTime: Math.floor(activeTime / 1000),
      pausedTime: Math.floor(
        (totalPausedTime + (pauseStartTime ? currentTime - pauseStartTime : 0)) / 1000
      ),
      sessionId,
      efficiency: totalTime > 0 ? (activeTime / totalTime) * 100 : 100,
    }
  }, [activityStartTime, totalPausedTime, pauseStartTime, sessionId])

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval)
      }
    }
  }, [timeUpdateInterval])
  // Resetar progresso da sessão atual (mantendo a pontuação acumulada)
  const resetSession = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      // Mantém o score existente em vez de zerar
      attempts: 0,
      successes: 0,
      timeSpent: 0,
    }))
    setIsCompleted(false)
    setStartTime(Date.now())
    console.log('Sessão resetada, mantendo pontuação acumulada:', progress.score)
  }, [progress.score])

  // Subir de nível
  const levelUp = useCallback(() => {
    const newLevel = progress.level + 1
    saveProgress({ level: newLevel })
  }, [progress.level, saveProgress])

  // Calcular estatísticas
  const getStats = useCallback(() => {
    const accuracy = progress.attempts > 0 ? (progress.successes / progress.attempts) * 100 : 0
    const averageTime = progress.successes > 0 ? progress.timeSpent / progress.successes : 0

    return {
      accuracy: Math.round(accuracy),
      averageTime: Math.round(averageTime),
      totalGames: Math.floor(progress.successes / 5), // Cada 5 sucessos = 1 jogo completo
      bestStreak: calculateBestStreak(),
    }
  }, [progress])

  // Calcular melhor sequência (implementação simplificada)
  const calculateBestStreak = useCallback(() => {
    // Para uma implementação mais robusta, seria necessário armazenar o histórico de tentativas
    return Math.min(progress.successes, 10) // Simplificado
  }, [progress.successes])

  // Obter mensagem de encorajamento
  const getEncouragementMessage = useCallback(() => {
    const accuracy = progress.attempts > 0 ? (progress.successes / progress.attempts) * 100 : 0

    if (accuracy >= 90) return '🌟 Incrível! Você é um gênio!'
    if (accuracy >= 70) return '🎉 Muito bem! Continue assim!'
    if (accuracy >= 50) return '👍 Bom trabalho! Está melhorando!'
    if (progress.attempts > 0) return '💪 Continue tentando! Você consegue!'
    return '🚀 Vamos começar esta aventura!'
  }, [progress])
  // Resetar progresso
  const resetProgress = useCallback(() => {
    const initialProgress = {
      score: 0,
      attempts: 0,
      successes: 0,
      timeSpent: 0,
      level: 1,
      stars: 0,
    }
    setProgress(initialProgress)
    setStartTime(Date.now())
    setIsCompleted(false)
    console.log('Progresso resetado para valores iniciais')
  }, [activityId])

  return {
    // Estados básicos
    progress,
    isCompleted,

    // Funções básicas de progresso
    incrementAttempts,
    incrementSuccesses,
    completeActivity,
    updateScore,
    updateLevel,
    recordSuccess,
    recordError,
    updateTimeSpent,
    resetSession,
    levelUp,
    getStats,
    getEncouragementMessage,
    saveProgress,
    resetProgress,

    // ======== SISTEMA DE TIMING AVANÇADO ========
    // Controle de sessão
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,

    // Métricas de tempo
    getCurrentTimeMetrics,

    // Estados de timing
    sessionId,
    activityStartTime,
    isActivityActive: !!activityStartTime,
    isActivityPaused: !!pauseStartTime,

    // Informações de tempo formatadas
    getFormattedTime: () => {
      const metrics = getCurrentTimeMetrics()
      return {
        active: formatTime(metrics.activeTime),
        total: formatTime(metrics.totalTime),
        paused: formatTime(metrics.pausedTime),
        efficiency: `${metrics.efficiency.toFixed(1)}%`,
      }
    },
  }
}

// Função utilitária para formatar tempo
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${secs}s`
  }
}

export default useProgress
