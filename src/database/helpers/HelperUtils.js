/**
 * @file HelperUtils.js
 * @description Utilitários auxiliares para sanitização e detecção de dispositivos
 */

export class HelperUtils {
  constructor(databaseService) {
    this.db = databaseService
    this.logger = databaseService.logger
  }

  /**
   * @method sanitizeInput
   * @description Sanitiza uma string de entrada para evitar XSS
   * @param {string} input - String a ser sanitizada
   * @param {Object} options - Opções de sanitização
   * @returns {string} String sanitizada
   */
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return ''
    let sanitized = input.trim().replace(/[<>]/g, '')
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
    }
    return sanitized
  }

  /**
   * @method sanitizeNumericInput
   * @description Sanitiza uma entrada numérica
   * @param {*} input - Entrada a ser sanitizada
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {number} Número sanitizado
   */
  sanitizeNumericInput(input, min = 0, max = 100) {
    const num = parseFloat(input)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  }

  /**
   * @method detectAccessibilityNeeds
   * @description Detecta necessidades de acessibilidade baseadas no dispositivo
   * @returns {Object} Necessidades detectadas
   */
  detectAccessibilityNeeds() {
    return {
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      vibrationSupport: !!navigator.vibrate,
      textToSpeechSupport: 'speechSynthesis' in window,
    }
  }

  /**
   * @method getDeviceAdaptations
   * @description Obtém adaptações baseadas nas capacidades do dispositivo
   * @returns {Object} Adaptações do dispositivo
   */
  getDeviceAdaptations() {
    return {
      touchSupport: 'ontouchstart' in window,
      screenSize: this.getScreenSizeCategory(),
      orientation: this.getScreenOrientation(),
      inputMethods: this.getAvailableInputMethods(),
      capabilities: this.getDeviceCapabilities(),
    }
  }

  /**
   * @method getScreenSizeCategory
   * @description Determina a categoria de tamanho da tela
   * @returns {string} Categoria do tamanho da tela
   */
  getScreenSizeCategory() {
    const width = window.innerWidth
    if (width < 576) return 'mobile'
    if (width < 768) return 'tablet-small'
    if (width < 992) return 'tablet'
    if (width < 1200) return 'desktop'
    return 'large-desktop'
  }

  /**
   * @method getScreenOrientation
   * @description Determina a orientação da tela
   * @returns {string} Orientação da tela
   */
  getScreenOrientation() {
    return (
      screen.orientation?.type ||
      (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    )
  }

  /**
   * @method getAvailableInputMethods
   * @description Obtém métodos de entrada disponíveis
   * @returns {Array<string>} Lista de métodos de entrada
   */
  getAvailableInputMethods() {
    const methods = ['mouse', 'keyboard']
    if ('ontouchstart' in window) methods.push('touch')
    if (navigator.getGamepads) methods.push('gamepad')
    if (navigator.mediaDevices) methods.push('camera')
    return methods
  }

  /**
   * @method getDeviceCapabilities
   * @description Obtém capacidades do dispositivo
   * @returns {Object} Capacidades detectadas
   */
  getDeviceCapabilities() {
    return {
      webGL: !!window.WebGLRenderingContext,
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      webRTC: !!window.RTCPeerConnection,
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
      geolocation: 'geolocation' in navigator,
      camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    }
  }

  /**
   * @method calculateVisualSupportLevel
   * @description Calcula o nível de suporte visual necessário
   * @param {Object} preferences - Preferências do usuário
   * @returns {string} Nível de suporte
   */
  calculateVisualSupportLevel(preferences) {
    const needs = [
      preferences.highContrast,
      preferences.largeText,
      preferences.visualCues,
      preferences.visualSchedules,
      preferences.pictureSupports,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  /**
   * @method calculateAuditorySupportLevel
   * @description Calcula o nível de suporte auditivo necessário
   * @param {Object} preferences - Preferências do usuário
   * @returns {string} Nível de suporte
   */
  calculateAuditorySupportLevel(preferences) {
    const needs = [
      preferences.textToSpeech,
      preferences.audioFeedback,
      preferences.auditoryPrompts,
      preferences.soundReduction,
      preferences.voiceModulation,
    ].filter(Boolean).length

    if (needs >= 4) return 'maximum'
    if (needs >= 2) return 'moderate'
    if (needs >= 1) return 'minimal'
    return 'none'
  }

  /**
   * @method isCacheValid
   * @description Verifica se uma entrada de cache é válida
   * @param {Object} cached - Dados do cache
   * @param {number} maxAge - Idade máxima em milissegundos
   * @returns {boolean} Se o cache é válido
   */
  isCacheValid(cached, maxAge) {
    if (!cached || !cached.timestamp) return false
    return Date.now() - cached.timestamp < maxAge
  }

  /**
   * @method getVisualSupportRecommendations
   * @description Obtém recomendações de suporte visual
   * @param {Object} settings - Configurações
   * @returns {Array<string>} Recomendações
   */
  getVisualSupportRecommendations(settings) {
    const recommendations = []

    if (settings.highContrast) {
      recommendations.push('Use high contrast colors')
      recommendations.push('Increase border thickness')
    }

    if (settings.largeText) {
      recommendations.push('Increase font size')
      recommendations.push('Use clear, readable fonts')
    }

    if (settings.visualCues) {
      recommendations.push('Add visual indicators')
      recommendations.push('Use icons with text labels')
    }

    return recommendations
  }

  /**
   * @method getAuditorySupportRecommendations
   * @description Obtém recomendações de suporte auditivo
   * @param {Object} settings - Configurações
   * @returns {Array<string>} Recomendações
   */
  getAuditorySupportRecommendations(settings) {
    const recommendations = []

    if (settings.textToSpeech) {
      recommendations.push('Enable text-to-speech for all content')
      recommendations.push('Provide audio descriptions')
    }

    if (settings.audioFeedback) {
      recommendations.push('Add audio feedback for interactions')
      recommendations.push('Use sound cues for navigation')
    }

    if (settings.soundReduction) {
      recommendations.push('Reduce background noise')
      recommendations.push('Provide volume controls')
    }

    return recommendations
  }

  /**
   * @method sanitizeEnum
   * @description Sanitiza um valor enum
   * @param {*} input - Valor a ser verificado
   * @param {Array} allowedValues - Valores permitidos
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Valor sanitizado
   */
  sanitizeEnum(input, allowedValues, defaultValue) {
    return allowedValues.includes(input) ? input : defaultValue
  }

  /**
   * @method sanitizeArray
   * @description Sanitiza um array filtrando valores válidos
   * @param {Array} input - Array a ser sanitizado
   * @param {Array} allowedValues - Valores permitidos
   * @returns {Array} Array sanitizado
   */
  sanitizeArray(input, allowedValues) {
    if (!Array.isArray(input)) return []
    return input.filter((item) => allowedValues.includes(item))
  }

  /**
   * @method detectDeviceType
   * @description Detecta o tipo de dispositivo
   * @returns {string} Tipo do dispositivo
   */
  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)

    if (isTablet) return 'tablet'
    if (isMobile) return 'mobile'
    return 'desktop'
  }

  /**
   * @method createUserAgent
   * @description Cria informações do user agent sanitizadas
   * @returns {Object} Informações do dispositivo
   */
  createUserAgent() {
    return {
      platform: navigator.platform,
      userAgent: navigator.userAgent.substring(0, 100), // Limitar tamanho
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    }
  }
}
