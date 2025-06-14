import React, { createContext, useState, useEffect, useContext } from 'react'
import databaseService from '../database/core/DatabaseService.js'

// Criação do contexto
export const UserContext = createContext(null)

// Key para armazenar o ID do usuário no localStorage (apenas para compatibilidade)
const USER_ID_KEY = 'betina_user_id'

// Provedor do contexto
export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDbConnected, setIsDbConnected] = useState(false)

  // Verificar conexão com o banco de dados
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const isConnected = await databaseService.healthCheck()
        setIsDbConnected(isConnected)
        console.log('Conexão com banco de dados:', isConnected ? 'OK' : 'Falhou')
      } catch (err) {
        console.warn('Erro ao verificar conexão com banco de dados:', err)
        setIsDbConnected(false)
      }
    }

    checkDbConnection()
  }, [])

  // Carregar ou criar usuário
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Verificar se temos um ID de usuário no localStorage
        const storedId = localStorage.getItem(USER_ID_KEY)
        if (storedId) {
          // Se o banco estiver conectado, verificar se o usuário existe
          if (isDbConnected) {
            try {
              const user = await databaseService.getUser(storedId)

              if (user) {
                setUserId(storedId)
                setUserDetails(user)
                setLoading(false)
                return
              }
            } catch (dbErr) {
              console.warn('Erro ao buscar usuário do banco:', dbErr)
              // Continuar usando ID do localStorage mesmo se falhar a busca no banco
              setUserId(storedId)
              setLoading(false)
              return
            }
          } else {
            // Se banco não estiver conectado, usar ID do localStorage
            setUserId(storedId)
            setLoading(false)
            return
          }
        }

        // Se não temos ID ou se o usuário não existe mais no banco
        if (isDbConnected) {
          try {
            // Criar novo usuário no banco
            const newUserId = await databaseService.createAnonymousUser()
            if (newUserId && typeof newUserId === 'string') {
              localStorage.setItem(USER_ID_KEY, newUserId)
              setUserId(newUserId)

              const newUser = await databaseService.getUser(newUserId)
              setUserDetails(newUser)
              setLoading(false)
              return
            }
          } catch (dbErr) {
            console.warn('Erro ao criar usuário no banco:', dbErr)
            // Continuar com criação de ID local
          }
        } // Fallback - criar ID local se tudo falhar
        const fallbackId = 'local_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
        localStorage.setItem(USER_ID_KEY, fallbackId)
        setUserId(fallbackId)
      } catch (err) {
        console.error('Erro ao carregar/criar usuário:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Só carregar usuário quando soubermos se o banco está conectado
    if (isDbConnected !== null) {
      loadUser()
    }
  }, [isDbConnected])

  // Função para atualizar configurações de acessibilidade
  const updateAccessibilitySettings = async (settings) => {
    if (!userId) return false

    try {
      // Salvar no localStorage como fallback
      localStorage.setItem('betina_accessibility_settings', JSON.stringify(settings))

      // Se banco conectado, salvar lá também
      if (isDbConnected) {
        try {
          await databaseService.updateAccessibilitySettings(userId, settings)
        } catch (dbErr) {
          console.warn('Erro ao salvar configurações de acessibilidade no banco:', dbErr)
        }
      }

      return true
    } catch (err) {
      console.error('Erro ao atualizar configurações de acessibilidade:', err)
      return false
    }
  }

  // Função para obter configurações de acessibilidade
  const getAccessibilitySettings = async () => {
    try {
      // Tentar obter do banco se disponível
      if (userId && isDbConnected) {
        try {
          const dbSettings = await databaseService.getAccessibilitySettings(userId)
          if (dbSettings) return dbSettings
        } catch (dbErr) {
          console.warn('Erro ao obter configurações de acessibilidade do banco:', dbErr)
        }
      }

      // Fallback para localStorage
      const localSettings = localStorage.getItem('betina_accessibility_settings')
      return localSettings ? JSON.parse(localSettings) : null
    } catch (err) {
      console.error('Erro ao obter configurações de acessibilidade:', err)
      return null
    }
  }

  // Função para carregar todos os usuários
  const loadUsers = async () => {
    if (!isDbConnected) return []

    try {
      return await databaseService.getUserGameSessions(userId)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
      return []
    }
  }

  // Função para criar novo usuário
  const createUser = async (userData) => {
    if (!isDbConnected) return null

    try {
      const newUserId = await databaseService.createAnonymousUser()
      if (newUserId && userData) {
        await databaseService.updateUserPreferences(newUserId, userData.preferences || {})
        return newUserId
      }
      return null
    } catch (err) {
      console.error('Erro ao criar usuário:', err)
      return null
    }
  }

  // Função para alternar usuário ativo
  const switchUser = async (newUserId) => {
    try {
      localStorage.setItem(USER_ID_KEY, newUserId)
      setUserId(newUserId)

      if (isDbConnected) {
        const user = await databaseService.getUser(newUserId)
        setUserDetails(user)
      }
      return true
    } catch (err) {
      console.error('Erro ao trocar de usuário:', err)
      return false
    }
  }

  // Função para atualizar usuário
  const updateUser = async (userId, userData) => {
    if (!isDbConnected) return false

    try {
      await databaseService.updateUserPreferences(userId, userData.preferences || {})
      return true
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err)
      return false
    }
  }

  // Função para excluir usuário
  const deleteUser = async (userIdToDelete) => {
    if (!isDbConnected) return false

    try {
      await databaseService.deleteUser(userIdToDelete)

      // Se estivermos deletando o usuário atual, criar um novo
      if (userIdToDelete === userId) {
        const newUserId = await databaseService.createAnonymousUser()
        localStorage.setItem(USER_ID_KEY, newUserId)
        setUserId(newUserId)
      }

      return true
    } catch (err) {
      console.error('Erro ao excluir usuário:', err)
      return false
    }
  }

  // Função para registrar desempenho e ajustar dificuldade
  const recordPerformance = async (gameId, performanceData) => {
    if (!userId) return false

    try {
      // Salvar dados de desempenho
      if (isDbConnected) {
        await databaseService.saveGameSession({
          user_id: userId,
          game_id: gameId,
          performance_data: performanceData,
          timestamp: new Date().toISOString(),
        })
      }

      // Obter parâmetros adaptativos atualizados
      const difficultyLevel = calculateDifficultyLevel(performanceData)
      const adaptiveParams = await databaseService.getAdaptiveParameters(gameId, difficultyLevel)

      // Atualizar preferências do usuário com novos parâmetros
      if (adaptiveParams) {
        await updateUser(userId, {
          preferences: {
            ...userDetails?.preferences,
            [gameId]: adaptiveParams,
          },
        })
      }

      return true
    } catch (err) {
      console.error('Erro ao registrar desempenho:', err)
      return false
    }
  }

  // Função auxiliar para calcular nível de dificuldade
  const calculateDifficultyLevel = (performanceData) => {
    const { correct, incorrect, responseTimes } = performanceData
    const accuracy = correct / (correct + incorrect)

    if (accuracy > 0.8) return 'HARD'
    if (accuracy > 0.5) return 'MEDIUM'
    return 'EASY'
  }

  // ============== GESTÃO DE PERFIS DE USUÁRIO ==============

  // Obter todos os perfis do usuário atual
  const getUserProfiles = async () => {
    if (!userId || !isDbConnected) return []

    try {
      return await databaseService.getUserProfiles(userId)
    } catch (err) {
      console.error('Erro ao obter perfis do usuário:', err)
      return []
    }
  }

  // Criar novo perfil para o usuário atual
  const createUserProfile = async (profileData) => {
    if (!userId || !isDbConnected) return null

    try {
      return await databaseService.createUserProfile(userId, profileData)
    } catch (err) {
      console.error('Erro ao criar perfil:', err)
      return null
    }
  }

  // Atualizar perfil específico
  const updateUserProfile = async (profileId, updates) => {
    if (!userId || !isDbConnected) return null

    try {
      return await databaseService.updateUserProfile(userId, profileId, updates)
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      return null
    }
  }
  // Deletar perfil específico
  const deleteUserProfile = async (profileId) => {
    if (!userId || !isDbConnected) return false

    try {
      return await databaseService.deleteUserProfile(userId, profileId)
    } catch (err) {
      console.error('Erro ao deletar perfil:', err)
      // Repassar o erro para o componente
      throw err
    }
  }

  // Ativar perfil específico
  const activateUserProfile = async (profileId) => {
    if (!userId || !isDbConnected) return false

    try {
      return await databaseService.activateUserProfile(userId, profileId)
    } catch (err) {
      console.error('Erro ao ativar perfil:', err)
      return false
    }
  }

  // Obter perfil ativo
  const getActiveUserProfile = async () => {
    if (!userId || !isDbConnected) return null

    try {
      return await databaseService.getActiveUserProfile(userId)
    } catch (err) {
      console.error('Erro ao obter perfil ativo:', err)
      return null
    }
  }

  // Valores expostos pelo contexto
  const value = {
    userId,
    userDetails,
    loading,
    error,
    isDbConnected,
    updateAccessibilitySettings,
    getAccessibilitySettings,
    loadUsers,
    createUser,
    switchUser,
    updateUser,
    deleteUser,
    recordPerformance,
    // Métodos de perfis de usuário
    getUserProfiles,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    activateUserProfile,
    getActiveUserProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Hook para usar o contexto
export function useUser() {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}

export default UserProvider
