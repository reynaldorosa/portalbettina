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
        
        // Se a API estiver disponível, tente sincronizar sessões offline
        this.syncOfflineSessions();
        
        return true;
      }
      throw new Error('API não disponível');
    } catch (error) {
      console.error('Erro ao conectar com a API:', error.message);
      return false;
    }
  }
  
  // Método para sincronizar sessões salvas offline
  async syncOfflineSessions() {
    try {
      const offlineSessionsKey = 'offlineGameSessions';
      const offlineSessions = JSON.parse(localStorage.getItem(offlineSessionsKey) || '[]');
      
      if (offlineSessions.length === 0) {
        return;
      }
      
      console.log(`Tentando sincronizar ${offlineSessions.length} sessões offline...`);
      const unsyncedSessions = offlineSessions.filter(session => !session.synced);
      
      if (unsyncedSessions.length === 0) {
        return;
      }
      
      console.log(`${unsyncedSessions.length} sessões precisam ser sincronizadas.`);
      
      // Cria uma cópia para atualização
      const updatedSessions = [...offlineSessions];
      
      for (let i = 0; i < offlineSessions.length; i++) {
        if (offlineSessions[i].synced) continue;
        
        try {
          // Remover campos específicos do armazenamento offline
          const sessionToSync = { ...offlineSessions[i] };
          delete sessionToSync.offline_timestamp;
          delete sessionToSync.synced;
          
          const response = await fetch(`${this.apiUrl}/game-session`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(sessionToSync)
          });
          
          if (response.ok) {
            console.log(`Sessão #${i+1} sincronizada com sucesso!`);
            updatedSessions[i].synced = true;
          }
        } catch (error) {
          console.warn(`Falha ao sincronizar sessão #${i+1}:`, error);
        }
      }
      
      // Atualizar o localStorage com as sessões sincronizadas
      localStorage.setItem(offlineSessionsKey, JSON.stringify(updatedSessions));
      console.log('Processo de sincronização concluído.');
      
      // Limpar sessões sincronizadas após 50 entradas para economizar espaço
      if (updatedSessions.length > 50) {
        const cleanedSessions = updatedSessions.filter(session => !session.synced);
        localStorage.setItem(offlineSessionsKey, JSON.stringify(cleanedSessions));
      }
    } catch (error) {
      console.error('Erro ao sincronizar sessões offline:', error);
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
    if (!userId) {
      console.error('UserId inválido:', userId);
      return null;
    }
    
    // Converter para string se for número
    const userIdStr = String(userId);    try {
      const response = await fetch(`${this.apiUrl}/user/${userIdStr}`, {
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
    const userIdStr = String(userId);
    try {
      const response = await fetch(`${this.apiUrl}/user/${userIdStr}/preferences`, {
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
    const userIdStr = String(userId);
    const defaultSettings = {
      fontSize: 'medium',
      contrast: 'normal',
      audioEnabled: true,
      animations: true
    };

    try {
      const response = await fetch(`${this.apiUrl}/user/${userIdStr}/accessibility`, {
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
    const userIdStr = String(userId);
    try {
      const response = await fetch(`${this.apiUrl}/user/${userIdStr}/accessibility`, {
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
      // Primeiro, salve no localStorage como backup
      const offlineSessionsKey = 'offlineGameSessions';
      let offlineSessions = JSON.parse(localStorage.getItem(offlineSessionsKey) || '[]');
      
      // Adicione timestamp para sincronização posterior
      const sessionWithTimestamp = {
        ...sessionData,
        offline_timestamp: new Date().toISOString(),
        synced: false
      };
      
      offlineSessions.push(sessionWithTimestamp);
      localStorage.setItem(offlineSessionsKey, JSON.stringify(offlineSessions));
      
      try {
        // Tente enviar para o servidor, mas não falhe se não conseguir
        const response = await fetch(`${this.apiUrl}/game-session`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(sessionData),
          // Adiciona timeout para não bloquear a interface por muito tempo
          signal: AbortSignal.timeout(5000) // 5 segundos de timeout
        });
        
        if (!response.ok) {
          console.warn(`Falha ao salvar na API (status ${response.status}). Dados salvos localmente.`);
          return { id: 'local-' + Date.now(), offline: true, message: 'Dados salvos localmente' };
        }
        
        const result = await response.json();
        
        // Marque a sessão como sincronizada
        offlineSessions[offlineSessions.length - 1].synced = true;
        localStorage.setItem(offlineSessionsKey, JSON.stringify(offlineSessions));
        
        return result;
      } catch (apiError) {
        console.warn('Erro de API ao salvar sessão. Usando dados salvos localmente:', apiError);
        return { id: 'local-' + Date.now(), offline: true, message: 'Dados salvos localmente' };
      }
    } catch (error) {
      console.error('Erro ao salvar sessão de jogo:', error);
      // Retorna um objeto para evitar que a aplicação quebre, mesmo em caso de erro no localStorage
      return { id: 'error-' + Date.now(), error: true, message: 'Falha ao salvar dados' };
    }
  }
  async getUserGameSessions(userId) {
    const userIdStr = String(userId);
    try {
      const response = await fetch(`${this.apiUrl}/user/${userIdStr}/game-sessions`, {
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
    if (!userId) {
      console.error('UserId inválido para getGameSessions:', userId);
      return [];
    }
    
    // Converter para string se for número
    const userIdStr = String(userId);

    try {
      let url = `${this.apiUrl}/user/${userIdStr}/game-sessions`;
      
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
    const userIdStr = String(userId);
    try {
      const response = await fetch(`${this.apiUrl}/user/${userIdStr}`, {
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

// ============== GESTÃO DE PERFIS DE USUÁRIO ==============

// Adicionar métodos de perfis como funções independentes para retrocompatibilidade
databaseService.getUserProfiles = async function(userId) {
  if (!userId) {
    console.error('UserId inválido para getUserProfiles:', userId);
    return [];
  }

  const userIdStr = String(userId);
  try {
    const response = await fetch(`${this.apiUrl}/user/${userIdStr}/profiles`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
    return profiles;
  } catch (error) {
    console.error('Erro ao buscar perfis do usuário:', error);
    return [];
  }
};

databaseService.createUserProfile = async function(userId, profileData) {
  if (!userId) {
    console.error('UserId inválido para createUserProfile:', userId);
    return null;
  }

  const userIdStr = String(userId);
  try {
    const response = await fetch(`${this.apiUrl}/user/${userIdStr}/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newProfile = await response.json();
    return newProfile;
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    return null;
  }
};

databaseService.updateUserProfile = async function(userId, profileId, updates) {
  if (!userId || !profileId) {
    console.error('UserId ou profileId inválido:', { userId, profileId });
    return null;
  }

  const userIdStr = String(userId);
  const profileIdStr = String(profileId);
  try {
    const response = await fetch(`${this.apiUrl}/user/${userIdStr}/profile/${profileIdStr}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedProfile = await response.json();
    return updatedProfile;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return null;
  }
};

databaseService.deleteUserProfile = async function(userId, profileId) {
  if (!userId || !profileId) {
    console.error('UserId ou profileId inválido:', { userId, profileId });
    return false;
  }

  const userIdStr = String(userId);
  const profileIdStr = String(profileId);
  try {
    const response = await fetch(`${this.apiUrl}/user/${userIdStr}/profile/${profileIdStr}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar perfil:', error);
    throw error;
  }
};

databaseService.activateUserProfile = async function(userId, profileId) {
  if (!userId || !profileId) {
    console.error('UserId ou profileId inválido:', { userId, profileId });
    return false;
  }

  const userIdStr = String(userId);
  const profileIdStr = String(profileId);
  try {
    const response = await fetch(`${this.apiUrl}/user/${userIdStr}/profile/${profileIdStr}/activate`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Erro ao ativar perfil:', error);
    return false;
  }
};

export default databaseService;
