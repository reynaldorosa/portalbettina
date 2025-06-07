// Serviço de banco de dados para arquitetura Docker
// Comunica exclusivamente com o backend PostgreSQL através da API REST
// Com fallback completo para modo offline usando localStorage

// Detectar se está rodando no Docker ou localmente
const isDockerEnvironment = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1' && 
                           window.location.hostname !== '';
const DEFAULT_API_URL = isDockerEnvironment ? '/api' : 'http://localhost:3000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

class DatabaseService {
  constructor() {
    this.apiUrl = API_BASE_URL;
    // Iniciar em modo offline por padrão para evitar erros desnecessários
    this.isOfflineMode = true;
    this.apiHealthCheckDone = false;
    
    // Verificar se já sabemos que está offline
    const savedOfflineMode = localStorage.getItem('portal_offline_mode');
    if (savedOfflineMode === 'false') {
      // Só tentar online se explicitamente configurado
      this.isOfflineMode = false;
    } else {
      // Garantir que está salvo como offline
      localStorage.setItem('portal_offline_mode', 'true');
    }
    
    console.log('DatabaseService iniciado em modo:', this.isOfflineMode ? 'OFFLINE' : 'ONLINE');
  }

  // Verificar se a API está disponível (apenas quando necessário)
  async checkApiHealth() {
    // Se já foi verificado e está offline, não verificar novamente
    if (this.apiHealthCheckDone && this.isOfflineMode) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
      
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.isOfflineMode = false;
        localStorage.setItem('portal_offline_mode', 'false');
        this.apiHealthCheckDone = true;
        console.log('API disponível - mudando para modo ONLINE');
        return true;
      } else {
        throw new Error(`API Health check failed: ${response.status}`);
      }
    } catch (error) {
      this.isOfflineMode = true;
      localStorage.setItem('portal_offline_mode', 'true');
      this.apiHealthCheckDone = true;
      console.log('API indisponível - permanecendo em modo OFFLINE');
      return false;
    }
  }

  // Métodos para localStorage (modo offline)
  getLocalData(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`portal_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.warn('Erro ao ler localStorage:', error);
      return defaultValue;
    }
  }

  setLocalData(key, value) {
    try {
      localStorage.setItem(`portal_${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  // ============== USUÁRIOS ==============
  
  async createAnonymousUser() {
    // Se já está em modo offline, criar usuário local diretamente
    if (this.isOfflineMode) {
      const fallbackId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const userData = {
        id: fallbackId,
        username: `Usuário_${fallbackId.split('_')[1]}`,
        is_anonymous: true,
        created_at: new Date().toISOString(),
        offline: true
      };
      
      this.setLocalData(`user_${fallbackId}`, userData);
      console.log('Usuário anônimo criado offline:', fallbackId);
      return fallbackId;
    }

    // Só verificar API se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    
    if (!apiAvailable) {
      this.isOfflineMode = true;
      localStorage.setItem('portal_offline_mode', 'true');
      return this.createAnonymousUser(); // Recriar em modo offline
    }

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
      return data.id;
    } catch (error) {
      console.error('Erro ao criar usuário anônimo:', error);
      this.isOfflineMode = true;
      return this.createAnonymousUser(); // Retry em modo offline
    }
  }

  async getUser(userId) {
    if (!userId || typeof userId !== 'string') {
      console.error('UserId inválido:', userId);
      return null;
    }

    // Se está offline ou é usuário local, usar localStorage
    if (this.isOfflineMode || userId.startsWith('local_')) {
      const userData = this.getLocalData(`user_${userId}`);
      return userData || null;
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      const userData = this.getLocalData(`user_${userId}`);
      return userData || null;
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
      return null;
    }
  }

  async updateUserPreferences(userId, preferences) {
    // Se está offline, salvar direto no localStorage
    if (this.isOfflineMode) {
      this.setLocalData(`user_preferences_${userId}`, preferences);
      return true;
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      this.setLocalData(`user_preferences_${userId}`, preferences);
      return true;
    }

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
      console.error('Erro ao atualizar preferências, salvando offline:', error);
      this.isOfflineMode = true;
      this.setLocalData(`user_preferences_${userId}`, preferences);
      return true;
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

    // Se está offline, buscar do localStorage
    if (this.isOfflineMode) {
      return this.getLocalData(`accessibility_${userId}`, defaultSettings);
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      return this.getLocalData(`accessibility_${userId}`, defaultSettings);
    }

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
      console.error('Erro ao buscar configurações de acessibilidade, usando offline:', error);
      this.isOfflineMode = true;
      return this.getLocalData(`accessibility_${userId}`, defaultSettings);
    }
  }

  async updateAccessibilitySettings(userId, settings) {
    // Se está offline, salvar direto no localStorage
    if (this.isOfflineMode) {
      this.setLocalData(`accessibility_${userId}`, settings);
      return true;
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      this.setLocalData(`accessibility_${userId}`, settings);
      return true;
    }

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
      console.error('Erro ao atualizar configurações de acessibilidade, salvando offline:', error);
      this.isOfflineMode = true;
      this.setLocalData(`accessibility_${userId}`, settings);
      return true;
    }
  }

  // ============== SESSÕES DE JOGO ==============
  
  async saveGameSession(sessionData) {
    // Se está offline, salvar direto no localStorage
    if (this.isOfflineMode) {
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const sessionWithId = {
        ...sessionData,
        id: sessionId,
        created_at: new Date().toISOString(),
        offline: true
      };
      
      const userSessions = this.getLocalData(`user_sessions_${sessionData.user_id}`, []);
      userSessions.push(sessionWithId);
      this.setLocalData(`user_sessions_${sessionData.user_id}`, userSessions);
      
      return sessionWithId;
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      this.isOfflineMode = true;
      return this.saveGameSession(sessionData); // Retry em modo offline
    }

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
      console.error('Erro ao salvar sessão de jogo, salvando offline:', error);
      this.isOfflineMode = true;
      return this.saveGameSession(sessionData);
    }
  }

  async getUserGameSessions(userId) {
    // Se está offline, buscar do localStorage
    if (this.isOfflineMode) {
      return this.getLocalData(`user_sessions_${userId}`, []);
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      return this.getLocalData(`user_sessions_${userId}`, []);
    }

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
      console.error('Erro ao buscar sessões de jogo, usando offline:', error);
      this.isOfflineMode = true;
      return this.getLocalData(`user_sessions_${userId}`, []);
    }
  }

  async getGameSessions(userId, gameId = null, limit = 50) {
    if (!userId || typeof userId !== 'string') {
      console.error('UserId inválido para getGameSessions:', userId);
      return [];
    }

    // Se está offline, usar localStorage diretamente
    if (this.isOfflineMode) {
      console.log(`Buscando sessões de jogo offline para ${userId}, gameId: ${gameId}`);
      const userSessions = this.getLocalData(`user_sessions_${userId}`, []);
      let filteredSessions = userSessions;
      
      if (gameId) {
        filteredSessions = userSessions.filter(session => session.game_id === gameId);
      }
      
      if (limit) {
        filteredSessions = filteredSessions.slice(-limit);
      }
      
      return filteredSessions;
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      console.log('API não disponível, usando dados offline');
      this.isOfflineMode = true;
      
      // Usar dados locais sem recursão
      const userSessions = this.getLocalData(`user_sessions_${userId}`, []);
      let filteredSessions = userSessions;
      
      if (gameId) {
        filteredSessions = userSessions.filter(session => session.game_id === gameId);
      }
      
      if (limit) {
        filteredSessions = filteredSessions.slice(-limit);
      }
      
      return filteredSessions;
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
      console.error('Erro ao buscar sessões de jogo, usando dados offline:', error);
      this.isOfflineMode = true;
      
      // Usar dados locais sem recursão
      const userSessions = this.getLocalData(`user_sessions_${userId}`, []);
      let filteredSessions = userSessions;
      
      if (gameId) {
        filteredSessions = userSessions.filter(session => session.game_id === gameId);
      }
      
      if (limit) {
        filteredSessions = filteredSessions.slice(-limit);
      }
      
      return filteredSessions;
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

    const gameParams = defaultParameters[gameId];
    if (gameParams && gameParams[difficulty]) {
      return {
        gameId,
        difficulty,
        parameters: gameParams[difficulty],
        timestamp: new Date().toISOString(),
        offline: true
      };
    }
    
    return null;
  }

  // ============== UTILITÁRIOS ==============
  
  async healthCheck() {
    return await this.checkApiHealth();
  }

  async closeConnection() {
    // Conexões REST não precisam ser fechadas explicitamente
  }

  async deleteUser(userId) {
    // Se está offline, remover do localStorage
    if (this.isOfflineMode) {
      try {
        localStorage.removeItem(`portal_user_${userId}`);
        localStorage.removeItem(`portal_user_sessions_${userId}`);
        localStorage.removeItem(`portal_user_preferences_${userId}`);
        localStorage.removeItem(`portal_accessibility_${userId}`);
        return true;
      } catch (error) {
        console.error('Erro ao remover usuário offline:', error);
        return false;
      }
    }

    // Tentar API apenas se não estiver offline
    const apiAvailable = await this.checkApiHealth();
    if (!apiAvailable) {
      // Fallback para remoção offline
      try {
        localStorage.removeItem(`portal_user_${userId}`);
        localStorage.removeItem(`portal_user_sessions_${userId}`);
        localStorage.removeItem(`portal_user_preferences_${userId}`);
        localStorage.removeItem(`portal_accessibility_${userId}`);
        return true;
      } catch (error) {
        console.error('Erro ao remover usuário offline:', error);
        return false;
      }
    }

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
      console.error('Erro ao excluir usuário, tentando offline:', error);
      this.isOfflineMode = true;
      return this.deleteUser(userId);
    }
  }
}

// Criar e exportar instância única
const databaseService = new DatabaseService();

export default databaseService;
