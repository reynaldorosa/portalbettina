/**
 * @file CacheManager.js
 * @description Gerenciador especializado de cache e armazenamento local
 */

export class CacheManager {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService.logger
    this.connectionStrategy = databaseService.connectionStrategy
    this.LZString = this.db.LZString || null
  }

  /**
   * @method setLocalData
   * @description Armazena dados no localStorage com compressão opcional
   * @param {string} key - Chave do armazenamento
   * @param {*} data - Dados a serem armazenados
   * @param {Object} options - Opções adicionais
   * @returns {boolean} Sucesso da operação
   */
  setLocalData(key, data, options = {}) {
    try {
      const storageKey = this.connectionStrategy.getStorageKey(key)
      const payload = {
        data,
        timestamp: Date.now(),
        version: '2.0',
        compressed: false,
        ...options,
      }

      let serialized = JSON.stringify(payload)

      // Comprimir se necessário e LZString estiver disponível
      if (serialized.length > 10000 && this.LZString) {
        payload.data = this.LZString.compress(JSON.stringify(data))
        payload.compressed = true
        serialized = JSON.stringify(payload)
      }

      localStorage.setItem(storageKey, serialized)
      this.db.cache.set(key, data, 3600000) // 1 hora

      return true
    } catch (error) {
      this.logger.error('Failed to store local data', {
        key,
        error: error.message,
        dataSize: JSON.stringify(data).length,
      })
      return false
    }
  }

  /**
   * @method getLocalData
   * @description Recupera dados do localStorage, descomprimindo se necessário
   * @param {string} key - Chave do armazenamento
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Dados recuperados ou valor padrão
   */
  getLocalData(key, defaultValue = null) {
    try {
      // Verificar cache primeiro
      const cached = this.db.cache.get(key)
      if (cached !== null) {
        return cached
      }

      const storageKey = this.connectionStrategy.getStorageKey(key)
      const stored = localStorage.getItem(storageKey)

      if (!stored) {
        return defaultValue
      }

      const payload = JSON.parse(stored)

      if (!payload.data || !payload.timestamp || !payload.version) {
        localStorage.removeItem(storageKey)
        return defaultValue
      }

      // Verificar se os dados expiraram (7 dias)
      const maxAge = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - payload.timestamp > maxAge) {
        localStorage.removeItem(storageKey)
        return defaultValue
      }

      let data = payload.data

      // Descomprimir se necessário
      if (payload.compressed && this.LZString) {
        data = JSON.parse(this.LZString.decompress(data))
      }

      // Atualizar cache
      this.db.cache.set(key, data, 3600000)

      return data
    } catch (error) {
      this.logger.error('Failed to retrieve local data', {
        key,
        error: error.message,
      })
      return defaultValue
    }
  }

  /**
   * @method clearLocalStorage
   * @description Limpa dados específicos do Portal Betina do localStorage
   */
  clearLocalStorage() {
    try {
      const keysToRemove = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('betina_')) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key))

      this.logger.info('Local storage cleared', {
        keysRemoved: keysToRemove.length,
      })
    } catch (error) {
      this.logger.error('Failed to clear local storage', {
        error: error.message,
      })
    }
  }

  /**
   * @method getStorageStats
   * @description Obtém estatísticas do armazenamento local
   * @returns {Object} Estatísticas de armazenamento
   */
  getStorageStats() {
    try {
      let totalSize = 0
      let betinaSize = 0
      let betinaKeys = 0

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key)
          const size = new Blob([value]).size
          totalSize += size

          if (key.startsWith('betina_')) {
            betinaSize += size
            betinaKeys++
          }
        }
      }

      return {
        totalSize: this.formatBytes(totalSize),
        betinaSize: this.formatBytes(betinaSize),
        betinaKeys,
        totalKeys: localStorage.length,
        availableQuota: this.getStorageQuota(),
      }
    } catch (error) {
      this.logger.error('Failed to get storage stats', {
        error: error.message,
      })
      return null
    }
  }

  /**
   * @method getStorageQuota
   * @description Obtém cota de armazenamento disponível
   * @returns {Promise<Object>|Object} Informações de cota
   */
  getStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate().then((estimate) => ({
        quota: this.formatBytes(estimate.quota || 0),
        usage: this.formatBytes(estimate.usage || 0),
        available: this.formatBytes((estimate.quota || 0) - (estimate.usage || 0)),
      }))
    }

    return {
      quota: 'Unknown',
      usage: 'Unknown',
      available: 'Unknown',
    }
  }

  /**
   * @method formatBytes
   * @description Formata bytes em formato legível
   * @param {number} bytes - Número de bytes
   * @returns {string} Formato legível
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * @method cleanupExpiredEntries
   * @description Remove entradas expiradas do localStorage
   */
  cleanupExpiredEntries() {
    try {
      const keysToRemove = []
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 dias

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (key && key.startsWith('betina_')) {
          try {
            const stored = localStorage.getItem(key)
            const payload = JSON.parse(stored)

            if (payload.timestamp && Date.now() - payload.timestamp > maxAge) {
              keysToRemove.push(key)
            }
          } catch (e) {
            // Entrada corrompida, remover
            keysToRemove.push(key)
          }
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key))

      if (keysToRemove.length > 0) {
        this.logger.info('Cleaned up expired entries', {
          entriesRemoved: keysToRemove.length,
        })
      }
    } catch (error) {
      this.logger.error('Failed to cleanup expired entries', {
        error: error.message,
      })
    }
  }

  /**
   * @method backupUserData
   * @description Cria backup dos dados do usuário
   * @param {string} userId - ID do usuário
   * @returns {Object} Dados de backup
   */
  backupUserData(userId) {
    try {
      const backup = {
        userId,
        timestamp: new Date().toISOString(),
        data: {},
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (key && key.includes(userId)) {
          backup.data[key] = localStorage.getItem(key)
        }
      }

      return backup
    } catch (error) {
      this.logger.error('Failed to backup user data', {
        userId,
        error: error.message,
      })
      return null
    }
  }

  /**
   * @method restoreUserData
   * @description Restaura dados do usuário a partir de backup
   * @param {Object} backup - Dados de backup
   * @returns {boolean} Sucesso da operação
   */
  restoreUserData(backup) {
    try {
      if (!backup || !backup.data) {
        throw new Error('Invalid backup data')
      }

      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })

      this.logger.info('User data restored from backup', {
        userId: backup.userId,
        entriesRestored: Object.keys(backup.data).length,
      })

      return true
    } catch (error) {
      this.logger.error('Failed to restore user data', {
        error: error.message,
      })
      return false
    }
  }
}
