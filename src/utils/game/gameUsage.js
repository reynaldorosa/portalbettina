// Utilitário para monitorar uso dos jogos e ranking dinâmico
const USAGE_KEY = 'portalBetina_gameUsage';
const RANKING_UPDATE_KEY = 'portalBetina_lastRankingUpdate';
const RANKING_CACHE_KEY = 'portalBetina_rankingCache';
const UPDATE_INTERVAL_HOURS = 24; // Atualiza ranking a cada 24 horas
const CACHE_DURATION_MINUTES = 30; // Cache válido por 30 minutos

/**
 * Incrementa o contador de uso de um jogo
 * @param {string} gameId - ID do jogo
 */
export function incrementGameUsage(gameId) {
  try {
    const usage = getGameUsageCounts();
    usage[gameId] = (usage[gameId] || 0) + 1;
    
    // Salva também timestamp da última jogada
    usage[`${gameId}_lastPlayed`] = Date.now();
    
    // Verificar se localStorage está disponível (browser)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    }
    
    // Log para debug (pode ser removido em produção)
    console.log(`📊 Jogo ${gameId} incrementado para ${usage[gameId]} usos`);
  } catch (error) {
    console.error('Erro ao incrementar uso do jogo:', error);
  }
}

/**
 * Retorna todos os contadores de uso dos jogos
 * @returns {Object} Objeto com contadores de uso
 */
export function getGameUsageCounts() {
  try {
    // Verificar se localStorage está disponível (browser)
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    }
    // Em Node.js, retornar objeto vazio ou usar cache em memória
    return {};
  } catch (error) {
    console.error('Erro ao recuperar contadores de uso:', error);
    return {};
  }
}

/**
 * Calcula score do jogo baseado em uso e recência
 * @param {string} gameId - ID do jogo
 * @param {Object} usage - Objeto com contadores de uso
 * @returns {number} Score calculado
 */
function calculateGameScore(gameId, usage) {
  const usageCount = usage[gameId] || 0;
  const lastPlayed = usage[`${gameId}_lastPlayed`] || 0;
  
  // Se nunca foi jogado, score = 0
  if (usageCount === 0) return 0;
  
  // Calcula recência (jogos mais recentes têm bonus)
  const daysSinceLastPlayed = (Date.now() - lastPlayed) / (1000 * 60 * 60 * 24);
  const recencyBonus = Math.max(0, 1 - (daysSinceLastPlayed / 30)); // Bonus diminui ao longo de 30 dias
  
  // Score = uso base + bonus de recência
  return usageCount + (recencyBonus * usageCount * 0.2);
}

/**
 * Embaralha um array (Fisher-Yates shuffle)
 * @param {Array} array - Array para embaralhar
 * @returns {Array} Array embaralhado
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Verifica se o cache do ranking ainda é válido
 * @returns {boolean} True se o cache é válido
 */
function isCacheValid() {
  try {
    const cache = JSON.parse(localStorage.getItem(RANKING_CACHE_KEY) || '{}');
    if (!cache.timestamp) return false;
    
    const cacheAge = (Date.now() - cache.timestamp) / (1000 * 60); // em minutos
    return cacheAge < CACHE_DURATION_MINUTES;
  } catch (error) {
    return false;
  }
}

/**
 * Salva o ranking no cache
 * @param {Array} ranking - Array com o ranking calculado
 */
