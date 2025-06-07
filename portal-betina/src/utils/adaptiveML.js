// Adaptative Machine Learning para jogos educacionais
// Algoritmos para ajustar a dificuldade dos jogos com base no desempenho
import databaseService from '../services/databaseService.js';

// Constantes
const HISTORY_SIZE = 10; // Número de jogos recentes a considerar
const THRESHOLD_EASY_TO_MEDIUM = 0.7; // 70% de precisão para subir de nível
const THRESHOLD_MEDIUM_TO_HARD = 0.8; // 80% de precisão para subir de nível
const THRESHOLD_HARD_TO_MEDIUM = 0.4; // Abaixo de 40% precisão para baixar
const THRESHOLD_MEDIUM_TO_EASY = 0.3; // Abaixo de 30% precisão para baixar

// Modelo adaptativo com suporte a banco de dados
export class AdaptiveModel {
  constructor(gameId) {
    this.gameId = gameId;
    this.historyKey = `betina_${gameId}_history`;
    this.userId = localStorage.getItem('betina_user_id');
    this.gameHistory = [];
    this.loadHistory();
  }

  // Carregar histórico do jogo (combinando banco de dados e localStorage)
  async loadHistory() {
    try {
      // Carregar do localStorage como backup
      const localHistory = localStorage.getItem(this.historyKey);
      let history = localHistory ? JSON.parse(localHistory) : [];
      
      // Se temos um userId, tentar carregar do banco de dados
      if (this.userId) {
        try {
          const dbSessions = await databaseService.getGameSessions(this.userId, this.gameId, HISTORY_SIZE);
          if (dbSessions && dbSessions.length > 0) {
            // Transformar os dados do banco para o formato esperado
            history = dbSessions.map(session => ({
              difficulty: session.difficulty,
              accuracy: session.accuracy / 100, // Converter de porcentagem para decimal
              score: session.score,
              timeSpent: session.time_spent,
              timestamp: session.created_at,
              ...session.data
            }));
          }
        } catch (dbError) {
          console.warn('Erro ao carregar histórico do banco:', dbError);
          // Manter o histórico do localStorage se falhar
        }
      }
      
      this.gameHistory = history;
      return history;
    } catch (error) {
      console.warn('Erro ao carregar histórico de jogo:', error);
      return [];
    }
  }

  // Salvar nova entrada no histórico
  async saveGameData(gameData) {
    try {
      // Atualizar o histórico em memória
      const entry = {
        ...gameData,
        timestamp: new Date().toISOString()
      };
      
      this.gameHistory.push(entry);
      
      // Limitar histórico para os jogos mais recentes
      if (this.gameHistory.length > HISTORY_SIZE) {
        this.gameHistory = this.gameHistory.slice(-HISTORY_SIZE);
      }
      
      // Salvar no localStorage como backup
      localStorage.setItem(this.historyKey, JSON.stringify(this.gameHistory));
        // Salvar no banco de dados se houver userId
      if (this.userId) {
        try {
          const sessionData = {
            user_id: this.userId,
            game_id: this.gameId,
            difficulty: gameData.difficulty,
            score: gameData.score || 0,
            accuracy: gameData.accuracy !== undefined ? gameData.accuracy * 100 : 0, // Converter para porcentagem com validação
            time_spent: gameData.timeSpent || 0,
            completed: true,
            correct_answers: gameData.successes || 0,
            total_attempts: gameData.attempts || 1, // Evitar divisão por zero
            data: gameData
          };
          
          // O novo método saveGameSession não lança exceções
          const result = await databaseService.saveGameSession(sessionData);
          
          if (result.offline) {
            console.log('📱 Dados salvos localmente devido à falta de conexão');
          } else if (result.error) {
            console.warn('⚠️ Erro ao salvar dados:', result.message);
          } else {
            console.log('💾 Dados salvos no servidor com sucesso');
          }
        } catch (dbError) {
          // Este bloco raramente será executado devido às melhorias no databaseService
          console.warn('Erro inesperado ao salvar no banco de dados:', dbError);
        }
      }
      
      return this.recommendDifficulty();
    } catch (error) {
      console.warn('Erro ao salvar dados do jogo:', error);
      return null;
    }
  }

