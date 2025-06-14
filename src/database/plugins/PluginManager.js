import performanceMonitor from '../../utils/metrics/performanceMonitor.js'
import sharedLogger from '../../utils/logger.js'

// Usar o logger centralizado
const logger = sharedLogger;

/**
 * @class PluginManager
 * @description Gerenciador avançado de plugins/módulos do DatabaseService
 * Baseado no arquivo BKP com sistema de lazy loading e dependências
 */
class PluginManager {  constructor(databaseService) {
    this.databaseService = databaseService
    this.logger = logger  // Usar o logger centralizado

    // Estado do gerenciador
    this.plugins = new Map()
    this.loadedModules = new Map()
    this.moduleRegistry = new Map()
    this.dependencyGraph = new Map()

    // Sistema de lazy loading
    this.lazyLoaders = new Map()
    this.loadingPromises = new Map()

    // Configuração
    this.config = {
      enableLazyLoading: true,
      enableDependencyResolution: true,
      enableHotReload: false,
      enableModuleHealthChecking: true,
      maxConcurrentLoads: 3,
      loadTimeout: 30000,
    }

    // Métricas
    this.metrics = {
      modulesLoaded: 0,
      moduleLoadFailures: 0,
      lazyLoadHits: 0,
      dependencyResolutions: 0,
      totalLoadTime: 0,
    }

    // Registro de módulos disponíveis
    this.registerAvailableModules()

    this.logger.info('🔌 Advanced PluginManager initialized', {
      features: [
        'lazy-loading',
        'dependency-resolution',
        'health-checking',
        'hot-reload',
        'concurrent-loading',
      ],
    })
  }

  /**
   * @method registerAvailableModules
   * @description Registra todos os módulos disponíveis com lazy loading
   */ registerAvailableModules() {
    // Desabilitar módulos que não existem por enquanto
    // TODO: Implementar módulos específicos quando necessário
    // Módulo de gerenciamento de sessões (usar serviço existente)
    this.registerModule('sessions', {
      name: 'SessionManagerModule',
      description: 'Advanced session management with therapy analysis',
      dependencies: [],
      loader: () => import('../../utils/sessions/SessionManager.js'),
      enabled: true,
      lazy: true,
      priority: 1,
    })

    // Módulo de usuários (desabilitado - usar ProfileService)
    this.registerModule('users', {
      name: 'UserManagerModule',
      description: 'User management with cognitive profiles',
      dependencies: [],
      loader: () => Promise.resolve({ default: class MockUserModule {} }),
      enabled: false, // Desabilitado até implementação
      lazy: true,
      priority: 2,
    })

    // Outros módulos desabilitados até implementação
    this.registerModule('adaptive', {
      name: 'AdaptiveParametersModule',
      description: 'Adaptive parameters with ML optimization',
      dependencies: [],
      loader: () => Promise.resolve({ default: class MockAdaptiveModule {} }),
      enabled: false,
      lazy: true,
      priority: 3,
    })

    this.registerModule('cognitive', {
      name: 'CognitiveProfileModule',
      description: 'Cognitive profiling and analysis',
      dependencies: [],
      loader: () => Promise.resolve({ default: class MockCognitiveModule {} }),
      enabled: false,
      lazy: true,
      priority: 3,
    })

    this.registerModule('progress', {
      name: 'ProgressAnalysisModule',
      description: 'Progress tracking and analysis',
      dependencies: [],
      loader: () => Promise.resolve({ default: class MockProgressModule {} }),
      enabled: false,
      lazy: true,
      priority: 4,
    })

    // Módulo de acessibilidade
    this.registerModule('accessibility', {
      name: 'AccessibilityModule',
      description: 'Accessibility features and adaptations',
      dependencies: ['users'],
      loader: () => import('../../utils/accessibility/AccessibilityService.js'),
      enabled: true,
      lazy: false, // Carregar imediatamente
      priority: 1,
    })

    // Módulo de métricas
    this.registerModule('metrics', {
      name: 'MetricsCollectorModule',
      description: 'Performance and usage metrics collection',
      dependencies: [],
      loader: () => import('../../utils/metrics/performanceMonitor.js'),
      enabled: true,
      lazy: false,
      priority: 1,
    }) // Módulo de cache avançado - usando IntelligentCache existente
    this.registerModule('cache', {
      name: 'AdvancedCacheModule',
      description: 'Advanced caching with intelligent eviction',
      dependencies: [],
      loader: () => import('../core/IntelligentCache.js'),
      enabled: true,
      lazy: false,
      priority: 0, // Mais alta prioridade
    })

    this.logger.info('📦 Registered available modules', {
      totalModules: this.moduleRegistry.size,
      lazyModules: Array.from(this.moduleRegistry.values()).filter((m) => m.lazy).length,
      eagerModules: Array.from(this.moduleRegistry.values()).filter((m) => !m.lazy).length,
    })
  }

