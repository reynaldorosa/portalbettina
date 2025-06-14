/**
 * @file UserProfilesService.js
 * @description Métodos para criação, recuperação e atualização de usuários e perfis,
 * incluindo enriquecimento com dados terapêuticos para suporte a crianças autistas.
 * Movido de utils/shared para database/profiles (organização correta)
 */

export class UserProfilesService {
  constructor(cache, logger, deduplicatedRequest, authService) {
    this.cache = cache
    this.logger = logger
    this.deduplicatedRequest = deduplicatedRequest
    this.authService = authService
  }

  /**
   * @method createAnonymousUser
   * @async
   * @description Cria um usuário anônimo para acesso inicial.
   * @returns {Promise<string>} ID do usuário criado.
   * @throws {Error} Se a conexão com a internet estiver indisponível.
   */
  async createAnonymousUser() {
    const requestKey = 'create_anonymous_user'
    return this.deduplicatedRequest(requestKey, async () => {
      if (!navigator.onLine) {
        throw new Error('🚨 Portal Betina: Internet connection required for user creation')
      }
      try {
        return await this.withRetry(async () => {
          const authResult = await this.authService.createAnonymousUser()
          if (authResult.user) {
            this.cache.set(`user_${authResult.userId}`, authResult.user, 3600000)
          }
          this.logger.info('🌟 Portal Betina: Created anonymous user', {
            userId: authResult.userId,
          })
          return authResult.userId
        }, 'createAnonymousUser')
      } catch (error) {
        this.logger.error('🚨 Portal Betina: Failed to create user', { error: error.message })
        throw new Error('Portal Betina requires internet connection. Please check your connection.')
      }
    })
  }

  /**
   * @method getUser
   * @async
   * @description Recupera dados de um usuário específico.
   * @param {string} userId - ID do usuário.
   * @returns {Promise<Object|null>} Dados do usuário ou null se não encontrado.
   * @throws {Error} Se a conexão com a internet estiver indisponível.
   */
  async getUser(userId) {
    const cacheKey = `user_${userId}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      this.logger.info('📋 Portal Betina: Retrieved user from cache', { userId })
      return cached
    }

    if (!navigator.onLine) {
      throw new Error('🚨 Portal Betina: Internet connection required for user retrieval')
    }

    try {
      return await this.withRetry(async () => {
        const user = await this.authService.getUser(userId)
        if (user) {
          this.cache.set(cacheKey, user, 3600000)
          this.logger.info('🌟 Portal Betina: Retrieved user from server', { userId })
        }
        return user
      }, 'getUser')
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to get user', { error: error.message, userId })
      throw new Error('Portal Betina requires internet connection. Please check your connection.')
    }
  }

  /**
   * @method updateUserPreferences
   * @async
   * @description Atualiza preferências do usuário com dados terapêuticos.
   * @param {string} userId - ID do usuário.
   * @param {Object} preferences - Preferências a serem atualizadas.
   * @returns {Promise<boolean>} Sucesso da operação.
   */
  async updateUserPreferences(userId, preferences) {
    try {
      const enrichedPreferences = this.enrichWithTherapeuticData(preferences)

      const result = await this.withRetry(async () => {
        return await this.authService.updateUserPreferences(userId, enrichedPreferences)
      }, 'updateUserPreferences')

      if (result) {
        // Invalidar cache
        this.cache.delete(`user_${userId}`)
        this.logger.info('🌟 Portal Betina: Updated user preferences', { userId })
      }

      return result
    } catch (error) {
      this.logger.error('🚨 Portal Betina: Failed to update preferences', {
        error: error.message,
        userId,
      })
      return false
    }
  }

  /**
   * @method enrichWithTherapeuticData
   * @description Enriquece dados do usuário com informações terapêuticas específicas para autismo.
   * @param {Object} userData - Dados do usuário.
   * @returns {Object} Dados enriquecidos.
   */
  enrichWithTherapeuticData(userData) {
    return {
      ...userData,
      therapeuticProfile: {
        autismSupportLevel: userData.autismSupportLevel || 'moderate',
        sensoryPreferences: userData.sensoryPreferences || {},
        communicationStyle: userData.communicationStyle || 'visual',
        motorSkillsLevel: userData.motorSkillsLevel || 'developing',
        socialInteractionPreferences: userData.socialInteractionPreferences || {},
        timestamp: new Date().toISOString(),
      },
    }
  }

  /**
   * @method withRetry
   * @description Executa operação com retry automático.
   * @param {Function} operation - Operação a ser executada.
   * @param {string} operationName - Nome da operação para logs.
   * @param {number} maxRetries - Número máximo de tentativas.
   * @returns {Promise<any>} Resultado da operação.
   */
  async withRetry(operation, operationName, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        if (i === maxRetries - 1) throw error

        const delay = Math.pow(2, i) * 1000 // Exponential backoff
        this.logger.warn(
          `🔄 Portal Betina: Retrying ${operationName} (attempt ${i + 1}/${maxRetries})`,
          {
            delay,
            error: error.message,
          }
        )

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
}

export default UserProfilesService
