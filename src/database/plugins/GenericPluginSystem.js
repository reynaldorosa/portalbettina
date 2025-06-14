/**
 * @file GenericPluginSystem.js
 * @description Sistema genérico de plugins com hooks, middleware e eventos
 * Movido de src/database/PluginManager.js para melhor organização
 */

import performanceMonitor from '../../utils/metrics/performanceMonitor.js'

export class GenericPluginSystem {
  constructor() {
    this.plugins = new Map()
    this.hooks = new Map()
    this.middleware = []
    this.pluginState = new Map()
    this.dependencies = new Map()
    this.loadOrder = []

    // Eventos do sistema
    this.events = new Map()
    this.eventListeners = new Map()

    performanceMonitor.log('GenericPluginSystem initialized')
  }

  // **Registro e Carregamento de Plugins**
  async registerPlugin(pluginConfig) {
    try {
      const {
        name,
        version = '1.0.0',
        description = '',
        author = '',
        dependencies = [],
        hooks = {},
        middleware = [],
        events = {},
        initialize,
        destroy,
        config = {},
      } = pluginConfig

      if (!name) {
        throw new Error('Plugin name is required')
      }

      if (this.plugins.has(name)) {
        throw new Error(`Plugin ${name} is already registered`)
      }

      // Verificar dependências
      const missingDeps = dependencies.filter((dep) => !this.plugins.has(dep))
      if (missingDeps.length > 0) {
        throw new Error(`Missing dependencies: ${missingDeps.join(', ')}`)
      }

      const plugin = {
        name,
        version,
        description,
        author,
        dependencies,
        hooks,
        middleware,
        events,
        initialize,
        destroy,
        config,
        state: 'registered',
        loadTime: null,
        error: null,
      }

      this.plugins.set(name, plugin)
      this.dependencies.set(name, dependencies)
      this.pluginState.set(name, 'registered')

      performanceMonitor.log('Plugin registered', {
        name,
        version,
        dependencies: dependencies.length,
      })

      return true
    } catch (error) {
      performanceMonitor.error('Error registering plugin', {
        name: pluginConfig.name,
        error: error.message,
      })
      return false
    }
  }

  async loadPlugin(name) {
    try {
      const plugin = this.plugins.get(name)
      if (!plugin) {
        throw new Error(`Plugin ${name} not found`)
      }

      if (plugin.state === 'loaded') {
        performanceMonitor.debug('Plugin already loaded', { name })
        return true
      }

      // Carregar dependências primeiro
      for (const dep of plugin.dependencies) {
        await this.loadPlugin(dep)
      }

      const startTime = Date.now()

      // Registrar hooks
      this.registerPluginHooks(name, plugin.hooks)

      // Registrar middleware
      this.registerPluginMiddleware(name, plugin.middleware)

      // Registrar eventos
      this.registerPluginEvents(name, plugin.events)

      // Inicializar plugin
      if (plugin.initialize && typeof plugin.initialize === 'function') {
        await plugin.initialize(this.createPluginContext(name))
      }

      plugin.state = 'loaded'
      plugin.loadTime = Date.now() - startTime
      this.pluginState.set(name, 'loaded')

      // Adicionar à ordem de carregamento
      if (!this.loadOrder.includes(name)) {
        this.loadOrder.push(name)
      }

      performanceMonitor.log('Plugin loaded successfully', {
        name,
        loadTime: plugin.loadTime,
        dependencies: plugin.dependencies.length,
      })

      return true
    } catch (error) {
      const plugin = this.plugins.get(name)
      if (plugin) {
        plugin.state = 'error'
        plugin.error = error.message
        this.pluginState.set(name, 'error')
      }

      performanceMonitor.error('Error loading plugin', {
        name,
        error: error.message,
      })
      return false
    }
  }