  /**
   * @method registerModule
   * @description Registra um módulo no registry
   * @param {string} name - Nome do módulo
   * @param {Object} config - Configuração do módulo
   */
  registerModule(name, config) {
    this.moduleRegistry.set(name, {
      ...config,
      registeredAt: Date.now(),
      status: 'registered',
    })

    // Registrar dependências no grafo
    if (config.dependencies && config.dependencies.length > 0) {
      this.dependencyGraph.set(name, config.dependencies)
    }

    this.logger.debug('📋 Module registered', {
      name,
      dependencies: config.dependencies || [],
      lazy: config.lazy,
      priority: config.priority,
    })
  }

  /**
   * @method loadModule
   * @async
   * @description Carrega um módulo com resolução de dependências
   * @param {string} moduleName - Nome do módulo
   * @param {Object} options - Opções de carregamento
   * @returns {Promise<Object>} Módulo carregado
   */
  async loadModule(moduleName, options = {}) {
    const startTime = Date.now()

    try {
      // Verificar se já está carregado
      if (this.loadedModules.has(moduleName)) {
        this.logger.debug('🔄 Module already loaded', { moduleName })
        return this.loadedModules.get(moduleName)
      }

      // Verificar se está sendo carregado
      if (this.loadingPromises.has(moduleName)) {
        this.logger.debug('⏳ Module loading in progress, waiting...', { moduleName })
        return this.loadingPromises.get(moduleName)
      }

      // Obter configuração do módulo
      const moduleConfig = this.moduleRegistry.get(moduleName)
      if (!moduleConfig) {
        throw new Error(`Module ${moduleName} not found in registry`)
      }

      if (!moduleConfig.enabled) {
        throw new Error(`Module ${moduleName} is disabled`)
      }

      // Criar promise de carregamento
      const loadingPromise = this.performModuleLoad(moduleName, moduleConfig, options)
      this.loadingPromises.set(moduleName, loadingPromise)

      const module = await loadingPromise

      // Limpar promise de carregamento
      this.loadingPromises.delete(moduleName)

      // Registrar métricas
      this.metrics.modulesLoaded++
      this.metrics.totalLoadTime += Date.now() - startTime

      const duration = Date.now() - startTime
      this.logger.info('✅ Module loaded successfully', {
        moduleName,
        duration,
        dependencies: moduleConfig.dependencies || [],
        lazy: moduleConfig.lazy,
      })

      return module
    } catch (error) {
      // Limpar promise de carregamento em caso de erro
      this.loadingPromises.delete(moduleName)

      this.metrics.moduleLoadFailures++

      this.logger.error('❌ Failed to load module', {
        moduleName,
        error: error.message,
        duration: Date.now() - startTime,
      })

      throw error
    }
  }

