/**
 * SERVIÇO PADRONIZADO DE MÉTRICAS - PLATAFORMA BETINA
 * Centraliza e padroniza a coleta de métricas em todas as atividades
 * 
 * @version 2.0.0
 * @created 2025-06-05
 * @purpose Auditoria e padronização de métricas
 */

import databaseService from './databaseService.js';

// Estrutura padronizada de métricas
export const METRICS_SCHEMA = {
  // Identificadores obrigatórios
  sessionId: { type: 'string', required: true },
  userId: { type: 'string', required: true },
  activityId: { type: 'string', required: true },
  
  // Timestamps obrigatórios
  startTime: { type: 'number', required: true },
  endTime: { type: 'number', required: true },
  duration: { type: 'number', required: true },
  
  // Métricas de performance obrigatórias
  attempts: { type: 'number', required: true, min: 0 },
  successes: { type: 'number', required: true, min: 0 },
  errors: { type: 'number', required: true, min: 0 },
  accuracy: { type: 'number', required: true, min: 0, max: 100 },
  score: { type: 'number', required: true, min: 0 },
  
  // Configuração da sessão
  difficulty: { type: 'string', required: true, enum: ['easy', 'medium', 'hard'] },
  
  // Dados adaptativos
  adaptiveData: { type: 'object', required: false },
  
  // Dados contextuais
  contextualData: {
    type: 'object',
    required: false,
    properties: {
      timeOfDay: { type: 'number', min: 0, max: 23 },
      dayOfWeek: { type: 'number', min: 0, max: 6 },
      deviceType: { type: 'string' },
      inputMethod: { type: 'string' }
    }
  },
  
  // Dados específicos da atividade
  activitySpecificData: { type: 'object', required: false }
};

// Classe principal de métricas
export class MetricsService {
  constructor() {
    this.sessions = new Map();
    this.isOnline = true;
    this.offlineQueue = [];
    this.init();
  }
  