  async unloadPlugin(name) {
    try {
      const plugin = this.plugins.get(name)
      if (!plugin) {
        throw new Error(`Plugin ${name} not found`)
      }

      if (plugin.state !== 'loaded') {
        performanceMonitor.debug('Plugin not loaded', { name })
        return true
      }

      // Verificar dependentes
      const dependents = this.getDependents(name)
      if (dependents.length > 0) {
        throw new Error(`Cannot unload plugin ${name}. Dependents: ${dependents.join(', ')}`)
      }

      // Destruir plugin
      if (plugin.destroy && typeof plugin.destroy === 'function') {
        await plugin.destroy(this.createPluginContext(name))
      }

      // Remover hooks
      this.unregisterPluginHooks(name)

      // Remover middleware
      this.unregisterPluginMiddleware(name)

      // Remover eventos
      this.unregisterPluginEvents(name)

      plugin.state = 'unloaded'
      this.pluginState.set(name, 'unloaded')

      // Remover da ordem de carregamento
      const index = this.loadOrder.indexOf(name)
      if (index > -1) {
        this.loadOrder.splice(index, 1)
      }

      performanceMonitor.log('Plugin unloaded successfully', { name })
      return true
    } catch (error) {
      performanceMonitor.error('Error unloading plugin', {
        name,
        error: error.message,
      })
      return false
    }
  }

  // **Sistema de Hooks**
  registerPluginHooks(pluginName, hooks) {
    Object.entries(hooks).forEach(([hookName, handler]) => {
      if (!this.hooks.has(hookName)) {
        this.hooks.set(hookName, [])
      }

      this.hooks.get(hookName).push({
        plugin: pluginName,
        handler,
        priority: handler.priority || 10,
      })

      // Ordenar por prioridade
      this.hooks.get(hookName).sort((a, b) => a.priority - b.priority)
    })

    performanceMonitor.debug('Plugin hooks registered', {
      plugin: pluginName,
      hooks: Object.keys(hooks),
    })
  }

  unregisterPluginHooks(pluginName) {
    for (const [hookName, handlers] of this.hooks.entries()) {
      const filtered = handlers.filter((h) => h.plugin !== pluginName)
      if (filtered.length === 0) {
        this.hooks.delete(hookName)
      } else {
        this.hooks.set(hookName, filtered)
      }
    }
  }

  async executeHook(hookName, data = {}, context = {}) {
    const handlers = this.hooks.get(hookName) || []
    let result = data

    for (const { plugin, handler } of handlers) {
      try {
        const pluginContext = this.createPluginContext(plugin)
        result = (await handler(result, { ...context, ...pluginContext })) || result
      } catch (error) {
        performanceMonitor.error('Error executing hook', {
          hook: hookName,
          plugin,
          error: error.message,
        })
      }
    }

    return result
  }

  // **Sistema de Middleware**
  registerPluginMiddleware(pluginName, middleware) {
    middleware.forEach((mw) => {
      this.middleware.push({
        plugin: pluginName,
        handler: mw,
        priority: mw.priority || 10,
      })
    })

    // Ordenar middleware por prioridade
    this.middleware.sort((a, b) => a.priority - b.priority)

    performanceMonitor.debug('Plugin middleware registered', {
      plugin: pluginName,
      count: middleware.length,
    })
  }

  unregisterPluginMiddleware(pluginName) {
    this.middleware = this.middleware.filter((mw) => mw.plugin !== pluginName)
  }

  async executeMiddleware(request, response, context = {}) {
    for (const { plugin, handler } of this.middleware) {
      try {
        const pluginContext = this.createPluginContext(plugin)
        await handler(request, response, { ...context, ...pluginContext })
      } catch (error) {
        performanceMonitor.error('Error executing middleware', {
          plugin,
          error: error.message,
        })
        throw error
      }
    }
  }

