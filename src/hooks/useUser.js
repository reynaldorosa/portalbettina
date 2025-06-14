import { useState, useEffect } from 'react'
import databaseService from '../database/core/DatabaseService.js'

const USER_ID_KEY = 'betina_user_id'

function useUser() {
  const [userId, setUserId] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar ID do usuário do localStorage ou criar um novo
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Verificar se temos um ID de usuário no localStorage
        const storedId = localStorage.getItem(USER_ID_KEY)

        if (storedId) {
          // Verificar se o usuário existe no banco
          const user = await databaseService.getUser(storedId)

          if (user) {
            setUserId(storedId)
            setUserDetails(user)
            setLoading(false)
            return
          }
        }

        // Se não tivermos ID ou se o usuário não existir mais, criar um novo
        const newUserId = await databaseService.createAnonymousUser()
        if (newUserId) {
          localStorage.setItem(USER_ID_KEY, newUserId)
          setUserId(newUserId)

          // Buscar detalhes do novo usuário
          const newUser = await databaseService.getUser(newUserId)
          setUserDetails(newUser)
        } else {
          throw new Error('Não foi possível criar um novo usuário')
        }
      } catch (err) {
        console.error('Erro ao carregar/criar usuário:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Função para atualizar preferências do usuário
  const updatePreferences = async (preferences) => {
    if (!userId) return false

    try {
      const success = await databaseService.updateUserPreferences(userId, preferences)

      if (success) {
        // Atualizar detalhes do usuário localmente
        setUserDetails((prev) => ({
          ...prev,
          preferences: {
            ...(prev?.preferences || {}),
            ...preferences,
          },
        }))
      }

      return success
    } catch (err) {
      console.error('Erro ao atualizar preferências:', err)
      setError(err.message)
      return false
    }
  }

  // Função para atualizar configurações de acessibilidade
  const updateAccessibilitySettings = async (settings) => {
    if (!userId) return false

    try {
      return await databaseService.updateAccessibilitySettings(userId, settings)
    } catch (err) {
      console.error('Erro ao atualizar configurações de acessibilidade:', err)
      setError(err.message)
      return false
    }
  }

  // Função para obter configurações de acessibilidade
  const getAccessibilitySettings = async () => {
    if (!userId) return null

    try {
      return await databaseService.getAccessibilitySettings(userId)
    } catch (err) {
      console.error('Erro ao obter configurações de acessibilidade:', err)
      setError(err.message)
      return null
    }
  }

  return {
    userId,
    userDetails,
    loading,
    error,
    updatePreferences,
    updateAccessibilitySettings,
    getAccessibilitySettings,
  }
}

export default useUser
