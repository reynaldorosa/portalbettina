// Utilitário para gerenciar Text-to-Speech (TTS) globalmente no Portal Betina
// Permite consultar e atualizar configurações de TTS de maneira centralizada

/**
 * Verifica se o TTS está ativado nas configurações de acessibilidade
 * @returns {boolean} Verdadeiro se o TTS estiver ativado
 */
export const isTTSEnabled = () => {
  try {
    const accessibilitySettings = localStorage.getItem('betina_accessibility_settings');
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
export const setTTSEnabled = (enabled) => {
  try {
    let settings = {};
    const accessibilitySettings = localStorage.getItem('betina_accessibility_settings');
    if (accessibilitySettings) {
      settings = JSON.parse(accessibilitySettings);
    }
    
    // Atualizar a configuração de TTS
    settings.textToSpeech = enabled;
    
    // Salvar de volta no localStorage
    localStorage.setItem('betina_accessibility_settings', JSON.stringify(settings));
    
    // Disparar evento para notificar componentes que estão observando
    window.dispatchEvent(new Event('tts-settings-changed'));
  } catch (error) {
    console.error('Erro ao atualizar configuração de TTS:', error);
  }
};
