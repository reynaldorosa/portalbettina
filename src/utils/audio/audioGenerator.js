/**
 * @file audioGenerator.js
 * @description Gerador de áudio para o Portal Betina
 * Sistema de geração de sons e efeitos sonoros usando Web Audio API
 */

class AudioGenerator {
  constructor() {
    this.audioContext = null
    this.sounds = new Map()
    this.isInitialized = false
    this.volume = 0.7
    this.muted = false

    // Inicialização automática
    this.initialize()
  }

  /**
   * Inicializa o contexto de áudio
   */
  async initialize() {
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.isInitialized = true

        // Resume o contexto se necessário
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume()
        }
      }
    } catch (error) {
      console.warn('Erro ao inicializar AudioContext:', error)
      this.isInitialized = false
    }
  }

  /**
   * Gera um buffer de áudio
   * @param {number} frequency - Frequência em Hz
   * @param {number} duration - Duração em segundos
   * @param {string} type - Tipo de onda (sine, square, triangle, sawtooth)
   * @returns {AudioBuffer|null}
   */
  generateAudioBuffer(frequency, duration, type = 'sine') {
    if (!this.isInitialized || !this.audioContext) {
      return null
    }

    try {
      const sampleRate = this.audioContext.sampleRate
      const length = sampleRate * duration
      const buffer = this.audioContext.createBuffer(1, length, sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        let value = 0

        switch (type) {
          case 'sine':
            value = Math.sin(2 * Math.PI * frequency * t)
            break
          case 'square':
            value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
            break
          case 'triangle':
            value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
            break
          case 'sawtooth':
            value = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
            break
        }

        // Aplicar envelope para evitar cliques
        const envelope = Math.exp(-t * 3)
        data[i] = value * envelope * this.volume
      }

      return buffer
    } catch (error) {
      console.error('Erro ao gerar buffer de áudio:', error)
      return null
    }
  }

  /**
   * Reproduz um som gerado
   * @param {number} frequency - Frequência em Hz
   * @param {number} duration - Duração em segundos
   * @param {string} type - Tipo de onda
   */
  async playSound(frequency = 440, duration = 0.2, type = 'sine') {
    if (!this.isInitialized || this.muted || !this.audioContext) {
      return
    }

    try {
      // Resume o contexto se necessário
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      const buffer = this.generateAudioBuffer(frequency, duration, type)
      if (!buffer) return

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Configurar volume
      gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)

      // Tocar o som
      source.start()

      // Limpar após tocar
      setTimeout(
        () => {
          try {
            source.disconnect()
            gainNode.disconnect()
          } catch (e) {
            // Som já foi limpo
          }
        },
        duration * 1000 + 100
      )
    } catch (error) {
      console.error('Erro ao reproduzir som:', error)
    }
  }

  /**
   * Gera um tom específico
   * @param {number} frequency - Frequência
   * @param {number} duration - Duração
   */
  generateTone(frequency, duration = 0.2) {
    return this.playSound(frequency, duration, 'sine')
  }

  /**
   * Cria uma sequência de sons
   * @param {Array} sequence - Array de objetos {frequency, duration, delay}
   */
  async createSequence(sequence) {
    if (!Array.isArray(sequence)) return

    for (let i = 0; i < sequence.length; i++) {
      const { frequency, duration = 0.2, delay = 0 } = sequence[i]

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      await this.playSound(frequency, duration)

      // Aguardar duração do som antes do próximo
      await new Promise((resolve) => setTimeout(resolve, duration * 1000))
    }
  }

  /**
   * Sons predefinidos para jogos
   */
  playClickSound() {
    this.playSound(800, 0.1, 'sine')
  }

  playSuccessSound() {
    this.createSequence([
      { frequency: 523, duration: 0.2 }, // C5
      { frequency: 659, duration: 0.2 }, // E5
      { frequency: 784, duration: 0.3 }, // G5
    ])
  }

  playErrorSound() {
    this.playSound(200, 0.3, 'square')
  }

  playNotificationSound() {
    this.createSequence([
      { frequency: 880, duration: 0.1 },
      { frequency: 1174, duration: 0.1, delay: 50 },
    ])
  }

  playGameOverSound() {
    this.createSequence([
      { frequency: 659, duration: 0.2 },
      { frequency: 622, duration: 0.2 },
      { frequency: 587, duration: 0.2 },
      { frequency: 554, duration: 0.4 },
    ])
  }

  playLevelUpSound() {
    this.createSequence([
      { frequency: 523, duration: 0.15 }, // C5
      { frequency: 587, duration: 0.15 }, // D5
      { frequency: 659, duration: 0.15 }, // E5
      { frequency: 698, duration: 0.15 }, // F5
      { frequency: 784, duration: 0.3 }, // G5
    ])
  }

  /**
   * Define o volume geral
   * @param {number} volume - Volume de 0 a 1
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Alterna modo mudo
   * @param {boolean} muted - Se deve ficar mudo
   */
  setMuted(muted) {
    this.muted = muted
  }

  /**
   * Obtém status do gerador
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      volume: this.volume,
      muted: this.muted,
      contextState: this.audioContext?.state || 'not-available',
    }
  }

  /**
   * Limpa recursos
   */
  dispose() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
    }
    this.sounds.clear()
    this.isInitialized = false
  }
}

// Exporta instância singleton
export const audioGenerator = new AudioGenerator()

// Definição de tipos de sons disponíveis no sistema
export const SOUNDS = {
  SUCCESS: 'success',
  ERROR: 'error',
  NOTIFICATION: 'notification',
  ACHIEVEMENT: 'achievement',
  CLICK: 'click',
  TRANSITION: 'transition',
  REWARD: 'reward',
  ALERT: 'alert',
  COMPLETE: 'complete'
}

/**
 * Função helper para tocar um som gerado
 * @param {string} soundType - Tipo de som a ser tocado
 * @param {Object} options - Opções adicionais
 * @returns {Promise<boolean>} - Sucesso da operação
 */
export const playGeneratedSound = (soundType, options = {}) => {
  // Usar a instância singleton do gerador de áudio
  if (!audioGenerator || !audioGenerator.isInitialized) {
    console.warn('AudioGenerator não está inicializado')
    return Promise.resolve(false)
  }
  
  try {
    // Mapear tipo de som para parâmetros específicos
    let params = {}
    
    switch (soundType) {
      case SOUNDS.SUCCESS:
        params = { frequency: 880, duration: 0.3, type: 'sine' }
        break
      case SOUNDS.ERROR:
        params = { frequency: 220, duration: 0.5, type: 'square' }
        break
      case SOUNDS.NOTIFICATION:
        params = { frequency: 660, duration: 0.2, type: 'sine' }
        break
      default:
        params = { frequency: 440, duration: 0.3, type: 'sine' }
    }
    
    // Aplicar opções personalizadas
    const mergedParams = { ...params, ...options }
    
    // Gerar e tocar o som
    return audioGenerator.playSound(
      mergedParams.frequency,
      mergedParams.duration,
      mergedParams.type,
      mergedParams.volume
    )
  } catch (err) {
    console.error('Erro ao tocar som:', err)
    return Promise.resolve(false)
  }
}

// Exportações adicionais
export { AudioGenerator }
export default audioGenerator
