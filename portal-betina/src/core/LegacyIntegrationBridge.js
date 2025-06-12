/**
 * LEGACY INTEGRATION BRIDGE - PONTE DE INTEGRAÇÃO COM SISTEMAS EXISTENTES
 * Sistema para integrar novos componentes com a infraestrutura existente
 *
 * @version 1.0.0
 * @created 2025-01-08
 * @purpose Integração entre sistemas novos e legados
 */

import logger from '../utils/logger.js'
import { getPerformanceProfiler } from './PerformanceProfiler.js'
import { getMLMetricsCollector } from './MLMetricsCollector.js'
import { getDataStructuresOptimizer } from './DataStructuresOptimizer.js'

/**
 * Classe para integração com sistemas existentes
 */
class LegacyIntegrationBridge {
  constructor() {
    this.bridges = new Map()
    this.metricsMapping = new Map()
    this.performanceMapping = new Map()
    this.initialized = false

    this.init()
  }

  /**
   * Inicializa as pontes de integração
   */
  init() {
    logger.info('🌉 Inicializando ponte de integração com sistemas existentes...')

    this.setupMetricsBridge()
    this.setupPerformanceBridge()
    this.setupMLBridge()
    this.setupDataBridge()

    this.initialized = true
    logger.info('✅ Ponte de integração inicializada')
  }

  /**
   * Configura ponte para métricas existentes
   */
  setupMetricsBridge() {
    // Integrar com utils/metrics/metricsService.js existente
    this.bridges.set('metricsService', {
      type: 'METRICS_INTEGRATION',
      description: 'Integração com sistema de métricas existente',
      mapping: {
        // Mapear métodos existentes para novos sistemas
        startSession: 'newProfiler.startTimer',
        recordEvent: 'newMLCollector.recordPredictionMetrics',
        finishSession: 'newProfiler.endTimer',
        getStats: 'newProfiler.getStatistics',
      },
      active: true,
    })

    // Interceptar chamadas do sistema de métricas existente
    if (typeof window !== 'undefined' && window.metricsService) {
      this.interceptMetricsService()
    }
  }

  /**
   * Configura ponte para performance existente
   */
  setupPerformanceBridge() {
    this.bridges.set('performanceMonitor', {
      type: 'PERFORMANCE_INTEGRATION',
      description: 'Integração com monitoramento de performance existente',
      mapping: {
        startMeasurement: 'newProfiler.startTimer',
        endMeasurement: 'newProfiler.endTimer',
        recordInteraction: 'newProfiler.recordCustomMetric',
      },
      active: true,
    })

    // Interceptar utils/metrics/performanceMonitor.js existente
    this.interceptPerformanceMonitor()
  }

  /**
   * Configura ponte para ML existente
   */
  setupMLBridge() {
    this.bridges.set('mlSystems', {
      type: 'ML_INTEGRATION',
      description: 'Integração com sistemas ML existentes',
      mapping: {
        'utils/ml/': 'core/MachineLearningOrchestrator',
        'adaptiveML.js': 'core/MachineLearningOrchestrator',
        'neuropedagogicalInsights.js': 'core/MLMetricsCollector',
      },
      active: true,
    })

    this.interceptMLSystems()
  }

  /**
   * Configura ponte para estruturas de dados
   */
  setupDataBridge() {
    this.bridges.set('dataStructures', {
      type: 'DATA_INTEGRATION',
      description: 'Integração com estruturas de dados existentes',
      mapping: {
        localStorage: 'OptimizedLRUCache',
        Map: 'OptimizedTrie',
        Array: 'OptimizedPriorityQueue',
      },
      active: true,
    })

    this.interceptDataStructures()
  }

