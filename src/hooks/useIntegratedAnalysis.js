/**
 * @file useIntegratedAnalysis.js
 * @description Hook personalizado para análise integrada emocional e neuroplasticidade
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import IntegratedAnalysisOrchestrator from '../utils/emotionalAnalysis/IntegratedAnalysisOrchestrator.js'
import databaseService from '../database/core/DatabaseService.js'

export const useIntegratedAnalysis = (userProfile = {}, config = {}) => {
  const orchestratorRef = useRef(null)

  // Estados
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [realtimeData, setRealtimeData] = useState(null)
  const [sessionResults, setSessionResults] = useState(null)
  const [interventions, setInterventions] = useState([])
  const [optimizations, setOptimizations] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  /**
   * Inicializa o orquestrador
   */
  const initialize = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!orchestratorRef.current) {
        orchestratorRef.current = new IntegratedAnalysisOrchestrator(databaseService, config)
      }

      const success = await orchestratorRef.current.initialize(userProfile)
      setIsInitialized(success)

      if (!success) {
        throw new Error('Falha ao inicializar análise integrada')
      }
    } catch (err) {
      setError(err.message)
      console.error('❌ Erro ao inicializar análise integrada:', err)
    } finally {
      setLoading(false)
    }
  }, [userProfile, config])

  /**
   * Inicia uma nova sessão
   */
  const startSession = useCallback(
    async (sessionConfig) => {
      try {
        setLoading(true)
        setError(null)

        if (!orchestratorRef.current || !isInitialized) {
          throw new Error('Orquestrador não inicializado')
        }

        const session = await orchestratorRef.current.startSession({
          userId: userProfile.id || 'anonymous',
          ...sessionConfig,
        })

        setCurrentSession(session)
        setIsAnalyzing(true)
        setSessionResults(null)

        return session
      } catch (err) {
        setError(err.message)
        console.error('❌ Erro ao iniciar sessão:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [orchestratorRef, isInitialized, userProfile]
  )

  /**
   * Finaliza sessão atual
   */
  const endSession = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!orchestratorRef.current || !currentSession) {
        throw new Error('Nenhuma sessão ativa')
      }

      const results = await orchestratorRef.current.endSession()
      setSessionResults(results)
      setCurrentSession(null)
      setIsAnalyzing(false)
      setRealtimeData(null)

      return results
    } catch (err) {
      setError(err.message)
      console.error('❌ Erro ao finalizar sessão:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [orchestratorRef, currentSession])

  /**
   * Processa evento em tempo real
   */
  const processRealtimeEvent = useCallback(
    async (eventData) => {
      try {
        if (!orchestratorRef.current || !isAnalyzing) {
          return null
        }

        const analysis = await orchestratorRef.current.processRealtimeEvent(eventData)
        setRealtimeData(analysis)

        // Atualizar filas de intervenções e otimizações
        const queues = orchestratorRef.current.getQueues()
        setInterventions(queues.interventions)
        setOptimizations(queues.optimizations)

        return analysis
      } catch (err) {
        console.error('❌ Erro no processamento em tempo real:', err)
        return null
      }
    },
    [orchestratorRef, isAnalyzing]
  )

  /**
   * Obtém status atual do sistema
   */
  const getStatus = useCallback(() => {
    if (!orchestratorRef.current) {
      return { isActive: false, isAnalyzing: false }
    }

    return orchestratorRef.current.getStatus()
  }, [orchestratorRef])

  /**
   * Processa intervenção
   */
  const processIntervention = useCallback((interventionId) => {
    setInterventions((prev) => prev.filter((intervention) => intervention.id !== interventionId))
  }, [])

  /**
   * Processa otimização
   */
  const processOptimization = useCallback((optimizationId) => {
    setOptimizations((prev) => prev.filter((optimization) => optimization.id !== optimizationId))
  }, [])

  /**
   * Limpa filas processadas
   */
  const clearProcessedQueues = useCallback(() => {
    if (orchestratorRef.current) {
      orchestratorRef.current.clearProcessedQueues()
      setInterventions([])
      setOptimizations([])
    }
  }, [orchestratorRef])

  /**
   * Atualiza perfil do usuário
   */
  const updateUserProfile = useCallback(
    (newProfile) => {
      if (orchestratorRef.current) {
        orchestratorRef.current.emotionalService?.updateUserProfile(newProfile)
        orchestratorRef.current.neuroplasticityService?.updateUserProfile(newProfile)
      }
    },
    [orchestratorRef]
  )

  /**
   * Obtém métricas de análise
   */
  const getAnalysisMetrics = useCallback(() => {
    if (!orchestratorRef.current) return null

    return {
      emotional: orchestratorRef.current.emotionalService?.getRealtimeMetrics() || [],
      neuroplasticity:
        orchestratorRef.current.neuroplasticityService?.getNeuroplasticityMetrics() || [],
    }
  }, [orchestratorRef])

  /**
   * Exporta relatório da sessão
   */
  const exportSessionReport = useCallback(
    async (sessionId, format = 'json') => {
      try {
        if (!orchestratorRef.current) {
          throw new Error('Orquestrador não inicializado')
        }

        // Implementar exportação de relatório
        const emotional = await orchestratorRef.current.emotionalService?.exportAnalysisReport(
          userProfile.id,
          new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
          new Date()
        )

        const neuroplasticity =
          await orchestratorRef.current.neuroplasticityService?.exportNeuroplasticityReport(
            userProfile.id,
            new Date(Date.now() - 24 * 60 * 60 * 1000),
            new Date()
          )

        return {
          format,
          timestamp: new Date(),
          emotional,
          neuroplasticity,
          integrated: sessionResults,
        }
      } catch (err) {
        setError(err.message)
        console.error('❌ Erro ao exportar relatório:', err)
        throw err
      }
    },
    [orchestratorRef, userProfile, sessionResults]
  )
  // Inicializar automaticamente quando o hook é montado
  useEffect(() => {
    if (databaseService && !isInitialized && !loading) {
      initialize()
    }
  }, [isInitialized, loading, initialize])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (orchestratorRef.current && currentSession) {
        orchestratorRef.current.endSession().catch(console.error)
      }
    }
  }, [])

  // Polling para atualizar filas (opcional)
  useEffect(() => {
    if (!isAnalyzing) return

    const interval = setInterval(() => {
      if (orchestratorRef.current) {
        const queues = orchestratorRef.current.getQueues()
        setInterventions(queues.interventions)
        setOptimizations(queues.optimizations)
      }
    }, 2000) // Atualizar a cada 2 segundos

    return () => clearInterval(interval)
  }, [isAnalyzing])

  return {
    // Estados
    isInitialized,
    currentSession,
    isAnalyzing,
    realtimeData,
    sessionResults,
    interventions,
    optimizations,
    error,
    loading,

    // Métodos
    initialize,
    startSession,
    endSession,
    processRealtimeEvent,
    getStatus,
    processIntervention,
    processOptimization,
    clearProcessedQueues,
    updateUserProfile,
    getAnalysisMetrics,
    exportSessionReport,

    // Utilitários
    hasActiveSession: !!currentSession,
    hasInterventions: interventions.length > 0,
    hasOptimizations: optimizations.length > 0,
    isReady: isInitialized && !loading && !error,
  }
}

export default useIntegratedAnalysis
