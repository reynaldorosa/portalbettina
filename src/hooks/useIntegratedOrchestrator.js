/**
 * @file useIntegratedOrchestrator.js
 * @description Hook para usar o SystemOrchestrator com sistema de profiles integrado
 * Facilita o uso da integração completa no frontend
 */

import { useState, useEffect, useCallback } from 'react'
import { DatabaseServiceAdapter } from '../../database/DatabaseServiceAdapter.js'
import { SystemOrchestrator } from '../../utils/core/SystemOrchestrator.js'
import logger from '../../utils/metrics/performanceMonitor.js'

/**
 * Hook para orquestrador integrado com profiles
 */
export const useIntegratedOrchestrator = (config = {}) => {
  const [orchestrator, setOrchestrator] = useState(null)
  const [dbAdapter, setDbAdapter] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [profilesInterface, setProfilesInterface] = useState(null)

  /**
   * Inicializa o sistema integrado
   */
  const initialize = useCallback(async () => {
    if (isLoading || isInitialized) return

    setIsLoading(true)
    setError(null)

    try {
      logger.info('🚀 Inicializando sistema integrado...')

      // Criar adapter de database
      const adapter = new DatabaseServiceAdapter(config)
      await adapter.initialize()
      setDbAdapter(adapter)

      // Criar orquestrador com adapter
      const orch = new SystemOrchestrator(adapter, {
        enableProfileManagement: true,
        enableProfileAnalysis: true,
        enableUserProfileIntegration: true,
        ...config
      })

      // Inicializar orquestrador
      await orch.initialize()
      setOrchestrator(orch)

      // Obter interface de profiles
      const profiles = adapter.getProfilesInterface()
      setProfilesInterface(profiles)

      setIsInitialized(true)
      logger.info('✅ Sistema integrado inicializado com sucesso')

    } catch (err) {
      setError(err.message)
      logger.error('❌ Erro ao inicializar sistema integrado:', err)
    } finally {
      setIsLoading(false)
    }
  }, [config, isLoading, isInitialized])

  /**
   * Despacha evento para o orquestrador
   */
  const dispatchEvent = useCallback(async (type, data) => {
    if (!orchestrator) {
      throw new Error('Orchestrator not initialized')
    }

    return await orchestrator.processEvent({ type, data })
  }, [orchestrator])

  /**
   * Cria um profile e notifica o orquestrador
   */
  const createProfile = useCallback(async (type, profileData, options = {}) => {
    if (!profilesInterface) {
      throw new Error('Profiles interface not available')
    }

    try {
      // Criar profile
      const profile = await profilesInterface.createProfile(type, profileData, options)

      // Notificar orquestrador
      await dispatchEvent('profile_created', {
        profileId: profile.id,
        type,
        data: profile
      })

      return profile
    } catch (err) {
      logger.error('❌ Erro ao criar profile:', err)
      throw err
    }
  }, [profilesInterface, dispatchEvent])

  /**
   * Atualiza um profile e notifica o orquestrador
   */
  const updateProfile = useCallback(async (profileId, updates, options = {}) => {
    if (!profilesInterface) {
      throw new Error('Profiles interface not available')
    }

    try {
      // Atualizar profile
      const profile = await profilesInterface.updateProfile(profileId, updates, options)

      // Notificar orquestrador
      await dispatchEvent('profile_updated', {
        profileId,
        updates,
        data: profile
      })

      return profile
    } catch (err) {
      logger.error('❌ Erro ao atualizar profile:', err)
      throw err
    }
  }, [profilesInterface, dispatchEvent])

  /**
   * Analisa um profile e notifica o orquestrador
   */
  const analyzeProfile = useCallback(async (profileId, timeframe = '30days') => {
    if (!profilesInterface) {
      throw new Error('Profiles interface not available')
    }

    try {
      // Executar análise
      const insights = await profilesInterface.analyzeBehaviorPatterns(profileId, timeframe)

      // Notificar orquestrador
      await dispatchEvent('profile_analyzed', {
        profileId,
        timeframe,
        insights
      })

      return insights
    } catch (err) {
      logger.error('❌ Erro ao analisar profile:', err)
      throw err
    }
  }, [profilesInterface, dispatchEvent])

  /**
   * Registra interação de usuário
   */
  const trackUserInteraction = useCallback(async (userId, profileId, interactionType, data = {}) => {
    try {
      // Notificar orquestrador
      await dispatchEvent('user_profile_interaction', {
        userId,
        profileId,
        type: interactionType,
        duration: data.duration || 0,
        ...data
      })

      return true
    } catch (err) {
      logger.error('❌ Erro ao rastrear interação:', err)
      throw err
    }
  }, [dispatchEvent])

  /**
   * Obtém estatísticas do sistema
   */
  const getSystemStats = useCallback(() => {
    if (!orchestrator) return null
    return orchestrator.getUnifiedStatistics()
  }, [orchestrator])

  /**
   * Obtém status de saúde do sistema
   */
  const getHealthStatus = useCallback(async () => {
    if (!dbAdapter || !orchestrator) return null

    try {
      const dbHealth = await dbAdapter.healthCheck()
      const orchHealth = orchestrator.getStatus()

      return {
        database: dbHealth,
        orchestrator: orchHealth,
        integrated: isInitialized,
        timestamp: new Date().toISOString()
      }
    } catch (err) {
      logger.error('❌ Erro ao verificar saúde:', err)
      return null
    }
  }, [dbAdapter, orchestrator, isInitialized])

  // Auto-inicializar quando o hook é montado
  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    // Estado
    isInitialized,
    isLoading,
    error,

    // Instâncias
    orchestrator,
    dbAdapter,
    profilesInterface,

    // Métodos principais
    initialize,
    dispatchEvent,

    // Métodos de profiles
    createProfile,
    updateProfile,
    analyzeProfile,
    trackUserInteraction,

    // Métodos de monitoramento
    getSystemStats,
    getHealthStatus,

    // Métodos diretos de profiles (conveniência)
    getProfile: profilesInterface?.getProfile,
    getProfiles: profilesInterface?.getProfiles,
    createAnonymousUser: profilesInterface?.createAnonymousUser,
    syncProfiles: profilesInterface?.syncProfiles,
  }
}

export default useIntegratedOrchestrator
