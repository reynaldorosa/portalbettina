import { logger, CONFIG, API_CONFIG } from '../config/api-config.js';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
    this.tokenKey = 'portal_betina_auth_token';
    this.userKey = 'portal_betina_user_data';
    this.apiUrl = CONFIG.API_URL;
    this.environment = CONFIG.environment;
    logger.info('AuthService iniciado');
    this.loadStoredAuth();
  }

  loadStoredAuth() {
    try {
      const storedToken = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.userKey);
      if (storedToken && storedUser) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
        logger.info('Autenticação carregada do localStorage', { userId: this.user?.id });
      }
    } catch (error) {
      logger.error('Erro ao carregar autenticação armazenada', { error: error.message });
      this.clearAuth();
    }
  }

  saveAuth(token, userData) {
    try {
      this.token = token;
      this.user = userData;
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      logger.info('Autenticação salva no localStorage', { userId: userData.id });
    } catch (error) {
      logger.error('Erro ao salvar autenticação', { error: error.message });
    }
  }

  clearAuth() {
    try {
      this.token = null;
      this.user = null;
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      logger.info('Autenticação removida do localStorage');
    } catch (error) {
      logger.error('Erro ao remover autenticação', { error: error.message });
    }
  }

  async createAnonymousUser() {
    try {
      logger.info('Criando usuário anônimo');
      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.authAnonymous}`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro ao criar usuário: ${response.status} - ${errorData.error || 'Erro desconhecido'}`);
      }

      const authData = await response.json();
      if (!authData.success || !authData.token || !authData.user) {
        throw new Error('Resposta inválida do servidor de autenticação');
      }

      logger.info('Usuário anônimo criado com sucesso', { userId: authData.user.id });
      this.saveAuth(authData.token, authData.user);

      return {
        token: authData.token,
        userId: authData.user.id,
        userData: authData.user,
      };
    } catch (error) {
      logger.error('Erro ao criar usuário anônimo', { error: error.message });
      throw error;
    }
  }

  async verifyToken() {
    if (!this.token) return false;

    try {
      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.authVerify}`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.user = data.user;
          localStorage.setItem(this.userKey, JSON.stringify(data.user));
          return true;
        }
      }

      return false;
    } catch (error) {
      logger.warn('Erro ao verificar token', { error: error.message });
      return false;
    }
  }

  isAuthenticated() {
    return !!(this.token && this.user);
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.user?.id;
  }

  getUser() {
    return this.user;
  }

  getAuthHeaders() {
    const headers = { ...API_CONFIG.DEFAULT_HEADERS };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async ensureAuthenticated() {
    try {
      if (this.isAuthenticated()) {
        const isValid = await this.verifyToken();
        if (isValid) {
          logger.info('Token válido, usuário autenticado', { userId: this.getUserId() });
          return {
            token: this.token,
            userId: this.getUserId(),
            userData: this.user,
          };
        }
        logger.warn('Token inválido, criando nova autenticação');
        this.clearAuth();
      }

      logger.info('Iniciando autenticação automática');
      return await this.createAnonymousUser();
    } catch (error) {
      logger.error('Erro na autenticação automática', { error: error.message });
      return { token: null, userId: null, userData: null, error };
    }
  }

  async authenticatedFetch(url, options = {}) {
    try {
      const authResult = await this.ensureAuthenticated();
      if (!authResult.token) {
        throw new Error('Falha na autenticação');
      }

      const fullUrl = url.startsWith('http') ? url : `${this.apiUrl}${url}`;
      const headers = {
        ...this.getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logger.warn('Token expirado, tentando reautenticar');
        this.clearAuth();
        const newAuthResult = await this.ensureAuthenticated();
        if (!newAuthResult.token) {
          throw new Error('Falha na reautenticação');
        }

        const newHeaders = {
          ...this.getAuthHeaders(),
          ...options.headers,
        };

        return fetch(fullUrl, {
          ...options,
          headers: newHeaders,
        });
      }

      return response;
    } catch (error) {
      logger.error('Erro na requisição autenticada', { error: error.message });
      throw error;
    }
  }
}

export const authService = new AuthService();
export const authenticatedFetch = (url, options) => authService.authenticatedFetch(url, options);
