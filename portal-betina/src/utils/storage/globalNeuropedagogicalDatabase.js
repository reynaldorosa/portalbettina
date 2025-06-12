// Sistema de Banco de Dados Global para Métricas Neuropedagógicas
// Focado em coleta massiva de dados para análise posterior por IA

class GlobalNeuropedagogicalDatabase {  constructor() {
    // Detectar ambiente Docker
    const isDockerEnvironment = typeof window !== 'undefined' && 
                               window.location.hostname !== 'localhost' && 
                               window.location.hostname !== '127.0.0.1';
    
    this.config = {
      apiEndpoint: import.meta.env.VITE_API_URL || 
                  (isDockerEnvironment ? '/api' : `http://${import.meta.env.VITE_API_HOST || 'localhost'}:${import.meta.env.VITE_API_PORT || '3000'}/api`),
      syncInterval: parseInt(import.meta.env.VITE_SYNC_INTERVAL) || 30000, // 30 segundos
      batchSize: parseInt(import.meta.env.VITE_BATCH_SIZE) || 50,
      retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
      compressionEnabled: import.meta.env.VITE_COMPRESSION_ENABLED !== 'false',
      encryptionEnabled: import.meta.env.VITE_ENCRYPTION_ENABLED !== 'false',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000
    };
    
    this.localQueue = [];
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.sessionId = null;
    this.userId = null;
    
    // Inicializar IndexedDB para armazenamento local
    this.initLocalDatabase();
    
    // Inicializar sincronização automática
    this.startAutoSync();
  }

  // Inicializar banco de dados local (IndexedDB)
  async initLocalDatabase() {
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
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFromLocalStore(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.localDB.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }  async getUnsyncedData() {
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
        resolve(unsyncedRecords);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markAsSynced(ids) {
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
      });
    });
    
    await Promise.all(promises);
  }

  async countMetricsByType(sessionId) {
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
}

// Instância global do banco de dados
const globalNeuropedagogicalDB = new GlobalNeuropedagogicalDatabase();

export default globalNeuropedagogicalDB;
