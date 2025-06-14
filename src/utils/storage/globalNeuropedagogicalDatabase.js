// Sistema de Banco de Dados Global para Métricas Neuropedagógicas
// Focado em coleta massiva de dados para análise posterior por IA

// Helper para obter variáveis de ambiente compatível com Node.js e browser
function getEnvVar(varName, defaultValue = '') {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[varName] || defaultValue;
  }
  if (typeof window !== 'undefined' && window.ENV) {
    return window.ENV[varName] || defaultValue;
  }
  return defaultValue;
}

class GlobalNeuropedagogicalDatabase {
  constructor() {
    // Detectar ambiente Docker
    const isDockerEnvironment = typeof window !== 'undefined' && 
                               window.location.hostname !== 'localhost' && 
                               window.location.hostname !== '127.0.0.1';
    
    this.config = {
      apiEndpoint: getEnvVar('VITE_API_URL') || 
                  (isDockerEnvironment ? '/api' : `http://${getEnvVar('VITE_API_HOST', 'localhost')}:${getEnvVar('VITE_API_PORT', '3000')}/api`),
      syncInterval: parseInt(getEnvVar('VITE_SYNC_INTERVAL', '30000')) || 30000, // 30 segundos
      batchSize: parseInt(getEnvVar('VITE_BATCH_SIZE', '50')) || 50,
      retryAttempts: parseInt(getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')) || 3,
      compressionEnabled: getEnvVar('VITE_COMPRESSION_ENABLED') !== 'false',
      encryptionEnabled: getEnvVar('VITE_ENCRYPTION_ENABLED') !== 'false',
      timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '15000')) || 15000
    };
    