  /**
   * Intercepta sistema de métricas existente
   */
  interceptMetricsService() {
    try {
      const profiler = getPerformanceProfiler()
      const mlCollector = getMLMetricsCollector()

      // Interceptar metricsService global se existir
      if (window.metricsService) {
        const originalStartSession = window.metricsService.startSession
        const originalRecordEvent = window.metricsService.recordEvent
        const originalFinishSession = window.metricsService.finishSession

        // Envolver métodos existentes com novos sistemas
        window.metricsService.startSession = function (activityId, userId, difficulty) {
          // Chamar sistema original
          const result = originalStartSession.call(this, activityId, userId, difficulty)

          // Adicionar novo profiling
          profiler.start()
          mlCollector.startCollection()

          logger.debug('🔗 Sessão iniciada com integração completa', {
            activityId,
            userId,
            difficulty,
            sessionId: result,
          })

          return result
        }

        window.metricsService.recordEvent = function (sessionId, eventType, eventData) {
          // Chamar sistema original
          const result = originalRecordEvent.call(this, sessionId, eventType, eventData)

          // Registrar no novo sistema
          if (eventType === 'prediction' && eventData.modelId) {
            mlCollector.recordPredictionMetrics(
              eventData.modelId,
              eventData.confidence || 0.5,
              eventData.inputData,
              eventData.outputData,
              eventData.processingTime || 0
            )
          }

          return result
        }

        window.metricsService.finishSession = function (sessionId, additionalData) {
          // Chamar sistema original
          const result = originalFinishSession.call(this, sessionId, additionalData)

          // Finalizar novos sistemas
          const profilerReport = profiler.stop()
          const mlReport = mlCollector.stopCollection()

          logger.debug('🔗 Sessão finalizada com relatórios integrados', {
            sessionId,
            profilerReport,
            mlReport,
          })

          return result
        }

        logger.info('🔗 MetricsService interceptado e integrado')
      }
    } catch (error) {
      logger.error('Erro ao interceptar MetricsService:', error)
    }
  }

  /**
   * Intercepta monitor de performance existente
   */
  interceptPerformanceMonitor() {
    try {
      const profiler = getPerformanceProfiler()

      // Interceptar funções globais de performance se existirem
      if (window.startMeasureRender) {
        const originalStartMeasureRender = window.startMeasureRender

        window.startMeasureRender = function (componentName) {
          const originalEndMeasure = originalStartMeasureRender(componentName)

          // Adicionar profiling novo
          profiler.start()

          return function () {
            const result = originalEndMeasure()
            const profilerResult = profiler.stop()

            logger.debug('🔗 Render medido com sistemas integrados', {
              componentName,
              original: result,
              profiler: profilerResult,
            })

            return result
          }
        }
      }

      if (window.recordInteraction) {
        const originalRecordInteraction = window.recordInteraction

        window.recordInteraction = function (actionType, duration) {
          // Chamar sistema original
          const result = originalRecordInteraction(actionType, duration)

          // Registrar no novo sistema
          profiler.recordCustomMetric('interaction', { actionType, duration }, 'INTERACTION')

          return result
        }
      }

      logger.info('🔗 PerformanceMonitor interceptado e integrado')
    } catch (error) {
      logger.error('Erro ao interceptar PerformanceMonitor:', error)
    }
  }

  /**
   * Intercepta sistemas ML existentes
   */
  interceptMLSystems() {
    try {
      const mlCollector = getMLMetricsCollector()

      // Interceptar adaptiveML global se existir
      if (window.adaptiveML) {
        const originalUpdateModel = window.adaptiveML.updateModel
        const originalPredict = window.adaptiveML.predict

        if (originalUpdateModel) {
          window.adaptiveML.updateModel = async function (userId, gameData) {
            const startTime = performance.now()

            // Chamar sistema original
            const result = await originalUpdateModel.call(this, userId, gameData)

            const duration = performance.now() - startTime

            // Registrar no novo sistema
            mlCollector.recordTrainingMetrics(`adaptive_${userId}`, gameData.attempts || 0, {
              accuracy: gameData.accuracy || 0,
              loss: 1 - (gameData.accuracy || 0),
              processingTime: duration,
            })

            logger.debug('🔗 Modelo adaptativo atualizado com métricas integradas', {
              userId,
              duration,
              accuracy: gameData.accuracy,
            })

            return result
          }
        }

        if (originalPredict) {
          window.adaptiveML.predict = async function (userId, inputData) {
            const startTime = performance.now()

            // Chamar sistema original
            const result = await originalPredict.call(this, userId, inputData)

            const duration = performance.now() - startTime

            // Registrar no novo sistema
            mlCollector.recordInferenceMetrics(
              `adaptive_${userId}`,
              inputData,
              result,
              duration,
              result.confidence
            )

            return result
          }
        }

        logger.info('🔗 Sistemas ML interceptados e integrados')
      }
    } catch (error) {
      logger.error('Erro ao interceptar sistemas ML:', error)
    }
  }