  // **Sistema de Eventos**
  registerPluginEvents(pluginName, events) {
    Object.entries(events).forEach(([eventName, handler]) => {
      if (!this.eventListeners.has(eventName)) {
        this.eventListeners.set(eventName, [])
      }

      this.eventListeners.get(eventName).push({
        plugin: pluginName,
        handler,
      })
    })

    performanceMonitor.debug('Plugin events registered', {
      plugin: pluginName,
      events: Object.keys(events),
    })
  }

  unregisterPluginEvents(pluginName) {
    for (const [eventName, listeners] of this.eventListeners.entries()) {
      const filtered = listeners.filter((l) => l.plugin !== pluginName)
      if (filtered.length === 0) {
        this.eventListeners.delete(eventName)
      } else {
        this.eventListeners.set(eventName, filtered)
      }
    }
  }

  emit(eventName, data = {}) {
    const listeners = this.eventListeners.get(eventName) || []

    listeners.forEach(({ plugin, handler }) => {
      try {
        const pluginContext = this.createPluginContext(plugin)
        handler(data, pluginContext)
      } catch (error) {
        performanceMonitor.error('Error in event listener', {
          event: eventName,
          plugin,
          error: error.message,
        })
      }
    })

    // Registrar evento
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }

    this.events.get(eventName).push({
      data,
      timestamp: Date.now(),
      listeners: listeners.length,
    })

