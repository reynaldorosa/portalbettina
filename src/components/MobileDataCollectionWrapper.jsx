// Wrapper de Coleta Automatizada para Dispositivos Móveis
// Integra todos os sistemas de coleta de métricas neuropedagógicas

import React, { useEffect, useRef, useState } from 'react'
import { useMobileDataCollection } from '../hooks/useMobileDataCollection'
import multisensoryMetrics from '../utils/multisensoryAnalysis/multisensoryMetrics'
import globalNeuropedagogicalDB from '../utils/storage/globalNeuropedagogicalDatabase'

const MobileDataCollectionWrapper = ({
  children,
  userId,
  activityId,
  sessionConfig = {},
  onDataCollected,
  onSessionComplete,
}) => {
  const [sessionId, setSessionId] = useState(null)
  const [isCollecting, setIsCollecting] = useState(false)
  const [dataStats, setDataStats] = useState({
    touchEvents: 0,
    sensorReadings: 0,
    neurodivergenceIndicators: 0,
    syncStatus: 'idle',
  })

  const sessionStartTime = useRef(null)
  const dataCollectionInterval = useRef(null)
  const lastSyncTime = useRef(Date.now())

  // Configurações específicas para coleta móvel
  const mobileConfig = {
    collectTouchData: true,
    collectSensorData: true,
    collectLocationData: sessionConfig.enableLocation || false,
    touchSampleRate: 60,
    sensorSampleRate: 30,
    syncInterval: 30000, // 30 segundos
    ...sessionConfig,
  }

  // Hook de coleta móvel
  const { getSessionStats, captureContextSnapshot, touchDataCount } = useMobileDataCollection(
    isCollecting,
    mobileConfig
  )

  // Inicializar sessão de coleta
  useEffect(() => {
    if (userId && !sessionId) {
      initializeSession()
    }

    return () => {
      if (sessionId) {
        finalizeSession()
      }
    }
  }, [userId])

  // Inicializar sessão
  const initializeSession = async () => {
    try {
      console.log('🚀 Iniciando sessão de coleta de dados móveis...')

      // Inicializar banco de dados global
      const newSessionId = await globalNeuropedagogicalDB.startSession(userId, {
        activityId,
        deviceType: detectDeviceType(),
        orientation: getScreenOrientation(),
        ...mobileConfig,
      })

      // Inicializar coleta de métricas multissensoriais
      multisensoryMetrics.startMetricsCollection(newSessionId, userId)

      setSessionId(newSessionId)
      setIsCollecting(true)
      sessionStartTime.current = Date.now()

      // Coletar contexto inicial
      const initialContext = captureContextSnapshot()
      await globalNeuropedagogicalDB.recordMetrics('session_start', {
        context: initialContext,
        activityId,
        config: mobileConfig,
      })

      // Iniciar coleta periódica de estatísticas
      startPeriodicDataCollection()

      console.log(`✅ Sessão iniciada: ${newSessionId}`)
    } catch (error) {
      console.error('❌ Erro ao inicializar sessão:', error)
    }
  }

  // Finalizar sessão
  const finalizeSession = async () => {
    if (!sessionId) return

    try {
      console.log('🏁 Finalizando sessão de coleta...')

      setIsCollecting(false)

      // Parar coleta periódica
      if (dataCollectionInterval.current) {
        clearInterval(dataCollectionInterval.current)
        dataCollectionInterval.current = null
      }

      // Coletar dados finais
      const finalStats = getSessionStats()
      const finalReport = multisensoryMetrics.stopMetricsCollection()

      // Registrar dados finais no banco global
      await globalNeuropedagogicalDB.recordMetrics('session_end', {
        finalStats,
        finalReport,
        sessionDuration: Date.now() - sessionStartTime.current,
      })

      // Sincronizar dados
      await globalNeuropedagogicalDB.syncToCloud()

      // Finalizar sessão no banco
      await globalNeuropedagogicalDB.endSession()

      // Callback para componente pai
      if (onSessionComplete) {
        onSessionComplete({
          sessionId,
          finalStats,
          finalReport,
        })
      }

      console.log('✅ Sessão finalizada com sucesso')
    } catch (error) {
      console.error('❌ Erro ao finalizar sessão:', error)
    } finally {
      setSessionId(null)
    }
  }

  // Iniciar coleta periódica de dados
  const startPeriodicDataCollection = () => {
    dataCollectionInterval.current = setInterval(async () => {
      if (!isCollecting || !sessionId) return

      try {
        // Coletar estatísticas da sessão atual
        const stats = getSessionStats()

        // Coletar métricas multissensoriais
        const currentMetrics = {
          touchMetrics: multisensoryMetrics.sessionMetrics.touchMetrics,
          sensorData: multisensoryMetrics.sessionMetrics.sensorData,
          neurodivergenceMetrics: multisensoryMetrics.sessionMetrics.neurodivergenceMetrics,
          temporalMetrics: multisensoryMetrics.sessionMetrics.temporalMetrics,
        }

        // Registrar no banco global
        await globalNeuropedagogicalDB.recordTouchMetrics(currentMetrics.touchMetrics)
        await globalNeuropedagogicalDB.recordSensorMetrics(currentMetrics.sensorData)
        await globalNeuropedagogicalDB.recordNeurodivergenceMetrics(
          currentMetrics.neurodivergenceMetrics
        )

        // Atualizar estatísticas
        setDataStats({
          touchEvents: currentMetrics.touchMetrics.touchEvents?.length || 0,
          sensorReadings: Object.values(currentMetrics.sensorData).reduce(
            (sum, arr) => sum + (arr?.length || 0),
            0
          ),
          neurodivergenceIndicators: Object.values(currentMetrics.neurodivergenceMetrics).reduce(
            (sum, arr) => sum + (arr?.length || 0),
            0
          ),
          syncStatus: 'synced',
        })

        // Callback para componente pai
        if (onDataCollected) {
          onDataCollected({
            sessionId,
            stats,
            dataStats,
          })
        }

        lastSyncTime.current = Date.now()
      } catch (error) {
        console.error('❌ Erro na coleta periódica:', error)
        setDataStats((prev) => ({ ...prev, syncStatus: 'error' }))
      }
    }, mobileConfig.syncInterval)
  }

  // Detectar padrões comportamentais específicos
  useEffect(() => {
    if (!isCollecting) return

    // Monitorar mudanças de orientação
    const handleOrientationChange = () => {
      setTimeout(() => {
        multisensoryMetrics.recordNeurodivergenceMetric('adaptation_strategy', {
          type: 'orientation_change',
          newOrientation: getScreenOrientation(),
          timestamp: Date.now(),
          context: 'comfort_seeking',
        })
      }, 100)
    }

    // Monitorar perda/ganho de foco
    const handleVisibilityChange = () => {
      const isHidden = document.hidden
      const eventType = isHidden ? 'focus_lost' : 'focus_regained'

      multisensoryMetrics.recordNeurodivergenceMetric('attention_shift', {
        type: eventType,
        timestamp: Date.now(),
        trigger: isHidden ? 'app_backgrounded' : 'app_foregrounded',
        sessionDuration: Date.now() - sessionStartTime.current,
      })
    }

    // Monitorar mudanças na conectividade
    const handleOnlineChange = () => {
      multisensoryMetrics.recordNeurodivergenceMetric('environmental_change', {
        type: 'connectivity_change',
        online: navigator.onLine,
        timestamp: Date.now(),
      })
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnlineChange)
    window.addEventListener('offline', handleOnlineChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnlineChange)
      window.removeEventListener('offline', handleOnlineChange)
    }
  }, [isCollecting])

  // Monitoramento de performance e detecção de problemas
  useEffect(() => {
    if (!isCollecting) return

    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          multisensoryMetrics.recordNeurodivergenceMetric('performance_metric', {
            type: 'page_load',
            duration: entry.loadEventEnd - entry.loadEventStart,
            timestamp: Date.now(),
          })
        }

        if (entry.entryType === 'longtask') {
          multisensoryMetrics.recordNeurodivergenceMetric('performance_metric', {
            type: 'long_task',
            duration: entry.duration,
            timestamp: Date.now(),
            intensity: Math.min(entry.duration / 50, 100), // Long task pode indicar frustração
          })
        }
      })
    })

    try {
      performanceObserver.observe({ entryTypes: ['navigation', 'longtask'] })
    } catch (error) {
      console.warn('Performance Observer não suportado:', error)
    }

    return () => {
      performanceObserver.disconnect()
    }
  }, [isCollecting])

  // Interface de controle para desenvolvimento/debug
  const DebugInterface = () => {
    if (process.env.NODE_ENV !== 'development') return null

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          borderRadius: '0 0 0 10px',
        }}
      >
        <div>📊 Sessão: {sessionId?.substr(-8) || 'Nenhuma'}</div>
        <div>👆 Toques: {dataStats.touchEvents}</div>
        <div>📱 Sensores: {dataStats.sensorReadings}</div>
        <div>🧠 Indicadores: {dataStats.neurodivergenceIndicators}</div>
        <div>🔄 Sync: {dataStats.syncStatus}</div>
        <div>⏱️ Ativo: {isCollecting ? '✅' : '❌'}</div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {children}
      <DebugInterface />
    </div>
  )
}

// Funções utilitárias
function detectDeviceType() {
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

function getScreenOrientation() {
  if (screen.orientation) {
    return screen.orientation.angle === 0 || screen.orientation.angle === 180
      ? 'portrait'
      : 'landscape'
  }
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

export default MobileDataCollectionWrapper
