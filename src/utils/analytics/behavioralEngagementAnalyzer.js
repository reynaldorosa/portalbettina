/**
 * PORTAL BETINA - BEHAVIORAL ENGAGEMENT ANALYZER
 * Fase 3.3 - Análise de Engajamento Comportamental
 *
 * Sistema de análise avançada de padrões comportamentais para Portal Betina
 * Integrado com sistemas existentes:
 * - gameUsage.js (monitoramento de uso dos jogos)
 * - NeuropedagogicalAnalyzer (insights cognitivos)
 * - MultisensoryMetricsService (métricas multissensoriais)
 * - SystemOrchestrator (orquestração do sistema)
 *
 * SEM MACHINE LEARNING - Apenas análise estatística e baseada em regras
 *
 * @version 1.0.0
 * @created 2024-07-23
 */

import { CONFIG, API_CONFIG, logger } from '../../config/api-config.js'
import { getGameUsageCounts } from '../game/gameUsage.js'
import { NeuropedagogicalAnalyzer } from '../metrics/neuropedagogicalInsights.js'
import { getSystemOrchestrator } from '../core/SystemOrchestrator.js'

export class BehavioralEngagementAnalyzer {
  constructor() {
    // Inicialização do analisador
    this.initialized = false
    this.neuropedagogicalAnalyzer = new NeuropedagogicalAnalyzer()
    this.orchestratorRef = null
    this.sessionCache = new Map()
    this.gamePreferenceCache = new Map()

    // Definição de limiares e constantes
    this.THRESHOLDS = {
      ENGAGEMENT_LOW: 30,
      ENGAGEMENT_MEDIUM: 60,
      ENGAGEMENT_HIGH: 80,
      ABANDONMENT_WARNING: 3, // 3 abandonos seguidos é preocupante
      FRUSTRATION_CRITICAL: 75,
      SESSION_RECENCY_DAYS: 14, // Duas semanas
    }

    // Categorias de jogos
    this.GAME_CATEGORIES = {
      SENSORIAL: 'sensorial',
      MOTOR: 'motor',
      COGNITIVE: 'cognitive',
      LANGUAGE: 'language',
      SOCIAL: 'social',
      EMOTIONAL: 'emotional',
    }

    // Inicializar integração com SystemOrchestrator
    this.initializeOrchestrator()
  }
  /**
   * Inicializa integração com o SystemOrchestrator
   */
  async initializeOrchestrator() {
    try {
      // Importação dinâmica para evitar ciclos de dependência
      const orchestratorModule = await import('../core/SystemOrchestrator.js');
      
      if (typeof orchestratorModule.getSystemOrchestrator === 'function') {
        this.orchestratorRef = orchestratorModule.getSystemOrchestrator();
        logger.info('🎯 BehavioralEngagementAnalyzer integrado com SystemOrchestrator');
        this.initialized = true;
      } else {
        logger.warn('⚠️ SystemOrchestrator não disponível, tentando novamente...');
        // Tentar novamente após um delay
        setTimeout(() => this.initializeOrchestrator(), 2000);
      }
    } catch (error) {
      logger.error('Erro ao integrar BehavioralEngagementAnalyzer com SystemOrchestrator:', error);
    }
  }

