/**
 * @file useSystemOrchestrator.js
 * @description Hook React para integração com o Sistema Orquestrador
 * Facilita o uso do orquestrador em componentes React
 * @version 1.0.0
 * @created 2025-01-10
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSystemOrchestrator } from '../utils/core/SystemOrchestrator.js'
import { useUser } from '../contexts/UserContext.jsx'

/**
 * Hook para interação com o Sistema Orquestrador
 * @param {Object} options - Opções de configuração
 * @returns {Object} Interface do orquestrador
 */
export const useSystemOrchestrator = (options = {}) => {
  const { userId } = useUser()
  const [orchestratorState, setOrchestratorState] = useState({
    isReady: false,
    isActive: false,
    systemHealth: {},
    activeInterventions: 0,
    lastSync: null,
    error: null,
  })

  const [sessionData, setSessionData] = useState(null)
  const [realTimeInsights, setRealTimeInsights] = useState({})
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState([])
  const [therapeuticInsights, setTherapeuticInsights] = useState({})
  const [accessibilityAdaptations, setAccessibilityAdaptations] = useState({})

  const orchestratorRef = useRef(null)
  const sessionRef = useRef(null)
  const insightsInterval = useRef(null)

  const config = {
    enableRealTimeUpdates: true,
    updateInterval: 5000, // 5 segundos
    enableAdaptiveRecommendations: true,
    enableTherapeuticInsights: true,
    enableAccessibilityAdaptations: true,
    autoStartSession: true,
    ...options,
  }

  /**
   * Inicializa o orquestrador
   */
  useEffect(() => {
    const initializeOrchestrator = async () => {
      try {
        orchestratorRef.current = getSystemOrchestrator()

        if (orchestratorRef.current) {
          const status = orchestratorRef.current.getOrchestratorStatus()
          setOrchestratorState((prev) => ({
            ...prev,
            isReady: true,
            isActive: status.isActive,
            systemHealth: status.systemHealth,
            activeInterventions: status.activeInterventions,
            lastSync: status.lastSync,
          }))

          // Iniciar sessão automática se configurado
          if (config.autoStartSession && userId) {
            await startUserSession()
          }

          // Iniciar atualizações em tempo real
          if (config.enableRealTimeUpdates) {
            startRealTimeUpdates()
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar orquestrador:', error)
        setOrchestratorState((prev) => ({
          ...prev,
          error: error.message,
          isReady: false,
        }))
      }
    }

    initializeOrchestrator()

    // Cleanup
    return () => {
      stopRealTimeUpdates()
      if (sessionRef.current) {
        endUserSession()
      }
    }
  }, [userId])

  /**
   * Inicia sessão do usuário
   */
  const startUserSession = useCallback(async () => {
    if (!orchestratorRef.current || !userId) return

    try {
      const sessionData = {
        sessionId: `session_${userId}_${Date.now()}`,
        userId,
        startTime: Date.now(),
        deviceInfo: getDeviceInfo(),
        userPreferences: getUserPreferences(),
      }

      const sessionResult = await orchestratorRef.current.registerUserSession(sessionData)

      sessionRef.current = sessionData.sessionId
      setSessionData(sessionData)

      console.log('✅ Sessão orquestrada iniciada:', sessionResult)

      return sessionResult
    } catch (error) {
      console.error('Erro ao iniciar sessão orquestrada:', error)
      throw error
    }
  }, [userId])

  /**
   * Finaliza sessão do usuário
   */
  const endUserSession = useCallback(async () => {
    if (!orchestratorRef.current || !sessionRef.current) return

    try {
      // Gerar relatório final da sessão
      const finalReport = await orchestratorRef.current.generateIntegratedReport(
        userId,
        'session_summary'
      )

      console.log('📊 Relatório final da sessão gerado:', finalReport)

      sessionRef.current = null
      setSessionData(null)

      return finalReport
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error)
    }
  }, [userId])

  /**
   * Registra interação do usuário
   */
  const recordInteraction = useCallback(
    async (interactionData) => {
      if (!orchestratorRef.current || !sessionRef.current) return

      try {
        const enrichedInteraction = {
          ...interactionData,
          sessionId: sessionRef.current,
          userId,
          timestamp: Date.now(),
        }

        const result = await orchestratorRef.current.processUserInteraction(enrichedInteraction)

        // Atualizar insights em tempo real
        if (result.therapeuticInsights) {
          setTherapeuticInsights((prev) => ({
            ...prev,
            ...result.therapeuticInsights,
          }))
        }

        if (result.adaptiveRecommendations) {
          setAdaptiveRecommendations((prev) => [
            ...prev.slice(-9), // Manter últimas 10
            ...result.adaptiveRecommendations,
          ])
        }

        if (result.accessibilityAdaptations) {
          setAccessibilityAdaptations((prev) => ({
            ...prev,
            ...result.accessibilityAdaptations,
          }))
        }

        return result
      } catch (error) {
        console.error('Erro ao registrar interação:', error)
        return null
      }
    },
    [userId]
  )

  /**
   * Gera relatório integrado
   */
  const generateReport = useCallback(
    async (reportType = 'comprehensive') => {
      if (!orchestratorRef.current || !userId) return null

      try {
        const report = await orchestratorRef.current.generateIntegratedReport(userId, reportType)
        return report
      } catch (error) {
        console.error('Erro ao gerar relatório:', error)
        return null
      }
    },
    [userId]
  )

  /**
   * Inicia atualizações em tempo real
   */
  const startRealTimeUpdates = useCallback(() => {
    if (insightsInterval.current) return

    insightsInterval.current = setInterval(async () => {
      if (!orchestratorRef.current) return

      try {
        // Atualizar status do orquestrador
        const status = orchestratorRef.current.getOrchestratorStatus()
        setOrchestratorState((prev) => ({
          ...prev,
          isActive: status.isActive,
          systemHealth: status.systemHealth,
          activeInterventions: status.activeInterventions,
          lastSync: status.lastSync,
        }))

        // Atualizar insights em tempo real se houver sessão ativa
        if (sessionRef.current && userId) {
          const insights = await getRealTimeInsights()
          setRealTimeInsights(insights)
        }
      } catch (error) {
        console.warn('Erro nas atualizações em tempo real:', error)
      }
    }, config.updateInterval)
  }, [userId])

  /**
   * Para atualizações em tempo real
   */
  const stopRealTimeUpdates = useCallback(() => {
    if (insightsInterval.current) {
      clearInterval(insightsInterval.current)
      insightsInterval.current = null
    }
  }, [])

  /**
   * Obtém insights em tempo real
   */
  const getRealTimeInsights = useCallback(async () => {
    if (!orchestratorRef.current || !userId) return {}

    try {
      // Aqui você pode implementar a lógica para obter insights específicos
      // Por exemplo, métricas recentes, predições ML, etc.
      const insights = {
        timestamp: Date.now(),
        systemPerformance: orchestratorRef.current.getOrchestratorStatus(),
        userEngagement: await calculateUserEngagement(),
        adaptivePredictions: await getAdaptivePredictions(),
        therapeuticProgress: await getTherapeuticProgress(),
      }

      return insights
    } catch (error) {
      console.error('Erro ao obter insights em tempo real:', error)
      return {}
    }
  }, [userId])

  /**
   * Aplica adaptação em tempo real
   */
  const applyAdaptation = useCallback(
    async (adaptationType, parameters) => {
      if (!orchestratorRef.current) return false

      try {
        // Implementar aplicação de adaptações via orquestrador
        const adaptationResult = await orchestratorRef.current.executeAdaptation({
          type: adaptationType,
          parameters,
          userId,
          sessionId: sessionRef.current,
          timestamp: Date.now(),
        })

        return adaptationResult
      } catch (error) {
        console.error('Erro ao aplicar adaptação:', error)
        return false
      }
    },
    [userId]
  )

  /**
   * Obtém recomendações terapêuticas
   */
  const getTherapeuticRecommendations = useCallback(async () => {
    if (!orchestratorRef.current || !userId) return []

    try {
      const recommendations = await orchestratorRef.current.getTherapeuticRecommendations(userId)
      return recommendations
    } catch (error) {
      console.error('Erro ao obter recomendações terapêuticas:', error)
      return []
    }
  }, [userId])

  /**
   * Funções auxiliares
   */
  const getDeviceInfo = () => ({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: {
      width: window.screen.width,
      height: window.screen.height,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  })

  const getUserPreferences = () => {
    // Obter preferências do localStorage ou contexto
    try {
      return JSON.parse(localStorage.getItem('userPreferences') || '{}')
    } catch {
      return {}
    }
  }

  const calculateUserEngagement = async () => {
    // Implementar cálculo de engajamento
    return {
      level: 'high',
      score: 0.85,
      factors: ['interaction_frequency', 'session_duration', 'task_completion'],
    }
  }

  const getAdaptivePredictions = async () => {
    // Implementar obtenção de predições adaptativas
    return {
      nextDifficulty: 'medium',
      recommendedActivities: ['memory_game', 'color_match'],
      confidenceScore: 0.78,
    }
  }

  const getTherapeuticProgress = async () => {
    // Implementar obtenção de progresso terapêutico
    return {
      overallProgress: 0.72,
      areas: {
        attention: 0.8,
        memory: 0.65,
        socialSkills: 0.7,
      },
    }
  }

  // Interface pública do hook
  return {
    // Estado
    isReady: orchestratorState.isReady,
    isActive: orchestratorState.isActive,
    systemHealth: orchestratorState.systemHealth,
    activeInterventions: orchestratorState.activeInterventions,
    lastSync: orchestratorState.lastSync,
    error: orchestratorState.error,
    sessionData,

    // Insights e dados
    realTimeInsights,
    adaptiveRecommendations,
    therapeuticInsights,
    accessibilityAdaptations,

    // Ações
    startUserSession,
    endUserSession,
    recordInteraction,
    generateReport,
    applyAdaptation,
    getTherapeuticRecommendations,

    // Controle
    startRealTimeUpdates,
    stopRealTimeUpdates,
    getRealTimeInsights,

    // Utilitários
    orchestrator: orchestratorRef.current,
  }
}

export default useSystemOrchestrator