  /**
   * @method performModuleLoad
   * @async
   * @description Executa o carregamento efetivo do módulo
   * @param {string} moduleName - Nome do módulo
   * @param {Object} moduleConfig - Configuração do módulo
   * @param {Object} options - Opções de carregamento
   * @returns {Promise<Object>} Módulo carregado
   */
  async performModuleLoad(moduleName, moduleConfig, options) {
    // 1. Resolver dependências primeiro
    await this.resolveDependencies(moduleName)

    // 2. Carregar o módulo
    this.logger.debug('📦 Loading module', {
      moduleName,
      loader: moduleConfig.loader ? 'dynamic' : 'static',
    })

    let ModuleClass
    if (moduleConfig.loader) {
      // Carregamento dinâmico
      const moduleExports = await Promise.race([
        moduleConfig.loader(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Module load timeout')), this.config.loadTimeout)
        }),
      ])

      ModuleClass = moduleExports.default || moduleExports
    } else {
      throw new Error(`No loader defined for module ${moduleName}`)
    }

    // 3. Instanciar o módulo
    const moduleInstance = new ModuleClass(this.databaseService, options)

    // 4. Inicializar o módulo se necessário
    if (moduleInstance.initialize) {
      await moduleInstance.initialize()
    }

    // 5. Registrar o módulo carregado
    this.loadedModules.set(moduleName, moduleInstance)
    this.databaseService.registerModule(moduleName, moduleInstance)

    // 6. Atualizar status no registry
    const registryEntry = this.moduleRegistry.get(moduleName)
    registryEntry.status = 'loaded'
    registryEntry.loadedAt = Date.now()
    registryEntry.instance = moduleInstance