  init() {
    // Verificar conectividade
    this.checkConnectivity();
    
    // Event listeners para conectividade
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  async checkConnectivity() {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        timeout: 5000 
      });
      this.isOnline = response.ok;
    } catch (error) {
      this.isOnline = false;
    }
  }
  
  // Iniciar nova sessão de métricas
  startSession(activityId, userId, difficulty = 'easy') {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();
    
    const session = {
      sessionId,
      userId,
      activityId,
      difficulty,
      startTime,
      endTime: null,
      duration: 0,
      attempts: 0,
      successes: 0,
      errors: 0,
      accuracy: 0,
      score: 0,
      events: [],
      adaptiveData: null,
      contextualData: this.getContextualData(),
      activitySpecificData: {}
    };
    
    this.sessions.set(sessionId, session);
    
    console.log(`📊 Sessão de métricas iniciada: ${sessionId} para ${activityId}`);
    
    return sessionId;
  }
  
  // Registrar evento na sessão
  recordEvent(sessionId, eventType, eventData = {}) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ Sessão não encontrada: ${sessionId}`);
      return false;
    }
    
    const event = {
      timestamp: Date.now(),
      type: eventType,
      data: eventData
    };
    
    session.events.push(event);
    
    // Atualizar contadores baseados no tipo de evento
    switch (eventType) {
      case 'attempt':
        session.attempts++;
        break;
      case 'success':
        session.successes++;
        session.score += eventData.points || 10;
        break;
      case 'error':
        session.errors++;
        break;
    }
    
    // Recalcular accuracy
    if (session.attempts > 0) {
      session.accuracy = Math.round((session.successes / session.attempts) * 100);
    }
    
    return true;
  }
  
  // Finalizar sessão
  async finishSession(sessionId, additionalData = {}) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ Sessão não encontrada: ${sessionId}`);
      return null;
    }
    
    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
    session.activitySpecificData = { ...session.activitySpecificData, ...additionalData };
    
    // Validar dados antes de salvar
    const validationResult = this.validateMetrics(session);
    if (!validationResult.isValid) {
      console.error('❌ Métricas inválidas:', validationResult.errors);
      return null;
    }
    
    try {
      // Salvar no banco de dados
      const saved = await this.saveMetrics(session);
      
      if (saved) {
        console.log(`✅ Métricas salvas com sucesso: ${sessionId}`);
        this.sessions.delete(sessionId);
        return session;
      }
    } catch (error) {
      console.error('❌ Erro ao salvar métricas:', error);
      
      // Se offline, adicionar à fila
      if (!this.isOnline) {
        this.offlineQueue.push(session);
        console.log(`💾 Métricas adicionadas à fila offline: ${sessionId}`);
      }
    }
    
    return session;
  }
  
  // Salvar métricas no banco
  async saveMetrics(session) {
    try {
      if (this.isOnline) {
        // Tentar salvar online primeiro
        const result = await databaseService.saveGameSession(session);
        return result;
      } else {
        // Salvar localmente se offline
        const localKey = `betina_metrics_${session.sessionId}`;
        localStorage.setItem(localKey, JSON.stringify(session));
        return true;
      }
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
      
      // Fallback para localStorage
      const localKey = `betina_metrics_${session.sessionId}`;
      localStorage.setItem(localKey, JSON.stringify(session));
      return true;
    }
  }
  
  // Processar fila offline
  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    
    console.log(`🔄 Processando ${this.offlineQueue.length} métricas offline...`);
    
    const processedSessions = [];
    
    for (const session of this.offlineQueue) {
      try {
        const saved = await this.saveMetrics(session);
        if (saved) {
          processedSessions.push(session.sessionId);
        }
      } catch (error) {
        console.error(`Erro ao processar sessão offline ${session.sessionId}:`, error);
      }
    }
    
    // Remover sessões processadas da fila
    this.offlineQueue = this.offlineQueue.filter(
      session => !processedSessions.includes(session.sessionId)
    );
    
    console.log(`✅ ${processedSessions.length} sessões offline processadas`);
  }
  
  // Validar estrutura de métricas
  validateMetrics(metrics) {
    const errors = [];
    
    // Verificar campos obrigatórios
    Object.entries(METRICS_SCHEMA).forEach(([field, schema]) => {
      if (schema.required && (metrics[field] === undefined || metrics[field] === null)) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
      
      if (metrics[field] !== undefined) {
        // Verificar tipo
        if (schema.type && typeof metrics[field] !== schema.type) {
          errors.push(`Tipo inválido para ${field}: esperado ${schema.type}, recebido ${typeof metrics[field]}`);
        }
        
        // Verificar valores mínimos/máximos
        if (schema.min !== undefined && metrics[field] < schema.min) {
          errors.push(`Valor de ${field} abaixo do mínimo: ${metrics[field]} < ${schema.min}`);
        }
        
        if (schema.max !== undefined && metrics[field] > schema.max) {
          errors.push(`Valor de ${field} acima do máximo: ${metrics[field]} > ${schema.max}`);
        }
        
        // Verificar enum
        if (schema.enum && !schema.enum.includes(metrics[field])) {
          errors.push(`Valor inválido para ${field}: ${metrics[field]} não está em [${schema.enum.join(', ')}]`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Obter dados contextuais
  getContextualData() {
    const now = new Date();
    
    return {
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      deviceType: this.getDeviceType(),
      inputMethod: this.getInputMethod(),
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height
      },
      userAgent: navigator.userAgent,
      language: navigator.language
    };
  }
  
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
  
  getInputMethod() {
    if ('ontouchstart' in window) return 'touch';
    return 'mouse';
  }
  
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Obter métricas de uma sessão ativa
  getSessionMetrics(sessionId) {
    return this.sessions.get(sessionId);
  }
  
  // Obter estatísticas gerais
  async getOverallStats(userId, activityId = null, timeRange = 30) {
    try {
      const sessions = await databaseService.getGameSessions(
        userId, 
        activityId, 
        timeRange
      );
      
      if (!sessions || sessions.length === 0) {
        return this.getEmptyStats();
      }
      
      const stats = {
        totalSessions: sessions.length,
        totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        totalAttempts: sessions.reduce((sum, s) => sum + (s.attempts || 0), 0),
        totalSuccesses: sessions.reduce((sum, s) => sum + (s.successes || 0), 0),
        totalErrors: sessions.reduce((sum, s) => sum + (s.errors || 0), 0),
        averageAccuracy: 0,
        averageScore: 0,
        improvementTrend: 0
      };
      
      if (stats.totalAttempts > 0) {
        stats.averageAccuracy = Math.round((stats.totalSuccesses / stats.totalAttempts) * 100);
      }
      
      if (sessions.length > 0) {
        stats.averageScore = Math.round(
          sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
        );
        
        // Calcular tendência de melhoria (últimas 5 vs primeiras 5 sessões)
        if (sessions.length >= 10) {
          const recent = sessions.slice(-5);
          const older = sessions.slice(0, 5);
          
          const recentAvg = recent.reduce((sum, s) => sum + (s.accuracy || 0), 0) / 5;
          const olderAvg = older.reduce((sum, s) => sum + (s.accuracy || 0), 0) / 5;
          
          stats.improvementTrend = Math.round(recentAvg - olderAvg);
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return this.getEmptyStats();
    }
  }
  
  getEmptyStats() {
    return {
      totalSessions: 0,
      totalDuration: 0,
      totalAttempts: 0,
      totalSuccesses: 0,
      totalErrors: 0,
      averageAccuracy: 0,
      averageScore: 0,
      improvementTrend: 0
    };
  }
}

// Instância singleton
const metricsService = new MetricsService();

export default metricsService;

// Funções utilitárias para usar nos componentes
export const useMetrics = (activityId) => {
  const startSession = (userId, difficulty) => {
    return metricsService.startSession(activityId, userId, difficulty);
  };
  
  const recordAttempt = (sessionId, data = {}) => {
    return metricsService.recordEvent(sessionId, 'attempt', data);
  };
  
  const recordSuccess = (sessionId, data = {}) => {
    return metricsService.recordEvent(sessionId, 'success', data);
  };
  
  const recordError = (sessionId, data = {}) => {
    return metricsService.recordEvent(sessionId, 'error', data);
  };
  
  const finishSession = (sessionId, additionalData = {}) => {
    return metricsService.finishSession(sessionId, additionalData);
  };
  
  const getStats = (userId, timeRange = 30) => {
    return metricsService.getOverallStats(userId, activityId, timeRange);
  };
  
  return {
    startSession,
    recordAttempt,
    recordSuccess,
    recordError,
    finishSession,
    getStats
  };
};
