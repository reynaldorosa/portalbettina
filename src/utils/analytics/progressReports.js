// Utilitário para gerar relatórios de progresso de aprendizado
import { createAdaptiveModel, analyzeLearningSessions } from '../adaptive/adaptiveML.js'
import databaseService from '../../database/core/DatabaseService.js'

// Gerar um relatório completo de progresso para um usuário
export const generateProgressReport = async (userId = null) => {
  // Se userId não for fornecido, tentar obter do localStorage
  if (!userId) {
    userId = localStorage.getItem('betina_user_id')
    if (!userId) {
      console.warn('Nenhum usuário identificado para gerar relatório')
      return null
    }
  }

  // Listar todos os jogos
  const games = [
    'memory-game',
    'color-match',
    'image-association',
    'letter-recognition',
    'number-counting',
    'musical-sequence',
  ]

  const report = {
    overallProgress: {
      totalSessions: 0,
      totalScore: 0,
      averageAccuracy: 0,
      lastPlayed: null,
      mostPlayed: null,
      learningTrend: null,
      offlineData: false,
    },
    gameReports: {},
  }

  // Obter dados de cada jogo
  let totalSessions = 0
  let totalAccuracy = 0
  let gameFrequency = {}
  let lastPlayedDate = null
  let totalScore = 0

  // Verificar se temos sessões offline
  const offlineSessionsKey = 'offlineGameSessions'
  const offlineSessions = JSON.parse(localStorage.getItem(offlineSessionsKey) || '[]')

  // Buscar sessões do banco de dados
  try {
    const allSessions = []

    // Verificar se a API está online
    let isApiOnline = false
    try {
      isApiOnline = await databaseService.healthCheck()
    } catch (error) {
      console.warn('API não disponível para relatório de progresso:', error.message)
    }

    // Processar cada jogo
    for (const gameId of games) {
      let sessions = []

      // Tentar obter do banco se API estiver disponível
      if (isApiOnline) {
        try {
          sessions = await databaseService.getGameSessions(userId, gameId, 50)
        } catch (apiError) {
          console.warn(`Erro ao buscar sessões de ${gameId} da API:`, apiError)
        }
      }

      // Se não conseguir do banco ou API offline, usar dados offline
      if (!sessions || sessions.length === 0) {
        const gameOfflineSessions = offlineSessions
          .filter((s) => s.game_id === gameId && s.user_id === userId)
          .map((s) => ({
            ...s,
            created_at: s.offline_timestamp || new Date().toISOString(),
          }))

        if (gameOfflineSessions.length > 0) {
          sessions = gameOfflineSessions
          report.overallProgress.offlineData = true
        }
      }
      if (sessions && sessions.length > 0) {
        allSessions.push(...sessions)
        gameFrequency[gameId] = sessions.length

        // Calcular acurácia média do jogo
        const gameAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
        totalAccuracy += gameAccuracy * sessions.length
        // Calcular pontuação total
        const gameScore = sessions.reduce((sum, s) => sum + (s.score || 0), 0)
        totalScore += gameScore

        // Verificar última sessão jogada
        const lastSession = sessions.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0]

        const lastSessionDate = new Date(lastSession.created_at)
        if (!lastPlayedDate || lastSessionDate > lastPlayedDate) {
          lastPlayedDate = lastSessionDate
        }

        // Analisar tendências
        const model = createAdaptiveModel(gameId)
        await model.loadHistory() // Garantir que o histórico foi carregado

        const analysis = await analyzeLearningSessions(gameId)

        // Adicionar relatório específico do jogo
        report.gameReports[gameId] = {
          sessions: sessions.length,
          accuracy: gameAccuracy,
          currentDifficulty: lastSession.difficulty || 'MEDIUM',
          trend: model.calculateTrend('accuracy'),
          analysis,
        }
      } else {
        // Jogo sem sessões registradas
        gameFrequency[gameId] = 0

        // Adicionar relatório vazio
        report.gameReports[gameId] = {
          sessions: 0,
          accuracy: 0,
          currentDifficulty: 'MEDIUM',
          trend: 0,
          analysis: { hasEnoughData: false },
        }
      }
    }

    totalSessions = allSessions.length

    // Calcular dados gerais
    report.overallProgress.totalSessions = totalSessions
    report.overallProgress.averageAccuracy = totalSessions > 0 ? totalAccuracy / totalSessions : 0
    report.overallProgress.lastPlayed = lastPlayedDate ? lastPlayedDate.toLocaleDateString() : null

    // Encontrar jogo mais jogado
    let maxPlayed = 0
    let mostPlayed = null
    Object.entries(gameFrequency).forEach(([gameId, count]) => {
      if (count > maxPlayed) {
        maxPlayed = count
        mostPlayed = gameId
      }
    })
    report.overallProgress.mostPlayed = mostPlayed

    // Calcular tendência geral de aprendizado
    const trends = Object.values(report.gameReports)
      .map((g) => g.trend)
      .filter((t) => t !== null)
    if (trends.length > 0) {
      const avgTrend = trends.reduce((sum, t) => sum + t, 0) / trends.length
      report.overallProgress.learningTrend = avgTrend
    }
  } catch (error) {
    console.error('Erro ao buscar dados do banco:', error)
    // Retornar relatório com dados básicos em caso de erro
    report.overallProgress.totalSessions = 0
    report.overallProgress.averageAccuracy = 0
    report.overallProgress.lastPlayed = null
    report.overallProgress.mostPlayed = null
    report.overallProgress.learningTrend = 0
  }

  return report
}