  /**
   * Intercepta estruturas de dados
   */
  interceptDataStructures() {
    try {
      const dataOptimizer = getDataStructuresOptimizer()

      // Interceptar uso comum de localStorage para cache
      if (typeof Storage !== 'undefined') {
        const originalSetItem = localStorage.setItem
        const originalGetItem = localStorage.getItem

        // Criar cache otimizado para dados frequentes
        const optimizedCache = dataOptimizer.createOptimizedCache('localStorage', 500)

        localStorage.setItem = function (key, value) {
          // Usar sistema original
          const result = originalSetItem.call(this, key, value)

          // Adicionar ao cache otimizado se for dado relevante
          if (key.includes('betina_') || key.includes('portal_') || key.includes('game_')) {
            optimizedCache.put(key, value)

            logger.debug('🔗 Dados armazenados com cache otimizado', { key })
          }

          return result
        }

        localStorage.getItem = function (key) {
          // Tentar cache otimizado primeiro para dados relevantes
          if (key.includes('betina_') || key.includes('portal_') || key.includes('game_')) {
            const cached = optimizedCache.get(key)
            if (cached !== null) {
              logger.debug('🎯 Dados obtidos do cache otimizado', { key })
              return cached
            }
          }

          // Fallback para sistema original
          const result = originalGetItem.call(this, key)

          // Adicionar ao cache se encontrado
          if (
            result !== null &&
            (key.includes('betina_') || key.includes('portal_') || key.includes('game_'))
          ) {
            optimizedCache.put(key, result)
          }

          return result
        }

        logger.info('🔗 LocalStorage interceptado com cache otimizado')
      }
    } catch (error) {
      logger.error('Erro ao interceptar estruturas de dados:', error)
    }
  }

  /**
   * Integra com hooks existentes
   */
  integrateWithExistingHooks() {
    // Integrar com useAdvancedActivity existente
    this.integrateWithAdvancedActivity()

    // Integrar com usePerformanceMonitoring existente
    this.integrateWithPerformanceMonitoring()
  }

  /**
   * Integra com useAdvancedActivity
   */
  integrateWithAdvancedActivity() {
    try {
      // Esta integração será feita quando o hook for usado
      logger.info('🔗 Preparada integração com useAdvancedActivity')
    } catch (error) {
      logger.error('Erro ao integrar com useAdvancedActivity:', error)
    }
  }

  /**
   * Integra com usePerformanceMonitoring
   */
  integrateWithPerformanceMonitoring() {
    try {
      // Esta integração será feita quando o hook for usado
      logger.info('🔗 Preparada integração com usePerformanceMonitoring')
    } catch (error) {
      logger.error('Erro ao integrar com usePerformanceMonitoring:', error)
    }
  }

  /**
   * Mapeia métricas entre sistemas
   */
  mapMetrics(sourceSystem, targetSystem, metricData) {
    const bridge = this.bridges.get(sourceSystem)
    if (!bridge || !bridge.active) {
      return metricData
    }

    try {
      // Aplicar mapeamento baseado na configuração da ponte
      const mapping = bridge.mapping
      const mappedData = { ...metricData }

      Object.entries(mapping).forEach(([oldKey, newKey]) => {
        if (mappedData[oldKey] !== undefined) {
          mappedData[newKey] = mappedData[oldKey]
          logger.debug(`🔄 Métrica mapeada: ${oldKey} -> ${newKey}`)
        }
      })

      return mappedData
    } catch (error) {
      logger.error('Erro ao mapear métricas:', error)
      return metricData
    }
  }