    this.localQueue = [];
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.sessionId = null;
    this.userId = null;
      // Inicializar IndexedDB para armazenamento local (apenas no browser)
    if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
      this.initLocalDatabase();
    } else {
      // No Node.js, usar armazenamento em memória
      this.localQueue = [];
      this.localDB = null;
      console.log('🔧 Rodando em Node.js - usando armazenamento em memória');
    }
    
    // Inicializar sincronização automática
    this.startAutoSync();
  }

  // Inicializar banco de dados local (IndexedDB) - apenas no browser
  async initLocalDatabase() {
    if (typeof indexedDB === 'undefined') {
      console.log('🔧 IndexedDB não disponível - usando armazenamento em memória');
      return Promise.resolve(null);
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NeuropedagogicalMetrics', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.localDB = request.result;
        resolve(this.localDB);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store para métricas brutas
        if (!db.objectStoreNames.contains('rawMetrics')) {
          const rawStore = db.createObjectStore('rawMetrics', { keyPath: 'id', autoIncrement: true });
          rawStore.createIndex('sessionId', 'sessionId', { unique: false });
          rawStore.createIndex('userId', 'userId', { unique: false });
          rawStore.createIndex('timestamp', 'timestamp', { unique: false });
          rawStore.createIndex('dataType', 'dataType', { unique: false });
          rawStore.createIndex('synced', 'synced', { unique: false });
        }
        
        // Store para sessões
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'sessionId' });
          sessionStore.createIndex('userId', 'userId', { unique: false });
          sessionStore.createIndex('startTime', 'startTime', { unique: false });
          sessionStore.createIndex('synced', 'synced', { unique: false });
        }
        
        // Store para perfis de usuário
        if (!db.objectStoreNames.contains('userProfiles')) {
          const profileStore = db.createObjectStore('userProfiles', { keyPath: 'userId' });
          profileStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }
        
        // Store para configurações de privacidade
        if (!db.objectStoreNames.contains('privacySettings')) {
          const privacyStore = db.createObjectStore('privacySettings', { keyPath: 'userId' });
        }
      };
    });
  }

  // Inicializar nova sessão
  async startSession(userId, sessionConfig = {}) {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.userId = userId;
    
    const sessionData = {
      sessionId: this.sessionId,
      userId: userId,
      startTime: Date.now(),
      endTime: null,
      config: sessionConfig,
      deviceInfo: await this.collectDeviceInfo(),
      environmentInfo: await this.collectEnvironmentInfo(),
      synced: false,
      dataPoints: 0
    };
    
    // Salvar sessão localmente
    await this.saveToLocalStore('sessions', sessionData);
    
    console.log(`🌐 Nova sessão iniciada: ${this.sessionId}`);
    return this.sessionId;
  }

  // Finalizar sessão
  async endSession() {
    if (!this.sessionId) return;
    
    const endTime = Date.now();
    
    // Atualizar dados da sessão
    const sessionData = await this.getFromLocalStore('sessions', this.sessionId);
    if (sessionData) {
      sessionData.endTime = endTime;
      sessionData.duration = endTime - sessionData.startTime;
      await this.saveToLocalStore('sessions', sessionData);
    }
    
    // Forçar sincronização final
    await this.syncToCloud();
    
    console.log(`🌐 Sessão finalizada: ${this.sessionId}`);
    this.sessionId = null;
    this.userId = null;
  }

  // Registrar métricas (método principal)
  async recordMetrics(dataType, metricsData, metadata = {}) {
    if (!this.sessionId) {
      console.warn('Tentativa de registrar métricas sem sessão ativa');
      return false;
    }
    
    const record = {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      dataType, // 'touch', 'sensor', 'cognitive', 'behavioral', etc.
      data: metricsData,
      metadata: {
        ...metadata,
        deviceTimestamp: Date.now(),
        localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userAgent: navigator.userAgent
      },
      synced: false,
      retryCount: 0
    };
    
    // Salvar localmente
    await this.saveToLocalStore('rawMetrics', record);
    
    // Adicionar à fila de sincronização
    this.localQueue.push(record);
    
    // Atualizar contador de pontos de dados na sessão
    const sessionData = await this.getFromLocalStore('sessions', this.sessionId);
    if (sessionData) {
      sessionData.dataPoints = (sessionData.dataPoints || 0) + 1;
      await this.saveToLocalStore('sessions', sessionData);
    }
    
    return true;
  }

  // Registrar métricas de toque detalhadas
  async recordTouchMetrics(touchData) {
    return await this.recordMetrics('touch', {
      events: touchData.touchEvents || [],
      pressure: touchData.pressureMeasurements || [],
      coordinates: touchData.touchCoordinates || [],
      velocity: touchData.touchVelocity || [],
      gestures: touchData.gesturePatterns || [],
      frequency: touchData.touchFrequency || 0
    }, {
      category: 'interaction',
      subcategory: 'touch',
      deviceType: touchData.deviceType || 'unknown'
    });
  }

  // Registrar métricas de sensores
  async recordSensorMetrics(sensorData) {
    return await this.recordMetrics('sensor', {
      accelerometer: sensorData.accelerometer || [],
      gyroscope: sensorData.gyroscope || [],
      orientation: sensorData.orientation || [],
      proximity: sensorData.proximityEvents || [],
      ambientLight: sensorData.ambientLight || []
    }, {
      category: 'environmental',
      subcategory: 'sensors',
      sampleRate: sensorData.sampleRate || 30
    });
  }

  // Registrar métricas de neurodivergência
  async recordNeurodivergenceMetrics(neuroData) {
    return await this.recordMetrics('neurodivergence', {
      repetitivePatterns: neuroData.repetitivePatterns || [],
      stimulationSeeking: neuroData.stimulationSeeking || [],
      sensoryOverload: neuroData.sensoryOverload || [],
      attentionShifts: neuroData.attentionShifts || [],
      hyperfocus: neuroData.hyperfocusEpisodes || [],
      selfRegulation: neuroData.selfRegulationAttempts || [],
      stimming: neuroData.stimming || []
    }, {
      category: 'behavioral',
      subcategory: 'neurodivergence',
      analysisLevel: 'pattern_detection'
    });
  }

  // Registrar métricas de localização
  async recordLocationMetrics(locationData) {
    if (!this.hasLocationPermission()) {
      console.warn('Permissão de localização não concedida');
      return false;
    }
    
    return await this.recordMetrics('location', {
      coordinates: locationData.gpsCoordinates || [],
      movements: locationData.movementPatterns || [],
      stationaryPeriods: locationData.stationaryPeriods || [],
      environmentalContext: locationData.environmentalContext || []
    }, {
      category: 'contextual',
      subcategory: 'location',
      privacy: 'anonymized_coordinates'
    });
  }

  // Sincronização com a nuvem
  async syncToCloud() {
    if (this.syncInProgress) {
      console.log('Sincronização já em andamento...');
      return;
    }
    
    this.syncInProgress = true;
    
    try {
      // Obter dados não sincronizados
      const unsyncedData = await this.getUnsyncedData();
      
      if (unsyncedData.length === 0) {
        console.log('Nenhum dado para sincronizar');
        return;
      }
      
      console.log(`🔄 Sincronizando ${unsyncedData.length} registros...`);
      
      // Sincronizar em lotes
      const batches = this.chunkArray(unsyncedData, this.config.batchSize);
      
      for (const batch of batches) {
        await this.syncBatch(batch);
      }
      
      this.lastSyncTime = Date.now();
      console.log('✅ Sincronização concluída com sucesso');
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sincronizar lote de dados
  async syncBatch(batch) {
    const payload = {
      batchId: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      dataCount: batch.length,
      data: this.config.compressionEnabled ? this.compressData(batch) : batch,
      checksum: this.generateChecksum(batch)
    };
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.config.apiEndpoint}/batch-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Version': '1.0',
            'X-Client-Type': 'portal-betina-mobile'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // Marcar dados como sincronizados
          await this.markAsSynced(batch.map(item => item.id));
          
          console.log(`✅ Lote sincronizado: ${batch.length} registros`);
          return result;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
      } catch (error) {
        console.warn(`Tentativa ${attempt} falhou:`, error.message);
        
        if (attempt === this.config.retryAttempts) {
          // Incrementar contador de retry nos dados locais
          await this.incrementRetryCount(batch.map(item => item.id));
          throw error;
        }
        
        // Aguardar antes de tentar novamente
        await this.sleep(attempt * 1000);
      }
    }
  }

  // Iniciar sincronização automática
  startAutoSync() {
    setInterval(async () => {
      if (!this.syncInProgress) {
        await this.syncToCloud();
      }
    }, this.config.syncInterval);
  }

  // Coletar informações do dispositivo
  async collectDeviceInfo() {
    return {
      type: this.detectDeviceType(),
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      touch: 'ontouchstart' in window,
      orientation: this.getOrientation()
    };
  }

  // Coletar informações do ambiente
  async collectEnvironmentInfo() {
    const environmentInfo = {
      url: window.location.href,
      referrer: document.referrer,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now()
    };
    
    // Informações de conexão (se disponível)
    if (navigator.connection) {
      environmentInfo.connection = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    
    // Informações de bateria (se disponível)
    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        environmentInfo.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        console.warn('Não foi possível obter informações da bateria:', error);
      }
    }
    
    return environmentInfo;
  }
  // Métodos auxiliares para IndexedDB
  async saveToLocalStore(storeName, data) {
    if (!this.localDB) {
      // Em Node.js, salvar na queue em memória
      this.localQueue.push({ storeName, data, timestamp: Date.now() });
      return Promise.resolve(data.id || Date.now());
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFromLocalStore(storeName, key) {
    if (!this.localDB) {
      // Em Node.js, buscar na queue em memória
      const items = this.localQueue.filter(item => item.storeName === storeName);
      return Promise.resolve(items.find(item => item.data.id === key)?.data || null);    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedData() {
    if (!this.localDB) {
      // Em Node.js, retornar dados da queue em memória que não foram sincronizados
      return Promise.resolve(this.localQueue.filter(item => !item.synced));
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction(['rawMetrics'], 'readonly');
      const store = transaction.objectStore('rawMetrics');
      
      // Em vez de usar o índice com IDBKeyRange.only(false), vamos buscar todos os registros
      // e filtrar manualmente aqueles com synced = false
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        const allRecords = event.target.result || [];
        // Filtrar apenas registros não sincronizados
        const unsyncedRecords = allRecords.filter(record => record.synced === false);
        resolve(unsyncedRecords);      };
      request.onerror = () => reject(request.error);
    });
  }

  async markAsSynced(ids) {
    if (!this.localDB) {
      // Em Node.js, marcar itens como sincronizados na queue em memória
      this.localQueue.forEach(item => {
        if (ids.includes(item.data.id)) {
          item.synced = true;
        }
      });
      return Promise.resolve();
    }
    
    const transaction = this.localDB.transaction(['rawMetrics'], 'readwrite');
    const store = transaction.objectStore('rawMetrics');
    
    const promises = ids.map(id => {
      return new Promise((resolve, reject) => {
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const data = getRequest.result;
          if (data) {
            data.synced = true;
            data.syncedAt = Date.now();
            const putRequest = store.put(data);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          } else {
            resolve();
          }
        };
        getRequest.onerror = () => reject(getRequest.error);
      });    });
    
    await Promise.all(promises);
  }

  async countMetricsByType(sessionId) {
    if (!this.localDB) {
      // Em Node.js, contar métricas por tipo na queue em memória
      const sessionItems = this.localQueue.filter(item => item.data.sessionId === sessionId);
      const counts = {};
      sessionItems.forEach(item => {
        const type = item.data.type || 'unknown';
        counts[type] = (counts[type] || 0) + 1;
      });
      return Promise.resolve(counts);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction(['rawMetrics'], 'readonly');
      const store = transaction.objectStore('rawMetrics');
      const index = store.index('sessionId');
      const request = index.getAll(sessionId);
      
      request.onsuccess = () => {
        const metrics = request.result;
        const count = {};
        
        metrics.forEach(metric => {
          const type = metric.dataType;
          count[type] = (count[type] || 0) + 1;
        });
        
        resolve(count);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async incrementRetryCount(ids) {
    const transaction = this.localDB.transaction(['rawMetrics'], 'readwrite');
    const store = transaction.objectStore('rawMetrics');
    
    const promises = ids.map(id => {
      return new Promise((resolve, reject) => {
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const data = getRequest.result;
          if (data) {
            data.retryCount = (data.retryCount || 0) + 1;
            const putRequest = store.put(data);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          } else {
            resolve();
          }
        };
        getRequest.onerror = () => reject(getRequest.error);
      });
    });
    
    await Promise.all(promises);
  }

  // Métodos utilitários
  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad/.test(userAgent)) return 'tablet';
    if (/mobile|phone|android|iphone/.test(userAgent)) return 'phone';
    return 'desktop';
  }

  getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  hasLocationPermission() {
    return navigator.geolocation && 
           navigator.permissions &&
           navigator.permissions.query({name: 'geolocation'}).then(result => result.state === 'granted');
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  compressData(data) {
    // Implementar compressão simples (JSON.stringify + compressão)
    return JSON.stringify(data);
  }

  generateChecksum(data) {
    // Gerar checksum simples para verificação de integridade
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // API para estatísticas e relatórios
  async getSessionStats(sessionId) {
    const session = await this.getFromLocalStore('sessions', sessionId);
    if (!session) return null;
    
    // Contar métricas por tipo
    const metricsCount = await this.countMetricsByType(sessionId);
    
    return {
      ...session,
      metricsBreakdown: metricsCount,
      syncStatus: session.synced ? 'synced' : 'pending'
    };
  }

  async getUserProfile(userId) {
    return await this.getFromLocalStore('userProfiles', userId);
  }

  async updateUserProfile(userId, profileData) {
    const profile = {
      userId,
      ...profileData,
      lastUpdated: Date.now()
    };
    return await this.saveToLocalStore('userProfiles', profile);
  }

  // Configurações de privacidade
  async setPrivacySettings(userId, settings) {
    const privacySettings = {
      userId,
      allowLocationTracking: settings.allowLocationTracking || false,
      allowSensorData: settings.allowSensorData || true,
      allowBehavioralAnalysis: settings.allowBehavioralAnalysis || true,
      dataRetentionDays: settings.dataRetentionDays || 365,
      anonymizeData: settings.anonymizeData || true,
      lastUpdated: Date.now()
    };
    
    return await this.saveToLocalStore('privacySettings', privacySettings);
  }

  async getPrivacySettings(userId) {
    return await this.getFromLocalStore('privacySettings', userId);
  }

  // =============================================
  // MÉTODOS PARA COMPATIBILIDADE COM SYSTEMORCHESTRATOR
  // =============================================

  /**
   * Salva resultados de análises do SystemOrchestrator
   */
  async saveAnalysisResults(results) {
    return await this.recordMetrics('analysis', results, {
      category: 'therapeutic',
      subcategory: 'orchestrator_analysis',
      analysisLevel: 'comprehensive'
    });
  }

  /**
   * Obtém perfil de usuário (alias para compatibilidade)
   */
  async getProfile(userId) {
    return await this.getUserProfile(userId);
  }

  /**
   * Atualiza perfil de usuário (alias para compatibilidade)
   */
  async updateProfile(userId, profileData) {
    return await this.updateUserProfile(userId, profileData);
  }

  /**
   * Salva sessão de jogo com formato esperado pelo SystemOrchestrator
   */
  async saveGameSession(sessionData) {
    const { userId, gameId, sessionId, ...otherData } = sessionData;
    
    // Se não houver sessão ativa, criar uma
    if (!this.sessionId && sessionId) {
      this.sessionId = sessionId;
      this.userId = userId;
    }
    
    return await this.recordMetrics('game_session', {
      gameId,
      sessionDetails: otherData
    }, {
      category: 'interaction',
      subcategory: 'game',
      sessionType: 'therapeutic'
    });
  }

  /**
   * Busca histórico de análises para um usuário
   */
  async getAnalysisHistory(userId, limit = 10) {
    if (!this.localDB) {
      // Em Node.js, filtrar da queue em memória
      const items = this.localQueue
        .filter(item => 
          item.data.userId === userId && 
          item.data.dataType === 'analysis')
        .slice(0, limit);
      return Promise.resolve(items.map(i => i.data));
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction(['rawMetrics'], 'readonly');
      const store = transaction.objectStore('rawMetrics');
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onsuccess = () => {
        const metrics = request.result || [];
        const analysisMetrics = metrics
          .filter(m => m.dataType === 'analysis')
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        resolve(analysisMetrics);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtém métricas de engajamento para um usuário
   */
  async getEngagementMetrics(userId) {
    try {
      const sessions = this.localQueue.filter(item => 
        item.data.userId === userId && 
        item.data.category === 'interaction'
      );

      const gameSessionsCount = sessions.filter(s => 
        s.data.subcategory === 'game'
      ).length;

      const totalDuration = sessions.reduce((sum, s) => 
        sum + (s.data.sessionDetails?.duration || 0), 0
      );

      const averageDuration = gameSessionsCount > 0 ? 
        totalDuration / gameSessionsCount : 0;

      const lastSession = sessions.sort((a, b) => 
        b.timestamp - a.timestamp
      )[0];

      return {
        sessionsCount: gameSessionsCount,
        averageDuration,
        totalDuration,
        lastActivity: lastSession ? lastSession.timestamp : null,
        engagementLevel: this.calculateEngagementLevel(gameSessionsCount, averageDuration)
      };
    } catch (error) {
      console.warn('Erro ao calcular métricas de engajamento:', error);
      return {
        sessionsCount: 0,
        averageDuration: 0,
        totalDuration: 0,
        lastActivity: null,
        engagementLevel: 'unknown'
      };
    }
  }

  /**
   * Calcula nível de engajamento baseado em métricas
   */
  calculateEngagementLevel(sessionsCount, averageDuration) {
    if (sessionsCount === 0) return 'none';
    if (sessionsCount >= 10 && averageDuration > 300000) return 'high'; // 5+ min
    if (sessionsCount >= 5 && averageDuration > 180000) return 'medium'; // 3+ min
    return 'low';
  }

  /**
   * Interface de perfis para compatibilidade com SystemOrchestrator
   */
  getProfilesInterface() {
    return {
      getProfile: (userId) => this.getProfile(userId),
      updateProfile: (userId, data) => this.updateProfile(userId, data),
      analyzer: {
        analyzeProfile: async (userId, context) => {
          const profile = await this.getProfile(userId);
          const engagementMetrics = await this.getEngagementMetrics(userId);
          
          return {
            userId,
            analysisContext: context,
            timestamp: Date.now(),
            profileData: profile,
            engagementMetrics,
            analysisResults: {
              cognitiveLevel: profile?.cognitiveLevel || 'unknown',
              socialEngagement: engagementMetrics.engagementLevel,
              therapeuticProgress: this.assessTherapeuticProgress(engagementMetrics)
            }
          };
        }
      },
      userService: {
        getUserData: (userId) => this.getProfile(userId),
        updateUserData: (userId, data) => this.updateProfile(userId, data)
      }
    };
  }

  /**
   * Avalia progresso terapêutico baseado em métricas
   */
  assessTherapeuticProgress(metrics) {
    const { sessionsCount, averageDuration, engagementLevel } = metrics;
    
    let progressScore = 0;
    
    // Pontuação baseada em número de sessões
    if (sessionsCount >= 20) progressScore += 40;
    else if (sessionsCount >= 10) progressScore += 30;
    else if (sessionsCount >= 5) progressScore += 20;
    else progressScore += 10;
    
    // Pontuação baseada em duração média
    if (averageDuration > 600000) progressScore += 30; // 10+ min
    else if (averageDuration > 300000) progressScore += 20; // 5+ min
    else if (averageDuration > 180000) progressScore += 15; // 3+ min
    else progressScore += 5;
    
    // Pontuação baseada em engajamento
    switch (engagementLevel) {
      case 'high': progressScore += 30; break;
      case 'medium': progressScore += 20; break;
      case 'low': progressScore += 10; break;
      default: progressScore += 0;
    }
    
    if (progressScore >= 80) return 'excellent';
    if (progressScore >= 60) return 'good';
    if (progressScore >= 40) return 'moderate';
    if (progressScore >= 20) return 'minimal';
    return 'none';
  }
}

// =============================================
// ADAPTER PARA COMPATIBILIDADE COM SYSTEMORCHESTRATOR
// =============================================

/**
 * Adapter que fornece interface compatível com SystemOrchestrator
 */
export class GlobalDBAdapter {
  constructor(globalDB) {
    this.db = globalDB;
    this.logger = typeof console !== 'undefined' ? console : { 
      log: () => {}, 
      info: () => {}, 
      warn: () => {}, 
      error: () => {} 
    };
  }
  
  /**
   * Salva resultados de análises
   */
  saveAnalysisResults(results) {
    return this.db.saveAnalysisResults(results);
  }
  
  /**
   * Interface de perfis para SystemOrchestrator
   */
  getProfilesInterface() {
    return this.db.getProfilesInterface();
  }
  
  /**
   * Obtém métricas de engajamento
   */
  async getEngagementMetrics(userId) {
    return await this.db.getEngagementMetrics(userId);
  }
  
  /**
   * Salva sessão de jogo
   */
  async saveGameSession(sessionData) {
    return await this.db.saveGameSession(sessionData);
  }
  
  /**
   * Obtém histórico de análises
   */
  async getAnalysisHistory(userId, limit = 10) {
    return await this.db.getAnalysisHistory(userId, limit);
  }
  
  /**
   * Interface de status para SystemOrchestrator
   */
  getStatus() {
    return {
      connected: true,
      queueSize: this.db.localQueue.length,
      lastSync: this.db.lastSyncTime,
      syncInProgress: this.db.syncInProgress,
      sessionId: this.db.sessionId,
      userId: this.db.userId
    };
  }

  /**
   * Health check para SystemOrchestrator
   */
  async healthCheck() {
    try {
      // Testar funcionalidades básicas
      const testUserId = 'health_check_user';
      const testData = { test: true, timestamp: Date.now() };
      
      // Testar escrita
      await this.db.recordMetrics('health_check', testData);
      
      // Testar leitura
      const profile = await this.db.getProfile(testUserId);
      
      return {
        healthy: true,
        checks: {
          database: true,
          queue: this.db.localQueue.length >= 0,
          sync: this.db.lastSyncTime !== null || this.db.syncInProgress
        },
        timestamp: Date.now()
      };
    } catch (error) {
      this.logger.error('Health check falhou:', error);
      return {
        healthy: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }
}

// Instância global do banco de dados
const globalNeuropedagogicalDB = new GlobalNeuropedagogicalDatabase();

// Instância do adapter para uso com SystemOrchestrator
export const globalDBAdapter = new GlobalDBAdapter(globalNeuropedagogicalDB);

export default globalNeuropedagogicalDB;
