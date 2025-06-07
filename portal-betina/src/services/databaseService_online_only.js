// Serviço de banco de dados para arquitetura Docker
// Comunica exclusivamente com o backend PostgreSQL através da API REST
// APENAS MODO ONLINE - Requer conexão com banco de dados

// Detectar se está rodando no Docker ou localmente
const isDockerEnvironment = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1' && 
                           window.location.hostname !== '';
const DEFAULT_API_URL = isDockerEnvironment ? '/api' : 'http://localhost:3000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

class DatabaseService {
  constructor() {
    this.apiUrl = API_BASE_URL;
    console.log('DatabaseService iniciado - APENAS MODO ONLINE');
    console.log('API URL:', this.apiUrl);
  }

  // Verificar se a API está disponível
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        console.log('API disponível');
        return true;
      }
      throw new Error('API não disponível');
    } catch (error) {
      console.error('Erro ao conectar com a API:', error.message);
      throw new Error('Conecte-se à internet para usar o Portal Betina');
    }
  }

  // ============== USUÁRIOS ==============
  
  async createAnonymousUser() {
    try {
      const response = await fetch(`${this.apiUrl}/user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ is_anonymous: true })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Usuário anônimo criado:', data.id);
      return data.id;
    } catch (error) {
      console.error('Erro ao criar usuário anônimo:', error);
      throw new Error('Não foi possível criar usuário. Verifique sua conexão com a internet.');
    }
  }

  async getUser(userId) {
    if (!userId || typeof userId !== 'string') {
      console.error('UserId inválido:', userId);
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/user/${userId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Não foi possível buscar usuário. Verifique sua conexão com a internet.');
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const response = await fetch(`${this.apiUrl}/user/${userId}/preferences`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw new Error('Não foi possível atualizar preferências. Verifique sua conexão com a internet.');
    }
  }

  // ============== CONFIGURAÇÕES DE ACESSIBILIDADE ==============
  
  async getAccessibilitySettings(userId) {
    const defaultSettings = {
      fontSize: 'medium',
      contrast: 'normal',
      audioEnabled: true,
      animations: true
    };

    try {
      const response = await fetch(`${this.apiUrl}/user/${userId}/accessibility`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return defaultSettings;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao buscar configurações de acessibilidade:', error);
      return defaultSettings;
    }
  }

  async updateAccessibilitySettings(userId, settings) {
    try {
      const response = await fetch(`${this.apiUrl}/user/${userId}/accessibility`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações de acessibilidade:', error);
      throw new Error('Não foi possível atualizar configurações. Verifique sua conexão com a internet.');
    }
  }

  // ============== SESSÕES DE JOGO ==============
  
  async saveGameSession(sessionData) {
    try {
      const response = await fetch(`${this.apiUrl}/game-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao salvar sessão de jogo:', error);
      throw new Error('Não foi possível salvar sessão. Verifique sua conexão com a internet.');
    }
  }

  async getUserGameSessions(userId) {
    try {
      const response = await fetch(`${this.apiUrl}/user/${userId}/game-sessions`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao buscar sessões de jogo:', error);
      return [];
    }
  }

  async getGameSessions(userId, gameId = null, limit = 50) {
    if (!userId || typeof userId !== 'string') {
      console.error('UserId inválido para getGameSessions:', userId);
      return [];
    }

    try {
      let url = `${this.apiUrl}/user/${userId}/game-sessions`;
      
      const params = new URLSearchParams();
      if (gameId) {
        params.append('game_id', gameId);
      }
      if (limit) {
        params.append('limit', limit);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao buscar sessões de jogo:', error);
      return [];
    }
  }

  // ============== UTILITÁRIOS ==============
  
  async healthCheck() {
    return await this.checkApiHealth();
  }

  async closeConnection() {
    // Conexões REST não precisam ser fechadas explicitamente
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.apiUrl}/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw new Error('Não foi possível excluir usuário. Verifique sua conexão com a internet.');
    }
  }

  // ============== PARÂMETROS ADAPTATIVOS ==============
  
  async getAdaptiveParameters(gameId, difficulty) {
    const defaultParameters = {
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
      'letter-recognition': {
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
      'musical-sequence': {
        'EASY': { maxNotes: 3, speed: 1000 },
        'MEDIUM': { maxNotes: 5, speed: 800 },
        'HARD': { maxNotes: 7, speed: 600 }
      },
      'number-counting': {
        'EASY': { minCount: 1, maxCount: 5, options: 3 },
        'MEDIUM': { minCount: 1, maxCount: 10, options: 4 },
        'HARD': { minCount: 5, maxCount: 15, options: 5 }
      },
      'image-association': {
        'EASY': { categories: ['animals', 'fruits'], timeLimit: 20 },
        'MEDIUM': { categories: ['animals', 'fruits', 'toys', 'vehicles'], timeLimit: 15 },
        'HARD': { categories: ['all'], timeLimit: 10 }
      },
      'creative-painting': {
        'EASY': { 
          minStrokes: 3, 
          minColors: 1, 
          timeLimit: 180,
          challengeType: 'free-draw'
        },
        'MEDIUM': { 
          minStrokes: 5, 
          minColors: 2, 
          timeLimit: 120,
          challengeType: 'guided'
        },
        'HARD': { 
          minStrokes: 8, 
          minColors: 4, 
          timeLimit: 90,
          challengeType: 'complex'
        }
      }
    };

    try {
      const response = await fetch(`${this.apiUrl}/adaptive-parameters/${gameId}/${difficulty}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Retornar parâmetros padrão se não encontrar na API
          const gameParams = defaultParameters[gameId];
          if (gameParams && gameParams[difficulty]) {
            return {
              gameId,
              difficulty,
              parameters: gameParams[difficulty],
              timestamp: new Date().toISOString()
            };
          }
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const parameters = await response.json();
      return parameters;
    } catch (error) {
      console.error('Erro ao buscar parâmetros adaptativos, usando padrão:', error);
      // Retornar parâmetros padrão em caso de erro
      const gameParams = defaultParameters[gameId];
      if (gameParams && gameParams[difficulty]) {
        return {
          gameId,
          difficulty,
          parameters: gameParams[difficulty],
          timestamp: new Date().toISOString()
        };
      }
      return null;
    }
  }
}

// Criar e exportar instância única
const databaseService = new DatabaseService();

export default databaseService;
