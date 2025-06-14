// Utilitário para gerenciar Text-to-Speech (TTS) globalmente no Portal Betina
// Permite consultar e atualizar configurações de TTS de maneira centralizada

// Chave para armazenamento no localStorage
const TTS_SETTINGS_KEY = 'betina_tts_enabled';
const ACCESSIBILITY_SETTINGS_KEY = 'betina_accessibility_settings';

/**
 * Verifica se o TTS está ativado nas configurações de acessibilidade
 * @returns {boolean} Verdadeiro se o TTS estiver ativado
 */
export const isTTSEnabled = () => {
  try {
    // Primeiro, verificar a configuração específica de TTS
    const ttsSetting = localStorage.getItem(TTS_SETTINGS_KEY);
    if (ttsSetting !== null) {
      return ttsSetting === 'true';
    }
    
    // Se não houver configuração específica, verificar nas configurações de acessibilidade
    const accessibilitySettings = localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY);
    if (accessibilitySettings) {
      const settings = JSON.parse(accessibilitySettings);
      // Verificar a configuração específica de TTS, se não existir é verdadeiro por padrão
      return settings.textToSpeech !== false;
    }
    
    // Por padrão, o TTS estará ativado se não houver configuração
    return true;
  } catch (error) {
    console.error('Erro ao verificar configuração de TTS:', error);
    return true; // Em caso de erro, manter ativado por padrão
  }
};

/**
 * Ativa ou desativa o TTS nas configurações de acessibilidade
 * @param {boolean} enabled - Estado de ativação desejado para o TTS
 */
export const setTTSEnabled = (enabled) => {  try {
    console.log(`setTTSEnabled chamado com valor: ${enabled}`);
    
    // Armazenar a configuração específica de TTS para acesso rápido
    localStorage.setItem(TTS_SETTINGS_KEY, enabled.toString());
    
    // Também atualizar nas configurações de acessibilidade para consistência
    let settings = {};
    const accessibilitySettings = localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY);
    if (accessibilitySettings) {
      try {
        settings = JSON.parse(accessibilitySettings);
      } catch (e) {
        console.error('Erro ao analisar JSON das configurações de acessibilidade:', e);
        settings = {};
      }
    }
    
    // Atualizar a configuração de TTS
    settings.textToSpeech = enabled;
    
    // Salvar de volta no localStorage
    localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify(settings));
    
    // Primeiro, forçar atualização do synthInterface antes de disparar eventos
    // para garantir que qualquer fala em andamento seja interrompida se TTS for desativado
    if (!enabled && window.speechSynthesis) {
      console.log('ttsManager - Cancelando fala atual pois o TTS foi desativado');
      window.speechSynthesis.cancel();
    }
    
    // Esperar um momento para garantir que o cancelamento seja processado
    // antes de disparar eventos
    setTimeout(() => {
      // Disparar evento para notificar componentes que estão observando
      console.log(`ttsManager - Disparando evento com detalhe enabled: ${enabled}`);
      window.dispatchEvent(new CustomEvent('tts-settings-changed', { 
        detail: { enabled } 
      }));
        // Para compatibilidade com código existente
      window.dispatchEvent(new Event('tts-settings-changed'));
    }, 50);
    
  } catch (error) {
    console.error('Erro ao atualizar configuração de TTS:', error);
  }
};

// Export default e named export para compatibilidade
export const ttsManager = {
  isTTSEnabled,
  setTTSEnabled
}

export default ttsManager