// Gerar sugestões personalizadas baseadas no progresso
export const generateSuggestions = (report) => {
  if (!report) {
    return []
  }

  const suggestions = []

  // Sugerir jogos com base na acurácia
  Object.entries(report.gameReports).forEach(([gameId, gameReport]) => {
    // Jogo nunca jogado
    if (gameReport.sessions === 0) {
      suggestions.push({
        type: 'new-game',
        gameId,
        message: `Experimente o jogo ${getGameName(gameId)} para melhorar habilidades diferentes!`,
      })
    }
    // Jogo com baixa acurácia
    else if (gameReport.accuracy < 50 && gameReport.sessions > 2) {
      suggestions.push({
        type: 'practice-needed',
        gameId,
        message: `Continue praticando ${getGameName(gameId)} para melhorar suas habilidades.`,
      })
    }
    // Jogo com acurácia melhorando
    else if (gameReport.trend > 0.1) {
      suggestions.push({
        type: 'improving',
        gameId,
        message: `Você está melhorando em ${getGameName(gameId)}! Continue assim!`,
      })
    }
  })

  // Para jogos específicos, dar sugestões específicas
  if (report.gameReports['letter-recognition']?.analysis?.strugglingLetters?.length > 0) {
    const letters = report.gameReports['letter-recognition'].analysis.strugglingLetters.join(', ')
    suggestions.push({
      type: 'focus-area',
      gameId: 'letter-recognition',
      message: `Praticar mais as letras: ${letters}`,
    })
  }

  // Sugestão geral de progresso
  if (report.overallProgress.learningTrend > 0.05) {
    suggestions.push({
      type: 'general',
      message:
        'Seu progresso está ótimo! Continue jogando regularmente para desenvolver suas habilidades.',
    })
  } else if (report.overallProgress.learningTrend < -0.05) {
    suggestions.push({
      type: 'general',
      message:
        'Tente jogar por períodos mais curtos, mas com mais frequência para melhorar seu aprendizado.',
    })
  }

  return suggestions
}

// Utilitário para obter o nome amigável do jogo
const getGameName = (gameId) => {
  const names = {
    'memory-game': 'Jogo da Memória',
    'color-match': 'Combinar Cores',
    'image-association': 'Associação de Imagens',
    'letter-recognition': 'Reconhecimento de Letras',
    'number-counting': 'Números e Contagem',
    'musical-sequence': 'Sequência Musical',
  }
  return names[gameId] || gameId
}

