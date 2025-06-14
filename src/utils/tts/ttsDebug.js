// Utilitário para debug e rastreamento de eventos de TTS para solucionar problemas
// Usado temporariamente para diagnosticar e corrigir problemas com o sistema TTS

// Status atual
let _debug = false;
let _lastTTSEvent = null;
let _eventsLog = [];

// Ativar ou desativar modo debug
export const enableDebug = (enable = true) => {
  _debug = enable;
  console.log(`TTS Debug ${enable ? 'ATIVADO' : 'DESATIVADO'}`);
};

// Registrar evento TTS
export const logTTSEvent = (event) => {
  if (!_debug) return;
  
  const timestamp = new Date().toISOString();
  const entry = { timestamp, ...event };
  
  _lastTTSEvent = entry;
  _eventsLog.push(entry);
  
  console.log(`TTS Event [${timestamp}]:`, event);
  
  // Limitar o tamanho do log
  if (_eventsLog.length > 100) {
    _eventsLog = _eventsLog.slice(-50);
  }
};

// Obter último evento
export const getLastTTSEvent = () => _lastTTSEvent;

// Obter todos os eventos registrados
export const getAllTTSEvents = () => [..._eventsLog];

// Limpar o log de eventos
export const clearTTSLog = () => {
  _eventsLog = [];
  _lastTTSEvent = null;
  console.log('TTS log limpo');
};

// Verificar status do TTS (para injeção nos componentes para fins de debug)
export const getTTSStatus = () => {
  try {
    const accessibilitySettings = localStorage.getItem('betina_accessibility_settings');
    const settings = accessibilitySettings ? JSON.parse(accessibilitySettings) : null;
    
    return {
      debugEnabled: _debug,
      eventCount: _eventsLog.length,
      lastEvent: _lastTTSEvent,
      settingsFound: !!settings,
      ttsSetting: settings?.textToSpeech
    };
  } catch (error) {
    return {
      debugEnabled: _debug,
      eventCount: _eventsLog.length,
      lastEvent: _lastTTSEvent,
      settingsFound: false,
      error: error.message
    };
  }
};