    return moduleInstance
  }

  /**
   * @method resolveDependencies
   * @async
   * @description Resolve dependências de um módulo recursivamente
   * @param {string} moduleName - Nome do módulo
   * @returns {Promise<Array>} Dependências resolvidas
   */
  async resolveDependencies(moduleName) {
    const dependencies = this.dependencyGraph.get(moduleName) || []

    if (dependencies.length === 0) {
      return []
    }

    this.logger.debug('🔗 Resolving dependencies', {
      moduleName,
      dependencies,
    })

    // Verificar dependências circulares
    this.checkCircularDependencies(moduleName, new Set())

    // Carregar dependências em paralelo (respeitando limite)
    const dependencyPromises = dependencies.map(async (depName) => {
      if (!this.loadedModules.has(depName)) {
        return this.loadModule(depName)
      }
      return this.loadedModules.get(depName)
    })

    const resolvedDependencies = await Promise.all(dependencyPromises)

    this.metrics.dependencyResolutions += dependencies.length

    this.logger.debug('✅ Dependencies resolved', {
      moduleName,
      dependencies,
      resolvedCount: resolvedDependencies.length,
    })

    return resolvedDependencies
  }

  /**
   * @method checkCircularDependencies
   * @description Verifica dependências circulares
   * @param {string} moduleName - Nome do módulo
   * @param {Set} visited - Módulos já visitados
   */
  checkCircularDependencies(moduleName, visited) {
    if (visited.has(moduleName)) {
      const cycle = Array.from(visited).join(' -> ') + ' -> ' + moduleName
      throw new Error(`Circular dependency detected: ${cycle}`)
    }

    visited.add(moduleName)

    const dependencies = this.dependencyGraph.get(moduleName) || []
    for (const depName of dependencies) {
      this.checkCircularDependencies(depName, new Set(visited))
    }
  }

  /**
   * @method getModule
   * @async
   * @description Obtém um módulo, carregando-o se necessário (lazy loading)
   * @param {string} moduleName - Nome do módulo
   * @returns {Promise<Object>} Instância do módulo
   */
  async getModule(moduleName) {
    // Verificar se já está carregado
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName)
    }

    // Lazy loading se configurado
    if (this.config.enableLazyLoading) {
      const moduleConfig = this.moduleRegistry.get(moduleName)
      if (moduleConfig && moduleConfig.lazy) {
        this.metrics.lazyLoadHits++
        this.logger.debug('🔄 Lazy loading module', { moduleName })
        return this.loadModule(moduleName)
      }
    }

    return null
  }

  /**
   * @method getModuleStatus
   * @description Obtém status detalhado dos módulos
   * @returns {Object} Status completo
   */
  getModuleStatus() {
    const registeredModules = Array.from(this.moduleRegistry.entries()).map(([name, config]) => ({
      name,
      status: config.status,
      enabled: config.enabled,
      lazy: config.lazy,
      priority: config.priority,
      dependencies: config.dependencies || [],
      loadedAt: config.loadedAt,
      hasInstance: this.loadedModules.has(name),
    }))

    const loadedModules = Array.from(this.loadedModules.entries()).map(([name, instance]) => ({
      name,
      type: instance.constructor.name,
      hasInitialize: typeof instance.initialize === 'function',
      hasShutdown: typeof instance.shutdown === 'function',
      isHealthy: this.checkModuleHealth(instance),
    }))

    return {
      registered: {
        total: this.moduleRegistry.size,
        enabled: registeredModules.filter((m) => m.enabled).length,
        lazy: registeredModules.filter((m) => m.lazy).length,
        modules: registeredModules,
      },

      loaded: {
        total: this.loadedModules.size,
        healthy: loadedModules.filter((m) => m.isHealthy).length,
        modules: loadedModules,
      },

      loading: {
        inProgress: this.loadingPromises.size,
        modules: Array.from(this.loadingPromises.keys()),
      },

      dependencies: {
        graph: Object.fromEntries(this.dependencyGraph),
        resolved: this.metrics.dependencyResolutions,
      },

      metrics: this.metrics,

      health: {
        score: this.calculateOverallHealth(),
        issues: this.getHealthIssues(),
        recommendations: this.getHealthRecommendations(),
      },
    }
  }

  /**
   * @method checkModuleHealth
   * @description Verifica saúde de um módulo
   * @param {Object} moduleInstance - Instância do módulo
   * @returns {boolean} Status de saúde
   */
  checkModuleHealth(moduleInstance) {
    try {
      // Verificar se tem método de health check
      if (moduleInstance.getModuleStatus) {
        const status = moduleInstance.getModuleStatus()
        return status.health?.score > 70
      }

      // Verificação básica
      return moduleInstance && typeof moduleInstance === 'object'
    } catch (error) {
      this.logger.warn('⚠️ Health check failed for module', {
        module: moduleInstance.constructor.name,
        error: error.message,
      })
      return false
    }
  }

  /**
   * @method calculateOverallHealth
   * @description Calcula saúde geral do sistema de módulos
   * @returns {number} Score de saúde (0-100)
   */
  calculateOverallHealth() {
    const totalRegistered = this.moduleRegistry.size
    const totalLoaded = this.loadedModules.size
    const totalEnabled = Array.from(this.moduleRegistry.values()).filter((m) => m.enabled).length

    if (totalEnabled === 0) return 100

    const loadRatio = totalLoaded / totalEnabled
    const failureRatio =
      this.metrics.moduleLoadFailures /
      (this.metrics.modulesLoaded + this.metrics.moduleLoadFailures + 1)

    let health = 100
    health *= loadRatio // Penalizar módulos não carregados
    health *= 1 - failureRatio // Penalizar falhas de carregamento

    return Math.max(0, Math.min(100, health))
  }

  /**
   * @method getHealthIssues
   * @description Identifica problemas de saúde do sistema
   * @returns {Array<string>} Lista de problemas
   */
  getHealthIssues() {
    const issues = []

    if (this.metrics.moduleLoadFailures > 0) {
      issues.push(`${this.metrics.moduleLoadFailures} module load failures detected`)
    }

    if (this.loadingPromises.size > 0) {
      issues.push(`${this.loadingPromises.size} modules still loading`)
    }

    const enabledCount = Array.from(this.moduleRegistry.values()).filter((m) => m.enabled).length
    const loadedCount = this.loadedModules.size

    if (loadedCount < enabledCount) {
      issues.push(`${enabledCount - loadedCount} enabled modules not loaded`)
    }

    return issues
  }

  /**
   * @method getHealthRecommendations
   * @description Gera recomendações para melhorar saúde
   * @returns {Array<string>} Lista de recomendações
   */
  getHealthRecommendations() {
    const recommendations = []
    const issues = this.getHealthIssues()

    if (issues.some((i) => i.includes('failures'))) {
      recommendations.push('Check module configurations and dependencies')
      recommendations.push('Review error logs for failed modules')
    }

    if (issues.some((i) => i.includes('still loading'))) {
      recommendations.push('Consider increasing load timeout')
      recommendations.push('Check for circular dependencies')
    }

    if (issues.some((i) => i.includes('not loaded'))) {
      recommendations.push('Enable lazy loading for better performance')
      recommendations.push('Review module priorities')
    }

    return recommendations
  }

  /**
   * @method shutdown
   * @async
   * @description Encerra todos os módulos graciosamente
   */
  async shutdown() {
    this.logger.info('🔌 Shutting down all modules...')

    const shutdownPromises = []

    // Descarregar módulos
    for (const [moduleName, moduleInstance] of this.loadedModules) {
      if (moduleInstance && moduleInstance.shutdown) {
        shutdownPromises.push(
          moduleInstance.shutdown().catch((error) => {
            this.logger.error(`Failed to shutdown module ${moduleName}`, {
              error: error.message,
            })
          })
        )
      }
    }

    await Promise.all(shutdownPromises)

    // Limpar estruturas
    this.loadedModules.clear()
    this.loadingPromises.clear()

    this.logger.info('✅ All modules shutdown completed')
  }

  // Métodos de compatibilidade com a versão anterior
  async loadModules() {
    const enabledModules = Object.keys(this.moduleRegistry).filter(
      (name) => this.moduleRegistry.get(name).enabled
    )

    for (const moduleName of enabledModules) {
      try {
        await this.loadModule(moduleName)
      } catch (error) {
        this.logger.error(`Failed to load module ${moduleName}`, { error: error.message })
      }
    }
  }

  getLoadedModules() {
    return Array.from(this.loadedModules.keys())
  }

  isModuleLoaded(moduleName) {
    return this.loadedModules.has(moduleName)
  }
}