// Exportar dados de progresso para compartilhar
export const exportProgressData = () => {
  try {
    const report = generateProgressReport()
    const suggestions = generateSuggestions(report)

    const exportData = {
      report,
      suggestions,
      exportDate: new Date().toISOString(),
    }

    // Transformar em string JSON para ser baixado
    const dataStr = JSON.stringify(exportData, null, 2)
    return dataStr
  } catch (error) {
    console.error('Erro ao exportar dados de progresso:', error)
    return null
  }
}

// Função para obter um resumo rápido do progresso (usada pelo Dashboard)
export const getProgressSummary = async (userId = null) => {
  // Se userId não for fornecido, tentar obter do localStorage
  if (!userId) {
    userId = localStorage.getItem('betina_user_id')
    if (!userId) {
      console.warn('Nenhum usuário identificado para obter resumo')
      return {
        totalSessions: 0,
        averageAccuracy: 0,
        gamesPlayed: 0,
        lastActivity: null,
        skillsProgress: {
          cores: 0,
          memoria: 0,
          coordenacao: 0,
          reconhecimento: 0,
          matematica: 0,
          musicalidade: 0,
        },
      }
    }
  }

  try {
    // Buscar dados do localStorage primeiro (mais rápido)
    const gameIds = [
      'memory-game',
      'color-match',
      'image-association',
      'letter-recognition',
      'number-counting',
      'musical-sequence',
    ]

    let totalSessions = 0
    let totalAccuracy = 0
    let gamesPlayed = 0
    let lastActivity = null
    const skillsProgress = {
      cores: 0,
      memoria: 0,
      coordenacao: 0,
      reconhecimento: 0,
      matematica: 0,
      musicalidade: 0,
    }

    for (const gameId of gameIds) {
      const gameData = localStorage.getItem(`betina_game_${gameId}_${userId}`)
      if (gameData) {
        const data = JSON.parse(gameData)
        const sessions = data.sessions || []

        if (sessions.length > 0) {
          gamesPlayed++
          totalSessions += sessions.length

          // Calcular média de precisão
          const gameAccuracy =
            sessions.reduce((sum, session) => sum + (session.accuracy || 0), 0) / sessions.length
          totalAccuracy += gameAccuracy

          // Atualizar última atividade
          const lastSession = sessions[sessions.length - 1]
          if (lastSession && lastSession.timestamp) {
            const sessionDate = new Date(lastSession.timestamp)
            if (!lastActivity || sessionDate > lastActivity) {
              lastActivity = sessionDate
            }
          }

          // Mapear progresso de habilidades
          switch (gameId) {
            case 'color-match':
              skillsProgress.cores = Math.min(100, gameAccuracy)
              break
            case 'memory-game':
              skillsProgress.memoria = Math.min(100, gameAccuracy)
              break
            case 'image-association':
              skillsProgress.coordenacao = Math.min(100, gameAccuracy)
              break
            case 'letter-recognition':
              skillsProgress.reconhecimento = Math.min(100, gameAccuracy)
              break
            case 'number-counting':
              skillsProgress.matematica = Math.min(100, gameAccuracy)
              break
            case 'musical-sequence':
              skillsProgress.musicalidade = Math.min(100, gameAccuracy)
              break
          }
        }
      }
    }

    const averageAccuracy = gamesPlayed > 0 ? totalAccuracy / gamesPlayed : 0

    return {
      totalSessions,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      gamesPlayed,
      lastActivity: lastActivity ? lastActivity.toISOString() : null,
      skillsProgress,
    }
  } catch (error) {
    console.error('Erro ao obter resumo de progresso:', error)
    return {
      totalSessions: 0,
      averageAccuracy: 0,
      gamesPlayed: 0,
      lastActivity: null,
      skillsProgress: {
        cores: 0,
        memoria: 0,
        coordenacao: 0,
        reconhecimento: 0,
        matematica: 0,
        musicalidade: 0,
      },
    }
  }
}