  /**
   * Método de inicialização esperado pelo SystemOrchestrator
   */
  async initialize() {
    try {
      // Aguardar até que a integração com o orquestrador esteja completa
      let attempts = 0;
      while (!this.initialized && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      if (!this.initialized) {
        logger.warn('⚠️ BehavioralEngagementAnalyzer inicializado sem integração com SystemOrchestrator');
      }
      
      logger.info('✅ BehavioralEngagementAnalyzer inicializado');
      return true;
    } catch (error) {
      logger.error('❌ Erro na inicialização do BehavioralEngagementAnalyzer:', error);
      return false;
    }
  }

  /**
   * Calcula pontuação de engajamento por jogo
   * @param {string} gameId - ID do jogo
   * @param {Object} sessionData - Dados da sessão atual
   * @returns {Object} Métricas de engajamento calculadas
   */
  calculateEngagementScore(gameId, sessionData) {
    try {
      // Obter estatísticas de uso do jogo
      const usageData = getGameUsageCounts()
      const gameUsage = usageData[gameId] || 0
      const lastPlayed = usageData[`${gameId}_lastPlayed`] || 0

      // Calcular recência (quanto mais recente, maior o engajamento)
      const daysSinceLastPlayed = (Date.now() - lastPlayed) / (1000 * 60 * 60 * 24)
      const recencyScore = Math.max(0, 100 - daysSinceLastPlayed * 5) // 0-100, diminui 5 pontos por dia

      // Frequência (número de vezes jogado)
      const frequencyScore = Math.min(100, gameUsage * 10) // 10 pontos por uso, máximo 100

      // Métricas comportamentais da sessão
      let persistenceScore = 50 // valor padrão
      let frustrationScore = 50 // valor padrão

      if (sessionData) {
        // Usar assessores do NeuropedagogicalAnalyzer
        const persistence = this.neuropedagogicalAnalyzer.assessPersistence?.(sessionData) || {}
        const frustration = this.neuropedagogicalAnalyzer.assessFrustration?.(sessionData) || {}

        persistenceScore = persistence.score || 50
        frustrationScore = 100 - (frustration.score || 50) // Inverte: menos frustração = melhor engajamento
      }

      // Calcular pontuação geral de engajamento
      const engagementScore =
        recencyScore * 0.3 + // 30% recência
        frequencyScore * 0.3 + // 30% frequência
        persistenceScore * 0.2 + // 20% persistência
        frustrationScore * 0.2 // 20% frustração (inversa)

      return {
        gameId,
        engagementScore: Math.round(engagementScore),
        metrics: {
          recency: Math.round(recencyScore),
          frequency: Math.round(frequencyScore),
          persistence: Math.round(persistenceScore),
          frustration: Math.round(frustrationScore),
        },
        level: this.getEngagementLevel(engagementScore),
        timestamp: Date.now(),
      }
    } catch (error) {
      logger.error(`Erro ao calcular engajamento para ${gameId}:`, error)
      return {
        gameId,
        engagementScore: 0,
        metrics: { recency: 0, frequency: 0, persistence: 0, frustration: 0 },
        level: 'error',
        timestamp: Date.now(),
      }
    }
  }

  /**
   * Analisa padrões de preferência por jogos
   * @param {string} userId - ID do usuário
   * @returns {Object} Padrões de preferência identificados
   */
  analyzeGamePreferencePatterns(userId) {
    try {
      // Verificar cache primeiro
      const cachedResult = this.gamePreferenceCache.get(userId)
      if (cachedResult && Date.now() - cachedResult.timestamp < 3600000) {
        // Cache de 1 hora
        return cachedResult.data
      }

      const usageData = getGameUsageCounts()
      const gameScores = {}
      const categoryScores = Object.fromEntries(
        Object.values(this.GAME_CATEGORIES).map((category) => [category, 0])
      )
      const categoryCount = Object.fromEntries(
        Object.values(this.GAME_CATEGORIES).map((category) => [category, 0])
      )

      // Mapear jogos para categorias (implementação simplificada)
      const gameCategories = {
        musicalSequence: this.GAME_CATEGORIES.SENSORIAL,
        memoryGame: this.GAME_CATEGORIES.COGNITIVE,
        puzzleGame: this.GAME_CATEGORIES.COGNITIVE,
        drawingGame: this.GAME_CATEGORIES.MOTOR,
        storyGame: this.GAME_CATEGORIES.LANGUAGE,
        socialGame: this.GAME_CATEGORIES.SOCIAL,
        emotionGame: this.GAME_CATEGORIES.EMOTIONAL,
        // Outros jogos seriam mapeados aqui
      }

      // Calcular pontuações por jogo
      let totalUsage = 0

      Object.keys(usageData).forEach((key) => {
        if (key.includes('_lastPlayed')) return // Pular timestamps

        const gameId = key
        const usageCount = usageData[gameId] || 0
        totalUsage += usageCount

        const category = gameCategories[gameId] || 'unknown'

        if (category !== 'unknown') {
          categoryScores[category] += usageCount
          categoryCount[category]++
        }

        gameScores[gameId] = usageCount
      })

      // Normalizar pontuações de categorias
      Object.keys(categoryScores).forEach((category) => {
        // Evitar divisão por zero
        if (categoryCount[category] > 0) {
          categoryScores[category] /= categoryCount[category]
        }
      })

      // Encontrar categorias preferidas
      const sortedCategories = Object.entries(categoryScores)
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])

      const preferredCategories = sortedCategories.slice(0, 3).map(([category]) => category)

      // Resultados
      const result = {
        preferredCategories,
        categoryScores,
        mostPlayedGames: Object.entries(gameScores)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([gameId, score]) => ({ gameId, score })),
        totalGamesPlayed: Object.keys(gameScores).length,
        totalUsageSessions: totalUsage,
        timestamp: Date.now(),
      }