  // Calcular média de uma propriedade no histórico
  calculateAverage(property) {
    if (!this.gameHistory || this.gameHistory.length === 0) {
      return null;
    }
    
    const sum = this.gameHistory.reduce((acc, game) => {
      return acc + (game[property] || 0);
    }, 0);
    
    return sum / this.gameHistory.length;
  }

  // Recomendar dificuldade com base no desempenho
  recommendDifficulty() {
    if (this.gameHistory.length < 3) {
      return 'MEDIUM'; // Dificuldade padrão com poucos dados
    }
    
    const averageAccuracy = this.calculateAverage('accuracy');
    const currentDifficulty = this.gameHistory[this.gameHistory.length - 1].difficulty;
    
    // Usar tendência linear para decisão mais precisa
    const recentAccuracy = this.calculateTrend('accuracy');
    
    // Decisões de mudança de dificuldade
    switch (currentDifficulty) {
      case 'EASY':
        if (averageAccuracy > THRESHOLD_EASY_TO_MEDIUM && recentAccuracy > 0) {
          return 'MEDIUM';
        }
        break;
      case 'MEDIUM':
        if (averageAccuracy > THRESHOLD_MEDIUM_TO_HARD && recentAccuracy > 0) {
          return 'HARD';
        } else if (averageAccuracy < THRESHOLD_MEDIUM_TO_EASY || recentAccuracy < -0.1) {
          return 'EASY';
        }
        break;
      case 'HARD':
        if (averageAccuracy < THRESHOLD_HARD_TO_MEDIUM || recentAccuracy < -0.1) {
          return 'MEDIUM';
        }
        break;
    }
    
    return currentDifficulty; // Manter dificuldade atual
  }
  
  // Calcular tendência linear da propriedade (positiva = melhorando, negativa = piorando)
  calculateTrend(property) {
    if (this.gameHistory.length < 3) {
      return 0;
    }
    
    // Últimos 5 jogos ou menos
    const recentGames = this.gameHistory.slice(-5);
    if (recentGames.length < 2) return 0;
    
    // Cálculo simples de inclinação (positiva = tendência de melhora)
    const xValues = Array.from({ length: recentGames.length }, (_, i) => i);
    const yValues = recentGames.map(game => game[property] || 0);
    
    // Regressão linear básica
    const n = xValues.length;
    const sumX = xValues.reduce((acc, x) => acc + x, 0);
    const sumY = yValues.reduce((acc, y) => acc + y, 0);
    const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
    const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);
    
    // Calcular inclinação (slope)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope; // Positivo = melhorando, Negativo = piorando
  }
  
  // Predizer pontuação futura com base na tendência atual
  predictScore() {
    if (this.gameHistory.length < 3) {
      return null;
    }
    
    const accuracyTrend = this.calculateTrend('accuracy');
    const lastAccuracy = this.gameHistory[this.gameHistory.length - 1].accuracy;
    
    return Math.min(100, Math.max(0, lastAccuracy + (accuracyTrend * 10))); 
  }
}

// Factory de modelos adaptativos
export const createAdaptiveModel = (gameId, userId = null) => {
  const model = new AdaptiveModel(gameId);
  if (userId) {
    model.userId = userId;
  }
  return model;
};

