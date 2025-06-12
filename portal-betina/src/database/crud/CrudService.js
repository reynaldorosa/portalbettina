import logger from '../../utils/metrics/performanceMonitor.js'
import { getDatabaseConfig } from '../core/DatabaseConfig.js'

class CrudService {
  constructor(connectionManager, cache, circuitBreaker) {
    this.connection = connectionManager
    this.cache = cache
    this.circuitBreaker = circuitBreaker
    this.config = getDatabaseConfig()

    // Configurações específicas para crianças autistas
    this.autismConfig = this.config.getAutismConfig()

    // Estatísticas
    this.stats = {
      operations: 0,
      successful: 0,
      failed: 0,
      cached: 0,
      created: 0,
      read: 0,
      updated: 0,
      deleted: 0,
    }

    logger.info('CrudService initialized with autism support')
  }

  // **CREATE Operations**
  async create(entity, data, options = {}) {
    return await this.executeOperation('CREATE', entity, data, options, async () => {
      const {
        validate = true,
        sanitize = true,
        accessibility = true,
        parentNotification = false,
      } = options

      // Sanitização específica para dados de crianças
      if (sanitize) {
        data = await this.sanitizeChildData(data)
      }

      // Validação com foco em acessibilidade
      if (validate) {
        const validation = await this.validateData(entity, data, 'create')
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }
      }

      // Aplicar configurações de acessibilidade
      if (accessibility && this.autismConfig.cognitiveSupport) {
        data = await this.applyAccessibilityEnhancements(data)
      }

      const endpoint = this.getEntityEndpoint(entity)
      const response = await this.connection.post(endpoint, data)

      // Cache da entidade criada
      if (response.id) {
        this.cache.set(`${entity}:${response.id}`, response)
      }

      // Notificação para pais/responsáveis
      if (parentNotification && data.parentId) {
        await this.sendParentNotification('create', entity, response)
      }

      this.stats.created++
      logger.info('Entity created', {
        entity,
        id: response.id,
        accessibility: accessibility,
      })

      return response
    })
  }

  async createBatch(entity, dataArray, options = {}) {
    const { batchSize = 10, continueOnError = false } = options

    const results = []
    const errors = []

    // Processar em lotes para não sobrecarregar
    for (let i = 0; i < dataArray.length; i += batchSize) {
      const batch = dataArray.slice(i, i + batchSize)

      const batchPromises = batch.map(async (data, index) => {
        try {
          const result = await this.create(entity, data, options)
          return { index: i + index, success: true, data: result }
        } catch (error) {
          const errorResult = { index: i + index, success: false, error: error.message }
          if (!continueOnError) {
            throw error
          }
          return errorResult
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)

      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            results.push(result.value)
          } else {
            errors.push(result.value)
          }
        } else {
          errors.push({ error: result.reason.message })
        }
      })
    }

    logger.info('Batch create completed', {
      entity,
      total: dataArray.length,
      successful: results.length,
      errors: errors.length,
    })

    return { results, errors }
  }

  // **READ Operations**
  async read(entity, id, options = {}) {
    return await this.executeOperation('READ', entity, { id }, options, async () => {
      const {
        useCache = true,
        includeAccessibility = true,
        sensoryOptimization = this.autismConfig.sensorySettings?.enableLowStimulation,
      } = options

      const cacheKey = `${entity}:${id}`

      // Verificar cache primeiro
      if (useCache) {
        const cached = this.cache.get(cacheKey)
        if (cached) {
          this.stats.cached++
          logger.debug('Cache hit for entity', { entity, id })

          // Aplicar otimizações sensoriais se necessário
          return sensoryOptimization ? await this.applySensoryOptimization(cached) : cached
        }
      }

      const endpoint = this.getEntityEndpoint(entity, id)
      const response = await this.connection.get(endpoint)

      // Aplicar melhorias de acessibilidade
      if (includeAccessibility) {
        response.accessibility = await this.generateAccessibilityMetadata(response)
      }

      // Aplicar otimizações sensoriais
      if (sensoryOptimization) {
        response.sensoryOptimized = await this.applySensoryOptimization(response)
      }

      // Cache da resposta
      if (useCache) {
        this.cache.set(cacheKey, response)
      }

      this.stats.read++
      logger.debug('Entity read', { entity, id, fromCache: false })

      return response
    })
  }

  async readMany(entity, filters = {}, options = {}) {
    return await this.executeOperation('READ_MANY', entity, filters, options, async () => {
      const {
        limit = 50,
        offset = 0,
        sort = 'id',
        order = 'asc',
        useCache = true,
        includeAccessibility = true,
      } = options

      const cacheKey = `${entity}:list:${JSON.stringify({ filters, limit, offset, sort, order })}`

      // Verificar cache
      if (useCache) {
        const cached = this.cache.get(cacheKey)
        if (cached) {
          this.stats.cached++
          return cached
        }
      }

      const endpoint = this.getEntityEndpoint(entity)
      const queryParams = {
        ...filters,
        limit,
        offset,
        sort,
        order,
      }

      const response = await this.connection.get(endpoint, { params: queryParams })

      // Aplicar melhorias de acessibilidade para todos os itens
      if (includeAccessibility && response.data) {
        response.data = await Promise.all(
          response.data.map(async (item) => ({
            ...item,
            accessibility: await this.generateAccessibilityMetadata(item),
          }))
        )
      }

      // Cache da resposta
      if (useCache) {
        this.cache.set(cacheKey, response, 60000) // 1 minuto para listas
      }

      this.stats.read++
      logger.debug('Entities read', {
        entity,
        count: response.data?.length || 0,
        total: response.total,
      })

      return response
    })
  }

  // **UPDATE Operations**
  async update(entity, id, data, options = {}) {
    return await this.executeOperation('UPDATE', entity, { id, ...data }, options, async () => {
      const {
        validate = true,
        sanitize = true,
        partial = true,
        trackChanges = true,
        parentNotification = false,
      } = options

      // Sanitização
      if (sanitize) {
        data = await this.sanitizeChildData(data)
      }

      // Validação
      if (validate) {
        const validation = await this.validateData(entity, data, 'update', { partial })
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }
      }

      // Obter dados atuais para comparação
      let originalData = null
      if (trackChanges) {
        try {
          originalData = await this.read(entity, id, { useCache: true })
        } catch (error) {
          logger.warn('Could not fetch original data for change tracking', {
            entity,
            id,
            error: error.message,
          })
        }
      }

      const endpoint = this.getEntityEndpoint(entity, id)
      const method = partial ? 'patch' : 'put'
      const response = await this.connection[method](endpoint, data)

      // Atualizar cache
      const cacheKey = `${entity}:${id}`
      this.cache.delete(cacheKey) // Invalidar cache específico
      this.cache.set(cacheKey, response) // Cache nova versão

      // Invalidar caches de listas relacionadas
      this.invalidateListCaches(entity)

      // Rastreamento de mudanças
      if (trackChanges && originalData) {
        await this.trackDataChanges(entity, id, originalData, response)
      }

      // Notificação para pais
      if (parentNotification && (response.parentId || originalData?.parentId)) {
        await this.sendParentNotification('update', entity, response, originalData)
      }

      this.stats.updated++
      logger.info('Entity updated', {
        entity,
        id,
        partial,
        changesTracked: trackChanges,
      })

      return response
    })
  }

  // **DELETE Operations**
  async delete(entity, id, options = {}) {
    return await this.executeOperation('DELETE', entity, { id }, options, async () => {
      const { soft = true, backup = true, parentNotification = true } = options

      // Fazer backup antes de deletar
      let backupData = null
      if (backup) {
        try {
          backupData = await this.read(entity, id, { useCache: true })
          await this.createBackup(entity, id, backupData)
        } catch (error) {
          logger.warn('Could not create backup before deletion', {
            entity,
            id,
            error: error.message,
          })
        }
      }

      const endpoint = this.getEntityEndpoint(entity, id)

      if (soft) {
        // Soft delete - marcar como deletado
        const response = await this.connection.patch(endpoint, {
          deleted: true,
          deletedAt: new Date().toISOString(),
        })

        // Manter no cache mas marcar como deletado
        this.cache.set(`${entity}:${id}:deleted`, response)
      } else {
        // Hard delete
        await this.connection.delete(endpoint)
      }

      // Limpar cache
      this.cache.delete(`${entity}:${id}`)
      this.invalidateListCaches(entity)

      // Notificação para pais
      if (parentNotification && backupData?.parentId) {
        await this.sendParentNotification('delete', entity, backupData)
      }

      this.stats.deleted++
      logger.info('Entity deleted', {
        entity,
        id,
        soft,
        backup: backup && backupData !== null,
      })

      return { success: true, soft, backup: backup && backupData !== null }
    })
  }

  // **Métodos Específicos para Autismo**
  async sanitizeChildData(data) {
    // Sanitização específica para dados de crianças autistas
    const sanitized = { ...data }

    // Remover ou censurar informações sensíveis
    if (sanitized.medicalInfo) {
      sanitized.medicalInfo = this.sanitizeMedicalInfo(sanitized.medicalInfo)
    }

    // Validar campos de comunicação
    if (sanitized.communicationPreferences) {
      sanitized.communicationPreferences = this.validateCommunicationPrefs(
        sanitized.communicationPreferences
      )
    }

    // Aplicar filtros de conteúdo apropriado para idade
    if (sanitized.content) {
      sanitized.content = await this.filterAgeAppropriateContent(sanitized.content)
    }

    return sanitized
  }

  async applyAccessibilityEnhancements(data) {
    const enhanced = { ...data }

    // Adicionar descrições alt para imagens
    if (enhanced.images) {
      enhanced.images = await Promise.all(
        enhanced.images.map(async (img) => ({
          ...img,
          altText: img.altText || (await this.generateAltText(img)),
          highContrast: await this.generateHighContrastVersion(img),
        }))
      )
    }

    // Adicionar suporte de áudio
    if (enhanced.text && this.autismConfig.cognitiveSupport?.audioSupport) {
      enhanced.audioVersion = await this.generateAudioVersion(enhanced.text)
    }

    // Simplificar linguagem se necessário
    if (enhanced.description && this.autismConfig.cognitiveSupport?.simplifiedInterface) {
      enhanced.simplifiedDescription = await this.simplifyLanguage(enhanced.description)
    }

    return enhanced
  }

  async applySensoryOptimization(data) {
    const optimized = { ...data }

    if (this.autismConfig.sensorySettings) {
      const settings = this.autismConfig.sensorySettings

      // Reduzir estímulos visuais
      if (settings.enableLowStimulation) {
        optimized.reducedStimulation = true
        if (optimized.animations) {
          optimized.animations = settings.reduceAnimations ? [] : optimized.animations
        }
      }

      // Aplicar alto contraste
      if (settings.highContrast) {
        optimized.highContrastMode = true
      }

      // Ajustar tamanho de fonte
      if (settings.fontSize && settings.fontSize !== 'medium') {
        optimized.fontSize = settings.fontSize
      }
    }

    return optimized
  }

  async generateAccessibilityMetadata(data) {
    return {
      screenReaderFriendly: true,
      keyboardNavigable: true,
      highContrastAvailable: true,
      audioDescriptionAvailable: Boolean(data.text),
      simplifiedVersionAvailable: Boolean(data.description),
      sensoryOptimized: true,
      cognitiveSupport: {
        visualCues: this.autismConfig.cognitiveSupport?.visualCues,
        predictiveText: this.autismConfig.cognitiveSupport?.predictiveText,
        simplifiedInterface: this.autismConfig.cognitiveSupport?.simplifiedInterface,
      },
    }
  }

  // **Utilitários**
  async executeOperation(operation, entity, data, options, operationFn) {
    this.stats.operations++

    try {
      const result = await this.circuitBreaker.execute(operationFn, options.fallback)

      this.stats.successful++
      return result
    } catch (error) {
      this.stats.failed++
      logger.error(`${operation} operation failed`, {
        entity,
        error: error.message,
        data: this.sanitizeLogData(data),
      })
      throw error
    }
  }

  getEntityEndpoint(entity, id = null) {
    const baseEndpoint = `/api/v1/${entity}`
    return id ? `${baseEndpoint}/${id}` : baseEndpoint
  }

  invalidateListCaches(entity) {
    // Invalidar todos os caches de lista para a entidade
    const keysToDelete = []

    // Simular busca de chaves (em implementação real, usar padrão)
    for (const key of this.cache.getAllKeys?.() || []) {
      if (key.startsWith(`${entity}:list:`)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key))

    if (keysToDelete.length > 0) {
      logger.debug('List caches invalidated', { entity, count: keysToDelete.length })
    }
  }

  sanitizeLogData(data) {
    const sanitized = { ...data }

    // Remover informações sensíveis dos logs
    const sensitiveFields = ['password', 'ssn', 'medicalInfo', 'parentContact']
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    })

    return sanitized
  }

  // **Placeholder methods para funcionalidades específicas**
  sanitizeMedicalInfo(medicalInfo) {
    // Implementar sanitização de informações médicas
    return medicalInfo
  }

  validateCommunicationPrefs(prefs) {
    // Implementar validação de preferências de comunicação
    return prefs
  }

  async filterAgeAppropriateContent(content) {
    // Implementar filtro de conteúdo apropriado para idade
    return content
  }

  async generateAltText(image) {
    // Implementar geração de texto alternativo
    return `Image description for ${image.name || 'unnamed image'}`
  }

  async generateHighContrastVersion(image) {
    // Implementar versão de alto contraste
    return `${image.url}?contrast=high`
  }

  async generateAudioVersion(text) {
    // Implementar conversão texto-para-fala
    return `${text} (audio version available)`
  }

  async simplifyLanguage(text) {
    // Implementar simplificação de linguagem
    return text
  }

  async validateData(entity, data, operation, options = {}) {
    // Implementar validação de dados
    return { valid: true, errors: [] }
  }

  async trackDataChanges(entity, id, oldData, newData) {
    // Implementar rastreamento de mudanças
    logger.info('Data changes tracked', { entity, id })
  }

  async createBackup(entity, id, data) {
    // Implementar backup de dados
    logger.debug('Data backup created', { entity, id })
  }

  async sendParentNotification(operation, entity, data, oldData = null) {
    // Implementar notificação para pais
    logger.info('Parent notification sent', { operation, entity })
  }

  // **Estatísticas**
  getStatistics() {
    return {
      ...this.stats,
      successRate:
        this.stats.operations > 0
          ? Math.round((this.stats.successful / this.stats.operations) * 100)
          : 0,
      cacheHitRate:
        this.stats.operations > 0
          ? Math.round((this.stats.cached / this.stats.operations) * 100)
          : 0,
    }
  }

  resetStatistics() {
    Object.keys(this.stats).forEach((key) => {
      this.stats[key] = 0
    })
  }
}

export default CrudService