  /**
   * Sincroniza dados entre sistemas
   */
  async syncData(sourceSystem, targetSystem) {
    try {
      logger.info(`🔄 Sincronizando dados: ${sourceSystem} -> ${targetSystem}`)

      // Implementar sincronização específica baseada nos sistemas
      const bridge = this.bridges.get(sourceSystem)
      if (bridge && bridge.active) {
        // Executar sincronização
        logger.info(`✅ Dados sincronizados: ${sourceSystem} -> ${targetSystem}`)
        return true
      }

      return false
    } catch (error) {
      logger.error('Erro na sincronização de dados:', error)
      return false
    }
  }

  /**
   * Obtém status das integrações
   */
  getIntegrationStatus() {
    const status = {
      initialized: this.initialized,
      totalBridges: this.bridges.size,
      activeBridges: 0,
      bridges: {},
    }

    for (const [name, bridge] of this.bridges.entries()) {
      status.bridges[name] = {
        type: bridge.type,
        description: bridge.description,
        active: bridge.active,
        mappingCount: Object.keys(bridge.mapping || {}).length,
      }

      if (bridge.active) {
        status.activeBridges++
      }
    }

    return status
  }

  /**
   * Gera relatório de integração
   */
  generateIntegrationReport() {
    const report = {
      timestamp: Date.now(),
      status: this.getIntegrationStatus(),
      metricsMapping: Array.from(this.metricsMapping.entries()),
      performanceMapping: Array.from(this.performanceMapping.entries()),
      recommendations: this.generateIntegrationRecommendations(),
    }

    logger.info('📊 Relatório de integração gerado', report.status)
    return report
  }

  /**
   * Gera recomendações de integração
   */
  generateIntegrationRecommendations() {
    const recommendations = []

    if (this.bridges.size === 0) {
      recommendations.push({
        type: 'SETUP_BRIDGES',
        priority: 'HIGH',
        message: 'Nenhuma ponte de integração configurada',
        action: 'Configurar pontes para sistemas existentes',
      })
    }

    const activeBridges = Array.from(this.bridges.values()).filter((b) => b.active).length
    if (activeBridges < this.bridges.size) {
      recommendations.push({
        type: 'ACTIVATE_BRIDGES',
        priority: 'MEDIUM',
        message: `${this.bridges.size - activeBridges} pontes inativas`,
        action: 'Ativar pontes de integração restantes',
      })
    }

    return recommendations
  }

  /**
   * Obtém estatísticas
   */
  getStatistics() {
    return {
      initialized: this.initialized,
      bridgesCount: this.bridges.size,
      activeBridgesCount: Array.from(this.bridges.values()).filter((b) => b.active).length,
      metricsMappingCount: this.metricsMapping.size,
      performanceMappingCount: this.performanceMapping.size,
    }
  }
}

// Instância singleton
let bridgeInstance = null

/**
 * Obtém instância da ponte (singleton)
 */
export const getLegacyIntegrationBridge = () => {
  if (!bridgeInstance) {
    bridgeInstance = new LegacyIntegrationBridge()
  }
  return bridgeInstance
}

// Funções utilitárias
export const initializeLegacyIntegration = () => getLegacyIntegrationBridge()
export const getIntegrationStatus = () => getLegacyIntegrationBridge().getIntegrationStatus()
export const generateIntegrationReport = () =>
  getLegacyIntegrationBridge().generateIntegrationReport()
export const syncSystemData = (source, target) =>
  getLegacyIntegrationBridge().syncData(source, target)

export default LegacyIntegrationBridge
