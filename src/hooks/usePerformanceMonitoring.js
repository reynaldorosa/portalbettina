import { useEffect, useState, useRef } from 'react'
import { startMeasureRender, recordInteraction } from '../utils/metrics/performanceMonitor.js'

/**
 * Hook para monitorar desempenho de componentes React
 * @param {string} componentName - Nome do componente a ser monitorado
 * @returns {Object} Funções para monitoramento
 */
const usePerformanceMonitoring = (componentName) => {
  // Referência para o timestamp de início
  const renderCountRef = useRef(0)
  const interactionTimers = useRef({})

  // Acompanhar remontagens do componente
  useEffect(() => {
    renderCountRef.current += 1

    // Monitorar tempo de renderização
    const endMeasure = startMeasureRender(componentName)

    return () => {
      // Finalizar medição quando componente for desmontado
      endMeasure()
    }
  }, [componentName])

  /**
   * Iniciar medição de interação do usuário
   * @param {string} actionId - Identificador da ação
   */
  const startInteractionTimer = (actionId) => {
    interactionTimers.current[actionId] = performance.now()
  }

  /**
   * Finalizar medição de interação do usuário
   * @param {string} actionId - Identificador da ação
   * @param {string} actionType - Tipo de ação (clique, arraste, etc)
   */
  const endInteractionTimer = (actionId, actionType) => {
    if (interactionTimers.current[actionId]) {
      const startTime = interactionTimers.current[actionId]
      const duration = performance.now() - startTime

      // Registrar interação
      recordInteraction(actionType, duration)

      // Limpar timer
      delete interactionTimers.current[actionId]

      return duration
    }
    return 0
  }

  /**
   * Monitor para operações que possam impactar o desempenho
   * @param {Function} func - Função a ser executada e monitorada
   * @param {string} operationType - Tipo de operação
   * @returns {any} Resultado da função
   */
  const monitorOperation = (func, operationType) => {
    const startTime = performance.now()
    let result

    try {
      result = func()
    } finally {
      const duration = performance.now() - startTime
      recordInteraction(operationType, duration)
    }

    return result
  }

  // Expor funções utilitárias
  return {
    startInteractionTimer,
    endInteractionTimer,
    monitorOperation,
    renderCount: renderCountRef.current,
  }
}

export default usePerformanceMonitoring