function saveRankingCache(ranking) {
  try {
    const cache = {
      ranking,
      timestamp: Date.now()
    };
    localStorage.setItem(RANKING_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Erro ao salvar cache do ranking:', error);
  }
}

/**
 * Obtém o ranking do cache
 * @returns {Array|null} Ranking em cache ou null se inválido
 */
function getRankingCache() {
  try {
    if (!isCacheValid()) return null;
    
    const cache = JSON.parse(localStorage.getItem(RANKING_CACHE_KEY) || '{}');
    return cache.ranking || null;
  } catch (error) {
    return null;
  }
}

/**
 * Obtém os 6 jogos mais utilizados baseado no array de atividades atual
 * @param {Array} activities - Array com todas as atividades
 * @returns {Array} Array com os 6 jogos mais utilizados
 */
export function getTopGamesFromActivities(activities) {
  try {
    // Verifica cache primeiro para melhor performance
    const cachedRanking = getRankingCache();
    if (cachedRanking && cachedRanking.length >= 6) {
      console.log('📊 Usando ranking do cache para melhor performance');
      return cachedRanking.slice(0, 6);
    }

    const usage = getGameUsageCounts();
    
    // Verifica se há dados suficientes para ranking
    const totalUsage = Object.values(usage)
      .filter(val => typeof val === 'number')
      .reduce((sum, count) => sum + count, 0);
    
    // Se não há uso suficiente (menos de 5 jogadas), embaralha os jogos
    if (totalUsage < 5) {
      console.log('📊 Usando jogos embaralhados - dados insuficientes');
      return shuffleArray(activities).slice(0, 6);
    }
    
    // Adiciona score a cada atividade e ordena
    const activitiesWithScore = activities.map(activity => ({
      ...activity,
      score: calculateGameScore(activity.id, usage),
      usageCount: usage[activity.id] || 0
    }));
      // Ordena por score e pega os top 6
    const sortedActivities = activitiesWithScore.sort((a, b) => b.score - a.score);
    
    // Salva no cache para melhor performance
    saveRankingCache(sortedActivities);
    
    // Log para debug
    console.log('📊 Ranking atual:', sortedActivities
      .filter(a => a.usageCount > 0)
      .map(a => `${a.title}: ${a.usageCount} usos, score: ${a.score.toFixed(2)}`)
    );
    
    return sortedActivities.slice(0, 6);
    
  } catch (error) {
    console.error('Erro ao calcular top games:', error);
    // Fallback em caso de erro
    return shuffleArray(activities).slice(0, 6);
  }
}

/**
 * Reseta todos os contadores (útil para testes)
 */
export function resetGameUsage() {
  try {
    localStorage.removeItem(USAGE_KEY);
    localStorage.removeItem(RANKING_UPDATE_KEY);
    console.log('📊 Contadores de uso resetados');
  } catch (error) {
    console.error('Erro ao resetar uso dos jogos:', error);
  }
}

/**
 * Obtém estatísticas gerais de uso
 * @returns {Object} Estatísticas de uso
 */
export function getUsageStats() {
  try {
    const usage = getGameUsageCounts();
    const stats = {
      totalGames: 0,
      totalUsage: 0,
      mostPlayed: null,
      lastUpdate: localStorage.getItem(RANKING_UPDATE_KEY)
    };
    
    Object.entries(usage).forEach(([key, value]) => {
      if (typeof value === 'number' && !key.includes('_lastPlayed')) {
        stats.totalGames++;
        stats.totalUsage += value;
        
        if (!stats.mostPlayed || value > usage[stats.mostPlayed]) {
          stats.mostPlayed = key;
        }
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      totalGames: 0,
      totalUsage: 0,
      mostPlayed: null,
      lastUpdate: null
    };
  }
}

/**
 * Obtém jogos filtrados por categoria/tipo
 * @param {Array} activities - Array com todas as atividades
 * @param {string} category - Categoria para filtrar ('cognitive', 'motor', 'social', etc.)
 * @returns {Array} Jogos filtrados
 */
export function getGamesByCategory(activities, category) {
  try {
    const categoryMap = {
      'cognitive': ['memory-game', 'image-association', 'letter-recognition', 'number-counting'],
      'motor': ['color-match', 'musical-sequence'],
      'social': ['emotions'],
      'educational': ['letter-recognition', 'number-counting', 'number-sequence']
    };

    const gameIds = categoryMap[category] || [];
    return activities.filter(activity => gameIds.includes(activity.id));
  } catch (error) {
    console.error('Erro ao filtrar jogos por categoria:', error);
    return [];
  }
}

/**
 * Obtém insights de uso baseado em padrões
 * @returns {Object} Insights e recomendações
 */
export function getUsageInsights() {
  try {
    const usage = getGameUsageCounts();
    const stats = getUsageStats();
    
    const insights = {
      totalEngagement: stats.totalUsage,
      diversityScore: stats.totalGames / 9 * 100, // % de jogos explorados
      recommendations: [],
      trends: {
        mostActive: null,
        leastActive: null,
        trending: []
      }
    };

    // Identifica jogos menos utilizados para recomendar
    const gameUsage = Object.entries(usage)
      .filter(([key]) => !key.includes('_lastPlayed'))
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => a.count - b.count);

    if (gameUsage.length > 0) {
      insights.trends.leastActive = gameUsage[0];
      insights.trends.mostActive = gameUsage[gameUsage.length - 1];
    }

    // Gera recomendações
    if (insights.diversityScore < 50) {
      insights.recommendations.push({
        type: 'diversity',
        message: 'Experimente explorar mais jogos para uma experiência completa!'
      });
    }

    if (stats.totalUsage > 20) {
      insights.recommendations.push({
        type: 'achievement',
        message: 'Parabéns! Você está muito ativo no portal!'
      });
    }

    return insights;
  } catch (error) {
    console.error('Erro ao gerar insights:', error);
    return {
      totalEngagement: 0,
      diversityScore: 0,
      recommendations: [],
      trends: {}
    };
  }
}

/**
 * Limpa cache quando necessário
 */
export function clearCache() {
  try {
    localStorage.removeItem(RANKING_CACHE_KEY);
    console.log('📊 Cache do ranking limpo');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
}

/**
 * Exporta todos os dados para backup
 * @returns {Object} Dados completos para backup
 */
export function exportAllData() {
  try {
    return {
      gameUsage: getGameUsageCounts(),
      stats: getUsageStats(),
      insights: getUsageInsights(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return null;
  }
}