    performanceMonitor.debug('Event emitted', {
      event: eventName,
      listeners: listeners.length,
    })
  }

  // **Context do Plugin**
  createPluginContext(pluginName) {
    const plugin = this.plugins.get(pluginName)

    return {
      plugin: {
        name: pluginName,
        config: plugin?.config || {},
        state: plugin?.state || 'unknown',
      },
      emit: (eventName, data) => this.emit(eventName, data),
      hook: (hookName, data, context) => this.executeHook(hookName, data, context),
      log: {
        info: (message, meta = {}) =>
          performanceMonitor.log(message, { plugin: pluginName, ...meta }),
        warn: (message, meta = {}) =>
          performanceMonitor.warn(message, { plugin: pluginName, ...meta }),
        error: (message, meta = {}) =>
          performanceMonitor.error(message, { plugin: pluginName, ...meta }),
        debug: (message, meta = {}) =>
          performanceMonitor.debug(message, { plugin: pluginName, ...meta }),
      },
      getPlugin: (name) => this.getPluginInfo(name),
      isLoaded: (name) => this.isPluginLoaded(name),
    }
  }

  // **Utilitários de Dependência**
  getDependents(pluginName) {
    const dependents = []

    for (const [name, deps] of this.dependencies.entries()) {
      if (deps.includes(pluginName) && this.isPluginLoaded(name)) {
        dependents.push(name)
      }
    }

    return dependents
  }

  getDependencyTree(pluginName) {
    const tree = new Map()
    const visited = new Set()

    const buildTree = (name, level = 0) => {
      if (visited.has(name)) return
      visited.add(name)

      const deps = this.dependencies.get(name) || []
      tree.set(name, { level, dependencies: deps })

      deps.forEach((dep) => buildTree(dep, level + 1))
    }

    buildTree(pluginName)
    return tree
  }

  // **Gerenciamento de Estado**
  isPluginLoaded(name) {
    return this.pluginState.get(name) === 'loaded'
  }

  getPluginState(name) {
    return this.pluginState.get(name) || 'unknown'
  }

  getPluginInfo(name) {
    const plugin = this.plugins.get(name)
    if (!plugin) return null

    return {
      name: plugin.name,
      version: plugin.version,
      description: plugin.description,
      author: plugin.author,
      state: plugin.state,
      loadTime: plugin.loadTime,
      error: plugin.error,
      dependencies: plugin.dependencies,
      dependents: this.getDependents(name),
    }
  }

  getAllPlugins() {
    return Array.from(this.plugins.keys()).map((name) => this.getPluginInfo(name))
  }

  getLoadedPlugins() {
    return this.getAllPlugins().filter((plugin) => plugin.state === 'loaded')
  }

  // **Plugins Específicos do Portal Betina**
  async loadCorePlugins() {
    const corePlugins = [
      {
        name: 'autism-support',
        description: 'Plugin de suporte específico para autismo',
        hooks: {
          'interface.render': async (data, context) => {
            // Aplicar configurações de acessibilidade
            const accessibilityConfig = context.plugin.config.accessibility || {}
            return {
              ...data,
              accessibility: accessibilityConfig,
              sensoryOptimization: true,
            }
          },
        },
        initialize: async (context) => {
          context.log.info('Autism support plugin initialized')
        },
      },
      {
        name: 'therapy-tracker',
        description: 'Plugin de acompanhamento terapêutico',
        dependencies: ['autism-support'],
        hooks: {
          'session.start': async (data, context) => {
            return {
              ...data,
              therapyMode: true,
              adaptiveSettings: context.plugin.config.adaptive || {},
            }
          },
        },
        initialize: async (context) => {
          context.log.info('Therapy tracker plugin initialized')
        },
      },
      {
        name: 'cognitive-analyzer',
        description: 'Plugin de análise cognitiva',
        hooks: {
          'data.process': async (data, context) => {
            // Integrar com CognitiveAnalyzer
            return {
              ...data,
              cognitiveInsights: true,
            }
          },
        },
        initialize: async (context) => {
          context.log.info('Cognitive analyzer plugin initialized')
        },
      },
    ]

    for (const plugin of corePlugins) {
      await this.registerPlugin(plugin)
      await this.loadPlugin(plugin.name)
    }

    performanceMonitor.log('Core plugins loaded', { count: corePlugins.length })
  }

  // **Estatísticas e Monitoramento**
  getStatistics() {
    const total = this.plugins.size
    const loaded = this.getLoadedPlugins().length
    const failed = Array.from(this.pluginState.values()).filter((state) => state === 'error').length

    return {
      total,
      loaded,
      failed,
      unloaded: total - loaded - failed,
      hooks: this.hooks.size,
      middleware: this.middleware.length,
      events: this.events.size,
      loadOrder: this.loadOrder,
    }
  }

  getPerformanceMetrics() {
    const plugins = this.getAllPlugins()
    const loadTimes = plugins.filter((p) => p.loadTime !== null).map((p) => p.loadTime)

    return {
      totalLoadTime: loadTimes.reduce((sum, time) => sum + time, 0),
      averageLoadTime:
        loadTimes.length > 0
          ? Math.round(loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length)
          : 0,
      slowestPlugin: plugins.reduce(
        (slowest, current) =>
          !slowest || (current.loadTime && current.loadTime > slowest.loadTime) ? current : slowest,
        null
      ),
      memoryUsage: this.estimateMemoryUsage(),
    }
  }

  estimateMemoryUsage() {
    // Estimativa simples do uso de memória
    const pluginCount = this.plugins.size
    const hooksCount = Array.from(this.hooks.values()).reduce(
      (sum, handlers) => sum + handlers.length,
      0
    )
    const middlewareCount = this.middleware.length

    return {
      estimated: `${Math.round((pluginCount * 50 + hooksCount * 10 + middlewareCount * 20) / 1024)}KB`,
      plugins: pluginCount,
      hooks: hooksCount,
      middleware: middlewareCount,
    }
  }

  // **Cleanup**
  async destroy() {
    // Descarregar todos os plugins na ordem inversa
    const loadedPlugins = [...this.loadOrder].reverse()

    for (const pluginName of loadedPlugins) {
      await this.unloadPlugin(pluginName)
    }

    this.plugins.clear()
    this.hooks.clear()
    this.middleware = []
    this.pluginState.clear()
    this.dependencies.clear()
    this.loadOrder = []
    this.events.clear()
    this.eventListeners.clear()

    performanceMonitor.log('GenericPluginSystem destroyed')
  }
}

export default GenericPluginSystem