// Função para ajustar parâmetros de jogo com base em um modelo adaptativo
export const getAdaptiveParameters = async (gameId, currentDifficulty) => {
  const model = new AdaptiveModel(gameId);
  await model.loadHistory(); // Garantir que o histórico foi carregado
  const recommendedDifficulty = model.recommendDifficulty() || currentDifficulty;
  
  // Tentar obter parâmetros do banco de dados
  let parameters = null;
  try {
    parameters = await databaseService.getAdaptiveParameters(gameId, recommendedDifficulty);
  } catch (error) {
    console.warn('Erro ao buscar parâmetros adaptativos do banco:', error);
  }
  
  // Se não encontrou no banco, usar parâmetros padrão
  if (!parameters) {
    // Parâmetros padrão por tipo de jogo
    const defaultParams = {
      'memory-game': {
        'EASY': { pairs: 4, timeLimit: 120, hintDuration: 1000 },
        'MEDIUM': { pairs: 6, timeLimit: 180, hintDuration: 800 },
        'HARD': { pairs: 8, timeLimit: 240, hintDuration: 500 }
      },
      'color-match': {
        'EASY': { correctItems: 2, incorrectItems: 2, timeLimit: 60 },
        'MEDIUM': { correctItems: 3, incorrectItems: 3, timeLimit: 45 },
        'HARD': { correctItems: 4, incorrectItems: 4, timeLimit: 30 }
      },
      'musical-sequence': {
        'EASY': { maxNotes: 3, speed: 1000 },
        'MEDIUM': { maxNotes: 5, speed: 800 },
        'HARD': { maxNotes: 7, speed: 600 }
      },
      'number-counting': {
        'EASY': { minCount: 1, maxCount: 5, options: 3 },
        'MEDIUM': { minCount: 1, maxCount: 10, options: 4 },
        'HARD': { minCount: 5, maxCount: 15, options: 5 }
      },      'letter-recognition': {
        'EASY': { 
          focusLetters: ['A', 'E', 'O'],
          timeLimit: 15,
          audioHints: true
        },
        'MEDIUM': { 
          focusLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          timeLimit: 10,
          audioHints: false
        },
        'HARD': { 
          focusLetters: ['L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'],
          timeLimit: 8,
          audioHints: false
        }
      },
      'image-association': {
        'EASY': { categories: ['animals', 'fruits'], timeLimit: 20 },
        'MEDIUM': { categories: ['animals', 'fruits', 'toys', 'vehicles'], timeLimit: 15 },
        'HARD': { categories: ['all'], timeLimit: 10 }
      }
    };
    
    parameters = defaultParams[gameId]?.[recommendedDifficulty] || {};
  }
  
  return {
    difficulty: recommendedDifficulty,
    parameters
  };
};

// Função para analisar tendências de aprendizado em jogos específicos
export const analyzeLearningSessions = (gameId) => {
  const model = new AdaptiveModel(gameId);
  const history = model.gameHistory;
  
  if (history.length < 5) {
    return {
      hasEnoughData: false,
      message: 'Precisa de mais partidas para análise completa'
    };
  }
  
  // Análise para o jogo de letras - determinar quais letras precisam de mais prática
  if (gameId === 'letter-recognition') {
    const letterPerformance = {};
    
    // Analisar o desempenho por letra
    history.forEach(game => {
      if (!game.letter) return;
      
      const letter = game.letter;
      if (!letterPerformance[letter]) {
        letterPerformance[letter] = { attempts: 0, successes: 0 };
      }
      
      letterPerformance[letter].attempts++;
      if (game.accuracy > 0) {
        letterPerformance[letter].successes++;
      }
    });
    
    // Identificar as letras com baixo desempenho
    const strugglingLetters = Object.entries(letterPerformance)
      .filter(([_, data]) => data.attempts > 1)
      .filter(([_, data]) => (data.successes / data.attempts) < 0.6)
      .map(([letter]) => letter);
    
    return {
      hasEnoughData: true,
      strugglingLetters,
      letterPerformance
    };
  }
  
  // Análise genérica para outros jogos
  return {
    hasEnoughData: true,
    averageAccuracy: model.calculateAverage('accuracy'),
    trend: model.calculateTrend('accuracy'),
    prediction: model.predictScore()
  };
};
