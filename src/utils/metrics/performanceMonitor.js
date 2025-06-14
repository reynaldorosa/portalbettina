// Utilitário para monitoramento de desempenho
// Permite rastrear métricas de desempenho do frontend do Portal Betina

/**
 * Classe para monitoramento de métricas de desempenho
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {      componentsRenderTime: {},
      apiCalls: [],
      resourceLoading: [],
      interactionTiming: {},
      memoryUsage: [],
    };
    
    this.isEnabled =
      (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ||
      (typeof localStorage !== 'undefined' &&
        localStorage.getItem('betina_enable_monitoring') === 'true') ||
      (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost');

    this.initializeMonitoring()
  }

  /**
   * Inicializar monitoramento e interceptadores
   */
  initializeMonitoring() {
    if (!this.isEnabled) return

    // Monitorar carregamento da página
    this.monitorPageLoad()

    // Monitorar chamadas de API
    this.monitorApiCalls()

    // Monitorar carregamento de recursos
    this.monitorResourceLoading()

    // Monitorar memória (quando disponível)
    this.monitorMemory()

    // Relatório periódico
    this.schedulePeriodicReport()
  }

  /**
   * Monitorar tempo de carregamento da página
   */
  monitorPageLoad() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = window.performance.timing
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart
          const dnsTime = timing.domainLookupEnd - timing.domainLookupStart
          const tcpTime = timing.connectEnd - timing.connectStart
          const requestTime = timing.responseEnd - timing.requestStart
          const domProcessingTime = timing.domComplete - timing.domLoading

          console.info(
            '%c📊 Métricas de Carregamento da Página',
            'font-weight: bold; color: #4A90E2'
          )
          console.table({
            'Tempo Total': `${pageLoadTime}ms`,
            DNS: `${dnsTime}ms`,
            'Conexão TCP': `${tcpTime}ms`,
            'Resposta do Servidor': `${requestTime}ms`,
            'Processamento DOM': `${domProcessingTime}ms`,
          })

          // Armazenar métricas para envio posterior
          this.metrics.pageLoad = {
            total: pageLoadTime,
            dns: dnsTime,
            tcp: tcpTime,
            request: requestTime,
            domProcessing: domProcessingTime,
            timestamp: new Date().toISOString(),
          }
        }, 0)
      })
    }
  }

  /**
   * Monitorar chamadas de API
   */
  monitorApiCalls() {
    if (!window.fetch) return

    const originalFetch = window.fetch
    const self = this

    window.fetch = function (input, init) {
      const startTime = performance.now()
      const url = typeof input === 'string' ? input : input.url

      return originalFetch
        .call(this, input, init)
        .then((response) => {
          const endTime = performance.now()
          const duration = endTime - startTime

          // Só registra chamadas à API (ignorar recursos estáticos)
          if (url.includes('/api/')) {
            self.metrics.apiCalls.push({
              url,
              method: init?.method || 'GET',
              status: response.status,
              duration,
              timestamp: new Date().toISOString(),
            })

            // Manter apenas as últimas 50 chamadas
            if (self.metrics.apiCalls.length > 50) {
              self.metrics.apiCalls.shift()
            }
          }

          return response
        })
        .catch((error) => {
          const endTime = performance.now()
          const duration = endTime - startTime

          if (url.includes('/api/')) {
            self.metrics.apiCalls.push({
              url,
              method: init?.method || 'GET',
              error: error.message,
              duration,
              timestamp: new Date().toISOString(),
            })
          }

          throw error
        })
    }
  }

  /**
   * Monitorar carregamento de recursos
   */
  monitorResourceLoading() {
    if (!window.performance || !window.performance.getEntriesByType) return

    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = window.performance.getEntriesByType('resource')

        // Agrupar por tipo
        const resourcesByType = resources.reduce((acc, resource) => {
          const type = this.getResourceType(resource.name)
          if (!acc[type]) acc[type] = []
          acc[type].push({
            name: resource.name,
            duration: Math.round(resource.duration),
            size: resource.transferSize || 0,
          })
          return acc
        }, {})

        // Calcular estatísticas por tipo
        const stats = {}
        Object.keys(resourcesByType).forEach((type) => {
          const items = resourcesByType[type]
          stats[type] = {
            count: items.length,
            totalSize: items.reduce((sum, item) => sum + item.size, 0),
            avgDuration: Math.round(
              items.reduce((sum, item) => sum + item.duration, 0) / items.length
            ),
            slowest: Math.max(...items.map((item) => item.duration)),
          }
        })

        console.info(
          '%c📊 Métricas de Carregamento de Recursos',
          'font-weight: bold; color: #4A90E2'
        )
        console.table(stats)

        // Armazenar para envio
        this.metrics.resourceStats = stats
      }, 0)
    })
  }

  /**
   * Monitorar uso de memória (quando disponível)
   */
  monitorMemory() {
    if (!window.performance || !window.performance.memory) return

    const checkMemory = () => {
      const memory = window.performance.memory
      this.metrics.memoryUsage.push({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        timestamp: new Date().toISOString(),
      })

      // Manter apenas os últimos 50 registros
      if (this.metrics.memoryUsage.length > 50) {
        this.metrics.memoryUsage.shift()
      }
    }

    // Verificar a cada 30 segundos
    setInterval(checkMemory, 30000)
    checkMemory() // Verificar imediatamente
  }

  /**
   * Agendar relatório periódico
   */
  schedulePeriodicReport() {
    // Gerar relatório a cada 5 minutos
    setInterval(
      () => {
        this.generateReport()
      },
      5 * 60 * 1000
    )
  }

  /**
   * Iniciar monitoramento de um componente React
   * @param {string} componentName - Nome do componente
   * @returns {Function} Função para finalizar o monitoramento
   */
  startComponentRender(componentName) {
    if (!this.isEnabled) return () => {}

    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (!this.metrics.componentsRenderTime[componentName]) {
        this.metrics.componentsRenderTime[componentName] = []
      }

      this.metrics.componentsRenderTime[componentName].push({
        duration,
        timestamp: new Date().toISOString(),
      })

      // Manter apenas os últimos 20 registros por componente
      if (this.metrics.componentsRenderTime[componentName].length > 20) {
        this.metrics.componentsRenderTime[componentName].shift()
      }

      // Alertar se render for muito lento (> 100ms)
      if (duration > 100) {
        console.warn(
          `⚠️ Renderização lenta detectada: ${componentName} (${Math.round(duration)}ms)`
        )
      }
    }
  }

  /**
   * Obter tipo de recurso pela URL
   * @param {string} url - URL do recurso
   * @returns {string} Tipo do recurso
   */
  getResourceType(url) {
    const extension = url.split('.').pop().split('?')[0]

    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
      return 'imagens'
    }
    if (['css'].includes(extension)) {
      return 'estilos'
    }
    if (['js'].includes(extension)) {
      return 'scripts'
    }
    if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return 'áudio'
    }
    if (['json'].includes(extension)) {
      return 'dados'
    }
    if (['woff', 'woff2', 'ttf', 'eot'].includes(extension)) {
      return 'fontes'
    }
    return 'outros'
  }

  /**
   * Registrar tempo de interação do usuário
   * @param {string} actionType - Tipo de ação
   * @param {number} duration - Duração em ms
   */
  recordInteraction(actionType, duration) {
    if (!this.isEnabled) return

    if (!this.metrics.interactionTiming[actionType]) {
      this.metrics.interactionTiming[actionType] = []
    }

    this.metrics.interactionTiming[actionType].push({
      duration,
      timestamp: new Date().toISOString(),
    })

    // Manter apenas os últimos 50 registros por tipo
    if (this.metrics.interactionTiming[actionType].length > 50) {
      this.metrics.interactionTiming[actionType].shift()
    }
  }

  /**
   * Gerar relatório completo
   * @returns {Object} Relatório de métricas
   */
  generateReport() {
    if (!this.isEnabled) return null

    // Calculando médias para tempos de renderização de componentes
    const componentStats = {}
    Object.keys(this.metrics.componentsRenderTime).forEach((component) => {
      const times = this.metrics.componentsRenderTime[component]
      componentStats[component] = {
        avg: Math.round(times.reduce((sum, item) => sum + item.duration, 0) / times.length),
        min: Math.round(Math.min(...times.map((item) => item.duration))),
        max: Math.round(Math.max(...times.map((item) => item.duration))),
        count: times.length,
      }
    })

    // Estatísticas de chamadas API
    const apiStats = {
      totalCalls: this.metrics.apiCalls.length,
      avgDuration: Math.round(
        this.metrics.apiCalls.reduce((sum, call) => sum + call.duration, 0) /
          (this.metrics.apiCalls.length || 1)
      ),
      errorRate: Math.round(
        (this.metrics.apiCalls.filter((call) => call.error).length /
          (this.metrics.apiCalls.length || 1)) *
          100
      ),
    }

    // Relatório completo
    const report = {
      timestamp: new Date().toISOString(),
      componentStats,
      apiStats,
      resourceStats: this.metrics.resourceStats || {},
      memoryTrend: this.getMemoryTrend(),
      metrics: this.metrics,
    }

    console.info(
      '%c📊 Relatório de Desempenho Portal Betina',
      'font-weight: bold; color: #4A90E2; font-size: 14px;'
    )
    console.group('Componentes (tempo médio de renderização)')
    console.table(componentStats)
    console.groupEnd()

    console.group('API')
    console.table(apiStats)
    console.groupEnd()

    // Opcional: enviar para backend
    this.sendReportToBackend(report)

    return report
  }

  /**
   * Calcular tendência de uso de memória
   * @returns {Object|null} Estatísticas de uso de memória
   */
  getMemoryTrend() {
    if (!this.metrics.memoryUsage.length) return null

    const usage = this.metrics.memoryUsage
    return {
      current: usage[usage.length - 1].usedJSHeapSize,
      max: Math.max(...usage.map((item) => item.usedJSHeapSize)),
      avgPercent: Math.round(
        (usage.reduce((sum, item) => sum + item.usedJSHeapSize / item.totalJSHeapSize, 0) /
          usage.length) *
          100
      ),
    }
  }

  /**
   * Enviar relatório para o backend (opcional)
   * @param {Object} report - Relatório de métricas
   */
  sendReportToBackend(report) {
    // Verificar se está habilitado o envio para o backend
    if (!this.isEnabled || localStorage.getItem('betina_enable_reporting') !== 'true') {
      return
    }

    // Simplificar o relatório para envio (reduzir tamanho)
    const simplifiedReport = {
      timestamp: report.timestamp,
      componentStats: report.componentStats,
      apiStats: report.apiStats,
      resourceStats: report.resourceStats,
      memoryTrend: report.memoryTrend,
      // Excluir dados brutos completos para reduzir tamanho
    }

    // Enviar para o backend
    fetch('/api/metrics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simplifiedReport),
      // Não aguardar resposta para não bloquear a UI
      keepalive: true,
    }).catch((err) => {
      console.warn('Erro ao enviar métricas:', err)
    })
  }
}

// Criar instância global
const performanceMonitor = new PerformanceMonitor()

// Exportar funções de utilidade
export const startMeasureRender = (componentName) => {
  return performanceMonitor.startComponentRender(componentName)
}

export const recordInteraction = (actionType, duration) => {
  performanceMonitor.recordInteraction(actionType, duration)
}

export const generatePerformanceReport = () => {
  return performanceMonitor.generateReport()
}

export default performanceMonitor