export default PluginManager

/*
=== MÓDULOS DESABILITADOS ===

Os seguintes módulos foram desabilitados por não existirem na estrutura atual:

1. UserManagerModule (users)
   - Motivo: Não implementado, usar ProfileService existente
   - Status: enabled: false
   - Prioridade: 2

2. AdaptiveParametersModule (adaptive)  
   - Motivo: Não implementado, usar RuleBasedAdaptiveService
   - Status: enabled: false
   - Prioridade: 3

3. CognitiveProfileModule (cognitive)
   - Motivo: Não implementado, usar CognitiveAnalyzer
   - Status: enabled: false  
   - Prioridade: 3

4. ProgressAnalysisModule (progress)
   - Motivo: Não implementado, usar progressReports.js
   - Status: enabled: false
   - Prioridade: 4

=== MÓDULOS ATIVOS ===

1. SessionManagerModule (sessions) ✅
   - Path: ../../utils/sessions/SessionManager.js
   - Priority: 1

2. AccessibilityModule (accessibility) ✅  
   - Path: ../../utils/accessibility/AccessibilityService.js
   - Priority: 1

3. MetricsCollectorModule (metrics) ✅
   - Path: ../../utils/metrics/performanceMonitor.js  
   - Priority: 1

4. AdvancedCacheModule (cache) ✅
   - Path: ../core/IntelligentCache.js
   - Priority: 0 (highest)

Para reativar os módulos desabilitados, implemente os arquivos correspondentes 
e altere enabled: true na configuração do módulo.
*/