      // Armazenar no cache
      this.gamePreferenceCache.set(userId, {
        timestamp: Date.now(),
        data: result,
      })

      return result
    } catch (error) {
      logger.error(`Erro ao analisar preferências de jogos para ${userId}:`, error)
      return {
        preferredCategories: [],
        categoryScores: {},
        mostPlayedGames: [],
        totalGamesPlayed: 0,
        totalUsageSessions: 0,
        error: true,
      }
    }
  }

  /**
   * Detecta níveis de frustração por jogo
   * @param {string} gameId - ID do jogo
   * @param {Array} sessionHistory - Histórico de sessões para o jogo
   * @returns {Object} Análise de frustração
   */
  detectFrustrationByGame(gameId, sessionHistory = []) {
    try {
      if (!sessionHistory || sessionHistory.length === 0) {
        return {
          gameId,
          frustrationLevel: 'unknown',
          score: 0,
          indicators: [],
          recommendations: [],
        }
      }

      // Indicadores de frustração
      const indicators = []

      // 1. Analisar abandonos precoces
      const abandonmentRate =
        sessionHistory.filter((session) => session.completionRatio && session.completionRatio < 0.5)
          .length / sessionHistory.length

      if (abandonmentRate > 0.3) {
        indicators.push({
          type: 'abandonment',
          description: 'Altas taxas de abandono precoce detectadas',
          severity: abandonmentRate > 0.6 ? 'high' : 'medium',
        })
      }

      // 2. Verificar erros consecutivos
      const hasConsecutiveFailures = sessionHistory.some((session, index, array) => {
        if (index < 2) return false
        return (
          session.successRate < 0.3 &&
          array[index - 1].successRate < 0.3 &&
          array[index - 2].successRate < 0.3
        )
      })

      if (hasConsecutiveFailures) {
        indicators.push({
          type: 'consecutive_failures',
          description: 'Sequência de falhas consecutivas detectada',
          severity: 'high',
        })
      }

      // 3. Analisar tentativas repetidas sem progresso
      const hasRepetitionWithoutProgress = sessionHistory.some((session, index, array) => {
        if (index < 3) return false

        const noProgressCount = array
          .slice(Math.max(0, index - 3), index + 1)
          .filter((s) => s.progressLevel === session.progressLevel).length

        return noProgressCount >= 3
      })

      if (hasRepetitionWithoutProgress) {
        indicators.push({
          type: 'repetition_without_progress',
          description: 'Repetição da mesma fase sem progresso',
          severity: 'medium',
        })
      }

      // 4. Verificar sinais de regulação emocional
      const hasPoorRegulation = sessionHistory.some((session) => {
        const regulation = this.neuropedagogicalAnalyzer.assessRegulation?.(session) || {}
        return regulation.score && regulation.score < 30
      })

      if (hasPoorRegulation) {
        indicators.push({
          type: 'poor_regulation',
          description: 'Baixa regulação emocional detectada',
          severity: 'high',
        })
      }

      // Calcular pontuação de frustração (0-100)
      const frustrationScore = Math.min(
        100,
        Math.round(
          abandonmentRate * 40 +
            (hasConsecutiveFailures ? 30 : 0) +
            (hasRepetitionWithoutProgress ? 20 : 0) +
            (hasPoorRegulation ? 30 : 0)
        )
      )

      // Determinar nível de frustração
      let frustrationLevel = 'low'
      if (frustrationScore >= this.THRESHOLDS.FRUSTRATION_CRITICAL) {
        frustrationLevel = 'critical'
      } else if (frustrationScore >= 50) {
        frustrationLevel = 'high'
      } else if (frustrationScore >= 30) {
        frustrationLevel = 'medium'
      }

      // Gerar recomendações
      const recommendations = this.generateFrustrationRecommendations(
        frustrationLevel,
        indicators,
        gameId
      )

      return {
        gameId,
        frustrationLevel,
        score: frustrationScore,
        indicators,
        recommendations,
      }
    } catch (error) {
      logger.error(`Erro ao detectar frustração para ${gameId}:`, error)
      return {
        gameId,
        frustrationLevel: 'error',
        score: 0,
        indicators: [],
        recommendations: [],
      }
    }
  }

  /**
   * Calcula persistência por categoria de jogo
   * @param {string} userId - ID do usuário
   * @param {string} category - Categoria de jogo
   * @returns {Object} Análise de persistência
   */
  calculatePersistenceByCategory(userId, category) {
    try {
      // Buscar do cache se disponível
      const cacheKey = `${userId}_${category}`
      const cachedData = this.sessionCache.get(cacheKey)

      if (cachedData && Date.now() - cachedData.timestamp < 86400000) {
        // Cache de 24h
        return cachedData.data
      }

      // Em produção, obteríamos dados reais do histórico de sessões
      // Aqui, usamos dados simulados para demonstração
      const simulatedHistory = this.getSimulatedCategoryHistory(userId, category)

      // Métricas de persistência
      const completionRates = simulatedHistory.map((s) => s.completionRatio || 0)
      const averageCompletion =
        completionRates.reduce((a, b) => a + b, 0) / (completionRates.length || 1)

      const retryRates =
        simulatedHistory.filter((s) => s.retryCount > 0).length / (simulatedHistory.length || 1)

      const progressionRates =
        simulatedHistory.filter((s) => s.progressLevel > s.startLevel).length /
        (simulatedHistory.length || 1)

      // Calcular pontuação de persistência (0-100)
      const persistenceScore = Math.min(
        100,
        Math.round(averageCompletion * 40 + retryRates * 30 + progressionRates * 30)
      )

      // Determinar nível
      let persistenceLevel = 'low'
      if (persistenceScore >= 80) {
        persistenceLevel = 'exceptional'
      } else if (persistenceScore >= 60) {
        persistenceLevel = 'good'
      } else if (persistenceScore >= 40) {
        persistenceLevel = 'moderate'
      }

      const result = {
        userId,
        category,
        persistenceScore,
        persistenceLevel,
        metrics: {
          averageCompletion: Math.round(averageCompletion * 100) / 100,
          retryRates,
          progressionRates,
        },
        recommendations: this.generatePersistenceRecommendations(persistenceLevel, category),
        timestamp: Date.now(),
      }

      // Armazenar no cache
      this.sessionCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result,
      })

      return result
    } catch (error) {
      logger.error(`Erro ao calcular persistência para ${userId} em ${category}:`, error)
      return {
        userId,
        category,
        persistenceScore: 0,
        persistenceLevel: 'error',
        metrics: {
          averageCompletion: 0,
          retryRates: 0,
          progressionRates: 0,
        },
        recommendations: [],
      }
    }
  }

  /**
   * Analisa o engajamento de um usuário em um evento específico
   * @param {string} userId - ID do usuário
   * @param {Object} gameEvent - Dados do evento de jogo
   * @returns {Promise<Object>} Análise de engajamento
   */
  async analyzeEngagement(userId, gameEvent) {
    try {
      console.log(`📊 Analisando engajamento para usuário ${userId}`)
      
      // Calcular score de engajamento
      const engagementScore = this.calculateEngagementScore({
        userId,
        gameId: gameEvent.gameId || gameEvent.type,
        duration: gameEvent.duration || 0,
        score: gameEvent.score || 0,
        interactions: gameEvent.interactions || 0,
        completionRate: gameEvent.completionRate || 0
      })
      
      // Analisar padrões de preferência
      const gamePreferences = this.analyzeGamePreferencePatterns(userId)
      
      // Analisar consistência temporal
      const temporalConsistency = this.analyzeTemporalConsistency(userId)
      
      // Gerar insights comportamentais
      const behavioralInsights = this.generateBehavioralInsights({
        engagementScore,
        gamePreferences,
        temporalConsistency,
        gameEvent
      })
      
      // Gerar recomendações
      const recommendations = this.generateEngagementRecommendations(behavioralInsights)
      
      return {
        userId,
        gameId: gameEvent.gameId || gameEvent.type,
        timestamp: Date.now(),
        engagementScore,
        gamePreferences,
        temporalConsistency,
        behavioralInsights,
        recommendations,
        analysis: {
          level: engagementScore > 0.8 ? 'high' : engagementScore > 0.5 ? 'medium' : 'low',
          trends: this.identifyEngagementTrends(userId),
          alerts: this.generateEngagementAlerts(engagementScore)
        }
      }
      
    } catch (error) {
      console.error('❌ Erro na análise de engajamento:', error)
      return {
        userId,
        gameId: gameEvent.gameId || gameEvent.type,
        timestamp: Date.now(),
        error: error.message,
        engagementScore: 0,
        analysis: { level: 'error' }
      }
    }
  }

  /**
   * Gera insights comportamentais baseados nos dados de engajamento
   */
  generateBehavioralInsights(data) {
    const insights = []
    
    if (data.engagementScore > 0.8) {
      insights.push('Alto nível de engajamento detectado')
    } else if (data.engagementScore < 0.3) {
      insights.push('Baixo engajamento - considerar adaptações')
    }
    
    if (data.gamePreferences?.preferredGames?.length > 0) {
      insights.push(`Preferência por jogos: ${data.gamePreferences.preferredGames.slice(0, 2).join(', ')}`)
    }
    
    if (data.temporalConsistency?.consistency < 0.5) {
      insights.push('Padrão irregular de interação detectado')
    }
    
    return insights
  }

  /**
   * Gera recomendações para melhorar o engajamento
   */
  generateEngagementRecommendations(insights) {
    const recommendations = []
    
    insights.forEach(insight => {
      if (insight.includes('Baixo engajamento')) {
        recommendations.push('Reduzir dificuldade do jogo')
        recommendations.push('Aumentar frequência de recompensas')
      }
      
      if (insight.includes('Padrão irregular')) {
        recommendations.push('Implementar lembretes de sessão')
        recommendations.push('Ajustar horários de interação')
      }
      
      if (insight.includes('Alto nível')) {
        recommendations.push('Aumentar progressivamente a dificuldade')
        recommendations.push('Introduzir novos desafios')
      }
    })
    
    return recommendations
  }

  /**
   * Identifica tendências de engajamento
   */
  identifyEngagementTrends(userId) {
    try {
      // Simular análise de tendências baseada em dados históricos
      const trends = {
        improving: Math.random() > 0.5,
        stable: Math.random() > 0.3,
        declining: Math.random() > 0.7,
        patterns: ['morning_peak', 'consistent_duration']
      }
      
      return trends
    } catch (error) {
      return { error: error.message }
    }
  }

  /**
   * Gera alertas baseados no score de engajamento
   */
  generateEngagementAlerts(engagementScore) {
    const alerts = []
    
    if (engagementScore < 0.2) {
      alerts.push({
        level: 'critical',
        message: 'Engajamento criticamente baixo',
        action: 'Intervenção imediata recomendada'
      })
    } else if (engagementScore < 0.4) {
      alerts.push({
        level: 'warning',
        message: 'Engajamento abaixo do esperado',
        action: 'Considerar ajustes na abordagem'
      })
    }
    
    return alerts
  }

  // ========== MÉTODOS DE SUPORTE ==========

  /**
   * Obtém o nível de engajamento baseado em pontuação
   * @private
   */
  getEngagementLevel(score) {
    if (score >= this.THRESHOLDS.ENGAGEMENT_HIGH) return 'high'
    if (score >= this.THRESHOLDS.ENGAGEMENT_MEDIUM) return 'medium'
    if (score >= this.THRESHOLDS.ENGAGEMENT_LOW) return 'low'
    return 'critical'
  }

  /**
   * Gera recomendações baseadas no nível de frustração
   * @private
   */
  generateFrustrationRecommendations(level, indicators, gameId) {
    const recommendations = []

    switch (level) {
      case 'critical':
        recommendations.push(
          'Considerar reduzir temporariamente o nível de dificuldade',
          'Implementar um sistema de recompensas mais frequente',
          'Oferecer suporte visual adicional'
        )
        break
      case 'high':
        recommendations.push(
          'Introduzir pausas estruturadas durante a atividade',
          'Adicionar dicas visuais mais claras'
        )
        break
      case 'medium':
        recommendations.push(
          'Monitorar sinais de frustração durante as sessões',
          'Fornecer feedback positivo mais frequentemente'
        )
        break
      default:
        recommendations.push('Manter o nível atual de suporte')
    }

    // Adicionar recomendações específicas baseado nos indicadores
    indicators.forEach((indicator) => {
      if (indicator.type === 'abandonment' && indicator.severity === 'high') {
        recommendations.push('Dividir a atividade em etapas menores e mais gerenciáveis')
      }
      if (indicator.type === 'consecutive_failures') {
        recommendations.push('Revisar o nível de dificuldade e considerar adaptar a progressão')
      }
      if (indicator.type === 'poor_regulation') {
        recommendations.push('Integrar técnicas de autorregulação antes e durante a atividade')
      }
    })

    return recommendations
  }

  /**
   * Gera recomendações baseadas no nível de persistência
   * @private
   */
  generatePersistenceRecommendations(level, category) {
    const recommendations = []

    switch (level) {
      case 'exceptional':
        recommendations.push(
          'Continuar desafios graduais e progressivos',
          'Reconhecer e valorizar a alta persistência demonstrada'
        )
        break
      case 'good':
        recommendations.push(
          'Manter o equilíbrio atual entre desafio e suporte',
          'Implementar sistema de recompensas por metas concluídas'
        )
        break
      case 'moderate':
        recommendations.push(
          'Estabelecer metas menores e mais frequentes',
          'Aumentar feedback positivo durante a atividade'
        )
        break
      case 'low':
        recommendations.push(
          'Reduzir a complexidade inicial das tarefas',
          'Implementar sistema de recompensas mais imediato',
          'Fornecer suporte visual estruturado'
        )
        break
    }

    // Adicionar recomendações específicas por categoria
    if (category === this.GAME_CATEGORIES.COGNITIVE) {
      recommendations.push(
        'Usar interesses especiais para aumentar motivação em tarefas cognitivas'
      )
    } else if (category === this.GAME_CATEGORIES.SOCIAL) {
      recommendations.push('Incorporar elementos de interesse específico em atividades sociais')
    }

    return recommendations
  }

  /**
   * Calcula nível de suporte necessário com base em indicadores
   * @private
   */
  calculateSupportNeedsLevel(indicators, sessionData) {
    // Pontuar fatores que indicam necessidades de suporte
    let supportScore = 0

    // Indicadores comportamentais
    if (indicators) {
      const regulation = indicators.regulation || {}
      if (regulation.score && regulation.score < 30) supportScore += 30

      const persistence = indicators.persistence || {}
      if (persistence.score && persistence.score < 30) supportScore += 20

      const frustration = indicators.frustration || {}
      if (frustration.score && frustration.score > 70) supportScore += 25
    }

    // Dados da sessão
    if (sessionData) {
      if (sessionData.errorRate > 0.6) supportScore += 15
      if (sessionData.averageResponseTime > 10000) supportScore += 10
      if (sessionData.abandonmentRate > 0.5) supportScore += 20
    }

    // Determinar nível
    if (supportScore >= 70) return 'high'
    if (supportScore >= 40) return 'medium'
    return 'low'
  }

  /**
   * Identifica pontos fortes comportamentais
   * @private
   */
  identifyBehavioralStrengths(indicators) {
    const strengths = []

    if (!indicators) return strengths

    // Analisar indicadores para identificar pontos fortes
    const persistence = indicators.persistence || {}
    if (persistence.score && persistence.score > 70) {
      strengths.push('high_persistence')
    }

    const regulation = indicators.regulation || {}
    if (regulation.score && regulation.score > 70) {
      strengths.push('good_self_regulation')
    }

    const frustration = indicators.frustration || {}
    if (frustration.score && frustration.score < 30) {
      strengths.push('frustration_tolerance')
    }

    // Outras forças possíveis
    if (indicators.focusedAttention) strengths.push('focused_attention')
    if (indicators.followsRoutine) strengths.push('routine_adherence')
    if (indicators.patternRecognition) strengths.push('pattern_recognition')

    return strengths
  }

  /**
   * Identifica desafios comportamentais
   * @private
   */
  identifyBehavioralChallenges(indicators) {
    const challenges = []

    if (!indicators) return challenges

    // Analisar indicadores para identificar desafios
    const persistence = indicators.persistence || {}
    if (persistence.score && persistence.score < 30) {
      challenges.push('low_persistence')
    }

    const regulation = indicators.regulation || {}
    if (regulation.score && regulation.score < 30) {
      challenges.push('regulation_difficulty')
    }

    const frustration = indicators.frustration || {}
    if (frustration.score && frustration.score > 70) {
      challenges.push('high_frustration')
    }

    // Outros desafios possíveis
    if (indicators.transitionDifficulties) challenges.push('transition_challenges')
    if (indicators.sensorySensitivities) challenges.push('sensory_sensitivities')
    if (indicators.rigidThinking) challenges.push('cognitive_inflexibility')

    return challenges
  }

  /**
   * Gera recomendações para carga cognitiva
   * @private
   */
  getCognitiveLoadRecommendations(level, factors) {
    const recommendations = []

    switch (level) {
      case 'high':
        recommendations.push(
          'Simplificar instruções e apresentar uma etapa de cada vez',
          'Reduzir estímulos visuais e auditivos concorrentes',
          'Incorporar pausas estruturadas entre atividades'
        )
        break
      case 'medium':
        recommendations.push(
          'Fornecer suporte visual adicional para instruções',
          'Considerar um ritmo mais pausado entre tarefas'
        )
        break
      case 'low':
        recommendations.push(
          'Manter o nível atual de complexidade',
          'Considerar aumentos graduais no desafio cognitivo'
        )
        break
    }

    // Adicionar recomendações específicas baseado nos fatores
    factors.forEach((factor) => {
      if (factor.name === 'response_time' && factor.impact === 'high') {
        recommendations.push('Considerar aumentar o tempo disponível para resposta')
      }
      if (factor.name === 'error_rate' && factor.impact === 'high') {
        recommendations.push('Revisar a clareza das instruções e fornecer exemplos adicionais')
      }
      if (factor.name === 'abandonment') {
        recommendations.push('Dividir a atividade em segmentos menores com reforço frequente')
      }
    })

    return recommendations
  }

  /**
   * Gera recomendações para engajamento social
   * @private
   */
  getSocialEngagementRecommendations(level) {
    const recommendations = []

    switch (level) {
      case 'high':
        recommendations.push(
          'Continuar expandindo oportunidades de interação social em novos contextos',
          'Introduzir conceitos mais complexos de reciprocidade social',
          'Considerar atividades em grupo pequeno com pares'
        )
        break
      case 'moderate':
        recommendations.push(
          'Incorporar interesses específicos nas atividades sociais',
          'Implementar estratégias estruturadas de revezamento',
          'Modelar e praticar iniciar conversas'
        )
        break
      case 'low':
        recommendations.push(
          'Começar com interações sociais altamente estruturadas',
          'Usar suporte visual para roteiros sociais',
          'Praticar respostas a perguntas simples e diretas',
          'Incorporar interesses motivadores em atividades sociais'
        )
        break
    }

    return recommendations
  }

  /**
   * Gera histórico simulado para demonstração
   * @private
   */
  getSimulatedCategoryHistory(userId, category) {
    // Em produção, obteríamos dados reais do banco de dados
    // Para demonstração, geramos dados simulados mas realistas
    const sessions = []
    const sessionsCount = 5 + Math.floor(Math.random() * 5) // 5-9 sessões

    for (let i = 0; i < sessionsCount; i++) {
      const session = {
        sessionId: `sim_${userId}_${category}_${i}`,
        timestamp: Date.now() - i * 86400000, // 1 dia atrás por sessão
        completionRatio: 0.3 + Math.random() * 0.7, // 0.3-1.0
        successRate: 0.4 + Math.random() * 0.5, // 0.4-0.9
        retryCount: Math.floor(Math.random() * 4), // 0-3 tentativas
        startLevel: 1 + Math.floor(i / 2), // Nível aumenta a cada 2 sessões
        progressLevel: 1 + Math.floor(i / 2) + (Math.random() > 0.7 ? 1 : 0), // Progresso ocasional
        duration: 5 * 60 * 1000 + Math.random() * 10 * 60 * 1000, // 5-15 minutos
      }

      sessions.push(session)
    }

    return sessions
  }
}

// Exportação para uso em outros módulos
export const behavioralEngagementAnalyzer = new BehavioralEngagementAnalyzer()
export default behavioralEngagementAnalyzer
